from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import datetime
import threading
from wiper import overwrite_file, cryptographic_erase

app = Flask(__name__)
CORS(app)

# Mock devices
DEVICES = [
    {"id": "dev1", "name": "Hard Disk 1", "size": "500GB"},
    {"id": "dev2", "name": "SSD Drive", "size": "256GB"},
    {"id": "dev3", "name": "USB Stick", "size": "32GB"},
]

# Certificates folder
CERT_DIR = os.path.join(os.path.dirname(__file__), "certificates")
os.makedirs(CERT_DIR, exist_ok=True)

# Track ongoing wipes
WIPE_PROGRESS = {}  # {"device_id": {"percent": 0, "status": "running"}}

# -------------------------
# Wipe endpoint
# -------------------------
@app.route("/wipe", methods=["POST"])
def wipe_device():
    data = request.get_json()
    device = data.get("device")
    file_path = data.get("file_path")
    method = data.get("method", "auto")

    if not os.path.exists(file_path):
        return jsonify({"error": "File/folder not found"}), 404

    WIPE_PROGRESS[device['id']] = {"percent": 0, "status": "running"}

    def progress_callback(p):
        WIPE_PROGRESS[device['id']]["percent"] = int(p)

    def wipe_task():
        try:
            if method == "crypto":
                cryptographic_erase(file_path, progress_callback)
            else:
                overwrite_file(file_path, passes=3, progress_callback=progress_callback)
            WIPE_PROGRESS[device['id']]["status"] = "completed"

            # Generate certificate
            cert_id = f"cert_{device['id']}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
            cert_data = {
                "id": cert_id,
                "device": device,
                "status": "Wiped Successfully",
                "timestamp": datetime.datetime.now().isoformat()
            }

            cert_path = os.path.join(CERT_DIR, f"{cert_id}.txt")
            with open(cert_path, "w") as f:
                f.write(str(cert_data))

            WIPE_PROGRESS[device['id']]["certificate_id"] = cert_id

        except Exception as e:
            WIPE_PROGRESS[device['id']]["status"] = "error"
            WIPE_PROGRESS[device['id']]["error"] = str(e)

    threading.Thread(target=wipe_task).start()
    return jsonify({"status": "Wipe started", "device_id": device['id']})

# -------------------------
# Progress endpoint
# -------------------------
@app.route("/wipe-progress/<device_id>", methods=["GET"])
def get_wipe_progress(device_id):
    progress = WIPE_PROGRESS.get(device_id)
    if not progress:
        return jsonify({"error": "No wipe in progress"}), 404
    return jsonify(progress)

# -------------------------
# Devices endpoint
# -------------------------
@app.route("/devices", methods=["GET"])
def get_devices():
    return jsonify(DEVICES)

# -------------------------
# Certificates
# -------------------------
@app.route("/certificates/<cert_id>", methods=["GET"])
def get_certificate(cert_id):
    cert_path = os.path.join(CERT_DIR, f"{cert_id}.txt")
    if not os.path.exists(cert_path):
        return jsonify({"error": "Certificate not found"}), 404
    with open(cert_path, "r") as f:
        cert_data = f.read()
    return jsonify({"certificate": cert_data})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
