/* project_context.js */
import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_FILE = 'project_context.md';
const ROOT_NAME = 'VFS_Portugal';

// Explicit list of target directories to inspect
const TARGET_DIRS = [
    'Config',
    'Browsers',
    'FileHandler',
    'gui',
    'gui/src',
    'gui/public'
];

// Binary and lock files to ignore
const IGNORE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.xlsx', '.csv', '.ico', '.woff', '.woff2'];
const IGNORE_FILES = ['package-lock.json', 'bun.lockb', 'project_context.js', OUTPUT_FILE];

function writeToMD(text) {
    fs.appendFileSync(OUTPUT_FILE, text + '\n', 'utf-8');
}

function getMarkdownLang(filename) {
    const ext = path.extname(filename).toLowerCase().substring(1);
    const langMap = {
        'js': 'javascript',
        'cjs': 'javascript',
        'jsx': 'jsx',
        'css': 'css',
        'html': 'html',
        'json': 'json',
        'md': 'markdown'
    };
    return langMap[ext] || ext || 'text';
}

// Initialize clean output file
fs.writeFileSync(OUTPUT_FILE, '', 'utf-8');

let guiSeparatorPrinted = false;

for (const relDir of TARGET_DIRS) {
    const fullDirPath = path.join(process.cwd(), relDir);
    if (!fs.existsSync(fullDirPath)) continue;

    // Print GUI separator once right before GUI folders begin
    if (relDir.startsWith('gui') && !guiSeparatorPrinted) {
        writeToMD('\n----------  GUI -----------------\n');
        guiSeparatorPrinted = true;
    }

    // Determine heading depth by nesting level (e.g., Config = 1 '#', gui/src = 2 '##')
    const segments = relDir.split(/[\\/]/).filter(Boolean);
    const depth = segments.length;
    const dirHeader = '#'.repeat(depth);
    const fileHeader = '#'.repeat(depth + 1);

    const dirVirtualPath = `${ROOT_NAME}/${relDir.replace(/\\/g, '/')}`;

    // Read only direct files within this folder (non-recursive)
    const entries = fs.readdirSync(fullDirPath, { withFileTypes: true });
    const files = entries.filter(e => {
        if (!e.isFile()) return false;
        const ext = path.extname(e.name).toLowerCase();
        if (IGNORE_EXTS.includes(ext)) return false;
        if (IGNORE_FILES.includes(e.name)) return false;
        return true;
    });

    if (files.length === 0) continue;

    writeToMD(`\n${dirHeader} ${dirVirtualPath}`);

    for (const file of files) {
        writeToMD(`${fileHeader} *${file.name}*`);

        try {
            let content = fs.readFileSync(path.join(fullDirPath, file.name), 'utf-8');
            
            // Clean up unusual line terminators
            content = content.replace(/[\u2028\u2029]/g, '\n');

            const lang = getMarkdownLang(file.name);
            writeToMD(`\`\`\`${lang}\n${content.trim()}\n\`\`\``);
        } catch (err) {
            writeToMD(`\`\`\`text\n[Error reading file]\n\`\`\``);
        }
    }

    writeToMD('\n------------------------------------------------');
}

console.log(`✅ Selected directories successfully written to ${OUTPUT_FILE}`);