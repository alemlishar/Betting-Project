import React from "react";
import { TemplateAvvenimentoProps } from "src/components/live/templates/avvenimento/TemplateAvvenimento";
import { makeChiaveScommessa, makeChiaveInfoAggiuntiva } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { EsitoQuotaDescrizioneLiveMemo } from "src/components/live/templates/Esito";
import { DettaglioAvvenimentoAccordionHeader } from "src/components/live/templates/avvenimento/DettaglioAvvenimentoAccordionHeader";

export function TemplateAvvenimento2C({
  metaScommessaTemplate,
  avvenimento,
  scommessaMap,
  manifestazione,
  disciplina,
  infoAggiuntivaMap,
  isOpen: toggleAccordion,
  setToggleAccordion,
}: TemplateAvvenimentoProps) {
  if (!scommessaMap) {
    return <></>;
  }
  if (!infoAggiuntivaMap) {
    return <></>;
  }
  const firstScommessa =
    scommessaMap[
      makeChiaveScommessa({
        codicePalinsesto: avvenimento.codicePalinsesto,
        codiceAvvenimento: avvenimento.codiceAvvenimento,
        codiceScommessa: metaScommessaTemplate.codiceScommessaList[0],
      })
    ];
  const firstInfoAggiuntiva = infoAggiuntivaMap[makeChiaveInfoAggiuntiva(firstScommessa.infoAggiuntivaKeyDataList[0])];
  const numeroEsiti = firstInfoAggiuntiva.esitoList.length;
  const { codicePalinsesto, codiceAvvenimento } = avvenimento;
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
          grid-template-columns: [legatura] 1fr repeat(${numeroEsiti}, [esito] min-content);
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
          style={{ gridColumn: `legatura` }}
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
        {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
          return (
            <div
              key={esito.codiceEsito}
              style={{
                gridColumn: `esito ${esitoIndex + 1}`,
              }}
              css={css`
                justify-self: center;
              `}
            >
              <EsitoQuotaDescrizioneLiveMemo
                esito={esito}
                infoAggiuntiva={infoAggiuntiva}
                isSchedaAvvenimentoButton={true}
                avvenimento={avvenimento}
                scommessa={
                  scommessaMap[
                    makeChiaveScommessa({
                      codicePalinsesto: avvenimento.codicePalinsesto,
                      codiceAvvenimento: avvenimento.codiceAvvenimento,
                      codiceScommessa: infoAggiuntiva.codiceScommessa,
                    })
                  ]
                }
                manifestazione={manifestazione}
                disciplina={disciplina}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
