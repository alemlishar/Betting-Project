import React, { useState, useEffect, useMemo, useContext, useCallback } from "react";
import styled, { css } from "styled-components/macro";
import useSWR, { mutate } from "swr";
import { getBigliettoById, TicketByIdResponse } from "src/components/dialog-biglietto/ticket-api";
import { Toast } from "src/components/common/toast-message/Toast";
import { MessagesMapping, MessagesMappingEnum } from "src/mapping/MessagesMapping";
import { StyledMinimizationIcon } from "src/components/dialog-prenotazione/DialogPrenotazioneSingoloBiglietto";
import { ReactComponent as IcoClose } from "src/assets/images/icon-preno-close-black.svg";
import { ReactComponent as IcoPlus } from "src/assets/images/icon-preno-plus-black.svg";
import { TicketType } from "src/types/ticket.types";
import { DettaglioBigliettoHeader } from "src/components/dialog-biglietto/dialog-dettaglio-biglietto/dettaglio-biglietto-header/DettaglioBigliettoHeader";
import { EventsCentralBody } from "src/components/dialog-biglietto/dialog-dettaglio-biglietto/events-central-body/EventsCentralBody";
import { DettaglioBigliettoFooter } from "src/components/dialog-biglietto/dialog-dettaglio-biglietto/dettaglio-biglietto-footer/DettaglioBigliettoFooter";

import { TicketStatusEnum, TicketStatusMapping } from "src/mapping/TicketStatusMapping";
import { ReactComponent as IcoMinus } from "src/assets/images/icon-preno-minus-black.svg";
import { AlertBox } from "src/components/common/alert-box/AlertBox";
import { DialogTrovaBiglietto } from "src/components/dialog-biglietto/dialog-trova-biglietto/DialogTrovaBiglietto";
import { TmpModale } from "src/components/dialog-biglietto/tmpModale/tmpModale";
import { PronosticiParamsType } from "src/types/pronosticiParams.types";
import { chunk } from "lodash";
import { FormattedMessage } from "react-intl";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { Alert } from "src/components/common/blocking-alert/BlockingAlert";
import { AnnulmentRequest, PaymentTicketRequest } from "src/services/useWebsocketTransaction";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";
import { PiedinoState } from "src/components/carrello-common/Piedino";
import { SellErrorType } from "src/types/vendita.types";

