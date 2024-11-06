import { EventType } from "./event.types";
import { TicketStatusEnum } from "../mapping/TicketStatusMapping";
import { TicketTypeEnum } from "../mapping/TicketTypeMapping";

export type CardinalityDeploymentType = {
  id: number;
  ticketsCount: number;
  minimumWinningAmountCardinality: number;
  maximumWinningAmountCardinality: number;
  maximumWinningAmount: number;
  sellingAmount: number;
  totalSellingAmount: number;
};

export type TicketType = {
  ticketId: string;
  sellingDate: string;
  agentId: number;
  sportCode: "SPORT" | "VIRTUAL";
  paymentAmount: number;
  sellingAmount: number;
  isDeAnonymization: boolean;
  events: Array<EventType>;
  status: TicketStatusEnum;
  bonus?: {
    value: number;
    minimumOdds?: number;
    minimumEvents?: number;
  };
  ticketType: TicketTypeEnum;
  cardinalitiesDeployment: Array<CardinalityDeploymentType>;
  maxWinning?: number;
  minWinning?: number;
};
