import { Livescore } from "src/components/live/live-api";
import { EventStatusEnum } from "../mapping/event-status/event-status.enum";

export type EventType = {
  addedInfo: number;
  marketId: number;
  scheduleId: number;
  sportId: number;
  eventId: number;
  competitionDescription: string;
  eventType: string;
  isReported: boolean;
  eventIconUrl: string;
  livescore?: Livescore;
  live: boolean;
  eventDescription: string;
  eventTimestamp: string;
  outcomeId: number;
  outcomeDescription: string;
  outcomeResult: string;
  outcomeValue: number;
  status: EventStatusEnum;
  marketDescription: string;
  addedInfoDescription: string;
  isFixed: boolean;
  bettingCode?: number;
};
