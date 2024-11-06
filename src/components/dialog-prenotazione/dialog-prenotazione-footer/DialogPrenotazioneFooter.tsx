import React from "react";
import { getTicketType } from "src/components/prenotazioni/MenuPrenotazioni";
import { Ticket, SviluppoSistema } from "src/components/prenotazioni/prenotazioni-api";
import { DialogPrenotazioneFooterSistema } from "src/components/dialog-prenotazione/dialog-prenotazione-footer/DialogPrenotazioneFooterSistema";
import { DialogPrenotazioneFooterSingolaMultipla } from "src/components/dialog-prenotazione/dialog-prenotazione-footer/DialogPrenotazioneFooterSingolaMultipla";

type DialogPrenotazioneSingolaMultiplaProps = {
  ticket: Ticket;
  sviluppoSistema?: SviluppoSistema;
};
export function DialogPrenotazioneFooter({ ticket, sviluppoSistema }: DialogPrenotazioneSingolaMultiplaProps) {
  const ticketType = getTicketType(ticket);

  if (ticketType === "Sistema") {
    return <DialogPrenotazioneFooterSistema ticket={ticket} sviluppoSistema={sviluppoSistema} />;
  }

  return <DialogPrenotazioneFooterSingolaMultipla ticket={ticket} />;
}
