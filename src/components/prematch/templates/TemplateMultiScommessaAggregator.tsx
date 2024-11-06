import React, { useState, useCallback } from "react";
import { TemplateProps } from "src/components/prematch/templates/Template";
import {
  Column,
  Scommessa,
  InfoAggiuntiva,
  InfoAggiuntivaAggregator,
  Esito,
  Section,
} from "src/components/prematch/prematch-api";
import { css } from "styled-components/macro";
import { NPlusPremtachMemo } from "src/components/prematch/templates/NPlus";
import {
  makeChiaveScommessa,
  makeChiaveInfoAggiuntiva,
  makeChiaveEsito,
  ChiaveScommessa,
  CodicePalinsesto,
  CodiceAvvenimento,
  ChiaveInfoAggiuntiva,
  ChiaveEsito,
} from "src/types/chiavi";
import { EsitoQuotaPrematchMemo, EsitoNonQuotatoPrematchMemo } from "src/components/prematch/templates/Esito";
import {
  InfoAggiuntivaAggregatorSelectEsitoMemo,
  InfoAggiuntivaAggregatorSelectHeader,
} from "src/components/prematch/templates/InfoAggiuntivaSelect";
import { IdInfoAggiuntiva } from "src/types/chiavi";
import { uniqBy, capitalize } from "lodash";
import { getFlattenedHeaderLayoutInfo } from "src/components/prematch/templates/TemplateMultiScommessa";
import { DescrizioneInfoAggiuntivaAggregator } from "src/components/prematch/templates/DescrizioneInfoAggiuntivaAggregator";
import { DescrizioneAvvenimentoInfoAggiuntivaAggregatorMemo } from "src/components/prematch/templates/DescrizioneAvvenimento";
import { useEsitiInBiglietto } from "src/components/esito/useEsito";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

// DEBT performance

/*

  di solito viene usato per visualizzarele varie top scommesse

  tipologia colonne
  - 3 : esito semplice con quota
  - 0 : tendina per selezionare info aggiuntiva da visualizzare

  nota: ogni column group può avere una colonna di tipo zero, che indica l'info aggiuntiva da visualizzare nelle colonne appartenenti
*/

