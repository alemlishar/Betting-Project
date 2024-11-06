import React, { useState, useRef, useContext, useEffect, useCallback } from "react";

import styled from "styled-components/macro";
import { parseAsMoney } from "src/helpers/format-data";
import { useErrorContext, useUpdateErrorContext } from "./errorContext";
import { postSaldoCassa } from "src/components/common/saldoCassaDialog/saldo-cassa-api";
import { APIResponseType } from "src/types/apiResponse.types";
import { mutate } from "swr";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { Toast } from "../toast-message/Toast";
import { FormattedMessage } from "react-intl";

export const BodyMethodSaldoCassa = (props: {
  method: string;
  closeDialog: Function;
  pushToast(content: React.ReactNode, duration: number): void;
}) => {
  const { balanceAmount } = useContext(GlobalStateContext);
  const [sovvenzione, setSonvvezione] = useState<boolean>(false);
  const [sovvenzioneValue, setSovvenzioneValue] = useState<string>("");
  const [prelevareValue, setPrelevareValue] = useState<string>("");
  const [prelevare, setPrelevare] = useState<boolean>(false);
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const error = useErrorContext();
  const updateErrorContext = useUpdateErrorContext();
  const [amountChanged, setAmountChanged] = useState<number>(balanceAmount);
  const [prelevareNotFormatted, setPrelevareNotFormatted] = useState<string>("");
  const [SovvenzioneNotFormatted, setSovvenzioneNotFormatted] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fireApiCall, setFireApiCall] = useState<boolean>(false);
  const [endpoint, setEndPoint] = useState<string>("");
  const [data, setData] = useState<object>({ value: 0 });
  const inputRefPrelevare = useRef<HTMLInputElement>(null);
  const inputRefSovvenzione = useRef<HTMLInputElement>(null);
  const showConfirmationBox = useCallback(
    (type: String, message: String) => {
      setLoading(false);
      if (type === "error") {
        updateErrorContext.setError({
          active: true,
          prelevare: false,
          type: "error",
          message: message,
        });
      } else {
        updateErrorContext.setError({
          prelevare: false,
          active: true,
          type: "success",
          message: message,
        });
      }
    },
    [updateErrorContext],
  );
  const showToastMessage = () => {
    const value = sovvenzione ? sovvenzioneValue : prelevareValue;
    if (sovvenzione) {
      props.pushToast(
        <Toast
          type="success"
          heading={
            <FormattedMessage
              description="saldo-cassa: descrizione conferma sovvenzione"
              defaultMessage="Sovvenzione di {value} andata a buon fine"
              values={{ value }}
            />
          }
          description={
            <FormattedMessage
              description="saldo-cassa: Saldo cassa aggiornato"
              defaultMessage="Saldo cassa aggiornato"
            />
          }
        />,
        5000,
      );
    } else {
      props.pushToast(
        <Toast
          type="success"
          heading={
            <FormattedMessage
              description="saldo-cassa: descrizione conferma prelievo"
              defaultMessage="Prelievo di {value} andato a buon fine"
              values={{ value }}
            />
          }
          description={
            <FormattedMessage
              description="saldo-cassa: Saldo cassa aggiornato"
              defaultMessage="Saldo cassa aggiornato"
            />
          }
        />,
        5000,
      );
    }
  };

  function evaluateResponse(
    responseSaldoCassa: APIResponseType<{
      amount?: number;
      scopes?: [];
      code?: string;
      description?: string;
      message?: string;
    }>,
  ) {
    if (responseSaldoCassa && "error" in responseSaldoCassa) {
      showConfirmationBox("error", responseSaldoCassa.error.description);
    } else {
      if (responseSaldoCassa && "result" in responseSaldoCassa) {
        mutate("balanceAmountService");
        props.closeDialog();
        showToastMessage();
      }
    }
  }

  useEffect(() => {
    if (!disableButton && (sovvenzione || prelevare)) {
      setEndPoint(prelevare ? "withdraw" : "deposit");
      let value = endpoint === "withdraw" ? parseFloat(prelevareNotFormatted) : parseFloat(SovvenzioneNotFormatted);
      setData({
        value: value,
      });
    }

    function excecuteApiCall() {
      if (!disableButton && (sovvenzione || prelevare)) {
        prelevare ? sendValueToBackEnd() : sendValueToBackEnd();
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (prelevare) {
          if (inputRefPrelevare && inputRefPrelevare.current) {
            inputRefPrelevare.current.blur();
          }
        } else {
          if (inputRefSovvenzione && inputRefSovvenzione.current) {
            inputRefSovvenzione.current.blur();
          }
        }
        setFireApiCall(true);
      }
    };
    if (fireApiCall) {
      excecuteApiCall();
      setFireApiCall(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prelevareValue, sovvenzioneValue, fireApiCall]);
  const onHandleSovvenzioneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const puntataRegexp = /^(([0-9]{0,5}[\\.,]{1}[0-9]{0,2})|(^[0-9]{0,5}))$/;
    let inputText = e.target.value;
    if (puntataRegexp.test(inputText)) {
      let inputTextPuntata = inputText.replace(",", ".");
      inputText = inputText.replace(".", ",");
      if (error.active === true) {
        updateErrorContext.setError({ active: false, type: null, message: null, prelevare: false });
      }
      if (Number(e.target.value) || e.target.value === "" || e.target.value.includes(",")) {
        if (e.target.value === "") {
          setSonvvezione(false);
        } else {
          setSonvvezione(true);
        }
        let newValue: number;
        newValue = parseFloat(inputTextPuntata);
        if (e.target.value === "") {
          newValue = 0;
        }
        setSovvenzioneValue(inputTextPuntata);
        setAmountChanged(parseFloat((balanceAmount + newValue).toFixed(2)));
      }
    }
  };

  const sendValueToBackEnd = async () => {
    setLoading(true);
    const responseSaldoCassa = await postSaldoCassa({ endpoint: endpoint, data: data });
    evaluateResponse(responseSaldoCassa);
  };
  const formatInputValue = (type: string) => {
    if (type === "prelevare") {
      setPrelevareNotFormatted(prelevareValue);
      setPrelevareValue(parseAsMoney(parseFloat(prelevareValue)));
    } else {
      setSovvenzioneNotFormatted(sovvenzioneValue);
      setSovvenzioneValue(parseAsMoney(parseFloat(sovvenzioneValue)));
    }
  };
  const convertFormattedToString = (type: string) => {
    if (type === "prelevare") {
      setPrelevareValue(prelevareNotFormatted);
    } else {
      setSovvenzioneValue(SovvenzioneNotFormatted);
    }
  };
  const onHandlePrelevareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error.active === true) {
      updateErrorContext.setError({ active: false, type: null, message: null, prelevare: false });
    }
    const puntataRegexp = /^(([0-9]{0,5}[\\.,]{1}[0-9]{0,2})|(^[0-9]{0,5}))$/;
    let inputText = e.target.value;
    if (puntataRegexp.test(inputText)) {
      let inputTextPuntata = inputText.replace(",", ".");
      inputText = inputText.replace(".", ",");
      if (Number(e.target.value) || e.target.value === "" || e.target.value.includes(",")) {
        if (e.target.value === "") {
          setPrelevare(false);
        } else {
          setPrelevare(true);
        }
        if (parseFloat(e.target.value) > balanceAmount) {
          updateErrorContext.setError({
            prelevare: true,
            active: true,
            type: "error",
            message: "L'importo da prelevare è maggiore del Saldo Cassa.",
          });
          setAmountChanged(parseFloat(balanceAmount.toFixed(2)));
          setPrelevareValue(inputTextPuntata);
          setDisableButton(true);
        } else {
          if (error.active === true && error.type === "error") {
            setDisableButton(false);
            updateErrorContext.setError({ active: false, type: null, prelevare: false, message: null });
          }
          let newValue: number;
          newValue = parseFloat(inputTextPuntata);
          if (e.target.value === "") {
            newValue = 0;
          } else {
            newValue = parseFloat(inputTextPuntata);
          }
          setPrelevareValue(inputTextPuntata);
          setAmountChanged(parseFloat((balanceAmount - newValue).toFixed(2)));
        }
      }
    }
  };
  return (
    <React.Fragment>
      {props.method === "contanti" && (
        <React.Fragment>
          <StyledRow>
            <StyledColumn>
              Saldo Cassa
              <EmphasizedText color="#000000">Attuale</EmphasizedText>
            </StyledColumn>
            <StyledColumn>
              <StyledInput disabled value={parseAsMoney(balanceAmount)} />
            </StyledColumn>
          </StyledRow>
          <StyledRow>
            <StyledColumn>
              Importo da <EmphasizedText color="#0B7D3E">Sovvenzionare</EmphasizedText>
            </StyledColumn>
            <StyledColumn>
              <StyledInputChanging
                ref={inputRefSovvenzione}
                onFocus={() => convertFormattedToString("sovvenzione")}
                onBlur={() => formatInputValue("sovvenzione")}
                //   onKeyDown={(e) => handleKeyDownSovvenzione(e)}
                disabled={prelevare}
                value={sovvenzioneValue}
                onChange={(e) => onHandleSovvenzioneChange(e)}
              />
            </StyledColumn>
          </StyledRow>
          <StyledRow>
            <StyledColumn>
              Importo da <EmphasizedText color="#EB1E23">Prelevare</EmphasizedText>{" "}
            </StyledColumn>
            <StyledColumn>
              <StyledInputChanging
                ref={inputRefPrelevare}
                className={
                  error.active === true && error.type === "error" && error.prelevare === true ? "red-outline" : ""
                }
                onFocus={() => convertFormattedToString("prelevare")}
                onBlur={() => formatInputValue("prelevare")}
                //  onKeyDown={(e) => handleKeyDownPrelevare(e)}
                disabled={sovvenzione}
                value={prelevareValue}
                onChange={(e) => onHandlePrelevareChange(e)}
              />
            </StyledColumn>
          </StyledRow>
          <StyledRow>
            <StyledColumn>
              Saldo Cassa
              <EmphasizedText color="#000000">Previsto</EmphasizedText>
            </StyledColumn>
            <StyledColumn>
              <StyledInput disabled value={parseAsMoney(amountChanged)} />
            </StyledColumn>
          </StyledRow>
          <StyledRow className="extra-p-t">
            <SaldoCassaButton
              disabled={(sovvenzione === false && prelevare === false) || disableButton ? true : false}
              onClick={() => {
                prelevare ? sendValueToBackEnd() : sendValueToBackEnd();
                //props.setIsSaldoCassaUpdate(false);
              }}
            >
              <ButtonText
                className={(sovvenzione === false && prelevare === false) || disableButton ? "disabled" : "enabled"}
              >
                {loading ? "Aggiornamento in corso..." : "Conferma"}
              </ButtonText>
            </SaldoCassaButton>
          </StyledRow>
        </React.Fragment>
      )}
      {props.method === "altri" && <StyledRow className="fullHeight">Altro metodo</StyledRow>}
    </React.Fragment>
  );
};
const StyledRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  padding-top: 10px;

  width: 100%;
  &.fullHeight {
    height: 100%;
  }
  &.extra-p-t {
    padding-top: 60px;
    padding-bottom: 30px;
  }
