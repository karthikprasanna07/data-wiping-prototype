import json
import uuid
import datetime
import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import qrcode

# Certificates folder
CERT_DIR = os.path.join(os.path.dirname(__file__), "certificates")
os.makedirs(CERT_DIR, exist_ok=True)

def generate_certificate(devices_info, method="Secure Purge"):
    
    cert_id = str(uuid.uuid4())
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Verification URL
    verify_url = f"https://wipex-verify.com/certificate/{cert_id}"

    cert_data = {
        "certificate_id": cert_id,
        "timestamp": timestamp,
        "devices": devices_info,
        "method": method,
        "status": "Wipe Completed Successfully",
        "signature": "WipeX-Demo-Signature",
        "verify_url": verify_url
    }

    # Save JSON
    json_file = os.path.join(CERT_DIR, f"cert_{cert_id}.json")
    with open(json_file, "w") as f:
        json.dump(cert_data, f, indent=2)

    # Save PDF
    pdf_file = os.path.join(CERT_DIR, f"cert_{cert_id}.pdf")
    c = canvas.Canvas(pdf_file, pagesize=A4)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, 800, "WipeX Data Wipe Certificate")

    c.setFont("Helvetica", 12)
    c.drawString(100, 760, f"Certificate ID: {cert_id}")
    c.drawString(100, 740, f"Date: {timestamp}")
    c.drawString(100, 720, f"Device: {devices_info.get('device')}")
    c.drawString(100, 700, f"Mountpoint: {devices_info.get('mountpoint')}")
    c.drawString(100, 680, f"Method: {method}")
    c.drawString(100, 660, "Status: Wipe Completed Successfully")
    c.drawString(100, 620, "Digital Signature: WipeX-Demo-Signature")

    # Generate QR code
    qr_img = qrcode.make(verify_url)
    qr_path = os.path.join(CERT_DIR, f"qr_{cert_id}.png")
    qr_img.save(qr_path)

    # Embed QR into PDF
    qr_reader = ImageReader(qr_path)
    c.drawImage(qr_reader, 400, 650, width=100, height=100)
    c.setFont("Helvetica", 10)
    c.drawString(400, 640, "Scan to Verify")

    c.save()

    return {
    "json_file": os.path.basename(json_file),  # <-- only filename
    "pdf_file": os.path.basename(pdf_file),    # <-- only filename
    "qr_file": os.path.basename(qr_path),      # <-- only filename
    "certificate_id": cert_id
}


# Quick test
if __name__ == "__main__":
    device = {"device": "C:\\", "mountpoint": "C:\\"}
    result = generate_certificate(device)
    print("Generated:", result)
