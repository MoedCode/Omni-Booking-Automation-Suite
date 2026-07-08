import threading
import time

# Simulated function to download a file from a server
def download_file(server_name):
    print(f"Starting download from {server_name}...")
    time.sleep(2)  # Simulates 2 seconds of network/download lag
    print(f"Finished download from {server_name}.")

def main():
    servers = ["Server A", "Server B", "Server C"]
    start_time = time.time()

    print("--- Starting Threaded Downloads ---")
    threads = []
    
    # Create and start a thread for each server download
    for server in servers:
        t = threading.Thread(target=download_file, args=(server,))
        threads.append(t)
        t.start()

    # Wait for all download threads to finish before moving forward
    for t in threads:
        t.join()

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Total threaded execution time: {elapsed_time:.2f} seconds")

if __name__ == "__main__":
    main()