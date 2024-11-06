import { createContext, useContext, useState, useEffect } from "react";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { CartClientType, UpdateCartClients } from "src/types/carrello.types";

export const ClientsContext = createContext<Array<CartClientType>>([]);
export const UpdateClientsContext = createContext<UpdateCartClients>(null as any);
export function useCartClientsContext() {
  return useContext(ClientsContext);
}

export function useUpdateClientsContext() {
  return useContext(UpdateClientsContext);
}

export function useClients({
  activeClientIndex,
  setActiveClientIndex,
}: {
  activeClientIndex: number;
  setActiveClientIndex(activeClientIndex: number): void;
}) {
  const { impostazioni, multipleBetConfig } = useContext(GlobalStateContext);
  const [clients, setCartClients] = useState<Array<CartClientType>>([
    {
      selectedEvents: [],
      impostazioniScommessa: [
        {
          bet: impostazioni !== undefined ? impostazioni[0].bet : 1,
          share: impostazioni !== undefined ? impostazioni[0].share : 1,
        },
      ],
      isCurrentClient: true,
      puntata: multipleBetConfig ? multipleBetConfig.importoMinimo : 2,
    },
    {
      selectedEvents: [],
      impostazioniScommessa: [
        {
          bet: impostazioni !== undefined ? impostazioni[0].bet : 1,
          share: impostazioni !== undefined ? impostazioni[0].share : 1,
        },
      ],
      isCurrentClient: false,
      puntata: multipleBetConfig ? multipleBetConfig.importoMinimo : 2,
    },
  ]);
  useEffect(() => {
    setCartClients([
      {
        selectedEvents: [],
        impostazioniScommessa: [
          {
            bet: impostazioni !== undefined ? impostazioni[0].bet : 1,
            share: impostazioni !== undefined ? impostazioni[0].share : 1,
          },
        ],
        isCurrentClient: true,
        puntata: multipleBetConfig ? multipleBetConfig.importoMinimo : 2,
      },
      {
        selectedEvents: [],
        impostazioniScommessa: [
          {
            bet: impostazioni !== undefined ? impostazioni[0].bet : 1,
            share: impostazioni !== undefined ? impostazioni[0].share : 1,
          },
        ],
        isCurrentClient: false,
        puntata: multipleBetConfig ? multipleBetConfig.importoMinimo : 2,
      },
    ]);
  }, [impostazioni, multipleBetConfig]);
  const activeClient = clients[activeClientIndex];
  return {
    clients,
    setCartClients,
    activeClientIndex,
    setActiveClientIndex,
    activeClient,
  };
}
