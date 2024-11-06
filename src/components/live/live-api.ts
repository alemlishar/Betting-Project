import { SchedaAvvenimentoContainer } from "src/components/prematch/prematch-api";
import { it } from "src/components/prematch/prematch-dto"; // DEBT spostare il file di definizioni in una posizione più appropriata
import { fetchJSON } from "src/helpers/fetch-json";
import { CodiceAvvenimento, CodiceDisciplina, CodicePalinsesto } from "src/types/chiavi";
import { NumOpenAccordionLive } from "src/types/chiavi";

export async function getAlberatura(): Promise<AlberaturaLive> {
  return fetchJSON(
    `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/live/alberatura`,
  );
}

export async function getSchedaDisciplina(codiceDisciplina: CodiceDisciplina): Promise<LiveOraContainer> {
  return fetchJSON(
    `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/live/live-ora/${codiceDisciplina}`,
  );
}

type ConfigurationLive = {
  numOpenAccordionLive: NumOpenAccordionLive;
};

export async function getInitConfiguration(): Promise<ConfigurationLive> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/live/init`);
}

export async function getSchedaAvvenimento(
  codicePalinsesto: CodicePalinsesto,
  codiceAvvenimento: CodiceAvvenimento,
): Promise<SchedaAvvenimentoContainer> {
  return fetchJSON(
    `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/live/evento-singolo/${codicePalinsesto}-${codiceAvvenimento}`,
  );
}

export type AlberaturaLive = it.sisal.palinsestosport.model.entity.container.AlberaturaContainerLive;
export type LiveOraContainer = it.sisal.palinsestosport.model.entity.container.LiveOraContainer;
export type Livescore = it.sisal.infolive.model.Livescore;
export type ScoreList = it.sisal.infolive.model.Score[];
export type Card = it.sisal.infolive.model.Card;
export type Side = it.sisal.infolive.model.Side;
export type ScoreType = it.sisal.livescore.ScoreType;
export type Score = it.sisal.infolive.model.Score;
