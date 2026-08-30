/* Omni-Booking-Automation-Suite\VFS_Portugal/FileHandler/SheetsHandler.js */

const fs = require('fs');
const XLSX = require('xlsx');
const settings = require('../Config/Settings');
const { allKeys } = require('../Config/Settings');

class SheetHandler {
    /**
     * Creates an instance of SheetHandler.
     * @param {Object} keysConfig - Object containing mandatoryKeys, allowedKeys, and keyConv
     * @param {string} defaultFilePath - Default path to the spreadsheet
     */
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

    /**
     * Centralized File Path Handler.
     * Validates and resolves the file path. All file-loading methods must use this.
     * @param {string} customPath - Optional path provided at runtime
     * @returns {string} - A verified, existing file path
     */
    resolveFilePath(customPath) {
        const targetPath = customPath || this.defaultFilePath;

        if (!targetPath) {
            throw new Error("[File Error] No file path provided and no default path is set.");
        }

        if (!fs.existsSync(targetPath)) {
            throw new Error(`[File Error] File does not exist at path: ${targetPath}`);
        }

        return targetPath;
    }

    /**
     * Standardizes Excel header variations (spaces, dashes, underscores, caps) 
     * and maps them to standard keys using `keyConv` and fuzzy matching.
     */
    _normalizeRowKeys(rawRow) {
        const normalizedRow = {};

        for (let [rawKey, value] of Object.entries(rawRow)) {
            rawKey = rawKey.trim();
            let finalKey = rawKey;

            // 1. Direct match with allowed keys
            if (this.allValidKeys.has(rawKey)) {
                normalizedRow[rawKey] = value;
                continue;
            }

            // 2. Map via keyConv aliases
            let aliasMatched = false;
            for (const [standardKey, aliases] of Object.entries(this.keyConv)) {
                const lowerAliases = aliases.map(a => a.toLowerCase());
                if (lowerAliases.includes(rawKey.toLowerCase())) {
                    finalKey = standardKey;
                    aliasMatched = true;
                    break;
                }
            }

            // 3. Fallback: Fuzzy matching (handles spaces, hyphens, underscores, capitalization automatically)
            // e.g., "Appointment_Category" -> "appointmentcategory" -> matches "appointmentCategory"
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

            // Save the value under the standardized key
            normalizedRow[finalKey] = value;
        }

        return normalizedRow;
    }

    /**
     * Safely validates and parses the dataset.
     * @returns {Object} A structured result dictionary
     */
    sanitizeParsing(rawRows) {
        const warnings = [];
        const validData = [];
        let ignoredRowsCount = 0;

        if (!rawRows || rawRows.length === 0) {
            return this._createResult(false, [], 'The source file/sheet contains no data rows.', warnings, 0, 0, 0);
        }

        // Apply Key Conversion and Normalization
        const normalizedRows = rawRows.map(row => this._normalizeRowKeys(row));
        console.log(`=> \n`, normalizedRows, "\n");
        // 1. File-Level Validation
        if (this.hasMandatory) {
            const fileHeaders = new Set();
            normalizedRows.forEach((row) => {
                Object.keys(row).forEach((k) => fileHeaders.add(k));
            });   

            const missingMandatoryColumns = [];
            for (const mandatoryKey of this.mandatoryKeys) {
                if (!fileHeaders.has(mandatoryKey)) {
                    missingMandatoryColumns.push(mandatoryKey);
                }
            }

            if (missingMandatoryColumns.length > 0) {
                const errorMsg = `[File-Level Error] File rejected. Missing mandatory column(s): [${missingMandatoryColumns.join(', ')}]`;
                return this._createResult(false, [], errorMsg, [errorMsg], normalizedRows.length, 0, normalizedRows.length);
            }
        }

        // 2. Row-Level Validation
        normalizedRows.forEach((row, index) => {
            const rowNumber = index + 2; 
            let isRowValid = true;

            // Check A: Mandatory values validation
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

            if (!isRowValid) {
                ignoredRowsCount++;
                return;
            }

            // Check B: Allowed / Lookup keys validation
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

            if (!isRowValid) {
                ignoredRowsCount++;
                return;
            }

            // Sanitize mapped record
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

        return this._createResult(true, validData, null, warnings, normalizedRows.length, validData.length, ignoredRowsCount);
    }

    /**
     * Loads and parses records from an Excel file.
     * @param {string} customPath - Optional. Overrides the default FILE_PATH.
     * @param {string} sheetName - Optional specific sheet name to read.
     */
    loadFromExcel(customPath, sheetName) {
        try {
            // Safely resolve the file path using the centralized method
            const validPath = this.resolveFilePath(customPath);

            const workbook = XLSX.readFile(validPath);
            const targetSheetName = sheetName || workbook.SheetNames[0];
            const sheet = workbook.Sheets[targetSheetName];

            if (!sheet) {
                return this._createErrorResult(`Sheet "${targetSheetName}" was not found in the Excel workbook.`);
            }

            const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
            return this.sanitizeParsing(rawRows);

        } catch (error) {
            return this._createErrorResult(`Failed to load Excel file: ${error.message}`);
        }
    }

    /**
     * Loads and parses records from a CSV file.
     * @param {string} customPath - Optional. Overrides the default FILE_PATH.
     */
    loadFromCsv(customPath) {
        try {
            // Safely resolve the file path using the centralized method
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
        
        // Instantiate using default settings and file path from Settings.js
        
        const handler = new SheetHandler();

        try {
            console.log(`[Test] Attempting to read Excel file from path: "${handler.defaultFilePath}"`);
            
            const result = handler.loadFromExcel();

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