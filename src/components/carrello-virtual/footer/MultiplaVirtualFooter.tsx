import { useContext, useMemo } from "react";
import { parseAsMoney } from "src/helpers/format-data";
import styled from "styled-components/macro";
import { FormattedMessage } from "react-intl";
import { ConfigToEvaluateFormat, decimalToInteger, formattedQuota } from "src/helpers/formatUtils";
import { useVirtualUpdateClientsContext } from "src/components/common/context-clients/VirtualClientsContext";
import { PuntataVirtual } from "src/components/carrello-virtual/footer/PuntataMultiplaVirtual";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { AlertBox } from "src/components/common/alert-box/AlertBox";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";
import { VirtualEventType } from "src/types/carrello.types";

export function MultiplaVirtualFooter({
  openEvents,
  setSogliaSuperata,
}: {
  openEvents: VirtualEventType[];
  setSogliaSuperata: (a: boolean) => void;
}) {
  const globalContext = useContext(GlobalStateContext);

  const virtualCartClientsContext = useVirtualUpdateClientsContext();
  const currentVirtualClient = virtualCartClientsContext.activeVirtualClient;
  const activeClientIndex = virtualCartClientsContext.activeClientIndex;
  const multiplaFooterVirtualState = virtualCartClientsContext.multiplaFooterVirtualState;
  const activeMultiplaVirtualState = useMemo(() => {
    return multiplaFooterVirtualState[activeClientIndex];
  }, [activeClientIndex, multiplaFooterVirtualState]);
  const selectedEvents = currentVirtualClient.selectedEvents;
  const validateForm = useMemo(() => {
    if (
      globalContext.multipleVirtualBetConfig &&
      globalContext.maxVirtualThresholdValue &&
      globalContext.configVirtual
    ) {
      if (activeMultiplaVirtualState.bet < globalContext.multipleVirtualBetConfig?.importoMinimo * 100) {
        return "ERROR_IMPORTO_MINIMO";
      } else if (activeMultiplaVirtualState.bet % (globalContext.multipleVirtualBetConfig?.importoBase * 100) !== 0) {
        return "ERROR_IMPORTO_BASE";
      } else if (activeMultiplaVirtualState.bet > globalContext.configVirtual.VIR.maxCostTicket * 100) {
        return "ERROR_BET_MAX";
      } else if (
        decimalToIntegerValue(activeMultiplaVirtualState.vincitaMassima) >
        globalContext.configVirtual.VIR.maxVincTicket * 100
      ) {
        return "ERROR_MAX_WIN";
      } else if (decimalToIntegerValue(activeMultiplaVirtualState.bet) >= globalContext.maxVirtualThresholdValue) {
        return "ERROR_THRESHOLD";
      }
    }
  }, [
    activeMultiplaVirtualState.bet,
    activeMultiplaVirtualState.vincitaMassima,
    globalContext.configVirtual,
    globalContext.maxVirtualThresholdValue,
    globalContext.multipleVirtualBetConfig,
  ]);

  const isButtonVendiDisable = useMemo(() => {
    return (
      (validateForm !== undefined && validateForm !== "ERROR_THRESHOLD") || selectedEvents.length !== openEvents.length
    );
  }, [openEvents.length, selectedEvents.length, validateForm]);

  return (
    <>
      <MultiplaFooterWrapper>
        <StyledRecapFooter>
          <StyledQuoteRow>
            <StyledBonusMultipla>
              {activeMultiplaVirtualState.bonusEuroValue !== "0" && (
                <div>
                  <FormattedMessage
                    description="Multipla footer label 'bonus multipla'"
                    defaultMessage="Bonus multipla"
                  />
                  <div data-qa="carrello-bonus-quota">({decimalToInteger(activeMultiplaVirtualState.bonusPerc)})</div>
                  <div data-qa="carrello-bonus-importo">
                    {formatCurrency(decimalToIntegerValue(activeMultiplaVirtualState.bonusEuroValue))}
                  </div>
                </div>
              )}
            </StyledBonusMultipla>
            <StyledTotalQuote data-qa={`carrello-quotatot`}>
              <FormattedMessage
                description="Multipla footer button label 'quota totale'"
                defaultMessage="Quota totale"
              />
              <StyledBonusQuoteAmount>
                ({formattedQuota(activeMultiplaVirtualState.quotaTotale)})
              </StyledBonusQuoteAmount>
            </StyledTotalQuote>
          </StyledQuoteRow>
          <StyledPuntata>
            <StyledPuntataResult>
              <p>
                <FormattedMessage description="Multipla footer button label 'puntata'" defaultMessage="Puntata" />
              </p>
              <StyledBuonoGioco>
                <FormattedMessage
                  description="Multipla footer button label 'buono gioco'"
                  defaultMessage="Buono gioco"
                />
              </StyledBuonoGioco>
            </StyledPuntataResult>
            <PuntataVirtual />
          </StyledPuntata>
          <StyledPotentialWinRow>
            <FormattedMessage
              description="Multipla footer button label 'vincita potenziale'"
              defaultMessage="Vincita potenziale"
            />
            <StyledPotentialWinAmount
              data-qa="carrello-vincita-potenziale"
              className={
                // validate.multiplaWinIsGreaterThan10k || validate.multiplaBetIsLessThan2 || false ? "error" :
                ""
              }
            >
              {formatCurrency(decimalToIntegerValue(activeMultiplaVirtualState.vincitaMassima))}
            </StyledPotentialWinAmount>
          </StyledPotentialWinRow>
          {selectedEvents.length !== openEvents.length ? (
            <StyledButtonsContainer>
              <Button
                className={"transparent"}
                onClick={() => virtualCartClientsContext.updateVirtualClientEvents(openEvents)}
              >
                <FormattedMessage
                  description="Multipla footer button label 'elimina esiti chiusi'"
                  defaultMessage="Elimina esiti chiusi"
                />
              </Button>
              <Button
                data-qa="carrello-vendi"
                disabled={isButtonVendiDisable}
                onClick={() => {
                  if (validateForm === "ERROR_THRESHOLD") {
                    setSogliaSuperata(true);
                  } else {
                    virtualCartClientsContext.sellingVirtual();
                  }
                }}
              >
                <FormattedMessage description="Multipla footer button label 'vendi'" defaultMessage="Vendi" />
                <div>
                  <p className={"shortcut"}>
                    <FormattedMessage
                      description="Multipla footer button label shortcut in 'vendi'"
                      defaultMessage="CTRL invio"
                    />
                  </p>
                </div>
              </Button>
            </StyledButtonsContainer>
          ) : (
            <>
              {
                <StyledButtonsContainer>
                  <MultiplaFooterActions>
                    {/* <button
                      disabled={validateForm !== undefined && validateForm !== "ERROR_THRESHOLD"}
                      // className={"transparent"}
                      // onClick={fetchPrecompilata}
                    >
                      <FormattedMessage
                        description="Multipla footer button label 'Crea Precompilata'"
                        defaultMessage="Crea precompilata"
                      />
                    </button> */}
                    <button
                      data-qa="carrello-vendi"
                      disabled={validateForm !== undefined && validateForm !== "ERROR_THRESHOLD"}
                      className={"full"}
                      onClick={() => {
                        if (validateForm === "ERROR_THRESHOLD") {
                          setSogliaSuperata(true);
                        } else {
                          virtualCartClientsContext.sellingVirtual();
                        }
                      }}
                    >
                      <FormattedMessage description="Multipla footer button label 'vendi'" defaultMessage="Vendi" />
                      <div>
                        <p className={"shortcut"}>
                          <FormattedMessage
                            description="Multipla footer button label shortcut in 'vendi'"
                            defaultMessage="CTRL invio"
                          />
                        </p>
                      </div>
                    </button>
                  </MultiplaFooterActions>
                </StyledButtonsContainer>
              }
            </>
          )}
          <StyledFooterMultiplaError>
            {validateForm === "ERROR_MAX_WIN" && (
              <CustomizeAlertBox>
                <AlertBox
                  alertType="error"
                  message={{
                    text: (
                      <FormattedMessage
                        description="Error limite vincita massima'"
                        defaultMessage="La vincita potenziale è superiore al limite consentito (€10.000,00). Modifica il pronostico o la puntata"
                      />
                    ),
                  }}
                />
              </CustomizeAlertBox>
            )}

            {validateForm === "ERROR_IMPORTO_MINIMO" && (
              <CustomizeAlertBox>
                <AlertBox
                  alertType="error"
                  message={{
                    text: (
                      <FormattedMessage
                        description="Error limite minimo giocata'"
                        defaultMessage="L'importo della scommessa è inferiore alla giocata minima (€1)"
                      />
                    ),
                  }}
                />
              </CustomizeAlertBox>
            )}

            {validateForm === "ERROR_BET_MAX" && (
              <CustomizeAlertBox>
                <AlertBox
                  alertType="error"
                  message={{
                    text: (
                      <FormattedMessage
                        description="Error limite massimale operatore'"
                        defaultMessage="Hai superato il tuo massimale di vendita pari a {value} per singolo biglietto. Contatta il tuo responsabile."
                        values={{
                          value: parseAsMoney(
                            globalContext &&
                              globalContext.configVirtual &&
                              globalContext.configVirtual.VIR.maxCostTicket
                              ? globalContext.configVirtual.VIR.maxCostTicket
                              : 1000,
                          ),
                        }}
                      />
                    ),
                  }}
                  customStyle={{ fontSize: "16px" }}
                />
              </CustomizeAlertBox>
            )}

            {validateForm === "ERROR_THRESHOLD" && (
              <CustomizeAlertBox>
                <AlertBox
                  alertType="warning"
                  message={{
                    text: (
                      <FormattedMessage
                        description="Warning limite antiriciclaggio'"
                        defaultMessage="L'importo di puntata supera la soglia antriciclaggio."
                      />
                    ),
                  }}
                  customStyle={{ fontSize: "16px" }}
                />
              </CustomizeAlertBox>
            )}
            {validateForm === "ERROR_IMPORTO_BASE" && (
              <CustomizeAlertBox>
                <AlertBox
                  alertType="error"
                  message={{
                    text: (
                      <FormattedMessage
                        description="Error importo base non rispettato"
                        defaultMessage="L'importo di puntata non rispetta l'importo base (€0,50)"
                      />
                    ),
                  }}
                  customStyle={{ fontSize: "16px" }}
                />
              </CustomizeAlertBox>
            )}
          </StyledFooterMultiplaError>
        </StyledRecapFooter>
      </MultiplaFooterWrapper>
    </>
  );
}
export type MultiplaFooterStateType = {
  bet: number;
  quotaTotale: ConfigToEvaluateFormat;
  vincitaMassima: ConfigToEvaluateFormat;
  bonusPerc: ConfigToEvaluateFormat;
  bonusEuroValue: string;
};

