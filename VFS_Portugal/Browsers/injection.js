/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/injection.js */

(function () {
    // Prevent multiple injections
    if (window.__VFS_BOT_INJECTED__) return;
    window.__VFS_BOT_INJECTED__ = true;

    // Load configuration passed from ChromeWorker
    const config = window.BOT_CONFIG || {};

    /**
     * Module 1: Continuous Page Title Modifier
     * Prepend the account email to the page title regardless of Angular routing.
     */
    const updateTitle = () => {
        const prefix = `[${config.account || 'BOT'}] `;
        if (document.title && !document.title.startsWith(prefix)) {
            // Strip any existing brackets to prevent duplication
            document.title = prefix + document.title.replace(/^\[.*?\]\s*/, '');
        }
    };

    // Aggressively observe DOM `<title>` changes
    const titleObserver = new MutationObserver(updateTitle);
    const titleEl = document.querySelector('title');
    if (titleEl) {
        titleObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }
    // Fallback interval to guarantee title injection on full page reloads
    setInterval(updateTitle, 1000);


    /**
     * Module 2: Angular DOM Automator
     * Scans for expected views and interacts with elements based on BOT_CONFIG
     */
    setInterval(() => {
        
        // --- View A: Dashboard ---
        const startBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Start New Booking'));
        if (startBtn && !startBtn.disabled && window.getComputedStyle(startBtn).display !== 'none') {
            startBtn.click();
        }

        // --- View B: Appointment Details ---
        const header = document.querySelector('h1');
        if (header && header.innerText.includes('Appointment Details')) {
            
            // Helper function to handle Angular mat-select interactions
            const selectDropdown = (formControlName, targetText) => {
                if (!targetText) return false;
                
                const trigger = document.querySelector(`mat-select[formcontrolname="${formControlName}"]`);
                if (!trigger) return false;

                const valueSpan = trigger.querySelector('.mat-mdc-select-value-text');
                const currentValue = valueSpan ? valueSpan.innerText : '';
                
                // Return true if the required value is already selected
                if (currentValue.toLowerCase().includes(targetText.toLowerCase())) {
                    return true; 
                }
                
                const panelId = trigger.getAttribute('aria-controls');
                const panel = document.getElementById(panelId);
                
                if (!panel) {
                    // Open the dropdown panel
                    trigger.click(); 
                } else {
                    // Search for the matching mat-option and click it
                    const options = Array.from(panel.querySelectorAll('mat-option'));
                    const targetOpt = options.find(opt => opt.innerText.toLowerCase().includes(targetText.toLowerCase()));
                    if (targetOpt) {
                        targetOpt.click();
                    }
                }
                return false;
            };

            // Process dropdowns sequentially to prevent UI overlap failures
            const isCenterDone = selectDropdown('centerCode', config.city);
            if (isCenterDone) {
                const isCatDone = selectDropdown('selectedSubvisaCategory', config.appointmentCategory);
                if (isCatDone) {
                    const isSubCatDone = selectDropdown('visaCategoryCode', config.subCategory);
                    
                    if (isSubCatDone) {
                        const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Continue'));
                        if (continueBtn && !continueBtn.disabled) {
                            continueBtn.click();
                        }
                    }
                }
            }
        }
    }, 1500); 

})();