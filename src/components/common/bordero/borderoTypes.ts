export type MovementObject = {
  reason:
    | "COMMON_EMIT"
    | "COMMON_CANCEL"
    | "COMMON_PAYMENT"
    | "GLOBAL_REFUND"
    | "COMMON_REFUND"
    | "GLOBAL_DEPOSIT"
    | "COMMON_PAYMENT_REFUND"
    | "ONLINE_ACCOUNT_CLOSE"
    | "VOUCHER_EMIT"
    | "VOUCHER_USAGE"
    | "VOUCHER_PAYMENT"
    | "PROMOTIONS_PROMOTION"
    | "GAME_ACCOUNT_OPEN"
    | "GAME_ACCOUNT_CHARGING"
    | "GAME_ACCOUNT_WITHDRAWAL";
  number: number;
  amount: number;
};
export type GeneralInfo = {
  operationDate: String;
  agency: String;
  tg: String;
  operatore: String;
};

export type ScopeObject = {
  type:
    | "SPORT_QF"
    | "IPPICA_TOTALIZZATORE"
    | "IPPICA_QF"
    | "IPPICA_RIFERIMENTO"
    | "IPPICA_NAZIONALE"
    | "TOTAL"
    | "ACCOUNT"
    | "VIRTUAL"
    | "VOUCHER_PROMOTIONS"
    | "GLOBAL_DEPOSIT"
    | "GAME_ACCOUNTS";
  movements: Array<MovementObject>;
};
export type BorderoResponse = {
  generalInfo: GeneralInfo;
  amount: number;
  scopes: Array<ScopeObject>;
};
