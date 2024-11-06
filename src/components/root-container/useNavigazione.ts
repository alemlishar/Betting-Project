import React, { useCallback, useContext, useMemo, useState } from "react";
import { BlockingAlertProps } from "src/components/common/blocking-alert/BlockingAlert";
import { TicketIndex } from "src/components/dialog-prenotazione/DialogPrenotazioneMultiBiglietto";
import {
  defaultDialogPrenotazioneState,
  DialogPrenotazioneState,
} from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { AlberaturaLive } from "src/components/live/live-api";
import { getDefaultLiveState, LiveState } from "src/components/live/useLive";
import { FiltroGiuornalieroString, getFiltroGiornalieroFromString } from "src/components/prematch/MenuPrematch";
import {
  Avvenimento,
  Cluster,
  Disciplina,
  FiltroGiornaliero,
  HomePagePrematchState,
  InfoAggiuntiva,
  InfoAggiuntivaAggregator,
  InfoAggiuntivaAggregatorGroup,
  Manifestazione,
  MetaScommessaTemplate,
  Scommessa,
} from "src/components/prematch/prematch-api";
import { defaultPrematchState, PrematchState } from "src/components/prematch/usePrematch";
import { SmartSearchState } from "src/components/smart-search/useSmartSearch";
import { SetState } from "src/helpers/setState";
import {
  CodiceAvvenimento,
  CodiceDisciplina,
  CodiceManifestazione,
  CodicePalinsesto,
  makeChiaveManifestazione,
} from "src/types/chiavi";
import { cache, mutate } from "swr";
import { ChiaveManifestazione, ChiaveScommessa, NickName } from "./../../types/chiavi";
import { VirtualStateNavigation } from "src/components/virtual/virtual-dto";

// DEBT 3 eliminare prop drilling di onLiveStateChange
// DEBT 3 aprire dettaglio live da top live
// DEBT 3 fare i back su prematch

