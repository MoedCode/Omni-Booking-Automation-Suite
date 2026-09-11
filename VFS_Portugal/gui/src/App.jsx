/* gui/src/App.jsx */
import { useState, useEffect } from 'react';
import './theme.css';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export default function App() {
    const [instances, setInstances] = useState([]);
    const [sheetUrl, setSheetUrl] = useState('');
    
    // Global Headless Default (Defaults to true)
    const [defaultHeadless, setDefaultHeadless] = useState(true);
    
    // Theme State ('dark' | 'light')
    const [theme, setTheme] = useState('dark');

    // Modal State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.onBotStatusUpdate(({ id, status }) => {
                setInstances(prev => prev.map(inst => 
                    inst.id === id ? { ...inst, status: status } : inst
                ));
            });
        }
    }, []);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const handleLocalFile = async () => {
        const data = await window.electronAPI.selectLocalFile();
        if (data && !data.error) {
            const newInstances = data.map(item => ({
                id: generateId(),
                data: item,
                headless: defaultHeadless, // Inherits default headless state
                status: 'Idle',
                selected: false
            }));
            setInstances(prev => [...prev, ...newInstances]);
        } else if (data?.error) alert(data.error);
    };

    const handleGoogleSheet = async () => {
        const data = await window.electronAPI.fetchGoogleSheet(sheetUrl);
        if (data && !data.error) {
            const newInstances = data.map(item => ({
                id: generateId(),
                data: item,
                headless: defaultHeadless,
                status: 'Idle',
                selected: false
            }));
            setInstances(prev => [...prev, ...newInstances]);
            setSheetUrl('');
        }
    };

    const handleManualAdd = () => {
        setEditingId('NEW');
        setEditForm({
            account: '',
            password: '',
            country: '',
            city: '',
            appointmentCategory: '',
            subCategory: '',
            headless: defaultHeadless
        });
    };

    const toggleSelect = (id) => setInstances(prev => prev.map(inst => inst.id === id ? { ...inst, selected: !inst.selected } : inst));
    const toggleSelectAll = (e) => setInstances(prev => prev.map(inst => ({ ...inst, selected: e.target.checked })));

    const launchBots = (ids) => {
        const toLaunch = instances.filter(i => ids.includes(i.id));
        window.electronAPI.launchBots(toLaunch);
        setInstances(prev => prev.map(inst => ids.includes(inst.id) ? { ...inst, status: 'Launching...' } : inst));
    };

    const closeBots = (ids) => window.electronAPI.closeBots(ids);
    const deleteBots = (ids) => {
        closeBots(ids);
        setInstances(prev => prev.filter(inst => !ids.includes(inst.id)));
    };

    const selectedIds = instances.filter(i => i.selected).map(i => i.id);

    const startEdit = (inst) => {
        setEditingId(inst.id);
        setEditForm({ ...inst.data, headless: inst.headless ?? true });
    };
    
    const saveEdit = () => {
        if (!editForm.account) return alert("Account email is required");
        const { headless, ...dataFields } = editForm;

        if (editingId === 'NEW') {
            const newInst = {
                id: generateId(),
                data: dataFields,
                headless: headless,
                status: 'Idle',
                selected: false
            };
            setInstances(prev => [...prev, newInst]);
        } else {
            setInstances(prev => prev.map(inst => 
                inst.id === editingId ? { ...inst, data: dataFields, headless: headless } : inst
            ));
        }
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const copyInstanceData = (data) => {
        const text = `Account: ${data.account}\nPassword: ${data.password}\nCountry: ${data.country}\nCity: ${data.city}\nCategory: ${data.appointmentCategory}\nSub-category: ${data.subCategory}`;
        navigator.clipboard.writeText(text);
    };

    const copyStatus = (status) => navigator.clipboard.writeText(status);

    return (
        <div className={`app-container ${theme}-theme`}>
            <header className="header-panel">
                <div className="import-controls">
                    <button className="btn-add" onClick={handleManualAdd}>+ Add Account</button>
                    <button className="btn-outline" onClick={handleLocalFile}>📁 Browse Files...</button>
                    
                    <div className="sheet-fetcher">
                        <input 
                            type="text" 
                            placeholder="Google Sheet URL" 
                            value={sheetUrl} 
                            onChange={e => setSheetUrl(e.target.value)} 
                        />
                        <button className="btn-outline" onClick={handleGoogleSheet}>Fetch Cloud Sheet</button>
                    </div>

                    {/* Global Headless Switch */}
                    <div className="toggle-wrapper" title="Default headless setting for new instances">
                        <span className="toggle-title">Default Headless</span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={defaultHeadless} 
                                onChange={e => setDefaultHeadless(e.target.checked)} 
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    {/* Dark/Light Theme Button */}
                    <button className="btn-outline theme-toggle-btn" onClick={toggleTheme}>
                        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                    </button>
                </div>
            </header>

            <div className="bulk-actions">
                <button className="btn-launch" disabled={selectedIds.length === 0} onClick={() => launchBots(selectedIds)}>Launch Selected</button>
                <button className="btn-close" disabled={selectedIds.length === 0} onClick={() => closeBots(selectedIds)}>Close Selected</button>
                <button className="btn-delete" disabled={selectedIds.length === 0} onClick={() => deleteBots(selectedIds)}>Delete Selected</button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th width="40px"><input type="checkbox" onChange={toggleSelectAll} checked={instances.length > 0 && selectedIds.length === instances.length} /></th>
                            <th width="40px">#</th>
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
                                <td>
                                    <div className="flex-row-copy">
                                        <span>{inst.data.account}</span>
                                        <button className="copy-btn" onClick={(e) => { e.stopPropagation(); copyInstanceData(inst.data); }} title="Copy Instance Data">📋</button>
                                    </div>
                                </td>
                                <td>{inst.data.country || '-'}</td>
                                <td>{inst.data.city || '-'}</td>
                                <td>{inst.data.appointmentCategory || '-'}</td>
                                <td>
                                    <span className={`badge ${inst.headless ? 'badge-headless' : 'badge-headed'}`}>
                                        {inst.headless ? 'Headless' : 'Headed'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex-row-copy">
                                        <span className="status-text" title={inst.status}>{inst.status}</span>
                                        <button className="copy-btn" onClick={(e) => { e.stopPropagation(); copyStatus(inst.status); }} title="Copy Operational State">📋</button>
                                    </div>
                                </td>
                                <td className="action-cells">
                                    <button className="btn-sm btn-launch" onClick={(e) => { e.stopPropagation(); launchBots([inst.id]); }}>Launch</button>
                                    <button className="btn-sm btn-close" onClick={(e) => { e.stopPropagation(); closeBots([inst.id]); }}>Close</button>
                                    <button className="btn-sm btn-delete" onClick={(e) => { e.stopPropagation(); deleteBots([inst.id]); }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit / Add Modal */}
            {editingId && (
                <div className="modal-overlay" onClick={cancelEdit}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingId === 'NEW' ? 'Add New Instance' : 'Edit Instance'}</h3>
                            
                            {/* Instance Headless Switch */}
                            <div className="toggle-wrapper">
                                <span className="toggle-title">Headless</span>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        checked={editForm.headless} 
                                        onChange={e => setEditForm({...editForm, headless: e.target.checked})} 
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Account Email</label>
                                <input type="text" value={editForm.account} onChange={e => setEditForm({...editForm, account: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="text" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input type="text" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Appointment Category</label>
                                <input type="text" value={editForm.appointmentCategory} onChange={e => setEditForm({...editForm, appointmentCategory: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Sub Category</label>
                                <input type="text" value={editForm.subCategory} onChange={e => setEditForm({...editForm, subCategory: e.target.value})} />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-outline" onClick={cancelEdit}>Cancel</button>
                            <button className="btn-launch" onClick={saveEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}