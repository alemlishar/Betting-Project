import { orderBy } from "lodash";

import {
  EventoVirtualeBase,
  EventoVirtualeRace,
  InternalState,
  RunnerId,
  ScommessaVirtualeBase,
  VirtualState,
} from "src/components/virtual/virtual-dto";
import { ChiaveAccoppiataTrioBigliettoVirtualComponents } from "src/types/chiavi";

export function orderMenuVirtual(data: VirtualState[]) {
  return orderBy(data, [
    (item) => {
      const diff = new Date(item.startTime).getTime() - new Date().getTime();
      return diff;
    },
  ]);
}

export function orderEventDetailsVirtual(data: EventoVirtualeBase[]) {
  return orderBy(data, [
    (item) => {
      const diff = new Date(item.dataEvento).getTime() - new Date().getTime();
      return diff;
    },
  ]);
}
export function getChiaveAccoppiataTrioBigliettoVirtualComponents({
  evento,
  scommessa,
  accoppiataTrio,
}: {
  evento: EventoVirtualeRace;
  scommessa: ScommessaVirtualeBase;
  accoppiataTrio: InternalState;
}): ChiaveAccoppiataTrioBigliettoVirtualComponents {
  const { dataEvento, descrdisc, eventId, formattedData, coursename, formattedOrario, idDisciplina, provider } = evento;
  const {
    descrizione: descrizioneScommessa,
    id: idScommessa,
    rtp,
    stato,
    sogeicodpalinsesto,
    sogeicodevento,
    result,
  } = scommessa;
  return {
    dataEvento,
    descrizioneScommessa,
    descrizioneEsito: "",
    descrdisc,
    descrEvento: coursename,
    eventId,
    formattedData,
    formattedOrario,
    formattedQuota: "0",
    idDisciplina,
    idEsito: 0,
    idScommessa,
    probwin: 0,
    provider,
    quota: 0,
    result,
    rtp,
    sogeicodevento,
    sogeicodpalinsesto,
    stato,
    accoppiataTrio,
  };
}

export function partitionByRunnerId<Position extends string | number>(
  position: Position,
  entries: Array<[string, Record<Position, true | undefined>]>,
) {
  return entries
    .filter(([runnerId, positions]) => positions?.[position])
    .map(([runnerId]) => Number(runnerId))
    .sort((a, b) => a - b);
}
export function partitionByRunnerIdDisordine(byRunner: Record<RunnerId, true | undefined>) {
  return Object.entries(byRunner)
    .filter((runnerId, pos) => pos !== undefined)
    .map(([runnerId]) => Number(runnerId))
    .sort((a, b) => a - b);
}
