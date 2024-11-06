import React from "react";
import { Livescore } from "src/components/live/live-api";
import configuration from "src/helpers/configuration";
import styled, { css } from "styled-components/macro";

interface LivescoreSetBasedProps {
  livescore: Livescore;
}

export function LivescoreSetBased({ livescore }: LivescoreSetBasedProps) {
  const { scoreList, server } = livescore;

  return (
    <SetsBasedLiveEventBox sets={scoreList.length}>
      {scoreList.map((score, index) => {
        const scoreTeam1 = score.team1 === configuration.SET_BASED_LIVESCORE_ADVANTAGE_POINTS ? "AD" : score.team1;
        const scoreTeam2 = score.team2 === configuration.SET_BASED_LIVESCORE_ADVANTAGE_POINTS ? "AD" : score.team2;

        return (
          <React.Fragment key={score.type}>
            <SetsBasedLiveEventGame
              period={score.type}
              index={index}
              server={configuration.SET_BASED_LIVESCORE_FIRST_SERVER}
            >
              {scoreTeam1}
            </SetsBasedLiveEventGame>
            <SetsBasedLiveEventGame
              period={score.type}
              index={index}
              server={configuration.SET_BASED_LIVESCORE_SECOND_SERVER}
            >
              {scoreTeam2}
            </SetsBasedLiveEventGame>
          </React.Fragment>
        );
      })}
      {server && (
        <SetsBasedLiveEventServiceTurn server={server}>
          <span
            css={css`
              border-radius: 50%;
              background: #ffb800;
              width: 8px;
              height: 8px;
              align-self: center;
              justify-self: center;
            `}
          ></span>
        </SetsBasedLiveEventServiceTurn>
      )}
    </SetsBasedLiveEventBox>
  );
}

const SetsBasedLiveEventBox = styled.div<{ sets: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.sets}, [period] 25px) [server] 25px;
  grid-template-rows: [ ${configuration.SET_BASED_LIVESCORE_FIRST_SERVER}] 1fr [ ${configuration.SET_BASED_LIVESCORE_SECOND_SERVER}] 1fr;
  height: 45px;
  min-width: 100px;
  justify-content: flex-end;
  background: #333333;
  border-radius: 3px;
`;

const SetsBasedLiveEventGame = styled.div<{ index: number; period: string; server: string }>`
  grid-column: period ${(props) => props.index + 1};
  grid-row: ${(props) => props.server};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: Roboto;
  font-size: ${(props) => (props.period === configuration.SET_BASED_LIVESCORE_CURRENT_GAME ? "1rem" : "0.875rem")};
  font-weight: ${(props) => (props.period === configuration.SET_BASED_LIVESCORE_CURRENT_GAME ? "700" : "500")};
  color: ${(props) => (props.period === configuration.SET_BASED_LIVESCORE_CURRENT_GAME ? "#333333" : "#ffffff")};
  background-color: ${(props) => (props.period === configuration.SET_BASED_LIVESCORE_CURRENT_GAME ? "#ffb800" : "")};
  text-align: center;
`;

const SetsBasedLiveEventServiceTurn = styled.span<{ server: string }>`
  grid-column: server;
  grid-row: ${(props) => props.server};
  display: flex;
  align-content: center;
  justify-content: center;
`;
