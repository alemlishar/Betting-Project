import React from "react";
import { makeChiaveScommessa, makeChiaveEsito } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { TemplateAvvenimentoProps } from "src/components/live/templates/avvenimento/TemplateAvvenimento";
import { rightAlignedColumn } from "src/components/prematch/templates/utils";
import { EsitoQuotaDescrizioneLiveMemo } from "src/components/live/templates/Esito";
import { DettaglioAvvenimentoAccordionHeader } from "src/components/live/templates/avvenimento/DettaglioAvvenimentoAccordionHeader";
/*
senza info aggiuntiva (singola info aggiuntiva con idInfoAggiuntiva 0)
con lista esiti dinamica a false
con scommessaTemplate a true quindi infoTempalte assente
con piùdi 4 esiti
esempio: CALCIO -> ITA SERIA A -> RISULTATI -> RISULTATO ESATTO 26 ESITI
*/

// DEBT performance

export function TemplateAvvenimentoNC({
  metaScommessaTemplate,
  avvenimento,
  scommessaMap,
  manifestazione,
  disciplina,
  infoAggiuntivaMap,
  isOpen: toggleAccordion,
  setToggleAccordion,
}: TemplateAvvenimentoProps) {
  const { codicePalinsesto, codiceAvvenimento } = avvenimento;
  if (!scommessaMap) {
    return <></>;
  }
  if (!infoAggiuntivaMap) {
    return <></>;
  }
  const infoAggiuntive = metaScommessaTemplate.codiceScommessaList
    .map(
      (codiceScommessa) => scommessaMap[makeChiaveScommessa({ codicePalinsesto, codiceAvvenimento, codiceScommessa })],
    )
    .filter(Boolean)
    .flatMap((scommessa) =>
      scommessa.infoAggiuntivaKeyDataList
        .map((infoAggiuntivaKeyData) => infoAggiuntivaMap[infoAggiuntivaKeyData.key])
        .filter(Boolean),
    );
  const infoAggiuntiva = infoAggiuntive[0];
  return (
    <div
      css={css`
        margin-bottom: 10px;
      `}
    >
      <DettaglioAvvenimentoAccordionHeader
        metaScommessaTemplate={metaScommessaTemplate}
        toggleAccordion={toggleAccordion}
        onToggleAccordion={setToggleAccordion}
      />
      <div
        css={css`
          display: ${toggleAccordion ? "grid" : "none"};
          grid-template-columns: [descrizione-avvenimento] 1fr [esiti] auto;
          grid-template-rows: [avvenimento] auto;
          row-gap: 10px;
          column-gap: 10px;
          padding: 10px;
          padding-right: 66px;
          justify-content: end;
          border: 2px solid #333333;
          background-color: #ffffff;
        `}
      >
        <div
          style={{ gridColumn: `descrizione-avvenimento` }}
          css={css`
            color: #333333;
            font-family: Mulish;
            font-size: 12px;
            letter-spacing: 0;
            line-height: 15px;
          `}
        >
          Min - max {infoAggiuntiva.legaturaMin}-{infoAggiuntiva.legaturaMax}
        </div>
        <div
          css={css`
            grid-column: esiti;
            display: grid;
            grid-column-gap: 10px;
            grid-row-gap: 10px;
            grid-template-columns: repeat(4, [esito] min-content);
          `}
        >
          {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
            return (
              <div
                key={makeChiaveEsito({ ...infoAggiuntiva, codiceEsito: esito.codiceEsito })}
                css={css`
                  grid-column: ${rightAlignedColumn(4, infoAggiuntiva.esitoList.length, esitoIndex)};
                  width: 120px;
                `}
              >
                <EsitoQuotaDescrizioneLiveMemo
                  esito={esito}
                  infoAggiuntiva={infoAggiuntiva}
                  avvenimento={avvenimento}
                  manifestazione={manifestazione}
                  disciplina={disciplina}
                  scommessa={
                    scommessaMap[
                      makeChiaveScommessa({
                        codicePalinsesto: avvenimento.codicePalinsesto,
                        codiceAvvenimento: avvenimento.codiceAvvenimento,
                        codiceScommessa: infoAggiuntiva.codiceScommessa,
                      })
                    ]
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
