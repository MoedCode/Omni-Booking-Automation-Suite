import time
from seleniumbase import SB
from selenium.common.exceptions import WebDriverException, NoSuchWindowException

def open_vfs_website(url, headless=False):
    with SB(uc=True, headless=headless) as sb:
        print(f"Opening VFS (Headless: {headless})...")
        sb.open(url)
        print("Page loaded successfully.")
        print("[Status] Running... Close the Chrome window or press Ctrl+C to stop.")

        consecutive_errors = 0
        max_errors = 3  # Only exit if the window fails to respond 3 times in a row

        while True:
            try:
                # 1. Check if user pressed Ctrl+C or windows are gone
                handles = sb.driver.window_handles
                if not handles or len(handles) == 0:
                    print("\n[Event] Browser window closed by user.")
                    break

                # 2. Ping active window state
                _ = sb.driver.title
                
                # Reset error counter on successful ping
                consecutive_errors = 0
                time.sleep(1)

            except KeyboardInterrupt:
                print("\n[Event] Manual interruption (Ctrl+C).")
                break

            except (NoSuchWindowException, WebDriverException) as e:
                consecutive_errors += 1
                if consecutive_errors >= max_errors:
                    print(f"\n[Event] Browser disconnected permanently: {e}")
                    break
                time.sleep(1)

            except Exception as e:
                print(f"\n[Warning] Transient error ignored: {e}")
                time.sleep(1)

        print("Exiting context manager...")

    print("Cleanup complete. Browser terminated.")


if __name__ == "__main__":
    target_url = "https://visa.vfsglobal.com/egy/en/prt/login"
    open_vfs_website(target_url, headless=False)
    
    
''' previous implementation
import time
from seleniumbase import SB

def open_vfs_website(url, headless=False):
    """
    Opens the VFS login page and keeps the browser running 
    directly in the main thread until manual user action.
    """
    # What: Initialize SeleniumBase with Undetected ChromeDriver (uc=True)
    # Why: Bypasses Cloudflare bot detection on VFS Global without extra thread overhead.
    with SB(uc=True, headless=headless) as sb:
        print(f"Opening VFS (Headless: {headless})...")
        
        # What: Navigate directly to the URL
        # Why: Loads the target page into the active session.
        sb.open(url)
        print("Page loaded successfully.")

        try:
            # What: Halt execution right here inside the 'with' block
            # Why: As long as the script waits at input(), the 'with' block 
            # remains active and the browser stays open.
            input("\n[Browser Active] Press ENTER or Ctrl+C in this terminal to close the browser...\n")
            
        except KeyboardInterrupt:
            # What: Catch manual termination via terminal (Ctrl+C)
            # Why: Prevents ugly stack traces when you stop the script manually.
            print("\nTermination signal received.")

        print("Exiting context... closing browser.")
        
    # What: Exiting the 'with' scope triggers driver cleanup
    # Why: Gracefully shuts down Chrome and terminates all driver processes.
    print("Browser closed successfully.")


if __name__ == "__main__":
    target_url = "https://visa.vfsglobal.com/egy/en/prt/login"
    
    # Run synchronously in the foreground
    open_vfs_website(target_url, headless=True)
'''
