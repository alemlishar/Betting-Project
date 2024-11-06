import React from "react";
import {
  InfoAggiuntivaSmart,
  EsitoSmart,
  ClasseEsitoSmart,
  getStatoEsito,
  AvvenimentoSmart,
} from "src/components/smart-search/smart-api";
import styled, { css } from "styled-components/macro";
import { makeChiaveInfoAggiuntiva, ChiaveEsitoComponents } from "src/types/chiavi";
import icoArrowDownBlack from "src/assets/images/icon-arrow-down-black.png";
import icoArrowUpBlack from "src/assets/images/icon-arrow-up-black.png";
import { formatIdInfoAggiuntiva } from "src/components/smart-search/formatting";
import { KeyboardHighlight } from "src/components/smart-search/KeyboardHighlight";
import { SuggerimentoEsitoMemo } from "src/components/smart-search/SuggerimentoEsito";
import { StyledEsitoContainer } from "src/components/smart-search/StyledEsitoContainer";
import { getListaEsitiDinamicaColumnsNumber } from "src/components/smart-search/isListaEsitiDinamica";
import { StyledTypedText } from "src/components/smart-search/StyledHighlightedText";

// DEBT styled
// DEBT memoizzare

type SuggerimentoInfoAggiuntivaProps = {
  classeEsito: ClasseEsitoSmart;
  infoAggiuntiva: InfoAggiuntivaSmart;
  isSelected: boolean;
  isToggleOpen: boolean;
  onFix(infoAggiuntiva: InfoAggiuntivaSmart): void;
  typed: string;
  showIdInfoAggiuntiva: boolean;
  onAddEsito(chiaveEsitoComponents: ChiaveEsitoComponents): void;
  esitoList: Array<EsitoSmart>;
  classeEsitoIndex: number;
  infoAggiuntivaIndex: number;
  isEsitoEvidenziato(classeEsitoIndex: number, infoAggiuntivaIndex: number, esitoIndex: number): boolean;
  onToggle(classeEsitoIndex: number, infoAggiuntiva: InfoAggiuntivaSmart, infoAggiuntivaIndex: number): void;
  avvenimento: AvvenimentoSmart;
};

