import React, { useContext, useEffect, useRef } from "react";
import styled, { css } from "styled-components/macro";
import { HeaderDialogSaldoCassa } from "./HeaderDialogSaldoCassa";
import { BodyDialogSaldoCassa } from "./BodyDialogSaldoCassa";
import { useErrorContext, useUpdateErrorContext } from "./errorContext";
import AlertWhite from "../../../assets/images/alert_white.png";
import { ReactComponent as SuccessWhite } from "../../../assets/images/ico_check_on_white.svg";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
export const SaldoCassaDialog = (props: {
  isOpen: boolean;
  closeDialog: Function;
  pushToast(content: React.ReactNode, duration: number): void;
}) => {
  const { isOpen } = props;
  const error = useErrorContext();
  const updateError = useUpdateErrorContext();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (wrapperRef.current != null) {
      if (wrapperRef && !wrapperRef.current.contains(event.target)) {
        props.closeDialog();
        updateError.setError({ active: false, prelevare: false, type: null, message: null });
      }
    }
  };

  // DEBT
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (event.key === "Escape" && isOpen) {
        props.closeDialog();
        updateError.setError({ active: false, prelevare: false, type: null, message: null });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  return (
    <>
      {" "}
      {isOpen && (
        <StyledDialogSaldoCassa>
          {error.active && (
            <AlertSaldoCassa className={error.type === "error" ? "error" : "success"}>
              {error.type === "error" ? (
                <img
                  alt="danger"
                  src={AlertWhite}
                  css={css`
                    margin-right: 15px;
                  `}
                />
              ) : (
                <SuccessWhite></SuccessWhite>
              )}
              {error.message}
            </AlertSaldoCassa>
          )}
          <StyledSaldoCassaBox ref={wrapperRef}>
            <HeaderDialogSaldoCassa />
            <Break />

            <BodyDialogSaldoCassa closeDialog={props.closeDialog} pushToast={props.pushToast} />
          </StyledSaldoCassaBox>
        </StyledDialogSaldoCassa>
      )}
    </>
  );
};
const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`;
const AlertSaldoCassa = styled.div`
  display: flex;
  color: white;
  align-items: center;
  justify-items: center;
  padding: 20px;
  font-family: Mulish;
  font-size: 20px;
  border-radius: 12px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  min-width: 530px;
  position: relative;
  &.error {
    background-color: #ea2128;
  }
  &.success {
    background-color: #248c66;
  }
`;
const StyledSaldoCassaBox = styled.div`
  display: flex;
  border-radius: 12px;
  flex-wrap: wrap;
  width: 570px;

  position: relative;
  background-color: #ffffff;
`;
const StyledDialogSaldoCassa = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.77);
`;

export default SaldoCassaDialog;
