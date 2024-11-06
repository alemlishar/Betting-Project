import React, { useState, useMemo, useContext } from "react";
import { css } from "styled-components/macro";
import {
  EsitoVirtuale,
  EventoVirtualeCampionato,
  ScommessaCampionato,
  ScommessaVirtualeBase,
} from "src/components/virtual/virtual-dto";
import icoArrowDownGreen from "src/assets/images/icon-arrow-down-green.svg";
import icoArrowUpGreen from "src/assets/images/icon-arrow-up-green.svg";
import icoArrowDownWhite from "src/assets/images/icon-arrow-down-white.svg";
import icoArrowUpWhite from "src/assets/images/icon-arrow-up-white.svg";
import { useForeignClickOpen } from "src/components/prematch/templates/utils";
import { ChiaveEsitoBigliettoVirtualComponents, makeChiaveEsitoVirtual } from "src/types/chiavi";
import { EsitiVirtualInBigliettoContext, useAddEsitoToBiglietto } from "src/components/esito/useEsito";

// PRINCIPALI GOAL COMBO
type ClusterList = {
  label: string;
  clusters: Array<Cluster>;
};

type Cluster = {
  label: string;
  viewConfiguration: ViewConfiguration;
};

type ViewConfiguration = ViewColumns | ViewMergedColumns | ViewNoColumns;

// PRINCIPALI e TOP GOAL
type ViewColumns = {
  type: "view-columns";
  columns: Array<
    | { type: "simple"; label: string; columns: Array<{ label: string; idScommessa: number; idEsito: number }> }
    | {
        type: "multi";
        label: string;
        defaultIdScommessa: number;
        dropdown: Array<{ label: string; idScommessa: number }>;
        columns: Array<{ label: string; idEsito: number }>;
      }
  >;
};

// COMBO e SOMMA GOAL
type ViewMergedColumns = {
  type: "view-merged-columns";
  columns: Array<{ label: string; columns: Array<{ label: string; idScommessa: number; idEsito: number }> }>;
};

// RISULTATO ESATTO
type ViewNoColumns = { type: "view-no-columns"; idScommessa: number };

type AvvenimentoVirtual = { sogeicodevento: string; descrizioneAvvenimento: string };

function getAvvenimentiList(scommessaList: Array<ScommessaCampionato>) {
  const map: Record<string, AvvenimentoVirtual> = {};
  for (const scommessa of scommessaList) {
    const { sogeicodevento, descrizioneAvvenimento } = scommessa;
    map[sogeicodevento] = { sogeicodevento, descrizioneAvvenimento };
  }
  return Object.values(map).sort((a, b) => Number(a.sogeicodevento) - Number(b.sogeicodevento));
}

function getScommesseList(scommessaList: Array<ScommessaCampionato>) {
  const map: Record<string, ScommessaCampionato> = {};
  for (const scommessa of scommessaList) {
    map[`${scommessa.sogeicodevento}_${scommessa.id}`] = scommessa;
  }
  return map;
}

type EsitiMap = Record<string, Record<string, Record<string, EsitoVirtuale | undefined> | undefined> | undefined>;
function getEsitiMap(scommessaList: Array<ScommessaCampionato>): EsitiMap {
  const map: any = {};
  for (const scommessa of scommessaList) {
    map[scommessa.sogeicodevento] = map[scommessa.sogeicodevento] ?? {};
    map[scommessa.sogeicodevento][scommessa.id] = map[scommessa.sogeicodevento][scommessa.id] ?? {};
    for (const esito of scommessa.esitoVirtualeList) {
      map[scommessa.sogeicodevento][scommessa.id][esito.id] = esito;
    }
  }
  return map;
}

