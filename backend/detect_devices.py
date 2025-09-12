import psutil
import json

def detect_devices():
    devices = []
    partitions = psutil.disk_partitions(all=False)

    for p in partitions:
        try:
            usage = psutil.disk_usage(p.mountpoint)
            devices.append({
                "device": p.device,
                "mountpoint": p.mountpoint,
                "fstype": p.fstype,
                "total": f"{usage.total / (1024**3):.2f} GB",
                "used": f"{usage.used / (1024**3):.2f} GB",
                "free": f"{usage.free / (1024**3):.2f} GB",
                "percent": f"{usage.percent} %"
            })
        except PermissionError:
            # Skip partitions we can't access
            continue

    return devices

if __name__ == "__main__":
    devices = detect_devices()
    print(json.dumps(devices, indent=2))