// DEBT
const MultiplaFooterWrapper = styled.div`
  /* box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.21);*/
`;
const StyledFooterMultiplaError = styled.div`
  position: absolute;
  bottom: 10px;
  width: 530px;
`;
const StyledBonusMultipla = styled.div`
  text-align: right;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: 100;
  display: flex;
  flex-wrap: nowrap;

  div {
    font-weight: 700;
    margin-left: 5px;
  }
`;
const CustomizeAlertBox = styled.div`
  height: 60px;
  position: relative;
  z-index: 1;
  bottom: -100px;
  width: 118%;
  left: -40px;
`;
const MultiplaFooterActions = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  width: 100%;

  button {
    // justify-content: space-between;
    cursor: pointer;
    //width: 240px;
    width: 100%;
    height: 40px;
    box-shadow: none;
    font-family: Mulish, sans-serif;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 0;
    border-width: 2px;
    border-style: solid;
    border-radius: 8px;
    background-color: #aac21f;
    border-color: #aac21f;
    color: white;
    flex-direction: row;
    text-align: center;
    justify-content: center;
    align-content: center;
    display: flex;
    align-items: center;

    .shortcut {
      max-height: 20px;
      background-color: #ffffff;
      color: #000000;
      font-family: Roboto, sans-serif;
      font-size: 13px;
      font-weight: bold;
      border-radius: 10px;
      // display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;
      padding: 0 8px;
      top: 833px;
      // position: absolute;
    }

    &.transparent {
      color: #222222;
      border-color: #222222;
      background-color: transparent;
      &:disabled {
        opacity: 50%;
        cursor: default;
      }
    }

    &:disabled {
      opacity: 50%;
      cursor: default;
    }
  }
