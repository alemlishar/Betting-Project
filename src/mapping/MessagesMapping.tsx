import { FormattedMessage } from "react-intl";

export enum MessagesMappingEnum {
  ERROR_CODE_100 = "100",
  ERROR_CODE_101 = "101",
  ERROR_CODE_300 = "300",
  ERROR_CODE_20608 = "20608",
  ERROR_CODE_NOT_VALID_TICKET = "NOT_VALID_TICKET",
  ERROR_CODE_DEFAULT = "",
  CIRCOLARITA_NON_ABILITATA = "CIRCOLARITA_NON_ABILITATA",
  WARNING_NEEDED_DISANONIMAZIONE = "NEEDED_DISANONIMAZIONE",
  WARNING_INSUFFICIENT_SALDO_CASSA = "INSUFFICIENT_SALDO_CASSA",
  ERROR_CODE_404 = 404,
}

export class MessagesMapping {
  public static whichMessage(messageCode: MessagesMappingEnum) {
    switch (messageCode) {
      case MessagesMappingEnum.ERROR_CODE_100:
        return (
          <FormattedMessage
            description="error code 100 ticket"
            defaultMessage="Si è verificato un errore nel recupero dei dati biglietto"
          />
        );
      case MessagesMappingEnum.ERROR_CODE_101:
        return <FormattedMessage description="error code 101 ticket" defaultMessage="Dati biglietto non disponibili" />;

      case MessagesMappingEnum.ERROR_CODE_300:
        return "";
      case MessagesMappingEnum.ERROR_CODE_NOT_VALID_TICKET:
        return (
          <FormattedMessage description="error code not valid ticket" defaultMessage="Codice biglietto non valido" />
        );

      case MessagesMappingEnum.CIRCOLARITA_NON_ABILITATA:
        return (
          <FormattedMessage
            description="error code 20608 ticket"
            defaultMessage="Biglietto non pagabile in questo Punto Vendita. Per ulteriori informazioni contatta il nostro Customer Care: 848.88.55.44 "
          />
        );

      case MessagesMappingEnum.WARNING_INSUFFICIENT_SALDO_CASSA:
        return (
          <FormattedMessage
            description="error code saldo cassa ticket"
            defaultMessage="Saldo cassa insufficiente per completare il pagamento. Effettua una sovvenzione della cassa."
          />
        );

      case MessagesMappingEnum.WARNING_NEEDED_DISANONIMAZIONE:
        return (
          <FormattedMessage
            description="error code disanonimazione ticket"
            defaultMessage="Per pagare il biglietto è necessario effettuare il processo di disanonimazione"
          />
        );

      case MessagesMappingEnum.ERROR_CODE_404:
        return (
          <FormattedMessage
            description="error code 404 ticket"
            defaultMessage="Servizio momentaneamente non disponibile"
          />
        );

      default:
        return (
          <FormattedMessage
            description="error code generic ticket"
            defaultMessage="Si è verificato un errore generico"
          />
        );
    }
  }

  public static whichMessageDetails(messageCode: MessagesMappingEnum) {
    switch (messageCode) {
      case MessagesMappingEnum.ERROR_CODE_101:
        return (
          <FormattedMessage description="error code 101 ticket" defaultMessage="(Ticket prescritto/inesistente)" />
        );

      default:
        return "";
    }
  }
}
