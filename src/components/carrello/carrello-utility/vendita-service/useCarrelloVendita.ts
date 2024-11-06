import { useCallback, useContext, useState } from "react";
import { getVenditaMultipla } from "src/components/carrello/carrello-utility/vendita-service/getVenditaMultipla";
import { getVenditaSistema } from "src/components/carrello/carrello-utility/vendita-service/getVenditaSistema";
import { useCartClientsContext } from "src/components/common/context-clients/ClientsContext";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { SmartSearchState } from "src/components/smart-search/useSmartSearch";
import configuration from "src/helpers/configuration";
import { ApiService } from "src/services/FetchApiService";
import { APIResponseType } from "src/types/apiResponse.types";
import { BonusConfigClassType } from "src/types/bonusConfig.type";
import { EventoType, NewQuote, SviluppoSistemaType } from "src/types/carrello.types";
import { SviluppoSistema } from "src/types/sistemi.types";
import {
  AmountsChangedResponse,
  PreviewRequest,
  VenditaOptionalParameters,
  VenditaQFType,
  VenditaSportSistemisticaType,
} from "src/types/vendita.types";
import { StartSellingTransactionCallbacks, SellingRequest } from "src/services/useWebsocketTransaction";
import { mutate } from "swr";
import { PiedinoState } from "src/components/carrello-common/Piedino";

