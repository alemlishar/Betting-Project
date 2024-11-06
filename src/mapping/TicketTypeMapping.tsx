export enum TicketTypeEnum {
  ACCUMULATOR = "ACCUMULATOR",
  SYSTEM = "SYSTEM",
}

export class TicketTypeMapping {
  public static whichLabel(status: string): string {
    switch (status) {
      case TicketTypeEnum.ACCUMULATOR.valueOf():
        return "Singola/Multipla";
      case TicketTypeEnum.SYSTEM.valueOf():
        return "Sistema";
      default:
        return "";
    }
  }
}
