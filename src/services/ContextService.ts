import { BonusConfigClassType } from "src/types/bonusConfig.type";
import { ImpostazioniScommessaType } from "src/types/carrello.types";
import { ConfigBetType, ConfigMap } from "../types/config.types";

export type StateType = {
  balanceAmount: number;
  config?: ConfigMap;
  configVirtual?: ConfigMap;
  maxThresholdValue?: number;
  maxVirtualThresholdValue?: number;
  impostazioni?: ImpostazioniScommessaType[];
  bonusConfig?: BonusConfigClassType[];
  bonusVirtualConfig?: BonusConfigClassType[];
  systemBetConfig?: ConfigBetType;
  multipleBetConfig?: ConfigBetType;
  systemVirtualBetConfig?: ConfigBetType;
  multipleVirtualBetConfig?: ConfigBetType;
};
export type UpdateGlobalStateType = {
  setGlobalState: (state: StateType) => void;
};

export const initialState: StateType = {
  balanceAmount: 0,
};
