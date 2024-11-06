import React from "react";
import ImgEmptyPrenotazioni from "src/assets/images/img-empty-prenotazioni.png";
import styled, { css } from "styled-components/macro";

export function EmptyPrenotazioni() {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: [emptyImage] max-content [description] max-content;
        justify-content: center;
        align-items: center;
        margin-top: 40px;
      `}
    >
      <img
        alt="img-prenotazione-empty"
        css={css`
          height: auto;
          grid-column: emptyImage;
        `}
        src={ImgEmptyPrenotazioni}
      />
      <div
        css={css`
          margin-left: -75px;
          grid-column: description;
        `}
      >
        <StyledTitle>Nessuna prenotazione associata</StyledTitle>
        <StyledSubTitle>Ricercala tramite codice o aggiorna la pagina</StyledSubTitle>
      </div>
    </div>
  );
}

const StyledTitle = styled.div`
  height: 25px;
  width: 317px;
  color: #222222;
  font-family: Mulish;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 25px;
`;
const StyledSubTitle = styled.div`
  height: 21px;
  width: 433px;
  color: #979797;
  font-family: Mulish;
  font-size: 1rem;
  letter-spacing: 0;
  line-height: 21px;
`;
