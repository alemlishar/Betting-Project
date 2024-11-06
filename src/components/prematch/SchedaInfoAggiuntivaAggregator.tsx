import React from "react";
import { InfoAggiuntivaAggregator } from "src/components/prematch/prematch-api";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

// TODO
type SchedaInfoAggiuntivaAggregatorProps = {
  infoAggiuntivaAggregator: InfoAggiuntivaAggregator;
};
export function SchedaInfoAggiuntivaAggregator({ infoAggiuntivaAggregator }: SchedaInfoAggiuntivaAggregatorProps) {
  const { closeSchedaInfoAggiuntivaAggregator } = useNavigazioneActions();
  return (
    <div>
      <h1>dettaglio giocatore</h1>
      <button onClick={closeSchedaInfoAggiuntivaAggregator}>chiudi</button>
      <pre>{JSON.stringify(infoAggiuntivaAggregator, null, 2)}</pre>
    </div>
  );
}