`;
const ButtonText = styled.div`
  font-family: Roboto;
  font-size: 23px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 27px;
  text-align: center;
  &.disabled {
    color: #bbbbbb;
  }
  &.enabled {
    color: #ffffff;
  }
`;
const SaldoCassaButton = styled.button`
  height: 60px;
  width: 100%;
  border: none;
  border-radius: 10px;
  background-color: #005936;

  color: #ffffff;
  cursor: pointer;
  &:disabled {
    background-color: #979797;
    cursor: default;
  }
  &:focus {
    outline: 0px;
  }
`;
const StyledInputChanging = styled.input`
  height: 60px;
  width: 180px;
  padding: 0px 20px;
  text-align: right;
  caret-color: #0b7d3e;
  border-radius: 8px;

  font-size: 27px;
  color: #000000;
  font-family: Roboto;

  font-weight: bold;
  border: 4px solid #ededed;
  &::placeholder {
    color: #979797;
  }
  &:disabled {
    color: #979797;
    background-color: #ededed;
  }
  &:focus {
    outline: none;
    border: 4px solid #aac21f;
  }
  &::placeholder {
    font-weight: 300;
    font-style: italic;
    color: #ffffff;
    opacity: 85%;
  }
  &.red-outline {
    border-color: red;
  }
`;
const StyledInput = styled.input`
  height: 60px;
  width: 180px;
  padding: 0px 20px;
  text-align: right;
  caret-color: #0b7d3e;
  border-radius: 8px;

  font-size: 27px;
  color: #000000;
  font-family: Roboto;

  font-weight: bold;
  border: 4px solid #ededed;
  &::placeholder {
    color: #979797;
  }
  &:disabled {
    background-color: #ededed;
  }
  &:focus {
    outline: none;
    border: 4px solid #0b7d3e;
  }
  &::placeholder {
    font-weight: 300;
    font-style: italic;
    color: #ffffff;
    opacity: 85%;
  }
  &.red-outline {
    border-color: red;
  }
`;
const EmphasizedText = styled.div<{
  color: string;
}>`
  color: #000000;
  font-family: Roboto;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 21.5px;
  display: block;
  text-transform: uppercase;
  color: ${(props) => props.color};
`;
const StyledColumn = styled.div`
  padding-top: 20px;
  color: #000000;
  font-family: Roboto;
  font-size: 18px;
  max-width: 225px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 21.5px;
  width: 100%;
`;

export default BodyMethodSaldoCassa;
