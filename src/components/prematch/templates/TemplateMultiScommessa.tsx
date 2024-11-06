import React, { useCallback } from "react";
import { TemplateProps } from "src/components/prematch/templates/Template";
import { DescrizioneAvvenimentoMemo } from "src/components/prematch/templates/DescrizioneAvvenimento";
import {
  MetaScommessaTemplate,
  Column,
  Avvenimento,
  Scommessa,
  InfoAggiuntiva,
  Section,
  ColumnGroup,
} from "src/components/prematch/prematch-api";
import { css } from "styled-components/macro";
import { NPlusPremtachMemo } from "src/components/prematch/templates/NPlus";
import { makeChiaveScommessa, ChiaveScommessa, ChiaveInfoAggiuntiva } from "src/types/chiavi";
import { EsitoQuotaPrematchMemo, EsitoNonQuotatoPrematchMemo } from "src/components/prematch/templates/Esito";
import { SelectFiltroGiornalieroMemo } from "src/components/prematch/templates/FiltroGiornaliero";
import {
  InfoAggiuntivaSelectHeaderPrematch,
  InfoAggiuntivaSelectPrematch,
} from "src/components/prematch/templates/InfoAggiuntivaSelect";
import { capitalize, mean, minBy } from "lodash";
import { useMultiscommessaStructure } from "src/components/prematch/templates/useMultiscommessaStructure";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

// TODO performance

/*

  di solito viene usato per visualizzarele varie top scommesse

  tipologia colonne
  - 3 : esito semplice con quota
  - 0 : tendina per selezionare info aggiuntiva da visualizzare

  nota: ogni column group può avere una colonna di tipo zero, che indica l'info aggiuntiva da visualizzare nelle colonne appartenenti
*/

