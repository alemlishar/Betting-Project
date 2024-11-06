import React, { useContext, useEffect } from "react";
import styled from "styled-components/macro";
import { parseAsMoney } from "../../../../helpers/format-data";
import { ReactComponent as IcoDanger } from "../../../../assets/images/icon-danger.svg";
import {
  CartErrorsType,
  EsitoType,
  EventoType,
  ImpostazioniScommessaType,
  toPronosticoType,
} from "src/types/carrello.types";
import { VenditaOptionalParameters } from "../../../../types/vendita.types";
import { Toast } from "src/components/common/toast-message/Toast";
import { CreaPrecompilataRequest } from "src/components/dialog-biglietto/precompilataTypes";
import { GiocataSistemisticaSviluppataResponse } from "src/types/sistemi.types";
import { createPrecompilata } from "src/components/dialog-biglietto/ticket-api";
import { FormattedMessage } from "react-intl";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";

export const SistemaFooter = ({
  sviluppoSistemaOpen,
  bet,
  switchSviluppoSistema,
  sistemaFooterData,
  isValid,
  sistemaIntegrale,
  venditaSistema,
  giocataSistemisticaResponse,
  selectedEvents,
  updateClientEvents,
  updateIndexCarrello,
  validate,
  setValidate,
  setSogliaSuperato,
  isBetNull,
  impostazioni,
  pushToast,
}: {
  pushToast(content: React.ReactNode, duration: number): void;
  sviluppoSistemaOpen: boolean;
  bet: number;
  giocataSistemisticaResponse: GiocataSistemisticaSviluppataResponse;
  switchSviluppoSistema: () => void;
  sistemaFooterData: { minWinningAmount: number; maxWinningAmount: number } | undefined;
  isValid: boolean;
  sistemaIntegrale: boolean;
  venditaSistema: (params?: VenditaOptionalParameters) => void;
  selectedEvents: EventoType[];
  updateClientEvents: (events: EventoType[]) => void;
  updateIndexCarrello: (events: EventoType[]) => void;
  validate: CartErrorsType;
  setValidate: (e: CartErrorsType) => void;
  setSogliaSuperato: (a: boolean) => void;
  isBetNull: boolean;
  impostazioni?: Array<ImpostazioniScommessaType> | undefined;
}) => {
  const { config, maxThresholdValue, bonusConfig } = useContext(GlobalStateContext);
  const updateErrors = (e: CartErrorsType) => {
    setValidate({ ...validate, ...e });
  };

  const esitoList = selectedEvents.flatMap((evento) => evento.esiti);
  const pronosticoList = esitoList.map((event) => {
    return toPronosticoType(event);
  });
  const gruppiList = Object.values(giocataSistemisticaResponse.sviluppoByCardinalita).map((group) => ({
    numClasse: group.cardinalita,
    importo: group.importo,
    numCombinazioni: group.numeroSviluppi,
    flagBonusMultipla: group.bonusApplicato,
    vincitaMinima: group.vincitaMinima,
    vincitaMassima: group.vincitaMassima,
  }));

  const expirationDate = selectedEvents.reduce((a, b) => (a.dataAvvenimento > b.dataAvvenimento ? a : b))
    .dataAvvenimento;
  const precompilata: CreaPrecompilataRequest = {
    writeBookingRequest: {
      prenotazione: {
        bigliettoSportExtList: [],
        bigliettoSportSistemaList: [
          {
            bigliettoSport: {
              bonus: {
                importo: Number((bet * 100).toFixed(0)),
                numeroMinimoAvvenimenti: bonusConfig ? bonusConfig[0].minimumOutcomes : 0,
                quotaMinEsito: bonusConfig ? bonusConfig[0].minimumQuotaValue : 0,
                tipo: 0,
              },
              codiceLoyalty: "",
              idVoucher: "",
              importoVendita: Number((bet * 100).toFixed(0)),
              importoVincita: Number(((sistemaFooterData ? sistemaFooterData.minWinningAmount : 0) * 100).toFixed(0)),
              listPronostico: pronosticoList,
              impostazioniVariazioneImporto: 0,
              impostazioniVariazioniQuote: impostazioni ? impostazioni[0]?.share : 0,
              listaScommesse: [],
            },
            listaGruppiSistemaSport: {
              gruppi: gruppiList,
            },
          },
        ],
      },
      expirationDate: expirationDate,
    },
    ticketType: "SYSTEM",
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

  useEffect(() => {
    const sogliaAntiriciclaggioValidation = maxThresholdValue ? bet >= maxThresholdValue : false;
    if (validate.sogliaAntiriciclaggioValidation !== sogliaAntiriciclaggioValidation) {
      updateErrors({ sogliaAntiriciclaggioValidation });
    }
  }, [bet]);
  useEffect(() => {
    const betSistemaIsGreaterThanUserMax =
      config && config.CONI && config.CONI.maxCostTicket ? bet > config.CONI.maxCostTicket : false;
    if (validate.betSistemaIsGreaterThanUserMax !== betSistemaIsGreaterThanUserMax) {
      updateErrors({ betSistemaIsGreaterThanUserMax });
    }
  }, [bet]);
  const countClosedSuspendedEvents = () => {
    let closedSuspendedEventsCounter = 0;
    if (selectedEvents.length > 0) {
      selectedEvents.forEach((evento) => {
        evento.esiti.forEach((esito) => {
          if (esito.stato !== 1) {
            closedSuspendedEventsCounter = closedSuspendedEventsCounter + 1;
          }
        });
      });
    }
    return closedSuspendedEventsCounter;
  };

  const deleteEsitoChiusoSospeso = () => {
    let noDeletedEventi: Array<EventoType> = [];
    if (selectedEvents.length > 0) {
      selectedEvents.forEach((evento) => {
        let noDeletedEsiti: Array<EsitoType> = [];
        evento.esiti.forEach((esito) => {
          if (esito.stato === 1) {
            noDeletedEsiti.push(esito);
          }
        });
        evento.esiti = noDeletedEsiti;
      });
      selectedEvents.forEach((evento) => {
        if (evento.esiti.length > 0) {
          noDeletedEventi.push(evento);
        }
      });
      updateClientEvents(noDeletedEventi);
      updateIndexCarrello(noDeletedEventi);
    }
  };

  return (
    <SistemaFooterWrapper>
      <SistemaFooterInfo>
        {countClosedSuspendedEvents() === 0 && (
          <SistemaFooterButtonSviluppo onClick={switchSviluppoSistema}>
            <div>
              <p className={"label"} data-qa={`carrello-sviluppi-${sviluppoSistemaOpen ? "chiudi" : "apri"}`}>
                {sviluppoSistemaOpen ? (
                  <FormattedMessage
                    description="Sistema footer button label 'chiudi sviluppo sistema'"
                    defaultMessage="Chiudi sviluppo sistema"
                  />
                ) : (
                  <FormattedMessage
                    description="Sistema footer button label 'sviluppo sistema'"
                    defaultMessage="Sviluppa sistema"
                  />
                )}
              </p>
              <p className={"shortcut"}>
                {sviluppoSistemaOpen ? (
                  <FormattedMessage description="Sistema footer button label 'esci sviluppo'" defaultMessage="ESC" />
                ) : (
                  <FormattedMessage description="Sistema footer button label 'apri sviluppo'" defaultMessage="+" />
                )}
              </p>
            </div>
            <div className={"alert"}>
              {!sviluppoSistemaOpen && !isValid && (
                <CostumeAlert>
                  <IcoDanger />
                </CostumeAlert>
              )}
            </div>
          </SistemaFooterButtonSviluppo>
        )}
        {countClosedSuspendedEvents() > 0 && (
          <SistemaFooterButtonSviluppo onClick={deleteEsitoChiusoSospeso}>
            <div>
              <p className={"label"}>
                <FormattedMessage
                  description="Sistema footer button label 'rimuovi esiti chiusi/sospesi'"
                  defaultMessage="Rimuovi esiti chiusi/sospesi"
                />
              </p>
            </div>
          </SistemaFooterButtonSviluppo>
        )}
        <SistemaFooterInfoRow className={"bet"}>
          <div>
            <FormattedMessage description="Sistema footer button label 'puntata'" defaultMessage="Puntata" />
            <SistemaButtonBuonoSconto>
              <FormattedMessage description="Sistema footer button label 'buono gioco'" defaultMessage="Buono gioco" />
            </SistemaButtonBuonoSconto>
          </div>
          <p data-qa="carrello-puntata-totale-sistema">{parseAsMoney(bet)}</p>
        </SistemaFooterInfoRow>

        {!sistemaIntegrale && (
          <div>
            <SistemaFooterInfoRow>
              <div>
                <FormattedMessage
                  description="Sistema footer button label 'vincita potenziale minima'"
                  defaultMessage="Vincita potenziale minima"
                />
              </div>
              <p data-qa="carrello-vincita-potenziale-minima">
                {parseAsMoney(sistemaFooterData ? sistemaFooterData.minWinningAmount : 0)}
              </p>
            </SistemaFooterInfoRow>
            <SistemaFooterInfoRow>
              <div>
                <FormattedMessage
                  description="Sistema footer button label 'vincita potenziale massima'"
                  defaultMessage="Vincita potenziale massima"
                />
              </div>
              <p data-qa="carrello-vincita-potenziale-massima">
                {parseAsMoney(sistemaFooterData ? sistemaFooterData.maxWinningAmount : 0)}
              </p>
            </SistemaFooterInfoRow>
          </div>
        )}
      </SistemaFooterInfo>
      <SistemaFooterActions>
        <button
          data-qa="carrello-precompilata"
          onClick={fetchPrecompilata}
          disabled={!isValid || isBetNull || checkLiveEvents(selectedEvents)}
          className={"transparent"}
        >
          <FormattedMessage
            description="Sistema footer button label 'Crea Precompilata'"
            defaultMessage="Crea precompilata"
          />
        </button>
        <button
          data-qa="carrello-vendi-sistema"
          disabled={!isValid || isBetNull}
          onClick={() => {
            if (validate.sogliaAntiriciclaggioValidation) {
              setSogliaSuperato(true);
            } else {
              venditaSistema();
            }
          }}
        >
          <FormattedMessage description="Sistema footer button label 'vendi'" defaultMessage="Vendi" />
          <div>
            <p className={"shortcut"}>
              <FormattedMessage
                description="Sistema footer button label shortcut in 'vendi'"
                defaultMessage="CTRL invio"
              />
            </p>
          </div>
        </button>
      </SistemaFooterActions>
    </SistemaFooterWrapper>
  );
};

// DEBT
const SistemaFooterWrapper = styled.div`
  /* background-color: #ffffff;
  box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.21);*/
  padding: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const SistemaFooterInfo = styled.div`
  background-color: #f4f4f4;
  width: 100%;
  border-radius: 8px;
  padding-bottom: 5px;
  max-height: 160px;
`;

const CostumeAlert = styled.div`
  width: auto;
  padding: 4px;
  box-sizing: border-box;
  background-color: red;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  background-color: red;

  path {
    fill: #ffffff;
  }
  circle {
    stroke: #ffffff;
  }
`;

const SistemaFooterButtonSviluppo = styled.div`
  background-color: #aac21f;
  height: 40px;
  width: 100%;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: center;
  cursor: pointer;
  flex-direction: row;

  .alert {
    position: absolute;
    right: 26px;
  }
  div {
    display: flex;
    align-items: center;
    .label {
      color: #ffffff;
      font-family: Roboto, sans-serif;
      font-size: 17px;
      font-weight: bold;
    }

    .shortcut {
      height: 22px;
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
  }
`;

const SistemaFooterInfoRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  min-height: 30px;
  color: #000000;
  letter-spacing: 0;
  line-height: 28px;
  > div {
    font-size: 18px;
  }
  p {
    font-size: 20px;
  }
  &.bet {
    margin-top: 10px;
    margin-bottom: 5px;
  }

  > * {
    font-family: Mulish, sans-serif;
    font-weight: 900;
    display: flex;
    align-items: center;
    margin: 0;
  }
`;

const SistemaButtonBuonoSconto = styled.div`
  height: 40px;
  width: 125px;
  border: 2px solid #222222;
  border-radius: 9px;
  color: #222222;
  font-family: Roboto, sans-serif;
  font-size: 17px;
  font-weight: bold;
  letter-spacing: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;

const SistemaFooterActions = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;

  button {
    width: 240px;
    height: 40px;
    cursor: pointer;
    box-shadow: none;
    font-family: Mulish, sans-serif;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 0;
    //border-width: 2px;
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
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;
      padding: 0 8px;
    }

    &.transparent {
      color: #222222;
      border-color: #222222;
      background-color: transparent;
    }
    &:disabled {
      opacity: 50%;
      cursor: default;
    }
  }
`;