export function useNavigazione({
  onSmartSearchStateChange,
  onLiveStateChange,
  onPrematchStateChange,
  onVirtualStateChange,
  onHomePagePrematchStateChange,
  onDialogPrenotazioneStateChange,
  onBlockingAlertState,
  alberaturaLive,
}: {
  onSmartSearchStateChange: SetState<SmartSearchState>;
  onLiveStateChange: SetState<LiveState>;
  onPrematchStateChange: SetState<PrematchState>;
  onVirtualStateChange: SetState<VirtualStateNavigation | undefined>;
  onHomePagePrematchStateChange: SetState<HomePagePrematchState>;
  onDialogPrenotazioneStateChange: SetState<DialogPrenotazioneState>;
  onBlockingAlertState: SetState<BlockingAlertProps | undefined>;
  alberaturaLive: AlberaturaLive | undefined;
}) {
  const [state, setState] = useState<NavigazioneState>(defaultNavigazioneState);
  const openSezioneSport = useCallback(() => {
    setState({
      ...state,
      sezione: "sport",
      sottosezione: {
        type: "home",
        tab: "prematch",
      },
    });
    onSmartSearchStateChange({ type: "0", subtype: { type: "focus" }, text: "" });
    onPrematchStateChange((prematchState) =>
      prematchState.schedaManifestazione !== undefined ? defaultPrematchState : prematchState,
    );
    mutate("alberatura prematch");
    onHomePagePrematchStateChange("prematch");
  }, [state, onHomePagePrematchStateChange, onPrematchStateChange, onSmartSearchStateChange]);
  const openSezioneLive = useCallback(() => {
    setState({
      ...state,
      sezione: "live",
      sottosezione: {
        type: "tutto",
      },
    });
    onSmartSearchStateChange({ type: "0", subtype: { type: "focus" }, text: "" });
    onLiveStateChange(getDefaultLiveState(alberaturaLive));
  }, [state, alberaturaLive, onLiveStateChange, onSmartSearchStateChange]);
  const openSezioneVirtual = useCallback(() => {
    setState({
      ...state,
      sezione: "virtual",
      // sottosezione: {
      //   type: "tutto",
      // },
    });
    onSmartSearchStateChange({ type: "0", subtype: { type: "focus" }, text: "" });
    // onVirtualStateChange(getDefaultLiveState(alberaturaLive));
  }, [state, onSmartSearchStateChange]);
  const openSezionePrenotazione = useCallback(() => {
    setState({
      ...state,
      sezione: "prenotazione",
    });
    onSmartSearchStateChange({ type: "0", subtype: { type: "focus" }, text: "" });
  }, [state, onSmartSearchStateChange]);
  // DEBT 3 usare soltanto le componenti chiave avvenimento (recuperare disciplina, manifestazione, avvenimento dentro usePrematchState)
  const openSchedaAvvenimentoPrematch = useCallback(
    ({
      disciplina,
      manifestazione,
      avvenimento,
      previousSezione,
      codiceDisciplina,
      codiceManifestazione,
      codiceAvvenimento,
      codicePalinsesto,
    }: {
      disciplina: Disciplina | undefined;
      manifestazione: Manifestazione | undefined;
      avvenimento: Avvenimento | undefined;
      previousSezione: SezioneAttiva;
      codiceDisciplina: CodiceDisciplina;
      codiceManifestazione: CodiceManifestazione;
      codiceAvvenimento: CodiceAvvenimento;
      codicePalinsesto: CodicePalinsesto;
    }) => {
      setState({
        ...state,
        sezione: "sport",
        sottosezione: {
          type: "scheda-avvenimento",
          codicePalinsesto,
          codiceDisciplina,
          codiceManifestazione,
          codiceAvvenimento,
          previousSezione: previousSezione,
        },
      });
      onPrematchStateChange((prematchState) => ({
        ...prematchState,
        schedaAvvenimento: {
          disciplina,
          manifestazione,
          avvenimento,
          codiceDisciplina,
          codiceManifestazione,
          codiceAvvenimento,
          codicePalinsesto,
        },
      }));
    },
    [state, onPrematchStateChange],
  );
  const openSchedaInfoAggiuntivaAggregatorPrematch = useCallback(
    (infoAggiuntivaAggregator: InfoAggiuntivaAggregator) => {
      setState({
        ...state,
        sezione: "sport",
        sottosezione: {
          type: "scheda-info-aggiuntiva-aggregator",
        },
      });
      onPrematchStateChange((prematchState) => ({
        ...prematchState,
        schedaInfoAggiuntivaAggregator: { infoAggiuntivaAggregator },
      }));
    },
    [state, onPrematchStateChange],
  );
  const openSchedaAvvenimentoLive = useCallback(
    ({
      disciplina,
      manifestazione,
      avvenimento,
      codiceDisciplina,
      codiceManifestazione,
      codicePalinsesto,
      codiceAvvenimento,
      previousSezione,
    }: {
      disciplina: Disciplina | undefined;
      manifestazione: Manifestazione | undefined;
      avvenimento: Avvenimento | undefined;
      previousSezione: SezioneAttiva;
      codiceDisciplina: CodiceDisciplina;
      codiceManifestazione: CodiceManifestazione;
      codiceAvvenimento: CodiceAvvenimento;
      codicePalinsesto: CodicePalinsesto;
    }) => {
      setState({
        ...state,
        sezione: "live",
        sottosezione: {
          type: "scheda-avvenimento",
          codiceDisciplina,
          codiceManifestazione,
          codicePalinsesto,
          codiceAvvenimento,
          previousSezione: previousSezione,
        },
      });
      onLiveStateChange((liveState) => ({
        ...liveState,
        selected: {
          type: "avvenimento",
          disciplina,
          manifestazione,
          avvenimento,
          codicePalinsesto,
          codiceDisciplina,
          codiceManifestazione,
          codiceAvvenimento,
        },
        codiceDisciplinaOpen: codiceDisciplina,
        chiaviManifestazioneOpen: {
          ...liveState.chiaviManifestazioneOpen,
          [makeChiaveManifestazione({ codiceDisciplina, codiceManifestazione })]: true,
        },
      }));
    },
    [state, onLiveStateChange],
  );

  const openSchedaDisciplinaLiveFromHomePrematch = useCallback(
    ({ disciplina }: { disciplina: Disciplina }) => {
      setState({
        ...state,
        sezione: "live",
        sottosezione: {
          type: "scheda-disciplina",
          codiceDisciplina: disciplina.codiceDisciplina,
        },
      });
      onLiveStateChange((liveState) => ({
        ...liveState,
        selected: { type: "disciplina", disciplina },
        codiceDisciplinaOpen: disciplina.codiceDisciplina,
      }));
    },
    [state, onLiveStateChange],
  );
  const openSchedaVirtual = useCallback(
    (virtualState: VirtualStateNavigation) => {
      onVirtualStateChange(virtualState);
    },
    [onVirtualStateChange],
  );

  const closeSchedaInfoAggiuntivaAggregator = useCallback(() => {
    setState({
      ...state,
      sezione: "sport",
      sottosezione: {
        type: "scheda-info-aggiuntiva-aggregator",
      },
    });
    onPrematchStateChange((prematchState) => ({ ...prematchState, schedaInfoAggiuntivaAggregator: undefined }));
  }, [state, onPrematchStateChange]);
  const setFiltroGiornalieroScheda = useCallback(
    (filtroGiornaliero: FiltroGiornaliero) => {
      onPrematchStateChange((prematchState) => ({
        ...prematchState,
        schedaManifestazione: prematchState.schedaManifestazione
          ? { ...prematchState.schedaManifestazione, filtroGiornaliero }
          : undefined,
      }));
    },
    [onPrematchStateChange],
  );

  //DEBT 4 verificare il recupero della manifestazione
  const closeSchedaAvvenimentoPrematch = useCallback(
    ({ manifestazione }: { manifestazione: Manifestazione }) => {
      setState({
        ...state,
        sezione: "sport",
        sottosezione: {
          type: "scheda-manifestazione",
          codiceDisciplina: manifestazione.codiceDisciplina,
          codiceManifestazione: manifestazione.codiceManifestazione,
        },
      });

      onPrematchStateChange((prematchState) => ({ ...prematchState, schedaAvvenimento: undefined }));
    },
    [state, onPrematchStateChange],
  );
  const closeSchedaAvvenimentoLive = useCallback(
    (disciplina: Disciplina) => {
      if (
        state.sezione === "live" &&
        state.sottosezione.type === "scheda-avvenimento" &&
        state.sottosezione.previousSezione === "sport"
      ) {
        setState({
          ...state,
          sezione: "sport",
          sottosezione: {
            type: "home",
            tab: "live",
          },
        });
      } else if (
        state.sezione === "live" &&
        state.sottosezione.type === "scheda-avvenimento" &&
        state.sottosezione.previousSezione === "live"
      ) {
        setState({
          ...state,
          sezione: "live",
          sottosezione: {
            type: "scheda-disciplina",
            codiceDisciplina: disciplina.codiceDisciplina,
          },
        });
      }
      onLiveStateChange((liveState) => ({
        ...liveState,
        selected: { type: "disciplina", disciplina },
      }));
    },
    [state, onLiveStateChange],
  );
  const openSchedaManifestazionePrematch = useCallback(
    (disciplina: Disciplina, manifestazione: Manifestazione) => {
      setState({
        ...state,
        sezione: "sport",
        sottosezione: {
          type: "scheda-manifestazione",
          codiceDisciplina: disciplina.codiceDisciplina,
          codiceManifestazione: manifestazione.codiceManifestazione,
        },
      });
      onSmartSearchStateChange({ type: "0", subtype: { type: "inattivo" }, text: "" });
      onPrematchStateChange((prematchState) => ({
        ...prematchState,
        schedaAvvenimento: undefined,
        schedaManifestazione: {
          disciplina,
          manifestazione,
          userSelectedView: undefined,
          isMarketGridOpen: false,
          filtroGiornaliero: getFiltroGiornalieroFromString(prematchState.filtro),
        },
      }));
    },
    [state, onPrematchStateChange, onSmartSearchStateChange],
  );
  const setFiltroGiornalieroMenu = useCallback(
    (filtro: FiltroGiuornalieroString) => {
      onPrematchStateChange((prematchState) => ({
        ...prematchState,
        filtro,
        schedaManifestazione: prematchState.schedaManifestazione
          ? { ...prematchState.schedaManifestazione, filtroGiornaliero: getFiltroGiornalieroFromString(filtro) }
          : undefined,
      }));
    },
    [onPrematchStateChange],
  );
  const disciplinaPrematchToggle = useCallback(
    (disciplina: Disciplina) => {
      onPrematchStateChange((prematchState) => ({
        ...prematchState,
        isDisciplinaAccordionOpenByKey: {
          ...prematchState.isDisciplinaAccordionOpenByKey,
          [disciplina.key]: !prematchState.isDisciplinaAccordionOpenByKey[disciplina.key],
        },
      }));
    },
    [onPrematchStateChange],
  );
  const closeSchedaManifestazionePrematch = useCallback(() => {
    setState({
      ...state,
      sezione: "sport",
      sottosezione: {
        type: "home",
        tab: "prematch",
      },
    });
    onPrematchStateChange((prematchState) => ({ ...prematchState, schedaManifestazione: undefined }));
  }, [state, onPrematchStateChange]);
  const openSchedaManifestazionePrematchClasseEsito = useCallback(
    (cluster: Cluster, metaScommessaTemplate: MetaScommessaTemplate) => {
      onPrematchStateChange((prematchState) =>
        prematchState.schedaManifestazione
          ? {
              ...prematchState,
              schedaManifestazione: {
                ...prematchState.schedaManifestazione,
                userSelectedView: { cluster, metaScommessaTemplate },
                isMarketGridOpen: false,
              },
            }
          : prematchState,
      );
    },
    [onPrematchStateChange],
  );
  const toggleSchedaManifestazioneAltreClasseEsito = useCallback(() => {
    onPrematchStateChange((prematchState) =>
      prematchState.schedaManifestazione
        ? {
            ...prematchState,
            schedaManifestazione: {
              ...prematchState.schedaManifestazione,
              isMarketGridOpen: !prematchState.schedaManifestazione.isMarketGridOpen,
            },
          }
        : prematchState,
    );
  }, [onPrematchStateChange]);
  const changeHomePageTab = useCallback(
    (stateHomePage: HomePagePrematchState) => {
      setState({
        ...state,
        sezione: "sport",
        sottosezione: {
          type: "home",
          tab: stateHomePage,
        },
      });
      onHomePagePrematchStateChange(stateHomePage);
    },
    [state, onHomePagePrematchStateChange],
  );

  const closeAllToggleDisciplinaMenuLive = useCallback(() => {
    onLiveStateChange((liveState) => ({ ...liveState, selected: { type: "tutto" }, codiceDisciplinaOpen: undefined }));
  }, [onLiveStateChange]);
  const openSchedaDisciplinaLive = useCallback(
    ({
      disciplina,
      isSelectedDisciplina,
      isDisciplinaOpen,
      manifestazione,
    }: {
      disciplina: Disciplina;
      isSelectedDisciplina: boolean;
      isDisciplinaOpen: boolean;
      manifestazione: Manifestazione;
    }) => {
      setState({
        ...state,
        sezione: "live",
        sottosezione: {
          type: "scheda-disciplina",
          codiceDisciplina: disciplina.codiceDisciplina,
        },
      });
      onLiveStateChange((liveState) => ({
        ...liveState,
        selected: { type: "disciplina", disciplina },
        codiceDisciplinaOpen: isSelectedDisciplina && isDisciplinaOpen ? undefined : disciplina.codiceDisciplina,
        chiaviManifestazioneOpen: {
          ...liveState.chiaviManifestazioneOpen,
          [makeChiaveManifestazione(manifestazione)]: true,
        },
      }));
    },
    [state, onLiveStateChange],
  );
  const toggleDisciplinaMenuLive = useCallback(
    (chiaveManifestazione: ChiaveManifestazione) => {
      onLiveStateChange((liveState) => ({
        ...liveState,
        chiaviManifestazioneOpen: {
          ...liveState.chiaviManifestazioneOpen,
          [chiaveManifestazione]: !liveState.chiaviManifestazioneOpen[chiaveManifestazione],
        },
      }));
    },
    [onLiveStateChange],
  );

  const openDialogPrenotazioneByNick = useCallback(
    (nickName: NickName) => {
      onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
        ...dialogPrenotazione,
        isMinimized: false,
        dialogPrenotazioneNickname: nickName,
        selledTickets: {},
        notSelledTickets: {},
        actualTicketIndex: 0,
        totalSellTicket: 0,
      }));
    },
    [onDialogPrenotazioneStateChange],
  );
  const openDialogPrenotazioneByCode = useCallback(
    (code: NickName) => {
      onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
        ...dialogPrenotazione,
        isMinimized: false,
        dialogPrenotazioneCode: code,
        selledTickets: {},
        notSelledTickets: {},
        actualTicketIndex: 0,
        totalSellTicket: 0,
      }));
    },
    [onDialogPrenotazioneStateChange],
  );

  const openDialogPrenotazioneNotAvailable = useCallback(
    (nickName: NickName) => {
      onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
        ...dialogPrenotazione,
        isMinimized: false,
        dialogPrenotazioneNotAvailable: nickName,
        sellTicketState: undefined,
      }));
    },
    [onDialogPrenotazioneStateChange],
  );

  const minimizeDialogPrenotazione = useCallback(() => {
    onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
      ...dialogPrenotazione,
      isMinimized: true,
    }));
  }, [onDialogPrenotazioneStateChange]);

  const unminimizeDialogPrenotazione = useCallback(() => {
    onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
      ...dialogPrenotazione,
      isMinimized: false,
    }));
  }, [onDialogPrenotazioneStateChange]);

  const closeDialogPrenotazione = useCallback(
    (nickname: string) => {
      cache.delete([nickname]);
      onDialogPrenotazioneStateChange(defaultDialogPrenotazioneState);
    },
    [onDialogPrenotazioneStateChange],
  );

  const openSellDialogPrenotazione = useCallback(
    (ticketIndex: number) => {
      onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
        ...dialogPrenotazione,
        sellTicketState: {
          isSellingWithProgressBar: false,
          ticketToSellIndex: ticketIndex,
          sellTicketStateWithNewOdd: false,
          ticketViewed: [],
          progressBarActualCounter: 0,
          progressBarTotalCounter: 0,
        },
      }));
    },
    [onDialogPrenotazioneStateChange],
  );

  const openSellDialogPrenotazioneFromList = useCallback(
    (ticketIndex: number, nickname: string) => {
      onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
        ...dialogPrenotazione,

        dialogPrenotazioneNickname: nickname,
        isMinimized: false,
        sellTicketState: {
          isSellingWithProgressBar: false,
          ticketToSellIndex: ticketIndex,
          sellTicketStateWithNewOdd: false,
          ticketViewed: [],
          progressBarActualCounter: 0,
          progressBarTotalCounter: 0,
        },
      }));
    },
    [onDialogPrenotazioneStateChange],
  );

  const openSellDialogPrenotazioneMultiBigliettoFromModulo = useCallback(
    (
      ticketIndex: number,
      ticketViewed: TicketIndex[],
      actualIndex,
      totalCounter,
      temporaryNotSelledTickets?: Record<number, string>,
    ) => {
      onDialogPrenotazioneStateChange((dialogPrenotazione) => {
        const newNotSelledTickets = temporaryNotSelledTickets ?? dialogPrenotazione.notSelledTickets;
        return {
          ...dialogPrenotazione,
          notSelledTickets: newNotSelledTickets,
          actualTicketIndex: ticketIndex,
          sellTicketState: {
            isSellingWithProgressBar: true,
            ticketToSellIndex: ticketIndex,
            sellTicketStateWithNewOdd: false,
            ticketViewed,
            progressBarActualCounter: actualIndex,
            progressBarTotalCounter: totalCounter,
          },
        };
      });
    },
    [onDialogPrenotazioneStateChange],
  );

  const endSellingOnDialogPrenotazione = useCallback(() => {
    onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
      ...dialogPrenotazione,
      sellTicketState: undefined,
    }));
  }, [onDialogPrenotazioneStateChange]);

  const endSellingOnDialogPrenotazioneWithAmountChangedRejected = useCallback(
    (notSelledTickets: Record<TicketIndex, string>) => {
      onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
        ...dialogPrenotazione,
        notSelledTickets: notSelledTickets,
        sellTicketState: undefined,
        amountChangedTicketResponse: undefined,
      }));
    },
    [onDialogPrenotazioneStateChange],
  );

  const openSellDialogPrenotazioneMultiBigliettoFromList = useCallback(
    (nickname: string, actualIndex: number, totalCounter: number) => {
      onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
        ...dialogPrenotazione,

        dialogPrenotazioneNickname: nickname,
        isMinimized: false,
        selledTickets: [],
        sellTicketState: {
          ticketToSellIndex: 0,
          sellTicketStateWithNewOdd: false,
          isSellingWithProgressBar: true,
          ticketViewed: [],
          progressBarActualCounter: actualIndex,
          progressBarTotalCounter: totalCounter,
        },
      }));
    },
    [onDialogPrenotazioneStateChange],
  );

  const openTicketDialogPrenotazioneMultiBiglietto = useCallback(
    (ticketId: TicketIndex) => {
      onDialogPrenotazioneStateChange((dialogPrenotazione) => ({
        ...dialogPrenotazione,
        actualTicketIndex: ticketId,
      }));
    },
    [onDialogPrenotazioneStateChange],
  );

  const openInfoAggiuntivaAggregatorModal = useCallback(
    (
      infoAggiuntiva: InfoAggiuntiva,
      infoAggiuntivaAggregator: InfoAggiuntivaAggregator,
      infoAggiuntivaAggregatorGroup: InfoAggiuntivaAggregatorGroup,
      avvenimento: Avvenimento,
      manifestazione: Manifestazione,
      disciplina: Disciplina,
      scommessaMap: Record<ChiaveScommessa, Scommessa>,
    ) => {
      onPrematchStateChange((prematchState) => ({
        ...prematchState,
        infoAggiuntivaAggregatorModal: {
          infoAggiuntiva: infoAggiuntiva,
          infoAggiuntivaAggregator: infoAggiuntivaAggregator,
          infoAggiuntivaAggregatorGroup: infoAggiuntivaAggregatorGroup,
          avvenimento: avvenimento,
          manifestazione: manifestazione,
          disciplina: disciplina,
          scommessaMap: scommessaMap,
        },
      }));
    },
    [onPrematchStateChange],
  );

  const onCloseInfoAggiuntivaAggregatorModal = useCallback(() => {
    onPrematchStateChange((prematchState) => ({ ...prematchState, infoAggiuntivaAggregatorModal: undefined }));
  }, [onPrematchStateChange]);

  const openBlockingAlertState = useCallback(
    (newBlockingAlert: React.ReactNode) => {
      onBlockingAlertState({ item: newBlockingAlert });
    },
    [onBlockingAlertState],
  );

  const closeBlockingAlertState = useCallback(() => {
    onBlockingAlertState(undefined);
  }, [onBlockingAlertState]);

  const openSezioneBordero = useCallback(() => {
    if (state.sezione !== "bordero") {
      setState({ ...state, sezione: "bordero" });
    }

    onSmartSearchStateChange({ type: "0", subtype: { type: "focus" }, text: "" });
  }, [onSmartSearchStateChange, state]);

  const goToHomeBySmartSearch = useCallback(() => {
    switch (state.sezione) {
      case "sport":
        onPrematchStateChange(defaultPrematchState);
        setState({ ...state, sezione: "sport" });
        break;
      case "live":
        onLiveStateChange(getDefaultLiveState(alberaturaLive));
        setState({ ...state, sezione: "live" });
        break;
    }
  }, [state, alberaturaLive, onLiveStateChange, onPrematchStateChange]);

  const actions = useMemo(
    () => ({
      openSezioneSport,
      openSezioneLive,
      openSezioneVirtual,
      openSezionePrenotazione,
      openSezioneBordero,
      openSchedaAvvenimentoPrematch,
      openSchedaInfoAggiuntivaAggregatorPrematch,
      openSchedaAvvenimentoLive,
      openSchedaDisciplinaLiveFromHomePrematch,
      openSchedaVirtual,
      closeSchedaInfoAggiuntivaAggregator,
      setFiltroGiornalieroScheda,
      closeSchedaAvvenimentoPrematch,
      closeSchedaAvvenimentoLive,
      openSchedaManifestazionePrematch,
      setFiltroGiornalieroMenu,
      disciplinaPrematchToggle,
      closeSchedaManifestazionePrematch,
      openSchedaManifestazionePrematchClasseEsito,
      toggleSchedaManifestazioneAltreClasseEsito,
      changeHomePageTab,
      closeAllToggleDisciplinaMenuLive,
      openSchedaDisciplinaLive,
      toggleDisciplinaMenuLive,
      openDialogPrenotazioneByNick,
      openDialogPrenotazioneByCode,
      openDialogPrenotazioneNotAvailable,
      minimizeDialogPrenotazione,
      closeDialogPrenotazione,
      unminimizeDialogPrenotazione,
      openSellDialogPrenotazione,
      openSellDialogPrenotazioneFromList,
      openSellDialogPrenotazioneMultiBigliettoFromModulo,
      openSellDialogPrenotazioneMultiBigliettoFromList,
      openTicketDialogPrenotazioneMultiBiglietto,
      openInfoAggiuntivaAggregatorModal,
      onCloseInfoAggiuntivaAggregatorModal,
      endSellingOnDialogPrenotazione,
      endSellingOnDialogPrenotazioneWithAmountChangedRejected,
      openBlockingAlertState,
      closeBlockingAlertState,
      goToHomeBySmartSearch,
    }),
    [
      openSezioneSport,
      openSezioneLive,
      openSezioneVirtual,
      openSezionePrenotazione,
      openSezioneBordero,
      openSchedaAvvenimentoPrematch,
      openSchedaInfoAggiuntivaAggregatorPrematch,
      openSchedaAvvenimentoLive,
      openSchedaDisciplinaLiveFromHomePrematch,
      openSchedaVirtual,
      closeSchedaInfoAggiuntivaAggregator,
      setFiltroGiornalieroScheda,
      closeSchedaAvvenimentoPrematch,
      closeSchedaAvvenimentoLive,
      openSchedaManifestazionePrematch,
      setFiltroGiornalieroMenu,
      disciplinaPrematchToggle,
      closeSchedaManifestazionePrematch,
      openSchedaManifestazionePrematchClasseEsito,
      toggleSchedaManifestazioneAltreClasseEsito,
      changeHomePageTab,
      closeAllToggleDisciplinaMenuLive,
      openSchedaDisciplinaLive,
      toggleDisciplinaMenuLive,
      openDialogPrenotazioneByNick,
      openDialogPrenotazioneByCode,
      openDialogPrenotazioneNotAvailable,
      minimizeDialogPrenotazione,
      closeDialogPrenotazione,
      unminimizeDialogPrenotazione,
      openSellDialogPrenotazione,
      openSellDialogPrenotazioneFromList,
      openSellDialogPrenotazioneMultiBigliettoFromModulo,
      openSellDialogPrenotazioneMultiBigliettoFromList,
      openTicketDialogPrenotazioneMultiBiglietto,
      openInfoAggiuntivaAggregatorModal,
      onCloseInfoAggiuntivaAggregatorModal,
      endSellingOnDialogPrenotazione,
      endSellingOnDialogPrenotazioneWithAmountChangedRejected,
      openBlockingAlertState,
      closeBlockingAlertState,
      goToHomeBySmartSearch,
    ],
  );
  return [state, actions] as const;
}

