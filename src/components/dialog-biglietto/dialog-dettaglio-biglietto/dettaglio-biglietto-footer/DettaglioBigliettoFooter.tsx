import { createRef, RefObject, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { TicketType } from "../../../../types/ticket.types";
import { EventType } from "../../../../types/event.types";
import { TicketStatusMapping } from "../../../../mapping/TicketStatusMapping";
import { DettaglioFooterRow } from "./DettaglioFooterRow";
import { TicketTypeEnum } from "src/mapping/TicketTypeMapping";
import {
  calculatorEuroBonus,
  calculatorUnformattedPercentualBonus,
  producerOfTotalQuote,
} from "src/helpers/calculationUtils";
import { ConfigToEvaluateFormat, decimalToInteger, formattedQuota } from "src/helpers/formatUtils";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";

export const DettaglioBigliettoFooter = ({ dettaglioBiglietto }: { dettaglioBiglietto: TicketType }) => {
  const isSingolaMultipla = dettaglioBiglietto.ticketType.valueOf() === "ACCUMULATOR";
  const numeroEsitiForBonus = dettaglioBiglietto.events.filter((eventSport) =>
    dettaglioBiglietto.bonus?.minimumOdds ? eventSport.outcomeValue > dettaglioBiglietto.bonus.minimumOdds : false,
  ).length;
  const bonus =
    dettaglioBiglietto.bonus?.value == null || dettaglioBiglietto.bonus?.value === 0
      ? { value: 1, factor: 0 }
      : calculatorUnformattedPercentualBonus(
          dettaglioBiglietto.bonus.value,
          dettaglioBiglietto.bonus.minimumEvents ?? 1,
          numeroEsitiForBonus,
        );
  const quote = dettaglioBiglietto.events.map((evento) => {
    return evento.outcomeValue;
  });
  const totalQuote = producerOfTotalQuote(quote, bonus);
  const potentialWin = maxWin(totalQuote, dettaglioBiglietto);
  const isCorrezioneErrori =
    dettaglioBiglietto.ticketType.valueOf() === "SYSTEM" ? isSistemaCorrezioneErrori(dettaglioBiglietto.events) : false;

  const refs: Array<RefObject<HTMLDivElement>> = Array.from(Array(8).keys()).map(() => createRef<HTMLDivElement>());
  const [largestColumnWidth, setLargestColumnWidth] = useState(0);

  const quota = "Quota totale";
  const importoGiocato = "Importo giocato";
  const singolaVincitaPotenziale = "Vincita potenziale";
  const singolaVincita = "Vincita totale";
  const rimborso = "Importo rimborso";

  const sistemaVincitaMinima = "Vincita potenziale minima";
  const sistemaVincitaMassima = "Vincita potenziale massima";
  const sistemaVincita = "Vincita effettiva";

  useEffect(() => {
    const widths = refs
      .filter((col) => col && col.current && !isNaN(col.current.offsetWidth))
      .map((col) => (col.current ? col.current.offsetWidth : 0));
    setLargestColumnWidth(Math.max(...widths));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledDettaglioBigliettoFooter>
      {isSingolaMultipla && (
        <DettaglioFooterRow
          label={quota}
          amount={formattedQuota(totalQuote)}
          rowRef={refs[0]}
          largestColumnWidth={largestColumnWidth}
          isNotEmphasisRow={true}
        />
      )}
      <DettaglioFooterRow
        dataQa={`importo-${dettaglioBiglietto.ticketId}`}
        label={importoGiocato}
        amount={formatCurrency(decimalToIntegerValue(dettaglioBiglietto.sellingAmount))}
        rowRef={refs[1]}
        largestColumnWidth={largestColumnWidth}
        isNotEmphasisRow={true}
      />
      {dettaglioBiglietto.ticketType === TicketTypeEnum.SYSTEM || bonus.value === 1 || bonus.value === 0 ? (
        ""
      ) : (
        <div className="ticket-bonus">
          <DettaglioFooterRow
            label={`Bonus (${decimalToInteger(bonus)})`}
            amount={formatCurrency(
              Number(calculatorEuroBonus(bonus, dettaglioBiglietto.sellingAmount, totalQuote).replace(",", ".")),
            )}
            rowRef={refs[2]}
            largestColumnWidth={largestColumnWidth}
            isNotEmphasisRow={true}
          />
        </div>
      )}

      {isSingolaMultipla &&
        !(
          TicketStatusMapping.hasANetWin(dettaglioBiglietto.status) ||
          TicketStatusMapping.hasARefund(dettaglioBiglietto.status)
        ) && (
          <DettaglioFooterRow
            label={singolaVincitaPotenziale}
            amount={formatCurrency(decimalToIntegerValue(potentialWin))}
            rowRef={refs[3]}
            largestColumnWidth={largestColumnWidth}
            isNotEmphasisRow={true}
          />
        )}

      {!isSingolaMultipla && isCorrezioneErrori && (
        <>
          <div className="min-potential-win">
            <DettaglioFooterRow
              label={sistemaVincitaMinima}
              amount={formatCurrency(decimalToIntegerValue(dettaglioBiglietto.minWinning || 0))}
              rowRef={refs[4]}
              largestColumnWidth={largestColumnWidth}
              isNotEmphasisRow={true}
            />
          </div>
          <div className="max-potential-win">
            <DettaglioFooterRow
              rowRef={refs[5]}
              label={sistemaVincitaMassima}
              amount={formatCurrency(decimalToIntegerValue(dettaglioBiglietto.maxWinning || 0))}
              largestColumnWidth={largestColumnWidth}
              isNotEmphasisRow={true}
            />
          </div>
        </>
      )}

      {TicketStatusMapping.hasANetWin(dettaglioBiglietto.status) && (
        <div className="actual-win final-row">
          <DettaglioFooterRow
            dataQa={`vincitaeffettiva-${dettaglioBiglietto.ticketId}`}
            label={isSingolaMultipla ? singolaVincita : sistemaVincita}
            amount={formatCurrency(decimalToIntegerValue(dettaglioBiglietto.paymentAmount))}
            rowRef={refs[6]}
            largestColumnWidth={largestColumnWidth}
            isNotEmphasisRow={false}
          />
        </div>
      )}
      {TicketStatusMapping.hasARefund(dettaglioBiglietto.status) && (
        <div className="refund-amount final-row">
          <DettaglioFooterRow
            label={rimborso}
            amount={formatCurrency(decimalToIntegerValue(dettaglioBiglietto.sellingAmount))}
            rowRef={refs[7]}
            largestColumnWidth={largestColumnWidth}
            isNotEmphasisRow={false}
          />
        </div>
      )}
    </StyledDettaglioBigliettoFooter>
  );
};

export const maxWin = (totalQuote: ConfigToEvaluateFormat, ticket: TicketType): ConfigToEvaluateFormat | 0 => {
  const winValue = totalQuote.value * ticket.sellingAmount;
  const factor = totalQuote.factor + 1;
  return isNaN(winValue) ? 0 : { value: winValue, factor: factor };
};

const isSistemaCorrezioneErrori = (events: Array<EventType>) => {
  let eventIdList: Array<number> = [];
  events.forEach((event) => {
    eventIdList.push(event.eventId);
  });
  let uniqueEventIdList = new Set(eventIdList);
  return events.length === uniqueEventIdList.size;
};

const StyledDettaglioBigliettoFooter = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 30px;
  border-radius: 0 0 12px 12px;
  * {
    font-family: Roboto, sans-serif;
  }
`;
