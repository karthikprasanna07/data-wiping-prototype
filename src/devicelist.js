// src/DeviceList.js
import React from "react";

import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Typography,
  Box,
  Divider,
} from "@mui/material";

function DeviceList({ devices, selectedDevices, setSelectedDevices }) {
  const handleToggle = (deviceId) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Select Devices
      </Typography>

      <List>
        {devices.length > 0 ? (
          devices.map((device) => (
            <React.Fragment key={device.id}>
              <ListItem
                onClick={() => handleToggle(device.id)}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "rgba(63,81,181,0.1)",
                  },
                  ...(selectedDevices.includes(device.id) && {
                    backgroundColor: "rgba(63,81,181,0.15)",
                    boxShadow: "0 0 10px rgba(63,81,181,0.2)",
                    transform: "scale(1.01)",
                  }),
                }}
              >

                <Checkbox
                  edge="start"
                  checked={selectedDevices.includes(device.id)}
                  tabIndex={-1}
                  disableRipple
                  sx={{
                    "& .MuiSvgIcon-root": {
                      transition: "transform 0.25s ease, opacity 0.25s ease",
                      transform: selectedDevices.includes(device.id)
                        ? "scale(1.1)"
                        : "scale(0.9)",
                      opacity: selectedDevices.includes(device.id) ? 1 : 0.7,
                    },
                  }}
                />

                <ListItemText
                  primary={device.name}
                  secondary={device.size || "Unknown size"}
                />
              </ListItem>



              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No devices detected.
          </Typography>
        )}
      </List>
    </Box>
  );
}

export default DeviceList;