`;

const StyledRecapFooter = styled.div`
  background-color: #f4f4f4;
  justify-content: space-evenly;
  margin-left: 20px;
  margin-top: 10px;
  max-width: 490px;
  padding: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  max-height: 120px;
  box-sizing: border-box;
  border-radius: 10px;
  margin-bottom: 60px;
  div {
    display: flex;
    padding: -20px;
  }
`;

const StyledQuoteRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: 100;
  width: 100%;
`;

const StyledTotalQuote = styled.div`
  text-align: right;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  display: flex;
  justify-content: flex-end;
  font-weight: 100;
`;

const StyledBonusQuoteAmount = styled.div`
  font-weight: 700;
  margin-left: 5px;
`;

const StyledPotentialWinRow = styled.div`
  position: absolute;
  font-size: 18px;
  font-family: Mulish;
  font-weight: 900;
`;

const StyledPotentialWinAmount = styled.div`
  font-size: 20px;
  display: inline-flex;
  float: right;
  min-width: 150px;
  max-width: 200px;
  left: 125px;
  position: relative;
  &.error {
    color: #ff0000;
  }
`;
const StyledButtonsContainer = styled.div`
  margin: 0 -20px;
`;
const Button = styled.button`
  cursor: pointer;
  font-family: Mulish;
  top: 40px;
  font-size: 18px;
  font-weight: 900;
  color: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #aac21f;
  text-align: center;
  height: 40px;
  bottom: -42px;
  width: 108.5%;
  border: #005936;
  margin-right: 10px;
  .shortcut {
    max-height: 20px;
    background-color: #ffffff;
    color: #000000;
    font-family: Roboto, sans-serif;
    font-size: 13px;
    font-weight: bold;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    padding: 0 8px;
  }
  &:last-child {
    margin-right: 0;
  }
  &:disabled {
    background-color: #aac21f;
    opacity: 50%;
    cursor: default;
  }
  &.transparent {
    font-family: Mulish;
    color: #222222;
    border-color: #222222;
    background-color: transparent;
    box-shadow: none;
    font-family: Mulish, sans-serif;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 0;
    border-width: 2px;
    border-style: solid;
    border-radius: 8px;
    width: 108.5%;
  }
`;

const StyledPuntata = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
`;

const StyledPuntataResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  > p {
    font-size: 18px;
    font-family: Mulish;
    font-weight: 900;
  }
`;

const StyledBuonoGioco = styled.div`
  border: 2px solid #222222;
  border-radius: 9px;
  width: 120px;
  height: 40px;
  justify-content: center;
  display: flex;
  align-items: center;
  font-size: 17px;
  margin-left: 10px;
  box-sizing: border-box;
`;
