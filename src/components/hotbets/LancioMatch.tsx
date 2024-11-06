import React from "react";
import { HotbetsContainer } from "src/components/hotbets/hotbets-api";
import { LancioMatchLive } from "src/components/hotbets/LancioMatchLive";
import { LancioMatchPrematch } from "src/components/hotbets/LancioMatchPrematch";

type LancioMatchProps = {
  lancioMatch: HotbetsContainer;
};

export function LancioMatch({ lancioMatch }: LancioMatchProps) {
  if (!lancioMatch) {
    return null;
  }

  const { avvenimentoFeList, disciplinaList, infoAggiuntivaMap, scommessaMap } = lancioMatch;

  if (!avvenimentoFeList || !disciplinaList || !infoAggiuntivaMap || !scommessaMap) {
    return null;
  }

  return (
    <>
      {avvenimentoFeList.map((avvenimento, index) => {
        const disciplina = disciplinaList.find(
          (disciplina) => disciplina.codiceDisciplina === avvenimento.codiceDisciplina,
        );

        if (!disciplina) {
          return null;
        }

        if (avvenimento.categoria === 0) {
          return (
            <LancioMatchPrematch
              key={avvenimento.codiceAvvenimento}
              avvenimento={avvenimento}
              disciplina={disciplina}
              infoAggiuntivaMap={infoAggiuntivaMap}
              scommessaMap={scommessaMap}
              index={index}
            />
          );
        } else {
          return (
            <LancioMatchLive
              key={avvenimento.codiceAvvenimento}
              avvenimento={avvenimento}
              disciplina={disciplina}
              infoAggiuntivaMap={infoAggiuntivaMap}
              scommessaMap={scommessaMap}
              index={index}
            />
          );
        }
      })}
    </>
  );
}
