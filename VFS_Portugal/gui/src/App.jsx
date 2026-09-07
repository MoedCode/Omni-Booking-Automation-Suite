import { useState, useEffect } from 'react';
import './theme.css';

// Helper to generate unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export default function App() {
    const [instances, setInstances] = useState([]);
    const [sheetUrl, setSheetUrl] = useState('');
    
    // Modal State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    // Listen for status updates from Puppeteer
    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.onBotStatusUpdate(({ id, status }) => {
                setInstances(prev => prev.map(inst => 
                    inst.id === id ? { ...inst, status: status } : inst
                ));
            });
        }
    }, []);

    // --- File Imports ---
    const handleLocalFile = async () => {
        const data = await window.electronAPI.selectLocalFile();
        if (data && !data.error) {
            const newInstances = data.map(item => ({
                id: generateId(), data: item, status: 'Idle', selected: false
            }));
            setInstances(prev => [...prev, ...newInstances]);
        } else if (data?.error) alert(data.error);
    };

    const handleGoogleSheet = async () => {
        const data = await window.electronAPI.fetchGoogleSheet(sheetUrl);
        if (data && !data.error) {
            const newInstances = data.map(item => ({
                id: generateId(), data: item, status: 'Idle', selected: false
            }));
            setInstances(prev => [...prev, ...newInstances]);
            setSheetUrl('');
        }
    };

    const handleManualAdd = () => {
        const newInst = {
            id: generateId(),
            data: { account: 'new@email.com', password: '', country: '', city: '', appointmentCategory: '', subCategory: '' },
            status: 'Idle',
            selected: false
        };
        setInstances(prev => [...prev, newInst]);
        setEditingId(newInst.id);
        setEditForm(newInst.data);
    };

    // --- Row Actions ---
    const toggleSelect = (id) => {
        setInstances(prev => prev.map(inst => inst.id === id ? { ...inst, selected: !inst.selected } : inst));
    };

    const toggleSelectAll = (e) => {
        const checked = e.target.checked;
        setInstances(prev => prev.map(inst => ({ ...inst, selected: checked })));
    };

    const launchBots = (ids) => {
        const toLaunch = instances.filter(i => ids.includes(i.id));
        window.electronAPI.launchBots(toLaunch);
        setInstances(prev => prev.map(inst => ids.includes(inst.id) ? { ...inst, status: 'Launching...' } : inst));
    };

    const closeBots = (ids) => {
        window.electronAPI.closeBots(ids);
    };

    const deleteBots = (ids) => {
        closeBots(ids); // Force close before deleting
        setInstances(prev => prev.filter(inst => !ids.includes(inst.id)));
    };

    // --- Bulk Actions ---
    const selectedIds = instances.filter(i => i.selected).map(i => i.id);

    // --- Edit Modal Handlers ---
    const startEdit = (inst) => {
        setEditingId(inst.id);
        setEditForm(inst.data);
    };

    const saveEdit = () => {
        setInstances(prev => prev.map(inst => inst.id === editingId ? { ...inst, data: editForm } : inst));
        setEditingId(null);
    };

    return (
        <div className="app-container">
            <header className="header-panel">
                <div className="import-controls">
                    <button className="btn-add" onClick={handleManualAdd}>+ Add Account</button>
                    <button className="btn-outline" onClick={handleLocalFile}>📁 Browse Files...</button>
                    <div className="sheet-fetcher">
                        <input type="text" placeholder="Google Sheet URL" value={sheetUrl} onChange={e => setSheetUrl(e.target.value)} />
                        <button className="btn-outline" onClick={handleGoogleSheet}>Fetch Cloud Sheet</button>
                    </div>
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
                            <th>Target Account</th>
                            <th>Target City</th>
                            <th>Category</th>
                            <th>Operational State</th>
                            <th width="240px" style={{textAlign:'center'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instances.map((inst, index) => (
                            <tr key={inst.id} onDoubleClick={() => startEdit(inst)} className={inst.selected ? 'selected-row' : ''}>
                                <td><input type="checkbox" checked={inst.selected} onChange={() => toggleSelect(inst.id)} /></td>
                                <td>{index + 1}</td>
                                <td>{inst.data.account}</td>
                                <td>{inst.data.city || '-'}</td>
                                <td>{inst.data.appointmentCategory || '-'}</td>
                                <td className="status-cell" title={inst.status}>{inst.status}</td>
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

            {/* Edit Modal */}
            {editingId && (
                <div className="modal-overlay" onClick={() => setEditingId(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Edit Instance</h3>
                        <div className="form-grid">
                            <input type="text" placeholder="Account Email" value={editForm.account} onChange={e => setEditForm({...editForm, account: e.target.value})} />
                            <input type="text" placeholder="Password" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} />
                            <input type="text" placeholder="Country" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} />
                            <input type="text" placeholder="City" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                            <input type="text" placeholder="Appointment Category" value={editForm.appointmentCategory} onChange={e => setEditForm({...editForm, appointmentCategory: e.target.value})} />
                            <input type="text" placeholder="Sub Category" value={editForm.subCategory} onChange={e => setEditForm({...editForm, subCategory: e.target.value})} />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-outline" onClick={() => setEditingId(null)}>Cancel</button>
                            <button className="btn-launch" onClick={saveEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}