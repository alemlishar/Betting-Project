import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useUser } from "src/components/authentication/useUser";
import { PiedinoState } from "src/components/carrello-common/Piedino";
import { AvvenimentiList } from "src/components/carrello/avvenimenti/AvvenimentiList";
import { MultiplaFooter } from "src/components/carrello/avvenimenti/footer/MultiplaFooter";
import { SistemaFooter } from "src/components/carrello/avvenimenti/footer/SistemaFooter";
import { CarrelloFooter } from "src/components/carrello/carrello-utility/CarrelloFooter";
import { StyledCarrelloBody } from "src/components/carrello/carrello-utility/cart-style/Carrello.style";
import { useCarrelloMultiple } from "src/components/carrello/carrello-utility/ticket-multiple-management/useCarrelloMultiple";
import { useCarrelloSviluppoSistema } from "src/components/carrello/carrello-utility/ticket-system-management/useCarrelloSviluppoSistema";
import { useCarrelloSystemBonus } from "src/components/carrello/carrello-utility/ticket-system-management/useCarrelloSystemBonus";
import { useCarrelloCheckInserimento } from "src/components/carrello/carrello-utility/useCarrelloCheckInserimento";
import { CarrelloClientsState } from "src/components/carrello/carrello-utility/useCarrelloClientsState";
import { useCarrelloErrors } from "src/components/carrello/carrello-utility/useCarrelloErrors";
import { useCarrelloFetching } from "src/components/carrello/carrello-utility/useCarrelloFetching";
import { useCarrelloShortcuts } from "src/components/carrello/carrello-utility/useCarrelloShortcuts";
import { OnTicketSale } from "src/components/carrello/carrello-utility/vendita-service/onTicketSale";
import { useCarrelloVendita } from "src/components/carrello/carrello-utility/vendita-service/useCarrelloVendita";
import { CarrelloHeader } from "src/components/carrello/header/CarrelloHeader";
import { updateClientPuntata } from "src/components/carrello/helpers";
import { ImpostazioniScommessa } from "src/components/carrello/impostazioni-scommessa/impostazioniScommessa";
import { SviluppoSistema } from "src/components/carrello/sviluppo-sistema/SviluppoSistema";
import { AlertAcceptanceAmountsChanged } from "src/components/common/blocking-alert/AlertAcceptanceAmountsChanged";
import { Alert } from "src/components/common/blocking-alert/BlockingAlert";
import { useCartClientsContext, useUpdateClientsContext } from "src/components/common/context-clients/ClientsContext";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { DisanonimaDialog } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { GiocataFrazionataAlert } from "src/components/common/full-screen-alert/GiocataFrazionataAlert";
import { SogliaAlert } from "src/components/common/sogliaAlert/sogliaAlert";
import { Toast } from "src/components/common/toast-message/Toast";
import { VariazioneQuote } from "src/components/common/variazione-quote/VariazioneQuote";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { SmartSearchState } from "src/components/smart-search/useSmartSearch";
import configuration from "src/helpers/configuration";
import { SellingRequest, StartSellingTransactionCallbacks } from "src/services/useWebsocketTransaction";
import { CartErrorsType, EsitoType, EventoType } from "src/types/carrello.types";
import { PronosticiParamsType } from "src/types/pronosticiParams.types";
import { AmountsChangedResponse } from "src/types/vendita.types";
import { css } from "styled-components/macro";

