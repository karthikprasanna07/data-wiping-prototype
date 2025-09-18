// src/WipeProgress.js
import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { motion } from "framer-motion";

function WipeProgress({ selectedDevices, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(selectedDevices.map(() => false));

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);

          // ✅ mark all devices completed
          setCompleted(selectedDevices.map(() => true));

          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        return old + 2;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [onComplete, selectedDevices]);

  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* 🔹 Fade-in heading */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h6" gutterBottom>
          Wiping {selectedDevices.length} device(s)...
        </Typography>
      </motion.div>

      {/* 🔹 Animated circular progress */}
      <motion.div
        animate={{ rotate: progress === 100 ? 0 : 360 }}
        transition={{
          repeat: progress === 100 ? 0 : Infinity,
          duration: 3,
          ease: "linear",
        }}
        style={{ display: "inline-block", marginTop: "30px" }}
      >
        <CircularProgress
          size={160}
          variant="determinate"
          value={progress}
          sx={{
            color: progress === 100 ? "success.main" : "primary.main",
            transition: "color 0.5s ease",
          }}
        />
      </motion.div>

      {/* 🔹 Progress number with smooth fade */}
      <motion.div
        key={progress} // re-animates on every % change
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ position: "absolute", marginTop: "100px" }}
      >
        <Typography variant="h5" component="div" color="textSecondary">
          {`${progress}%`}
        </Typography>
      </motion.div>

      {/* 🔹 Device list with animated checkmark */}
      <Box sx={{ mt: 8, width: "220px" }}>
        {selectedDevices.map((device, index) => (
          <motion.div
            key={device}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>{device}</Typography>
              {completed[index] ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircleIcon color="success" />
                </motion.div>
              ) : (
                <RadioButtonUncheckedIcon color="disabled" />
              )}
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}

export default WipeProgress;
