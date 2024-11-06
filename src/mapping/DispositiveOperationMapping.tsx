export enum DispositiveOperationEnum {
  REBET = "Rebet",
  ANNULLA = "Annulla",
  PAGA = "Paga",
  DISANONIMA_E_PAGA = "Disanonima e Paga",
  RIMBORSA = "Rimborsa",
}

export class DispositiveOperationMapping {
  public static whichLabel(dispositiveOperation: DispositiveOperationEnum, notReportedEventsCounter: number): string {
    switch (dispositiveOperation) {
      case DispositiveOperationEnum.REBET:
        return `Rebet (${notReportedEventsCounter})`;
      case DispositiveOperationEnum.ANNULLA:
        return "Annulla";
      case DispositiveOperationEnum.PAGA:
        return "Paga";
      case DispositiveOperationEnum.DISANONIMA_E_PAGA:
        return "Disanonima e Paga";
      case DispositiveOperationEnum.RIMBORSA:
        return "Rimborsa";
      default:
        return "";
    }
  }

  public static whichShortcut(dispositiveOperation: DispositiveOperationEnum): string {
    switch (dispositiveOperation) {
      case DispositiveOperationEnum.REBET:
        return "ctrl R";
      case DispositiveOperationEnum.ANNULLA:
        return "ctrl A";
      case DispositiveOperationEnum.PAGA:
        return "ctrl C";
      case DispositiveOperationEnum.DISANONIMA_E_PAGA:
        return "ctrl D";
      case DispositiveOperationEnum.RIMBORSA:
        return "ctrl T";
      default:
        return "";
    }
  }
}