export const NavigazioneContext = React.createContext<ReturnType<typeof useNavigazione>[1]>(null as any);

export function useNavigazioneActions() {
  return useContext(NavigazioneContext);
}

type NavigazioneState =
  | {
      sezione: "sport";
      sottosezione:
        | {
            type: "home";
            tab: HomePagePrematchState;
          }
        | {
            type: "scheda-manifestazione";
            codiceDisciplina: CodiceDisciplina;
            codiceManifestazione: CodiceManifestazione;
          }
        | {
            type: "scheda-avvenimento";
            codicePalinsesto: CodicePalinsesto;
            codiceDisciplina: CodiceDisciplina;
            codiceManifestazione: CodiceManifestazione;
            codiceAvvenimento: CodiceAvvenimento;
            previousSezione: SezioneAttiva;
          }
        | {
            type: "scheda-info-aggiuntiva-aggregator";
          };
    }
  | {
      sezione: "live";
      sottosezione:
        | { type: "tutto" }
        | { type: "scheda-disciplina"; codiceDisciplina: CodiceDisciplina }
        | {
            type: "scheda-avvenimento";
            codicePalinsesto: CodicePalinsesto;
            codiceDisciplina: CodiceDisciplina;
            codiceManifestazione: CodiceManifestazione;
            codiceAvvenimento: CodiceAvvenimento;
            previousSezione: SezioneAttiva;
          };
    }
  | {
      sezione: "prenotazione";
    }
  | {
      sezione: "virtual";
    }
  | {
      sezione: "bordero";
    };

export type SezioneAttiva = NavigazioneState["sezione"];

const defaultNavigazioneState: NavigazioneState = {
  sezione: "sport",
  sottosezione: {
    type: "home",
    tab: "prematch",
  },
};
