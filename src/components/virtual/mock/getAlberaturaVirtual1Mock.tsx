import { useEffect, useMemo, useState } from "react";
import { getAlberaturaCampionati1Mock } from "src/components/virtual/mock/getAlberaturaCampionati1Mock";

import { getAlberaturaEventiSingoli1Mock } from "src/components/virtual/mock/getAlberaturaEventiSingoli1Mock";
import { VirtualState } from "src/components/virtual/virtual-dto";

export function getAlberaturaVirtual1Mock(dateOffset: Date, now: Date): Array<VirtualState> {
  return [
    ...getAlberaturaEventiSingoli1Mock(dateOffset, now).map(
      ({
        eventId,
        idDisciplina,
        descrdisc,
        descrEvento,
        dataEvento,
        sogeicodpalinsesto,
        sogeicodevento,
        formattedOrario,
      }) => {
        return {
          eventId,
          codiceDisciplina: idDisciplina,
          title: descrEvento,
          subtitle: descrdisc,
          startTime: dataEvento,
          detailId: { type: "singola" as const, codicePalinsesto: sogeicodpalinsesto, codiceEvento: sogeicodevento },
          formattedTime: formattedOrario,
        };
      },
    ),
    ...getAlberaturaCampionati1Mock(dateOffset, now).map(
      ({
        eventId,
        idDisciplina,
        descrdisc,
        giornata,
        dataEvento,
        sogeicodpalinsesto,
        sogeicodevento,
        formattedOrario,
      }) => {
        return {
          eventId,
          codiceDisciplina: idDisciplina,
          title: String(giornata),
          subtitle: descrdisc,
          startTime: dataEvento,
          detailId: { type: "campionato" as const, codicePalinsesto: sogeicodpalinsesto, codiceEvento: sogeicodevento },
          formattedTime: formattedOrario,
        };
      },
    ),
  ];
}

const fullDateFormatter = new Intl.DateTimeFormat("it-It", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

// place it somewhere in the app to see mocked data in real time
export function VisualTest_getAlberaturaVirtual1Mock() {
  const dateOffset = useMemo(() => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    return date;
  }, []);
  const [data, setData] = useState<Array<VirtualState>>();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setData(getAlberaturaVirtual1Mock(dateOffset, new Date()));
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [dateOffset]);
  const now = new Date();
  return (
    <pre>
      {data &&
        JSON.stringify(
          data.map((event) => {
            const startTime = new Date(event.startTime);
            return {
              ...event,
              "*stato": now < startTime ? 1 : 2,
              "*timeremaing": Math.trunc((startTime.getTime() - now.getTime()) / 1000),
              "*date": fullDateFormatter.format(startTime),
            };
          }),
          null,
          2,
        )}
    </pre>
  );
}
