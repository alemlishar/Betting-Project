import React from "react";
import { DescrizioneAvvenimentoMemo } from "src/components/prematch/templates/DescrizioneAvvenimento";
import { EsitoQuotaPrematchMemo } from "src/components/prematch/templates/Esito";
import {
  InfoAggiuntivaSelectHeaderHomePrematch,
  InfoAggiuntivaSelectPrematch,
} from "src/components/prematch/templates/InfoAggiuntivaSelect";
import { NPlusPremtachMemo } from "src/components/prematch/templates/NPlus";
import { DisciplinaHeaderProps, Top } from "src/components/prematch/Top";
import { useAlberaturaPrematch } from "src/components/prematch/usePrematch";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

export function TopPreMatch() {
  const alberaturaPrematch = useAlberaturaPrematch();
  const { openSchedaAvvenimentoPrematch } = useNavigazioneActions();
  return (
    <Top
      NPlus={NPlusPremtachMemo}
      disciplinaHeaderBackGroundColor={"#005936"}
      DisciplinaHeader={DisciplinaHeader}
      DescrizioneAvvenimento={DescrizioneAvvenimentoMemo}
      InfoAggiuntivaSelectHeader={InfoAggiuntivaSelectHeaderHomePrematch}
      InfoAggiuntivaSelect={InfoAggiuntivaSelectPrematch}
      type={"prematch"}
      Esito={EsitoQuotaPrematchMemo}
      manifestazioneMap={alberaturaPrematch?.manifestazioneMap}
      openSchedaAvvenimento={openSchedaAvvenimentoPrematch}
    />
  );
}

function DisciplinaHeader({ disciplina }: DisciplinaHeaderProps) {
  return (
    <>
      <img src={disciplina.urlIcona} alt={"icoDisciplina"} style={{ marginRight: `10px` }} />
      {disciplina.descrizione}
    </>
  );
}