export function useCheckBiglietto({
  lastSoldTicketId,
  pushToast,
  onSetIsSaldoCassaDialogOpen,
  keyboardNavigationContext,
}: {
  lastSoldTicketId: string | null;
  pushToast(content: React.ReactNode, duration: number): void;
  onSetIsSaldoCassaDialogOpen(isOpen: boolean): void;
  keyboardNavigationContext: { current: KeyboardNavigationContext };
}) {
  // common section
  const [isRecuperaDialogOpen, setIsRecuperaDialogOpen] = useState(false);

  const [ticketIdOpened, setTicketIdOpened] = useState<{
    currentTicket: TicketByIdResponse | undefined;
    opener: "ultimo" | "recupera";
    lastAnnullaBigliettoFailed: boolean;
    circolaritaError: boolean;
  } | null>(null);
  const [displayState, setDisplayState] = useState<"maximized" | "minimized">("maximized");

  const { data: dataResponseSwr, isValidating } = useSWR("getBigliettoById");
  const [dataResponse, setDataResponse] = useState(dataResponseSwr);
  const [catchError, setCatchError] = useState<boolean>(false);

  const openDettaglioBigliettoDialog = useCallback(
    (
      currentTicket: TicketByIdResponse | undefined,
      opener: "ultimo" | "recupera",
      lastAnnullaBigliettoFailed: boolean,
      circolaritaError: boolean,
    ) => {
      setTicketIdOpened({ currentTicket: currentTicket, opener, lastAnnullaBigliettoFailed, circolaritaError });
      setDisplayState("maximized");
    },
    [],
  );
  const closeRecuperaDialog = useCallback(() => {
    setDataResponse(null);
    setCatchError(false);
    setIsRecuperaDialogOpen(false);
  }, []);

  const closeDettaglioBigliettoDialog = useCallback(() => {
    setDataResponse(null);
    setTicketIdOpened(null);
    onSetIsSaldoCassaDialogOpen(false);
  }, [onSetIsSaldoCassaDialogOpen]);
  const maximizeDettaglioBigliettoDialog = useCallback(() => {
    setDisplayState("maximized");
    onSetIsSaldoCassaDialogOpen(false);
  }, [onSetIsSaldoCassaDialogOpen]);
  const minimizeDettaglioBigliettoDialog = useCallback(() => {
    setDisplayState("minimized");
  }, []);

  // check biglietto by last sold ticket section
  const openUltimoBiglietto = useCallback(async () => {
    if (lastSoldTicketId === null) {
      pushToast(
        <Toast type="danger" heading="Operazione non consentita" description="Nessun biglietto trovato" />,
        5000,
      );
      return;
    }
    const lastSoldTicket = await mutate("getBigliettoById", getBigliettoById(lastSoldTicketId));
    setDataResponse(lastSoldTicket);
    openDettaglioBigliettoDialog(lastSoldTicket, "ultimo", false, false);
  }, [lastSoldTicketId, openDettaglioBigliettoDialog, pushToast]);
  const ultimoTicketErrorMessages = useMemo(
    () =>
      dataResponse &&
      "error" in dataResponse && {
        message: MessagesMapping.whichMessage(dataResponse.error.code),
        messageDetails: MessagesMapping.whichMessageDetails(dataResponse.error.code),
      },
    [dataResponse],
  );
  useEffect(() => {
    if (ticketIdOpened && dataResponse && "error" in dataResponse && ultimoTicketErrorMessages) {
      if (ticketIdOpened.opener === "ultimo") {
        pushToast(
          <Toast
            type="danger"
            heading={ultimoTicketErrorMessages.message}
            description={ultimoTicketErrorMessages.messageDetails}
          />,
          5000,
        );
      }
    }
  }, [ticketIdOpened, dataResponse, ultimoTicketErrorMessages, pushToast]);

  // check biglietto by recupera biglietto section
  useEffect(() => {
    if (dataResponse && "result" in dataResponse) {
      setIsRecuperaDialogOpen(false);
    }
  }, [dataResponse]);

  const openRecuperaBiglietto = useCallback(() => {
    setIsRecuperaDialogOpen(true);
    keyboardNavigationContext.current = "dialog-recupera-biglietto";
  }, [keyboardNavigationContext]);

  // tmp modale

  // DEBT
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (event.key === "Escape") {
        setTicketIdOpened(null);
        setIsRecuperaDialogOpen(false);
      }
      if (event.key === "F11") {
        event.preventDefault();
        setIsRecuperaDialogOpen(true);
      }
      if (event.key === "F12") {
        event.preventDefault();
        openUltimoBiglietto();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [keyboardNavigationContext, openUltimoBiglietto]);

  return {
    openUltimoBiglietto,
    openRecuperaBiglietto,
    isRecuperaDialogOpen,
    closeRecuperaDialog,

    openDettaglioBigliettoDialog,
    closeDettaglioBigliettoDialog,
    maximizeDettaglioBigliettoDialog,
    minimizeDettaglioBigliettoDialog,
    dettaglioBigliettoDisplayStatus: displayState,
    ticketResponse: dataResponse,
    ticketIdOpened,
    isValidating,
    setDataResponse,
    catchError,
    setCatchError,
  };
}

export function checkIfCanAnnulla(now: number, ticket: TicketType) {
  const thereAreReportedEvents = ticket.events.some((event) => event.isReported);
  if (thereAreReportedEvents) {
    return false;
  }
  return isTicketCancellableByTimeout(now, ticket);
}

function isTicketLive(ticket: TicketType) {
  return ticket.events.some((event) => event.live);
}

function isTicketCancellableByTimeout(now: number, ticket: TicketType) {
  const isLive = isTicketLive(ticket);
  const sellingDate = new Date(ticket.sellingDate).getTime();
  const elapsedMiliseconds = now - sellingDate;
  if (isLive) {
    return elapsedMiliseconds <= 30 * 1000;
  } else {
    return elapsedMiliseconds <= 3 * 60 * 1000;
  }
}

