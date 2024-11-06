import React from "react";
import styled from "styled-components/macro";
import { CartErrorsType } from "../../../types/carrello.types";

export const Puntata = ({
  bet,
  updateBetLegatura,
  updateErrors,
  hasErrors,
  isOnFocus,
  changeLegaturaOnFocus,
  indexLegatura,
  indexLegaturaOnFocus,
  maxBet,
  minBet,
  step,
  setIsPuntataMultiplaHighlighted,
  maxWin,
  visibleParam,
  ordinale,
  isMultiplaActive,
  disabled,
}: {
  bet: number;
  hasErrors?: boolean;
  updateBetLegatura?: (bet: number, indexLegatura?: number) => void;
  updateErrors?: (errors: CartErrorsType, indexLegatura?: number) => void;
  isOnFocus?: boolean;
  changeLegaturaOnFocus?: (params: { direction?: 1 | -1; set?: number }) => void;
  indexLegatura?: number;
  maxBet?: number;
  minBet?: number;
  step?: number;
  setIsPuntataMultiplaHighlighted?: (p: boolean) => void;
  maxWin?: number;
  visibleParam?: boolean;
  ordinale?: number;
  indexLegaturaOnFocus?: number;
  isMultiplaActive?: boolean;
  disabled?: boolean;
}) => {
  return (
    <PuntataSistemaWrapper>
      <InputContainer></InputContainer>
    </PuntataSistemaWrapper>
  );
};

const PuntataSistemaWrapper = styled.div`
  width: 230px;
  display: flex;
`;

const InputContainer = styled.div`
  width: 140px;
  height: 40px;
  position: relative;
  background-color: #ffffff;
  font-size: 20px;
  .layer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
    background-color: transparent;
    color: #000000;
    font-family: Mulish, sans-serif;
    font-size: 20px;
    font-weight: 800;
    padding: 0 15px;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: right;
  }
`;
