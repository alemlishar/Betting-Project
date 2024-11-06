import { parseAsMoney } from "../../../../../helpers/format-data";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { truncate } from "../../../../../helpers/format-data";
import { EventoType } from "../../../../../types/carrello.types";
import styled from "styled-components/macro";

import { calculatorPercentualBonus } from "src/helpers/calculationUtils";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";

export const BonusMultipla = ({
  bonusMultipla,
  calculateBonusMultipla,
  selectedEvents,
}: {
  bonusMultipla: number;
  calculateBonusMultipla: (b: number, n: number, e: boolean, s: number, q: number) => void;
  selectedEvents: EventoType[];
}) => {
  const [bonusFactor, setBonusFactor] = useState(1);
  const { bonusConfig } = useContext(GlobalStateContext);
  const bonusConfigMultipla = bonusConfig?.filter((bonus) => {
    return bonus.systemClass === 0;
  })[0];

  const isBonusNotExpired = useCallback(() => {
    if (bonusConfigMultipla) {
      const expirationDate = bonusConfigMultipla.bonusExpirationDateDiff;
      const expirationBonusPronostico = selectedEvents.map((pronostico) => {
        const dataPronostico = new Date(pronostico.dataAvvenimento);
        const dataOggi = new Date();
        const diffMsDate = dataPronostico.valueOf() - dataOggi.valueOf();
        const oneDay = 86400000;
        return Math.floor(diffMsDate / oneDay) > expirationDate; //Controllare eventuali regressioni
      });
      const notExpired = expirationBonusPronostico.filter(Boolean);
      return notExpired;
    }
  }, [bonusConfigMultipla, selectedEvents]);

  const getMoltiplicatoreBonus = useCallback(() => {
    if (bonusConfigMultipla) {
      const numeroMinimoEsiti = bonusConfigMultipla.minimumOutcomes;
      const quotaMinima = bonusConfigMultipla.minimumQuotaValue;
      const percentualeBonus = bonusConfigMultipla.bonusMultiplier;
      const pronosticiPartecipantiBonus = selectedEvents.filter((evento) => evento.esiti[0].quota > quotaMinima);
      const bonusNotExpired: any = isBonusNotExpired();
      const isBonusMultipleNotExpired = bonusNotExpired.length === 0;
      const paramBonusMultipla = {
        sellingBonus:
          pronosticiPartecipantiBonus.length >= numeroMinimoEsiti && isBonusMultipleNotExpired
            ? percentualeBonus / 100
            : 1,
        bonusMultipla:
          pronosticiPartecipantiBonus.length >= numeroMinimoEsiti && isBonusMultipleNotExpired
            ? calculatorPercentualBonus(percentualeBonus, numeroMinimoEsiti, pronosticiPartecipantiBonus.length)
            : 1,
        numeroMinimoEsiti: numeroMinimoEsiti,
        isBonusExpired: isBonusMultipleNotExpired,
        quotaMinima: quotaMinima,
      };
      return paramBonusMultipla;
    }
  }, [bonusConfigMultipla, selectedEvents, isBonusNotExpired]);

  useEffect(() => {
    const newFactor = getMoltiplicatoreBonus();
    if (newFactor) {
      setBonusFactor(newFactor.bonusMultipla);
      calculateBonusMultipla(
        newFactor.bonusMultipla,
        newFactor.numeroMinimoEsiti,
        newFactor.isBonusExpired,
        newFactor.sellingBonus,
        newFactor.quotaMinima,
      );
    }
  }, [getMoltiplicatoreBonus, calculateBonusMultipla, selectedEvents.length]);

  return (
    <StyledBonusMultipla>
      {bonusConfig && bonusFactor > 1 && (
        <div>
          Bonus multipla <div data-qa="carrello-bonus-quota">({truncate(bonusFactor || 1, 2)})</div>{" "}
          <div data-qa="carrello-bonus-importo">{parseAsMoney(bonusMultipla)}</div>
        </div>
      )}
    </StyledBonusMultipla>
  );
};

const StyledBonusMultipla = styled.div`
  text-align: right;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: 100;
  display: flex;
  flex-wrap: nowrap;

  div {
    font-weight: 700;
    margin-left: 5px;
  }
`;
