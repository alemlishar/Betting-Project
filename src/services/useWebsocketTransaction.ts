import {
  AttrExt,
  AttrExtSistema,
  NumAvvBase,
  PalinsestoVendita,
  SellErrorType,
  Sistemi,
} from "./../types/vendita.types";
// gestisce transazioni
/*
  SELLING
  PAYMENT
  ANNULMENT
  REFUND_VOUCHER
  EMIT_VOUCHER

*/

import { useCallback, useState } from "react";
import configuration from "src/helpers/configuration";
import { fetchPostJSONplain } from "src/helpers/fetch-json";
import { SellingVirtualMultiplaSingola } from "src/components/carrello-virtual/VirtualCart.helpers";
import {
  ErrorResponse,
  SellErrorPropertyType,
  VenditaAcceptanceAmountsChangedResponse,
  VenditaQFType,
  VenditaSportSistemisticaType,
  VenditaSuccessResponse,
  VenditaWSResponse,
} from "src/types/vendita.types";
import { MessagesMappingEnum } from "src/mapping/MessagesMapping";
import { VirtualEventType } from "src/types/carrello.types";

type TransactionState =
  | SellingTransactionState
  | SellingVirtualTransactionState
  | PaymentTransactionState
  | AnnulmentTransactionState
  | EmitVoucherTransactionState
  | PaymentVoucherTransactionState
  | SellBookingTransactionState;

type SellingTransactionState =
  | { type: "SellingTransactionState"; step: "starting"; payload: SellingRequest }
  | { type: "SellingTransactionState"; step: "started"; id: string };
type SellingVirtualTransactionState =
  | { type: "SellingTransactionState"; step: "starting"; payload: SellingVirtualRequest }
  | { type: "SellingTransactionState"; step: "started"; id: string };

export type SellingRequest =
  | { type: "ACCUMULATOR"; payload: VenditaQFType }
  | {
      type: "SYSTEM";
      payload: VenditaSportSistemisticaType;
    };

export type SellingVirtualRequest =
  | { type: "ACCUMULATOR"; payload: SellingVirtualMultiplaSingola }
  | {
      type: "SYSTEM";
      payload: undefined; //TODO
    };
function startSellingRest(
  params: SellingRequest,
): Promise<
  { result: { idTransaction: string; isSplitPlay: boolean } } | { error: { code: string; description: string } }
> {
  switch (params.type) {
    case "ACCUMULATOR": {
      return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/ticket/sell/sport/accumulator`, params.payload);
    }
    case "SYSTEM": {
      return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/ticket/sell/sport/system`, params.payload);
    }
  }
}

function startSellingVirtualRest(
  params: SellingVirtualRequest,
): Promise<
  { result: { idTransaction: string; isSplitPlay: boolean } } | { error: { code: string; description: string } }
> {
  switch (params.type) {
    case "ACCUMULATOR": {
      return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/ticket/sell/virtual/accumulator`, params.payload); //TODO
    }
    case "SYSTEM": {
      return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/ticket/sell/virtual/system`, params.payload); //TODO
    }
  }
}

type PaymentTransactionState =
  | { type: "PaymentTransactionState"; step: "starting"; payload: PaymentTicketRequest }
  | { type: "PaymentTransactionState"; step: "started"; id: string };
export type PaymentTicketRequest = { ticketId: string; gameType: "SPORT" | "VIRTUAL" };
function startPaymentRest(
  params: PaymentTicketRequest,
): Promise<{ result: { idTransaction: string } } | { error: ErrorResponse }> {
  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/pay/${params.ticketId}`, {
    gameType: params.gameType,
  });
}

type AnnulmentTransactionState =
  | { type: "AnnulmentTransactionState"; step: "starting"; payload: AnnulmentRequest }
  | { type: "AnnulmentTransactionState"; step: "started"; id: string }; // payload probabilemnte non serve
export type AnnulmentRequest = { ticketId: string; gameType: "SPORT" | "VIRTUAL" };
function startAnnulmentRest(
  params: AnnulmentRequest,
): Promise<{ result: { idTransaction: string } } | { error: unknown }> {
  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/undo/${params.ticketId}`, params);
}

