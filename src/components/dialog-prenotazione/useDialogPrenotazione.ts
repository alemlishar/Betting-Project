import { NickName } from "src/types/chiavi";
import { useState } from "react";
import { Sviluppo, SviluppoSistema, Ticket, TicketResult } from "src/components/prenotazioni/prenotazioni-api";
import { CartClientType, SviluppoSistemaType, UpdateCartClients, EventoType } from "src/types/carrello.types";
import {
  getBlankClientIndex,
  getNewSviluppoSistema,
  sviluppoToSviluppoSistemaType,
  updateClient,
} from "src/components/carrello/helpers";
import { getSelectedEventsFromTicketResultList } from "src/components/dialog-prenotazione/getSelectedEventsFromTicketResultList";
import { AmountsChangedResponse, VenditaSuccessResponse } from "src/types/vendita.types";
import { TicketIndex } from "src/components/dialog-prenotazione/DialogPrenotazioneMultiBiglietto";
import configuration from "src/helpers/configuration";
import { getVenditaSistema } from "src/components/carrello/carrello-utility/vendita-service/getVenditaSistema";
import { getTicketType } from "src/components/prenotazioni/MenuPrenotazioni";
import { TicketTypeEnum } from "src/mapping/TicketTypeMapping";
import { SviluppoSistema as SviluppoSistemaCarrelloType } from "src/types/sistemi.types";
import { BonusConfigClassType } from "src/types/bonusConfig.type";
import { getSviluppoSistema } from "src/components/dialog-prenotazione/useSviluppoSistema";
import { getVenditaMultipla } from "src/components/carrello/carrello-utility/vendita-service/getVenditaMultipla";
import {
  calculateMaxWinning,
  calculatorEuroBonus,
  calculatorPercentualBonus,
  calculatorUnformattedPercentualBonus,
  evaluateBonusNotExpired,
  getBonusConfSystem,
  isBonusMultipla,
  producerOfTotalQuote,
} from "src/helpers/calculationUtils";
import { decimalToIntegerWithoutFormatting } from "src/helpers/formatUtils";
import { SellBookingRequest } from "src/services/useWebsocketTransaction";

export type DialogPrenotazioneState = {
  dialogPrenotazioneNickname: NickName | undefined;
  dialogPrenotazioneCode: NickName | undefined;
  dialogPrenotazioneNotAvailable: NickName | undefined;
  isMinimized: boolean;
  selledTickets: Record<TicketIndex, VenditaSuccessResponse["response"]>;
  notSelledTickets: Record<TicketIndex, string>;
  amountChangedTicketResponse?: AmountsChangedResponse;
  sellTicketState?: SellTicketStateType;
  actualTicketIndex: TicketIndex;
  totalSellTicket: number;
};

export type SellTicketStateType = {
  progressBarActualCounter: number;
  progressBarTotalCounter: number;
  ticketToSellIndex: number;
  isSellingWithProgressBar: boolean;
  ticketViewed: TicketIndex[];
  sellingFromList?: boolean;
  sellTicketStateWithNewOdd?: boolean; //TODO: Remove and use ticketViewed
  ticketList?: TicketResult[];
};

export const defaultDialogPrenotazioneState: DialogPrenotazioneState = {
  dialogPrenotazioneNickname: undefined,
  dialogPrenotazioneCode: undefined,
  dialogPrenotazioneNotAvailable: undefined,
  isMinimized: false,
  selledTickets: {},
  notSelledTickets: {},
  actualTicketIndex: 0,
  totalSellTicket: 0,
};

export type StatusSellBooking = {
  response: VenditaSuccessResponse["response"];
  payloadVendita: SellBookingRequest;
};

export function useDialogPrenotazione() {
  const [state, setState] = useState<DialogPrenotazioneState>(defaultDialogPrenotazioneState);
  return { state, setState };
}

