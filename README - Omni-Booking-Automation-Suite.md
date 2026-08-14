# Omni Booking Automation Suite

An enterprise-grade, multi-engine automation launcher designed to streamline and accelerate the appointment booking process across distinct visa platforms (VFS Global and TLScontact). This suite centralizes high-frequency scheduling tasks, features multi-threaded and asynchronous stealth execution architectures, and integrates robust bypass tools for modern Web Application Firewalls (WAFs).

## 📂 Multi-Engine Repository Structure

```text
omni-booking-automation-suite/
├── core_shared/                # Common utility modules
│   ├── captcha_api.py          # Third-party token injection handling (CapSolver/2Captcha)
│   └── proxy_rotator.py        # Shared centralized IP proxy rotation daemon
├── engines/
│   ├── vfs_netherlands/        # 1. VFS Netherlands Booking Module
│   │   ├── app/
│   │   │   ├── __init__.py     # Credentials and VFS target selectors
│   │   │   ├── browser_manager.py
│   │   │   ├── captcha.py      # Cloudflare Turnstile local click handlermkdir 
│   │   │   ├── gui.py
│   │   │   └── main.py
│   │   └── README.md
│   └── tls_portugal/           # 2. TLScontact Portugal Asynchronous Module
│       ├── src/
│       │   ├── config.py       # Millisecond thresholds and target lists
│       │   ├── async_net.py    # Asynchronous request loop and TCP session pooler
│       │   ├── browser.py      # Stealth engine for session acquisition
│       │   ├── ui_hud.py       # Compact dashboard with Dark/Light theme shifting
│       │   └── run.py
│       └── README.md
├── main_launcher.py            # Central suite entrance gateway
└── README.md

```

---

## 🛠️ Global Installation & Environment Setup

### Prerequisites

* Python 3.10 or 3.11
* Google Chrome (Stable compilation) deployed natively on the host workstation

### Setup Execution

1. Clone the unified automation repository:
```bash
git clone https://github.com/MoedCode/omni-booking-automation-suite.git
cd omni-booking-automation-suite

```


2. Install all global suite dependencies (Covers data parsing, asynchronous loops, UI components, and networking):
```bash
pip install seleniumbase customtkinter pandas openpyxl aiohttp httpx curl_cffi

```


3. Establish the base stealth browser binaries:
```bash
sbase install chromedriver

```



---

# 1. VFS Netherlands Booking Engine (VFSG-Bot)

An advanced automation suite designed to streamline the appointment booking process for VFS Global. This tool features a stealth browser implementation to bypass bot detection, a dedicated captcha monitoring system, and a multi-threaded GUI for real-time control.

## 🚀 Key Features

* **Stealth Browsing:** Built on `SeleniumBase` with Undetected-ChromeDriver (UC) mode to minimize detection by Cloudflare and other WAFs.
* **Intelligent Captcha Solver:** A dedicated monitor (`captcha.py`) that actively hunts for Cloudflare Turnstile challenges and handles them automatically.
* **Dynamic Hunting Loop:** Automatically switches between visa sub-categories to "refresh" the session and catch available slots instantly.
* **Dual Interface:** Includes a modern `CustomTkinter` GUI for ease of use and a Terminal CLI for power users.
* **Human-Like Interaction:** Implements randomized delays and JavaScript-based clicks to mimic human behavior.
* **Instant Alerts:** Auditory alerts (Beeps) triggered immediately upon finding an available slot.

## 📂 Project Structure

```text
engines/vfs_netherlands/
├── app/
│   ├── __init__.py           # Shared configurations, credentials, and selectors
│   ├── browser_manager.py    # Core browser logic (Login, Form Filling, Hunting)
│   ├── captcha.py            # Turnstile/Cloudflare monitoring and interaction
│   ├── gui.py                # Main Dashboard (CustomTkinter)
│   └── main.py               # Entry point (Handles GUI and CLI threads)
└── README.md                 # Engine documentation

```

## ⚙️ Configuration (`app/__init__.py`)

Before running, update the `user` dictionary in `app/__init__.py` with your VFS credentials:

```python
user = {
    "email": "your-email@example.com", 
    "pwd": "your-password"
}

```

You can also modify the `tracking_config` to set your primary target category (e.g., "Tourism" or "Business").

## 🚀 Usage

### Running the Dashboard

Launch the main controller to open the GUI and Terminal simultaneously:

```bash
python engines/vfs_netherlands/app/main.py

```

### Automation Workflow

1. **Launch:** Click "Launch With Chrome" in the GUI.
2. **Automated Login:** The bot will navigate to VFS, handle cookies, enter credentials, and solve any initial captchas.
3. **The Hunt:** Once on the appointment details page, the bot will enter a "Hunting Loop." It selects your target category, checks for slots, and if none are found, switches to an alternative category to reset the session before trying again.
4. **Success:** When a slot is detected, the bot plays a high-pitched alert and stops at the payment/finalization screen for manual completion.

