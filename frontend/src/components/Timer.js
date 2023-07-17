import { useState, useEffect } from "react";
import { Typography } from "@mui/material";

function Timer() {
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
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
      setTime(formatTime(seconds));
      console.log(seconds);
      console.log(time);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Typography variant="h4">{time}</Typography>;
}

export default Timer;
