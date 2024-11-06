import { orderBy } from "lodash";
import React, { useMemo } from "react";
import { getStatoEsito } from "src/components/esito/Esito";
import { DescrizioneAvvenimentoLive } from "src/components/live/DescrizioneAvvenimentoLive";
import { getSchedaDisciplina } from "src/components/live/live-api";
import { EsitoNonQuotatoLiveMemo, EsitoQuotaConVariazioneLiveMemo } from "src/components/live/templates/Esito";
import { Avvenimento, Disciplina, InfoAggiuntiva, Scommessa } from "src/components/prematch/prematch-api";
import { InfoAggiuntivaSelectLive } from "src/components/prematch/templates/InfoAggiuntivaSelect";
import { NPlusLiveMemo } from "src/components/prematch/templates/NPlus";
import { getFlattenedHeaderLayoutInfo } from "src/components/prematch/templates/TemplateMultiScommessa";
import { useMultiscommessaStructure } from "src/components/prematch/templates/useMultiscommessaStructure";
import { setFallbackImageSrc } from "src/components/prematch/templates/utils";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { CodiceManifestazione, makeChiaveManifestazione, makeChiaveScommessa } from "src/types/chiavi";
import { css } from "styled-components/macro";
import useSWR from "swr";

type SchedaDisciplinaProps = {
  disciplina: Disciplina;
};

