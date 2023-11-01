"use client";

import React, { useEffect, useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import IconButton from "@mui/material/IconButton";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

type TimerProps = {};

const Timer: React.FC<TimerProps> = () => {
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (showTimer) {
      intervalId = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [showTimer]);

  return (
    <div>
      {showTimer ? (
        <div className="flex items-center space-x-2 bg-dark-fill-3 p-1.5 cursor-pointer rounded hover:bg-dark-fill-2">
          <div>{formatTime(time)}</div>
          <IconButton
            aria-label="toggle password visibility"
            onClick={() => {
              setShowTimer(false);
              setTime(0);
            }}
            edge="end"
          >
            <AutorenewIcon />
          </IconButton>
        </div>
      ) : (
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowTimer(true)}
          edge="end"
        >
          <TimerOutlinedIcon />
        </IconButton>
      )}
    </div>
  );
};
export default Timer;
