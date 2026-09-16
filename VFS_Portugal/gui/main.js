/* Omni-Booking-Automation-Suite/VFS_Portugal/gui/main.js */
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

import { ChromeWorker } from '../Browsers/chrome.js';
import SheetHandler from '../FileHandler/SheetsHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
const activeWorkers = new Map();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        backgroundColor: '#0f172a',
        title: "Yalla Visa Auto-Booking Suite",
        frame: false, // Removes the default Windows border and titlebar completely
        titleBarStyle: 'hidden', // Required for custom titlebar dragging
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    
    mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => { 
        if (BrowserWindow.getAllWindows().length === 0) createWindow(); 
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- Custom Window Controls (For Frameless Titlebar) ---
ipcMain.on('window-control', (event, action) => {
    if (!mainWindow) return;
    if (action === 'minimize') mainWindow.minimize();
    if (action === 'maximize') {
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    }
    if (action === 'close') mainWindow.close();
});

// --- File Handling IPC ---
ipcMain.handle('select-local-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Spreadsheets', extensions: ['xlsx', 'csv'] }]
    });
    
    if (canceled || filePaths.length === 0) return null;
    
    try {
        const handler = new SheetHandler();
        const result = handler.loadFromExcel(filePaths[0]);
        if (result.success) return result.data;
        throw new Error(result.error);
    } catch (error) {
        return { error: error.message };
    }
});

ipcMain.handle('fetch-google-sheet', async (event, url) => {
    try {
        const sheetIdMatch = url.match(/\/d\/(.*?)(\/|$)/);
        if (!sheetIdMatch) throw new Error("Invalid Google Sheets URL");
        return [{ account: "fetched@sheet.com", password: "pwd", country: "Portugal", city: "Cairo" }];
    } catch (error) {
        return { error: error.message };
    }
});

// --- Bot Management IPC ---
ipcMain.on('launch-bots', async (event, instances) => {
    for (const instance of instances) {
        if (activeWorkers.has(instance.id)) continue;

        const isHeadless = instance.headless === true;

        const worker = new ChromeWorker({
            headless: isHeadless,
            email: instance.data.account,
            password: instance.data.password,
            instanceData: instance.data // Forward complete data payload to the worker
        });
        
        // Listeners for UI logs and status updates
        worker.logStatus = (msg) => {
            event.reply('bot-status', { id: instance.id, status: msg });
        };
        worker.logError = (key, msg) => {
            event.reply('bot-status', { id: instance.id, status: `Error: ${msg}` });
        };

        // Listener for Appointment Availability Polling
        worker.onAppointmentResult = (resultType) => {
            event.reply('appointment-result', { id: instance.id, result: resultType });
        };

        activeWorkers.set(instance.id, worker);
        worker.launchBrowser();
        
        // 2-second delay to stagger browser instances gracefully
        await new Promise(r => setTimeout(r, 2000));
    }
});

ipcMain.on('close-bots', (event, ids) => {
    for (const id of ids) {
        const worker = activeWorkers.get(id);
        if (worker) {
            worker.terminate();
            activeWorkers.delete(id);
            event.reply('bot-status', { id: id, status: 'Closed' });
        }
    }
});