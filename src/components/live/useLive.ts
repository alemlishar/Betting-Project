import { useState } from "react";
import { Disciplina, Avvenimento, Manifestazione } from "src/components/prematch/prematch-api";
import {
  ChiaveManifestazione,
  CodiceAvvenimento,
  CodiceDisciplina,
  CodiceManifestazione,
  CodicePalinsesto,
  makeChiaveManifestazione,
} from "src/types/chiavi";
import useSWR from "swr";
import { AlberaturaLive, getAlberatura } from "src/components/live/live-api";
import { makeAlberaturaMaps } from "src/components/live/MenuLive";

export type LiveState = {
  selected:
    | { type: "tutto" }
    | { type: "disciplina"; disciplina: Disciplina }
    | {
        type: "avvenimento";
        disciplina: Disciplina | undefined;
        manifestazione: Manifestazione | undefined;
        avvenimento: Avvenimento | undefined;
        codicePalinsesto: CodicePalinsesto;
        codiceDisciplina: CodiceDisciplina;
        codiceManifestazione: CodiceManifestazione;
        codiceAvvenimento: CodiceAvvenimento;
      };
  codiceDisciplinaOpen: CodiceDisciplina | undefined;
  chiaviManifestazioneOpen: Record<ChiaveManifestazione, boolean>;
};

// DEBT spostare logica qui dentro
export function useLive() {
  const [state, setState] = useState<LiveState>({
    selected: { type: "tutto" },
    codiceDisciplinaOpen: undefined,
    chiaviManifestazioneOpen: {},
  });
  const { data: alberatura } = useSWR("alberaturaLive", getAlberatura, { refreshInterval: 10000 });
  return { state, setState, alberatura };
}

const defaultLiveState: LiveState = {
  selected: { type: "tutto" },
  codiceDisciplinaOpen: undefined,
  chiaviManifestazioneOpen: {},
};

export function getDefaultLiveState(alberatura: AlberaturaLive | undefined): LiveState {
  if (!alberatura) {
    return defaultLiveState;
  }
  const { disciplinaList, manifestazioneListByDisciplina } = makeAlberaturaMaps(alberatura);
  const firstDisciplina = disciplinaList[0];
  if (!firstDisciplina) {
    return defaultLiveState;
  }
  const firstManifestazione = manifestazioneListByDisciplina[firstDisciplina.codiceDisciplina][0];
  return {
    selected: { type: "disciplina", disciplina: firstDisciplina },
    codiceDisciplinaOpen: firstDisciplina.codiceDisciplina,
    chiaviManifestazioneOpen: { [makeChiaveManifestazione(firstManifestazione)]: true },
  };
}
