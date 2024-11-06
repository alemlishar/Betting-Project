import React, { useMemo, useState } from "react";
import {
  Avvenimento,
  Cluster,
  Disciplina,
  getInitConfiguration,
  getSchedaAvvenimento,
  Manifestazione,
  MetaScommessaTemplate,
  SchedaAvvenimentoContainer,
} from "src/components/prematch/prematch-api";
import { TemplateAvvenimento } from "src/components/prematch/templates/avvenimento/TemplateAvvenimento";
import { SchedaAvvenimentoView, useAlberaturaPrematch } from "src/components/prematch/usePrematch";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { dateFormatter, timeFormatter } from "src/helpers/format-date";
import { makeChiaveAvvenimento, makeChiaveManifestazione } from "src/types/chiavi";
import styled, { css } from "styled-components/macro";
import useSWR from "swr";

type SchedaAvvenimentoProps = SchedaAvvenimentoView;
export function SchedaAvvenimento({
  disciplina,
  manifestazione,
  avvenimento,
  codiceDisciplina,
  codiceManifestazione,
  codiceAvvenimento,
  codicePalinsesto,
}: SchedaAvvenimentoProps) {
  // TODO corpo

  const [accordionToggles, setAccordionToolges] = useState<Record<TemplateAvvenimentoKey, Boolean>>({});

  // se viene utilizzato altrove spostare in usePrematch
  const { data: initConfig } = useSWR("init", getInitConfiguration, { dedupingInterval: 60 * 60 * 1000 });
  const alberaturaPrematch = useAlberaturaPrematch();

  const defaultNumberAccordionDefaultOpen = 10;
  const numberAccordionDefaultOpen = Number(initConfig?.numOpenAccordionPrematch) || defaultNumberAccordionDefaultOpen;

  const { data: schedaAvvenimento } = useSWR(
    (() => {
      return [codicePalinsesto, codiceAvvenimento];
    })() as Parameters<typeof getSchedaAvvenimento>,
    getSchedaAvvenimento,
  );
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

  if (!schedaAvvenimento || !alberaturaPrematch) {
    return null;
  }

  const disciplinaSchedaManifestazione = disciplina ?? alberaturaPrematch.disciplinaMap[codiceDisciplina];
  const avvenimentoSchedaAvvenimento = avvenimento ?? schedaAvvenimento.avvenimentoFe;
  const manifestazioneSchedaAvvenimento =
    manifestazione ??
    alberaturaPrematch?.manifestazioneMap[makeChiaveManifestazione({ codiceDisciplina, codiceManifestazione })];

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
        disciplina={disciplinaSchedaManifestazione}
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
            width: 0 !important;
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
                  disciplina={disciplinaSchedaManifestazione}
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
export type SchedaAvvenimentoHeaderProps = {
  disciplina: Disciplina;
  manifestazione: Manifestazione;
  avvenimento: Avvenimento;
};
function SchedaAvvenimentoHeader({ disciplina, manifestazione, avvenimento }: SchedaAvvenimentoHeaderProps) {
  const { closeSchedaAvvenimentoPrematch, openSchedaManifestazionePrematch } = useNavigazioneActions();
  const date = new Date(avvenimento.data);
  return (
    <div
      css={css`
        height: 40px;
        display: flex;
        align-items: center;
        background-color: #0b7d3e;
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
          background-color: #005936;
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
        {/* TODO decommentare quando saranno disponibili le nuove icone */}
        {/* <StyledIconaDisciplinaManifestazioneIcon src={disciplina.urlIcona} alt={disciplina.descrizione} /> */}
        <div
          css={css`
            height: 18px;
            width: 18px;
            border-radius: 20px;
            margin-right: 10px;
            box-sizing: border-box;
            border: 3px solid #ffffff;
          `}
        ></div>
        <label>{disciplina.descrizione}</label>
      </div>
      <div
        css={css`
          width: 0px;
          height: 0px;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
          border-left: 10px solid #005936;
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
          background-color: #005936;
          border-left: 10px solid #0b7d3e;
          margin-left: -8px;
        `}
      ></div>

      <div
        css={css`
          height: 40px;
          background-color: #005936;
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
        {/* TODO decommentare quando saranno disponibili le nuove icone */}
        {/* <StyledIconaDisciplinaManifestazioneIcon src={manifestazione.urlIcona} alt={manifestazione.descrizione} /> */}
        <div
          css={css`
            height: 18px;
            width: 18px;
            border-radius: 20px;
            margin-right: 10px;
            box-sizing: border-box;
            border: 3px solid #ffffff;
          `}
        ></div>
        <div
          css={`
            font-weight: bold;
            cursor: pointer;
          `}
          onClick={() => {
            openSchedaManifestazionePrematch(disciplina, manifestazione);
          }}
        >
          {manifestazione.descrizione}
        </div>
      </div>
      <div
        css={css`
          width: 0px;
          height: 0px;
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
          border-left: 10px solid #005936;
        `}
      ></div>
      <span
        css={css`
          color: #ffffff;
          font-family: Roboto;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0;
          line-height: 16px;
          margin: 0 10px;
        `}
      >
        {avvenimento.descrizione}
      </span>
      <span
        css={css`
          color: #ffffff;
          font-family: Roboto;
          font-size: 14px;
          letter-spacing: 0;
          line-height: 16px;
          height: 15px;
        `}
      >
        {dateFormatter.format(date)} - {timeFormatter.format(date)}
      </span>
      <div
        css={css`
          font-size: 14px;
          margin-left: auto;
          padding: 5px 8px;
          cursor: pointer;
        `}
        onClick={() => {
          closeSchedaAvvenimentoPrematch({ manifestazione });
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
          padding: 10px;
          display: grid;
          grid-template-columns: repeat(6, 1fr [col-start]);
          column-gap: 10px;
          row-gap: 10px;
          margin-bottom: 10px;
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

export type NumOpenAccordionPrematch = number | undefined;
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

export const StyledIconaDisciplinaManifestazioneIcon = styled.img`
  height: 18px;
  width: 18px;
  border-radius: 20px;
  margin-right: 10px;
`;
