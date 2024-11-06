import { TicketResult, ticketResultToEventoType } from "src/components/prenotazioni/prenotazioni-api";
import { EventoType } from "src/types/carrello.types";
import { getTicketResultUniqueMap } from "./DialogPrenotazioneBody";

export function getSelectedEventsFromTicketResultList(
  ticketResultList: TicketResult[],
  sellTicketStateWithNewOdd: boolean,
) {
  const filteredOutcomeList = ticketResultList.filter(
    (outcome: TicketResult) => !(outcome.stato === 0 && !outcome.quota),
  );
  const esitiGroupByAvvenimento = getTicketResultUniqueMap(filteredOutcomeList);
  return Object.keys(esitiGroupByAvvenimento)
    .map((avvenimentoKey) => {
      const avvenimento = esitiGroupByAvvenimento[avvenimentoKey][0];
      return ticketResultToEventoType(
        avvenimento,
        sellTicketStateWithNewOdd,
        esitiGroupByAvvenimento[avvenimentoKey],
      ) as EventoType;
    })
    .reverse();
}
