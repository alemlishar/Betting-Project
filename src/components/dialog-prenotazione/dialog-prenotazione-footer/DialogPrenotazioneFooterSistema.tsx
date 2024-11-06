import React from "react";
import { Ticket, SviluppoSistema } from "src/components/prenotazioni/prenotazioni-api";
import styled, { css } from "styled-components/macro";
import { getNotAvailableOutcomesStatus } from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { ChiaveAvvenimento, makeChiaveAvvenimento } from "src/types/chiavi";
import { FormattedMessage } from "react-intl";
import configuration from "src/helpers/configuration";
import { formatCurrency, decimalToIntegerValue } from "src/helpers/formatCurrencyAmountUtils";

type DialogPrenotazioneSistemaProps = {
  ticket: Ticket;
  sviluppoSistema?: SviluppoSistema;
};
export function DialogPrenotazioneFooterSistema({ ticket, sviluppoSistema }: DialogPrenotazioneSistemaProps) {
  const isSistemaCorrezioneErrore = (() => {
    let ticketMap: Record<ChiaveAvvenimento, number> = {};

    ticket.results.forEach((ticketResult) => {
      if (!(ticketResult.stato === 0 && !ticketResult.quota)) {
        if (!ticketMap[makeChiaveAvvenimento(ticketResult)]) {
          ticketMap = { ...ticketMap, [makeChiaveAvvenimento(ticketResult)]: 0 };
        }
        ticketMap[makeChiaveAvvenimento(ticketResult)]++;
      }
    });
    return Object.values(ticketMap).every((number) => number === 1);
  })();

  const notAvailableOutcomesStatus = getNotAvailableOutcomesStatus(ticket);

  return (
    <FooterContainer>
      <div
        css={css`
          display: grid;
          grid-template-columns: [description] 1fr [price] minmax(140px, max-content) ${ticket.results.length > 1
              ? "[trash-placeholder] 26px"
              : ""};
          grid-template-rows: [puntata] auto ${isSistemaCorrezioneErrore
              ? "[vincitaPotenzialeMin] auto  [vincitaPotenzialeMax] auto "
              : ""};
          grid-column-gap: 10px;
        `}
      >
        {sviluppoSistema && (
          <>
            <div
              css={css`
                grid-column: description;
                grid-row: puntata;
                color: #444444;
                font-family: Roboto;
                font-size: 1rem;
                letter-spacing: 0;
                line-height: 23px;
                text-align: right;
              `}
            >
              <FormattedMessage
                description="Puntata footer sistema  biglietto modulo gestione prenotazione multibiglietto"
                defaultMessage="Puntata"
              />
            </div>
            <div
              css={css`
                grid-column: price;
                grid-row: puntata;
                color: #444444;
                font-family: Roboto;
                font-size: 1rem;
                font-weight: bold;
                letter-spacing: 0;
                line-height: 23px;
              `}
            >
              {notAvailableOutcomesStatus !== configuration.NOT_AVAILABLE_OUTCOMES_STATUS.NOTANY
                ? "-"
                : formatCurrency(decimalToIntegerValue(sviluppoSistema.costoTotale))}
            </div>

            {isSistemaCorrezioneErrore && (
              <>
                <div
                  css={css`
                    grid-column: description;
                    grid-row: vincitaPotenzialeMin;
                    color: #444444;
                    font-family: Roboto;
                    font-size: 1rem;
                    letter-spacing: 0;
                    line-height: 23px;
                    text-align: right;
                  `}
                >
                  <FormattedMessage
                    description=" Vincita potenziale minima footer sistema biglietto modulo gestione prenotazione multibiglietto"
                    defaultMessage=" Vincita potenziale minima"
                  />
                </div>
                <div
                  css={css`
                    grid-column: price;
                    grid-row: vincitaPotenzialeMin;
                    color: #444444;
                    font-family: Roboto;
                    font-size: 1rem;
                    font-weight: bold;
                    letter-spacing: 0;
                    line-height: 23px;
                  `}
                >
                  {notAvailableOutcomesStatus !== configuration.NOT_AVAILABLE_OUTCOMES_STATUS.NOTANY
                    ? "-"
                    : formatCurrency(decimalToIntegerValue(sviluppoSistema.vincitaMinimaTotale))}
                </div>

                <div
                  css={css`
                    grid-column: description;
                    grid-row: vincitaPotenzialeMax;
                    color: #444444;
                    font-family: Roboto;
                    font-size: 1rem;
                    letter-spacing: 0;
                    line-height: 23px;
                    text-align: right;
                  `}
                >
                  <FormattedMessage
                    description=" Vincita potenziale massima footer sistema biglietto modulo gestione prenotazione multibiglietto"
                    defaultMessage=" Vincita potenziale massima"
                  />
                </div>
                <div
                  css={css`
                    grid-column: price;
                    grid-row: vincitaPotenzialeMax;
                    color: #444444;
                    font-family: Roboto;
                    font-size: 1rem;
                    font-weight: bold;
                    letter-spacing: 0;
                    line-height: 23px;
                  `}
                >
                  {notAvailableOutcomesStatus !== configuration.NOT_AVAILABLE_OUTCOMES_STATUS.NOTANY
                    ? "-"
                    : formatCurrency(decimalToIntegerValue(sviluppoSistema.vincitaTotale))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </FooterContainer>
  );
}

const FooterContainer = styled.div`
  background-color: #ffffff;
  border-radius: 0px 0px 12px 12px;
  text-align: right;
  padding: 30px;
  position: relative;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
`;
