import React from "react";
import { makeChiaveScommessa, makeChiaveInfoAggiuntiva, ChiaveScommessa, ChiaveInfoAggiuntiva } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { EsitoQuotaDescrizioneLiveMemo } from "src/components/live/templates/Esito";
import { InfoAggiuntiva, MetaScommessaTemplate, Scommessa } from "src/components/prematch/prematch-api";
import { TemplateAvvenimentoProps } from "./TemplateAvvenimento";
import { DettaglioAvvenimentoAccordionHeader } from "src/components/live/templates/avvenimento/DettaglioAvvenimentoAccordionHeader";
/*
con info aggiuntiva (idInfoAggiuntiva != 0)
con lista esiti dinamica a false
con scommessaTemplate a true quindi infoTempalte assente
minimo 2 esiti massimo 4 esiti

esempio 2 esiti: CALCIO -> ITA SERIA A -> GOAL -> UNDER/OVER
esempio 3 esiti: CALCIO -> ITA SERIA A -> GOAL -> SEGNA GOAL
esempio 4 esiti: CALCIO -> ITA SERIE A -> DOPPIOTEMPO -> COMBO: U/O 1T + U/O 2T
*/

// TODO performance

export function TemplateAvvenimento2CMA({
  metaScommessaTemplate,
  avvenimento,
  scommessaMap,
  manifestazione,
  disciplina,
  infoAggiuntivaMap,
  isOpen: toggleAccordion,
  setToggleAccordion,
}: TemplateAvvenimentoProps) {
  const firstAvvenimento = avvenimento;
  if (!scommessaMap) {
    return <></>;
  }
  if (!infoAggiuntivaMap) {
    return <></>;
  }
  const firstScommessa =
    scommessaMap[
      makeChiaveScommessa({
        codicePalinsesto: firstAvvenimento.codicePalinsesto,
        codiceAvvenimento: firstAvvenimento.codiceAvvenimento,
        codiceScommessa: metaScommessaTemplate.codiceScommessaList[0],
      })
    ];
  const firstInfoAggiuntiva = infoAggiuntivaMap[makeChiaveInfoAggiuntiva(firstScommessa.infoAggiuntivaKeyDataList[0])];
  const numeroEsiti = firstInfoAggiuntiva.esitoList.length;

  const { codicePalinsesto, codiceAvvenimento } = avvenimento;
  const infoAggiuntive = getInfoAggiuntiveByAvvenimento(
    codicePalinsesto,
    codiceAvvenimento,
    metaScommessaTemplate.codiceScommessaList,
    scommessaMap,
    infoAggiuntivaMap,
  );

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
          grid-template-columns: [info-aggiuntiva] 1fr repeat(${numeroEsiti}, [esito] min-content);
          grid-template-rows: repeat(${infoAggiuntive.length}, [avvenimento] min-content [separator] auto);
          row-gap: 10px;
          column-gap: 10px;
          padding: 10px;
          padding-right: 66px;
          justify-content: end;
          display: ${toggleAccordion ? "grid" : "none"};
          border: 2px solid #333333;
          background-color: #ffffff;
        `}
      >
        {infoAggiuntive.map((infoAggiuntiva, infoAggiuntivaIndex) => {
          return (
            <React.Fragment key={infoAggiuntiva.key}>
              <div
                hidden={infoAggiuntivaIndex === infoAggiuntive.length - 1}
                style={{ gridRow: `separator ${infoAggiuntivaIndex + 1}` }}
                css={css`
                  grid-column: 1 / -1;
                  height: 1px;
                  background-color: #dcdcdc;
                  margin: 0px -10px;
                  width: calc(100% + 76px);
                `}
              />
              <div
                style={{ gridRow: `${"avvenimento"} ${infoAggiuntivaIndex + 1}` }}
                css={css`
                  grid-column: info-aggiuntiva;
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                `}
              >
                <div
                  css={css`
                    color: #ffb800;
                    font-weight: 700;
                    text-align: start;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    word-break: break-word;
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
              </div>
              {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
                return (
                  <div
                    key={esito.codiceEsito}
                    style={{
                      gridColumn: `esito ${esitoIndex + 1}`,
                      // gridRow: `${"avvenimento"} ${infoAggiuntivaIndex + 1}`,
                    }}
                    css={css`
                      grid-row: avvenimento ${infoAggiuntivaIndex + 1};
                      display: flex;
                      justify-content: center;
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
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// DEBT performance
function getInfoAggiuntiveByAvvenimento(
  codicePalinsesto: number,
  codiceAvvenimento: number,
  codiceScommessaList: MetaScommessaTemplate["codiceScommessaList"],
  scommessaMap: Record<ChiaveScommessa, Scommessa>,
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva>,
) {
  return codiceScommessaList
    .map(
      (codiceScommessa) => scommessaMap[makeChiaveScommessa({ codicePalinsesto, codiceAvvenimento, codiceScommessa })],
    )
    .filter(Boolean)
    .flatMap((scommessa) =>
      scommessa.infoAggiuntivaKeyDataList
        .map((infoAggiuntivaKeyData) => infoAggiuntivaMap[infoAggiuntivaKeyData.key])
        .filter(Boolean),
    );
}
