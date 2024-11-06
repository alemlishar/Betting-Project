import { it } from "src/components/prematch/prematch-dto";

export namespace it.sisal.palinsestosport.model.entity.container {
  export type HotbetsContainer = {
    readonly disciplinaList: it.sisal.palinsestosport.model.entity.palinsesti.Disciplina[];
    readonly avvenimentoFeList: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe[];
    readonly scommessaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
    };
    readonly infoAggiuntivaMap: {
      [index: string]: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva;
    };
    readonly metaScommessaTemplateList: it.sisal.palinsestosport.model.entity.palinsesti.MetaScommessaTemplate[];
  };
}

// DEBT: capire perché a MonoquotaContainer non piace stare dentro un namespace

/**
 * CAMPI OBBLIGATORI LATO REDAX:
 *  - posizione
 *  - codicePalinsesto
 *  - codiceAvvenimento
 *  - codiceInfoAggiuntiva
 *  - codiceScommessa
 *  - codiceEsito
 */
export interface MonoquotaContainer {
  readonly avvenimentoFe: it.sisal.palinsestosport.model.entity.palinsesti.AvvenimentoFe;
  readonly codiceEsito: number;
  readonly infoAggiuntiva: it.sisal.palinsestosport.model.entity.palinsesti.InfoAggiuntiva;
  readonly scommessa: it.sisal.palinsestosport.model.entity.palinsesti.Scommessa;
  readonly oldQuota: string;
  readonly hostTeamIcon: string;
  readonly guestTeamIcon: string;
  readonly descrizioneScommessaMonoquota: string;
  readonly onDemand: boolean;
  readonly descrizioneSpeciale: string;
  readonly linkUrlDesktop: string;
  readonly posizione: number;
  readonly testataPersonalizzata: string;
  readonly texturePersonalizzata: string;
}
export namespace it.sisal.palinsestosport.model.entity.palinsesti {
  export interface Monoquota {
    readonly monoquotaList: MonoquotaContainer[];
  }
}
