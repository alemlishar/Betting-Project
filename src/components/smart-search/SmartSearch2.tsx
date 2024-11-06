import React from "react";
import { SmartSearchState, SmartSearchState2 } from "src/components/smart-search/useSmartSearch";
import { SuggerimentoEsitoMemo } from "src/components/smart-search/SuggerimentoEsito";
import { ClasseEsitoSmart, InfoAggiuntivaSmart, getStatoEsito } from "src/components/smart-search/smart-api";
import styled from "styled-components/macro";
import { NessunRisultato } from "src/components/smart-search/NessunRisultato";
import { StyledEsitoContainer } from "src/components/smart-search/StyledEsitoContainer";
import { makeChiaveEsito, makeChiaveInfoAggiuntiva } from "src/types/chiavi";
import { getListaEsitiDinamicaColumnsNumber } from "src/components/smart-search/isListaEsitiDinamica";
import { KeyboardHighlight } from "src/components/smart-search/KeyboardHighlight";
import { StyledTypedText } from "src/components/smart-search/StyledHighlightedText";
import { SuggerimentoInfoAggiuntivaMemo } from "src/components/smart-search/SuggerimentoInfoAggiuntiva";
import { useAddEsitoToBiglietto } from "src/components/esito/useEsito";

// DEBT memoize inner items

