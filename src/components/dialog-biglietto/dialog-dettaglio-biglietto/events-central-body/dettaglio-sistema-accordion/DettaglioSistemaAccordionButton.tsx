import React, { useState } from "react";
import styled from "styled-components/macro";
import DettaglioSistemaAccordionContent from "./DettaglioSistemaAccordionContent";
import icoOpenAccordion from "../../../../../assets/images/sistemi-giu-ico.png";
import { CardinalityDeploymentType } from "src/types/ticket.types";

import { TicketStatusEnum } from "src/mapping/TicketStatusMapping";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";

export default function DettaglioSistemaAccordionButton({
  accordionId,
  cardinality,
  length,
  ticketStatus,
}: {
  accordionId: number;
  cardinality: CardinalityDeploymentType;
  length: number;
  ticketStatus: TicketStatusEnum;
}) {
  const [active, setActive] = useState(false);
  function toggleAccordion() {
    setActive(active === false ? true : false);
  }

  return (
    <>
      <AccordionButton onClick={toggleAccordion}>
        <AccordionCombination>
          <AccordionActualCombination>{accordionId}</AccordionActualCombination>
          <AccordionAllCombination>su {length}</AccordionAllCombination>
        </AccordionCombination>
        <AccordionQuote>
          <AccordionSingleQuota data-qa={`biglietto-puntata-${accordionId}`}>
            {formatCurrency(decimalToIntegerValue(cardinality.sellingAmount))}
          </AccordionSingleQuota>
          <AccordionMoltiplicatore data-qa={`biglietto-combinazioni-${accordionId}`}>
            x{cardinality.ticketsCount}
          </AccordionMoltiplicatore>
          <img className={active ? "accordion-down" : "accordion-up"} src={icoOpenAccordion} alt="openAccordion" />
        </AccordionQuote>
      </AccordionButton>
      <DettaglioSistemaAccordionContent
        accordionId={accordionId}
        height={active ? "300px" : "0px"}
        cardinality={cardinality}
        ticketStatus={ticketStatus}
      />
      <SeparatedLine></SeparatedLine>
    </>
  );
}

/* Style the buttons that are used to open and close the accordion panel */

const AccordionButton = styled.button`
  background-color: #f3f3f3;
  padding: 0;
  height: 54.5px;
  width: 100%;
  color: #444;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  transition: background-color 0.6s ease;
  &:hover {
    background-color: #ccc;
  }
  &:active {
    background-color: #ccc;
  }
`;

/* Style each combination as a div */
const AccordionCombination = styled.div`
  display: flex;
  font-family: "Roboto";
  font-size: 18px;
  font-weight: 700;
  margin-left: 29px;
`;
/* Style actual combination as a div */
const AccordionActualCombination = styled.div`
  color: black;
  padding-right: 3px;
`;
/* Style all number of combinations as a div */
const AccordionAllCombination = styled.div`
  color: #7b7b7b;
`;
/* Style quotes of combinations as a div */
const AccordionQuote = styled.div`
  display: flex;
  font-family: "Roboto";
  margin-left: auto;

  img {
    &.accordion-up {
      transform: rotate(0deg);
    }
    &.accordion-down {
      transform: rotate(180deg);
    }
  }
`;

/* Style a single quote of combinations as a div */
const AccordionSingleQuota = styled.div`
  color: #444444;
  font-size: 18px;
  font-weight: 700;
  margin-right: 19px;
  margin: auto 20px;
`;
/* Style quotes moltiplicator as a div */
const AccordionMoltiplicatore = styled.div`
  color: #333333;
  font-size: 16px;
  font-weight: 400;
  background-color: #ffffff;
  border-radius: 10.5px;
  margin-right: 21px;
  height: 21px;
  width: 38px;
  border-radius: 10.5px;
  text-align: center;
  align-items: center;
  margin-top: 10px;
`;
const SeparatedLine = styled.div`
  box-sizing: border-box;
  border: 0.55px solid #ffffff;
`;
