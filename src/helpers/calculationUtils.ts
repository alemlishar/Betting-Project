import configuration from "src/helpers/configuration";
import { ConfigToEvaluateFormat, decimalToInteger } from "src/helpers/formatUtils";
import { BonusConfigClassType } from "src/types/bonusConfig.type";
import { EventoType } from "src/types/carrello.types";

export type ConfigToEvaluateBonus = {
  quota: number;
  date?: string;
};

//Produttoria delle quote
//TODO siccome potrebbero essere di vari type i param bisogna calcolare prima l'array delle sole quote
//prestazioni ridotte
export function producerOfTotalQuote(
  quote: Array<number>,
  unformattedBonusPerc: ConfigToEvaluateFormat,
): ConfigToEvaluateFormat {
  return {
    value: quote.reduce((tot, quota) => quota * tot, 1) * unformattedBonusPerc.value,
    factor: quote.length + unformattedBonusPerc.factor,
  };
}

//Calcolare bonus in percentuale
export function calculatorPercentualBonus(
  percentualeBonus: number,
  numeroMinimoEsiti: number,
  numeroEsiti: number,
): number {
  return Math.pow(
    percentualeBonus / configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER,
    numeroEsiti - numeroMinimoEsiti + 1,
  );
}

export function calculatorUnformattedPercentualBonus(
  percentualeBonus: number,
  numeroMinimoEsiti: number,
  numeroEsiti: number,
): ConfigToEvaluateFormat {
  return {
    value: Math.pow(percentualeBonus, numeroEsiti - numeroMinimoEsiti + 1),
    factor: numeroEsiti - numeroMinimoEsiti + 1,
  };
}

//Calcolare bonus in euro sul totale
export function calculatorEuroBonus(
  totalPercentualBonus: ConfigToEvaluateFormat,
  bet: number,
  totalQuote: ConfigToEvaluateFormat,
): string {
  const totalQuoteValue = totalQuote.value;
  const totalPercentualBonusValue = totalPercentualBonus.value;
  //TODO valutato come se mi arrivasse tutto in centesimi, il +1 è il contributo di bet, da capire se arriva centesimi o interi
  const totalFactorDivider = totalQuote.factor + 1;
  const bonusValue =
    ((totalPercentualBonusValue -
      configuration.DEFAULT_CONVERSION_VALUE_DECIMAL_INTEGER ** totalPercentualBonus.factor) *
      bet *
      totalQuoteValue) /
    totalPercentualBonusValue;
  return decimalToInteger({ value: bonusValue, factor: totalFactorDivider });
}

export function evaluateBonusNotExpired(
  bonusConfigMultipla: BonusConfigClassType,
  pronostici: ConfigToEvaluateBonus[],
): boolean {
  const expirationDate = bonusConfigMultipla.bonusExpirationDateDiff;
  return pronostici.every((pronostico) => {
    if (pronostico.date !== undefined) {
      const dataPronostico = new Date(pronostico.date);
      const now = new Date();
      const diffMsDate = dataPronostico.valueOf() - now.valueOf();
      const oneDay = 86400000;
      return Math.floor(diffMsDate / oneDay) <= expirationDate;
    }
    return null;
  });
}

//Funzione che valuta la presenza del bonus verificando tutti i parametri richiesti (eisi minimi, quote minime, scadenza)
export function isBonusMultipla(
  bonusConfigMultipla: BonusConfigClassType,
  pronostici: ConfigToEvaluateBonus[],
): boolean {
  const minimumOutcomes = bonusConfigMultipla.minimumOutcomes;
  const minimumQuotaValue = bonusConfigMultipla.minimumQuotaValue;
  const pronosticiPartecipantiBonus = pronostici.filter((esiti) => esiti.quota > minimumQuotaValue);
  //TODO- se la data === undefined siamo nel caso virtual e non serve valutare scadenza
  const isBonusNotExpired =
    pronostici[0].date !== undefined ? evaluateBonusNotExpired(bonusConfigMultipla, pronostici) : true;
  return pronosticiPartecipantiBonus.length >= minimumOutcomes && isBonusNotExpired;
}

//Funzione che valuta il flagbonus per la vendita del sistema da carrello
export function getFlagBonusEsito(
  bonusConfig: BonusConfigClassType[] | undefined,
  quotaEsito: number,
  indexEvent: number,
  pronostici: ConfigToEvaluateBonus[],
): boolean {
  const bonusSportConfiguration =
    bonusConfig && bonusConfig[indexEvent] ? bonusConfig[indexEvent] : bonusConfig ? bonusConfig[0] : null;
  if (bonusSportConfiguration !== null) {
    const quotaMinima = bonusSportConfiguration ? bonusSportConfiguration.minimumQuotaValue : null;
    const bonusEsiti = pronostici.filter((pronostico) => {
      return bonusSportConfiguration ? pronostico.quota >= bonusSportConfiguration.minimumQuotaValue : false;
    }).length;
    const evaluateFlagBonus = bonusSportConfiguration ? bonusEsiti >= bonusSportConfiguration.minimumOutcomes : false;
    return quotaMinima !== null && quotaEsito >= quotaMinima && evaluateFlagBonus;
  } else {
    return false;
  }
}

export const getBonusConfSystem = (selectedEvents: EventoType[], bonusConfig?: BonusConfigClassType[]) => {
  return bonusConfig
    ? bonusConfig.filter((config) => {
        return (
          selectedEvents.length > 0 &&
          config.systemClass &&
          config.systemClass <= selectedEvents.length &&
          config.systemClass !== 0
        );
      })
    : [];
};
export const calculateMaxWinning = (totalQuote: ConfigToEvaluateFormat, bet: number): ConfigToEvaluateFormat => {
  const winValue = totalQuote.value * bet;
  const factor = totalQuote.factor + 1;
  return { value: winValue, factor: factor };
};
