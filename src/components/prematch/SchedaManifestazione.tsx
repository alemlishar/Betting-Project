import { orderBy } from "lodash";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IcoArrowDownGreen } from "src/assets/images/icon-arrow-down-green.svg";
import { ReactComponent as IcoArrowUpGrey } from "src/assets/images/icon-arrow-up-grey.svg";
import { ReactComponent as IcoCloseWhite } from "src/assets/images/icon-close-white.svg";
import { Toast } from "src/components/common/toast-message/Toast";
import {
  Avvenimento,
  Cluster,
  ClusterMenu,
  Disciplina,
  FiltroGiornaliero,
  getSchedaInfoAggiuntivaAggregator,
  getSchedaManifestazione,
  Manifestazione,
  MetaScommessaTemplate,
  SchedaManifestazioneContainer,
} from "src/components/prematch/prematch-api";
import { TemplatePrematchMemo } from "src/components/prematch/templates/Template";
import { getAvvenimentoListWithInfoAggiuntiva } from "src/components/prematch/templates/utils";
import { ManifestazioneSelectedView, SchedaManifestazioneView } from "src/components/prematch/usePrematch";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { makeChiaveManifestazione } from "src/types/chiavi";
import styled, { css } from "styled-components/macro";
import useSWR from "swr";
import { InfoAggiuntivaAggregatorGroupSliderMemo } from "./templates/InfoAggiuntivaAggregatorGroupSlider";

type SchedaManifestazioneProps = SchedaManifestazioneView & {
  filtroGiornaliero: FiltroGiornaliero;
  pushToast(content: React.ReactNode, duration: number): void;
};

