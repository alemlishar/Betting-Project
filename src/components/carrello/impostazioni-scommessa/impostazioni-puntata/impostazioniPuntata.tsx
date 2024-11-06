import React from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IcoCheck } from "src/assets/images/ico_check_on.svg";
import styled from "styled-components/macro";

export const ImpostazioniPuntata = ({
  expanded,
  setIsChange,
  impostazioniDiPuntata,
  setImpostazioniDiPuntata,
}: {
  expanded: boolean;
  setIsChange: (e: boolean) => void;
  impostazioniDiPuntata: any;
  setImpostazioniDiPuntata: (e: any) => void;
}) => {
  return (
    <>
      {!expanded && (
        <StyledContainerPuntata>
          <FormattedMessage
            defaultMessage="IMPOSTAZIONI DI PUNTATA"
            description="label impostazioni di puntata carrello"
          />
          <StyledBoxCheckPuntata>
            <StyledCheckInput
              type="checkbox"
              id="puntata"
              defaultChecked={impostazioniDiPuntata ? true : false}
              name="puntata"
              value="puntata"
              onClick={() => setImpostazioniDiPuntata(!impostazioniDiPuntata)}
              onChange={() => setIsChange(true)}
            />
            {impostazioniDiPuntata && <IcoCheck />}
            <StyledCheckLabel>
              <FormattedMessage
                defaultMessage="Accetto che la giocata venga convalidata con un importo di puntata più basso"
                description="Accetto checkbox label"
              />
            </StyledCheckLabel>
          </StyledBoxCheckPuntata>
        </StyledContainerPuntata>
      )}
    </>
  );
};

const StyledContainerPuntata = styled.div`
  font-family: Mulish;
  font-size: 18px;
  font-weight: 800;
  padding: 0 20px;
  margin-top: 25px;
`;
const StyledBoxCheckPuntata = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
  svg {
    position: absolute;
    height: auto;
    width: 30px;
    margin: 7px;
    z-index: -1;
  }
`;
const StyledCheckInput = styled.input`
  &[type="checkbox"] {
    appearance: none;
    box-sizing: border-box;
    height: 35px;
    width: 35px;
    border: 2px solid #222222;
    position: absolute;
    border-radius: 9px;
    &:focus {
      outline: none;
    }
  }
`;

const StyledCheckLabel = styled.div`
  font-family: Mulish;
  font-size: 18px;
  font-weight: bold;
  margin-left: 65px;
`;