export function SchedaDisciplina({ disciplina }: SchedaDisciplinaProps) {
  const { data: scheda } = useSWR([disciplina.codiceDisciplina], getSchedaDisciplina, { refreshInterval: 5000 });
  const { openSchedaAvvenimentoLive } = useNavigazioneActions();
  const manifestazioneSortedList = useMemo(
    () =>
      scheda
        ? orderBy(Object.values(scheda.manifestazioneMap), [
            (manifestazione) => (manifestazione.posizione === 0 ? Number.MAX_VALUE : manifestazione.posizione),
            (manifestazione) => manifestazione.descrizione,
          ])
        : [],
    [scheda],
  );

  // TODO risolvere react-hooks/exhaustive-deps
  const avvenimentiByManifestazione = useMemo(() => {
    const avvenimentiByManifestazione: Record<CodiceManifestazione, Array<Avvenimento>> = [];
    manifestazioneSortedList.forEach((manifestazione) => {
      const avvenimentiMap = scheda?.avvenimentoFeMap;
      if (avvenimentiMap) {
        const avvenimenti = Object.values(avvenimentiMap).filter(
          (avvenimento) => avvenimento.codiceManifestazione === manifestazione.codiceManifestazione,
        );
        const avvenimentiOrdered = orderBy(avvenimenti, [
          (avvenimento) => new Date(avvenimento.data),
          (avvenimento) => avvenimento.descrizione,
        ]);
        avvenimentiByManifestazione[manifestazione.codiceManifestazione] = avvenimentiOrdered;
      }
    });
    return avvenimentiByManifestazione;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifestazioneSortedList, scheda?.avvenimentoFeMap, scheda]);

  const avvenimentoList = scheda ? Object.values(scheda.avvenimentoFeMap) : [];
  const sections =
    scheda && scheda.metaScommessaTemplateMapByDisciplinaKey
      ? Object.values(scheda.metaScommessaTemplateMapByDisciplinaKey)[0].infoTemplate?.sections || []
      : [];
  const scommessaMap: Record<string, Scommessa> = scheda?.scommessaMap || {};
  const infoAggiuntivaMap: Record<string, InfoAggiuntiva> = scheda?.infoAggiuntivaMap || {};
  const { content, setIdInfoAggiuntivaSelectedByAvvenimento } = useMultiscommessaStructure({
    avvenimentoList,
    sections,
    scommessaMap,
    infoAggiuntivaMap,
    customDefaultInfoAggiuntiva: firstInfoAggiuntivaWithOpenQuota,
  });

  if (!scheda) {
    return null;
  }
  return (
    <div
      css={css`
        height: calc(100% - 10px);
        flex-grow: 1;
        position: relative;
        overflow-y: scroll;
        ::-webkit-scrollbar {
          width: 0;
        }
      `}
    >
      <div
        css={css`
          position: absolute;
          width: 100%;
          height: 100%;
        `}
      >
        {manifestazioneSortedList.map((manifestazione) => {
          // TODO estrarre in componente template live multiscommessa
          // TODO realizzare componente strategy per i vari template live
          const numeroAvvenimenti = avvenimentiByManifestazione[manifestazione.codiceManifestazione].length;
          const metaScommessaTemplate = scheda.metaScommessaTemplateMapByDisciplinaKey[manifestazione.codiceDisciplina];
          if (!metaScommessaTemplate.infoTemplate) {
            return null;
          }
          const { sections, columns } = getFlattenedHeaderLayoutInfo(metaScommessaTemplate.infoTemplate, 3);
          const avvenimentoList = avvenimentiByManifestazione[manifestazione.codiceManifestazione] ?? [];
          return (
            <div
              key={makeChiaveManifestazione(manifestazione)}
              css={css`
                display: grid;
                grid-template-columns:
                  [avvenimento] 1fr repeat(${columns.length}, [col] max-content)
                  [n-plus] min-content;
                grid-gap: 10px 10px;
                margin-bottom: 10px;
                background-color: #ffffff;
                border-bottom: 1px solid #e5e5e5;
              `}
              style={{
                gridTemplateRows: `repeat(2, [header] auto) repeat(${avvenimentoList.length}, [avvenimento] auto [separator] 1px)`,
              }}
            >
              <div
                css={css`
                  grid-column: 1 /-1;
                  grid-row: header 1 / span 2;
                  background-color: #333333;
                `}
              ></div>
              <div
                css={css`
                  grid-column: avvenimento;
                  grid-row: header 1 / span 2;
                  box-sizing: border-box;
                  display: flex;
                  align-items: center;
                  height: 65px;
                  color: #ffffff;
                  font-family: Roboto;
                  font-size: 16px;
                  font-weight: 500;
                  letter-spacing: 0;
                  line-height: 21px;
                  padding: 10px;
                `}
              >
                <img
                  src={manifestazione.urlIcona}
                  onError={setFallbackImageSrc(
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEW7u7s18zFcAAAAC0lEQVQIHWMYYQAAAPAAASEIRrcAAAAASUVORK5CYII= ",
                  )}
                  css={css`
                    box-sizing: border-box;
                    height: 21px;
                    width: 21px;
                    border: 1px solid #f4f4f4;
                    border-radius: 21px;
                  `}
                  alt="manifestazione"
                />

                <div
                  css={css`
                    margin: 10px;
                  `}
                >
                  {manifestazione.descrizione}
                </div>
                <div
                  css={css`
                    box-sizing: border-box;
                    height: 22px;
                    min-width: 42px;
                    border: 2px solid #ffb800;
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #ffffff;
                    font-family: Roboto;
                    font-size: 14px;
                    font-weight: bold;
                    letter-spacing: 0;
                    line-height: 16px;
                    text-align: center;
                  `}
                >
                  {numeroAvvenimenti}
                </div>
              </div>
              {sections.map(({ section, offset, length }, sectionIndex) => {
                return (
                  <div
                    key={sectionIndex}
                    style={{ gridColumn: `col ${offset + 1} / span ${length}` }}
                    css={css`
                      grid-row: header 1;
                      text-align: center;
                      color: #ffffff;
                      font-family: Roboto;
                      font-size: 14px;
                      font-weight: 500;
                      letter-spacing: 0;
                      line-height: 19px;
                      text-align: center;
                      margin: 5px 5px -5px;
                    `}
                  >
                    {section.header}
                  </div>
                );
              })}
              {sections.map(({ section, offset, length }, sectionIndex) => {
                return (
                  <div
                    key={sectionIndex}
                    style={{ gridColumn: `col ${offset + 1} / span ${length}` }}
                    css={css`
                      grid-row: header 2;
                      background-color: #f4f4f4;
                    `}
                  ></div>
                );
              })}
              {columns.map(({ column }, columnIndex) => {
                return (
                  <div
                    key={columnIndex}
                    css={css`
                      grid-row: header 2;
                      text-align: center;
                      color: #333333;
                      font-family: Roboto;
                      font-size: 16px;
                      font-weight: bold;
                      letter-spacing: 0;
                      line-height: 21px;
                      text-align: center;
                      padding: 7px 3px;
                      min-width: 55px;
                      box-sizing: border-box;
                    `}
                    style={{ gridColumn: `col ${columnIndex + 1}` }}
                  >
                    {column.header}
                  </div>
                );
              })}

              {avvenimentoList.map((avvenimento, avvenimentoIndex) => {
                const numeroScommesse = avvenimento.numeroScommesse - sections.length;
                const openAvvenimento = () =>
                  openSchedaAvvenimentoLive({
                    disciplina,
                    manifestazione,
                    avvenimento,
                    previousSezione: "live",
                    codicePalinsesto: avvenimento.codicePalinsesto,
                    codiceAvvenimento: avvenimento.codiceAvvenimento,
                    codiceDisciplina: avvenimento.codiceDisciplina,
                    codiceManifestazione: avvenimento.codiceManifestazione,
                  });
                return (
                  <React.Fragment key={avvenimento.key}>
                    <div
                      css={css`
                        padding-left: 10px;
                      `}
                    >
                      <DescrizioneAvvenimentoLive avvenimento={avvenimento} onOpen={openAvvenimento} />
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
                                  <EsitoQuotaConVariazioneLiveMemo
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
                                  <EsitoNonQuotatoLiveMemo />
                                );
                              }
                              case "info aggiuntiva select": {
                                const { options, column, value } = item;
                                return (
                                  <InfoAggiuntivaSelectLive
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
                    {numeroScommesse > 0 ? (
                      <NPlusLiveMemo
                        codiceAvvenimento={avvenimento.codiceAvvenimento}
                        codicePalinsesto={avvenimento.codicePalinsesto}
                        numeroScommesse={numeroScommesse}
                        onClick={() => {
                          openSchedaAvvenimentoLive({
                            disciplina,
                            manifestazione,
                            avvenimento,
                            previousSezione: "live",
                            codicePalinsesto: avvenimento.codicePalinsesto,
                            codiceDisciplina: avvenimento.codiceDisciplina,
                            codiceManifestazione: avvenimento.codiceManifestazione,
                            codiceAvvenimento: avvenimento.codiceAvvenimento,
                          });
                        }}
                      />
                    ) : (
                      <div
                        css={css`
                          grid-column: n-plus;
                          height: 45px;
                          width: 55px;
                        `}
                      ></div>
                    )}
                    {avvenimentoIndex !== avvenimentoList.length - 1 && (
                      <div
                        css={css`
                          grid-column: 1 / -1;
                          border-bottom: 1px solid #dcdcdc;
                        `}
                        style={{
                          gridRow: `separator ${avvenimentoIndex + 1}`,
                        }}
                      ></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function firstInfoAggiuntivaWithOpenQuota(infoAggiuntive: Array<InfoAggiuntiva>) {
  return infoAggiuntive
    .filter(
      (infoAggiuntiva) => !infoAggiuntiva.esitoList.every((esito) => getStatoEsito(esito, infoAggiuntiva) === "chiuso"),
    )
    .sort((a, b) => a.idInfoAggiuntiva - b.idInfoAggiuntiva)[0];
}