export function TemplateMultiScommessaAggregator({
  avvenimento,
  disciplina,
  manifestazione,
  infoAggiuntivaAggregatorGroupMap,
  infoAggiuntivaAggregatorList,
  infoAggiuntivaMap,
  metaScommessaTemplate,
  scommessaMap,
}: TemplateProps) {
  const { columns, sections } = getFlattenedHeaderLayoutInfo(metaScommessaTemplate.infoTemplate, 3);

  const [esitoSelectedByInfoAggiuntivaAggregator, setEsitoSelectedByInfoAggiuntivaAggregator] = useState<
    Record<ColumnGroupKeyByInfoAggiuntivaAggregator, ChiaveEsito>
  >({});
  const [esitoSelectedByColumnGroup, setEsitoSelectedByColumnGroup] = useState<
    Record<ColumnGroupKeyByAvvenimento, string>
  >({});
  const esitiInBiglietto = useEsitiInBiglietto();
  const setEsitoByInfoAggiuntivaAggregator = useCallback(
    (
      sectionIndex: number,
      columnGroupIndex: number,
      infoAggiuntivaAggregator: InfoAggiuntivaAggregator,
      infoAggiuntiva: InfoAggiuntiva,
      esito: Esito,
    ) => {
      const chiaveInfoAggiuntivaAggregator = makeChiaveInfoAggiuntivaAggregator(infoAggiuntivaAggregator);
      const columnGroupKeyByInfoAggiuntivaAggregator = makeColumnGroupKeyByInfoAggiuntivaAggregator(
        sectionIndex,
        columnGroupIndex,
        chiaveInfoAggiuntivaAggregator,
      );
      setEsitoSelectedByInfoAggiuntivaAggregator((s) => ({
        ...s,
        [columnGroupKeyByInfoAggiuntivaAggregator]: makeChiaveEsito(infoAggiuntiva, esito),
      }));
      setEsitoSelectedByColumnGroup((s) => {
        const { codicePalinsesto, codiceAvvenimento } = infoAggiuntivaAggregator;
        const {
          [makeColumnGroupKeyByAvvenimento(
            sectionIndex,
            columnGroupIndex,
            codicePalinsesto,
            codiceAvvenimento,
          )]: removed,
          ...rest
        } = s;
        return rest;
      });
    },
    [],
  );
  const setEsitoByColumnGroup = useCallback(
    (
      sectionIndex: number,
      columnGroupIndex: number,
      codicePalinsesto: CodicePalinsesto,
      codiceAvvenimento: CodiceAvvenimento,
      descrizioneEsito: string,
    ) => {
      setEsitoSelectedByColumnGroup((s) => ({
        ...s,
        [makeColumnGroupKeyByAvvenimento(
          sectionIndex,
          columnGroupIndex,
          codicePalinsesto,
          codiceAvvenimento,
        )]: descrizioneEsito,
      }));
      const columns = metaScommessaTemplate.infoTemplate.sections[sectionIndex].columnGroups[columnGroupIndex].columns;
      setEsitoSelectedByInfoAggiuntivaAggregator((s) => ({
        ...s,
        ...Object.fromEntries(
          infoAggiuntivaAggregatorList.map((infoAggiuntivaAggregator) => {
            const chiaveInfoAggiuntivaAggregator = makeChiaveInfoAggiuntivaAggregator(infoAggiuntivaAggregator);
            const columnGroupKeyByInfoAggiuntivaAggregator = makeColumnGroupKeyByInfoAggiuntivaAggregator(
              sectionIndex,
              columnGroupIndex,
              chiaveInfoAggiuntivaAggregator,
            );
            const infoAggiuntive: Array<InfoAggiuntiva> = uniqBy(
              columns.flatMap((column) =>
                getInfoAggiuntiveByInfoAggiuntivaAggregator(
                  infoAggiuntivaAggregator,
                  column,
                  scommessaMap,
                  infoAggiuntivaMap,
                ),
              ),
              (infoAggiuntiva) => infoAggiuntiva,
            );
            const iae = infoAggiuntive
              .flatMap((infoAggiuntiva) => infoAggiuntiva.esitoList.map((esito) => ({ infoAggiuntiva, esito })))
              .find(({ esito }): boolean => esito.descrizione === descrizioneEsito);
            if (!iae) {
              return [columnGroupKeyByInfoAggiuntivaAggregator, "not found"];
            }
            const chiaveEsito = makeChiaveEsito(iae.infoAggiuntiva, iae.esito);
            return [columnGroupKeyByInfoAggiuntivaAggregator, chiaveEsito];
          }),
        ),
      }));
    },
    [infoAggiuntivaMap, infoAggiuntivaAggregatorList, scommessaMap, metaScommessaTemplate.infoTemplate],
  );

  const { openInfoAggiuntivaAggregatorModal } = useNavigazioneActions();
  if (!avvenimento) {
    return null;
  }
  return (
    <div
      css={css`
        display: grid;
        grid-gap: 10px 10px;
        padding: 10px;
      `}
      style={{
        gridTemplateColumns: `[avvenimento] auto repeat(${columns.length}, [col] min-content)
      [n-plus] min-content`,
        gridTemplateRows: `repeat(2, [header] auto) repeat(
        ${infoAggiuntivaAggregatorList.length},
        [avvenimento] auto [separator] auto
      )`,
      }}
    >
      {/* filtro giornaliero */}
      <div
        css={css`
          grid-column: avvenimento;
          grid-row: header 1 / span 2;
        `}
      >
        <DescrizioneAvvenimentoInfoAggiuntivaAggregatorMemo
          disciplina={disciplina}
          manifestazione={manifestazione}
          avvenimento={avvenimento}
          infoAggiuntivaAggregatorGroupMap={infoAggiuntivaAggregatorGroupMap}
        />
      </div>
      {/* header sezioni */}
      {sections.map((section, index) => (
        <HeaderSectionMemo key={index} {...section} />
      ))}
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
      {columns.map(({ column, sectionIndex, columnGroupIndex }, columnIndex) => {
        return (
          <div
            key={columnIndex}
            style={{ gridColumn: `col ${columnIndex + 1}` }}
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
              switch (column.type) {
                case 0:
                  return "type-0";
                case 1: {
                  const descrizioniEsitoByColumnGroup = new Set<string>();
                  infoAggiuntivaAggregatorList.forEach((infoAggiuntivaAggregator) =>
                    getInfoAggiuntiveByInfoAggiuntivaAggregator(
                      infoAggiuntivaAggregator,
                      column,
                      scommessaMap,
                      infoAggiuntivaMap,
                    ).forEach((infoAggiuntiva) =>
                      infoAggiuntiva.esitoList.forEach((esito) => descrizioniEsitoByColumnGroup.add(esito.descrizione)),
                    ),
                  );
                  const { codicePalinsesto, codiceAvvenimento } = infoAggiuntivaAggregatorList[0];
                  return (
                    <InfoAggiuntivaAggregatorSelectHeader
                      list={Array.from(descrizioniEsitoByColumnGroup).sort()}
                      value={
                        esitoSelectedByColumnGroup[
                          makeColumnGroupKeyByAvvenimento(
                            sectionIndex,
                            columnGroupIndex,
                            codicePalinsesto,
                            codiceAvvenimento,
                          )
                        ]
                      }
                      onChange={(descrizioneEsito) => {
                        setEsitoByColumnGroup(
                          sectionIndex,
                          columnGroupIndex,
                          codicePalinsesto,
                          codiceAvvenimento,
                          descrizioneEsito,
                        );
                      }}
                    />
                  );
                }
                case 2:
                  return null;
                case 3:
                  return column.header?.length <= 3 ? column.header : capitalize(column.header);
                default:
                  return ":(";
              }
            })()}
          </div>
        );
      })}
      {infoAggiuntivaAggregatorList.map((infoAggiuntivaAggregator, infoAggiuntivaAggregatorIndex) => {
        const infoAggiuntivaAggregatorGroup =
          infoAggiuntivaAggregatorGroupMap[infoAggiuntivaAggregator.codiceInfoAggiuntivaAggregatorGroup];
        let numeroScommesse = infoAggiuntivaAggregator.numeroScommesse;
        for (let scommessaKey in scommessaMap) {
          let chiaveInfoAggiuntiva = makeChiaveInfoAggiuntiva({
            ...scommessaMap[scommessaKey],
            idInfoAggiuntiva: infoAggiuntivaAggregator.idInfoAggiuntiva,
          });
          if (infoAggiuntivaMap[chiaveInfoAggiuntiva]) {
            numeroScommesse--;
          }
        }
        return (
          <React.Fragment key={infoAggiuntivaAggregator.idInfoAggiuntiva}>
            <div
              style={{ gridRow: `avvenimento ${infoAggiuntivaAggregatorIndex + 1}` }}
              css={css`
                grid-column: avvenimento;
              `}
            >
              <DescrizioneInfoAggiuntivaAggregator
                infoAggiuntivaAggregator={infoAggiuntivaAggregator}
                infoAggiuntivaAggregatorGroup={infoAggiuntivaAggregatorGroup}
              />
            </div>
            {/* quote */}
            {columns.map(({ column, sectionIndex, columnGroup, columnGroupIndex }, columnFlatIndex) => {
              // DEBT estrarre componente
              const infoAggiuntiveByInfoAggiuntivaAggregator = getInfoAggiuntiveByInfoAggiuntivaAggregator(
                infoAggiuntivaAggregator,
                column,
                scommessaMap,
                infoAggiuntivaMap,
              );
              // DEBT memo
              const infoAggiuntiva = infoAggiuntiveByInfoAggiuntivaAggregator.find(
                (infoAggiuntiva) => infoAggiuntiva.idInfoAggiuntiva === infoAggiuntivaAggregator.idInfoAggiuntiva,
              );
              // DEBT memo
              const isEsitoSelect = columnGroup.columns.some((column) => column.type === 1);
              const chiaveEsitoSelezionato =
                esitoSelectedByInfoAggiuntivaAggregator[
                  makeColumnGroupKeyByInfoAggiuntivaAggregator(
                    sectionIndex,
                    columnGroupIndex,
                    makeChiaveInfoAggiuntivaAggregator(infoAggiuntivaAggregator),
                  )
                ];
              // DEBT memo
              const esito = isEsitoSelect
                ? chiaveEsitoSelezionato
                  ? infoAggiuntiva?.esitoList.find(
                      (esito) => makeChiaveEsito(infoAggiuntiva, esito) === chiaveEsitoSelezionato,
                    )
                  : infoAggiuntiva?.esitoList[0]
                : infoAggiuntiva?.esitoList.find((esito) => esito.codiceEsito === column.codiceEsito);
              return (
                <div
                  key={`${columnFlatIndex}`}
                  style={{ gridRow: `avvenimento ${infoAggiuntivaAggregatorIndex + 1}` }}
                  css={css`
                    grid-column: col ${columnFlatIndex + 1};
                    justify-self: center;
                  `}
                >
                  {(() => {
                    switch (column.type) {
                      case 1:
                        return (
                          // DEBT memo
                          <InfoAggiuntivaAggregatorSelectEsitoMemo
                            infoAggiuntiva={infoAggiuntiva}
                            value={esito?.descrizione}
                            onChange={(esito) => {
                              if (infoAggiuntiva) {
                                setEsitoByInfoAggiuntivaAggregator(
                                  sectionIndex,
                                  columnGroupIndex,
                                  infoAggiuntivaAggregator,
                                  infoAggiuntiva,
                                  esito,
                                );
                              }
                            }}
                          />
                        );
                      case 2: {
                        // DEBT vedere se si può fare memo
                        const isEsitoSelectedInCarrello = esitiInBiglietto.has(
                          infoAggiuntiva && esito
                            ? makeChiaveEsito({ ...infoAggiuntiva, codiceEsito: esito.codiceEsito })
                            : "",
                        );
                        const hasEsitiInCarrello = infoAggiuntiva?.esitoList.some(
                          (esito) =>
                            isEsitoSelectedInCarrello !==
                            esitiInBiglietto.has(
                              infoAggiuntiva && esito
                                ? makeChiaveEsito({ ...infoAggiuntiva, codiceEsito: esito.codiceEsito })
                                : "",
                            ),
                        );
                        return (
                          // DEBT estrai componente
                          <button
                            disabled={!infoAggiuntiva}
                            css={css`
                              box-sizing: border-box;
                              height: 45px;
                              width: 55px;
                              border: 1.62px solid #cbcbcb;
                              opacity: ${!infoAggiuntiva ? "0.5" : "0.99"};
                              border-radius: 4px;
                              background-color: ${!infoAggiuntiva
                                ? "#F4F4F4"
                                : isEsitoSelectedInCarrello
                                ? "#FFFFFF"
                                : hasEsitiInCarrello
                                ? "#AAC21F"
                                : "#FFFFFF"};
                              font-size: 2rem;
                              font-weight: 700;
                              color: ${isEsitoSelectedInCarrello
                                ? "#035b38"
                                : hasEsitiInCarrello
                                ? "#ffffff"
                                : "#035b38"};
                              cursor: ${infoAggiuntiva ? "pointer" : "default"};
                            `}
                            onClick={() => {
                              if (infoAggiuntiva) {
                                openInfoAggiuntivaAggregatorModal(
                                  infoAggiuntiva,
                                  infoAggiuntivaAggregator,
                                  infoAggiuntivaAggregatorGroup,
                                  avvenimento,
                                  manifestazione,
                                  disciplina,
                                  scommessaMap,
                                );
                              }
                            }}
                          >
                            +
                          </button>
                        );
                      }
                      case 3: {
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
                      default:
                        return ":(";
                    }
                  })()}
                </div>
              );
            })}
            <div
              style={{
                gridRow: `avvenimento ${infoAggiuntivaAggregatorIndex + 1}`,
              }}
              css={css`
                grid-column: n-plus;
                justify-self: end;
              `}
            >
              {numeroScommesse > 0 && (
                <NPlusPremtachMemo
                  numeroScommesse={numeroScommesse}
                  onClick={() => {}} /**openSchedaInfoAggiuntivaAggregator */
                  codiceAvvenimento={avvenimento.codiceAvvenimento}
                  codicePalinsesto={avvenimento.codicePalinsesto}
                />
              )}
            </div>
            <div
              style={{ gridRow: `separator ${infoAggiuntivaAggregatorIndex + 1}` }}
              css={css`
                background-color: #dcdcdc;
                height: 1px;
                grid-column: 1 / -1;
                margin: 0px -10px;
              `}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

function HeaderSection({ section, offset, length }: { section: Section; offset: number; length: number }) {
  return (
    <div
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
}
const HeaderSectionMemo = React.memo(HeaderSection);

// DEBT nel componente fare una volta sola
export function getInfoAggiuntiveByInfoAggiuntivaAggregator(
  infoAggiuntivaAggregator: InfoAggiuntivaAggregator,
  column: Column,
  scommessaMap: Record<ChiaveScommessa, Scommessa>,
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva>,
) {
  const infoAggiuntive: Array<InfoAggiuntiva> = [];
  for (const codiceScommessa of column.codiceScommessaList) {
    const scommessa =
      scommessaMap[
        makeChiaveScommessa({
          codicePalinsesto: infoAggiuntivaAggregator.codicePalinsesto,
          codiceAvvenimento: infoAggiuntivaAggregator.codiceAvvenimento,
          codiceScommessa,
        })
      ];
    if (scommessa) {
      for (const infoAggiuntivaKeyData of scommessa.infoAggiuntivaKeyDataList) {
        const infoAggiuntiva =
          infoAggiuntivaMap[
            makeChiaveInfoAggiuntiva({
              codicePalinsesto: infoAggiuntivaAggregator.codicePalinsesto,
              codiceAvvenimento: infoAggiuntivaAggregator.codiceAvvenimento,
              codiceScommessa: scommessa.codiceScommessa,
              idInfoAggiuntiva: infoAggiuntivaKeyData.idInfoAggiuntiva,
            })
          ];
        if (
          infoAggiuntiva &&
          infoAggiuntivaAggregator.codicePalinsesto === infoAggiuntiva.codicePalinsesto &&
          infoAggiuntivaAggregator.codiceAvvenimento === infoAggiuntiva.codiceAvvenimento &&
          infoAggiuntivaAggregator.idInfoAggiuntiva === infoAggiuntiva.idInfoAggiuntiva
        ) {
          infoAggiuntive.push(infoAggiuntiva);
        }
      }
    }
  }
  return infoAggiuntive;
}

export type ChiaveInfoAggiuntivaAggregator = string;
export type ChiaveInfoAggiuntivaAggregatorComponents = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  codiceInfoAggiuntivaAggregatorGroup: number;
  idInfoAggiuntiva: IdInfoAggiuntiva;
};

function makeChiaveInfoAggiuntivaAggregator({
  codicePalinsesto,
  codiceAvvenimento,
  codiceInfoAggiuntivaAggregatorGroup,
  idInfoAggiuntiva,
}: ChiaveInfoAggiuntivaAggregatorComponents): ChiaveInfoAggiuntiva {
  return `${codicePalinsesto}-${codiceAvvenimento}-${codiceInfoAggiuntivaAggregatorGroup}-${idInfoAggiuntiva}`;
}

type ColumnGroupKeyByInfoAggiuntivaAggregator = string;
function makeColumnGroupKeyByInfoAggiuntivaAggregator(
  sectionIndex: number,
  columnGroupIndex: number,
  chiaveInfoAggiuntivaAggregator: ChiaveInfoAggiuntivaAggregator,
): ColumnGroupKeyByInfoAggiuntivaAggregator {
  return `${chiaveInfoAggiuntivaAggregator}-${sectionIndex}-${columnGroupIndex}`;
}

type ColumnGroupKeyByAvvenimento = string;
function makeColumnGroupKeyByAvvenimento(
  sectionIndex: number,
  columnGroupIndex: number,
  codicePalinsesto: CodicePalinsesto,
  codiceAvvenimento: CodiceAvvenimento,
): ColumnGroupKeyByAvvenimento {
  return `${sectionIndex}-${columnGroupIndex}-${codicePalinsesto}-${codiceAvvenimento}`;
}
