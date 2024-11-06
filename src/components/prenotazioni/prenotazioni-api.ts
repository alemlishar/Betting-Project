import { it } from "src/components/prenotazioni/prenotazioni-dto";
import { fetchJSON, fetchJSONplain, fetchPostJSON } from "src/helpers/fetch-json";
import { BonusConfigType } from "src/types/bonusConfig.type";
import { EsitoType, EventoType } from "src/types/carrello.types";
import { makeChiaveEsito, NickName } from "src/types/chiavi";
import { CardinalityAndSellingAmount } from "src/types/sistemi.types";

export async function getListaPrenotazioni(): Promise<BookingInfosContainer> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/booking/getBookings`);
}

export async function getPrenotazioneByNickName(nickName: NickName): Promise<Prenotazione> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/booking/getBookingByNick/${nickName}`);
}

export async function getPrenotazioneByCode(code: String): Promise<Prenotazione> {
  const data: { result: Prenotazione } | {} = await fetchJSONplain(
    `${process.env.REACT_APP_ENDPOINT}/booking/getBookingByCode/${code}`,
  );
  if ("result" in data && data.result.tickets) {
    return data.result;
  } else {
    throw new Error();
  }
}

export async function getConfigurationBonusMulitpla(): Promise<BonusConfigType> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/bonus/configuration?isMultiple=true`);
}

type DeletePrenotazioneByNicknameType = {
  id: "Success" | "StatusNotChanged" | "Failed";
  ordinal: number;
};
export async function deletePrenotazioneByNickname(nickname: NickName): Promise<DeletePrenotazioneByNicknameType> {
  return fetchPostJSON(`${process.env.REACT_APP_ENDPOINT}/booking/deleteBooking/${nickname}`);
}

export async function deleteTicketFromPrenotazineByNickname(
  nickname: NickName,
  ticketIndex: number,
): Promise<DeletePrenotazioneByNicknameType> {
  return fetchPostJSON(`${process.env.REACT_APP_ENDPOINT}/booking/deleteTicket/${nickname}/${ticketIndex}`);
}

export async function getGiocatasistemistica(
  esitoRequest: Array<EsitoType>,
  cdsr: Array<CardinalityAndSellingAmount>,
): Promise<SviluppoSistema> {
  return fetchPostJSON(`${process.env.REACT_APP_ENDPOINT}/bonus/system/giocatasistemistica/sport`, {
    esitoRequest,
    cdsr,
  });
}

export async function getVenditaPrenotazione(palinsestoVentitaPayload: any): Promise<VenditaPrenotazione> {
  return fetchPostJSON(`${process.env.REACT_APP_ENDPOINT}/booking/sellBooking`, palinsestoVentitaPayload);
}

export type BookingInfosContainer = it.sisal.palinsestosport.model.entity.container.BookingInfosContainer;
export type Prenotazione = it.sisal.palinsestosport.model.entity.prenotazioni.Prenotazione;
export type Booking = it.sisal.palinsestosport.model.entity.prenotazioni.Booking;
export type Ticket = it.sisal.palinsestosport.model.entity.prenotazioni.Ticket;
export type TicketResult = it.sisal.palinsestosport.model.entity.prenotazioni.TicketResult;
export type SystemClass = it.sisal.palinsestosport.model.entity.prenotazioni.SystemClass;

export type SviluppoSistema = it.sisal.palinsestosport.model.entity.giocatasistemistica.SviluppoSistema;
export type Sviluppo = it.sisal.palinsestosport.model.entity.giocatasistemistica.Sviluppo;

export type VenditaPrenotazione = {
  result: "OK" | "KO";
  importo: number;
  message: string;
};

export function ticketResultToEventoType(
  avvenimento: TicketResult,
  sellTicketStateWithNewOdd: boolean,
  esitoList: TicketResult[],
): EventoType {
  return {
    id: `${avvenimento.codicePalinsesto}_${avvenimento.codiceDisciplina}_${avvenimento.codiceAvvenimento}`,
    codiceDisciplina: avvenimento.codiceDisciplina,
    codiceAvvenimento: avvenimento.codiceAvvenimento,
    codicePalinsesto: avvenimento.codicePalinsesto,
    descrizioneAvvenimento: avvenimento.descrizioneAvvenimento,
    live: avvenimento.live,
    dataAvvenimento: avvenimento.dataAvvenimento,
    isFixed: avvenimento.fissa,
    esiti: esitoList.map((esito) => {
      return {
        indice: esito.index + 1,
        id: makeChiaveEsito({ ...esito, idInfoAggiuntiva: esito.codiceInfoAggiuntiva }),
        codiceManifestazione: esito.codiceManifestazione,
        siglaDisciplina: esito.siglaDisciplina,
        siglaManifestazione: esito.siglaManifestazione,
        blackListMax: esito.blackListMax,
        blackListMin: esito.blackListMin,
        codiceAvvenimento: esito.codiceAvvenimento,
        codiceClasseEsito: esito.codiceClasseEsito,
        codiceDisciplina: esito.codiceDisciplina,
        codiceEsito: esito.codiceEsito,
        codicePalinsesto: esito.codicePalinsesto,
        codiceScommessa: esito.codiceScommessa,
        descrizioneAvvenimento: esito.descrizioneAvvenimento,
        descrizioneEsito: esito.descrizioneEsito,
        descrizioneScommessa: esito.descrizioneScommessa,
        fissa: esito.fissa,
        formattedDataAvvenimento: esito.formattedDataAvvenimento,
        dataAvvenimento: esito.dataAvvenimento,
        legameMassimo: esito.legameMassimo,
        legameMinimo: esito.legameMinimo,
        legameMultipla: esito.legameMultipla,
        live: esito.live,
        multipla: esito.multipla,
        quota: sellTicketStateWithNewOdd ? esito.quota : esito.quotaOld,
        quotaVariata: esito.quotaVariata,
        stato: esito.stato,
        idInfoAggiuntiva: esito.codiceInfoAggiuntiva,
        quotaVariataUpDown: esito.quotaVariata ? (esito.quota > esito.quotaOld ? "up" : "down") : "",
      } as EsitoType;
    }),
    hasQuoteVariate: avvenimento.quotaVariata,
    codiceManifestazione: avvenimento.codiceManifestazione,
    siglaDisciplina: avvenimento.siglaDisciplina,
    siglaManifestazione: avvenimento.siglaManifestazione,
    marketDescription: avvenimento.descrizioneInfoAggiuntiva,
    formattedDataAvvenimento: avvenimento.formattedDataAvvenimento,
  };
}
