import React, { useCallback } from "react";
import styled from "styled-components/macro";

export const SwitchVirtual = ({
  isDisabled: disable,
  onChange,
  isActive,
}: {
  isDisabled: boolean;
  onChange: (isActive: boolean) => void;
  isActive: boolean;
}) => {
  const onHandleClick = useCallback(() => {
    if (!disable) {
      onChange(!isActive);
    }
  }, [disable, isActive, onChange]);

  return (
    <>
      <ContentStyle>
        <StyledWrapper onClick={onHandleClick} isActive={isActive} disabled={disable}>
          <StyledCheckBox isActive={isActive}></StyledCheckBox>
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
`;
const StyledWrapper = styled.div<{ isActive: boolean; disabled: boolean }>`
  display: flex;
  justify-content: space-between;
  border-style: solid;
  cursor: pointer;
  width: 43px;
  background-color: ${(props) => (props.isActive ? "#95ab0c" : "#979797")};
  height: 21px;
  top: 3px;
  align-items: center;
  border-color: ${(props) => (props.isActive ? "#aac21f" : "#cbcbcb")};
  border-width: 2px;
  border-radius: 10px;
  position: relative;
  transition: background-color 0.2s;
  box-sizing: border-box;
  cursor: ${(props) => (props.disabled ? "default" : "point")};
  opacity: ${(props) => (props.disabled && props.isActive ? "45%" : "100%")};
`;
const StyledCheckBox = styled.div<{ isActive: boolean }>`
  background-color: ${(props) => (props.isActive ? "#aac21f" : "#fff")};
  position: absolute;
  left: ${(props) => (props.isActive ? "21px" : "-1px")};
  width: 20px;
  max-height: 20px;
  box-sizing: border-box;
  height: 20px;
  border-radius: 10px;
  transition: 0.2s;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  border-color: ${(props) => (props.isActive ? "#aac21f" : "#cbcbcb")};
  display: flex;
  transform: rotate(270deg);
  font-size: 10px;
  align-items: center;
  justify-content: center;
`;
