import { useContext } from "react";

import { getTicketType } from "src/components/prenotazioni/MenuPrenotazioni";
import { Ticket } from "src/components/prenotazioni/prenotazioni-api";
import styled, { css } from "styled-components/macro";
import { truncate } from "src/helpers/format-data";
import {
  getBonusForTicket,
  getNotAvailableOutcomesStatus,
} from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { FormattedMessage } from "react-intl";
import configuration from "src/helpers/configuration";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { decimalToIntegerWithoutFormatting } from "src/helpers/formatUtils";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";

type DialogPrenotazioneSingolaMultiplaProps = {
  ticket: Ticket;
};
export function DialogPrenotazioneFooterSingolaMultipla({ ticket }: DialogPrenotazioneSingolaMultiplaProps) {
  const ticketType = getTicketType(ticket);

  const { bonusConfig } = useContext(GlobalStateContext);
  const { totalOdds, percentualBonus, potentialWin, bonusInEuro } = getBonusForTicket(ticket, bonusConfig);

  const notAvailableOutcomesStatus = getNotAvailableOutcomesStatus(ticket);
  return (
    <FooterContainer>
      <div
        css={css`
          display: grid;
          grid-template-columns: [description] 1fr [price] minmax(140px, max-content) ${ticket.results.length > 1
              ? "[trash-placeholder] 26px"
              : ""};
          grid-template-rows: [quotaTotale] auto [puntata] auto [bonusMultipla] auto;
          grid-column-gap: 10px;
        `}
      >
        <div
          css={css`
            grid-column: description;
            grid-row: quotaTotale;
            color: #444444;
            font-family: Roboto;
            font-size: 1rem;
            letter-spacing: 0;
            line-height: 23px;
            text-align: right;
          `}
        >
          <FormattedMessage
            description="Quota totale footer  biglietto modulo gestione prenotazione multibiglietto"
            defaultMessage="Quota totale"
          />
        </div>
        <div
          css={css`
            grid-column: price;
            grid-row: quotaTotale;
            color: #444444;
            font-family: Roboto;
            font-size: 1rem;
            font-weight: bold;
            letter-spacing: 0;
            line-height: 23px;
          `}
        >
          {notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL
            ? "-"
            : decimalToIntegerWithoutFormatting(totalOdds).toFixed(2)}
        </div>
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
            description="Puntata footer biglietto modulo gestione prenotazione multibiglietto"
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
          {notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL
            ? "-"
            : formatCurrency(decimalToIntegerValue(ticket.sellingPrice))}
        </div>
        {ticketType === "Multipla" && percentualBonus > 1 && (
          <>
            <div
              css={css`
                grid-column: description;
                grid-row: bonusMultipla;
                color: #444444;
                font-family: Roboto;
                font-size: 1rem;
                letter-spacing: 0;
                line-height: 23px;
                text-align: right;
              `}
            >
              <FormattedMessage
                description="Bonus footer biglietto modulo gestione prenotazione multibiglietto"
                defaultMessage="Bonus"
              />
              ({truncate(percentualBonus, 2)})
            </div>
            <div
              css={css`
                grid-column: price;
                grid-row: bonusMultipla;
                color: #444444;
                font-family: Roboto;
                font-size: 1rem;
                font-weight: bold;
                letter-spacing: 0;
                line-height: 23px;
              `}
            >
              {notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL
                ? "-"
                : formatCurrency(Number(bonusInEuro.replace(",", ".")))}
            </div>
          </>
        )}
      </div>

      <div
        css={css`
          display: grid;
          grid-template-columns: [vincitaPotenziale] 1fr [priceVincitaPotenziale] minmax(140px, max-content) ${ticket
              .results.length > 1
              ? "[trash-placeholder] 26px"
              : ""};
          grid-column-gap: 10px;
          margin-top: 22px;
        `}
      >
        <div
          css={css`
            grid-column: vincitaPotenziale;
            color: #000000;
            font-family: Roboto;
            font-size: 1.25rem;
            font-weight: bold;
            letter-spacing: 0;
            line-height: 23px;
          `}
        >
          <FormattedMessage
            description="vincita potenziale footer modulo gestione prenotazione multibiglietto"
            defaultMessage="Vincita Potenziale"
          />
        </div>
        <div
          css={css`
            grid-column: priceVincitaPotenziale;
            color: #000000;
            font-family: Roboto;
            font-size: 1.25rem;
            font-weight: bold;
            letter-spacing: 0;
            line-height: 23px;
          `}
        >
          {notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL
            ? "-"
            : formatCurrency(decimalToIntegerWithoutFormatting(potentialWin))}
        </div>
      </div>
    </FooterContainer>
  );
}

const FooterContainer = styled.div`
  background-color: #ffffff;
  border-radius: 0px 0px 12px 12px;
  text-align: right;
  padding: 30px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
  position: relative;
`;
