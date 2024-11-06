import React from "react";
import styled, { css } from "styled-components/macro";
import { FiltroGiornaliero } from "src/components/prematch/prematch-api";
import icoArrowDownGrey from "src/assets/images/icon-arrow-down-grey-big.svg";
import icoArrowUpWhite from "src/assets/images/icon-arrow-up-white-big.svg";
import { useForeignClickOpen } from "src/components/prematch/templates/utils";

type SelectFiltroGiornalieroTheme = {
  keybackgroundColor: string;
  keycolor: string;
  keybordercolor: string;
  iconUp: string;
  iconDown: string;
};
const defaultTheme: SelectFiltroGiornalieroTheme = {
  keybackgroundColor: "#FFFFFF",
  keycolor: "#333333",
  keybordercolor: "#cbcbcb",
  iconUp: icoArrowUpWhite,
  iconDown: icoArrowDownGrey,
};

type SelectFiltroGiornalieroProps = {
  value: FiltroGiornaliero;
  theme?: SelectFiltroGiornalieroTheme;
  onChange(filtro: FiltroGiornaliero): void;
};
function SelectFiltroGiornaliero({ value, onChange, theme = defaultTheme }: SelectFiltroGiornalieroProps) {
  const { isOpen, setIsOpen, selectRef } = useForeignClickOpen<HTMLButtonElement>();
  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <button
        ref={selectRef}
        onClick={() => setIsOpen(!isOpen)}
        data-qa={"filtro_giornaliero_dropDownList"}
        css={css`
          box-sizing: border-box;
          height: 45px;
          min-width: 163px;
          outline: none;
          border: 2px solid ${theme.keybordercolor};
          border-radius: ${isOpen ? "8px 8px 0 0" : "8px"};
          background-color: ${isOpen ? "#cbcbcb" : theme.keybackgroundColor};
          color: ${isOpen ? "#ffffff" : theme.keycolor};
          font-family: Roboto;
          font-size: 1rem;
          letter-spacing: 0;
          line-height: 19px;
          text-align: center;
          display: flex;
          align-items: center;
          &:hover {
            cursor: pointer;
          }
        `}
      >
        <span
          css={css`
            width: calc(100% - 45px);
            justify-content: center;
          `}
        >
          {(() => {
            switch (value) {
              case 0:
                return "Tutti i giorni";
              case 1:
                return "Oggi";
              case 2:
                return "2 Giorni";
            }
          })()}
        </span>
        <span
          css={css`
            width: 45px;
            display: flex;
            justify-content: center;
            align-items: center;
            /* justify-self: center; */
          `}
        >
          <img onClick={() => setIsOpen(!isOpen)} src={isOpen ? theme.iconUp : theme.iconDown} alt={""} />
        </span>
      </button>
      {isOpen && (
        <div
          css={css`
            position: absolute;
            background-color: #ffffff;
            min-width: 163px;
            box-sizing: border-box;
            height: 145px;
            border: 2px solid #cbcbcb;
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.5);
            padding: 5px 20.5px;
          `}
        >
          <StyledOption
            isActiveFilter={value === 0}
            data-qa={"filtro_giornaliero_TUTTI"}
            onClick={() => {
              onChange(0);
              setIsOpen(false);
            }}
          >
            Tutti i giorni
          </StyledOption>
          <StyledOption
            isActiveFilter={value === 1}
            data-qa={"filtro_giornaliero_OGGI"}
            onClick={() => {
              onChange(1);
              setIsOpen(false);
            }}
          >
            Oggi
          </StyledOption>
          <StyledOption
            isActiveFilter={value === 2}
            data-qa={"filtro_giornaliero_2_GIORNI"}
            onClick={() => {
              onChange(2);
              setIsOpen(false);
            }}
          >
            2 Giorni
          </StyledOption>
        </div>
      )}
    </div>
  );
}
export const SelectFiltroGiornalieroMemo = React.memo(SelectFiltroGiornaliero);
const StyledOption = styled.div<{ isActiveFilter: boolean }>`
  background-color: #ffffff;
  height: 45px;
  letter-spacing: 0;
  line-height: 45px;
  color: ${(props) => (props.isActiveFilter ? "#aac21f" : "#333333")};
  font-weight: ${(props) => (props.isActiveFilter ? "700" : "400")};
  user-select: none;
  &:hover {
    color: #aac21f;
    font-weight: 700;
    cursor: pointer;
  }
`;
