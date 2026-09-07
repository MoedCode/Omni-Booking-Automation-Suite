const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectLocalFile: () => ipcRenderer.invoke('select-local-file'),
    fetchGoogleSheet: (url) => ipcRenderer.invoke('fetch-google-sheet', url),
    
    // Bot Control Methods
    launchBots: (instances) => ipcRenderer.send('launch-bots', instances),
    closeBots: (ids) => ipcRenderer.send('close-bots', ids),
    
    // Status Listener
    onBotStatusUpdate: (callback) => ipcRenderer.on('bot-status', (_event, data) => callback(data))
});