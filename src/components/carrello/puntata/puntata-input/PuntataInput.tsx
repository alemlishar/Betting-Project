import React, { useEffect } from "react";
import styled from "styled-components/macro";
import { createRef, RefObject, useMemo, useState } from "react";
import { usePuntataSistema } from "./usePuntataSistema";
import { CartErrorsType } from "../../../../types/carrello.types";
import { parseAsMoney } from "src/helpers/format-data";

export const PuntataInput = ({
  isOnFocus,
  setFocusHere,
  isPuntataSistema,
  textBet,
  setTextBet,
  bet,
  setBet,
  setErrors,
  hasErrors,
  maxWin,
  setSelectInputByButton,
  selectInputByButton,
  ordinale,
  indexLegaturaOnFocus,
  isMultiplaActive,
  disablePuntataInput,
  totalBetSviluppo,
  onSetFocusOnKeyboard,
  classeLegature,
}: {
  setFocusHere: () => void;
  totalBetSviluppo?: number;
  isOnFocus?: boolean;
  textBet: string;
  isPuntataSistema: boolean;
  setTextBet: (s: string) => void;
  setBet?: (v: number) => void;
  setErrors?: (e: CartErrorsType) => void;
  bet: number;
  hasErrors?: boolean;
  maxWin?: number;
  setSelectInputByButton: (e: boolean) => void;
  selectInputByButton: boolean;
  ordinale?: number;
  indexLegaturaOnFocus?: number;
  isMultiplaActive?: boolean;
  disablePuntataInput?: boolean;
  onSetFocusOnKeyboard?: (e: boolean) => void;
  classeLegature?: number;
}) => {
  const [contentIsSelected, setContentIsSelected] = useState(false);

  const hookParams = {
    setContentIsSelected,
    contentIsSelected,
    textBet,
    setErrors,
    maxWin,
    setSelectInputByButton,
    totalBetSviluppo,
  };
  const hook = usePuntataSistema;
  hook(hookParams);

  const inputRef: RefObject<HTMLInputElement> = useMemo(() => createRef<HTMLInputElement>(), []);

  useEffect(() => {
    if (inputRef && inputRef.current && isPuntataSistema) {
      if (ordinale === indexLegaturaOnFocus) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [isPuntataSistema, ordinale, indexLegaturaOnFocus, inputRef]);

  useEffect(() => {
    if (inputRef && inputRef.current && isMultiplaActive) {
      if (isOnFocus) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [isMultiplaActive, isOnFocus, inputRef]);

  useEffect(() => {
    const newTextBet = bet > 0 ? (bet + "").replace(".", ",") : "";
    if (newTextBet !== textBet) {
      setTextBet(newTextBet);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTextBet, bet]);

  useEffect(() => {
    if (selectInputByButton) {
      inputRef.current?.select();
      setContentIsSelected(true);
    }
  }, [inputRef, textBet, selectInputByButton]);

  useEffect(() => {
    if (disablePuntataInput) {
      let roundedPuntataAsString = String(bet.toFixed(2));
      setTextBet(roundedPuntataAsString.replace(".", ","));
    }
  });

  const roundPuntata = (e: any) => {
    let inputText = e.target.value;
    let roundedPuntata = inputText;
    if (inputText.indexOf(",") !== -1 && inputText.indexOf(".") !== -1) {
      roundedPuntata = roundedPuntata.replace(".", "");
    }
    roundedPuntata = Number(roundedPuntata.replace(",", "."));
    let roundedPuntataAsString = parseAsMoney(Number(roundedPuntata), true, true);
    setTextBet(roundedPuntataAsString);
  };

  const onHandlePuntataChange = (e: any) => {
    if (onSetFocusOnKeyboard !== undefined) {
      onSetFocusOnKeyboard(false);
    }
    const puntataRegexp = /^(([0-9]{0,2}[\\.,]{1}[0-9]{0,2})|(^[0-9]{0,2}))$/;
    const puntataMultiplaRegexp = /((^[0-9]{0,4}[\\.,]{1}[0]{0,2})|^([0-9]{0,4}))$/;
    let inputText = e.target.value;
    if (isMultiplaActive) {
      if (puntataMultiplaRegexp.test(inputText)) {
        setTextBet(inputText);
        if (setBet) {
          setBet(Number(inputText.replace(",", ".")));
        }
      } else {
        return;
      }
    } else if (puntataRegexp.test(inputText)) {
      let inputTextPuntata = Number(inputText.replace(",", "."));
      inputText = inputText.replace(".", ",");
      setTextBet(inputText);
      if (setBet) {
        setBet(inputTextPuntata);
      }
      return;
    } else {
      return;
    }
  };

  return (
    <>
      <StyledInputContainer>
        <StyledSpanEuro className={disablePuntataInput ? "disabled" : ""}>
          €
          <RealInputLayer
            data-qa={`carrello-puntata${isPuntataSistema ? "-" + classeLegature : ""}`}
            disabled={disablePuntataInput}
            className={`layer ${hasErrors ? "error" : ""} ${isOnFocus ? "focus" : ""} ${
              disablePuntataInput ? "disabled" : ""
            }`}
            type="text"
            value={textBet}
            onKeyDown={() => {
              if (selectInputByButton !== false) {
                setSelectInputByButton(false);
              }
            }}
            onChange={(e) => onHandlePuntataChange(e)}
            ref={inputRef}
            onClick={() => setFocusHere && setFocusHere()}
            onFocus={() => setFocusHere && setFocusHere()}
            onBlur={(e) => roundPuntata(e)}
            placeholder="0,00"
          />
        </StyledSpanEuro>
      </StyledInputContainer>
    </>
  );
};

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

  &.error {
    border-color: red;
  }

  &[type="text"].disabled {
    color: #999;
  }
  &.disabled {
    color: #999;
    pointer-events: none;
  }
`;
