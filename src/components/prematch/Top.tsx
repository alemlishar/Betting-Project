import React, { useCallback, useMemo } from "react";
import {
  Avvenimento,
  Disciplina,
  getHomePagePalinsesto,
  InfoAggiuntiva,
  Manifestazione,
  MetaScommessaTemplate,
  Scommessa,
} from "src/components/prematch/prematch-api";
import {
  ChiaveScommessa,
  ChiaveInfoAggiuntiva,
  ChiaveManifestazione,
  makeChiaveManifestazione,
  CodiceDisciplina,
  makeChiaveScommessa,
  CodiceAvvenimento,
  CodiceManifestazione,
  CodicePalinsesto,
} from "src/types/chiavi";
import { css } from "styled-components/macro";
import useSWR from "swr";
import {
  getFlattenedHeaderLayoutInfo,
  infoAggiuntivaWithMinimumAverageDeviation,
} from "src/components/prematch/templates/TemplateMultiScommessa";
import { capitalize } from "lodash";
import { useMultiscommessaStructure } from "src/components/prematch/templates/useMultiscommessaStructure";
import { InfoAggiuntivaSelectProps } from "src/components/prematch/templates/InfoAggiuntivaSelect";
import { NPlusProps } from "src/components/prematch/templates/NPlus";
import { setFallbackImageSrc } from "src/components/prematch/templates/utils";
import { EsitoNonQuotatoPrematchMemo } from "src/components/prematch/templates/Esito";
import { DescrizioneAvvenimentoProps } from "src/components/prematch/templates/DescrizioneAvvenimento";
import { EsitoProps } from "src/components/esito/Esito";
import { SezioneAttiva } from "src/components/root-container/useNavigazione";
import configuration from "src/helpers/configuration";

// DEBT 1: Parametizzare componenti Live: infoAggiuntivaSelectHeader, infoAggiuntivaSelect
// DEBT 2: performance

export type DisciplinaHeaderProps = {
  disciplina: Disciplina;
};

