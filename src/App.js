// src/App.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Box,
  Button,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import DeviceList from "./devicelist";
import WipeProgress from "./wipeprogress";
import Certificate from "./certificate";
import { getDevices, startWipe } from "./api";

function App() {
  const [step, setStep] = useState(0); // 0 = select, 1 = wiping, 2 = certificate
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [certData, setCertData] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

  useEffect(() => {
    if (step === 0) {
      getDevices().then((res) => setDevices(res.data));
    }
  }, [step]);

  const handleWipeStart = async () => {
    if (selectedDevices.length === 0) return;
    setStep(1);


  };



  const handleDeviceWipeComplete = async () => {
    if (currentDeviceIndex < selectedDevices.length - 1) {
      // move to next device
      setCurrentDeviceIndex((prev) => prev + 1);
    } else {
      // all devices done, generate certificate for each device separately
      const certs = [];

      for (let id of selectedDevices) {
        const device = devices.find(d => d.id === id);
        if (!device) continue;

        const response = await fetch("http://localhost:5000/generate-certificate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device }), // send one device at a time
        });

        const data = await response.json();
        certs.push(data); // collect each certificate
      }

      setCertData(certs);  // multiple certificate objects
      setStep(2);
    }
  };



  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5", height: "100vh" }}>
      {/* 🔹 Top Bar */}
      <AppBar position="static" sx={{ bgcolor: "#283593" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            WipeX
          </Typography>
          <IconButton color="inherit">
            <HelpOutlineIcon />
          </IconButton>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit">
            <ReportProblemIcon />
          </IconButton>
          <IconButton color="inherit">
            <PowerSettingsNewIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* 🔹 Tabs */}
      <AppBar position="static" color="default" elevation={1}>
        <Tabs
          value={tabValue}
          onChange={(e, newVal) => setTabValue(newVal)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Erasure" />
          <Tab label="Custom Fields" />
          <Tab label="Report" />
        </Tabs>
      </AppBar>

      {/* 🔹 Main Content */}
      <Box
        sx={{
          backgroundColor: "white",
          minHeight: "calc(100vh - 112px)",
          p: 3,
          position: "relative",
        }}
      >
        {/* Device Selection */}
        {step === 0 && tabValue === 0 && (
          <DeviceList
            devices={devices}
            selectedDevices={selectedDevices}
            setSelectedDevices={setSelectedDevices}
          />
        )}

        {/* Wiping Progress for one device at a time */}


        {/* New */}
        {step === 1 && (
          <WipeProgress
            selectedDevices={selectedDevices.map(
              (id) => devices.find((d) => d.id === id)?.name || id
            )}
            onComplete={handleDeviceWipeComplete}
          />
        )}


        {/* Certificate Download after all devices done */}
        {/* Certificate Download after all devices done */}
        {step === 2 && certData && (
          Array.isArray(certData)
            ? certData.map(c => <Certificate key={c.certificate_id} cert={c} />)
            : <Certificate cert={certData} />
        )}



        {/* Other Tabs */}
        {tabValue === 1 && (
          <Typography>Custom fields form will go here.</Typography>
        )}
        {tabValue === 2 && <Typography>Reports section will go here.</Typography>}

        {/* 🔹 Wipe Button (only in device list step) */}
        {step === 0 && tabValue === 0 && selectedDevices.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={handleWipeStart}
            sx={{
              position: "fixed",
              bottom: 60,
              right: 30,
              px: 4,
              py: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 6px 16px rgba(0,0,0,0.2)",
              },
            }}
          >
            Wipe ({selectedDevices.length})
          </Button>

        )}
      </Box>

      {/* 🔹 Footer */}
      <Box
        sx={{
          bgcolor: "#e0e0e0",
          p: 1,
          position: "fixed",
          bottom: 0,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">© 2025 WipeX Prototype</Typography>
      </Box>
    </Box>
  );
}

export default App;
