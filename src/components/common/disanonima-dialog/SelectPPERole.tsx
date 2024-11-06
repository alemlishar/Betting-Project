import { ConfigurationPEPItem } from "src/components/common/disanonima-dialog/disanonima-dto";
import icoArrowDownGreen from "src/assets/images/icon-arrow-down-green.svg";
import icoArrowUpGreen from "src/assets/images/icon-arrow-up-green.svg";
import styled, { css } from "styled-components/macro";
import { useForeignClickOpen } from "src/components/prematch/templates/utils";
import React from "react";
import { FormattedMessage } from "react-intl";
import { DisanonimaState } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { StyledOption } from "src/components/common/disanonima-dialog/SelectGender";

type SelectPPERoleTheme = {
  keybackgroundColor: string;
  keycolor: string;
  keybordercolor: string;
  iconUp: string;
  iconDown: string;
};

type SelectPPERoleTypeProps = {
  value: string;
  theme?: SelectPPERoleTheme;
  roleList: ConfigurationPEPItem[];
  onChange: React.Dispatch<React.SetStateAction<DisanonimaState>>;
};

const defaultTheme: SelectPPERoleTheme = {
  keybackgroundColor: "#FFFFFF",
  keycolor: "#444444",
  keybordercolor: "#979797",
  iconUp: icoArrowUpGreen,
  iconDown: icoArrowDownGreen,
};

export function SelectPPERole({ value, roleList, onChange, theme = defaultTheme }: SelectPPERoleTypeProps) {
  const { isOpen, setIsOpen, selectRef } = useForeignClickOpen<HTMLButtonElement>();
  const descriptionToView = roleList.find(({ id }) => id === value)?.description || "Seleziona...";
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
          {descriptionToView}
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
            max-height: 180px;
            overflow-y: scroll;
            &::-webkit-scrollbar-thumb {
              background: #d8d8d8;
              height: 30px;
              border-radius: 5px;
            }
            &::-webkit-scrollbar {
              width: 9px;
            }
            &::-webkit-scrollbar-track {
              margin-right: 12px;
            }
          `}
        >
          {roleList.map((roleItem) => {
            return (
              <StyledOption
                isActiveFilter={value === roleItem.id}
                onClick={() => {
                  onChange((prevState) => ({
                    ...prevState,
                    customerInfo: { ...prevState.customerInfo, listaPep: roleItem.id },
                  }));
                  setIsOpen(false);
                }}
              >
                {roleItem.description}
              </StyledOption>
            );
          })}
        </div>
      )}
    </div>
  );
}
