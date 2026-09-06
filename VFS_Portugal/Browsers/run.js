/* Omni-Booking-Automation-Suite/VFS_Portugal/run.js */

import { fork } from 'node:child_process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { terminationCmds } from './Config/settings.js';
import { ChromeWorker } from './Browsers/chrome.js';

// ==========================================
// 1. WORKER PROCESS (Isolated Child)
// ==========================================
if (process.env.IS_CHILD_WORKER === 'true') {
    let currentWorker = null;

    process.on('message', async (data) => {
        if (data.action === 'START') {
            const { account } = data;

            currentWorker = new ChromeWorker({
                headless: false,
                email: account.email,
                password: account.password
            });

            // إعادة توجيه الـ Logs للعملية الرئيسية عبر قناة IPC
            currentWorker.logStatus = (msg) => {
                if (process.send) {
                    process.send({ type: 'log', message: msg });
                }
            };

            try {
                await currentWorker.launchBrowser();
            } catch (err) {
                if (process.send) {
                    process.send({ type: 'log', message: `❌ Process Error: ${err.message}` });
                }
            }
        }

        if (data.action === 'TERMINATE') {
            if (currentWorker) {
                currentWorker.terminate();
            }
            process.exit(0);
        }
    });
} 

// ==========================================
// 2. MAIN PROCESS (CLI & Supervisor)
// ==========================================
else {
    const rl = readline.createInterface({ input, output });

    // ضع الحسابات التي تريد تشغيلها هنا
    const accounts = [
        { email: "sirmohamedh@gmail.com", password: "Moed!vsfG@26" },
        // { email: "account2@gmail.com", password: "Password2@" },
    ];

    console.log(`\n🚀 [Main Process] Spawning ${accounts.length} independent OS Process(es)...\n`);

    const childProcesses = [];

    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const index = i + 1;

        // تشغيل نفس الملف في Process فرعي جديد تماماً ومعزول
        const child = fork(process.argv[1], [], {
            env: { ...process.env, IS_CHILD_WORKER: 'true' },
            stdio: ['ignore', 'inherit', 'inherit', 'ipc'] // 'ignore' يمنع الـ child من لمس الـ stdin
        });

        // استقبال وطباعة الرسائل من الـ Worker
        child.on('message', (data) => {
            if (data.type === 'log') {
                console.log(`[Worker-${index} | ${account.email}] ${data.message}`);
            }
        });

        // إرسال أمر البدء
        child.send({ action: 'START', account });
        childProcesses.push(child);

        // فاصل زمني لتفادي صدمة فتح متصفحات متعددة في نفس الثانية
        if (i < accounts.length - 1) {
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    // إدارة الإيقاف الفوري لجميع الـ Processes من الـ Main
    let terminate = false;
    while (!terminate) {
        const answer = await rl.question("\nVFS-bot (type 'q' or 'exit' to stop all): ");
        const command = answer.trim().toLowerCase();

        if (terminationCmds.includes(command)) {
            console.log("\n🛑 [Main Process] Terminating all browser instances...");
            for (const child of childProcesses) {
                child.send({ action: 'TERMINATE' });
            }

            // إعطاء مهلة ثانية واحدة للإغلاق النظيف ثم إنهاء العملية
            setTimeout(() => {
                for (const child of childProcesses) {
                    try { child.kill(); } catch {}
                }
                rl.close();
                process.exit(0);
            }, 1000);

            terminate = true;
        }
    }
}