type CheckBigliettoProps = {
  isRecuperaDialogOpen: boolean;
  onCloseRecuperaBigliettoDialog(): void;

  onOpenDettaglioBiglietto(
    currentTicket: TicketByIdResponse | undefined,
    opener: "ultimo" | "recupera",
    lastAnnullaBigliettoFailed: boolean,
    circolaritaError: boolean,
  ): void;
  onCloseDettaglioBiglietto(): void;
  dettaglioBigliettoDisplayStatus: "minimized" | "maximized";
  onDettaglioBigliettoMaximize(): void;
  onDettaglioBigliettoMinimize(): void;

  isSaldoCassaDialogOpen: boolean;
  onSetIsSaldoCassaDialogOpen(isOpen: boolean): void;
  pushToast(content: React.ReactNode, duration: number): void;
  onAddMultyEsitoToCart(pronostici: Array<PronosticiParamsType>): void;
  onStartPayment(
    params: PaymentTicketRequest,
    {
      onSuccess,
      onError,
      onCircolaritaError,
    }: {
      onSuccess(params: { amount: number }): void;
      //Maybe later can change
      onError(params: { error: SellErrorType }): void;
      onCircolaritaError(): void;
    },
  ): void;
  onAnnullaBiglietto(
    params: AnnulmentRequest,
    {
      onSuccess,
      onError,
    }: {
      onSuccess(params: { amount: number }): void;
      onError(params: { ticketId: string; opener: "recupera" | "ultimo" }): void;
    },
  ): void;
  lastAnnullaBigliettoFailed: boolean;
  isValidating: boolean;
  piedino: PiedinoState;
  onPiedinoChange(piedino: PiedinoState): void;
  activeClientId: number;
  circolaritaError: boolean;
  ticketIdOpened: {
    currentTicket: TicketByIdResponse | undefined;
    opener: "ultimo" | "recupera";
    lastAnnullaBigliettoFailed: boolean;
    circolaritaError: boolean;
  } | null;
  ticketResponse: TicketByIdResponse;
  onUpdateDataResponse(ticketResponse: TicketByIdResponse): void;
  catchError: boolean;
  setCatchError(catchError: boolean): void;
};

