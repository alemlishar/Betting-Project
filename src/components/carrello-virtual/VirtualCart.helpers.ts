import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MultiplaFooterStateType } from "src/components/carrello-virtual/footer/MultiplaVirtualFooter";
import { calculateMaxWinning, isBonusMultipla } from "src/helpers/calculationUtils";
import { fetchPostJSONplain } from "src/helpers/fetch-json";
import { decimalToIntegerValue } from "src/helpers/formatCurrencyAmountUtils";
import { ConfigToEvaluateFormat } from "src/helpers/formatUtils";
import { BonusConfigClassType } from "src/types/bonusConfig.type";
import { VirtualEsitoType, VirtualEventType } from "src/types/carrello.types";
import { CardinalityAndSellingAmount, GiocataSistemisticaSviluppataVirtualResponse } from "src/types/sistemi.types";

/**
 * Aggiorna indice esiti del carrello
 */
export function updateIndexCarrello(selectedEvents: Array<VirtualEventType>) {
  var carrelloIndice = 0;
  carrelloIndice = selectedEvents
    .map((evento: VirtualEventType) => evento.esiti.length)
    .reduce((acc, element) => acc + element, 0);
  selectedEvents.map((evento: VirtualEventType) =>
    evento.esiti.map((esito: VirtualEsitoType) => {
      esito.indice = carrelloIndice;
      carrelloIndice--;
      return null;
    }),
  );
}

/**
 * Controlla se nuovo enserimento è legabile con quelli presenti nel carrello
 */
export function controlNewEvent(
  selectedEvent: VirtualEventType[],
  newEvent: VirtualEventType,
  isSistemaVirtualActive: boolean,
  currentEsito: VirtualEsitoType | undefined,
): boolean {
  const findDisciplina = selectedEvent.find(
    (event) => event.codiceDisciplina === newEvent.codiceDisciplina && event.provider === newEvent.provider,
  );
  const isSameEvent = selectedEvent.find(
    (evento) => evento.eventId === newEvent.eventId && evento.codiceAvvenimento === newEvent.codiceAvvenimento,
  );

  const disciplina = [...selectedEvent, newEvent].map((event) => {
    return `${event.provider}_${event.codiceDisciplina}`;
  });
  const disciplinaList = Array.from(new Set(disciplina));
  if (isSistemaVirtualActive) {
    if (findDisciplina === undefined) {
      return false;
    } else {
      return true;
    }
  } else {
    if (
      findDisciplina !== undefined &&
      isSameEvent !== undefined &&
      currentEsito === undefined &&
      disciplinaList.length > 1
    ) {
      return false;
    } else {
      return true;
    }
  }
}
/**
 * Long press puntata input
 */
export function useLongPress({ onClick, onLongPress }: { onClick: () => void; onLongPress: () => void }) {
  const ms = 200;
  const [isLongPress, setIsLongPress] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout>();
  const eventRef = useRef<EventTarget>();

  const longPressCallback = useCallback(() => {
    onLongPress();
    eventRef.current = undefined;
    timerRef.current = undefined;
  }, [onLongPress]);
  useEffect(() => {
    if (isLongPress) {
      const interval = setTimeout(() => {
        onLongPress();
      }, ms);
      return () => {
        clearTimeout(interval);
      };
    }
  }, [isLongPress, onLongPress]);
  const start = useCallback(
    (e) => {
      eventRef.current = e;
      timerRef.current = setTimeout(longPressCallback, ms);
      setIsLongPress(true);
    },
    [longPressCallback, ms],
  );

  const stop = useCallback(
    (ev) => {
      eventRef.current = ev;
      setIsLongPress(false);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        onClick();

        timerRef.current = undefined;
        eventRef.current = undefined;
      }
    },
    [onClick],
  );

  return useMemo(
    () => ({
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
      onTouchStart: start,
      onTouchEnd: stop,
      onKeyDown: start,
      onKeyUp: stop,
    }),
    [start, stop],
  );
}

/**
 * Giocata Sistemistica
 */
