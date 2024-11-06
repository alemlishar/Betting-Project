import { useContext } from "react";
import { useVirtualUpdateClientsContext } from "src/components/common/context-clients/VirtualClientsContext";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import styled from "styled-components/macro";

export const PuntataVirtual = () => {
  const globalContext = useContext(GlobalStateContext);
  const virtualCartContext = useVirtualUpdateClientsContext();
  const minimumBet = globalContext.multipleVirtualBetConfig ? globalContext.multipleVirtualBetConfig.importoMinimo : 1;
  const maximumBet = globalContext.configVirtual ? globalContext.configVirtual.VIR.maxCostTicket : 100;
  const keyboardNavigation = useContext(KeyboardNavigationContext);
  return (
    <PuntataSistemaWrapper>
      <InputContainer>
        <StyledInputContainer>
          <StyledSpanEuro>
            €
            <RealInputLayer
              ref={(newRef) => (virtualCartContext.selectInput.current[virtualCartContext.activeClientIndex] = newRef)}
              value={virtualCartContext.inputValue[virtualCartContext.activeClientIndex]}
              className={"layer"}
              onChange={(event) => {
                virtualCartContext.onHandlePuntataChange(event);
              }}
              onFocus={() => {
                keyboardNavigation.current = "cart";
                virtualCartContext.setHiglightedPrediction(0);
                virtualCartContext.convertFormattedToString();
              }}
              onBlur={() => {
                keyboardNavigation.current = undefined;
                virtualCartContext.formatInputValue();
              }}
            />
          </StyledSpanEuro>
        </StyledInputContainer>
      </InputContainer>
      <ButtonsContainer>
        <StepInputButton
          {...virtualCartContext.longPressPropDecrease}
          isDisabled={
            Number(virtualCartContext.inputValue[virtualCartContext.activeClientIndex].replace(",", ".")) <= minimumBet
          }
        >
          -
        </StepInputButton>
        <StepInputButton
          {...virtualCartContext.longPressPropsIncrease}
          isDisabled={
            Number(virtualCartContext.inputValue[virtualCartContext.activeClientIndex].replace(",", ".")) >= maximumBet
          }
        >
          +
        </StepInputButton>
      </ButtonsContainer>
    </PuntataSistemaWrapper>
  );
};

const PuntataSistemaWrapper = styled.div`
  width: 230px;
  display: flex;
`;

const InputContainer = styled.div`
  width: 140px;
  height: 40px;
  position: relative;
  background-color: #ffffff;
  font-size: 20px;
  .layer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
    background-color: transparent;
    color: #000000;
    font-family: Mulish, sans-serif;
    font-size: 20px;
    font-weight: 800;
    padding: 0 15px;
    text-align: right;
    display: flex;
    align-items: center;
    justify-content: right;
  }
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledSpanEuro = styled.span`
  padding-bottom: 8px;
  margin-top: 7px;
  margin-left: 19px;
  font-family: Mulish, sans-serif;
  font-size: 22px;
  font-weight: 800;

  &.disabled {
    color: #999;
    pointer-events: none;
  }
`;

const RealInputLayer = styled.input`
  border: 2px solid #cbcbcb;
  border-radius: 8px;
  box-shadow: none;
  &::placeholder {
    color: #000000;
  }
  &:focus,
  &.focus {
    border-color: #aac21f;
    border-width: 4px;
    outline: 0;
  }
`;

const ButtonsContainer = styled.div`
  width: 83px;
  display: flex;
  justify-content: space-between;
  height: 40px;
  margin-left: 5px;
`;

const StepInputButton = styled.div<{
  isDisabled: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 9px;
  border: 2px solid #222222;
  box-sizing: border-box;
  background-color: transparent;
  font-size: 30px;
  font-family: Mulish, sans-serif;
  font-weight: 800;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
  ${(props) =>
    props.isDisabled === true
      ? `
color: #cbcbcb !important;
border-color: #cbcbcb !important;
cursor: default;`
      : ``}

  &:hover {
    color: #aac21f;
    border-color: #aac21f;
  }

  &:focus {
    outline: 0;
    color: ${(props) => (props.isDisabled === false ? "#aac21f" : "#fffff")};
  }

  &:active {
    border-color: ${(props) => (props.isDisabled === false ? "#aac21f" : "#fffff")};
    background-color: ${(props) => (props.isDisabled === false ? "#aac21f" : "#fffff")};
    color: white;
    outline: 0;
  }
`;
