import { useCallback, useState } from "react";
import { NickName } from "src/types/chiavi";
import { Ticket } from "src/components/prenotazioni/prenotazioni-api";
import {
  StyledDescription,
  StyledDialogSubHeader,
} from "src/components/dialog-prenotazione/DialogPrenotazioneSingoloBiglietto";
import styled, { css } from "styled-components/macro";
import { getTicketType } from "src/components/prenotazioni/MenuPrenotazioni";
import { EliminaPrenotazione } from "src/components/prenotazioni/EliminaPrenotazione";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { getNotAvailableOutcomesStatus } from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { ModificaPrenotazione } from "src/components/prenotazioni/ModificaPrenotazione";
import { FormattedMessage } from "react-intl";
import configuration from "src/helpers/configuration";

export type SubHeaderDialogProps = {
  ticket: Ticket;
  nickname: NickName;
  modificaBiglietto: (ticket: Ticket) => "error" | "success";
  deleteClosedOrSuspendedOutcomes: () => void;
  onVendi: () => void;
};
export function SubHeaderDialog({
  ticket,
  nickname,
  modificaBiglietto,
  deleteClosedOrSuspendedOutcomes,
  onVendi,
}: SubHeaderDialogProps) {
  const {
    closeDialogPrenotazione,
    openSezioneSport,
    openSellDialogPrenotazione,
    minimizeDialogPrenotazione,
  } = useNavigazioneActions();
  const ticketType = getTicketType(ticket);
  const [viewDeletePopup, setViewDeletePopup] = useState(false);
  const notAvailableOutcomesStatus = getNotAvailableOutcomesStatus(ticket);

  const getClosedOrSuspendedOutcomeList = ticket.results.filter((outcome) => {
    return (outcome.stato === 0 && outcome.quota) || outcome.stato === 2;
  });

  const onClose = useCallback(() => {
    closeDialogPrenotazione(nickname);
  }, [closeDialogPrenotazione, nickname]);
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
        <EliminaPrenotazione
          nickname={nickname}
          onAnnulla={() => {
            setViewDeletePopup(false);
          }}
          onProcedi={() => {
            onClose();
          }}
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
          <StyledDescription>{ticketType}</StyledDescription>
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
                description="button elimina esiti chiusi/sospesi subheader biglietto modulo gestione prenotazione multibiglietto"
                defaultMessage="Elimina esiti chiusi/sospesi ({closedsuspendedoutcomelist})"
                values={{ closedsuspendedoutcomelist: getClosedOrSuspendedOutcomeList.length }}
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
              description="button elimina subheader biglietto modulo gestione prenotazione multibiglietto"
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
                  description="button modifica subheader biglietto modulo gestione prenotazione multibiglietto"
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
                    openSellDialogPrenotazione(ticket.index);
                    onVendi();
                  }}
                >
                  <FormattedMessage
                    description="button vendi subheader biglietto modulo gestione prenotazione multibiglietto"
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

export const StyledPrenotazionePrimaryButton = styled.div`
  box-sizing: border-box;
  height: 50px;
  width: 150px;
  border: 2px solid #005936;
  border-radius: 8px;
  display: inline-flex;
  justify-content: center;
  font-family: Mulish;
  font-size: 1.125rem;
  padding: 15px 17px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
`;
