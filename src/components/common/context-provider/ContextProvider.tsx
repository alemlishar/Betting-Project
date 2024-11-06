import { createContext, useEffect, useState } from "react";
import {
  getBalance,
  getBonusSportConfiguration,
  getBonusVirtualConfiguration,
  getTerminalSportConfiguration,
  getTerminalVirtualConfiguration,
  getUserPreferences,
} from "src/components/common/context-provider/context-provider-api";
import { initialState, StateType, UpdateGlobalStateType } from "src/services/ContextService";
import { ImpostazioniScommessaType } from "src/types/carrello.types";
import { ConfigMap } from "src/types/config.types";
import useSWR from "swr";

/** saldo cassa context */
export const GlobalStateContext = createContext<StateType>(initialState);
export const UpdateGlobalStateContext = createContext<UpdateGlobalStateType>({
  setGlobalState: (state: StateType) => {},
});

export const useGlobalStateProvider = () => {
  const [globalState, setGlobalState] = useState(initialState);
  const { data: balanceAmount } = useSWR("balanceAmountService", getBalance);
  const { data: bonusSportConfiguration } = useSWR("initialBonusSportConfiguration", getBonusSportConfiguration);
  const { data: bonusVirtualConfiguration } = useSWR("initialBonusVirtualConfiguration", getBonusVirtualConfiguration);
  const { data: userDefaultPreferences } = useSWR("userDefaultPreferences", getUserPreferences);
  const { data: terminalSportConfiguration } = useSWR(
    "initialTerminalSportConfiguration",
    getTerminalSportConfiguration,
  );
  const { data: terminalVirtualConfiguration } = useSWR(
    "initialTerminalVirtualConfiguration",
    getTerminalVirtualConfiguration,
  );
  useEffect(() => {
    setGlobalState((globalState) => {
      if (balanceAmount && globalState.balanceAmount === balanceAmount.amount) {
        return globalState;
      }
      if (balanceAmount && (balanceAmount.amount !== undefined || balanceAmount.amount !== null)) {
        return { ...globalState, balanceAmount: balanceAmount.amount };
      }
      return globalState;
    });
  }, [balanceAmount]);

  /**
   * BONUS CONFIGURATION
   * not need to be updated during session
   */
  useEffect(() => {
    if (bonusSportConfiguration !== undefined) {
      return setGlobalState((globalState) => ({ ...globalState, bonusConfig: bonusSportConfiguration.bonus }));
    }
  }, [bonusSportConfiguration]);

  useEffect(() => {
    if (bonusVirtualConfiguration !== undefined) {
      return setGlobalState((globalState) => ({ ...globalState, bonusVirtualConfig: bonusVirtualConfiguration.bonus }));
    }
  }, [bonusVirtualConfiguration]);

  /**
   * USER DEFAULT PREFERENCES/SETTINGS
   * not need to be updated during session
   */
  useEffect(() => {
    if (userDefaultPreferences !== undefined) {
      let impostazioni: Array<ImpostazioniScommessaType> = [];
      impostazioni.push({
        share: userDefaultPreferences.share,
        bet: userDefaultPreferences.bet,
      });
      return setGlobalState((globalState) => ({ ...globalState, impostazioni: impostazioni }));
    }
  }, [userDefaultPreferences]);

  /**
   * TERMINAL CONFIGURATION
   * not need to be updated during session
   */
  useEffect(() => {
    if (terminalSportConfiguration !== undefined) {
      let coniConfig = terminalSportConfiguration.userConfig.userConcession.filter((item) => {
        return item.tipologia === "CONI";
      });
      let unireConfig = terminalSportConfiguration.userConfig.userConcession.filter((item) => {
        return item.tipologia === "UNIRE";
      });
      let trisConfig = terminalSportConfiguration.userConfig.userConcession.filter((item) => {
        return item.tipologia === "TRIS";
      });
      let virConfig = terminalSportConfiguration.userConfig.userConcession.filter((item) => {
        return item.tipologia === "VIR";
      });
      let responseConfig: ConfigMap = {
        CONI: coniConfig[0],
        UNIRE: unireConfig[0],
        TRIS: trisConfig[0],
        VIR: virConfig[0],
      };
      const systemBet = terminalSportConfiguration.importConfigurations.filter((config) => {
        return config.tipologia === "SPORT_SISTEMA";
      })[0];
      const multipleBet = terminalSportConfiguration.importConfigurations.filter((config) => {
        return config.tipologia === "QF";
      })[0];
      setGlobalState((globalState) => ({
        ...globalState,
        config: responseConfig,
        maxThresholdValue: terminalSportConfiguration.userConfig.maxThresholdValue,
        systemBetConfig: systemBet,
        multipleBetConfig: multipleBet,
      }));
    }
  }, [terminalSportConfiguration]);

  useEffect(() => {
    if (terminalVirtualConfiguration !== undefined) {
      let coniConfig = terminalVirtualConfiguration.userConfig.userConcession.filter((item) => {
        return item.tipologia === "CONI";
      });
      let unireConfig = terminalVirtualConfiguration.userConfig.userConcession.filter((item) => {
        return item.tipologia === "UNIRE";
      });
      let trisConfig = terminalVirtualConfiguration.userConfig.userConcession.filter((item) => {
        return item.tipologia === "TRIS";
      });
      let virConfig = terminalVirtualConfiguration.userConfig.userConcession.filter((item) => {
        return item.tipologia === "VIR";
      });
      let responseConfig: ConfigMap = {
        CONI: coniConfig[0],
        UNIRE: unireConfig[0],
        TRIS: trisConfig[0],
        VIR: virConfig[0],
      };
      const systemBet = terminalVirtualConfiguration.importConfigurations.filter((config) => {
        return config.tipologia === "VIRTUAL_RACE";
      })[0];
      const multipleBet = terminalVirtualConfiguration.importConfigurations.filter((config) => {
        return config.tipologia === "VIRTUAL";
      })[0];
      setGlobalState((globalState) => ({
        ...globalState,
        configVirtual: responseConfig,
        maxVirtualThresholdValue: terminalVirtualConfiguration.userConfig.maxThresholdValue,
        systemVirtualBetConfig: systemBet,
        multipleVirtualBetConfig: multipleBet,
      }));
    }
  }, [terminalVirtualConfiguration]);

  return { globalState };
};
