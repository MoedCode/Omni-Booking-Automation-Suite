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
    }
};

module.exports = Selectors;