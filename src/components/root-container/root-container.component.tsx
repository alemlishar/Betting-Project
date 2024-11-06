import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { Piedino, PiedinoState } from "src/components/carrello-common/Piedino";
import { CarrelloVirtual } from "src/components/carrello-virtual/CarrelloVirtual";
import { Carrello } from "src/components/carrello/Carrello";
import { StyledCarrelloWrapper } from "src/components/carrello/carrello-utility/cart-style/Carrello.style";
import { useCarrelloClientsState } from "src/components/carrello/carrello-utility/useCarrelloClientsState";

import { Alert, BlockingAlert, BlockingAlertProps } from "src/components/common/blocking-alert/BlockingAlert";
import Bordero from "src/components/common/bordero/Bordero";
import { ClientsContext, UpdateClientsContext, useClients } from "src/components/common/context-clients/ClientsContext";
import {
  ClientsVirtualContext,
  UpdateVirtualClientsContext,
  useVirtualClients,
} from "src/components/common/context-clients/VirtualClientsContext";
import { GlobalStateContext, useGlobalStateProvider } from "src/components/common/context-provider/ContextProvider";
import { Toast, ToastHub, useToastHub } from "src/components/common/toast-message/Toast";
import VoucherDialog from "src/components/common/voucher-dialog/VoucherDialog";
import { CheckBiglietto, useCheckBiglietto } from "src/components/dialog-biglietto/CheckBiglietto";
import { DialogPrenotazione } from "src/components/dialog-prenotazione/DialogPrenotazione";
import { DialogPrenotazioneMinimizzata } from "src/components/dialog-prenotazione/DialogPrenotazioneMinimizzata";
import { getPayloadVendita, useDialogPrenotazione } from "src/components/dialog-prenotazione/useDialogPrenotazione";
import {
  AddEsitotoToBigliettoContext,
  EsitiInBigliettoContext,
  EsitiVirtualInBigliettoContext,
} from "src/components/esito/useEsito";
import { MenuLive } from "src/components/live/MenuLive";
import { PalinsestoLive } from "src/components/live/PalinsestoLive";
import { useLive } from "src/components/live/useLive";
import { MainHeaderMemo } from "src/components/main-header/MainHeader";
import { useHomePagePrematch } from "src/components/prematch/HomePrematch";
import { MenuPrematchMemo } from "src/components/prematch/MenuPrematch";
import { PalinsestoSport } from "src/components/prematch/PalinsestoSport";
import { InfoAggiuntivaAggregatorGroupDialog } from "src/components/prematch/templates/InfoAggiuntivaAggregatorGroupDialog";
import { usePrematch } from "src/components/prematch/usePrematch";
import { MenuPrenotazioni } from "src/components/prenotazioni/MenuPrenotazioni";
import { useCart } from "src/components/root-container/useCart";
import { NavigazioneContext, useNavigazione } from "src/components/root-container/useNavigazione";
import { useGlobalEventListeners } from "src/components/smart-search/navigazione-tastiera";
import { useVirtual } from "src/components/virtual/useVirtual";
import { SmartSearchMemo } from "src/components/smart-search/SmartSearch";
import { useSmartSearch } from "src/components/smart-search/useSmartSearch";
import { MenuVirtual } from "src/components/virtual/MenuVirtual";
import { PalinsestoVirtual } from "src/components/virtual/PalinsestoVirtual";
import GlobalFonts from "src/fonts/fonts";
import { useWebsocketTransaction } from "src/services/useWebsocketTransaction";
import { makeChiaveEsitoVirtual, NickName } from "src/types/chiavi";
import styled, { css } from "styled-components/macro";
import { useVirtualCartUserInterfaceFlow } from "src/components/carrello-virtual/useVirtualCartUserInterfaceFlow";
import { ImpostazioniScommessaType } from "src/types/carrello.types";
import { Ticket } from "src/components/prenotazioni/prenotazioni-api";
import { getSelectedEventsFromTicketResultList } from "src/components/dialog-prenotazione/getSelectedEventsFromTicketResultList";
import {
  AmountsChangedResponse,
  SellErrorPropertyType,
  SellErrorType,
  VenditaSuccessResponse,
} from "src/types/vendita.types";
import configuration from "src/helpers/configuration";
import { mutate } from "swr";
import { TicketIndex } from "src/components/dialog-prenotazione/DialogPrenotazioneMultiBiglietto";
import { decimalToInteger } from "src/helpers/formatUtils";
import { BonusConfigClassType } from "src/types/bonusConfig.type";
import { mocksVirtual } from "src/mocks/pronostici/customPronosticiVirtual";

