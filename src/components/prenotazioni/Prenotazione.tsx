import React, { useCallback, useContext, useState } from "react";
import styled, { css } from "styled-components/macro";
import { dateFormatterWithoutweekDay, timeFormatterWithSecond } from "src/helpers/format-date";
import {
  Prenotazione as PrenotazioneDTO,
  Booking,
  getPrenotazioneByNickName,
  Ticket,
} from "src/components/prenotazioni/prenotazioni-api";
import { EliminaPrenotazione } from "src/components/prenotazioni/EliminaPrenotazione";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { formatCurrency, decimalToIntegerValue } from "src/helpers/formatCurrencyAmountUtils";
import { FormattedMessage } from "react-intl";
import { NickName } from "src/types/chiavi";
import { mutate } from "swr";
import { TicketIndex } from "src/components/dialog-prenotazione/DialogPrenotazioneMultiBiglietto";
import { AmountsChangedResponse, VenditaSuccessResponse } from "src/types/vendita.types";
import { BonusConfigClassType } from "src/types/bonusConfig.type";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { getBookingProvenanceInfo, getFirstMappedAttribute } from "src/components/prenotazioni/MenuPrenotazioni";

type PrenotazioneProps = {
  prenotazione: Booking;
  date: Date;
  ticketsCountMessage: string;
  onSuccessDelete: () => void;
  onTicketSell(
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
  pushToast(content: React.ReactNode, duration: number): void;
};

export function Prenotazione({
  prenotazione,
  date,
  ticketsCountMessage,
  onSuccessDelete,
  onTicketSell,
}: PrenotazioneProps) {
  const [viewDeletePopup, setViewDeletePopup] = useState(false);
  const { bonusConfig } = useContext(GlobalStateContext);
  const {
    openDialogPrenotazioneByNick,
    openSellDialogPrenotazioneFromList,
    openSellDialogPrenotazioneMultiBigliettoFromList,
  } = useNavigazioneActions();

  const sellTickets = useCallback(async () => {
    if (prenotazione.openTicketsCount === 1) {
      openSellDialogPrenotazioneFromList(0, prenotazione.nickName);
    } else {
      openSellDialogPrenotazioneMultiBigliettoFromList(prenotazione.nickName, 1, prenotazione.openTicketsCount);
    }

    const schedaPrenotazione: PrenotazioneDTO = await mutate(
      prenotazione.nickName,
      getPrenotazioneByNickName(prenotazione.nickName),
    );

    const ticketViewed: number[] = [];
    const ticketToSellList = schedaPrenotazione.tickets.filter((ticket) => ticket.status !== "Sent");
    const ticketToSellListIndex = 0;
    const totalSellTicket = 0;
    const selledTicketsList = {};
    const notSelledTicketsList = {};
    const allTicketSent = prenotazione.openTicketsCount === 1;

    onTicketSell(
      prenotazione.nickName,
      ticketViewed,
      ticketToSellList,
      ticketToSellListIndex,
      selledTicketsList,
      notSelledTicketsList,
      totalSellTicket,
      allTicketSent,
      bonusConfig,
    );
  }, [
    prenotazione,
    bonusConfig,
    onTicketSell,
    openSellDialogPrenotazioneFromList,
    openSellDialogPrenotazioneMultiBigliettoFromList,
  ]);

  const attribute = getFirstMappedAttribute(prenotazione.attributes);
  const provenanceInfo = attribute && getBookingProvenanceInfo(attribute);

  return (
    <div
      css={css`
        display: grid;
        grid-template-rows: [descrizioneNickName] 112px [separator] auto;
        align-items: center;
        margin: 0 -40px;
        padding: 0 40px;
        background-color: #ffffff;
      `}
    >
      {viewDeletePopup ? (
        <EliminaPrenotazione
          nickname={prenotazione.nickName}
          onAnnulla={() => {
            setViewDeletePopup(false);
          }}
          onProcedi={() => {
            setViewDeletePopup(false);
            onSuccessDelete();
          }}
        />
      ) : (
        <div
          css={css`
            display: grid;
            grid-template-columns: [info] 1fr repeat(3, [button] auto);
            align-items: center;
            column-gap: 10px;
            margin: 0 -40px;
            padding: 0 40px;
            cursor: pointer;
            &:hover {
              background-color: rgba(170, 194, 31, 0.1);
            }
          `}
        >
          <div
            css={css`
              grid-row: descrizioneNickName;
              padding: 25px 0;
              height: 112px;
              box-sizing: border-box;
            `}
            onClick={() => openDialogPrenotazioneByNick(prenotazione.nickName)}
          >
            <div
              css={css`
                display: grid;
                grid-template-columns: [nickname] max-content [tickets] max-content [sistema] max-content;
                align-items: center;
                column-gap: 5px;
                margin-bottom: 15px;
              `}
            >
              <StyledNickName>{prenotazione.nickName}</StyledNickName>
              <StyledTicketsCount>{prenotazione.openTicketsCount}</StyledTicketsCount>
              {prenotazione.openSystemTicketsCount > 0 && <StyledBadgeSystem>sistema</StyledBadgeSystem>}
            </div>
            <div
              css={css`
                display: grid;
                grid-template-columns: [creazione] max-content [provenienza] 150px [importo] max-content;
                column-gap: 40px;
              `}
            >
              <StyledPrenotazioneInfoLabel style={{ gridColumn: "creazione" }}>
                <FormattedMessage description="Creata il Prenotazione label list " defaultMessage="Creata il" />
                <StyledPrenotazioneInfoValue>
                  {dateFormatterWithoutweekDay.format(date)} - {timeFormatterWithSecond.format(date)}
                </StyledPrenotazioneInfoValue>
              </StyledPrenotazioneInfoLabel>

              {provenanceInfo && (
                <StyledPrenotazioneInfoLabel style={{ gridColumn: "provenienza" }}>
                  <FormattedMessage description="Provenance label in booking list" defaultMessage="Provenienza" />
                  <StyledPrenotazioneInfoValue>
                    <FormattedMessage
                      description="Provenance value in booking list"
                      defaultMessage="{provenancevalue}"
                      values={{ provenancevalue: provenanceInfo.message }}
                    />
                  </StyledPrenotazioneInfoValue>
                </StyledPrenotazioneInfoLabel>
              )}

              <StyledPrenotazioneInfoLabel style={{ gridColumn: "importo" }}>
                <FormattedMessage
                  defaultMessage="Importo"
                  description="description of amount of booking in bookings list"
                />
                <StyledPrenotazioneInfoValue>
                  {formatCurrency(decimalToIntegerValue(prenotazione.stakeAmount))}
                </StyledPrenotazioneInfoValue>
              </StyledPrenotazioneInfoLabel>
            </div>
          </div>
          <StyledButton
            style={{ gridRow: `descrizioneNickName` }}
            css={css`
              grid-column: button 1;
              background-color: #fff;
              color: #005936;
            `}
            onClick={() => {
              setViewDeletePopup(true);
            }}
          >
            <FormattedMessage
              description="Elimina Prenotazione button list "
              defaultMessage="Elimina {counter}"
              values={{ counter: ticketsCountMessage }}
            />
          </StyledButton>
          <StyledButton
            style={{ gridRow: `descrizioneNickName` }}
            onClick={() => openDialogPrenotazioneByNick(prenotazione.nickName)}
            css={css`
              grid-column: button 2;
              background-color: #005936;
              color: #fff;
            `}
          >
            <FormattedMessage description="Gestisci Prenotazione button list " defaultMessage="Gestisci" />
          </StyledButton>
          <StyledButton
            style={{ gridRow: `descrizioneNickName` }}
            css={css`
              grid-column: button 3;
              background-color: #005936;
              color: #fff;
            `}
            onClick={() => {
              sellTickets();
            }}
          >
            <FormattedMessage
              description="Vendi Prenotazione button list "
              defaultMessage="Vendi {counter}"
              values={{ counter: ticketsCountMessage }}
            />
          </StyledButton>
        </div>
      )}
      <div
        style={{ gridRow: `separator` }}
        css={css`
          grid-column: 1 / -1;
          height: 1px;
          background-color: #dcdcdc;
          margin: 0 -40px;
        `}
      />
    </div>
  );
}
export const StyledNickName = styled.div`
  grid-column: nickname;
  color: #005936;
  font-family: Mulish;
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 23px;
  grid-column: [nickName];
`;

export const StyledTicketsCount = styled.div`
  grid-column: tickets;
  box-sizing: border-box;
  height: 20px;
  width: 24px;
  border-radius: 10px;
  background-color: #222222;
  color: #ffffff;
  text-align: center;
  font-family: Mulish;
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledBadgeSystem = styled.div`
  grid-column: sistema;
  box-sizing: border-box;
  border: 1px solid #222222;
  border-radius: 10px;
  color: #000000;
  font-family: Mulish;
  font-size: 0.625rem;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  padding: 3px;
`;

export const StyledPrenotazioneInfoLabel = styled.div`
  color: #777777;
  font-family: Roboto;
  font-size: 0.875rem;
  letter-spacing: 0;
  line-height: 24px;
  display: inline-flex;
`;

export const StyledPrenotazioneInfoValue = styled.div`
  color: #333333;
  font-family: Roboto;
  font-size: 0.875rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 23px;
  margin-left: 5px;
`;

export const StyledButton = styled.button`
  box-sizing: border-box;
  border: 2px solid #005936;
  border-radius: 8px;
  height: 50px;
  width: 150px;
  font-family: Mulish;
  font-size: 1.125rem;
  font-weight: bold;
  &:hover {
    cursor: pointer;
  }
`;
