from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os
import datetime

# Import your certificate generator
from generate_cert_script import generate_certificate

app = Flask(__name__)
CORS(app)  # allow frontend requests

# Mock device list (replace later with real detection)
DEVICES = [
    {"id": "dev1", "name": "Hard Disk 1", "size": "500GB"},
    {"id": "dev2", "name": "SSD Drive", "size": "256GB"},
    {"id": "dev3", "name": "USB Stick", "size": "32GB"},
]

# Certificates folder
CERT_DIR = os.path.join(os.path.dirname(__file__), "certificates")
os.makedirs(CERT_DIR, exist_ok=True)

# Download PDF
@app.route("/download-pdf/<filename>")
def download_pdf(filename):
    path = os.path.join(CERT_DIR, filename)
    if os.path.exists(path):
        return send_file(path, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

# Download JSON
@app.route("/download-json/<filename>")
def download_json(filename):
    path = os.path.join(CERT_DIR, filename)
    if os.path.exists(path):
        return send_file(path, as_attachment=True)
    return jsonify({"error": "File not found"}), 404

# Download QR
@app.route("/download-qr/<filename>")
def download_qr(filename):
    path = os.path.join(CERT_DIR, filename)
    if os.path.exists(path):
        return send_file(path, as_attachment=True)
    return jsonify({"error": "File not found"}), 404


@app.route("/generate-certificate", methods=["POST"])
def cert():
    device_info = request.json.get("device")  # single device

    # Generate the certificate (JSON + PDF + QR)
    result = generate_certificate(device_info)

    return jsonify(result)  # return JSON metadata for React


@app.route("/devices", methods=["GET"])
def get_devices():
    return jsonify(DEVICES)

@app.route("/wipe", methods=["POST"])
def wipe_device():
    data = request.get_json()
    device = data.get("device")

    # Fake wipe progress (in real system you’d overwrite sectors)
    cert_id = f"cert_{device['id']}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
    cert_data = {
        "id": cert_id,
        "device": device,
        "status": "Wiped Successfully",
        "timestamp": datetime.datetime.now().isoformat()
    }

    # Save mock certificate file (txt only for quick debug)
    cert_path = os.path.join(CERT_DIR, f"{cert_id}.txt")
    with open(cert_path, "w") as f:
        f.write(str(cert_data))

    return jsonify(cert_data)

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
