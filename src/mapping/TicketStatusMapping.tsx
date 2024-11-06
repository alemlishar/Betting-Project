/* eslint-disable max-len */
import { DispositiveOperationEnum } from "./DispositiveOperationMapping";

export enum TicketStatusEnum {
  UNDEFINED = "UNDEFINED",
  PAYED = "PAYED",
  LOSING = "LOSING",
  REFUNDABLE = "REFUNDABLE",
  REFUNDED = "REFUNDED",
  CANCELED = "CANCELED",
  WINNING = "WINNING",
  EMITTED = "EMITTED",
  OPEN = "OPEN",
  BLOCKED = "BLOCKED",
  PAYABLE_REFUNDABLE = "PAYABLE_REFUNDABLE",
  PAYABLE_REFUNDED = "PAYABLE_REFUNDED",
  PAYED_REFUNDED = "PAYED_REFUNDED",
}

export class TicketStatusMapping {
  public static whichLabel(status: TicketStatusEnum): string {
    switch (status) {
      case TicketStatusEnum.EMITTED:
        return "In Attesa";
      case TicketStatusEnum.OPEN:
        return "In Attesa";
      case TicketStatusEnum.WINNING:
        return "Pagabile";
      case TicketStatusEnum.PAYABLE_REFUNDABLE:
        return "Pagabile";
      case TicketStatusEnum.PAYED:
        return "Pagato";
      case TicketStatusEnum.PAYABLE_REFUNDED:
        return "Pagato";
      case TicketStatusEnum.PAYED_REFUNDED:
        return "Pagato";
      case TicketStatusEnum.LOSING:
        return "Perdente";
      case TicketStatusEnum.REFUNDABLE:
        return "Rimborsabile";
      case TicketStatusEnum.REFUNDED:
        return "Rimborsato";
      case TicketStatusEnum.CANCELED:
        return "Annullato";
      case TicketStatusEnum.UNDEFINED:
        return "Annullato";
      case TicketStatusEnum.BLOCKED:
        return "Bloccato";
      default:
        return "";
    }
  }

  public static whichColor(status: TicketStatusEnum): string {
    switch (status) {
      case TicketStatusEnum.OPEN:
      case TicketStatusEnum.EMITTED:
        return "#979797";
      case TicketStatusEnum.PAYABLE_REFUNDABLE:
      case TicketStatusEnum.WINNING:
      case TicketStatusEnum.PAYED:
      case TicketStatusEnum.PAYED_REFUNDED:
        return "#3b914c";
      case TicketStatusEnum.BLOCKED:
        return "#000000";
      case TicketStatusEnum.LOSING:
        return "#EB1E23";
      case TicketStatusEnum.REFUNDED:
      case TicketStatusEnum.REFUNDABLE:
        return "#0F90E7";
      case TicketStatusEnum.CANCELED:
      case TicketStatusEnum.UNDEFINED:
        return "#979797";
      default:
        return "";
    }
  }

  public static whichDispositiveOp(
    status: TicketStatusEnum,
    isAnnullaActive: boolean,
    isDeAnonymization: boolean,
    notReportedEventsCounter: number,
  ) {
    switch (status) {
      case TicketStatusEnum.OPEN:
      case TicketStatusEnum.EMITTED:
        return isAnnullaActive
          ? [DispositiveOperationEnum.REBET, DispositiveOperationEnum.ANNULLA]
          : [DispositiveOperationEnum.REBET];
      case TicketStatusEnum.PAYABLE_REFUNDABLE:
      case TicketStatusEnum.BLOCKED:
        return isDeAnonymization ? [DispositiveOperationEnum.DISANONIMA_E_PAGA] : [DispositiveOperationEnum.PAGA];
      case TicketStatusEnum.WINNING:
        return isDeAnonymization ? [DispositiveOperationEnum.DISANONIMA_E_PAGA] : [DispositiveOperationEnum.PAGA];
      case TicketStatusEnum.PAYED:
      case TicketStatusEnum.REFUNDED:
      case TicketStatusEnum.PAYABLE_REFUNDED:
        return [];
      case TicketStatusEnum.PAYED_REFUNDED:
        return [];
      case TicketStatusEnum.LOSING:
        return notReportedEventsCounter > 0 ? [DispositiveOperationEnum.REBET] : [];
      case TicketStatusEnum.REFUNDABLE:
        return [DispositiveOperationEnum.RIMBORSA];
      case TicketStatusEnum.CANCELED:
      case TicketStatusEnum.UNDEFINED:
        return notReportedEventsCounter > 0 ? [DispositiveOperationEnum.REBET] : [];
      default:
        return null;
    }
  }

  public static hasANetWin(status: TicketStatusEnum): boolean {
    return (
      status === TicketStatusEnum.PAYED ||
      status === TicketStatusEnum.WINNING ||
      status === TicketStatusEnum.PAYABLE_REFUNDED ||
      status === TicketStatusEnum.PAYABLE_REFUNDABLE ||
      status === TicketStatusEnum.PAYED_REFUNDED
    );
  }

  public static shouldBePayedNow(status: TicketStatusEnum): boolean {
    return (
      status === TicketStatusEnum.WINNING ||
      status === TicketStatusEnum.PAYABLE_REFUNDED ||
      status === TicketStatusEnum.REFUNDABLE ||
      status === TicketStatusEnum.PAYABLE_REFUNDABLE
    );
  }

  public static hasARefund(status: TicketStatusEnum): boolean {
    return status === TicketStatusEnum.REFUNDABLE || status === TicketStatusEnum.REFUNDED;
  }
}
