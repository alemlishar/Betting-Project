import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from "react";
import { MultiplaFooterStateType } from "src/components/carrello-virtual/footer/MultiplaVirtualFooter";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import {
  systemVirtualSellingPayload,
  multipleVirtualSellingPayload,
} from "src/components/carrello-virtual/VirtualCart.helpers";
import {
  calculateMaxWinning,
  calculatorEuroBonus,
  calculatorUnformattedPercentualBonus,
  isBonusMultipla,
  producerOfTotalQuote,
} from "src/helpers/calculationUtils";
import configuration from "src/helpers/configuration";

import { StateType } from "src/services/ContextService";
import {
  CartVirtualClientType,
  ImpostazioniScommessaType,
  toEsitoVirtualType,
  toEventVirtualType,
  UpdateVirtualCartClients,
  VirtualEsitoType,
  VirtualEventType,
} from "src/types/carrello.types";
import {
  ChiaveAccoppiataTrioBigliettoVirtualComponents,
  ChiaveEsitoBigliettoVirtualComponents,
} from "src/types/chiavi";
import { CardinalityAndSellingAmount } from "src/types/sistemi.types";
import useSWR, { mutate } from "swr";
import { decimalToInteger, formatNumberWithoutRounding } from "src/helpers/formatUtils";
import {
  controlNewEvent,
  getGiocatasistemisticaPayload,
  potentialWinningAmount,
  updateIndexCarrello,
  useLongPress,
} from "src/components/carrello-virtual/VirtualCart.helpers";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { VirtualStateNavigation } from "src/components/virtual/virtual-dto";
import { SellingVirtualRequest, StartSellingVirtualTransactionCallbacks } from "src/services/useWebsocketTransaction";

export const ClientsVirtualContext = createContext<Array<CartVirtualClientType>>([]);
export const UpdateVirtualClientsContext = createContext<UpdateVirtualCartClients>(null as any);

export function useVirtualCartClientsContext() {
  return useContext(ClientsVirtualContext);
}

export function useVirtualUpdateClientsContext() {
  return useContext(UpdateVirtualClientsContext);
}

