import threading
import time

def task(name, delay=2):
    print(f"{name} is starting")
    time.sleep(delay)
    print(f"{name} has finished")

# Create two threads
thread1 = threading.Thread(target=task, args=("Process A",2))
thread2 = threading.Thread(target=task, args=("Process B",3))

# Start both threads
print("Main thread: Starting worker threads")
thread1.start()
thread2.start()

print("Main thread: Worker threads are running...")

# Wait for both threads to complete
thread1.join()
# thread2.join()
print("Main thread: Worker threads have Terminated")