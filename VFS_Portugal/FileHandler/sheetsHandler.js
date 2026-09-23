/* Omni-Booking-Automation-Suite\VFS_Portugal/FileHandler/SheetsHandler.js */

const fs = require('fs');
const XLSX = require('xlsx');
const settings = require('../Config/Settings');
const { allKeys } = require('../Config/Settings');

class SheetHandler {
    constructor(keysConfig = settings.allKeys, defaultFilePath = settings.FILE_PATH) {
        this.allKeysConfig = keysConfig || {};
        this.mandatoryKeys = new Set(this.allKeysConfig.mandatoryKeys || []);
        this.allowedKeys = new Set(this.allKeysConfig.allowedKeys || []);
        this.keyConv = this.allKeysConfig.keyConv || {};
        this.defaultFilePath = defaultFilePath;

        this.hasMandatory = this.mandatoryKeys.size > 0;
        this.hasAllowed = this.allowedKeys.size > 0;
        this.allValidKeys = new Set([...this.mandatoryKeys, ...this.allowedKeys]);
    }

    resolveFilePath(customPath) {
        const targetPath = customPath || this.defaultFilePath;
        if (!targetPath) throw new Error("[File Error] No file path provided and no default path is set.");
        if (!fs.existsSync(targetPath)) throw new Error(`[File Error] File does not exist at path: ${targetPath}`);
        return targetPath;
    }

    _normalizeRowKeys(rawRow) {
        const normalizedRow = {};
        for (let [rawKey, value] of Object.entries(rawRow)) {
            rawKey = rawKey.trim();
            let finalKey = rawKey;

            if (this.allValidKeys.has(rawKey)) {
                normalizedRow[rawKey] = value;
                continue;
            }

            let aliasMatched = false;
            for (const [standardKey, aliases] of Object.entries(this.keyConv)) {
                const lowerAliases = aliases.map(a => a.toLowerCase());
                if (lowerAliases.includes(rawKey.toLowerCase())) {
                    finalKey = standardKey;
                    aliasMatched = true;
                    break;
                }
            }

            if (!aliasMatched) {
                const fuzzyRawKey = rawKey.replace(/[-_ ]/g, "").toLowerCase();
                for (const validKey of this.allValidKeys) {
                    const fuzzyValidKey = validKey.replace(/[-_ ]/g, "").toLowerCase();
                    if (fuzzyRawKey === fuzzyValidKey) {
                        finalKey = validKey;
                        break;
                    }
                }
            }
            normalizedRow[finalKey] = value;
        }
        return normalizedRow;
    }

    sanitizeParsing(rawRows) {
        const warnings = [];
        const validData = [];
        let ignoredRowsCount = 0;

        if (!rawRows || rawRows.length === 0) {
            return this._createErrorResult('The source file/sheet contains no data rows.');
        }

        const normalizedRows = rawRows.map(row => this._normalizeRowKeys(row));

        if (this.hasMandatory) {
            const fileHeaders = new Set();
            normalizedRows.forEach((row) => { Object.keys(row).forEach((k) => fileHeaders.add(k)); });   

            const missingMandatoryColumns = [];
            for (const mandatoryKey of this.mandatoryKeys) {
                if (!fileHeaders.has(mandatoryKey)) missingMandatoryColumns.push(mandatoryKey);
            }

            if (missingMandatoryColumns.length > 0) {
                const errorMsg = `[File-Level Error] File rejected. Missing mandatory column(s): [${missingMandatoryColumns.join(', ')}]`;
                return this._createErrorResult(errorMsg);
            }
        }

        normalizedRows.forEach((row, index) => {
            const rowNumber = index + 2; 
            let isRowValid = true;

            if (this.hasMandatory) {
                for (const mandatoryKey of this.mandatoryKeys) {
                    const val = row[mandatoryKey];
                    const isEmpty = val === undefined || val === null || (typeof val === 'string' && val.trim() === '');
                    if (isEmpty) {
                        warnings.push(`[Row ${rowNumber}] Ignored: Missing mandatory value for key "${mandatoryKey}".`);
                        isRowValid = false;
                        break;
                    }
                }
            }

            if (!isRowValid) { ignoredRowsCount++; return; }

            if (this.hasAllowed) {
                for (const [key, val] of Object.entries(row)) {
                    const hasValue = val !== undefined && val !== null && (typeof val === 'string' ? val.trim() !== '' : true);
                    if (hasValue && !this.allValidKeys.has(key)) {
                        warnings.push(`[Row ${rowNumber}] Ignored: Contains unauthorized/unrecognized column key "${key}".`);
                        isRowValid = false;
                        break;
                    }
                }
            }

            if (!isRowValid) { ignoredRowsCount++; return; }

            const cleanRecord = {};
            const keysToKeep = this.hasAllowed ? this.allValidKeys : Object.keys(row);

            for (const key of keysToKeep) {
                if (row.hasOwnProperty(key)) {
                    const value = row[key];
                    cleanRecord[key] = typeof value === 'string' ? value.trim() : (value ?? '');
                } else if (this.hasAllowed) {
                    cleanRecord[key] = '';
                }
            }
            validData.push(cleanRecord);
        });

        if (validData.length === 0 && rawRows.length > 0) {
            let errorMsg = "The document was fetched, but NO valid accounts could be imported.";
            if (warnings.length > 0) {
                errorMsg += `\n\nReasons for rejection:\n${warnings.slice(0, 4).join('\n')}`;
                if (warnings.length > 4) errorMsg += `\n...and ${warnings.length - 4} more issues.`;
            }
            return this._createErrorResult(errorMsg);
        }

        return this._createResult(true, validData, null, warnings, normalizedRows.length, validData.length, ignoredRowsCount);
    }