type EmitVoucherTransactionState =
  | { type: "EmitVoucherTransactionState"; step: "starting"; payload: EmitVoucherRequest }
  | { type: "EmitVoucherTransactionState"; step: "started"; id: string };

export type EmitVoucherRequest = { value: string };
function startEmitVoucherRest(
  params: EmitVoucherRequest,
): Promise<{ result: { idTransaction: string } } | { error: unknown }> {
  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/vouchers/emit`, params);
}

type PaymentVoucherTransactionState =
  | {
      type: "RefundVoucherTransactionState";
      step: "starting";
      payload: RefundVoucherRequest;
    }
  | { type: "RefundVoucherTransactionState"; step: "started"; id: string };
export type RefundVoucherRequest = {
  voucherId: string;
  cashBalance: number;
};
function startPaymentVoucher(
  params: RefundVoucherRequest,
): Promise<{ result: { idTransaction: string } } | { error: unknown }> {
  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/vouchers/refund`, params);
}

type SellBookingTransactionState =
  | { type: "SellBookingTransactionState"; step: "starting"; payload: SellBookingRequest }
  | { type: "SellBookingTransactionState"; step: "started"; id: string }
  | { type: "SellBookingTransactionState"; step: "under_acceptance"; id: string };

export type PrenotazioneAccumulatorPayload = {
  ticket: {
    nickname: string;
    ticketId: number;
    ticketType: string;
    allTicketsSent: boolean;
    prezzo: number;
    maxPag: string;
    scommesse: PalinsestoVendita[];
    attrExt: AttrExt;
    conto: string;
    force: boolean;
  };
};
export type PrenotazioneSystemPayload = {
  ticket: {
    nickname: string;
    ticketId: number;
    ticketType: string;
    allTicketsSent: boolean;
    prezzo: number;
    sistemi: Sistemi[];
    attrExt: AttrExtSistema;
    numAvvBase: NumAvvBase[];
    conto: string;
    force: boolean;
  };
};
export type SellBookingRequest = PrenotazioneAccumulatorPayload | PrenotazioneSystemPayload;

function startSellBookingRest(
  params: SellBookingRequest,
): Promise<
  { result: { idTransaction: string; isSplitPlay: boolean } } | { error: { code: string; description: string } }
> {
  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/booking/sellBooking`, params);
}

let websocket_: WebSocket | null = null;
// at the start of frontend try to connect websocket until succedes
function connectWebsocket() {
  const ws = new WebSocket(`ws://${window.location.host}/transactions`);
  ws.onopen = () => {
    ws.onerror = () => alert("websocket disconnessa"); // TODO
    websocket_ = ws;
  };
  ws.onerror = () => connectWebsocket();
}
connectWebsocket();

