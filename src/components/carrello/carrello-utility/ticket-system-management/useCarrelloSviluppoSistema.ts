import { useCallback, useEffect, useMemo, useContext, useRef, useState } from "react";
import { EsitoType, EventoType, SviluppoSistemaType } from "../../../../types/carrello.types";
import { canBeMultiple, getNewSviluppoSistema } from "src/components/carrello/helpers";
import { SviluppoSistema } from "src/types/sistemi.types";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";

export const useCarrelloSviluppoSistema = ({
  currentSviluppoSistema,
  selectedEvents,
  updateClientEvents,
  updateClientSviluppoSistema,
  isSistemaActive,
  activeClient,
}: {
  currentSviluppoSistema?: Array<SviluppoSistemaType>;
  selectedEvents: EventoType[];
  updateClientEvents: (e: EventoType[]) => void;
  updateClientSviluppoSistema: (s: Array<SviluppoSistemaType> | undefined) => void;
  isSistemaActive: boolean;
  activeClient: number;
}) => {
  const { systemBetConfig } = useContext(GlobalStateContext);
  const [legatureToShow, setLegatureToShow] = useState<Array<SviluppoSistemaType>>([]);
  const [sviluppoSistemaOpen, setSviluppoSistemaOpen] = useState(false);
  const switchSviluppoSistema = () => setSviluppoSistemaOpen(!sviluppoSistemaOpen);

  // Close "sviluppo sistema" window when active client or ticketType change
  useEffect(() => {
    if (sviluppoSistemaOpen && !isSistemaActive) {
      setSviluppoSistemaOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient, isSistemaActive]);

  const calculateBonusEsitiSistema = useCallback((systemBonus: any) => {
    return systemBonus;
  }, []);

  const [totalBetSviluppo, setTotalBetSviluppo] = useState(0);

  const isBetNull = useMemo(() => {
    return totalBetSviluppo === 0;
  }, [totalBetSviluppo]);

  const isCombinazioniMinimeErr = useMemo(() => {
    if (currentSviluppoSistema && legatureToShow.length > 1) {
      const singoleCombinationi = currentSviluppoSistema.filter((leg) => {
        return leg.combinazioni === 1;
      });
      const allBet = currentSviluppoSistema.map((legatura) => {
        return legatura.bet;
      });
      const fillingBet =
        allBet.filter((val) => {
          return val !== 0;
        }).length === 1;

      if (singoleCombinationi) {
        const singola = singoleCombinationi.filter((singola) => {
          return singola.bet >= 2;
        });
        return fillingBet && singola.length === 1;
      }

      return false;
    } else {
      return false;
    }
  }, [currentSviluppoSistema, legatureToShow]);
  const sistemaBetisLessThan2 = useMemo(() => {
    if (systemBetConfig) {
      return totalBetSviluppo < systemBetConfig.importoMinimo - 0.01 && totalBetSviluppo > 0;
    }
    return totalBetSviluppo < 1.99 && totalBetSviluppo > 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalBetSviluppo]);

  const updateIsFixed = (isFixed: boolean, id: string) => {
    const newSelectedEvents: EventoType[] = [];
    selectedEvents.forEach((evento: EventoType) => {
      if (evento.id === id) {
        evento.isFixed = isFixed;
        evento.esiti.forEach((esito: EsitoType) => {
          esito.fissa = isFixed;
        });
      }
      newSelectedEvents.push(evento);
    });
    updateClientEvents(newSelectedEvents);
  };

  const updateSviluppoWinAmounts = useCallback(
    (winAmounts: Array<SviluppoSistema>) => {
      const winAmountsValues = Object.values(winAmounts).reverse();

      if (currentSviluppoSistema !== undefined && winAmountsValues.length === currentSviluppoSistema.length) {
        let hasChanged = false;
        const updatedSviluppoSistema = currentSviluppoSistema.map((legatura, i) => {
          if (
            winAmountsValues[i].vincitaMinima / 100 !== legatura.winAmounts.min ||
            winAmountsValues[i].vincitaMassima / 100 !== legatura.winAmounts.max
          ) {
            hasChanged = true;
          }
          return {
            ...legatura,
            winAmounts: {
              max: winAmountsValues[i].vincitaMassima / 100,
              min: winAmountsValues[i].vincitaMinima / 100,
            },
          };
        });
        if (hasChanged) {
          updateClientSviluppoSistema(updatedSviluppoSistema);
        }
      }
    },
    [updateClientSviluppoSistema, currentSviluppoSistema],
  );

  //Sviluppo sistema ref parametrico per cliente 1 e cliente 2
  type SviluppoSistemaTypeClientsRef = {
    [key: number]: SviluppoSistemaType[] | undefined;
  };
  const sviluppoSistemaClientsRef = useRef<SviluppoSistemaTypeClientsRef>({
    0: undefined,
    1: undefined,
  });

  const updateClientOldSviluppoSistema = useCallback(() => {
    if (currentSviluppoSistema === undefined) {
      return updateClientSviluppoSistema(
        getNewSviluppoSistema(selectedEvents, sviluppoSistemaClientsRef.current[activeClient]),
      );
    } else {
      return updateClientSviluppoSistema(undefined);
    }
  }, [activeClient, currentSviluppoSistema, selectedEvents, updateClientSviluppoSistema]);

  //Set sviluppo sistema change prediction(esito) list
  useEffect(() => {
    const isMultiEsiti = selectedEvents.some((selectedEvent) => selectedEvent.esiti.length > 1);
    const newSviluppoSistema = getNewSviluppoSistema(
      selectedEvents,
      sviluppoSistemaClientsRef.current[activeClient],
      currentSviluppoSistema,
    );
    const isChangedSviluppoSistema = sviluppoSistemaClientsRef.current[activeClient] === newSviluppoSistema;
    const isMultiple = canBeMultiple(selectedEvents);
    const isSistemaAvailable = isMultiEsiti && !isMultiple;

    if (selectedEvents.length < 2 && !isMultiEsiti && isChangedSviluppoSistema) {
      return updateClientSviluppoSistema(undefined);
    }
    if (!((isSistemaActive && isMultiple) || isSistemaAvailable)) {
      if (selectedEvents.length < 2) {
        return (sviluppoSistemaClientsRef.current[activeClient] = undefined);
      }
      return;
    }
    if (isChangedSviluppoSistema) {
      return;
    }
    if (isSistemaActive) {
      sviluppoSistemaClientsRef.current[activeClient] = newSviluppoSistema;
    }
    updateClientSviluppoSistema(newSviluppoSistema ? newSviluppoSistema : undefined);
  }, [selectedEvents, isSistemaActive, updateClientSviluppoSistema, currentSviluppoSistema, activeClient]);

  return {
    updateIsFixed,
    updateSviluppoWinAmounts,
    isCombinazioniMinimeErr,
    sistemaBetisLessThan2,
    calculateBonusEsitiSistema,
    legatureToShow,
    totalBetSviluppo,
    setTotalBetSviluppo,
    setLegatureToShow,
    sviluppoSistemaOpen,
    setSviluppoSistemaOpen,
    switchSviluppoSistema,
    isBetNull,
    updateClientOldSviluppoSistema,
  };
};