export function CheckBiglietto({
  isRecuperaDialogOpen,
  onCloseRecuperaBigliettoDialog,
  onOpenDettaglioBiglietto,
  dettaglioBigliettoDisplayStatus,
  onCloseDettaglioBiglietto,
  onDettaglioBigliettoMaximize,
  onDettaglioBigliettoMinimize,
  isSaldoCassaDialogOpen,
  onSetIsSaldoCassaDialogOpen,
  pushToast,
  onAddMultyEsitoToCart,
  onStartPayment,
  onAnnullaBiglietto,
  lastAnnullaBigliettoFailed,
  isValidating,
  onPiedinoChange,
  piedino,
  activeClientId,
  circolaritaError,
  ticketIdOpened,
  ticketResponse,
  onUpdateDataResponse,
  catchError,
  setCatchError,
}: CheckBigliettoProps) {
  //ho l'errore

  const ticketResult =
    ticketIdOpened !== null &&
    ticketIdOpened !== undefined &&
    ticketIdOpened.currentTicket &&
    "result" in ticketIdOpened.currentTicket
      ? ticketIdOpened.currentTicket.result
      : undefined;
  const ticketError =
    ticketResponse !== null && ticketResponse !== undefined && "error" in ticketResponse
      ? ticketResponse.error
      : undefined;
  const errorTrovaBiglietto = catchError === true ? catchError : ticketError !== undefined ? ticketError : undefined;
  const { openBlockingAlertState, closeBlockingAlertState } = useNavigazioneActions();
  const { balanceAmount } = useContext(GlobalStateContext);
  const balanceAmountIsEnough = ticketResult
    ? balanceAmount * 100 >=
      (TicketStatusMapping.hasARefund(ticketResult.status) ? ticketResult.sellingAmount : ticketResult.paymentAmount)
    : true;

  const onAnnulla = useCallback(() => {
    if (ticketResult) {
      if (ticketResult.sellingAmount > balanceAmount * 100) {
        onCloseDettaglioBiglietto();
        openBlockingAlertState(
          <Alert
            type="danger"
            heading={
              <FormattedMessage
                defaultMessage="Impossibile effettuare l'annullo. Saldo cassa insufficiente"
                description="alert heading annullo biglietto errore saldo cassa insufficiente"
              />
            }
            description={
              <FormattedMessage
                defaultMessage="Impossibile annullare il biglietto, il tuo saldo cassa non coprirebbe l'importo della scommessa. Devi effettuare una sovvenzione per procedere."
                description="alert description annullo biglietto errore saldo cassa insufficiente"
              />
            }
            onClose={closeBlockingAlertState}
          />,
        );

        return;
      }
      onCloseDettaglioBiglietto();
      openBlockingAlertState(
        <Alert
          type="warning"
          heading={
            <FormattedMessage
              defaultMessage="Annullo Scommessa in corso"
              description="attesa annullo biglietto  header title"
            />
          }
          description={
            <FormattedMessage
              defaultMessage="Attendi l'esito per poter effettuare nuove operazioni"
              description="attesa annullo biglietto  header descrizione"
            />
          }
        />,
      );
      onAnnullaBiglietto(
        { ticketId: ticketResult.ticketId, gameType: ticketResult.sportCode as any },
        {
          onSuccess({ amount }) {
            const activePiedino = piedino[activeClientId];
            onPiedinoChange({
              ...piedino,
              [activeClientId]: {
                totale: activePiedino.totale - amount,

                riscosso: activePiedino.riscosso + 1,
                emesso: activePiedino.emesso,
              },
            });
            mutate("balanceAmountService");
            closeBlockingAlertState();
            pushToast(
              <Toast
                type="success"
                heading={
                  <FormattedMessage
                    description="toast heading annullamento biglietto successo"
                    defaultMessage="Scommessa annullata correttamente"
                  />
                }
                description={
                  <FormattedMessage
                    description="toast description annullamento biglietto successo"
                    defaultMessage="Importo decurtato dal saldo cassa {amount}"
                    values={{ amount: `€  ${amount.toFixed(2).replace(".", ",")}` }}
                  />
                }
              />,
              5000,
            );
          },
          async onError({ ticketId, opener }) {
            closeBlockingAlertState();
            const ticket = await mutate("getBigliettoById", getBigliettoById(ticketId));
            onOpenDettaglioBiglietto(ticket, opener, true, false);
          },
        },
      );
    }
  }, [
    activeClientId,
    balanceAmount,
    closeBlockingAlertState,
    onAnnullaBiglietto,
    onCloseDettaglioBiglietto,
    onOpenDettaglioBiglietto,
    onPiedinoChange,
    openBlockingAlertState,
    piedino,
    pushToast,
    ticketResult,
  ]);

  const onPayment = useCallback(
    (ticketId: string, ticket: TicketType) => {
      openBlockingAlertState(
        <Alert
          type="warning"
          heading={
            <FormattedMessage
              description="pagamento in corso blocking alert heading"
              defaultMessage="Pagamento di {amount} in corso"
              values={{
                amount: formatCurrency(decimalToIntegerValue(ticket.paymentAmount)),
              }}
            />
          }
          description={
            <FormattedMessage
              description="pagamento in corso blocking alert description"
              defaultMessage="Attendi l'esito per poter effettuare nuove operazioni"
            />
          }
        />,
      );
      onStartPayment(
        { ticketId, gameType: ticket.sportCode },
        {
          onSuccess({ amount }) {
            mutate("balanceAmountService");
            closeBlockingAlertState();
            const activePiedino = piedino[activeClientId];
            onPiedinoChange({
              ...piedino,
              [activeClientId]: {
                totale: activePiedino.totale - amount,
                riscosso: activePiedino.riscosso + 1,
                emesso: activePiedino.emesso,
              },
            });
            pushToast(
              <Toast
                type="success"
                heading={
                  <FormattedMessage
                    description="default header title of payment toast"
                    defaultMessage="Pagamento andato a buon fine"
                  />
                }
                description={
                  <FormattedMessage
                    description="default desctiption of payment toast"
                    defaultMessage="Importo da erogare pari a {amount}"
                    values={{ amount: `€  ${amount.toFixed(2).replace(".", ",")}` }}
                  />
                }
              />,
              5000,
            );
          },
          onError(params) {
            closeBlockingAlertState();
            const errorCode =
              params.error.properties && params.error.properties.length !== 0
                ? params.error.properties[0].value
                : params.error.message;
            const errorMessage =
              params.error.properties && params.error.properties.length !== 0 ? params.error.properties[1].value : "";

            openBlockingAlertState(
              <Alert
                type={"danger"}
                heading={
                  <FormattedMessage
                    defaultMessage="Servizio non disponibile"
                    description="generic pay ticket error alert"
                  />
                }
                description={
                  <FormattedMessage
                    defaultMessage='"{code}" {message}'
                    description="pay ticket error alert no properties"
                    values={{ code: `${errorCode}`, message: `${errorMessage}` }}
                  />
                }
                onClose={closeBlockingAlertState}
              />,
            );
          },
          async onCircolaritaError() {
            closeBlockingAlertState();
            const ticket = await mutate("getBigliettoById", getBigliettoById(ticketId));
            onOpenDettaglioBiglietto(ticket, "recupera", false, true);
          },
        },
      );
    },
    [
      activeClientId,
      closeBlockingAlertState,
      onOpenDettaglioBiglietto,
      onPiedinoChange,
      onStartPayment,
      openBlockingAlertState,
      piedino,
      pushToast,
    ],
  );

  return (
    <>
      {isRecuperaDialogOpen && (
        <StyledModalOverlay
          onClick={(event) => {
            if (event.currentTarget === event.target) {
              onCloseRecuperaBigliettoDialog();
            }
          }}
          css={css`
            align-items: center;
            justify-content: center;
            display: flex;
          `}
        >
          <DialogTrovaBiglietto
            ticketError={errorTrovaBiglietto}
            onTicketCodeChange={async (currentTicket) => {
              try {
                const data = await mutate("getBigliettoById", getBigliettoById(currentTicket));
                if (data === undefined) {
                  throw Error;
                }
                onUpdateDataResponse(data);
                if (data && "result" in data && isTicketPayable(data.result, balanceAmount)) {
                  onCloseRecuperaBigliettoDialog();
                  onPayment(currentTicket, data.result);
                } else if (data && "result" in data) {
                  onCloseRecuperaBigliettoDialog();
                  onOpenDettaglioBiglietto(data, "recupera", false, false);
                }
              } catch (error) {
                setCatchError(true);
              }
            }}
          />
        </StyledModalOverlay>
      )}

      {(() => {
        const ticket = ticketIdOpened !== null && ticketIdOpened.currentTicket;
        const ticketResult =
          ticketIdOpened !== null && ticketIdOpened.currentTicket && "result" in ticketIdOpened.currentTicket
            ? ticketIdOpened.currentTicket.result
            : undefined;
        if (ticketIdOpened === null) {
          return null;
        }
        if (!ticket) {
          return null;
        }
        if (!ticketResult) {
          return null;
        }
        if (dettaglioBigliettoDisplayStatus === "maximized" && !isSaldoCassaDialogOpen) {
          if (!ticket || !ticketResult) {
            return null;
          }
          return (
            <StyledModalOverlay
              onClick={(event) => {
                if (event.currentTarget === event.target) {
                  onCloseDettaglioBiglietto();
                }
              }}
              css={css`
                align-items: center;
                justify-content: center;
                display: flex;
              `}
            >
              <div
                css={css`
                  max-height: 900px;
                  width: 1125px;
                `}
              >
                <Maximized
                  balanceAmountIsEnough={balanceAmountIsEnough}
                  ticket={ticketResult}
                  onClose={onCloseDettaglioBiglietto}
                  onMinimize={onDettaglioBigliettoMinimize}
                  onSetIsSaldoCassaDialogOpen={onSetIsSaldoCassaDialogOpen}
                  pushToast={pushToast}
                  onAddMultyEsitoToCart={onAddMultyEsitoToCart}
                  onPayment={onPayment}
                  onAnnullaBiglietto={onAnnulla}
                  lastAnnullaBigliettoFailed={lastAnnullaBigliettoFailed}
                  isValidating={isValidating}
                  hasCircolaritaError={circolaritaError}
                />
              </div>
            </StyledModalOverlay>
          );
        } else if (dettaglioBigliettoDisplayStatus === "minimized") {
          return (
            <Minimized
              ticket={ticketResult}
              onClose={onCloseDettaglioBiglietto}
              onMaximize={onDettaglioBigliettoMaximize}
            />
          );
        }
      })()}
    </>
  );
}

