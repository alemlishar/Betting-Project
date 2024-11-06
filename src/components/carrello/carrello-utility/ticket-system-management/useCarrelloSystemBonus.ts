import { useCallback, useContext, useEffect, useMemo } from "react";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";

import { EventoType } from "src/types/carrello.types";

export const useCarrelloSystemBonus = ({
  selectedEvents,
  isSistemaActive,
  calculateBonusEsitiSistema,
}: {
  selectedEvents: EventoType[];
  isSistemaActive: boolean;
  calculateBonusEsitiSistema: (e: any) => void;
}) => {
  const { bonusConfig } = useContext(GlobalStateContext);

  const configBonusSystem = useMemo(() => {
    return isSistemaActive && bonusConfig
      ? bonusConfig.filter((config) => {
          return (
            selectedEvents.length > 0 &&
            config.systemClass &&
            config.systemClass <= selectedEvents.length &&
            config.systemClass !== 0
          );
        })
      : [];
  }, [bonusConfig, isSistemaActive, selectedEvents.length]);

  const isBonusNotExpired = useCallback(() => {
    if (bonusConfig) {
      const expirationDate = bonusConfig[0].bonusExpirationDateDiff;

      return selectedEvents.every((pronostico) => {
        const dataPronostico = new Date(pronostico.dataAvvenimento);
        const dataOggi = new Date();
        const diffMsDate = dataPronostico.valueOf() - dataOggi.valueOf();
        const oneDay = 86400000;
        return Math.floor(diffMsDate / oneDay) <= expirationDate;
      });
    }
  }, [selectedEvents, bonusConfig]);
  //TODO create array for each system
  const getBonus = useCallback(() => {
    if (bonusConfig) {
      const quotaMinima = bonusConfig[0].minimumQuotaValue;

      selectedEvents.map((evento) =>
        evento.esiti.map((esito) => {
          if (esito.quota >= quotaMinima && isBonusNotExpired()) {
            return (esito.bonus = 1);
          } else {
            return (esito.bonus = 0);
          }
        }),
      );
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBonusNotExpired, selectedEvents]);

  useEffect(() => {
    const systemBonus = getBonus();
    calculateBonusEsitiSistema(systemBonus);
  }, [selectedEvents.length, calculateBonusEsitiSistema, getBonus]);
  return { configBonusSystem };
};
