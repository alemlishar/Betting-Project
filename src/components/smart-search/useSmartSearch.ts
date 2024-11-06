import { useRef, useState } from "react";
import { SmartGetParams, smartGetRisultati } from "src/components/smart-search/smart-api";
import useSWR from "swr";
import { AvvenimentoSmart, ClasseEsitoSmart, InfoAggiuntivaSmart } from "src/components/smart-search/smart-api";
import { ChiaveInfoAggiuntiva } from "src/types/chiavi";

export type SmartSearchState =
  | SmartSearchState0
  | SmartSearchState1
  | SmartSearchState2
  | SmartSearchState3
  | SmartSearchState4;

export type SmartSearchState0 = {
  type: "0";
  subtype: { type: "inattivo" } | { type: "focus" };
  text: "";
  avvenimento?: undefined;
  classeEsito?: undefined;
  infoAggiuntiva?: undefined;
};

export type SmartSearchState1 = {
  type: "1";
  subtype:
    | { type: "risultati"; nessunaCorrispondenza: boolean; visualizzaTutti: boolean }
    | { type: "navigazione"; avvenimentoEvidenziatoIndex: number };
  text: string;
  soloAvvenimentiConCodiceCompleto?: boolean;
  avvenimento?: undefined;
  classeEsito?: undefined;
  infoAggiuntiva?: undefined;
};

export type SmartSearchState2 = {
  type: "2";
  subtype:
    | { type: "risultati"; nessunaCorrispondenza: boolean; visualizzaTutti: boolean }
    | {
        type: "navigazione";
        classeEsitoEvidenziataIndex: number;
        infoAggiuntivaEvidenziataIndex?: number;
        esitoEvidenziatoIndex?: number;
      };
  avvenimento: AvvenimentoSmart;
  classeEsito?: undefined;
  infoAggiuntiva?: undefined;
  text: string;
  infoAggiuntivaAccordionToggle: Record<ChiaveInfoAggiuntiva, boolean>;
};

export type SmartSearchState3 = {
  type: "3";
  subtype:
    | { type: "risultati"; nessunaCorrispondenza: boolean; visualizzaTutti: boolean }
    | { type: "navigazione"; infoAggiuntivaEvidenziataIndex: number; esitoEvidenziatoIndex?: number };
  avvenimento: AvvenimentoSmart;
  classeEsito: ClasseEsitoSmart;
  infoAggiuntiva?: undefined;
  text: string;
  infoAggiuntivaAccordionToggle: Record<ChiaveInfoAggiuntiva, boolean>;
};

export type SmartSearchState4 = {
  type: "4";
  subtype:
    | { type: "risultati"; nessunaCorrispondenza: boolean; visualizzaTutti: boolean }
    | { type: "navigazione"; esitoEvidenziatoIndex: number };
  avvenimento: AvvenimentoSmart;
  classeEsito: ClasseEsitoSmart;
  infoAggiuntiva: InfoAggiuntivaSmart;
  text: string;
};

export function useSmartSearch() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [state, setState] = useState<SmartSearchState>({
    type: "0",
    subtype: { type: "focus" },
    text: "",
  });
  const { data: suggerimenti } = useSmartSearchSuggerimenti(state);
  return { inputRef, state, setState, suggerimenti };
}

function useSmartSearchSuggerimenti(state: SmartSearchState) {
  const params = getSmartParams(state);
  return useSWR(params, smartGetRisultati, { refreshInterval: 5000, shouldRetryOnError: false });
}

function getSmartParams(state: SmartSearchState): SmartGetParams {
  const textToRequest = state.subtype.type === "risultati" && state.subtype.visualizzaTutti ? "" : state.text;
  switch (state.type) {
    case "0":
      return ["0"];
    case "1":
      return ["1", Boolean(state.soloAvvenimentiConCodiceCompleto), textToRequest];
    case "2":
      return [
        "2",
        state.avvenimento.codicePalinsesto,
        state.avvenimento.codiceAvvenimento,
        state.avvenimento.categoria !== 0,
        textToRequest,
      ];
    case "3":
      return [
        "3",
        state.avvenimento.codicePalinsesto,
        state.avvenimento.codiceAvvenimento,
        state.classeEsito.codiceClasseEsito,
        state.avvenimento.categoria !== 0,
        textToRequest,
      ];
    case "4":
      return [
        "4",
        state.avvenimento.codicePalinsesto,
        state.avvenimento.codiceAvvenimento,
        state.classeEsito.codiceClasseEsito,
        state.infoAggiuntiva.idInfoAggiuntiva,
        state.avvenimento.categoria !== 0,
        textToRequest,
      ];
  }
}
