import { SmartSearchState } from "src/components/smart-search/useSmartSearch";
import { CartErrorsType, CartClientType } from "../../../types/carrello.types";
import { useCallback, useContext, useEffect } from "react";
import { KeyboardNavigationContext } from "../../root-container/root-container.component";
import { beep } from "src/components/smart-search/SmartSearch";
import { VenditaOptionalParameters } from "../../../types/vendita.types";

export const useCarrelloShortcuts = ({
  setEventsAreHighlighted,
  setSviluppoSistemaOpen,
  setIsPuntataMultiplaHighlighted,
  activatePuntata,
  isSistemaActive,
  sviluppoSistemaOpen,
  switchSviluppoSistema,
  clients,
  isUserLoggedIn,
  activeClient,
  isPuntataMultiplaHighlighted,
  eventsAreHighlighted,
  isSistemaVendiActive,
  isMultiplaVendiActive,
  setActiveClient,
  validate,
  setActivatePuntata,
  venditaMultipla,
  venditaSistema,
  isWaitingVendi,
  isBetNull,
  onStateChange,
  setSogliaSuperato,
  showChangeQuoteFlag,
  dismissVariazioneQuoteModal,
  potentialWinning,
}: {
  setEventsAreHighlighted: (v: boolean) => void;
  setSviluppoSistemaOpen: (v: boolean) => void;
  setIsPuntataMultiplaHighlighted: (v: boolean) => void;
  activatePuntata: number;
  isSistemaActive: boolean;
  sviluppoSistemaOpen: boolean;
  isUserLoggedIn: boolean;
  switchSviluppoSistema: () => void;
  activeClient: number;
  clients: CartClientType[];
  isPuntataMultiplaHighlighted: boolean;
  eventsAreHighlighted: boolean;
  isSistemaVendiActive: boolean;
  isBetNull: boolean;
  isMultiplaVendiActive: boolean;
  setActiveClient: (c: number) => void;
  validate: CartErrorsType;
  setActivatePuntata: (activatePuntata: number) => void;
  venditaMultipla: (params?: VenditaOptionalParameters) => void;
  venditaSistema: (params?: VenditaOptionalParameters) => void;
  isWaitingVendi: boolean;
  onStateChange(state: SmartSearchState): void;
  setSogliaSuperato: (e: boolean) => void;
  showChangeQuoteFlag: boolean;
  dismissVariazioneQuoteModal: () => void;
  potentialWinning: number;
}) => {
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);

  // const keyVendiEventi = { ctrl: false, enter: false };

  useEffect(() => {
    if (keyboardNavigationContext.current !== "cart") {
      setEventsAreHighlighted(false);
      setSviluppoSistemaOpen(false);
      setIsPuntataMultiplaHighlighted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardNavigationContext.current]);

  useEffect(() => {
    if (activatePuntata !== 0) {
      if (!showChangeQuoteFlag) {
        if (isSistemaActive && !sviluppoSistemaOpen) {
          switchSviluppoSistema();
        } else {
          setIsPuntataMultiplaHighlighted(true);
        }
        keyboardNavigationContext.current = "cart";
      } else if (showChangeQuoteFlag) {
        keyboardNavigationContext.current = "dialog-recupera-biglietto";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activatePuntata, showChangeQuoteFlag]);

  /**
   * VENDITA CTRL+INVIO
   *
   */

  // DEBT
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (isUserLoggedIn && event.ctrlKey && event.key === "Enter" && !isWaitingVendi && !showChangeQuoteFlag) {
        if (clients && clients[activeClient].selectedEvents.length > 0) {
          event.preventDefault();
          // if (!validate.sogliaAntiriciclaggioValidation) {
          if (isMultiplaVendiActive && !isSistemaActive) {
            !validate.sogliaAntiriciclaggioValidation ? venditaMultipla() : setSogliaSuperato(true);
          } else if (isSistemaVendiActive && isSistemaActive && !isBetNull) {
            !validate.sogliaAntiriciclaggioValidation ? venditaSistema() : setSogliaSuperato(true);
          } else {
            beep();
          }
          // } else {
          //   window.alert("Disanonima!");
          // }
        } else {
          beep();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clients,
    isMultiplaVendiActive,
    isSistemaActive,
    isSistemaVendiActive,
    activeClient,
    isWaitingVendi,
    isUserLoggedIn,
    validate.sogliaAntiriciclaggioValidation,
    venditaMultipla,
    venditaSistema,
  ]);

  /**
   * VENDITA CON VARIAZIONE QUOTE
   */

  const selectedEvents = clients[activeClient].selectedEvents;
  const sellWithFlag = useCallback(
    (event: KeyboardEvent, flag: 1 | 2 | 3, potentialWinning) => {
      event.preventDefault();
      dismissVariazioneQuoteModal();
      if (isMultiplaVendiActive && !isSistemaActive) {
        venditaMultipla({ newFlag: flag, potentialWinning: potentialWinning });
      } else if (isSistemaVendiActive && isSistemaActive) {
        venditaSistema({ newFlag: flag });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMultiplaVendiActive, isSistemaActive, isSistemaVendiActive, clients, selectedEvents, potentialWinning],
  );

  // DEBT
  useEffect(
    () => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (keyboardNavigationContext.current === "blocking-operation") {
          return;
        }
        if (
          showChangeQuoteFlag &&
          keyboardNavigationContext.current === "dialog-recupera-biglietto" &&
          !isWaitingVendi
        ) {
          switch (event.key) {
            case "F1":
              event.preventDefault();
              dismissVariazioneQuoteModal();
              break;
            case "F2":
              sellWithFlag(event, 1, potentialWinning);
              break;
            case "F3":
              sellWithFlag(event, 2, potentialWinning);
              break;
          }
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keyboardNavigationContext.current, showChangeQuoteFlag, isWaitingVendi, potentialWinning],
  );

  /**
   * NAVIGAZIONE CARRELLO
   * FRECCIA SU (si posiziona sul primo evento)
   * TASTO + (si posizione su puntata)
   * CASO SINGOLA/MULTIPLA
   */
  // DEBT
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (!sviluppoSistemaOpen) {
        if (event.key === "ArrowUp" && isPuntataMultiplaHighlighted && event.location === 0) {
          event.preventDefault();
          setEventsAreHighlighted(true);
          setIsPuntataMultiplaHighlighted(false);
        } else if (event.key === "+" && eventsAreHighlighted) {
          event.preventDefault();
          setEventsAreHighlighted(false);
          setIsPuntataMultiplaHighlighted(true);
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPuntataMultiplaHighlighted, eventsAreHighlighted]);

  /**
   * SELEZIONA CARRELLO - TASTO TAB
   * Se sono posizionato su input inserimento esiti, premendo
   * il tasto TAB mi sposto su carrello, se c'è almeno un item
   */
  // DEBT
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (
        clients &&
        clients[activeClient].selectedEvents.length > 0 &&
        event.key === "Tab" &&
        keyboardNavigationContext.current === "smart-search"
      ) {
        event.preventDefault();
        setEventsAreHighlighted(true);
        setIsPuntataMultiplaHighlighted(false);
        keyboardNavigationContext.current = "cart";
        onStateChange({
          type: "0",
          subtype: { type: "inattivo" },
          text: "",
        });
      } else if (
        (clients === undefined || clients === null || clients[activeClient].selectedEvents.length === 0) &&
        event.key === "Tab"
      ) {
        event.preventDefault();
        return;
      } else if (event.key === "Tab" && keyboardNavigationContext.current === "cart") {
        event.preventDefault();
        return;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardNavigationContext.current, clients, clients[activeClient].selectedEvents.length]);

  /**
   * CAMBIO CLIENTE - TASTO /
   *
   */
  // DEBT
  // useEffect(() => {
  //   const onKeyDown = (event: KeyboardEvent) => {
  //     if (keyboardNavigationContext.current === "blocking-operation") {
  //       return;
  //     }
  //     if (event.key === "/" && keyboardNavigationContext.current !== "dialog-recupera-biglietto") {
  //       event.preventDefault();
  //       setSviluppoSistemaOpen(false);
  //       if (activatePuntata >= 1) {
  //         setActivatePuntata(0);
  //       }
  //       if (activeClient === 0) {
  //         setActiveClient(1);
  //       } else {
  //         setActiveClient(0);
  //       }
  //     }
  //   };
  //   document.addEventListener("keydown", onKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", onKeyDown);
  //   };
  // }, [
  //   activatePuntata,
  //   activeClient,
  //   keyboardNavigationContext,
  //   setActivatePuntata,
  //   setActiveClient,
  //   setSviluppoSistemaOpen,
  // ]);
};
