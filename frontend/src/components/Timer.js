// --------------- UNUSED ---------------

import { useState, useEffect } from "react";
import { Typography, Chip } from "@mui/material";

function Timer() {
  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState(`00:00`);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        setTime(formatTime(seconds));
        console.log(seconds);
        console.log(time);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [seconds, isRunning]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  return <Chip label={time} color="primary" variant="outlined" />;
}

export default Timer;
