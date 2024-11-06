import { groupBy, min, uniq } from "lodash";
import { Sviluppo } from "src/components/prenotazioni/prenotazioni-api";
import { CartClientType, EsitoType, EventoType, SviluppoSistemaType } from "src/types/carrello.types";
import { makeChiaveAvvenimento, makeChiaveInfoAggiuntiva } from "src/types/chiavi";
import { CardinalityDeploymentType } from "src/types/ticket.types";

export function getBlankClientIndex(clients: CartClientType[]): number | undefined {
  for (let i = 0; i < clients.length; i++) {
    if (clients[i].selectedEvents.length === 0) return i;
  }
  return;
}

export function updateClient(
  clients: CartClientType[],
  events: EventoType[],
  puntata: number,
  clientIndexToModify: number,
  sviluppoSistema?: SviluppoSistemaType[],
): CartClientType[] {
  return clients.map((c, clientIndex) => {
    if (clientIndex === clientIndexToModify) {
      c.selectedEvents = events;
      c.puntata = puntata;
      if (sviluppoSistema) {
        c.sviluppoSistema = sviluppoSistema;
      }
    }
    return c;
  });
}

export function updateClientPuntata(clients: CartClientType[], puntata: number, index: number): CartClientType[] {
  return clients.map((c, clientIndex) => {
    if (clientIndex === index) {
      c.puntata = puntata;
    }
    return c;
  });
}

export function updateActiveClientPuntata(clients: CartClientType[], puntata: number): CartClientType[] {
  return clients.map((c) => {
    if (c.isCurrentClient) {
      c.puntata = puntata;
    }
    return c;
  });
}

export function getEventTicket(clients: CartClientType[]): boolean {
  return !clients.some((c) => c.selectedEvents.length > 0);
}

export function updateSviluppoSistemaType(
  winAmounts: Array<CardinalityDeploymentType>,
  currentSviluppoSistema?: Array<SviluppoSistemaType>,
) {
  const winAmountsValues = Object.values(winAmounts).reverse();
  if (currentSviluppoSistema !== undefined && winAmountsValues.length === currentSviluppoSistema.length) {
    return currentSviluppoSistema.map((legatura, i) => {
      return {
        ...legatura,
        winAmounts: {
          max: winAmountsValues[i].maximumWinningAmountCardinality
            ? winAmountsValues[i].maximumWinningAmountCardinality / 100
            : 0,
          min: winAmountsValues[i].minimumWinningAmountCardinality
            ? winAmountsValues[i].minimumWinningAmountCardinality / 100
            : 0,
        },
      };
    });
  }
}

export function getNewSviluppoSistema(
  selectedEvents: EventoType[],
  sviluppoSistemaRef: Array<SviluppoSistemaType> | undefined,
  currentSviluppoSistema?: Array<SviluppoSistemaType>,
) {
  // in questo caso Sviluppo sistema è vuoto e lo stiamo "caricando" tutto in una volta (ad esempio passando da Multipla a Sistema)
  if (
    (!currentSviluppoSistema || currentSviluppoSistema.length === 0) &&
    (!sviluppoSistemaRef || sviluppoSistemaRef.length === 0)
  ) {
    return getSviluppoSistemaPrediction(selectedEvents);
  }
  // in questo caso esiste uno Sviluppo sistema e lo stiamo "caricando" tutto in una volta (ad esempio passando da Multipla a Sistema) mantenendo le stesse punatte sulle legature
  if (
    (!currentSviluppoSistema || currentSviluppoSistema.length === 0) &&
    sviluppoSistemaRef !== undefined &&
    sviluppoSistemaRef.length !== 0
  ) {
    return getSviluppoSistemaMemoPrediction(sviluppoSistemaRef, selectedEvents);
  }

  // caso in cui si aggiunge un evento al carrello
  if (
    currentSviluppoSistema &&
    currentSviluppoSistema.length !== 0 &&
    currentSviluppoSistema.length < selectedEvents.length
  ) {
    return getSviluppoSistemaAddPrediction(currentSviluppoSistema, selectedEvents);
  }

  // tolgo un evento dal carrello (tolgo l'ultimo)
  if (currentSviluppoSistema && currentSviluppoSistema.length !== selectedEvents.length) {
    return getSviluppoSistemaRemoveLastPrediction(currentSviluppoSistema);
  }
  return currentSviluppoSistema;
}

function getSviluppoSistemaAddPrediction(
  currentSviluppoSistema: Array<SviluppoSistemaType>,
  selectedEvents: EventoType[],
) {
  currentSviluppoSistema.unshift({
    indice: selectedEvents.length,
    bet: 0,
    combinazioni: 1,
    isAvailable: true,
    winAmounts: { max: 0, min: 0 },
  });
  return currentSviluppoSistema;
}
function getSviluppoSistemaRemoveLastPrediction(currentSviluppoSistema: Array<SviluppoSistemaType>) {
  currentSviluppoSistema.shift();
  return currentSviluppoSistema;
}

function getSviluppoSistemaPrediction(selectedEvents: EventoType[]) {
  return selectedEvents.map((evento, index) => ({
    indice: selectedEvents.length - index,
    bet: 0,
    combinazioni: 1,
    isAvailable: true,
    winAmounts: { max: 0, min: 0 },
  }));
}

