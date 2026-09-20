/* gui/src/App.jsx */
import { useState, useEffect } from 'react';
import './theme.css';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const YallaVisaLogo = () => (
    <svg viewBox="0 0 380 50" height="40" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(0, 0) scale(0.45)">
            <circle cx="50" cy="40" r="35" fill="#0284c7" />
            <path d="M 25 25 C 40 10, 60 10, 75 25 C 65 40, 35 40, 25 25 Z" fill="#bae6fd" opacity="0.3"/>
            <path d="M 15 50 Q 50 80 90 25" fill="none" stroke="#ea580c" strokeWidth="5" strokeLinecap="round"/>
            <path d="M 10 60 Q 55 90 100 35" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
            <path d="M 75 15 L 90 5 L 95 15 L 115 15 L 105 25 L 115 45 L 100 35 L 85 45 L 80 25 Z" fill="#f59e0b"/>
        </g>
        <text x="60" y="28" fontFamily="'Segoe UI', Tahoma, sans-serif" fontWeight="900" fontSize="22" fill="#0284c7" letterSpacing="1">
            YALLA <tspan fill="#ea580c">VISA</tspan>
        </text>
        <text x="62" y="42" fontFamily="'Segoe UI', Tahoma, sans-serif" fontWeight="700" fontSize="8" fill="#64748b" letterSpacing="1.2">
            YOUR WAY TO DISCOVER THE WORLD
        </text>
    </svg>
);

