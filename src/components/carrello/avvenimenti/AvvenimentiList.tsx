import React, { useEffect, useReducer, useContext, useState, useCallback } from "react";
import icoTrash from "../../../assets/images/icon-trash.png";
import { EventoType, EsitoStatus } from "src/types/carrello.types";
import { ReactComponent as LiveIcon } from "../../../assets/images/live.svg";
import { SwitchFixed } from "./SwitchFixed";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
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
  StyledCarrelloBodyQuoteUpDown,
  StyledCarrelloBodyQuoteUpDownContainer,
  StyledCarrelloBodyResultContainer,
  StyledCarrelloBodyTrash,
  StyledCarrelloBodyTypeEsito,
  StyledCarrelloContainer,
  StyledCarrelloIndexEsito,
  StyledCarrelloLine,
  StyledIsLiveEvent,
} from "src/components/carrello-common/Avvenimenti.style";
import { SmartSearchState } from "src/components/smart-search/useSmartSearch";
export function AvvenimentiList({
  selectedEvents,
  updateClientEvents,
  updateIsFixed,
  isSistema,
  eventsAreHighlighted,
  setEventsAreHighlighted,
  sviluppoSistemaOpen,
  setSviluppoSistemaOpen,
  onStateChange,
}: {
  selectedEvents: Array<EventoType>;
  updateClientEvents(selectedEvents: Array<EventoType>): void;
  updateIsFixed: (isFixed: boolean, id: string) => void;
  isSistema: boolean;
  eventsAreHighlighted: boolean;
  setEventsAreHighlighted: (v: boolean) => void;
  sviluppoSistemaOpen: boolean;
  setSviluppoSistemaOpen: (e: boolean) => void;
  onStateChange: (state: SmartSearchState) => void;
}) {
  //ev -> indice evento (0)
  // es -> indice esito (1)
  const { openSchedaAvvenimentoPrematch, openSchedaAvvenimentoLive } = useNavigazioneActions();

  const onOpenAvvenimento = useCallback(
    (evento: EventoType) => {
      if (sviluppoSistemaOpen) {
        setSviluppoSistemaOpen(false);
      }
      //TODO previosuSezione da capire
      onStateChange({ type: "0", subtype: { type: "focus" }, text: "" });
      const disciplina = evento.disciplina;
      const manifestazione = evento.manifestazione;
      const avvenimento = evento.avvenimento;
      const sezione = evento.live ? "live" : "sport";
      if (sezione === "sport") {
        openSchedaAvvenimentoPrematch({
          disciplina,
          manifestazione,
          avvenimento,
          previousSezione: "sport",
          codiceDisciplina: evento.codiceDisciplina,
          codiceManifestazione: evento.codiceManifestazione,
          codiceAvvenimento: evento.codiceAvvenimento,
          codicePalinsesto: evento.codicePalinsesto,
        });
      } else if (sezione === "live") {
        openSchedaAvvenimentoLive({
          disciplina,
          manifestazione,
          avvenimento,
          previousSezione: "live",
          codiceDisciplina: evento.codiceDisciplina,
          codiceManifestazione: evento.codiceManifestazione,
          codiceAvvenimento: evento.codiceAvvenimento,
          codicePalinsesto: evento.codicePalinsesto,
        });
      }
    },
    [
      sviluppoSistemaOpen,
      onStateChange,
      setSviluppoSistemaOpen,
      openSchedaAvvenimentoPrematch,
      openSchedaAvvenimentoLive,
    ],
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [highlightedEvent, changeHighlightedEvent] = useReducer(
    (state: { ev: number; es: number }, params: { direction?: 1 | -1; set?: { newEv: number; newEs: number } }) => {
      let ev = 0;
      let es = 0;
      //gestione avvenimento
      // l'indice evento è passato direttamente
      if (selectedEvents === undefined || selectedEvents.length === 0) {
        return { ev: 0, es: 0 };
      }
      if (params.set !== undefined) {
        ev = params.set.newEv;
      } //primo avvenimento del carrello -> se premo su vado nell'ultimo
      else if (state.ev === 0 && state.es === 0 && params.direction === -1) {
        ev = selectedEvents.length - 1;
        if (containerRef.current) {
          containerRef.current.scrollTo({ top: 9999 });
        }
      } //ultimo avvenimento del carrello -> se premo giù vado nel primo
      else if (
        state.es === selectedEvents[state.ev].esiti.length - 1 &&
        state.ev === selectedEvents.length - 1 &&
        params.direction === 1
      ) {
        ev = 0;
        if (containerRef.current) {
          containerRef.current.scrollTo({ top: 0 });
        }
      } // ultimo/primo esito di un avvenimento -> mi muovo sull'avvenimento precedente/successivo
      else if (
        (state.es === 0 && params.direction === -1) ||
        (state.es === selectedEvents[state.ev].esiti.length - 1 && params.direction === 1)
      ) {
        if (params.direction === 1 && containerRef.current) {
          containerRef.current.scrollBy(0, 30);
        } else if (params.direction === -1 && containerRef.current) {
          containerRef.current.scrollBy(0, -30);
        }
        ev = state.ev + params.direction;
        // non sono sul primo/ultimo esito di un avvenimento -> non cambio null
      } else if (
        (state.es === selectedEvents[state.ev].esiti.length - 1 && params.direction === -1) ||
        state.es < selectedEvents[state.ev].esiti.length - 1
      ) {
        ev = state.ev;
      }

      //gestione esito
      // l'indice esito è passato direttamente
      if (params.set !== undefined) {
        es = params.set.newEs;
      }
      //primo esito di un avvenimento -> se premo su l'esito selezionato è l'ultimo dell'avvenimento precedente
      else if (state.es === 0 && params.direction === -1 && selectedEvents[ev] !== undefined) {
        es = selectedEvents[ev].esiti.length - 1;
      } //mi muovo su e giù tra gli esiti dello stesso avvenimento
      else if (
        state.es < selectedEvents[state.ev].esiti.length - 1 ||
        (state.es === selectedEvents[state.ev].esiti.length - 1 && params.direction === -1)
      ) {
        if (params.direction === 1 && containerRef.current) {
          containerRef.current.scrollBy(0, 20);
        } else if (params.direction === -1 && containerRef.current) {
          containerRef.current.scrollBy(0, -20);
        }
        es = params.direction !== undefined ? state.es + params.direction : state.es;
      } //seleziono il primo esito negli altri casi
      else {
        es = 0;
      }
      return { ev, es };
      //const ev = 0;
      //const es = 0;
    },
    { ev: 0, es: 0 },
  );
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  const deleteEsito = useCallback(
    (indexEvent: number, indexEsito: number, selectedEvents: EventoType[]) => {
      if (selectedEvents.length > 0) {
        const newEvents = [...selectedEvents];
        if (newEvents[indexEvent].esiti.length > 1) {
          newEvents[indexEvent].esiti.splice(indexEsito, 1);
        } else {
          newEvents.splice(indexEvent, 1);
        }
        if (newEvents[indexEvent] !== undefined && indexEsito === newEvents[indexEvent].esiti.length) {
          changeHighlightedEvent({ set: { newEv: indexEvent, newEs: indexEsito - 1 } });
        }
        let carrelloIndex = newEvents.map((evento) => evento.esiti.length).reduce((acc, element) => acc + element, 0);
        newEvents.map((evento) =>
          evento.esiti.map((esito) => {
            esito.indice = carrelloIndex;
            carrelloIndex--;
            return null;
          }),
        );
        updateClientEvents(newEvents);
      }
    },
    [updateClientEvents],
  );

  useEffect(() => {
    if (eventsAreHighlighted) {
      changeHighlightedEvent({ direction: 1, set: { newEv: 0, newEs: 0 } });
    }
  }, [eventsAreHighlighted]);

  // DEBT
  useEffect(() => {
    if (eventsAreHighlighted) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (keyboardNavigationContext.current === "blocking-operation") {
          return;
        }
        if (keyboardNavigationContext.current === "cart") {
          if (event.key === "ArrowDown") {
            changeHighlightedEvent({ direction: 1 });
          } else if (event.key === "ArrowUp") {
            changeHighlightedEvent({ direction: -1 });
          }
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [eventsAreHighlighted, keyboardNavigationContext]);

  // DEBT

  //SI OCCUPA DELL'APERTURA DETTAGLIO AVVENIMENTO
  useEffect(() => {
    if (selectedEvents.length === 0) {
      setEventsAreHighlighted(false);
      keyboardNavigationContext.current = "smart-search";
    } else if (eventsAreHighlighted) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (keyboardNavigationContext.current === "blocking-operation") {
          return;
        }
        if (event.key === "Enter" && !event.ctrlKey) {
          const eventToOpen = selectedEvents[highlightedEvent.ev];
          onOpenAvvenimento(eventToOpen);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [
    eventsAreHighlighted,
    onOpenAvvenimento,
    highlightedEvent,
    selectedEvents,
    setEventsAreHighlighted,
    keyboardNavigationContext,
  ]);

  // DEBT
  useEffect(() => {
    if (selectedEvents.length === 0) {
      return;
    }
    if (eventsAreHighlighted) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (keyboardNavigationContext.current === "blocking-operation") {
          return;
        }
        if (event.key === "Delete" && !event.ctrlKey) {
          deleteEsito(highlightedEvent.ev, highlightedEvent.es, selectedEvents);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [deleteEsito, eventsAreHighlighted, highlightedEvent, selectedEvents, keyboardNavigationContext]);
  const [esitiStatus, setEsitiStatus] = useState<EsitoStatus>({});

  useEffect(() => {
    //TODO capire cosa fa
    if (selectedEvents.length > 0) {
      const map = selectedEvents.reduce<EsitoStatus>((acc, cur) => {
        acc[cur.id] = cur.esiti.reduce<EsitoStatus["event"]>((coll, esito) => {
          coll[esito.id] = {
            status:
              !!esitiStatus[cur.id] &&
              !!esitiStatus[cur.id][esito.id] &&
              esito.quota !== esitiStatus[cur.id][esito.id].quota
                ? esito.quotaVariataUpDown
                : "",
            quota: esito.quota,
          };
          return coll;
        }, {});
        return acc;
      }, {});
      setEsitiStatus(map);

      setTimeout(() => {
        const map = selectedEvents.reduce<EsitoStatus>((acc, cur) => {
          acc[cur.id] = cur.esiti.reduce<EsitoStatus["event"]>((coll, esito) => {
            coll[esito.id] = {
              status: "",
              quota: esito.quota,
            };
            return coll;
          }, {});
          return acc;
        }, {});
        setEsitiStatus(map);
      }, 6000);
    }
  }, [selectedEvents]);

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
          isMultiplaVirtual={!isSistema}
          isSistemaCorrezioneErrori={
            isSistema && selectedEvents.length === selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0)
          }
          isSistemaIntegrale={selectedEvents.length !== selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0)}
          ref={containerRef}
          hasShadow={selectedEvents.length >= 1}
        >
          {selectedEvents.map((evento: EventoType, indexEvento: number) => (
            <div key={`${evento.id}_${evento.esiti[0].id}_events`}>
              {isSistema && (
                <SwitchFixed
                  dataQa={`carrello-fissa-${evento.codicePalinsesto}-${evento.codiceAvvenimento}`}
                  id={evento.id}
                  updateIsFixed={updateIsFixed}
                  isSelected={eventsAreHighlighted && indexEvento === highlightedEvent.ev}
                  isFixed={evento.isFixed}
                />
              )}
              <StyledCarrelloBodyEventContainer isSistema={isSistema} gameType={"SPORT"}>
                {" "}
                {/**DEBT */}
                <StyledCarrelloBodyEventData onClick={() => onOpenAvvenimento(evento)}>
                  <StyledCarrelloBodyProgramDataWrapper gameType={"SPORT"}>
                    <StyledCarrelloBodyProgramData
                      gameType={"SPORT"}
                      data-qa={`carrello-avvenimento-${evento.codicePalinsesto}-${evento.codiceAvvenimento}`}
                    >
                      {evento.codiceAvvenimento}
                    </StyledCarrelloBodyProgramData>
                  </StyledCarrelloBodyProgramDataWrapper>
                  <StyledCarrelloBodyMatchData gameType={"SPORT"}>
                    {evento.descrizioneAvvenimento}
                  </StyledCarrelloBodyMatchData>
                </StyledCarrelloBodyEventData>
                {evento.live && (
                  <StyledIsLiveEvent>
                    <LiveIcon />
                  </StyledIsLiveEvent>
                )}
              </StyledCarrelloBodyEventContainer>
              {evento.esiti.map((esito, indexEsito) => {
                return (
                  <React.Fragment key={`${evento.id}_${esito.id}`}>
                    <StyledCarrelloBodyEventResultContainer>
                      <StyledCarrelloBodyResultContainer
                        gameType="SPORT"
                        isSistema={isSistema}
                        isActive={
                          eventsAreHighlighted &&
                          indexEvento === highlightedEvent.ev &&
                          indexEsito === highlightedEvent.es
                        }
                      >
                        <StyledCarrelloBodyEsitoContainer isSuspended={esito.stato !== undefined && esito.stato !== 1}>
                          <StyledCarrelloIndexEsito>
                            <div>{esito.indice}</div>
                          </StyledCarrelloIndexEsito>
                          <StyledCarrelloBodyClasseEsito>{esito.descrizioneScommessa}</StyledCarrelloBodyClasseEsito>
                          <StyledCarrelloBodyEsito
                            gameType={"SPORT"}
                            data-qa={`carrello-esito-${esito.codicePalinsesto}-${esito.codiceAvvenimento}-${esito.codiceClasseEsito}-${esito.idInfoAggiuntiva}-${esito.codiceEsito}`}
                          >
                            {esito.descrizioneEsito}
                          </StyledCarrelloBodyEsito>
                        </StyledCarrelloBodyEsitoContainer>
                        <DivEsitoChiuso className="test">
                          {esito.stato !== undefined && esito.stato !== 1 && (
                            <StyledCarrelloBodyTypeEsito gameType="SPORT">
                              {esito.stato === 0 ? "Esito Chiuso" : "Esito Sospeso"}
                            </StyledCarrelloBodyTypeEsito>
                          )}

                          <StyledCarrelloBodyQuoteContainer>
                            {esito.stato !== undefined && esito.stato === 0 && (
                              <StyledCarrelloBodyQuote quoteState={"CLOSE"}>-</StyledCarrelloBodyQuote>
                            )}
                            {esito.stato !== undefined && esito.stato === 1 && !esito.quotaVariata && (
                              <StyledCarrelloBodyQuote
                                quoteState={"DEFAULT"}
                                data-qa={`carrello-quota-${esito.codicePalinsesto}-${esito.codiceAvvenimento}-${esito.codiceClasseEsito}-${esito.idInfoAggiuntiva}-${esito.codiceEsito}`}
                              >
                                {(esito.quota / 100).toFixed(2)}
                              </StyledCarrelloBodyQuote>
                            )}

                            {esito.stato !== undefined &&
                              esito.stato === 1 &&
                              esito.quotaVariata &&
                              esitiStatus[evento.id] && (
                                <StyledCarrelloBodyQuoteUpDownContainer
                                  isVariazioneQuota={
                                    esitiStatus[evento.id][esito.id].status === "down" ||
                                    esitiStatus[evento.id][esito.id].status === "up"
                                  }
                                >
                                  <StyledCarrelloBodyQuote quoteState={esitiStatus[evento.id][esito.id].status}>
                                    {(esito.quota / 100).toFixed(2)}
                                  </StyledCarrelloBodyQuote>
                                  <StyledCarrelloBodyQuoteUpDown
                                    variazioneQuota={esitiStatus[evento.id][esito.id].status}
                                  ></StyledCarrelloBodyQuoteUpDown>
                                </StyledCarrelloBodyQuoteUpDownContainer>
                              )}
                            {esito.stato !== undefined && esito.stato === 2 && (
                              <StyledCarrelloBodyQuote quoteState={"SUSPENDED"}>
                                {(esito.quota / 100).toFixed(2)}
                              </StyledCarrelloBodyQuote>
                            )}

                            <StyledCarrelloBodyTrash
                              data-qa={`carrello-cestino-esito-${esito.codicePalinsesto}-${esito.codiceAvvenimento}-${esito.codiceClasseEsito}-${esito.idInfoAggiuntiva}-${esito.codiceEsito}`}
                              onClick={() => {
                                deleteEsito(indexEvento, indexEsito, selectedEvents);
                              }}
                            >
                              <img src={icoTrash} alt="trash" />
                            </StyledCarrelloBodyTrash>
                          </StyledCarrelloBodyQuoteContainer>
                        </DivEsitoChiuso>
                      </StyledCarrelloBodyResultContainer>
                      {/* {esito.stato !== undefined && esito.stato !== 1 && (
                      <StyledCarrelloBodyTypeEsito>
                        {esito.stato === 0 ? "Esito Chiuso" : "Esito Sospeso"}
                      </StyledCarrelloBodyTypeEsito>
                 )}*/}

                      <hr className={esito.stato !== undefined && esito.stato !== 1 ? "closed-suspended" : ""}></hr>
                    </StyledCarrelloBodyEventResultContainer>
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </StyledCarrelloContainer>
      )}
    </>
  );
}
