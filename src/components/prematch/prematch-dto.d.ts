/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.17.558 on 2019-09-24 12:28:38.

export namespace it.sisal.betting.model {
  export interface CalendarioLiveAvvenimentoContainer {
    readonly urlIconaDisciplina: string;
    readonly descrizioneDisciplina: string;
    readonly urlIconaManifestazione: string;
    readonly descrizioneManifestazione: string;
    readonly avvenimento: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoKeyData;
    readonly scommessa: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    readonly infoAggiuntivaList: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva[];
  }
}

export namespace it.sisal.betting.model {
  export interface CalendarioLiveContainer {
    readonly calendarioLiveAvvenimentoContainerList: it.sisal.betting.model.CalendarioLiveAvvenimentoContainer[];
    readonly idFascia: number;
  }
}

export namespace it.sisal.betting.model {
  export interface CalendarioLiveContainerResponse {
    readonly calendarioLiveContainerList: it.sisal.betting.model.CalendarioLiveContainer[];
  }
}

export namespace it.sisal.betting.model {
  export interface CalendarioLiveFasceOrarieResponse {
    readonly total: number;
    readonly unfilteredStreamingTotal: number;
    readonly unfilteredTotalsByCodiceDisciplina: {
      [index: string]: it.sisal.betting.model.FasceOrarieByDisciplina;
    };
    readonly sogliaEventiFasceOrarie: number;
    readonly unfilteredTotal: number;
    readonly fasceOrarie: it.sisal.betting.model.FasciaOraria[];
  }
}

export namespace it.sisal.betting.model {
  export interface FasceOrarieByDisciplina {
    readonly total: number;
    readonly streamingTotal: number;
    readonly disciplinaDescription: string;
  }
}

export namespace it.sisal.betting.model {
  export interface FasciaOraria {
    readonly id: number;
    readonly start: string;
    readonly count: number;
    readonly end: string;
    readonly startDate: DateAsString;
    readonly endDate: DateAsString;
  }
}

export namespace it.sisal.betting.model {
  export interface Hour {
    readonly value: string;
    readonly localDateTime: DateAsString;
  }
}

export namespace it.sisal.betting.model {
  export interface Interval {
    readonly start: number;
    readonly end: number;
    readonly nextDay: boolean;
  }
}

export namespace it.sisal.palinsestosport.model.conf {
  export interface ClasseAggregata extends it.sisal.mtpsynchronizer.Classe {
    readonly esitoDiClasseAggregataList: it.sisal.mtpsynchronizer.Esito[];
  }
}

export namespace it.sisal.palinsestosport.model.conf {
  export interface CodiceEsitoTradotto {
    readonly codiceScommessaAAMS: number;
    readonly codiceEsitoAAMS: number;
    readonly codiceEsitoInterno: number;
    readonly descrizioneEsitoInterno: string;
  }
}

export namespace it.sisal.palinsestosport.model.conf {
  export interface EsitoDiClasseAggregata extends it.sisal.mtpsynchronizer.Esito {
    readonly codiceScommessaAAMS: number;
    readonly codiceEsitoAAMS: number;
    readonly legmin: number;
    readonly legmax: number;
  }
}

export namespace it.sisal.palinsestosport.model.conf {
  export interface ScommessaAggregata {
    readonly codiceScommessaInterno: number;
    readonly codiceDisciplina: number;
    readonly descrizioneScommessaInterno: string;
    readonly descrizioneInfoAggInterno: string;
    readonly descrizioneInfoAggInternoFormatter: it.sisal.palinsestosport.model.conf.descrizioneInfoAggInternoFormatters.IDescrizioneInfoAggInternoFormatter;
    readonly codiceEsitoTradottoList: it.sisal.palinsestosport.model.conf.CodiceEsitoTradotto[];
  }
}

export namespace it.sisal.palinsestosport.model.conf {
  export interface ScommessaAggregataManager {}
}

export namespace it.sisal.palinsestosport.model.conf.descrizioneInfoAggInternoFormatters {
  export interface DoppiaChanceUnderOverFormatter
    extends it.sisal.palinsestosport.model.conf.descrizioneInfoAggInternoFormatters
      .IDescrizioneInfoAggInternoFormatter {}
}

