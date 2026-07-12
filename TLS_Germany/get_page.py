#!/usr/bin/env python
import os
import time
from seleniumbase import Driver

def dump_live_page_html(account_email: str, target_url: str):
    """
    Launches your isolated stealth browser profile, gives you time 
    to manually open the disappearing dropdown, and saves the live HTML.
    """
    # 1. Map to your existing isolated runtime profile folder
    safe_email = "".join([c if c.isalnum() else "_" for c in account_email])
    profile_path = os.path.abspath(f"./runtime_profiles/{safe_email}")
    
    flags = [
        f"--user-data-dir={profile_path}",
        "--window-size=1280,800",
        "--disable-blink-features=AutomationControlled"
    ]
    
    print(f"[🌐] Launching browser with session profile: {safe_email}")
    driver = Driver(uc=True, incognito=False, chromium_arg=",".join(flags))
    
    try:
        # 2. Navigate to your target TLScontact URL
        driver.get(target_url)
        
        # 3. The Countdown Window
        print("\n⏳ ACTION REQUIRED:")
        print("--> You have 8 seconds to click and EXPAND the dropdown menu on the screen now! Don't let go!")
        
        for i in range(8, 0, -1):
            print(f"Capturing live DOM snapshot in {i} seconds...", end="\r")
            time.sleep(1)
            
        # 4. Extract the exact live DOM state
        print("\n\n📸 Snapshot triggered! Extracting raw page source...")
        live_html = driver.page_source
        
        # 5. Save to your local project directory
        os.makedirs("./downloaded_files", exist_ok=True)
        output_file = "./downloaded_files/captured_dropdown_page.html"
        
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(live_html)
            
        print(f"✅ Success! Live HTML saved to: {output_file}")
        print("You can now open this file in VS Code and safely extract your CSS selectors.")
        
    except Exception as e:
        print(f"❌ Error encountered: {e}")
    finally:
        # Keep the browser open briefly for review, then close
        time.sleep(5)
        driver.quit()

if __name__ == "__main__":
    # Test values using your current working structures
    TARGET_ACCOUNT = "tivime8259@preparmy.com"
    TLS_URL = "https://visas-de.tlscontact.com/en-us" 
    
    dump_live_page_html(TARGET_ACCOUNT, TLS_URL)