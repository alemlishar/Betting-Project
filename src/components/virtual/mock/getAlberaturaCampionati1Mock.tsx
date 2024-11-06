// football league
// ogni 5 minuti viene generato un evento
// su ogni evento si puo scommetere per 3 minuti
const formattedOrarioFormatter = new Intl.DateTimeFormat("it-IT", { hour: "numeric", minute: "numeric" });
const generationDelta = 5 * 60 * 1000;
const betDelta = 4 * 60 * 1000;
const eventIdOffset = 110000;
function getAlberaturaCampionati1FootballLeagueBySequence(
  dateOffset: Date,
  now: Date,
  eventSequence: number,
): GetAlberaturaCampionati1Event {
  const eventId = eventIdOffset + eventSequence;
  const dataEvento = new Date(dateOffset.getTime() + eventSequence * generationDelta);
  const formattedOrario = formattedOrarioFormatter.format(dataEvento);
  if (now.getTime() < dataEvento.getTime() - betDelta) {
    throw new Error();
  }
  const stato = now.getTime() < dataEvento.getTime() ? 1 : 2;
  const timeremaing = Math.trunc((dataEvento.getTime() - now.getTime()) / 1000);
  return {
    eventId,
    dataEvento: dataEvento.toISOString(),
    formattedOrario,
    stato,
    idDisciplina: "31_6",
    descrdisc: "Football League",
    sogeicodpalinsesto: "1405529",
    sogeicodevento: "6",
    timeremaing,
    provider: 31,
    codDisciplina: 6,
    giornata: eventSequence,
    descrEvento: null,
    gold: false,
  };
}

function getAlberaturaCampionati1FootballLeague(dateOffset: Date, now: Date): GetAlberaturaCampionati1Event {
  const timeDelta = now.getTime() - dateOffset.getTime();
  const eventSequence = Math.floor(timeDelta / generationDelta);
  try {
    return getAlberaturaCampionati1FootballLeagueBySequence(dateOffset, now, eventSequence + 1);
  } catch (error) {
    return getAlberaturaCampionati1FootballLeagueBySequence(dateOffset, now, eventSequence);
  }
}

// https://www.sisal.it/api-betting/vrol-api/vrol/palinsesto/getAlberaturaCampionati/1
export function getAlberaturaCampionati1Mock(dateOffset: Date, now: Date): Array<GetAlberaturaCampionati1Event> {
  return [getAlberaturaCampionati1FootballLeague(dateOffset, now)];
}

type GetAlberaturaCampionati1Event = {
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
  giornata: number;
  descrEvento: null;
  gold: boolean;
};