export function useWebsocketTransaction({ onTransactionSystemError }: { onTransactionSystemError(): void }) {
  const [currentTransactionState, setCurrentTransactionState] = useState<TransactionState | null>(null);

  /**
   *
   * SELLING
   *
   */

  const startSellingTransaction = useCallback(
    async (
      params: SellingRequest,
      {
        onGenericError,
        onSuccess,
        onAcceptanceAmountsChanged,
        onUnderAcceptanceRejected,
        onUnderAcceptanceTimeout,
        onOddsChanged,
        onSpecificError,
        onUnderAcceptance,
        onStart,
        onStartError,
      }: StartSellingTransactionCallbacks,
    ) => {
      let websocket: WebSocket;
      if (websocket_) {
        websocket = websocket_;
      } else {
        alert("websocket non connessa");
        return;
      }
      if (currentTransactionState !== null) {
        alert("un altra transazione e ancora in corso");
        return;
      }
      setCurrentTransactionState({ type: "SellingTransactionState", step: "starting", payload: params });
      try {
        const response = await startSellingRest(params);
        if ("error" in response) {
          onStartError(response.error);
          setCurrentTransactionState(null);
          onTransactionSystemError();
          console.error(response);
          return;
        }
        onStart(response.result);
        setCurrentTransactionState((currentTransactionState) => {
          return {
            type: "SellingTransactionState",
            step: "started",
            id: response.result.idTransaction,
          };
        });

        websocket.addEventListener("message", function onMessage(message: MessageEvent<string>) {
          // NON RIASSEGNARE!!!
          let data: VenditaWSResponse;
          try {
            data = JSON.parse(message.data);
          } catch (error) {
            setCurrentTransactionState(null);
            onTransactionSystemError();
            console.error(error);
            websocket.removeEventListener("message", onMessage);
            return;
          }
          if (response.result.idTransaction === data.idTransactionBeFe) {
            switch (data.status) {
              case "SUCCESS": {
                setCurrentTransactionState(null);
                onSuccess(data.response);
                websocket.removeEventListener("message", onMessage);
                break;
              }
              case "ACCEPTANCE_AMOUNTS_CHANGED": {
                setCurrentTransactionState(null);
                onAcceptanceAmountsChanged(data.response);
                websocket.removeEventListener("message", onMessage);
                break;
              }
              case "ERROR": {
                const properties = data.response.error.properties;
                if (properties && properties.length > 0) {
                  const errorCodeObj = properties.find((property) => {
                    return property.name === "Error Code";
                  });
                  if (errorCodeObj?.value === configuration.SELL_ERROR_CODE.ODDS_CHANGED) {
                    setCurrentTransactionState(null);
                    onOddsChanged({ errorCodeObj, properties });
                    websocket.removeEventListener("message", onMessage);
                  } else if (errorCodeObj?.value === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE) {
                    onUnderAcceptance({ properties });
                  } else {
                    setCurrentTransactionState(null);
                    onSpecificError({ errorCodeObj, properties });
                    websocket.removeEventListener("message", onMessage);
                  }
                } else if (data.response.error.code === configuration.SELL_ERROR_CODE.GENERIC_ERROR) {
                  setCurrentTransactionState(null);
                  onGenericError();
                  websocket.removeEventListener("message", onMessage);
                } else if (
                  data.response.error.code === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_REJECETED &&
                  data.response.error.message === configuration.ACCEPTANCE_STATUS.REJECTED
                ) {
                  setCurrentTransactionState(null);
                  onUnderAcceptanceRejected();
                  websocket.removeEventListener("message", onMessage);
                } else if (
                  data.response.error.code === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_TIMEOUT &&
                  data.response.error.message === configuration.ACCEPTANCE_STATUS.TIMEOUT
                ) {
                  setCurrentTransactionState(null);
                  onUnderAcceptanceTimeout();
                  websocket.removeEventListener("message", onMessage);
                }
                break;
              }
            }
          } else {
            setCurrentTransactionState(null);
            onTransactionSystemError();
            console.error({ response, data, hint: "id transazione non corrisponde" });
            websocket.removeEventListener("message", onMessage);
            return;
          }
        });
      } catch (error) {
        setCurrentTransactionState(null);
        onTransactionSystemError();
        return;
      }
    },
    [currentTransactionState, onTransactionSystemError],
  );

  /**
   *
   * SELLING VIRTUAL
   *
   */

  const startSellingVirtualTransaction = useCallback(
    async (
      params: SellingVirtualRequest,
      { onGenericError, onSuccess, onSpecificError, onStart, onStartError }: StartSellingVirtualTransactionCallbacks,
      updateVirtualCart: (selectedEvents: Array<VirtualEventType>) => void,
    ) => {
      let websocket: WebSocket;
      if (websocket_) {
        websocket = websocket_;
      } else {
        alert("websocket non connessa");
        return;
      }
      if (currentTransactionState !== null) {
        alert("un altra transazione e ancora in corso");
        return;
      }
      setCurrentTransactionState({ type: "SellingTransactionState", step: "starting", payload: params });
      try {
        const response = await startSellingVirtualRest(params);
        if ("error" in response) {
          onStartError(response.error);
          setCurrentTransactionState(null);
          onTransactionSystemError();
          console.error(response);
          return;
        } else if ("result" in response) {
          //Giocata frazionata
          if (response.result.isSplitPlay === true) {
            onStart(response.result);
          }
          setCurrentTransactionState(() => {
            return {
              type: "SellingTransactionState",
              step: "started",
              id: response.result.idTransaction,
            };
          });

          websocket.addEventListener("message", function onMessage(message: MessageEvent<string>) {
            // NON RIASSEGNARE!!!
            let data: VenditaWSResponse;
            try {
              data = JSON.parse(message.data);
            } catch (error) {
              setCurrentTransactionState(null);
              onTransactionSystemError();
              console.error(error);
              websocket.removeEventListener("message", onMessage);
              return;
            }
            if (response.result.idTransaction === data.idTransactionBeFe) {
              switch (data.status) {
                case "SUCCESS": {
                  setCurrentTransactionState(null);
                  onSuccess(params.payload ? params.payload.prezzo : 2, data.response); //TODO con il sistema eliminare operatore ternario
                  updateVirtualCart([]);
                  websocket.removeEventListener("message", onMessage);
                  break;
                }
                case "ERROR": {
                  const properties = data.response.error.properties;
                  if (properties && properties.length > 0) {
                    const errorCodeObj = properties.find((property) => {
                      return property.name === "Error Code";
                    });

                    setCurrentTransactionState(null);
                    onSpecificError({ errorCodeObj, properties });
                    websocket.removeEventListener("message", onMessage);
                  } else if (data.response.error.code === configuration.SELL_ERROR_CODE.GENERIC_ERROR) {
                    setCurrentTransactionState(null);
                    onGenericError({ description: data.response.error.message });
                    websocket.removeEventListener("message", onMessage);
                  }
                  break;
                }
              }
            } else {
              setCurrentTransactionState(null);
              onTransactionSystemError();
              console.error({ response, data, hint: "id transazione non corrisponde" });
              websocket.removeEventListener("message", onMessage);
              return;
            }
          });
        }
      } catch (error) {
        setCurrentTransactionState(null);
        onTransactionSystemError();
        return;
      }
    },

    [currentTransactionState, onTransactionSystemError],
  );

  /**
   *
   * PAYMENT
   *
   */
  const startPaymentTransaction = useCallback(
    async (
      params: PaymentTicketRequest,
      {
        onSuccess,
        onError,
        onCircolaritaError,
      }: {
        onSuccess(params: { amount: number }): void;
        onCircolaritaError(): void;
        onError(params: { error: SellErrorType }): void;
      },
    ) => {
      let websocket: WebSocket;
      if (websocket_) {
        websocket = websocket_;
      } else {
        alert("websocket non connessa");
        return;
      }
      if (currentTransactionState !== null) {
        alert("un altra transazione e ancora in corso");
        return;
      }
      setCurrentTransactionState({ type: "PaymentTransactionState", step: "starting", payload: params });
      try {
        const response = await startPaymentRest(params);
        if ("error" in response) {
          setCurrentTransactionState(null);
          onTransactionSystemError();
          console.error(response);
          return;
        }
        setCurrentTransactionState((currentTransactionState) => {
          return {
            type: "PaymentTransactionState",
            step: "started",
            id: response.result.idTransaction,
          };
        });
        websocket.addEventListener("message", function onMessage(message: MessageEvent<string>) {
          // NON RIASSEGNARE!!!
          let data:
            | {
                status: "SUCCESS";
                operation: "PAYMENT";
                idTransactionBeFe: string;
                response: {
                  amount: number;
                  ticketId: string;
                };
              }
            | {
                status: "ERROR";
                operation: "PAYMENT";
                idTransactionBeFe: string;
                response: ErrorResponse;
              };
          try {
            data = JSON.parse(message.data);
          } catch (error) {
            setCurrentTransactionState(null);
            onTransactionSystemError();

            websocket.removeEventListener("message", onMessage);
            return;
          }
          if (response.result.idTransaction === data.idTransactionBeFe) {
            switch (data.status) {
              case "SUCCESS": {
                setCurrentTransactionState(null);
                onSuccess({ amount: data.response.amount });
                websocket.removeEventListener("message", onMessage);
                return;
              }
              case "ERROR": {
                setCurrentTransactionState(null);

                if (
                  data.response.error &&
                  data.response.error.properties &&
                  data.response.error.properties.length !== 0 &&
                  data.response.error.properties[0].value === MessagesMappingEnum.ERROR_CODE_20608
                ) {
                  onCircolaritaError();
                  websocket.removeEventListener("message", onMessage);
                  return;
                } else {
                  onError({ error: data.response.error });
                  websocket.removeEventListener("message", onMessage);
                  return;
                }
              }
            }
          } else {
            setCurrentTransactionState(null);
            onTransactionSystemError();
            console.error({ response, data, hint: "id transazione non corrisponde" });
            websocket.removeEventListener("message", onMessage);
            return;
          }
        });
      } catch (error) {
        setCurrentTransactionState(null);
        onTransactionSystemError();
        return;
      }
    },
    [currentTransactionState, onTransactionSystemError],
  );

  /**
   *
   * ANNULMENT
   *
   */
  const startAnnulmentTransaction = useCallback(
    async (
      params: AnnulmentRequest,
      {
        onSuccess,
        onError,
      }: {
        onSuccess(params: { amount: number }): void;
        onError(params: { ticketId: string; opener: "recupera" | "ultimo" }): void;
      },
    ) => {
      let websocket: WebSocket;
      if (websocket_) {
        websocket = websocket_;
      } else {
        alert("websocket non connessa");
        return;
      }
      if (currentTransactionState !== null) {
        alert("un altra transazione e ancora in corso");
        return;
      }
      setCurrentTransactionState({ type: "AnnulmentTransactionState", step: "starting", payload: params });
      const response = await startAnnulmentRest(params);
      if ("error" in response) {
        setCurrentTransactionState(null);
        onTransactionSystemError();

        return;
      }
      setCurrentTransactionState((currentTransactionState) => {
        return {
          type: "AnnulmentTransactionState",
          step: "started",
          id: response.result.idTransaction,
        };
      });
      websocket.addEventListener("message", function onMessage(message: MessageEvent<string>) {
        // NON RIASSEGNARE!!!
        let data:
          | {
              status: "SUCCESS";
              operation: "ANNULMENT";
              idTransactionBeFe: string;
              response: {
                amount: number;
              };
            }
          | {
              status: "ERROR";
              operation: "ANNULMENT";
              idTransactionBeFe: string;
              response: {
                error: unknown;
              };
            };
        try {
          data = JSON.parse(message.data);
        } catch (error) {
          setCurrentTransactionState(null);
          onTransactionSystemError();

          websocket.removeEventListener("message", onMessage);
          return;
        }
        if (response.result.idTransaction === data.idTransactionBeFe) {
          switch (data.status) {
            case "SUCCESS": {
              setCurrentTransactionState(null);
              onSuccess({ amount: data.response.amount });
              websocket.removeEventListener("message", onMessage);
              return;
            }
            case "ERROR": {
              setCurrentTransactionState(null);
              onError({ ticketId: params.ticketId, opener: "recupera" /* TODO controllare se influisce */ });
              websocket.removeEventListener("message", onMessage);
              return;
            }
          }
        } else {
          setCurrentTransactionState(null);
          onTransactionSystemError();
          console.error({ response, data, hint: "id transazione non corrisponde" });
          websocket.removeEventListener("message", onMessage);
          return;
        }
      });
    },
    [currentTransactionState, onTransactionSystemError],
  );

  /**
   *
   * EMIT VOUCHER
   *
   */
  const startEmitVoucherTransaction = useCallback(
    async (
      params: EmitVoucherRequest,
      {
        onSuccess,
        onError,
      }: {
        onSuccess(params: { amount: number }): void;
        onError(params: {}): void;
      },
    ) => {
      let websocket: WebSocket;
      if (websocket_) {
        websocket = websocket_;
      } else {
        alert("websocket non connessa");
        return;
      }
      if (currentTransactionState !== null) {
        alert("un altra transazione e ancora in corso");
        return;
      }
      setCurrentTransactionState({ type: "EmitVoucherTransactionState", step: "starting", payload: params });
      try {
        const response = await startEmitVoucherRest(params);
        if ("error" in response) {
          setCurrentTransactionState(null);
          onTransactionSystemError();
          console.error(response);
          return;
        }
        websocket.addEventListener("message", function onMessage(message: MessageEvent<string>) {
          // NON RIASSEGNARE!!!
          let data:
            | {
                status: "SUCCESS";
                operation: "EMIT_VOUCHER";
                idTransactionBeFe: string;
                response: {
                  amount: number;
                  voucherId: string;
                };
              }
            | {
                status: "ERROR";
                operation: "EMIT_VOUCHER";
                idTransactionBeFe: string;
                response: {
                  error: unknown;
                };
              };
          try {
            data = JSON.parse(message.data);
          } catch (error) {
            setCurrentTransactionState(null);
            onTransactionSystemError();
            console.error(error);
            websocket.removeEventListener("message", onMessage);
            return;
          }
          if (response.result.idTransaction === data.idTransactionBeFe) {
            switch (data.status) {
              case "SUCCESS": {
                setCurrentTransactionState(null);
                onSuccess({ amount: data.response.amount });
                websocket.removeEventListener("message", onMessage);
                return;
              }
              case "ERROR": {
                setCurrentTransactionState(null);
                onError({}); // TODO passare info
                websocket.removeEventListener("message", onMessage);
                return;
              }
            }
          } else {
            setCurrentTransactionState(null);
            onTransactionSystemError();
            console.error({ response, data, hint: "id transazione non corrisponde" });
            websocket.removeEventListener("message", onMessage);
            return;
          }
        });
        setCurrentTransactionState((currentTransactionState) => {
          return {
            type: "EmitVoucherTransactionState",
            step: "started",
            id: response.result.idTransaction,
          };
        });
      } catch (error) {
        setCurrentTransactionState(null);
        onTransactionSystemError();
        return;
      }
    },
    [currentTransactionState, onTransactionSystemError],
  );

  /**
   *
   * REFUND VOUCHER
   *
   */
  const startRefundVoucherTransaction = useCallback(
    async (
      params: RefundVoucherRequest,
      {
        onSuccess,
        onError,
      }: {
        onSuccess(params: { amount: number }): void;
        onError(params: any): void; // DEBT
      },
    ) => {
      let websocket: WebSocket;
      if (websocket_) {
        websocket = websocket_;
      } else {
        alert("websocket non connessa");
        return;
      }
      if (currentTransactionState !== null) {
        alert("un altra transazione e ancora in corso");
        return;
      }
      setCurrentTransactionState({ type: "RefundVoucherTransactionState", step: "starting", payload: params });
      try {
        const response = await startPaymentVoucher(params);
        if ("error" in response) {
          setCurrentTransactionState(null);
          onTransactionSystemError();
          console.error(response);
          return;
        }
        setCurrentTransactionState((currentTransactionState) => {
          return {
            type: "RefundVoucherTransactionState",
            step: "started",
            id: response.result.idTransaction,
          };
        });
        websocket.addEventListener("message", function onMessage(message: MessageEvent<string>) {
          // NON RIASSEGNARE!!!
          let data:
            | {
                status: "SUCCESS";
                operation: "REFUND_VOUCHER";
                idTransactionBeFe: string;
                response: {
                  amount: number;
                };
              }
            | {
                status: "ERROR";
                operation: "REFUND_VOUCHER";
                idTransactionBeFe: string;
                response: {
                  error: unknown;
                };
              };
          try {
            data = JSON.parse(message.data);
          } catch (error) {
            setCurrentTransactionState(null);
            onTransactionSystemError();
            console.error(error);
            websocket.removeEventListener("message", onMessage);
            return;
          }
          if (response.result.idTransaction === data.idTransactionBeFe) {
            switch (data.status) {
              case "SUCCESS": {
                setCurrentTransactionState(null);
                onSuccess({ amount: data.response.amount });
                websocket.removeEventListener("message", onMessage);
                return;
              }
              case "ERROR": {
                setCurrentTransactionState(null);
                onError(data);
                websocket.removeEventListener("message", onMessage);
                return;
              }
            }
          } else {
            setCurrentTransactionState(null);
            onTransactionSystemError();
            console.error({ response, data, hint: "id transazione non corrisponde" });
            websocket.removeEventListener("message", onMessage);
            return;
          }
        });
      } catch (error) {
        setCurrentTransactionState(null);
        onTransactionSystemError();
        return;
      }
    },
    [currentTransactionState, onTransactionSystemError],
  );

  /**
   *
   * SELL BOOKING
   *
   */

  const startSellBookingTransaction = useCallback(
    async (
      params: SellBookingRequest,
      {
        onGenericError,
        onSuccess,
        onSpecificError,
        onUnderAcceptance,
        onUnderAcceptanceRejected,
        onUnderAcceptanceTimeout,
        onAcceptanceAmountsChanged,
        onStart,
        onStartError,
        onError,
      }: StartSellBookingTransactionCallbacks,
    ) => {
      let websocket: WebSocket;
      if (websocket_) {
        websocket = websocket_;
      } else {
        alert("websocket non connessa");
        return;
      }
      if (currentTransactionState !== null) {
        alert("un altra transazione e ancora in corso");
        return;
      }
      setCurrentTransactionState({ type: "SellBookingTransactionState", step: "starting", payload: params });
      const response = await startSellBookingRest(params);
      if ("error" in response) {
        onStartError(response.error);
        setCurrentTransactionState(null);
        onTransactionSystemError();
        console.error(response);
        return;
      }
      onStart();
      setCurrentTransactionState((currentTransactionState) => {
        return {
          type: "SellBookingTransactionState",
          step: "started",
          id: response.result.idTransaction,
        };
      });

      websocket.addEventListener("message", function onMessage(message: MessageEvent<string>) {
        // NON RIASSEGNARE!!!
        let data: VenditaWSResponse;
        try {
          data = JSON.parse(message.data);
        } catch (error) {
          setCurrentTransactionState(null);
          onError();
          console.error(error);
          websocket.removeEventListener("message", onMessage);
          return;
        }
        if (response.result.idTransaction === data.idTransactionBeFe) {
          switch (data.status) {
            case "SUCCESS": {
              setCurrentTransactionState(null);
              onSuccess(data.response);
              websocket.removeEventListener("message", onMessage);
              break;
            }
            case "ACCEPTANCE_AMOUNTS_CHANGED": {
              setCurrentTransactionState(null);
              onAcceptanceAmountsChanged(data.response);
              websocket.removeEventListener("message", onMessage);
              break;
            }
            case "REJECTED": {
              setCurrentTransactionState(null);
              onUnderAcceptanceRejected();
              websocket.removeEventListener("message", onMessage);
              break;
            }
            case "ERROR": {
              const properties = data.response.error.properties;
              if (properties && properties.length > 0) {
                const errorCodeObj = properties.find((property) => {
                  return property.name === "Error Code";
                });

                if (errorCodeObj?.value === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE) {
                  setCurrentTransactionState((currentTransactionState) => {
                    return {
                      type: "SellBookingTransactionState",
                      step: "under_acceptance",
                      id: data.idTransactionBeFe,
                    };
                  });
                  onUnderAcceptance({ errorCodeObj, properties });
                } else {
                  setCurrentTransactionState(null);
                  onSpecificError({ errorCodeObj, properties });
                  websocket.removeEventListener("message", onMessage);
                }
              } else if (data.response.error.code === configuration.SELL_ERROR_CODE.GENERIC_ERROR) {
                setCurrentTransactionState(null);
                onGenericError(data.response.error);
                websocket.removeEventListener("message", onMessage);
              } else if (
                data.response.error.code === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_TIMEOUT &&
                data.response.error.message === configuration.ACCEPTANCE_STATUS.TIMEOUT
              ) {
                setCurrentTransactionState(null);
                onUnderAcceptanceTimeout();
                websocket.removeEventListener("message", onMessage);
              }
              break;
            }
          }
        } else {
          setCurrentTransactionState(null);
          onError();
          console.error({ response, data, hint: "id transazione non corrisponde" });
          websocket.removeEventListener("message", onMessage);
          return;
        }
      });
    },
    [currentTransactionState, onTransactionSystemError],
  );

  return {
    startEmitVoucherTransaction,
    startAnnulmentTransaction,
    startPaymentTransaction,
    startRefundVoucherTransaction,
    startSellingTransaction,
    startSellingVirtualTransaction,
    startSellBookingTransaction,
  };
}

