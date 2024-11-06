import { CartClientType, EventoType } from "../../../types/carrello.types";
import { Cliente } from "./Cliente";
import { ReactComponent as IcoTrash } from "../../../assets/images/icon-trash.svg";
import { ReactComponent as IconTrashColore } from "../../../assets/images/icon-trash-colore.svg";
import React, { useEffect, useContext, useState, useMemo } from "react";

import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";

import { useCartClientsContext } from "../../common/context-clients/ClientsContext";
import { canBeMultiple } from "src/components/carrello/helpers";
import {
  StyledCarrelloBodyTicketType,
  StyledCarrelloHeadboard,
  StyledCarrelloHeader,
  StyledCarrelloTicketTypeContainer,
  StyledSettingsButton,
  StyledSettingsContainer,
  StyledCarrelloButton,
} from "src/components/carrello-common/Header.style";

export const CarrelloHeader = ({
  activeClient,
  setActiveClient,
  isSistema,
  updateClientOldSviluppoSistema,
  updateClientEvents,
  activatePuntata,
  setActivatePuntata,
  isOptionActive,
  setOptionActive,
  setIsChange,
  setSviluppoSistemaOpen,
  setTriggerChange,
}: {
  setTriggerChange: (i: boolean) => void;
  activeClient: number;
  isSistema: boolean;
  setActiveClient: (i: number) => void;
  updateClientOldSviluppoSistema: () => void;
  updateClientEvents: (events: EventoType[]) => void;
  activatePuntata: number;
  setActivatePuntata: (activatePuntata: number) => void;
  isOptionActive: boolean;
  setOptionActive: (activeOption: boolean) => void;
  setIsChange: (e: boolean) => void;
  setSviluppoSistemaOpen: (trigger: boolean) => void;
}) => {
  const clients = useCartClientsContext();
  const eventsNumber = clients[activeClient].selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0);
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);

  const [isAcid, setAcidColor] = useState(false);
  const isMultiplaActive = useMemo(() => {
    return !isSistema;
  }, [isSistema]);
  const isMultiplaAvailable = useMemo(() => {
    return canBeMultiple(clients[activeClient].selectedEvents);
  }, [clients, activeClient]);

  const isSistemaActive = useMemo(() => {
    return isSistema;
  }, [isSistema]);

  const isSistemaAvailable = useMemo(() => {
    return eventsNumber > 1;
  }, [eventsNumber]);

  // DEBT
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (event.key === "*" && keyboardNavigationContext.current !== "dialog-recupera-biglietto") {
        event.preventDefault();
        if (isMultiplaActive && isSistemaAvailable) {
          if (activatePuntata >= 1) {
            setActivatePuntata(0);
          }
          updateClientOldSviluppoSistema();
          keyboardNavigationContext.current = "smart-search";
        } else if (isSistemaActive && isMultiplaAvailable) {
          if (activatePuntata >= 1) {
            setActivatePuntata(0);
          }
          updateClientOldSviluppoSistema();
          keyboardNavigationContext.current = "smart-search";
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  const closeAndReset = () => {
    if (!isOptionActive) {
      setTriggerChange(true);
    } else {
      setTriggerChange(false);
    }
    setOptionActive(!isOptionActive);
    setIsChange(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOptionActive]);

  const isMustBeAcid = () => {
    if (eventsNumber > 0) {
      setAcidColor(true);
    }
  };

  return (
    <>
      <StyledCarrelloHeadboard>
        {clients.map((client: CartClientType, index: number) => (
          <Cliente
            key={index}
            clientId={index}
            eventsNumber={client.selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0)}
            isClientActive={index === activeClient}
            setActiveClient={setActiveClient}
            setSviluppoSistemaOpen={setSviluppoSistemaOpen}
          />
        ))}
      </StyledCarrelloHeadboard>
      <StyledCarrelloHeader>
        <StyledCarrelloTicketTypeContainer>
          <StyledCarrelloBodyTicketType
            data-qa={`carrello-${eventsNumber < 2 ? "singola" : "multipla"}`}
            isActive={isMultiplaActive}
            isAvailable={isMultiplaAvailable}
            hasBorder={isMultiplaActive}
            onClick={() => {
              if (isMultiplaAvailable) {
                updateClientOldSviluppoSistema();
              }
            }}
          >
            {eventsNumber < 2 ? "Singola" : "Multipla"}
          </StyledCarrelloBodyTicketType>
          <StyledCarrelloBodyTicketType
            data-qa="carrello-sistema"
            isActive={isSistemaActive}
            isAvailable={isSistemaAvailable}
            hasBorder={isSistemaActive}
            onClick={() => {
              if (eventsNumber > 1) {
                updateClientOldSviluppoSistema();
              }
            }}
          >
            Sistema
          </StyledCarrelloBodyTicketType>
        </StyledCarrelloTicketTypeContainer>
        <StyledSettingsContainer>
          <StyledSettingsButton isActive={clients[activeClient].selectedEvents.length > 0}>
            {!isAcid && (
              <IcoTrash
                onMouseEnter={() => isMustBeAcid()}
                onClick={() => {
                  updateClientEvents([]);
                }}
              />
            )}
            {isAcid && (
              <IconTrashColore
                data-qa="carrello-svuota"
                onMouseLeave={() => setAcidColor(false)}
                onClick={() => {
                  updateClientEvents([]);
                }}
              />
            )}
          </StyledSettingsButton>
          <StyledCarrelloButton
            isOptionActive={isOptionActive}
            data-qa="carrello-opzioni"
            onClick={() => closeAndReset()}
          >
            OPZIONI
          </StyledCarrelloButton>
        </StyledSettingsContainer>
      </StyledCarrelloHeader>
    </>
  );
};
