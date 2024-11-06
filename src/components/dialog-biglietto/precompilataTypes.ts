import { Pronostico } from "src/types/sistemi.types";

export type CreaPrecompilataRequest = {
  writeBookingRequest: WriteBookingRequest;
  ticketType: string;
};
type WriteBookingRequest = {
  prenotazione: Prenotazione;
  expirationDate: string;
};
// riempire solo una delle diue liste
// l'altra passarla vuota
type Prenotazione = {
  bigliettoSportExtList: BigliettoSport[];
  bigliettoSportSistemaList: BigliettoSportSistemaList[];
};
type BigliettoSportSistemaList = {
  bigliettoSport: BigliettoSport;
  listaGruppiSistemaSport: ListaGruppiSistemaSport;
};
type BigliettoSport = {
  bonus: Bonus;
  codiceLoyalty: string;
  idVoucher: string;
  importoVendita: number;
  importoVincita: number;
  listPronostico: ListPronostico;
  impostazioniVariazioneImporto: number;
  impostazioniVariazioniQuote: number;
  listaScommesse: unknown[];
};
type Bonus = {
  importo: number;
  numeroMinimoAvvenimenti: number;
  quotaMinEsito: number;
  tipo: number;
};
type ListPronostico = Array<Pronostico>;
type ListaGruppiSistemaSport = {
  gruppi: Gruppi[];
};
export type Gruppi = {
  numClasse: number;
  importo: number;
  numCombinazioni: number;
  flagBonusMultipla: boolean;
  vincitaMinima: number;
  vincitaMassima: number;
};