export type StartSellingTransactionCallbacks = {
  onStart(params: { isSplitPlay: boolean }): void;
  onStartError(params: { code: string; description: string }): void;
  onGenericError(): void;
  onSuccess(response: VenditaSuccessResponse["response"]): void;
  onAcceptanceAmountsChanged(response: VenditaAcceptanceAmountsChangedResponse["response"]): void;
  onUnderAcceptanceRejected(): void;
  onUnderAcceptanceTimeout(): void;
  onUnderAcceptance(params: { properties: Array<SellErrorPropertyType> }): void;
  onOddsChanged(params: { errorCodeObj: SellErrorPropertyType; properties: Array<SellErrorPropertyType> }): void;
  onSpecificError(params: { errorCodeObj?: SellErrorPropertyType; properties: Array<SellErrorPropertyType> }): void;
};
export type StartSellingVirtualTransactionCallbacks = {
  onStart(params: { isSplitPlay: boolean }): void;
  onStartError(params: { code: string; description: string }): void;
  onGenericError(params: { description: string }): void;
  onSuccess(amount: number, response: VenditaSuccessResponse["response"]): void;
  onSpecificError(params: { errorCodeObj?: SellErrorPropertyType; properties: Array<SellErrorPropertyType> }): void;
};

export type StartSellBookingTransactionCallbacks = {
  onStart(): void;
  onStartError(params: { code: string; description: string }): void;
  onGenericError(response: SellErrorType): void;
  onSuccess(response: VenditaSuccessResponse["response"]): void;
  onAcceptanceAmountsChanged(response: VenditaAcceptanceAmountsChangedResponse["response"]): void;
  onSpecificError(params: { errorCodeObj?: SellErrorPropertyType; properties: Array<SellErrorPropertyType> }): void;
  onUnderAcceptance(params: { errorCodeObj?: SellErrorPropertyType; properties: Array<SellErrorPropertyType> }): void;
  onUnderAcceptanceRejected(): void;
  onUnderAcceptanceTimeout(): void;
  onError(): void;
};