export function getNotAvailableOutcomesStatus(ticket?: Ticket) {
  if (!ticket) {
    return undefined;
  }

  const notAvailableTicketResultList = ticket.results.filter(
    (ticket: TicketResult) => ticket.stato === 0 && !ticket.quota,
  );
  if (notAvailableTicketResultList.length > 0 && notAvailableTicketResultList.length !== ticket.results.length) {
    return configuration.NOT_AVAILABLE_OUTCOMES_STATUS.SOME;
  }
  if (notAvailableTicketResultList.length === ticket.results.length) {
    return configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL;
  }
  return configuration.NOT_AVAILABLE_OUTCOMES_STATUS.NOTANY;
}

export function modificaBiglietto(
  clients: CartClientType[],
  sviluppoSistema: SviluppoSistema | undefined,
  updateClients: UpdateCartClients,
  ticket: Ticket,
) {
  const blankClientIndex = getBlankClientIndex(clients);
  if (blankClientIndex === undefined) {
    return "error";
  }
  const selectedEvents = getSelectedEventsFromTicketResultList(ticket.results, true);

  const sviluppoSistemiParsed =
    sviluppoSistema &&
    getNewSviluppoSistema(
      selectedEvents,
      Object.values(sviluppoSistema.sviluppoByCardinalita)
        .map((sviluppo: Sviluppo) => {
          return sviluppoToSviluppoSistemaType(sviluppo);
        })
        .reverse(),
    );
  const clientsUpdate = updateClient(
    clients,
    selectedEvents,
    ticket.sellingPrice / 100,
    blankClientIndex,
    sviluppoSistemiParsed,
  );
  updateClients.setCartClients(clientsUpdate);
  updateClients.setActiveClientIndex(blankClientIndex);
  return "success";
}

export function getBonusForTicket(ticket: Ticket, bonusConfig?: BonusConfigClassType[]) {
  const bonusConfigMultipla = bonusConfig && bonusConfig[0];
  const bonusMultiplier = bonusConfigMultipla ? bonusConfigMultipla.bonusMultiplier : 0;
  const minimumOutcomes = bonusConfigMultipla ? bonusConfigMultipla.minimumOutcomes : 0;
  const minimumQuotaValue = bonusConfigMultipla ? bonusConfigMultipla.minimumQuotaValue : 0;
  const filteredResultList = ticket.results.filter(({ stato, quota }) => quota && stato !== 0); //filter result not in palimpsest

  const pronosticiPartecipantiBonus = filteredResultList.filter((ticket) => ticket.quota > minimumQuotaValue);

  const oddsToBeEvaluated = filteredResultList.map((ticketResult) => {
    return { quota: ticketResult.quota, date: ticketResult.dataAvvenimento };
  });

  const isBonus =
    oddsToBeEvaluated.length > 0 && bonusConfigMultipla && isBonusMultipla(bonusConfigMultipla, oddsToBeEvaluated);

  const sellingBonusFactor = isBonus ? bonusMultiplier / 100 : 1;

  const unformattedBonusPerc = isBonus
    ? calculatorUnformattedPercentualBonus(bonusMultiplier, minimumOutcomes, pronosticiPartecipantiBonus.length)
    : {
        value: 1,
        factor: 0,
      };

  const totalOdds = producerOfTotalQuote(
    oddsToBeEvaluated.map((odd) => {
      return odd.quota;
    }),
    unformattedBonusPerc,
  );

  const potentialWin = calculateMaxWinning(totalOdds, ticket.sellingPrice);

  const isBonusNotExpired =
    oddsToBeEvaluated.length > 0 && bonusConfigMultipla
      ? evaluateBonusNotExpired(
          bonusConfigMultipla,
          oddsToBeEvaluated.filter((esiti) => esiti.quota > minimumQuotaValue),
        )
      : false;

  const bonusInEuro = isBonus ? calculatorEuroBonus(unformattedBonusPerc, ticket.sellingPrice, totalOdds) : "";

  const percentualBonus = isBonus
    ? calculatorPercentualBonus(bonusMultiplier, minimumOutcomes, pronosticiPartecipantiBonus.length)
    : 1;

  return {
    totalOdds,
    potentialWin,
    bonusInEuro,
    isBonusNotExpired,
    minimumOutcomes,
    minimumQuotaValue,
    sellingBonusFactor,
    percentualBonus,
  };
}

