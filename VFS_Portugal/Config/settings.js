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

const processPriority = {
    signIn: 1,
    cookies: 2,
    captcha: 3,
    injection: 4,
    unknown: 99
};

// ⚙️ Cookie Preferences Config
// Accepts: "Accept All", "All", "Accept Only Necessary", "Necessary", "Accept Necessary" (Case Insensitive)
const cookiesAcceptant = "Accept All"; 

module.exports = {
    allKeys,
    FILE_PATH,
    EgPtrLoginURL,
    BROWSER_ARGS, 
    CHANNEL,
    terminationCmds,
    debug,
    processPriority,
    cookiesAcceptant
};