type TopSpecializedProps = {
  NPlus: React.ComponentType<NPlusProps>;
  disciplinaHeaderBackGroundColor: string;
  DisciplinaHeader: React.ComponentType<DisciplinaHeaderProps>;
  DescrizioneAvvenimento: React.ComponentType<DescrizioneAvvenimentoProps>;
  InfoAggiuntivaSelectHeader: React.ComponentType<InfoAggiuntivaSelectProps>;
  InfoAggiuntivaSelect: React.ComponentType<InfoAggiuntivaSelectProps>;
  Esito: React.ComponentType<EsitoProps>;
  openSchedaAvvenimento({
    disciplina,
    manifestazione,
    avvenimento,
    previousSezione,
    codiceDisciplina,
    codiceManifestazione,
    codiceAvvenimento,
    codicePalinsesto,
  }: {
    disciplina: Disciplina;
    manifestazione: Manifestazione;
    avvenimento: Avvenimento;
    previousSezione: SezioneAttiva;
    codiceDisciplina: CodiceDisciplina;
    codiceManifestazione: CodiceManifestazione;
    codiceAvvenimento: CodiceAvvenimento;
    codicePalinsesto: CodicePalinsesto;
  }): void;
};
// DEBT performance
export function Top({
  disciplinaHeaderBackGroundColor,
  NPlus,
  DisciplinaHeader,
  DescrizioneAvvenimento,
  InfoAggiuntivaSelectHeader,
  InfoAggiuntivaSelect,
  type,
  Esito,
  manifestazioneMap,
  openSchedaAvvenimento,
}: TopSpecializedProps & { type: string; manifestazioneMap?: Record<ChiaveManifestazione, Manifestazione> }) {
  const { data } = useSWR(type, getHomePagePalinsesto); // DEBT 1 Descrizione parametrizzare correttamente
  // DEBT 1 forse serve diverso per la live
  const u = useMemo(() => {
    // THERE WILL BE DRAGONS
    if (!manifestazioneMap || !data) {
      return null;
    }
    const { scommessaMap, infoAggiuntivaMap, avvenimentoFeList, metaScommessaTemplateList } = data;
    const disciplinaList = data.disciplinaList;
    const avvenimentoListByDisciplina: Record<CodiceDisciplina, Array<Avvenimento>> = {};
    const avvenimentoListByManifestazione: Record<ChiaveManifestazione, Array<Avvenimento>> = {};
    for (const avvenimento of avvenimentoFeList) {
      const chiaveManifestazione = makeChiaveManifestazione(avvenimento);
      // avvenimento list by disciplina
      const codiceDisciplina = avvenimento.codiceDisciplina;
      const avvenimentoListDisciplina =
        avvenimentoListByDisciplina[codiceDisciplina] ?? (avvenimentoListByDisciplina[codiceDisciplina] = []);
      avvenimentoListDisciplina.push(avvenimento);
      // avvenimento list by manifestazione
      const avvenimentoListManifestazione =
        avvenimentoListByManifestazione[chiaveManifestazione] ??
        (avvenimentoListByManifestazione[chiaveManifestazione] = []);
      avvenimentoListManifestazione.push(avvenimento);
    }
    const metaScommessaTemplateByDisciplina = Object.fromEntries(
      disciplinaList.flatMap((disciplina) => {
        const metaScommessaTemplate = metaScommessaTemplateList.find(
          (metaScommessaTemplate) => metaScommessaTemplate.codiceDisciplina === disciplina.codiceDisciplina,
        );
        if (metaScommessaTemplate) {
          return [[disciplina.codiceDisciplina, metaScommessaTemplate] as const];
        } else {
          return [];
        }
      }),
    );

    const manifestazioneListByDisciplina = Object.fromEntries(
      disciplinaList
        .filter((disciplina) => avvenimentoListByDisciplina[disciplina.codiceDisciplina]?.length > 0)
        .map((disciplina) => {
          return [
            disciplina.codiceDisciplina,
            Object.values(manifestazioneMap).filter(
              (manifestazione) =>
                manifestazione.codiceDisciplina === disciplina.codiceDisciplina &&
                avvenimentoListByManifestazione[manifestazione.key]?.length > 0,
            ),
          ] as const;
        }),
    );
    return {
      disciplinaList,
      manifestazioneListByDisciplina,
      avvenimentoListByDisciplina,
      avvenimentoListByManifestazione,
      metaScommessaTemplateByDisciplina,
      scommessaMap,
      infoAggiuntivaMap,
    };
  }, [manifestazioneMap, data]);
  if (!u) {
    return null;
  }
  const {
    metaScommessaTemplateByDisciplina,
    avvenimentoListByDisciplina,
    avvenimentoListByManifestazione,
    disciplinaList,
    manifestazioneListByDisciplina,
    scommessaMap,
    infoAggiuntivaMap,
  } = u;
  return (
    <div
      css={css`
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
        `}
      >
        {disciplinaList.map((disciplina) => {
          const metaScommessaTemplate = metaScommessaTemplateByDisciplina[disciplina.codiceDisciplina];
          const manifestazioneList = manifestazioneListByDisciplina[disciplina.codiceDisciplina];
          const avvenimentoList = avvenimentoListByDisciplina[disciplina.codiceDisciplina];
          if (!metaScommessaTemplate) {
            return null;
          }
          if (!metaScommessaTemplate.infoTemplate) {
            return null;
          }
          if (!manifestazioneList) {
            return null;
          }
          return (
            <TopDisciplina
              key={disciplina.codiceDisciplina}
              disciplina={disciplina}
              avvenimentoList={avvenimentoList}
              metaScommessaTemplate={metaScommessaTemplate}
              manifestazioneList={manifestazioneList}
              avvenimentoListByManifestazione={avvenimentoListByManifestazione}
              scommessaMap={scommessaMap}
              infoAggiuntivaMap={infoAggiuntivaMap}
              NPlus={NPlus}
              disciplinaHeaderBackGroundColor={disciplinaHeaderBackGroundColor}
              DisciplinaHeader={DisciplinaHeader}
              DescrizioneAvvenimento={DescrizioneAvvenimento}
              InfoAggiuntivaSelectHeader={InfoAggiuntivaSelectHeader}
              InfoAggiuntivaSelect={InfoAggiuntivaSelect}
              Esito={Esito}
              openSchedaAvvenimento={openSchedaAvvenimento}
            />
          );
        })}
      </div>
    </div>
  );
}
type TopPrematchDisciplinaProps = {
  disciplina: Disciplina;
  metaScommessaTemplate: MetaScommessaTemplate;
  manifestazioneList: Array<Manifestazione>;
  avvenimentoList: Array<Avvenimento>;
  avvenimentoListByManifestazione: Record<ChiaveManifestazione, Array<Avvenimento>>;
  scommessaMap: Record<ChiaveScommessa, Scommessa>;
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva>;
} & TopSpecializedProps;
function TopDisciplina({
  disciplina,
  metaScommessaTemplate,
  manifestazioneList,
  avvenimentoList,
  avvenimentoListByManifestazione,
  scommessaMap,
  infoAggiuntivaMap,
  NPlus,
  disciplinaHeaderBackGroundColor,
  DisciplinaHeader,
  DescrizioneAvvenimento,
  InfoAggiuntivaSelectHeader,
  InfoAggiuntivaSelect,
  Esito,
  openSchedaAvvenimento,
}: TopPrematchDisciplinaProps) {
  const flattenedHeaderLayoutInfo = getFlattenedHeaderLayoutInfo(
    metaScommessaTemplate.infoTemplate,
    configuration.NUMBER_HOME_CDE_VIEW,
  );
  const { columns, sections } = flattenedHeaderLayoutInfo;
  const multiscommessaStructure = useMultiscommessaStructure({
    avvenimentoList,
    sections: metaScommessaTemplate.infoTemplate.sections,
    scommessaMap,
    infoAggiuntivaMap,
    customDefaultInfoAggiuntiva: infoAggiuntivaWithMinimumAverageDeviation,
  });
  const { headers, setIdInfoAggiuntivaSelectedByColumnGroup } = multiscommessaStructure;
  return (
    <div
      key={disciplina.codiceDisciplina}
      css={css`
        display: grid;
        grid-template-columns:
          [avvenimento] auto repeat(${columns.length}, [col] min-content)
          [n-plus] min-content;
        grid-gap: 0px 10px;
        margin-bottom: 10px;
        background-color: white;
      `}
      style={{
        gridTemplateRows: `repeat(2, [header] auto) ${manifestazioneList
          .map(
            (manifestazione) =>
              `[manifestazione-${manifestazione.codiceManifestazione}] auto [separator-${manifestazione.key}] auto ${
                avvenimentoListByManifestazione[manifestazione.key]
                  ?.map((avvenimento) => `[avvenimento-${avvenimento.key}] 65px [separator-${avvenimento.key}] auto`)
                  .join(" ") ?? ""
              }`,
          )
          .join(" ")}`,
      }}
    >
      <div
        css={css`
          grid-column: 1 / -1;
          grid-row: header 1 / span 2;
          background-color: ${disciplinaHeaderBackGroundColor};
        `}
      />
      <div
        css={css`
          grid-column: avvenimento;
          grid-row: header 1 / span 2;
          font-family: Roboto;
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 20px;
          text-align: center;
          color: #ffffff;
          height: 25px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          padding: 20px 10px;
        `}
      >
        <DisciplinaHeader disciplina={disciplina} />
      </div>
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
      {sections.map(({ section, offset, length }, sectionIndex) => {
        return (
          <div
            key={sectionIndex}
            style={{ gridColumn: `col ${offset + 1} / span ${length}` }}
            css={css`
              grid-row: header 1;
              font-family: Roboto;
              font-size: 0.875rem;
              font-weight: 700;
              letter-spacing: 0;
              line-height: 16px;
              text-align: center;
              color: #ffffff;
              height: 35px;
              display: flex;
              justify-content: center;
              align-items: center;
              white-space: nowrap;
            `}
          >
            {section.header}
          </div>
        );
      })}
      {columns.map(({ columnIndex, sectionIndex, columnGroupIndex }, columnFlatIndex) => {
        return (
          <div
            key={columnFlatIndex}
            style={{ gridColumn: `col ${columnFlatIndex + 1}` }}
            css={css`
              grid-row: header 2;
              color: #333333;
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
                    <InfoAggiuntivaSelectHeader
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
      {manifestazioneList.map((manifestazione) => {
        const avvenimentoList = avvenimentoListByManifestazione[manifestazione.key];

        return (
          <TopManifestazione
            key={manifestazione.key}
            disciplina={disciplina}
            manifestazione={manifestazione}
            avvenimentoList={avvenimentoList}
            DescrizioneAvvenimento={DescrizioneAvvenimento}
            InfoAggiuntivaSelect={InfoAggiuntivaSelect}
            NPlus={NPlus}
            Esito={Esito}
            scommessaMap={scommessaMap}
            openSchedaAvvenimento={openSchedaAvvenimento}
            {...flattenedHeaderLayoutInfo}
            {...multiscommessaStructure}
          />
        );
      })}
    </div>
  );
}

type TopManifestazioneProps = {
  manifestazione: Manifestazione;
  disciplina: Disciplina;
  avvenimentoList: Array<Avvenimento>;
  scommessaMap: Record<ChiaveScommessa, Scommessa>;
  InfoAggiuntivaSelect: React.ComponentType<InfoAggiuntivaSelectProps>;
  DescrizioneAvvenimento: React.ComponentType<DescrizioneAvvenimentoProps>;
  NPlus: React.ComponentType<NPlusProps>;
  Esito: React.ComponentType<EsitoProps>;
  openSchedaAvvenimento({
    disciplina,
    manifestazione,
    avvenimento,
    previousSezione,
    codiceDisciplina,
    codiceManifestazione,
    codiceAvvenimento,
    codicePalinsesto,
  }: {
    disciplina: Disciplina;
    manifestazione: Manifestazione;
    avvenimento: Avvenimento;
    previousSezione: SezioneAttiva;
    codiceDisciplina: CodiceDisciplina;
    codiceManifestazione: CodiceManifestazione;
    codiceAvvenimento: CodiceAvvenimento;
    codicePalinsesto: CodicePalinsesto;
  }): void;
} & ReturnType<typeof getFlattenedHeaderLayoutInfo> &
  ReturnType<typeof useMultiscommessaStructure>;
function TopManifestazione({
  manifestazione,
  disciplina,
  avvenimentoList,
  InfoAggiuntivaSelect,
  scommessaMap,
  DescrizioneAvvenimento,
  NPlus,
  setIdInfoAggiuntivaSelectedByAvvenimento,
  columns,
  content,
  Esito,
  openSchedaAvvenimento,
}: TopManifestazioneProps) {
  const onOpenAvvenimento = useCallback(
    (avvenimento: Avvenimento) => {
      openSchedaAvvenimento({
        disciplina,
        manifestazione,
        avvenimento,
        previousSezione: "sport",
        codicePalinsesto: avvenimento.codicePalinsesto,
        codiceDisciplina: avvenimento.codiceDisciplina,
        codiceManifestazione: avvenimento.codiceManifestazione,
        codiceAvvenimento: avvenimento.codiceAvvenimento,
      });
    },
    [disciplina, manifestazione, openSchedaAvvenimento],
  );
  return (
    <React.Fragment key={manifestazione.key}>
      <div
        css={css`
          grid-column: 1 / -1;
          grid-row: ${"manifestazione-" + manifestazione.codiceManifestazione};
          background-color: #f4f4f4;
          padding: 10px;
          display: flex;
          align-items: center;
        `}
      >
        <img
          src={manifestazione?.urlIcona}
          onError={setFallbackImageSrc(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEW7u7s18zFcAAAAC0lEQVQIHWMYYQAAAPAAASEIRrcAAAAASUVORK5CYII=",
          )}
          css={css`
            box-sizing: border-box;
            height: 20px;
            width: 20px;
            margin-right: 6px;
            border-radius: 50%;
          `}
          alt="icona-disciplina"
        />
        <span
          css={css`
            color: #222222;
            font-family: Roboto;
            font-size: 16px;
            font-weight: 500;
            letter-spacing: 0;
            line-height: 21px;
          `}
        >
          {manifestazione.descrizione}
        </span>
      </div>
      {avvenimentoList?.map((avvenimento) => {
        const numeroScommesse = avvenimento.numeroScommesse - configuration.NUMBER_HOME_CDE_VIEW;
        const gridRow = `avvenimento-${avvenimento.key}`;
        // DEBT 3 memoizzare
        const openAvvenimento = () =>
          openSchedaAvvenimento({
            disciplina,
            manifestazione,
            avvenimento,
            previousSezione: "sport",
            codicePalinsesto: avvenimento.codicePalinsesto,
            codiceAvvenimento: avvenimento.codiceAvvenimento,
            codiceDisciplina: avvenimento.codiceDisciplina,
            codiceManifestazione: avvenimento.codiceManifestazione,
          });
        return (
          <React.Fragment key={avvenimento.key}>
            <div
              css={css`
                grid-column: avvenimento;
                align-self: center;
                padding-left: 10px;
              `}
              style={{ gridRow }}
            >
              <DescrizioneAvvenimento avvenimento={avvenimento} onOpen={onOpenAvvenimento} />
            </div>
            {columns.map(({ sectionIndex, columnGroupIndex, columnIndex }, columnFlatIndex) => {
              const item = content[avvenimento.key][sectionIndex][columnGroupIndex][columnIndex];
              return (
                <div
                  key={`${columnFlatIndex}`}
                  style={{
                    gridRow,
                  }}
                  css={css`
                    grid-column: col ${columnFlatIndex + 1};
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
                    switch (item.type) {
                      case "esito": {
                        const { esito, infoAggiuntiva } = item;
                        return infoAggiuntiva && esito ? (
                          <Esito
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
                          <InfoAggiuntivaSelect
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
              style={{ gridRow }}
              css={css`
                grid-column: n-plus;
                justify-self: end;
                display: flex;
                align-items: center;
                white-space: nowrap;
                min-width: 47px;
                padding: 0px 0px;
                position: relative;
                padding-right: 10px;
              `}
            >
              {numeroScommesse > 0 && (
                <NPlus
                  numeroScommesse={numeroScommesse}
                  onClick={openAvvenimento}
                  codiceAvvenimento={avvenimento.codiceAvvenimento}
                  codicePalinsesto={avvenimento.codicePalinsesto}
                />
              )}
            </div>
            <div
              style={{ gridRow: `separator-${avvenimento.key}` }}
              css={css`
                grid-column: 1 / -1;
                height: 1px;
                background-color: #dcdcdc;
                /* margin: 0 -10px; */
              `}
            />
          </React.Fragment>
        );
      })}
      <div
        style={{ gridRow: `separator ${manifestazione.key}` }}
        css={css`
          grid-column: 1 / -1;
          height: 1px;
          background-color: #dcdcdc;
          /* margin: 0 -10px; */
        `}
      />
    </React.Fragment>
  );
}
