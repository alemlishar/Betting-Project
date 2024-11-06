import {
  CodiceDisciplina,
  CodiceManifestazione,
  CodicePalinsesto,
  CodiceAvvenimento,
  CodiceClasseEsito,
  IdInfoAggiuntiva,
  CodiceEsito,
  CodiceScommessa,
  DescrizioneScommessa,
} from "src/types/chiavi";
import { fetchJSON } from "src/helpers/fetch-json";
import { DateAsString } from "src/components/prematch/prematch-dto";

const simulaEsitoChiusoESospeso = false; // DEBT remove

// DEBT cambiare isNaN(Number(text)) in funzione globale

// gli endpoint smart-search riceveranno direttamente la stringa di ricerca digitata dall'utente
// questo permette il filtro sia per codici che per descrizione che per shortcut lato backend
// i risultati forniti dal backend arriveranno gia ordinati e filtrati indicando la tipologia di ricerca
// /services/betting/smart-search/n dove n si riferisce alla fase di ricerca
// fase 1 avvenimenti
// fase 2 classi esito (con relative info aggiuntive che contendgono esiti)
// fase 3 info aggiuntive (con esiti)
// fase 4 esiti

async function getSuggerimenti1(
  soloCodiciEsatti: boolean,
  text: string,
): Promise<{ avvenimentoList: Array<AvvenimentoSmart> }> {
  // text == "" restituire top avvenimenti
  // se il codice di un avvenimento e indentico al testo cercato, devo comparire per primo
  // se la descrizione di un avvenimento è identica al testo digitato questo deve risultare primo dell'elenco
  // se il codice avvenimento è uguale su più avvenimenti di diverso palinsesto, il parametro soloCodiciEsatti = true
  //   dovranno essere restituiti solo gli avvenimenti con codiceAvvenimento === text
  const { avvenimentoList } = (await fetchJSON(`/services/betting/smart-search/1/${text}`)) as {
    avvenimentoList: Array<AvvenimentoSmart>;
  };
  return {
    avvenimentoList: avvenimentoList.filter((avvenimento) =>
      soloCodiciEsatti
        ? avvenimento.codiceAvvenimento.toString() === text ||
          avvenimento.descrizione.toLocaleLowerCase() === text.toLocaleLowerCase()
        : true,
    ),
  };
}

async function getSuggerimenti2(
  codicePalinsesto: CodicePalinsesto,
  codiceAvvenimento: CodiceAvvenimento,
  live: boolean,
  text: string,
): Promise<{ classeEsitoList: Array<ClasseEsitoSmart>; searchMode: SmartSearchMode }> {
  if (simulaEsitoChiusoESospeso) {
    const data: { classeEsitoList: Array<ClasseEsitoSmart>; searchMode: SmartSearchMode } = await fetchJSON(
      `/services/betting/smart-search/2/${codicePalinsesto}/${codiceAvvenimento}/${live}/${text}`,
    );
    return {
      classeEsitoList: data.classeEsitoList.map((classeEsito) => ({
        ...classeEsito,
        infoAggiuntivaList: classeEsito.infoAggiuntivaList.map((infoAggiuntiva, infoAggiuntivaIndex) =>
          infoAggiuntivaIndex === 0
            ? {
                ...infoAggiuntiva,
                stato: 2,
                esitoList: infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
                  switch (esitoIndex) {
                    case 0:
                      return { ...esito, stato: 0 };
                    case 1:
                      return { ...esito, stato: 1 };
                    default:
                      return esito;
                  }
                }),
              }
            : infoAggiuntiva,
        ),
      })),
      searchMode: data.searchMode,
    };
  }
  // se text == "" verranno restituite solo le prime 10 classe d'esito
  // dato il text nella risposta sarà indicato la modalità di ricerca
  // se la descrizione di una classe esito è identica al testo digitato questa deve risultare prima dell'elenco
  return fetchJSON(`/services/betting/smart-search/2/${codicePalinsesto}/${codiceAvvenimento}/${live}/${text}`);
}

async function getSuggerimenti3(
  codicePalinsesto: CodicePalinsesto,
  codiceAvvenimento: CodiceAvvenimento,
  codiceClasseEsito: CodiceClasseEsito,
  live: boolean,
  text: string,
): Promise<{ infoAggiuntivaList: Array<InfoAggiuntivaSmart> }> {
  // se text == "" verranno restituite tutte le info aggiuntive
  // se la classe esito ha solo una info aggiuntiva, e quella info aggiuntiva ha idInfoAggiuntiva == 0
  //  allora la ricerca deve essere fatta sugli esiti
  //  altrimenti sulle info aggiuntive
  return fetchJSON(
    `/services/betting/smart-search/3/${codicePalinsesto}/${codiceAvvenimento}/${codiceClasseEsito}/${live}/${text}`,
  );
}

async function getSuggerimenti4(
  codicePalinsesto: CodicePalinsesto,
  codiceAvvenimento: CodiceAvvenimento,
  codiceClasseEsito: CodiceClasseEsito,
  idInfoAggiuntiva: IdInfoAggiuntiva,
  live: boolean,
  text: string,
): Promise<{ esitoList: Array<EsitoSmart> }> {
  return fetchJSON(
    `/services/betting/smart-search/4/${codicePalinsesto}/${codiceAvvenimento}/${codiceClasseEsito}/${idInfoAggiuntiva}/${live}/${text}`,
  );
}

