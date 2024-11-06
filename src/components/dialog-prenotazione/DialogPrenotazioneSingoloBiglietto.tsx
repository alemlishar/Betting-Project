import React, { useCallback, useContext, useEffect } from "react";
import { ReactComponent as IconDangerWhite } from "src/assets/images/icon-danger-white.svg";
import { ReactComponent as IcoClose } from "src/assets/images/icon-preno-close-black.svg";
import { ReactComponent as IcoMinus } from "src/assets/images/icon-preno-minus-black.svg";
import { useCartClientsContext, useUpdateClientsContext } from "src/components/common/context-clients/ClientsContext";
import { Toast } from "src/components/common/toast-message/Toast";
import { DialogPrenotazioneFooter } from "src/components/dialog-prenotazione/dialog-prenotazione-footer/DialogPrenotazioneFooter";
import { SubHeaderDialogProps } from "src/components/dialog-prenotazione/dialog-prenotazione-header/DialogSubHeader";
import { DialogPrenotazioneBody } from "src/components/dialog-prenotazione/DialogPrenotazioneBody";
import {
  DialogPrenotazioneState,
  getBonusForTicket,
  modificaBiglietto,
} from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { useSviluppoSistema } from "src/components/dialog-prenotazione/useSviluppoSistema";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import styled, { css } from "styled-components/macro";
import { mutate } from "swr";
import { StyledDialogContainer } from "../common/full-screen-alert/StyledDialogContainer";

import { DialogPrenotazioneSellingAlert } from "src/components/dialog-prenotazione/DialogPrenotazioneVendita";
import { deletePrenotazioneByNickname, Prenotazione, Ticket } from "src/components/prenotazioni/prenotazioni-api";
import { Alert } from "src/components/common/blocking-alert/BlockingAlert";
import { FormattedMessage } from "react-intl";
import configuration from "src/helpers/configuration";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { AlertAcceptanceAmountsChanged } from "src/components/common/blocking-alert/AlertAcceptanceAmountsChanged";
import { getTicketType } from "src/components/prenotazioni/MenuPrenotazioni";
import { decimalToIntegerValue } from "src/helpers/formatCurrencyAmountUtils";
import { NickName } from "src/types/chiavi";
import { TicketIndex } from "src/components/dialog-prenotazione/DialogPrenotazioneMultiBiglietto";
import { VenditaSuccessResponse, AmountsChangedResponse } from "src/types/vendita.types";
import { BonusConfigClassType } from "src/types/bonusConfig.type";

