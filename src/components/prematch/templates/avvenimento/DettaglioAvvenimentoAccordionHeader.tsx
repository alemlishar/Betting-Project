import React from "react";
import { MetaScommessaTemplate } from "src/components/prematch/prematch-api";
import { css } from "styled-components/macro";
import icoArrowDownWhite from "src/assets/images/icon-arrow-down-white.svg";
import icoArrowUpWhite from "src/assets/images/icon-arrow-up-white.svg";
import { StyledTriangle } from "src/components/prematch/SchedaAvvenimento";

type DettaglioAvvenimentoAccordionHeaderProps = {
  metaScommessaTemplate: MetaScommessaTemplate;
  toggleAccordion: Boolean;
  onToggleAccordion(metaScommessaTemplate: MetaScommessaTemplate, value: Boolean): void;
};

export function DettaglioAvvenimentoAccordionHeader({
  metaScommessaTemplate,
  toggleAccordion,
  onToggleAccordion,
}: DettaglioAvvenimentoAccordionHeaderProps) {
  return (
    <div
      css={css`
        box-sizing: border-box;
        height: 40px;
        width: 100%;
        background-color: #005936;
        color: #ffffff;
        font-family: Mulish;
        font-size: 16px;
        font-weight: 800;
        letter-spacing: 0;
        line-height: 20px;
        display: flex;
        align-items: center;
        padding: 10px 20px;
      `}
      key={metaScommessaTemplate.idMetaScommessaTemplate}
      onClick={() => {
        onToggleAccordion(metaScommessaTemplate, !toggleAccordion);
      }}
    >
      {metaScommessaTemplate.descrizione}
      {toggleAccordion ? (
        <StyledTriangle src={icoArrowUpWhite} alt={"icon open select"} />
      ) : (
        <StyledTriangle src={icoArrowDownWhite} alt={"icon close select"} />
      )}
    </div>
  );
}
