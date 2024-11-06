/*
  | entita         | chiave univoca                                                                                |
  | -------------- | --------------------------------------------------------------------------------------------- |
  | disciplina     | codiceDisciplina                                                                              |
  | manifestazione | codiceDisciplina + codiceManifestazione                                                       |
  | avvenimento    | codicePalinsesto + codiceAvvenimento                                                          |
  | scommessa      | codicePalinstesto + codiceAvvenimento + codiceScommessa                                       |
  | infoAggiuntiva | codicePalinstesto + codiceAvvenimento + codiceScommessa + idInfoagggiuntiva                   |
  | esito          | codicePalinstesto + codiceAvvenimento + codiceScommessa + idInfoagggiuntiva + codiceEsito     |
*/

import { Avvenimento, Disciplina, Manifestazione } from "src/components/prematch/prematch-api";
import { InternalState } from "src/components/virtual/virtual-dto";

export type CodiceDisciplina = number;
export type CodiceManifestazione = number;
export type CodicePalinsesto = number;
export type CodiceAvvenimento = number;
export type CodiceClasseEsito = number;
export type CodiceDescrizione = string;
export type IdInfoAggiuntiva = number;
export type CodiceScommessa = number;
export type CodiceEsito = number;
export type Quota = number;
export type DescrizioneEsito = string;

export type BestSellerEveNum = number;
export type ShowLivescoreAvvenimentiNonInCorso = boolean;
export type SogliaEventiFasceOrariePrematch = number;
export type NumOpenAccordionPrematch = number;
export type NumOpenAccordionLive = number;

export type ChiaveDisciplina = string;
export type ChiaveManifestazione = string;
export type ChiaveAvvenimento = string;
export type ChiaveScommessa = string;
export type ChiaveInfoAggiuntiva = string;
export type ChiavePronosticoString = string;
export type ChiaveEsito = string;
export type DescrizioneAvvenimento = string;
export type DescrizioneScommessa = string;
export type LegaturaAAMS = number;
export type LegaturaMin = number;
export type LegaturaMax = number;
export type Multipla = number;
export type BlackListMin = number;
export type BlackListMax = number;
export type IsLive = boolean;
export type DataAvvenimento = string;
export type FormattedDataAvvenimento = string;
export type IsFissa = boolean;
export type SiglaDisciplina = string;
export type SiglaManifestazione = string;

export type NickName = string;

export type ChiaveManifestazioneComponents = {
  codiceDisciplina: CodiceDisciplina;
  codiceManifestazione: CodiceManifestazione;
};

export type ChiaveAvvenimentoComponents = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
};

export type ChiaveScommessaComponents = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  codiceScommessa: CodiceScommessa;
};

export type ChiaveInfoAggiuntivaComponents = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  codiceScommessa: CodiceScommessa;
  idInfoAggiuntiva: IdInfoAggiuntiva;
};
export type ChiavePronosticoComponents = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  codiceScommessa: CodiceScommessa;
  idInfoAggiuntiva: IdInfoAggiuntiva;
  codiceClasseEsito: CodiceClasseEsito;
  codiceEsito: CodiceEsito;
};
export type ChiaveEsitoComponents = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  codiceScommessa: CodiceScommessa;
  idInfoAggiuntiva: IdInfoAggiuntiva;
  codiceEsito: CodiceEsito;
};
export type ChiaveEsitoBigliettoVirtualComponents = {
  eventId: number;
  dataEvento: string;
  formattedData: string;
  formattedOrario: string;
  idDisciplina: number;
  descrdisc: string;
  descrEvento: string;
  sogeicodpalinsesto: string;
  sogeicodevento: string;
  provider: number;
  rtp: number;
  result: null;
  descrizioneScommessa: string;
  descrizioneEsito: string;
  quota: number;
  formattedQuota: string;
  probwin: number;
  idScommessa: number;
  stato: number;
  idEsito: number;
};

export type ChiaveAccoppiataTrioBigliettoVirtualComponents = ChiaveEsitoBigliettoVirtualComponents & {
  accoppiataTrio: InternalState;
};