function SchedaManifestazionePrematch({
  filtroGiornaliero,
  disciplina,
  manifestazione,
  userSelectedView,
  isMarketGridOpen,
  pushToast,
}: SchedaManifestazioneProps) {
  const {
    setFiltroGiornalieroScheda,
    openSchedaManifestazionePrematchClasseEsito,
    openSezioneSport,
  } = useNavigazioneActions();
  const { data: scheda } = useSWR(
    userSelectedView
      ? [
          filtroGiornaliero,
          manifestazione.codiceDisciplina,
          manifestazione.codiceManifestazione,
          userSelectedView?.cluster.codiceCluster,
          userSelectedView?.metaScommessaTemplate.idMetaScommessaTemplate,
        ]
      : [filtroGiornaliero, manifestazione.codiceDisciplina, manifestazione.codiceManifestazione],
    getSchedaManifestazione,
  );

  const getFirstCluster = (clusterMenu: ClusterMenu) => {
    return isVisibleClusterGrid(clusterMenu.clusterList, clusterMenu.clusterList[clusterMenu.clusterList.length - 1])
      ? clusterMenu.clusterList[0]
      : clusterMenu.clusterList[clusterMenu.clusterList.length - 1];
  };

  useEffect(() => {
    const hasEvents = scheda && scheda.avvenimentoFeList.length > 0;
    if (scheda && hasEvents && !userSelectedView) {
      const firstCluster = getFirstCluster(scheda.clusterMenu);
      openSchedaManifestazionePrematchClasseEsito(firstCluster, firstCluster.metaScommessaTemplateList[0]);
    } else if (scheda && !hasEvents) {
      pushToast(
        <Toast
          type="warning"
          heading={
            <FormattedMessage
              description="default header title of operation not allowed in schedaManifestazione"
              defaultMessage="Operazione non consentita"
            />
          }
          description={
            <FormattedMessage
              description="default description schedaManifestazione not found"
              defaultMessage="Scommesse Pre-Match non più disponibili per la manifestazione selezionata"
            />
          }
        />,
        3000,
      );
      openSezioneSport();
    }
  }, [scheda, userSelectedView, openSchedaManifestazionePrematchClasseEsito]);

  const selectedView = useMemo(() => {
    if (userSelectedView) {
      return userSelectedView;
    }
    if (scheda && scheda.clusterMenu.clusterList.length > 0) {
      const firstCluster = getFirstCluster(scheda.clusterMenu);
      const firstMetaScommessaTemplate = firstCluster.metaScommessaTemplateList[0];
      return { cluster: firstCluster, metaScommessaTemplate: firstMetaScommessaTemplate };
    }
  }, [userSelectedView, scheda]);

  const avvenimentoFilter: Avvenimento[] = useMemo(() => {
    return scheda && selectedView
      ? !selectedView.metaScommessaTemplate.infoAggiuntivaAggregator
        ? getAvvenimentoListWithInfoAggiuntiva(
            scheda.avvenimentoFeList,
            selectedView.metaScommessaTemplate,
            scheda.scommessaMap,
            scheda.infoAggiuntivaMap,
          )
        : scheda.avvenimentoFeList
      : [];
  }, [scheda, selectedView]);

  const avvenimentoSortedList = useMemo(
    () =>
      scheda
        ? orderBy(avvenimentoFilter, [
            (avvenimento) => new Date(avvenimento.data),
            (avvenimento) => avvenimento.descrizione,
          ])
        : [],
    [scheda, avvenimentoFilter],
  );

  //TODO: Gestire manifestazione non in palinsesto quando viene cambiato il filtro giornaliero

  const [userSelectedAvvenimentoBySlider, setUserSelectedAvvenimentoBySlider] = useState<Record<string, Avvenimento>>(
    {},
  );
  const setAvvenimentoForManifestazione = (avvenimento: Avvenimento) => {
    setUserSelectedAvvenimentoBySlider((s) => ({ ...s, [makeChiaveManifestazione(avvenimento)]: avvenimento }));
  };
  const selectedAvvenimento =
    userSelectedAvvenimentoBySlider[makeChiaveManifestazione(manifestazione)] ?? avvenimentoSortedList[0];

  // TODO refactor
  const { data: schedaInfoAggiuntivaAggregator } = useSWR(
    (() => {
      if (!selectedAvvenimento) {
        return;
      }
      if (!scheda) {
        return;
      }
      if (!scheda.infoAggiuntivaAggregatorGroupMapByAvvenimento) {
        return;
      }
      return [
        selectedAvvenimento.codicePalinsesto,
        selectedAvvenimento.codiceAvvenimento,
        false /* TODO */,
        scheda.idMetaScommessaTemplateSelected,
      ];
    })() as Parameters<typeof getSchedaInfoAggiuntivaAggregator>,
    getSchedaInfoAggiuntivaAggregator,
  );

  const infoAggiuntivaAggregatorSortedList = useMemo(() => {
    if (!schedaInfoAggiuntivaAggregator) {
      return [];
    }
    if (!selectedView) {
      return [];
    }
    return orderBy(
      Object.values(schedaInfoAggiuntivaAggregator.infoAggiuntivaAggregatorMap),
      selectedView.metaScommessaTemplate.sortByDescrizione
        ? [(infoAggiuntivaAggregator) => infoAggiuntivaAggregator.descrizione.toLowerCase()]
        : [
            (infoAggiuntivaAggregator) => infoAggiuntivaAggregator.posizione,
            (infoAggiuntivaAggregator) => infoAggiuntivaAggregator.descrizione.toLowerCase(),
          ],
    );
  }, [selectedView, schedaInfoAggiuntivaAggregator]);

  const {
    scommessaMap = emptyRecord(),
    infoAggiuntivaMap = emptyRecord(),
    infoAggiuntivaAggregatorGroupMap = emptyRecord(),
  } = (() => {
    if (!scheda) {
      return {};
    }
    if (scheda.infoAggiuntivaAggregatorGroupMapByAvvenimento) {
      return {
        scommessaMap: schedaInfoAggiuntivaAggregator?.scommessaMap,
        infoAggiuntivaMap: schedaInfoAggiuntivaAggregator?.infoAggiuntivaMap,
        infoAggiuntivaAggregatorGroupMap: schedaInfoAggiuntivaAggregator?.infoAggiuntivaAggregatorGroupMap,
      };
    } else {
      return {
        scommessaMap: scheda.scommessaMap,
        infoAggiuntivaMap: scheda.infoAggiuntivaMap,
      };
    }
  })();
  const shouldShowTemplate =
    scheda && (scheda.infoAggiuntivaAggregatorGroupMapByAvvenimento ? schedaInfoAggiuntivaAggregator : true);

  if (
    !scheda ||
    (!userSelectedView?.cluster.codiceCluster && !userSelectedView?.metaScommessaTemplate.idMetaScommessaTemplate)
  ) {
    return null;
  }

  return (
    <>
      <SchedaManifestazioneHeaderMemo disciplina={disciplina} manifestazione={manifestazione} />
      <StyledSchedaManifestazioneScrollArea data-testid="cluster-manifestazione">
        <div
          css={css`
            position: absolute;
            width: 100%;
          `}
        >
          {selectedView && scheda && scheda.clusterMenu.clusterList.length > 0 && (
            <>
              <SchedaManifestazioneClusterMemo
                selectedView={selectedView}
                scheda={scheda}
                isMarketGridOpen={isMarketGridOpen}
              />
              {scheda.infoAggiuntivaAggregatorGroupMapByAvvenimento && (
                <InfoAggiuntivaAggregatorGroupSliderMemo
                  avvenimento={selectedAvvenimento}
                  onAvvenimentoChange={setAvvenimentoForManifestazione}
                  filtroGiornaliero={filtroGiornaliero}
                  onFiltroGiornalieroChange={setFiltroGiornalieroScheda}
                  infoAggiuntivaAggregatorGroupMapByAvvenimento={scheda.infoAggiuntivaAggregatorGroupMapByAvvenimento}
                  avvenimentoList={avvenimentoSortedList}
                />
              )}
              <StyledManifestazione>
                {shouldShowTemplate && (
                  <TemplatePrematchMemo
                    disciplina={disciplina}
                    manifestazione={manifestazione}
                    filtroGiornaliero={filtroGiornaliero}
                    metaScommessaTemplate={selectedView.metaScommessaTemplate}
                    avvenimentoList={avvenimentoSortedList}
                    scommessaMap={scommessaMap}
                    infoAggiuntivaMap={infoAggiuntivaMap}
                    avvenimento={selectedAvvenimento}
                    infoAggiuntivaAggregatorGroupMap={infoAggiuntivaAggregatorGroupMap}
                    infoAggiuntivaAggregatorList={infoAggiuntivaAggregatorSortedList}
                    onFiltroGiornalieroChange={setFiltroGiornalieroScheda}
                  />
                )}
              </StyledManifestazione>
            </>
          )}
        </div>
      </StyledSchedaManifestazioneScrollArea>
    </>
  );
}
export const SchedaManifestazionePrematchMemo = React.memo(SchedaManifestazionePrematch);

