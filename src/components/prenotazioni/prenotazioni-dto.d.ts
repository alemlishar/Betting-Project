import { Livescore } from "src/components/live/live-api";
import { DateAsString } from "src/components/prematch/prematch-dto";

export namespace it.sisal.palinsestosport.model.entity.container {
  export interface BookingInfosContainer {
    readonly bookingInfos: it.sisal.palinsestosport.model.entity.prenotazioni.Booking[];
  }
}

export namespace it.sisal.palinsestosport.model.entity.prenotazioni {
  export interface Booking {
    readonly creationTime: DateAsString;
    readonly expirationTime: DateAsString;
    readonly stakeAmount: number;
    readonly systemTicketsCount: number;
    readonly ticketsCount: number;
    readonly status: string;
    readonly id: number;
    readonly nickName: string;
    readonly attributes: number[];
    readonly openTicketsStakeAmount: number;
    readonly openSystemTicketsCount: number;
    readonly openTicketsCount: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.prenotazioni {
  export interface Prenotazione {
    readonly attributes: null;
    readonly status: string;
    readonly mainNickname: string;
    readonly tickets: Ticket[];
    readonly user: null;
    readonly bookingExpirationTimeOut: null;
  }
}
export namespace it.sisal.palinsestosport.model.entity.prenotazioni {
  export interface Ticket {
    readonly bonus: number;
    readonly index: number;
    readonly minimumPaymentAmount: number;
    readonly paymentPrice: number;
    readonly results: TicketResult[];
    readonly sellingPrice: number;
    readonly systemClasses: SystemClass[];
    readonly status: "Sent" | "Inserted";
  }
}

export namespace it.sisal.palinsestosport.model.entity.prenotazioni {
  export interface SystemClass {
    readonly key: number;
    readonly value: Value;
  }
}

export namespace it.sisal.palinsestosport.model.entity.prenotazioni {
  export interface Value {
    readonly bettingPrice: number;
    readonly ticketsNumber: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.prenotazioni {
  export interface TicketResult {
    readonly avvenimentoKey: string;
    readonly blackListMax: number;
    readonly blackListMin: number;
    readonly codiceAvvenimento: number;
    readonly codiceClasseEsito: number;
    readonly codiceClasseEsitoAAMS: number;
    readonly codiceDisciplina: number;
    readonly codiceEsito: number;
    readonly codiceEsitoAAMS: number;
    readonly codiceInfoAggiuntiva: number;
    readonly codiceManifestazione: number;
    readonly codicePalinsesto: number;
    readonly codiceScommessa: number;
    readonly dataAvvenimento: string;
    readonly descrizioneAvvenimento: string;
    readonly descrizioneEsito: string;
    readonly descrizioneInfoAggiuntiva: string;
    readonly descrizioneManifestazione: string;
    readonly descrizioneScommessa: string;
    readonly factoryId: number;
    readonly fissa: boolean;
    readonly formattedDataAvvenimento: string;
    readonly formattedHandicap: string;
    readonly handicap: number;
    readonly handicapVariato: boolean;
    readonly iconaDisciplina: string;
    readonly iconaManifestazione: string;
    readonly id: number;
    readonly index: number;
    readonly legameMassimo: number;
    readonly legameMinimo: number;
    readonly legameMultipla: number;
    readonly live: boolean;
    readonly livescore: Livescosre;
    readonly multipla: number;
    readonly pronosticoKey: string;
    readonly providerId: number;
    readonly quota: number;
    readonly quotaOld: number;
    readonly quotaVariata: boolean;
    readonly risultato: any; // Trovare il tipo
    readonly scommessaKey: string;
    readonly siglaDisciplina: string;
    readonly siglaManifestazione: string;
    readonly stato: number;
    readonly tieOdds: any; // Trovare il tipo
    readonly tieOddsFormatted: any; // Trovare il tipo
    readonly tieResult: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.giocatasistemistica {
  export interface SviluppoSistema {
    readonly esito: number;
    readonly sviluppoByCardinalita: SviluppoByCardinalita;
    readonly costoTotale: number;
    readonly vincitaMinimaTotale: number;
    readonly vincitaTotale: number;
    readonly numeroTotaleMultiple: number;
    readonly pronosticoList: PronosticoList[];
    readonly importoByCardinalitaList: ImportoByCardinalitaList[];
    readonly numeroAvvenimentiBase: number;
    readonly fissaMap: FissaMap;
    readonly numeroFisse: number;
    readonly numeroEventiFissi: number;
    readonly importoByCardinalitaMap: Map;
    readonly numeroPronosticiPerAvvenimentoMap: Map;
  }
}

export namespace it.sisal.palinsestosport.model.entity.giocatasistemistica {
  export interface FissaMap {
    readonly chiaveAvvenimento: boolean;
  }
}
export namespace it.sisal.palinsestosport.model.entity.giocatasistemistica {
  export interface ImportoByCardinalitaList {
    readonly cardinalita: number;
    readonly importo: number;
  }
}

export namespace it.sisal.palinsestosport.model.entity.giocatasistemistica {
  export interface Map {}
}

export namespace it.sisal.palinsestosport.model.entity.giocatasistemistica {
  export interface PronosticoList {
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
    readonly live: boolean;
    readonly liveDelay: number;
    readonly dataAvvenimento: string;
    readonly formattedDataAvvenimento: string;
    readonly providerId: number;
    readonly tieResult: number;
    readonly stato: number;
  }
}
export namespace it.sisal.palinsestosport.model.entity.giocatasistemistica {
  export interface SviluppoByCardinalita {
    readonly cardinalita: {
      [index: string]: Sviluppo;
    };
  }
}

export namespace it.sisal.palinsestosport.model.entity.giocatasistemistica {
  export interface Sviluppo {
    readonly integrale: boolean;
    readonly cardinalita: number;
    readonly importo: number;
    readonly importoTotale: number;
    readonly vincitaMinima: number;
    readonly vincitaTotaleSistemaIntegrale: number;
    readonly vincitaTotale: number;
    readonly vincita: number;
    readonly esito: number;
    readonly numeroSviluppi: number;
    readonly bonusApplicato: boolean;
    readonly vincitaMassimaCombinazione: number;
    readonly vincitaMassima: number;
    readonly importoMassimoCombinazione: number;
    readonly quotaMassima: number;
    readonly quotaMinima: number;
  }
}
