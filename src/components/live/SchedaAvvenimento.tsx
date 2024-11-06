import React, { useMemo, useState } from "react";
import { getInitConfiguration, getSchedaAvvenimento } from "src/components/live/live-api";
import { TemplateAvvenimento } from "src/components/live/templates/avvenimento/TemplateAvvenimento";
import { useLive } from "src/components/live/useLive";
import {
  Avvenimento,
  Cluster,
  Disciplina,
  Manifestazione,
  MetaScommessaTemplate,
  SchedaAvvenimentoContainer,
} from "src/components/prematch/prematch-api";
import { setFallbackImageSrc } from "src/components/prematch/templates/utils";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { timeFormatter } from "src/helpers/format-date";
import {
  CodiceAvvenimento,
  CodiceDisciplina,
  CodiceManifestazione,
  CodicePalinsesto,
  makeChiaveAvvenimento,
  makeChiaveManifestazione,
} from "src/types/chiavi";
import styled, { css } from "styled-components/macro";
import useSWR from "swr";

type SchedaAvvenimentoProps = {
  disciplina: Disciplina | undefined;
  manifestazione: Manifestazione | undefined;
  avvenimento: Avvenimento | undefined;
  codicePalinsesto: CodicePalinsesto;
  codiceDisciplina: CodiceDisciplina;
  codiceManifestazione: CodiceManifestazione;
  codiceAvvenimento: CodiceAvvenimento;
};