function isTicketPayable(ticket: TicketType, balanceAmount: number) {
  const balanceAmountIsEnough = ticket
    ? balanceAmount * 100 >=
      (TicketStatusMapping.hasARefund(ticket.status) ? ticket.sellingAmount : ticket.paymentAmount)
    : true;
  return (
    balanceAmountIsEnough &&
    (ticket.status === TicketStatusEnum.WINNING ||
      ticket.status === TicketStatusEnum.PAYABLE_REFUNDABLE ||
      ticket.status === TicketStatusEnum.REFUNDABLE) &&
    ticket.isDeAnonymization === false
  );
}

// `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
const dateTimeFormatter = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const StyledModalOverlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.77);
  z-index: 2;
`;

type MinimizedProps = { onMaximize(): void; onClose(): void; ticket: TicketType };
function Minimized({ onMaximize, onClose, ticket }: MinimizedProps) {
  const eventCount = ticket.events.length;
  return (
    <div
      css={css`
        bottom: 0;
        left: 80px;
        position: fixed;
        background-color: #333333;
        color: white;
        height: 60px;
        min-width: 450px;
        border-radius: 12px 12px 0 0;
        box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        padding-left: 20px;
        padding-right: 10px;
      `}
    >
      <div
        css={css`
          font-size: 16px;
        `}
      >
        {ticket.sportCode} ({eventCount}):
        <span
          css={css`
            font-weight: 600;
            font-family: Mulish;
          `}
        >
          {" "}
          {chunk(ticket.ticketId, 4)
            .map((group) => group.join(""))
            .join(" ")}
        </span>
      </div>
      <div
        css={css`
          flex-grow: 1;
        `}
      />
      <StyledMinimizationIcon
        onClick={onMaximize}
        css={css`
          margin-right: 10px;
        `}
      >
        <IcoPlus />
      </StyledMinimizationIcon>
      <StyledMinimizationIcon onClick={onClose}>
        <IcoClose />
      </StyledMinimizationIcon>
    </div>
  );
}

type MaximizedProps = {
  onMinimize(): void;
  onClose(): void;
  ticket: TicketType;
  onSetIsSaldoCassaDialogOpen(isOpen: boolean): void;
  onAddMultyEsitoToCart(pronostici: Array<PronosticiParamsType>): void;
  pushToast(content: React.ReactNode, duration: number): void;
  balanceAmountIsEnough: boolean;
  onPayment(ticketId: string, ticketResponseDetail: TicketType): void;
  onAnnullaBiglietto(): void;
  lastAnnullaBigliettoFailed: boolean;
  isValidating: boolean;

  hasCircolaritaError: boolean;
};
function Maximized({
  balanceAmountIsEnough,
  ticket,
  onMinimize,
  onClose,
  onSetIsSaldoCassaDialogOpen,
  pushToast,
  onAddMultyEsitoToCart,
  onPayment,
  onAnnullaBiglietto,
  lastAnnullaBigliettoFailed,
  isValidating,
  hasCircolaritaError,
}: MaximizedProps) {
  const formattedDate = dateTimeFormatter.format(new Date(ticket.sellingDate)).replace(",", "");

  return (
    <div
      css={css`
        border-radius: 12px;
        background-color: white;
      `}
    >
      <div
        css={css`
          position: relative;
        `}
      >
        {TicketStatusMapping.shouldBePayedNow(ticket.status) && ticket.isDeAnonymization && (
          <AlertBox
            alertType="warning"
            message={{ text: MessagesMapping.whichMessage(MessagesMappingEnum.WARNING_NEEDED_DISANONIMAZIONE) }}
          />
        )}
        {(() => {
          if (!lastAnnullaBigliettoFailed) {
            return null;
          }

          const isLive = isTicketLive(ticket);
          const isCancellableByTimeout = isTicketCancellableByTimeout(new Date().getTime(), ticket);
          if (!isCancellableByTimeout) {
            return isLive ? (
              <AlertBox
                alertType="error"
                message={{
                  text: (
                    <FormattedMessage
                      description="alert annullo impossibile live"
                      defaultMessage="Impossibile annullare la scommessa, sono passati oltre 30 secondi dall'emissione"
                    />
                  ),
                }}
              />
            ) : (
              <AlertBox
                alertType="error"
                message={{
                  text: (
                    <FormattedMessage
                      description="alert annullo impossibile prematch"
                      defaultMessage="Impossibile annullare la scommessa, sono passati oltre 3 minuti dall'emissione"
                    />
                  ),
                }}
              />
            );
          } else if (ticket.status === TicketStatusEnum.CANCELED) {
            return (
              <AlertBox
                alertType="error"
                message={{
                  text: (
                    <FormattedMessage
                      description="alert annullo impossibile gia annullato"
                      defaultMessage="Impossibile annullare la scommessa, è gia stata annullata"
                    />
                  ),
                }}
              />
            );
          } else {
            return (
              <AlertBox
                alertType="error"
                message={{
                  text: (
                    <FormattedMessage
                      description="alert annullo impossibile generico"
                      defaultMessage="Impossibile annullare la scommessa"
                    />
                  ),
                }}
              />
            );
          }
        })()}

        {TicketStatusMapping.shouldBePayedNow(ticket.status) && !ticket.isDeAnonymization && !balanceAmountIsEnough && (
          <AlertBox
            data-qa="warn_saldo_cassa"
            alertType="warning"
            message={{ text: MessagesMapping.whichMessage(MessagesMappingEnum.WARNING_INSUFFICIENT_SALDO_CASSA) }}
            action={{
              label: "Saldo Cassa",
              action: () => {
                onSetIsSaldoCassaDialogOpen(true);
                onMinimize();
              },
            }}
          />
        )}
        {hasCircolaritaError && (
          <AlertBox
            alertType="warning"
            message={{ text: MessagesMapping.whichMessage(MessagesMappingEnum.CIRCOLARITA_NON_ABILITATA) }}
          />
        )}
      </div>
      <div
        css={css`
          background-color: #333333;
          color: white;
          height: 60px;
          min-width: 450px;
          border-radius: 12px 12px 0 0;
          box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          padding-left: 20px;
        `}
      >
        <div>
          <span
            css={css`
              font-weight: 600;
              font-family: Mulish;
              margin-left: 10px;
              margin-right: 10px;
            `}
          >
            {" "}
            {ticket.sportCode}
          </span>{" "}
          <span
            css={css`
              font-family: Roboto, sans-serif;
              font-weight: 400;
              font-size: 14px;
            `}
          >
            {formattedDate}
          </span>
        </div>
        <div
          css={css`
            flex-grow: 1;
          `}
        />
        <div
          css={css`
            margin-top: -60px;
            margin-right: -18px;
            display: flex;
          `}
        >
          <StyledMinimizationIcon
            onClick={onMinimize}
            css={css`
              margin-right: 10px;
            `}
          >
            <IcoMinus />
          </StyledMinimizationIcon>
          <StyledMinimizationIcon onClick={onClose}>
            <IcoClose />
          </StyledMinimizationIcon>
        </div>
      </div>
      <DettaglioBigliettoHeader
        onPayment={onPayment}
        isButtonDisabled={hasCircolaritaError}
        dettaglioBiglietto={ticket}
        balanceAmountIsEnough={balanceAmountIsEnough}
        pushToast={pushToast}
        setMinimize={(isMinimized) => {
          if (isMinimized) {
            onMinimize();
          }
        }}
        onAddMultyEsitoToCart={onAddMultyEsitoToCart}
        onClose={onClose}
        onAnnullaBiglietto={onAnnullaBiglietto}
        isValidating={isValidating}
      />
      <div
        css={css`
          max-height: 600px;
          overflow-y: scroll;
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      >
        <EventsCentralBody dettaglioBiglietto={ticket} />
      </div>
      <DettaglioBigliettoFooter dettaglioBiglietto={ticket} />
    </div>
  );
}
