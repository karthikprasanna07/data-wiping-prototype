// src/api.js (technical mock version)

// Fake technical device list
const mockDevices = [
  {
    id: "dev1",
    name: "Disk 0",
    model: "Samsung 870 EVO",
    serialNumber: "SN12345ABC",
    sizeGB: 500,
    type: "SSD",
    interface: "SATA",
    status: "Connected",
  },
  {
    id: "dev2",
    name: "Disk 1",
    model: "Seagate Barracuda",
    serialNumber: "SN98765XYZ",
    sizeGB: 1024,
    type: "HDD",
    interface: "SATA",
    status: "Connected",
  },
  {
    id: "dev3",
    name: "USB Drive",
    model: "SanDisk Ultra Flair",
    serialNumber: "SNUSB556677",
    sizeGB: 32,
    type: "USB",
    interface: "USB 3.0",
    status: "Connected",
  },
];

// Simulated API endpoints
export const getDevices = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data: mockDevices }), 500);
  });

export const startWipe = (device) =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: {
            certId: `CERT-${device.id}-${Date.now()}`,
            device: {
              name: device.name,
              model: device.model,
              serialNumber: device.serialNumber,
              sizeGB: device.sizeGB,
              type: device.type,
              interface: device.interface,
            },
            status: "Wiped Successfully",
            timestamp: new Date().toISOString(),
          },
        }),
      800
    );
  });

export const getCertificate = (id) =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: {
            id,
            verified: true,
            verificationMethod: "SHA256 Checksum",
          },
        }),
      400
    );
  });
