import React from "react";
import { NessunRisultato } from "src/components/smart-search/NessunRisultato";
import { StyledEsitoContainer } from "src/components/smart-search/StyledEsitoContainer";
import { SuggerimentoEsitoMemo } from "src/components/smart-search/SuggerimentoEsito";
import { SmartSearchState, SmartSearchState3 } from "src/components/smart-search/useSmartSearch";
import { InfoAggiuntivaSmart, getStatoEsito } from "src/components/smart-search/smart-api";
import { getListaEsitiDinamicaColumnsNumber } from "src/components/smart-search/isListaEsitiDinamica";
import { SuggerimentoInfoAggiuntivaMemo } from "src/components/smart-search/SuggerimentoInfoAggiuntiva";
import { makeChiaveInfoAggiuntiva } from "src/types/chiavi";
import { useAddEsitoToBiglietto } from "src/components/esito/useEsito";

// DEBT memoize inner items

type SmartSearch3Props = {
  state: SmartSearchState3;
  suggerimenti: Array<InfoAggiuntivaSmart>;
  onStateChange(state: SmartSearchState): void;
};
// lista info-aggiuntive (con relativi esiti) in base al codice
export function SmartSearch3({ state, onStateChange, suggerimenti }: SmartSearch3Props) {
  const onAddEsito = useAddEsitoToBiglietto();
  const { infoAggiuntivaAccordionToggle } = state;
  const onFix = (infoAggiuntiva: InfoAggiuntivaSmart) => {
    onStateChange({
      type: "4",
      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
      text: "",
      avvenimento: state.avvenimento,
      classeEsito: state.classeEsito,
      infoAggiuntiva,
    });
  };
  // DEBT memoize
  const toggleInfoAggiuntivaAccordion = (
    classeEsitoIndex: number,
    infoAggiuntiva: InfoAggiuntivaSmart,
    infoAggiuntivaIndex: number,
  ) => {
    const chiaveInfoAggiuntiva = makeChiaveInfoAggiuntiva(infoAggiuntiva);
    if (isInfoAggiuntivaEvidenziato(infoAggiuntivaIndex)) {
      if (isInfoAggiuntivaAccordionOpen(infoAggiuntiva)) {
        onStateChange({
          ...state,
          subtype: {
            type: "navigazione",
            infoAggiuntivaEvidenziataIndex: infoAggiuntivaIndex,
          },
          infoAggiuntivaAccordionToggle: {
            ...infoAggiuntivaAccordionToggle,
            [chiaveInfoAggiuntiva]: !(infoAggiuntivaAccordionToggle[chiaveInfoAggiuntiva] ?? state.text === ""),
          },
        });
      } else {
        onStateChange({
          ...state,
          subtype: {
            type: "navigazione",
            infoAggiuntivaEvidenziataIndex: infoAggiuntivaIndex,
            esitoEvidenziatoIndex: 0,
          },
          infoAggiuntivaAccordionToggle: {
            ...infoAggiuntivaAccordionToggle,
            [chiaveInfoAggiuntiva]: !(infoAggiuntivaAccordionToggle[chiaveInfoAggiuntiva] ?? state.text === ""),
          },
        });
      }
    } else {
      onStateChange({
        ...state,
        subtype:
          state.subtype.type === "navigazione" && state.subtype.infoAggiuntivaEvidenziataIndex === infoAggiuntivaIndex
            ? { type: "navigazione", infoAggiuntivaEvidenziataIndex: state.subtype.infoAggiuntivaEvidenziataIndex }
            : state.subtype,
        infoAggiuntivaAccordionToggle: {
          ...infoAggiuntivaAccordionToggle,
          [chiaveInfoAggiuntiva]: !(infoAggiuntivaAccordionToggle[chiaveInfoAggiuntiva] ?? state.text === ""),
        },
      });
    }
  };
  if (suggerimenti.length === 0) {
    return <NessunRisultato />;
  }
  const infoAggiuntiveAssenti = suggerimenti.length === 1 && suggerimenti[0].idInfoAggiuntiva === 0;
  function isEsitoEvidenziato(classeEsitoIndex: number, infoAggiuntivaIndex: number, esitoIndex: number) {
    return state.subtype.type === "navigazione"
      ? state.subtype.infoAggiuntivaEvidenziataIndex === infoAggiuntivaIndex &&
          state.subtype.esitoEvidenziatoIndex === esitoIndex
      : false;
  }
  function isInfoAggiuntivaEvidenziato(infoAggiuntivaIndex: number) {
    return state.subtype.type === "navigazione"
      ? state.subtype.infoAggiuntivaEvidenziataIndex === infoAggiuntivaIndex &&
          state.subtype.esitoEvidenziatoIndex === undefined
      : false;
  }
  const isInfoAggiuntivaAccordionOpen = (infoAggiuntiva: InfoAggiuntivaSmart) => {
    return (
      infoAggiuntivaAccordionToggle[makeChiaveInfoAggiuntiva(infoAggiuntiva)] ??
      (infoAggiuntiveAssenti ||
        state.text === "" ||
        (state.subtype.type === "risultati" && state.subtype.visualizzaTutti))
    );
  };
  if (infoAggiuntiveAssenti) {
    return (
      <StyledEsitoContainer columns={getListaEsitiDinamicaColumnsNumber(state.classeEsito)}>
        {suggerimenti[0].esitoList.map((esito, esitoIndex) => {
          const isSelected = isEsitoEvidenziato(0, 0, esitoIndex);
          return (
            <SuggerimentoEsitoMemo
              classeEsito={state.classeEsito}
              typed={state.text}
              key={esito.codiceEsito}
              esito={esito}
              statoEsito={getStatoEsito(esito, suggerimenti[0])}
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
  return (
    <div>
      {suggerimenti.map((infoAggiuntiva, infoAggiuntivaIndex) => {
        const chiaveInfoAggiuntiva = makeChiaveInfoAggiuntiva(infoAggiuntiva);
        return (
          <SuggerimentoInfoAggiuntivaMemo
            key={chiaveInfoAggiuntiva}
            classeEsito={state.classeEsito}
            infoAggiuntiva={infoAggiuntiva}
            typed={state.text}
            showIdInfoAggiuntiva={true}
            isToggleOpen={isInfoAggiuntivaAccordionOpen(infoAggiuntiva)}
            onToggle={toggleInfoAggiuntivaAccordion}
            onFix={onFix}
            isSelected={isInfoAggiuntivaEvidenziato(infoAggiuntivaIndex)}
            isEsitoEvidenziato={isEsitoEvidenziato}
            classeEsitoIndex={0}
            infoAggiuntivaIndex={infoAggiuntivaIndex}
            onAddEsito={onAddEsito.esitoSport}
            esitoList={infoAggiuntiva.esitoList}
            avvenimento={state.avvenimento}
          />
        );
      })}
    </div>
  );
}
