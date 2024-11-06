import React from "react";
import styled from "styled-components/macro";

export function NessunRisultato() {
  return (
    <StyledNessunRisultatoContainer>
      <StyledNessunRisultatoTitle>Nessun risultato trovato</StyledNessunRisultatoTitle>
      <StyledNessunRisultatoDescription>
        Verifica di aver inserito correttamente il codice o il nome di tuo interesse e ripeti la ricerca.
      </StyledNessunRisultatoDescription>
    </StyledNessunRisultatoContainer>
  );
}

const StyledNessunRisultatoContainer = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-family: Roboto;
`;

const StyledNessunRisultatoTitle = styled.div`
  font-size: 1.813rem;
  font-weight: 600;
  opacity: 0.6;
  letter-spacing: 0;
  line-height: 34px;
`;

const StyledNessunRisultatoDescription = styled.div`
  font-size: 1.125rem;
  opacity: 0.76;
  letter-spacing: 0;
  line-height: 21px;
`;
