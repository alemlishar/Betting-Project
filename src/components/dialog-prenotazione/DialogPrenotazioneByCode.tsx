import React, { useEffect, useState } from "react";
import { getPrenotazioneByCode, Ticket } from "src/components/prenotazioni/prenotazioni-api";
import useSWR from "swr";
import {
  DialogPrenotazioneSingoloBiglietto,
  StyledDescription,
  StyledDialogSubHeader,
} from "src/components/dialog-prenotazione/DialogPrenotazioneSingoloBiglietto";
import {
  StyledPrenotazionePrimaryButton,
  SubHeaderDialogProps,
} from "src/components/dialog-prenotazione/dialog-prenotazione-header/DialogSubHeader";
import { getTicketType } from "src/components/prenotazioni/MenuPrenotazioni";
import { css } from "styled-components/macro";
import {
  DialogPrenotazioneState,
  getNotAvailableOutcomesStatus,
} from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { checkNotAvailablePrenotazione } from "src/components/prenotazioni/MenuPrenotazioni";
import { Toast } from "src/components/common/toast-message/Toast";
import { ModificaPrenotazione } from "src/components/prenotazioni/ModificaPrenotazione";
import { FormattedMessage } from "react-intl";
import configuration from "src/helpers/configuration";
import { NickName } from "src/types/chiavi";
import { TicketIndex } from "src/components/dialog-prenotazione/DialogPrenotazioneMultiBiglietto";
import { AmountsChangedResponse, VenditaSuccessResponse } from "src/types/vendita.types";
import { BonusConfigClassType } from "src/types/bonusConfig.type";

export function DialogPrenotazioneByCode({
  ticketCode,
  dialogPrenotazioneState,
  pushToast,
  onVendiTicket,
}: {
  ticketCode: string;
  dialogPrenotazioneState: DialogPrenotazioneState;
  pushToast(content: React.ReactNode, duration: number): void;
  onVendiTicket(
    nickname: NickName,
    ticketViewed: number[],
    ticketToSellList: Ticket[],
    ticketToSellListIndex: number,
    selledTicketsList: Record<TicketIndex, VenditaSuccessResponse["response"]>,
    notSelledTicketsList: Record<TicketIndex, string>,
    totalSellTicket: number,
    allTicketSent: boolean,
    bonusConfig?: BonusConfigClassType[],
    amountChangedTicketResponse?: AmountsChangedResponse,
  ): void;
}) {
  const { openDialogPrenotazioneNotAvailable, closeDialogPrenotazione } = useNavigazioneActions();
  const { data: schedaPrenotazione } = useSWR([ticketCode], getPrenotazioneByCode, { revalidateOnFocus: false });
  const isScaduto = schedaPrenotazione?.tickets.some((ticket) =>
    ticket.results.some(
      (result) => new Date().getTime() > new Date(result.dataAvvenimento).getTime() || result.stato === 0,
    ),
  );

  useEffect(() => {
    if (isScaduto) {
      pushToast(
        <Toast
          type="danger"
          heading={
            <FormattedMessage
              description="toast heading precompilata scaduta"
              defaultMessage="Precompilata non più esistente"
            />
          }
          description={
            <FormattedMessage
              description="toast description precompilata scaduta"
              defaultMessage="Impossibile il recupero dei dati poichè eliminata o alcuni esiti appartengono ad avvenimenti Live."
            />
          }
        />,
        5000,
      );
      closeDialogPrenotazione(ticketCode);
    }
  }, [ticketCode, isScaduto, pushToast, closeDialogPrenotazione]);

  if (isScaduto) {
    return null;
  }

  if (!schedaPrenotazione) {
    return null;
  }

  const notAvailablePrenotazione = checkNotAvailablePrenotazione(schedaPrenotazione);
  if (notAvailablePrenotazione) {
    openDialogPrenotazioneNotAvailable(schedaPrenotazione.mainNickname);
    return null;
  }
  return (
    <DialogPrenotazioneSingoloBiglietto
      schedaPrenotazione={schedaPrenotazione}
      SubHeaderDialog={SubHeader}
      pushToast={pushToast}
      onVendiTicket={onVendiTicket}
      dialogPrenotazioneState={dialogPrenotazioneState}
    />
  );
}

function SubHeader({ nickname, ticket, modificaBiglietto, onVendi }: SubHeaderDialogProps) {
  const description = getTicketType(ticket);
  const notAvailableOutcomesStatus = getNotAvailableOutcomesStatus(ticket);
  const {
    closeDialogPrenotazione,
    openSezioneSport,
    minimizeDialogPrenotazione,
    openSellDialogPrenotazione,
  } = useNavigazioneActions();

  const [carrelloPieno, setCarrelloPieno] = useState(false);
  const modifyTicket = () => {
    const result = modificaBiglietto(ticket);
    if (result === "error") {
      setCarrelloPieno(true);
    } else {
      closeDialogPrenotazione(nickname);
      openSezioneSport();
    }
  };

  return (
    <>
      {carrelloPieno ? (
        <div
          css={css`
            height: 90px;
            align-items: center;
            background-color: #ffffff;
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
            position: relative;
            box-sizing: border-box;
            display: grid;
            align-items: center;
            padding: 0 30px;
          `}
        >
          <ModificaPrenotazione
            onAnnulla={() => {
              setCarrelloPieno(false);
            }}
            onProcedi={() => {
              minimizeDialogPrenotazione();
              openSezioneSport();
            }}
          />
        </div>
      ) : (
        <StyledDialogSubHeader
          css={css`
            display: grid;
            grid-template-columns: [description] 1fr repeat(2, [button] auto);
            column-gap: 10px;
            height: 90px;
            align-items: center;
            padding: 0 30px;
            background-color: #ffffff;
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
            box-sizing: border-box;
          `}
        >
          <StyledDescription
            css={css`
              grid-column: description;
            `}
          >
            {description}
          </StyledDescription>
          {notAvailableOutcomesStatus !== configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL && (
            <>
              <StyledPrenotazionePrimaryButton
                css={css`
                  grid-column: button 1;
                  background-color: #005936;
                  color: #fff;
                `}
                onClick={() => {
                  modifyTicket();
                }}
              >
                <FormattedMessage
                  description="CTA Modifica modulo gestione prenotazione Header"
                  defaultMessage="Modifica"
                />
              </StyledPrenotazionePrimaryButton>

              <StyledPrenotazionePrimaryButton
                css={css`
                  grid-column: button 2;
                  background-color: #005936;
                  color: #fff;
                `}
                onClick={() => {
                  openSellDialogPrenotazione(ticket.index);
                  onVendi();
                }}
              >
                <FormattedMessage
                  description="CTA Modifica modulo gestione prenotazione Header"
                  defaultMessage="Vendi"
                />
              </StyledPrenotazionePrimaryButton>
            </>
          )}
        </StyledDialogSubHeader>
      )}
    </>
  );
}
