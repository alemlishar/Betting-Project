import React from "react";
import styled from "styled-components/macro";
import { AvvenimentoSmart } from "src/components/smart-search/smart-api";
import { KeyboardHighlight } from "src/components/smart-search/KeyboardHighlight";
import { StyledAvvenimentoLiveBadge } from "src/components/smart-search/StyledAvvenimentoLiveBadge";
import { makeChiaveAvvenimento } from "src/types/chiavi";

type SuggerimentoAvvenimentoProps = {
  typed: string;
  isSelected: boolean;
  avvenimento: AvvenimentoSmart;
  onFix(avvenimento: AvvenimentoSmart): void;
};
function SuggerimentoAvvenimento({ typed, isSelected, avvenimento, onFix }: SuggerimentoAvvenimentoProps) {
  const highlightType = isNaN(Number(typed)) ? "descrizione" : "codice";

  const codiceParts = avvenimento.codiceAvvenimento.toString().split(new RegExp(`(${typed})`, "gi"));
  const codiceAvventimento =
    highlightType === "descrizione"
      ? avvenimento.codiceAvvenimento
      : codiceParts.map((codicePart, i) => {
          return codicePart === typed && i === 1 ? (
            <StyledTypedText key={makeChiaveAvvenimento(avvenimento)}>{codicePart}</StyledTypedText>
          ) : (
            codicePart
          );
        });

  const descriptionParts = avvenimento.descrizione.split(new RegExp(`(${typed})`, "gi"));
  const descrizioneAvventimento =
    highlightType === "descrizione"
      ? descriptionParts.map((descriptionPart, i) => {
          return descriptionPart.toLowerCase() === typed.toLowerCase() ? (
            <StyledTypedText key={makeChiaveAvvenimento(avvenimento)}>{descriptionPart}</StyledTypedText>
          ) : (
            descriptionPart
          );
        })
      : avvenimento.descrizione;

  const isAvvenimentoLive = avvenimento.categoria !== 0;

  return (
    <KeyboardHighlight isSelected={isSelected}>
      <StyledSuggerimentoAvvenimentoContainer
        onClick={() => onFix(avvenimento)}
        data-qa={`smart_search_fissa_avvenimento_${avvenimento.codicePalinsesto}_${avvenimento.codiceAvvenimento}`}
      >
        <div>
          <StyledCodiceAvvenimento isAvvenimentoLive={isAvvenimentoLive}>{codiceAvventimento}</StyledCodiceAvvenimento>

          {isAvvenimentoLive && <StyledAvvenimentoLiveBadge>live</StyledAvvenimentoLiveBadge>}
        </div>
        <StyledAvvenimentoDescriptionContainer>
          <StyledAvvenimentoDescrizioneDisciplina>
            {avvenimento.descrizioneDisciplina} | {avvenimento.descrizioneManifestazione}
          </StyledAvvenimentoDescrizioneDisciplina>
          <StyledAvvenimentoDescrizione>{descrizioneAvventimento}</StyledAvvenimentoDescrizione>
          <StyledAvvenimentoDate>{avvenimento.formattedDataAvvenimento}</StyledAvvenimentoDate>
        </StyledAvvenimentoDescriptionContainer>
      </StyledSuggerimentoAvvenimentoContainer>
    </KeyboardHighlight>
  );
}
export const SuggerimentoAvvenimentoMemo = React.memo(SuggerimentoAvvenimento);

export const StyledSuggerimentoAvvenimentoContainer = styled.div`
  display: flex;
  color: white;
  cursor: default;
  height: 100%;
`;

export const StyledCodiceAvvenimento = styled.div<{
  isAvvenimentoLive: boolean;
}>`
  font-family: Roboto;
  border: 2px solid white;
  border-bottom: ${(props) => (props.isAvvenimentoLive ? "none" : "2px solid #ffffff")};
  border-radius: ${(props) => (props.isAvvenimentoLive ? "4px 4px 0 0" : "4px")};
  width: 76px;
  height: ${(props) => (props.isAvvenimentoLive ? "42px" : "57px")};
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;

  ${StyledSuggerimentoAvvenimentoContainer}:hover & {
    background-color: #ffffff;
    color: #aac21f;
  }
`;

const StyledTypedText = styled.span`
  font-family: Roboto;
  color: #aac21f;
`;

export const StyledAvvenimentoDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 84px);
`;

const StyledAvvenimentoDescrizioneDisciplina = styled.div`
  font-family: Roboto;
  font-size: 0.75rem;
`;
const StyledAvvenimentoDescrizione = styled.div`
  font-family: Roboto;
  font-size: 1rem;
  font-weight: 700;
`;
const StyledAvvenimentoDate = styled.div`
  font-family: Roboto;
  font-size: 0.75rem;
`;
