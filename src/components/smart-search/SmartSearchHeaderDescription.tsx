import React from "react";
import { SmartSearchState } from "src/components/smart-search/useSmartSearch";
import styled from "styled-components/macro";

function SmartSearchHeaderDescription({ state }: { state: SmartSearchState }) {
  switch (state.type) {
    case "0":
    case "1":
      return (
        <StyledSmartSearchHeaderDescription>
          <StyledSmartSearchHeaderDescriptionTitle>Avvenimento</StyledSmartSearchHeaderDescriptionTitle>
          <StyledSmartSearchHeaderDescriptionSubtitle>
            Inserisci il codice o ricerca testualmente
          </StyledSmartSearchHeaderDescriptionSubtitle>
        </StyledSmartSearchHeaderDescription>
      );
    case "2":
      return (
        <StyledSmartSearchHeaderDescription>
          <StyledSmartSearchHeaderDescriptionTitle>Scommessa o Tasti rapidi</StyledSmartSearchHeaderDescriptionTitle>
          <StyledSmartSearchHeaderDescriptionSubtitle>
            Inserisci il codice, un tasto rapido o ricerca testualmente
          </StyledSmartSearchHeaderDescriptionSubtitle>
        </StyledSmartSearchHeaderDescription>
      );
    case "3":
      if (
        state.classeEsito.infoAggiuntivaList.length === 1 &&
        state.classeEsito.infoAggiuntivaList[0].idInfoAggiuntiva === 0
      ) {
        return (
          <StyledSmartSearchHeaderDescription>
            <StyledSmartSearchHeaderDescriptionTitle>Esito</StyledSmartSearchHeaderDescriptionTitle>
            <StyledSmartSearchHeaderDescriptionSubtitle>
              Inserisci il codice o ricerca testualmente
            </StyledSmartSearchHeaderDescriptionSubtitle>
          </StyledSmartSearchHeaderDescription>
        );
      } else {
        return (
          <StyledSmartSearchHeaderDescription>
            <StyledSmartSearchHeaderDescriptionTitle>Informazione aggiuntiva</StyledSmartSearchHeaderDescriptionTitle>
            <StyledSmartSearchHeaderDescriptionSubtitle>
              Inserisci il codice o ricerca testualmente
            </StyledSmartSearchHeaderDescriptionSubtitle>
          </StyledSmartSearchHeaderDescription>
        );
      }
    case "4":
      return (
        <StyledSmartSearchHeaderDescription>
          <StyledSmartSearchHeaderDescriptionTitle>Esito</StyledSmartSearchHeaderDescriptionTitle>
          <StyledSmartSearchHeaderDescriptionSubtitle>
            Inserisci il codice o ricerca testualmente
          </StyledSmartSearchHeaderDescriptionSubtitle>
        </StyledSmartSearchHeaderDescription>
      );
    default:
      throw new Error();
  }
}
export const SmartSearchHeaderDescriptionMemo = React.memo(SmartSearchHeaderDescription);

export const StyledSmartSearchHeaderDescription = styled.div`
  padding-left: 20px;
  width: 66.66%;
`;

export const StyledSmartSearchHeaderDescriptionTitle = styled.div`
  color: #aac21f;
  font-size: 1.438rem;
  font-family: Mulish;
  font-weight: 800;
`;

export const StyledSmartSearchHeaderDescriptionSubtitle = styled.div`
  color: white;
  font-size: 1.063rem;
  font-family: Mulish;
  font-weight: 800;
`;
