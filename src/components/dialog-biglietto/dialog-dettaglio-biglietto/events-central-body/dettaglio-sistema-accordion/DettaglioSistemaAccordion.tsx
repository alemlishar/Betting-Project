import React from "react";
import styled from "styled-components/macro";
import DettaglioSistemaAccordionButton from "./DettaglioSistemaAccordionButton";
import { CardinalityDeploymentType } from "../../../../../types/ticket.types";
import { TicketStatusEnum } from "src/mapping/TicketStatusMapping";

export default function DettaglioSistemaAccordion({
  cardinalitiesDeployment,
  ticketStatus,
  length,
}: {
  cardinalitiesDeployment?: Array<CardinalityDeploymentType>;
  ticketStatus: TicketStatusEnum;
  length: number;
}) {
  return (
    <>
      <AccordionTitle>Dettaglio Sistema</AccordionTitle>
      <AccordionsContainer>
        {cardinalitiesDeployment &&
          cardinalitiesDeployment.map((cardinality: CardinalityDeploymentType, index: number) => {
            return (
              cardinality.sellingAmount.toString() !== "0" && (
                <AccordionSection key={index}>
                  <DettaglioSistemaAccordionButton
                    accordionId={cardinality.id}
                    cardinality={cardinality}
                    length={length}
                    ticketStatus={ticketStatus}
                  />
                </AccordionSection>
              )
            );
          })}
      </AccordionsContainer>
    </>
  );
}

/* Style the accordion container */
const AccordionsContainer = styled.div`
  margin-top: 10px;
  width: 1049px;
  margin-left: 30px;
  margin-bottom: 10px;
`;

/* Style the accordion container */
const AccordionTitle = styled.div`
  color: #000000;
  font-family: Roboto;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 23px;
  margin-left: 30px;
  margin-bottom: 19px;
  margin-top: 16px;
`;

/* Style the accordion section */
const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
  &:first-child {
    border-radius: 12px 12px 0px 0px;
    overflow: hidden;
  }
  &:last-child {
    border-radius: 0px 0px 12px 12px;
    overflow: hidden;
  }
`;
