import React from "react";
import styled from "styled-components/macro";
import { CardinalityDeploymentType } from "src/types/ticket.types";
import { TicketStatusEnum } from "src/mapping/TicketStatusMapping";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";

export default function DettaglioSistemaAccordionContent({
  height,
  cardinality,
  ticketStatus,
  accordionId,
}: {
  height: string;
  cardinality: CardinalityDeploymentType;
  ticketStatus: TicketStatusEnum;
  accordionId: number;
}) {
  return (
    <AccordionContent style={{ maxHeight: height }}>
      {ticketStatus === TicketStatusEnum.WINNING || ticketStatus === TicketStatusEnum.PAYED ? (
        <AccordionContentContainer>
          <AccordionContentLabel>Vincita</AccordionContentLabel>
          <AccordionContentValueBold>
            {formatCurrency(decimalToIntegerValue(cardinality.maximumWinningAmount))}
          </AccordionContentValueBold>
        </AccordionContentContainer>
      ) : (
        <>
          <AccordionContentContainer>
            <AccordionContentLabel>Costo Totale</AccordionContentLabel>
            <AccordionContentValueBold data-qa={`biglietto-puntatatotv-${accordionId + 1}`}>
              {formatCurrency(decimalToIntegerValue(cardinality.totalSellingAmount))}
            </AccordionContentValueBold>
          </AccordionContentContainer>
          <AccordionContentContainer>
            <AccordionContentLabel>Vincita Minima per combinazione</AccordionContentLabel>
            <AccordionContentValue data-qa={`biglietto-vincitaminima-${accordionId + 1}`}>
              {formatCurrency(decimalToIntegerValue(cardinality.minimumWinningAmountCardinality))}
            </AccordionContentValue>
          </AccordionContentContainer>
          <AccordionContentContainer>
            <AccordionContentLabel>Vincita Massima per combinazione</AccordionContentLabel>
            <AccordionContentValue data-qa={`biglietto-vincitamassima-${accordionId + 1}`}>
              {formatCurrency(decimalToIntegerValue(cardinality.maximumWinningAmountCardinality))}
            </AccordionContentValue>
          </AccordionContentContainer>
        </>
      )}
    </AccordionContent>
  );
}

/* Style the accordion content panel. Note: hidden by default */
const AccordionContent = styled.div`
  padding-left: 29px;
  background-color: #f3f3f3;
  overflow: hidden;
  transition: max-height 0.6s ease;
`;

/* Style the accordion content conatiner flex */
const AccordionContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 118px;
  &:last-child {
    margin-bottom: 20px;
  }
`;

/* Style the accordion content costo totale */
const AccordionContentLabel = styled.div`
  font-family: "Roboto";
  font-weight: 400;
  font-size: 16px;
  color: #333333;
`;

/* Style the accordion content costo totale */
const AccordionContentValueBold = styled.div`
  font-family: "Roboto";
  font-weight: 700;
  font-size: 20px;
  color: #000000;
`;

/* Style the accordion content costo totale */
const AccordionContentValue = styled.div`
  font-family: "Roboto";
  font-weight: 400;
  font-size: 18px;
  color: #333333;
`;
