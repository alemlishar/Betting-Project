export type EventoVirtualeBase = {
  eventId: number;
  dataEvento: string;
  formattedData: string;
  formattedOrario: string;
  stato: number;
  idDisciplina: number;
  descrdisc: string;
  sogeicodpalinsesto: string;
  sogeicodevento: string;
  provider: number;
  streamid: number;
  streamname: string;
  providerid: number;
  parentId: number;
  gold: boolean;
};

export type EventoVirtualeCalcioSingolo = {
  playerVirtualeList: PlayerVirtuale[];
  scommessaVirtualeBaseList: ScommessaVirtualeBase[];
  descrEvento: string;
  stadium: string;
} & EventoVirtualeBase;

export type EventoVirtualeCalcioSingoloConCLuster = {
  vrolHighLightClusterList: VrolHighLightCluster[];
} & EventoVirtualeCalcioSingolo;

export type EventoVirtualeRace = {
  coursename: string;
  racerVirtualeList: RacerVirtualeList[];
  scommessaVirtualeBaseList: ScommessaVirtualeRace[];
} & EventoVirtualeBase;

export type EventoVirtualeCampionato = {
  giornata: number;
  campionato: number;
  scommessaClassicaList: ScommessaCampionato[];
  vrolHighLightClusterList: VrolHighLightCluster[];
  codPalVrolHighLight: string;
  tipoCampionato: string;
  scommessaVirtualeBaseList: ScommessaVirtualeBase[];
} & EventoVirtualeBase;

type PlayerVirtuale = {
  name: string;
  textureid: string;
  humname: null;
  humtextureid: null;
  id: number;
};

export type RacerVirtualeList = {
  fav: any;
  form: string;
  formattedPlace: string;
  formattedPrice: string;
  humname: string;
  humtextureid: string;
  id: number;
  lane: number;
  name: string;
  place: string;
  position: number;
  price: string;
  probwin: string;
  rank: string;
  show: string;
  textureid: string;
};

export type ScommessaVirtualeBase = {
  descrizione: string;
  rtp: number;
  result: null;
  sogeicodpalinsesto: string;
  sogeicodevento: string;
  esitoVirtualeList: EsitoVirtuale[];
  stato: number;
  id: number;
};

export type ScommessaVirtualeRace = {
  descrizione: string;
  rtp: number;
  result: null;
  sogeicodpalinsesto: string;
  sogeicodevento: string;
  esitoVirtualeList: EsitoVirtuale[];
  stato: number;
  id: number;
  scommessaVirtualeBaseList: ScommessaVirtualeBase[];
};

export type EsitoVirtuale = {
  descrizione: string;
  quota: number;
  formattedQuota: string;
  probwin: number;
  id: number;
};

export type VrolHighLightCluster = {
  descrizione: string;
  scommessaKeyList: number[];
  descrizioneEsitiMap: Record<string, string>;
};

export type ScommessaCampionato = ScommessaVirtualeBase & { descrizioneAvvenimento: string };

export type VirtualState = {
  eventId: number;
  codiceDisciplina: string;
  title: string;
  subtitle: string;
  startTime: string;
  detailId: { type: "singola" | "campionato"; codicePalinsesto: string; codiceEvento: string };
  formattedTime: string;
};

export type ParamsVirtualDetails = {
  sogeicodPalinsesto: string;
  sogeicodevento: string;
};

export type VirtualStateNavigation = {
  eventId: number;
  codiceDisciplina: string;
  sogeicodPalinsesto: string;
  sogeicodevento: string;
};

export type RunnerId = number;
export type InternalState =
  | { type: "nothing" }
  | { type: "accoppiata"; inOrdine: true; byRunner: Record<RunnerId, Record<AccoppiataPosition, true | undefined>> }
  | { type: "accoppiata"; inOrdine: false; byRunner: Record<RunnerId, true | undefined> }
  | { type: "trio"; inOrdine: true; byRunner: Record<RunnerId, Record<TrioPosition, true | undefined>> }
  | { type: "trio"; inOrdine: false; byRunner: Record<RunnerId, true | undefined> };
export type AccoppiataPosition = 1 | 2;
export type TrioPosition = 1 | 2 | 3;
