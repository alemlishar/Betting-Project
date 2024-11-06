import React from "react";
import { Livescore } from "src/components/live/live-api";
import { LivescoreTimeBased } from "src/components/live/livescore/LivescoreTimeBased";
import { getCurrentTypeFromSportId } from "src/components/live/livescore/utilsLivescore";

export type LivescoreBoxProps = {
  codiceDisciplina: number;
  livescore: Livescore;
};

export function LivescoreBox({ livescore, codiceDisciplina }: LivescoreBoxProps) {
  const { isSetBased, isCountdownPeriodBased } = getCurrentTypeFromSportId(codiceDisciplina);

  return <>{isCountdownPeriodBased ? <></> : isSetBased ? <></> : <LivescoreTimeBased livescore={livescore} />}</>;
}
