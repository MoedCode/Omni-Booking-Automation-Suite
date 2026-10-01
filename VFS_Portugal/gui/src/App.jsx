/* gui/src/App.jsx */
import { useState, useEffect } from 'react';
import './theme.css';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const parseDelayStr = (str) => {
    const parts = (str || "00/00/05/00").split(/[\/\-:]/).map(n => parseInt(n, 10) || 0);
    return { d: parts[0] || 0, h: parts[1] || 0, m: parts[2] || 0, s: parts[3] || 0 };
};

const formatDelayStr = ({ d, h, m, s }) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d)}/${pad(h)}/${pad(m)}/${pad(s)}`;
};

const isDateValid = (val) => {
    if (!val) return false;
    return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(val.trim());
};

const NATIONALITIES = [
    "AFGHANISTAN", "ALBANIA", "ALGERIA", "ANGOLA", "ANGUILLA", "ANTIGUA AND BARBUDA", "ARGENTINA", 
    "ARMENIA", "ARUBA", "AUSTRALIA", "AUSTRIA", "AZERBAIJAN", "BAHAMAS", "BAHRAIN", "BANGLADESH", 
    "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BENIN (DAHOMEY)", "BERMUDA", "BHUTAN", 
    "BOLIVIA", "BOSNIA AND HERZEGOVINA", "BOTSWANA", "BRAZIL", "BRITISH VIRGIN ISLANDS", "BRUNEI DARUSSALAM", 
    "BULGARIA", "BURKINA FASO", "BURKINA FASO (UPPER VOLTA)", "BURUNDI", "CAMBODIA", "CAMBODIA (KAMPUCHEA)", 
    "CAMEROON", "CANADA", "CAPE VERDE", "CAYMAN ISLANDS", "CENTRAL AFRICAN REPUBLIC", "CHAD", "CHILE", 
    "CHINA", "CHRISTMAS ISLAND", "COCOS (KEELING) ISLANDS", "COLOMBIA", "COMOROS", "CONGO", "COOK ISLANDS", 
    "COSTA RICA", "COTE D'IVOIRE", "CROATIA", "CROTIA", "CUBA", "CYPRUS", "CZECH REPUBLIC", "DEMOCRATIC REPUBLIC OF CONGO", 
    "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR", "EQUATORIAL GUINEA", 
    "ERITREA", "ESTONIA", "ETHIOPIA", "Express service", "FALKLAND ISLANDS", "FAROE ISLANDS", "FIJI", "FINLAND", 
    "FINLAND RESIDENCE PERMIT", "FRANCE", "GABON", "GAMBIA", "GEORGIA", "GERMANY", "GHANA", "GIBRALTAR", "GREECE", 
    "GREENLAND", "GRENADA", "GUATEMALA", "GUINEA", "GUINEA-BISSAU", "GUYANA", "HAITI", "HOLY SEE", "HONDURAS", 
    "HONG KONG", "HUNGARY", "Hong Kong BNO", "Hong Kong SAR", "ICELAND", "INDIA", "INDONESIA", "IRAN", "IRAQ", 
    "IRELAND", "ISRAEL", "ITALY", "IVORY COAST", "JAMAICA", "JAPAN", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", 
    "KOREA, DEMOCRATIC PEOPLES REP", "KOSOVO", "KUWAIT", "KYRGYZSTAN", "LAOS", "LATVIA", "LEBANON", "LESOTHO", 
    "LIBERIA", "LIBYA", "LIBYAN ARAB JAMAHIRIYA", "LIECHTENSTEIN", "LITHUANIA", "LITHUANIA RESIDENCE PERMIT", 
    "LUXEMBOURG", "MACAU", "MACEDONIA", "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVES", "MALI", "MALTA", 
    "MARSHALL ISLANDS", "MAURITANIA", "MAURITIUS", "MEXICO", "MICRONESIA", "MOLDOVA", "MONACO", "MONGOLIA", 
    "MONTENEGRO", "MONTSERRAT", "MOROCCO", "MOZAMBIQUE", "MYANMAR, BURMA", "Macao Travel Permit", "Malta", 
    "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NETHERLANDS ANTILLES", "NEW ZEALAND", "NICARAGUA", "NIGER", 
    "NIGERIA", "NORWAY", "National service", "OMAN", "PAKISTAN", "PALAU", "PALESTINE", "PANAMA", "PAPUA NEW GUINEA", 
    "PARAGUAY", "PERU", "PHILIPPINES", "PITCAIRN ISLAND", "POLAND", "PORTUGAL", "QATAR", "REPUBLIC OF KOREA", 
    "REPUBLIC OF MACEDONIA", "REPUBLIC OF MOLDOVA", "REPUBLIC OF MONTENEGRO", "REPUBLIC OF SERBIA", "ROMANIA", 
    "RUSSIAN FEDERATION", "RWANDA", "SAINT KITTS AND NEVIS", "SAINT LUCIA", "SAINT VINCENT AND THE GRENADINES", 
    "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SEYCHELLES", "SIERRA LEONE", 
    "SINGAPORE", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH KOREA", "SOUTH SUDAN", 
    "SPAIN", "SRI LANKA", "STATELESS", "SUDAN", "SURINAM", "SURINAME", "SWAZILAND", "SWEDEN", "SWITZERLAND", "SYRIA", 
    "SYRIAN ARAB REPUBLIC", "St. KITTS & NEVIS", "Syria, Syrian Arab Republic", "TAIWAN", "TAJIKISTAN", "TANZANIA", 
    "THAILAND", "TIBET", "TIMOR-LESTE (EAST TIMOR)", "TOGO", "TONGA", "TRINIDAD AND TOBAGO", "TUNISIA", "TURKMENISTAN", 
    "TURKS AND CAICOS ISLANDS", "TUVALU", "Turkiye", "UGANDA", "UK BRITISH NATIONAL(OVERSEES)", "UK BRITISH SUBJECT", 
    "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED NATIONS ORGANIZATION", "UNITED STATES", "URUGUAY", 
    "UZBEKISTAN", "VANUATU", "VATICAN CITY", "VENEZUELA", "VIETNAM", "VIRGIN ISLANDS (BRITISH)", "YEMEN", "ZAMBIA", "ZIMBABWE"
];

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
    
    const [isUrlInvalid, setIsUrlInvalid] = useState(false);

    const [globalDefaults, setGlobalDefaults] = useState({
        country: 'Egypt',
        city: 'Alexandria',
        appointmentCategory: 'Short Term Visa',
        subCategory: 'Tourism',
        attempts: 1,
        attemptDelay: '00/00/05/00',
        switches: 1,
        switchDelay: 3000,
        autoClose: true,
        attemptSeparator: 'Refresh Current Page',
        inputMethod: 'fill',
        firstName: '',
        lastName: '',
        gender: 'Male',
        dateOfBirth: '',
        nationality: 'EGYPT',
        passportNumber: '',
        passportExpiry: '',
        dialCode: '20',
        contactNumber: '',
        email: ''
    });
    
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
            window.electronAPI.onAppointmentResult(({ id, result, message }) => {
                if (result === 'error') {
                    setErrorMessage(`Configuration Error: ${message}`);
                    setInstances(prev => prev.map(inst => inst.id === id ? { ...inst, aptStatus: 'unavailable', status: `Error: ${message}` } : inst));
                } else {
                    setInstances(prev => prev.map(inst => inst.id === id ? { ...inst, aptStatus: result } : inst));
                }
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

            let isHeadless = defaultHeadless;
            if (item.mode) {
                const modeStr = item.mode.toString().toLowerCase().trim();
                if (modeStr === 'headless') isHeadless = true;
                else if (modeStr === 'visible') isHeadless = false;
            }

            let isAutoClose = globalDefaults.autoClose;
            if (item.autoClose !== undefined) {
                const acStr = String(item.autoClose).toLowerCase().trim();
                isAutoClose = !(acStr === 'false' || acStr === 'no' || acStr === '0');
            }

            return {
                id: generateId(),
                data: { ...globalDefaults, ...item, autoClose: isAutoClose },
                headless: isHeadless,
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
        if (data && !data.error) processImport(data);
        else if (data?.error) setErrorMessage(data.error);
    };

    const handleExport = async () => {
        if (instances.length === 0) return setErrorMessage("No accounts available to export.");
        const dataToExport = instances.map(inst => ({
            account: inst.data.account,
            password: inst.data.password,
            country: inst.data.country,
            city: inst.data.city,
            appointmentCategory: inst.data.appointmentCategory,
            subCategory: inst.data.subCategory,
            mode: inst.headless ? 'Headless' : 'Visible',
            attempts: inst.data.attempts,
            attemptDelay: inst.data.attemptDelay,
            switches: inst.data.switches,
            switchDelay: inst.data.switchDelay,
            autoClose: inst.data.autoClose,
            attemptSeparator: inst.data.attemptSeparator,
            inputMethod: inst.data.inputMethod || globalDefaults.inputMethod || 'fill',
            firstName: inst.data.firstName,
            lastName: inst.data.lastName,
            gender: inst.data.gender,
            dateOfBirth: inst.data.dateOfBirth,
            nationality: inst.data.nationality,
            passportNumber: inst.data.passportNumber,
            passportExpiry: inst.data.passportExpiry,
            dialCode: inst.data.dialCode,
            contactNumber: inst.data.contactNumber,
            email: inst.data.email
        }));

        const result = await window.electronAPI.exportData(dataToExport);
        if (result?.error) setErrorMessage(result.error);
    };

    const handleGoogleSheet = async () => {
        if (!sheetUrl || sheetUrl.trim() === '') {
            setIsUrlInvalid(true);
            setTimeout(() => setIsUrlInvalid(false), 500);
            return; 
        }
        const data = await window.electronAPI.fetchGoogleSheet(sheetUrl);
        if (data && !data.error) {
            processImport(data);
            setSheetUrl('');
        } else if (data?.error) setErrorMessage(data.error); 
    };

    const resolveImport = (strategy) => {
        if (!pendingImport) return;
        let finalInstances = [...instances];
        const imported = pendingImport.parsedData;
        if (strategy === 'ignore') {
            const existingAccounts = new Set(instances.map(i => i.data.account));
            finalInstances = [...finalInstances, ...imported.filter(i => !existingAccounts.has(i.data.account))];
        } else if (strategy === 'replace') {
            const newAccountsMap = new Map(imported.map(i => [i.data.account, i]));
            finalInstances = [...finalInstances.filter(i => !newAccountsMap.has(i.data.account)), ...imported];
        } else if (strategy === 'all') {
            finalInstances = [...finalInstances, ...imported];
        }
        setInstances(finalInstances);
        setPendingImport(null);
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
        
        if (editForm.dateOfBirth && !isDateValid(editForm.dateOfBirth)) {
            return setErrorMessage("Date of Birth format must be exactly DD/MM/YYYY");
        }
        if (editForm.passportExpiry && !isDateValid(editForm.passportExpiry)) {
            return setErrorMessage("Passport Expiry format must be exactly DD/MM/YYYY");
        }

        const { headless, ...dataFields } = editForm;
        if (editingId === 'NEW') {
            setInstances(prev => [...prev, { id: generateId(), data: dataFields, headless, status: 'Idle', aptStatus: 'idle', selected: false }]);
        } else {
            setInstances(prev => prev.map(inst => inst.id === editingId ? { ...inst, data: dataFields, headless } : inst));
        }
        setEditingId(null);
    };

    return (
        <div className={`app-container ${theme}-theme`}>
            <div className="custom-titlebar">
                <div className="titlebar-controls">
                    <button className="win-btn win-min linux-btn" onClick={() => handleWindowAction('minimize')} title="Minimize Window">
                        <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6h8v1H2z" fill="currentColor"/></svg>
                    </button>
                    <button className="win-btn win-max linux-btn" onClick={() => handleWindowAction('maximize')} title="Maximize/Restore Window">
                        {isMaximized ? (
                            <svg width="10" height="10" viewBox="0 0 11 11"><path d="M2.5 2.5h5v5h-5z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M4 1.5h5v5" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
                        ) : (
                            <svg width="10" height="10" viewBox="0 0 11 11"><path d="M1.5 1.5h8v8h-8z" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
                        )}
                    </button>
                    <button className="win-btn win-close linux-btn" onClick={requestAppClose} title="Close Application">
                        <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                </div>
            </div>

            <header className="header-panel">
                <div className="header-left">
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-outline btn-compact" onClick={handleLocalFile}>Import</button>
                        <button className="btn-outline btn-compact" onClick={handleExport}>Export</button>
                    </div>
                    <div className="sheet-fetcher">
                        <input type="text" placeholder="Google Sheet URL" value={sheetUrl} onChange={e => setSheetUrl(e.target.value)} className={`url-bar ${isUrlInvalid ? 'input-error-shake' : ''}`} />
                        <button className="btn-outline btn-compact" onClick={handleGoogleSheet}>Fetch</button>
                    </div>
                </div>
                <div className="header-center"><YallaVisaLogo /></div>
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
                        <button className="btn-add" onClick={() => { setEditingId('NEW'); setEditForm({ ...globalDefaults, headless: defaultHeadless, account: '', password: '' }); }}>+ Add Account</button>
                        <div className="toggle-wrapper" title="How credentials are typed into the login form">
                            <span className="toggle-title">Login Typing</span>
                            <select value={globalDefaults.inputMethod || 'fill'} onChange={e => setGlobalDefaults({...globalDefaults, inputMethod: e.target.value})}>
                                <option value="fill">Fill (browser)</option>
                                <option value="typing">Typing (keyboard)</option>
                                <option value="paste">Paste (clipboard)</option>
                                <option value="random">Random</option>
                            </select>
                        </div>
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
                                            <button className="copy-btn" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`Account: ${inst.data.account}\nPassword: ${inst.data.password}`); }} title="Copy Data">📋</button>
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

            {/* Error Modal */}
            {errorMessage && (
                <div className="modal-overlay" onClick={() => setErrorMessage(null)}>
                    <div className="modal-content danger-modal relative" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-x" onClick={() => setErrorMessage(null)}>✕</button>
                        <h3>⚠️ Error</h3>
                        <p style={{marginTop: '10px', marginBottom: '20px', lineHeight: '1.5', wordBreak: 'break-word', whiteSpace: 'pre-wrap'}}>{errorMessage}</p>
                        <div className="modal-actions"><button className="btn-outline" onClick={() => setErrorMessage(null)}>OK</button></div>
                    </div>
                </div>
            )}

            {/* Close Warning Modal */}
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

            {/* Delete Verification Modal */}
            {deleteConfirm && (
                <div className="modal-overlay">
                    <div className={`modal-content relative ${deleteConfirm.length > 1 ? 'danger-modal' : ''}`}>
                        <button className="modal-close-x" onClick={() => setDeleteConfirm(null)}>✕</button>
                        <h3>{deleteConfirm.length > 1 ? '⚠ Bulk Delete Warning' : 'Confirm Deletion'}</h3>
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

            {/* Import Conflict Modal */}
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
                                <button className="btn-launch" onClick={() => resolveImport('ignore')}>Ignore Duplicates</button>
                                <button className="btn-close" onClick={() => resolveImport('replace')}>Replace Duplicates</button>
                                <button className="btn-outline" onClick={() => resolveImport('all')}>Add All Unconditionally</button>
                            </div>
                        ) : (
                            <div className="modal-actions">
                                <button className="btn-launch" onClick={() => resolveImport('all')}>Confirm Import</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Editor Modal / Hot-Batch */}
            {editingId && (
                <div className="modal-overlay" onClick={cancelEdit}>
                    <div className="modal-content relative" onClick={e => e.stopPropagation()} style={{ width: '600px' }}>
                        <button className="modal-close-x" onClick={cancelEdit}>✕</button>
                        <div className="modal-header">
                            <h3>{editingId === 'NEW' ? 'New Target Instance' : 'Hot Batch Editor'}</h3>
                            <div className="header-toggles" style={{ display: 'flex', gap: '15px', marginRight: '35px' }}>
                                <div className="toggle-wrapper">
                                    <span className="toggle-title">Auto Close</span>
                                    <label className="switch">
                                        <input type="checkbox" checked={editForm.autoClose} onChange={e => setEditForm({...editForm, autoClose: e.target.checked})} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="toggle-wrapper">
                                    <span className="toggle-title">Headless</span>
                                    <label className="switch">
                                        <input type="checkbox" checked={editForm.headless} onChange={e => setEditForm({...editForm, headless: e.target.checked})} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-grid" style={{ maxHeight: '68vh', overflowY: 'auto', paddingRight: '10px' }}>
                            
                            {/* SECTION 1 */}
                            <div className="section-header">Section 1: Credential</div>
                            <div className="form-group"><label>Account Email</label><input type="text" value={editForm.account} onChange={e => setEditForm({...editForm, account: e.target.value})} /></div>
                            <div className="form-group"><label>Password</label><input type="text" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} /></div>
                            
                            {/* SECTION 2 */}
                            <div className="section-header">Section 2: Application Detailed</div>
                            <div className="form-group"><label>Country</label><input type="text" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} /></div>
                            <div className="form-group"><label>City</label><input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} /></div>
                            <div className="form-group"><label>Appointment Category</label><input type="text" placeholder="e.g. Short Term Visa" value={editForm.appointmentCategory} onChange={e => setEditForm({...editForm, appointmentCategory: e.target.value})} /></div>
                            <div className="form-group"><label>Sub Category</label><input type="text" placeholder="e.g. Tourism" value={editForm.subCategory} onChange={e => setEditForm({...editForm, subCategory: e.target.value})} /></div>

                            {/* SECTION 3 */}
                            <div className="section-header">Section 3: Your Detail Form</div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <div className="form-group" style={{flex: 1}}><label>First Name</label><input type="text" value={editForm.firstName || ''} onChange={e => setEditForm({...editForm, firstName: e.target.value})} /></div>
                                <div className="form-group" style={{flex: 1}}><label>Last Name</label><input type="text" value={editForm.lastName || ''} onChange={e => setEditForm({...editForm, lastName: e.target.value})} /></div>
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Gender</label>
                                    <select value={editForm.gender || 'Male'} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Not Specified">Not Specified</option>
                                        <option value="Others / Transgender">Others / Transgender</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Current Nationality</label>
                                    <select value={editForm.nationality || 'EGYPT'} onChange={e => setEditForm({...editForm, nationality: e.target.value})}>
                                        {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <div className="form-group" style={{flex: 1}}><label>Passport Number</label><input type="text" value={editForm.passportNumber || ''} onChange={e => setEditForm({...editForm, passportNumber: e.target.value})} /></div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Email Address</label>
                                    <input type="text" value={editForm.email || editForm.account || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} />
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Date Of Birth (DD/MM/YYYY)</label>
                                    <input type="text" 
                                        className={!editForm.dateOfBirth ? 'input-invalid' : isDateValid(editForm.dateOfBirth) ? 'input-valid' : 'input-invalid'} 
                                        placeholder="DD/MM/YYYY" 
                                        value={editForm.dateOfBirth || ''} 
                                        onChange={e => setEditForm({...editForm, dateOfBirth: e.target.value})} 
                                    />
                                </div>
                                <div className="form-group" style={{flex: 1}}>
                                    <label>Passport Expiry Date (DD/MM/YYYY)</label>
                                    <input type="text" 
                                        className={!editForm.passportExpiry ? 'input-invalid' : isDateValid(editForm.passportExpiry) ? 'input-valid' : 'input-invalid'} 
                                        placeholder="DD/MM/YYYY" 
                                        value={editForm.passportExpiry || ''} 
                                        onChange={e => setEditForm({...editForm, passportExpiry: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <div className="form-group" style={{width: '90px'}}><label>Dial Code</label><input type="text" value={editForm.dialCode || '20'} onChange={e => setEditForm({...editForm, dialCode: e.target.value})} /></div>
                                <div className="form-group" style={{flex: 1}}><label>Contact Number</label><input type="text" value={editForm.contactNumber || ''} onChange={e => setEditForm({...editForm, contactNumber: e.target.value})} /></div>
                            </div>

                            {/* SECTION 4 */}
                            <div className="section-header">Section 4: Configuration</div>
                            
                            {/* Individual Account Typing Override */}
                            <div className="form-group">
                                <label>Login Typing Override</label>
                                <select value={editForm.inputMethod || 'fill'} onChange={e => setEditForm({...editForm, inputMethod: e.target.value})}>
                                    <option value="fill">Fill (browser)</option>
                                    <option value="typing">Typing (keyboard)</option>
                                    <option value="paste">Paste (clipboard)</option>
                                    <option value="random">Random</option>
                                </select>
                            </div>

                            <div className="form-group"><label>Total Bot Attempts</label><input type="number" min="1" value={editForm.attempts || 1} onChange={e => setEditForm({...editForm, attempts: e.target.value})} /></div>
                            
                            {(() => {
                                const delayObj = parseDelayStr(editForm.attemptDelay);
                                const handleDelayChange = (field, val) => {
                                    const newObj = { ...delayObj, [field]: parseInt(val) || 0 };
                                    setEditForm({ ...editForm, attemptDelay: formatDelayStr(newObj) });
                                };
                                return (
                                    <div className="form-group">
                                        <label>Delay Between Attempts (DD/HH/MM/SS)</label>
                                        <div className="delay-inputs">
                                            <div className="delay-field"><input type="number" min="0" value={delayObj.d} onChange={e => handleDelayChange('d', e.target.value)} /><label>Days</label></div>
                                            <div className="delay-field"><input type="number" min="0" value={delayObj.h} onChange={e => handleDelayChange('h', e.target.value)} /><label>Hours</label></div>
                                            <div className="delay-field"><input type="number" min="0" value={delayObj.m} onChange={e => handleDelayChange('m', e.target.value)} /><label>Mins</label></div>
                                            <div className="delay-field"><input type="number" min="0" value={delayObj.s} onChange={e => handleDelayChange('s', e.target.value)} /><label>Secs</label></div>
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="form-group">
                                <label>Action Between Attempts</label>
                                <select value={editForm.attemptSeparator || 'Refresh Current Page'} onChange={e => setEditForm({...editForm, attemptSeparator: e.target.value})}>
                                    <option value="Refresh Current Page">Refresh Current Page</option>
                                    <option value="Restart window">Restart window</option>
                                    <option value="Log out and restart">Log out and restart</option>
                                </select>
                            </div>
                            
                            <div style={{display: 'flex', gap: '10px'}}>
                                <div className="form-group" style={{flex: 1}}><label>Category Switches (Internal)</label><input type="number" min="1" value={editForm.switches || 1} onChange={e => setEditForm({...editForm, switches: e.target.value})} /></div>
                                <div className="form-group" style={{flex: 1}}><label>Switch Delay (ms)</label><input type="number" min="500" step="500" value={editForm.switchDelay || 3000} onChange={e => setEditForm({...editForm, switchDelay: e.target.value})} /></div>
                            </div>
                        </div>
                        
                        <div className="modal-actions" style={{ marginTop: '15px' }}>
                            <button className="btn-launch" onClick={saveEdit}>Save Configuration</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}