type SchedaManifestazioneHeaderProps = {
  disciplina: Disciplina;
  manifestazione: Manifestazione;
};
function SchedaManifestazioneHeader({ disciplina, manifestazione }: SchedaManifestazioneHeaderProps) {
  const { closeSchedaManifestazionePrematch } = useNavigazioneActions();
  return (
    <StyledSchedaManifestazioneHeaderContainer>
      <StyledSchedaManifestazioneHeader>
        {/* TODO decommentare quando saranno disponibili le nuove icone */}
        {/* <StyledIconaDisciplinaManifestazioneIcon src={disciplina.urlIcona} alt={disciplina.descrizione} /> TODO setFallbackImageSrc */}
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
        <div>{disciplina.descrizione}</div>
      </StyledSchedaManifestazioneHeader>
      <StyledDisciplinaBackgroundArrowEffect />
      {/* TODO decommentare quando saranno disponibili le nuove icone */}
      {/* <StyledIconaDisciplinaManifestazioneIcon src={manifestazione.urlIcona} alt={manifestazione.descrizione} /> TODO setFallbackImageSrc */}
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
      <StyledSchedaManifestazioneHeaderManifestazioneLabel>
        {manifestazione.descrizione}
      </StyledSchedaManifestazioneHeaderManifestazioneLabel>
      <StyledCloseSchedaManifestazione
        onClick={() => {
          closeSchedaManifestazionePrematch();
        }}
        data-qa={`scheda_manifestazione_chiudi_${manifestazione.key}`}
      />
    </StyledSchedaManifestazioneHeaderContainer>
  );
}
const SchedaManifestazioneHeaderMemo = React.memo(SchedaManifestazioneHeader);

