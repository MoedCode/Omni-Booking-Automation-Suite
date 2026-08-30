/* Omni-Booking-Automation-Suite\VFS_Portugal/Config/Settings.js */
const path = require('path');
const FILE_PATH = path.resolve(__dirname, '../VFS_accounts.xlsx');
const EgPtrLoginURL = "https://visa.vfsglobal.com/egy/en/prt/login"
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
    
    // keyConv maps Standard_Key -> [List of Aliases]
    keyConv: {
        password: ["passwords", "pass", "pwd"], 
        account: ["accounts", "email", "username"],
        // You only need to put hard aliases here. 
        // Spaces, underscores, and dashes will be handled automatically by fuzzy matching in the class.
        appointmentCategory: ["appointment category", "appointment_category", "appointment-category"],
        city:["cites"],
        country:["country's"],
        // subCategory:[ "sub category"]

    }
};
const terminationCmds = ["exit", "\\q", "q"] 
BROWSER_ARGS = ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox'] 
CHANNEL = '';
module.exports = {
    allKeys,
    FILE_PATH,
    EgPtrLoginURL,
    BROWSER_ARGS, 
    CHANNEL,
    terminationCmds
};
