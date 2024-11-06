import { FormattedMessage } from "react-intl";
import { AlertAcceptanceAmountsChanged } from "src/components/common/blocking-alert/AlertAcceptanceAmountsChanged";
import { Alert } from "src/components/common/blocking-alert/BlockingAlert";
import { AlertAcceptanceAmountsChangedPrenotazione } from "src/components/dialog-prenotazione/AlertAcceptanceAmountsChangedPrenotazione";
import {
  AlertUnderAcceptancePrenotazioneWithProgressBar,
  AlertVenditaPrenotazioneWithProgressBar,
} from "src/components/dialog-prenotazione/AlertVenditaPrenotazione";
import { DialogPrenotazioneSellingAlert } from "src/components/dialog-prenotazione/DialogPrenotazioneVendita";
import { DialogPrenotazioneState } from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { Ticket } from "src/components/prenotazioni/prenotazioni-api";
import configuration from "src/helpers/configuration";
import { decimalToIntegerValue } from "src/helpers/formatCurrencyAmountUtils";

type DialogPrenotazioneVenditaMultiBigliettoProps = {
  dialogPrenotazioneState: DialogPrenotazioneState;
  selectedTicket: Ticket;
  acceptedTicketFromAcceptance: () => void;
  rejectedTicketFromAcceptance: () => void;
};

export function DialogPrenotazioneVenditaMultiBiglietto({
  dialogPrenotazioneState,
  selectedTicket,
  acceptedTicketFromAcceptance,
  rejectedTicketFromAcceptance,
}: DialogPrenotazioneVenditaMultiBigliettoProps) {
  const notSelledTickets = dialogPrenotazioneState.notSelledTickets;
  const amountChangedTicketResponse = dialogPrenotazioneState.amountChangedTicketResponse;

  if (!dialogPrenotazioneState.sellTicketState) {
    return null;
  }

  const isSellingWithProgressBar = !!(
    dialogPrenotazioneState.sellTicketState && dialogPrenotazioneState.sellTicketState.isSellingWithProgressBar
  );

  if (isSellingWithProgressBar) {
    if (notSelledTickets[selectedTicket.index] === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE) {
      return (
        <AlertUnderAcceptancePrenotazioneWithProgressBar
          selledTickets={dialogPrenotazioneState.sellTicketState.progressBarActualCounter}
          totalTickets={dialogPrenotazioneState.sellTicketState.progressBarTotalCounter}
        />
      );
    } else if (
      notSelledTickets[selectedTicket.index] === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_AMOUNTS_CHANGED &&
      amountChangedTicketResponse
    ) {
      return (
        <AlertAcceptanceAmountsChangedPrenotazione
          primaryButtonAction={acceptedTicketFromAcceptance}
          secondaryButtonAction={rejectedTicketFromAcceptance}
          oldPuntata={selectedTicket.sellingPrice}
          newPuntata={amountChangedTicketResponse?.attrExtConsole.amount.amount}
          actualIndex={dialogPrenotazioneState.sellTicketState.progressBarActualCounter}
          totalIndex={dialogPrenotazioneState.sellTicketState.progressBarTotalCounter}
          ticket={selectedTicket}
        />
      );
    } else {
      return (
        <AlertVenditaPrenotazioneWithProgressBar
          selledTickets={dialogPrenotazioneState.sellTicketState.progressBarActualCounter}
          totalTickets={dialogPrenotazioneState.sellTicketState.progressBarTotalCounter}
        />
      );
    }
  } else {
    if (notSelledTickets[selectedTicket.index] === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE) {
      return (
        <Alert
          type={"warning"}
          heading={
            <FormattedMessage
              defaultMessage="Scommessa in accettazione"
              description="default prenotazione header title of acceptance alert"
            />
          }
          description={
            <FormattedMessage
              defaultMessage="I nostri quotisti stanno valutando la tua scommessa, attendi l’esito per poter effettuare nuove operazioni"
              description="description prenotazione of acceptance alert"
            />
          }
        />
      );
    } else if (
      notSelledTickets[selectedTicket.index] === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_AMOUNTS_CHANGED &&
      amountChangedTicketResponse
    ) {
      return (
        <AlertAcceptanceAmountsChanged
          primaryButtonAction={acceptedTicketFromAcceptance}
          secondaryButtonAction={rejectedTicketFromAcceptance}
          oldPuntata={decimalToIntegerValue(selectedTicket.sellingPrice)}
          newPuntata={amountChangedTicketResponse?.attrExtConsole.amount.amount}
        />
      );
    } else {
      return <DialogPrenotazioneSellingAlert />;
    }
  }
}
