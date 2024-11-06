import React, { useContext, useEffect } from "react";
import {
  ChiaveAccoppiataTrioBigliettoVirtualComponents,
  ChiaveEsito,
  ChiaveEsitoBigliettoComponents,
  ChiaveEsitoBigliettoVirtualComponents,
} from "src/types/chiavi";

export const AddEsitotoToBigliettoContext = React.createContext<{
  esitoSport: (params: ChiaveEsitoBigliettoComponents) => void;
  esitoVirtual: (params: ChiaveEsitoBigliettoVirtualComponents) => void;
  accoppiataTrioVirtual: (params: ChiaveAccoppiataTrioBigliettoVirtualComponents) => void;
}>(
  null as any, // must break if context value not provided
);
export function useAddEsitoToBiglietto() {
  return useContext(AddEsitotoToBigliettoContext);
}

export const EsitiInBigliettoContext = React.createContext<Set<ChiaveEsito>>(
  null as any,
  // must break if context value not provided
);
export function useEsitiInBiglietto() {
  return useContext(EsitiInBigliettoContext);
}

// DEBT 2: fare decoupling dal set di chiavi esito e migliorare performance (vedi bigliettoListeners)
// va usato dentro il componente esito
export function useIsEsitoInBiglietto(chiaveEsito: ChiaveEsito) {
  const [isEsitoInBiglietto, setIsEsitoInBiglietto] = React.useState(false);
  useEffect(() => {
    setIsEsitoInBiglietto(esitiInBigliettoGlobal.has(chiaveEsito)); // update default state
    const update = (esitiInBiglietto: Set<ChiaveEsito>) => {
      setIsEsitoInBiglietto(esitiInBiglietto.has(chiaveEsito));
    };
    bigliettoListeners.add(update);
    return () => {
      bigliettoListeners.delete(update);
    };
  }, [chiaveEsito]);
  return isEsitoInBiglietto;
}

const bigliettoListeners = new Set<(esitiInBiglietto: Set<ChiaveEsito>) => void>();
let esitiInBigliettoGlobal = new Set<ChiaveEsito>();
// viene richiamato in root container component
export function notifyBigliettoListeners(esitiInBiglietto: Set<ChiaveEsito>) {
  esitiInBigliettoGlobal = esitiInBiglietto;
  for (const callback of bigliettoListeners.values()) {
    callback(esitiInBiglietto);
  }
}

export const EsitiVirtualInBigliettoContext = React.createContext<Set<string>>(null as any); // must break if context value not provided
