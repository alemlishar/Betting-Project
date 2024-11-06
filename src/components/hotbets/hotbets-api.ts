import { it } from "src/components/hotbets/hotbets-dto";
// import hotbets from "src/components/hotbets/hotbets.json";
import { fetchJSON } from "src/helpers/fetch-json";

export async function getHotbets(): Promise<HotbetsContainer> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/evidenza/getHotbets`);
}

export async function getMonoquota(): Promise<Monoquota> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/evidenza/getMonoquota`);
}

export type HotbetsContainer = it.sisal.palinsestosport.model.entity.container.HotbetsContainer;
export type Monoquota = it.sisal.palinsestosport.model.entity.palinsesti.Monoquota;
