import { customPronosticiValues } from "./pronostici/customPronosticiValues";
import { APIResponseType } from "../types/apiResponse.types";

export const fetchIntercept = (entity: string, fetchCall: Promise<APIResponseType<any>>) => {
  return fetchCall.then((response) => {
    // Intercept pronostici and replace with custom values
    if (entity === "esito/pronostici" && process.env.REACT_APP_INTERCEPT_PRONOSTICI === "true") {
      let pronostico = response?.result?.length > 0 ? response?.result[0].value : undefined;
      if (pronostico?.codiceEsito !== undefined && pronostico?.codiceAvvenimento !== undefined) {
        customPronosticiValues.forEach((p) => {
          if (p.codiceAvvenimento === pronostico.codiceAvvenimento && p.codiceEsito === pronostico.codiceEsito) {
            pronostico = { ...pronostico, ...p.change };
          }
        });
        return { result: [{ value: pronostico }] };
      }
    }
    return response;
  });
};