type SchedaManifestazioneClustersProps = {
  selectedView: ManifestazioneSelectedView;
  scheda: SchedaManifestazioneContainer;
  isMarketGridOpen: boolean;
};
function SchedaManifestazioneClusters({ selectedView, scheda, isMarketGridOpen }: SchedaManifestazioneClustersProps) {
  // fix needed for scrolling market grid height
  const marketGridContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    openSchedaManifestazionePrematchClasseEsito,
    toggleSchedaManifestazioneAltreClasseEsito,
  } = useNavigazioneActions();
  const [searchText, setSearchText] = useState("");
  const byDescrizione = useCallback(
    (metaScommessaTemplate: MetaScommessaTemplate) => {
      if (metaScommessaTemplate.descrizione === "") {
        return true;
      }
      return metaScommessaTemplate.descrizione.toLowerCase().includes(searchText.toLowerCase());
    },
    [searchText],
  );
  const defaultCluster = scheda.clusterMenu.clusterList[scheda.clusterMenu.clusterList.length - 1]; //cluster tutte

  const showClusterGrid = isVisibleClusterGrid(scheda.clusterMenu.clusterList, defaultCluster);

  if (!isVisibleMarketGrid(scheda.clusterMenu.clusterList) && !showClusterGrid) {
    return null;
  }

  return (
    <div
      css={css`
        margin-bottom: ${scheda.infoAggiuntivaAggregatorGroupMapByAvvenimento ? "34px" : "10px"};
      `}
    >
      {showClusterGrid ? (
        <div ref={marketGridContainerRef}>
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
                    openSchedaManifestazionePrematchClasseEsito(cluster, cluster.metaScommessaTemplateList[0]);
                  }}
                  key={cluster.key}
                  isSelected={cluster.codiceCluster === selectedView.cluster.codiceCluster}
                  isClusterTutte={cluster.descrizione.toLowerCase() === "tutte"}
                  data-qa={`scheda_manifestazione_seleziona_cluster_${cluster.key}`}
                >
                  <StyledClusterLabel>{cluster.descrizione}</StyledClusterLabel>
                </StyledCluster>
              );
            })}
          </div>
          <StyledMarketGridContainer
            ref={(element) => {
              setTimeout(() => {
                if (element && marketGridContainerRef.current) {
                  marketGridContainerRef.current.style.minHeight = `${element.offsetHeight}px`;
                }
              }, 200);
            }}
          >
            <StyledHighlightedMetaScommessaTemplateContainer>
              <StyledHighlightedMetaScommessaTemplateWrapper>
                <StyledHighlightedMetaScommessaTemplateLabel>
                  {selectedView.metaScommessaTemplate.descrizione}
                </StyledHighlightedMetaScommessaTemplateLabel>
              </StyledHighlightedMetaScommessaTemplateWrapper>
              {/* TODO provvisorio ricerca testuale cde, NON CANCELLARE */}
              {/* <input
            value={searchText}
            placeholder="cerca classe d'esito ⏎"
            onChange={(event) => {
              setSearchText(event.currentTarget.value);
              // DEBT
              onPrematchStateChange((prematchState) =>
                prematchState.schedaManifestazione && !prematchState.schedaManifestazione.isMarketGridOpen
                  ? {
                      ...prematchState,
                      schedaManifestazione: {
                        ...prematchState.schedaManifestazione,
                        isMarketGridOpen: event.currentTarget.value !== "",
                      },
                    }
                  : prematchState,
              );
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const firstMetaTemplate = selectedView.cluster.metaScommessaTemplateList.find(byDescrizione);
                if (firstMetaTemplate) {
                  // DEBT
                  onPrematchStateChange((prematchState) =>
                    prematchState.schedaManifestazione
                      ? {
                          ...prematchState,
                          schedaManifestazione: {
                            ...prematchState.schedaManifestazione,
                            userSelectedView: {
                              cluster: selectedView.cluster,
                              metaScommessaTemplate: firstMetaTemplate,
                            },
                            isMarketGridOpen: false,
                          },
                        }
                      : prematchState,
                  );
                }
              }
            }}
          /> */}
              <StyledShowAltreClassiEsitoButton
                isMarketGridOpen={isMarketGridOpen}
                onClick={() => {
                  toggleSchedaManifestazioneAltreClasseEsito();
                }}
                data-qa={`scheda_manifestazione_${isMarketGridOpen ? "nascondi" : "mostra"}_altre_classi_esito`}
              >
                {isMarketGridOpen ? (
                  <>
                    <FormattedMessage
                      defaultMessage="Chiudi"
                      description="label close of altre_classi_esito_box in schedaManifestazione"
                    />

                    <IcoArrowUpGrey />
                  </>
                ) : (
                  <>
                    <FormattedMessage
                      defaultMessage="Altre classi d'esito"
                      description="other outcome classes description in schedaManifestazione"
                    />
                    <IcoArrowDownGreen
                      width={10}
                      height={10}
                      css={css`
                        padding: 5px;
                      `}
                    />
                  </>
                )}
              </StyledShowAltreClassiEsitoButton>
            </StyledHighlightedMetaScommessaTemplateContainer>
            {isMarketGridOpen && (
              <StyledMetaScommessaTemplateList>
                {selectedView.cluster.metaScommessaTemplateList.filter(byDescrizione).map((metaScommessaTemplate) => {
                  return (
                    <StyledMetaScommessaTemplate
                      key={`${selectedView.cluster.key}-${metaScommessaTemplate.idMetaScommessaTemplate}`}
                      onClick={() => {
                        openSchedaManifestazionePrematchClasseEsito(selectedView.cluster, metaScommessaTemplate);
                        setSearchText("");
                      }}
                      isSelected={
                        metaScommessaTemplate.idMetaScommessaTemplate ===
                        selectedView.metaScommessaTemplate.idMetaScommessaTemplate
                      }
                      data-qa={`scheda_manifestazione_seleziona_classe_esito_${selectedView.cluster.key}-${metaScommessaTemplate.idMetaScommessaTemplate}`}
                    >
                      <StyledMetaScommessaTemplateLabel>
                        {metaScommessaTemplate.descrizione}
                      </StyledMetaScommessaTemplateLabel>
                    </StyledMetaScommessaTemplate>
                  );
                })}
              </StyledMetaScommessaTemplateList>
            )}
          </StyledMarketGridContainer>
        </div>
      ) : (
        <StyledOnlyMarketGrid>
          {defaultCluster.metaScommessaTemplateList.map((metaScommessaTemplate) => {
            const isSelected =
              metaScommessaTemplate.idMetaScommessaTemplate ===
              selectedView.metaScommessaTemplate.idMetaScommessaTemplate;
            return (
              <StyledOnlyMarketGridMetaScommessaTemplate
                isSelected={isSelected}
                key={`${defaultCluster.key}-${metaScommessaTemplate.idMetaScommessaTemplate}`}
                onClick={() => {
                  openSchedaManifestazionePrematchClasseEsito(defaultCluster, metaScommessaTemplate);
                }}
                data-qa={`scheda_manifestazione_seleziona_classe_esito_${defaultCluster.key}-${metaScommessaTemplate.idMetaScommessaTemplate}`}
              >
                <StyledMetaScommessaTemplateLabel>{metaScommessaTemplate.descrizione}</StyledMetaScommessaTemplateLabel>
              </StyledOnlyMarketGridMetaScommessaTemplate>
            );
          })}
        </StyledOnlyMarketGrid>
      )}
    </div>
  );
}
const SchedaManifestazioneClusterMemo = React.memo(SchedaManifestazioneClusters);

