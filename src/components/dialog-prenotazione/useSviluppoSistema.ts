import { useMemo } from "react";
import {
  getGiocatasistemistica,
  SviluppoSistema,
  SystemClass,
  Ticket,
  TicketResult,
} from "src/components/prenotazioni/prenotazioni-api";
import { makeChiaveEsito } from "src/types/chiavi";
import useSWR from "swr";

const getEsitoRequest = (ticketResultList: TicketResult[]) => {
  const filteredOutcomeList = ticketResultList.filter(
    (outcome: TicketResult) => !(outcome.stato === 0 && !outcome.quota),
  );

  return filteredOutcomeList.map((outcome) => {
    return {
      indice: outcome.index,
      id: makeChiaveEsito({ ...outcome, idInfoAggiuntiva: outcome.codiceInfoAggiuntiva }),
      codiceManifestazione: outcome.codiceManifestazione,
      siglaDisciplina: outcome.siglaDisciplina,
      siglaManifestazione: outcome.siglaManifestazione,
      blackListMax: outcome.blackListMax,
      blackListMin: outcome.blackListMin,
      codiceAvvenimento: outcome.codiceAvvenimento,
      codiceClasseEsito: outcome.codiceClasseEsito,
      codiceDisciplina: outcome.codiceDisciplina,
      codiceEsito: outcome.codiceEsito,
      codicePalinsesto: outcome.codicePalinsesto,
      codiceScommessa: outcome.codiceScommessa,
      dataAvvenimento: outcome.dataAvvenimento,
      descrizioneAvvenimento: outcome.descrizioneAvvenimento,
      descrizioneEsito: outcome.descrizioneEsito,
      descrizioneScommessa: outcome.descrizioneScommessa,
      fissa: outcome.fissa,
      formattedDataAvvenimento: outcome.formattedDataAvvenimento,
      legameMassimo: outcome.legameMassimo,
      legameMinimo: outcome.legameMinimo,
      legameMultipla: outcome.legameMultipla,
      multipla: outcome.multipla,
      live: outcome.live,
      quota: outcome.quota,
      quotaVariata: outcome.quotaVariata,
      quotaVariataUpDown: outcome.quotaVariata ? (outcome.quota > outcome.quotaOld ? "up" : "down") : "",
      stato: outcome.stato,
      idInfoAggiuntiva: outcome.codiceInfoAggiuntiva,
    };
  });
};

const getCDSR = (ticket: Ticket) => {
  return ticket.systemClasses
    ? ticket.systemClasses.map((develop: SystemClass) => {
        return { cardinalita: develop.key, importo: develop.value.bettingPrice };
      })
    : [];
};

export function useSviluppoSistema(ticket: Ticket) {
  const esitoRequest = useMemo(() => {
    return getEsitoRequest(ticket.results);
  }, [ticket.results]);

  const cdsr = useMemo(() => {
    return getCDSR(ticket);
  }, [ticket]);

  const { data: sviluppoSistema } = useSWR(ticket.systemClasses ? [esitoRequest, cdsr] : null, getGiocatasistemistica, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return { sviluppoSistema };
}

export async function getSviluppoSistema(ticket: Ticket) {
  const esitoRequest = getEsitoRequest(ticket.results);

  const cdsr = getCDSR(ticket);

  const data: SviluppoSistema = await Promise.resolve(await getGiocatasistemistica(esitoRequest, cdsr)).then(
    (response: SviluppoSistema) => {
      return response;
    },
  );
  return data;
}
