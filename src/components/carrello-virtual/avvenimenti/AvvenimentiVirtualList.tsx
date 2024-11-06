import React, { useCallback } from "react";
import icoTrash from "../../../assets/images/icon-trash.png";
import { VirtualEventType } from "src/types/carrello.types";

import { iconsMap } from "src/components/dialog-biglietto/dialog-dettaglio-biglietto/events-central-body/EventsCentralBody";
import { useVirtualUpdateClientsContext } from "src/components/common/context-clients/VirtualClientsContext";
import {
  DivEsitoChiuso,
  StyledCarrelloBodyClasseEsito,
  StyledCarrelloBodyEmpty,
  StyledCarrelloBodyEmptyMessage,
  StyledCarrelloBodyEsito,
  StyledCarrelloBodyEsitoContainer,
  StyledCarrelloBodyEventContainer,
  StyledCarrelloBodyEventData,
  StyledCarrelloBodyEventResultContainer,
  StyledCarrelloBodyMatchData,
  StyledCarrelloBodyProgramData,
  StyledCarrelloBodyProgramDataWrapper,
  StyledCarrelloBodyQuote,
  StyledCarrelloBodyQuoteContainer,
  StyledCarrelloBodyResultContainer,
  StyledCarrelloBodyTrash,
  StyledCarrelloBodyTypeEsito,
  StyledCarrelloIndexEsito,
  StyledCarrelloLine,
} from "src/components/carrello-common/Avvenimenti.style";
import {
  StyledDateVirtualMatch,
  StyledSeparator,
  StyledTimeVirtualMatch,
  StyledTipoEvento,
  StyledTipoTesto,
  StyledCarrelloContainer,
} from "src/components/carrello-common/Avvenimenti.style";
import { css } from "styled-components/macro";
import { SwitchFixed } from "src/components/carrello/avvenimenti/SwitchFixed";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { FormattedMessage } from "react-intl";

