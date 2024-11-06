import React from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "src/components/common/blocking-alert/BlockingAlert";

export function DialogPrenotazioneSellingAlert() {
  return (
    <Alert
      description={
        <FormattedMessage
          defaultMessage="Attendi l’esito per poter effettuare nuove operazioni"
          description="Submessage Vendita prenotazione in corso Label Alert"
        />
      }
      heading={
        <FormattedMessage
          defaultMessage="Vendita prenotazione in corso"
          description="Vendita prenotazione in corso Label Alert"
        />
      }
      type={"warning"}
    />
  );
}
