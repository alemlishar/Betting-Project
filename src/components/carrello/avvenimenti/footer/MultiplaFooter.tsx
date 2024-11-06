import React, { useCallback, useContext, useEffect } from "react";
import { CartErrorsType, EventoType, ImpostazioniScommessaType, toPronosticoType } from "src/types/carrello.types";
import { parseAsMoney } from "src/helpers/format-data";
import { AlertBox } from "../../../common/alert-box/AlertBox";
import { BonusMultipla } from "./bonus-multipla/BonusMultipla";
import styled from "styled-components/macro";
import { Puntata } from "../../puntata/Puntata";
import { VenditaOptionalParameters } from "../../../../types/vendita.types";
import { CreaPrecompilataRequest } from "src/components/dialog-biglietto/precompilataTypes";
import { Toast } from "src/components/common/toast-message/Toast";
import { Pronostico } from "src/types/sistemi.types";
import { createPrecompilata } from "src/components/dialog-biglietto/ticket-api";
import { FormattedMessage } from "react-intl";
import { formatNumberWithoutRounding } from "src/helpers/formatUtils";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";

export function MultiplaFooter({
  bet,
  setBet,
  potentialWinning,
  bonusMultipla,
  calculateBonusMultipla,
  totQuote,
  selectedEvents,
  validate,
  setValidate,
  updateClientEvents,
  isPuntataMultiplaHighlighted,
  setIsPuntataMultiplaHighlighted,
  venditaMultipla,
  isMultiplaActive,
  setSogliaSuperato,
  bonusQuotaMinima,
  numMinEsitiBonusMultipla,
  impostazioni,
  pushToast,
}: {
  pushToast(content: React.ReactNode, duration: number): void;
  bet: number;
  setBet: (bet: number, activeClientIndex: number) => void;
  numMinEsitiBonusMultipla: number;
  potentialWinning: number;
  bonusMultipla: number;
  bonusQuotaMinima: number;
  calculateBonusMultipla: (b: number, n: number, e: boolean, s: number, q: number) => void;
  totQuote: number;
  selectedEvents: Array<EventoType>;
  validate: CartErrorsType;
  setValidate: (e: CartErrorsType) => void;
  updateClientEvents: (events: Array<EventoType>) => void;
  isPuntataMultiplaHighlighted: boolean;
  setIsPuntataMultiplaHighlighted: (p: boolean) => void;
  venditaMultipla: (params?: VenditaOptionalParameters) => void;
  isMultiplaActive: boolean;
  setSogliaSuperato: (a: boolean) => void;
  impostazioni?: Array<ImpostazioniScommessaType> | undefined;
}) {
  const { config, maxThresholdValue, multipleBetConfig } = useContext(GlobalStateContext);

  const calculateNoClosedSuspendedEvents: Array<EventoType> = selectedEvents.filter((e) => {
    return e.esiti[0].stato !== undefined && e.esiti[0].stato === 1;
  });
  const updateErrors = useCallback(
    (e: CartErrorsType) => {
      setValidate({ ...validate, ...e });
    },
    [setValidate, validate],
  );

  const expirationDate = selectedEvents.reduce((a, b) => (a.dataAvvenimento > b.dataAvvenimento ? a : b))
    .dataAvvenimento;
  const esitoList = selectedEvents.flatMap((evento) => evento.esiti);
  const pronosticoList = esitoList.map((event) => {
    return toPronosticoType(event);
  });
  const precompilata: CreaPrecompilataRequest = {
    writeBookingRequest: {
      prenotazione: {
        bigliettoSportExtList: [
          {
            bonus: {
              importo: Number((bet * 100).toFixed(0)),
              numeroMinimoAvvenimenti: numMinEsitiBonusMultipla,
              quotaMinEsito: bonusQuotaMinima,
              tipo: 0,
            },
            codiceLoyalty: "",
            idVoucher: "",
            importoVendita: Number((bet * 100).toFixed(0)),
            importoVincita: Number((potentialWinning * 100).toFixed(0)),
            listPronostico: pronosticoList,
            impostazioniVariazioneImporto: 0,
            impostazioniVariazioniQuote: impostazioni ? impostazioni[0]?.share : 0,
            listaScommesse: [],
          },
        ],

        bigliettoSportSistemaList: [],
      },
      expirationDate: expirationDate,
    },
    ticketType: "ACCUMULATOR",
  };

  async function fetchPrecompilata() {
    switch (await createPrecompilata(precompilata)) {
      case "OK": {
        pushToast(
          <Toast
            type="success"
            heading={"Creazione Precompilata andata a buon fine"}
            description={"Nesun importo da risquotere"}
          />,
          5000,
        );
        updateClientEvents([]);
        break;
      }
      case "KO": {
        pushToast(
          <Toast type={"danger"} heading={"Creazione precompilata non è andato a buon fine"} description={""} />,
          5000,
        );
        break;
      }
    }
  }

  const checkLiveEvents = (events: Array<EventoType>) => {
    return events.some((event) => event.live);
  };

  //Render Footer Error: win is greater than 10K
  useEffect(() => {
    const multiplaWinIsGreaterThan10k = potentialWinning >= 10000;

    if (validate.multiplaWinIsGreaterThan10k !== multiplaWinIsGreaterThan10k) {
      updateErrors({ multiplaWinIsGreaterThan10k });
    }
  }, [potentialWinning, updateErrors, validate.multiplaWinIsGreaterThan10k]);

  //Render Footer Error: bet is greater than user config
  useEffect(() => {
    const betMultiplaIsGreaterThanUserMax =
      config && config.CONI && config.CONI.maxCostTicket ? bet > config.CONI.maxCostTicket : false;
    if (validate.betMultiplaIsGreaterThanUserMax !== betMultiplaIsGreaterThanUserMax) {
      updateErrors({ betMultiplaIsGreaterThanUserMax });
    }
  }, [bet, config, potentialWinning, updateErrors, validate.betMultiplaIsGreaterThanUserMax]);

  //Render Footer Error: win is greater than threshold value
  useEffect(() => {
    if (!validate.multiplaWinIsGreaterThan10k) {
      const sogliaAntiriciclaggioValidation = maxThresholdValue ? bet >= maxThresholdValue : false;
      if (validate.sogliaAntiriciclaggioValidation !== sogliaAntiriciclaggioValidation) {
        updateErrors({ sogliaAntiriciclaggioValidation });
      }
    }
  }, [
    bet,
    maxThresholdValue,
    potentialWinning,
    updateErrors,
    validate.multiplaWinIsGreaterThan10k,
    validate.sogliaAntiriciclaggioValidation,
  ]);

  //Render Footer Error: bet is less than 2
  useEffect(() => {
    const multiplaBetIsLessThan2 = bet < (multipleBetConfig?.importoMinimo || 2);
    if (validate.multiplaBetIsLessThan2 !== multiplaBetIsLessThan2) {
      updateErrors({ multiplaBetIsLessThan2 });
    }
  }, [bet, multipleBetConfig?.importoMinimo, updateErrors, validate.multiplaBetIsLessThan2]);

  return (
    <>
      <MultiplaFooterWrapper>
        <StyledRecapFooter
          className={
            selectedEvents.length !== calculateNoClosedSuspendedEvents.length
              ? "has-Closed-Suspended"
              : "no-Closed-Suspended"
          }
        >
          <StyledQuoteRow>
            <BonusMultipla
              bonusMultipla={bonusMultipla}
              calculateBonusMultipla={calculateBonusMultipla}
              selectedEvents={selectedEvents}
            />
            <StyledTotalQuote data-qa={`carrello-quotatot`}>
              <FormattedMessage
                description="Multipla footer button label 'quota totale'"
                defaultMessage="Quota totale"
              />
              <StyledBonusQuoteAmount>({formatNumberWithoutRounding(totQuote, ".")})</StyledBonusQuoteAmount>
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
            <Puntata
              hasErrors={validate.multiplaWinIsGreaterThan10k || validate.multiplaBetIsLessThan2 || false}
              updateErrors={updateErrors}
              bet={bet}
              updateBetMultipla={setBet}
              step={multipleBetConfig?.importoBase || 1}
              maxBet={99999}
              minBet={multipleBetConfig?.importoMinimo || 2}
              isOnFocus={isPuntataMultiplaHighlighted}
              setIsPuntataMultiplaHighlighted={setIsPuntataMultiplaHighlighted}
              isMultiplaActive={isMultiplaActive}
            />
          </StyledPuntata>
          <StyledPotentialWinRow>
            <FormattedMessage
              description="Multipla footer button label 'vincita potenziale'"
              defaultMessage="Vincita potenziale"
            />
            <StyledPotentialWinAmount
              data-qa="carrello-vincita-potenziale"
              className={
                validate.multiplaWinIsGreaterThan10k || validate.multiplaBetIsLessThan2 || false ? "error" : ""
              }
            >
              {parseAsMoney(potentialWinning)}
            </StyledPotentialWinAmount>
          </StyledPotentialWinRow>
          {selectedEvents.length !== calculateNoClosedSuspendedEvents.length ? (
            <StyledButtonsContainer>
              <Button className={"transparent"} onClick={() => updateClientEvents(calculateNoClosedSuspendedEvents)}>
                <FormattedMessage
                  description="Multipla footer button label 'rimuovi esiti chiusi/sospesi'"
                  defaultMessage="Rimuovi esiti chiusi/sospesi"
                />
              </Button>
              <Button
                data-qa="carrello-vendi"
                disabled={
                  validate.multiplaWinIsGreaterThan10k ||
                  validate.multiplaBetIsLessThan2 ||
                  validate.betMultiplaIsGreaterThanUserMax
                }
                onClick={() => {
                  if (validate.sogliaAntiriciclaggioValidation) {
                    setSogliaSuperato(true);
                  } else {
                    venditaMultipla();
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
                    <button
                      disabled={
                        validate.multiplaWinIsGreaterThan10k ||
                        validate.multiplaBetIsLessThan2 ||
                        validate.betMultiplaIsGreaterThanUserMax ||
                        checkLiveEvents(selectedEvents)
                      }
                      className={"transparent"}
                      onClick={fetchPrecompilata}
                    >
                      <FormattedMessage
                        description="Multipla footer button label 'Crea Precompilata'"
                        defaultMessage="Crea precompilata"
                      />
                    </button>
                    <button
                      data-qa="carrello-vendi"
                      disabled={
                        validate.multiplaWinIsGreaterThan10k ||
                        validate.multiplaBetIsLessThan2 ||
                        validate.betMultiplaIsGreaterThanUserMax
                      }
                      className={"full"}
                      onClick={() => {
                        if (validate.sogliaAntiriciclaggioValidation) {
                          setSogliaSuperato(true);
                        } else {
                          venditaMultipla();
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
          {validate.multiplaWinIsGreaterThan10k && (
            <CustomizeAlertBox>
              <AlertBox
                alertType="error"
                message={{
                  text: (
                    <FormattedMessage
                      description="error message max win multipla"
                      defaultMessage="La vincita potenziale è superiore al limite consentito (€10.000,00). Modifica il pronostico o la puntata"
                    />
                  ),
                }}
              />
            </CustomizeAlertBox>
          )}
          {validate.multiplaBetIsLessThan2 && (
            <CustomizeAlertBox>
              <AlertBox
                alertType="error"
                message={{
                  text: (
                    <FormattedMessage
                      description="error message min bet multipla"
                      defaultMessage="L'importo della scommessa è inferiore alla giocata minima (€2)"
                    />
                  ),
                }}
              />
            </CustomizeAlertBox>
          )}
          {validate.betMultiplaIsGreaterThanUserMax && (
            <CustomizeAlertBox>
              <AlertBox
                alertType="error"
                message={{
                  text: (
                    <FormattedMessage
                      description="error message max user bet multipla"
                      defaultMessage="Hai superato il tuo massimale di vendita pari a {amount} per singolo biglietto. Contatta il tuo responsabile."
                      values={{
                        amount: parseAsMoney(
                          config && config.CONI && config.CONI.maxCostTicket ? config.CONI.maxCostTicket : 1000,
                        ),
                      }}
                    />
                  ),
                }}
                customStyle={{ fontSize: "16px" }}
              />
            </CustomizeAlertBox>
          )}
          {validate.sogliaAntiriciclaggioValidation &&
            !validate.betMultiplaIsGreaterThanUserMax &&
            !validate.winIsGreaterThan10k && (
              <CustomizeAlertBox>
                <AlertBox
                  alertType="warning"
                  message={{
                    text: (
                      <FormattedMessage
                        description="error message bet antiriciclaggio"
                        defaultMessage="L'importo di puntata supera la soglia antiriciclaggio."
                      />
                    ),
                  }}
                  customStyle={{ fontSize: "16px" }}
                />
              </CustomizeAlertBox>
            )}
        </StyledRecapFooter>
      </MultiplaFooterWrapper>
    </>
  );
}

// DEBT
const MultiplaFooterWrapper = styled.div`
  /* box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.21);*/
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
    width: 240px;
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
  div {
    display: flex;
    padding: -20px;
  }
  &.has-Closed-Suspended {
    margin-bottom: 60px;
  }
  &.no-Closed-Suspended {
    margin-bottom: 60px;
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
    font-size: 15px;
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