type SmartSearch2Props = {
  state: SmartSearchState2;
  onStateChange(state: SmartSearchState): void;
  suggerimenti: Array<ClasseEsitoSmart>;
};
// lista classi-esito, info-aggiuntive, shortcut in base al codice (eventualmente alcune quote)
export function SmartSearch2({ state, onStateChange, suggerimenti }: SmartSearch2Props) {
  const { infoAggiuntivaAccordionToggle } = state;
  const visualizzaTutti = state.subtype.type === "risultati" && state.subtype.visualizzaTutti;
  const toggleInfoAggiuntivaAccordion = (
    classeEsitoIndex: number,
    infoAggiuntiva: InfoAggiuntivaSmart,
    infoAggiuntivaIndex: number,
  ) => {
    // DEBT
    const chiaveInfoAggiuntiva = makeChiaveInfoAggiuntiva(infoAggiuntiva);
    const isOpen = infoAggiuntivaAccordionToggle[chiaveInfoAggiuntiva] ?? state.text === "" ?? visualizzaTutti;
    onStateChange({
      ...state,
      subtype:
        state.subtype.type === "navigazione" &&
        state.subtype.classeEsitoEvidenziataIndex === classeEsitoIndex &&
        state.subtype.infoAggiuntivaEvidenziataIndex === infoAggiuntivaIndex
          ? isOpen
            ? {
                type: "navigazione",
                classeEsitoEvidenziataIndex: classeEsitoIndex,
                infoAggiuntivaEvidenziataIndex: state.subtype.infoAggiuntivaEvidenziataIndex,
              }
            : {
                type: "navigazione",
                classeEsitoEvidenziataIndex: classeEsitoIndex,
                infoAggiuntivaEvidenziataIndex: state.subtype.infoAggiuntivaEvidenziataIndex,
                esitoEvidenziatoIndex: 0,
              }
          : state.subtype,
      infoAggiuntivaAccordionToggle: {
        ...infoAggiuntivaAccordionToggle,
        [chiaveInfoAggiuntiva]: !isOpen,
      },
    });
  };
  const onFixClasseEsito = (classeEsito: ClasseEsitoSmart) => {
    onStateChange({
      type: "3",
      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
      text: "",
      avvenimento: state.avvenimento,
      classeEsito,
      infoAggiuntivaAccordionToggle: {},
    });
  };
  const onFixInfoAggiuntiva = (classeEsito: ClasseEsitoSmart, infoAggiuntiva: InfoAggiuntivaSmart) => {
    onStateChange({
      type: "4",
      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
      text: "",
      avvenimento: state.avvenimento,
      classeEsito,
      infoAggiuntiva,
    });
  };
  const isInfoAggiuntivaAccordionOpen = (infoAggiuntiva: InfoAggiuntivaSmart) => {
    return (
      infoAggiuntivaAccordionToggle[makeChiaveInfoAggiuntiva(infoAggiuntiva)] ?? (state.text === "" || visualizzaTutti)
    );
  };
  function isEsitoEvidenziato(classeEsitoIndex: number, infoAggiuntivaIndex: number, esitoIndex: number) {
    return state.subtype.type === "navigazione"
      ? state.subtype.classeEsitoEvidenziataIndex === classeEsitoIndex &&
          state.subtype.infoAggiuntivaEvidenziataIndex === infoAggiuntivaIndex &&
          state.subtype.esitoEvidenziatoIndex === esitoIndex
      : false;
  }
  function isInfoAggiuntivaEvidenziato(classeEsitoIndex: number, infoAggiuntivaIndex: number) {
    return state.subtype.type === "navigazione"
      ? state.subtype.classeEsitoEvidenziataIndex === classeEsitoIndex &&
          state.subtype.infoAggiuntivaEvidenziataIndex === infoAggiuntivaIndex &&
          state.subtype.esitoEvidenziatoIndex === undefined
      : false;
  }
  function isClasseEsitoEvidenziata(classeEsitoIndex: number) {
    return state.subtype.type === "navigazione"
      ? state.subtype.classeEsitoEvidenziataIndex === classeEsitoIndex &&
          state.subtype.infoAggiuntivaEvidenziataIndex === undefined &&
          state.subtype.esitoEvidenziatoIndex === undefined
      : false;
  }
  const onAddEsito = useAddEsitoToBiglietto();
  if (suggerimenti.length === 0) {
    return <NessunRisultato />;
  }
  return (
    <div>
      {suggerimenti.map((classeEsito, classeEsitoIndex) => {
        const highlightType = isNaN(Number(state.text)) ? "descrizione" : "codice";

        const codiceParts = classeEsito.codiceClasseEsito.toString().split(new RegExp(`(${state.text})`, "gi"));
        const codiceClasseEsito =
          highlightType === "descrizione"
            ? classeEsito.codiceClasseEsito
            : codiceParts.map((codicePart, i) => {
                return codicePart === state.text && i === 1 ? (
                  <StyledTypedText
                    key={`${classeEsito.codicePalinsesto}-${classeEsito.codiceAvvenimento}-${classeEsito.codiceClasseEsito}`}
                  >
                    {codicePart}
                  </StyledTypedText>
                ) : (
                  codicePart
                );
              });

        const descriptionParts = classeEsito.descrizione.split(new RegExp(`(${state.text})`, "gi"));
        const descrizioneClasseEsito =
          highlightType === "descrizione"
            ? descriptionParts.map((descriptionPart, i) => {
                return descriptionPart.toLowerCase() === state.text.toLowerCase() ? (
                  <StyledTypedText
                    key={`${classeEsito.codicePalinsesto}-${classeEsito.codiceAvvenimento}-${classeEsito.codiceClasseEsito}`}
                  >
                    {descriptionPart}
                  </StyledTypedText>
                ) : (
                  descriptionPart
                );
              })
            : classeEsito.descrizione;

        return (
          <StyledSuggerimentoContainer key={classeEsito.codiceClasseEsito}>
            <KeyboardHighlight isSelected={isClasseEsitoEvidenziata(classeEsitoIndex)}>
              <StyledSuggerimentoWrapper
                onClick={() => onFixClasseEsito(classeEsito)}
                data-qa={`smart_search_fissa_classeEsito_${classeEsito.codicePalinsesto}_${classeEsito.codiceAvvenimento}_${classeEsito.codiceClasseEsito}`}
              >
                <StyledCodiceClasseEsito>{codiceClasseEsito}</StyledCodiceClasseEsito>
                <StyledDescrizioneContainer>
                  <StyledDescrizioneTop>{descrizioneClasseEsito}</StyledDescrizioneTop>
                  <StyledDescrizioneBottom>
                    Min - max: {classeEsito.infoAggiuntivaList[0].legaturaMin}-
                    {classeEsito.infoAggiuntivaList[0].legaturaMax}
                  </StyledDescrizioneBottom>
                </StyledDescrizioneContainer>
              </StyledSuggerimentoWrapper>
              {classeEsito.infoAggiuntivaList.map((infoAggiuntiva, infoAggiuntivaIndex) => {
                const showInfoAggiuntivaAccordion = infoAggiuntiva.idInfoAggiuntiva !== 0;
                return showInfoAggiuntivaAccordion ? (
                  <SuggerimentoInfoAggiuntivaMemo
                    key={makeChiaveInfoAggiuntiva(infoAggiuntiva)}
                    classeEsito={classeEsito}
                    infoAggiuntiva={infoAggiuntiva}
                    onFix={(infoAggiuntiva) => onFixInfoAggiuntiva(classeEsito, infoAggiuntiva)}
                    onToggle={toggleInfoAggiuntivaAccordion}
                    isToggleOpen={isInfoAggiuntivaAccordionOpen(infoAggiuntiva)}
                    typed={state.text}
                    showIdInfoAggiuntiva={false}
                    isSelected={isInfoAggiuntivaEvidenziato(classeEsitoIndex, infoAggiuntivaIndex)}
                    isEsitoEvidenziato={isEsitoEvidenziato}
                    classeEsitoIndex={classeEsitoIndex}
                    infoAggiuntivaIndex={infoAggiuntivaIndex}
                    onAddEsito={onAddEsito.esitoSport}
                    esitoList={infoAggiuntiva.esitoList}
                    avvenimento={state.avvenimento}
                  />
                ) : (
                  (state.text === "" || visualizzaTutti) && (
                    <StyledEsitoContainer
                      key={makeChiaveInfoAggiuntiva(infoAggiuntiva)}
                      columns={getListaEsitiDinamicaColumnsNumber(classeEsito)}
                    >
                      {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
                        return (
                          <SuggerimentoEsitoMemo
                            classeEsito={classeEsito}
                            key={makeChiaveEsito(esito)}
                            esito={esito}
                            statoEsito={getStatoEsito(esito, infoAggiuntiva)}
                            showCodice={false}
                            isSelected={isEsitoEvidenziato(classeEsitoIndex, infoAggiuntivaIndex, esitoIndex)}
                            onAddEsito={onAddEsito.esitoSport}
                            avvenimento={state.avvenimento}
                            infoAggiuntiva={infoAggiuntiva}
                          />
                        );
                      })}
                    </StyledEsitoContainer>
                  )
                );
              })}
            </KeyboardHighlight>
          </StyledSuggerimentoContainer>
        );
      })}
    </div>
  );
}

const StyledSuggerimentoContainer = styled.div`
  color: white;
  font-style: normal;
  margin: 10px 0;
`;

const StyledSuggerimentoWrapper = styled.div`
  cursor: pointer;
  display: flex;
  scroll-snap-align: start;
`;

const StyledCodiceClasseEsito = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 2px solid white;
  width: 76px;
  height: 31px;
  font-family: Roboto;
  font-weight: 700;
  font-size: 1.125rem;
  margin-right: 10px;
`;

const StyledDescrizioneContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledDescrizioneTop = styled.div`
  font-family: Roboto;
  font-weight: 700;
  font-size: 1.063rem;
`;

const StyledDescrizioneBottom = styled.div`
  font-family: Roboto;
  font-weight: 400;
  font-size: 0.75rem;
`;
