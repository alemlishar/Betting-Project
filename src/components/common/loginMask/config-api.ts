import { fetchJSON } from "src/helpers/fetch-json";

export async function configResult(): Promise<any> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/config`);
}
