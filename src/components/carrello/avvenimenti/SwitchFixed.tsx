import React, { useState, useEffect, useCallback, useContext } from "react";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import styled from "styled-components/macro";

export const SwitchFixed = ({
  updateIsFixed,
  id,
  isSelected,
  disable,
  isFixed,
  hasQuotaVariata,
  dataQa,
}: {
  updateIsFixed: (isFixed: boolean, id: string) => void;
  id: string;
  isSelected: boolean;
  disable?: boolean;
  isFixed?: boolean;
  hasQuotaVariata?: boolean;
  dataQa: string;
}) => {
  const [isActive, setIsActive] = useState(isFixed ? true : false);
  const onHandleClick = useCallback(() => {
    if (!disable) {
      setIsActive(!isActive);
    }
  }, [disable, isActive]);

  useEffect(() => {
    if (!disable) {
      updateIsFixed(isActive, id);
    }
  }, [disable, isActive]);

  // DEBT
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  useEffect(() => {
    if (isSelected) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (keyboardNavigationContext.current === "blocking-operation") {
          return;
        }
        if (event.key === " ") {
          onHandleClick();
        }
      };
      document.addEventListener("keypress", onKeyDown);
      return () => {
        document.removeEventListener("keypress", onKeyDown);
      };
    }
  }, [id, onHandleClick, isSelected, keyboardNavigationContext]);
  return (
    <>
      <ContentStyle>
        <StyledWrapper
          data-qa={dataQa}
          onClick={onHandleClick}
          className={`${isActive ? "active" : ""} ${disable ? "disabled" : ""} ${
            hasQuotaVariata ? "quota-variata" : ""
          }`}
        >
          <StyledCheckBox onClick={onHandleClick} className={`${isActive ? "active" : ""}`}>
            F
          </StyledCheckBox>
        </StyledWrapper>
      </ContentStyle>
    </>
  );
};

const ContentStyle = styled.div`
  margin-left: 2px;
  align-items: center;
  justify-content: space-between;
  position: relative;
  top: -14px;
`;
const StyledWrapper = styled.div`
  display: flex;
  transform: rotate(90deg);
  bottom: -30px;
  left: -8px;
  justify-content: space-between;
  border-style: solid;
  cursor: pointer;
  width: 40px;
  height: 20px;
  align-items: center;
  border-color: #cbcbcb;
  border-width: 2px;
  border-radius: 10px;
  position: relative;
  transition: background-color 0.2s;
  box-sizing: border-box;
  &.active {
    background: #95ab0c;
    border-color: #aac21f;
  }
  &.disabled {
    cursor: default;
    &.active {
      background: #95ab0c;
      opacity: 45%;
      &.quota-variata {
        opacity: 100%;
      }
    }
  }
`;
const StyledCheckBox = styled.div`
  position: absolute;
  left: 2px;
  width: 14px;
  box-sizing: border-box;
  height: 14px;
  border-radius: 45px;
  border-style: solid;
  transition: 0.2s;
  background: #cbcbcb;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
  border-color: #cbcbcb;
  display: flex;
  transform: rotate(270deg);
  font-size: 10px;
  align-items: center;
  justify-content: center;
  &.active {
    background: #aac21f;
    left: 21px;
    color: #ffffff;
    border-color: #aac21f;
  }
`;
