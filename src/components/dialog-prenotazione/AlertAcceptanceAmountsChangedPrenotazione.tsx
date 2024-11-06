import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IconDangerWhite } from "src/assets/images/icon-danger-white.svg";
import { ReactComponent as IconTimer } from "src/assets/images/icon-timer.svg";
import {
  alertColors,
  StyledAlertButtonPrimary,
  StyledAlertButtonSecondary,
  StyledAlertTitle,
  StyledDescription,
  StyledHeading,
} from "src/components/common/blocking-alert/BlockingAlert";
import { StyledDialogContainer } from "src/components/common/full-screen-alert/StyledDialogContainer";
import { getTicketResultUniqueMap } from "src/components/dialog-prenotazione/DialogPrenotazioneBody";
import { getTicketType } from "src/components/prenotazioni/MenuPrenotazioni";
import { Ticket, TicketResult } from "src/components/prenotazioni/prenotazioni-api";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";
import { css } from "styled-components/macro";

type AlertAcceptanceAmountsChangedPrenotazioneProps = {
  primaryButtonAction: () => void;
  secondaryButtonAction: () => void;
  oldPuntata: number;
  newPuntata: number;
  actualIndex: number;
  totalIndex: number;
  ticket: Ticket;
};
export function AlertAcceptanceAmountsChangedPrenotazione(props: AlertAcceptanceAmountsChangedPrenotazioneProps) {
  const { oldPuntata, newPuntata, primaryButtonAction, secondaryButtonAction, ticket, actualIndex, totalIndex } = props;
  const themeAlert = alertColors("danger");

  const filteredOutcomeList = ticket.results.filter(
    (outcome: TicketResult) => !(outcome.stato === 0 && !outcome.quota),
  );

  const ticketResultUniqueMap = useMemo(() => {
    return getTicketResultUniqueMap(filteredOutcomeList);
  }, [filteredOutcomeList]);

  const ticketResultUniqueMapLength = Object.keys(ticketResultUniqueMap).length;

  const [counter, setCounter] = useState(60);
  useEffect(() => {
    const interval = setInterval(() => {
      if (counter > 0) {
        setCounter((counter) => counter - 1);
      } else {
        secondaryButtonAction();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [counter, setCounter, secondaryButtonAction]);

  const ticketType = getTicketType(ticket);

  return (
    <StyledDialogContainer>
      <div
        css={css`
          display: flex;
          align-items: center;
          background-color: ${themeAlert.backgroundColor};
          height: 128px;
          width: 1065px;
          border-radius: 8px 8px 0 0;
          box-sizing: border-box;
          padding: 0 30px;
        `}
      >
        <StyledAlertTitle themeAlert={themeAlert}>
          <IconDangerWhite style={{ gridRow: `-1 / 1`, gridColumn: `icon`, height: `58px`, width: `58px` }} />
          <StyledHeading themeAlert={themeAlert}>
            <FormattedMessage
              description="header title of amounts changed acceptance alert"
              defaultMessage="Proposta nuova puntata"
            />
          </StyledHeading>
        </StyledAlertTitle>
      </div>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 30px;
          width: 1065px;
          border-radius: 0 0 8px 8px;
          box-sizing: border-box;
          background-color: #ffffff;
          color: #333333;
        `}
      >
        <StyledDescription>
          <FormattedMessage
            defaultMessage="La scommessa può essere convalidata per un importo di {newamount}"
            description="description of amounts changed acceptance alert"
            values={{ newamount: formatCurrency(decimalToIntegerValue(newPuntata)) }}
          />
        </StyledDescription>

        <div
          css={css`
            display: grid;
            grid-template-rows: [separator-top]30px [description] 23px [value] 21px [separator-bottom]auto;
            grid-template-columns: [puntata] auto [countdown] max-content [iconTimer]min-content;
            grid-column-gap: 30px;
            margin: 30px 0;
          `}
        >
          <div
            style={{ gridRow: `${"separator-top"}` }}
            css={css`
              grid-column: 1 / -1;
              height: 1px;
              background-color: #979797;
            `}
          />
          <div
            css={css`
              grid-column: puntata;
              grid-row: description;
              height: 23px;
              width: 91px;
              color: #333333;
              font-family: Mulish;
              font-size: 1.125rem;
              font-weight: 900;
              letter-spacing: 0;
              line-height: 23px;
              text-transform: uppercase;
            `}
          >
            <FormattedMessage
              defaultMessage="Puntata"
              description="new amount title of amounts changed acceptance alert"
            />
          </div>
          <div
            css={css`
              grid-column: puntata;
              grid-row: value;
              height: 21px;
              width: 209px;
              color: #333333;
              font-family: Roboto;
              font-size: 1.125rem;
              letter-spacing: 0;
              line-height: 21px;
            `}
          >
            <FormattedMessage
              defaultMessage="Da {oldpuntata} a <b>{newPuntata}</b>"
              description="old amount label of amounts changed acceptance alert"
              values={{
                oldpuntata: formatCurrency(decimalToIntegerValue(oldPuntata)),
                b: (chunks: string) => (
                  <span
                    css={`
                      font-weight: 700;
                    `}
                  >
                    {chunks}
                  </span>
                ),
                newPuntata: formatCurrency(decimalToIntegerValue(newPuntata)),
              }}
            />
          </div>

          <div
            css={css`
              grid-column: countdown;
              grid-row: description;
              color: #333333;
              font-family: Mulish;
              font-size: 1.125rem;
            `}
          >
            <FormattedMessage
              defaultMessage="Proposta in scadenza tra"
              description="countdown label of amounts changed acceptance alert"
            />
          </div>

          <div
            css={css`
              grid-column: countdown;
              grid-row: value;
              font-size: 1.125rem;
              font-weight: 900;
              letter-spacing: 0;
              line-height: 21px;
              text-align: right;
              color: #333333;
              font-family: Roboto;
            `}
          >
            {`${counter === 60 ? "00:01:00" : counter > 9 ? `00:00:${counter}` : `00:00:0${counter}`}`}
          </div>
          <IconTimer style={{ gridRow: `0 / 1`, gridColumn: `iconTimer` }} />
        </div>

        <div
          css={css`
            display: grid;
            grid-template-rows: [header] 51px repeat(${ticketResultUniqueMapLength}, [bet] min-content [separator] 1px);
            align-items: end;
            grid-column-gap: 20px;
            border: 1px solid #eaeaea;
            border-radius: 8px;
            margin-bottom: 30px;
          `}
        >
          <div
            css={css`
              display: grid;
              height: 51px;
              align-items: center;
              grid-row: header;
              grid-template-columns: [header-title] auto [ticketType] min-content;
              background-color: #f3f3f3;
              padding: 0px 20px;
              font-family: Mulish;
              font-size: 16px;
              font-weight: 800;
              letter-spacing: 0;
              line-height: 23px;
            `}
          >
            <div
              css={css`
                grid-column: header-title;
                color: #333333;
              `}
            >
              <FormattedMessage
                defaultMessage="Prenotazione <spanGrigio>n°</spanGrigio> {i} <spanGrigio>di {totale}</spanGrigio>"
                description="header lista esiti proposta accettazione"
                values={{
                  i: actualIndex,
                  totale: totalIndex,
                  spanGrigio: (chunks: string) => (
                    <span
                      css={css`
                        color: #979797;
                      `}
                    >
                      {chunks}
                    </span>
                  ),
                }}
              />
            </div>
            <div
              css={css`
                grid-column: ticketType;
                font-weight: 400;
              `}
            >
              {ticketType}
            </div>
          </div>
          <div
            css={css`
              max-height: 400px;
              overflow-y: auto;
              ::-webkit-scrollbar {
                width: 0 !important;
              }
            `}
          >
            {Object.keys(ticketResultUniqueMap).map((codiceAvvenimento, betIndex) => {
              const esiti = ticketResultUniqueMap[codiceAvvenimento];
              const firstEsito = esiti[0];
              return (
                <React.Fragment key={firstEsito.index ?? 0}>
                  {esiti.length > 0 && firstEsito && (
                    <>
                      <div
                        style={{
                          gridRow: `bet ${betIndex + 1} / separator ${betIndex + 1}`,
                        }}
                        css={css`
                          display: grid;
                          grid-template-rows: [evento] 20px [info-aggiuntiva] minmax(25px, auto);
                          padding: 15px 20px;
                        `}
                      >
                        <div
                          style={{ gridRow: `evento` }}
                          css={css`
                            color: #333333;
                            font-family: Roboto;
                            font-size: 0.875rem;
                            font-weight: bold;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                          `}
                        >
                          {ticketType === "Sistema" && firstEsito.fissa && (
                            <span
                              css={css`
                                letter-spacing: 0;
                                line-height: 19px;
                                margin-right: 5px;
                              `}
                            >
                              {`(F)`}
                            </span>
                          )}
                          {firstEsito.descrizioneAvvenimento}
                        </div>
                        <div
                          style={{
                            gridRow: `info-aggiuntiva`,
                          }}
                          css={css`
                            display: grid;
                            grid-template-columns: [descrizione] auto [esito] min-content;
                            grid-template-rows: repeat(${esiti.length}, [scommessa] min-content);
                            grid-column-gap: 20px;
                            grid-row-gap: 14px;
                            align-self: flex-end;
                            color: #000000;
                            font-family: Roboto;
                            font-size: 0.875rem;
                            font-weight: 300;
                            margin-top: 5px;
                            align-items: center;
                          `}
                        >
                          {esiti.map((esito, esitoIndex) => {
                            return (
                              <React.Fragment key={esito.pronosticoKey}>
                                <div
                                  style={{
                                    gridRow: `scommessa ${esitoIndex + 1}`,
                                    gridColumn: `descrizione`,
                                  }}
                                  css={css`
                                    max-width: 300px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                    grid-column: descrizione;
                                  `}
                                >
                                  {esito.descrizioneInfoAggiuntiva
                                    ? esito.descrizioneInfoAggiuntiva
                                    : esito.descrizioneScommessa}
                                </div>

                                <div
                                  style={{ gridRow: `scommessa ${esitoIndex + 1}`, gridColumn: `esito` }}
                                  css={css`
                                    box-sizing: border-box;
                                    border: 1px solid #dcdcdc;
                                    border-radius: 25px;
                                    color: #222222;
                                    font-family: Roboto;
                                    font-size: 1rem;
                                    font-weight: 500;
                                    padding: 2px 16px;
                                    width: min-content;
                                    max-width: 400px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                  `}
                                >
                                  {esito.descrizioneEsito}
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                      <div
                        hidden={
                          ticketType !== "Sistema" &&
                          (betIndex + 1 === ticketResultUniqueMapLength || ticketResultUniqueMapLength === 1)
                        }
                        style={{ gridRow: `separator ${betIndex + 1}` }}
                        css={css`
                          grid-column: 1 / -1;
                          height: 1px;
                          background-color: #dcdcdc;
                          margin: 0;
                        `}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div
          style={{ gridRow: `${"separator-bottom"}` }}
          css={css`
            grid-column: 1 / -1;
            height: 1px;
            background-color: #979797;
          `}
        />
        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(2, [button] 150px);
            grid-column-gap: 10px;
            justify-content: flex-end;
            margin-top: 30px;
          `}
        >
          <StyledAlertButtonSecondary
            onClick={() => {
              secondaryButtonAction();
            }}
          >
            <FormattedMessage
              description="rifiuta button of amounts changed acceptance alert"
              defaultMessage="Rifiuta"
            />
          </StyledAlertButtonSecondary>

          <StyledAlertButtonPrimary
            onClick={() => {
              primaryButtonAction();
            }}
          >
            <FormattedMessage
              description="accetta button of amounts changed acceptance alert"
              defaultMessage="Accetta"
            />
          </StyledAlertButtonPrimary>
        </div>
      </div>
    </StyledDialogContainer>
  );
}
