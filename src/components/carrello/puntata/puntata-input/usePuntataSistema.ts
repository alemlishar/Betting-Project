import { useEffect } from "react";
import { CartErrorsType } from "src/types/carrello.types";

type HookPuntataSistemaType = {
  textBet: string;
  setErrors?: (e: CartErrorsType) => void;
  maxWin?: number;
};
export const usePuntataSistema = ({ textBet, setErrors, maxWin }: HookPuntataSistemaType) => {
  const evaluateErrors = () => {
    const inputValueSplit = textBet.split(",");
    const hasDecimals = inputValueSplit.length > 1;
    const decimalPart = hasDecimals ? inputValueSplit[1] : "";
    const lastDigit = textBet[textBet.length - 1];
    const isNot5DecimalsMultiple = decimalPart.length === 2 && lastDigit !== "0" && lastDigit !== "5";

    const isGreaterThan20 = parseFloat(textBet.replace(",", ".")) > 20;
    const winIsGreaterThan10k = maxWin === undefined ? false : maxWin > 10000;

    if (setErrors) {
      setErrors({ isGreaterThan20, isNot5DecimalsMultiple, winIsGreaterThan10k });
    }
  };

  useEffect(() => {
    evaluateErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textBet, maxWin]);
};