export function VirtualTemplateAllStarLeague({ event }: { event: EventoVirtualeCampionato }) {
  const templateConfiguration = getTemplateConfiguration();
  const [selection, setSelection] = useState({ clusterListIndex: 0, clusterIndex: 0 });
  const showClusters = templateConfiguration[selection.clusterListIndex].clusters.length > 1;
  const avvenimenti = useMemo(() => getAvvenimentiList(event.scommessaClassicaList), [event]);
  const esiti = useMemo(() => getEsitiMap(event.scommessaClassicaList), [event]);
  const scommesse = useMemo(() => getScommesseList(event.scommessaClassicaList), [event]);
  const { viewConfiguration } = templateConfiguration[selection.clusterListIndex].clusters[selection.clusterIndex];

  //evento={evento} scommessa={scommessa} esito={esito} inCorso={inCorso}
  return (
    <>
      <div
        css={css`
          display: grid;
          background-color: #ededed;
          padding: 10px;
          grid-column-gap: 10px;
          grid-auto-columns: 337px;
          grid-template-rows: 45px;
        `}
      >
        {templateConfiguration.map((clusterList, index) => {
          const isSelected = index === selection.clusterListIndex;
          return (
            <div
              key={index}
              css={css`
                grid-column: ${index + 1};
                background-color: ${isSelected ? "#AAC21F" : "#ffffff"};
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: ${isSelected ? "#ffffff" : "#333333"};
                font-family: Roboto;
                font-size: 16px;
                font-weight: ${isSelected ? "bold" : ""};
              `}
              onClick={() => {
                setSelection({ clusterListIndex: index, clusterIndex: 0 });
              }}
            >
              {clusterList.label}
            </div>
          );
        })}
      </div>
      {showClusters && (
        <div
          css={css`
            display: grid;
            background-color: #ffffff;
            padding: 10px;
            grid-column-gap: 10px;
            grid-auto-columns: 337px;
            grid-template-rows: 45px;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
          `}
        >
          {templateConfiguration[selection.clusterListIndex].clusters.map((cluster, index) => {
            const isSelected = index === selection.clusterIndex;
            return (
              <div
                key={index}
                css={css`
                  grid-column: ${index + 1};
                  background-color: ${isSelected ? "" : "#EDEDED"};
                  border-radius: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #333333;
                  font-family: Roboto;
                  font-size: 16px;
                  font-weight: ${isSelected ? "bold" : ""};
                  box-sizing: border-box;
                  border: ${isSelected ? "3px solid #AAC21F" : ""};
                `}
                onClick={() => {
                  setSelection({ clusterListIndex: selection.clusterListIndex, clusterIndex: index });
                }}
              >
                {cluster.label}
              </div>
            );
          })}
        </div>
      )}
      <div
        css={css`
          height: 10px;
        `}
      />
      <div
        css={css`
          height: 673px;
          overflow: hidden auto;
          &::-webkit-scrollbar {
            display: none;
          }
        `}
      >
        {(() => {
          switch (viewConfiguration.type) {
            case "view-columns":
              return (
                <ViewColumnsTemplate
                  viewConfiguration={viewConfiguration}
                  evento={event}
                  avvenimenti={avvenimenti}
                  esiti={esiti}
                  scommesse={scommesse}
                />
              );
            case "view-merged-columns":
              return (
                <ViewMergedColumnsTemplate
                  viewConfiguration={viewConfiguration}
                  evento={event}
                  avvenimenti={avvenimenti}
                  scommesse={scommesse}
                  esiti={esiti}
                />
              );
            case "view-no-columns":
              return (
                <ViewNoColumnsTemplate
                  viewConfiguration={viewConfiguration}
                  evento={event}
                  avvenimenti={avvenimenti}
                  esiti={esiti}
                  scommesse={scommesse}
                />
              );
          }
        })()}
      </div>
    </>
  );
}

type TemplateProps<Template> = {
  viewConfiguration: Template;
  evento: EventoVirtualeCampionato;
  scommesse: Record<string, ScommessaCampionato>;
  avvenimenti: Array<AvvenimentoVirtual>;
  esiti: EsitiMap;
};

