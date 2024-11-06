import React from "react";
import { Livescore } from "src/components/live/live-api";
import { getCurrentScore, hasTimerPeriod } from "src/components/live/livescore/utilsLivescore";
import { useLivescoreCountdownPeriodBased } from "src/components/live/livescore/useLivescoreCountdownPeriodBased";
import styled from "styled-components/macro";

interface LivescoreCountdownPeriodProps {
  livescore: Livescore;
}

export function LivescoreCountdownPeriodBased({ livescore }: LivescoreCountdownPeriodProps) {
  const currentScoreDescription = getCurrentScore(livescore);
  const valideScore = currentScoreDescription.team1 !== undefined && currentScoreDescription.team2 !== undefined;
  const timeDescription = useLivescoreCountdownPeriodBased(livescore);

  return (
    <ContainerTimerBasedLive>
      {valideScore && (
        <>
          <TimerBasedLiveEventResult>
            <span>{currentScoreDescription.team1}</span>
            <span>{currentScoreDescription.team2}</span>
          </TimerBasedLiveEventResult>
        </>
      )}

      {hasTimerPeriod(livescore) ? (
        <>
          <TimerBasedLiveEventTimer>{timeDescription}</TimerBasedLiveEventTimer>
          <TimerBasedLiveEventSet>{livescore.statusShortDescription}</TimerBasedLiveEventSet>
        </>
      ) : (
        <TimerBasedLiveEventSetDescription>{livescore.statusDescription}</TimerBasedLiveEventSetDescription>
      )}
    </ContainerTimerBasedLive>
  );
}

const ContainerTimerBasedLive = styled.div`
  display: grid;
  grid-template-columns: [timer] 60px [result] 40px;
  grid-template-rows: [time] 1fr [set] 1fr;
  height: 45px;
`;

const TimerBasedLiveEventResult = styled.div`
  grid-column: result;
  grid-row: -1 / 1;
  background: #ffb800;
  border-radius: 0px 3px 3px 0px;
  color: #333333;
  font-family: Roboto;
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 19px;
`;

const TimerBasedLiveEventTimer = styled.div`
  grid-column: timer;
  grid-row: time;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333333;
  color: #ffffff;
  font-family: Roboto;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  border-radius: 3px 0px 0px 0px;
`;

const TimerBasedLiveEventSet = styled.div`
  grid-column: timer;
  grid-row: set;
  background: #dcdcdc;
  color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  line-height: 0.875rem;
  border-radius: 0px 0px 0px 3px;
  font-family: Roboto;
  font-weight: 500;
`;

const TimerBasedLiveEventSetDescription = styled.div`
  grid-column: timer;
  grid-row: -1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px 0px 0px 3px;
  background-color: #333333;
  font-size: 0.875rem;
`;
