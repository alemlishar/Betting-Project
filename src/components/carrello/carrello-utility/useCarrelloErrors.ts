import { useEffect, useState } from "react";
import { CartErrorsType } from "../../../types/carrello.types";

export const useCarrelloErrors = (maxWinningAmount: number | undefined) => {
  const [validate, setValidate] = useState<CartErrorsType>({
    isGreaterThan20: false,
    isNot5DecimalsMultiple: false,
    isGreaterThan50k: false,
    winIsGreaterThan10k: false,
    multiplaBetIsLessThan2: false,
    multiplaWinIsGreaterThan10k: false,
    isCombinazioniMinimeErr: false,
    betMultiplaIsGreaterThanUserMax: false,
    sistemaBetisLessThan2: false,
  });

  const isSistemaVendiActive =
    !(
      validate.isGreaterThan20 ||
      validate.isGreaterThan50k ||
      validate.isNot5DecimalsMultiple ||
      validate.winIsGreaterThan10k ||
      validate.isCombinazioniMinimeErr ||
      validate.betSistemaIsGreaterThanUserMax ||
      validate.sistemaBetisLessThan2
    ) === undefined
      ? true
      : !(
          validate.isGreaterThan20 ||
          validate.isGreaterThan50k ||
          validate.isNot5DecimalsMultiple ||
          validate.winIsGreaterThan10k ||
          validate.isCombinazioniMinimeErr ||
          validate.betSistemaIsGreaterThanUserMax ||
          validate.sistemaBetisLessThan2
        );

  const isMultiplaVendiActive =
    validate.multiplaBetIsLessThan2 === false &&
    validate.multiplaWinIsGreaterThan10k === false &&
    validate.betMultiplaIsGreaterThanUserMax === false;

  // check if total bet is greater than max limit
  useEffect(() => {
    if (maxWinningAmount) {
      const isGreaterThan50k = maxWinningAmount > 50000;
      if (validate.isGreaterThan50k !== isGreaterThan50k) {
        setValidate({ ...validate, isGreaterThan50k });
      }
    }
  }, [maxWinningAmount]);

  return { validate, setValidate, isSistemaVendiActive, isMultiplaVendiActive };
};
