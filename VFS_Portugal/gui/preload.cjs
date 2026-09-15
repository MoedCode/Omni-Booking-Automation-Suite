/* Omni-Booking-Automation-Suite/VFS_Portugal/gui/preload.cjs */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectLocalFile: () => ipcRenderer.invoke('select-local-file'),
    fetchGoogleSheet: (url) => ipcRenderer.invoke('fetch-google-sheet', url),
    
    launchBots: (instances) => ipcRenderer.send('launch-bots', instances),
    closeBots: (ids) => ipcRenderer.send('close-bots', ids),
    
    // Status Listeners
    onBotStatusUpdate: (callback) => ipcRenderer.on('bot-status', (_event, data) => callback(data)),
    
    // New: Dedicated listener for appointment availability results
    onAppointmentResult: (callback) => ipcRenderer.on('appointment-result', (_event, data) => callback(data))
});