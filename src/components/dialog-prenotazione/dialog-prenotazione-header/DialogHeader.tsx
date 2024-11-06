import { useState } from "react";
import { Prenotazione, Ticket } from "src/components/prenotazioni/prenotazioni-api";
import { StyledNickName } from "src/components/dialog-prenotazione/DialogPrenotazioneSingoloBiglietto";
import styled, { css } from "styled-components/macro";
import { EliminaPrenotazione } from "src/components/prenotazioni/EliminaPrenotazione";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { FormattedMessage } from "react-intl";
import { formatCurrency, decimalToIntegerValue } from "src/helpers/formatCurrencyAmountUtils";

export type HeaderButtonDialogProps = {
  ticketsNumber: number;
  schedaPrenotazione: Prenotazione;
  importoBigliettiVenduti: number;
  onVendiTutte(): void;
  validTickets: Ticket[];
};
export function HeaderButtonDialog({
  ticketsNumber,
  schedaPrenotazione,
  onVendiTutte,
  importoBigliettiVenduti,
  validTickets,
}: HeaderButtonDialogProps) {
  const { closeDialogPrenotazione } = useNavigazioneActions();
  const [viewDeletePopup, setViewDeletePopup] = useState(false);
  const totalPrice = validTickets.reduce((a, ticket) => a + ticket.sellingPrice, 0);

  return (
    <div
      css={css`
        display: grid;
        height: 100%;
        align-items: center;
        margin: 0 30px;
      `}
    >
      {viewDeletePopup ? (
        <EliminaPrenotazione
          nickname={schedaPrenotazione.mainNickname}
          onAnnulla={() => {
            setViewDeletePopup(false);
          }}
          onProcedi={() => {
            closeDialogPrenotazione(schedaPrenotazione.mainNickname);
          }}
        />
      ) : (
        <div
          css={css`
            display: grid;
            grid-template-columns: [nick-date-info] auto [costo-buttons] auto;
            height: 100%;
            align-items: center;
          `}
        >
          <div
            css={css`
              display: grid;
              grid-template-columns: [nickname] max-content [date] max-content;
              column-gap: 10px;
            `}
          >
            <StyledNickName style={{ gridColumn: "nickname" }}>{schedaPrenotazione?.mainNickname}</StyledNickName>
          </div>

          <div
            css={css`
              display: grid;
              grid-template-columns: [costoTotale] 1fr repeat(2, [button] auto);
              column-gap: 10px;
            `}
          >
            {importoBigliettiVenduti === 0 ? (
              <StyledCostoTotale>
                <FormattedMessage
                  description="costo totale header biglietto modulo gestione prenotazione multibiglietto"
                  defaultMessage="Costo totale"
                />
                <span
                  css={css`
                    padding-left: 20px;
                  `}
                >
                  {formatCurrency(decimalToIntegerValue(totalPrice))}
                </span>
              </StyledCostoTotale>
            ) : (
              <div
                css={css`
                  display: grid;
                  grid-template-columns: [text] max-content [importo] max-content;
                  grid-column-gap: 20px;
                  grid-row-gap: 5px;
                  justify-content: flex-end;
                  align-items: center;
                  color: #ffffff;
                  font-family: Roboto;
                  font-size: 20px;
                  text-align: right;
                  font-weight: 300;
                `}
              >
                <div
                  css={css`
                    grid-column: text;
                  `}
                >
                  <FormattedMessage
                    description="Importo biglietti venduti header biglietto modulo gestione prenotazione multibiglietto"
                    defaultMessage="Importo biglietti<b> venduti</b>"
                    values={{
                      b: (chunks: string) => (
                        <span
                          css={css`
                            font-weight: 900;
                          `}
                        >
                          {chunks}
                        </span>
                      ),
                    }}
                  />
                </div>
                <span
                  css={css`
                    grid-column: importo;
                    padding-left: 20px;
                  `}
                >
                  {formatCurrency(decimalToIntegerValue(importoBigliettiVenduti))}
                </span>
                <div
                  css={css`
                    grid-column: text;
                  `}
                >
                  <FormattedMessage
                    description="Importo biglietti da vendere header biglietto modulo gestione prenotazione multibiglietto"
                    defaultMessage="Importo biglietti<b> da vendere</b>"
                    values={{
                      b: (chunks: string) => (
                        <span
                          css={css`
                            font-weight: 900;
                          `}
                        >
                          {chunks}
                        </span>
                      ),
                    }}
                  />
                </div>
                <span
                  css={css`
                    grid-column: importo;
                    padding-left: 20px;
                  `}
                >
                  {formatCurrency(decimalToIntegerValue(totalPrice - importoBigliettiVenduti))}
                </span>
              </div>
            )}

            <StyledHeaderButton
              css={css`
                grid-column: button 1;
                background-color: #333333;
                border: 2px solid #ffffff;
              `}
              onClick={() => {
                setViewDeletePopup(true);
              }}
            >
              <FormattedMessage
                description="button elimina tutto modulo gestione prenotazione multibiglietto"
                defaultMessage="Elimina tutti ({ticketsnumber})"
                values={{ ticketsnumber: ticketsNumber }}
              />
            </StyledHeaderButton>
            <StyledHeaderButton
              css={css`
                grid-column: button 2;
                background-color: #005936;
                border: 2px solid #005936;
              `}
              onClick={onVendiTutte}
            >
              <FormattedMessage
                description="button vendi tutti modulo gestione prenotazione multibiglietto"
                defaultMessage="Vendi tutti ({ticketsnumber})"
                values={{ ticketsnumber: ticketsNumber }}
              />
            </StyledHeaderButton>
          </div>
        </div>
      )}
    </div>
  );
}

const StyledCostoTotale = styled.div`
  color: #ffffff;
  font-family: Roboto;
  font-size: 1.375rem;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 23px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 17.5px;
`;

const StyledHeaderButton = styled.div`
  height: 50px;
  width: 150px;
  color: #ffffff;
  font-family: Mulish;
  justify-content: center;
  display: flex;
  align-items: center;
  font-size: 1.125rem;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
`;
