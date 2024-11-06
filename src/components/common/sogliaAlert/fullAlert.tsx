import React, { useContext, useEffect } from "react";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import styled from "styled-components/macro";
import { AlertBox } from "../alert-box/AlertBox";

export const FullAlert = ({
  errorDesc,
  errorText,
  closeDialog,
  alertType,
  alertText,
  isActionRequired,
  onDismiss,
  onContinue,
}: {
  errorDesc?: string;
  errorText: string;
  closeDialog: () => void;
  alertType: "success" | "warning" | "error" | "systemWarnings";
  alertText: string;
  isActionRequired?: boolean;
  onDismiss?: () => void;
  onContinue?: () => void;
}) => {
  // DEBT
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  useEffect(() => {
    //TODO verificare se con vendita funzionante escono bug
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (event.key === "Escape") {
        closeDialog();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeDialog, keyboardNavigationContext]);

  return (
    <StyledAlertDialog onClick={closeDialog}>
      <div className={"alert"}>
        <AlertBox
          isFullScreenAlert
          message={{
            text: alertText,
          }}
          alertType={alertType}
        />
        <MsgBox className={errorDesc !== undefined ? "actionBox" : ""}>
          {errorDesc && <MsgTitle>{errorDesc}</MsgTitle>}
          {errorText && <MsgText className={errorDesc !== undefined ? "actionBox" : ""}>{errorText}</MsgText>}
          {isActionRequired && (
            <Actions>
              <button className={"transparent"} onClick={onDismiss}>
                Annulla
              </button>
              <button className={"full"} onClick={onContinue}>
                Disanonima
              </button>
            </Actions>
          )}
        </MsgBox>
      </div>
    </StyledAlertDialog>
  );
};

const StyledAlertDialog = styled.dialog`
  width: 100%;
  height: 140%;
  min-height: 130%;
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 500;
  border-radius: 8px;
  border: 0;
  position: fixed;
  top: -350px;
  //left: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 23px 30px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  .alert {
    width: 566px;
    position: relative;
    margin: 0 auto;
    margin-top: 355px;
  }
`;
const MsgBox = styled.div`
  margin-top: -5px;
  width: 100%;
  background: white;
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 500;
  border-radius: 8px;
  border: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 23px 30px;
  &.actionBox {
    padding: 60px 50px 0px 59px;
  }
  box-sizing: border-box;
`;
const MsgTitle = styled.div`
  width: 100%;
  background: white;
  font-family: Mulish, sans-serif;
  font-size: 30px;
  font-weight: 900;
  border-radius: 8px;
  border: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;
const MsgText = styled.div`
  width: 100%;
  background: white;
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 500;
  &.actionBox {
    font-weight: 400;
  }
  border-radius: 8px;
  border: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;
const Actions = styled.div`
  width: 100%;
  margin-top: 100px;
  margin-bottom: 60px;
  padding-left: 60px;
  padding-right: 59px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  button {
    width: 218px;
    height: 60px;
    box-shadow: none;
    font-family: Robot, sans-serif;
    font-size: 22px;
    font-weight: 900;
    letter-spacing: 0;
    border-width: 2px;
    border-style: solid;
    border-radius: 8px;

    &.transparent {
      color: #005936;
      border-color: #005936;
      background-color: transparent;
    }

    &.full {
      color: #ffffff;
      background-color: #005936;
      border-color: #005936;
    }
  }
`;
