import { Livescore, Score } from "src/components/live/live-api";
import configuration from "src/helpers/configuration";

export function getCurrentScore(livescore: Livescore) {
  const currentScore = livescore.scoreList.find((score) => score.type === configuration.CURRENT_SCORE) || ({} as Score);
  return currentScore;
}

export function getCurrentTimeMs(livescore: Livescore): number {
  const currentTimeMs = new Date().getTime() - livescore.playTimeMs + livescore.addPlayTimeMs;
  return currentTimeMs;
}

export function getTimeDescription(currentTime: number, durationTime: number) {
  if (durationTime != null && currentTime > durationTime) {
    const extraTimeMs = currentTime - durationTime;
    const extraTime = parseInt((extraTimeMs / (1000 * 60)).toString(), 10) + 1;
    const timeDescriptionByMs = getTimeDescriptionByMs(durationTime);
    const minutesText = timeDescriptionByMs.split(":")[0];
    const extraTimeText = `+${extraTime}`;
    return `${minutesText}'${extraTimeText}`; //TODO: Da verificare
  } else {
    return getTimeDescriptionByMs(currentTime);
  }
}

export function getTimeDescriptionByMs(currentTime: number) {
  if (currentTime < 0) {
    currentTime = 0;
  }
  const seconds = parseInt(((currentTime / 1000) % 60).toString(), 10);
  const minutes = parseInt((currentTime / (1000 * 60)).toString(), 10);
  const minutesText = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsText = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${minutesText}:${secondsText}`;
}

export function hasTimer(livescore: Livescore) {
  const hasTimer =
    livescore.statusCode === configuration.MATCH_STATUS_ONGOING && livescore.playTimeMs !== null && livescore.showTimer;
  return hasTimer;
}

export function hasTimerPeriod(livescore: Livescore) {
  const hasTimerPeriod =
    livescore.statusCode === configuration.MATCH_STATUS_ONGOING &&
    livescore.playTimeMs !== null &&
    livescore.showTimer &&
    livescore.remainingTimePeriodMs !== null;
  return hasTimerPeriod;
}

export function getCurrentTypeFromSportId(
  codiceDisciplina: number,
): { isSetBased: boolean; isCountdownPeriodBased: boolean } {
  const isSetBased =
    codiceDisciplina === configuration.SPORT_ID.TENNIS ||
    codiceDisciplina === configuration.SPORT_ID.VOLLEY ||
    codiceDisciplina === configuration.SPORT_ID.TENNIS_TAVOLO;
  const isCountdownPeriodBased =
    codiceDisciplina === configuration.SPORT_ID.BASKET || codiceDisciplina === configuration.SPORT_ID.HOCKEY;

  return { isSetBased, isCountdownPeriodBased };
}
