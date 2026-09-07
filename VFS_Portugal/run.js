/* Omni-Booking-Automation-Suite/VFS_Portugal/run.js */

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { terminationCmds } from './Config/settings.js';
import { ChromeWorker } from './Browsers/chrome.js';
import SheetHandler from './FileHandler/sheetsHandler.js';

const rl = readline.createInterface({ input, output });

const handler = new SheetHandler();
const result = handler.loadFromExcel();
const accounts = result.data



// console.log(`Data: `, result.data);
// console.log(`Success Status : ${result.success}`);
// console.log(`Total Processed: ${result.totalRowsProcessed}`);
// console.log(`Valid Rows     : ${result.validRowsCount}`);
// console.log(`Ignored Rows   : ${result.ignoredRowsCount}`);

console.log(`\n🚀 Starting ${accounts.length} browser instance(s)...\n`);

// Initialize worker instances with global scope
let workers = [];

if (accounts && accounts.length > 0) {
    workers = accounts.map((acc, index) => {
        const worker = new ChromeWorker({
            headless: false,
            email: acc.account,
            password: acc.password
        });
        
        // Tag worker logs with instance index and account email
        worker.logStatus = (msg) => {
            console.log(`[Worker-${index + 1} | ${acc.email}] ${msg}`);
        };
        
        return worker;
    });
}

// Stagger browser launches by 2 seconds to mitigate CPU and memory spikes
for (const worker of workers) {
    worker.launchBrowser();
    await Bun.sleep(2000);
}

// Non-blocking interactive CLI listener for graceful shutdown
let terminate = false;
while (!terminate) {
    const answer = await rl.question("\nVFS-bot (type 'q' or 'exit' to stop all): ");
    const command = answer.trim().toLowerCase();

    if (terminationCmds.includes(command)) {
        console.log("\n🛑 Terminating all browsers...");
        for (const worker of workers) {
            worker.terminate();
        }
        rl.close();
        terminate = true;
        process.exit(0);
    }
}