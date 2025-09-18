# wiper.py
import os
import random
import time

def overwrite_file(file_path, passes=3, progress_callback=None):
    """Overwrite a file multiple times with random bytes."""
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"{file_path} not found")
    
    size = os.path.getsize(file_path)
    with open(file_path, "r+b") as f:
        for p in range(passes):
            f.seek(0)
            for i in range(size):
                f.write(random.randint(0, 255).to_bytes(1, "little"))
                # update progress per byte if needed
                if progress_callback:
                    progress_callback(((p + i/size)/passes) * 100)
            f.flush()
            if progress_callback:
                progress_callback(((p+1)/passes) * 100)
    os.remove(file_path)
    if progress_callback:
        progress_callback(100)

def cryptographic_erase(file_path, progress_callback=None):
    """Simulate cryptographic erase: 1 pass random overwrite."""
    overwrite_file(file_path, passes=1, progress_callback=progress_callback)
