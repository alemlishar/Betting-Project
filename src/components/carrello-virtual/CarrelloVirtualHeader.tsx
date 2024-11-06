import { CartVirtualClientType } from "src/types/carrello.types";
import { Cliente } from "src/components/carrello/header/Cliente";
import { ReactComponent as IcoTrash } from "src/assets/images/icon-trash.svg";
import { ReactComponent as IconTrashColore } from "src/assets/images/icon-trash-colore.svg";
import { useState, useMemo, useCallback } from "react";
import {
  StyledCarrelloBodyTicketType,
  StyledCarrelloHeadboard,
  StyledCarrelloHeader,
  StyledCarrelloTicketTypeContainer,
  StyledSettingsButton,
  StyledSettingsContainer,
  StyledCarrelloButton,
} from "src/components/carrello-common/Header.style";

import { useVirtualUpdateClientsContext } from "src/components/common/context-clients/VirtualClientsContext";

import { mutate } from "swr";
import { getGiocatasistemisticaPayload } from "src/components/carrello-virtual/VirtualCart.helpers";

export const CarrelloVirtualHeader = ({ onCloseSviluppo }: { onCloseSviluppo: (IsSviluppoOpen: boolean) => void }) => {
  const virtualCartClientsContext = useVirtualUpdateClientsContext();
  const virtualCurrentCartClients = virtualCartClientsContext.activeVirtualClient;

  const isSistemaActive = virtualCurrentCartClients.isSviluppoSistemaActive === true;

  const eventsNumber = virtualCurrentCartClients.selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0);
  const selectedEvents = virtualCurrentCartClients.selectedEvents;

  const disciplina = virtualCurrentCartClients.selectedEvents.map((event) => {
    return `${event.provider}_${event.codiceDisciplina}`;
  });

  const disciplinaList = useMemo(() => {
    return Array.from(new Set(disciplina));
  }, [disciplina]);

  const [isAcid, setAcidColor] = useState(false);
  const isMultiplaActive = !isSistemaActive;

  const isMultiplaAvailable = useMemo(() => {
    return eventsNumber === selectedEvents.length && selectedEvents.length !== 0;
  }, [eventsNumber, selectedEvents]);

  const isSistemaAvailable = useMemo(() => {
    return disciplinaList.length === 1 && eventsNumber > 1;
  }, [disciplinaList, eventsNumber]);

  const isMustBeAcid = () => {
    if (eventsNumber > 0) {
      setAcidColor(true);
    }
  };

  const switchMultipla = useCallback(() => {
    if (eventsNumber > 1 && isSistemaAvailable) {
      mutate(
        "giocataSistemisticaSviluppataVirtual",
        getGiocatasistemisticaPayload(selectedEvents, virtualCartClientsContext.activeVirtualClient.puntataSistema),
      );
      virtualCartClientsContext.updateVirtualClientSviluppoSistema(true);
    }
  }, [eventsNumber, isSistemaAvailable, selectedEvents, virtualCartClientsContext]);
  const switchSistema = useCallback(() => {
    if (isMultiplaAvailable) {
      onCloseSviluppo(false);
      virtualCartClientsContext.updateFooterMultipla(selectedEvents);
      virtualCartClientsContext.updateVirtualClientSviluppoSistema(false);
    }
  }, [isMultiplaAvailable, onCloseSviluppo, selectedEvents, virtualCartClientsContext]);
  return (
    <>
      <StyledCarrelloHeadboard>
        {virtualCartClientsContext.virtualCartClients.map((client: CartVirtualClientType, index: number) => {
          return (
            <Cliente
              key={index}
              clientId={index}
              eventsNumber={client.selectedEvents.reduce((prev, ev) => prev + ev.esiti.length, 0)}
              isClientActive={index === virtualCartClientsContext.activeClientIndex}
              setActiveClient={virtualCartClientsContext.setActiveClientIndex}
              setSviluppoSistemaOpen={onCloseSviluppo}
            />
          );
        })}
      </StyledCarrelloHeadboard>
      <StyledCarrelloHeader>
        <StyledCarrelloTicketTypeContainer>
          <StyledCarrelloBodyTicketType
            data-qa={`carrello-${eventsNumber < 2 ? "singola" : "multipla"}`}
            isActive={isMultiplaActive}
            isAvailable={isMultiplaAvailable}
            hasBorder={isMultiplaActive}
            onClick={() => switchSistema()}
          >
            {eventsNumber < 2 ? "Singola" : "Multipla"}
          </StyledCarrelloBodyTicketType>
          <StyledCarrelloBodyTicketType
            data-qa="carrello-sistema"
            isActive={isSistemaActive}
            isAvailable={isSistemaAvailable}
            hasBorder={isSistemaActive}
            onClick={() => switchMultipla()}
          >
            Sistema
          </StyledCarrelloBodyTicketType>
        </StyledCarrelloTicketTypeContainer>
        <StyledSettingsContainer>
          <StyledSettingsButton isActive={virtualCurrentCartClients.selectedEvents.length > 0}>
            {!isAcid && (
              <IcoTrash
                onMouseEnter={() => isMustBeAcid()}
                onClick={() => {
                  virtualCartClientsContext.updateVirtualClientEvents([]);
                }}
              />
            )}
            {isAcid && (
              <IconTrashColore
                data-qa="carrello-svuota"
                onMouseLeave={() => setAcidColor(false)}
                onClick={() => {
                  virtualCartClientsContext.updateVirtualClientEvents([]);
                }}
              />
            )}
          </StyledSettingsButton>
          <StyledCarrelloButton isOptionActive={false} data-qa="carrello-opzioni" onClick={() => {}}>
            OPZIONI
          </StyledCarrelloButton>
        </StyledSettingsContainer>
      </StyledCarrelloHeader>
    </>
  );
};