// DEBT sistemare il css globale
// DEBT sostituire il context KeyboardNavigationContext
// DEBT 2 cambiare isEsitoInCarrello a isEsitoInBiglietto
// DEBT 2 dare nome univoco a componenti esportati (es: TemplateAvvenimento -> TemplateAvvenimentoLive)

export default function RootContainer() {
  const {
    state: smartSearchState,
    setState: smartSearchSetState,
    suggerimenti: smartSearchSuggerimenti,
    inputRef: smartSearchInputRef,
  } = useSmartSearch();

  const { state: prematchState, setState: prematchSetState } = usePrematch();
  const { state: liveState, setState: liveSetState, alberatura: alberaturaLive } = useLive();
  const { state: virtualState, setState: virtualSetState } = useVirtual();
  const isSmartSearchActive = !(
    smartSearchState.subtype.type === "inattivo" || smartSearchState.subtype.type === "focus"
  );

  const [activeClientIndex, setActiveClientIndex] = useState(0);
  const [lastSoldTicketId, setLastSoldTicketId] = useState<string | null>(null);

  const { state: homePageState, setState: setHomePageState } = useHomePagePrematch();
  const { state: dialogPrenotazioneState, setState: setDialogPrenotazioneState } = useDialogPrenotazione();

  const [blockingAlertState, setBlockingAlertState] = useState<BlockingAlertProps | undefined>(undefined);

  const isOpenDialogPrenotazione =
    !dialogPrenotazioneState.isMinimized &&
    (dialogPrenotazioneState.dialogPrenotazioneCode ||
      dialogPrenotazioneState.dialogPrenotazioneNickname ||
      dialogPrenotazioneState.dialogPrenotazioneNotAvailable);

  const [isOpenVoucher, setIsOpenVoucher] = useState(false);
  const [navigazione, navigazioneActions] = useNavigazione({
    onLiveStateChange: liveSetState,
    onPrematchStateChange: prematchSetState,
    onVirtualStateChange: virtualSetState,
    onSmartSearchStateChange: smartSearchSetState,
    onHomePagePrematchStateChange: setHomePageState,
    onDialogPrenotazioneStateChange: setDialogPrenotazioneState,
    onBlockingAlertState: setBlockingAlertState,
    alberaturaLive: alberaturaLive,
  });
  const openVoucher = () => {
    setIsOpenVoucher(true);
  };
  const {
    openSezioneSport,
    openSezioneLive,
    openSezioneVirtual,
    openSezionePrenotazione,
    openBlockingAlertState,
    closeBlockingAlertState,
  } = navigazioneActions;
  const { sezione } = navigazione;
  const { push: pushToast, items: toastItems, close: closeToast } = useToastHub();
  const transactions = useWebsocketTransaction({
    onTransactionSystemError() {
      closeBlockingAlertState();
      openBlockingAlertState(
        <Alert
          type={"danger"}
          heading={
            <FormattedMessage
              defaultMessage="L'operazione non è andata a buon fine"
              description="default header title of sell alert"
            />
          }
          description={<FormattedMessage defaultMessage="Servizio non raggiungibile" description="404 descriprion" />}
          onClose={closeBlockingAlertState}
        />,
      );
    },
  });

  const { pronosticiParams, esitiInCarrello, updateRecord, addEsitoToCart, addMultyEsitoToCart } = useCart(sezione);

  const [keyActivatePuntata, setKeyActivatePuntata] = useState(0);
  const [codiceEsitoVendita, setCodiceEsitoVendita] = useState("-1");
  const { globalState } = useGlobalStateProvider();
  const clientsSport = useClients({ activeClientIndex, setActiveClientIndex });
  const { clients, activeClientIndex: activeClientId } = clientsSport;
  const [piedino, setPiedino] = useState<PiedinoState>([
    { totale: 0, emesso: 0, riscosso: 0 },
    { totale: 0, emesso: 0, riscosso: 0 },
  ]);
  const alertVirtualCart = useVirtualCartUserInterfaceFlow({
    openBlockingAlertState,
    closeBlockingAlertState,
    pushToast,
    onLastSoldTicket: setLastSoldTicketId,
    piedino,
    onPiedinoChange: setPiedino,
  });
  const [settingsGame, setSettingsGame] = useState<Record<number, ImpostazioniScommessaType>>({
    "0": {
      share: globalState.impostazioni ? globalState.impostazioni[0].share : 1,
      bet: globalState.impostazioni ? globalState.impostazioni[0].bet : 1,
    },
    "1": {
      share: globalState.impostazioni ? globalState.impostazioni[0].share : 1,
      bet: globalState.impostazioni ? globalState.impostazioni[0].bet : 1,
    },
  });
  const virtualClients = useVirtualClients({
    activeClientIndex,
    setActiveClientIndex,
    globalState,
    settingsGame,
    setSettingsGame,
    onErrorInsertEventToVirtualCart: alertVirtualCart.onErrorInsertEventToVirtualCart,
    keyboardNavigationContext,
    openSchedaVirtual: navigazioneActions.openSchedaVirtual,
    onSellingVirtualTransaction: transactions.startSellingVirtualTransaction,
    onSellingVirtualCartFlow: alertVirtualCart.onSellingVirtualCartFlow,
    openAlertWatingVirtualSelling: alertVirtualCart.openAlertWatingVirtualSelling,
  });
  const { virtualCartClients } = virtualClients;

  // DEBT
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (
        event.key === "+" &&
        event.location === 3 &&
        keyboardNavigationContext.current !== "dialog-recupera-biglietto" &&
        sezione !== "virtual" //DEBT doppio
      ) {
        event.preventDefault();
        let newState = { ...smartSearchState };
        /*TODO -> Gestire con maggiore precisione!*/
        newState.subtype.type = "inattivo";
        smartSearchSetState({ ...newState });
        setKeyActivatePuntata(keyActivatePuntata + 1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [keyActivatePuntata, sezione, smartSearchSetState, smartSearchState]);

  const [isSaldoCassaDialogOpen, setIsSaldoCassaDialogOpen] = useState(false);

  const closeDialogVoucher = () => {
    setIsOpenVoucher(false);
  };
  const checkBiglietto = useCheckBiglietto({
    lastSoldTicketId,
    pushToast,
    onSetIsSaldoCassaDialogOpen: setIsSaldoCassaDialogOpen,
    keyboardNavigationContext,
  });

  useGlobalEventListeners({
    onAddEsito: addEsitoToCart,
    smartSearchInputRef: smartSearchInputRef,
    smartSearchState,
    onSmartSearchStateChange: smartSearchSetState,
    smartSearchSuggerimenti: smartSearchSuggerimenti,
    keyboardNavigationContext,
    onOpenSezioneLive: openSezioneLive,
    onOpenSezioneSport: openSezioneSport,
    onOpenSezioneVirtual: openSezioneVirtual,
    onOpenSezionePrenotazione: openSezionePrenotazione,
    onOpenVoucher: openVoucher,
    changeActiveClient: virtualClients.changeActiveClient,
    onSelectFirstPrediction: virtualClients.onSelectFirstPrediction,
    onArrowDownUp: virtualClients.onArrowDownUp,
    sezione: sezione, //TODO: remove this!? after shortcut refactor (sport)
    convertFormattedToString: virtualClients.convertFormattedToString,
    selectInput: virtualClients.selectInput,
    activeClientId: activeClientId,
    longPressPropDecrease: virtualClients.longPressPropDecrease,
    longPressPropsIncrease: virtualClients.longPressPropsIncrease,
    openDettaglioAvvenimento: virtualClients.openDettaglioAvvenimento,
    deleteEsito: virtualClients.deleteEsito,
    onSwitchMultiplaSistema: virtualClients.switchMultiplaSistema,
  });

  const isFullScreenSection = sezione === "prenotazione" || sezione === "bordero";

  const carrelloClientsState = useCarrelloClientsState(clientsSport, clients);

  const esitiVirtualInCarrello = useMemo(() => {
    const chiavi = new Set<string>();
    for (const { esiti, provider, codiceDisciplina, eventId, codiceAvvenimento } of virtualClients.activeVirtualClient
      .selectedEvents) {
      for (const { codiceEsito, idScommessa } of esiti) {
        chiavi.add(
          makeChiaveEsitoVirtual({
            provider,
            idDisciplina: codiceDisciplina,
            eventId,
            idScommessa,
            idEsito: codiceEsito,
            sogeicodevento: codiceAvvenimento,
          }),
        );
      }
    }
    return chiavi;
  }, [virtualClients.activeVirtualClient.selectedEvents]);

  const { closeDialogPrenotazione, endSellingOnDialogPrenotazione } = navigazioneActions;
  // const { bonusConfig } = useContext(GlobalStateContext);

  const venditaBiglietto = useCallback(
    async (
      nickname: NickName,
      ticketViewed: number[],
      ticketToSellList: Ticket[],
      ticketToSellListIndex: number,
      selledTicketsList: Record<TicketIndex, VenditaSuccessResponse["response"]>,
      notSelledTicketsList: Record<TicketIndex, string>,
      totalSellTicket: number,
      allTicketSent: boolean,
      bonusConfig?: BonusConfigClassType[],
      amountChangedTicketResponse?: AmountsChangedResponse,
    ) => {
      const ticketToSell = ticketToSellList[ticketToSellListIndex];

      const selectedEvents = getSelectedEventsFromTicketResultList(
        ticketToSell.results,
        ticketViewed.includes(ticketToSell.index),
      );

      const payloadVendita = await getPayloadVendita(
        ticketToSell,
        nickname,
        selectedEvents,
        allTicketSent,
        amountChangedTicketResponse,
        bonusConfig,
      );

      if (payloadVendita) {
        keyboardNavigationContext.current = "blocking-operation";
        amountChangedTicketResponse &&
          setDialogPrenotazioneState((prevState) => {
            return {
              ...prevState,
              amountChangedTicketResponse: undefined,
              notSelledTickets: notSelledTicketsList,
            };
          });
        transactions.startSellBookingTransaction(payloadVendita, {
          onStart() {},
          onStartError(params: { code: string; description: string }) {
            setDialogPrenotazioneState((prevState) => {
              return {
                ...prevState,
                notSelledTickets: { ...notSelledTicketsList, [ticketToSell.index]: params.description },
                selledTickets: selledTicketsList,
                totalSellTicket: totalSellTicket,
              };
            });
            keyboardNavigationContext.current = "smart-search";
            mutate("balanceAmountService");
            endSellingOnDialogPrenotazione();
          },
          onGenericError(response: SellErrorType) {
            setDialogPrenotazioneState((prevState) => {
              return {
                ...prevState,
                notSelledTickets: { ...notSelledTicketsList, [ticketToSell.index]: response.message },
                selledTickets: selledTicketsList,
                totalSellTicket: totalSellTicket,
              };
            });
            keyboardNavigationContext.current = "smart-search";
            endSellingOnDialogPrenotazione();
            mutate("balanceAmountService");
          },
          onSuccess(response: VenditaSuccessResponse["response"]) {
            const hasOtherTicketsToSell = ticketToSellListIndex + 1 <= ticketToSellList.length - 1;
            const currentPrice = totalSellTicket + ticketToSell.sellingPrice;
            const temporarySelledTickets = {
              ...selledTicketsList,
              [ticketToSell.index]: response,
            };

            delete notSelledTicketsList[ticketToSell.index];

            if (allTicketSent) {
              closeDialogPrenotazione(nickname);
              mutate("balanceAmountService");
              pushToast(
                <Toast
                  type="success"
                  heading={
                    <FormattedMessage
                      description="selling booking success toast heading "
                      defaultMessage="Scommesse andate a buon fine"
                    />
                  }
                  description={
                    <FormattedMessage
                      description="selling booking success toast description of amount to be paid"
                      defaultMessage="Importo da pagare {importo} €"
                      values={{ importo: decimalToInteger(currentPrice) }}
                    />
                  }
                />,
                5000,
              );
            } else {
              if (hasOtherTicketsToSell) {
                //Update counter of progress bar of multi tickets
                setDialogPrenotazioneState((prevState) => {
                  const sellTicketStateUpdated = prevState.sellTicketState && {
                    ...prevState.sellTicketState,
                    progressBarActualCounter: prevState.sellTicketState.progressBarActualCounter + 1,
                  };
                  return {
                    ...prevState,
                    sellTicketState: sellTicketStateUpdated,
                    notSelledTickets: notSelledTicketsList,
                  };
                });

                venditaBiglietto(
                  nickname,
                  ticketViewed,
                  ticketToSellList,
                  ticketToSellListIndex + 1,
                  temporarySelledTickets,
                  notSelledTicketsList,
                  currentPrice,
                  (allTicketSent = ticketToSellListIndex + 1 === ticketToSellList.length - 1),
                );
              } else {
                setDialogPrenotazioneState((prevState) => {
                  return {
                    ...prevState,
                    notSelledTickets: notSelledTicketsList,
                    selledTickets: { ...prevState.selledTickets, [ticketToSell.index]: response },
                    totalSellTicket: currentPrice,
                  };
                });
                endSellingOnDialogPrenotazione();
              }
            }
            keyboardNavigationContext.current = "smart-search";
          },
          onUnderAcceptance(params: {
            errorCodeObj?: SellErrorPropertyType;
            properties: Array<SellErrorPropertyType>;
          }) {
            setDialogPrenotazioneState((prevState) => {
              return {
                ...prevState,
                notSelledTickets: {
                  ...notSelledTicketsList,
                  [ticketToSell.index]: configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE,
                },
                actualTicketIndex: ticketToSell.index,
              };
            });
          },
          onSpecificError(params: { errorCodeObj?: SellErrorPropertyType; properties: Array<SellErrorPropertyType> }) {
            setDialogPrenotazioneState((prevState) => {
              return {
                ...prevState,
                notSelledTickets: { ...notSelledTicketsList, [ticketToSell.index]: params.properties[1].value },
                selledTickets: selledTicketsList,
                actualTicketIndex: ticketToSell.index,
                totalSellTicket: totalSellTicket,
              };
            });
            mutate("balanceAmountService");
            keyboardNavigationContext.current = "smart-search";
            endSellingOnDialogPrenotazione();
          },
          onError() {
            setDialogPrenotazioneState((prevState) => {
              return {
                ...prevState,
                notSelledTickets: { ...notSelledTicketsList, [ticketToSell.index]: "ERR" },
                selledTickets: selledTicketsList,
                actualTicketIndex: ticketToSell.index,
                totalSellTicket: totalSellTicket,
              };
            });
            mutate("balanceAmountService");
            keyboardNavigationContext.current = "smart-search";
            endSellingOnDialogPrenotazione();
          },
          onUnderAcceptanceRejected() {
            setDialogPrenotazioneState((prevState) => {
              return {
                ...prevState,
                notSelledTickets: {
                  ...notSelledTicketsList,
                  [ticketToSell.index]: configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_REJECETED,
                },
                selledTickets: selledTicketsList,
                totalSellTicket: totalSellTicket,
              };
            });
            endSellingOnDialogPrenotazione();
            keyboardNavigationContext.current = "smart-search";
          },
          onUnderAcceptanceTimeout() {
            setDialogPrenotazioneState((prevState) => {
              return {
                ...prevState,
                notSelledTickets: {
                  ...notSelledTicketsList,
                  [ticketToSell.index]: configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_TIMEOUT,
                },
                selledTickets: selledTicketsList,
                totalSellTicket: totalSellTicket,
              };
            });
            mutate("balanceAmountService");
            keyboardNavigationContext.current = "smart-search";
            endSellingOnDialogPrenotazione();
          },
          onAcceptanceAmountsChanged(response: AmountsChangedResponse) {
            setDialogPrenotazioneState((prevState) => {
              return {
                ...prevState,
                notSelledTickets: {
                  ...notSelledTicketsList,
                  [ticketToSell.index]: configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_AMOUNTS_CHANGED,
                },
                amountChangedTicketResponse: response,
                totalSellTicket: totalSellTicket,
                selledTickets: selledTicketsList,
              };
            });
            keyboardNavigationContext.current = "smart-search";
            mutate("balanceAmountService");
          },
        });
      }
    },
    [transactions, closeDialogPrenotazione, endSellingOnDialogPrenotazione, pushToast, setDialogPrenotazioneState],
  );

  return (
    <AddEsitotoToBigliettoContext.Provider
      value={{
        esitoSport: addEsitoToCart,
        esitoVirtual: virtualClients.addEsitoVirtualToCart,
        accoppiataTrioVirtual: virtualClients.addAccoppiataTrioVirtualToCart,
      }}
    >
      <EsitiInBigliettoContext.Provider value={esitiInCarrello}>
        <NavigazioneContext.Provider value={navigazioneActions}>
          <ClientsContext.Provider value={clients}>
            <UpdateClientsContext.Provider value={clientsSport}>
              <ClientsVirtualContext.Provider value={virtualCartClients}>
                <UpdateVirtualClientsContext.Provider value={virtualClients}>
                  <KeyboardNavigationContext.Provider value={keyboardNavigationContext}>
                    <GlobalStateContext.Provider value={globalState}>
                      <GlobalFonts />
                      <StyledRootContainer
                        isFullScreen={isFullScreenSection}
                        css={css`
                          overflow: hidden;
                        `}
                      >
                        <MainHeaderMemo
                          onOpenVoucher={openVoucher}
                          onOpenRecuperaBigliettoDialog={checkBiglietto.openRecuperaBiglietto}
                          sezioneAttiva={sezione}
                          onOpenLastSoldTicket={checkBiglietto.openUltimoBiglietto}
                          isSaldoCassaDialogOpen={isSaldoCassaDialogOpen}
                          onSetIsSaldoCassaDialogOpen={setIsSaldoCassaDialogOpen}
                          pushToast={pushToast}
                        />
                        {(() => {
                          return (
                            <StyledMain isFullScreen={isFullScreenSection}>
                              {!isFullScreenSection && (
                                <>
                                  <StyledMainLeft>
                                    {(() => {
                                      switch (sezione) {
                                        case "sport":
                                          return (
                                            <SimpleErrorBoundary>
                                              <MenuPrematchMemo prematchState={prematchState} />
                                            </SimpleErrorBoundary>
                                          );
                                        case "live":
                                          return (
                                            <SimpleErrorBoundary>
                                              <MenuLive state={liveState} alberatura={alberaturaLive} />
                                            </SimpleErrorBoundary>
                                          );
                                        case "virtual":
                                          //TODO- eliminare mocksVirtual con nuovo Palinsesto
                                          return true ? (
                                            <SimpleErrorBoundary>
                                              <MenuVirtual virtualState={virtualState} />
                                            </SimpleErrorBoundary>
                                          ) : (
                                            mocksVirtual.map((e) => {
                                              return (
                                                <button
                                                  onClick={() => {
                                                    virtualClients.addEsitoVirtualToCart(e);
                                                  }}
                                                >
                                                  {e.descrEvento}
                                                </button>
                                              );
                                            })
                                          );
                                      }
                                    })()}
                                  </StyledMainLeft>
                                  {sezione !== "virtual" && (
                                    <SimpleErrorBoundary>
                                      <SmartSearchMemo
                                        state={smartSearchState}
                                        onStateChange={smartSearchSetState}
                                        inputRef={smartSearchInputRef}
                                        suggerimenti={smartSearchSuggerimenti}
                                        keyboardNavigationContext={keyboardNavigationContext}
                                      />
                                    </SimpleErrorBoundary>
                                  )}
                                  {!isSmartSearchActive && (
                                    <div
                                      css={css`
                                        /* flex-grow: 1; */
                                        /* width: 40vw; */
                                        display: flex;
                                        flex-direction: column;
                                        grid-area: navigazione;
                                      `}
                                    >
                                      <div
                                        css={css`
                                          flex-grow: 1;
                                        `}
                                      >
                                        {(() => {
                                          if (isSmartSearchActive && sezione !== "virtual") {
                                            return null;
                                          }
                                          switch (sezione) {
                                            case "sport":
                                              return (
                                                <SimpleErrorBoundary>
                                                  <PalinsestoSport
                                                    state={homePageState}
                                                    prematchState={prematchState}
                                                    pushToast={pushToast}
                                                  />
                                                </SimpleErrorBoundary>
                                              );
                                            case "live":
                                              return (
                                                <SimpleErrorBoundary>
                                                  <PalinsestoLive liveState={liveState} />
                                                </SimpleErrorBoundary>
                                              );
                                            case "virtual":
                                              return (
                                                <SimpleErrorBoundary>
                                                  <EsitiVirtualInBigliettoContext.Provider
                                                    value={esitiVirtualInCarrello}
                                                  >
                                                    {virtualState && (
                                                      <PalinsestoVirtual
                                                        onVirtualStateChange={virtualSetState}
                                                        virtualState={virtualState}
                                                        activeClientIndex={activeClientIndex}
                                                      />
                                                    )}
                                                  </EsitiVirtualInBigliettoContext.Provider>
                                                </SimpleErrorBoundary>
                                              );
                                          }
                                        })()}
                                      </div>
                                    </div>
                                  )}
                                  <StyledMainRight>
                                    <SimpleErrorBoundary>
                                      <KeyboardNavigationContext.Provider value={keyboardNavigationContext}>
                                        <StyledCarrelloWrapper>
                                          {(sezione === "sport" || sezione === "live") && (
                                            <Carrello
                                              {...carrelloClientsState}
                                              codiceEsitoVendita={codiceEsitoVendita}
                                              setCodiceEsitoVendita={setCodiceEsitoVendita}
                                              activatePuntata={keyActivatePuntata}
                                              setActivatePuntata={setKeyActivatePuntata}
                                              pronosticiParams={pronosticiParams}
                                              updateRecord={updateRecord}
                                              onStateChange={smartSearchSetState}
                                              onLastSoldTicket={setLastSoldTicketId}
                                              pushToast={pushToast}
                                              onStartSellingTransaction={transactions.startSellingTransaction}
                                              piedino={piedino}
                                              onPiedinoChange={setPiedino}
                                              activeClientId={activeClientId}
                                              sezione={sezione}
                                            />
                                          )}
                                          {sezione === "virtual" && <CarrelloVirtual />}
                                          <Piedino
                                            piedino={piedino}
                                            onPiedinoChange={setPiedino}
                                            updateImpostazioni={carrelloClientsState.updateAllClientsImpostazioni}
                                          />
                                        </StyledCarrelloWrapper>
                                      </KeyboardNavigationContext.Provider>
                                    </SimpleErrorBoundary>
                                  </StyledMainRight>
                                </>
                              )}
                              {isFullScreenSection &&
                                (() => {
                                  switch (sezione) {
                                    case "prenotazione":
                                      return (
                                        <StyledPrenotazione>
                                          <MenuPrenotazioni
                                            dialogPrenotazioneState={dialogPrenotazioneState}
                                            onTicketSell={venditaBiglietto}
                                            pushToast={pushToast}
                                          />
                                        </StyledPrenotazione>
                                      );
                                    case "bordero":
                                      return (
                                        <StyledBordero>
                                          <Bordero />
                                        </StyledBordero>
                                      );
                                  }
                                })()}
                            </StyledMain>
                          );
                        })()}
                      </StyledRootContainer>
                      {isOpenVoucher && (
                        <VoucherDialog
                          isOpen={isOpenVoucher}
                          closeDialog={closeDialogVoucher}
                          pushToast={pushToast}
                          closeToast={closeToast}
                          onEmitVoucher={transactions.startEmitVoucherTransaction}
                          onRefundVoucher={transactions.startRefundVoucherTransaction}
                          onSetIsSaldoCassaDialogOpen={setIsSaldoCassaDialogOpen}
                        />
                      )}
                      {prematchState.infoAggiuntivaAggregatorModal && (
                        <InfoAggiuntivaAggregatorGroupDialog {...prematchState.infoAggiuntivaAggregatorModal} />
                      )}
                      {isOpenDialogPrenotazione && (
                        <DialogPrenotazione
                          dialogPrenotazioneState={dialogPrenotazioneState}
                          pushToast={pushToast}
                          onVendiTicket={venditaBiglietto}
                        />
                      )}
                      {dialogPrenotazioneState.isMinimized && (
                        <DialogPrenotazioneMinimizzata dialogPrenotazioneState={dialogPrenotazioneState} />
                      )}
                      <CheckBiglietto
                        onOpenDettaglioBiglietto={checkBiglietto.openDettaglioBigliettoDialog}
                        circolaritaError={checkBiglietto.ticketIdOpened?.circolaritaError ?? false}
                        onCloseDettaglioBiglietto={checkBiglietto.closeDettaglioBigliettoDialog}
                        onDettaglioBigliettoMaximize={checkBiglietto.maximizeDettaglioBigliettoDialog}
                        onDettaglioBigliettoMinimize={checkBiglietto.minimizeDettaglioBigliettoDialog}
                        isRecuperaDialogOpen={checkBiglietto.isRecuperaDialogOpen}
                        onCloseRecuperaBigliettoDialog={checkBiglietto.closeRecuperaDialog}
                        dettaglioBigliettoDisplayStatus={checkBiglietto.dettaglioBigliettoDisplayStatus}
                        isSaldoCassaDialogOpen={isSaldoCassaDialogOpen}
                        onSetIsSaldoCassaDialogOpen={setIsSaldoCassaDialogOpen}
                        pushToast={pushToast}
                        onAddMultyEsitoToCart={addMultyEsitoToCart}
                        onStartPayment={transactions.startPaymentTransaction}
                        onAnnullaBiglietto={transactions.startAnnulmentTransaction}
                        lastAnnullaBigliettoFailed={checkBiglietto.ticketIdOpened?.lastAnnullaBigliettoFailed ?? false}
                        ticketIdOpened={checkBiglietto.ticketIdOpened}
                        isValidating={checkBiglietto.isValidating}
                        activeClientId={activeClientId}
                        onPiedinoChange={setPiedino}
                        piedino={piedino}
                        ticketResponse={checkBiglietto.ticketResponse}
                        onUpdateDataResponse={checkBiglietto.setDataResponse}
                        catchError={checkBiglietto.catchError}
                        setCatchError={checkBiglietto.setCatchError}
                      />
                      {blockingAlertState && <BlockingAlert {...blockingAlertState} />}
                      <ToastHub items={toastItems} />
                    </GlobalStateContext.Provider>
                  </KeyboardNavigationContext.Provider>
                </UpdateVirtualClientsContext.Provider>
              </ClientsVirtualContext.Provider>
            </UpdateClientsContext.Provider>
          </ClientsContext.Provider>
        </NavigazioneContext.Provider>
      </EsitiInBigliettoContext.Provider>
    </AddEsitotoToBigliettoContext.Provider>
  );
}

export type KeyboardNavigationContext =
  | undefined
  | "dialog-recupera-biglietto"
  | "smart-search"
  | "cart"
  | "blocking-operation";
const ENABLE_KEYBOARD_NAVIGATION_CONETXT_DEBUG = false;
// this is meant for debugging, do not delete
const keyboardNavigationContext: { current: KeyboardNavigationContext; _current: KeyboardNavigationContext } = {
  _current: undefined,
  get current() {
    return this._current;
  },
  set current(newValue) {
    if (ENABLE_KEYBOARD_NAVIGATION_CONETXT_DEBUG) {
      console.trace(newValue);
    }
    this._current = newValue;
  },
};
// eslint-disable-next-line no-redeclare, @typescript-eslint/no-redeclare
export const KeyboardNavigationContext = React.createContext((null as any) as { current: KeyboardNavigationContext });

const StyledRootContainer = styled.div<{ isFullScreen: boolean }>`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #dcdcdc;
  overflow: auto;
  display: grid;
  grid-template-rows: [header] 130px [main] auto;
  grid-row-gap: ${(props) => (props.isFullScreen ? "0px" : "20px")};
`;

const StyledMain = styled.div<{ isFullScreen: boolean }>`
  grid-row: main;
  display: grid;
  grid-gap: 20px;
  grid-template-areas:
    "alberatura smartsearch cart"
    "alberatura navigazione cart";
  grid-template-columns: 300px auto 530px;
  grid-template-rows: min-content 1fr;
`;

const StyledMainLeft = styled.div`
  grid-area: alberatura;
`;

const StyledMainRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;
  color: #333333;
  background-color: transparent;
  border-top-left-radius: 4px;
  /* height: 940px; non necessario, non reintrudurre a meno di incontrare bug */
  grid-area: cart;
`;

const StyledBordero = styled.div`
  grid-row: -1 / 1;
  grid-column: -1 / 1;
  background-color: #ffffff;
`;

const StyledPrenotazione = styled.div`
  grid-row: -1 / 1;
  grid-column: -1 / 1;
  display: flex;
  background-color: #ffffff;
`;

class SimpleErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true };
  }
  componentDidCatch(error: unknown, errorInfo: unknown) {}
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p
            css={css`
              color: red;
              font-weight: bold;
            `}
          >
            errore, vedi console
          </p>
          <button onClick={() => this.setState({ hasError: false })}>riprova</button>
        </div>
      );
    }
    return this.props.children;
  }
}
