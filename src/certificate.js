import React from "react";
import { Button, Typography } from "@mui/material";

function Certificate({ cert }) {
  if (!cert) return null;

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h6">Wipe Completed </Typography>
      <Typography>Certificate ID: {cert.certificate_id}</Typography>

      <div style={{ marginTop: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          href={`http://localhost:5000/download-pdf/${cert.pdf_file}`}
          target="_blank"
        >
          Download PDF
        </Button>

        <Button
          variant="outlined"
          style={{ marginLeft: "1rem" }}
          href={`http://localhost:5000/download-json/${cert.json_file}`}
          target="_blank"
        >
          Download JSON
        </Button>
      </div>

      {cert.qr_file && (
        <div style={{ marginTop: "2rem" }}>
          <img
            src={`http://localhost:5000/download-qr/${cert.qr_file}`}
            alt="QR Code"
            style={{ width: "150px" }}
          />
        </div>
      )}
    </div>
  );
}

export default Certificate;
