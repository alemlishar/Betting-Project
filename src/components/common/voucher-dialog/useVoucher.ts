import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ErrorType } from "src/components/common/voucher-dialog/VoucherDialog";
import {
  insertSpaceEachFourItems,
  makeProgressiveRegex,
} from "src/components/dialog-biglietto/dialog-trova-biglietto/DialogTrovaBiglietto";
import { beep } from "src/components/smart-search/SmartSearch";
import configuration from "src/helpers/configuration";
import { parseAsMoney } from "src/helpers/format-data";

//CUSTOM HOOk EMISSIONE VOUCHER
export function useEmettiVoucher({
  fixedAmountsClicked,
  setFixedAmountsClicked,
  inputRef,
}: {
  closeToast(content: React.ReactNode): void;
  pushToast(content: React.ReactNode, duration: number): void;
  fixedAmountsClicked: boolean;
  setFixedAmountsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const [importoInput, setImportoInput] = useState("€");
  const [activeKeyboard, setActiveKeyboard] = useState<boolean>(false);
  //TODO - DEBT Perchè è stato usato uno useState al posto di onSetError direttamente?
  const [error, setError] = useState<ErrorType>({ method: "Emetti", status: false, message: "" });
  const [importo, setImporto] = useState(0);
  const [activeArray, setActiveArray] = useState<Array<boolean>>([false, false, false, false, false]);

  const setImportFromAmountBox = (amount: number, indexToUpdate: number) => {
    setFocusOnInput(inputRef);
    setImporto(amount);
    setImportoInput(parseAsMoney(amount));

    let tempArray = Array(activeArray.length);
    activeArray.map((element, i) => {
      return (tempArray[i] = i === indexToUpdate ? true : false);
    });

    setActiveArray(tempArray);
  };
  useEffect(() => {
    if (importo > configuration.HIGHER_LIMIT_VOUCHER) {
      return setError({ method: "Emetti", status: true, message: "Impossibile emettere voucher superiori a € 500" });
    }
    if (importo < configuration.LOWER_LIMIT_VOUCHER && importo !== 0) {
      return setError({ method: "Emetti", status: true, message: "Impossibile emettere voucher inferiori a € 1" });
    } else {
      return setError({ method: "Emetti", status: false, message: "" });
    }
  }, [importo]);
  useEffect(() => {
    if (importoInput === "€ ") {
      if (inputRef.current != null) {
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
      }
    }
  }, [importoInput, inputRef]);

  const setFocus = () => {
    inputRef.current?.focus();

    if (importoInput === "" || importoInput === "€") {
      setImportoInput("€ ");
    }
    if (importoInput === "€ 0,00") {
      inputRef.current?.select();
    }
  };
  const formatMoney = () => {
    setImportoInput(parseAsMoney(importo));
  };
  const changeInputOnKeydown = (e: string) => {
    loosePredefinedAmountsFocus();

    const regexp = /^(((€ ){0,1}[1-9]{1}[0-9]{0,2}[\\,]{1}[0-9]{0,2})|((€ ){0,1}[1-9]{1}[0-9]{0,2}[\\.]{1}[0-9]{0,3}[\\,]{1}[0-9]{0,2})|(^((€ ){0,1}[1-9]{1}[0-9]{0,2})))$/;
    let numberInserted = e.replace(/^€+/i, "");
    if (regexp.test(e) === true || e === "" || e === null || e === "€ ") {
      if (
        parseFloat(numberInserted.replace(",", ".")) <= 500 ||
        Number.isNaN(parseFloat(numberInserted.replace(",", ".")))
      ) {
        if (error.status === true) {
          setError({ method: "Emetti", status: false, message: "" });
        }
      } else {
        setError({ method: "Emetti", status: true, message: "Impossibile emettere voucher superiori a € 500" });
      }
      setImporto(parseFloat(numberInserted.replace(",", ".")));

      setImportoInput(e);
    }
  };
  const loosePredefinedAmountsFocus = () => {
    setActiveArray([false, false, false, false, false]);
  };

  const handleOnKeydown = (e: string) => {
    setActiveKeyboard(true);
  };

  const updateInputBox = (numberChoosed: number) => {
    setFocusOnInput(inputRef);

    if (fixedAmountsClicked) {
      loosePredefinedAmountsFocus();
      setFixedAmountsClicked(false);
    }
    if (activeKeyboard === false) {
      if (Number.isNaN(importo)) {
        setImporto(numberChoosed);
        setImportoInput(parseAsMoney(numberChoosed));
      } else {
        //check if value is from input typing or predefined amounts clicked

        var condition;
        if (fixedAmountsClicked) {
          condition = (numberChoosed + "").length <= 2;
        } else {
          condition = (importo + numberChoosed + "").length <= 2;
        }
        if (condition) {
          if (fixedAmountsClicked) {
            setFixedAmountsClicked(false);
            setImporto(parseFloat("" + numberChoosed));
            setImportoInput("€ " + numberChoosed);
          } else {
            if (importo !== 0) {
              setImporto(parseFloat("" + importo + numberChoosed));
              setImportoInput("€ " + importo + numberChoosed);
            } else {
              setImporto(parseFloat(numberChoosed.toString()));
              setImportoInput("€ " + numberChoosed.toString());
            }
          }
        }
      }
    } else {
      setImporto(parseFloat("" + numberChoosed));
      setImportoInput("€ " + numberChoosed);
      setActiveKeyboard(false);
    }
  };
  return {
    importo,
    importoInput,
    setImportFromAmountBox,
    updateInputBox,
    activeArray,
    formatMoney,
    changeInputOnKeydown,
    handleOnKeydown,
    setFocus,
    error,
  };
}

//CUSTOM HOOK PER PAGAMENTO VOUCHER
export function usePagaVoucher({
  onError,
  onSetError,
  method,
}: {
  onError: ErrorType;
  onSetError: (error: ErrorType) => void;
  method: string;
}) {
  const inputRefPaga = useRef<HTMLInputElement>(null);
  const [codeInput, setCodeInput] = useState<string>("");
  const [isOnFocus, setIsOnFocus] = useState<boolean>(false);

  const formattedVoucherCode = useMemo(() => {
    const splitTicketCode = codeInput.split("");
    return insertSpaceEachFourItems(splitTicketCode).join("");
  }, [codeInput]);

  const spacedProgressiveRegex = useCallback((): string => {
    const splitTicketCode = codeInput.split("");
    const spacedSportRegex = insertSpaceEachFourItems(splitTicketCode);

    return `(${makeProgressiveRegex(spacedSportRegex)})`;
  }, [codeInput]);

  useEffect(() => {
    if (method === "Paga") {
      if (!isOnFocus && codeInput.length < 16 && codeInput.length > 0 && onError.message !== "Codice non corretto") {
        onSetError({ method: "Paga", status: true, message: "Codice incompleto. Deve avere 16 cifre." });
      } else if (onError.message === "Codice incompleto. Deve avere 16 cifre.") {
        onSetError({ method: "Paga", status: false, message: "" });
      }
    }
  }, [codeInput.length, isOnFocus, method, onError.message, onSetError]);

  const updateVoucherCodeBox = (valueChoosed: string) => {
    setIsOnFocus(true);
    setFocusOnInput(inputRefPaga);
    if (codeInput.length === 16) {
      return;
    }
    setCodeInput(codeInput.toString() + valueChoosed.toString());
  };
  const changeInputOnKeydown = (e: string) => {
    setIsOnFocus(true);
    onSetError({ method: "Paga", status: false, message: "" });
    const inputValue = e.replace(/ /g, "");
    const regexp = /^[A-Fa-f0-9]{0,16}$/;
    const fakeRegex = /^[A-Za-z0-9]{0,16}$/;
    if (fakeRegex.test(inputValue) === true || e === "") {
      setCodeInput(inputValue);
      if (regexp.test(inputValue) === false && e !== "") {
        onSetError({ method: "Paga", status: true, message: "Codice non corretto" });
        if (codeInput.length <= e.replace(/ /g, "").length) {
          beep();
        }
      }
    } else if (codeInput.length === 16) {
      return;
    }
  };

  return {
    updateVoucherCodeBox,
    changeInputOnKeydown,
    codeInput,
    formattedVoucherCode,
    spacedProgressiveRegex,
    inputRefPaga,
    isOnFocus,
    setIsOnFocus,
  };
}

function setFocusOnInput(ref: React.RefObject<HTMLInputElement>) {
  ref?.current?.focus();
}
