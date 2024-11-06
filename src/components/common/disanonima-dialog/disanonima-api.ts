import { AddressHintDTO, CitiesAPIDTO, ConfigurationPEPResponseDTO } from "./disanonima-dto";
import { CustomerInfoDTO, ProvinceAPIDTO, SagInfoDTO } from "src/components/common/disanonima-dialog/disanonima-dto";
import { fetchJSON, fetchJSONplain } from "src/helpers/fetch-json";

export async function getCustomerInfo(fiscalCode: string): Promise<CustomerInfoDTO> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/sagWeb/customerInfo/${fiscalCode}`);
}

export async function getSagInfo(fiscalCode: string): Promise<SagInfoDTO> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/sagWeb/sagInfo/${fiscalCode}`);
}

export async function getAddressHint(address: string): Promise<AddressHintDTO[]> {
  return fetchJSONplain(
    `https://nominatim.openstreetmap.org/search?street=${address}&countrycodes=IT&format=json&limit=3`,
  );
}

export async function getProvinces(): Promise<ProvinceAPIDTO> {
  return fetchJSONplain(`/services/info/geo/provinces`); //${process.env.REACT_APP_ENDPOINT}
}

export async function getCitiesByProvince(province: string): Promise<CitiesAPIDTO> {
  return fetchJSONplain(`/services/info/geo/cities?province=${province}`); //${process.env.REACT_APP_ENDPOINT}
}

export async function getPPEConfiguration(): Promise<ConfigurationPEPResponseDTO> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/sagWeb/terrorismPepConfiguration`);
}
