import { BorderoResponse } from "src/components/common/bordero/borderoTypes";
import { fetchJSON } from "src/helpers/fetch-json";
export async function borderoResults(): Promise<BorderoResponse> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/account/balance?detailed=true`);
}

export async function postStampaBordero(): Promise<BorderoResponse> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/bordero/print`);
}
