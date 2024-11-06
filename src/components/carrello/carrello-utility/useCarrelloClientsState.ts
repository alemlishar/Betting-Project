import { useCallback, useMemo } from "react";
import { CartClientType, EventoType, ImpostazioniScommessaType, SviluppoSistemaType } from "src/types/carrello.types";

import { useCartClientsContext, useUpdateClientsContext } from "src/components/common/context-clients/ClientsContext";

export type CarrelloClientsState = ReturnType<typeof useCarrelloClientsState>;

/**
 *  CORE STATE
 *
 *  Clients is an array of two CartClients
 *  Each CartClient always has an Eventi array and can have a Legature array related to Sviluppo Sistema
 *  Each Evento has some fetched data, some layout state and an Esiti array that just have fetched data.
 *
 *  Date labeled as "current" are referred to the current client.
 *  ActiveClient and setActiveClient manage the clients switching.
 *
 *  UpdateClientEvents and UpdateClientSviluppoSistema update the data for client currently active
 *  Please, don't do this => clients[1].events = newEvents
 *  The updaters trigger calculations, side effects and api calls
 */

export const useCarrelloClientsState = (
  updateClients: ReturnType<typeof useUpdateClientsContext>,
  clients: ReturnType<typeof useCartClientsContext>,
) => {
  const currentClient = updateClients.activeClient;
  const activeClient = updateClients.activeClientIndex;
  const setActiveClient = (index: number) => {
    updateClients.setActiveClientIndex(index);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectedEvents = useMemo(() => currentClient.selectedEvents, [currentClient, clients]); // la dipendenza `clients` è necessaria per far aggiornare la lista di avvenimenti quando viene modificato clients
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentSviluppoSistema = useMemo(() => currentClient.sviluppoSistema, [currentClient, clients]); // la dipendenza `clients` è necessaria per far aggiornare la lista di avvenimenti quando viene modificato clients
  const isSistemaActive = useMemo(() => {
    return currentSviluppoSistema !== undefined;
  }, [currentSviluppoSistema]);

  const updateCurrentClientData = useCallback(
    (newClientData: CartClientType) => {
      const updatedCartClients = [...clients];
      updatedCartClients[activeClient] = newClientData;
      updateClients.setCartClients(updatedCartClients);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeClient, clients],
  );
  const updateClientEvents = useCallback(
    (selectedEvents: Array<EventoType>) => {
      const newData = {
        ...currentClient,
        selectedEvents,
      };
      updateCurrentClientData(newData);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateCurrentClientData, currentClient, isSistemaActive],
  );

  const updateClientSviluppoSistema = useCallback(
    (sviluppoSistema: Array<SviluppoSistemaType> | undefined) => {
      if (currentClient.sviluppoSistema === sviluppoSistema) {
        return;
      }
      const newData = {
        ...currentClient,
        sviluppoSistema,
      };
      updateCurrentClientData(newData);
    },
    [updateCurrentClientData, currentClient],
  );

  //Salva SENZA impostazioni predefinite
  const updateClientImpostazioni = useCallback(
    (impostazioniScommessa: Array<ImpostazioniScommessaType>) => {
      const newData = {
        ...currentClient,
        impostazioniScommessa,
      };
      updateCurrentClientData(newData);
      const updatedCartClients = [...clients];
      updatedCartClients[activeClient] = newData;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateCurrentClientData, currentClient, clients],
  );

  //Salva CON impostazioni predefinite
  const updateAllClientsImpostazioni = useCallback(
    (impostazioniScommessa: Array<ImpostazioniScommessaType>) => {
      let array: Array<any> = [];
      clients.forEach((client: any) => {
        const newData = {
          ...client,
          impostazioniScommessa,
        };
        array.push(newData);
        updateClients.setCartClients(array);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateCurrentClientData, currentClient],
  );

  return {
    setActiveClient,
    currentClient,
    activeClient,
    currentSviluppoSistema,
    selectedEvents,
    updateClientSviluppoSistema,
    updateClientEvents,
    updateClientImpostazioni,
    isSistemaActive,
    updateAllClientsImpostazioni,
  };
};
