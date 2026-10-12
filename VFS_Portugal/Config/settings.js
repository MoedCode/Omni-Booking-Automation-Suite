import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
        
        // Your Details Aliases (supports with/without asterisks, spaces, colons)
        firstName: ["first name", "given name", "firstname", "first name*", "firstname*", "name", "givenname"],
        lastName: ["last name", "surname", "lastname", "last name*", "lastname*", "family name", "familyname"],
        dateOfBirth: ["dob", "date of birth", "birth date", "birthdate", "date of birth*", "dob*"],
        passportExpiry: ["passport expiry", "expiry date", "passport expiry date", "passportexpirydate", "passport expiry dat", "passport expiry date*", "expiry date*"],
        contactNumber: ["phone", "phone number", "contact", "mobile", "contactnumber", "contact number*", "phone*", "mobile*"],
        dialCode: ["dial code", "dialcode", "phone code", "dial code*", "country code"],
        nationality: ["current nationality", "nationality", "current nationality*"],
        gender: ["sex", "gender*"],
        passportNumber: ["passport", "passport no", "passport no.", "passport number", "passport number*", "passport#"],
        email: ["email address", "contact email", "email id", "email", "email*"],
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
    switchDelay: 1500,
    autoClose: true,
    attemptSeparator: "Refresh Current Page",
    inputMethod: "fill",
    
    // Default Profile Fallbacks (Used if not provided in sheet or GUI)
    firstName: "MOHAMED",
    lastName: "HASSAN",
    gender: "Male",
    dateOfBirth: "01/01/1990",
    nationality: "EGYPT",
    passportNumber: "A12345678",
    passportExpiry: "01/01/2030",
    dialCode: "20",
    contactNumber: "1000000000",
    email: "",
    appointmentTime: "All",

    // Your Details behaviour
    autoSave: true,            // click Save (after the page's wait) once the form is filled
    dateFormat: "DD/MM/YYYY",  // format the portal's date fields accept
    dateOrder: "DMY",          // how ambiguous dates like 4/1/1989 are read: DMY (4 Jan) or MDY (1 Apr)
    fieldDelayMin: 200,        // random pause between fields (ms) - anti-bot-detection
    fieldDelayMax: 750
};

const terminationCmds = ["exit", "\\q", "q"];
const BROWSER_ARGS = ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox'];
const CHANNEL = '';

const debug = { operationalStatus: true, warnings: true, errors: true };

const actionsConfig = {
    cookies: { priority: 1, startDelay: 150, endDelay: 250 },
    captcha: { priority: 2, startDelay: 150, endDelay: 250 },
    signIn: { priority: 3, startDelay: 150, endDelay: 0 },
    dashboard: { priority: 4, startDelay: 1000, endDelay: 1000 },
    appointmentDetails: { priority: 5, startDelay: 750, endDelay: 1000 },
    yourDetails: { priority: 7, startDelay: 1000, endDelay: 1000 }, // Added Your Details Action Node
    yourDetailsSummary: { priority: 6, startDelay: 1000, endDelay: 1000 },
    bookAppointment: { priority: 8, startDelay: 1000, endDelay: 1000 },
    services: { priority: 9, startDelay: 1000, endDelay: 1000 },
    review: { priority: 10, startDelay: 1000, endDelay: 1000 },
    paymentDisclaimer: { priority: 11, startDelay: 1000, endDelay: 1000 },
    payFort: { priority: 12, startDelay: 1000, endDelay: 1000 },
    default: { priority: 99, startDelay: 50, endDelay: 50 }
};

const cookiesAcceptant = "Accept All"; 

export {
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

export default {
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