function ViewColumnsTemplate({ viewConfiguration, avvenimenti, esiti, evento, scommesse }: TemplateProps<ViewColumns>) {
  const [columnSelection, setColumnSelection] = useState<
    Record<
      number /*columnIndex*/,
      { idScommessa: number; byAvvenimento: Record<string /*sogeicodeevento*/, number /*idScommessa*/> }
    >
  >({});
  const dynamicGridTemplateRows = viewConfiguration.columns
    .flatMap((column, firstIndex) => {
      switch (column.type) {
        case "simple":
          return column.columns.map((_, secondIndex) => `[c-${firstIndex}-${secondIndex}] 55px`);
        case "multi":
          return [
            `[c-${firstIndex}-NaN] 55px`,
            ...column.columns.map((_, secondIndex) => `[c-${firstIndex}-${secondIndex}] 55px`),
          ];
      }
      return null;
    })
    .join(" ");
  return (
    <div
      css={css`
        display: grid;
        grid-template-rows: [first] auto [second] auto repeat(${avvenimenti.length}, [avvenimento] 65px);
        grid-template-columns: [avvenimento] 1fr ${dynamicGridTemplateRows};
        grid-column-gap: 10px;
        padding: 0px 10px 0 10px;
        background-color: #ffffff;
      `}
    >
      {viewConfiguration.columns.map((column, firstIndex) => {
        const columnCss = css`
          grid-row: first;
          color: #005936;
          font-family: Roboto;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0;
          text-align: center;
          padding-bottom: 4px;
          padding-top: 6px;
        `;
        const subcolumnCss = (subcolumnIndex: number) => css`
          grid-row: second;
          grid-column: c-${firstIndex}-${subcolumnIndex};
          height: 30px;
          color: #ffffff;
          font-family: Roboto;
          font-size: 16px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        switch (column.type) {
          case "simple": {
            return (
              <React.Fragment key={firstIndex}>
                <div
                  css={css`
                    ${columnCss};
                    grid-column: c-${firstIndex}-0 / span ${column.columns.length};
                  `}
                >
                  {column.label}
                </div>
                <div
                  css={css`
                    grid-row: second;
                    grid-column: c-${firstIndex}-0 / span ${column.columns.length};
                    background-color: #0b7d3e;
                  `}
                />
                {column.columns.map(({ label }, subcolumnIndex) => {
                  return (
                    <div key={subcolumnIndex} css={subcolumnCss(subcolumnIndex)}>
                      {label}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          }
          case "multi": {
            const idScommessa = columnSelection[firstIndex]?.idScommessa ?? column.defaultIdScommessa;
            return (
              <React.Fragment key={firstIndex}>
                <div
                  css={css`
                    ${columnCss};
                    grid-column: c-${firstIndex}-NaN / span ${column.columns.length + 1};
                  `}
                >
                  {column.label}
                </div>
                <div
                  css={css`
                    grid-row: second;
                    grid-column: c-${firstIndex}-NaN / span ${column.columns.length + 1};
                    background-color: #0b7d3e;
                  `}
                />
                <div css={subcolumnCss(NaN)}>
                  <SelectScommesseButton
                    options={column.dropdown}
                    idScommessa={idScommessa}
                    onChange={(idScommessa) => {
                      setColumnSelection({
                        ...columnSelection,
                        [firstIndex]: {
                          idScommessa,
                          byAvvenimento: Object.fromEntries(
                            avvenimenti.map((avvenimento) => [avvenimento.sogeicodevento, idScommessa]),
                          ),
                        },
                      });
                    }}
                  />
                </div>
                {column.columns.map(({ label }, subcolumnIndex) => {
                  return (
                    <div key={subcolumnIndex} css={subcolumnCss(subcolumnIndex)}>
                      {label}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          }
        }
        return null;
      })}
      {avvenimenti.map((avvenimento, avvenimentoIndex) => {
        const [squadraA, squadraB] = avvenimento.descrizioneAvvenimento.split(" - ");
        return (
          <React.Fragment key={avvenimento.sogeicodevento}>
            <div
              style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
              css={css`
                grid-column: avvenimento;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                color: #333333;
                font-family: Roboto;
                font-size: 16px;
                font-weight: bold;
              `}
            >
              <div>{squadraA}</div>
              <div>{squadraB}</div>
            </div>
            <div
              style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
              css={css`
                border-bottom: 1px solid #ededed;
                margin: 0 -10px;
                grid-column: 1 / -1;
              `}
            />
            {viewConfiguration.columns.map((column, columnIndex) => {
              switch (column.type) {
                case "simple": {
                  return (
                    <React.Fragment key={columnIndex}>
                      {column.columns.map((subcolumn, subcolumnIndex) => {
                        const scommessaKey = `${avvenimento.sogeicodevento}_${subcolumn.idScommessa}`;

                        const esito = esiti[avvenimento.sogeicodevento]?.[subcolumn.idScommessa]?.[subcolumn.idEsito];
                        return (
                          <div
                            key={subcolumnIndex}
                            style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
                            css={css`
                              grid-column: c-${columnIndex}-${subcolumnIndex};
                              justify-self: center;
                              align-self: center;
                            `}
                          >
                            {esito && (
                              <EsitoButtonA
                                evento={evento}
                                scommessa={scommesse[scommessaKey]}
                                esito={esito}
                                inCorso={false}
                              />
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                }
                case "multi": {
                  const idScommessa =
                    columnSelection[columnIndex]?.byAvvenimento[avvenimento.sogeicodevento] ??
                    column.defaultIdScommessa;
                  const selectionByColumn = columnSelection[columnIndex] ?? {
                    idScommessa,
                    byAvvenimentoi: {},
                  };
                  return (
                    <React.Fragment key={columnIndex}>
                      <div
                        style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
                        css={css`
                          grid-column: c-${columnIndex}-${NaN};
                          justify-self: center;
                          align-self: center;
                        `}
                      >
                        <SelectScommessaButton
                          options={column.dropdown}
                          idScommessa={idScommessa}
                          onChange={(idScommessa) => {
                            setColumnSelection({
                              ...columnSelection,
                              [columnIndex]: {
                                ...selectionByColumn,
                                byAvvenimento: {
                                  ...selectionByColumn.byAvvenimento,
                                  [avvenimento.sogeicodevento]: idScommessa,
                                },
                              },
                            });
                          }}
                        />
                      </div>
                      {column.columns.map((subcolumn, subcolumnIndex) => {
                        const scommessaKey = `${avvenimento.sogeicodevento}_${idScommessa}`;
                        const esito = esiti[avvenimento.sogeicodevento]?.[idScommessa]?.[subcolumn.idEsito];
                        return (
                          <div
                            key={subcolumnIndex}
                            style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
                            css={css`
                              grid-column: c-${columnIndex}-${subcolumnIndex};
                              justify-self: center;
                              align-self: center;
                            `}
                          >
                            {esito && (
                              <EsitoButtonA
                                evento={evento}
                                scommessa={scommesse[scommessaKey]}
                                esito={esito}
                                inCorso={false}
                              />
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                }
              }
              return null;
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ViewNoColumnsTemplate({
  viewConfiguration,
  evento,
  avvenimenti,
  esiti,
  scommesse,
}: TemplateProps<ViewNoColumns>) {
  return (
    <div
      css={css`
        background-color: #ffffff;
      `}
    >
      {avvenimenti.map((avvenimento) => {
        const [squadraA, squadraB] = avvenimento.descrizioneAvvenimento.split(" - ");
        return (
          <div
            key={avvenimento.sogeicodevento}
            css={css`
              display: flex;
              border-bottom: 1px solid #ededed;
              padding: 5px;
            `}
          >
            <div
              css={css`
                flex-grow: 1;
                color: #333333;
                font-family: Roboto;
                font-size: 16px;
                font-weight: bold;
                padding: 5px;
              `}
            >
              <div>{squadraA}</div>
              <div>{squadraB}</div>
            </div>
            <div
              css={css`
                width: 715px;
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
              `}
            >
              {(Object.values(
                esiti[avvenimento.sogeicodevento]?.[viewConfiguration.idScommessa] ?? {},
              ) as Array<EsitoVirtuale>)
                .sort((a, b) => a.id - b.id)
                .map((esito) => {
                  const scommessaKey = `${avvenimento.sogeicodevento}_${viewConfiguration.idScommessa}`;
                  return (
                    <div
                      key={esito.id}
                      css={css`
                        margin: 5px;
                        & > button {
                          width: 55px;
                          height: 45px;
                        }
                      `}
                    >
                      {esito && (
                        <EsitoButtonB
                          evento={evento}
                          scommessa={scommesse[scommessaKey]}
                          esito={esito}
                          inCorso={false}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ViewMergedColumnsTemplate({
  viewConfiguration,
  avvenimenti,
  esiti,
  evento,
  scommesse,
}: TemplateProps<ViewMergedColumns>) {
  const dynamicGridTemplateRows = viewConfiguration.columns
    .flatMap((column, firstIndex) => column.columns.map((_, secondIndex) => `[c-${firstIndex}-${secondIndex}] 55px`))
    .join(" ");
  return (
    <div
      css={css`
        display: grid;
        grid-template-rows: [first] auto [second] auto repeat(${avvenimenti.length}, [avvenimento] 65px);
        grid-template-columns: [avvenimento] 1fr ${dynamicGridTemplateRows};
        grid-column-gap: 10px;
        padding: 0px 10px 0 10px;
        background-color: #ffffff;
      `}
    >
      <div
        css={css`
          grid-row: second;
          grid-column: c-0-0 / -1;
          background-color: #0b7d3e;
        `}
      />
      {viewConfiguration.columns.map((column, firstIndex) => {
        return (
          <React.Fragment key={firstIndex}>
            {viewConfiguration.columns.length > 1 && (
              <div
                css={css`
                  grid-row: first;
                  grid-column: c-${firstIndex}-0 / span ${column.columns.length};
                  color: #005936;
                  font-family: Roboto;
                  font-size: 14px;
                  font-weight: bold;
                  letter-spacing: 0;
                  text-align: center;
                  padding-bottom: 4px;
                  padding-top: 6px;
                `}
              >
                {column.label}
              </div>
            )}
            {column.columns.map(({ label }, secondIndex) => {
              return (
                <div
                  key={secondIndex}
                  css={css`
                    grid-row: second;
                    grid-column: c-${firstIndex}-${secondIndex};
                    height: 30px;
                    color: #ffffff;
                    font-family: Roboto;
                    font-size: 16px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  `}
                >
                  {label}
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
      {avvenimenti.map((avvenimento, avvenimentoIndex) => {
        const [squadraA, squadraB] = avvenimento.descrizioneAvvenimento.split(" - ");
        return (
          <React.Fragment key={avvenimento.sogeicodevento}>
            <div
              style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
              css={css`
                grid-column: avvenimento;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                color: #333333;
                font-family: Roboto;
                font-size: 16px;
                font-weight: bold;
              `}
            >
              <div>{squadraA}</div>
              <div>{squadraB}</div>
            </div>
            <div
              style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
              css={css`
                border-bottom: 1px solid #ededed;
                margin: 0 -10px;
                grid-column: 1 / -1;
              `}
            />
            {viewConfiguration.columns.map((column, columnIndex) => {
              return (
                <React.Fragment key={columnIndex}>
                  {column.columns.map((subcolumn, subcolumnIndex) => {
                    const scommessaKey = `${avvenimento.sogeicodevento}_${subcolumn.idScommessa}`;
                    const esito = esiti[avvenimento.sogeicodevento]?.[subcolumn.idScommessa]?.[subcolumn.idEsito];
                    return (
                      <div
                        key={subcolumnIndex}
                        style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
                        css={css`
                          grid-column: c-${columnIndex}-${subcolumnIndex};
                          justify-self: center;
                          align-self: center;
                        `}
                      >
                        {esito && (
                          <EsitoButtonA
                            evento={evento}
                            scommessa={scommesse[scommessaKey]}
                            esito={esito}
                            inCorso={false}
                          />
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function EsitoButtonA({ evento, scommessa, esito, inCorso }: EsitoButtonProps) {
  const { isInCarrello, addToCarrello } = useEsitoButton({ evento, scommessa, esito, inCorso });
  return (
    <div
      css={css`
        width: 55px;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        background-color: ${isInCarrello ? "#aac21f" : "#ededed"};
        color: ${isInCarrello ? "#ffffff" : "#333333"};
        font-family: Roboto;
        font-size: 16px;
        pointer-events: ${inCorso ? "none" : "auto"};
        cursor: ${inCorso ? "default" : "pointer"};
        :hover {
          background-color: ${inCorso ? "#ededed" : "#aac21f"};
          color: #ffffff;
        }
        opacity: ${inCorso ? 0.8 : 1};
      `}
      onClick={addToCarrello}
    >
      {inCorso ? "-" : esito.formattedQuota}
    </div>
  );
}

function EsitoButtonB({ evento, scommessa, esito, inCorso }: EsitoButtonProps) {
  const { isInCarrello, addToCarrello } = useEsitoButton({ evento, scommessa, esito, inCorso });
  return (
    <div
      css={css`
        width: 55px;
        height: 45px;
        background-color: ${isInCarrello ? "#aac21f" : "#ededed"};
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        font-family: Roboto;
        flex-direction: column;
        pointer-events: ${inCorso ? "none" : "auto"};
        cursor: ${inCorso ? "default" : "pointer"};
        :hover {
          background-color: ${inCorso ? "#ededed" : "#aac21f"};
        }
        opacity: ${inCorso ? 0.8 : 1};
      `}
      onClick={addToCarrello}
    >
      <div
        css={css`
          font-weight: bold;
          color: #005936;
          font-size: 14px;
        `}
      >
        {esito.descrizione}
      </div>
      <div
        css={css`
          color: #333333;
          font-size: 16px;
        `}
      >
        {inCorso ? "-" : esito.formattedQuota}
      </div>
    </div>
  );
}

function SelectScommessaButton({
  idScommessa,
  options,
  onChange,
}: {
  idScommessa: number;
  options: Array<{ label: string; idScommessa: number }>;
  onChange(idScommessa: number): void;
}) {
  const option = options.find((o) => o.idScommessa === idScommessa);
  const { isOpen, setIsOpen, selectRef } = useForeignClickOpen();
  return (
    <div
      css={css`
        position: relative;
      `}
      ref={selectRef}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div
        css={css`
          width: 55px;
          height: 45px;
          background-color: #ffffff;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          border-radius: 4px;
          border: 2px solid #ededed;
          box-sizing: border-box;
        `}
      >
        {option?.label}
        <img
          src={isOpen ? icoArrowUpGreen : icoArrowDownGreen}
          css={css`
            width: 7px;
            height: 7px;
          `}
          alt="dropdown indicator"
        />
      </div>
      <SelectScommessaOption isOpen={isOpen} options={options} idScommessa={idScommessa} onChange={onChange} />
    </div>
  );
}

function SelectScommesseButton({
  idScommessa,
  options,
  onChange,
}: {
  idScommessa: number;
  options: Array<{ label: string; idScommessa: number }>;
  onChange(idScommessa: number): void;
}) {
  const option = options.find((o) => o.idScommessa === idScommessa);
  const { isOpen, setIsOpen, selectRef } = useForeignClickOpen();
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        box-sizing: border-box;
        position: relative;
        width: 55px;
        height: 30px;
      `}
      ref={selectRef}
      onClick={() => setIsOpen(!isOpen)}
    >
      {option?.label}
      <img
        src={isOpen ? icoArrowUpWhite : icoArrowDownWhite}
        css={css`
          width: 7px;
          height: 7px;
        `}
        alt="dropdown indicator"
      />
      <SelectScommessaOption isOpen={isOpen} options={options} idScommessa={idScommessa} onChange={onChange} />
    </div>
  );
}

function SelectScommessaOption({
  isOpen,
  idScommessa,
  onChange,
  options,
}: {
  isOpen: boolean;
  options: Array<{ label: string; idScommessa: number }>;
  idScommessa: number;
  onChange(idScommessa: number): void;
}) {
  return (
    <>
      {isOpen && (
        <div
          css={css`
            position: absolute;
            z-index: 1;
            top: 100%;
            left: 0;
            width: 55px;
            box-sizing: border-box;
            background-color: #005936;
            box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.5);
            color: #ffffff;
            font-family: Roboto;
            font-size: 16px;
            font-weight: bold;
          `}
        >
          {options.map((option) => (
            <div
              key={option.idScommessa}
              css={css`
                &:hover {
                  color: #aac21f;
                }
                height: 45px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                background-color: ${option.idScommessa === idScommessa ? "#AAC21F" : "inherit"};
              `}
              onClick={() => onChange(option.idScommessa)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

type EsitoButtonProps = {
  evento: EventoVirtualeCampionato;
  scommessa: ScommessaVirtualeBase;
  esito: EsitoVirtuale;
  inCorso: boolean;
};

function useEsitoButton({ evento, scommessa, esito }: EsitoButtonProps) {
  const chiaveEsitoBigliettoVirtualComponents = getChiaveEsitoBigliettoVirtualComponents({ evento, scommessa, esito });
  const addEsitoToBiglietto = useAddEsitoToBiglietto();
  const esitiVirtualInCarrello = useContext(EsitiVirtualInBigliettoContext);
  const isInCarrello = esitiVirtualInCarrello.has(makeChiaveEsitoVirtual(chiaveEsitoBigliettoVirtualComponents));
  const addToCarrello = () => addEsitoToBiglietto.esitoVirtual(chiaveEsitoBigliettoVirtualComponents);
  return { isInCarrello, addToCarrello };
}

function getChiaveEsitoBigliettoVirtualComponents({
  evento,
  scommessa,
  esito,
}: {
  evento: EventoVirtualeCampionato;
  scommessa: ScommessaVirtualeBase;
  esito: EsitoVirtuale;
}): ChiaveEsitoBigliettoVirtualComponents {
  const { dataEvento, descrdisc, eventId, formattedData, formattedOrario, idDisciplina, provider } = evento;
  const {
    descrizione: descrizioneScommessa,
    id: idScommessa,
    rtp,
    stato,
    sogeicodpalinsesto,
    sogeicodevento,
    result,
  } = scommessa;
  const { quota, descrizione: descrizioneEsito, formattedQuota, id: idEsito, probwin } = esito;
  return {
    dataEvento,
    descrizioneScommessa,
    descrizioneEsito,
    descrdisc,
    descrEvento: descrdisc,
    eventId,
    formattedData,
    formattedOrario,
    formattedQuota,
    idDisciplina,
    idEsito,
    idScommessa,
    probwin,
    provider,
    quota,
    result,
    rtp,
    sogeicodevento,
    sogeicodpalinsesto,
    stato,
  };
}

function getTemplateConfiguration(): Array<ClusterList> {
  return [
    {
      label: "Principali",
      clusters: [
        {
          label: "",
          viewConfiguration: {
            type: "view-columns",
            columns: [
              {
                type: "simple",
                label: "ESITO FINALE",
                columns: [
                  { label: "1", idScommessa: 216, idEsito: 1 },
                  { label: "X", idScommessa: 216, idEsito: 2 },
                  { label: "2", idScommessa: 216, idEsito: 3 },
                ],
              },
              {
                type: "simple",
                label: "DOPPIA CHANCE",
                columns: [
                  { label: "1X", idScommessa: 226, idEsito: 1 },
                  { label: "X2", idScommessa: 227, idEsito: 1 },
                  { label: "12", idScommessa: 228, idEsito: 1 },
                ],
              },
              {
                type: "multi",
                label: "UNDER / OVER",
                defaultIdScommessa: 218,
                dropdown: [
                  { label: "1.5", idScommessa: 217 },
                  { label: "2.5", idScommessa: 218 },
                ],
                columns: [
                  { label: "U", idEsito: 1 },
                  { label: "O", idEsito: 2 },
                ],
              },
              {
                type: "simple",
                label: "GOAL / NO GOAL",
                columns: [
                  { label: "G", idScommessa: 223, idEsito: 1 },
                  { label: "NG", idScommessa: 223, idEsito: 2 },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      label: "Goal",
      clusters: [
        {
          label: "Top Goal",
          viewConfiguration: {
            type: "view-columns",
            columns: [
              {
                type: "simple",
                label: "GOAL/NOGOAL",
                columns: [
                  { label: "G", idScommessa: 223, idEsito: 1 },
                  { label: "NG", idScommessa: 223, idEsito: 2 },
                ],
              },
              {
                type: "simple",
                label: "SEGNA CASA",
                columns: [
                  { label: "SI", idScommessa: 220, idEsito: 1 },
                  { label: "NO", idScommessa: 220, idEsito: 2 },
                ],
              },
              {
                type: "simple",
                label: "SEGNA OSPITE",
                columns: [
                  { label: "SI", idScommessa: 221, idEsito: 1 },
                  { label: "NO", idScommessa: 221, idEsito: 2 },
                ],
              },
              {
                type: "simple",
                label: "PRIMO A SEGNARE",
                columns: [
                  { label: "1", idScommessa: 222, idEsito: 1 },
                  { label: "2", idScommessa: 222, idEsito: 2 },
                  { label: "NESS", idScommessa: 222, idEsito: 3 },
                ],
              },
            ],
          },
        },
        { label: "Risultato Esatto", viewConfiguration: { type: "view-no-columns", idScommessa: 231 } },
        {
          label: "Somma Goal",
          viewConfiguration: {
            type: "view-merged-columns",
            columns: [
              {
                label: "",
                columns: [
                  { label: "Ness", idScommessa: 229, idEsito: 1 },
                  { label: "1", idScommessa: 229, idEsito: 2 },
                  { label: "2", idScommessa: 229, idEsito: 3 },
                  { label: "3", idScommessa: 229, idEsito: 4 },
                  { label: "4", idScommessa: 229, idEsito: 5 },
                  { label: "5", idScommessa: 229, idEsito: 6 },
                  { label: "6", idScommessa: 229, idEsito: 7 },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      label: "Combo",
      clusters: [
        {
          label: "1X2 + Under / Over 1.5",
          viewConfiguration: {
            type: "view-merged-columns",
            columns: [
              {
                label: "Under",
                columns: [
                  { label: "1+U", idScommessa: 224, idEsito: 2 },
                  { label: "X+U", idScommessa: 224, idEsito: 4 },
                  { label: "2+U", idScommessa: 224, idEsito: 6 },
                ],
              },
              {
                label: "Over",
                columns: [
                  { label: "1+O", idScommessa: 224, idEsito: 1 },
                  { label: "X+O", idScommessa: 224, idEsito: 3 },
                  { label: "2+O", idScommessa: 224, idEsito: 5 },
                ],
              },
            ],
          },
        },
        {
          label: "1X2 + Under / Over 2.5",
          viewConfiguration: {
            type: "view-merged-columns",
            columns: [
              {
                label: "Under",
                columns: [
                  { label: "1+U", idScommessa: 225, idEsito: 2 },
                  { label: "X+U", idScommessa: 225, idEsito: 4 },
                  { label: "2+U", idScommessa: 225, idEsito: 6 },
                ],
              },
              {
                label: "Over",
                columns: [
                  { label: "1+O", idScommessa: 225, idEsito: 1 },
                  { label: "X+O", idScommessa: 225, idEsito: 3 },
                  { label: "2+O", idScommessa: 225, idEsito: 5 },
                ],
              },
            ],
          },
        },
        {
          label: "1X2 + Goal / No Goal",
          viewConfiguration: {
            type: "view-merged-columns",
            columns: [
              {
                label: "Esito Finale",
                columns: [
                  { label: "1+GG", idScommessa: 230, idEsito: 1 },
                  { label: "X+GG", idScommessa: 230, idEsito: 3 },
                  { label: "2+GG", idScommessa: 230, idEsito: 5 },
                ],
              },
              {
                label: "No Goal",
                columns: [
                  { label: "1+NG", idScommessa: 230, idEsito: 2 },
                  { label: "X+NG", idScommessa: 230, idEsito: 4 },
                  { label: "2+NG", idScommessa: 230, idEsito: 6 },
                ],
              },
            ],
          },
        },
      ],
    },
  ];
}
