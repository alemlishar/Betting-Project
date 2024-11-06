import { useClients } from "src/components/common/context-clients/ClientsContext";
import { useVirtualClients } from "src/components/common/context-clients/VirtualClientsContext";
import { EsitiInBigliettoContext } from "src/components/esito/useEsito";
import { Avvenimento, Disciplina, Manifestazione } from "src/components/prematch/prematch-api";
import { makeChiaveEsito } from "src/types/chiavi";
import { PronosticiParamsType, PronosticiParamsVirtualType } from "src/types/pronosticiParams.types";
import { CardinalityAndSellingAmount, Pronostico } from "src/types/sistemi.types";

export type EsitoType = {
  indice: number;
  id: string;
  codiceManifestazione: number;
  siglaDisciplina: string;
  siglaManifestazione: string;
  blackListMax: number;
  blackListMin: number;
  codiceAvvenimento: number;
  codiceClasseEsito: number;
  codiceClasseEsitoAAMS?: number;
  codiceDisciplina: number;
  codiceEsito: number;
  codiceEsitoAAMS?: number;
  codicePalinsesto: number;
  codiceScommessa: number;
  descrizioneAvvenimento: string;
  descrizioneEsito: string;
  descrizioneManifestazione?: string;
  descrizioneScommessa: string;
  fissa?: boolean;
  formattedDataAvvenimento: string;
  dataAvvenimento: string;
  legameMassimo: number;
  legameMinimo: number;
  legameMultipla: number;
  live: boolean;
  liveDelay?: number;
  handicap?: number;
  handicapVariato?: boolean;
  multipla: number;
  quota: number;
  quotaVariata: boolean;
  stato: number;
  idInfoAggiuntiva: number;
  quotaVariataUpDown: string;
  bonus?: number;
  avvenimento?: Avvenimento | undefined;
  manifestazione?: Manifestazione | undefined;
  disciplina?: Disciplina | undefined;
  tieResult?: number;
  tieOdds?: number;
  tieOddsFormatted?: string;
  providerId?: number;
};

export type CartErrorsType = {
  isGreaterThan20?: boolean;
  isNot5DecimalsMultiple?: boolean;
  isGreaterThan50k?: boolean;
  multiplaBetIsLessThan2?: boolean;
  multiplaWinIsGreaterThan10k?: boolean;
  winIsGreaterThan10k?: boolean;
  combinationsIsGreaterThan2k?: boolean;
  isCombinazioniMinimeErr?: boolean;
  sistemaBetisLessThan2?: boolean;
  sogliaAntiriciclaggioValidation?: boolean;
  betMultiplaIsGreaterThanUserMax?: boolean;
  betSistemaIsGreaterThanUserMax?: boolean;
};

export type UpdateCartClients = ReturnType<typeof useClients>;
export type UpdateVirtualCartClients = ReturnType<typeof useVirtualClients>;
export type SviluppoSistemaType = {
  indice: number;
  combinazioni: number;
  bet: number;
  errors?: CartErrorsType;
  isAvailable: boolean;
  winAmounts: {
    max: number;
    min: number;
  };
};
export type VirtualSviluppoSistemaType = {
  indice: number;
  isAvailable: boolean;
};

//TODO change AlberaturaVirtualEvent (mocked) with the actual type of virtual event.
// export type SelectedEvents = {
//   sport: Array<EventoType>;
//   virtual: Array<VirtualEventType>;
// };

export type VirtualEventType = {
  eventId: number;
  dataAvvenimento: string;
  formattedDataAvvenimento: string;
  formattedOrario: string;
  descrizioneEvento: string;
  stato: number;
  codiceDisciplina: number;
  siglaDisciplina: string;
  codicePalinsesto: string;
  codiceAvvenimento: string;
  provider: number;
  esiti: Array<VirtualEsitoType>;
};

export type VirtualEsitoType = {
  idScommessa: number;
  indice: number;
  descrizione: string;
  descrizioneScommessa: string;
  quota: number;
  formattedQuota: string;
  probwin: number;
  codiceEsito: number;
  rtp: number;
};