function SuggerimentoInfoAggiuntiva({
  classeEsito,
  infoAggiuntiva,
  isSelected,
  isToggleOpen,
  onFix,
  typed,
  showIdInfoAggiuntiva,
  onAddEsito,
  esitoList,
  isEsitoEvidenziato,
  classeEsitoIndex,
  infoAggiuntivaIndex,
  onToggle,
  avvenimento,
}: SuggerimentoInfoAggiuntivaProps) {
  const highlightType = isNaN(Number(typed)) ? "descrizione" : "codice";

  const codiceParts = formatIdInfoAggiuntiva(infoAggiuntiva.codedIdInfoAggiuntiva).split(
    new RegExp(`(${typed})`, "gi"),
  );
  const codiceInfoAggiuntiva =
    highlightType === "descrizione"
      ? formatIdInfoAggiuntiva(infoAggiuntiva.codedIdInfoAggiuntiva)
      : codiceParts.map((codicePart, i) => {
          return codicePart === typed && i === 1 ? (
            <StyledTypedText key={makeChiaveInfoAggiuntiva(infoAggiuntiva)}>{codicePart}</StyledTypedText>
          ) : (
            codicePart
          );
        });

  const descriptionParts = infoAggiuntiva.descrizione.split(new RegExp(`(${typed})`, "gi"));
  const descrizioneInfoAggiuntiva =
    highlightType === "descrizione"
      ? descriptionParts.map((descriptionPart, i) => {
          return descriptionPart.toLowerCase() === typed.toLowerCase() ? (
            <StyledTypedText key={makeChiaveInfoAggiuntiva(infoAggiuntiva)}>{descriptionPart}</StyledTypedText>
          ) : (
            descriptionPart
          );
        })
      : infoAggiuntiva.descrizione;

  return (
    <StyledInfoAggiuntivaAccordionContainer key={makeChiaveInfoAggiuntiva(infoAggiuntiva)}>
      <KeyboardHighlight isSelected={isSelected}>
        <div
          css={css`
            display: flex;
          `}
        >
          <StyledInfoAggiuntivaAccordionSummary
            onClick={() => {
              onFix(infoAggiuntiva);
            }}
            data-qa={`smart_search_fissa_infoAggiuntiva_${makeChiaveInfoAggiuntiva(infoAggiuntiva)}`}
          >
            {showIdInfoAggiuntiva && <StyledCodiceInfoAggiuntiva>{codiceInfoAggiuntiva}</StyledCodiceInfoAggiuntiva>}
            <div
              css={css`
                flex-direction: column;
              `}
            >
              <StyledInfoAggiuntivaAccordionDescrizione>
                {descrizioneInfoAggiuntiva}
              </StyledInfoAggiuntivaAccordionDescrizione>
              <StyledInfoAggiuntivaAccordionLegatura>
                Min - max: {infoAggiuntiva.legaturaMin}
                &nbsp;-&nbsp;{infoAggiuntiva.legaturaMax}
              </StyledInfoAggiuntivaAccordionLegatura>
            </div>
          </StyledInfoAggiuntivaAccordionSummary>
          <div
            css={css`
              height: 25px;
              width: 25px;
              background-color: #ffffff;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
              border-radius: 50%;
              align-self: center;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            `}
            onClick={() => {
              onToggle(classeEsitoIndex, infoAggiuntiva, infoAggiuntivaIndex);
            }}
            data-qa={`smart_search_toggle_accordion_infoAggiuntiva_${makeChiaveInfoAggiuntiva(infoAggiuntiva)}`}
          >
            <img
              src={isToggleOpen ? icoArrowUpBlack : icoArrowDownBlack}
              alt="icon-toggle"
              css={css`
                margin-left: 1px;
                margin-top: ${isToggleOpen ? "0px" : "2px"};
              `}
            />
          </div>
        </div>
      </KeyboardHighlight>
      {isToggleOpen && (
        <StyledEsitoContainer columns={getListaEsitiDinamicaColumnsNumber(classeEsito)}>
          {esitoList.map((esito, esitoIndex) => {
            return (
              <SuggerimentoEsitoMemo
                key={esito.codiceEsito}
                esito={esito}
                statoEsito={getStatoEsito(esito, infoAggiuntiva)}
                showCodice={false}
                isSelected={isEsitoEvidenziato(classeEsitoIndex, infoAggiuntivaIndex, esitoIndex)}
                onAddEsito={onAddEsito}
                avvenimento={avvenimento}
                classeEsito={classeEsito}
                infoAggiuntiva={infoAggiuntiva}
              />
            );
          })}
        </StyledEsitoContainer>
      )}
    </StyledInfoAggiuntivaAccordionContainer>
  );
}
export const SuggerimentoInfoAggiuntivaMemo = React.memo(SuggerimentoInfoAggiuntiva);

const StyledInfoAggiuntivaAccordionContainer = styled.div`
  background-color: #444444;
  margin: 10px -20px;
  padding: 10px 20px;
  color: #ffffff;
`;

const StyledInfoAggiuntivaAccordionSummary = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  cursor: pointer;
  scroll-snap-align: start;
`;

const StyledInfoAggiuntivaAccordionDescrizione = styled.div`
  font-family: Roboto;
  font-size: 1.063rem;
  font-weight: 700;
`;

const StyledInfoAggiuntivaAccordionLegatura = styled.div`
  font-family: Roboto;
  font-size: 0.75rem;
`;

const StyledCodiceInfoAggiuntiva = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 2px solid white;
  min-width: 76px;
  height: 31px;
  font-family: Roboto;
  font-weight: 700;
  font-size: 1.125rem;
  margin-right: 10px;
`;
