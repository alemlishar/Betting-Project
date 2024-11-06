import { EsitoType } from "src/types/carrello.types";

export type GiocataSistemisticaSviluppataResponse = {
  esito: number;
  costoTotale: number;
  vincitaMinimaTotale: number;
  vincitaTotale: number;
  numeroTotaleMultiple: number;
  sviluppoByCardinalita: Array<SviluppoSistema>;
  pronosticoList: Array<Pronostico>;
};
export type GiocataSistemisticaSviluppataVirtualResponse = {
  vincitaMinimaTotale: number;
  vincitaTotale: number;
  sviluppoByCardinalita: Array<SviluppoSistema>;
};

export type SviluppoSistema = {
  integrale: boolean;
  cardinalita: number;
  importo: number;
  importoTotale: number;
  vincitaMinima: number;
  vincitaTotaleSistemaIntegrale: number;
  vincitaTotale: number;
  vincita: number;
  esito: number;
  numeroSviluppi: number;
  bonusApplicato: boolean;
  vincitaMassimaCombinazione: number;
  vincitaMassima: number;
  importoMassimoCombinazione: number;
  quotaMassima: number;
};

export type Pronostico = {
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
  dataAvvenimento: string;
  formattedDataAvvenimento: string;
  descrizioneAvvenimento: string;
  descrizioneEsito: string;
  descrizioneManifestazione?: string;
  descrizioneScommessa: string;
  fissa?: boolean | undefined;
  handicap?: number;
  formattedHandicap?: null;
  handicapVariato?: boolean;
  idInfoAggiuntiva: number;
  legameMassimo: number;
  legameMinimo: number;
  legameMultipla: number;
  live: boolean;
  liveDelay?: number;
  multipla: number;
  providerId?: number;
  quota: number;
  quotaVariata: boolean;
  risultato?: null;
  stato: number;
  tieOdds?: number;
  tieOddsFormatted?: string;
  tieResult?: number;
  codiceManifestazione: number;
  siglaDisciplina: string;
  siglaManifestazione: string;
};

export type CardinalityAndSellingAmount = {
  cardinalita: number;
  importo: number;
};

export type GiocataSistemisticaRequest = {
  esitoRequest: Array<EsitoType>;
  cdsr: Array<CardinalityAndSellingAmount>;
};