export const useCarrelloVendita = ({
  betMultipla,
  selectedEvents,
  totalBetSviluppo,
  potentialWinning,
  isWaitingVendi,
  setIsWaitingVendi,
  setCodiceEsitoVendita,
  setDescEsitoVendita,
  onStateChange,
  currentSviluppoSistema,
  setGiocataFrazionata,
  sellingBonusFactor,
  numMinEsitiBonusMultipla,
  bonusMultiplaExpired,
  activeClient,
  configBonusSystem,
  setShowChangeQuoteFlag,
  bonusQuotaMinima,
  sistemaFooterData,
  onLastSoldTicket,
  codiceEsitoVendita,
  updateClientEvents,
  stampaRiepilogoRequest,
  sviluppiSistemaWithBonusApplicatoByCardinalita,
  statusAccettazione,
  setStatusAccettazione,
  onStartSellingTransaction,
  isSistemaActive,
  activeClientId,
  piedino,
  onPiedinoChange,
}: {
  betMultipla: number;
  bonusMultiplaExpired: boolean;
  selectedEvents: Array<EventoType>;
  totalBetSviluppo: number;
  potentialWinning: number;
  isWaitingVendi: boolean;
  setIsWaitingVendi: (wait: boolean) => void;
  setCodiceEsitoVendita: (codice: string) => void;
  setDescEsitoVendita: (desc: string) => void;
  onStateChange(state: SmartSearchState): void;
  currentSviluppoSistema: SviluppoSistemaType[] | undefined;
  setGiocataFrazionata: (isSplitPlay: boolean) => void;
  sellingBonusFactor: number;
  numMinEsitiBonusMultipla: number;
  activeClient: number;
  configBonusSystem: BonusConfigClassType[] | undefined;
  setShowChangeQuoteFlag: (b: boolean) => void;
  codiceEsitoVendita: string;
  updateClientEvents: (selectedEvents: EventoType[]) => void;
  setBetMultipla: (bet: number, index: number) => void;
  isSistemaActive: boolean;
  bonusQuotaMinima: number;
  sistemaFooterData: { minWinningAmount: number; maxWinningAmount: number } | undefined;
  onLastSoldTicket(ticketId: string): void;
  stampaRiepilogoRequest: PreviewRequest;
  sviluppiSistemaWithBonusApplicatoByCardinalita?: SviluppoSistema[] | undefined;
  statusAccettazione: AmountsChangedResponse | undefined;
  setStatusAccettazione: (status: AmountsChangedResponse) => void;
  onStartSellingTransaction(params: SellingRequest, callback: StartSellingTransactionCallbacks): void;
  piedino: PiedinoState;
  onPiedinoChange(piedino: PiedinoState): void;
  activeClientId: number;
}) => {
  const [newQuote, setNewQuote] = useState<NewQuote[]>([]);
  const [errCombinationPrint, setErrorCombinationPrint] = useState<string>("");
  /**
   * CONTEXT
   *
   * - clients
   * - keyboardNavigation
   */
  const clients = useCartClientsContext();
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);

  const vendi = (params: SellingRequest, forceSell: boolean | undefined) => {
    onStartSellingTransaction(params, {
      onStart({ isSplitPlay }) {
        if (isSplitPlay) {
          if (forceSell) {
            setGiocataFrazionata(false);
          } else {
            setIsWaitingVendi(false);
            setGiocataFrazionata(true);
          }
        }
      },
      onStartError({ code, description }) {
        setIsWaitingVendi(false);
        setCodiceEsitoVendita(code);
        setDescEsitoVendita(description);
      },
      onSuccess(response) {
        setIsWaitingVendi(false);
        onLastSoldTicket(response.ticketId);
        setCodiceEsitoVendita(response.status);
        setDescEsitoVendita(response.ticketId);
        const activePiedino = piedino[activeClientId];
        onPiedinoChange({
          ...piedino,
          [activeClientId]: {
            totale: activePiedino.totale + params.payload.prezzo,
            riscosso: activePiedino.riscosso,
            emesso: activePiedino.emesso + 1,
          },
        });
        updateClientEvents([]);
        mutate("balanceAmountService");
      },
      onGenericError() {
        setIsWaitingVendi(false);
        setCodiceEsitoVendita(configuration.SELL_ERROR_CODE.GENERIC_ERROR);
        setDescEsitoVendita("Vendita non riuscita");
      },
      onAcceptanceAmountsChanged(response) {
        setIsWaitingVendi(false);
        setCodiceEsitoVendita(configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_AMOUNTS_CHANGED);
        setStatusAccettazione(response);
      },
      onUnderAcceptanceRejected() {
        setCodiceEsitoVendita(configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_REJECETED);
      },
      onUnderAcceptanceTimeout() {
        setCodiceEsitoVendita(configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_TIMEOUT);
      },
      onOddsChanged({ properties }) {
        setIsWaitingVendi(false);
        setShowChangeQuoteFlag(true);
        setCodiceEsitoVendita(configuration.SELL_STATUS.NOT_SELLING);
        const localNewQuote = properties.filter((property) => {
          return property.name === "attrExt";
        });
        if (localNewQuote[0]?.value && typeof localNewQuote[0].value === "string") {
          const scommesse: NewQuote[] = JSON.parse(localNewQuote[0].value).scommesse;
          if (scommesse) {
            setNewQuote(scommesse);
          }
        }
      },
      onUnderAcceptance({ properties }) {
        setIsWaitingVendi(false);
        setCodiceEsitoVendita(properties[0].value);
      },
      onSpecificError({ errorCodeObj, properties }) {
        setIsWaitingVendi(false);
        setCodiceEsitoVendita(properties[0].value);
        const errorCode = errorCodeObj && errorCodeObj.value ? errorCodeObj.value : "";
        const secondMsg = properties[1] !== undefined ? properties[1].value : "";
        setDescEsitoVendita("(" + properties[0].value + ") " + errorCode + ": " + secondMsg);
      },
    });
  };

  /** VENDITA MULTIPLA
   *
   * Elaborazione oggetto di vendita per caso singola/multipla
   */

  const venditaMultipla = useCallback(
    (params?: VenditaOptionalParameters) => {
      keyboardNavigationContext.current = "dialog-recupera-biglietto";
      const forceSell = params?.forceSell;
      const newFlag = params?.newFlag;
      setIsWaitingVendi(true);
      onStateChange({
        type: "0",
        subtype: { type: "inattivo" },
        text: "",
      });

      const { palinsestoVentitaList, attrExt } = getVenditaMultipla({
        selectedEvents,
        sellingBonusFactor,
        numMinEsitiBonusMultipla,
        bonusMultiplaExpired,
        bonusQuotaMinima,
        clients,
        activeClient,
        newFlag,
        statusAccettazione,
      });

      const venditaQF: VenditaQFType = {
        prezzo: clients[activeClient].puntata, //betMultipla,
        maxPag: params?.potentialWinning ? params.potentialWinning : potentialWinning,
        scommesse: palinsestoVentitaList,
        attrExt: attrExt,
        conto: "",
        force: forceSell ? forceSell : false,
      };
      vendi({ payload: venditaQF, type: "ACCUMULATOR" }, forceSell);
    },
    [selectedEvents, clients, potentialWinning, statusAccettazione, betMultipla],
  );

  /**VENDITA SISTEMA
   *
   * Elaborazione oggetto di vendita per caso sistema
   */
  const venditaSistema = useCallback(
    (params?: VenditaOptionalParameters) => {
      keyboardNavigationContext.current = "dialog-recupera-biglietto";
      const isPreview = params?.isPreview;
      const forceSell = params?.forceSell;
      const newFlag = params?.newFlag;
      if (!isPreview) {
        setIsWaitingVendi(true);
      }
      onStateChange({
        type: "0",
        subtype: { type: "inattivo" },
        text: "",
      });
      const sviluppi: SviluppoSistemaType[] = clients[activeClient].sviluppoSistema || [];
      const { numAvvBase, attrExt, sistemaRidotto } = getVenditaSistema({
        currentSviluppoSistema: sviluppi,
        selectedEvents,
        clients,
        activeClient,
        configBonusSystem,
        newFlag,
        sviluppiSistemaWithBonusApplicatoByCardinalita,
        statusAccettazione,
      });

      const isNumPredictionsEqualEvents =
        selectedEvents.reduce((a, b) => a + b.esiti.length, 0) === selectedEvents.length;

      const venditaSportSistemistica: VenditaSportSistemisticaType = {
        prezzo: Number(totalBetSviluppo.toFixed(2)),
        potentialWinningAmount: isNumPredictionsEqualEvents ? sistemaFooterData?.maxWinningAmount : undefined,
        sistemi: sistemaRidotto,
        numAvvBase: numAvvBase,
        attrExt: attrExt,
        conto: "",
        force: forceSell ? forceSell : false,
      };
      if (isPreview) {
        printSellPreview({ ...stampaRiepilogoRequest, venditaSportSistemisticaDTO: venditaSportSistemistica });
      } else {
        vendi({ payload: venditaSportSistemistica, type: "SYSTEM" }, forceSell);
      }
    },

    [
      selectedEvents,
      potentialWinning,
      totalBetSviluppo,
      sistemaFooterData,
      sviluppiSistemaWithBonusApplicatoByCardinalita,
      statusAccettazione,
    ],
  );

  const printSellPreview = (printPreviewObject: PreviewRequest) => {
    setIsWaitingVendi(false);
    ApiService()
      .post("ticket/preview/sport/system", printPreviewObject)
      .then((data: APIResponseType<any>) => {
        if (data.result === "Printed") {
          //TODO: utilizzare nuovi toast, indagare quale utilizzare in questa casistica
          setDescEsitoVendita("Anteprima stampata");
        } else if (data.error !== undefined || data.result === undefined) {
          setErrorCombinationPrint("Impossibile stampare anteprima");
        } else {
          setErrorCombinationPrint(data.result);
        }
      })
      .catch(() => {
        console.warn("something went wrong");
      });
  };

  /**
   * CHIAMATA AL SERVIZIO DI VENDITA
   *
   * - unificato per multipla e sistema
   * - @venditaObject: oggetto costruito negli hook precedenti
   * - @endpoint: url servizio
   * - @forceSell: forza la vendita quando ho una giocata frazionata
   * */

  const openDisanonimaModal = () => {
    window.alert("Disanonima e paga!");
  };

  const closeVendiDialog = () => {
    if (codiceEsitoVendita === configuration.SELL_STATUS.OK) {
      updateClientEvents([]);
    }
    setCodiceEsitoVendita(configuration.SELL_STATUS.NOT_SELLING);
    keyboardNavigationContext.current = "smart-search";
  };

  return {
    venditaMultipla,
    venditaSistema,
    openDisanonimaModal,
    newQuote,
    closeVendiDialog,
    errCombinationPrint,
    setErrorCombinationPrint,
    statusAccettazione,
    setStatusAccettazione,
  };
};
