/* Omni-Booking-Automation-Suite/VFS_Portugal/Config/Selectors.js */

/**
 * Semantic Element Descriptors for VFS Global
 * Elements are defined by human-readable semantic attributes
 * rather than hardcoded CSS classes.
 */
const Selectors = {
    common: {
        cookieBanner: {
            container: {
                elementType: "Container",
                selector: "#onetrust-banner-sdk"
            },
            acceptButton: {
                elementType: "Button",
                text: ["Accept All Cookies", "Accept All", "Accept"]
            },
            rejectButton: {
                elementType: "Button",
                text: ["Accept Only Necessary", "Reject All"]
            }
        }
    },

    signIn: {
        email: {
            elementType: "TextInput",
            label: ["Email", "Email*", "E-mail", "Username"],
            placeholder: ["jane.doe@email.com", "email"]
        },
        password: {
            elementType: "TextInput",
            label: ["Password", "Password*"],
            placeholder: ["**********", "password"]
        },
        submitButton: {
            elementType: "Button",
            text: ["Sign In", "Sign in", "Log In"]
        }
    },

    captcha: {
        container: {
            elementType: "Container",
            selector: "app-cloudflare-captcha-container"
        },
        iframe: {
            elementType: "Iframe",
            selector: 'iframe[src*="challenges.cloudflare.com"]'
        },
        responseInput: {
            elementType: "HiddenInput",
            selector: 'input[name="cf-turnstile-response"]'
        }
    },

    dashboard: {
        startNewBooking: {
            elementType: "Button",
            text: ["Start New Booking", "New Booking"]
        }
    },

    appointmentDetails: {
        centerDropdown: {
            elementType: "Container",
            selector: "mat-select[formcontrolname='centerCode']"
        },
        alertBox: {
            elementType: "Container",
            selector: "div[role='alert']"
        }
    },

    yourDetails: {
        pageHeader: { 
            elementType: "Heading", 
            text: ["Your Details"] 
        },
        saveButton: { 
            elementType: "Button", 
            text: ["Save", "Continue"] 
        }
    },

    yourDetailsSummary: {
        pageHeader: {
            elementType: "Heading",
            text: ["Your Details Summary", "Your Details Summary ", " Your Details Summary "]
        },
        submitButton: {
            elementType: "Button",
            text: ["Continue", " Continue ", "Continue "]
        }
    },

    bookAppointment: {
        pageHeader: {
            elementType: "Heading",
            text: ["Book an Appointment", "Book an Appointment ", " Book an Appointment "]
        },
        appointmentTypeRadio: {
            elementType: "Radio",
            label: ["Choose a slot"]
        },
        calendarDates: {
            elementType: "Button",
            text: ["availiable", "available"]
        },
        timeDropdown: {
            elementType: "Dropdown",
            label: ["Choose an appointment time"]
        },
        timeOption: {
            elementType: "Option",
            text: ["All", "Morning", "Afternoon", "Evening"]
        },
        slotRadio: {
            elementType: "Radio",
            label: ["Select"]
        },
        noSlotsAlert: {
            elementType: "Alert",
            text: ["No Slots Available"]
        },
        submitButton: {
            elementType: "Button",
            text: ["Continue", " Continue ", "Continue "]
        }
    },

    services: {
        pageHeader: {
            elementType: "Heading",
            text: ["Services"]
        },
        submitButton: {
            elementType: "Button",
            text: ["Continue", " Continue ", "Continue "]
        }
    },

    review: {
        pageHeader: {
            elementType: "Heading",
            text: ["Review"]
        },
        termsCheckbox: {
            elementType: "Checkbox",
            label: ["I accept theTerms and Conditions", "I accept the Terms and Conditions"]
        },
        submitButton: {
            elementType: "Button",
            text: ["Pay Online", " Pay Online ", "Continue", " Continue "]
        }
    },

    paymentDisclaimer: {
        pageHeader: {
            elementType: "Heading",
            text: ["Payment Disclaimer"]
        },
        submitButton: {
            elementType: "Button",
            text: ["Continue", " Continue ", "I Accept", " I Accept "]
        }
    },

    payFort: {
        pageHeader: {
            elementType: "Heading",
            text: ["Payment Amount", "VFS Global"]
        },
        cardNumber: {
            elementType: "TextInput",
            label: ["Card Number"]
        }
    }
};

module.exports = Selectors;
module.exports = Selectors;