export type ChiaveEsitoBigliettoComponents = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  codiceScommessa: CodiceScommessa;
  codiceClasseEsito: CodiceClasseEsito;
  idInfoAggiuntiva: IdInfoAggiuntiva;
  codiceEsito: CodiceEsito;
  descrizioneAvvenimento: DescrizioneAvvenimento;
  codiceManifestazione: CodiceManifestazione;
  descrizioneScommessa: DescrizioneScommessa;
  descrizioneEsito: DescrizioneEsito;
  codiceDisciplina: CodiceDisciplina;
  quota: Quota;
  legaturaAAMS: LegaturaAAMS;
  legaturaMin: LegaturaMin;
  legaturaMax: LegaturaMax;
  multipla: Multipla;
  blackListMin: BlackListMin;
  blackListMax: BlackListMax;
  isLive: IsLive;
  isFissa?: IsFissa;
  formattedDataAvvenimento: FormattedDataAvvenimento;
  dataAvvenimento?: DataAvvenimento;
  siglaDisciplina: SiglaDisciplina;
  siglaManifestazione: SiglaManifestazione;
  avvenimento?: Avvenimento;
  manifestazione?: Manifestazione;
  disciplina?: Disciplina;
};

export type ChiavePronostico = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  codiceClasseEsito: CodiceClasseEsito;
  codiceScommessa: CodiceScommessa;
  idInfoAggiuntiva: IdInfoAggiuntiva;
  codiceEsito: CodiceEsito;
  quota: number;
};

export function makeChiaveDisciplina({ codiceDisciplina }: { codiceDisciplina: CodiceDisciplina }): ChiaveDisciplina {
  return `${codiceDisciplina}`;
}

export function makeChiaveManifestazione({
  codiceDisciplina,
  codiceManifestazione,
}: ChiaveManifestazioneComponents): ChiaveManifestazione {
  return `${codiceDisciplina}-${codiceManifestazione}`;
}

export function makeChiaveAvvenimento({
  codicePalinsesto,
  codiceAvvenimento,
}: ChiaveAvvenimentoComponents): ChiaveAvvenimento {
  return `${codicePalinsesto}-${codiceAvvenimento}`;
}

export function makeChiaveScommessa({
  codicePalinsesto,
  codiceAvvenimento,
  codiceScommessa,
}: ChiaveScommessaComponents): ChiaveScommessa {
  return `${codicePalinsesto}-${codiceAvvenimento}-${codiceScommessa}`;
}

export function makeChiaveInfoAggiuntiva({
  codicePalinsesto,
  codiceAvvenimento,
  codiceScommessa,
  idInfoAggiuntiva,
}: ChiaveInfoAggiuntivaComponents): ChiaveInfoAggiuntiva {
  return `${codicePalinsesto}-${codiceAvvenimento}-${codiceScommessa}-${idInfoAggiuntiva}`;
}
export function makeChiavePronostico({
  codicePalinsesto,
  codiceAvvenimento,
  codiceScommessa,
  idInfoAggiuntiva,
  codiceClasseEsito,
  codiceEsito,
}: ChiavePronosticoComponents): ChiavePronosticoString {
  return `${codicePalinsesto}-${codiceAvvenimento}-${codiceScommessa}-${idInfoAggiuntiva}-${codiceClasseEsito}-${codiceEsito}`;
}

// DEBT rimpiazzare le chiamate makeChiaveEsito({...infoAggiuntiva, codiceEsito }) con makeChiaveEsito(infoAggiuntiva, esito)
type MakeChiaveEsitoParams =
  | [ChiaveEsitoComponents]
  | [
      {
        codicePalinsesto: CodicePalinsesto;
        codiceAvvenimento: CodiceAvvenimento;
        codiceScommessa: CodiceScommessa;
        idInfoAggiuntiva: IdInfoAggiuntiva;
      },
      { codiceEsito: CodiceEsito },
    ];
export function makeChiaveEsito(...params: MakeChiaveEsitoParams): ChiaveEsito {
  if ("codiceEsito" in params[0]) {
    const { codicePalinsesto, codiceAvvenimento, codiceScommessa, idInfoAggiuntiva, codiceEsito } = params[0];
    return `${codicePalinsesto}-${codiceAvvenimento}-${codiceScommessa}-${idInfoAggiuntiva}-${codiceEsito}`;
  } else if (params[1]) {
    const { codicePalinsesto, codiceAvvenimento, codiceScommessa, idInfoAggiuntiva } = params[0];
    const { codiceEsito } = params[1];
    return `${codicePalinsesto}-${codiceAvvenimento}-${codiceScommessa}-${idInfoAggiuntiva}-${codiceEsito}`;
  } else {
    // DEBT remove when upgrading to typescript 4
    throw new Error();
  }
}

export function makeChiaveEsitoVirtual({
  provider,
  idDisciplina,
  eventId,
  idScommessa,
  idEsito,
  sogeicodevento,
}: {
  provider: number;
  idDisciplina: number;
  eventId: number;
  idScommessa: number;
  idEsito: number;
  sogeicodevento: string;
}) {
  return `${provider}-${idDisciplina}-${eventId}-${sogeicodevento}-${idScommessa}-${idEsito}`;
}