export type EventoType = {
  id: string;
  codiceDisciplina: number;
  codiceAvvenimento: number;
  codicePalinsesto: number;
  descrizioneAvvenimento: string;
  live?: boolean;
  dataAvvenimento: string;
  isFixed: boolean;
  esiti: Array<EsitoType>;
  hasQuoteVariate?: boolean;
  codiceManifestazione: number;
  siglaDisciplina: string;
  siglaManifestazione: string;
  marketDescription: string;
  formattedDataAvvenimento: string;
  avvenimento?: Avvenimento | undefined;
  manifestazione?: Manifestazione | undefined;
  disciplina?: Disciplina | undefined;
};
export type ImpostazioniScommessaType = {
  share: number;
  bet: number;
};

export type CartClientType = {
  selectedEvents: Array<EventoType>;
  sviluppoSistema?: Array<SviluppoSistemaType>;
  impostazioniScommessa: Array<ImpostazioniScommessaType>;
  isCurrentClient: boolean;
  puntata: number;
};

export type CartVirtualClientType = {
  selectedEvents: Array<VirtualEventType>;
  isSviluppoSistemaActive: boolean;
  impostazioniScommessa: Array<ImpostazioniScommessaType>;
  puntata: number;
  puntataSistema: Array<CardinalityAndSellingAmount>;
};

export type EsitoStatus = {
  [event: string]: {
    [id: string]: {
      status: string;
      quota: number;
    };
  };
};

export type NewQuote = {
  palinsesto: number;
  avvenimento: number;
  scommessa: number;
  esito: number;
  quota: number;
  handicap: number;
};
export function toEsitoType(pronostico: PronosticiParamsType, carrelloIndice: number): EsitoType {
  return {
    indice: carrelloIndice,
    id: makeChiaveEsito({ ...pronostico }),
    codiceManifestazione: pronostico.codiceManifestazione,
    siglaDisciplina: pronostico.siglaDisciplina,
    siglaManifestazione: pronostico.siglaManifestazione,
    blackListMax: pronostico.blackListMax,
    blackListMin: pronostico.blackListMin,
    codiceAvvenimento: pronostico.codiceAvvenimento,
    codiceClasseEsito: pronostico.codiceClasseEsito,
    codiceClasseEsitoAAMS: pronostico.codiceClasseEsitoAAMS,
    codiceDisciplina: pronostico.codiceDisciplina,
    codiceEsito: pronostico.codiceEsito,
    codiceEsitoAAMS: pronostico.codiceEsitoAAMS,
    codicePalinsesto: pronostico.codicePalinsesto,
    codiceScommessa: pronostico.codiceScommessa,
    descrizioneAvvenimento: pronostico.descrizioneAvvenimento,
    descrizioneEsito: pronostico.descrizioneEsito,
    descrizioneManifestazione: pronostico.descrizioneManifestazione,
    descrizioneScommessa: pronostico.descrizioneScommessa,
    formattedDataAvvenimento: pronostico.formattedDataAvvenimento,
    dataAvvenimento: pronostico.dataAvvenimento,
    legameMassimo: pronostico.legameMassimo,
    legameMinimo: pronostico.legameMinimo,
    legameMultipla: pronostico.legameMultipla,
    multipla: pronostico.multipla,
    live: pronostico.live,
    liveDelay: pronostico.liveDelay,
    fissa: pronostico.isFissa,
    handicap: pronostico.handicap,
    handicapVariato: pronostico.handicapVariato,
    quota: pronostico.quota,
    quotaVariata: false,
    quotaVariataUpDown: "",
    stato: 1,
    idInfoAggiuntiva: pronostico.idInfoAggiuntiva,
    avvenimento: pronostico.avvenimento,
    manifestazione: pronostico.manifestazione,
    disciplina: pronostico.disciplina,
    tieResult: pronostico.tieResult,
    tieOdds: pronostico.tieOdds,
    tieOddsFormatted: pronostico.tieOddsFormatted,
    providerId: pronostico.providerId,
  };
}
export function toPronosticoType(esito: EsitoType): Pronostico {
  return {
    blackListMax: esito.blackListMax,
    blackListMin: esito.blackListMin,
    codiceAvvenimento: esito.codiceAvvenimento,
    codiceClasseEsito: esito.codiceClasseEsito,
    codiceClasseEsitoAAMS: esito.codiceClasseEsitoAAMS,
    codiceDisciplina: esito.codiceDisciplina,
    codiceEsito: esito.codiceEsito,
    codiceEsitoAAMS: esito.codiceEsitoAAMS,
    codiceManifestazione: esito.codiceManifestazione,
    codicePalinsesto: esito.codicePalinsesto,
    codiceScommessa: esito.codiceScommessa,
    descrizioneAvvenimento: esito.descrizioneAvvenimento,
    descrizioneEsito: esito.descrizioneEsito,
    descrizioneManifestazione: esito.descrizioneManifestazione,
    descrizioneScommessa: esito.descrizioneScommessa,
    formattedDataAvvenimento: esito.formattedDataAvvenimento,
    dataAvvenimento: esito.dataAvvenimento,
    legameMassimo: esito.legameMassimo,
    legameMinimo: esito.legameMinimo,
    legameMultipla: esito.legameMultipla,
    multipla: esito.multipla,
    live: esito.live,
    liveDelay: esito.liveDelay,
    fissa: esito.fissa,
    handicap: esito.handicap,
    handicapVariato: esito.handicapVariato,
    quota: esito.quota,
    quotaVariata: false,
    stato: 1,
    idInfoAggiuntiva: esito.idInfoAggiuntiva,
    siglaDisciplina: esito.siglaDisciplina,
    siglaManifestazione: esito.siglaManifestazione,
    tieResult: esito.tieResult,
    tieOdds: esito.tieOdds,
    tieOddsFormatted: esito.tieOddsFormatted,
    providerId: esito.providerId,
  };
}

