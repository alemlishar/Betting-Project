import React from "react";
import { Livescore } from "src/components/live/live-api";
import configuration from "src/helpers/configuration";
import { getCurrentTimeMs, getTimeDescription } from "src/components/live/livescore/utilsLivescore";

export const useLivescoreTimerBased = (livescore: Livescore): string => {
  const { normalTimeHalfDurationMs, playTimeMs, addPlayTimeMs } = livescore;
  const [time, setTime] = React.useState(getCurrentTimeMs(livescore));
  const [statusDescription, setStatusDescription] = React.useState("");

  React.useEffect(() => {
    const timerUpdateInterval = setInterval(() => {
      const intervalCounter = new Date(time).getSeconds() + 1;
      const currentTimeMsFromInterval = new Date().getTime() - playTimeMs + addPlayTimeMs;

      const timeDate =
        intervalCounter % configuration.LIVESCORE_TIMER_BASED_RENDER_INTERVAL === 0
          ? new Date(currentTimeMsFromInterval)
          : new Date(time);

      timeDate.setSeconds(timeDate.getSeconds() + 1);
      setTime(timeDate.getTime());
      const newStatusDescription = getTimeDescription(time, normalTimeHalfDurationMs);
      setStatusDescription(newStatusDescription);
    }, 1000);

    return () => {
      clearInterval(timerUpdateInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, normalTimeHalfDurationMs, playTimeMs, addPlayTimeMs]);

  return statusDescription;
};
