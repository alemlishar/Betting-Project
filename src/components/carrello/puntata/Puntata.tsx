import React, { useCallback, useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components/macro";
import { PuntataButtons } from "./puntata-buttons/StepButtons";
import { PuntataInput } from "./puntata-input/PuntataInput";
import { CartErrorsType } from "../../../types/carrello.types";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { useUpdateClientsContext } from "src/components/common/context-clients/ClientsContext";

export const Puntata = ({
  bet,
  updateBetLegatura,
  updateBetMultipla,
  updateErrors,
  hasErrors,
  isOnFocus,
  changeLegaturaOnFocus,
  indexLegatura,
  indexLegaturaOnFocus,
  maxBet,
  minBet,
  step,
  setIsPuntataMultiplaHighlighted,
  maxWin,
  visibleParam,
  ordinale,
  isMultiplaActive,
  disablePuntataInput,
  totalBetSviluppo,
  focusOnKeyboard,
  onSetFocusOnKeyboard,
  classeLegature,
}: {
  bet: number;
  totalBetSviluppo?: number;
  hasErrors?: boolean;
  updateBetLegatura?: (bet: number, indexLegatura: number | undefined) => void;
  updateBetMultipla?: (bet: number, activeClient: number) => void;
  updateErrors?: (errors: CartErrorsType, indexLegatura?: number) => void;
  isOnFocus?: boolean;
  changeLegaturaOnFocus?: (params: { direction?: 1 | -1; set?: number }) => void;
  indexLegatura?: number;
  maxBet?: number;
  minBet?: number;
  step?: number;
  setIsPuntataMultiplaHighlighted?: (p: boolean) => void;
  maxWin?: number;
  visibleParam?: boolean;
  ordinale?: number;
  indexLegaturaOnFocus?: number;
  isMultiplaActive?: boolean;
  disablePuntataInput?: boolean;
  focusOnKeyboard?: boolean;
  onSetFocusOnKeyboard?: (e: boolean) => void;
  classeLegature?: number;
}) => {
  const isPuntataSistema = indexLegatura !== undefined;
  const { activeClientIndex } = useUpdateClientsContext();

  const setBet =
    !disablePuntataInput && updateBetLegatura && !isMultiplaActive
      ? (newBet: number) => updateBetLegatura(newBet, indexLegatura)
      : !disablePuntataInput && updateBetMultipla && isMultiplaActive
      ? (newBet: number) => updateBetMultipla(newBet, activeClientIndex)
      : undefined;
  const setErrors =
    !disablePuntataInput && updateErrors
      ? (newErrors: CartErrorsType) => updateErrors(newErrors, indexLegatura)
      : undefined;
  const [textBet, setTextBet] = useState(isPuntataSistema ? "" : bet.toString());

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [selectInputByButton, setSelectInputByButton] = useState(false);

  const [internalIsOnFocus, setInternalIsOnFocus] = useState(isOnFocus !== undefined ? isOnFocus : false);
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);

  const setFocusHere = useCallback(() => {
    if (onSetFocusOnKeyboard !== undefined) {
      onSetFocusOnKeyboard(false);
    }
    if (isPuntataSistema) {
      if (ordinale !== undefined) {
        changeLegaturaOnFocus && changeLegaturaOnFocus({ set: ordinale });
      }
    } else {
      (() => {
        setInternalIsOnFocus(true);
        if (setIsPuntataMultiplaHighlighted !== undefined) {
          setIsPuntataMultiplaHighlighted(true);
        }
      })();
    }
    keyboardNavigationContext.current = "cart";
  }, [isPuntataSistema]);

  useEffect(() => {
    setInternalIsOnFocus(isOnFocus !== undefined ? isOnFocus : false);
    if (setIsPuntataMultiplaHighlighted !== undefined) {
      setIsPuntataMultiplaHighlighted(isOnFocus !== undefined ? isOnFocus : false);
    }
  }, [isOnFocus]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef !== null && wrapperRef.current !== null && !wrapperRef.current.contains(event.target)) {
        setInternalIsOnFocus(false);
        if (setIsPuntataMultiplaHighlighted !== undefined) {
          setIsPuntataMultiplaHighlighted(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <PuntataSistemaWrapper ref={wrapperRef}>
      <InputContainer>
        <PuntataInput
          classeLegature={classeLegature}
          onSetFocusOnKeyboard={onSetFocusOnKeyboard}
          setSelectInputByButton={setSelectInputByButton}
          selectInputByButton={
            selectInputByButton || (internalIsOnFocus && (focusOnKeyboard !== undefined ? focusOnKeyboard : false))
          }
          hasErrors={hasErrors}
          isPuntataSistema={isPuntataSistema}
          textBet={textBet}
          isOnFocus={internalIsOnFocus}
          setTextBet={setTextBet}
          setErrors={setErrors}
          bet={bet}
          maxWin={maxWin}
          setBet={setBet}
          setFocusHere={setFocusHere}
          ordinale={ordinale}
          indexLegaturaOnFocus={indexLegaturaOnFocus}
          isMultiplaActive={isMultiplaActive}
          disablePuntataInput={disablePuntataInput}
          totalBetSviluppo={totalBetSviluppo}
        />
      </InputContainer>
      <PuntataButtons
        isPuntataSistema={isPuntataSistema}
        classeLegatura={classeLegature}
        setSelectInputByButton={setSelectInputByButton}
        isOnFocus={internalIsOnFocus}
        maxBet={maxBet}
        minBet={minBet}
        step={step}
        bet={bet}
        setBet={setBet}
        setFocusHere={setFocusHere}
        visibleParam={visibleParam}
        disablePuntataInput={disablePuntataInput}
      />
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