export function TemplateMultiScommessa({
  disciplina,
  manifestazione,
  avvenimentoList,
  infoAggiuntivaMap,
  metaScommessaTemplate,
  scommessaMap,
  filtroGiornaliero,
  onFiltroGiornalieroChange,
}: TemplateProps) {
  const { columns, sections } = getFlattenedHeaderLayoutInfo(metaScommessaTemplate.infoTemplate, 3);
  const {
    headers,
    content,
    setIdInfoAggiuntivaSelectedByColumnGroup,
    setIdInfoAggiuntivaSelectedByAvvenimento,
  } = useMultiscommessaStructure({
    avvenimentoList,
    sections: metaScommessaTemplate.infoTemplate.sections,
    scommessaMap,
    infoAggiuntivaMap,
    customDefaultInfoAggiuntiva: infoAggiuntivaWithMinimumAverageDeviation,
  });
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
          [avvenimento] auto repeat(${columns.length}, [col] min-content)
          [n-plus] min-content;
        grid-gap: 10px 10px;
        padding: 10px;
      `}
      style={{
        gridTemplateRows: `repeat(2, [header] auto) repeat(${avvenimentoList.length}, [avvenimento] auto)`,
      }}
    >
      {/* filtro giornaliero */}
      <div
        css={css`
          grid-column: avvenimento;
          grid-row: header 1 / span 2;
        `}
      >
        <SelectFiltroGiornalieroMemo value={filtroGiornaliero} onChange={onFiltroGiornalieroChange} />
      </div>
      {/* header sezioni */}
      {sections.map(({ section, offset, length }, sectionIndex) => {
        return (
          <div
            key={sectionIndex}
            style={{ gridColumn: `col ${offset + 1} / span ${length}` }}
            css={css`
              grid-row: header 1;
              color: #005936;
              font-family: Roboto;
              font-size: 0.875rem;
              font-weight: 700;
              letter-spacing: 0;
              line-height: 16px;
              text-align: center;
            `}
          >
            {section.header}
          </div>
        );
      })}
      {/* background colonne header */}
      {sections.map(({ offset, length }, sectionIndex) => {
        return (
          <div
            key={sectionIndex}
            style={{ gridColumn: `col ${offset + 1} / span ${length}` }}
            css={css`
              grid-row: header 2;
              background-color: #0b7d3e;
            `}
          ></div>
        );
      })}
      {/* colonne header */}
      {columns.map(({ columnIndex, sectionIndex, columnGroupIndex }, columnFlatIndex) => {
        return (
          <div
            key={columnFlatIndex}
            style={{ gridColumn: `col ${columnFlatIndex + 1}` }}
            css={css`
              grid-row: header 2;
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
            {(() => {
              const item = headers[sectionIndex][columnGroupIndex][columnIndex];
              switch (item.type) {
                case "simple": {
                  const { column } = item;
                  return column.header.length <= 3 ? column.header : capitalize(column.header);
                }
                case "select": {
                  const { column, value, options } = item;
                  return (
                    <InfoAggiuntivaSelectHeaderPrematch
                      infoAggiuntive={options}
                      regExp={column.regexpDescrizione}
                      value={value}
                      onChange={(idInfoAggiuntiva) =>
                        setIdInfoAggiuntivaSelectedByColumnGroup(idInfoAggiuntiva, sectionIndex, columnGroupIndex)
                      }
                    />
                  );
                }
                default:
                  return null;
              }
            })()}
          </div>
        );
      })}
      {/* lista avvenimenti */}
      {avvenimentoList.map((avvenimento, avvenimentoIndex) => {
        const numeroScommesse = avvenimento.numeroScommesse - sections.length;
        // DEBT 3 memoizzare
        const openAvvenimento = () => {
          onOpenAvvenimento(avvenimento);
        };
        return (
          <React.Fragment key={avvenimento.key}>
            <div
              style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
              css={css`
                grid-column: avvenimento;
              `}
            >
              <DescrizioneAvvenimentoMemo avvenimento={avvenimento} onOpen={openAvvenimento} />
            </div>
            {/* quote */}
            {columns.map(({ sectionIndex, columnGroupIndex, columnIndex }, columnFlatIndex) => {
              const item = content[avvenimento.key][sectionIndex][columnGroupIndex][columnIndex];
              return (
                <div
                  key={`${columnFlatIndex}`}
                  style={{
                    gridRow: `avvenimento ${avvenimentoIndex + 1}`,
                  }}
                  css={css`
                    grid-column: col ${columnFlatIndex + 1};
                    justify-self: center;
                  `}
                >
                  {(() => {
                    switch (item.type) {
                      case "esito": {
                        const { esito, infoAggiuntiva } = item;
                        return infoAggiuntiva && esito ? (
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
                        );
                      }
                      case "info aggiuntiva select": {
                        const { options, column, value } = item;
                        return (
                          <InfoAggiuntivaSelectPrematch
                            infoAggiuntive={options}
                            regExp={column.regexpDescrizione}
                            value={value}
                            onChange={(idInfoAggiuntiva) =>
                              setIdInfoAggiuntivaSelectedByAvvenimento(
                                idInfoAggiuntiva,
                                avvenimento.key,
                                sectionIndex,
                                columnGroupIndex,
                              )
                            }
                          />
                        );
                      }
                      default:
                        return null;
                    }
                  })()}
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
              {numeroScommesse > 0 && (
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

export function getInfoAggiuntiveByAvvenimento(
  avvenimento: Avvenimento,
  column: Column,
  scommessaMap: Record<ChiaveScommessa, Scommessa>,
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva>,
) {
  const infoAggiuntive: Array<InfoAggiuntiva> = [];
  for (const codiceScommessa of column.codiceScommessaList) {
    const chiaveScommessa = makeChiaveScommessa({
      codicePalinsesto: avvenimento.codicePalinsesto,
      codiceAvvenimento: avvenimento.codiceAvvenimento,
      codiceScommessa,
    });
    const scommessa = scommessaMap[chiaveScommessa];
    if (scommessa) {
      for (const infoAggiuntivaKeyData of scommessa.infoAggiuntivaKeyDataList) {
        const chiaveInfoAggiuntiva = infoAggiuntivaKeyData.key;
        const infoAggiuntiva = infoAggiuntivaMap[chiaveInfoAggiuntiva];
        if (infoAggiuntiva) {
          infoAggiuntive.push(infoAggiuntiva);
        }
      }
    }
  }
  return infoAggiuntive;
}

// calculate layout positionning of sections and columns
export function getFlattenedHeaderLayoutInfo(infoTemplate: MetaScommessaTemplate["infoTemplate"], sectionCap: number) {
  const columns: Array<{
    column: Column;
    columnIndex: number;
    columnGroup: ColumnGroup;
    columnGroupIndex: number;
    section: Section;
    sectionIndex: number;
  }> = [];
  const sections: Array<{ section: Section; sectionIndex: number; offset: number; length: number }> = [];
  const cappedSections = infoTemplate.sections.slice(0, sectionCap);
  let sectionOffset = 0;
  cappedSections.forEach((section, sectionIndex) => {
    let sectionLength = 0;
    section.columnGroups.forEach((columnGroup, columnGroupIndex) => {
      columnGroup.columns.forEach((column, columnIndex) => {
        columns.push({ column, columnIndex, columnGroup, columnGroupIndex, section, sectionIndex });
        sectionLength += 1;
      });
    });
    sections.push({ section, sectionIndex, offset: sectionOffset, length: sectionLength });
    sectionOffset += sectionLength;
  });
  return { columns, sections };
}

function calculateAverageDeviation(values: number[]) {
  const average = mean(values);
  return mean(values.map((value) => Math.abs(value - average)));
}

export function infoAggiuntivaWithMinimumAverageDeviation(infoAggiuntive: Array<InfoAggiuntiva>) {
  const infoAggiuntivaWithLowestAverageDeviation = minBy(infoAggiuntive, (infoAggiuntiva) =>
    calculateAverageDeviation(infoAggiuntiva.esitoList.map(({ quota }) => quota).filter((quota) => quota !== 100)),
  );
  return infoAggiuntivaWithLowestAverageDeviation;
}
