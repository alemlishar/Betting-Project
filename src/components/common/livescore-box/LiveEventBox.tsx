import React from "react";
import styled from "styled-components/macro";
import configuration from "src/helpers/configuration";
import { Livescore, ScoreList } from "src/components/live/live-api";

type LiveEventBoxProps = {
  eventType: string;
  livescore: Livescore;
};

export const LiveEventBox = ({ eventType, livescore }: LiveEventBoxProps) => {
  const scoreList = livescore.scoreList ?? [];

  // returns the outcome for sports with just one "period" (e.g. football, volley, ...)
  // returns empty string if accidentally called for multi-period sports (tennis, pingpong, ...)
  const onePeriodSportScore = (scores: ScoreList) =>
    scoreList.length === 1 ? `${scores[0].team1} - ${scores[0].team2}` : "";

  const liveTime = liveTimeToShow(livescore);
  const minutes = msToMinutes(liveTime);

  const currentPeriod = scoreList.length;

  const firstPlayerServing = livescore.server && livescore.server === configuration.SET_BASED_LIVESCORE_FIRST_SERVER;
  return (
    <StyledLivescoreBoxContainer>
      {eventType === "Calcio" && (
        <SimpleLiveEventBox>
          <SimpleLiveEventResult>{onePeriodSportScore(scoreList)}</SimpleLiveEventResult>
          <SimpleLiveEventMinutes>{minutes}</SimpleLiveEventMinutes>
        </SimpleLiveEventBox>
      )}
      {eventType === "Hockey" && (
        <TimerBasedLiveEventBox>
          <TimerBasedLiveEventResult>{onePeriodSportScore(scoreList)}</TimerBasedLiveEventResult>
          <TimerBasedLiveEventTimer>{minutes}</TimerBasedLiveEventTimer>
          <TimerBasedLiveEventSet>{currentPeriod}° S</TimerBasedLiveEventSet>
        </TimerBasedLiveEventBox>
      )}
      {eventType === "Tennis" && (
        <SetsBasedLiveEventBox>
          {livescore.scoreList.map((setScore) => (
            <SetsBasedLiveEventSet key={setScore.type}>
              <SetsBasedLiveEventGame>{setScore.team1}</SetsBasedLiveEventGame>
              <SetsBasedLiveEventGame>{setScore.team2}</SetsBasedLiveEventGame>
            </SetsBasedLiveEventSet>
          ))}
          <SetsBasedLiveEventServiceTurn firstPlayerServing={firstPlayerServing} />
        </SetsBasedLiveEventBox>
      )}
    </StyledLivescoreBoxContainer>
  );
};

// returns time from when match is started in "MM:SS" format
// TODO: eventually returns extra time
const liveTimeToShow = (livescore: Livescore): number => {
  const hasTimer =
    livescore.statusCode === 1 &&
    livescore.remainingTimePeriodMs !== null &&
    livescore.showTimer &&
    livescore.playTimeMs !== null;

  if (!hasTimer && livescore.addPlayTimeMs && !isNaN(livescore.addPlayTimeMs)) {
    return livescore.addPlayTimeMs;
  } else if (hasTimer && livescore.remainingTimePeriodMs && !isNaN(livescore.remainingTimePeriodMs)) {
    return livescore.remainingTimePeriodMs;
  }
  return 0;
};

export const msToMinutes = (time: number): string => {
  if (!time) {
    time = 0;
  }
  const seconds = parseInt(((time / 1000) % 60).toString(), 10);
  const minutes = parseInt((time / (1000 * 60)).toString(), 10);
  const minutesText = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsText = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${minutesText}:${secondsText}`;
};

// TODO: add msToTimer function for timer sports
// (currentTime: number, halfTimeDuration: number) => string

const StyledLivescoreBoxContainer = styled.div`
  * {
    font-family: Roboto, sans-serif;
  }
`;

const SimpleLiveEventBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const SimpleLiveEventResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  width: 100px;
  border-radius: 3px 3px 0px 0px;
  background-color: #ffb800;

  font-weight: 500;
  justify-content: center;
  align-items: center;
  color: #333333;
  font-size: 18px;
`;

const SimpleLiveEventMinutes = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 100px;
  border-radius: 0px 0px 3px 3px;
  background-color: #333333;

  font-weight: 500;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 14px;
  color: #ffffff;
`;

const TimerBasedLiveEventBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100px;
  height: 60px;
`;

const TimerBasedLiveEventResult = styled.div`
  display: flex;
  flex: 0 0 100%;
  background: #ffb800;
  height: 25px;
  border-radius: 3px 3px 0px 0px;

  font-weight: 500;
  justify-content: center;
  align-items: center;
  color: #333333;
  font-size: 18px;
`;

const TimerBasedLiveEventTimer = styled.div`
  display: flex;
  flex: 0 0 50%;
  height: 35px;
  background: #333333;

  font-weight: 500;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 14px;
  color: #ffffff;
`;

const TimerBasedLiveEventSet = styled.div`
  display: flex;
  flex: 0 0 50%;
  height: 35px;
  background: #dcdcdc;
  color: #333333;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  line-height: 14px;
`;

const SetsBasedLiveEventBox = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 60px;
  border-radius: 3px;
  background: #333333;
  min-width: 100px;
`;
const SetsBasedLiveEventSet = styled.div`
  height: 100%;
  width: 25px;
  display: flex;
  flex-direction: column;
  margin-left: 2.5px;

  &:last-of-type {
    background: #ffb800;
    > div {
      color: #333;
    }
  }
`;
const SetsBasedLiveEventGame = styled.div`
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: white;
  font-size: 16px;
`;

const SetsBasedLiveEventServiceTurn = styled.p<{ firstPlayerServing: boolean }>`
  width: 20px;
  display: flex;
  justify-content: center;
  height: 100%;
  margin: 0;
  &:after {
    top: ${(props) => (props.firstPlayerServing ? "10px" : "calc(100% - 18px)")};
    content: "";
    border-radius: 50%;
    background: #ffb800;
    width: 8px;
    height: 8px;
    display: inline-block;
    position: relative;
  }
`;