export function Carrello({
  codiceEsitoVendita,
  setCodiceEsitoVendita,
  pronosticiParams,

  updateRecord,
  activatePuntata,
  setActivatePuntata,
  onStateChange,
  onLastSoldTicket,
  pushToast,
  onStartSellingTransaction,
  piedino,
  onPiedinoChange,
  activeClientId,
  sezione,
  activeClient,
  setActiveClient,
  selectedEvents,
  currentSviluppoSistema,
  updateClientEvents,
  updateClientImpostazioni,
  updateAllClientsImpostazioni,
  updateClientSviluppoSistema,
  isSistemaActive,
}: {
  pronosticiParams?: Array<PronosticiParamsType>;

  codiceEsitoVendita: string;
  setCodiceEsitoVendita: (e: string) => void;
  updateRecord: (events: Array<any>) => void;
  activatePuntata: number;
  setActivatePuntata: (activatePuntata: number) => void;
  onStateChange(state: SmartSearchState): void;
  onLastSoldTicket(ticketId: string): void;
  pushToast(content: React.ReactNode, duration: number): void;
  onStartSellingTransaction(params: SellingRequest, callback: StartSellingTransactionCallbacks): void;
  piedino: PiedinoState;
  onPiedinoChange(piedino: PiedinoState): void;
  activeClientId: number;
  sezione: string;
} & CarrelloClientsState) {
  const { openBlockingAlertState, closeBlockingAlertState } = useNavigazioneActions();
  const user = useUser();
  //TODO: REMOVE isUserLoggedIn

  const isUserLoggedIn = useMemo(() => {
    return user.state !== configuration.RESPONSE_FETCH.CURRENT_USER_NOT_LOGGED;
  }, [user]);

  /**
   * CONTEXT
   *
   * - Clients
   * - Impostazioni
   */

  const clients = useCartClientsContext();
  const updateClients = useUpdateClientsContext();
  const { impostazioni } = useContext(GlobalStateContext);

  /**
   * CLIENT SETTINGS
   */
  const [valuePredefinita, setValuePredefinita] = useState(false);
  const changeValuePredefinita = (value: boolean) => {
    setValuePredefinita(value);
  };
  /**
   * LAYOUT STATE // TODO
   **/

  const [isDefaultSettingsChange, setIsDefaultSettingsChange] = useState<boolean | undefined>(undefined);

  const [eventsAreHighlighted, setEventsAreHighlighted] = useState(false);
  const [isPuntataMultiplaHighlighted, setIsPuntataMultiplaHighlighted] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isWaitingVendi, setIsWaitingVendi] = useState(false);
  const [descEsitoVendita, setDescEsitoVendita] = useState("");
  const [isOptionActive, setOptionActive] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [triggerChange, setTriggerChange] = useState(false);
  const [isGiocataFrazionata, setGiocataFrazionata] = useState<boolean | undefined>(undefined);
  const [showChangeQuoteFlag, setShowChangeQuoteFlag] = useState(false);
  const isIntegrale = selectedEvents.filter((evento: any) => evento.esiti.length > 1).length > 0;
  const [isSogliaSuperato, setSogliaSuperato] = useState<boolean | undefined>(false);
  const [statusAccettazione, setStatusAccettazione] = useState<AmountsChangedResponse | undefined>();
  const oldPuntata = useRef<number>(0);

  //TODO: spostare in layout
  const updateIndexCarrello = (arrayEvents: Array<EventoType>) => {
    var carrelloIndice = 0;

    carrelloIndice = arrayEvents
      .map((evento: EventoType) => evento.esiti.length)
      .reduce((acc, element) => acc + element, 0);
    arrayEvents.map((evento: EventoType) =>
      evento.esiti.map((esito: EsitoType) => {
        esito.indice = carrelloIndice;
        carrelloIndice--;
        return null;
      }),
    );
  };

  /**
   * CHECK NEW INSERTION TO CART:
   *
   * - add incopatible outcomes
   * - multiple/system
   *
   */

  const { checkNewInsertion } = useCarrelloCheckInserimento({
    selectedEvents,
    setErrorText,
    isIntegrale,
  });

  /**
   * SINGOLA/MULTIPLA
   *
   * - Winning Amount
   * - Bonus Configuration
   * - Bet
   */

  const setBetMultipla = useCallback(
    (newPuntata: number, activeClientIndex: number) => {
      const newClientData = updateClientPuntata(clients, newPuntata, activeClientIndex);
      updateClients.setCartClients(newClientData);
    },
    [clients, updateClients],
  );

  const betMultipla = useMemo(() => {
    return clients[activeClient].puntata;
  }, [clients, activeClient]);

  const {
    bonusMultipla,
    sellingBonusFactor,
    numMinEsitiBonusMultipla,
    bonusMultiplaExpired,
    bonusQuotaMinima,
    calculateBonusMultipla,
    potentialWinning,
    totQuote,
    getPotentialWin,
  } = useCarrelloMultiple({ selectedEvents, setBetMultipla });

  /**
   * SVILUPPO SISTEMA
   *
   * TotalBetSviluppo is just the sum of all bettings
   * GetSviluppoForCurrentCart and LegatureToShow create and change the sviluppo sistema according to cart events and number of fixed
   * UpdateIsFixed fixes an event
   *
   */

  const {
    updateIsFixed,
    updateSviluppoWinAmounts,
    isCombinazioniMinimeErr,
    sistemaBetisLessThan2,
    calculateBonusEsitiSistema,
    legatureToShow,
    setTotalBetSviluppo,
    setLegatureToShow,
    totalBetSviluppo,
    sviluppoSistemaOpen,
    setSviluppoSistemaOpen,
    switchSviluppoSistema,
    isBetNull,
    updateClientOldSviluppoSistema,
  } = useCarrelloSviluppoSistema({
    currentSviluppoSistema,
    selectedEvents,
    updateClientEvents,
    updateClientSviluppoSistema,
    isSistemaActive,
    activeClient,
  });

  const { configBonusSystem } = useCarrelloSystemBonus({
    selectedEvents,
    isSistemaActive,
    calculateBonusEsitiSistema,
  });

  /**
   * CARRELLO FETCHING
   *
   * Executing and handling all backend calls.
   *
   * 1. Pronostici: fetch events data.
   * It's first triggered whenever an Esito is clicked in the SmartSearch section (adds/remove from carrello)
   * and then it's periodically called to keep quotes updated.
   *
   * 2. Calculations: get max and min potential win for sistemi.
   * It's triggered whenever something in the sviluppo sistema change
   *
   * 3. Bonus: ??
   *
   */

  const {
    sistemaFooterData,
    stampaRiepilogoRequest,
    sviluppiSistemaWithBonusApplicatoByCardinalita,
    giocataSistemisticaResponse,
  } = useCarrelloFetching({
    updateRecord,
    updateSviluppoWinAmounts,
    updateClientEvents,
    selectedEvents,
    pronosticiParams,

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
  });

  /**
   * CARRELLO ERRORS
   *
   * Validate keeps track of globals errors in Carrello
   * IsSistemaVendiActive and IsMultiplaVendiActive activate the "vendi" buttons
   */

  const { validate, setValidate, isSistemaVendiActive, isMultiplaVendiActive } = useCarrelloErrors(
    sistemaFooterData?.maxWinningAmount,
  );

  /**
   * VENDITA
   *
   */

  const {
    venditaMultipla,
    venditaSistema,
    openDisanonimaModal,
    newQuote,
    errCombinationPrint,
    setErrorCombinationPrint,
  } = useCarrelloVendita({
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
    setBetMultipla,
    isSistemaActive,
    stampaRiepilogoRequest,
    sviluppiSistemaWithBonusApplicatoByCardinalita,
    statusAccettazione,
    setStatusAccettazione,
    onStartSellingTransaction,
    activeClientId,
    piedino,
    onPiedinoChange,
  });

  const { dismissVariazioneQuoteModal } = OnTicketSale({
    newQuote,
    activeClient,
    isWaitingVendi,
    showChangeQuoteFlag,
    codiceEsitoVendita,
    onStateChange,
    updateClientEvents,
    setShowChangeQuoteFlag,
  });

  /**
   * SHORTCUTS
   *
   */
  useCarrelloShortcuts({
    isUserLoggedIn,
    isSistemaVendiActive,
    isMultiplaVendiActive,
    isSistemaActive,
    sviluppoSistemaOpen,
    isPuntataMultiplaHighlighted,
    setIsPuntataMultiplaHighlighted,
    eventsAreHighlighted,
    setEventsAreHighlighted,
    clients,
    activeClient,
    setSviluppoSistemaOpen,
    setActiveClient,
    activatePuntata,
    switchSviluppoSistema,
    validate,
    isBetNull,
    setActivatePuntata,
    venditaMultipla,
    venditaSistema,
    isWaitingVendi,
    onStateChange,
    setSogliaSuperato,
    showChangeQuoteFlag,
    dismissVariazioneQuoteModal,
    potentialWinning,
  });
  /**
   * END OF SALE or PAYMENT
   */

  //TODO gestire pagamento

  const intl = useIntl();

  /**
   * Toast Menagment
   */

  useEffect(() => {
    if (errCombinationPrint !== "") {
      pushToast(<Toast type="danger" heading={"Operazione non consentita"} description={errCombinationPrint} />, 5000);
    }
  }, [errCombinationPrint, pushToast]);

  /**
   * Blocking Alert Management
   */

  const onCloseBlockingAlert = useCallback(() => {
    closeBlockingAlertState();
    setStatusAccettazione(undefined);
    setCodiceEsitoVendita(configuration.SELL_STATUS.NOT_SELLING);
    setDescEsitoVendita("");
    setErrorText("");
  }, [closeBlockingAlertState, setCodiceEsitoVendita]);

  const onCloseBlockingAlertAcceptanceRejectAmount = useCallback(() => {
    closeBlockingAlertState();
    setCodiceEsitoVendita(configuration.SELL_STATUS.NOT_SELLING);
    setDescEsitoVendita("");
    setStatusAccettazione(undefined);
    setErrorText("");
    updateClientEvents([]);
    pushToast(
      <Toast
        type="danger"
        heading={
          <FormattedMessage
            defaultMessage="Scommessa non andata a buon fine"
            description="Heading of bet unsuccessful of rejected amount changed alert"
          />
        }
        description={
          <FormattedMessage
            defaultMessage="Nessun importo da riscuotere"
            description="Description of bet unsuccessful of rejected amount changed alert"
          />
        }
      />,
      5000,
    );
  }, [closeBlockingAlertState, setCodiceEsitoVendita]);

  const onAcceptTaglioImporto = useCallback(() => {
    if (isSistemaActive) {
      const newSviluppi = clients[activeClient].sviluppoSistema?.map((sviluppoSistema) => {
        const newSviluppo = statusAccettazione?.attrExtConsole.amount.numSviluppi.find(
          (numSviluppo) => numSviluppo.tipo === sviluppoSistema.indice,
        );
        return newSviluppo ? { ...sviluppoSistema, bet: newSviluppo.amount / 100 } : sviluppoSistema;
      });

      updateClientSviluppoSistema(newSviluppi);
      setTimeout(() => {
        //DEBT: temporary workaround
        venditaSistema();
      }, 1000);
    } else {
      const newPuntata = statusAccettazione!.attrExtConsole.amount.amount / 100;
      setBetMultipla(newPuntata, activeClient);
      venditaMultipla({ potentialWinning: getPotentialWin(newPuntata) });
    }
  }, [
    statusAccettazione,
    setBetMultipla,
    venditaMultipla,
    venditaSistema,
    updateClients,
    potentialWinning,
    isSistemaActive,
    clients,
  ]);

  useEffect(() => {
    if (errorText !== "") {
      return openBlockingAlertState(
        <Alert
          type={"danger"}
          heading={intl.formatMessage({
            defaultMessage: "Operazione non consentita",
            description: "generic sell error alert",
          })}
          description={errorText}
          onClose={onCloseBlockingAlert}
        />,
      );
    }
    if (!isWaitingVendi && codiceEsitoVendita === configuration.SELL_STATUS.NOT_SELLING) {
      return closeBlockingAlertState();
    }
    if (isWaitingVendi) {
      return openBlockingAlertState(
        <Alert
          type={"warning"}
          heading={intl.formatMessage({
            defaultMessage: "Vendita del biglietto in corso",
            description: "waiting sell header title of sell alert",
          })}
          description={intl.formatMessage({
            defaultMessage: "Attendi l'esito per poter effettuare nuove operazioni",
            description: "waiting sell description title of sell alert",
          })}
          hasHourGlassIcon={true}
        />,
      );
    }
    switch (codiceEsitoVendita) {
      case configuration.SELL_STATUS.OK: {
        setCodiceEsitoVendita(configuration.SELL_STATUS.NOT_SELLING);
        setDescEsitoVendita("");
        setStatusAccettazione(undefined);
        updateClientEvents([]);
        return pushToast(
          <Toast
            type="success"
            heading={intl.formatMessage({
              defaultMessage: "La scommessa è andata a buon fine",
              description: "success sell header of sell toast",
            })}
            description={descEsitoVendita}
          />,
          5000,
        );
      }
      case configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE: {
        oldPuntata.current = isSistemaActive ? totalBetSviluppo : betMultipla;
        return openBlockingAlertState(
          <Alert
            type={"warning"}
            heading={intl.formatMessage({
              defaultMessage: "Scommessa in accettazione",
              description: "default header title of acceptance alert",
            })}
            description={intl.formatMessage({
              defaultMessage:
                "I nostri quotisti stanno valutando la tua scommessa, attendi l’esito per poter effettuare nuove operazioni",
              description: "description of acceptance alert",
            })}
          />,
        );
      }
      case configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_REJECETED: {
        return openBlockingAlertState(
          <Alert
            type={"danger"}
            heading={intl.formatMessage({
              defaultMessage: "Scommessa rifiutata",
              description: "accettazione rifiutata header title of sell alert",
            })}
            description={intl.formatMessage({
              defaultMessage: "I nostri quotisti non hanno accettato la giocata",
              description: "accettazione rifiutata description title of sell alert",
            })}
            primaryButtonAction={() => {
              onCloseBlockingAlert();
              updateClientEvents([]);
            }}
            primaryButtonText={intl.formatMessage({
              defaultMessage: "Chiudi",
              description: "close button of rejected acceptance alert",
            })}
          />,
        );
      }
      case configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_TIMEOUT: {
        return openBlockingAlertState(
          <Alert
            type={"danger"}
            heading={intl.formatMessage({
              defaultMessage: "Scommessa non valutata",
              description: "accettazione in timeout header title of sell alert",
            })}
            description={intl.formatMessage({
              defaultMessage:
                "A causa dell'intenso traffico non siamo riusciti a prendere in carico la richiesta. Riprova ad effettuare la vendita",
              description: "accettazione in timeout description of sell alert",
            })}
            primaryButtonAction={() => {
              isSistemaActive ? venditaSistema() : venditaMultipla();
            }} //TODO: Test
            primaryButtonText={intl.formatMessage({
              defaultMessage: "Riprova",
              description: "riprova button of timeout acceptance alert",
            })}
            secondaryButtonAction={onCloseBlockingAlert}
            secondaryButtonText={intl.formatMessage({
              defaultMessage: "Annulla",
              description: "annulla button of timeout acceptance alert",
            })}
          />,
        );
      }
      case configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_AMOUNTS_CHANGED: {
        const newPuntata = Number(statusAccettazione?.attrExtConsole.amount.amount);
        return openBlockingAlertState(
          <AlertAcceptanceAmountsChanged
            primaryButtonAction={onAcceptTaglioImporto}
            secondaryButtonAction={onCloseBlockingAlertAcceptanceRejectAmount}
            oldPuntata={oldPuntata.current}
            newPuntata={newPuntata}
          />,
        );
      }
      default: {
        return openBlockingAlertState(
          <Alert
            type={"danger"}
            heading={intl.formatMessage({
              defaultMessage: "Vendita del biglietto non riuscita",
              description: "default header title of sell alert",
            })}
            description={descEsitoVendita}
            onClose={onCloseBlockingAlert}
          />,
        );
      }
    }
  }, [
    closeBlockingAlertState,
    codiceEsitoVendita,
    descEsitoVendita,
    errorText,
    intl,
    isSistemaActive,
    isWaitingVendi,
    onCloseBlockingAlert,
    openBlockingAlertState,
    pushToast,
    setCodiceEsitoVendita,
    updateClientEvents,
    venditaMultipla,
    venditaSistema,
    statusAccettazione,
    betMultipla,
    updateClientSviluppoSistema,
    clients,
    activeClient,
    totalBetSviluppo,
    isSistemaActive,
  ]);

  return (
    <>
      <SviluppoSistema
        isCombinazioniMinimeErr={isCombinazioniMinimeErr}
        legature={currentSviluppoSistema}
        legatureToShow={legatureToShow}
        isOpen={sviluppoSistemaOpen}
        switchSviluppoSistema={switchSviluppoSistema}
        updateClientSviluppoSistema={updateClientSviluppoSistema}
        totalBetSviluppo={totalBetSviluppo}
        setEventsAreHighlighted={setEventsAreHighlighted}
        eventsAreHighlighted={eventsAreHighlighted}
        validate={validate}
        setValidate={(e: CartErrorsType) => setValidate({ ...validate, ...e })}
        onStateChange={onStateChange}
        sistemaBetisLessThan2={sistemaBetisLessThan2}
        venditaSistema={venditaSistema}
        setErrorCombinationPrint={setErrorCombinationPrint}
      />
      <div>
        {isGiocataFrazionata && (
          <GiocataFrazionataAlert
            closeDialog={() => {
              setGiocataFrazionata(false);
            }}
            forceSell={isSistemaActive ? venditaSistema : venditaMultipla}
            disanonima={openDisanonimaModal}
          />
        )}
      </div>
      <div>
        {isSogliaSuperato && (
          <SogliaAlert
            closeDialog={() => {
              setSogliaSuperato(false);
            }}
            onDismiss={() => setSogliaSuperato(false)}
            onContinue={() => {
              setSogliaSuperato(false);
              openBlockingAlertState(
                <DisanonimaDialog totalAmount={(isSistemaActive ? totalBetSviluppo : betMultipla) * 100} />, //DEBT togliere * 100 quando ci arriveranno in centesimi
              );
            }}
          />
        )}
      </div>
      <div>
        {showChangeQuoteFlag && (
          <VariazioneQuote
            selectedEvents={selectedEvents}
            isSistema={isSistemaActive}
            bet={isSistemaActive ? totalBetSviluppo : betMultipla}
            potentialWinning={potentialWinning}
            bonusMultipla={bonusMultipla}
            calculateBonusMultipla={calculateBonusMultipla}
            sistemaFooterData={sistemaFooterData}
            sistemaIntegrale={isIntegrale}
            totQuote={totQuote}
            dismissVariazioneQuoteModal={dismissVariazioneQuoteModal}
            venditaMultipla={venditaMultipla}
            venditaSistema={venditaSistema}
            setShowChangeQuoteFlag={setShowChangeQuoteFlag}
          />
        )}
      </div>

      <CarrelloHeader
        isSistema={isSistemaActive}
        activeClient={activeClient}
        setActiveClient={setActiveClient}
        updateClientOldSviluppoSistema={updateClientOldSviluppoSistema}
        updateClientEvents={updateClientEvents}
        activatePuntata={activatePuntata}
        setActivatePuntata={setActivatePuntata}
        isOptionActive={isOptionActive}
        setOptionActive={setOptionActive}
        setIsChange={setIsChange}
        setTriggerChange={setTriggerChange}
        setSviluppoSistemaOpen={setSviluppoSistemaOpen}
      />
      <ImpostazioniScommessa
        isDefaultSettingsChange={isDefaultSettingsChange}
        setIsDefaultSettingsChange={setIsDefaultSettingsChange}
        updateAllClientsImpostazioni={updateAllClientsImpostazioni}
        updateClientImpostazioni={updateClientImpostazioni}
        activeClient={activeClient}
        isOptionActive={isOptionActive}
        setOptionActive={setOptionActive}
        setIsChange={setIsChange}
        valuePredefinita={valuePredefinita}
        setValuePredefinita={changeValuePredefinita}
        isChange={isChange}
        triggerChange={triggerChange}
        setTriggerChange={setTriggerChange}
      />
      <StyledCarrelloBody>
        <div
          css={css`
            flex-grow: 1;
            position: relative;
          `}
        >
          <div
            css={css`
              position: absolute;
              width: 100%;
              height: 100%;
            `}
          >
            <AvvenimentiList
              updateIsFixed={updateIsFixed}
              isSistema={isSistemaActive}
              selectedEvents={selectedEvents}
              updateClientEvents={updateClientEvents}
              eventsAreHighlighted={eventsAreHighlighted}
              setEventsAreHighlighted={setEventsAreHighlighted}
              sviluppoSistemaOpen={sviluppoSistemaOpen}
              setSviluppoSistemaOpen={setSviluppoSistemaOpen}
              onStateChange={onStateChange}
            />
          </div>
        </div>
        {selectedEvents.length > 0 && !isSistemaActive && (
          <MultiplaFooter
            bet={betMultipla}
            setBet={setBetMultipla}
            potentialWinning={potentialWinning}
            bonusMultipla={bonusMultipla}
            calculateBonusMultipla={calculateBonusMultipla}
            totQuote={totQuote}
            validate={validate}
            setValidate={(e: CartErrorsType) => setValidate({ ...validate, ...e })}
            selectedEvents={selectedEvents}
            updateClientEvents={updateClientEvents}
            isPuntataMultiplaHighlighted={isPuntataMultiplaHighlighted}
            setIsPuntataMultiplaHighlighted={setIsPuntataMultiplaHighlighted}
            venditaMultipla={venditaMultipla}
            isMultiplaActive={!isSistemaActive}
            setSogliaSuperato={setSogliaSuperato}
            bonusQuotaMinima={bonusQuotaMinima}
            numMinEsitiBonusMultipla={numMinEsitiBonusMultipla}
            impostazioni={impostazioni}
            pushToast={pushToast}
          />
        )}
        {selectedEvents.length > 0 && isSistemaActive && (
          <SistemaFooter
            isBetNull={isBetNull}
            sviluppoSistemaOpen={sviluppoSistemaOpen}
            switchSviluppoSistema={switchSviluppoSistema}
            bet={totalBetSviluppo}
            sistemaFooterData={sistemaFooterData}
            isValid={isSistemaVendiActive}
            sistemaIntegrale={isIntegrale}
            venditaSistema={venditaSistema}
            selectedEvents={selectedEvents}
            updateClientEvents={updateClientEvents}
            updateIndexCarrello={updateIndexCarrello}
            validate={validate}
            setValidate={(e: CartErrorsType) => setValidate({ ...validate, ...e })}
            setSogliaSuperato={setSogliaSuperato}
            giocataSistemisticaResponse={giocataSistemisticaResponse}
            impostazioni={impostazioni}
            pushToast={pushToast}
          />
        )}
      </StyledCarrelloBody>

      {(validate.sogliaAntiriciclaggioValidation ||
        validate.betSistemaIsGreaterThanUserMax ||
        isDefaultSettingsChange !== undefined) && (
        <CarrelloFooter
          isSistemaActive={isSistemaActive}
          bet={isSistemaActive ? totalBetSviluppo : betMultipla}
          validate={validate}
          setValidate={setValidate}
          isDefaultSettingsChange={isDefaultSettingsChange}
        />
      )}
    </>
  );
}
