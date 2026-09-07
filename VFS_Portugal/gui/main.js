/* gui/main.js */
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// استيراد ملفات البوت الأساسية بنظام ES Modules
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
        webPreferences: {
            // ربط ملف الـ CJS الجديد
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- File IPC Handlers ---
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

// --- Bot IPC Handlers ---
ipcMain.on('launch-bots', async (event, instances) => {
    for (const instance of instances) {
        if (activeWorkers.has(instance.id)) continue;

        const worker = new ChromeWorker({
            headless: false,
            email: instance.data.account,
            password: instance.data.password
        });
        
        worker.logStatus = (msg) => {
            event.reply('bot-status', { id: instance.id, status: msg });
        };
        worker.logError = (key, msg) => {
            event.reply('bot-status', { id: instance.id, status: `Error: ${msg}` });
        };

        activeWorkers.set(instance.id, worker);
        worker.launchBrowser();
        
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