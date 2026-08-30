// ==UserScript==
// @name         VFS EGYPT→portoghal Bot (Pro Version)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  VFS booking automation for EGYPT→ portoghal with Auto-Retry, Keep-Alive, and Editable DOM Auto-Detect
// @author       Antigravity (Upgraded)
// @match       https://visa.vfsglobal.com/egy/en/prt/login*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    let capturedData = {
        authorize: GM_getValue("authorize", ""),
        clientsource: GM_getValue("clientsource", "")
    };

    // Auto-detected variables from DOM
    let autoCenterCode = "";
    let autoCategoryCode = "";

    // Modern Interface
    GM_addStyle(`
      #vfs-panel {
        position: fixed;
        top: 50px;
        left: 20px;
        width: 450px;
        background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
        color: #fff;
        border-radius: 20px;
        padding: 24px;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        font-size: 13px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        z-index: 999999;
        max-height: 90vh;
        overflow-y: auto;
        border: 1px solid #4a5568;
      }
      #vfs-toggle {
        position: fixed;
        top: 8px;
        left: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 8px 20px;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        cursor: pointer;
        z-index: 1000000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      }
      .profile-section {
        background: rgba(255,255,255,0.05);
        border-radius: 15px;
        padding: 16px;
        margin-bottom: 20px;
        border: 1px solid #4a5568;
      }
      .profile-selector {
        width: 100%;
        padding: 12px 16px;
        border-radius: 10px;
        border: 1px solid #718096;
        background: #2d3748;
        color: #fff;
        font-size: 14px;
        margin-bottom: 12px;
      }
      .btn {
        color: white;
        border: none;
        padding: 12px 16px;
        margin: 4px 2px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.2s;
      }
      .btn:hover { opacity: 0.9; transform: translateY(-1px); }
      .btn-primary { background: #3182ce; }
      .btn-success { background: #38a169; }
      .btn-danger { background: #e53e3e; }
      .btn-ultra { background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); font-size: 15px; }
      .log-area {
        background: #000;
        border-radius: 12px;
        padding: 16px;
        height: 250px;
        overflow-y: auto;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        margin-top: 15px;
        color: #48bb78;
        border: 1px solid #4a5568;
      }
      .profile-form {
        display: none;
        background: rgba(0,0,0,0.2);
        border-radius: 12px;
        padding: 16px;
        margin-top: 12px;
      }
      .profile-form input, .profile-form select {
        width: 100%;
        padding: 10px 12px;
        margin: 6px 0;
        border: 1px solid #4a5568;
        border-radius: 8px;
        background: #1a202c;
        color: #fff;
        font-size: 13px;
      }
      .auto-input {
        background: #1a202c;
        color: #48bb78;
        border: 1px solid #4a5568;
        padding: 6px 10px;
        border-radius: 6px;
        width: calc(100% - 90px);
        font-weight: bold;
        font-family: monospace;
      }
      .auto-input:focus { outline: none; border-color: #48bb78; }
    `);

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "vfs-toggle";
    toggleBtn.innerHTML = 'eg➡️port EGYPT→portoghal';
    document.body.appendChild(toggleBtn);

    const panel = document.createElement("div");
    panel.id = "vfs-panel";
    panel.innerHTML = `
        <h3 style="margin-top:0; color:#e2e8f0; border-bottom:1px solid #4a5568; padding-bottom:10px;">eg➡️it VFS EGYPT→portoghal</h3>

        <div class="profile-section">
            <select id="profileSelector" class="profile-selector">
                <option value="">Select a profile...</option>
            </select>
            <button id="newProfileBtn" class="btn btn-primary" style="width: 100%;">➕ New Profile</button>

            <div id="profileForm" class="profile-form">
                <input type="text" id="profileName" placeholder="Profile Name">
                <input type="text" id="firstName" placeholder="First Name (e.g.: SOUAD)">
                <input type="text" id="lastName" placeholder="Last Name (e.g.: DERGHOUM)">
                <input type="email" id="email" placeholder="Email" value="ezzeldein078@gmail.com">
                <input type="text" id="contactNumber" placeholder="Phone (e.g.: 550089654)">
                <input type="text" id="passportNumber" placeholder="Passport Number">
                <input type="date" id="dateOfBirth" placeholder="Date of birth">
                <input type="date" id="passportExpiry" placeholder="Passport Expiry">
                <select id="gender">
                    <option value="">Select Gender</option>
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                </select>
                <button id="saveProfileBtn" class="btn btn-success" style="width: 100%;">💾 Save</button>
            </div>
        </div>

        <div class="status-section" style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:15px;">
            <div>Auth: <span id="authVal">⏳</span></div>
            <div>Client: <span id="clientVal">⏳</span></div>
            <div>Status: <span id="statusVal" style="color:#ecc94b;">🟡 Waiting</span></div>
        </div>

        <div class="profile-section">
            <h4 style="margin:0 0 10px 0; color:#a0aec0;">🤖 DOM Auto-Detection (Editable)</h4>
            <div style="margin-bottom: 8px; display: flex; align-items: center;">
                <strong style="width: 80px;">📍 Center:</strong>
                <input type="text" id="autoCenterInput" class="auto-input" placeholder="Click site to detect" />
            </div>
            <div style="display: flex; align-items: center;">
                <strong style="width: 80px;">🛂 Category:</strong>
                <input type="text" id="autoCategoryInput" class="auto-input" placeholder="Click site to detect" />
            </div>
            <div style="font-size: 11px; color: #718096; margin-top: 10px;">(السكريبت بيلقط الأكواد ويحطها هنا. تقدر تعدلها بإيدك)</div>
        </div>

        <div style="text-align: center;">
            <select id="dateMode" class="profile-selector" style="margin-bottom: 12px;">
                <option value="earliest">🕒 Choose the earliest date (Earliest)</option>
                <option value="random">🎲 Choose a random date (Random)</option>
            </select>
            <button id="bookingBtn" class="btn btn-ultra" style="width: 100%;">
                🚀 Start Booking Process
            </button>
            <button id="clearBtn" class="btn btn-danger" style="width: 100%; margin-top: 10px;">🗑️ Clear Data</button>
        </div>
        <div class="log-area" id="logArea"></div>
    `;
    document.body.appendChild(panel);

    // References to elements
    const authSpan = document.getElementById("authVal");
    const clientSpan = document.getElementById("clientVal");
    const statusSpan = document.getElementById("statusVal");
    const logArea = document.getElementById("logArea");
    const profileSelector = document.getElementById("profileSelector");
    const newProfileBtn = document.getElementById("newProfileBtn");
    const profileForm = document.getElementById("profileForm");
    const saveProfileBtn = document.getElementById("saveProfileBtn");
    const bookingBtn = document.getElementById("bookingBtn");
    const clearBtn = document.getElementById("clearBtn");
    const dateModeSelect = document.getElementById("dateMode");
    const autoCenterInput = document.getElementById("autoCenterInput");
    const autoCategoryInput = document.getElementById("autoCategoryInput");

    function addLog(message) {
        const timestamp = new Date().toLocaleTimeString();
        logArea.innerHTML += `<div><span style="color:#a0aec0;">[${timestamp}]</span> ${message}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
    }

    function updateUI() {
        authSpan.textContent = capturedData.authorize ? "✅" : "❌";
        clientSpan.textContent = capturedData.clientsource ? "✅" : "❌";
        const allCaptured = capturedData.authorize && capturedData.clientsource;
        if (allCaptured) {
            statusSpan.innerHTML = '<span style="color:#48bb78;">🟢 Ready</span>';
        }
    }

    function setCapturedData(key, value) {
        if (value && value !== capturedData[key]) {
            capturedData[key] = value;
            GM_setValue(key, value);
            addLog(`🔑 ${key} captured successfully`);
            updateUI();
        }
    }

    // Intercept XHR requests to capture tokens
    const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        if (header.toLowerCase() === "authorize" || header.toLowerCase() === "authorization") {
            setCapturedData("authorize", value);
        }
        if (header.toLowerCase() === "clientsource") {
            setCapturedData("clientsource", value);
        }
        return origSetHeader.apply(this, arguments);
    };

    // ── ADVANCED DOM AUTO-DETECT LOGIC (WITH AUTO-CORRECT) ───────────────
    document.addEventListener('click', (e) => {
        const matOption = e.target.closest('mat-option');
        if (matOption) {
            let id = matOption.id;
            if (!id) return;

            // Auto-correct known VFS weirdness
            if (id === 'apl') id = 'Apel';
            if (id === 'Long ') id = 'Long'; // trim stray spaces

            if (id === 'POCA' || id === 'POAL') {
                autoCenterInput.value = id;
                addLog(`🎯 لقط المركز: [${id}]`);
            } else {
                autoCategoryInput.value = id;
                addLog(`🎯 لقط فئة التأشيرة: [${id}]`);
            }
        }
    });
    // ────────────────────────────────────────────────────────────────────────

    // Profile Management
    function loadProfiles() {
        const profiles = JSON.parse(GM_getValue('vfsProfiles', '{}'));
        profileSelector.innerHTML = '<option value="">Select a profile...</option>';
        Object.keys(profiles).forEach(profileName => {
            const option = document.createElement('option');
            option.value = profileName;
            option.textContent = `👤 ${profileName}`;
            profileSelector.appendChild(option);
        });
    }

    function saveProfile() {
        const profileName = document.getElementById('profileName').value.trim();
        if (!profileName) {
            addLog("❌ Profile name required");
            return;
        }

        const profileData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            contactNumber: document.getElementById('contactNumber').value,
            passportNumber: document.getElementById('passportNumber').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            passportExpiry: document.getElementById('passportExpiry').value,
            gender: document.getElementById('gender').value
        };

        const profiles = JSON.parse(GM_getValue('vfsProfiles', '{}'));
        profiles[profileName] = profileData;
        GM_setValue('vfsProfiles', JSON.stringify(profiles));

        addLog(`💾 Profile "${profileName}" saved`);
        loadProfiles();
        profileForm.style.display = 'none';
        profileSelector.value = profileName;
        loadSelectedProfile();
    }

    function loadSelectedProfile() {
        const selectedProfile = profileSelector.value;
        if (!selectedProfile) return;

        const profiles = JSON.parse(GM_getValue('vfsProfiles', '{}'));
        const profileData = profiles[selectedProfile];
        if (profileData) {
            Object.keys(profileData).forEach(key => {
                const element = document.getElementById(key);
                if (element) element.value = profileData[key] || '';
            });
            addLog(`👤 Profile "${selectedProfile}" loaded`);
        }
    }

    function formatDateForPayload(d) {
        if (!d) return null;
        if (d.includes("-")) {
            let [yyyy, mm, dd] = d.split("-");
            return `${dd}/${mm}/${yyyy}`;
        }
        return d;
    }

    // ── FETCH UTILITY WITH AUTO-RETRY & JITTER ───────────────────
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function fetchWithRetryAndJitter(url, options, maxRetries = 3, timeout = 30000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const fetchPromise = fetch(url, options);
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout exceeded')), timeout));

                const response = await Promise.race([fetchPromise, timeoutPromise]);

                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After');
                    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 3000 + Math.random() * 2000;
                    addLog(`⚠️ Rate limit (429). Waiting ${Math.round(waitTime/1000)}s...`);
                    await sleep(waitTime);
                    continue;
                }
                if (response.status >= 500 && response.status <= 599) {
                    const waitTime = 2000 + Math.random() * 2000;
                    addLog(`⚠️ Server error (${response.status}). Retrying in ${Math.round(waitTime/1000)}s...`);
                    await sleep(waitTime);
                    continue;
                }
                return response;

            } catch (error) {
                if (i === maxRetries - 1) throw error;
                const waitTime = 1000 + Math.random() * 2000;
                addLog(`⚠️ Network error: ${error.message}. Retrying...`);
                await sleep(waitTime);
            }
        }
        throw new Error("Maximum number of retries reached");
    }

    // ── KEEP-ALIVE SESSION ──────────────────────────────────────────
    function startKeepAlive() {
        setInterval(() => {
            if (capturedData.authorize && capturedData.clientsource) {
                fetch("https://lift-api.vfsglobal.com/master/missioncenter", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json;charset=UTF-8",
                        "authorize": capturedData.authorize,
                        "clientsource": capturedData.clientsource,
                        "route": "egy/en/mlt"
                    },
                    body: JSON.stringify({ countryCode: "egy", missionCode: "prt" })
                }).catch(() => {});
            }
        }, 4 * 60 * 1000);
    }

    // ── API FUNCTIONS ─────────────────────────────────────────────────────────

    function sendApplicantRequest(centerCode, categoryCode) {
        try {
            addLog("🚀 Sending applicants request...");
            if (!capturedData.authorize || !capturedData.clientsource) {
                addLog("❌ Missing authentication tokens - cannot continue");
                return Promise.resolve({ success: false, error: "Missing tokens" });
            }

            const email = document.getElementById('email')?.value?.trim() || "ezzeldein078@gmail.com";
            const firstName = document.getElementById('firstName')?.value?.trim()?.toUpperCase() || '';
            const lastName = document.getElementById('lastName')?.value?.trim()?.toUpperCase() || '';
            const passportNumber = document.getElementById('passportNumber')?.value?.trim()?.toUpperCase() || '';
            let contactNumber = document.getElementById('contactNumber')?.value?.trim() || '';

            if (contactNumber.startsWith('0')) {
                contactNumber = contactNumber.substring(1);
            }

            const dateOfBirth = formatDateForPayload(document.getElementById('dateOfBirth')?.value || '');
            const passportExpiry = formatDateForPayload(document.getElementById('passportExpiry')?.value || '');

            addLog(`📋 Using Config: Center [${centerCode}], Category [${categoryCode}]`);

            if (!email || !firstName || !lastName || !passportNumber || !contactNumber || !dateOfBirth || !passportExpiry) {
                addLog("❌ Please fill all profile fields completely.");
                return Promise.resolve({ success: false, error: "Missing profile data" });
            }

            addLog("✅ Data validated, building payload...");

            const payload = {
                centerCode: centerCode,
                countryCode: "egy",
                feeEntryTypeCode: null,
                feeExemptionDetailsCode: null,
                feeExemptionTypeCode: null,
                isEdit: false,
                isWaitlist: false,
                juridictionCode: null,
                languageCode: "en-US",
                loginUser: email,
                missionCode: "prt",
                regionCode: null,
                visaCategoryCode: categoryCode,
                applicantList: [{
                    urn: "",
                    arn: "",
                    centerClassCode: null,
                    loginUser: email,
                    firstName: firstName,
                    employerFirstName: "",
                    middleName: "",
                    lastName: lastName,
                    employerLastName: "",
                    salutation: "",
                    gender: parseInt(document.getElementById('gender')?.value) || 1,
                    nationalId: null,
                    VisaToken: null,
                    employerContactNumber: "",
                    contactNumber: contactNumber,
                    dialCode: "20",
                    employerDialCode: "",
                    passportNumber: passportNumber,
                    confirmPassportNumber: null,
                    passportExpirtyDate: passportExpiry,
                    dateOfBirth: dateOfBirth,
                    emailId: email,
                    employerEmailId: "",
                    nationalityCode: "egy",
                    state: null,
                    city: null,
                    isEndorsedChild: false,
                    applicantType: 0,
                    addressline1: null,
                    addressline2: null,
                    pincode: null,
                    referenceNumber: null,
                    vlnNumber: null,
                    applicantGroupId: 0,
                    parentPassportNumber: "",
                    parentPassportExpiry: "",
                    dateOfDeparture: null,
                    entryType: "",
                    eoiVisaType: "",
                    passportType: "",
                    vfsReferenceNumber: "",
                    familyReunificationCerificateNumber: "",
                    PVRequestRefNumber: "",
                    PVStatus: "",
                    PVStatusDescription: "",
                    PVCanAllowRetry: true,
                    PVisVerified: false,
                    eefRegistrationNumber: "",
                    helloVerifyNumber: "",
                    OfflineCClink: "",
                    idenfystatuscheck: false,
                    vafStatus: null,
                    SpecialAssistance: "",
                    AdditionalRefNo: null,
                    juridictionCode: "",
                    canInitiateVAF: false,
                    canEditVAF: false,
                    canDeleteVAF: false,
                    canDownloadVAF: false,
                    Retryleft: "",
                    ipAddress: "105.235.129.208",
                    isAutoRefresh: true
                }]
            };

            return fetchWithRetryAndJitter("https://lift-api.vfsglobal.com/appointment/applicants", {
                method: "POST",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "accept-encoding": "gzip, deflate, br, zstd",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/json;charset=UTF-8",
                    "authorize": capturedData.authorize,
                    "clientsource": capturedData.clientsource,
                    "origin": "https://visa.vfsglobal.com",
                    "referer": "https://visa.vfsglobal.com/",
                    "route": "egy/en/mlt",
                    "sec-ch-ua": '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"'
                },
                credentials: "include",
                body: JSON.stringify(payload)
            })
            .then(res => {
                addLog(`🚀 Applicants response status: ${res.status}`);
                return res.text().then(text => ({ status: res.status, text: text }));
            })
            .then(({ status, text }) => {
                if (status !== 200) {
                    addLog(`❌ HTTP error applicants: ${status}`);
                    return { success: false, error: `HTTP ${status}` };
                }

                try {
                    const data = JSON.parse(text);
                    let urn = data.urn || (data.data && data.data.urn) || (data.applicantList && data.applicantList[0] && data.applicantList[0].urn);

                    if (urn) {
                        GM_setValue('lastUrn', urn);
                        addLog(`✅ URN created: ${urn}`);
                        return { success: true, urn: urn };
                    } else {
                        if (data.error) {
                            addLog(`❌ API Error (${data.error.code}): ${data.error.description}`);
                            return { success: false, error: `API Error ${data.error.code}` };
                        } else {
                            addLog(`❌ No URN in response`);
                            return { success: false, error: "No URN found" };
                        }
                    }
                } catch (e) {
                    addLog(`❌ JSON parsing error applicants: ${e.message}`);
                    return { success: false, error: `Parse error` };
                }
            })
            .catch(error => {
                addLog(`❌ Network error applicants: ${error.message}`);
                return { success: false, error: `Network error` };
            });

        } catch (error) {
            addLog(`❌ General error: ${error.message}`);
            return Promise.resolve({ success: false, error: `General error` });
        }
    }

    // ── FIXED GET CALENDAR FUNCTION ───────────────────────────────────────
    function getCalendar(urn, centerCode, categoryCode) {
        addLog("📅 Fetching calendar...");
        const email = document.getElementById('email').value.trim() || "ezzeldein078@gmail.com";
        const today = new Date();
        const fromDate = ("0" + today.getDate()).slice(-2) + "/" + ("0" + (today.getMonth() + 1)).slice(-2) + "/" + today.getFullYear();

        const payload = {
            countryCode: "egy",
            missionCode: "prt",
            centerCode: centerCode, // ⚠️ Changed from vacCode to match Italy API
            loginUser: email,
            fromDate: fromDate,
            payCode: "",
            urn: urn,
            visaCategoryCode: categoryCode
        };

        return fetchWithRetryAndJitter("https://lift-api.vfsglobal.com/appointment/calendar", {
            method: "POST",
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
                "authorize": capturedData.authorize,
                "clientsource": capturedData.clientsource,
                "route": "egy/en/mlt"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })
        .then(res => res.text().then(text => ({ status: res.status, text: text })))
        .then(({ status, text }) => {
            if (status !== 200) return { success: false };
            try {
                const data = JSON.parse(text);
                if (data.calendars && data.calendars.length > 0) {
                    const availableDates = data.calendars
                        .filter(cal => !cal.isWeekend)
                        .map(cal => cal.date)
                        .sort();

                    if (availableDates.length > 0) {
                        addLog(`📅 ${availableDates.length} available dates found`);
                        return { success: true, date: availableDates[0], allDates: availableDates };
                    } else {
                        addLog("❌ No non-weekend dates available");
                        return { success: false };
                    }
                } else {
                    addLog("❌ No calendar in the response");
                    return { success: false };
                }
            } catch (e) {
                return { success: false };
            }
        });
    }

    // ── FIXED GET TIMESLOTS FUNCTION ──────────────────────────────────────
    function getTimeSlots(urn, slotDate, centerCode, categoryCode) {
        addLog(`⏰ Fetching timeslots for ${slotDate}...`);
        const email = document.getElementById('email').value.trim() || "ezzeldein078@gmail.com";

        const payload = {
            countryCode: "egy",
            missionCode: "prt",
            centerCode: centerCode, // ⚠️ Changed from vacCode to match Italy API
            loginUser: email,
            slotDate: slotDate,
            urn: urn,
            visaCategoryCode: categoryCode
        };

        return fetchWithRetryAndJitter("https://lift-api.vfsglobal.com/appointment/timeslot", {
            method: "POST",
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
                "authorize": capturedData.authorize,
                "clientsource": capturedData.clientsource,
                "route": "egy/en/mlt"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })
        .then(res => res.text().then(text => ({ status: res.status, text: text })))
        .then(({ status, text }) => {
            if (status !== 200) return { success: false };
            try {
                const data = JSON.parse(text);
                if (data.slots && data.slots.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.slots.length);
                    const selectedSlot = data.slots[randomIndex];
                    addLog(`🔗 AllocationId: ${selectedSlot.allocationId}`);
                    return { success: true, slot: selectedSlot, allocationId: selectedSlot.allocationId, finalDate: slotDate };
                } else {
                    addLog("❌ No timeslot available");
                    return { success: false, reason: "no_slots" };
                }
            } catch (e) {
                return { success: false, reason: "parse_error" };
            }
        });
    }

    // ── FIXED SCHEDULE APPOINTMENT FUNCTION ───────────────────────────────
    function scheduleAppointment(urn, selectedDate, selectedSlot, centerCode) {
        addLog("📅 Scheduling appointment...");
        const email = document.getElementById('email').value.trim() || "ezzeldein078@gmail.com";
        const allocationId = selectedSlot.allocationId || selectedSlot;

        const payload = {
            missionCode: "prt",
            countryCode: "egy",
            centerCode: centerCode, // ⚠️ Changed from vacCode to match Italy API
            loginUser: email,
            urn: urn,
            aurn: null,
            notificationType: "none",
            paymentdetails: {
                paymentmode: "Online",
                RequestRefNo: "",
                clientId: "",
                merchantId: "",
                amount: 4510,
                currency: "EGP"
            },
            allocationId: allocationId,
            CanVFSReachoutToApplicant: false,
            TnCConsentAndAcceptance: true
        };

        return fetchWithRetryAndJitter("https://lift-api.vfsglobal.com/appointment/schedule", {
            method: "POST",
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json;charset=UTF-8",
                "authorize": capturedData.authorize,
                "clientsource": capturedData.clientsource,
                "route": "egy/en/mlt"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        })
        .then(res => res.text().then(text => ({ status: res.status, text: text })))
        .then(({ status, text }) => {
            if (status !== 200) return { success: false, error: `HTTP ${status}` };
            try {
                const data = JSON.parse(text);
                if (data.error || data.code) return { success: false, error: data.description || data.error };

                const isSuccess = data.IsAppointmentBooked === true || data.status === "success" || data.URL || data.payLoad || !data.error;

                if (isSuccess) {
                    if (data.URL && data.payLoad) {
                        window.location.href = data.URL.includes("payLoad") ? data.URL : `${data.URL}?payLoad=${encodeURIComponent(data.payLoad)}`;
                    } else if (data.URL) {
                        window.location.href = data.URL;
                    } else {
                        window.location.href = `https://payments.vfsglobal.eg/PG-Component/Payment/PayRequest`;
                    }
                    addLog("🎉 Booking confirmed! Redirecting...");
                    return { success: true, data: data, allocationId: allocationId };
                } else {
                    return { success: false, error: "appointment_not_confirmed" };
                }
            } catch (e) {
                return { success: false, error: e.message };
            }
        });
    }

    // ── MAIN PROCESS ───────────────────────────────────────────────────

    async function startBookingProcess() {
        if (!profileSelector.value) {
            addLog("❌ Please select a profile first");
            return;
        }
        if (!capturedData.authorize || !capturedData.clientsource) {
            addLog("❌ Missing tokens. Navigate the VFS site to capture them.");
            return;
        }

        const centerCode = autoCenterInput.value.trim();
        const categoryCode = autoCategoryInput.value.trim();

        if (!centerCode || !categoryCode) {
            addLog("❌ أرجوك قم باختيار المركز ونوع التأشيرة من الموقع (أو اكتبهم في الخانات).");
            return;
        }

        addLog("🚀 Starting booking process...");
        try {
            const applicantResult = await sendApplicantRequest(centerCode, categoryCode);
            if (!applicantResult.success) throw new Error(`Applicant failed: ${applicantResult.error}`);

            const urn = applicantResult.urn;
            const calResult = await getCalendar(urn, centerCode, categoryCode);
            if (!calResult.success || !calResult.allDates || calResult.allDates.length === 0) {
                throw new Error("No available dates in the calendar.");
            }

            const dateMode = dateModeSelect.value || "earliest";
            let selectedDateRaw = (dateMode === "earliest") ? calResult.allDates[0] : calResult.allDates[Math.floor(Math.random() * calResult.allDates.length)];

            const parts = selectedDateRaw.split('/');
            const slotDateForApi = `${parts[1]}/${parts[0]}/${parts[2]}`;
            addLog(`📅 Selected date for API: ${slotDateForApi}`);

            const slotResult = await getTimeSlots(urn, slotDateForApi, centerCode, categoryCode);
            if (!slotResult.success) throw new Error(`No timeslot for ${slotDateForApi}.`);

            const scheduleResult = await scheduleAppointment(urn, slotDateForApi, slotResult.slot, centerCode);
            if (!scheduleResult.success) throw new Error(`Scheduling failed: ${scheduleResult.error}`);

            addLog("🎉 PROCESS COMPLETED SUCCESSFULLY!");

        } catch (error) {
            addLog(`❌ Error: ${error.message}`);
        }
    }

    // ── EVENT LISTENERS ───────────────────────────────────────────────────────

    toggleBtn.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    newProfileBtn.addEventListener('click', () => {
        profileForm.style.display = profileForm.style.display === 'none' ? 'block' : 'none';
    });

    saveProfileBtn.addEventListener('click', saveProfile);
    profileSelector.addEventListener('change', loadSelectedProfile);
    bookingBtn.addEventListener('click', startBookingProcess);

    clearBtn.addEventListener('click', () => {
        GM_setValue('vfsProfiles', '{}');
        loadProfiles();
        logArea.innerHTML = '';
        autoCenterInput.value = "";
        autoCategoryInput.value = "";
        addLog("🗑️ Data cleared");
    });

    // ── INITIALIZATION ────────────────────────────────────────────────────────
    updateUI();
    loadProfiles();
    startKeepAlive();
    addLog("🚀 VFS EGYPT Bot loaded (Editable Auto-Detect v1.7)");
    addLog("📋 Step 1: Capture tokens on VFS site.");
    addLog("📋 Step 2: اختر المركز ونوع التأشيرة في الموقع ليتم حفظهم تلقائياً هنا.");
    addLog("📋 Step 3: تأكد من الأكواد في الخانات، ثم اضغط 'Start Booking'.");

})();