const empty = {};
function emptyRecord<T>() {
  return empty as Record<string, T>;
}

export function isVisibleClusterGrid(clusterList: Cluster[], defaultCluster: Cluster): boolean {
  const hasMoreThanOneCluster = clusterList.length > 2;
  // ci aspettiamo che l'ultimo cluster della lista è il cluster tutte
  // e si visualizzano i cluster se le cde totali sono più di 6
  const thereAreMoreThanSixMetaScommessaTemplate = defaultCluster.metaScommessaTemplateList.length > 6;
  return hasMoreThanOneCluster && thereAreMoreThanSixMetaScommessaTemplate;
}

export function isVisibleMarketGrid(clusterList: Cluster[]) {
  return clusterList.length >= 1 && !!clusterList.find((cluster) => cluster.descrizione.toLowerCase() === "tutte");
}

const StyledDisciplinaBackgroundArrowEffect = styled.div`
  width: 0px;
  height: 0px;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 10px solid #005936;
  margin-right: 10px;
`;

const StyledSchedaManifestazioneHeaderManifestazioneLabel = styled.label`
  font-weight: bold;
`;

const StyledCloseSchedaManifestazione = styled(IcoCloseWhite)`
  margin-left: auto;
  &:hover {
    cursor: pointer;
  }
`;

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

