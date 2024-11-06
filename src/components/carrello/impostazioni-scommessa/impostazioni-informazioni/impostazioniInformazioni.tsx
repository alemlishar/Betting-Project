import React from "react";
import { ReactComponent as IcoArrow } from "../../../../assets/images/icon-triangle.svg";
import styled from "styled-components/macro";

export const ImpostazioniInformazioni = ({ expanded }: { expanded: boolean }) => {
  type TypeParagraph = {
    title?: string;
    content: string;
  };
  const paragraphs: TypeParagraph[] = [
    {
      title: "Variazioni quote",
      content:
        "Queste funzionalità ti permettono di concludere la scommessa live in modo veloce nonostante l'alta frequenza di aggiornamento delle quote.",
    },
    {
      title: "Accetto variazione delle quote",
      content:
        "Seleziona questa voce per convalidare in automatico la giocata anche se le quote sono cambiate in modo non rilevante mentre stavi concludendo la scommessa. La giocata verrà convalidata con il nuovo valore delle quote.",
    },
    {
      title: "Accetto solo variazione in crescita delle quote ",
      content:
        "Seleziona questa voce per convalidare in automatico la giocata anche se le quote sono aumentate in modo non rilevante mentre stavi concludendo la scommessa. La giocata verrà convalidata con il nuovo valore delle quote. In caso di diminuzione delle quote potrai convalidare il biglietto solo manualmente.",
    },
    {
      title: "Variazioni puntata",
      content: "La tua scommessa potrebbe essere vagliata dai nostri quotisti prima dell'eventuale convalida.",
    },
    {
      content:
        "Scegliendo l 'opzione di Accettazione variazioni puntata accetti che il biglietto possa venire giocato con un importo di puntata inferiore rispetto a quello da te scelto.",
    },
  ];

  return (
    <>
      <StledHeaderInformazioni className="header-info">
        <StyledTitleText>Informazioni</StyledTitleText>
        <StyledIcoButton>
          <IcoArrow className={expanded ? "arrowUp" : "arrowDown"} />
        </StyledIcoButton>
      </StledHeaderInformazioni>
      <StyledInfoContent className={expanded ? "visible" : "invisible"}>
        {paragraphs.map((paragraph, i) => {
          return (
            <React.Fragment key={i}>
              <div className="title">{paragraph.title}</div>
              <div className="content">{paragraph.content}</div>
            </React.Fragment>
          );
        })}
      </StyledInfoContent>
    </>
  );
};

const StledHeaderInformazioni = styled.div`
  height: 59px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledTitleText = styled.div`
  margin-left: 20px;
  font-family: Mulish;
  font-size: 16px;
  font-weight: 800; //TODO il weight è sbagliato, da correggere
`;
const StyledIcoButton = styled.div`
  svg {
    fill: #333333;
    height: 12px;
    width: auto;
    margin-right: 20px;
    &.arrowUp {
      transform: rotate(-90deg);
    }
    &.arrowDown {
      transform: rotate(90deg);
    }
  }
`;
const StyledInfoContent = styled.div`
  &.visible {
    letter-spacing: 0;
    font-size: 16px;
    padding-left: 20px;
    padding-right: 20px;
    .title {
      font-weight: 800;
      font-family: Mulish;
      font-size: 16px;
    }
    .content {
      font-family: Mulish;
      font-weight: 400;
      margin-bottom: 15px;
      font-size: 16px;
    }
  }
  &.invisible {
    display: none;
  }
`;
