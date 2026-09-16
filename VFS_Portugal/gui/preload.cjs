/* Omni-Booking-Automation-Suite/VFS_Portugal/gui/preload.cjs */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectLocalFile: () => ipcRenderer.invoke('select-local-file'),
    fetchGoogleSheet: (url) => ipcRenderer.invoke('fetch-google-sheet', url),
    
    launchBots: (instances) => ipcRenderer.send('launch-bots', instances),
    closeBots: (ids) => ipcRenderer.send('close-bots', ids),
    
    // 👈 Custom Window Controls
    windowControl: (action) => ipcRenderer.send('window-control', action),
    
    onBotStatusUpdate: (callback) => ipcRenderer.on('bot-status', (_event, data) => callback(data)),
    onAppointmentResult: (callback) => ipcRenderer.on('appointment-result', (_event, data) => callback(data))
});