export function AvvenimentiVirtualList({
  onCloseSviluppoSistema,
}: {
  onCloseSviluppoSistema: (isOpen: boolean) => void;
}) {
  const virtualCartClientsContext = useVirtualUpdateClientsContext();

  const currentVirtualClient = virtualCartClientsContext.activeVirtualClient;
  const selectedEvents = currentVirtualClient.selectedEvents;
  const isSistema = currentVirtualClient.isSviluppoSistemaActive;
  const { openSchedaVirtual } = useNavigazioneActions();

  const openDettaglioAvvenimentoOnClick = useCallback(
    (evento: VirtualEventType) => {
      onCloseSviluppoSistema(false);
      return openSchedaVirtual({
        eventId: evento.eventId,
        codiceDisciplina: `${evento.provider}_${evento.codiceDisciplina}`,
        sogeicodPalinsesto: evento.codicePalinsesto,
        sogeicodevento: evento.codiceAvvenimento,
      });
    },
    [openSchedaVirtual, onCloseSviluppoSistema],
  );

  const deleteEsitoOnClick = useCallback(
    (indexEvent: number, indexEsito: number, selectedEvents: Array<VirtualEventType>) => {
      const newEvents = [...selectedEvents];
      if (newEvents[indexEvent].esiti.length > 1) {
        newEvents[indexEvent].esiti.splice(indexEsito, 1);
      } else {
        newEvents.splice(indexEvent, 1);
      }

      let carrelloIndex = newEvents.map((evento) => evento.esiti.length).reduce((acc, element) => acc + element, 0);
      if (indexEsito === selectedEvents.length - virtualCartClientsContext.higlightedPrediction) {
        virtualCartClientsContext.setHiglightedPrediction(virtualCartClientsContext.higlightedPrediction - 1);
      }
      newEvents.map((evento) =>
        evento.esiti.map((esito) => {
          esito.indice = carrelloIndex;
          carrelloIndex--;
          return null;
        }),
      );
      virtualCartClientsContext.updateVirtualClientEvents(newEvents);
    },
    [virtualCartClientsContext],
  );

  return (
    <>
      {selectedEvents.length === 0 && (
        <StyledCarrelloBodyEmpty>
          <StyledCarrelloBodyEmptyMessage>
            Seleziona la quota di un esito per aggiungere elementi al tuo biglietto.
          </StyledCarrelloBodyEmptyMessage>
          <StyledCarrelloLine />
        </StyledCarrelloBodyEmpty>
      )}
      {selectedEvents.length !== 0 && (
        <StyledCarrelloContainer
          ref={virtualCartClientsContext.containerRef}
          isMultiplaVirtual={!isSistema}
          isSistemaCorrezioneErrori={
            isSistema && selectedEvents.length === selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0)
          }
          isSistemaIntegrale={selectedEvents.length !== selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0)}
          hasShadow={selectedEvents.length >= 1}
        >
          {selectedEvents.map((evento: VirtualEventType, indexEvento: number) => {
            return (
              <div key={`${evento.eventId}_${evento.codiceAvvenimento}`}>
                <StyledCarrelloBodyEventContainer isSistema={isSistema} gameType={"VIRTUAL"}>
                  <StyledCarrelloBodyProgramDataWrapper gameType={"VIRTUAL"}>
                    <StyledCarrelloBodyProgramData gameType={"VIRTUAL"}>
                      {evento.codicePalinsesto} - {evento.codiceAvvenimento} <StyledSeparator>|</StyledSeparator>
                      <StyledDateVirtualMatch>{evento.formattedDataAvvenimento}</StyledDateVirtualMatch>
                      <StyledTimeVirtualMatch>- {evento.formattedOrario}</StyledTimeVirtualMatch>
                    </StyledCarrelloBodyProgramData>
                  </StyledCarrelloBodyProgramDataWrapper>
                </StyledCarrelloBodyEventContainer>
                <div
                  css={
                    isSistema &&
                    css`
                      flex-direction: row;
                      margin-left: 18px;
                    `
                  }
                >
                  {isSistema && (
                    <SwitchFixed
                      dataQa={`carrello-fissa-${evento.codicePalinsesto}-${evento.codiceAvvenimento}`}
                      id={evento.eventId.toString()}
                      updateIsFixed={() => {}}
                      isSelected={false}
                      isFixed={false}
                    />
                  )}
                  <div
                    css={
                      isSistema &&
                      css`
                        padding-left: 16px;
                        margin-top: -26px;
                      `
                    }
                  >
                    <StyledCarrelloBodyEventData onClick={() => openDettaglioAvvenimentoOnClick(evento)}>
                      <StyledCarrelloBodyMatchData gameType={"VIRTUAL"}>
                        {evento.descrizioneEvento}
                      </StyledCarrelloBodyMatchData>
                    </StyledCarrelloBodyEventData>
                    <StyledTipoEvento>
                      {iconsMap[evento.codiceDisciplina]} <StyledTipoTesto>{evento.siglaDisciplina}</StyledTipoTesto>
                    </StyledTipoEvento>
                  </div>
                </div>
                {evento.esiti.map((esito, indexEsito) => {
                  return (
                    <React.Fragment key={`${esito.codiceEsito}_${esito.descrizione}_${esito.idScommessa}`}>
                      <StyledCarrelloBodyEventResultContainer>
                        <StyledCarrelloBodyResultContainer
                          gameType={"VIRTUAL"}
                          isSistema={isSistema}
                          isActive={virtualCartClientsContext.higlightedPrediction === esito.indice}
                        >
                          <StyledCarrelloBodyEsitoContainer isSuspended={false}>
                            <StyledCarrelloIndexEsito>
                              <div>{esito.indice}</div>
                            </StyledCarrelloIndexEsito>
                            <StyledCarrelloBodyClasseEsito>{esito.descrizioneScommessa}</StyledCarrelloBodyClasseEsito>
                            <StyledCarrelloBodyEsito gameType={"VIRTUAL"}>{esito.descrizione}</StyledCarrelloBodyEsito>
                          </StyledCarrelloBodyEsitoContainer>
                          <DivEsitoChiuso>
                            <StyledCarrelloBodyQuoteContainer>
                              {evento.stato !== undefined && evento.stato === 0 && (
                                <StyledCarrelloBodyQuote quoteState={"CLOSE"}>
                                  {" "}
                                  <StyledCarrelloBodyTypeEsito gameType={"VIRTUAL"}>
                                    <FormattedMessage
                                      defaultMessage="Esito Chiuso"
                                      description="Esito Chiuso Avvenimenti Carrello"
                                    />
                                  </StyledCarrelloBodyTypeEsito>
                                  -
                                </StyledCarrelloBodyQuote>
                              )}
                              {evento.stato !== undefined && evento.stato === 1 && (
                                <StyledCarrelloBodyQuote quoteState={"DEFAULT"}>
                                  {esito.formattedQuota}
                                </StyledCarrelloBodyQuote>
                              )}

                              <StyledCarrelloBodyTrash
                                onClick={() => {
                                  deleteEsitoOnClick(indexEvento, indexEsito, selectedEvents);
                                }}
                              >
                                <img src={icoTrash} alt="trash" />
                              </StyledCarrelloBodyTrash>
                            </StyledCarrelloBodyQuoteContainer>
                          </DivEsitoChiuso>
                        </StyledCarrelloBodyResultContainer>

                        <hr></hr>
                      </StyledCarrelloBodyEventResultContainer>
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
        </StyledCarrelloContainer>
      )}
    </>
  );
}
