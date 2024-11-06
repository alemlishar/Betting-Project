import React, { useEffect, useReducer, useContext, useMemo, useState } from "react";
import styled from "styled-components/macro";
import { ReactComponent as BackArrow } from "../../../assets/images/back.svg";
import { SviluppoSistemaType, CartErrorsType } from "../../../types/carrello.types";
import { AlertBox } from "../../common/alert-box/AlertBox";
import { SmartSearchState } from "src/components/smart-search/useSmartSearch";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { LegatureSviluppoSistema } from "src/components/carrello/sviluppo-sistema/legature-sviluppo-sistema/LegatureSviluppoSistema";
import { WarningDropdownSistema } from "src/components/carrello/sviluppo-sistema/warning-dropdown-sistema/WarningDropdownSistema";
import { VenditaOptionalParameters } from "src/types/vendita.types";
import { FormattedMessage } from "react-intl";

export const SviluppoSistema = ({
  isOpen,
  switchSviluppoSistema,
  legature,
  legatureToShow,
  updateClientSviluppoSistema,
  totalBetSviluppo,
  setEventsAreHighlighted,
  eventsAreHighlighted,
  validate,
  setValidate,
  onStateChange,
  isCombinazioniMinimeErr,
  sistemaBetisLessThan2,
  venditaSistema,
  setErrorCombinationPrint,
}: {
  isOpen: boolean;
  switchSviluppoSistema: () => void;
  legature: Array<SviluppoSistemaType> | undefined;
  legatureToShow: Array<SviluppoSistemaType> | undefined;
  updateClientSviluppoSistema: (sviluppoSistema: Array<SviluppoSistemaType> | undefined) => void;
  totalBetSviluppo: number;
  eventsAreHighlighted: boolean;
  setEventsAreHighlighted: (lightEvents: boolean) => void;
  validate: CartErrorsType;
  setValidate: (e: CartErrorsType) => void;
  onStateChange(state: SmartSearchState): void;
  isCombinazioniMinimeErr: boolean;
  sistemaBetisLessThan2: boolean;
  venditaSistema: (params?: VenditaOptionalParameters) => void;
  setErrorCombinationPrint: (e: string) => void;
}) => {
  const updateBetLegatura = (bet: number, legaturaId: number | undefined) => {
    const sviluppoSistema = legature?.map((legatura, index) =>
      index !== legaturaId
        ? legatura
        : {
            ...legatura,
            bet,
            combinazioni:
              legatureToShow && legatureToShow[legaturaId] !== undefined ? legatureToShow[legaturaId].combinazioni : 0,
          },
    );
    updateClientSviluppoSistema(sviluppoSistema);
  };
  const [isError, setIsError] = useState<boolean>(false);
  const [focusOnKeyboard, setFocusOnKeyboard] = useState<boolean>(false);
  const hasErrors = (legatura: SviluppoSistemaType): boolean => {
    return (
      legatura.errors?.isNot5DecimalsMultiple ||
      legatura.errors?.isGreaterThan20 ||
      legatura.errors?.sistemaBetisLessThan2 ||
      legatura.errors?.winIsGreaterThan10k ||
      legatura.errors?.isCombinazioniMinimeErr ||
      false
    );
  };
  const warningIsVisible = useMemo(
    () => (legatureToShow && legatureToShow.filter((legatura) => !legatura.isAvailable).length > 0 ? true : false),

    [legatureToShow],
  );

  const legatureDisponibili = useMemo(
    () => legatureToShow && legatureToShow.filter((legatura) => legatura.isAvailable),
    [legatureToShow],
  );
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  const updateErrorsLegatura = (errors: CartErrorsType, legaturaId: number | undefined) => {
    const fixedNumbers =
      legature !== undefined && legatureToShow !== undefined ? legature?.length - legatureToShow?.length : 0;

    const actualIndex = legaturaId !== undefined ? legaturaId + fixedNumbers : 0;
    const sviluppoSistema = legature?.map((legatura, index) =>
      index !== actualIndex
        ? legatura
        : {
            ...legatura,
            errors,
          },
    );

    if (
      legature !== undefined &&
      legature[actualIndex] !== undefined &&
      sviluppoSistema !== undefined &&
      (legature[actualIndex].errors?.isGreaterThan20 !== errors?.isGreaterThan20 ||
        legature[actualIndex].errors?.isNot5DecimalsMultiple !== errors?.isNot5DecimalsMultiple ||
        legature[actualIndex].errors?.winIsGreaterThan10k !== errors?.winIsGreaterThan10k)
    ) {
      updateClientSviluppoSistema(sviluppoSistema);
    }
  };

  const [indexLegaturaOnFocus, changeLegaturaOnFocus] = useReducer(
    (currentIndexOnFocus: number, action: { direction?: 1 | -1; set?: number }): number => {
      if (action.direction !== undefined) {
        const stepIndex = currentIndexOnFocus + action.direction;
        return stepIndex >= 0 && stepIndex < (legatureDisponibili?.length || 1) ? stepIndex : currentIndexOnFocus;
      } else if (action.set !== undefined) {
        return action.set;
      }
      return 0;
    },
    0,
  );

  useEffect(() => changeLegaturaOnFocus({ set: 0 }), [isOpen]);

  useEffect(() => {
    if (indexLegaturaOnFocus !== -1) {
      setEventsAreHighlighted(false);
      setFocusOnKeyboard(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexLegaturaOnFocus]);

  // DEBT
  useEffect(() => {
    if (isOpen) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (keyboardNavigationContext.current === "blocking-operation") {
          return;
        }
        if (event.location === 0 && event.key === "ArrowDown" && !eventsAreHighlighted) {
          changeLegaturaOnFocus({ direction: 1 });
        } else if (event.location === 0 && event.key === "ArrowUp" && !eventsAreHighlighted) {
          changeLegaturaOnFocus({ direction: -1 });
        } else if (event.key === "Tab") {
          event.preventDefault();
          if (!eventsAreHighlighted) {
            setEventsAreHighlighted(true);
            changeLegaturaOnFocus({ set: -1 });
            setFocusOnKeyboard(false);
          }
        } else if (event.key === "+" && eventsAreHighlighted) {
          setEventsAreHighlighted(false);
          changeLegaturaOnFocus({ set: 0 });
          setFocusOnKeyboard(true);
        }
        if (event.key === "+" && !eventsAreHighlighted) {
          changeLegaturaOnFocus({ set: 0 });
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [
    eventsAreHighlighted,
    setEventsAreHighlighted,
    changeLegaturaOnFocus,
    isOpen,
    focusOnKeyboard,
    setFocusOnKeyboard,
    keyboardNavigationContext,
  ]);

  useEffect(() => {
    let isNot5DecimalsMultiple = undefined !== legature?.find((l) => l.errors && l.errors.isNot5DecimalsMultiple);
    let isGreaterThan20 = undefined !== legature?.find((l) => l.errors && l.errors.isGreaterThan20);
    let winIsGreaterThan10k = undefined !== legature?.find((l) => l.errors && l.errors.winIsGreaterThan10k);
    if (sistemaBetisLessThan2) {
      winIsGreaterThan10k = false;
      isGreaterThan20 = false;
    }
    if (isCombinazioniMinimeErr && sistemaBetisLessThan2 === false) {
      winIsGreaterThan10k = false;
      isGreaterThan20 = false;
    }

    if (
      isNot5DecimalsMultiple ||
      isGreaterThan20 ||
      winIsGreaterThan10k ||
      isCombinazioniMinimeErr ||
      sistemaBetisLessThan2
    ) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setValidate({
      isGreaterThan20,
      isNot5DecimalsMultiple,
      winIsGreaterThan10k,
      isCombinazioniMinimeErr,
      sistemaBetisLessThan2,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legature, legatureDisponibili, sistemaBetisLessThan2]);

  // DEBT
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (event.key === "Escape" && keyboardNavigationContext.current !== "dialog-recupera-biglietto") {
        if (isOpen) {
          switchSviluppoSistema();
          setErrorCombinationPrint("");
        }
        onStateChange({
          type: "0",
          subtype: { type: "inattivo" },
          text: "",
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });
  const onCloseSviluppo = () => {
    switchSviluppoSistema();
    setErrorCombinationPrint("");
  };

  return (
    <>
      {isOpen && (
        <StyledSviluppoSistema>
          <StyledSviluppoSistemaHeader>
            <div>
              <p className={"title"}>Sviluppa sistema</p>
              <p className={"subtitle"}>Inserisci l’importo di puntata per le combinazioni desiderate</p>
            </div>
            <div>
              <button
                disabled={totalBetSviluppo <= 0 || isError === true}
                className={"btn"}
                onClick={() => {
                  venditaSistema({ isPreview: true });
                  keyboardNavigationContext.current = "cart";
                }}
              >
                Stampa Anteprima
              </button>
              <button className={"back"} onClick={() => onCloseSviluppo()}>
                <BackArrow />
              </button>
            </div>
            {validate.isNot5DecimalsMultiple && (
              <AlertWrapping>
                <CustomizeAlertBox>
                  <AlertBox
                    alertType="error"
                    message={{
                      text: (
                        <FormattedMessage
                          description="error message importo base sistema"
                          defaultMessage="L'importo inserito non è multiplo dell'unità base (0,05€) "
                        />
                      ),
                    }}
                  />
                </CustomizeAlertBox>
              </AlertWrapping>
            )}
            {validate.isCombinazioniMinimeErr && (
              <AlertWrapping>
                <CustomizeAlertBox>
                  <AlertBox
                    alertType="error"
                    message={{
                      text: (
                        <FormattedMessage
                          description="error message combinazioni minime sistema"
                          defaultMessage="Numero combinazioni minime (2) non rispettate per la giocata sistemistica "
                        />
                      ),
                    }}
                  />
                </CustomizeAlertBox>
              </AlertWrapping>
            )}
            {validate.isGreaterThan20 && (
              <AlertWrapping>
                <CustomizeAlertBox>
                  <AlertBox
                    alertType="error"
                    message={{
                      text: (
                        <FormattedMessage
                          description="error message max bet legatura"
                          defaultMessage="L'importo della scommessa è superiore al limite consentito (€20,00)"
                        />
                      ),
                    }}
                  />
                </CustomizeAlertBox>
              </AlertWrapping>
            )}
            {validate.winIsGreaterThan10k && (
              <AlertWrapping>
                <CustomizeAlertBox>
                  <AlertBox
                    alertType="error"
                    message={{
                      text: (
                        <FormattedMessage
                          description="error message max win legatura"
                          defaultMessage="Vincita massima per combinazione superiore al limite consentito di 10.000€. Modifica la puntata"
                        />
                      ),
                    }}
                  />
                </CustomizeAlertBox>
              </AlertWrapping>
            )}
            {validate.isGreaterThan50k && (
              <AlertWrapping>
                <CustomizeAlertBox>
                  <AlertBox
                    alertType="error"
                    message={{
                      text: (
                        <FormattedMessage
                          description="error message max win sviluppo sistema"
                          defaultMessage="Vincita massima del sistema superiore al limite consentito di 50.000€. Modifica il pronostico o la puntata"
                        />
                      ),
                    }}
                  />
                </CustomizeAlertBox>
              </AlertWrapping>
            )}
            {validate.sistemaBetisLessThan2 && (
              <AlertWrapping>
                <CustomizeAlertBox>
                  <AlertBox
                    alertType="error"
                    message={{
                      text: (
                        <FormattedMessage
                          description="error message min bet sviluppo sistema"
                          defaultMessage="Importo minimo non rispettato per la giocata sistemica (€2,00)"
                        />
                      ),
                    }}
                  />
                </CustomizeAlertBox>
              </AlertWrapping>
            )}
          </StyledSviluppoSistemaHeader>
          <StyledSviluppoSistemaBody>
            <StyledSviluppoSistemaBodyHead>
              <StyledSviluppoColumn>
                <p className={"title"}>Legature</p>
                <p className={"subtitle"}>del sistema</p>
              </StyledSviluppoColumn>
              <StyledSviluppoColumn>
                <p className={"title"}>Combinazioni</p>
                <p className={"subtitle"}>totali</p>
              </StyledSviluppoColumn>
              <StyledSviluppoColumn>
                <p className={"title"}>Vincita Min - Max</p>
                <p className={"subtitle"}>per combinazione</p>
              </StyledSviluppoColumn>
              <StyledSviluppoColumn>
                <p className={"title"}>Costo Totale</p>
                <p className={"subtitle"}>per combinazione</p>
              </StyledSviluppoColumn>
              <StyledSviluppoColumn>
                <p className={"title"}>Puntata</p>
                <p className={"subtitle"}>totale</p>
              </StyledSviluppoColumn>
            </StyledSviluppoSistemaBodyHead>
            <StyledSviluppoSistemaBodyContainer className={warningIsVisible ? "reduce" : ""}>
              {legature &&
                legatureDisponibili &&
                legatureDisponibili.map((legatura, ordinale) => {
                  const indexToShow = legature.indexOf(
                    legature.find((l) => l.indice === legatura.indice) || legature[0],
                  );
                  return (
                    <React.Fragment key={indexToShow}>
                      <LegatureSviluppoSistema
                        ordinale={ordinale}
                        focusOnKeyboard={focusOnKeyboard}
                        setFocusOnKeyboard={setFocusOnKeyboard}
                        key={indexToShow}
                        legatura={legatura}
                        legature={legature}
                        indexToShow={indexToShow}
                        hasErrors={hasErrors}
                        indexLegaturaOnFocus={indexLegaturaOnFocus}
                        updateBetLegatura={updateBetLegatura}
                        updateErrorsLegatura={updateErrorsLegatura}
                        changeLegaturaOnFocus={changeLegaturaOnFocus}
                        visibleParam={true}
                        totalBetSviluppo={totalBetSviluppo}
                      />
                    </React.Fragment>
                  );
                })}
            </StyledSviluppoSistemaBodyContainer>

            {warningIsVisible && (
              <WarningDropdownSistema
                alertType="systemWarnings"
                message={{
                  text:
                    "Sviluppi non giocabili per superamento della vincita massima e/o del numero massimo di combinazioni",
                }}
                legatureToShow={legatureToShow}
                legature={legature}
                hasErrors={hasErrors}
                indexLegaturaOnFocus={indexLegaturaOnFocus}
                updateBetLegatura={updateBetLegatura}
                updateErrorsLegatura={updateErrorsLegatura}
                changeLegaturaOnFocus={changeLegaturaOnFocus}
              />
            )}
          </StyledSviluppoSistemaBody>
        </StyledSviluppoSistema>
      )}
    </>
  );
};

const AlertWrapping = styled.div`
  position: absolute;
  width: 50%;
  height: 50px;
`;
const StyledSviluppoSistema = styled.div`
  position: absolute;
  width: calc(100vw - 848px);
  height: 100%;
  right: calc(100% - 2px);
  top: 0;
  border-radius: 4px 0 0 4px;
  background-color: #333;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
`;
const CustomizeAlertBox = styled.div`
  top: 90px;
  width: 700px;
  position: relative;
  // position: absolute;
  // width: 1037px;
  right: 14px;
  height: 100%;
  font-family: Roboto Medium;
`;
const StyledSviluppoSistemaHeader = styled.header`
  padding-left: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  height: 70px;
  p {
    &.title {
      color: #aac21f;
      font-family: Mulish, sans-serif;
      font-size: 23px;
      font-weight: 800;
      margin: 0;
      margin-top: 6px;
    }
    &.subtitle {
      color: #ffffff;
      font-family: Mulish, sans-serif;
      font-size: 17px;
      font-weight: 800;
      margin: 0;
    }
  }

  button {
    float: left;
    box-shadow: none;
    background-color: transparent;
    cursor: pointer;
    &:focus {
      outline: 0;
    }
    &.btn {
      height: 40px;
      width: 210px;
      border: 2px solid #ffffff;
      color: #ffffff;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 800;

      &:disabled {
        border: 2px solid #979797;
        color: #979797;
        cursor: default;
      }
    }
    &.back {
      width: 40px;
      height: 40px;
      margin-left: 10px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 20px;

      &:hover {
        background-color: #fff;
        svg g {
          stroke: #333333;
        }
      }
    }
  }
`;

const StyledSviluppoSistemaBody = styled.div`
  background-color: #ffffff;
  width: 100%;
  margin-top: 30px;
  height: calc(100% - 100px);
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
`;

const StyledSviluppoSistemaBodyHead = styled.div`
  display: inline-flex;
  flex-direction: row;
  background-color: #f4f4f4;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;

  > div:nth-child(5) {
    display: flex;
    flex-direction: column;
    p {
      width: 60%;
      text-align: right;
    }
  }
`;

const StyledSviluppoSistemaBodyContainer = styled.div`
  max-height: 90%;
  position: relative;
  padding-left: 2rem;
  left: -2rem;
  width: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  &.reduce {
    max-height: 565px;
  }
`;

const StyledSviluppoColumn = styled.div`
  font-size: 20px;
  font-weight: 400;
  box-sizing: border-box;

  &.error {
    border-color: red;
    border-width: 44px;
    background-color: red;
  }

  .bolder {
    font-weight: 700;
    margin-right: 5px;
  }
  .combinations {
    display: inline-block;
    font-size: 18px;
    background-color: #f4f4f4;
    border-radius: 25px;
    min-width: 72px;
    text-align: center;
  }
  .minWin {
    margin-right: 19px;
  }
  &:nth-child(1) {
    flex: 0 0 130px;
    padding: 0 20px;
  }
  &:nth-child(2) {
    flex: 0 0 calc(100% - 820px);
  }
  &:nth-child(3) {
    flex: 0 0 203px;
    padding-right: 20px;
    margin-left: 90px;
    justify-content: right;
    text-align: right;
  }
  &:nth-child(4) {
    flex: 0 0 120px;
    margin-left: 25px;
    justify-content: right;
    text-align: right;
  }
  &:nth-child(5) {
    flex: 0 0 282px;
    padding: 0 -5px;
  }
  p {
    &.title {
      font-family: Roboto, sans-serif;
      font-size: 18px;
      font-weight: 700;
      margin: 0;
    }
    &.subtitle {
      font-family: Roboto, sans-serif;
      font-size: 15px;
      font-weight: 400;
      margin: 0;
    }
  }
`;
