import { EventoType, EsitoType } from "src/types/carrello.types";
import { PronosticiParamsType } from "src/types/pronosticiParams.types";

export const useCarrelloCheckInserimento = ({
  selectedEvents,
  setErrorText,
  isIntegrale,
}: {
  selectedEvents: EventoType[];
  setErrorText: (errorText: string) => void;
  isIntegrale: boolean;
}) => {
  const checkNewInsertion = (
    isNewEvento: boolean,
    newEsito: PronosticiParamsType,
    changingEsito: EsitoType | undefined,
  ): boolean => {
    const isANewEsito = changingEsito === undefined;
    const numeroEsiti = selectedEvents.reduce((a, b) => a + b.esiti.length, 0);

    /**
     * Minimo valore tra i legami massimi
     */
    const minLegameMassimo = Math.min(...selectedEvents.map((e) => e.esiti.map((e) => e.legameMassimo)).flat(1));

    /**
     * Array blackListMax ripulite dagli zeri
     */
    const blacklistedPredictions = selectedEvents
      .map((eventi) => eventi.esiti.map((esiti) => esiti.blackListMax))
      .flat(1);

    const blackListClean = blacklistedPredictions.filter((i) => {
      return i !== 0;
    });

    /**
     * Condizione legame Multipla:
     * legameMultiplaComplete= Array di legame Multipla
     * legameMultiplaDuplicate= Array ridotto dei valori doppi
     */
    const legameMultipla = [
      ...selectedEvents
        .map((event) =>
          event.esiti.map((esiti) => {
            return esiti.legameMultipla;
          }),
        )
        .flat(1),
      newEsito.legameMultipla,
    ];
    const legameMultiplaDuplicate = legameMultipla.filter((item, i) => {
      return legameMultipla.indexOf(item) === i;
    });

    /**
     * Inizio controlli
     */
    const isBlacklistMaxNotCompatible = (currentEsito: PronosticiParamsType) => {
      if (currentEsito.blackListMax === 0) {
        return false;
      }
      const minOfBlacklisted = Math.min(...blackListClean);
      return blackListClean.length && blackListClean.length === minOfBlacklisted;
    };

    const isBlacklistNotCompatible = (currentEsito: PronosticiParamsType) => {
      if (currentEsito.blackListMax === 0) {
        return false;
      }
      return currentEsito.blackListMax <= blackListClean.length;
    };

    if (!isNewEvento && !isANewEsito) {
      return false;
    }
    if (isBlacklistMaxNotCompatible(newEsito) || isBlacklistNotCompatible(newEsito)) {
      return selectedErrorText("errore-legameMassimo-legameMultipla-blackList", newEsito);
    } else if (isIntegrale && ((selectedEvents.length + 1 > 30 && isNewEvento) || numeroEsiti >= 40)) {
      return selectedErrorText("errore-max-esiti-integrale");
    } else if (selectedEvents.length + 1 > 30 && isNewEvento) {
      return selectedErrorText("errore-max-esiti-multipla");
    } else if (minLegameMassimo === numeroEsiti && isNewEvento) {
      return selectedErrorText("errore-legameMassimo-uguale-eventi");
    } else if (newEsito.legameMassimo <= numeroEsiti && isNewEvento) {
      if (newEsito.legameMassimo === 1) {
        return selectedErrorText("errore-legameMassimo-singola", newEsito);
      }
      return selectedErrorText("errore-legameMassimo-legameMultipla-blackList", newEsito);
    } else if (legameMultiplaDuplicate.length > 1) {
      return selectedErrorText("errore-legameMassimo-legameMultipla-blackList", newEsito);
    }
    return false;
  };

  /**
   * Funzione che mi definisce i testi da mostrare in FullScreenAlert
   */
  const selectedErrorText = (codeError: string, esito?: PronosticiParamsType) => {
    switch (codeError) {
      case "errore-max-esiti-integrale":
        setErrorText(
          "Hai raggiunto il numero massimo di esiti/avvenimenti inseribili all'interno di un sistema integrale",
        );
        break;
      case "errore-max-esiti-multipla":
        setErrorText("Non è possibile inserire nel biglietto più di 30 esiti");
        break;
      case "errore-legameMassimo-uguale-eventi":
        setErrorText("Non è possibile inserire altri avvenimenti in questo biglietto");
        break;
      case "errore-legameMassimo-singola":
        setErrorText(
          `La scommessa ${esito?.descrizioneScommessa} per l'avvenimento ${esito?.descrizioneAvvenimento} è giocabile solo in singola`,
        );
        break;
      case "errore-legameMassimo-legameMultipla-blackList":
        setErrorText(
          `La scommessa ${esito?.descrizioneScommessa} per l'avvenimento ${esito?.descrizioneAvvenimento} non è compatibile con gli esiti già inseriti in questo biglietto`,
        );
        break;
    }
    return true;
  };

  return {
    checkNewInsertion,
  };
};
