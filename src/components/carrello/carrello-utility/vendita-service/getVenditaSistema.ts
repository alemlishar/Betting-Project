import { getFlagBonusEsito } from "src/helpers/calculationUtils";
import { BonusConfigClassType } from "src/types/bonusConfig.type";
import { CartClientType, EventoType, SviluppoSistemaType } from "src/types/carrello.types";
import { SviluppoSistema } from "src/types/sistemi.types";
import {
  AmountsChangedResponse,
  AttrExtSistema,
  BonusPercVarSistema,
  BonusSistemi,
  CheckInizioAvvenimento,
  EsitoSportSistemistica,
  Events,
  NumAvvBase,
  ScommessaSportSistemistica,
  Sistemi,
  VendiConQuoteCambiate,
} from "src/types/vendita.types";

export const getVenditaSistema = ({
  currentSviluppoSistema,
  selectedEvents,
  clients,
  activeClient,
  configBonusSystem,
  newFlag,
  sviluppiSistemaWithBonusApplicatoByCardinalita,
  statusAccettazione,
}: {
  currentSviluppoSistema: SviluppoSistemaType[] | undefined;
  selectedEvents: EventoType[];
  clients: Array<CartClientType>;
  activeClient: number;
  configBonusSystem: BonusConfigClassType[] | undefined;
  newFlag?: number;
  sviluppiSistemaWithBonusApplicatoByCardinalita?: SviluppoSistema[] | undefined;
  statusAccettazione?: AmountsChangedResponse;
}) => {
  let sistemi: Sistemi[] = [];
  let esitoSportSistemistica: EsitoSportSistemistica[] = [];
  let scommessaSportSistemistica: {
    [key: string]: ScommessaSportSistemistica[];
  } = {};
  let numAvvBase: NumAvvBase[] = [];
  const puntateLegature: Array<number> = [];

  if (currentSviluppoSistema) {
    sistemi = currentSviluppoSistema.map((l) => {
      puntateLegature.push(l.bet);
      return {
        sistema: l.indice,
        quota: l.bet,
        multiple: l.combinazioni,
        minWinningAmount: l.winAmounts.min,
        maxWinningAmount: l.winAmounts.max,
      };
    });
  }

  const isBonusPercSystem =
    sviluppiSistemaWithBonusApplicatoByCardinalita &&
    sviluppiSistemaWithBonusApplicatoByCardinalita.length !== 0 &&
    sviluppiSistemaWithBonusApplicatoByCardinalita !== undefined;
  const quoteToEvaluateBonus = selectedEvents
    .map((e) =>
      e.esiti.map((es) => {
        return { quota: es.quota };
      }),
    )
    .flat(1);
  const sistemaRidotto = sistemi.filter((sistema) => {
    return sistema.quota !== 0;
  });
  if (configBonusSystem) {
  }
  selectedEvents.forEach((evento, index) => {
    evento.esiti.forEach((esito) => {
      let key = evento.codiceAvvenimento + "-" + esito.codiceScommessa + "-" + esito.idInfoAggiuntiva;
      if (scommessaSportSistemistica[key] === undefined || scommessaSportSistemistica["key"] === null) {
        scommessaSportSistemistica[key] = [];
        scommessaSportSistemistica[key].push({
          scommessa: esito.codiceScommessa,
          marketDescription: esito.descrizioneScommessa,
          infoaggiuntive: esito.idInfoAggiuntiva,
          esiti: [
            {
              ...esitoSportSistemistica,
              esito: esito.codiceEsito, //codiceClasseEsito
              descrizioneEsito: esito.descrizioneEsito,
              quota: esito.quota / 100,
              flagBonus:
                getFlagBonusEsito(configBonusSystem, esito.quota, index + 1, quoteToEvaluateBonus) && isBonusPercSystem
                  ? 1
                  : 0,
            },
          ],
        });
      } else {
        const newEsito: EsitoSportSistemistica = {
          esito: esito.codiceEsito, //codiceClasseEsito
          descrizioneEsito: esito.descrizioneEsito,
          quota: esito.quota / 100,
          flagBonus:
            getFlagBonusEsito(configBonusSystem, esito.quota, index + 1, quoteToEvaluateBonus) && isBonusPercSystem
              ? 1
              : 0,
        };
        const newEsiti = [...scommessaSportSistemistica[key][0].esiti, newEsito];
        scommessaSportSistemistica[key].push({
          scommessa: esito.codiceScommessa,
          marketDescription: esito.descrizioneScommessa,
          infoaggiuntive: esito.idInfoAggiuntiva,

          esiti: [...newEsiti],
        });
        if (scommessaSportSistemistica[key].length > 1) {
          scommessaSportSistemistica[key].shift();
        }
      }
    });
  });

  selectedEvents.map((e, i) => {
    return (numAvvBase[i] = {
      codiceManifestazione: e.codiceManifestazione,
      siglaDisciplina: e.siglaDisciplina,
      siglaManifestazione: e.siglaManifestazione,
      codiceDisciplina: e.codiceDisciplina,
      live: e.live,
      eventDate: e.dataAvvenimento, // da aggiungere senza "ore"
      palinsesto: e.codicePalinsesto,
      avvenimento: e.codiceAvvenimento,
      eventDescription: e.descrizioneAvvenimento,
      fissa: e.isFixed ? 1 : 0, //se l'avvenimento è fisso 1 altrimenti 0
      legame: e.esiti[0].multipla,
      scommesse: e.esiti.map((esito) => {
        let key = e.codiceAvvenimento + "-" + esito.codiceScommessa + "-" + esito.idInfoAggiuntiva;
        if (scommessaSportSistemistica[key] === undefined || scommessaSportSistemistica[key] === null) {
          scommessaSportSistemistica[key] = [];
          scommessaSportSistemistica[key].push({
            scommessa: esito.codiceScommessa,
            marketDescription: esito.descrizioneScommessa,
            infoaggiuntive: esito.idInfoAggiuntiva,
            esiti: [
              {
                ...esitoSportSistemistica,
                esito: esito.codiceEsito, //codiceClasseEsito
                descrizioneEsito: esito.descrizioneEsito,
                quota: esito.quota / 100,
                flagBonus:
                  getFlagBonusEsito(configBonusSystem, esito.quota, i + 1, quoteToEvaluateBonus) && isBonusPercSystem
                    ? 1
                    : 0,
              },
            ],
          });
        } else {
          const newEsito: EsitoSportSistemistica = {
            esito: esito.codiceEsito, //codiceClasseEsito
            quota: esito.quota / 100,
            descrizioneEsito: esito.descrizioneEsito,
            flagBonus:
              getFlagBonusEsito(configBonusSystem, esito.quota, i + 1, quoteToEvaluateBonus) && isBonusPercSystem
                ? 1
                : 0,
          };
          const newEsiti = [...scommessaSportSistemistica[key][0].esiti, newEsito];
          scommessaSportSistemistica[key].push({
            scommessa: esito.codiceScommessa,
            marketDescription: esito.descrizioneScommessa,
            infoaggiuntive: esito.idInfoAggiuntiva,
            esiti: [...newEsiti],
          });
          if (scommessaSportSistemistica[key].length > 1) {
            scommessaSportSistemistica[key].shift();
          }
        }
        /**Elimino esiti doppi */
        scommessaSportSistemistica[key][0].esiti = scommessaSportSistemistica[key][0].esiti.filter(
          (scommessaSportSistemistica, index, self) =>
            index ===
            self.findIndex(
              (t) => t.esito === scommessaSportSistemistica.esito && t.quota === scommessaSportSistemistica.quota,
            ),
        );

        return scommessaSportSistemistica[key][0];
      }),
    });
  });
  /**Elimino scommesse doppie */
  for (let i = 0; i < numAvvBase.length; i++) {
    numAvvBase[i].scommesse = numAvvBase[i].scommesse.filter(
      (scommessaSportSistemistica, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.scommessa === scommessaSportSistemistica.scommessa &&
            t.infoaggiuntive === scommessaSportSistemistica.infoaggiuntive,
        ),
    );
  }

  let events: Events[] = [];

  selectedEvents.map((e) => {
    if (e.live === false) {
      return events.push({
        palinsesto: e.codicePalinsesto,
        avvenimento: e.codiceAvvenimento,
      });
    }
    return [];
  });

  const checkInizioAvvenimento: CheckInizioAvvenimento = {
    events: events,
  };
  const vendiConQuoteCambiate: VendiConQuoteCambiate = {
    flag: newFlag ? (newFlag - 1).toString() : (clients[activeClient].impostazioniScommessa[0].share - 1).toString(),
  };
  const flagBonusSistema = Object.values(scommessaSportSistemistica).map((scommessa) =>
    // eslint-disable-next-line array-callback-return
    scommessa.map((scom) => {
      // eslint-disable-next-line array-callback-return
      scom.esiti.filter((esito) => {
        if (esito.flagBonus) {
          return esito.flagBonus > 0;
        }
      });
    }),
  ).length;
  let bonusSistemi: BonusSistemi[] = [];

  sviluppiSistemaWithBonusApplicatoByCardinalita?.map((bonusSystemCardinality) => {
    let filtro = flagBonusSistema;

    return configBonusSystem?.find((l) => {
      if (bonusSystemCardinality.cardinalita === l.systemClass) {
        return bonusSistemi.push({
          sistema: l.systemClass?.toString(),
          bonus: Number((Number(l.bonusMultiplier - 100) * 100).toFixed(0)),
          minAvv: l.minimumOutcomes,
          filtro: filtro === bonusSystemCardinality.cardinalita ? "0" : "1",
        });
      }
      return null;
    });
  });

  const bonusPercVarSistema: BonusPercVarSistema = {
    tipoBonus: 4,
    sistemi: bonusSistemi,
  };
  let attrExt: AttrExtSistema = {};
  // const attrExt: AttrExt = { checkInizioAvvenimento: checkInizioAvvenimento };
  if (isBonusPercSystem && events.length !== 0) {
    attrExt = {
      checkInizioAvvenimento: checkInizioAvvenimento,
      bonusPercVarSistema: bonusPercVarSistema,
      vendiConQuoteCambiate: vendiConQuoteCambiate,
    };
  }
  //caso 2 => 5+ eventi e live
  else if (isBonusPercSystem && events.length === 0) {
    attrExt = {
      bonusPercVarSistema: bonusPercVarSistema,
      vendiConQuoteCambiate: vendiConQuoteCambiate,
    };
  }
  //caso 3 => 5- eventi e non live
  else if (!isBonusPercSystem && events.length !== 0) {
    attrExt = {
      checkInizioAvvenimento: checkInizioAvvenimento,
      vendiConQuoteCambiate: vendiConQuoteCambiate,
    };
  }
  //caso 4 => 5- eventi e live
  else if (!isBonusPercSystem && events.length === 0) {
    attrExt = { vendiConQuoteCambiate: vendiConQuoteCambiate };
  }
  if (statusAccettazione) {
    attrExt = {
      ...attrExt,
      consoleAccettazione: { idAccettazione: statusAccettazione.attrExtConsole.status.idAccettazione },
    };
  }
  return {
    sistemi,
    sistemaRidotto,
    numAvvBase,
    attrExt,
  };
};
