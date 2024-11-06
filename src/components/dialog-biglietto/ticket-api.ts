import { MessagesMappingEnum } from "src/mapping/MessagesMapping";
import { TicketType } from "src/types/ticket.types";
import { ChiavePronostico } from "src/types/chiavi";
import { PronosticiParamsType } from "src/types/pronosticiParams.types";
import { fetchJSONplain, fetchPostJSON, fetchPostJSONplain } from "src/helpers/fetch-json";
import { APIResponseType } from "src/types/apiResponse.types";
import { CreaPrecompilataRequest } from "src/components/dialog-biglietto/precompilataTypes";

export type TicketByIdResponse =
  | { result: TicketType }
  | {
      error: {
        code: MessagesMappingEnum;
        message: string;
        description: string;
      };
    };
export function getBigliettoById(ticketId: string): Promise<TicketByIdResponse> | undefined {
  return fetchJSONplain(`${process.env.REACT_APP_ENDPOINT}/ticket/${ticketId}`);
}

export function getPronostici(
  predictionKeys: Array<ChiavePronostico>,
): Promise<Array<{ status: number; value: PronosticiParamsType }>> {
  return fetchPostJSON(`${process.env.REACT_APP_ENDPOINT}/esito/pronostici`, predictionKeys);
}

export function getPayment(paramsPayment: { ticketId: string; gameType: string }): Promise<APIResponseType<any>> {
  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/pay/${paramsPayment.ticketId}`, {
    gameType: paramsPayment.gameType,
  });
}

export async function createPrecompilata(precompilata: CreaPrecompilataRequest): Promise<"OK" | "KO"> {
  const data: { result: { code: number } } | { error: unknown } = await fetchPostJSONplain(
    `${process.env.REACT_APP_ENDPOINT}/booking/writeBooking`,
    precompilata,
  );
  if ("result" in data && data.result.code === 0) {
    return "OK";
  }
  return "KO";
}
export function postAnnullaBiglieto(paramsPayment: {
  ticketId: string;
  gameType: string;
}): Promise<{ result: { idTransaction: string } } | { error: unknown }> {
  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/undo/${paramsPayment.ticketId}`, paramsPayment);
}
