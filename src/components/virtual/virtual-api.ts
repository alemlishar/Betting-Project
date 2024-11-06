import { EventoVirtualeBase, ParamsVirtualDetails, VirtualState } from "src/components/virtual/virtual-dto";
import configuration from "src/helpers/configuration";
import { fetchJSONplain } from "src/helpers/fetch-json";

export async function getAlberaturaVirtualMenu(): Promise<Array<VirtualState>> {
  return fetchJSONplain(`/services/betting/virtual/getAlberaturaSingleEventsAndChampionships`);
}
export async function getSingleEventDetails(
  path: string,
  sogeicodPalinsesto: string,
  sogeicodevento: string,
): Promise<Array<EventoVirtualeBase>> {
  return fetchJSONplain(`/services/betting/virtual/getSingleEventDetails/${sogeicodPalinsesto}/${sogeicodevento}`);
}
export async function getSingleEventState(paramsVirtualDetails: ParamsVirtualDetails): Promise<number> {
  const { sogeicodPalinsesto, sogeicodevento } = paramsVirtualDetails;
  return fetchJSONplain(`/services/betting/virtual/getSingleEventState/${sogeicodPalinsesto}/${sogeicodevento}`);
}
export async function getChampionshipEventState(paramsVirtualDetails: ParamsVirtualDetails): Promise<number> {
  const { sogeicodPalinsesto, sogeicodevento } = paramsVirtualDetails;
  return fetchJSONplain(`/services/betting/virtual/getChampionshipEventState/${sogeicodPalinsesto}/${sogeicodevento}`);
}
export async function getVirtualEventState(virtualState: VirtualState): Promise<number> {
  const { codiceEvento, codicePalinsesto } = virtualState.detailId;
  const paramsVirtualDetails = { sogeicodPalinsesto: codicePalinsesto, sogeicodevento: codiceEvento };
  const isFootballLeague =
    configuration.CODICE_DISCIPLINA_VIRTUAL.FOOTBAL_ALL_STARS_LEAGUE === virtualState.codiceDisciplina;
  return isFootballLeague ? getChampionshipEventState(paramsVirtualDetails) : getSingleEventState(paramsVirtualDetails);
}
//REMOVE MOCK
export async function getCampionatoEventDetailsMock(): Promise<Array<EventoVirtualeBase>> {
  return fetchJSONplain(`/services/betting/virtual/getChampionshipEventDetailsMock`);
}