export function toEsitoVirtualType(pronostico: PronosticiParamsVirtualType, carrelloIndice: number): VirtualEsitoType {
  return {
    indice: carrelloIndice,
    descrizione: pronostico.descrizioneEsito,
    quota: pronostico.quota,
    descrizioneScommessa: pronostico.descrizioneAvvenimento,
    formattedQuota: pronostico.formattedQuota,
    probwin: pronostico.probwin,
    codiceEsito: pronostico.codiceEsito,
    rtp: pronostico.rtp,
    idScommessa: pronostico.codiceScommessa,
  };
}

export function toEventoType(pronostico: PronosticiParamsType, esiti: EsitoType): EventoType {
  return {
    id: `${pronostico.codicePalinsesto}_${pronostico.codiceDisciplina}_${pronostico.codiceAvvenimento}`,
    formattedDataAvvenimento: pronostico.formattedDataAvvenimento,
    codiceManifestazione: pronostico.codiceManifestazione,
    siglaDisciplina: pronostico.siglaDisciplina,
    siglaManifestazione: pronostico.siglaManifestazione,
    marketDescription: pronostico.descrizioneScommessa,
    codiceAvvenimento: pronostico.codiceAvvenimento,
    codiceDisciplina: pronostico.codiceDisciplina,
    codicePalinsesto: pronostico.codicePalinsesto,
    descrizioneAvvenimento: pronostico.descrizioneAvvenimento,
    dataAvvenimento: pronostico.dataAvvenimento,
    live: pronostico.live,
    isFixed: pronostico.isFissa ? pronostico.isFissa : false,
    esiti: [esiti],
    avvenimento: pronostico.avvenimento,
    manifestazione: pronostico.manifestazione,
    disciplina: pronostico.disciplina,
  };
}

export function toEventVirtualType(pronostico: PronosticiParamsVirtualType, esiti: VirtualEsitoType): VirtualEventType {
  return {
    eventId: pronostico.eventId,
    dataAvvenimento: pronostico.dataAvvenimento,
    formattedDataAvvenimento: pronostico.formattedDataAvvenimento,

    formattedOrario: pronostico.formattedOrario,
    descrizioneEvento: pronostico.descrizioneEvento,
    stato: pronostico.stato,
    codiceDisciplina: pronostico.codiceDisciplina,
    siglaDisciplina: pronostico.siglaDisciplina,
    codicePalinsesto: pronostico.codicePalinsesto,
    codiceAvvenimento: pronostico.codiceAvvenimento,
    provider: pronostico.provider,
    esiti: [esiti],
  };
}
