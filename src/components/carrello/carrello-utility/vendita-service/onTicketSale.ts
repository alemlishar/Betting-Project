import { useContext, useEffect } from "react";
import { useCartClientsContext } from "src/components/common/context-clients/ClientsContext";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import configuration from "src/helpers/configuration";
import { NewQuote } from "src/types/carrello.types";

export const OnTicketSale = ({
  newQuote,
  activeClient,
  isWaitingVendi,
  showChangeQuoteFlag,
  codiceEsitoVendita,
  onStateChange,
  updateClientEvents,
  setShowChangeQuoteFlag,
}: {
  newQuote: NewQuote[];
  activeClient: number;
  isWaitingVendi: boolean;
  showChangeQuoteFlag: boolean;
  codiceEsitoVendita: string;
  onStateChange: any;
  updateClientEvents: any;
  setShowChangeQuoteFlag: (e: boolean) => void;
}) => {
  // change the keyboard context if the modal of Variazione Quote is shown
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  const clients = useCartClientsContext();
  const selectedEvents = clients[activeClient].selectedEvents;

  useEffect(() => {
    if (
      showChangeQuoteFlag === true ||
      isWaitingVendi ||
      codiceEsitoVendita !== configuration.SELL_STATUS.NOT_SELLING
    ) {
      onStateChange({
        type: "0",
        subtype: { type: "inattivo" },
        text: "",
      });
      keyboardNavigationContext.current = "dialog-recupera-biglietto";
    } else {
      onStateChange({
        type: "0",
        subtype: { type: "focus" },
        text: "",
      });
      keyboardNavigationContext.current = "smart-search";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWaitingVendi, codiceEsitoVendita, showChangeQuoteFlag]);
  //TODO: spostare in vendita
  useEffect(() => {
    let newQuoteVariateSelectedEvents = [...selectedEvents];
    if (newQuote && newQuote.length > 0) {
      newQuoteVariateSelectedEvents.map((event) => {
        event.esiti.map((esito) => {
          let newEvent = newQuote.filter((scommessa) => {
            return (
              scommessa.palinsesto === esito.codicePalinsesto &&
              scommessa.avvenimento === esito.codiceAvvenimento &&
              scommessa.scommessa === esito.codiceScommessa &&
              scommessa.esito === esito.codiceEsito
            );
          });
          if (esito.quota !== newEvent[0].quota) {
            esito.quotaVariataUpDown = esito.quota > newEvent[0].quota ? "down" : "up";
            esito.quotaVariata = true;
            esito.quota = newEvent[0].quota;
          }
          return esito;
        });
        event.hasQuoteVariate =
          event.esiti.filter((esito) => {
            return esito.quotaVariata === true;
          }).length > 0;
        return event;
      });
      updateClientEvents(newQuoteVariateSelectedEvents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newQuote]);

  /**
   * DISMISS variazione quote modal
   */
  const dismissVariazioneQuoteModal = () => {
    setShowChangeQuoteFlag(false);
    let tmpSelectedEvents = [...selectedEvents];
    tmpSelectedEvents.map((event) => {
      event.esiti.map((esito) => {
        esito.quotaVariataUpDown = "";
        esito.quotaVariata = false;
        return esito;
      });
      event.hasQuoteVariate = false;
      return event;
    });
    updateClientEvents({ ...tmpSelectedEvents });
  };

  return {
    dismissVariazioneQuoteModal,
  };
};
