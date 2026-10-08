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
        "attemptSeparator",
        "inputMethod",
        // Your Details Form Fields
        "firstName",
        "lastName",
        "gender",
        "dateOfBirth",
        "nationality",
        "passportNumber",
        "passportExpiry",
        "dialCode",
        "contactNumber",
        "email",
        "appointmentTime",
        // Your Details behaviour
        "autoSave",
        "dateFormat",
        "dateOrder",
        "fieldDelayMin",
        "fieldDelayMax"
    ],
    keyConv: {
        password: ["passwords", "pass", "pwd"], 
        account: ["accounts", "username", "login email"],
        appointmentCategory: ["appointment category", "appointment_category", "appointment-category"],
        city: ["cites", "application centre", "center", "centre"],
        country: ["country's", "countrycode", "country code"],
        mode: ["headless", "visible", "execution mode", "execution_mode"],
        attempts: ["number of attempts", "retries", "attempt"],
        attemptDelay: ["attempt delay", "delay", "time between", "time between each attempt"],
        switches: ["switch", "switches", "number of switch", "sub category switch"],
        switchDelay: ["switch delay"],
        autoClose: ["auto close", "autoclose", "close after"],
        attemptSeparator: ["separator", "attempt separator", "between attempts", "action between attempts"],
        inputMethod: ["login typing", "input method", "fill mode"],
        
        // Your Details Aliases
        firstName: ["first name", "given name", "firstname"],
        lastName: ["last name", "surname", "lastname"],
        dateOfBirth: ["dob", "date of birth", "birth date", "birthdate"],
        passportExpiry: ["passport expiry", "expiry date", "passport expiry date", "passportexpirydate"],
        contactNumber: ["phone", "phone number", "contact", "mobile", "contactnumber"],
        dialCode: ["dial code", "dialcode", "phone code"],
        nationality: ["current nationality", "nationality"],
        gender: ["sex"],
        passportNumber: ["passport", "passport no", "passport no."],
        email: ["email address", "contact email", "email id", "email"],
        appointmentTime: ["appointment time", "time", "choose an appointment time"],
        autoSave: ["auto save", "autosave", "save automatically"],
        dateFormat: ["date format"],
        dateOrder: ["date order"],
        fieldDelayMin: ["field delay min", "min field delay"],
        fieldDelayMax: ["field delay max", "max field delay"]
    }
};

// Default values applied if the user leaves fields blank in the GUI Hot Batch
const defaultBatchConfig = {
    country: "Egypt",
    city: "Alexandria",
    appointmentCategory: "Short Term Visa",
    subCategory: "Tourism",
    attempts: 1,
    attemptDelay: "00/00/05/00", 
    switches: 1,
    switchDelay: 3000,
    autoClose: true,
    attemptSeparator: "Refresh Current Page",
    inputMethod: "fill",
    
    // Default Empty Profile
    firstName: "",
    lastName: "",
    gender: "Male",
    dateOfBirth: "",
    nationality: "EGYPT",
    passportNumber: "",
    passportExpiry: "",
    dialCode: "20",
    contactNumber: "",
    email: "",
    appointmentTime: "All",

    // Your Details behaviour
    autoSave: true,            // click Save (after the page's 7s wait) once the form is filled
    dateFormat: "DD/MM/YYYY",  // format the portal's date fields accept
    dateOrder: "DMY",          // how ambiguous dates like 4/1/1989 are read: DMY (4 Jan) or MDY (1 Apr)
    fieldDelayMin: 400,        // random pause between fields (ms) - anti-bot-detection
    fieldDelayMax: 1500
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
    yourDetails: { priority: 7, startDelay: 2000, endDelay: 2000 }, // Added Your Details Action Node
    yourDetailsSummary: { priority: 6, startDelay: 2000, endDelay: 2000 },
    bookAppointment: { priority: 8, startDelay: 2000, endDelay: 2000 },
    services: { priority: 9, startDelay: 2000, endDelay: 2000 },
    review: { priority: 10, startDelay: 2000, endDelay: 2000 },
    paymentDisclaimer: { priority: 11, startDelay: 2000, endDelay: 2000 },
    payFort: { priority: 12, startDelay: 2000, endDelay: 2000 },
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
