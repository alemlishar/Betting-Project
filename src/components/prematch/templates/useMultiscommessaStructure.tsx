import { useState, useCallback, useMemo } from "react";
import { Avvenimento, Scommessa, InfoAggiuntiva, Section } from "src/components/prematch/prematch-api";
import { ChiaveScommessa, ChiaveInfoAggiuntiva, ChiaveAvvenimento } from "src/types/chiavi";
import { IdInfoAggiuntiva } from "src/types/chiavi";
import { uniqBy } from "lodash";
import { getInfoAggiuntiveByAvvenimento } from "./TemplateMultiScommessa";

// DEBT performance
export function useMultiscommessaStructure({
  avvenimentoList,
  sections,
  scommessaMap,
  infoAggiuntivaMap,
  customDefaultInfoAggiuntiva,
}: {
  avvenimentoList: Array<Avvenimento>;
  sections: Array<Section>;
  scommessaMap: Record<ChiaveScommessa, Scommessa>;
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva>;
  customDefaultInfoAggiuntiva(infoAggiuntive: Array<InfoAggiuntiva>): InfoAggiuntiva | undefined;
}) {
  const [infoAggiuntivaSelectedByColumnGroup, setInfoAggiuntivaSelectedByColumnGroup] = useState<
    Record<ColumnGroupKey, IdInfoAggiuntiva>
  >({});
  const [infoAggiuntivaSelectedByAvvenimento, setInfoAggiuntivaSelectedByAvvenimento] = useState<
    Record<ColumnGroupKeyByAvvenimento, IdInfoAggiuntiva>
  >({});
  const setIdInfoAggiuntivaSelectedByColumnGroup = useCallback(
    (idInfoAggiuntiva: IdInfoAggiuntiva, sectionIndex: number, columnGroupIndex: number) => {
      setInfoAggiuntivaSelectedByColumnGroup((s) => ({
        ...s,
        [makeColumnGroupKey(sectionIndex, columnGroupIndex)]: idInfoAggiuntiva,
      }));
      setInfoAggiuntivaSelectedByAvvenimento((s) => ({
        ...s,
        ...Object.fromEntries(
          avvenimentoList.map((avvenimento) => [
            makeColumnGroupKeyByAvvenimento(avvenimento.key, sectionIndex, columnGroupIndex),
            idInfoAggiuntiva,
          ]),
        ),
      }));
    },
    [avvenimentoList],
  );
  const setIdInfoAggiuntivaSelectedByAvvenimento = useCallback(
    (
      idInfoAggiuntiva: IdInfoAggiuntiva,
      chiaveAvvenimento: ChiaveAvvenimento,
      sectionIndex: number,
      columnGroupIndex: number,
    ) => {
      setInfoAggiuntivaSelectedByAvvenimento((s) => ({
        ...s,
        [makeColumnGroupKeyByAvvenimento(chiaveAvvenimento, sectionIndex, columnGroupIndex)]: idInfoAggiuntiva,
      }));
      setInfoAggiuntivaSelectedByColumnGroup((s) => ({
        ...s,
        [makeColumnGroupKey(sectionIndex, columnGroupIndex)]: 0,
      }));
    },
    [],
  );
  const headers = useMemo(() => {
    return Object.fromEntries(
      sections.map((section, sectionIndex) => {
        return [
          sectionIndex,
          Object.fromEntries(
            section.columnGroups.map((columnGroup, columnGroupIndex) => {
              return [
                columnGroupIndex,
                Object.fromEntries(
                  columnGroup.columns.map((column, columnIndex) => {
                    return [
                      columnIndex,
                      (() => {
                        switch (column.type) {
                          case 3: {
                            return { type: "simple" as const, column };
                          }
                          case 0: {
                            const infoAggiuntiveByColumnGroup = uniqBy(
                              avvenimentoList.flatMap((avvenimento) =>
                                // DEBT dedupe getInfoAggiuntiveByAvvenimento call
                                getInfoAggiuntiveByAvvenimento(avvenimento, column, scommessaMap, infoAggiuntivaMap),
                              ),
                              ({ idInfoAggiuntiva }) => idInfoAggiuntiva,
                            ).map(({ idInfoAggiuntiva, descrizione }) => ({ idInfoAggiuntiva, descrizione }));
                            const infoAggiuntivaDefaultByColumnGroup = infoAggiuntiveByColumnGroup.find(
                              (infoAggiuntiva) => infoAggiuntiva.idInfoAggiuntiva === column.idInfoAggiuntiva,
                            );
                            const idInfoAggiuntivaSelezionataByColumnGroup =
                              infoAggiuntivaSelectedByColumnGroup[makeColumnGroupKey(sectionIndex, columnGroupIndex)];
                            const infoAggiuntivaSelezionataByColumnGroup = infoAggiuntiveByColumnGroup.find(
                              (infoAggiuntiva) =>
                                infoAggiuntiva.idInfoAggiuntiva === idInfoAggiuntivaSelezionataByColumnGroup,
                            );
                            const infoAggiuntivaByColumnGroup =
                              infoAggiuntivaSelezionataByColumnGroup ?? infoAggiuntivaDefaultByColumnGroup;
                            const options = infoAggiuntiveByColumnGroup;
                            const value = infoAggiuntivaByColumnGroup
                              ? infoAggiuntivaByColumnGroup.idInfoAggiuntiva
                              : 0;
                            return { type: "select" as const, column, options, value };
                          }
                          default: {
                            return { type: "" as const };
                          }
                        }
                      })(),
                    ];
                  }),
                ),
              ];
            }),
          ),
        ];
      }),
    );
  }, [avvenimentoList, infoAggiuntivaMap, infoAggiuntivaSelectedByColumnGroup, scommessaMap, sections]);
  const content = useMemo(() => {
    return Object.fromEntries(
      avvenimentoList.map((avvenimento) => {
        return [
          avvenimento.key,
          Object.fromEntries(
            sections.map((section, sectionIndex) => {
              return [
                sectionIndex,
                Object.fromEntries(
                  section.columnGroups.map((columnGroup, columnGroupIndex) => {
                    return [
                      columnGroupIndex,
                      Object.fromEntries(
                        columnGroup.columns.map((column, columnIndex) => {
                          return [
                            columnIndex,
                            (() => {
                              // TODO fare meno spesso
                              const columnGroupType = (() => {
                                if (columnGroup.columns.some((column) => column.type === 0)) {
                                  return "select";
                                }
                                return "simple";
                              })();
                              // ATENZIONE in un column group c'è al massimo una colonna di tipo 0
                              // ed essa puà indicare l'idInfoAggiuntiva di default della selezione delle info aggiuntive
                              // per questo deve essere calcolata a livello di column group
                              const defaultIdInfoAggiuntiva = columnGroup.columns.find((column) => column.type === 0)
                                ?.defaultIdInfoAggiuntiva;
                              // DEBT dedupe getInfoAggiuntiveByAvvenimento call
                              const infoAggiuntiveByAvvenimento = getInfoAggiuntiveByAvvenimento(
                                avvenimento,
                                column,
                                scommessaMap,
                                infoAggiuntivaMap,
                              );
                              const infoAggiuntiva = (() => {
                                switch (columnGroupType) {
                                  case "select": {
                                    const idInfoAggiuntivaSelezionataByAvvenimento =
                                      infoAggiuntivaSelectedByAvvenimento[
                                        makeColumnGroupKeyByAvvenimento(avvenimento.key, sectionIndex, columnGroupIndex)
                                      ];
                                    if (idInfoAggiuntivaSelezionataByAvvenimento) {
                                      const infoAggiuntivaSelezionataByAvvenimento = infoAggiuntiveByAvvenimento.find(
                                        (infoAggiuntiva) =>
                                          infoAggiuntiva.idInfoAggiuntiva === idInfoAggiuntivaSelezionataByAvvenimento,
                                      );
                                      return infoAggiuntivaSelezionataByAvvenimento;
                                    } else if (defaultIdInfoAggiuntiva) {
                                      const infoAggiuntivaDefaultByColumn = infoAggiuntiveByAvvenimento.find(
                                        (infoAggiuntiva) => infoAggiuntiva.idInfoAggiuntiva === defaultIdInfoAggiuntiva,
                                      );
                                      return infoAggiuntivaDefaultByColumn;
                                    } else {
                                      // TODO fare una volta per column group
                                      return customDefaultInfoAggiuntiva(infoAggiuntiveByAvvenimento);
                                    }
                                  }
                                  case "simple": {
                                    const infoAggiuntivaDefault = infoAggiuntiveByAvvenimento.find(
                                      (infoAggiuntiva) => infoAggiuntiva.idInfoAggiuntiva === column.idInfoAggiuntiva,
                                    );
                                    const infoAggiuntivaPrima = infoAggiuntiveByAvvenimento[0];
                                    return infoAggiuntivaDefault ?? infoAggiuntivaPrima;
                                  }
                                }
                              })();
                              switch (column.type) {
                                case 3: {
                                  const esito = infoAggiuntiva?.esitoList.find(
                                    (esito) => esito.codiceEsito === column.codiceEsito,
                                  );
                                  return infoAggiuntiva && esito
                                    ? { type: "esito" as const, infoAggiuntiva, esito }
                                    : { type: "esito" as const };
                                }
                                case 0: {
                                  const options = infoAggiuntiveByAvvenimento;
                                  const value = infoAggiuntiva?.idInfoAggiuntiva ?? 0;
                                  return { type: "info aggiuntiva select" as const, options, value, column };
                                }
                                default:
                                  return { type: "" as const };
                              }
                            })(),
                          ];
                        }),
                      ),
                    ];
                  }),
                ),
              ];
            }),
          ),
        ];
      }),
    );
  }, [
    avvenimentoList,
    sections,
    scommessaMap,
    infoAggiuntivaMap,
    infoAggiuntivaSelectedByAvvenimento,
    customDefaultInfoAggiuntiva,
  ]);
  return {
    headers,
    content,
    setIdInfoAggiuntivaSelectedByColumnGroup,
    setIdInfoAggiuntivaSelectedByAvvenimento,
  };
}
type ColumnGroupKey = string;
function makeColumnGroupKey(sectionIndex: number, columnGroupIndex: number): ColumnGroupKeyByAvvenimento {
  return `${sectionIndex}-${columnGroupIndex}`;
}
type ColumnGroupKeyByAvvenimento = string;
function makeColumnGroupKeyByAvvenimento(
  chiaveAvvenimento: ChiaveAvvenimento,
  sectionIndex: number,
  columnGroupIndex: number,
): ColumnGroupKeyByAvvenimento {
  return `${chiaveAvvenimento}-${sectionIndex}-${columnGroupIndex}`;
}
