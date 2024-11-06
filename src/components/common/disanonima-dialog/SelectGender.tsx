import React from "react";
import styled, { css } from "styled-components/macro";
import icoArrowDownGreen from "src/assets/images/icon-arrow-down-green.svg";
import icoArrowUpGreen from "src/assets/images/icon-arrow-up-green.svg";
import { useForeignClickOpen } from "src/components/prematch/templates/utils";
import { FormattedMessage } from "react-intl";
import configuration from "src/helpers/configuration";

type SelectGenderTheme = {
  keybackgroundColor: string;
  keycolor: string;
  keybordercolor: string;
  iconUp: string;
  iconDown: string;
};
type SelectDocumentTypeProps = {
  value: SelectGenderOption;
  theme?: SelectGenderTheme;

  onChange(GenderOption: SelectGenderOption): void;
};

const defaultTheme: SelectGenderTheme = {
  keybackgroundColor: "#FFFFFF",
  keycolor: "#444444",
  keybordercolor: "#979797",
  iconUp: icoArrowUpGreen,
  iconDown: icoArrowDownGreen,
};

export function SelectGender({ value, onChange, theme = defaultTheme }: SelectDocumentTypeProps) {
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
          width: 100%;
          outline: none;
          border: 2px solid ${theme.keybordercolor};
          border-radius: ${isOpen ? "8px 8px 0 0" : "8px"};
          background-color: ${theme.keybackgroundColor};
          box-shadow: ${isOpen ? " 1px 2px 4px 0 rgba(0, 0, 0, 0.5)" : ""};
          color: ${theme.keycolor};
          font-family: Roboto;
          font-size: 1.125rem;
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
          <FormattedMessage
            defaultMessage="{value}"
            description="gender selected in foreign personal data step"
            values={{ value: value }}
          />
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
            min-width: 100%;
            z-index: 1;
            box-sizing: border-box;
            border: 2px solid #979797;
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.5);
          `}
        >
          <StyledOption
            isActiveFilter={value === configuration.DISANONIMAGENDEROPTION.MASCHIO}
            onClick={() => {
              onChange(configuration.DISANONIMAGENDEROPTION.MASCHIO);
              setIsOpen(false);
            }}
          >
            <FormattedMessage
              description="first option of gender select"
              defaultMessage="{genderoption}"
              values={{ genderoption: configuration.DISANONIMAGENDEROPTION.MASCHIO }}
            />
          </StyledOption>
          <StyledOption
            isActiveFilter={value === configuration.DISANONIMAGENDEROPTION.FEMMINA}
            onClick={() => {
              onChange(configuration.DISANONIMAGENDEROPTION.FEMMINA);
              setIsOpen(false);
            }}
          >
            <FormattedMessage
              description="second option of  gender select"
              defaultMessage="{genderoption}"
              values={{ genderoption: configuration.DISANONIMAGENDEROPTION.FEMMINA }}
            />
          </StyledOption>
        </div>
      )}
    </div>
  );
}

export type SelectGenderOption = string;

export const StyledOption = styled.div<{ isActiveFilter: boolean }>`
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 1.125rem;
  padding: 0 30px;
  line-height: 45px;
  color: ${(props) => (props.isActiveFilter ? "#aac21f" : "#444444")};
  font-weight: ${(props) => (props.isActiveFilter ? "700" : "400")};
  user-select: none;
  &:hover {
    color: #fff;
    background-color: #aac21f;
    font-weight: 700;
    cursor: pointer;
    border: 0;
  }
`;
