import { EventType } from "../../types/event.types";
import { EventStatusEnum } from "./event-status.enum";

export class EventStatusMapping {
  public static whichColor(status: EventStatusEnum): string {
    switch (status) {
      case EventStatusEnum.UNDEFINED:
        return "#979797";
      case EventStatusEnum.WINNING:
        return "#3b914c";
      case EventStatusEnum.LOSING:
        return "#EB1E23";
      case EventStatusEnum.CANCELED:
        return "#0F90E7";
      default:
        return "";
    }
  }

  public static getAmountNotReportedEvents(matchEventsList: Array<EventType>): number {
    if (matchEventsList !== undefined && matchEventsList !== null) {
      return matchEventsList.filter((matchEvent: EventType) => !matchEvent.isReported).length;
    }
    return 0;
  }

  private static getCounterByStatus(matchEventsList: any, eventStatus: string): number {
    let counter = 0;

    matchEventsList.forEach((matchEvent: any) => {
      const { status } = matchEvent;
      if (status !== undefined && status !== null && status === eventStatus) {
        counter += 1;
      }
    });
    return counter;
  }

  public static getAmountEventsByStatus(matchEventsList: any, eventStatuses: string[]): number {
    let counter = 0;
    if (
      matchEventsList !== undefined &&
      matchEventsList !== null &&
      eventStatuses !== undefined &&
      eventStatuses !== null
    ) {
      eventStatuses.forEach((eventStatus) => {
        if (eventStatus === EventStatusEnum.UNDEFINED) {
          counter += EventStatusMapping.getCounterByStatus(matchEventsList, EventStatusEnum.UNDEFINED);
        } else if (eventStatus === EventStatusEnum.LOSING) {
          counter += EventStatusMapping.getCounterByStatus(matchEventsList, EventStatusEnum.LOSING);
        } else if (eventStatus === EventStatusEnum.CANCELED) {
          counter += EventStatusMapping.getCounterByStatus(matchEventsList, EventStatusEnum.CANCELED);
        } else if (eventStatus === EventStatusEnum.WINNING) {
          counter += EventStatusMapping.getCounterByStatus(matchEventsList, EventStatusEnum.WINNING);
        }
      });
    }
    return counter;
  }
}
