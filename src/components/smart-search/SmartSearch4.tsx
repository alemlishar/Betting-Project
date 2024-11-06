import React from "react";
import { SmartSearchState4 } from "src/components/smart-search/useSmartSearch";
import { SuggerimentoEsitoMemo } from "src/components/smart-search/SuggerimentoEsito";
import { NessunRisultato } from "src/components/smart-search/NessunRisultato";
import { EsitoSmart, getStatoEsito } from "src/components/smart-search/smart-api";
import { StyledEsitoContainer } from "src/components/smart-search/StyledEsitoContainer";
import { getListaEsitiDinamicaColumnsNumber } from "src/components/smart-search/isListaEsitiDinamica";
import { useAddEsitoToBiglietto } from "src/components/esito/useEsito";

// DEBT memoize inner items

type SmartSearch4Props = {
  state: SmartSearchState4;
  suggerimenti: Array<EsitoSmart>;
};
// lista esiti in base al codice
export function SmartSearch4({ state, suggerimenti }: SmartSearch4Props) {
  const onAddEsito = useAddEsitoToBiglietto();
  if (suggerimenti.length === 0) {
    return <NessunRisultato />;
  }
  return (
    <StyledEsitoContainer columns={getListaEsitiDinamicaColumnsNumber(state.classeEsito)}>
      {suggerimenti.map((esito, index) => {
        const isSelected = state.subtype.type === "navigazione" && state.subtype.esitoEvidenziatoIndex === index;
        return (
          <SuggerimentoEsitoMemo
            classeEsito={state.classeEsito}
            typed={state.text}
            key={esito.codiceEsito}
            esito={esito}
            statoEsito={getStatoEsito(esito, state.infoAggiuntiva)}
            showCodice={true}
            onAddEsito={onAddEsito.esitoSport}
            isSelected={isSelected}
            avvenimento={state.avvenimento}
            infoAggiuntiva={state.infoAggiuntiva}
          />
        );
      })}
    </StyledEsitoContainer>
  );
}