## 🛡️ Captcha Handling Logic

The `captcha.py` module operates as a background observer. It:

1. Scans for Turnstile iframes using multiple CSS selectors.
2. Triggers an audible beep to notify the user if manual intervention is preferred.
3. Attempts to automatically click the verification checkbox.
4. Waits for the "Success!" state before allowing the automation to proceed.

## 📦 Compilation (Creating an EXE)

To bundle the application into a single executable for Windows:

```bash
pyinstaller --noconfirm --onefile --windowed --name "VFS_Netherlands_Bot" \
--add-data "app/__init__.py:app" \
--collect-all seleniumbase \
--collect-all customtkinter \
engines/vfs_netherlands/app/main.py

```

---

# 2. TLScontact Portugal Asynchronous Engine (LTS-Bot)

An ultra-high frequency scheduling suite engineered specifically for TLScontact platforms. It operates with sub-second accuracy using asynchronous network requests, synchronized millisecond scheduling, and real-time user-defined offsets to catch fast-cycling appointment slot releases.

## 🚀 Key Features

* **Asynchronous Execution (`asyncio`):** Drives connection pooling over persistent TCP sessions via `aiohttp` or `httpx` to trigger multiple parallel account requests simultaneously.
* **Millisecond Precision Control:** Utilizing a high-precision `time.perf_counter()` spin-lock loop to release network tasks at specific millisecond offsets (e.g., Instance 1 at :58.100ms, Instance 2 at :58.200ms).
* **Central IP Rotation Sync:** Automatically freezes all processing requests between seconds 45 and 55 of every minute, safely triggering proxy cycling tasks to mask application identities from Anti-bot firewalls.
* **Compact Sliders Interface:** Integrates custom dragging mechanics built on `CustomTkinter` for instant adjustments of targeted firing seconds and millisecond values dynamically mapped from configurations.
* **External Spreadsheet Processing:** On-the-fly dashboard adjustment by parsing operational constraints directly from structural `.xlsx`, `.xls`, or `.csv` arrays.
* **Token Injection Anti-Bot Bypass:** Native hook structure capable of communicating with 2Captcha/CapSolver endpoints to systematically inject resolved reCAPTCHA v2 response tokens straight into the hidden DOM elements.

## 📂 Project Structure

```text
engines/tls_portugal/
├── src/
│   ├── config.py             # Target matrix configurations and TLS SiteKeys
│   ├── async_net.py          # High-frequency event loop handler and spin-locks
│   ├── browser.py            # Stealth session capture integration
│   ├── ui_hud.py             # CustomTkinter dashboard layout with theme switching
│   └── run.py                # Launcher engine entry point
└── README.md                 # Engine documentation

```

## ⚙️ Configuration Matrix (`src/config.py`)

The orchestration grid scales dynamically from sheet datasets. Ensure your configuration arrays capture properties across these explicit structures:

```text
Columns: Account, Password, Hour, Minute, Second, Millisecond, Platform
Example: user1@preparmy.com, Yallavisa@@123, 08, 00, 58, 010, TLS

```

## 🚀 Usage

### Running the Dashboard

Initiate the microsecond execution dashboard panel:

```bash
python engines/tls_portugal/src/run.py

```

### Automation Workflow

1. **Ingest Matrix:** Select "Browse Excel/CSV" within the dashboard frame. The platform dynamically spins up interactive cards with integrated sliders for every identity block mapped.
2. **Proxy Settle Down:** The application timing loops monitor perimeter operations; running threads naturally enter an idle structural hold at second :45 while proxy daemons assign fresh network paths.
3. **High-Precision Trigger:** Moving past second :55, instances step out of coarse sleeping loops into tight CPU check cycles, releasing parallel keep-alive requests targeting internal private APIs exactly at designated millisecond milestones.

## 🛡️ Captcha Handling Logic

The programmatic solver structures request payloads via `core_shared/captcha_api.py`. It:

1. Intercepts the site-specific identification keys during standard layout instantiation.
2. Delivers asynchronous pooling chains targeting solvers to output authentic payload strings.
3. Overrides the backend transactional array by supplying valid response validation keys directly behind the authorization wrappers.

## 📦 Compilation (Creating an EXE)

To compile this engine down into a portable production application payload for end-users:

```bash
pyinstaller --noconfirm --onefile --windowed --name "TLS_Portugal_Bot" \
--add-data "src;src" \
--collect-all customtkinter \
engines/tls_portugal/src/run.py

```

---

## ⚠️ Global Disclaimer

This suite is developed exclusively for technical assessment, educational review, and performance architecture diagnostics under controlled testing parameters. Execution of programmatic loops seeking entry to secure infrastructure outside strict compliance profiles governed by platform operators sits entirely at the risk of the system developer. The code group accepts zero liability concerning platform accessibility restrictions or user configuration anomalies.
