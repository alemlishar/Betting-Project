import React from "react";
import styled from "styled-components/macro";
import { parseAsMoney } from "src/helpers/format-data";

export const PuntataInputDisabled = ({
  bet,
  isPuntataSistema,
  maxWin,
}: {
  bet: number;
  isPuntataSistema?: boolean;
  maxWin?: number;
}) => {
  return (
    <>
      <StyledInputContainer>
        <StyledSpanEuro>
          €
          <RealInputLayer type="text" value={parseAsMoney(bet)} />
        </StyledSpanEuro>
      </StyledInputContainer>
    </>
  );
};

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledSpanEuro = styled.span`
  padding-bottom: 8px;
  margin-top: 7px;
  margin-left: 19px;
  font-family: Mulish, sans-serif;
  font-size: 22px;
  font-weight: 800;
`;

const RealInputLayer = styled.input`
  border: 2px solid #cbcbcb;
  border-radius: 8px;
  box-shadow: none;
  :: placeholder {
    color: #000000;
  }
  &:focus,
  &.focus {
    border-color: #aac21f;
    border-width: 4px;
    outline: 0;
  }

  &.error {
    border-color: red;
  }
`;
