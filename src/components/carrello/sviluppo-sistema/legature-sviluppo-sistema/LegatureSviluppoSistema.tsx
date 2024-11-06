import React, { useContext } from "react";
import styled from "styled-components/macro";
import { parseAsMoney } from "src/helpers/format-data";
import { SviluppoSistemaType, CartErrorsType } from "src/types/carrello.types";
import { Puntata } from "src/components/carrello/puntata/Puntata";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";

export const LegatureSviluppoSistema = ({
  legatura,
  legature,
  indexToShow,
  focusOnKeyboard,
  setFocusOnKeyboard,
  hasErrors,
  indexLegaturaOnFocus,
  updateBetLegatura,
  updateErrorsLegatura,
  changeLegaturaOnFocus,
  visibleParam,
  ordinale,
  totalBetSviluppo,
}: {
  legatura: SviluppoSistemaType;
  totalBetSviluppo?: number;
  focusOnKeyboard?: boolean;
  setFocusOnKeyboard?: (e: boolean) => void;
  legature: SviluppoSistemaType[];
  indexToShow: number;
  hasErrors(legatura: SviluppoSistemaType): boolean;
  indexLegaturaOnFocus: number;
  updateBetLegatura: (bet: number, legaturaId: number | undefined) => void;
  updateErrorsLegatura: (errors: CartErrorsType, legaturaId: number | undefined) => void;
  changeLegaturaOnFocus: React.Dispatch<{
    direction?: 1 | -1 | undefined;
    set?: number | undefined;
  }>;
  visibleParam: boolean;
  ordinale?: number;
}) => {
  const { systemBetConfig } = useContext(GlobalStateContext);
  return (
    <StyledSviluppoSistemaBodyRow
      className={`${hasErrors(legatura) && visibleParam ? "errorBorder" : ""} sviluppo-body`}
      key={indexToShow}
    >
      <StyledSviluppoColumn>
        <span className="bolder">{legature[indexToShow].indice}</span> su {legature?.length}
      </StyledSviluppoColumn>
      <StyledSviluppoColumn>
        <span className="combinations" data-qa={`carrello-combinazioni-${legature[indexToShow].indice}`}>
          <StyledDettaglioCombinazioni>x{legatura.combinazioni}</StyledDettaglioCombinazioni>
        </span>
      </StyledSviluppoColumn>
      <StyledSviluppoColumn>
        <span className="minWin" data-qa={`carrello-vincita-minima-${legature[indexToShow].indice}`}>
          {visibleParam ? parseAsMoney(legatura.winAmounts.min) : "€ 0,00"}
        </span>
        <span>-</span>
        <span className="maxWin" data-qa={`carrello-vincita-massima-${legature[indexToShow].indice}`}>
          {visibleParam ? parseAsMoney(legatura.winAmounts.max) : "€ 0,00"}
        </span>
      </StyledSviluppoColumn>
      <StyledSviluppoColumn>
        <span className="bolder" data-qa={`carrello-costotot-combinazione-${legature[indexToShow].indice}`}>
          {visibleParam ? parseAsMoney(legature[indexToShow].bet * legatura.combinazioni) : "€ 0,00"}
        </span>
      </StyledSviluppoColumn>
      <StyledSviluppoColumn>
        <Puntata
          classeLegature={legature[indexToShow].indice}
          ordinale={ordinale}
          maxWin={legatura.winAmounts.max}
          bet={visibleParam ? legature[indexToShow].bet : 0.0}
          isOnFocus={indexLegaturaOnFocus === ordinale}
          focusOnKeyboard={focusOnKeyboard}
          onSetFocusOnKeyboard={setFocusOnKeyboard}
          indexLegaturaOnFocus={indexLegaturaOnFocus}
          updateBetLegatura={updateBetLegatura}
          hasErrors={hasErrors(legatura)}
          updateErrors={updateErrorsLegatura}
          changeLegaturaOnFocus={changeLegaturaOnFocus}
          indexLegatura={indexToShow}
          step={systemBetConfig?.importoBase || 0.05}
          maxBet={20}
          minBet={0.05}
          visibleParam={visibleParam}
          isMultiplaActive={false}
          totalBetSviluppo={totalBetSviluppo}
        />
      </StyledSviluppoColumn>
    </StyledSviluppoSistemaBodyRow>
  );
};

const StyledSviluppoSistemaBodyRow = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 5px;
  margin-top: 5px;
  border-bottom: 2px solid #f4f4f4;
  padding: 10px;
  box-sizing: border-box;
  &.sviluppo-body > div {
    display: flex;
    align-items: center;
  }
  &.errorBorder:before {
    position: absolute;
    content: "";
    width: 8px;
    height: 62px;
    border-radius: 45px;
    border-style: solid;
    background: red;
    border-color: red;
    left: -28px;
    z-index: 1;
    top: -5px;
  }
`;

const StyledDettaglioCombinazioni = styled.div`
  padding-top: 4px;
`;

const StyledSviluppoColumn = styled.div`
  font-size: 20px;
  font-weight: 400;
  box-sizing: border-box;

  &.error {
    border-color: red;
    border-width: 44px;
    background-color: red;
  }

  .bolder {
    justify-content: flex-end;
    font-weight: 700;
    margin-right: 5px;
  }
  .combinations {
    display: inline-block;
    font-size: 18px;
    font-weight: 400;
    background-color: #f4f4f4;
    border-radius: 25px;
    min-width: 72px;
    height: 30px;
    text-align: center;
  }
  .minWin {
    min-width: fit-content;
    margin-right: 10px;
  }
  .maxWin {
    min-width: fit-content;
    margin-left: 10px;
  }
  &:nth-child(1) {
    flex: 0 0 130px;
    padding: 0 20px;
  }
  &:nth-child(2) {
    flex: 0 0 calc(100% - 868px);
  }
  &:nth-child(3) {
    flex: 0 0 346px;
    padding-right: 29px;
    justify-content: flex-end;
    text-align: right;
  }
  &:nth-child(4) {
    flex: 0 0 173px;
    padding-right: 35px;
    justify-content: flex-end;
    text-align: right;
  }
  &:nth-child(5) {
    flex: 0 0 260px;
  }
  p {
    &.title {
      font-family: Roboto, sans-serif;
      font-size: 18px;
      font-weight: 700;
      margin: 0;
    }
    &.subtitle {
      font-family: Roboto, sans-serif;
      font-size: 15px;
      font-weight: 400;
      margin: 0;
    }
  }
`;
