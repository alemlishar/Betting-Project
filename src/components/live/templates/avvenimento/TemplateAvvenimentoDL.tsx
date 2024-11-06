import React from "react";
import { makeChiaveScommessa } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { rightAlignedColumn } from "src/components/prematch/templates/utils";
import { EsitoQuotaDescrizioneLiveMemo } from "src/components/live/templates/Esito";
import { TemplateAvvenimentoProps } from "src/components/live/templates/avvenimento/TemplateAvvenimento";
import { DettaglioAvvenimentoAccordionHeader } from "src/components/live/templates/avvenimento/DettaglioAvvenimentoAccordionHeader";

// DEBT performance

export function TemplateAvvenimentoDL({
  avvenimento,
  infoAggiuntivaMap,
  manifestazione,
  disciplina,
  isOpen: toggleAccordion,
  setToggleAccordion,
  metaScommessaTemplate,
  scommessaMap,
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

  const modalitaVisualizzazione = firstScommessa.modalitaVisualizzazione;
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
          grid-template-columns: [descrizione-avvenimento] 1fr [esiti] auto;
          grid-template-rows: [avvenimento] auto;
          row-gap: 10px;
          column-gap: 10px;
          padding: 10px 66px 10px 20px;
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
          {/* Min - max {infoAggiuntiva.legaturaMin}-{infoAggiuntiva.legaturaMax} */}
          {avvenimento.formattedDataAvvenimento}
        </div>
        <div
          style={{ gridRow: `avvenimento` }}
          css={css`
            grid-column: esiti;
            display: grid;
            grid-column-gap: 10px;
            grid-row-gap: 10px;
            grid-template-columns: repeat(${modalitaVisualizzazione}, [esito] min-content);
          `}
        >
          {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
            return (
              <div
                key={esito.codiceEsito}
                style={{
                  gridColumn: rightAlignedColumn(modalitaVisualizzazione, infoAggiuntiva.esitoList.length, esitoIndex),
                }}
                css={css`
                  width: ${modalitaVisualizzazione === 2 ? "281px" : "184px"};
                `}
              >
                <EsitoQuotaDescrizioneLiveMemo
                  esito={esito}
                  infoAggiuntiva={infoAggiuntiva}
                  modalitaVisualizzazione={modalitaVisualizzazione}
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
    </div>
  );
}
