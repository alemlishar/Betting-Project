import React, { useCallback } from "react";
import { NickName } from "src/types/chiavi";
import {
  deleteTicketFromPrenotazineByNickname,
  getPrenotazioneByNickName,
  Ticket,
} from "src/components/prenotazioni/prenotazioni-api";
import useSWR from "swr";
import { DialogPrenotazioneSingoloBiglietto } from "src/components/dialog-prenotazione/DialogPrenotazioneSingoloBiglietto";
import {
  DialogPrenotazioneMultiBiglietto,
  TicketIndex,
} from "src/components/dialog-prenotazione/DialogPrenotazioneMultiBiglietto";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { checkNotAvailablePrenotazione } from "src/components/prenotazioni/MenuPrenotazioni";
import { SubHeaderDialog } from "./dialog-prenotazione-header/DialogSubHeader";
import { HeaderButtonDialog } from "./dialog-prenotazione-header/DialogHeader";
import { DialogPrenotazioneState } from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { AmountsChangedResponse, VenditaSuccessResponse } from "src/types/vendita.types";
import { BonusConfigClassType } from "src/types/bonusConfig.type";

type DialogPrenotazioneByNickNameProps = {
  nickname: NickName;
  pushToast(content: React.ReactNode, duration: number): void;
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
  dialogPrenotazioneState: DialogPrenotazioneState;
};

export function DialogPrenotazioneByNickname({
  nickname,
  pushToast,
  onVendiTicket,
  dialogPrenotazioneState,
}: DialogPrenotazioneByNickNameProps) {
  const { data: schedaPrenotazione, mutate } = useSWR(
    (() => {
      return [nickname];
    })() as Parameters<typeof getPrenotazioneByNickName>,
    getPrenotazioneByNickName,
    { revalidateOnFocus: false },
  );

  const { openDialogPrenotazioneNotAvailable } = useNavigazioneActions();

  const deleteTicketFromPrenotazione = useCallback(
    async (nickname: NickName, bigliettoIndex: number) => {
      if (schedaPrenotazione) {
        await deleteTicketFromPrenotazineByNickname(nickname, bigliettoIndex);
        mutate({
          ...schedaPrenotazione,
          tickets: schedaPrenotazione.tickets.filter((ticket) => ticket.index !== bigliettoIndex),
        });
      }
    },
    [schedaPrenotazione, mutate],
  );

  if (!schedaPrenotazione) {
    return null;
  }

  const notAvailablePrenotazione = checkNotAvailablePrenotazione(schedaPrenotazione);
  if (notAvailablePrenotazione) {
    openDialogPrenotazioneNotAvailable(schedaPrenotazione.mainNickname);
    return null;
  }

  if (schedaPrenotazione.tickets.filter((ticket) => ticket.status !== "Sent").length === 1) {
    return (
      <DialogPrenotazioneSingoloBiglietto
        schedaPrenotazione={schedaPrenotazione}
        SubHeaderDialog={SubHeaderDialog}
        pushToast={pushToast}
        onVendiTicket={onVendiTicket}
        dialogPrenotazioneState={dialogPrenotazioneState}
      />
    );
  }
  return (
    <DialogPrenotazioneMultiBiglietto
      schedaPrenotazione={schedaPrenotazione}
      onTicketDelete={deleteTicketFromPrenotazione}
      HeaderButtonDialog={HeaderButtonDialog}
      pushToast={pushToast}
      onVendiTicket={onVendiTicket}
      dialogPrenotazioneState={dialogPrenotazioneState}
    />
  );
}