export type AvvenimentoSmart = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  codiceDisciplina: CodiceDisciplina;
  codiceManifestazione: CodiceManifestazione;
  descrizioneDisciplina: string;
  descrizioneManifestazione: string;
  descrizione: string;
  formattedDataAvvenimento: string;
  categoria: number;
};

export type ClasseEsitoSmart = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  codiceClasseEsito: CodiceClasseEsito;
  descrizione: string;
  legaturaMin: number;
  legaturaMax: number;
  listaEsitiDinamica: boolean;
  infoAggiuntivaList: Array<InfoAggiuntivaSmart>;
};

export type InfoAggiuntivaSmart = {
  codicePalinsesto: CodicePalinsesto;
  data: DateAsString;
  codiceAvvenimento: CodiceAvvenimento;
  codiceScommessa: CodiceScommessa;
  idInfoAggiuntiva: IdInfoAggiuntiva;
  codiceClasseEsito: CodiceClasseEsito;
  codedIdInfoAggiuntiva: number;
  descrizione: string;
  legaturaMin: number;
  legaturaMax: number;
  esitoList: Array<EsitoSmart>;
  stato:
    | 0 // chiusa
    | 1 // aperta
    | 2; // sospesa
};

export type EsitoSmart = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  codiceScommessa: CodiceScommessa;
  idInfoAggiuntiva: IdInfoAggiuntiva;
  codiceEsito: CodiceEsito;
  codiceClasseEsito: CodiceClasseEsito;
  descrizioneScommessa: DescrizioneScommessa;
  stato:
    | 0 // chiuso
    | 1; //aperto
  descrizione: string;
  quota: number;
  legaturaAAMS: number;
  legaturaMin: number;
  legaturaMax: number;
  multipla: number;
  blackListMin: number;
  blackListMax: number;
  isLive: boolean;
  isFissa: boolean;
  formattedDataAvvenimento: string;
  dataAvvenimento: string;
  codiceManifestazione: number;
  descrizioneAvvenimento: string;
  descrizioneEsito: string;
  codiceDisciplina: number;
  siglaDisciplina: string;
  siglaManifestazione: string;
};

export type StatoEsito = "chiuso" | "aperto" | "sospeso";
export function getStatoEsito(esito: EsitoSmart, infoAggiuntiva: InfoAggiuntivaSmart): StatoEsito {
  if (esito.stato === 0) {
    return "chiuso";
  }
  if (esito.stato === 1) {
    if (infoAggiuntiva.stato === 2) {
      return "sospeso";
    }
    return "aperto";
  }
  return "chiuso"; // caso di default in caso di dati inconsistenti
}

export type SmartGetParams =
  | ["0"]
  | ["1", boolean, string] // avvenimenti
  | ["2", CodicePalinsesto, CodiceAvvenimento, boolean, string] // classi esito
  | ["3", CodicePalinsesto, CodiceAvvenimento, CodiceClasseEsito, boolean, string] // info aggiuntive
  | ["4", CodicePalinsesto, CodiceAvvenimento, CodiceClasseEsito, IdInfoAggiuntiva, boolean, string]; // esiti

export type SuggerimentiSmart = {
  avvenimentoList: Array<AvvenimentoSmart>;
  classeEsitoList: Array<ClasseEsitoSmart>;
  infoAggiuntivaList: Array<InfoAggiuntivaSmart>;
  esitoList: Array<EsitoSmart>;
  searchMode?: SmartSearchMode;
};

type SmartSearchMode = "codice" | "descrizione" | "shortcut";

const emptySuggerimenti: SuggerimentiSmart = {
  avvenimentoList: [],
  classeEsitoList: [],
  infoAggiuntivaList: [],
  esitoList: [],
};

export async function smartGetRisultati(...params: SmartGetParams): Promise<SuggerimentiSmart> {
  switch (params[0]) {
    case "0": {
      return emptySuggerimenti;
    }
    case "1": {
      const [, soloCodiciEsatti, text] = params;
      return { ...emptySuggerimenti, ...(await getSuggerimenti1(soloCodiciEsatti, text)) };
    }
    case "2": {
      const [, codicePalinsesto, codiceAvvenimento, live, text] = params;
      return { ...emptySuggerimenti, ...(await getSuggerimenti2(codicePalinsesto, codiceAvvenimento, live, text)) };
    }
    case "3": {
      const [, codicePalinsesto, codiceAvvenimento, codiceClasseEsito, live, text] = params;
      return {
        ...emptySuggerimenti,
        ...(await getSuggerimenti3(codicePalinsesto, codiceAvvenimento, codiceClasseEsito, live, text)),
      };
    }
    case "4": {
      const [, codicePalinsesto, codiceAvvenimento, codiceClasseEsito, idInfoAggiuntiva, live, text] = params;
      return {
        ...emptySuggerimenti,
        ...(await getSuggerimenti4(
          codicePalinsesto,
          codiceAvvenimento,
          codiceClasseEsito,
          idInfoAggiuntiva,
          live,
          text,
        )),
      };
    }
  }
}
