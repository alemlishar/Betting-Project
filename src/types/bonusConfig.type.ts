export type BonusConfigType = {
  bonus: Array<BonusConfigClassType>;
};

export type BonusConfigClassType = {
  systemClass?: number;
  bonusMultiplier: number;
  minimumOutcomes: number;
  minimumQuotaValue: number;
  bonusExpirationDateDiff: number;
};