export const getPayloadVendita = async (
  ticket: Ticket,
  nickname: NickName,
  selectedEvents: Array<EventoType>,
  allTicketsSent = false,
  amountChangedTicketResponse: AmountsChangedResponse | undefined,
  bonusConfig?: BonusConfigClassType[],
) => {
  const ticketType = getTicketType(ticket);
  const sviluppoSistema = ticketType === "Sistema" ? await getSviluppoSistema(ticket) : undefined;

  if (ticketType === "Sistema") {
    if (sviluppoSistema) {
      const configBonusSystem: BonusConfigClassType[] = getBonusConfSystem(selectedEvents, bonusConfig);
      const currentSviluppoSistema = Object.values(sviluppoSistema.sviluppoByCardinalita).map((sviluppo) => {
        return {
          indice: sviluppo.cardinalita,
          combinazioni: sviluppo.numeroSviluppi,
          bet: sviluppo.importo / 100,
          isAvailable: true,
          winAmounts: {
            max: sviluppo.vincitaMassima / 100,
            min: sviluppo.vincitaMinima / 100,
          },
        };
      }) as SviluppoSistemaType[];

      const sviluppiSistemaWithBonusApplicatoByCardinalita: SviluppoSistemaCarrelloType[] | undefined = Object.values(
        sviluppoSistema.sviluppoByCardinalita,
      ).filter((sviluppo: SviluppoSistemaCarrelloType) => {
        return sviluppo.bonusApplicato === true && sviluppo.importo > 0;
      });

      const { numAvvBase, attrExt, sistemaRidotto } = getVenditaSistema({
        currentSviluppoSistema,
        selectedEvents,
        clients: [],
        activeClient: 3,
        configBonusSystem,
        newFlag: 2,
        sviluppiSistemaWithBonusApplicatoByCardinalita,
        statusAccettazione: amountChangedTicketResponse,
      });

      return {
        ticket: {
          nickname: nickname,
          ticketId: ticket.index,
          ticketType: TicketTypeEnum.SYSTEM,
          allTicketsSent: allTicketsSent,
          prezzo: ticket.sellingPrice / 100,
          sistemi: sistemaRidotto,
          attrExt: attrExt,
          numAvvBase: numAvvBase,
          conto: "", //TODO
          force: false, //TODO
        },
      };
    }
  } else {
    const {
      potentialWin,
      isBonusNotExpired,
      minimumOutcomes,
      minimumQuotaValue,
      sellingBonusFactor,
    } = getBonusForTicket(ticket, bonusConfig);

    const { palinsestoVentitaList, attrExt } = getVenditaMultipla({
      selectedEvents,
      sellingBonusFactor,
      numMinEsitiBonusMultipla: minimumOutcomes,
      bonusMultiplaExpired: isBonusNotExpired,
      bonusQuotaMinima: minimumQuotaValue,
      clients: [],
      newFlag: 2,
      activeClient: 0,
      statusAccettazione: amountChangedTicketResponse,
    });

    return {
      ticket: {
        nickname: nickname,
        ticketId: ticket.index,
        ticketType: TicketTypeEnum.ACCUMULATOR,
        allTicketsSent: allTicketsSent,
        prezzo: ticket.sellingPrice / 100,
        maxPag: decimalToIntegerWithoutFormatting(potentialWin).toFixed(2),
        scommesse: palinsestoVentitaList,
        attrExt: attrExt,
        conto: "",
        force: false,
      },
    };
  }
};
