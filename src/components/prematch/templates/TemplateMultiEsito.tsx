import React, { useCallback } from "react";
import { TemplateProps } from "src/components/prematch/templates/Template";
import { DescrizioneAvvenimentoMemo } from "src/components/prematch/templates/DescrizioneAvvenimento";
import { css } from "styled-components/macro";
import { NPlusPremtachMemo } from "src/components/prematch/templates/NPlus";
import { EsitoQuotaPrematchMemo, EsitoNonQuotatoPrematchMemo } from "src/components/prematch/templates/Esito";
import { SelectFiltroGiornalieroMemo } from "src/components/prematch/templates/FiltroGiornaliero";
import { capitalize } from "lodash";
import {
  getFlattenedHeaderLayoutInfo,
  getInfoAggiuntiveByAvvenimento,
} from "src/components/prematch/templates/TemplateMultiScommessa";
import { Avvenimento } from "src/components/prematch/prematch-api";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { makeChiaveScommessa } from "src/types/chiavi";

// TODO performance

/*
  usato per visualizzare le quote di singoli esiti appartenenti a CDE diverse
  esempio: ITA Serie A -> tutte -> tops commesse over
  esempio: ITA Serie A -> tutte -> tops commesse under
*/

export function TemplateMultiEsito({
  disciplina,
  manifestazione,
  avvenimentoList,
  infoAggiuntivaMap,
  metaScommessaTemplate,
  scommessaMap,
  filtroGiornaliero,
  onFiltroGiornalieroChange,
}: TemplateProps) {
  const { columns, sections } = getFlattenedHeaderLayoutInfo(metaScommessaTemplate.infoTemplate, 1);
  const { openSchedaAvvenimentoPrematch } = useNavigazioneActions();
  const onOpenAvvenimento = useCallback(
    (avvenimento: Avvenimento) => {
      openSchedaAvvenimentoPrematch({
        disciplina,
        manifestazione,
        avvenimento,
        previousSezione: "sport",
        codiceAvvenimento: avvenimento.codiceAvvenimento,
        codiceDisciplina: avvenimento.codiceDisciplina,
        codiceManifestazione: avvenimento.codiceManifestazione,
        codicePalinsesto: avvenimento.codicePalinsesto,
      });
    },
    [disciplina, manifestazione, openSchedaAvvenimentoPrematch],
  );
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns:
          [avvenimento] auto
          repeat(${columns.length}, [col] min-content)
          [n-plus] min-content;
        grid-gap: 10px 10px;
        grid-template-rows: [header] auto repeat(${avvenimentoList.length}, [avvenimento] auto);
        padding: 10px;
      `}
    >
      {/* filtro giornaliero */}
      <div
        css={css`
          grid-column: avvenimento;
          grid-row: header;
        `}
      >
        <SelectFiltroGiornalieroMemo value={filtroGiornaliero} onChange={onFiltroGiornalieroChange} />
      </div>
      {/* background colonne header */}
      <div
        css={css`
          grid-column: col / span ${columns.length};
          grid-row: header;
          background-color: #0b7d3e;
        `}
      ></div>
      {/* colonne header */}
      {columns.map(({ column }, columnIndex) => {
        return (
          <div
            key={columnIndex}
            style={{ gridColumn: `col ${columnIndex + 1}` }}
            css={css`
              align-self: center;
              grid-row: header;
              color: white;
              font-family: Roboto;
              font-size: 0.875rem;
              font-weight: 500;
              letter-spacing: 0;
              line-height: 19px;
              text-align: center;
              height: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
              white-space: nowrap;
              min-width: 47px;
              padding: 0px 0px;
              position: relative;
            `}
          >
            {/* TODO usare css per capitalizzare */}
            {column.header.length <= 3 ? column.header : capitalize(column.header)}
          </div>
        );
      })}
      {/* lista avvenimenti */}
      {avvenimentoList.map((avvenimento, avvenimentoIndex) => {
        const numeroScommesse = avvenimento.numeroScommesse - sections.length;
        // DEBT 3 memoizzare
        const openAvvenimento = () => onOpenAvvenimento(avvenimento);
        return (
          <React.Fragment key={avvenimento.key}>
            <div
              style={{ gridRow: ` avvenimento ${avvenimentoIndex + 1}` }}
              css={css`
                grid-column: avvenimento;
              `}
            >
              <DescrizioneAvvenimentoMemo avvenimento={avvenimento} onOpen={onOpenAvvenimento} />
            </div>
            {/* quote */}
            {columns.map(({ column, sectionIndex, columnGroup, columnGroupIndex }, columnFlatIndex) => {
              // TODO fare meno spesso
              // DEBT dedupe getInfoAggiuntiveByAvvenimento call
              const infoAggiuntiveByAvvenimento = getInfoAggiuntiveByAvvenimento(
                avvenimento,
                column,
                scommessaMap,
                infoAggiuntivaMap,
              );
              const infoAggiuntiva = (() => {
                const infoAggiuntivaDefault = infoAggiuntiveByAvvenimento.find(
                  (infoAggiuntiva) => infoAggiuntiva.idInfoAggiuntiva === column.idInfoAggiuntiva,
                );
                // const infoAggiuntivaPrima = infoAggiuntiveByAvvenimento[0];
                return infoAggiuntivaDefault; //?? infoAggiuntivaPrima;
              })();
              const esito = infoAggiuntiva?.esitoList.find((esito) => esito.codiceEsito === column.codiceEsito);
              return (
                <div
                  key={`${columnFlatIndex}`}
                  style={{ gridColumn: `col ${columnFlatIndex + 1}`, gridRow: ` avvenimento ${avvenimentoIndex + 1}` }}
                  css={css`
                    justify-self: center;
                  `}
                >
                  {infoAggiuntiva && esito ? (
                    <EsitoQuotaPrematchMemo
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
                  ) : (
                    <EsitoNonQuotatoPrematchMemo />
                  )}
                </div>
              );
            })}
            <div
              style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
              css={css`
                grid-column: n-plus;
                justify-self: end;
              `}
            >
              {numeroScommesse !== 0 && (
                <NPlusPremtachMemo
                  numeroScommesse={numeroScommesse}
                  onClick={openAvvenimento}
                  codiceAvvenimento={avvenimento.codiceAvvenimento}
                  codicePalinsesto={avvenimento.codicePalinsesto}
                />
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
