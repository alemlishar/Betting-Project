import React from "react";
import { Livescore } from "src/components/live/live-api";
import { getCurrentScore, hasTimer } from "src/components/live/livescore/utilsLivescore";
import { useLivescoreTimerBased } from "src/components/live/livescore/useLivescoreTimerBased";
import styled, { css } from "styled-components/macro";

interface LivescoreTimeBasedProps {
  livescore: Livescore;
}

export function LivescoreTimeBased({ livescore }: LivescoreTimeBasedProps) {
  const currentScoreDescription = getCurrentScore(livescore);
  const valideScore = currentScoreDescription.team1 !== undefined && currentScoreDescription.team2 !== undefined;
  const statusDescription = useLivescoreTimerBased(livescore);

  return (
    <SimpleLiveEventBox>
      {hasTimer(livescore) ? (
        <SimpleLiveEventMinutes>{statusDescription}</SimpleLiveEventMinutes>
      ) : (
        <SimpleLiveEventMinutes>{livescore.statusShortDescription}</SimpleLiveEventMinutes>
      )}

      {valideScore && (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            background-color: #ffb800;
            border-radius: 0 3px 3px 0;
          `}
        >
          <SimpleLiveEventResult>{`${currentScoreDescription.team1}`}</SimpleLiveEventResult>
          <SimpleLiveEventResult>{`${currentScoreDescription.team2}`}</SimpleLiveEventResult>
        </div>
      )}
    </SimpleLiveEventBox>
  );
}

const SimpleLiveEventBox = styled.div`
  display: flex;
`;

const SimpleLiveEventMinutes = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  width: 60px;
  font-family: Roboto, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  border-radius: 3px 0 0 3px;
  background-color: #333333;
`;

const SimpleLiveEventResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22.5px;
  width: 40px;
  font-family: Roboto, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #333333;
`;
