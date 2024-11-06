import React from "react";
import styled, { css } from "styled-components/macro";
import icoArrowDownGreen from "src/assets/images/icon-arrow-down-green.svg";
import icoArrowUpGreen from "src/assets/images/icon-arrow-up-green.svg";
import { useForeignClickOpen } from "src/components/prematch/templates/utils";
import { FormattedMessage } from "react-intl";
import { StyledOption } from "src/components/common/disanonima-dialog/SelectGender";

type SelectNationalityTheme = {
  keybackgroundColor: string;
  keycolor: string;
  keybordercolor: string;
  iconUp: string;
  iconDown: string;
};
const defaultTheme: SelectNationalityTheme = {
  keybackgroundColor: "#FFFFFF",
  keycolor: "#444444",
  keybordercolor: "#979797",
  iconUp: icoArrowUpGreen,
  iconDown: icoArrowDownGreen,
};

type SelectNationalityProps = {
  value: SelectNationality;
  theme?: SelectNationalityTheme;
  onChange(nationality: SelectNationality): void;
};
function SelectNationality({ value, onChange, theme = defaultTheme }: SelectNationalityProps) {
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
        css={css`
          box-sizing: border-box;
          height: 60px;
          min-width: 597px;
          outline: none;
          border: 2px solid ${theme.keybordercolor};
          border-radius: ${isOpen ? "8px 8px 0 0" : "8px"};
          background-color: ${theme.keybackgroundColor};
          box-shadow: ${isOpen ? " 1px 2px 4px 0 rgba(0, 0, 0, 0.5)" : ""};
          color: ${theme.keycolor};
          font-family: Roboto;
          font-size: 1rem;
          letter-spacing: 0;
          font-weight: 700;
          line-height: 20px;
          text-align: left;
          padding-left: 30px;
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
                return "Italiana";
              case 1:
                return "Straniera";
            }
          })()}
        </span>
        <span
          css={css`
            width: 45px;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <img
            css={css`
              width: 15px;
              height: 15px;
            `}
            onClick={() => setIsOpen(!isOpen)}
            src={isOpen ? theme.iconUp : theme.iconDown}
            alt={""}
          />
        </span>
      </button>
      {isOpen && (
        <div
          css={css`
            position: absolute;
            background-color: #ffffff;
            min-width: 597px;
            z-index: 1;
            box-sizing: border-box;
            border: 2px solid #979797;
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.5);
          `}
        >
          <StyledOption
            isActiveFilter={value === 0}
            onClick={() => {
              onChange(0);
              setIsOpen(false);
            }}
          >
            <FormattedMessage description="first option of nationality select" defaultMessage="Italiana" />
          </StyledOption>
          <StyledOption
            isActiveFilter={value === 1}
            onClick={() => {
              onChange(1);
              setIsOpen(false);
            }}
          >
            <FormattedMessage description="second option of nationality select" defaultMessage="Straniera" />
          </StyledOption>
        </div>
      )}
    </div>
  );
}

export const SelectNationalityMemo = React.memo(SelectNationality);

export type SelectNationality = 0 | 1;