    loadFromExcel(customPath, sheetName) {
        try {
            const validPath = this.resolveFilePath(customPath);
            const workbook = XLSX.readFile(validPath);
            const targetSheetName = sheetName || workbook.SheetNames[0];
            const sheet = workbook.Sheets[targetSheetName];

            if (!sheet) return this._createErrorResult(`Sheet "${targetSheetName}" was not found in the Excel workbook.`);

            const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
            return this.sanitizeParsing(rawRows);
        } catch (error) {
            return this._createErrorResult(`Failed to load Excel file: ${error.message}`);
        }
    }

    loadFromCsv(customPath) {
        try {
            const validPath = this.resolveFilePath(customPath);
            const workbook = XLSX.readFile(validPath, { type: 'file' });
            const firstSheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[firstSheetName];

            const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
            return this.sanitizeParsing(rawRows);
        } catch (error) {
            return this._createErrorResult(`Failed to load CSV file: ${error.message}`);
        }
    }

    async loadFromGSheet(url) {
        try {
            if (!url || url.trim() === '') throw new Error("No URL provided.");

            const sheetRegex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)(?:\/.*)?$/;
            const match = url.trim().match(sheetRegex);
            
            if (!match || !match[1]) {
                throw new Error("Invalid Google Sheets URL format. Please ensure you are pasting a valid Google Docs URL.");
            }
            
            const sheetId = match[1];
            const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
            
            let response;
            try {
                response = await fetch(exportUrl);
            } catch (networkError) {
                throw new Error(`Google connection failed: ${networkError.message}`);
            }

            if (!response.ok) {
                throw new Error(`Google responded with HTTP ${response.status}: ${response.statusText}. Please verify the link is correct and publicly shared.`);
            }
            
            const csvText = await response.text();
            
            if (csvText.trim().toLowerCase().startsWith('<!doctype html>') || csvText.trim().toLowerCase().startsWith('<html')) {
                throw new Error("Access Denied by Google. The sheet is private. Please change sharing settings to 'Anyone with the link'.");
            }

            const workbook = XLSX.read(csvText, { type: 'string' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
            return this.sanitizeParsing(rawRows);

        } catch (error) {
            return this._createErrorResult(`Cannot import Error: ${error.message}`);
        }
    }

    exportData(data, filePath) {
        try {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Accounts");
            XLSX.writeFile(wb, filePath);
            return { success: true };
        } catch (error) {
            return this._createErrorResult(`Failed to export file: ${error.message}`);
        }
    }

    _createResult(success, data, error, warnings, totalRowsProcessed, validRowsCount, ignoredRowsCount) {
        return { success, data, error, warnings, totalRowsProcessed, validRowsCount, ignoredRowsCount };
    }

    _createErrorResult(message) {
        return this._createResult(false, [], message, [], 0, 0, 0);
    }
}

module.exports = SheetHandler;
// ==========================================
// Test Block (Executed when run directly)
// ==========================================
if (require.main === module) {
    (async () => {
        console.log("[Test Execution Started] Initializing SheetHandler...");
        
        const handler = new SheetHandler();

        try {
            console.log(`[Test] Attempting to fetch from Google Sheets...`);
            
            // 👈 FIX: Added 'await' to resolve the Promise before logging
            const result = await handler.loadFromGSheet("https://docs.google.com/spreadsheets/d/1XHDo01rUng0pKCFXxkMtzklZUwY5bt6bkCw3bcRkRBo/edit?usp=sharing");

            console.log("\n--- Parsing Execution Results ---");
            console.log(`Success Status : ${result.success}`);
            console.log(`Total Processed: ${result.totalRowsProcessed}`);
            console.log(`Valid Rows     : ${result.validRowsCount}`);
            console.log(`Ignored Rows   : ${result.ignoredRowsCount}`);

            if (result.error) {
                console.error(`\n❌ Error Encountered:\n${result.error}`);
            }

            if (result.warnings && result.warnings.length > 0) {
                console.warn(`\n⚠️ Warnings / Ignored Details:\n`, result.warnings);
            }

            if (result.success && result.data.length > 0) {
                console.log(`\n✅ Successfully Parsed Data Records:\n`, result.data);
            }

        } catch (error) {
            console.error("\n❌ Critical Test Exception Caught:", error.message);
        }
    })();
}