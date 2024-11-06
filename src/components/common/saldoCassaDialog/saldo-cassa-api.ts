import { fetchPostJSONplain } from "src/helpers/fetch-json";
import { APIResponseType } from "src/types/apiResponse.types";

export function postSaldoCassa(paramsSaldoCassa: { endpoint: string; data: object }): Promise<APIResponseType<any>> {
  const dataSaldoCassa = paramsSaldoCassa.data;
  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/account/${paramsSaldoCassa.endpoint}`, dataSaldoCassa);
}
