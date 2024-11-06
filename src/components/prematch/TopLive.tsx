import React from "react";
import IcoArrowRightYellow from "src/assets/images/icon-arrow-right-yellow.svg";
import { DescrizioneAvvenimentoLive } from "src/components/live/DescrizioneAvvenimentoLive";
import { EsitoQuotaConVariazioneLiveMemo } from "src/components/live/templates/Esito";
import { useLive } from "src/components/live/useLive";
import {
  InfoAggiuntivaSelectHeaderLive,
  InfoAggiuntivaSelectLive,
} from "src/components/prematch/templates/InfoAggiuntivaSelect";
import { NPlusLiveMemo } from "src/components/prematch/templates/NPlus";
import { DisciplinaHeaderProps, Top } from "src/components/prematch/Top";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import styled, { css } from "styled-components/macro";

export function TopLive() {
  const { alberatura: alberaturaLive } = useLive();
  const { openSchedaAvvenimentoLive } = useNavigazioneActions();
  return (
    <Top
      NPlus={NPlusLiveMemo}
      disciplinaHeaderBackGroundColor={"#333333"}
      DisciplinaHeader={DisciplinaHeader}
      DescrizioneAvvenimento={DescrizioneAvvenimentoLive}
      InfoAggiuntivaSelectHeader={InfoAggiuntivaSelectHeaderLive}
      InfoAggiuntivaSelect={InfoAggiuntivaSelectLive}
      type={"live"}
      Esito={EsitoQuotaConVariazioneLiveMemo}
      manifestazioneMap={alberaturaLive?.manifestazioneMap}
      openSchedaAvvenimento={openSchedaAvvenimentoLive}
    />
  );
}

function DisciplinaHeader({ disciplina }: DisciplinaHeaderProps) {
  const { openSchedaDisciplinaLiveFromHomePrematch } = useNavigazioneActions();
  return (
    <>
      <img src={disciplina.urlIcona} alt={"icoDisciplina"} style={{ marginRight: `10px` }} />
      <span
        css={css`
          max-width: 103px;
          overflow: hidden;
          text-overflow: ellipsis;
        `}
      >
        {disciplina.descrizione}
      </span>
      <div
        css={`
          display: inline-flex;
          margin-left: 8px;
          cursor: pointer;
          align-items: center;
        `}
      >
        <BadgeLive />
        <button
          css={css`
            background-color: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            color: #ffffff;
            font-family: Roboto;
            font-size: 16px;
            letter-spacing: 0;
            line-height: 19px;
            text-align: right;
            font-weight: 400;
            margin-left: 14px;
          `}
          onClick={() => {
            openSchedaDisciplinaLiveFromHomePrematch({ disciplina });
          }}
        >
          Vedi Tutte
          <img src={IcoArrowRightYellow} alt={"arrowDisciplina"} />
        </button>
      </div>
    </>
  );
}

export const StyledLiveBadge = styled.div`
  height: 15px;
  width: 37px;
  box-sizing: border-box;
  background-color: #ffb800;
  border: 2px solid #ffb800;
  border-radius: 25.43px;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
`;

export const StyledLiveBadgeText = styled.span`
  color: #000000;
  font-family: Roboto;
  font-size: 10px;
  font-style: italic;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 4px;
`;

export function BadgeLive() {
  return (
    <StyledLiveBadge>
      <StyledLiveBadgeText>LIVE</StyledLiveBadgeText>
    </StyledLiveBadge>
  );
}
