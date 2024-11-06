import {
  FiltroGiornaliero,
  InfoAggiuntiva,
  InfoAggiuntivaAggregator,
  InfoAggiuntivaAggregatorGroup,
  Scommessa,
} from "./prematch-api";
import { useState } from "react";
import {
  ChiaveDisciplina,
  ChiaveScommessa,
  CodiceAvvenimento,
  CodiceDisciplina,
  CodiceManifestazione,
  CodicePalinsesto,
} from "src/types/chiavi";
import { FiltroMenuPrematch } from "src/components/prematch/MenuPrematch";
import {
  Manifestazione,
  Cluster,
  MetaScommessaTemplate,
  Disciplina,
  Avvenimento,
} from "src/components/prematch/prematch-api";
import { getAlberaturaPrematch } from "src/components/prematch/prematch-api";
import useSWR from "swr";

export type PrematchState = {
  schedaManifestazione: SchedaManifestazioneView | undefined;
  schedaAvvenimento: SchedaAvvenimentoView | undefined;
  schedaInfoAggiuntivaAggregator: SchedaInfoAggiuntivaAggregatorView | undefined;
  filtro: FiltroMenuPrematch;
  isDisciplinaAccordionOpenByKey: Record<ChiaveDisciplina, boolean>;
  infoAggiuntivaAggregatorModal: InfoAggiuntivaAggregatorModalView | undefined;
};

export type InfoAggiuntivaAggregatorModalView = {
  infoAggiuntiva: InfoAggiuntiva;
  infoAggiuntivaAggregator: InfoAggiuntivaAggregator;
  infoAggiuntivaAggregatorGroup: InfoAggiuntivaAggregatorGroup;
  avvenimento: Avvenimento;
  manifestazione: Manifestazione;
  disciplina: Disciplina;
  scommessaMap: Record<ChiaveScommessa, Scommessa>;
};

export type SchedaManifestazioneView = {
  disciplina: Disciplina;
  manifestazione: Manifestazione;
  userSelectedView: ManifestazioneSelectedView | undefined;
  isMarketGridOpen: boolean;
  filtroGiornaliero: FiltroGiornaliero;
};

export type SchedaAvvenimentoView = {
  disciplina: Disciplina | undefined;
  manifestazione: Manifestazione | undefined;
  avvenimento: Avvenimento | undefined;
  codiceAvvenimento: CodiceAvvenimento;
  codiceDisciplina: CodiceDisciplina;
  codiceManifestazione: CodiceManifestazione;
  codicePalinsesto: CodicePalinsesto;
};

// TODO
export type SchedaInfoAggiuntivaAggregatorView = {
  infoAggiuntivaAggregator: InfoAggiuntivaAggregator;
};

// DEBT usare i codici (perchè attivando il polling cluster e template potrebbero cambiare)
export type ManifestazioneSelectedView = {
  cluster: Cluster;
  metaScommessaTemplate: MetaScommessaTemplate;
};

export const defaultPrematchState: PrematchState = {
  schedaManifestazione: undefined,
  schedaAvvenimento: undefined,
  schedaInfoAggiuntivaAggregator: undefined,
  isDisciplinaAccordionOpenByKey: {},
  infoAggiuntivaAggregatorModal: undefined,
  filtro: "tutti",
};

export function usePrematch() {
  const [state, setState] = useState<PrematchState>(defaultPrematchState);
  return { state, setState };
}

export function useAlberaturaPrematch() {
  const { data } = useSWR("alberatura prematch", getAlberaturaPrematch, { dedupingInterval: 60 * 1000 });
  return data;
}