export namespace it.sisal.palinsestosport.model.conf.descrizioneInfoAggInternoFormatters {
  export interface IDescrizioneInfoAggInternoFormatter {}
}

export namespace it.sisal.palinsestosport.model.entity.bonus {
  export interface BonusDataCompetenza {
    readonly row: it.sisal.palinsestosport.model.entity.bonus.ROWType;
  }
}

export namespace it.sisal.palinsestosport.model.entity.bonus {
  export interface QueryString {
    readonly query: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.bonus {
  export interface ROWType {
    readonly datadiff: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface AlberaturaContainer {
    readonly disciplinaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Disciplina;
    };
    readonly manifestazioneMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Manifestazione;
    };
    readonly manifestazioneListByDisciplinaTutti: { [index: string]: string[] };
    readonly manifestazioneListByDisciplinaOggi: { [index: string]: string[] };
    readonly manifestazioneListByDisciplinaOggiEDomani: {
      [index: string]: string[];
    };
    readonly manifestazioneListByDisciplinaDomani: {
      [index: string]: string[];
    };
    readonly manifestazioneListByDisciplinaDopoDomani: {
      [index: string]: string[];
    };
    readonly headerPalGiornalieriList: it.sisal.palinsestosport.model.entity.container.HeaderPalGiornalieri[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface AlberaturaContainerLive {
    readonly avvenimentoFeMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe;
    };
    readonly disciplinaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Disciplina;
    };
    readonly manifestazioneMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Manifestazione;
    };
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface AlberaturaSpecialeContainer {
    readonly menuSpecialeMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.ManifestazioneSpeciale[];
    };
    readonly disciplinaSpecialeMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.DisciplinaSpeciale;
    };
    readonly intestazioneMenuSpeciale: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface AlberaturaSpecialeContainerV2 {
    readonly menuSpecialeMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.ManifestazioneSpeciale;
    };
    readonly disciplinaSpecialeMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.DisciplinaSpeciale;
    };
    readonly intestazioneMenuSpeciale: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface CalendarioLiveAvvenimentoContainer {
    readonly urlIconaDisciplina: string;
    readonly descrizioneDisciplina: string;
    readonly urlIconaManifestazione: string;
    readonly descrizioneManifestazione: string;
    readonly avvenimento: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoKeyData;
    readonly scommessa: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    readonly infoAggiuntivaList: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface HeaderPalGiornalieri {
    readonly filter: number;
    readonly label: string;
    readonly isoDate: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface LiveOraContainer {
    readonly disciplinaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Disciplina;
    };
    readonly manifestazioneMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Manifestazione;
    };
    readonly avvenimentoFeMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe;
    };
    readonly scommessaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    };
    readonly infoAggiuntivaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva;
    };
    readonly infoAggiuntivaAggregatorGroupMapByAvvenimento: {
      [index: string]: {
        [index: string]: it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator.InfoAggiuntivaAggregatorGroup;
      };
    };
    readonly metaScommessaTemplateMapByDisciplinaKey: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.MetaScommessaTemplate;
    };
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface QuickBetContainer {
    readonly pronosticoList: it.sisal.commons.model.sport.Pronostico[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface RicercaCalendarioLiveContainer {
    readonly urlIconaDisciplina: string;
    readonly descrizioneDisciplina: string;
    readonly urlIconaManifestazione: string;
    readonly descrizioneManifestazione: string;
    readonly scommessa: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    readonly infoAggiuntivaList: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface RicercaContainer {
    readonly manifestazione: it.sisal.palinsestosport.model.entity.palinsesti.Manifestazione;
    readonly scommessaConInfoAggiuntiveList: it.sisal.palinsestosport.model.entity.container.ScommessaConInfoAggiuntive[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface RisultatiRicerca {
    readonly termineRicerca: string;
    readonly count: number;
    readonly ricercaContainer: it.sisal.palinsestosport.model.entity.container.RicercaContainer[];
    readonly avvenimentoFeMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe;
    };
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface RisultatiRicercaLive {
    readonly termineRicerca: string;
    readonly count: number;
    readonly calendarioLiveContainer: it.sisal.betting.model.CalendarioLiveContainer;
    readonly liveOraContainer: it.sisal.palinsestosport.model.entity.container.LiveOraContainer;
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface SceltiPerTeContainer {
    readonly avvenimentoFeList: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe[];
    readonly scommessaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    };
    readonly infoAggiuntivaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva;
    };
    readonly metaScommessaTemplate: it.sisal.palinsestosport.model.entity.palinsesti.MetaScommessaTemplate;
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface SchedaAvvenimentoContainer
    extends it.sisal.palinsestosport.model.entity.container.StandardContainer {
    readonly avvenimentoFe: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe;
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface SchedaDettaglioGiocatoreContainer {
    readonly avvenimentoFe: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe;
    readonly scommessaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    };
    readonly infoAggiuntivaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva;
    };
    readonly infoAggiuntivaAggregator: it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator.InfoAggiuntivaAggregator;
    readonly infoAggiuntivaAggregatorGroup: it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator.InfoAggiuntivaAggregatorGroup;
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface SchedaDisciplinaContainer extends it.sisal.palinsestosport.model.entity.container.StandardContainer {
    readonly disciplinaKeyDataList: it.sisal.palinsestosport.model.entity.palinsesti.DisciplinaKeyData[];
    readonly idMetaScommessaTemplateSelected: number;
    readonly avvenimentoFeList: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe[];
    readonly infoAggiuntivaAggregatorGroupMapByAvvenimento: {
      [index: string]: {
        [index: string]: it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator.InfoAggiuntivaAggregatorGroup;
      };
    };
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface SchedaInfoAggiuntivaAggregatorContainer {
    readonly avvenimentoFe: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe;
    readonly scommessaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    };
    readonly infoAggiuntivaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva;
    };
    readonly infoAggiuntivaAggregatorMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator.InfoAggiuntivaAggregator;
    };
    readonly infoAggiuntivaAggregatorGroupMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator.InfoAggiuntivaAggregatorGroup;
    };
    readonly idMetaScommessaTemplate: number;
    readonly special: boolean;
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface SchedaManifestazioneContainer
    extends it.sisal.palinsestosport.model.entity.container.StandardContainer {
    readonly idMetaScommessaTemplateSelected: number;
    readonly avvenimentoFeList: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe[];
    readonly infoAggiuntivaAggregatorGroupMapByAvvenimento: {
      [index: string]: {
        [index: string]: it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator.InfoAggiuntivaAggregatorGroup;
      };
    };
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface ScommessaConInfoAggiuntive {
    readonly scommessa: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    readonly infoAggiuntivaList: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface ScommessaContainer {
    readonly scommessa: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    readonly infoAggiuntivaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva;
    };
    readonly descrizioneManifestazione: string;
    readonly dataAvvenimento: DateAsString;
    readonly formattedDataAvvenimento: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface StandardContainer {
    readonly clusterMenu: it.sisal.palinsestosport.model.entity.palinsesti.ClusterMenu;
    readonly codiceClusterSelected: number;
    readonly scommessaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    };
    readonly infoAggiuntivaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva;
    };
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface AvvenimentoCalendarioLive {
    readonly codPalCodAvv: string;
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
    readonly codiceDisciplina: number;
    readonly descrizioneDisciplina: string;
    readonly codiceManifestazione: number;
    readonly descrizioneManifestazione: string;
    readonly inCalendarioLive: boolean;
    readonly streaming: boolean;
    readonly formattedData: string;
    readonly descrizioneAvvenimento: string;
    readonly dataAvvenimento: DateAsString;
    readonly key: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface AvvenimentoFe extends it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoKeyData {
    readonly dataUltimaModifica: DateAsString;
    readonly formattedDataAvvenimento: string;
    readonly numeroScommesse: number;
    readonly stato: number;
    readonly scommessaKeyDataList: it.sisal.palinsestosport.model.entity.palinsesti.ScommessaKeyData[];
    readonly livescore: it.sisal.infolive.model.Livescore;
    readonly externalProviderInfoList: it.sisal.palinsestosport.model.entity.palinsesti.ExternalProviderInfo[];
    readonly categoria: number;
    readonly preAlertPromozionaliRedax: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliRedax;
    readonly postAlertPromozionaliRedax: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliRedax;
    readonly skipRefreshStreaming: boolean;
    readonly firstScommessa: it.sisal.palinsestosport.model.entity.palinsesti.ScommessaKeyData;
    readonly firstScommessaKeyDataAntepost: it.sisal.palinsestosport.model.entity.palinsesti.ScommessaKeyData;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface AvvenimentoKeyData extends it.sisal.palinsestosport.model.entity.palinsesti.KeyData {
    readonly codiceDisciplina: number;
    readonly codiceManifestazione: number;
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface BetradarCorrelationData {
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
    readonly betradarId: number;
    readonly dataAvvenimento: DateAsString;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface CalendarioLiveContainer {
    readonly calendarioLiveAvvenimentoContainerList: it.sisal.palinsestosport.model.entity.container.CalendarioLiveAvvenimentoContainer[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface ClasseEsito extends it.sisal.palinsestosport.model.entity.palinsesti.ClasseEsitoKeyData {
    readonly preAlertPromozionaliRedax: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliRedax;
    readonly postAlertPromozionaliRedax: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliRedax;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface ClasseEsitoKeyData extends it.sisal.palinsestosport.model.entity.palinsesti.KeyData {
    readonly codiceDisciplina: number;
    readonly codiceScommessa: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface Cluster extends it.sisal.palinsestosport.model.entity.palinsesti.ClusterKeyData {
    readonly codiceCluster: number;
    readonly clusterDefault: boolean;
    readonly metaScommessaTemplateList: it.sisal.palinsestosport.model.entity.palinsesti.MetaScommessaTemplate[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface ClusterKeyData extends it.sisal.palinsestosport.model.entity.palinsesti.KeyData {
    readonly codiceDisciplina: number;
    readonly codiceManifestazione: number;
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface ClusterMenu {
    readonly type: number;
    readonly filter: number;
    readonly clusterList: it.sisal.palinsestosport.model.entity.palinsesti.Cluster[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface ColumnGroup {
    readonly columns: it.sisal.palinsestosport.model.entity.palinsesti.InfoTemplateColumn[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface DeviceCategory {
    readonly name: string;
    readonly geoRestrictions: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface Disciplina extends it.sisal.palinsestosport.model.entity.palinsesti.DisciplinaKeyData {
    readonly sigla: string;
    readonly urlIcona: string;
    readonly palinsestoGiornaliero: boolean;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface DisciplinaKeyData extends it.sisal.palinsestosport.model.entity.palinsesti.KeyData {
    readonly codiceDisciplina: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface DisciplinaSpeciale extends it.sisal.palinsestosport.model.entity.palinsesti.Disciplina {
    readonly flagLinkSottotitoloVisible: boolean;
    readonly nomeLinkSottotitolo: string;
    readonly urlLinkSottotitolo: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface Esito {
    readonly codiceEsito: number;
    readonly descrizione: string;
    readonly quota: number;
    readonly stato: number;
    readonly aggregato: boolean;
    readonly codiceScommessaAAMS: number;
    readonly codiceEsitoAAMS: number;
    readonly legaturaAAMS: number;
    readonly legaturaMin: number;
    readonly legaturaMax: number;
    readonly multipla: number;
    readonly blackListMin: number;
    readonly blackListMax: number;
    readonly descrizioneScommessa: string;
    readonly fissa: boolean;
    readonly siglaDisciplina: string;
    readonly siglaManifestazione: string;
    readonly descrizioneManifestazione: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface ExternalProviderInfo {
    readonly idProviderLive: number;
    readonly idAvvProviderLive: number;
    readonly streamingAvailable: boolean;
    readonly fixtureUuidPerform: string;
    readonly streamPerform: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface InfoAggiuntiva extends it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntivaKeyData {
    readonly esitoList: it.sisal.palinsestosport.model.entity.palinsesti.Esito[];
    readonly stato: number;
    readonly dataUltimaModifica: DateAsString;
    readonly offertaLive: boolean;
    readonly legaturaAAMS: number;
    readonly legaturaMin: number;
    readonly legaturaMax: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface InfoAggiuntivaKeyData extends it.sisal.palinsestosport.model.entity.palinsesti.KeyData {
    readonly codiceDisciplina: number;
    readonly codiceManifestazione: number;
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
    readonly codiceScommessa: number;
    readonly codiceClasseEsito: number;
    readonly idInfoAggiuntiva: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface InfoTemplate {
    readonly sections: it.sisal.palinsestosport.model.entity.palinsesti.Section[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface InfoTemplateColumn {
    readonly type: number;
    readonly header: string;
    readonly codiceScommessaList: number[];
    readonly idInfoAggiuntiva: number;
    readonly codiceEsito: number;
    readonly defaultIdInfoAggiuntiva: number;
    readonly defaultDescrizioneEsito: string;
    readonly tooltipLabel: string;
    readonly regexpDescrizione: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface KeyData {
    readonly posizione: number;
    readonly descrizione: string;
    readonly data: DateAsString;
    readonly key: string;
    readonly filtro: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface LiveStreaming {
    readonly idLiveStreaming: number;
    readonly urlDesktop: string;
    readonly urlMobile: string;
    readonly descrizioneDisciplina: string;
    readonly descrizioneManifestazione: string;
    readonly urlStreamService: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface Manifestazione extends it.sisal.palinsestosport.model.entity.palinsesti.ManifestazioneKeyData {
    readonly sigla: string;
    readonly urlIcona: string;
    readonly descrizioneAAMS: string;
    readonly streamingImg: boolean;
    readonly preAlertPromozionaliRedax: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliRedax;
    readonly postAlertPromozionaliRedax: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliRedax;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface ManifestazioneKeyData extends it.sisal.palinsestosport.model.entity.palinsesti.KeyData {
    readonly codiceDisciplina: number;
    readonly codiceManifestazione: number;
    readonly topManifestazione: boolean;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface ManifestazioneSpeciale extends it.sisal.palinsestosport.model.entity.palinsesti.Manifestazione {
    readonly flagVoceMenuVisible: boolean;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface MatchList {
    readonly matchId: string;
    readonly startTime: string;
    readonly homeTeam: string;
    readonly awayTeam: string;
    readonly competition: string;
    readonly sport: string;
    readonly isLive: string;
    readonly deviceCategories: it.sisal.palinsestosport.model.entity.palinsesti.DeviceCategory[];
    readonly bookmakerMatchId: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface MetaScommessaTemplate {
    readonly codiceDisciplina: number;
    readonly idMetaScommessaTemplate: number;
    readonly idMetaScommessaTemplateInternal: number;
    readonly descrizione: string;
    readonly posizione: number;
    readonly live: boolean;
    readonly scommessaTemplate: boolean;
    readonly infoTemplate: it.sisal.palinsestosport.model.entity.palinsesti.InfoTemplate;
    readonly codiceScommessaList: number[];
    readonly sortByDescrizione: boolean;
    readonly preAlertPromozionaliRedax: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliRedax;
    readonly postAlertPromozionaliRedax: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliRedax;
    readonly infoAggiuntivaAggregator: boolean;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface Scommessa extends it.sisal.palinsestosport.model.entity.palinsesti.ScommessaKeyData {
    readonly stato: number;
    readonly dataUltimaModifica: DateAsString;
    readonly multipla: number;
    readonly listaEsitiDinamica: boolean;
    readonly modalitaVisualizzazione: number;
    readonly tipologiaVisualizzazione: number;
    readonly blackListMin: number;
    readonly blackListMax: number;
    readonly aggregata: boolean;
    readonly tipoInfoAggiuntiva: number;
    readonly infoAggiuntivaKeyDataList: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntivaKeyData[];
    readonly preAlertPromozionaliRedaxClasseEsito: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliRedax;
    readonly postAlertPromozionaliRedaxClasseEsito: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliRedax;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface ScommessaKeyData extends it.sisal.palinsestosport.model.entity.palinsesti.KeyData {
    readonly codiceDisciplina: number;
    readonly codiceManifestazione: number;
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
    readonly codiceScommessa: number;
    readonly codiceClasseEsito: number;
    readonly descrizioneAvvenimento: string;
    readonly live: boolean;
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface Section {
    readonly header: string;
    readonly columnGroups: it.sisal.palinsestosport.model.entity.palinsesti.ColumnGroup[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface StreamingMatch {
    readonly matchList: it.sisal.palinsestosport.model.entity.palinsesti.MatchList[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming {
  export interface Streaming {
    readonly listMatch: any;
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming {
  export interface StreamingBetradar extends it.sisal.palinsestosport.model.entity.streaming.Streaming {
    readonly apiBaseUrl: string;
    readonly clientId: string;
    readonly resourceMobile: string;
    readonly resourceDes: string;
    readonly resourceMatch: string;
    readonly listMatch: it.sisal.palinsestosport.model.entity.palinsesti.StreamingMatch;
    readonly apikey: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming {
  export interface StreamingImg extends it.sisal.palinsestosport.model.entity.streaming.Streaming {
    readonly listMatch: it.sisal.palinsestosport.model.entity.streaming.img.Event[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming {
  export interface StreamingPerform extends it.sisal.palinsestosport.model.entity.streaming.Streaming {
    readonly streamingServiceName: string;
    readonly betradarSupplierName: string;
    readonly livestreamAssetType: string;
    readonly mccUrl: string;
    readonly mccParams: string;
    readonly getTokenUrl: string;
    readonly getTokenParams: string;
    readonly listMatch: {
      [index: string]: it.sisal.palinsestosport.model.entity.streaming.perform.PerformInfoBean;
    };
    readonly apikey: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming.img {
  export interface Event {
    readonly id: number;
    readonly title: string;
    readonly startDate: DateAsString;
    readonly endDate: DateAsString;
    readonly tournament: it.sisal.palinsestosport.model.entity.streaming.img.Tournament;
    readonly updatedAt: DateAsString;
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming.img {
  export interface Property {
    readonly id: number;
    readonly name: string;
    readonly sport: it.sisal.palinsestosport.model.entity.streaming.img.Sport;
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming.img {
  export interface Sport {
    readonly id: number;
    readonly name: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming.img {
  export interface Stream {
    readonly eventId: number;
    readonly rtmpUrl: string;
    readonly hlsUrl: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming.img {
  export interface Tournament {
    readonly id: number;
    readonly name: string;
    readonly property: it.sisal.palinsestosport.model.entity.streaming.img.Property;
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming.perform {
  export interface PerformInfoBean {
    readonly fixtureUuid: string;
    readonly stream: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.streaming.perform {
  export interface PerformLivestreamDataBean
    extends it.sisal.palinsestosport.model.entity.streaming.perform.PerformInfoBean {
    readonly outlet: string;
    readonly user: string;
    readonly key: string;
  }
}

export namespace it.sisal.mtpsynchronizer {
  export interface Esiti {
    readonly esito: it.sisal.mtpsynchronizer.Esito[];
  }
}

export namespace it.sisal.mtpsynchronizer {
  export interface Esito {
    readonly descrizione: string;
    readonly id: number;
    readonly stato: number;
    readonly quota: number;
    readonly probwin: number;
  }
}

export namespace it.sisal.mtpsynchronizer {
  export interface Classe {
    readonly descrizione: string;
    readonly esiti: it.sisal.mtpsynchronizer.Esiti;
    readonly id: number;
    readonly infoagg: number;
    readonly descrinfoagg: string;
    readonly tipoinfoagg: number;
    readonly stato: number;
    readonly live: number;
    readonly blacklistmin: number;
    readonly blacklistmax: number;
    readonly multipla: number;
    readonly legmin: number;
    readonly legmax: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator {
  export interface InfoAggiuntivaAggregatorGroup {
    readonly codiceInfoAggiuntivaAggregatorGroup: number;
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
    readonly descrizione: string;
    readonly urlIcona: string;
    readonly home: boolean;
  }
}

export namespace it.sisal.commons.model.sport {
  export interface Pronostico {
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
    readonly codiceScommessa: number;
    readonly codiceEsito: number;
    readonly codiceEsitoAAMS: number;
    readonly codiceDisciplina: number;
    readonly codiceClasseEsito: number;
    readonly codiceClasseEsitoAAMS: number;
    readonly codiceInfoAggiuntiva: number;
    readonly multipla: number;
    readonly handicap: number;
    readonly formattedHandicap: string;
    readonly handicapVariato: boolean;
    readonly quota: number;
    readonly quotaVariata: boolean;
    readonly fissa: boolean;
    readonly legameMinimo: number;
    readonly legameMassimo: number;
    readonly legameMultipla: number;
    readonly blackListMin: number;
    readonly blackListMax: number;
    readonly descrizioneManifestazione: string;
    readonly descrizioneAvvenimento: string;
    readonly descrizioneScommessa: string;
    readonly descrizioneEsito: string;
    readonly risultato: string;
    readonly live: boolean;
    readonly dataAvvenimento: DateAsString;
    readonly formattedDataAvvenimento: string;
    readonly providerId: number;
    readonly tieOdds: number;
    readonly tieOddsFormatted: string;
    readonly tieResult: number;
    readonly stato: number;
    readonly id: number;
    readonly factoryId: number;
    readonly avvenimentoKey: string;
    readonly scommessaKey: string;
    readonly pronosticoKey: string;
  }
}

export namespace it.sisal.palinsestosport.model.entity.infoaggiuntivaaggregator {
  export interface InfoAggiuntivaAggregator {
    readonly idInfoAggiuntiva: number;
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
    readonly codiceInfoAggiuntivaAggregatorGroup: number;
    readonly descrizione: string;
    readonly posizione: number;
    readonly numeroScommesse: number;
  }
}

export namespace it.sisal.infolive.model {
  export interface Livescore {
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
    readonly statusCode: number;
    readonly statusDescription: string;
    readonly statusShortDescription: string;
    readonly scoreList: it.sisal.infolive.model.Score[];
    readonly cardList: it.sisal.infolive.model.Card[];
    readonly server: it.sisal.infolive.model.Side;
    readonly providerId: string;
    readonly playTimeMs: number;
    readonly normalTimeHalfDurationMs: number;
    readonly extraTimeHalfDurationMs: number;
    readonly showTimer: boolean;
    readonly stopTimer: boolean;
    readonly addPlayTimeMs: number;
    readonly remainingTimePeriodMs: number;
    readonly factoryId: number;
    readonly id: number;
  }
}

export namespace it.sisal.redax.external.model.entity.palinsesto {
  export interface AlertPromozionaliRedax {
    readonly codiceAlertPromozionale: number;
    readonly nome: string;
    readonly idTipologia: number;
    readonly idRiferimento: number;
    readonly testo: string;
    readonly urlCalltoAction: string;
    readonly testoCallToAction: string;
    readonly priorita: number;
    readonly tipoVisualizzazione: number;
    readonly dataScadenza: DateAsString;
    readonly active: boolean;
    readonly alertOwner: number;
    readonly dataApertura: DateAsString;
    readonly urlIcona: string;
    readonly titoloCallout: string;
    readonly alertPromozionaliPalinsestoDataList: it.sisal.redax.external.model.entity.palinsesto.AlertPromozionaliPalinsestoData[];
    readonly key: string;
  }
}

export namespace it.sisal.infolive.model {
  export interface Score {
    readonly type: string;
    readonly team1: number;
    readonly team2: number;
    readonly factoryId: number;
    readonly id: number;
  }
}

export namespace it.sisal.infolive.model {
  export interface Card {
    readonly type: it.sisal.livescore.ScoreType;
    readonly playerTeam: number;
  }
}

export namespace it.sisal.redax.external.model.entity.palinsesto {
  export interface AlertPromozionaliPalinsestoData {
    readonly codicePalinsesto: number;
    readonly codiceAvvenimento: number;
    readonly codiceDisciplina: number;
    readonly codiceManifestazione: number;
    readonly codiceClasseEsito: number;
    readonly codiceEsito: number;
    readonly codiceInfoAggiuntiva: number;
    readonly key: string;
  }
}

export type DateAsString = string;

export namespace it.sisal.infolive.model {
  export type Side =
    | typeof configuration.SET_BASED_LIVESCORE_FIRST_SERVER
    | typeof configuration.SET_BASED_LIVESCORE_SECOND_SERVER;
}

export namespace it.sisal.livescore {
  export type ScoreType =
    | typeof configuration.LIVESCORE_CARD_TYPE.PLAY
    | typeof configuration.LIVESCORE_CARD_TYPE.YELLOW_CARD
    | typeof configuration.LIVESCORE_CARD_TYPE.SECOND_YELLOW_CARD
    | typeof configuration.LIVESCORE_CARD_TYPE.RED_CARD;
}

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface TopMatchContainer {
    readonly disciplinaList: it.sisal.palinsestosport.model.entity.palinsesti.Disciplina[];
    readonly avvenimentoFeList: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe[];
    readonly scommessaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    };
    readonly infoAggiuntivaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva;
    };
    readonly metaScommessaTemplateList: it.sisal.palinsestosport.model.entity.palinsesti.MetaScommessaTemplate[];
  }
}
