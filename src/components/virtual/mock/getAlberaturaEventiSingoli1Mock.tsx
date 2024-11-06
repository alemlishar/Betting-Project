import { useEffect, useMemo, useState } from "react";

// calcio
// ogni 3 minuti viene generato un evento
// su ogni evento si puo scommetere per 105 secondi
const formattedOrarioFormatter = new Intl.DateTimeFormat("it-IT", { hour: "numeric", minute: "numeric" });
const generationDelta = 3 * 30 * 1000;
const betDelta = 105 * 1000;
//const eventIdOffset = 10000;
function getAlberaturaEventiSingoli1CalcioBySequence(
  dateOffset: Date,
  now: Date,
  eventSequence: number,
): Array<GetAlberaturaEventiSingoli1Event> {
  // const eventId = eventIdOffset + eventSequence;
  const dataEvento = new Date(dateOffset.getTime() + 3 * eventSequence * generationDelta);
  const formattedOrario = formattedOrarioFormatter.format(dataEvento);

  const dataEvento2 = new Date(dateOffset.getTime() + 2 * eventSequence * generationDelta);
  const formattedOrario2 = formattedOrarioFormatter.format(dataEvento2);

  const dataEvento3 = new Date(dateOffset.getTime() + eventSequence * generationDelta);
  const formattedOrario3 = formattedOrarioFormatter.format(dataEvento3);
  if (now.getTime() < dataEvento3.getTime() - betDelta) {
    throw new Error();
  }
  const stato = now.getTime() < dataEvento.getTime() ? 1 : 2;
  const timeremaing = Math.trunc((dataEvento.getTime() - now.getTime()) / 1000);
  return [
    {
      eventId: 1,
      dataEvento: dataEvento.toISOString(),
      formattedOrario,
      stato,
      idDisciplina: "18_5",
      descrdisc: "Calcio",
      sogeicodpalinsesto: "2100300454",
      sogeicodevento: "107", // should change
      timeremaing,
      provider: 18,
      codDisciplina: 5,
      giornata: null,
      descrEvento: "Little Verona - Cagliari Nuraghi", // should change
      gold: false,
    },
    {
      eventId: 2,
      dataEvento: dataEvento2.toISOString(),
      formattedOrario: formattedOrario2,
      stato,
      idDisciplina: "31_2",
      descrdisc: "CavalliDeluxe",
      sogeicodpalinsesto: "2100300454",
      sogeicodevento: "107", // should change
      timeremaing,
      provider: 18,
      codDisciplina: 5,
      giornata: null,
      descrEvento: "Little Verona - Cagliari Nuraghi", // should change
      gold: false,
    },
    {
      eventId: 3,
      dataEvento: dataEvento3.toISOString(),
      formattedOrario: formattedOrario3,
      stato,
      idDisciplina: "31_1",
      descrdisc: "CaniDeluxe",
      sogeicodpalinsesto: "2100300454",
      sogeicodevento: "107", // should change
      timeremaing,
      provider: 18,
      codDisciplina: 5,
      giornata: null,
      descrEvento: "Little Verona - Cagliari Nuraghi", // should change
      gold: false,
    },
    {
      eventId: 3099950,
      dataEvento: "2021-03-08T16:13:00.000+0000",
      formattedOrario: "17:13",
      stato: 1,
      idDisciplina: "31_5",
      descrdisc: "Football",
      sogeicodpalinsesto: "2100300669",
      sogeicodevento: "195",
      timeremaing: 111,
      provider: 31,
      codDisciplina: 5,
      giornata: null,
      descrEvento: "LAZ - NAP",
      gold: false,
    },
  ];
}

function getAlberaturaEventiSingoli1Calcio(dateOffset: Date, now: Date): Array<GetAlberaturaEventiSingoli1Event> {
  const timeDelta = now.getTime() - dateOffset.getTime();
  const eventSequence = Math.floor(timeDelta / generationDelta);
  try {
    return getAlberaturaEventiSingoli1CalcioBySequence(dateOffset, now, eventSequence + 1);
  } catch (error) {
    return getAlberaturaEventiSingoli1CalcioBySequence(dateOffset, now, eventSequence);
  }
}

// https://www.sisal.it/api-betting/vrol-api/vrol/palinsesto/getAlberaturaEventiSingoli/1
export function getAlberaturaEventiSingoli1Mock(dateOffset: Date, now: Date): Array<GetAlberaturaEventiSingoli1Event> {
  return getAlberaturaEventiSingoli1Calcio(dateOffset, now);
}

type GetAlberaturaEventiSingoli1Event = {
  eventId: number;
  dataEvento: string;
  formattedOrario: string;
  stato: 1 | 2;
  idDisciplina: string;
  descrdisc: string;
  sogeicodpalinsesto: string;
  sogeicodevento: string;
  timeremaing: number;
  provider: number;
  codDisciplina: number;
  giornata: null;
  descrEvento: string;
  gold: boolean;
};

export function VisualTest_getAlberaturaEventiSingoli1Mock() {
  const dateOffset = useMemo(() => {
    const date = new Date();
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    return date;
  }, []);
  const [data, setData] = useState<Array<GetAlberaturaEventiSingoli1Event>>();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setData(getAlberaturaEventiSingoli1Mock(dateOffset, new Date()));
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [dateOffset]);
  return (
    <pre>
      {data &&
        JSON.stringify(
          {
            eventId: data[0].eventId,
            dataEvento: data[0].dataEvento,
            stato: data[0].stato,
            timeremaing: data[0].timeremaing,
            formattedOrario: data[0].formattedOrario,
          },
          null,
          2,
        )}
    </pre>
  );
}
