import { fetchPostJSONplain } from "src/helpers/fetch-json";
import { APIResponseType } from "src/types/apiResponse.types";
import { ImpostazioniScommessaType } from "src/types/carrello.types";

export function postUserPreferences(settingsToSend: ImpostazioniScommessaType): Promise<APIResponseType<any>> {
  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/user/preferences`, settingsToSend);
}
