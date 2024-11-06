import { ReactComponent as Biglie } from "src/assets/images/virtual/biglie.svg";
import { ReactComponent as Cani } from "src/assets/images/virtual/Cani.svg";
import { ReactComponent as CorsaDiCavalli } from "src/assets/images/virtual/CorsaDiCavalli.svg";
import { ReactComponent as Automobilismo } from "src/assets/images/virtual/Automobilismo.svg";
import { ReactComponent as Calcio } from "src/assets/images/virtual/Calcio.svg";
import { ReactComponent as CalcioPro } from "src/assets/images/virtual/CalcioPro.svg";
import { ReactComponent as CavalliDeluxe } from "src/assets/images/virtual/CavalliDeluxe.svg";
import { ReactComponent as CaniDeluxe } from "src/assets/images/virtual/CaniDeluxe.svg";
import { ReactComponent as FootballAllStar } from "src/assets/images/virtual/FootballAllStar.svg";
import { ReactComponent as FootballAllStarLeague } from "src/assets/images/virtual/FootballAllStar.svg";
import { ReactComponent as Cisclismo } from "src/assets/images/virtual/Cisclismo.svg";
import { ReactComponent as CalcioUltra } from "src/assets/images/virtual/CalcioUltra.svg";
import { ReactComponent as MatchDay } from "src/assets/images/virtual/MatchDay.svg";
import { ReactComponent as Rigori } from "src/assets/images/virtual/Rigori.svg";
import configuration from "src/helpers/configuration";

const {
  CAVALLI_DELUXE,
  IPPICA,
  CANI,
  AUTOMOBILISMO,
  CALCIO,
  CALCIO_PRO,
  CALCIO_ULTRA,
  CICLISMO,
  RIGORI,
  MATCH_DAY,
  BIGLIE,
  CANI_DELUXE,
  FOOTBAL_ALL_STARS,
  FOOTBAL_ALL_STARS_LEAGUE,
} = configuration.CODICE_DISCIPLINA_VIRTUAL;

export const IconDisciplinaVirtual = ({ codiceDisciplina: idDisciplina }: { codiceDisciplina: string }) => {
  const VirtualIconsMap = {
    [IPPICA]: <CorsaDiCavalli />,
    [CANI]: <Cani />,
    [AUTOMOBILISMO]: <Automobilismo />,
    [CALCIO]: <Calcio />,
    [CICLISMO]: <Cisclismo />,
    [CALCIO_PRO]: <CalcioPro />,
    [CALCIO_ULTRA]: <CalcioUltra />,
    [BIGLIE]: <Biglie />,
    [RIGORI]: <Rigori />,
    [MATCH_DAY]: <MatchDay />,
    [CAVALLI_DELUXE]: <CavalliDeluxe />,
    [CANI_DELUXE]: <CaniDeluxe />,
    [FOOTBAL_ALL_STARS]: <FootballAllStar />,
    [FOOTBAL_ALL_STARS_LEAGUE]: <FootballAllStarLeague />,
  };
  const icon = VirtualIconsMap[idDisciplina];
  return icon ?? <>{idDisciplina}</>;
};