export function getGiocatasistemisticaPayload(
  selectedEvents: VirtualEventType[],
  betByCardinality: CardinalityAndSellingAmount[],
): Promise<{ result?: GiocataSistemisticaSviluppataVirtualResponse; error?: unknown }> {
  let payload: SviluppoSistemaRequest = {
    esitoRequest: [],
    cdsr: [],
  };
  const esitoRequest: EsitoRequest[] = selectedEvents
    .map((event) => {
      return event.esiti.map((esito) => {
        return {
          eventId: event.eventId,
          dataEvento: new Date(event.dataAvvenimento).toISOString(),
          descrEvento: event.descrizioneEvento,
          stato: event.stato,
          idDisciplina: event.codiceDisciplina,
          descrdisc: event.siglaDisciplina,
          sogeicodpalinsesto: event.codicePalinsesto,
          sogeicodevento: event.codiceAvvenimento,
          provider: event.provider,
          descrizioneScommessa: esito.descrizioneScommessa,
          rtp: esito.rtp,
          descrizioneEsito: esito.descrizione,
          quota: Number(esito.quota.toFixed(0)),
          formattedQuota: esito.formattedQuota,
          probwin: esito.probwin,
          idEsito: esito.codiceEsito,
          idScommessa: esito.idScommessa,
        };
      });
    })
    .flat(1);
  if (betByCardinality.length === 0) {
    const cdsr: CardinalityAndSellingAmount[] = selectedEvents.map((event, index) => {
      return {
        cardinalita: index + 1,
        importo: 0,
      };
    });
    payload = {
      esitoRequest: esitoRequest,
      cdsr: cdsr,
    };
  } else {
    const cdsr: CardinalityAndSellingAmount[] = betByCardinality.map((cardinality, index) => {
      if (cardinality === undefined) {
        return {
          cardinalita: index + 1,
          importo: 0,
        };
      } else {
        return {
          cardinalita: cardinality.cardinalita,
          importo: cardinality.importo * 100,
        };
      }
    });
    payload = { esitoRequest: esitoRequest, cdsr: cdsr };
  }

  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/bonus/system/giocatasistemistica/virtual`, payload);
}

export function potentialWinningAmount(inputValue: number, quotaTotale: ConfigToEvaluateFormat) {
  return calculateMaxWinning(quotaTotale, inputValue);
}

type EsitoRequest = {
  eventId: number;
  dataEvento: string;
  descrEvento: string;
  stato: number;
  idDisciplina: number;
  descrdisc: string;
  sogeicodpalinsesto: string;
  sogeicodevento: string;
  provider: number;
  descrizioneScommessa: string;
  rtp: number;
  descrizioneEsito: string;
  quota: number;
  formattedQuota: string;
  probwin: number;
  idEsito: number;
  idScommessa: number;
};

type SviluppoSistemaRequest = {
  cdsr: CardinalityAndSellingAmount[];
  esitoRequest: EsitoRequest[];
};

//SELL
export function systemVirtualSellingPayload() {
  return undefined;
}
export function multipleVirtualSellingPayload(
  selectedEvent: VirtualEventType[],
  multiplaFooterVirtualState: MultiplaFooterStateType,
  bonusVirtualConfig: BonusConfigClassType | undefined,
): SellingVirtualMultiplaSingola {
  const bonusConfiguration = bonusVirtualConfig
    ? bonusVirtualConfig
    : {
        systemClass: 0,
        bonusMultiplier: 115,
        minimumOutcomes: 2,
        minimumQuotaValue: 110,
        bonusExpirationDateDiff: 30,
      };

  const scommesse: ScommesseVirtualType[] = selectedEvent.map((evento) => {
    return {
      palinsesto: Number(evento.codicePalinsesto),
      codice: Number(evento.codiceAvvenimento),
      quota: decimalToIntegerValue(evento.esiti[0].quota),
      scommessa: Number(evento.esiti[0].idScommessa),
      esiti: evento.esiti.map(
        (esito): EsitiSellingVirtualType => {
          return {
            esito: esito.codiceEsito,
          };
        },
      ),
    };
  });
  const attrExt = isBonusMultipla(
    bonusConfiguration,
    selectedEvent.map((evento) => {
      return { quota: evento.esiti[0].quota };
    }),
  )
    ? {
        bonusPercVar: {
          tipoBonus: 2 as 2,
          minAvv: bonusConfiguration.minimumOutcomes,
          bonus: evaluateBonusValue(bonusConfiguration.bonusMultiplier),
        },
      }
    : undefined;

  return {
    prezzo: decimalToIntegerValue(multiplaFooterVirtualState.bet),
    maxPag: decimalToIntegerValue(multiplaFooterVirtualState.vincitaMassima),
    scommesse: scommesse,
    attrExt: attrExt,
    conto: "",
  };
}

function evaluateBonusValue(bonus: number): number {
  return (bonus - 100) * 100;
}
export type SellingVirtualMultiplaSingola = {
  prezzo: number;
  maxPag: number;
  scommesse: Array<ScommesseVirtualType>;
  attrExt: AttrExtVirtualMultipleType | undefined;
  conto: string;
};
type ScommesseVirtualType = {
  palinsesto: number;
  codice: number;
  scommessa: number;
  quota: number;
  esiti: Array<EsitiSellingVirtualType>;
};
type EsitiSellingVirtualType = {
  esito: number;
};
type AttrExtVirtualMultipleType = {
  bonusPercVar: BonusPercVarType;
};
type BonusPercVarType = {
  tipoBonus: 2;
  minAvv: number;
  bonus: number;
};