function getSviluppoSistemaMemoPrediction(sviluppoSistemaRef: SviluppoSistemaType[], selectedEvents: EventoType[]) {
  return selectedEvents.map((evento, index) => {
    return {
      indice: selectedEvents.length - index,
      bet:
        sviluppoSistemaRef.filter((cardinality) => {
          return cardinality.indice === selectedEvents.length - index;
        })[0] !== undefined
          ? sviluppoSistemaRef.filter((cardinality) => {
              return cardinality.indice === selectedEvents.length - index;
            })[0].bet
          : 0,
      combinazioni: 1,
      isAvailable: true,
      winAmounts: { max: 0, min: 0 },
    };
  });
}

export function canBeMultiple(events: EventoType[]): boolean {
  if (events.length === 0) {
    return false;
  }
  const predictions = events.reduce<EsitoType[]>((res, { esiti }) => {
    esiti.forEach((esito) => {
      res.push(esito);
    });
    return res;
  }, []);
  const hasLessThanTwoPredictions = predictions.length < 1;
  return (
    hasLessThanTwoPredictions ||
    (hasCompatibleInfoAggiuntivaKeys(predictions) &&
      canBeMultipleOnfirstBindableMarketTypeIds(predictions) &&
      canBeMultipleOnMaxBond(predictions) &&
      canBeMultipleOnBindables(predictions))
  );
}

function hasCompatibleInfoAggiuntivaKeys(predictions: EsitoType[]): boolean {
  const infoAggiuntivaKeys = predictions.reduce<string[]>((res, prediction) => {
    const { codicePalinsesto, codiceAvvenimento, codiceScommessa, idInfoAggiuntiva } = prediction;
    const key = makeChiaveInfoAggiuntiva({
      codicePalinsesto,
      codiceAvvenimento,
      codiceScommessa,
      idInfoAggiuntiva,
    });
    res.push(key);
    return res;
  }, []);
  return uniq(infoAggiuntivaKeys).length === infoAggiuntivaKeys.length;
}

function canBeMultipleOnfirstBindableMarketTypeIds(predictions: EsitoType[]): boolean {
  const firstLegameMultipla = predictions[0].legameMultipla;
  return predictions.every((prediction) => prediction.legameMultipla === firstLegameMultipla);
}

function canBeMultipleOnMaxBond(predictions: EsitoType[]): boolean {
  return !(allEventEqual(predictions) && getMinOfMaxBondValues(predictions) === 1);
}

function canBeMultipleOnBindables(predictions: EsitoType[]): boolean {
  const predictionsGroupedByRegulatorKey = groupBy(predictions, (prediction) => {
    const { codiceAvvenimento, codicePalinsesto } = prediction;
    return makeChiaveAvvenimento({ codiceAvvenimento, codicePalinsesto });
  });
  for (const regulatorKey in predictionsGroupedByRegulatorKey) {
    const currentPredictions = predictionsGroupedByRegulatorKey[regulatorKey];
    // MUST have at least 2 predictions belonging to the same event
    // to go ahead with the "multiple" value check
    if (currentPredictions.length > 1) {
      if (!allMultipleEqualAndOtherThanZero(currentPredictions) || allMultipleEqualZero(currentPredictions)) {
        return false;
      }
    }
  }
  return true;
}

function getMinOfMaxBondValues(predictions: EsitoType[]) {
  const maxBondList = predictions.reduce<number[]>((res, prediction) => {
    res.push(prediction.legameMassimo);
    return res;
  }, []);
  return min(maxBondList);
}
function allEventEqual(predictions: EsitoType[]) {
  const { codicePalinsesto, codiceAvvenimento } = predictions[0];
  const firstPredictionRegulatorKey = makeChiaveAvvenimento({
    codicePalinsesto,
    codiceAvvenimento,
  });
  return predictions.every(
    (p) =>
      makeChiaveAvvenimento({
        codicePalinsesto: p.codicePalinsesto,
        codiceAvvenimento: p.codiceAvvenimento,
      }) === firstPredictionRegulatorKey,
  );
}

function allMultipleEqualZero(predictions: EsitoType[]): boolean {
  return predictions.every((p) => p.multipla === 0);
}
function allMultipleEqualAndOtherThanZero(predictions: EsitoType[]): boolean {
  return predictions[0].multipla !== 0 && predictions.every((p) => p.multipla === predictions[0].multipla);
}

export function sviluppoToSviluppoSistemaType(sviluppo: Sviluppo) {
  return {
    indice: sviluppo.cardinalita,
    combinazioni: sviluppo.numeroSviluppi,
    bet: sviluppo.importo / 100,
    isAvailable: true,
    winAmounts: {
      max: sviluppo.vincitaMassima / 100,
      min: sviluppo.vincitaMinima / 100,
    },
  } as SviluppoSistemaType;
}

export function getTotalBetSviluppo(sviluppi: SviluppoSistemaType[]) {
  return sviluppi
    .filter((legatura) => legatura.isAvailable === true)
    .reduce((sum, legatura) => sum + legatura.bet * legatura.combinazioni, 0);
}