export default function App() {
    const [instances, setInstances] = useState([]);
    const [sheetUrl, setSheetUrl] = useState('');
    const [defaultHeadless, setDefaultHeadless] = useState(true);
    const [theme, setTheme] = useState('dark');
    const [isMaximized, setIsMaximized] = useState(false);
    
    // UI state for flashing URL bar
    const [isUrlInvalid, setIsUrlInvalid] = useState(false);

    const [globalDefaults, setGlobalDefaults] = useState({
        country: 'Egypt',
        city: 'Alexandria',
        appointmentCategory: 'Short Term Visa',
        subCategory: 'Tourism'
    });
    
    const [showDefaultsModal, setShowDefaultsModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null); 
    const [pendingImport, setPendingImport] = useState(null); 
    const [appCloseWarning, setAppCloseWarning] = useState(null); 
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.onBotStatusUpdate(({ id, status }) => {
                setInstances(prev => prev.map(inst => inst.id === id ? { ...inst, status: status } : inst));
            });
            window.electronAPI.onAppointmentResult(({ id, result }) => {
                setInstances(prev => prev.map(inst => inst.id === id ? { ...inst, aptStatus: result } : inst));
            });
            if (window.electronAPI.onWindowMaximizeChange) {
                window.electronAPI.onWindowMaximizeChange((state) => setIsMaximized(state));
            }
        }
    }, []);

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

    const handleWindowAction = (action) => {
        if (window.electronAPI && window.electronAPI.windowControl) {
            window.electronAPI.windowControl(action);
        }
    };

    const requestAppClose = () => {
        const runningBots = instances.filter(i => i.status !== 'Idle' && i.status !== 'Closed' && !i.status.toLowerCase().includes('error'));
        const headlessCount = runningBots.filter(i => i.headless).length;
        const visibleCount = runningBots.filter(i => !i.headless).length;
        
        setAppCloseWarning({ 
            headless: headlessCount, 
            visible: visibleCount,
            totalRunning: runningBots.length,
            totalAccounts: instances.length
        });
    };

    const processImport = (data) => {
        const existingAccounts = new Set(instances.map(i => i.data.account));
        let duplicates = 0;
        let newAccounts = 0;

        const parsedData = data.map(item => {
            if (existingAccounts.has(item.account)) duplicates++;
            else newAccounts++;

            return {
                id: generateId(),
                data: { ...globalDefaults, ...item },
                headless: defaultHeadless,
                status: 'Idle',
                aptStatus: 'idle', 
                selected: false
            };
        });

        if (instances.length > 0 && duplicates > 0) {
            setPendingImport({ total: data.length, duplicates, newAccounts, parsedData });
        } else {
            setInstances(prev => [...prev, ...parsedData]);
        }
    };

    const handleLocalFile = async () => {
        const data = await window.electronAPI.selectLocalFile();
        if (data && !data.error) {
            processImport(data);
        } else if (data?.error) {
            setErrorMessage(data.error);
        }
    };

    const handleGoogleSheet = async () => {
        // Stop execution and trigger CSS shake if input is empty or only spaces
        if (!sheetUrl || sheetUrl.trim() === '') {
            setIsUrlInvalid(true);
            setTimeout(() => setIsUrlInvalid(false), 500);
            return; 
        }
        
        const data = await window.electronAPI.fetchGoogleSheet(sheetUrl);
        
        if (data && !data.error) {
            processImport(data);
            setSheetUrl('');
        } else if (data?.error) {
            setErrorMessage(data.error); 
        }
    };

    const resolveImport = (strategy) => {
        if (!pendingImport) return;
        let finalInstances = [...instances];
        const imported = pendingImport.parsedData;

        if (strategy === 'ignore') {
            const existingAccounts = new Set(instances.map(i => i.data.account));
            const uniqueNew = imported.filter(i => !existingAccounts.has(i.data.account));
            finalInstances = [...finalInstances, ...uniqueNew];
        } else if (strategy === 'replace') {
            const newAccountsMap = new Map(imported.map(i => [i.data.account, i]));
            finalInstances = finalInstances.filter(i => !newAccountsMap.has(i.data.account));
            finalInstances = [...finalInstances, ...imported];
        } else if (strategy === 'all') {
            finalInstances = [...finalInstances, ...imported];
        }

        setInstances(finalInstances);
        setPendingImport(null);
    };

    const handleManualAdd = () => {
        setEditingId('NEW');
        setEditForm({ account: '', password: '', ...globalDefaults, headless: defaultHeadless });
    };

    const toggleSelect = (id) => setInstances(prev => prev.map(inst => inst.id === id ? { ...inst, selected: !inst.selected } : inst));
    const toggleSelectAll = (e) => setInstances(prev => prev.map(inst => ({ ...inst, selected: e.target.checked })));

    const fastToggleHeadless = (id, e) => {
        e.stopPropagation();
        setInstances(prev => prev.map(inst => inst.id === id ? { ...inst, headless: !inst.headless } : inst));
    };

    const launchBots = (ids) => {
        const toLaunch = instances.filter(i => ids.includes(i.id));
        window.electronAPI.launchBots(toLaunch);
        setInstances(prev => prev.map(inst => ids.includes(inst.id) ? { ...inst, status: 'Launching...', aptStatus: 'checking' } : inst));
    };

    const closeBots = (ids) => window.electronAPI.closeBots(ids);
    const confirmDelete = (ids) => setDeleteConfirm(ids);
    const executeDelete = () => {
        if (deleteConfirm) {
            closeBots(deleteConfirm);
            setInstances(prev => prev.filter(inst => !deleteConfirm.includes(inst.id)));
            setDeleteConfirm(null);
        }
    };

    const selectedIds = instances.filter(i => i.selected).map(i => i.id);

    const startEdit = (inst) => {
        setEditingId(inst.id);
        setEditForm({ ...inst.data, headless: inst.headless ?? true });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };
    
    const saveEdit = () => {
        if (!editForm.account) return setErrorMessage("Account email is required.");
        
        const { headless, ...dataFields } = editForm;

        if (editingId === 'NEW') {
            setInstances(prev => [...prev, { id: generateId(), data: dataFields, headless, status: 'Idle', aptStatus: 'idle', selected: false }]);
        } else {
            setInstances(prev => prev.map(inst => inst.id === editingId ? { ...inst, data: dataFields, headless } : inst));
        }
        setEditingId(null);
    };

    const copyInstanceData = (data) => {
        navigator.clipboard.writeText(`Account: ${data.account}\nPassword: ${data.password}\nCountry: ${data.country}\nCity: ${data.city}\nCategory: ${data.appointmentCategory}\nSub-category: ${data.subCategory}`);
    };

    return (
        <div className={`app-container ${theme}-theme`}>
            
            {/* Custom Linux Style Draggable Titlebar */}
            <div className="custom-titlebar">
                <div className="titlebar-controls">
                    <button className="win-btn win-min linux-btn" onClick={() => handleWindowAction('minimize')} title="Minimize Window">
                        <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6h8v1H2z" fill="currentColor"/></svg>
                    </button>
                    
                    <button className="win-btn win-max linux-btn" onClick={() => handleWindowAction('maximize')} title="Maximize/Restore Window">
                        {isMaximized ? (
                            <svg width="10" height="10" viewBox="0 0 11 11">
                                <path d="M2.5 2.5h5v5h-5z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M4 1.5h5v5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                        ) : (
                            <svg width="10" height="10" viewBox="0 0 11 11">
                                <path d="M1.5 1.5h8v8h-8z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                        )}
                    </button>

                    <button className="win-btn win-close linux-btn" onClick={requestAppClose} title="Close Application">
                        <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                </div>
            </div>

            <header className="header-panel">
                <div className="header-left">
                    <button className="btn-outline btn-compact" onClick={handleLocalFile} title="Browse your computer to upload a local Excel or CSV file.">Browse</button>
                    <div className="sheet-fetcher">
                        {/* URL input mapped to the isUrlInvalid state to trigger the CSS shake animation */}
                        <input 
                            type="text" 
                            placeholder="Google Sheet URL" 
                            value={sheetUrl} 
                            onChange={e => setSheetUrl(e.target.value)} 
                            className={`url-bar ${isUrlInvalid ? 'input-error-shake' : ''}`} 
                        />
                        <button className="btn-outline btn-compact" onClick={handleGoogleSheet} title="Fetch account configurations directly from a published Google Sheet.">Fetch</button>
                    </div>
                </div>

                <div className="header-center">
                    <YallaVisaLogo />
                </div>

                <div className="header-right"></div>
            </header>

            <div className="inner-workspace">
                <div className="toolbar">
                    <div className="toolbar-left">
                        <button className="btn-launch" disabled={selectedIds.length === 0} onClick={() => launchBots(selectedIds)}>Launch</button>
                        <button className="btn-close" disabled={selectedIds.length === 0} onClick={() => closeBots(selectedIds)}>Close</button>
                        <button className="btn-delete" disabled={selectedIds.length === 0} onClick={() => confirmDelete(selectedIds)}>Delete</button>
                    </div>
                    
                    <div className="toolbar-right">
                        <button className="btn-add" onClick={handleManualAdd}>+ Add Account</button>
                        <button className="btn-outline" onClick={() => setShowDefaultsModal(true)}>⚙️ Defaults</button>
                        <div className="toggle-wrapper" title="Default headless setting for new instances">
                            <span className="toggle-title">Default Headless</span>
                            <label className="switch">
                                <input type="checkbox" checked={defaultHeadless} onChange={e => setDefaultHeadless(e.target.checked)} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <button className="btn-outline theme-toggle-btn" onClick={toggleTheme}>
                            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th width="40px"><input type="checkbox" onChange={toggleSelectAll} checked={instances.length > 0 && selectedIds.length === instances.length} /></th>
                                <th width="40px">#</th>
                                <th width="30px" title="Availability Status">🎯</th>
                                <th width="240px">Target Account</th>
                                <th>Country</th>
                                <th>Target City</th>
                                <th>Category</th>
                                <th width="100px">Mode</th>
                                <th>Operational State</th>
                                <th width="240px" style={{textAlign:'center'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instances.map((inst, index) => (
                                <tr key={inst.id} onDoubleClick={() => startEdit(inst)} className={inst.selected ? 'selected-row' : ''}>
                                    <td><input type="checkbox" checked={inst.selected} onChange={() => toggleSelect(inst.id)} /></td>
                                    <td>{index + 1}</td>
                                    <td><div className={`status-dot ${inst.aptStatus}`} title={`Status: ${inst.aptStatus}`}></div></td>
                                    <td>
                                        <div className="flex-row-copy">
                                            <span>{inst.data.account}</span>
                                            <button className="copy-btn" onClick={(e) => { e.stopPropagation(); copyInstanceData(inst.data); }} title="Copy Data">📋</button>
                                        </div>
                                    </td>
                                    <td>{inst.data.country || '-'}</td>
                                    <td>{inst.data.city || '-'}</td>
                                    <td>{inst.data.appointmentCategory || '-'}</td>
                                    <td>
                                        <span 
                                            className={`badge cursor-pointer ${inst.headless ? 'badge-headless' : 'badge-visible'}`}
                                            onClick={(e) => fastToggleHeadless(inst.id, e)}
                                            title="Click to instantly toggle execution mode"
                                        >
                                            {inst.headless ? 'Headless' : 'Visible'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex-row-copy">
                                            <span className="status-text" title={inst.status}>{inst.status}</span>
                                            <button className="copy-btn" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(inst.status); }} title="Copy Log">📋</button>
                                        </div>
                                    </td>
                                    <td className="action-cells">
                                        <button className="btn-sm btn-launch" onClick={(e) => { e.stopPropagation(); launchBots([inst.id]); }}>Launch</button>
                                        <button className="btn-sm btn-close" onClick={(e) => { e.stopPropagation(); closeBots([inst.id]); }}>Close</button>
                                        <button className="btn-sm btn-delete" onClick={(e) => { e.stopPropagation(); confirmDelete([inst.id]); }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Error Modal (Replaces Native alert) */}
            {errorMessage && (
                <div className="modal-overlay" onClick={() => setErrorMessage(null)}>
                    <div className="modal-content danger-modal relative" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-x" onClick={() => setErrorMessage(null)}>✕</button>
                        <h3>⚠️ Error</h3>
                        <p style={{marginTop: '10px', marginBottom: '20px', lineHeight: '1.5', wordBreak: 'break-word'}}>
                            {errorMessage}
                        </p>
                        <div className="modal-actions">
                            <button className="btn-outline" onClick={() => setErrorMessage(null)}>OK</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Application Close Warning */}
            {appCloseWarning && (
                <div className="modal-overlay">
                    <div className="modal-content danger-modal relative">
                        <button className="modal-close-x" onClick={() => setAppCloseWarning(null)}>✕</button>
                        <h3>⚠️ Confirm Exit</h3>
                        <p style={{marginTop: '10px', marginBottom: '20px', lineHeight: '1.5'}}>
                            Are you sure you want to close the application? All active processes will be immediately terminated.
                            <br/><br/>
                            • <strong>{appCloseWarning.totalRunning}</strong> active instance(s) running ({appCloseWarning.headless} Headless, {appCloseWarning.visible} Visible).<br/>
                            • <strong>{appCloseWarning.totalAccounts}</strong> total account(s) will be cleared from this session.
                        </p>
                        <div className="modal-actions">
                            <button className="btn-outline" onClick={() => setAppCloseWarning(null)}>Cancel</button>
                            <button className="btn-delete" onClick={() => handleWindowAction('close')}>Yes, Close App</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Record Delete Confirmation */}
            {deleteConfirm && (
                <div className="modal-overlay">
                    <div className={`modal-content relative ${deleteConfirm.length > 1 ? 'danger-modal' : ''}`}>
                        <button className="modal-close-x" onClick={() => setDeleteConfirm(null)}>✕</button>
                        <h3>{deleteConfirm.length > 1 ? '⚠️ Bulk Delete Warning' : 'Confirm Deletion'}</h3>
                        <p style={{marginTop: '10px', marginBottom: '20px', lineHeight: '1.5'}}>
                            Are you sure you want to delete <strong>{deleteConfirm.length}</strong> selected instance(s)? 
                            This will also close any active browsers associated with them.
                        </p>
                        <div className="modal-actions">
                            <button className="btn-outline" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn-delete" onClick={executeDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Smart Import Conflict Resolution */}
            {pendingImport && (
                <div className="modal-overlay">
                    <div className="modal-content relative">
                        <button className="modal-close-x" title="Cancel Import" onClick={() => setPendingImport(null)}>✕</button>
                        <h3>File Import Confirmation</h3>
                        
                        <div className="conflict-stats">
                            <ul>
                                <li><strong>{pendingImport.total}</strong> total accounts detected in the file.</li>
                                {pendingImport.duplicates > 0 && <li><strong>{pendingImport.duplicates}</strong> redundant account(s) already exist in your table.</li>}
                                <li><strong>{pendingImport.newAccounts}</strong> brand new account(s) detected.</li>
                            </ul>
                        </div>

                        {pendingImport.duplicates > 0 ? (
                            <div className="modal-actions-col">
                                <button className="btn-launch" title="Only adds the new accounts and ignores the ones that are already in the table." onClick={() => resolveImport('ignore')}>
                                    Ignore Duplicates
                                </button>
                                <button className="btn-close" title="Overwrites the existing matching accounts with the new data from the file." onClick={() => resolveImport('replace')}>
                                    Replace Duplicates
                                </button>
                                <button className="btn-outline" title="Adds everything from the file, even if it creates duplicate entries in the table." onClick={() => resolveImport('all')}>
                                    Add All Unconditionally
                                </button>
                            </div>
                        ) : (
                            <div className="modal-actions">
                                <button className="btn-launch" title="Adds all the new accounts to your workspace." onClick={() => resolveImport('all')}>Confirm Import</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Defaults Modal */}
            {showDefaultsModal && (
                <div className="modal-overlay" onClick={() => setShowDefaultsModal(false)}>
                    <div className="modal-content relative" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-x" onClick={() => setShowDefaultsModal(false)}>✕</button>
                        <div className="modal-header"><h3>Global Defaults Config</h3></div>
                        <div className="form-grid">
                            <div className="form-group"><label>Default Country</label><input type="text" value={globalDefaults.country} onChange={e => setGlobalDefaults({...globalDefaults, country: e.target.value})} /></div>
                            <div className="form-group"><label>Default City</label><input type="text" value={globalDefaults.city} onChange={e => setGlobalDefaults({...globalDefaults, city: e.target.value})} /></div>
                            <div className="form-group"><label>Default Appointment Category</label><input type="text" value={globalDefaults.appointmentCategory} onChange={e => setGlobalDefaults({...globalDefaults, appointmentCategory: e.target.value})} /></div>
                            <div className="form-group"><label>Default Sub Category</label><input type="text" value={globalDefaults.subCategory} onChange={e => setGlobalDefaults({...globalDefaults, subCategory: e.target.value})} /></div>
                        </div>
                        <div className="modal-actions"><button className="btn-launch" onClick={() => setShowDefaultsModal(false)}>Done</button></div>
                    </div>
                </div>
            )}

            {/* Editor Modal */}
            {editingId && (
                <div className="modal-overlay" onClick={cancelEdit}>
                    <div className="modal-content relative" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-x" onClick={cancelEdit}>✕</button>
                        <div className="modal-header">
                            <h3>{editingId === 'NEW' ? 'Hot Batch New' : `${editForm.account || 'Account'} Hot Batch`}</h3>
                            <div className="toggle-wrapper" style={{ marginRight: '35px' }}>
                                <span className="toggle-title">Headless</span>
                                <label className="switch">
                                    <input type="checkbox" checked={editForm.headless} onChange={e => setEditForm({...editForm, headless: e.target.checked})} />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                        <div className="form-grid">
                            <div className="form-group"><label>Account Email</label><input type="text" value={editForm.account} onChange={e => setEditForm({...editForm, account: e.target.value})} /></div>
                            <div className="form-group"><label>Password</label><input type="text" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} /></div>
                            <div className="form-group"><label>Country</label><input type="text" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} /></div>
                            <div className="form-group"><label>City</label><input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} /></div>
                            <div className="form-group"><label>Appointment Category</label><input type="text" value={editForm.appointmentCategory} onChange={e => setEditForm({...editForm, appointmentCategory: e.target.value})} /></div>
                            <div className="form-group"><label>Sub Category</label><input type="text" value={editForm.subCategory} onChange={e => setEditForm({...editForm, subCategory: e.target.value})} /></div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-launch" onClick={saveEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}