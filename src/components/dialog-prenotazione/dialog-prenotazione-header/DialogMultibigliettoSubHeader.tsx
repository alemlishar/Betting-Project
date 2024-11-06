import React, { useState } from "react";
import { NickName } from "src/types/chiavi";
import { Ticket } from "src/components/prenotazioni/prenotazioni-api";
import {
  StyledDescription,
  StyledDialogSubHeader,
} from "src/components/dialog-prenotazione/DialogPrenotazioneSingoloBiglietto";
import { css } from "styled-components/macro";
import { getTicketType } from "src/components/prenotazioni/MenuPrenotazioni";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { getNotAvailableOutcomesStatus } from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { EliminaTicket } from "src/components/prenotazioni/EliminaTicket";
import { StyledPrenotazionePrimaryButton } from "src/components/dialog-prenotazione/dialog-prenotazione-header/DialogSubHeader";
import { ModificaPrenotazione } from "src/components/prenotazioni/ModificaPrenotazione";
import { FormattedMessage } from "react-intl";
import { TicketIndex } from "src/components/dialog-prenotazione/DialogPrenotazioneMultiBiglietto";
import configuration from "src/helpers/configuration";

export type DialogMultibigliettoSubHeaderProps = {
  ticket: Ticket;
  nickname: NickName;
  deleteClosedOrSuspendedOutcomes: () => void;
  onTicketDelete(nickname: NickName, ticketIndex: TicketIndex): void;
  onTicketModify(ticket: Ticket): "error" | "success";
  onVendi(): void;
};
export function DialogMultibigliettoSubHeader({
  ticket,
  nickname,
  deleteClosedOrSuspendedOutcomes,
  onTicketDelete,
  onTicketModify,
  onVendi,
}: DialogMultibigliettoSubHeaderProps) {
  const { minimizeDialogPrenotazione, openSezioneSport } = useNavigazioneActions();
  const ticketType = getTicketType(ticket);
  const [viewDeletePopup, setViewDeletePopup] = useState(false);
  const notAvailableOutcomesStatus = getNotAvailableOutcomesStatus(ticket);

  const getClosedOrSuspendedOutcomeList = ticket.results.filter((outcome) => {
    return (outcome.stato === 0 && outcome.quota) || outcome.stato === 2;
  });

  const [carrelloPieno, setCarrelloPieno] = useState(false);
  const modifyTicket = () => {
    const result = onTicketModify(ticket);
    if (result === "error") {
      setCarrelloPieno(true);
    } else {
      minimizeDialogPrenotazione();
      openSezioneSport();
    }
  };

  return (
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
      {carrelloPieno ? (
        <ModificaPrenotazione
          onAnnulla={() => {
            setCarrelloPieno(false);
          }}
          onProcedi={() => {
            minimizeDialogPrenotazione();
            openSezioneSport();
          }}
        />
      ) : viewDeletePopup ? (
        <EliminaTicket
          onAnnulla={() => {
            setViewDeletePopup(false);
          }}
          onProcedi={() => {
            onTicketDelete(nickname, ticket.index);
            setViewDeletePopup(false);
          }}
          nickname={nickname}
          ticketIndex={ticket.index}
        />
      ) : (
        <StyledDialogSubHeader
          css={css`
            display: grid;
            grid-template-columns: [description] 1fr ${ticketType === "Multipla" &&
              getClosedOrSuspendedOutcomeList.length > 0 &&
              notAvailableOutcomesStatus !== configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL
                ? "[elimina-esiti-chiusi-sospesi] 280px [elimina] 150px [modifica] 150px [vendi] 150px"
                : (ticketType !== "Sistema" &&
                    notAvailableOutcomesStatus !== configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL) ||
                  (ticketType === "Sistema" &&
                    notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.NOTANY)
                ? "[elimina] 150px [modifica] 150px [vendi] 150px"
                : ticketType === "Sistema" &&
                  notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.SOME
                ? "[elimina] 150px [modifica] 150px"
                : "[elimina] 150px"};
            column-gap: 10px;
          `}
        >
          <StyledDescription>
            <span
              css={css`
                color: #333333;
                font-family: Mulish;
                font-size: 1rem;
                font-weight: 800;
                letter-spacing: 0;
                line-height: 23px;
                margin-right: 18px;
              `}
            >{`${ticket.index + 1}.`}</span>
            <FormattedMessage
              description="type biglietto modulo gestione prenotazione multibiglietto"
              defaultMessage="{tickettype}"
              values={{ tickettype: ticketType }}
            />
          </StyledDescription>
          {ticketType === "Multipla" && getClosedOrSuspendedOutcomeList.length > 0 && (
            <StyledPrenotazionePrimaryButton
              css={css`
                grid-column: elimina-esiti-chiusi-sospesi;
                background-color: #fff;
                color: #005936;
                width: 280px;
                padding: 15px 0;
              `}
              onClick={() => deleteClosedOrSuspendedOutcomes()}
            >
              <FormattedMessage
                description="button elimina esiti chiusi/sospesi biglietto modulo gestione prenotazione multibiglietto"
                defaultMessage="Elimina esiti chiusi/sospesi ({esitinumber})"
                values={{ esitinumber: getClosedOrSuspendedOutcomeList.length }}
              />
            </StyledPrenotazionePrimaryButton>
          )}

          <StyledPrenotazionePrimaryButton
            css={css`
              grid-column: elimina;
              background-color: #fff;
              color: #005936;
            `}
            onClick={() => setViewDeletePopup(true)}
          >
            <FormattedMessage
              description="button elimina modulo gestione prenotazione multibiglietto"
              defaultMessage="Elimina"
            />
          </StyledPrenotazionePrimaryButton>
          {notAvailableOutcomesStatus !== configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL && (
            <>
              <StyledPrenotazionePrimaryButton
                css={css`
                  grid-column: modifica;
                  background-color: #005936;
                  color: #fff;
                `}
                onClick={() => {
                  modifyTicket();
                }}
              >
                <FormattedMessage
                  description="button modifica modulo gestione prenotazione multibiglietto"
                  defaultMessage="Modifica"
                />
              </StyledPrenotazionePrimaryButton>

              {((ticketType === "Sistema" &&
                notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.NOTANY) ||
                ticketType !== "Sistema") && (
                <StyledPrenotazionePrimaryButton
                  css={css`
                    grid-column: vendi;
                    background-color: #005936;
                    color: #fff;
                  `}
                  onClick={() => {
                    onVendi();
                  }}
                >
                  <FormattedMessage
                    description="button vendi modulo gestione prenotazione multibiglietto"
                    defaultMessage="Vendi"
                  />
                </StyledPrenotazionePrimaryButton>
              )}
            </>
          )}
        </StyledDialogSubHeader>
      )}
    </div>
  );
}
