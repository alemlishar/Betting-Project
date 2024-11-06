import React from "react";
import { LiveState } from "src/components/live/useLive";
import { SchedaAvvenimento } from "src/components/live/SchedaAvvenimento";
import styled from "styled-components/macro";
import { SchedaDisciplina } from "src/components/live/SchedaDisciplina";

type PalinsestoLiveProps = {
  liveState: LiveState;
};

export function PalinsestoLive({ liveState }: PalinsestoLiveProps) {
  const { selected } = liveState;
  if (selected.type === "avvenimento") {
    return <SchedaAvvenimento {...selected} />;
  }
  if (selected.type === "disciplina") {
    return <SchedaDisciplina disciplina={selected.disciplina} />;
  }

  return <StyledPalinsestoLivePlaceholder>Home Live</StyledPalinsestoLivePlaceholder>;
}

const StyledPalinsestoLivePlaceholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1.5rem;
  color: #333333;
  background-color: transparent;
  border-radius: 4px;
`;
