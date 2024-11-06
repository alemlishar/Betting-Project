import React from "react";
import { NessunRisultato } from "src/components/smart-search/NessunRisultato";
import { SuggerimentoAvvenimentoMemo } from "src/components/smart-search/SuggerimentoAvvenimento";
import { css } from "styled-components/macro";
import { SmartSearchState1 } from "src/components/smart-search/useSmartSearch";
import { AvvenimentoSmart } from "src/components/smart-search/smart-api";
import { makeChiaveAvvenimento } from "src/types/chiavi";

// DEBT styled

type SmartSearchState1Props = {
  state: SmartSearchState1;
  suggerimenti: Array<AvvenimentoSmart>;
  onFix(avvenimento: AvvenimentoSmart): void;
};
// avvenimenti in base ricerca
export function SmartSearch1({ state, suggerimenti, onFix }: SmartSearchState1Props) {
  if (suggerimenti.length === 0) {
    return <NessunRisultato />;
  }
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 50fr 50fr;
        grid-row-gap: 20px;
        grid-column-gap: 20px;
      `}
    >
      {suggerimenti.map((avvenimento, index) => {
        const isSelected = state.subtype.type === "navigazione" && state.subtype.avvenimentoEvidenziatoIndex === index;
        return (
          <SuggerimentoAvvenimentoMemo
            key={makeChiaveAvvenimento(avvenimento)}
            isSelected={isSelected}
            typed={state.text}
            avvenimento={avvenimento}
            onFix={onFix}
          />
        );
      })}
    </div>
  );
}
