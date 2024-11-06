import React from "react";
import { DialogPrenotazioneState } from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { DialogPrenotazioneByCode } from "src/components/dialog-prenotazione/DialogPrenotazioneByCode";
import { DialogPrenotazioneByNickname } from "src/components/dialog-prenotazione/DialogPrenotazioneByNickname";
import { Toast } from "src/components/common/toast-message/Toast";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { FormattedMessage } from "react-intl";
import { Ticket } from "src/components/prenotazioni/prenotazioni-api";
import { NickName } from "src/types/chiavi";
import { TicketIndex } from "src/components/dialog-prenotazione/DialogPrenotazioneMultiBiglietto";
import { AmountsChangedResponse, VenditaSuccessResponse } from "src/types/vendita.types";
import { BonusConfigClassType } from "src/types/bonusConfig.type";

type DialogPrenotazioneProps = {
  dialogPrenotazioneState: DialogPrenotazioneState;
  onVendiTicket(
    nickname: NickName,
    ticketViewed: number[],
    ticketToSellList: Ticket[],
    ticketToSellListIndex: number,
    selledTicketsList: Record<TicketIndex, VenditaSuccessResponse["response"]>,
    notSelledTicketsList: Record<TicketIndex, string>,
    totalSellTicket: number,
    allTicketSent: boolean,
    bonusConfig?: BonusConfigClassType[],
    amountChangedTicketResponse?: AmountsChangedResponse,
  ): void;
  pushToast(content: React.ReactNode, duration: number): void;
};
export function DialogPrenotazione({ dialogPrenotazioneState, onVendiTicket, pushToast }: DialogPrenotazioneProps) {
  const {
    dialogPrenotazioneCode,
    dialogPrenotazioneNickname,
    dialogPrenotazioneNotAvailable,
  } = dialogPrenotazioneState;
  const { closeDialogPrenotazione } = useNavigazioneActions();

  if (dialogPrenotazioneNotAvailable) {
    pushToast(
      <Toast
        type={"danger"}
        heading={
          <FormattedMessage
            description="toast heading prenotazione non piu esistente"
            defaultMessage="Prenotazione non più esistente"
          />
        }
        description={
          <FormattedMessage
            description="toast description prenotazione non più esistente"
            defaultMessage="Impossibile il recupero dei dati poichè venduta, eliminata o scaduta"
          />
        }
      />,
      5000,
    );
    closeDialogPrenotazione(dialogPrenotazioneNotAvailable);
  }

  if (dialogPrenotazioneNickname) {
    return (
      <DialogPrenotazioneByNickname
        nickname={dialogPrenotazioneNickname}
        dialogPrenotazioneState={dialogPrenotazioneState}
        pushToast={pushToast}
        onVendiTicket={onVendiTicket}
      />
    );
  }

  if (dialogPrenotazioneCode) {
    return (
      <DialogPrenotazioneByCode
        ticketCode={dialogPrenotazioneCode}
        dialogPrenotazioneState={dialogPrenotazioneState}
        pushToast={pushToast}
        onVendiTicket={onVendiTicket}
      />
    );
  }
  return <></>;
}
