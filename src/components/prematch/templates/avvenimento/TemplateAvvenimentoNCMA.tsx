import React from "react";
import { makeChiaveScommessa, makeChiaveEsito, makeChiaveInfoAggiuntiva } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { rightAlignedColumn } from "src/components/prematch/templates/utils";
import { EsitoQuotaDescrizionePrematchMemo } from "src/components/prematch/templates/Esito";
import { TemplateAvvenimentoProps } from "src/components/prematch/templates/avvenimento/TemplateAvvenimento";
import { DettaglioAvvenimentoAccordionHeader } from "src/components/prematch/templates/avvenimento/DettaglioAvvenimentoAccordionHeader";
/*
con info aggiuntiva (idInfoAggiuntiva != 0)
con lista esiti dinamica a false
con scommessaTemplate a true quindi infoTempalte assente
con più di 4 esiti

esempio: CALCIO -> ITA SERIA A -> MULTIGOAL -> COMBO: 1X2 + MULTIGOAL 6 ESITI
*/

// TODO performance

export function TemplateAvvenimentoNCMA({
  metaScommessaTemplate,
  avvenimento,
  disciplina,
  scommessaMap,
  manifestazione,
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
  const numeroInfoAggiuntive = infoAggiuntive.length;

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
          grid-template-columns: [info-aggiuntiva-col] 1fr [esiti-col] min-content;
          grid-template-rows: repeat(${numeroInfoAggiuntive}, [info-aggiuntiva-row] auto [separator] auto);
          grid-column-gap: 10px;
          grid-row-gap: 10px;
          /* white-space: nowrap; */
          align-items: center;
          padding: 10px 66px 10px 10px;
          justify-content: end;
          border: 2px solid #005936;
          background-color: #ffffff;
        `}
      >
        {infoAggiuntive.map((infoAggiuntiva, infoAggiuntivaIndex) => {
          return (
            <React.Fragment key={makeChiaveInfoAggiuntiva({ ...infoAggiuntiva })}>
              <div
                hidden={infoAggiuntivaIndex === infoAggiuntive.length - 1}
                style={{ gridRow: `separator ${infoAggiuntivaIndex + 1}` }}
                css={css`
                  grid-column: 1 / -1;
                  height: 1px;
                  background-color: #dcdcdc;
                  margin: 0px -10px;
                `}
              />
              <div
                style={{ gridRow: ` info-aggiuntiva-row ${infoAggiuntivaIndex + 1}` }}
                css={css`
                  grid-column: info-aggiuntiva-col;
                  color: #005936;
                  font-weight: 700;
                  font-size: 14px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  word-break: break-word;
                  align-self: start;
                  justify-self: start;
                  padding-top: 12px;
                `}
              >
                {infoAggiuntiva.descrizione}
                <div
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
              </div>
              <div
                style={{ gridRow: ` info-aggiuntiva-row ${infoAggiuntivaIndex + 1}` }}
                css={css`
                  grid-column: esiti-col;
                  display: grid;
                  grid-template-columns: repeat(4, [quota] min-content);
                  grid-column-gap: 10px;
                  grid-row-gap: 10px;
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
                      <EsitoQuotaDescrizionePrematchMemo
                        esito={esito}
                        infoAggiuntiva={infoAggiuntiva}
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
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
