import React from "react";
import { HomePrematch } from "src/components/prematch/HomePrematch";
import { HomePagePrematchState } from "src/components/prematch/prematch-api";
import { SchedaAvvenimento } from "src/components/prematch/SchedaAvvenimento";
import { SchedaInfoAggiuntivaAggregator } from "src/components/prematch/SchedaInfoAggiuntivaAggregator";
import { SchedaManifestazionePrematchMemo } from "src/components/prematch/SchedaManifestazione";
import { PrematchState } from "src/components/prematch/usePrematch";

type PalinsestoSportProps = {
  state: HomePagePrematchState;
  prematchState: PrematchState;
  pushToast(content: React.ReactNode, duration: number): void;
};

export function PalinsestoSport({ state, prematchState, pushToast }: PalinsestoSportProps) {
  const { schedaAvvenimento, schedaManifestazione, schedaInfoAggiuntivaAggregator } = prematchState;
  if (schedaInfoAggiuntivaAggregator) {
    return <SchedaInfoAggiuntivaAggregator {...schedaInfoAggiuntivaAggregator} />;
  }
  if (schedaAvvenimento) {
    return <SchedaAvvenimento {...schedaAvvenimento} />;
  }
  if (schedaManifestazione) {
    return <SchedaManifestazionePrematchMemo {...schedaManifestazione} pushToast={pushToast} />;
  }
  return <HomePrematch state={state} />;
}