export function SchedaAvvenimento({
  disciplina,
  manifestazione,
  avvenimento,
  codicePalinsesto,
  codiceDisciplina,
  codiceManifestazione,
  codiceAvvenimento,
}: SchedaAvvenimentoProps) {
  const { data: initConfig } = useSWR("init", getInitConfiguration, { dedupingInterval: 60 * 60 * 1000 });
  const defaultNumberAccordionDefaultOpen = 10;
  const numberAccordionDefaultOpen = Number(initConfig?.numOpenAccordionLive) || defaultNumberAccordionDefaultOpen;

  const { data: schedaAvvenimento } = useSWR(
    (() => {
      return [codicePalinsesto, codiceAvvenimento];
    })() as Parameters<typeof getSchedaAvvenimento>,
    getSchedaAvvenimento,
  );

  const { alberatura: alberaturaLive } = useLive();

  const [codiceClusterSelected, setCodiceClusterSelected] = useState(schedaAvvenimento?.codiceClusterSelected || -1);

  const selectedView = useMemo(() => {
    if (schedaAvvenimento && schedaAvvenimento.clusterMenu.clusterList.length > 0) {
      const defaultCluster =
        schedaAvvenimento.clusterMenu.clusterList.find((cluster) => cluster.codiceCluster === codiceClusterSelected) ||
        schedaAvvenimento.clusterMenu.clusterList[0];
      const defaultMetaScommessaTemplate = defaultCluster.metaScommessaTemplateList[0];
      return { cluster: defaultCluster, metaScommessaTemplate: defaultMetaScommessaTemplate };
    }
  }, [codiceClusterSelected, schedaAvvenimento]);

  const [accordionToggles, setAccordionToolges] = useState<Record<TemplateAvvenimentoKey, Boolean>>({});

  if (!schedaAvvenimento || !alberaturaLive) {
    return null;
  }

  const avvenimentoSchedaAvvenimento = avvenimento ?? schedaAvvenimento.avvenimentoFe;
  const disciplinaSchedaAvvenimento = disciplina ?? alberaturaLive.disciplinaMap[codiceDisciplina];
  const manifestazioneSchedaAvvenimento =
    manifestazione ??
    alberaturaLive.manifestazioneMap[makeChiaveManifestazione({ codiceDisciplina, codiceManifestazione })];

  const setAccordingToggleByMetaTemplate = (metaScommessaTemplate: MetaScommessaTemplate, value: boolean) => {
    setAccordionToolges((s) => ({
      ...s,
      [makeChiaveAvvenimentoTemplate(avvenimentoSchedaAvvenimento, metaScommessaTemplate)]: value,
    }));
  };

  // DEBT: find a better solution
  const clustersPerRow = 6;
  const header = 40;
  const clusterContainerPadding = 20;
  const rowHeight = 45;
  const rowGap = 10;

  const clusterRowsNumber =
    schedaAvvenimento.clusterMenu.clusterList.length > 0
      ? Math.ceil(schedaAvvenimento.clusterMenu.clusterList.length / clustersPerRow)
      : 0;
  const clusterHeight =
    header + clusterContainerPadding + clusterRowsNumber * rowHeight + (clusterRowsNumber - 1) * rowGap;

  return (
    <>
      <SchedaAvvenimentoHeader
        disciplina={disciplinaSchedaAvvenimento}
        manifestazione={manifestazioneSchedaAvvenimento}
        avvenimento={avvenimentoSchedaAvvenimento}
      />
      {schedaAvvenimento && (
        <SchedaAvvenimentoClusters
          scheda={schedaAvvenimento}
          selectedView={selectedView}
          changeCluster={setCodiceClusterSelected}
        />
      )}
      <div
        css={css`
          flex-grow: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          height: calc(100% - ${clusterHeight}px);
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
          {selectedView &&
            selectedView.cluster.metaScommessaTemplateList.map((metaScommessaTemplate, metaScommessaTemplateIndex) => {
              const templateAvvenimentoKey = makeChiaveAvvenimentoTemplate(
                avvenimentoSchedaAvvenimento,
                metaScommessaTemplate,
              );
              const isOpen = (() => {
                if (selectedView.cluster.metaScommessaTemplateList[0].infoAggiuntivaAggregator) {
                  return accordionToggles[templateAvvenimentoKey] ?? metaScommessaTemplateIndex === 0;
                } else {
                  return (
                    accordionToggles[templateAvvenimentoKey] ??
                    metaScommessaTemplateIndex < Number(numberAccordionDefaultOpen)
                  );
                }
              })();

              return (
                <TemplateAvvenimento
                  key={templateAvvenimentoKey}
                  schedaAvvenimento={schedaAvvenimento}
                  disciplina={disciplinaSchedaAvvenimento}
                  manifestazione={manifestazioneSchedaAvvenimento}
                  metaScommessaTemplate={metaScommessaTemplate}
                  scommessaMap={schedaAvvenimento?.scommessaMap}
                  infoAggiuntivaMap={schedaAvvenimento?.infoAggiuntivaMap}
                  avvenimento={avvenimentoSchedaAvvenimento}
                  isOpen={isOpen}
                  setToggleAccordion={setAccordingToggleByMetaTemplate}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}

type SchedaAvvenimentoHeaderPros = {
  disciplina: Disciplina;
  manifestazione: Manifestazione;
  avvenimento: Avvenimento;
};

function SchedaAvvenimentoHeader({ disciplina, manifestazione, avvenimento }: SchedaAvvenimentoHeaderPros) {
  const date = new Date(avvenimento.data);
  const { closeSchedaAvvenimentoLive } = useNavigazioneActions();
  return (
    <div
      css={css`
        height: 40px;
        display: flex;
        align-items: center;
        background-color: #444444;
        color: #ffffff;
        border-radius: 4px 4px 0 0;
        font-family: Roboto;
        font-size: 1rem;
        letter-spacing: 0;
        line-height: 16px;
      `}
    >
      <div
        css={css`
          height: 40px;
          background-color: #333333;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
          border-top-left-radius: 4px;
          &:before {
            display: block;
            content: "";
          }
        `}
      >
        <img
          src={disciplina.urlIcona}
          onError={setFallbackImageSrc(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEW7u7s18zFcAAAAC0lEQVQIHWMYYQAAAPAAASEIRrcAAAAASUVORK5CYII= ",
          )}
          css={css`
            box-sizing: border-box;
            height: 21px;
            width: 21px;
            border: 1px solid #f4f4f4;
            border-radius: 50%;
            margin-right: 10px;
          `}
          alt="disciplina"
        />
        <label>{disciplina.descrizione}</label>
      </div>
      <div
        css={css`
          width: 0px;
          height: 0px;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
          border-left: 10px solid #333333;
          z-index: 1;
          /* margin-right: 10px; */
        `}
      ></div>
      <div
        css={css`
          width: 0px;
          height: 0px;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
          background-color: #333333;
          border-left: 10px solid #444444;
          margin-left: -8px;
        `}
      ></div>

      <div
        css={css`
          height: 40px;
          background-color: #333333;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 10px;
          &:before {
            display: block;
            content: "";
          }
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
            border-radius: 50%;
            margin-right: 10px;
          `}
          alt="manifestazione"
        />
        <label
          css={`
            font-weight: bold;
          `}
        >
          {manifestazione.descrizione}
        </label>
      </div>
      <div
        css={css`
          width: 0px;
          height: 0px;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
          border-left: 10px solid #333333;
        `}
      ></div>
      <div
        css={css`
          color: #ffffff;
          font-family: Roboto;
          font-size: 16px;
          font-weight: bold;
          letter-spacing: 0;
          line-height: 16px;
          margin: 0 10px;
        `}
      >
        {avvenimento.descrizione}
      </div>
      <div
        css={css`
          color: #ffffff;
          font-family: Roboto;
          font-size: 14px;
          letter-spacing: 0;
          line-height: 16px;
          height: 15px;
        `}
      >
        {timeFormatter.format(date)}
      </div>
      <div
        css={css`
          font-family: Mulish;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 21px;
          text-align: center;
          margin-left: auto;
          padding: 5px 8px;
          cursor: pointer;
        `}
        // TODO: non si arriverà sempre da schedaDisciplina
        onClick={() => {
          closeSchedaAvvenimentoLive(disciplina);
        }}
      >
        Indietro
      </div>
    </div>
  );
}

function SchedaAvvenimentoClusters({ selectedView, scheda, changeCluster }: SchedaAvvenimentoClustersProps) {
  return (
    <>
      <div
        css={css`
          background-color: #ffffff;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
          padding: 10px 11px;
          display: grid;
          grid-template-columns: repeat(6, 1fr [col-start]);
          column-gap: 10px;
          row-gap: 10px;
        `}
      >
        {scheda.clusterMenu.clusterList.map((cluster) => {
          return (
            <StyledCluster
              onClick={() => {
                changeCluster(cluster.codiceCluster);
              }}
              key={cluster.key}
              isSelected={cluster.codiceCluster === selectedView?.cluster.codiceCluster}
              isClusterTutte={cluster.descrizione.toLowerCase() === "tutte"}
              data-qa={`scheda_manifestazione_seleziona_cluster_${cluster.key}`}
            >
              <StyledClusterLabel>{cluster.descrizione}</StyledClusterLabel>
            </StyledCluster>
          );
        })}
      </div>
    </>
  );
}

export type NumOpenAccordionLive = number | undefined;
type TemplateAvvenimentoKey = string;

function makeChiaveAvvenimentoTemplate(avvenimento: Avvenimento, metaScommessaTemplate: any) {
  return `${makeChiaveAvvenimento({ ...avvenimento })}-${metaScommessaTemplate.idMetaScommessaTemplate}`;
}

export type AvvenimentoSelectedView = {
  cluster: Cluster;
  metaScommessaTemplate: MetaScommessaTemplate;
};

type SchedaAvvenimentoClustersProps = {
  selectedView?: AvvenimentoSelectedView;
  scheda: SchedaAvvenimentoContainer;
  changeCluster(codiceCluster: number): void;
};
const StyledCluster = styled.div<{ isSelected: boolean; isClusterTutte: boolean }>`
  height: 45px;
  background-color: ${(props) => (props.isSelected || props.isClusterTutte ? "#FFFFFF" : "#ededed")};
  box-sizing: border-box;
  border: ${(props) => (props.isSelected ? "3px solid #AAC21F" : props.isClusterTutte ? "2px solid #CBCBCB" : "none")};
  color: #333333;
  font-family: Roboto;
  font-size: 1rem;
  font-weight: ${(props) => (props.isSelected ? "700" : "400")};
  letter-spacing: 0;
  line-height: 19px;
  text-align: center;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5px;

  &:hover {
    ${(props) => (!props.isSelected ? "border: 2px solid #000000;" : "")}
    cursor: pointer;
  }
`;

const StyledClusterLabel = styled.label`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    cursor: pointer;
  }
`;

export const StyledTriangle = styled.img`
  width: 12px;
  margin-left: auto;
  padding: 5px 8px;
  cursor: pointer;
`;
