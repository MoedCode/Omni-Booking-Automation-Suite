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
        "subCategory"
    ],
    keyConv: {
        password: ["passwords", "pass", "pwd"], 
        account: ["accounts", "email", "username"],
        appointmentCategory: ["appointment category", "appointment_category", "appointment-category"],
        city: ["cites"],
        country: ["country's"]
    }
};

const terminationCmds = ["exit", "\\q", "q"];
const BROWSER_ARGS = ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox'];
const CHANNEL = '';

const debug = { operationalStatus: true, warnings: true, errors: true };

const actionsConfig = {
    cookies: { priority: 1, startDelay: 300, endDelay: 500 },
    captcha: { priority: 2, startDelay: 300, endDelay: 500 },
    signIn: { priority: 3, startDelay: 300, endDelay: 0 },
    injection: { priority: 4, startDelay: 5000, endDelay: 1000 },
    default: { priority: 99, startDelay: 100, endDelay: 100 }
};


const cookiesAcceptant = "Accept All"; 

module.exports = {
    allKeys,
    FILE_PATH,
    EgPtrLoginURL,
    BROWSER_ARGS, 
    CHANNEL,
    terminationCmds,
    debug,
    actionsConfig,
    cookiesAcceptant
};