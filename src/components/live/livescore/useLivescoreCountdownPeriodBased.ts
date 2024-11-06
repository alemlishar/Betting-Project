import React, { useState } from "react";
import { Livescore } from "src/components/live/live-api";
import { getTimeDescriptionByMs } from "src/components/live/livescore/utilsLivescore";

export const useLivescoreCountdownPeriodBased = (livescore: Livescore): string => {
  const { stopTimer } = livescore;

  const currentTimeMs = stopTimer
    ? livescore.remainingTimePeriodMs
    : livescore.remainingTimePeriodMs - (new Date().getTime() - livescore.playTimeMs);

  const [time, setTime] = useState(currentTimeMs);
  const [timeDescription, setTimeDescription] = useState("");

  React.useEffect(() => {
    const timerUpdateInterval = setInterval(() => {
      const timeDate = new Date(time);
      timeDate.setSeconds(timeDate.getSeconds() - 5);
      stopTimer ? setTime(livescore.remainingTimePeriodMs) : setTime(timeDate.getTime());
    }, 5000);

    return () => {
      clearInterval(timerUpdateInterval);
    };
  }, [time, stopTimer, livescore.remainingTimePeriodMs]);

  React.useEffect(() => {
    const newTimeDescription = getTimeDescriptionByMs(time);
    setTimeDescription(newTimeDescription);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return timeDescription;
};
