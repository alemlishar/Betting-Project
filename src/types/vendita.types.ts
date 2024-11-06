import { EsitoType } from "src/types/carrello.types";
import { CardinalityAndSellingAmount } from "src/types/sistemi.types";

//case: SINGOLA/MULTIPLA
export type PalinsestoVendita = {
  palinsesto: number;
  avvenimento: number;
  scommessa: number;
  live: boolean | undefined;
  eventDescription: string;
  marketDescription: string;
  eventDate: string;
  fixed: boolean | undefined;
  esito: number;
  quota: number;
  descrizioneEsito: string;
  flagBonus: number;
  infoAggiuntiva: number;
  codiceDisciplina: number;
  codiceManifestazione: number;
  siglaDisciplina: string;
  siglaManifestazione: string;
};
export type Events = {
  palinsesto?: number;
  avvenimento?: number;
};
export type CheckInizioAvvenimento = {
  events?: Events[];
};
export type BonusPercVar = {
  tipoBonus: number;
  minAvv: number;
  bonus: number;
};
export type VendiConQuoteCambiate = {
  flag: string;
};

export type AttrExt = {
  checkInizioAvvenimento?: CheckInizioAvvenimento;
  bonusPercVar?: BonusPercVar;
  vendiConQuoteCambiate?: VendiConQuoteCambiate;
  consoleAccettazione?: ConsoleAccettazione;
};

export type VenditaQFType = {
  prezzo: number;
  maxPag: number;
  scommesse: PalinsestoVendita[];
  attrExt?: AttrExt;
  conto: string;
  force: boolean;
};

//case: SISTEMA
export type Sistemi = {
  sistema: number; //numero avvenimenti?
  quota: number; //Importo base da applicare alle scommesse generate dal sistema (in centesimi)
  multiple: number; //Numero multiple sviluppate dal sistema
  minWinningAmount: number;
  maxWinningAmount: number;
};

export type EsitoSportSistemistica = {
  esito: number; //Codice esito
  descrizioneEsito: string;
  quota: number; //Quota associata all’esito (in centesimi)
  flagBonus?: number; //Indica se l’esito partecipa al bonus.
  // Vale 0 se l’esito non partecipa al bonus, vale 1 se
  // l’esito partecipa al bonus.
};

export type ScommessaSportSistemistica = {
  scommessa: number; //Codice scommessa
  infoaggiuntive: number; //Valore dell’informazione aggiuntiva. Vale [0] se l
  marketDescription: string;
  //scommessa non prevede informazioni aggiuntive.
  esiti: EsitoSportSistemistica[];
};

export type NumAvvBase = {
  palinsesto: number; //Codice palinsesto
  avvenimento: number; //Codice avvenimento
  fissa: number; //Indica se l’avvenimento è fisso
  legame: number; //0 indica che l’avvenimento è legabile con tutti gli altri avvenimenti
  codiceManifestazione: number;
  siglaDisciplina: string;
  siglaManifestazione: string;
  live?: boolean;
  codiceDisciplina: number;
  eventDate: string;
  eventDescription: string;
  scommesse: ScommessaSportSistemistica[];
};
export type AttrExtSistema = {
  checkInizioAvvenimento?: CheckInizioAvvenimento;
  bonusPercVarSistema?: BonusPercVarSistema;
  vendiConQuoteCambiate?: VendiConQuoteCambiate;
  consoleAccettazione?: ConsoleAccettazione;
};
export type BonusPercVarSistema = {
  tipoBonus: number;
  sistemi: BonusSistemi[];
};
export type BonusSistemi = {
  sistema?: string;
  bonus: number;
  minAvv: number;
  filtro: string;
};
export type VenditaSportSistemisticaType = {
  prezzo: number; //Prezzo totale del biglietto (in centesimi)
  potentialWinningAmount: number | undefined;
  sistemi: Sistemi[];
  numAvvBase: NumAvvBase[];
  attrExt?: AttrExtSistema;
  conto: string;
  force: boolean;
};

export type VenditaOptionalParameters = {
  isPreview?: boolean;
  forceSell?: boolean;
  newFlag?: 1 | 2 | 3;
  potentialWinning?: number;
};

export type PreviewRequest = {
  esitoRequest: EsitoType[];
  cdsr: CardinalityAndSellingAmount[];
  totalAmountCombinations: string;
  venditaSportSistemisticaDTO: VenditaSportSistemisticaType | {};
};

export type ConsoleAccettazione = {
  idAccettazione: string;
};

export type VenditaWSResponse =
  | VenditaSuccessResponse
  | VenditaErrorResponse
  | VenditaAcceptanceAmountsChangedResponse
  | VenditaRejectedResponse;

export type VenditaSuccessResponse = {
  readonly response: SuccessResponse;
  readonly idTransactionBeFe: string;
  readonly status: "SUCCESS";
};
export type VenditaErrorResponse = {
  readonly response: ErrorResponse;
  readonly idTransactionBeFe: string;
  readonly status: "ERROR";
};

export type VenditaRejectedResponse = {
  readonly response: RejectedResponse;
  readonly idTransactionBeFe: string;
  readonly status: "REJECTED";
};

export type VenditaAcceptanceAmountsChangedResponse = {
  readonly response: AmountsChangedResponse;
  readonly idTransactionBeFe: string;
  readonly status: "ACCEPTANCE_AMOUNTS_CHANGED";
};

export type AmountsChangedResponse = {
  readonly splitPlay: boolean;
  readonly attrExtConsole: AttrExtConsole;
  readonly status: string;
  readonly sellingChanged: boolean;
  readonly sellingHasBonus: boolean;
};

export type AttrExtConsole = {
  readonly amount: Amount;
  readonly status: Status;
};

export type Amount = {
  readonly amount: number;
  readonly numSviluppi: NumSviluppi[];
};

export type NumSviluppi = {
  readonly tipo: number;
  readonly amount: number;
};

export type Status = {
  readonly idAccettazione: string;
  readonly status: string;
};

export type SuccessResponse = {
  readonly splitPlay: boolean;
  readonly ticketId: string;
  readonly status: string;
  readonly sellingChanged: boolean;
  readonly sellingHasBonus: boolean;
};

export type ErrorResponse = {
  readonly error: SellErrorType;
};

export type SellErrorType = {
  readonly code?: string;
  readonly message: string;
  readonly properties?: SellErrorPropertyType[];
};

//Response solo per le prenotazione singolo e multi biglietto
export type RejectedResponse = {
  readonly errorCode?: string;
  readonly errorMessage: string;
  readonly properties?: SellErrorPropertyType[];
};

export type SellErrorPropertyType = {
  readonly name: string;
  readonly value: string;
};
