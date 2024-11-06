import React, { useContext, useEffect } from "react";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import styled from "styled-components/macro";
import { ReactComponent as IcoDanger } from "../../../assets/images/icon-danger.svg";

export const FullAlertVirtual = ({
  errorText,
  closeDialog,
  alertType,
  headerText,
  isActionRequired,
  onDismiss,
  onContinue,
}: {
  errorText: string;
  closeDialog: () => void;
  alertType: "success" | "warning" | "error" | "systemWarnings";
  headerText: string;
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
        <StyledHeader>
          <IcoDanger height="60" width="60" /> <StyledHeaderText>{headerText}</StyledHeaderText>
        </StyledHeader>
        <MsgBox className="actionBox">
          {errorText && <MsgText className="actionBox">{errorText}</MsgText>}
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
const StyledHeaderText = styled.div`
  margin-left: 20px;
`;
const StyledHeader = styled.div`
  width: 1100px;
  background-color: #ffb800;
  border-radius: 8px 8px 0px 0px;
  padding: 50px;
  font-family: Mulish, sans-serif;
  font-size: 35px;
  font-weight: 900;
  align-items: center;
  color: #333333;
  display: flex;
`;
const StyledAlertDialog = styled.dialog`
  width: 100%;
  height: 140%;
  min-height: 130%;
  font-family: Mulish, sans-serif;
  font-size: 18px;
  font-weight: 600;
  border-radius: 0px 0px 8px 8px;
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
    width: 1200px;
    position: relative;
    margin: 0 auto;
    margin-top: 355px;
  }
`;
const MsgBox = styled.div`
  margin-top: -5px;
  width: 100%;
  background: white;
  font-family: Mulish, sans-serif;
  font-size: 18px;
  font-weight: 600;
  border-radius: 0px 0px 8px 8px;
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

const MsgText = styled.div`
  width: 100%;
  background: white;

  font-family: Mulish, sans-serif;
  font-size: 20px;
  font-weight: 600;
  &.actionBox {
    font-weight: 600;
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
  margin-top: 40px;
  margin-bottom: 30px;
  padding-left: 60px;
  padding-right: 59px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

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
      margin-right: 15px;
      color: #333333;
      border-color: #333333;
      background-color: transparent;
    }

    &.full {
      color: #ffffff;
      background-color: #333333;
      border-color: #333333;
    }
  }
`;