export function DialogPrenotazioneSingoloBiglietto({
  schedaPrenotazione,
  SubHeaderDialog,
  pushToast,
  dialogPrenotazioneState,
  onVendiTicket,
}: {
  schedaPrenotazione: Prenotazione;
  SubHeaderDialog: React.ComponentType<SubHeaderDialogProps>;
  onVendiTicket(
    nickname: NickName,
    ticketViewed: TicketIndex[],
    ticketToSellList: Ticket[],
    ticketToSellListIndex: number,
    selledTicketsList: Record<TicketIndex, VenditaSuccessResponse["response"]>,
    notSelledTicketsList: Record<TicketIndex, string>,
    totalSellTicket: number,
    allTicketSent: boolean,
    bonusConfig?: BonusConfigClassType[],
    amountChangedTicketResponse?: AmountsChangedResponse,
  ): void;
  pushToast(content: React.ReactNode, duration: number): void;
  dialogPrenotazioneState: DialogPrenotazioneState;
}) {
  const { closeDialogPrenotazione, minimizeDialogPrenotazione } = useNavigazioneActions();

  // DEBT
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (event.key === "Escape") {
        closeDialogPrenotazione(schedaPrenotazione.mainNickname);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeDialogPrenotazione]);

  const ticket = schedaPrenotazione.tickets.filter((ticket) => ticket.status !== "Sent")[0];
  const { sviluppoSistema } = useSviluppoSistema(ticket);

  const clients = useCartClientsContext();
  const updateClients = useUpdateClientsContext();
  const { bonusConfig } = useContext(GlobalStateContext);

  const deleteEsitoFromTicket = (chiaveEsitoToDelete: string) => {
    const outcomeList = schedaPrenotazione.tickets[0].results.filter((outcome) => {
      return (
        `${outcome.codicePalinsesto}-${outcome.codiceAvvenimento}-${outcome.codiceScommessa}-${outcome.codiceInfoAggiuntiva}-${outcome.codiceEsito}` !==
        chiaveEsitoToDelete
      );
    });

    mutate(
      [schedaPrenotazione.mainNickname],
      {
        ...schedaPrenotazione,
        tickets: [{ ...schedaPrenotazione.tickets[0], results: outcomeList }],
      },
      false,
    );
  };

  const deleteClosedOrSuspendedOutcomes = () => {
    const notClosedOrSuspendedOutcomeList = ticket.results.filter((outcome) => {
      return !(outcome.stato === 0 && outcome.quota) && outcome.stato !== 2;
    });
    mutate(
      [schedaPrenotazione.mainNickname],
      {
        ...schedaPrenotazione,
        tickets: [{ ...schedaPrenotazione.tickets[0], results: notClosedOrSuspendedOutcomeList }],
      },
      false,
    );
  };

  const notSelledTicket = dialogPrenotazioneState.notSelledTickets[ticket.index];
  const isFailedVendita = !!notSelledTicket;
  const acceptanceStatus =
    notSelledTicket === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE ||
    notSelledTicket === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_REJECETED ||
    notSelledTicket === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_TIMEOUT ||
    notSelledTicket === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_AMOUNTS_CHANGED
      ? notSelledTicket
      : undefined;
  const amountChangedTicketResponse = dialogPrenotazioneState.amountChangedTicketResponse;

  const modificaBigliettoOfSingoloBiglietto = useCallback(
    (ticket: Ticket) => {
      return modificaBiglietto(clients, sviluppoSistema, updateClients, ticket);
    },
    [clients, updateClients, sviluppoSistema],
  );

  const vendiBiglietto = useCallback(
    (ticket?: Ticket) => {
      const ticketToSellListIndex = 0;

      const selledTicketsList = {};
      const notSelledTicketsList = {};
      const totalSellTicket = 0;
      const allTicketSent = true;
      const ticketToSellList = ticket
        ? [ticket]
        : schedaPrenotazione.tickets.filter((ticket) => ticket.status !== "Sent");

      const ticketViewed: TicketIndex[] = ticket ? [ticket.index] : [ticketToSellList[ticketToSellListIndex].index];

      onVendiTicket(
        schedaPrenotazione.mainNickname,
        ticketViewed,
        ticketToSellList,
        ticketToSellListIndex,
        selledTicketsList,
        notSelledTicketsList,
        totalSellTicket,
        allTicketSent,
        bonusConfig,
        amountChangedTicketResponse,
      );
    },
    [schedaPrenotazione, amountChangedTicketResponse, bonusConfig, onVendiTicket],
  );

  const acceptChangedAmount = () => {
    if (amountChangedTicketResponse) {
      const newAmount = amountChangedTicketResponse.attrExtConsole.amount.amount;
      const ticketType = getTicketType(ticket);

      if (ticketType === "Sistema") {
        const newSystemClasses = ticket.systemClasses.map((sviluppo) => {
          const newSviluppo = amountChangedTicketResponse.attrExtConsole.amount.numSviluppi.find(
            (numSviluppo) => numSviluppo.tipo === sviluppo.key,
          );
          return newSviluppo
            ? { ...sviluppo, value: { ...sviluppo.value, bettingPrice: newSviluppo.amount } }
            : sviluppo;
        });

        vendiBiglietto({ ...ticket, sellingPrice: newAmount, systemClasses: newSystemClasses });
      } else {
        const { potentialWin: newPotentialWin } = getBonusForTicket(
          { ...ticket, sellingPrice: newAmount },
          bonusConfig,
        );
        vendiBiglietto({ ...ticket, sellingPrice: newAmount, paymentPrice: newPotentialWin.value });
      }
    }
  };

  const rejectChangedAmount = async () => {
    await deletePrenotazioneByNickname(schedaPrenotazione.mainNickname);
    closeDialogPrenotazione(schedaPrenotazione.mainNickname);
    pushToast(
      <Toast
        type="danger"
        heading={
          <FormattedMessage
            defaultMessage="Scommessa non andata a buon fine"
            description="Bet unsuccessful of rejected amount changed alert in single ticket booking"
          />
        }
        description={
          <FormattedMessage
            defaultMessage="Nessun importo da riscuotere"
            description="Description of bet unsuccessful of rejected amount changed alert in single ticket booking"
          />
        }
      />,
      5000,
    );
  };

  if (acceptanceStatus) {
    if (acceptanceStatus === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_REJECETED) {
      return (
        <Alert
          type={"danger"}
          heading={
            <FormattedMessage
              defaultMessage="Scommessa rifiutata"
              description="accettazione rifiutata header title of prenotazione alert"
            />
          }
          description={
            <FormattedMessage
              defaultMessage="I nostri quotisti non hanno accettato la giocata"
              description="accettazione rifiutata description title of prenotazione alert"
            />
          }
          primaryButtonAction={() => {
            closeDialogPrenotazione(schedaPrenotazione.mainNickname);
          }}
          primaryButtonText={
            <FormattedMessage defaultMessage="Chiudi" description="close button of rejected acceptance alert" />
          }
        />
      );
    } else if (acceptanceStatus === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE) {
      return (
        <Alert
          type={"warning"}
          heading={
            <FormattedMessage
              description="default header title of acceptance alert"
              defaultMessage="Scommessa in accettazione"
            />
          }
          description={
            <FormattedMessage
              description="description of acceptance alert"
              defaultMessage="I nostri quotisti stanno valutando la tua scommessa, attendi l’esito per poter effettuare nuove operazioni"
            />
          }
        />
      );
    } else if (
      acceptanceStatus === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_AMOUNTS_CHANGED &&
      amountChangedTicketResponse
    ) {
      const newAmount = Number(amountChangedTicketResponse.attrExtConsole.amount.amount);

      return (
        <>
          <AlertAcceptanceAmountsChanged
            primaryButtonAction={acceptChangedAmount}
            secondaryButtonAction={rejectChangedAmount}
            oldPuntata={decimalToIntegerValue(ticket.sellingPrice)}
            newPuntata={newAmount}
          />
        </>
      );
    }
  }

  if (dialogPrenotazioneState.sellTicketState) {
    return <DialogPrenotazioneSellingAlert />;
  }

  return (
    <StyledDialogContainer
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeDialogPrenotazione(schedaPrenotazione.mainNickname);
        }
      }}
    >
      <StyledDialog open>
        <StyledDialogHeader>
          <StyledMinimizationIconContainer>
            <StyledMinimizationIcon
              onClick={() => {
                minimizeDialogPrenotazione();
              }}
            >
              <IcoMinus />
            </StyledMinimizationIcon>
            <StyledMinimizationIcon onClick={() => closeDialogPrenotazione(schedaPrenotazione.mainNickname)}>
              <IcoClose />
            </StyledMinimizationIcon>
          </StyledMinimizationIconContainer>
          <StyledNickName>{schedaPrenotazione?.mainNickname}</StyledNickName>
        </StyledDialogHeader>

        <SubHeaderDialog
          ticket={ticket}
          modificaBiglietto={modificaBigliettoOfSingoloBiglietto}
          nickname={schedaPrenotazione.mainNickname}
          deleteClosedOrSuspendedOutcomes={deleteClosedOrSuspendedOutcomes}
          onVendi={vendiBiglietto}
        />

        {isFailedVendita && (
          <div
            css={css`
              background-color: #ffffff;
              box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.5);
              padding: 15px 30px;
            `}
          >
            <div
              css={css`
                height: 70px;
                width: 1065px;
                border-radius: 8px;
                background-color: #eb1e23;
                display: grid;
                grid-template-columns: [icon] 27px [message] auto;
                grid-column-gap: 18px;
                align-items: center;
                color: #ffffff;
                font-family: Roboto;
                font-size: 18px;
                box-sizing: border-box;
                padding: 20px 30px;
                align-content: center;
              `}
            >
              <IconDangerWhite style={{ gridColumn: `icon` }} />
              <div
                style={{ gridColumn: `message` }}
                css={css`
                  font-weight: 500;
                `}
              >
                {acceptanceStatus === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_TIMEOUT ? (
                  <>
                    <div>
                      <FormattedMessage
                        description="accettazione timeout header title of prenotazione alert"
                        defaultMessage="Scommessa non valutata"
                      />
                    </div>
                    <div
                      css={css`
                        font-weight: 400;
                      `}
                    >
                      <FormattedMessage
                        defaultMessage="A causa dell'intenso traffico non siamo riusciti a prendere in carico la richiesta. Riprova ad effettuare la vendita"
                        description="accettazione in timeout description of booking message"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <FormattedMessage
                      description="description of unseccessful sale in booking"
                      defaultMessage="Vendita non andata a buon fine."
                    />
                    <span
                      css={css`
                        font-weight: 400;
                        padding-left: 3px;
                      `}
                    >
                      {notSelledTicket && notSelledTicket}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <DialogPrenotazioneBody
          ticket={ticket}
          sviluppoSistema={sviluppoSistema}
          deleteEsitoFromTicket={deleteEsitoFromTicket}
        />
        <DialogPrenotazioneFooter ticket={ticket} sviluppoSistema={sviluppoSistema} />
      </StyledDialog>
    </StyledDialogContainer>
  );
}

export const StyledDialog = styled.dialog`
  width: 1125px;
  max-height: calc(100vh - 100px);
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.5);
  position: relative;
  border: 0;
  padding: 0;
  background-color: transparent;
  margin-top: 60px;
`;

const StyledDialogHeader = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  border-radius: 12px 12px 0 0;
  background-color: #333333;
  position: relative;
`;

export const StyledMinimizationIconContainer = styled.div`
  position: absolute;
  top: -20px;
  right: -20px;
  display: flex;
  width: 90px;
  justify-content: space-between;
`;

export const StyledMinimizationIcon = styled.div`
  height: 25px;
  width: 25px;
  border: 7px solid #333333;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  color: #000000;
  font-size: 1.875rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  &:hover {
    border: 7px solid #aac21f;
  }
  background-color: #ffffff;
  border-radius: 50%;
`;

export const StyledNickName = styled.div`
  color: #ffffff;
  font-family: Mulish;
  font-size: 1.125rem;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 20px;
`;

export const StyledDialogSubHeader = styled.div`
  height: 90px;
  background-color: #ffffff;
  align-items: center;
  position: relative;
`;

export const StyledDescription = styled.div`
  height: 23px;
  width: 51px;
  color: #333333;
  font-family: Roboto;
  font-size: 0.875rem;
  letter-spacing: 0;
  line-height: 23px;
`;
