/* Omni-Booking-Automation-Suite/VFS_Portugal/gui/preload.cjs */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectLocalFile: () => ipcRenderer.invoke('select-local-file'),
    fetchGoogleSheet: (url) => ipcRenderer.invoke('fetch-google-sheet', url),
    exportData: (data) => ipcRenderer.invoke('export-data', data),
    
    launchBots: (instances) => ipcRenderer.send('launch-bots', instances),
    closeBots: (ids) => ipcRenderer.send('close-bots', ids),
    
    windowControl: (action) => ipcRenderer.send('window-control', action),
    
    onWindowMaximizeChange: (callback) => ipcRenderer.on('window-maximized', (_event, isMaximized) => callback(isMaximized)),
    onBotStatusUpdate: (callback) => ipcRenderer.on('bot-status', (_event, data) => callback(data)),
    onAppointmentResult: (callback) => ipcRenderer.on('appointment-result', (_event, data) => callback(data))
});