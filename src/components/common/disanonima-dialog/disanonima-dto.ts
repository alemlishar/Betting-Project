export type CustomerInfoDTO = {
  readonly type: string;
  readonly status: boolean;
  readonly anagrafica: AnagraficaDTO;
  readonly retCode: number;
};

export type AnagraficaDTO = {
  readonly autorizzazioneTrattamentoDatiPersonali: string;
  readonly capDomiciliazione: string;
  readonly codZona: string;
  readonly cognome: string;
  readonly comuneDiNascita: string;
  readonly comuneDomiciliazione: string;
  readonly comuneDomicilio: string;
  readonly comuneResidenza: string;
  readonly consensoScopiPromozionali: string;
  readonly dataNascita: string;
  readonly docDataScad: string;
  readonly docRilasciatoDa: string;
  readonly email: string;
  readonly flagResDomDiversi: string;
  readonly iban: string;
  readonly idCard: string;
  readonly idCg: string;
  readonly idTransaction: string;
  readonly indirizzoDomiciliazione: string;
  readonly indirizzoDomicilio: string;
  readonly indirizzoResidenza: string;
  readonly listaPep: string;
  readonly loyalty: boolean;
  readonly nazionalita: string;
  readonly nome: string;
  readonly numDoc: string;
  readonly provinciaDomicilio: string;
  readonly provinciaNascita: string;
  readonly provinciaResidenza: string;
  readonly pv: string;
  readonly rice: string;
  readonly sesso: string;
  readonly taxCode: string;
  readonly telefono: string;
  readonly tipoDoc: string;
};

export type SagInfoDTO = {
  readonly comuneDiNascita: string;
  readonly provinciaDiNascita: string;
  readonly sesso: string;
};

export type ProvinceAPIDTO = {
  status: string;
  requestId: string;
  datetime: string;
  provinces: Province[];
};

type Province = {
  description: string;
  code: string;
  actual: boolean;
};

export type CitiesAPIDTO = {
  status: string;
  requestId: string;
  datetime: string;
  cities: City[];
};

type City = {
  id: string;
  description: string;
  fiscalCode: string;
  province: string;
  cap: string;
  actual: boolean;
};

export type AddressHintDTO = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
};
export type ConfigurationPEPItem = {
  description: string;
  id: string;
};

export type ConfigurationPEPResponseDTO = {
  type: string;
  item: ConfigurationPEPItem[];
};
