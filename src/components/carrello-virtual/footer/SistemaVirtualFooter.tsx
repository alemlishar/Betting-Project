import React, { useContext, useMemo } from "react";
import styled from "styled-components/macro";

import { FormattedMessage } from "react-intl";
import { useVirtualUpdateClientsContext } from "src/components/common/context-clients/VirtualClientsContext";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { useLastDefinedValue } from "src/components/carrello-virtual/CarrelloVirtual";
import { VirtualEventType } from "src/types/carrello.types";

export const SistemaVirtualFooter = ({
  isSviluppoSistemaOpen,
  toggleSviluppoSistema,
  openEvents,
}: {
  isSviluppoSistemaOpen: boolean;
  toggleSviluppoSistema: (isOpen: boolean) => void;
  openEvents: VirtualEventType[];
}) => {
  const virualClientContext = useVirtualUpdateClientsContext();
  const globalContext = useContext(GlobalStateContext);
  const selectedEvents = virualClientContext.activeVirtualClient.selectedEvents;
  const isSistemaIntegrale = selectedEvents.length !== selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0);
  const minimumTotalBet = globalContext.systemVirtualBetConfig ? globalContext.systemVirtualBetConfig.importoMinimo : 1;

  const maxEsitiNrSuperata = () => {
    return selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0) > 100 ? true : false;
  };
  const maxEventiSuperata = selectedEvents.length < 4 ? false : true;

  const giocataSistemisticaSviluppataResponseComplete = useLastDefinedValue(
    virualClientContext.giocataSistemisticaData,
    virualClientContext.activeVirtualClient.puntataSistema,
  );

  const { activeVirtualClient } = useVirtualUpdateClientsContext();
  const isAnyLegaturaZero = useMemo(() => {
    let hasZero = false;
    activeVirtualClient.puntataSistema.forEach((legatura) => {
      if (legatura.importo < 1) {
        hasZero = true;
      }
    });
    return hasZero;
  }, [activeVirtualClient]);
  const giocataSistemisticaSviluppataResponseFooter = giocataSistemisticaSviluppataResponseComplete.lastDefinedValue;
  const totalPuntata = Object.values(
    giocataSistemisticaSviluppataResponseComplete.lastDefinedValue.sviluppoByCardinalita,
  ).reduce((prev, puntata) => prev + puntata.importoTotale, 0);

  const giocataSistemisticaSviluppataResponse =
    giocataSistemisticaSviluppataResponseComplete.lastDefinedValue.sviluppoByCardinalita;
  const vincitaMassimaSuperata = useMemo(() => {
    for (var key in giocataSistemisticaSviluppataResponse) {
      if (decimalToIntegerValue(giocataSistemisticaSviluppataResponse[key].vincitaMassima) > 5000) {
        return true;
      }
    }
  }, [giocataSistemisticaSviluppataResponse, selectedEvents]);
  const nrCombinazioni = useMemo(() => {
    let nrComb = 0;
    for (var key in giocataSistemisticaSviluppataResponse) {
      nrComb = nrComb + giocataSistemisticaSviluppataResponse[key].numeroSviluppi;
    }

    return nrComb;
  }, [giocataSistemisticaSviluppataResponse, selectedEvents]);

  return (
    <SistemaFooterWrapper>
      <SistemaFooterInfo>
        <SistemaFooterButtonSviluppo onClick={() => toggleSviluppoSistema(!isSviluppoSistemaOpen)}>
          <div>
            <p className={"label"} data-qa={`carrello-sviluppi-${isSviluppoSistemaOpen ? "chiudi" : "apri"}`}>
              {isSviluppoSistemaOpen ? (
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
              {isSviluppoSistemaOpen ? (
                <FormattedMessage description="Sistema footer button label 'esci sviluppo'" defaultMessage="ESC" />
              ) : (
                <FormattedMessage description="Sistema footer button label 'apri sviluppo'" defaultMessage="+" />
              )}
            </p>
          </div>
        </SistemaFooterButtonSviluppo>

        <SistemaFooterInfoRow className={"bet"}>
          <div>
            <FormattedMessage description="Sistema footer button label 'puntata'" defaultMessage="Puntata" />
            <SistemaButtonBuonoSconto>
              <FormattedMessage description="Sistema footer button label 'buono gioco'" defaultMessage="Buono gioco" />
            </SistemaButtonBuonoSconto>
          </div>
          <p data-qa="carrello-puntata-totale-sistema">{formatCurrency(decimalToIntegerValue(totalPuntata))}</p>
        </SistemaFooterInfoRow>
        {!isSistemaIntegrale && (
          <div>
            <SistemaFooterInfoRow>
              <div>
                <FormattedMessage
                  description="Sistema footer button label 'vincita potenziale minima'"
                  defaultMessage="Vincita potenziale minima"
                />
              </div>
              <p data-qa="carrello-vincita-potenziale-minima">
                {formatCurrency(decimalToIntegerValue(giocataSistemisticaSviluppataResponseFooter.vincitaMinimaTotale))}
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
                {formatCurrency(decimalToIntegerValue(giocataSistemisticaSviluppataResponseFooter.vincitaTotale))}
              </p>
            </SistemaFooterInfoRow>
          </div>
        )}
      </SistemaFooterInfo>

      <SistemaFooterActions>
        {selectedEvents.length !== openEvents.length && (
          <button onClick={() => virualClientContext.updateVirtualClientEvents(openEvents)} className={"transparent"}>
            <FormattedMessage
              description="Multipla footer button label 'elimina esiti chiusi'"
              defaultMessage="Elimina esiti chiusi"
            />
          </button>
        )}
        <button
          data-qa="carrello-vendi-sistema"
          onClick={() => {}}
          disabled={
            maxEventiSuperata ||
            nrCombinazioni > 512 ||
            vincitaMassimaSuperata ||
            maxEsitiNrSuperata() ||
            isAnyLegaturaZero ||
            selectedEvents.length !== openEvents.length
          }
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
    width: 100%;
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
      margin-right: 10px;
      font-size: 16px;
    }
    &:disabled {
      opacity: 50%;
      cursor: default;
    }
  }
`;
