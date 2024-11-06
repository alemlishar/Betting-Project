import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components/macro";
import { ReactComponent as IcoCheck } from "../../../../assets/images/ico_check_on.svg";

export const ImpostazioniPredefinite = ({
  expanded,
  isChange,
  setValuePredefinita,
}: {
  expanded: boolean;
  isChange: boolean;
  setValuePredefinita: (e: boolean) => void;
}) => {
  const [checkBoxImpPredefinite, setCheckboxImpPredefinite] = useState(false);
  useEffect(() => {
    setValuePredefinita(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const changeImpostazioniPredefinite = () => {
    setValuePredefinita(!checkBoxImpPredefinite);
    return setCheckboxImpPredefinite(!checkBoxImpPredefinite);
  };

  return (
    <>
      {!expanded && (
        <StyledContainerImpPredefinite className={isChange ? "active" : ""}>
          <StyledBoxCheckPredefinite>
            <StyledCheckInput
              disabled={!isChange}
              type="checkbox"
              id="impPredef"
              name="impPredef"
              value="impPredef"
              onClick={() => changeImpostazioniPredefinite()} //TODO modificare per tener memorizzata scelta
            />
            {checkBoxImpPredefinite && <IcoCheck />}
            <StyledCheckLabel>
              <FormattedMessage
                defaultMessage="Salva questa scelta come la tua impostazione di scommessa predefinita"
                description="Save checkbox label"
              />
            </StyledCheckLabel>
          </StyledBoxCheckPredefinite>
        </StyledContainerImpPredefinite>
      )}
    </>
  );
};

const StyledContainerImpPredefinite = styled.div`
  font-family: Mulish;
  height: 75px;
  border-radius: 8px;
  background-color: #f4f4f4;
  display: flex;
  align-content: center;
  font-size: 18px;
  font-weight: 800;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: auto;
  opacity: 0.32;
  &.active {
    opacity: 1;
  }
`;
const StyledBoxCheckPredefinite = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  svg {
    position: absolute;
    height: auto;
    width: 30px;
    margin: 7px;
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
    z-index: 1;
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
