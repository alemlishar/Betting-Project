import { useCallback, useRef, useState, useContext } from "react";
import { getGiocatasistemisticaPayload, useLongPress } from "src/components/carrello-virtual/VirtualCart.helpers";

import { useVirtualUpdateClientsContext } from "src/components/common/context-clients/VirtualClientsContext";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";

import { formatNumberWithoutRounding } from "src/helpers/formatUtils";

import styled from "styled-components/macro";
import { mutate } from "swr";
export const PuntataSistemaVirtual = ({ indexToShow }: { indexToShow: number }) => {
  const globalContext = useContext(GlobalStateContext);
  const { updateCurrentVirtualClientData, activeVirtualClient } = useVirtualUpdateClientsContext();
  const maximumBet = 20; //TODO: result.sviluppoByCardinalita[legatura].importoMassimoCombinazione (ma è sempre 20!)
  const minimumStep = globalContext.systemVirtualBetConfig ? globalContext.systemVirtualBetConfig.importoBase : 0.05;
  const wrapperRefInput = useRef<HTMLDivElement | null>(null);
  const wrapperRefButton = useRef<HTMLDivElement | null>(null);

  const [inputValue, setInputValue] = useState<string>(
    activeVirtualClient.puntataSistema[indexToShow - 1].importo === 0
      ? "0,00"
      : formatNumberWithoutRounding(
          Number(activeVirtualClient.puntataSistema[indexToShow - 1].importo.toString().replace(",", ".")),
          ",",
        ),
  );

  const [inputUnformattedValue, setInputUnformattedValue] = useState<string>(
    activeVirtualClient.puntataSistema[indexToShow - 1].importo === 0
      ? "0,00"
      : activeVirtualClient.puntataSistema[indexToShow - 1].importo.toString().replace(",", "."),
  );

  const formatInputValue = () => {
    setInputUnformattedValue(inputValue);
    setInputValue(formatNumberWithoutRounding(Number(inputValue.replace(",", ".")), ","));
  };
  const convertFormattedToString = () => {
    setInputValue(inputUnformattedValue === "0,00" ? "0,00" : inputUnformattedValue.replace(".", ","));
  };
  const updatePuntataSistemaValue = useCallback(
    (indexToUpdate: number, updatedValue: string) => {
      let items = [...activeVirtualClient.puntataSistema];

      let item = { ...activeVirtualClient.puntataSistema[indexToUpdate - 1] };

      item.cardinalita = indexToUpdate;
      item.importo = Number(updatedValue.replace(",", "."));

      items[indexToUpdate - 1] = item;
      const newData = {
        ...activeVirtualClient,
        puntataSistema: items,
      };
      return newData;
    },
    [activeVirtualClient],
  );
  const removeDuplicatesStr = useCallback((str) => {
    const reduceString = [...new Set(str)];
    return reduceString.join("").replace("0", "").replace(",", "");
  }, []);
  const onHandlePuntataChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | string) => {
      const puntataVirtualSistemaRegexp = /((^[0-9]{0,2}[\\.,]{1}[0-9]{0,2})|^([0-9]{0,2}))$/;

      const inputText =
        typeof event === "string"
          ? event
          : inputValue === "0,00"
          ? removeDuplicatesStr(event.target.value)
          : event.target.value;

      const isDecimal = /((^[0]{0,1}[\\.,]{1}[0-9]{0,2}))$/;
      if (puntataVirtualSistemaRegexp.test(inputText)) {
        if (isDecimal.test(inputText)) {
          setInputValue(inputText);
        } else {
          setInputValue(inputText.replace(/^0+/, ""));
        }
        const newDataClient = updatePuntataSistemaValue(indexToShow, inputText);
        updateCurrentVirtualClientData(newDataClient);

        mutate(
          "giocataSistemisticaSviluppataVirtual",
          getGiocatasistemisticaPayload(activeVirtualClient.selectedEvents, newDataClient.puntataSistema),
        );
      } else {
        return;
      }
    },
    [
      activeVirtualClient.selectedEvents,
      indexToShow,
      inputValue,
      removeDuplicatesStr,
      updateCurrentVirtualClientData,
      updatePuntataSistemaValue,
    ],
  );
  const evaluateNextStep = useCallback(
    (direction: 1 | -1) => {
      const change =
        Number((Number((100 * Number(inputValue.replace(",", "."))).toFixed(0)) % (minimumStep * 100)).toFixed(2)) /
        100;
      if (change === 0) {
        return minimumStep;
      } else {
        if (direction === 1) {
          return minimumStep - change;
        }
        if (direction === -1) {
          return change;
        }
      }
      return 0;
    },
    [inputValue, minimumStep],
  );
  const [selectInput, setSelectInput] = useState<HTMLInputElement | null>(null);
  const changeInputImportoBaseIncrement = useCallback(() => {
    if (Number(inputValue.replace(",", ".")) === maximumBet) {
      return;
    } else {
      selectInput?.focus();
      const step = evaluateNextStep(1);
      const bet = Number(inputValue.replace(",", ".")) + step;
      setInputValue(bet.toFixed(2).replace(".", ","));
      onHandlePuntataChange(bet.toFixed(2).replace(".", ","));
      setTimeout(() => {
        selectInput?.select();
      }, 10);
    }
  }, [inputValue, selectInput, evaluateNextStep, onHandlePuntataChange]);
  const changeInputImportoBaseDecrment = useCallback(() => {
    if (Number(inputValue.replace(",", ".")) === 0) {
      return;
    } else {
      selectInput?.focus();
      const step = evaluateNextStep(-1);
      const bet = Number(inputValue.replace(",", ".")) - step;

      setInputValue(bet.toFixed(2).replace(".", ","));
      onHandlePuntataChange(bet.toFixed(2).replace(".", ","));
      setTimeout(() => {
        selectInput?.select();
      }, 10);
    }
  }, [evaluateNextStep, inputValue, onHandlePuntataChange, selectInput]);

  const longPressPropsIncrease = useLongPress({
    onClick: () => {
      changeInputImportoBaseIncrement();
    },
    onLongPress: () => {
      changeInputImportoBaseIncrement();
    },
  });
  const longPressPropDecrease = useLongPress({
    onClick: () => {
      changeInputImportoBaseDecrment();
    },
    onLongPress: () => {
      changeInputImportoBaseDecrment();
    },
  });

  return (
    <PuntataSistemaWrapper ref={wrapperRefInput}>
      <InputContainer>
        <StyledInputContainer>
          <StyledSpanEuro>
            €
            <RealInputLayer
              ref={(newRef) => setSelectInput(newRef)}
              value={inputValue}
              className={"layer"}
              onChange={(event) => {
                onHandlePuntataChange(event);
              }}
              onFocus={() => convertFormattedToString()}
              onBlur={() => formatInputValue()}
              autoFocus={activeVirtualClient.puntataSistema.length === indexToShow}
            />
          </StyledSpanEuro>
        </StyledInputContainer>
      </InputContainer>
      <ButtonsContainer ref={wrapperRefButton}>
        <StepInputButton {...longPressPropDecrease} isDisabled={Number(inputValue.replace(",", ".")) === 0}>
          -
        </StepInputButton>
        <StepInputButton {...longPressPropsIncrease} isDisabled={Number(inputValue.replace(",", ".")) > maximumBet}>
          +
        </StepInputButton>
      </ButtonsContainer>
    </PuntataSistemaWrapper>
  );
};

//TODO: should we move somewhere else these styled?
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

const StepInputButton = styled.button<{
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
