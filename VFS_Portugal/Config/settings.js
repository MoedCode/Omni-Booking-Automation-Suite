/* Omni-Booking-Automation-Suite/VFS_Portugal/Config/Settings.js */
const path = require('path');
const FILE_PATH = path.resolve(__dirname, '../VFS_accounts.xlsx');
const EgPtrLoginURL = "https://visa.vfsglobal.com/egy/en/prt/login";

const allKeys = {
    mandatoryKeys: ["account", "password"],
    allowedKeys: [
        "account", 
        "password", 
        "country", 
        "city", 
        "appointmentCategory",
        "subCategory",
        "mode",
        "attempts",
        "attemptDelay",
        "switches",
        "switchDelay",
        "autoClose",
        "attemptSeparator"
    ],
    keyConv: {
        password: ["passwords", "pass", "pwd"], 
        account: ["accounts", "email", "username"],
        appointmentCategory: ["appointment category", "appointment_category", "appointment-category"],
        city: ["cites"],
        country: ["country's"],
        mode: ["headless", "visible", "execution mode", "execution_mode"],
        attempts: ["number of attempts", "retries", "attempt"],
        attemptDelay: ["attempt delay", "delay", "time between", "time between each attempt"],
        switches: ["switch", "switches", "number of switch", "sub category switch"],
        switchDelay: ["switch delay"],
        autoClose: ["auto close", "autoclose", "close after"],
        attemptSeparator: ["separator", "attempt separator", "between attempts"]
    }
};

// Default values applied if the user leaves fields blank in the GUI Hot Batch
const defaultBatchConfig = {
    country: "Egypt",
    city: "Alexandria",
    appointmentCategory: "Short Term Visa",
    subCategory: "Tourism",
    attempts: 1,
    attemptDelay: "00/00/05/00", // Default 5 minutes (dd/hh/mm/ss)
    switches: 1,
    switchDelay: 3000,
    autoClose: true,
    attemptSeparator: "Sign Out"
};

const terminationCmds = ["exit", "\\q", "q"];
const BROWSER_ARGS = ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox'];
const CHANNEL = '';

const debug = { operationalStatus: true, warnings: true, errors: true };

const actionsConfig = {
    cookies: { priority: 1, startDelay: 300, endDelay: 500 },
    captcha: { priority: 2, startDelay: 300, endDelay: 500 },
    signIn: { priority: 3, startDelay: 300, endDelay: 0 },
    dashboard: { priority: 4, startDelay: 2000, endDelay: 2000 },
    appointmentDetails: { priority: 5, startDelay: 1500, endDelay: 2000 },
    default: { priority: 99, startDelay: 100, endDelay: 100 }
};

const cookiesAcceptant = "Accept All"; 

module.exports = {
    allKeys,
    defaultBatchConfig,
    FILE_PATH,
    EgPtrLoginURL,
    BROWSER_ARGS, 
    CHANNEL,
    terminationCmds,
    debug,
    actionsConfig,
    cookiesAcceptant
};