export type ConfigTypology = "CONI" | "UNIRE" | "TRIS" | "VIR";

export type ConfigType = {
  codice: number;
  tipologia: ConfigTypology;
  maxCostTicket: number;
  maxPagamenti: number;
  maxVincTicket: number;
  stato: number;
};

export type ConfigResponse = {
  importConfigurations: ConfigBetType[];
  userConfig: {
    maxThresholdValue: number;
    userConcession: ConfigType[];
  };
};
export type ConfigBetType = {
  concessione: string;
  importoBase: number;
  importoMinimo: number;
  tipologia: string;
};

export type ConfigMap = {
  [tipologia in ConfigTypology]: ConfigType;
};
