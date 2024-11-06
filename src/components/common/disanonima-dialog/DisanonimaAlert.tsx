import React from "react";
import { ReactComponent as IconDangerBlack } from "src/assets/images/icon-danger.svg";
import { ReactComponent as IconDangerWhite } from "src/assets/images/icon-danger-white.svg";
import styled, { css } from "styled-components/macro";

type DisanonimaProps = {
  type: string;
  title: React.ReactNode;
  message: React.ReactNode;
};

export function DisanonimaAlert({ type, title, message }: DisanonimaProps) {
  return (
    <StyledAlertBox type={type}>
      {type === "warning" && (
        <IconDangerBlack
          style={{ gridColumn: `icon`, height: `28px`, width: `28px`, alignSelf: "center", paddingLeft: "21px" }}
        />
      )}
      {type === "danger" && (
        <IconDangerWhite
          style={{ gridColumn: `icon`, height: `28px`, width: `28px`, alignSelf: "center", paddingLeft: "21px" }}
        />
      )}
      <div
        css={css`
          grid-column: info;
          grid-template-rows: [title] auto [message] auto;
          display: grid;
          row-gap: 3px;
          font-family: Roboto;
          color: ${type === "danger" ? "#ffff" : "#333333"};
          padding: 14px 0 10px;
        `}
      >
        <div
          css={css`
            grid-row: title;
            font-size: 1.25rem;
            line-height: 24px;
            font-weight: 900;
          `}
        >
          {title}
        </div>
        <div
          css={css`
            grid-row: message;
            font-size: 1rem;
            font-weight: 400;
            line-height: 19px;
          `}
        >
          {message}
        </div>
      </div>
    </StyledAlertBox>
  );
}

const StyledAlertBox = styled.div<{ type: string }>`
  height: 76px;
  width: 1125px;
  border-radius: 8px;
  background-color: ${(prop) => (prop.type === "danger" ? "#e72530" : "#FFB800")};
  font-size: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: [icon] 50px [info] auto;
  column-gap: 21px;
  line-height: 24px;
`;
