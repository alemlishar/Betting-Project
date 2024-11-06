import { useCallback, useEffect, useMemo, useState } from "react";
import { getTotalBetSviluppo } from "src/components/carrello/helpers";
import { EventStatusEnum } from "src/mapping/event-status/event-status.enum";
import { ApiService } from "src/services/FetchApiService";
import { APIResponseType } from "src/types/apiResponse.types";
import { EsitoType, EventoType, SviluppoSistemaType, toEsitoType, toEventoType } from "src/types/carrello.types";
import { EventType } from "src/types/event.types";
import { PronosticiParamsType } from "src/types/pronosticiParams.types";
import {
  CardinalityAndSellingAmount,
  GiocataSistemisticaRequest,
  GiocataSistemisticaSviluppataResponse,
  SviluppoSistema,
} from "src/types/sistemi.types";

export const useCarrelloFetching = ({
  selectedEvents,
  pronosticiParams,

  updateClientEvents,
  updateRecord,
  updateSviluppoWinAmounts,
  currentSviluppoSistema,
  checkNewInsertion,
  legatureToShow,
  updateIndexCarrello,
  totalBetSviluppo,
  setTotalBetSviluppo,
  setLegatureToShow,
  isWaitingVendi,
  showChangeQuoteFlag,
  sezione,
}: {
  selectedEvents: Array<EventoType>;
  pronosticiParams?: Array<PronosticiParamsType>;

  updateClientEvents: (evs: EventoType[]) => void;
  updateRecord: (events: Array<any>) => void;
  updateSviluppoWinAmounts: (winAmounts: Array<SviluppoSistema>) => void;
  currentSviluppoSistema?: Array<SviluppoSistemaType>;
  legatureToShow: SviluppoSistemaType[];
  checkNewInsertion: (evento: boolean, newEsito: PronosticiParamsType, changingEsito: EsitoType | undefined) => boolean;
  totalBetSviluppo: number;
  setTotalBetSviluppo: (e: number) => void;
  setLegatureToShow: (e: SviluppoSistemaType[]) => void;
  updateIndexCarrello: (evs: EventoType[]) => void;
  isWaitingVendi: boolean;
  showChangeQuoteFlag: boolean;
  sezione: string;
}) => {
  const [sistemaFooterData, setSistemaFooterData] = useState<
    { minWinningAmount: number; maxWinningAmount: number } | undefined
  >();
  const [giocataSistemisticaResponse, setGiocataSistemisticaResponse] = useState<GiocataSistemisticaSviluppataResponse>(
    {
      esito: 0,
      costoTotale: 0,
      vincitaMinimaTotale: 0,
      vincitaTotale: 0,
      numeroTotaleMultiple: 0,
      sviluppoByCardinalita: [],
      pronosticoList: [],
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pronosticiParamsList, setPronosticiParamsList] = useState<Array<PronosticiParamsType>>([]);
  const [sviluppiSistemaWithBonusApplicatoByCardinalita, setSviluppiSistemaWithBonusApplicatoByCardinalita] = useState<
    Array<SviluppoSistema>
  >();
  const getPronostico = useMemo(() => {
    let pronosticoList: Array<EsitoType> = [];
    selectedEvents.forEach((evento: EventoType) => {
      evento.esiti.forEach((esito) => {
        pronosticoList.push(esito);
      });
    });

    return pronosticoList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvents, currentSviluppoSistema]);

  const getLegatura = useMemo(() => {
    let legauraList: Array<CardinalityAndSellingAmount> = [];
    currentSviluppoSistema?.forEach((legatura) => {
      if (legatura.bet > 20) {
        legauraList.push({
          cardinalita: legatura.indice,
          importo: 0,
        });
      } else {
        legauraList.push({
          cardinalita: legatura.indice,
          importo: Number((legatura.bet * 100).toFixed(0)),
        });
      }
    });
    return legauraList;
  }, [currentSviluppoSistema]);

  const [cdsrPreview, setCdsrPreview] = useState<Array<CardinalityAndSellingAmount>>([]);
  const stampaRiepilogoRequest = useMemo(() => {
    return {
      esitoRequest: getPronostico,
      cdsr: cdsrPreview,
      totalAmountCombinations: totalBetSviluppo.toFixed(2),
      venditaSportSistemisticaDTO: {},
    };
  }, [getPronostico, cdsrPreview, totalBetSviluppo]);
  const updateLegatureECarrello = useCallback(
    (legature?: Array<SviluppoSistemaType>) => {
      if (legature !== undefined) {
        // parsing Eventi and Esiti to EventType (that it the one from ticket)
        let currentEvents: EventType[] = [];
        selectedEvents.forEach((cartEvent: EventoType) => {
          cartEvent.esiti.forEach((esito) => {
            currentEvents.push({
              sportId: 0,
              addedInfo: esito.idInfoAggiuntiva,
              marketId: 0,
              scheduleId: cartEvent.codicePalinsesto,
              eventId: cartEvent.codiceAvvenimento,
              competitionDescription: "",
              eventType: "",
              isReported: false,
              eventIconUrl: "",
              eventDescription: "",
              eventTimestamp: cartEvent.dataAvvenimento,
              outcomeId: esito.codiceEsito,
              outcomeDescription: "",
              outcomeResult: "",
              outcomeValue: esito.quota / 100,
              status: EventStatusEnum.UNDEFINED,
              marketDescription: "",
              addedInfoDescription: "",
              isFixed: cartEvent.isFixed || false,
              bettingCode: esito.codiceScommessa,
              live: false,
            });
          });
        });
        const giocataSistemisticaRequest: GiocataSistemisticaRequest = {
          esitoRequest: getPronostico,
          cdsr: getLegatura,
        };

        if (legature && currentSviluppoSistema !== undefined) {
          fetchCalculatedTicket(giocataSistemisticaRequest);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedEvents, updateSviluppoWinAmounts],
  );

  useEffect(() => {
    const bet = getTotalBetSviluppo(legatureToShow || []);
    setTotalBetSviluppo(bet);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legatureToShow]);

  //TODO verificare eventuali regressioni

  const fetchCalculatedTicket = (giocataSistemisticaRequest: any) => {
    ApiService()
      .post("bonus/system/giocatasistemistica/sport", giocataSistemisticaRequest)
      .then((data: APIResponseType<GiocataSistemisticaSviluppataResponse>) => {
        if (data.result === undefined) {
          console.error(data.error);

          return;
        } else {
          const bonusApplicatoByCardinalita: Array<boolean> = [];
          Object.values(data.result.sviluppoByCardinalita).forEach((aCardinality) => {
            bonusApplicatoByCardinalita.push(aCardinality.bonusApplicato);
          });
          const legatureToShowNew: Array<SviluppoSistemaType> = [];
          currentSviluppoSistema?.map((legatura, index) => {
            if (data.result !== undefined) {
              Object.values(data.result.sviluppoByCardinalita).forEach((aCardinality) => {
                if (aCardinality.cardinalita === legatura.indice) {
                  legatura.errors = currentSviluppoSistema[index].errors;
                  legatura.combinazioni = aCardinality.numeroSviluppi;
                  legatura.isAvailable = aCardinality.numeroSviluppi === 0 ? false : true;
                  legatura.winAmounts.max = aCardinality.vincitaMassima / 100;
                  legatura.winAmounts.min = aCardinality.vincitaMinima / 100;
                  return legatureToShowNew.push(legatura);
                }
              });
              return [];
            }
            return [];
          });
          setLegatureToShow(legatureToShowNew ? legatureToShowNew : []);
        }

        const cdsrPrintPreview = Object.values(data.result.sviluppoByCardinalita).map(
          (aCardinality: SviluppoSistema) => {
            return {
              cardinalita: aCardinality.cardinalita,
              importo: aCardinality.importo,
            };
          },
        );

        const bonusSystem = Object.values(data.result.sviluppoByCardinalita).filter((aCardinality: SviluppoSistema) => {
          return aCardinality.bonusApplicato === true && aCardinality.importo > 0;
        });
        setSviluppiSistemaWithBonusApplicatoByCardinalita(bonusSystem);
        setCdsrPreview(cdsrPrintPreview);
        updateSviluppoWinAmounts(data.result.sviluppoByCardinalita);
        setGiocataSistemisticaResponse(data.result);
        setSistemaFooterData({
          minWinningAmount: data.result.vincitaMinimaTotale / 100 || 0,
          maxWinningAmount: data.result.vincitaTotale / 100 || 0,
        });
      });
  };

  /*  Da inserire dopo fetchCalculatedTicket */
  const [counter, changeCounter] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedEvents.length > 0 && !isWaitingVendi && !showChangeQuoteFlag) {
        updateQuota();
        changeCounter(counter + 1);
      }
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, selectedEvents, isWaitingVendi, showChangeQuoteFlag]);

  const updateQuota = useCallback(() => {
    if (selectedEvents.length > 0) {
      ApiService()
        .post("esito/pronostici", pronosticiParamsList)
        .then((data) => {
          if (data.result === undefined) {
            throw data.error;
          }
          if (isWaitingVendi || showChangeQuoteFlag) {
            return;
          }

          for (var i = 0; i < data.result.length; i++) {
            const pronosticiResponseError = data.result[i].errorValue;
            let isErrorToUpdate = false;
            if (pronosticiResponseError !== undefined && pronosticiResponseError !== null) {
              const firstDigitIndex = pronosticiResponseError.search(/\d/);
              const scommessaErrorDescription = pronosticiResponseError.substring(firstDigitIndex);
              const condicePalinsestoError = parseInt(
                scommessaErrorDescription.substring(0, scommessaErrorDescription.indexOf("-")),
              );
              const codiceAvvenimentoError = parseInt(
                scommessaErrorDescription.substring(
                  scommessaErrorDescription.indexOf("-") + 1,
                  scommessaErrorDescription.lastIndexOf("-"),
                ),
              );
              const codiceScommessa = parseInt(
                scommessaErrorDescription.substring(scommessaErrorDescription.length - 1),
              );
              for (let i = 0; i < selectedEvents.length; i++) {
                const codiceAvvenimentoS = selectedEvents[i].codiceAvvenimento;
                const codicePalinsestoS = selectedEvents[i].codicePalinsesto;
                const esiti = selectedEvents[i].esiti;
                if (codiceAvvenimentoS === codiceAvvenimentoError && codicePalinsestoS === condicePalinsestoError) {
                  for (let k = 0; k < esiti.length; k++) {
                    const codiceScommessaS = esiti[k].codiceScommessa;
                    if (codiceScommessa === codiceScommessaS && esiti[k].stato !== 2) {
                      isErrorToUpdate = true;
                      esiti[k].stato = 2;
                    }
                  }
                }
              }
              if (isErrorToUpdate && !isWaitingVendi && !showChangeQuoteFlag) {
                updateClientEvents(selectedEvents);
              }
            } else {
              const pronosticiResponse = data.result[i].value;
              const quotaVariata = pronosticiResponse.quotaVariata;
              const codiceAvvenimento = pronosticiResponse.codiceAvvenimento;
              const codiceClasseEsito = pronosticiResponse.codiceClasseEsito;
              const codiceEsito = pronosticiResponse.codiceEsito;
              const codicePalinsesto = pronosticiResponse.codicePalinsesto;
              const idInfoAggiuntiva = pronosticiResponse.idInfoAggiuntiva;
              const quota = pronosticiResponse.quota;
              const stato = pronosticiResponse.stato;
              for (let j = 0; j < selectedEvents.length; j++) {
                const codiceAvvenimentoS = selectedEvents[j].codiceAvvenimento;
                const codicePalinsestoS = selectedEvents[j].codicePalinsesto;
                const esiti = selectedEvents[j].esiti;
                for (let x = 0; x < esiti.length; x++) {
                  const codiceClasseEsitoS = esiti[x].codiceClasseEsito;
                  const codiceEsitoS = esiti[x].codiceEsito;
                  const idInfoAggiuntivaS = esiti[x].idInfoAggiuntiva;
                  if (
                    codiceAvvenimento === codiceAvvenimentoS &&
                    codiceClasseEsito === codiceClasseEsitoS &&
                    codiceEsito === codiceEsitoS &&
                    codicePalinsesto === codicePalinsestoS &&
                    idInfoAggiuntiva === idInfoAggiuntivaS
                  ) {
                    const tempSelectedEvent = [...selectedEvents];
                    if (stato === esiti[x].stato && !quotaVariata) {
                      continue;
                    }
                    if (stato !== esiti[x].stato) {
                      esiti[x].stato = stato;
                      if (stato === 0) {
                        esiti[x].quota = 100;
                      }
                    }
                    if (quotaVariata) {
                      esiti[x].quotaVariata = quotaVariata;
                      if (esiti[x].quota < quota) {
                        esiti[x].quotaVariataUpDown = "up";
                      } else if (esiti[x].quota > quota) {
                        esiti[x].quotaVariataUpDown = "down";
                      }
                      esiti[x].quota = quota;
                    }
                    if (!isWaitingVendi && !showChangeQuoteFlag) {
                      updateClientEvents(tempSelectedEvent);
                    }
                  }
                }
              }
            }
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateClientEvents, pronosticiParamsList, selectedEvents, isWaitingVendi, showChangeQuoteFlag]);

  //AGGIORNAMENTO EVENTI SPORT
  useEffect(() => {
    if (pronosticiParams === undefined || pronosticiParams.length === 0) {
      return;
    }
    if (selectedEvents.length === 0) {
      //ADD Multy Event in Cart
      const newerEvents = pronosticiParams.reduce((eventsAcc, pronostico, index) => {
        const newEsito = toEsitoType(pronostico, index);
        const eventAccIndex = eventsAcc.findIndex(
          (selectedEvent) =>
            selectedEvent.id ===
            `${pronostico.codicePalinsesto}_${pronostico.codiceDisciplina}_${pronostico.codiceAvvenimento}`,
        );
        //TODO controllare
        const currentEsito = eventsAcc[eventAccIndex]?.esiti.find((esito) => esito.id === newEsito.id);
        const inNewEvent = eventAccIndex > -1;
        if (checkNewInsertion(inNewEvent, pronostico, currentEsito)) {
          return eventsAcc;
        }
        if (inNewEvent && eventsAcc.length > 0) {
          // ADDED new Esito in Event already present
          const esiti = eventsAcc[eventAccIndex].esiti;
          eventsAcc[eventAccIndex].esiti = [newEsito, ...esiti];
          return eventsAcc;
        }
        // ADDED new Event
        const newEvent = toEventoType(pronostico, newEsito);
        eventsAcc.push(newEvent);
        return eventsAcc;
      }, [] as EventoType[]);
      updateIndexCarrello(newerEvents);
      updateClientEvents(newerEvents);
      return;
    }

    const firstPronostico = pronosticiParams[0];
    const currentEvent = selectedEvents.find(
      (selectedEvent) =>
        selectedEvent.id ===
        `${firstPronostico.codicePalinsesto}_${firstPronostico.codiceDisciplina}_${firstPronostico.codiceAvvenimento}`,
    );
    const newEsito = toEsitoType(firstPronostico, 0);
    const currentEsito = currentEvent?.esiti.find((esito) => esito.id === newEsito.id);
    const isNewEvent = currentEvent === undefined;
    const newEvent = toEventoType(firstPronostico, newEsito);
    if (checkNewInsertion(isNewEvent, firstPronostico, currentEsito)) {
      const newEventsToUpdate = selectedEvents
        .map((evento) => {
          evento.esiti.filter((esito) => {
            return esito.id !== newEsito.id;
          });
          return evento;
        })
        .filter((evento) => evento.esiti.length > 0);
      updateClientEvents(newEventsToUpdate);
      return;
    }
    if (!currentEvent) {
      //ADD Event in Car
      updateIndexCarrello([newEvent, ...selectedEvents]);
      updateClientEvents([newEvent, ...selectedEvents]);
      return;
    }
    //const currentEsito = currentEvent.esiti.find((esito) => esito.id === newEsito.id);
    const newEsiti = !currentEsito
      ? //ADD Esito
        [newEsito, ...currentEvent.esiti]
      : // REMOVE Esito
        currentEvent.esiti.filter((es) => es !== currentEsito);
    const filterEvents = selectedEvents.filter((ev) => ev !== currentEvent);
    const updatedCurrentEvent = { ...currentEvent, esiti: newEsiti };
    //REMOVE Event already present
    const newEvents = [updatedCurrentEvent, ...filterEvents].filter((evento) => evento.esiti.length > 0);
    updateIndexCarrello(newEvents);
    updateClientEvents(newEvents);
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pronosticiParams]);

  // send back to rootcontainer the updated list of events
  useEffect(() => {
    const newPronosticiParamsList = selectedEvents.reduce(
      (prev: Array<PronosticiParamsType>, ev: EventoType) => [
        ...prev,
        ...ev.esiti.map((esito: any) => ({
          codicePalinsesto: ev.codicePalinsesto,
          codiceAvvenimento: ev.codiceAvvenimento,
          codiceScommessa: esito.codiceScommessa,
          codiceEsito: esito.codiceEsito,
          codiceClasseEsito: esito.codiceClasseEsito,
          codiceDisciplina: esito.codiceDisciplina,
          quota: esito.quota,
          descrizioneAvvenimento: esito.descrizioneAvvenimento,
          descrizioneScommessa: esito.descrizioneScommessa,
          idInfoAggiuntiva: esito.idInfoAggiuntiva,
          legameMultipla: esito.legameMultipla,
          legameMassimo: esito.legameMassimo,
          legameMinimo: esito.legameMinimo,
          multipla: esito.multipla,
          blackListMin: esito.blackListMin,
          blackListMax: esito.blackListMax,
          live: esito.live,
          isFissa: esito.fissa,
          formattedDataAvvenimento: esito.formattedDataAvvenimento,
          dataAvvenimento: esito.dataAvvenimento,
          codiceManifestazione: esito.codiceManifestazione,
          descrizioneEsito: esito.descrizioneEsito,
          siglaManifestazione: esito.siglaManifestazione,
          siglaDisciplina: esito.siglaDisciplina,
          avvenimento: esito.avvenimento,
          manifestazione: esito.manifestazione,
          disciplina: esito.disciplina,
        })),
      ],
      [],
    );
    setPronosticiParamsList(newPronosticiParamsList);
    updateRecord(newPronosticiParamsList);
  }, [updateRecord, selectedEvents]);

  useEffect(() => {
    if (currentSviluppoSistema !== undefined && legatureToShow !== undefined && currentSviluppoSistema.length > 0) {
      // TODO
      const legatureFixed = legatureToShow.filter(
        ({ indice: id1 }) => !legatureToShow.some(({ indice: id2 }) => id2 === id1),
      );
      const availableLegature = legatureToShow.filter(({ indice: id1 }) =>
        legatureToShow.some(({ indice: id2 }) => id2 === id1),
      );

      const changeBetLegatureFixed = legatureFixed.map((l) => {
        return { ...l, bet: 0 };
      });
      const updateLegatureBetting = [...availableLegature, ...changeBetLegatureFixed];
      const completedUpdateLegature = updateLegatureBetting.sort((a, b) => b.indice - a.indice);

      const AvailableLegatureToShow = completedUpdateLegature.map((l) => {
        return l.isAvailable ? l : { ...l, bet: 0 };
      });
      updateLegatureECarrello(AvailableLegatureToShow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSviluppoSistema, selectedEvents]);

  return {
    sistemaFooterData,
    giocataSistemisticaResponse,
    stampaRiepilogoRequest,
    sviluppiSistemaWithBonusApplicatoByCardinalita,
  };
};
