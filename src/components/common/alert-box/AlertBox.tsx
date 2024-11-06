import React from "react";
import styled from "styled-components/macro";
import { ReactComponent as IcoDanger } from "../../../assets/images/icon-danger.svg";
import { ReactComponent as IcoTriangle } from "../../../assets/images/icon-triangle.svg";

export const AlertBox = ({
  alertType,
  message,
  action,
  isFullScreenAlert,
  customStyle,
  customTextColor,
  voucherLayout,
}: {
  alertType: "success" | "warning" | "error" | "systemWarnings";
  message: { text: React.ReactNode | JSX.Element; details?: string | JSX.Element };
  action?: { label: string; action: (args: any) => void };
  isFullScreenAlert?: boolean;
  customStyle?: React.CSSProperties;
  customTextColor?: string;
  voucherLayout?: boolean;
}) => {
  //DEBT- change formatted Message

  return (
    <StyledAlertDialog
      className={`${alertType} ${isFullScreenAlert ? "fullScreen" : ""}`}
      theme={customStyle}
      customTextColor={customTextColor}
      voucherLayout={voucherLayout}
    >
      <div>
        <IcoDanger />
        <MessageWrapper voucherLayout={voucherLayout}>
          {message.text}
          {message.details && (
            <StyledAlertMessageDetails voucherLayout={voucherLayout}>{message.details}</StyledAlertMessageDetails>
          )}
        </MessageWrapper>
      </div>
      {action !== undefined && (
        <AlertButton voucherLayout={voucherLayout} onClick={action.action}>
          {action.label}
          <IcoTriangle />
        </AlertButton>
      )}
    </StyledAlertDialog>
  );
};
const MessageWrapper = styled.div<{ voucherLayout: boolean | undefined }>`
  ${(props) =>
    props.voucherLayout
      ? ` 
    display:flex;
    flex-direction:column; 
    font-weight: 800;
    font-size:18px;
    `
      : ``};
`;
const StyledAlertDialog = styled.dialog<{
  customTextColor: string | undefined;
  voucherLayout: boolean | undefined;
}>`
  width: 100%;
  height: ${(props) => (props.voucherLayout === true || props.theme.height ? "70px" : "60px")};
  font-family: Roboto Medium, sans-serif;
  font-size: 18px;
  font-weight: 500;
  border-radius: 8px;
  border: 0;
  position: absolute;
  top: -90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 23px 30px;
  box-sizing: border-box;
  z-index: 10;

  ${(props) => props.theme} && {
    font-size: ${(props) => props.theme.fontSize};
  }
  color: ${(props) => (props.customTextColor !== undefined ? props.customTextColor : "#000000")};
  > div {
    display: flex;
    align-items: center;

    svg {
      position: relative;
      right: 16px;
      top: 0px;

      path {
        fill: #ffffff;
      }
      circle {
        stroke: #ffffff;
      }
    }
  }

  &.success {
    background-color: #3b914c;
  }
  &.warning {
    background-color: #ffb800;
    color: #333333;
    > div {
      path {
        fill: #333333;
      }
      circle {
        stroke: #333333;
      }
    }
    button {
      background-color: #333333;
      color: #ffffff;
    }
  }
  &.fullScreen {
    height: 70px;
  }
  &.systemWarnings {
    background-color: white;
    color: #333333;
    border: #ffb800;
    border-width: 2px;
    border-style: solid;
    > div {
      path {
        fill: #333333;
      }
      circle {
        stroke: #333333;
      }
    }
  }

  &.error {
    background-color: #e72530;
    color: #ffffff;
    ${(props) =>
      props.voucherLayout === true
        ? `
   
    button {
      background-color: #333333;
      color: #ffffff;
      outline: none;
    
      
    }`
        : ``}
  }
`;

const StyledAlertMessageDetails = styled.span<{ voucherLayout: boolean | undefined }>`
  font-family: Roboto Medium, sans-serif;
  font-size: 18px;
  font-weight: 400;
  ${(props) =>
    !props.voucherLayout
      ? `
    padding-left: 4px;
    font-style: italic;    
    `
      : ``}
`;

const AlertButton = styled.button<{
  voucherLayout: boolean | undefined;
}>`
  width: 166px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => (props.voucherLayout === true ? "17px" : "18px")};
  font-weight: ${(props) => (props.voucherLayout === true ? "800" : "")};

  font-family: Mulish, sans-serif;
  border-radius: 25px;
  border: 0;
  line-height: 30px;
  &:hover {
    cursor: pointer;
  }
  svg {
    height: auto;
    width: 11px;
    margin-left: 7px;
    margin-top: 3px;
    path {
      fill: #ffffff;
    }
  }
`;
