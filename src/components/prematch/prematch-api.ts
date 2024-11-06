import { it } from "src/components/prematch/prematch-dto";
import {
  ChiaveManifestazione,
  ChiaveDisciplina,
  CodiceDisciplina,
  CodiceManifestazione,
  CodicePalinsesto,
  CodiceAvvenimento,
  BestSellerEveNum,
  ShowLivescoreAvvenimentiNonInCorso,
  SogliaEventiFasceOrariePrematch,
  NumOpenAccordionPrematch,
} from "src/types/chiavi";
import { fetchJSON } from "src/helpers/fetch-json";

export async function getAlberaturaPrematch(): Promise<Alberatura> {
  return fetchJSON(
    `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/prematch/alberaturaPrematch`,
  );
}

export type FiltroGiornaliero = 0 | 1 | 2;

export async function getSchedaManifestazione(
  filtroGiornaliero: FiltroGiornaliero,
  codiceDisciplina: CodiceDisciplina,
  codiceManifestazione: CodiceManifestazione,
): Promise<SchedaManifestazioneContainer>;
export async function getSchedaManifestazione( // eslint-disable-line no-redeclare
  filtroGiornaliero: FiltroGiornaliero,
  codiceDisciplina: CodiceDisciplina,
  codiceManifestazione: CodiceManifestazione,
  codiceCluster: number,
  idMetascomessaTemplate: number,
): Promise<SchedaManifestazioneContainer>;
export async function getSchedaManifestazione( // eslint-disable-line no-redeclare
  filtroGiornaliero: FiltroGiornaliero,
  codiceDisciplina: CodiceDisciplina,
  codiceManifestazione: CodiceManifestazione,
  codiceCluster?: number,
  idMetascomessaTemplate?: number,
): Promise<SchedaManifestazioneContainer> {
  const firstPathSegment = `${filtroGiornaliero}/${codiceDisciplina}-${codiceManifestazione}`;
  const pathSegment =
    codiceCluster !== undefined && idMetascomessaTemplate !== undefined
      ? `${firstPathSegment}/${codiceCluster}/${idMetascomessaTemplate}`
      : firstPathSegment;
  return fetchJSON(
    `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/prematch/schedaManifestazione/${pathSegment}`,
  );
}

export async function getSchedaInfoAggiuntivaAggregator(
  codicePalinsesto: CodicePalinsesto,
  codiceAvvenimento: CodiceAvvenimento,
  isSpecial: Boolean,
  idMetaScommessaTemplate: number,
): Promise<SchedaInfoAggiuntivaAggregatorContainer> {
  return fetchJSON(
    `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/prematch/schedaInfoAggiuntivaAggregator/${codicePalinsesto}/${codiceAvvenimento}/${isSpecial}/${idMetaScommessaTemplate}`,
  );
}

export async function getSchedaAvvenimento(
  codicePalinsesto: CodicePalinsesto,
  codiceAvvenimento: CodiceAvvenimento,
): Promise<SchedaAvvenimentoContainer> {
  return fetchJSON(
    `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/prematch/schedaAvvenimento/${codicePalinsesto}-${codiceAvvenimento}`,
  );
}

export type HomePagePrematchState = "prematch" | "live" | "sceltiPerTe";

export async function getHomePagePalinsesto(homePageState: HomePagePrematchState): Promise<TopMatchContainer> {
  return fetchJSON(
    `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/${homePageState}/top-match`,
  );
}

export async function getLastMinute(): Promise<SceltiPerTeContainer> {
  return fetchJSON(
    `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/prematch/sceltiPerTe/2`,
  );
}

type ConfigurationPrematch = {
  bestSellerEveNum: BestSellerEveNum;
  showLivescoreAvvenimentiNonInCorso: ShowLivescoreAvvenimentiNonInCorso;
  sogliaEventiFasceOrariePrematch: SogliaEventiFasceOrariePrematch;
  numOpenAccordionPrematch: NumOpenAccordionPrematch;
};
export async function getInitConfiguration(): Promise<ConfigurationPrematch> {
  return fetchJSON(
    `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/prematch/init`,
  );
}

// DEBT forse usare i tipi in prematch-dto.d.ts

export type Alberatura = {
  disciplinaMap: Record<ChiaveDisciplina, Disciplina>;
  manifestazioneMap: Record<ChiaveManifestazione, Manifestazione>;
  manifestazioneListByDisciplinaTutti: Record<ChiaveDisciplina, Array<ChiaveManifestazione>>;
  manifestazioneListByDisciplinaOggi: Record<ChiaveDisciplina, Array<ChiaveManifestazione>>;
  manifestazioneListByDisciplinaOggiEDomani: Record<ChiaveDisciplina, Array<ChiaveManifestazione>>;
};

export function isNotNull<T>(t: T | null | undefined): t is T {
  return t != null;
}

export type Disciplina = it.sisal.palinsestosport.model.entity.palinsesti.Disciplina;
export type Manifestazione = it.sisal.palinsestosport.model.entity.palinsesti.Manifestazione;
export type SchedaManifestazioneContainer = it.sisal.palinsestosport.model.entity.container.SchedaManifestazioneContainer;
export type ClusterMenu = it.sisal.palinsestosport.model.entity.palinsesti.ClusterMenu;
export type Cluster = it.sisal.palinsestosport.model.entity.palinsesti.Cluster;
export type MetaScommessaTemplate = it.sisal.palinsestosport.model.entity.palinsesti.MetaScommessaTemplate;
export type InfoTemplate = it.sisal.palinsestosport.model.entity.palinsesti.InfoTemplate;
export type Section = it.sisal.palinsestosport.model.entity.palinsesti.Section;
export type ColumnGroup = it.sisal.palinsestosport.model.entity.palinsesti.ColumnGroup;
export type Column = it.sisal.palinsestosport.model.entity.palinsesti.InfoTemplateColumn;
export type RegexpDescrizione = string;
export type Avvenimento = it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe;
export type Scommessa = it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
export type InfoAggiuntiva = it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva;
export type Esito = it.sisal.palinsestosport.model.entity.palinsesti.Esito;
export type SchedaInfoAggiuntivaAggregatorContainer = it.sisal.palinsestosport.model.entity.container.SchedaInfoAggiuntivaAggregatorContainer;
export type InfoAggiuntivaAggregator = it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator.InfoAggiuntivaAggregator;
export type InfoAggiuntivaAggregatorGroup = it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator.InfoAggiuntivaAggregatorGroup;
export type SchedaAvvenimentoContainer = it.sisal.palinsestosport.model.entity.container.SchedaAvvenimentoContainer;
export type SceltiPerTeContainer = it.sisal.palinsestosport.model.entity.container.SceltiPerTeContainer;
export type TopMatchContainer = it.sisal.palinsestosport.model.entity.container.TopMatchContainer;