export function useVirtualClients({
  activeClientIndex,
  setActiveClientIndex,
  globalState,
  onErrorInsertEventToVirtualCart,
  settingsGame,
  setSettingsGame,
  keyboardNavigationContext,
  openSchedaVirtual,
  onSellingVirtualTransaction,
  onSellingVirtualCartFlow,
  openAlertWatingVirtualSelling,
}: {
  activeClientIndex: number;
  setActiveClientIndex(activeClientIndex: number): void;
  globalState: StateType;
  onErrorInsertEventToVirtualCart: () => void;
  settingsGame: Record<number, ImpostazioniScommessaType>;
  setSettingsGame: (settingsGame: Record<number, ImpostazioniScommessaType>) => void;
  keyboardNavigationContext: { current: KeyboardNavigationContext };
  openSchedaVirtual: (virtualState: VirtualStateNavigation) => void;
  onSellingVirtualTransaction: (
    params: SellingVirtualRequest,
    callback: StartSellingVirtualTransactionCallbacks,
    updateVirtualCart: (selectedEvents: Array<VirtualEventType>) => void,
  ) => void;
  onSellingVirtualCartFlow: StartSellingVirtualTransactionCallbacks;
  openAlertWatingVirtualSelling: () => void;
}) {
  const { multipleVirtualBetConfig } = useContext(GlobalStateContext);
  const [higlightedPrediction, setHiglightedPrediction] = useState<number>(0);
  /**STATO CLIENTE VIRTUAL */
  const [virtualCartClients, setVirtualCartClients] = useState<Array<CartVirtualClientType>>([
    {
      selectedEvents: [],
      impostazioniScommessa: [
        {
          bet: settingsGame[0].bet,
          share: settingsGame[0].share,
        },
      ],
      puntata: multipleVirtualBetConfig ? multipleVirtualBetConfig.importoMinimo * 100 : 100,
      isSviluppoSistemaActive: false,
      puntataSistema: [],
    },
    {
      selectedEvents: [],
      impostazioniScommessa: [
        {
          bet: settingsGame[1].bet,
          share: settingsGame[1].share,
        },
      ],
      puntata: multipleVirtualBetConfig ? multipleVirtualBetConfig.importoMinimo * 100 : 100,
      isSviluppoSistemaActive: false,
      puntataSistema: [],
    },
  ]);
  useEffect(() => {
    setVirtualCartClients((virtualCartClients) => {
      return [
        {
          ...virtualCartClients[0],
          impostazioniScommessa: [
            {
              bet: settingsGame[0].bet,
              share: settingsGame[0].share,
            },
          ],
          puntata: multipleVirtualBetConfig ? multipleVirtualBetConfig.importoMinimo * 100 : 100,
        },
        {
          ...virtualCartClients[1],
          impostazioniScommessa: [
            {
              bet: settingsGame[1].bet,
              share: settingsGame[1].share,
            },
          ],
          puntata: multipleVirtualBetConfig ? multipleVirtualBetConfig.importoMinimo * 100 : 100,
        },
      ];
    });
  }, [multipleVirtualBetConfig, settingsGame]);

  /**ACTIVE CLIENT*/
  const activeVirtualClient = useMemo(() => {
    return virtualCartClients[activeClientIndex];
  }, [activeClientIndex, virtualCartClients]);
  /**SWITCH ACTIVE CLIENT */
  const changeActiveClient = useCallback(() => {
    if (activeClientIndex === 0) {
      setActiveClientIndex(1);
    } else {
      setActiveClientIndex(0);
    }
  }, [activeClientIndex, setActiveClientIndex]);

  /** CONTEXT UPDATE  */

  const updateCurrentVirtualClientData = useCallback(
    (newClientData: CartVirtualClientType) => {
      const updatedCartClients = [...virtualCartClients];
      updatedCartClients[activeClientIndex] = newClientData;
      setVirtualCartClients(updatedCartClients);
    },

    [activeClientIndex, virtualCartClients],
  );
  /** SVILUPPO SISTEMA */

  const updatePuntataSistema = useCallback(
    (selectedEvents: VirtualEventType[]) => {
      if (selectedEvents.length === 0) {
        const puntataSistema: CardinalityAndSellingAmount[] = [];
        return puntataSistema;
      } else if (
        selectedEvents.length !== activeVirtualClient.puntataSistema.length &&
        activeVirtualClient.puntataSistema.length > selectedEvents.length
      ) {
        const puntataSistema: CardinalityAndSellingAmount[] = activeVirtualClient.puntataSistema;
        puntataSistema.pop();
        return puntataSistema;
      } else {
        const puntataSistema: CardinalityAndSellingAmount[] = selectedEvents.map((ev, i) => {
          return {
            importo:
              activeVirtualClient.puntataSistema && activeVirtualClient.puntataSistema[i]
                ? activeVirtualClient.puntataSistema[i].importo
                : 0,
            cardinalita:
              activeVirtualClient.puntataSistema && activeVirtualClient.puntataSistema[i]
                ? activeVirtualClient.puntataSistema[i].cardinalita
                : i + 1,
          };
        });
        return puntataSistema;
      }
    },
    [activeVirtualClient.puntataSistema],
  );

  const { data: giocataSistemisticaData } = useSWR(
    "giocataSistemisticaSviluppataVirtual",
    getGiocatasistemisticaPayload,
  );

  /**
   * DEBT
   * La chiamata dovrebbe essere triggerata dall'evento legato al cambio cliente (shortcut-click)
   * Al momento il cliente è in comune tra virtual e sport
   * Soluzioni:
   * -Creare un nuovo componente cliente
   * -Refactor del carrello sport e all'evento riuscire a valutare se fare chiamata a giocata sistemistica (sport o virtual)
   */
  const currentClientRef = useRef<number>(activeClientIndex);
  useEffect(() => {
    if (currentClientRef.current === activeClientIndex) {
      return;
    } else {
      currentClientRef.current = activeClientIndex;
      mutate(
        "giocataSistemisticaSviluppataVirtual",
        getGiocatasistemisticaPayload(activeVirtualClient.selectedEvents, activeVirtualClient.puntataSistema),
      );
    }
  }, [activeClientIndex, activeVirtualClient.puntataSistema, activeVirtualClient.selectedEvents]);
  /**FOOTER MULTIPLA:
   * - state
   * - active client's footer
   * - update active client's footer
   */
  const minimumQuotaValue = globalState.bonusVirtualConfig ? globalState.bonusVirtualConfig[0].minimumQuotaValue : 110;
  const [multiplaFooterVirtualState, setMultiplaFooterVirtualState] = useState<Record<string, MultiplaFooterStateType>>(
    {
      "0": {
        bet: virtualCartClients[0].puntata, //TODO
        quotaTotale: { value: 0, factor: 0 },
        vincitaMassima: { value: 0, factor: 0 },
        bonusPerc: { value: 0, factor: 0 },
        bonusEuroValue: "0",
      },
      "1": {
        bet: virtualCartClients[1].puntata,
        quotaTotale: { value: 0, factor: 0 },
        vincitaMassima: { value: 0, factor: 0 },
        bonusPerc: { value: 0, factor: 0 },
        bonusEuroValue: "0",
      },
    },
  );
  const activeMultiplaFooterState = useMemo(() => {
    return multiplaFooterVirtualState[activeClientIndex];
  }, [activeClientIndex, multiplaFooterVirtualState]);

  const updateFooterMultipla = useCallback(
    (selectedEvents: Array<VirtualEventType>) => {
      const virtualBonusConfig = globalState.bonusVirtualConfig;
      const quoteToEvaluate = selectedEvents
        .map((evento) =>
          evento.esiti.map((esito) => {
            return { quota: esito.quota };
          }),
        )
        .flat(1);
      const quoteProducer = quoteToEvaluate.map((quota) => {
        return quota.quota;
      });

      if (virtualBonusConfig !== undefined) {
        const isBonus = isBonusMultipla(virtualBonusConfig[0], quoteToEvaluate);
        if (isBonus) {
          const numeroEsitiForBonus = selectedEvents
            .map((event) =>
              event.esiti.filter((esiti) => {
                return esiti.quota > minimumQuotaValue;
              }),
            )
            .flat(1).length;
          const minBonus = virtualBonusConfig[0].bonusMultiplier;
          const minOutcome = virtualBonusConfig[0].minimumOutcomes;
          const unformattedBonusPerc = calculatorUnformattedPercentualBonus(minBonus, minOutcome, numeroEsitiForBonus);
          const totalOdds = producerOfTotalQuote(quoteProducer, unformattedBonusPerc);
          const bonusValue = calculatorEuroBonus(unformattedBonusPerc, activeMultiplaFooterState.bet * 100, totalOdds);
          const potentialWinning = calculateMaxWinning(totalOdds, activeMultiplaFooterState.bet);
          setMultiplaFooterVirtualState({
            ...multiplaFooterVirtualState,
            [activeClientIndex]: {
              quotaTotale: totalOdds,
              vincitaMassima: potentialWinning,
              bonusPerc: unformattedBonusPerc,
              bonusEuroValue: bonusValue,
              bet: activeMultiplaFooterState.bet,
            },
          });
        } else {
          const totalOdds = producerOfTotalQuote(quoteProducer, { value: 1, factor: 0 });
          const potentialWinning = calculateMaxWinning(totalOdds, activeMultiplaFooterState.bet);
          setMultiplaFooterVirtualState({
            ...multiplaFooterVirtualState,
            [activeClientIndex]: {
              quotaTotale: totalOdds,
              vincitaMassima: potentialWinning,
              bonusPerc: { value: 0, factor: 0 },
              bonusEuroValue: "0",
              bet: activeMultiplaFooterState.bet,
            },
          });
        }
      }
    },
    [
      activeClientIndex,
      activeMultiplaFooterState.bet,
      globalState.bonusVirtualConfig,
      minimumQuotaValue,
      multiplaFooterVirtualState,
    ],
  );

  /**
   * PUNTATA MULTPLA onChange
   */

  //const [selectInput, setSelectInput] = useState<HTMLInputElement | null>(null);
  const selectInput = useRef<Record<number, HTMLInputElement | null>>({
    0: null,
    1: null,
  });
  const [inputValue, setInputValue] = useState<Record<number, string>>({
    0: decimalToInteger(multiplaFooterVirtualState[0].bet),
    1: decimalToInteger(multiplaFooterVirtualState[1].bet),
  });

  const [inputUnformattedValue, setInputUnformattedValue] = useState<Record<number, string>>({
    0: decimalToInteger(multiplaFooterVirtualState[0].bet),
    1: decimalToInteger(multiplaFooterVirtualState[1].bet),
  });

  const formatInputValue = useCallback(() => {
    const currentInputValue = inputValue[activeClientIndex];
    setInputUnformattedValue({ ...inputUnformattedValue, [activeClientIndex]: currentInputValue });
    setInputValue({
      ...inputValue,
      [activeClientIndex]: formatNumberWithoutRounding(Number(currentInputValue.replace(",", ".")), ","),
    });
  }, [activeClientIndex, inputUnformattedValue, inputValue]);
  const convertFormattedToString = useCallback(() => {
    setInputValue({
      ...inputValue,
      [activeClientIndex]: inputUnformattedValue[activeClientIndex],
    });
  }, [activeClientIndex, inputUnformattedValue, inputValue]);

  const onHandlePuntataChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement> | string) => {
      const puntataVirtualMultiplaRegexp = /((^[0-9]{0,4}[\\.,]{1}[0-9]{0,2})|^([0-9]{0,4}))$/;
      const inputText = typeof event === "string" ? event : event.target.value;
      if (puntataVirtualMultiplaRegexp.test(inputText)) {
        setInputValue({
          ...inputValue,
          [activeClientIndex]: inputText,
        });

        const maxWin = potentialWinningAmount(
          Number(inputText.replace(",", ".")) * configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER,
          multiplaFooterVirtualState[activeClientIndex].quotaTotale,
        );

        setMultiplaFooterVirtualState({
          ...multiplaFooterVirtualState,
          [activeClientIndex]: {
            bet: Number(inputText.replace(",", ".")) * configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER,
            quotaTotale: multiplaFooterVirtualState[activeClientIndex].quotaTotale,
            vincitaMassima: maxWin,
            bonusPerc: multiplaFooterVirtualState[activeClientIndex].bonusPerc,
            bonusEuroValue: multiplaFooterVirtualState[activeClientIndex].bonusEuroValue,
          },
        });
      } else {
        return;
      }
    },
    [activeClientIndex, inputValue, multiplaFooterVirtualState],
  );
  const evaluateNextStep = useCallback(
    (direction: 1 | -1) => {
      const change = Number((Number(inputValue[activeClientIndex].replace(",", ".")) % 0.5).toFixed(2));
      if (change === 0) {
        return globalState.multipleVirtualBetConfig ? globalState.multipleVirtualBetConfig.importoBase : 0.5;
      } else {
        if (direction === 1) {
          return globalState.multipleVirtualBetConfig
            ? globalState.multipleVirtualBetConfig.importoBase - change
            : 0.5 - change;
        }
        if (direction === -1) {
          return change;
        }
      }
      return 0;
    },
    [activeClientIndex, globalState.multipleVirtualBetConfig, inputValue],
  );

  const changeInputImportoBaseIncrement = useCallback(() => {
    selectInput.current[activeClientIndex]?.focus();
    const maximumBet = globalState.configVirtual ? globalState.configVirtual.VIR.maxCostTicket : 100;
    if (Number(inputValue[activeClientIndex].replace(",", ".")) === maximumBet) {
      return;
    } else {
      const step = evaluateNextStep(1);
      const bet = Number(inputValue[activeClientIndex].replace(",", ".")) + step;
      onHandlePuntataChange(bet.toString().replace(".", ","));
      setTimeout(() => {
        selectInput.current[activeClientIndex]?.select();
      }, 20);
    }
  }, [selectInput, globalState.configVirtual, inputValue, activeClientIndex, evaluateNextStep, onHandlePuntataChange]);
  const changeInputImportoBaseDecrment = useCallback(() => {
    selectInput.current[activeClientIndex]?.focus();
    const minimumBet = globalState.multipleVirtualBetConfig ? globalState.multipleVirtualBetConfig.importoMinimo : 1;
    if (Number(inputValue[activeClientIndex].replace(",", ".")) === minimumBet) {
      return;
    } else {
      const step = evaluateNextStep(-1);
      const bet = Number(inputValue[activeClientIndex].replace(",", ".")) - step;
      onHandlePuntataChange(bet.toString().replace(".", ","));
      setTimeout(() => {
        selectInput.current[activeClientIndex]?.select();
      }, 20);
    }
  }, [
    activeClientIndex,
    evaluateNextStep,
    globalState.multipleVirtualBetConfig,
    inputValue,
    onHandlePuntataChange,
    selectInput,
  ]);

  const longPressPropsIncrease = useLongPress({
    onClick: () => {
      setHiglightedPrediction(0);
      changeInputImportoBaseIncrement();
    },
    onLongPress: () => {
      setHiglightedPrediction(0);
      changeInputImportoBaseIncrement();
    },
  });
  const longPressPropDecrease = useLongPress({
    onClick: () => {
      changeInputImportoBaseDecrment();
    },
    onLongPress: () => {
      changeInputImportoBaseDecrment();
    },
  });

  const resetPuntataMultipla = useCallback(() => {
    setInputValue({
      ...inputValue,
      [activeClientIndex]: globalState.multipleBetConfig
        ? decimalToInteger(
            globalState.multipleBetConfig.importoBase * configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER,
          )
        : decimalToInteger(configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER),
    });
    setInputUnformattedValue(
      globalState.multipleBetConfig
        ? decimalToInteger(
            globalState.multipleBetConfig.importoBase * configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER,
          )
        : decimalToInteger(configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER),
    );
    setMultiplaFooterVirtualState({
      ...multiplaFooterVirtualState,
      [activeClientIndex]: {
        quotaTotale: { value: 0, factor: 0 },
        vincitaMassima: { value: 0, factor: 0 },
        bonusPerc: { value: 0, factor: 0 },
        bonusEuroValue: "0",
        bet: globalState.multipleBetConfig
          ? globalState.multipleBetConfig.importoBase * configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER
          : 100,
      },
    });
  }, [activeClientIndex, globalState.multipleBetConfig, inputValue, multiplaFooterVirtualState]);
  /**UPDATE SELECTED EVENTS' CURRENT CLIENT */

  const updateVirtualClientEvents = useCallback(
    (selectedEvents: Array<VirtualEventType>) => {
      //update index events shown in AvvenimentiVirtualList
      updateIndexCarrello(selectedEvents);
      //DEBT => per shortcut tab
      if (higlightedPrediction === 0) {
        keyboardNavigationContext.current = undefined;
      }
      const isSistemaIntegrale =
        selectedEvents.length !== selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0);
      const isSistemaACorrezioneDiErrore =
        activeVirtualClient.isSviluppoSistemaActive === true && selectedEvents.length > 1;

      const isSistema = isSistemaIntegrale || isSistemaACorrezioneDiErrore;
      let puntataSistema = activeVirtualClient.puntataSistema;
      if (!isSistema && selectedEvents.length > 0) {
        updateFooterMultipla(selectedEvents);
      }
      if (isSistema === true) {
        //update cardinality in case system is active
        puntataSistema = updatePuntataSistema(selectedEvents);
        // fetch giocataSistemistica
        mutate("giocataSistemisticaSviluppataVirtual", getGiocatasistemisticaPayload(selectedEvents, puntataSistema));
      }
      if (selectedEvents.length === 0) {
        //update cardinality and footer
        setHiglightedPrediction(0);

        puntataSistema = updatePuntataSistema(selectedEvents);
        resetPuntataMultipla();
      }

      //update context
      const newData = {
        ...virtualCartClients[activeClientIndex],
        selectedEvents: selectedEvents,
        isSviluppoSistemaActive: isSistema,
        puntataSistema: puntataSistema,
      };

      updateCurrentVirtualClientData(newData);
    },

    [
      higlightedPrediction,
      activeVirtualClient.isSviluppoSistemaActive,
      activeVirtualClient.puntataSistema,
      virtualCartClients,
      activeClientIndex,
      updateCurrentVirtualClientData,
      keyboardNavigationContext,
      updateFooterMultipla,
      updatePuntataSistema,
      resetPuntataMultipla,
    ],
  );

  /**UPDATE SYSTEM CARDINALITIES' CURRENT CLIENT */
  const updateVirtualClientSviluppoSistema = useCallback(
    (isSistemaActive: boolean) => {
      if (virtualCartClients[activeClientIndex].isSviluppoSistemaActive === isSistemaActive) {
        return;
      }
      const sviluppoSistemaBet = updatePuntataSistema(activeVirtualClient.selectedEvents);
      const newData = {
        ...virtualCartClients[activeClientIndex],
        isSviluppoSistemaActive: isSistemaActive,
        puntataSistema: sviluppoSistemaBet,
      };
      updateCurrentVirtualClientData(newData);
    },
    [
      virtualCartClients,
      activeClientIndex,
      updatePuntataSistema,
      activeVirtualClient.selectedEvents,
      updateCurrentVirtualClientData,
    ],
  );

  /**SWITCH MULTIPLA-SISTEMA */

  const switchMultiplaSistema = useCallback(() => {
    const disciplina = activeVirtualClient.selectedEvents.map((event) => {
      return `${event.provider}_${event.codiceDisciplina}`;
    });
    const disciplinaList = Array.from(new Set(disciplina));

    //Carrello vuoto non compio azioni
    if (activeVirtualClient.selectedEvents.length === 0) {
      return;
    }
    //Sistema a correzione di errore posso switchare a multipla
    if (activeVirtualClient.isSviluppoSistemaActive && activeVirtualClient.selectedEvents.length > 1) {
      updateFooterMultipla(activeVirtualClient.selectedEvents);
      updateVirtualClientSviluppoSistema(false);
    }
    //Sistema integrale non posso switchare a sistema
    if (
      activeVirtualClient.selectedEvents.length !==
      activeVirtualClient.selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0)
    ) {
      return;
    }
    //Multipla con stessa disciplina può switchare a sistema
    if (
      disciplinaList.length === 1 &&
      !activeVirtualClient.isSviluppoSistemaActive &&
      activeVirtualClient.selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0) > 1
    ) {
      mutate(
        "giocataSistemisticaSviluppataVirtual",
        getGiocatasistemisticaPayload(activeVirtualClient.selectedEvents, activeVirtualClient.puntataSistema),
      );
      updateVirtualClientSviluppoSistema(true);
    } else {
      return;
    }
  }, [
    activeVirtualClient.isSviluppoSistemaActive,
    activeVirtualClient.puntataSistema,
    activeVirtualClient.selectedEvents,
    updateFooterMultipla,
    updateVirtualClientSviluppoSistema,
  ]);
  //-----------------------
  //TODO- will be in common sport & virtual client
  //UPDATE TEMPORARILY SETTING (ONLY CURRENT CLIENT)
  const updateVirtualClientImpostazioni = useCallback(
    (impostazioniScommessa: Array<ImpostazioniScommessaType>) => {
      if (
        impostazioniScommessa[0].bet === settingsGame[activeClientIndex].bet &&
        impostazioniScommessa[0].share === settingsGame[activeClientIndex].share
      ) {
        return;
      } else {
        return setSettingsGame({
          ...settingsGame,
          [activeClientIndex]: {
            bet: impostazioniScommessa[0].bet,
            share: impostazioniScommessa[0].share,
          },
        });
      }
    },

    [setSettingsGame, settingsGame, activeClientIndex],
  );

  //SAVE DEFAULT SETTINGS FOR EACH CLIENT
  const updateAllVirtualClientsImpostazioni = useCallback(
    (impostazioniScommessa: Array<ImpostazioniScommessaType>) => {
      setSettingsGame({
        "0": {
          bet: impostazioniScommessa[0].bet,
          share: impostazioniScommessa[0].share,
        },
        "1": {
          bet: impostazioniScommessa[0].bet,
          share: impostazioniScommessa[0].share,
        },
      });
    },

    [setSettingsGame],
  );
  //-----------------------

  /** CART INSERTION */

  const addEsitoVirtualToCart = useCallback(
    ({
      eventId,
      dataEvento,
      formattedData,
      formattedOrario,
      stato,
      idDisciplina,
      descrdisc,
      sogeicodpalinsesto,
      descrEvento,
      sogeicodevento,
      provider,
      descrizioneScommessa,
      rtp,
      result,
      descrizioneEsito,
      quota,
      formattedQuota,
      probwin,
      idEsito,
      idScommessa,
    }: ChiaveEsitoBigliettoVirtualComponents) => {
      if (dataEvento === undefined) {
        const date = formattedData.replaceAll("/", "-").substring(0, formattedData.indexOf(" "));
        const hours = formattedData.substring(formattedData.lastIndexOf(" ")).replace(".", ":").trim();
        const avvenimentoDate = date.concat("T").concat(hours).concat(":00.000Z");
        dataEvento = avvenimentoDate;
      }
      const pronosticiVirtualParams = [
        {
          eventId: eventId,
          codicePalinsesto: sogeicodpalinsesto,
          codiceAvvenimento: sogeicodevento,
          codiceScommessa: idScommessa,
          descrizioneEvento: descrEvento,
          descrizioneAvvenimento: descrizioneScommessa,
          provider: provider,
          codiceDisciplina: idDisciplina,
          siglaDisciplina: descrdisc,
          formattedDataAvvenimento: formattedData,
          dataAvvenimento: dataEvento,
          formattedOrario: formattedOrario,
          stato: stato,
          rtp: rtp,
          result: result,
          descrizioneEsito: descrizioneEsito,
          quota: quota,
          formattedQuota: formattedQuota,
          probwin: probwin,
          codiceEsito: idEsito,
        },
      ];

      const selectedEvents = activeVirtualClient.selectedEvents;

      if (pronosticiVirtualParams === undefined || pronosticiVirtualParams.length === 0) {
        return;
      }
      if (selectedEvents.length === 0) {
        //ADD Multy Event in Cart
        const newerEvents = pronosticiVirtualParams.reduce((eventsAcc, pronostico, index) => {
          const newEsito = toEsitoVirtualType(pronostico, index);
          const eventAccIndex = eventsAcc.findIndex(
            (selectedEvent: VirtualEventType) =>
              selectedEvent.eventId === pronostico.eventId &&
              selectedEvent.codiceAvvenimento === pronostico.codiceAvvenimento,
          );
          //TODO controllare
          const inNewEvent = eventAccIndex > -1;
          if (inNewEvent && eventsAcc.length > 0) {
            // ADDED new Esito in Event already present
            const esiti = eventsAcc[eventAccIndex].esiti;
            eventsAcc[eventAccIndex].esiti = [newEsito, ...esiti];
            return eventsAcc;
          }
          // ADDED new Event
          const newEvent = toEventVirtualType(pronostico, newEsito);
          eventsAcc.push(newEvent);
          return eventsAcc;
        }, [] as VirtualEventType[]);
        updateVirtualClientEvents(newerEvents);
        return;
      }

      const firstPronostico = pronosticiVirtualParams[0];

      const currentEvent = selectedEvents.find(
        (selectedEvent: VirtualEventType) =>
          selectedEvent.eventId === firstPronostico.eventId &&
          selectedEvent.codiceAvvenimento === firstPronostico.codiceAvvenimento,
      );
      const newEsito = toEsitoVirtualType(firstPronostico, 0);
      const currentEsito = currentEvent?.esiti.find(
        (esito: VirtualEsitoType) =>
          esito.codiceEsito === newEsito.codiceEsito &&
          esito.descrizione === newEsito.descrizione &&
          esito.idScommessa === newEsito.idScommessa,
      );
      const newEvent = toEventVirtualType(firstPronostico, newEsito);
      const isPossibleOperation = controlNewEvent(
        selectedEvents,
        newEvent,
        activeVirtualClient.isSviluppoSistemaActive === true,
        currentEsito,
      );
      if (isPossibleOperation) {
        if (!currentEvent) {
          //ADD Event in Car

          updateVirtualClientEvents([newEvent, ...selectedEvents]);
          return;
        }
        //const currentEsito = currentEvent.esiti.find((esito) => esito.id === newEsito.id);
        const newEsiti = !currentEsito
          ? //ADD Esito
            [newEsito, ...currentEvent.esiti]
          : // REMOVE Esito
            currentEvent.esiti.filter((es: VirtualEsitoType) => es !== currentEsito);
        const filterEvents = selectedEvents.filter((ev: VirtualEventType) => ev !== currentEvent);
        const updatedCurrentEvent = { ...currentEvent, esiti: newEsiti };
        //REMOVE Event already present
        const newEvents = [updatedCurrentEvent, ...filterEvents].filter((evento) => evento.esiti.length > 0);

        updateVirtualClientEvents(newEvents);
        return;
      } else {
        return onErrorInsertEventToVirtualCart();
      }
    },
    [
      activeVirtualClient.selectedEvents,
      activeVirtualClient.isSviluppoSistemaActive,
      updateVirtualClientEvents,
      onErrorInsertEventToVirtualCart,
    ],
  );

  /** CART INSERTION ACCOPPIATA TRIO */

  const addAccoppiataTrioVirtualToCart = useCallback(
    ({
      eventId,
      dataEvento,
      formattedData,
      formattedOrario,
      stato,
      idDisciplina,
      descrdisc,
      sogeicodpalinsesto,
      descrEvento,
      sogeicodevento,
      provider,
      descrizioneScommessa,
      rtp,
      result,
      descrizioneEsito,
      quota,
      formattedQuota,
      probwin,
      idEsito,
      idScommessa,
      accoppiataTrio,
    }: ChiaveAccoppiataTrioBigliettoVirtualComponents) => {
      console.log("###addAccoppiataTrioVirtualToCart", idScommessa, accoppiataTrio);
    },
    [],
  );

  /**
   * NAVIGAZIONE TRA ESITI
   * direction===-1 => ArrowUp
   * direction=== 1 => ArrowDown
   */

  const containerRef = React.useRef<HTMLDivElement>(null);
  const onSelectFirstPrediction = useCallback(() => {
    if (activeVirtualClient.selectedEvents.length !== 0) {
      setHiglightedPrediction(activeVirtualClient.selectedEvents[0].esiti[0].indice);
    }
  }, [activeVirtualClient.selectedEvents]);

  const onArrowDownUp = useCallback(
    (direction: 1 | -1) => {
      if (direction === -1) {
        selectInput.current[activeClientIndex]?.blur();
        formatInputValue();
      }
      const maxIndex = activeVirtualClient.selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0);
      const minIndex = 1;
      setHiglightedPrediction((higlightedPrediction) => {
        if (higlightedPrediction - direction > maxIndex) {
          containerRef.current?.scrollTo({ top: 9999 });
          return minIndex;
        } else if (higlightedPrediction - direction < minIndex) {
          containerRef.current?.scrollTo({ top: 0 });
          return maxIndex;
        } else {
          if (
            !activeVirtualClient.isSviluppoSistemaActive ||
            (activeVirtualClient.isSviluppoSistemaActive &&
              activeVirtualClient.selectedEvents.length ===
                activeVirtualClient.selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0))
          ) {
            containerRef.current?.scrollBy(0, 129 * direction);
          } else {
            containerRef.current?.scrollBy(0, 60 * direction);
          }
          return higlightedPrediction - direction;
        }
      });
    },
    [
      activeClientIndex,
      activeVirtualClient.isSviluppoSistemaActive,
      activeVirtualClient.selectedEvents,
      formatInputValue,
    ],
  );

  const openDettaglioAvvenimento = useCallback(() => {
    const currentEvent = activeVirtualClient.selectedEvents.find((evento) =>
      evento.esiti.find((esito) => esito.indice === higlightedPrediction),
    );
    if (currentEvent !== undefined) {
      return openSchedaVirtual({
        eventId: currentEvent.eventId,
        codiceDisciplina: `${currentEvent.provider}_${currentEvent.codiceDisciplina}`,
        sogeicodPalinsesto: currentEvent.codicePalinsesto,
        sogeicodevento: currentEvent.codiceAvvenimento,
      });
    }
  }, [activeVirtualClient.selectedEvents, higlightedPrediction, openSchedaVirtual]);
  const deleteEsito = useCallback(() => {
    const newEvents = [...activeVirtualClient.selectedEvents];
    const currentEvent = activeVirtualClient.selectedEvents.find((evento) =>
      evento.esiti.find((esito) => esito.indice === higlightedPrediction),
    );
    if (currentEvent !== undefined) {
      const indexEvent = newEvents.indexOf(currentEvent);
      if (newEvents[indexEvent].esiti.length > 1) {
        const indexEsito = newEvents[indexEvent].esiti.length - higlightedPrediction;
        newEvents[indexEvent].esiti.splice(indexEsito, 1);
      } else {
        newEvents.splice(indexEvent, 1);
      }
      let carrelloIndex = newEvents.map((evento) => evento.esiti.length).reduce((acc, element) => acc + element, 0);
      if (higlightedPrediction === activeVirtualClient.selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0)) {
        setHiglightedPrediction(higlightedPrediction - 1);
      }
      newEvents.map((evento) =>
        evento.esiti.map((esito) => {
          esito.indice = carrelloIndex;
          carrelloIndex--;
          return null;
        }),
      );
      updateVirtualClientEvents(newEvents);
    }
  }, [activeVirtualClient.selectedEvents, higlightedPrediction, updateVirtualClientEvents]);

  const sellingVirtual = useCallback(() => {
    openAlertWatingVirtualSelling();
    const payload: SellingVirtualRequest =
      activeVirtualClient.isSviluppoSistemaActive === true
        ? { type: "SYSTEM", payload: systemVirtualSellingPayload() }
        : {
            type: "ACCUMULATOR",
            payload: multipleVirtualSellingPayload(
              activeVirtualClient.selectedEvents,
              multiplaFooterVirtualState[activeClientIndex],
              globalState.bonusVirtualConfig ? globalState.bonusVirtualConfig[0] : undefined,
            ),
          };

    onSellingVirtualTransaction(payload, onSellingVirtualCartFlow, updateVirtualClientEvents);
  }, [
    activeClientIndex,
    activeVirtualClient.isSviluppoSistemaActive,
    activeVirtualClient.selectedEvents,
    globalState.bonusVirtualConfig,
    multiplaFooterVirtualState,
    onSellingVirtualCartFlow,
    onSellingVirtualTransaction,
    openAlertWatingVirtualSelling,
    updateVirtualClientEvents,
  ]);
  return useMemo(() => {
    return {
      virtualCartClients,
      activeVirtualClient,
      activeClientIndex,
      changeActiveClient,
      multiplaFooterVirtualState,
      updateFooterMultipla,
      setMultiplaFooterVirtualState,
      setVirtualCartClients,
      setActiveClientIndex,
      addEsitoVirtualToCart,
      addAccoppiataTrioVirtualToCart,
      updateVirtualClientEvents,
      updateVirtualClientSviluppoSistema,
      getGiocatasistemisticaPayload,
      updatePuntataSistema,
      updateCurrentVirtualClientData,
      giocataSistemisticaData,
      higlightedPrediction,
      setHiglightedPrediction,
      onSelectFirstPrediction,
      onArrowDownUp,
      //setSelectInput,
      selectInput,
      longPressPropsIncrease,
      longPressPropDecrease,
      onHandlePuntataChange,
      convertFormattedToString,
      formatInputValue,
      inputValue,
      containerRef,
      openDettaglioAvvenimento,
      deleteEsito,
      sellingVirtual,
      switchMultiplaSistema,
    };
  }, [
    activeClientIndex,
    activeVirtualClient,
    addEsitoVirtualToCart,
    addAccoppiataTrioVirtualToCart,
    changeActiveClient,
    convertFormattedToString,
    formatInputValue,
    giocataSistemisticaData,
    higlightedPrediction,
    inputValue,
    longPressPropDecrease,
    longPressPropsIncrease,
    multiplaFooterVirtualState,
    onArrowDownUp,
    onHandlePuntataChange,
    onSelectFirstPrediction,
    selectInput,
    setActiveClientIndex,
    updateCurrentVirtualClientData,
    updateFooterMultipla,
    updatePuntataSistema,
    updateVirtualClientEvents,
    updateVirtualClientSviluppoSistema,
    virtualCartClients,
    openDettaglioAvvenimento,
    deleteEsito,
    sellingVirtual,
    switchMultiplaSistema,
  ]);
}