const StyledMarketGridContainer = styled.div`
  background-color: #ededed;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
  padding: 10px;
  position: relative;
`;

const StyledHighlightedMetaScommessaTemplateContainer = styled.div`
  display: flex;
`;

const StyledHighlightedMetaScommessaTemplateWrapper = styled.div`
  height: 45px;
  width: 336px;
  margin-right: 10px;
  background-color: #aac21f;
  box-sizing: border-box;
  color: #ffffff;
  font-family: Roboto;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 19px;
  text-align: center;
  border-radius: 4px;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledHighlightedMetaScommessaTemplateLabel = styled.label`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledShowAltreClassiEsitoButton = styled.button<{ isMarketGridOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 8px;
  border: ${(props) => (props.isMarketGridOpen ? "2px solid #CBCBCB" : "2px solid #0B7D3E")};
  background-color: rgba(255, 255, 255, 0.7);
  color: ${(props) => (props.isMarketGridOpen ? "#444444" : "#0B7D3E")};
  font-family: Roboto;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 19px;
  text-align: center;
  margin-left: auto;
  padding: 0 15px;
  &:hover {
    cursor: pointer;
  }
`;

const StyledMetaScommessaTemplateList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 336px [col-start]);
  column-gap: 10px;
  row-gap: 10px;
  width: 100%;
  margin: 0 -10px;
  margin-bottom: 30px;
  padding: 10px;
  position: absolute;
  background-color: #ededed;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
  z-index: 1; /* DEBT per fix, so no il filtro giornaliero si posiziona sopra alla lista CDE */
`;

const StyledMetaScommessaTemplate = styled.label<{ isSelected: boolean }>`
  height: 45px;
  background-color: #ffffff;
  box-sizing: border-box;
  border: ${(props) => (props.isSelected ? "3px solid #AAC21F" : "none")};
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
  padding: 0 20px;
  &:hover {
    cursor: pointer;
  }
`;

const StyledMetaScommessaTemplateLabel = styled.label`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    cursor: pointer;
  }
`;

const StyledOnlyMarketGrid = styled.div`
  background-color: #ededed;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 336px [col-start]);
  column-gap: 10px;
  row-gap: 10px;
  width: 1030px;
`;

const StyledOnlyMarketGridMetaScommessaTemplate = styled.div<{ isSelected: boolean }>`
  height: 45px;
  background-color: ${(props) => (props.isSelected ? "#aac21f" : "#FFFFFF")};
  box-sizing: border-box;
  border: ${(props) => (props.isSelected ? "3px solid #AAC21F" : "none")};
  color: ${(props) => (props.isSelected ? "#FFFFFF" : "#333333")};
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
  padding: 0 20px;
  border: none;
`;

const StyledManifestazione = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const StyledSchedaManifestazioneScrollArea = styled.div`
  height: calc(100% - 50px);
  flex-grow: 1;
  position: relative;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0 !important;
  }
`;

const StyledSchedaManifestazioneHeaderContainer = styled.div`
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
`;

const StyledSchedaManifestazioneHeader = styled.div`
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
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledIconaDisciplinaManifestazioneIcon = styled.img`
  height: 18px;
  width: 18px;
  border-radius: 20px;
  margin-right: 10px;
`;

/*
  const firstScommessa = scheda.scommessaMap[Object.keys(scheda.scommessaMap)[0]];
  const firstInfoAggiuntiva = scheda.infoAggiuntivaMap[Object.keys(scheda.infoAggiuntivaMap)[0]];

  const showTemplate_2C =
    firstScommessa.listaEsitiDinamica === false &&
    firstInfoAggiuntiva.idInfoAggiuntiva === 0 &&
    firstInfoAggiuntiva.esitoList.length === 2;

  const showTemplate_3C =
    firstScommessa.listaEsitiDinamica === false &&
    firstInfoAggiuntiva.idInfoAggiuntiva === 0 &&
    firstInfoAggiuntiva.esitoList.length === 3;

  const showTemplate_4C =
    firstScommessa.listaEsitiDinamica === false &&
    firstInfoAggiuntiva.idInfoAggiuntiva === 0 &&
    firstInfoAggiuntiva.esitoList.length === 4;
*/
