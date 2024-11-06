import { CartClientType, EventoType } from "src/types/carrello.types";
import {
  AmountsChangedResponse,
  AttrExt,
  BonusPercVar,
  CheckInizioAvvenimento,
  Events,
  PalinsestoVendita,
  VendiConQuoteCambiate,
} from "src/types/vendita.types";

export const getVenditaMultipla = ({
  selectedEvents,
  sellingBonusFactor,
  numMinEsitiBonusMultipla,
  bonusMultiplaExpired,
  bonusQuotaMinima,
  clients,
  activeClient,
  newFlag,
  statusAccettazione,
}: {
  selectedEvents: EventoType[];
  sellingBonusFactor: number;
  numMinEsitiBonusMultipla: number;
  bonusMultiplaExpired: boolean;
  clients: Array<CartClientType>;
  activeClient: number;
  newFlag?: number;
  bonusQuotaMinima: number;
  statusAccettazione?: AmountsChangedResponse;
}) => {
  let palinsestoVentitaList: PalinsestoVendita[] = [];
  selectedEvents.map((e) => {
    return e.esiti.map((esito) => {
      return palinsestoVentitaList.push({
        codiceManifestazione: esito.codiceManifestazione,
        siglaDisciplina: esito.siglaDisciplina,
        siglaManifestazione: esito.siglaManifestazione,
        palinsesto: e.codicePalinsesto,
        live: e.live,
        fixed: false,
        avvenimento: e.codiceAvvenimento,
        scommessa: esito.codiceScommessa,
        esito: esito.codiceEsito,
        descrizioneEsito: esito.descrizioneEsito,
        quota: esito.quota / 100,
        flagBonus:
          esito.quota >= bonusQuotaMinima &&
          numMinEsitiBonusMultipla <= selectedEvents.length &&
          bonusMultiplaExpired &&
          sellingBonusFactor > 1
            ? 1
            : 0,
        infoAggiuntiva: esito.idInfoAggiuntiva,
        eventDescription: e.descrizioneAvvenimento,
        marketDescription: esito.descrizioneScommessa,
        codiceDisciplina: e.codiceDisciplina,
        eventDate: e.dataAvvenimento, // da aggiungere senza "ore"
      });
    });
  });

  let events: Events[] = [];

  selectedEvents.map((e) => {
    if (e.live === false) {
      return events?.push({
        palinsesto: e.codicePalinsesto,
        avvenimento: e.codiceAvvenimento,
      });
    }
    return [];
  });

  const bonusPercVar: BonusPercVar = {
    tipoBonus: 2,
    minAvv: numMinEsitiBonusMultipla,
    bonus: Number((Number(sellingBonusFactor - 1) * 10000).toFixed(0)),
  };

  const checkInizioAvvenimento: CheckInizioAvvenimento = {
    events: events,
  };

  const vendiConQuoteCambiate: VendiConQuoteCambiate = {
    flag: newFlag ? (newFlag - 1).toString() : (clients[activeClient].impostazioniScommessa[0].share - 1).toString(),
  };

  let attrExt: AttrExt = {};
  //caso 1 => 5+ eventi e non live

  if (sellingBonusFactor > 1 && events.length !== 0 && bonusMultiplaExpired) {
    attrExt = {
      checkInizioAvvenimento: checkInizioAvvenimento,
      bonusPercVar: bonusPercVar,
      vendiConQuoteCambiate: vendiConQuoteCambiate,
    };
  }
  //caso 2 => 5+ eventi e live
  else if (sellingBonusFactor > 1 && events.length === 0 && bonusMultiplaExpired) {
    attrExt = {
      bonusPercVar: bonusPercVar,
      vendiConQuoteCambiate: vendiConQuoteCambiate,
    };
  }
  //caso 3 => 5- eventi e non live
  else if (sellingBonusFactor <= 1 && events.length !== 0) {
    attrExt = {
      checkInizioAvvenimento: checkInizioAvvenimento,
      vendiConQuoteCambiate: vendiConQuoteCambiate,
    };
  }
  //caso 4 => 5- eventi e live
  else if (sellingBonusFactor <= 1 && events.length === 0) {
    attrExt = { vendiConQuoteCambiate: vendiConQuoteCambiate };
  }

  if (statusAccettazione) {
    attrExt = {
      ...attrExt,
      consoleAccettazione: { idAccettazione: statusAccettazione.attrExtConsole.status.idAccettazione },
    };
  }

  return {
    palinsestoVentitaList,
    attrExt,
  };
};
