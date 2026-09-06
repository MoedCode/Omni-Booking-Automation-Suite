/* Omni-Booking-Automation-Suite/VFS_Portugal/run.js */

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { terminationCmds } from './Config/settings.js';
import { ChromeWorker } from './Browsers/chrome.js';

// ==========================================
// 1. MAIN THREAD (Manager & Orchestrator)
// ==========================================
if (import.meta.main) {
    const rl = readline.createInterface({ input, output });

    // ضع الحسابات التي تريد تشغيلها هنا
    const accounts = [
        { email: "sirmohamedh@gmail.com", password: "Moed!vsfG@26" },
        // { email: "account2@gmail.com", password: "Password2@" },
        // { email: "account3@gmail.com", password: "Password3@" }
    ];

    console.log(`\n🚀 [Main Process] Initializing ${accounts.length} isolated Worker Thread(s)...\n`);

    const activeThreads = [];

    // تشغيل كل حساب في Thread مستقل مع فاصل زمني لتجنب الضغط
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const threadIndex = i + 1;

        // استدعاء نفس الملف داخل Worker Thread مستقل
        const thread = new Worker(import.meta.url);

        thread.onmessage = (event) => {
            const { email, message } = event.data;
            console.log(`[Thread-${threadIndex} | ${email}] ${message}`);
        };

        // إرسال بيانات الحساب للـ Worker للبدء
        thread.postMessage({
            action: 'START',
            account: account,
            index: threadIndex
        });

        activeThreads.push(thread);

        // فاصل زمني (3 ثوانٍ) بين فتح المتصفحات
        if (i < accounts.length - 1) {
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    // إدارة الإيقاف الفوري لجميع الخيوط
    let terminate = false;
    while (!terminate) {
        const answer = await rl.question("\nVFS-bot (type 'q' or 'exit' to stop all): ");
        const command = answer.trim().toLowerCase();

        if (terminationCmds.includes(command)) {
            console.log("\n🛑 [Main Process] Terminating all background threads and browsers...");
            for (const thread of activeThreads) {
                thread.postMessage({ action: 'TERMINATE' });
                thread.terminate();
            }
            rl.close();
            terminate = true;
            process.exit(0);
        }
    }
} 

// ==========================================
// 2. WORKER THREAD (Isolated Browser Instance)
// ==========================================
else {
    let currentWorker = null;

    self.onmessage = async (event) => {
        const { action, account } = event.data;

        if (action === 'START') {
            currentWorker = new ChromeWorker({
                headless: false,
                email: account.email,
                password: account.password
            });

            // إعادة توجيه الـ Logs للـ Main Thread ليتم تنسيقها
            currentWorker.logStatus = (msg) => {
                postMessage({ email: account.email, message: msg });
            };

            try {
                await currentWorker.launchBrowser();
            } catch (err) {
                postMessage({ email: account.email, message: `❌ Thread Error: ${err.message}` });
            }
        }

        if (action === 'TERMINATE') {
            if (currentWorker) {
                currentWorker.terminate();
            }
        }
    };
}