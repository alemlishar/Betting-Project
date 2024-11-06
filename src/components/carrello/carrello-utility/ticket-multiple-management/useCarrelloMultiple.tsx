import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useUpdateClientsContext } from "src/components/common/context-clients/ClientsContext";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { truncate } from "src/helpers/format-data";

import { EventoType } from "src/types/carrello.types";

export const useCarrelloMultiple = ({
  selectedEvents,
  setBetMultipla,
}: {
  selectedEvents: EventoType[];
  setBetMultipla(newPuntata: number, activeClientIndex: number): void;
}) => {
  const { multipleBetConfig } = useContext(GlobalStateContext);

  const { activeClient, activeClientIndex } = useUpdateClientsContext();

  // const [betMultipla, setBetMultipla] = useState<number>(activeClient.puntata);
  useEffect(() => {
    if (selectedEvents.length === 0 && activeClient.puntata !== multipleBetConfig?.importoMinimo) {
      setBetMultipla(multipleBetConfig ? multipleBetConfig.importoMinimo : 2, activeClientIndex); //Imposta valore di default quando viene svuotato il carrello
    }
  }, [selectedEvents]);
  const [bonusMultipla, setBonusMultipla] = useState<number>(0);
  const [sellingBonusFactor, setSellingBonusFactor] = useState<number>(0);
  const [bonusFactorMultipla, setBonusFactorMultipla] = useState<number>(1);
  const [numMinEsitiBonusMultipla, setNumMinEsitiBonusMultipla] = useState<number>(0);
  const [bonusMultiplaExpired, setBonusMultiplaExpired] = useState(false);
  const [bonusQuotaMinima, setBonusQuotaMinima] = useState(0);
  const [totQuote, setTotQuote] = useState<number>(0);

  const calculateBonusMultipla = useCallback(
    (bonusFactor: number, numMinimoEsiti: number, bonusExpired: boolean, sellingBonus: number, quotaMinima: number) => {
      setSellingBonusFactor(sellingBonus);
      setBonusMultipla(bonusFactor > 1 ? ((activeClient.puntata * totQuote) / bonusFactor) * (bonusFactor - 1) : 0);
      setBonusMultiplaExpired(bonusExpired);
      setBonusFactorMultipla(bonusFactor > 1 ? bonusFactor : 1); //TODO togliere activeClient.puntata
      setNumMinEsitiBonusMultipla(numMinimoEsiti);
      setBonusQuotaMinima(quotaMinima);
    },
    [activeClient.puntata, totQuote],
  );

  useEffect(() => {
    let totalQuote = 1;
    if (selectedEvents.length === 0) {
      totalQuote = 0;
    } else {
      selectedEvents.forEach((evento: any) => {
        evento.esiti.forEach((esito: any) => {
          totalQuote *= esito.quota / 100;
        });
      });
      totalQuote = bonusFactorMultipla !== 0 ? totalQuote * bonusFactorMultipla : totalQuote;
      setTotQuote(parseFloat(truncate(totalQuote, 6)));
    }
  }, [selectedEvents, bonusFactorMultipla]);

  const getPotentialWin = useCallback(
    (newPuntata: number) => {
      return parseFloat(truncate((newPuntata * (totQuote * 100)) / 100, 2));
    },
    [totQuote],
  );

  const potentialWinning = useMemo<number>(() => {
    return getPotentialWin(activeClient.puntata);
  }, [getPotentialWin, activeClient.puntata]);

  return {
    bonusMultipla,
    sellingBonusFactor,
    numMinEsitiBonusMultipla,
    bonusMultiplaExpired,
    bonusQuotaMinima,
    calculateBonusMultipla,
    potentialWinning,
    totQuote,
    getPotentialWin,
  };
};
