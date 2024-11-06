import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { VirtualRaceAccopiataTrioButton } from "src/components/virtual/template/VirtualRaceAccopiataTrioButton";
import { VirtualRaceEsitoButton } from "src/components/virtual/template/VirtualRaceEsitoButton";
import { ClusterButton } from "src/components/virtual/template/VirtualTemplateFootball";
import {
  AccoppiataPosition,
  EventoVirtualeRace,
  InternalState,
  RunnerId,
  ScommessaVirtualeBase,
  ScommessaVirtualeRace,
  TrioPosition,
} from "src/components/virtual/virtual-dto";
import configuration from "src/helpers/configuration";
import styled, { css } from "styled-components/macro";
import { SwitchVirtual } from "src/components/virtual/template/SwitchVirtual";
import { VirtualRaceRunnerButton } from "src/components/virtual/template/VirtualRaceRunnerButton";
import {
  getChiaveAccoppiataTrioBigliettoVirtualComponents,
  partitionByRunnerId,
  partitionByRunnerIdDisordine,
} from "src/components/virtual/helpers";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { Alert } from "src/components/common/blocking-alert/BlockingAlert";
import { useAddEsitoToBiglietto } from "src/components/esito/useEsito";
export function VirtualTemplateBiglie({
  event,
  activeClientIndex,
}: {
  event: EventoVirtualeRace;
  activeClientIndex: number;
}) {
  const { accoppiataTrioVirtual } = useAddEsitoToBiglietto();
  const [viewSelectedClusterId, setViewSelectedlusterId] = useState<"principali" | "vincente">("principali");
  const { racerVirtualeList: runnersList, dataEvento } = event;

  const inCorso = new Date(dataEvento).getTime() <= new Date().getTime();
  const VINCENTE = 0;
  const bettingListMap = useMemo(() => {
    const bettingList = event.scommessaVirtualeBaseList.reduce((acc, scommessa) => {
      const key = CLUSTER_PRINCIPALI[scommessa.id] ? scommessa.id : 0;
      if (scommessa && (scommessa.scommessaVirtualeBaseList || scommessa.esitoVirtualeList)) {
        if (!acc[key]) {
          acc[key] = scommessa;
          return acc;
        }
      }
      return acc;
    }, {} as { [id: number]: ScommessaVirtualeRace });

    return bettingList;
  }, [event]);

  const clusters = bettingListMap[0] ? ["principali", "vincente"] : ["principali"];

  const numberBetting = bettingListMap[VINCENTE_PIAZZATO].scommessaVirtualeBaseList.length;
  const betVincente = bettingListMap[VINCENTE].scommessaVirtualeBaseList[0];
  const outcomes = betVincente.esitoVirtualeList.map((outcome) => {
    const [catchzone, runnerName] = outcome.descrizione.split(" ");
    return {
      ...outcome,
      catchzone,
      runnerName,
    };
  });

  const bettingAccoppiataTrio = bettingListMap[ACCOPPIATA_TRIO].scommessaVirtualeBaseList.reduce((acc, scommessa) => {
    const codiceScommessa = `${event.provider}_${scommessa.id}`;
    if (ACCOPPIATA_IN_ORDINE.includes(codiceScommessa)) {
      acc["accoppiata"] = scommessa;
    }
    if (ACCOPPIATA_NON_IN_ORDINE.includes(codiceScommessa)) {
      acc["accoppiata_disor"] = scommessa;
    }
    if (TRIO_IN_ORDINE.includes(codiceScommessa)) {
      acc["trio"] = scommessa;
    }
    if (TRIO_NON_IN_ORDINE.includes(codiceScommessa)) {
      acc["trio_disor"] = scommessa;
    }
    return acc;
  }, {} as { accoppiata: ScommessaVirtualeBase; trio: ScommessaVirtualeBase; accoppiata_disor: ScommessaVirtualeBase; trio_disor: ScommessaVirtualeBase });

  const isBettingDisordine =
    bettingAccoppiataTrio["accoppiata_disor"] !== undefined || bettingAccoppiataTrio["trio_disor"] !== undefined;

  const [internalState, setInternalState] = useState<InternalState>({ type: "nothing" });
  const isAccoppiataEnabled =
    (internalState.type === "accoppiata" && internalState.inOrdine) || internalState.type === "nothing";
  const isAccoppiataDisordineEnabled =
    (internalState.type === "accoppiata" && !internalState.inOrdine) || internalState.type === "nothing";
  const isAccoppiataSelected = (runnerId: RunnerId, position: AccoppiataPosition) =>
    internalState.type === "accoppiata" && internalState.inOrdine && !!internalState.byRunner[runnerId]?.[position];
  const isAccoppiataDisordineSelected = (runnerId: RunnerId) =>
    internalState.type === "accoppiata" && !internalState.inOrdine && !!internalState.byRunner[runnerId];
  const isTrioEnabled = internalState.type === "trio" || internalState.type === "nothing";
  const isTrioDisordineEnabled =
    (internalState.type === "trio" && !internalState.inOrdine) || internalState.type === "nothing";
  const isTrioSelected = (runnerId: RunnerId, position: TrioPosition) =>
    internalState.type === "trio" && internalState.inOrdine && !!internalState.byRunner[runnerId]?.[position];
  const isTrioDisordineSelected = (runnerId: RunnerId) =>
    internalState.type === "trio" && !internalState.inOrdine && !!internalState.byRunner[runnerId];

  const isSwitchVirtualAccoppiataActive = (position: AccoppiataPosition) => {
    return (
      internalState.type === "accoppiata" &&
      internalState.inOrdine &&
      runnersList.every((runner) => internalState.byRunner[runner.id]?.[position])
    );
  };

  const isSwitchVirtualTrioActive = (position: TrioPosition) => {
    return (
      internalState.type === "trio" &&
      internalState.inOrdine &&
      runnersList.every((runner) => internalState.byRunner[runner.id]?.[position])
    );
  };

  const toggleSwitchVirtualAccopiata = (position: AccoppiataPosition) => {
    const value = isSwitchVirtualAccoppiataActive(position) ? undefined : true;
    setInternalState((internalState) => {
      const byRunner = internalState.type === "accoppiata" && internalState.inOrdine ? internalState.byRunner : {};
      const newByRunner = Object.fromEntries(
        runnersList.map((runner) => [runner.id, { ...(byRunner[runner.id] ?? {}), [position]: value }]),
      );
      if (
        Object.values(newByRunner).every((positions) =>
          Object.values(positions).every((position) => position === undefined),
        )
      ) {
        return { type: "nothing" };
      } else {
        return {
          type: "accoppiata",
          inOrdine: true,
          byRunner: newByRunner,
        };
      }
    });
  };

  const toggleSwitchVirtualTrio = (position: TrioPosition) => {
    const value = isSwitchVirtualTrioActive(position) ? undefined : true;
    setInternalState((internalState) => {
      const byRunner = internalState.type === "trio" && internalState.inOrdine ? internalState.byRunner : {};
      const newByRunner = Object.fromEntries(
        runnersList.map((runner) => [runner.id, { ...(byRunner[runner.id] ?? {}), [position]: value }]),
      );
      if (
        Object.values(newByRunner).every((positions) =>
          Object.values(positions).every((position) => position === undefined),
        )
      ) {
        return { type: "nothing" };
      } else {
        return {
          type: "trio",
          inOrdine: true,
          byRunner: newByRunner,
        };
      }
    });
  };

  const isVincentePiazzatoEnabled = internalState.type === "nothing";
  const onClickAccoppiata = (runnerId: number, position: AccoppiataPosition) => {
    setInternalState((internalState) => {
      const oldByRunner = internalState.type === "accoppiata" && internalState.inOrdine ? internalState.byRunner : {};
      const oldByRunnerPositions = oldByRunner[runnerId] || {};
      const newPositions = { ...oldByRunnerPositions, [position]: oldByRunnerPositions[position] ? undefined : true };
      const newByRunner = { ...oldByRunner, [runnerId]: newPositions };
      if (
        Object.values(newByRunner).every((positions) =>
          Object.values(positions).every((position) => position === undefined),
        )
      ) {
        return { type: "nothing" };
      }
      return {
        type: "accoppiata",
        inOrdine: true,
        byRunner: newByRunner,
      };
    });
  };
  const onClickAccoppiataDisordine = (runnerId: RunnerId) => {
    setInternalState((internalState) => {
      const oldByRunner = internalState.type === "accoppiata" && !internalState.inOrdine ? internalState.byRunner : {};
      const position = oldByRunner[runnerId] ? undefined : true;
      const newByRunner: Record<RunnerId, true | undefined> = { ...oldByRunner, [runnerId]: position };
      if (Object.values(newByRunner).every((position) => position === undefined)) {
        return { type: "nothing" };
      }
      return {
        type: "accoppiata",
        inOrdine: false,
        byRunner: newByRunner,
      };
    });
  };
  const onClickTrio = (runnerId: RunnerId, position: TrioPosition) => {
    setInternalState((internalState) => {
      const oldByRunner = internalState.type === "trio" && internalState.inOrdine ? internalState.byRunner : {};
      const oldByRunnerPositions = oldByRunner[runnerId] || {};
      const newPositions = { ...oldByRunnerPositions, [position]: oldByRunnerPositions[position] ? undefined : true };
      const newByRunner = { ...oldByRunner, [runnerId]: newPositions };
      if (
        Object.values(newByRunner).every((positions) =>
          Object.values(positions).every((position) => position === undefined),
        )
      ) {
        return { type: "nothing" };
      }
      return {
        type: "trio",
        inOrdine: true,
        byRunner: newByRunner,
      };
    });
  };
  const onClickTrioDisordine = (runnerId: RunnerId) => {
    setInternalState((internalState) => {
      const oldByRunner = internalState.type === "trio" && !internalState.inOrdine ? internalState.byRunner : {};
      const position = oldByRunner[runnerId] ? undefined : true;
      const newByRunner: Record<RunnerId, true | undefined> = { ...oldByRunner, [runnerId]: position };
      if (Object.values(newByRunner).every((position) => position === undefined)) {
        return { type: "nothing" };
      }
      return {
        type: "trio",
        inOrdine: false,
        byRunner: newByRunner,
      };
    });
  };

  const accoppiataAggregate =
    internalState.type === "accoppiata" &&
    internalState.inOrdine &&
    (() => {
      const entries = Object.entries(internalState.byRunner);
      return [partitionByRunnerId(1, entries), partitionByRunnerId(2, entries)] as const;
    })();
  const trioAggregate =
    internalState.type === "trio" &&
    internalState.inOrdine &&
    (() => {
      const entries = Object.entries(internalState.byRunner);
      return [
        partitionByRunnerId(1, entries),
        partitionByRunnerId(2, entries),
        partitionByRunnerId(3, entries),
      ] as const;
    })();
  const accoppiataDisordineAggregate =
    internalState.type === "accoppiata" &&
    !internalState.inOrdine &&
    partitionByRunnerIdDisordine(internalState.byRunner);
  const trioDisordineAggregate =
    internalState.type === "trio" && !internalState.inOrdine && partitionByRunnerIdDisordine(internalState.byRunner);

  const canAddInternalStateToCart = useMemo(() => {
    switch (internalState.type) {
      case "accoppiata": {
        const entries = Object.entries(internalState.byRunner);
        const primiCorridori = partitionByRunnerId(1, entries);
        const secondiCorridori = partitionByRunnerId(2, entries);
        if (internalState.inOrdine) {
          const combinazioni = [];
          for (const primo of primiCorridori) {
            for (const secondo of secondiCorridori) {
              if (primo !== secondo) {
                combinazioni.push([primo, secondo]);
              }
            }
          }
          return combinazioni.length > 0;
        } else {
          return Object.values(internalState.byRunner).filter(Boolean).length >= 2;
        }
      }
      case "trio": {
        if (internalState.inOrdine) {
          const entries = Object.entries(internalState.byRunner);
          const primiCorridori = partitionByRunnerId(1, entries);
          const secondiCorridori = partitionByRunnerId(2, entries);
          const terziCorridori = partitionByRunnerId(3, entries);
          const combinazioni = [];
          for (const primo of primiCorridori) {
            for (const secondo of secondiCorridori) {
              for (const terzo of terziCorridori) {
                if (primo !== secondo && primo !== terzo && secondo !== terzo) {
                  combinazioni.push([primo, secondo, terzo]);
                }
              }
            }
          }
          return combinazioni.length > 0;
        } else {
          return Object.values(internalState.byRunner).filter(Boolean).length >= 3;
        }
      }
      default:
        return false;
    }
  }, [internalState]);

  const { openBlockingAlertState, closeBlockingAlertState } = useNavigazioneActions();

  const resetInternalState = () => setInternalState({ type: "nothing" });
  const addInternalStateToCart = useCallback(() => {
    if (canAddInternalStateToCart) {
      const tooManyCombinations = false; // TODO
      if (tooManyCombinations) {
        openBlockingAlertState(
          <Alert
            type="danger"
            heading={
              <FormattedMessage
                defaultMessage="Impossibile inviare al carrello"
                description="accoppiata trio error alert heading"
              />
            }
            description={
              <FormattedMessage
                defaultMessage="Hai superato il numero massimo di combinazioni inseribili nel carrello"
                description="accoppiata trio error alert description"
              />
            }
            onClose={closeBlockingAlertState}
          />,
        );
      } else {
        setInternalState({ type: "nothing" });
        const accoppiataTrio = internalState;
        const evento = event;
        switch (internalState.type) {
          case "accoppiata": {
            switch (internalState.inOrdine) {
              case true: {
                const scommessa = bettingAccoppiataTrio.accoppiata;
                accoppiataTrioVirtual(
                  getChiaveAccoppiataTrioBigliettoVirtualComponents({ evento, scommessa, accoppiataTrio }),
                );
                break;
              }
              case false: {
                const scommessa = bettingAccoppiataTrio.accoppiata_disor;
                accoppiataTrioVirtual(
                  getChiaveAccoppiataTrioBigliettoVirtualComponents({ evento, scommessa, accoppiataTrio }),
                );
                break;
              }
            }
            break;
          }
          case "trio": {
            switch (internalState.inOrdine) {
              case true: {
                const scommessa = bettingAccoppiataTrio.trio;
                accoppiataTrioVirtual(
                  getChiaveAccoppiataTrioBigliettoVirtualComponents({ evento, scommessa, accoppiataTrio }),
                );
                break;
              }
              case false: {
                const scommessa = bettingAccoppiataTrio.trio_disor;
                accoppiataTrioVirtual(
                  getChiaveAccoppiataTrioBigliettoVirtualComponents({ evento, scommessa, accoppiataTrio }),
                );
                break;
              }
            }
            break;
          }
        }
      }
    }
  }, [
    accoppiataTrioVirtual,
    bettingAccoppiataTrio.accoppiata,
    bettingAccoppiataTrio.accoppiata_disor,
    bettingAccoppiataTrio.trio,
    bettingAccoppiataTrio.trio_disor,
    canAddInternalStateToCart,
    closeBlockingAlertState,
    event,
    internalState,
    openBlockingAlertState,
  ]);

  useEffect(() => {
    setInternalState({ type: "nothing" });
  }, [activeClientIndex]);

  useEffect(() => {
    setInternalState({ type: "nothing" });
    setViewSelectedlusterId("principali");
  }, [event]);

  // DEBT keyboard
  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      switch (event.key) {
        case "Escape": {
          closeBlockingAlertState();
          resetInternalState();
          break;
        }
        case " ": {
          closeBlockingAlertState();
          addInternalStateToCart();
          break;
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [addInternalStateToCart, closeBlockingAlertState]);

  return (
    <StyledContentBiglie>
      <StyledContentCluster>
        {clusters.map((cluster) => {
          return (
            <ClusterButton
              key={cluster}
              isSelected={cluster === viewSelectedClusterId}
              onSelect={() => setViewSelectedlusterId(cluster as "principali" | "vincente")}
              isWidthFull={true}
            >
              {clusterListVirtualBiglie[cluster as "principali" | "vincente"]}
            </ClusterButton>
          );
        })}
      </StyledContentCluster>
      <StyledContentBetting>
        {viewSelectedClusterId === "principali" ? (
          <StyledContentRunnersList>
            <StyledTemplateHeader numberBetting={numberBetting}>
              <div></div>
              <StyledTemplateTitle>
                {numberBetting > 2 ? (
                  <FormattedMessage
                    description="VirtualTemplateBiglie: title template virtual biglie VINCENTE_PIAZZATO"
                    defaultMessage="Vincente piazzato"
                  />
                ) : (
                  <FormattedMessage
                    description="VirtualTemplateBiglie: title template virtual biglie VINC/PIAZ"
                    defaultMessage="VINC/PIAZ"
                  />
                )}
              </StyledTemplateTitle>
              <StyledTemplateTitle>
                <FormattedMessage
                  description="VirtualTemplateBiglie: title template virtual biglie ACCOPPIATA_TRIO"
                  defaultMessage="Accopiata"
                />
              </StyledTemplateTitle>
              <StyledTemplateTitle>
                <FormattedMessage
                  description="VirtualTemplateBiglie: title template virtual biglie TRIO"
                  defaultMessage="Trio"
                />
              </StyledTemplateTitle>
            </StyledTemplateHeader>
            <StyledTemplateSubHeader numberBetting={numberBetting}>
              <div></div>
              <StyledTemplateSubTitle>
                {bettingListMap[VINCENTE_PIAZZATO].scommessaVirtualeBaseList.map((scommessa) => {
                  const { label } = TEMPLATE_VINCENTE_PIAZZATO[scommessa.id];

                  return <div key={scommessa.id}>{label}</div>;
                })}
              </StyledTemplateSubTitle>
              <StyledTemplateSubTitle>
                <div>
                  {" "}
                  <FormattedMessage
                    description="VirtualTemplateBiglie: subtitle template virtual biglie trio in ordine"
                    defaultMessage="In ordine"
                  />
                </div>
                <div>
                  {" "}
                  <FormattedMessage
                    description="VirtualTemplateBiglie: subtitle template virtual biglie trio non in ordine"
                    defaultMessage="Discord"
                  />
                </div>
              </StyledTemplateSubTitle>
              <StyledTemplateSubTitle>
                <div>
                  {" "}
                  <FormattedMessage
                    description="VirtualTemplateBiglie: subtitle template virtual biglie trio in ordine"
                    defaultMessage="In ordine"
                  />
                </div>
                <div>
                  {" "}
                  <FormattedMessage
                    description="VirtualTemplateBiglie: subtitle template virtual biglie trio non in ordine"
                    defaultMessage="Discord"
                  />
                </div>
              </StyledTemplateSubTitle>
            </StyledTemplateSubHeader>
            <StyledTemaplateSwitchButton numberBetting={numberBetting}>
              <div></div>
              <StyledSwitchButton numberBetting={numberBetting}>
                {bettingListMap[VINCENTE_PIAZZATO].scommessaVirtualeBaseList.map((scommessa) => {
                  return <div key={scommessa.id}></div>;
                })}
              </StyledSwitchButton>
              <StyledSwitchButton numberBetting={3}>
                {([1, 2] as const).map((position) => {
                  const isEnabled =
                    (internalState.type === "accoppiata" && internalState.inOrdine) || internalState.type === "nothing";
                  return (
                    <SwitchVirtual
                      key={position}
                      isActive={isSwitchVirtualAccoppiataActive(position)}
                      isDisabled={!isEnabled}
                      onChange={() => toggleSwitchVirtualAccopiata(position)}
                    />
                  );
                })}{" "}
                <div></div>
              </StyledSwitchButton>
              <StyledSwitchButton numberBetting={4}>
                {([1, 2, 3] as const).map((position) => {
                  const isEnabled =
                    (internalState.type === "trio" && internalState.inOrdine) || internalState.type === "nothing";
                  return (
                    <SwitchVirtual
                      key={position}
                      isActive={isSwitchVirtualTrioActive(position)}
                      isDisabled={!isEnabled}
                      onChange={() => toggleSwitchVirtualTrio(position)}
                    />
                  );
                })}{" "}
                <div></div>
              </StyledSwitchButton>
            </StyledTemaplateSwitchButton>
            {runnersList.map((runner) => (
              <StyledRow key={runner.id} numberBetting={numberBetting}>
                <StyledContentRunner>
                  <StyledNumberRunner>{runner.id}</StyledNumberRunner>
                  <StyledCircleRunner
                    color={marbleRunnerMapping[runner.id as marbleRunnerMappingType]?.color}
                    colorBorder={marbleRunnerMapping[runner.id as marbleRunnerMappingType]?.border}
                  ></StyledCircleRunner>
                  <StyledNameRunner>
                    {marbleRunnerMapping[runner.id as marbleRunnerMappingType]?.label}
                  </StyledNameRunner>
                </StyledContentRunner>
                <StyledContentButtonEsiti numberBetting={numberBetting}>
                  {bettingListMap[VINCENTE_PIAZZATO].scommessaVirtualeBaseList.map((scommessa) => (
                    <VirtualRaceRunnerButton
                      evento={event}
                      scommessa={scommessa}
                      inCorso={inCorso}
                      key={scommessa.id}
                      runner={runner}
                      isEnabled={isVincentePiazzatoEnabled}
                    />
                  ))}
                </StyledContentButtonEsiti>

                <StyledContentButtonEsiti numberBetting={isBettingDisordine ? 3 : 2}>
                  <VirtualRaceAccopiataTrioButton
                    evento={event}
                    runner={runner}
                    descr={"1"}
                    inCorso={inCorso}
                    isEnabled={isAccoppiataEnabled}
                    onClick={() => onClickAccoppiata(runner.id, 1)}
                    isSelected={isAccoppiataSelected(runner.id, 1)}
                  />
                  <VirtualRaceAccopiataTrioButton
                    evento={event}
                    runner={runner}
                    descr={"2"}
                    inCorso={inCorso}
                    isEnabled={isAccoppiataEnabled}
                    onClick={() => onClickAccoppiata(runner.id, 2)}
                    isSelected={isAccoppiataSelected(runner.id, 2)}
                  />
                  {isBettingDisordine && (
                    <VirtualRaceAccopiataTrioButton
                      evento={event}
                      runner={runner}
                      descr={"Disord"}
                      inCorso={inCorso}
                      isEnabled={isAccoppiataDisordineEnabled}
                      onClick={() => onClickAccoppiataDisordine(runner.id)}
                      isSelected={isAccoppiataDisordineSelected(runner.id)}
                    />
                  )}
                </StyledContentButtonEsiti>

                <StyledContentButtonEsiti numberBetting={isBettingDisordine ? 4 : 3}>
                  <VirtualRaceAccopiataTrioButton
                    evento={event}
                    runner={runner}
                    descr={"1"}
                    inCorso={inCorso}
                    isEnabled={isTrioEnabled}
                    onClick={() => onClickTrio(runner.id, 1)}
                    isSelected={isTrioSelected(runner.id, 1)}
                  />
                  <VirtualRaceAccopiataTrioButton
                    evento={event}
                    runner={runner}
                    descr={"2"}
                    inCorso={inCorso}
                    isEnabled={isTrioEnabled}
                    onClick={() => onClickTrio(runner.id, 2)}
                    isSelected={isTrioSelected(runner.id, 2)}
                  />
                  <VirtualRaceAccopiataTrioButton
                    evento={event}
                    runner={runner}
                    descr={"3"}
                    inCorso={inCorso}
                    isEnabled={isTrioEnabled}
                    onClick={() => onClickTrio(runner.id, 3)}
                    isSelected={isTrioSelected(runner.id, 3)}
                  />
                  {isBettingDisordine && (
                    <VirtualRaceAccopiataTrioButton
                      evento={event}
                      runner={runner}
                      descr={"Disord"}
                      inCorso={inCorso}
                      isEnabled={isTrioDisordineEnabled}
                      onClick={() => onClickTrioDisordine(runner.id)}
                      isSelected={isTrioDisordineSelected(runner.id)}
                    />
                  )}
                </StyledContentButtonEsiti>
              </StyledRow>
            ))}
          </StyledContentRunnersList>
        ) : (
          <>
            <StyledVincenteHeader>
              <div />
              <StyledTemplateSubTitleVincente>
                {" "}
                <FormattedMessage
                  description="VirtualTemplateBiglie: title template virtual biglie A"
                  defaultMessage="A"
                />
              </StyledTemplateSubTitleVincente>
              <StyledTemplateSubTitleVincente>
                {" "}
                <FormattedMessage
                  description="VirtualTemplateBiglie: title template virtual biglie B"
                  defaultMessage="B"
                />
              </StyledTemplateSubTitleVincente>
              <StyledTemplateSubTitleVincente>
                {" "}
                <FormattedMessage
                  description="VirtualTemplateBiglie: title template virtual biglie C"
                  defaultMessage="C"
                />
              </StyledTemplateSubTitleVincente>
              <StyledTemplateSubTitleVincente>
                {" "}
                <FormattedMessage
                  description="VirtualTemplateBiglie: title template virtual biglie D"
                  defaultMessage="D"
                />
              </StyledTemplateSubTitleVincente>
              <StyledTemplateSubTitleVincente>
                {" "}
                <FormattedMessage
                  description="VirtualTemplateBiglie: title template virtual biglie E"
                  defaultMessage="E"
                />
              </StyledTemplateSubTitleVincente>
            </StyledVincenteHeader>
            <StyledTemplateContentBettingAltri>
              {runnersList.map((runner) => (
                <StyledRowVincente key={runner.id}>
                  <StyledContentRunner>
                    <StyledNumberRunner>{runner.id}</StyledNumberRunner>
                    <StyledCircleRunner
                      color={marbleRunnerMapping[runner.id as marbleRunnerMappingType]?.color}
                      colorBorder={marbleRunnerMapping[runner.id as marbleRunnerMappingType]?.border}
                    ></StyledCircleRunner>
                    <StyledNameRunner>
                      {marbleRunnerMapping[runner.id as marbleRunnerMappingType]?.label}
                    </StyledNameRunner>
                  </StyledContentRunner>
                  <StyledContentButtonEsitiVincente numberBetting={5}>
                    <>
                      {outcomes
                        .filter((outcome) => outcome.runnerName === runner.name)
                        .map((esito, index) => (
                          <div key={index}>
                            {" "}
                            <VirtualRaceEsitoButton
                              scommessa={betVincente}
                              evento={event}
                              esito={esito}
                              inCorso={inCorso}
                            />
                          </div>
                        ))}
                    </>
                  </StyledContentButtonEsitiVincente>
                </StyledRowVincente>
              ))}
            </StyledTemplateContentBettingAltri>
          </>
        )}
      </StyledContentBetting>
      <StyledContentSelection isVisible={internalState.type !== "nothing"}>
        {accoppiataAggregate && (
          <div
            css={css`
              display: flex;
            `}
          >
            {accoppiataAggregate.map((runners, index) => {
              const position = index + 1;
              return (
                <div
                  key={index}
                  css={css`
                    width: 230px;
                    margin-right: 8px;
                  `}
                >
                  <AggregateBox>
                    {`${position}°`}
                    {runners}
                  </AggregateBox>
                </div>
              );
            })}
          </div>
        )}
        {trioAggregate && (
          <div
            css={css`
              display: flex;
            `}
          >
            {trioAggregate.map((runners, index) => {
              const position = index + 1;
              return (
                <div
                  key={index}
                  css={css`
                    width: 230px;
                    margin-right: 8px;
                  `}
                >
                  <AggregateBox>
                    {`${position}°`}
                    {runners}
                  </AggregateBox>
                </div>
              );
            })}
          </div>
        )}
        {accoppiataDisordineAggregate && <AggregateBox>Disord{accoppiataDisordineAggregate}</AggregateBox>}
        {trioDisordineAggregate && <AggregateBox>Disord{trioDisordineAggregate}</AggregateBox>}
        <StyledButtonAnnulla onClick={resetInternalState}>
          <FormattedMessage
            description="VirtualTemplateRace: button annulla"
            defaultMessage="Annulla {esc}"
            values={{ esc: <span>ESC</span> }}
          />
        </StyledButtonAnnulla>
        <StyledButtonInvia
          disabled={!canAddInternalStateToCart}
          isEnabled={canAddInternalStateToCart}
          onClick={addInternalStateToCart}
        >
          <FormattedMessage
            description="VirtualTemplateRace: button invia"
            defaultMessage="Invia {space}"
            values={{ space: <span>Space</span> }}
          />
        </StyledButtonInvia>
      </StyledContentSelection>
    </StyledContentBiglie>
  );
}
const {
  VINCENTE,
  PIAZZATO_2,
  PIAZZATO_3,
  PIAZZATO_4,
  BIGLIE_VINCENTE,
  BIGLIE_PIAZZATO_2,
  BIGLIE_PIAZZATO_3,
  VINCENTE_PIAZZATO,
  ACCOPPIATA_TRIO,
} = configuration.CODICE_SCOMMESSA_VIRTUAL_RACE;

const {
  ACCOPPIATA_NON_IN_ORDINE,
  TRIO_NON_IN_ORDINE,
  ACCOPPIATA_IN_ORDINE,
  TRIO_IN_ORDINE,
} = configuration.CODICE_SCOMMESSA_ACCOPPIATA_TRIO;

export const clusterListVirtualBiglie = {
  principali: <FormattedMessage description="VirtualTemplateBiglie:cluster principali" defaultMessage="Principali" />,
  vincente: (
    <FormattedMessage
      description="VirtualTemplateBiglie:cluster Vicente + Buca d'arrivo"
      defaultMessage="Vicente + Buca d'arrivo"
    />
  ),
};
export const CLUSTER_PRINCIPALI = { [VINCENTE_PIAZZATO]: true, [ACCOPPIATA_TRIO]: true };

export const TEMPLATE_VINCENTE_PIAZZATO = {
  [VINCENTE]: {
    label: (
      <FormattedMessage
        description="VirtualTemplateBiglie: subtitle template virtual biglie vincente"
        defaultMessage="A"
      />
    ),
  },
  [PIAZZATO_2]: {
    label: (
      <FormattedMessage description="VirtualTemplateBiglie: subtitle template virtual biglie p2" defaultMessage="B" />
    ),
  },
  [PIAZZATO_3]: {
    label: (
      <FormattedMessage description="VirtualTemplateBiglie: subtitle template virtual biglie p3" defaultMessage="C" />
    ),
  },
  [PIAZZATO_4]: {
    label: (
      <FormattedMessage description="VirtualTemplateBiglie: subtitle template virtual biglie p4" defaultMessage="D" />
    ),
  },
  [BIGLIE_VINCENTE]: {
    label: (
      <FormattedMessage
        description="VirtualTemplateBiglie: subtitle template virtual biglie vincente"
        defaultMessage="E"
      />
    ),
  },
  [BIGLIE_PIAZZATO_2]: {
    label: (
      <FormattedMessage description="VirtualTemplateBiglie: subtitle template virtual biglie p2" defaultMessage="P2" />
    ),
  },
  [BIGLIE_PIAZZATO_3]: {
    label: (
      <FormattedMessage description="VirtualTemplateRace: subtitle template virtual biglie p3" defaultMessage="P3" />
    ),
  },
};
export type marbleRunnerMappingType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export const marbleRunnerMapping = {
  1: {
    color: "#D0021B",
    border: "#ffffff",
    label: <FormattedMessage description="VirtualTemplateRace: marble runner 1" defaultMessage="Rossa" />,
  },
  2: {
    color: "#007BD6",
    border: "#ffffff",
    label: <FormattedMessage description="VirtualTemplateRace: marble runner 2" defaultMessage="Blu" />,
  },
  3: {
    color: "#52A808",
    border: "#ffffff",
    label: <FormattedMessage description="VirtualTemplateRace: marble runner 3" defaultMessage="Verde" />,
  },
  4: {
    color: "#FFEF1C",
    border: "#ffffff",
    label: <FormattedMessage description="VirtualTemplateRace: marble runner 4" defaultMessage="Gialla" />,
  },
  5: {
    color: "#F09510",
    border: "#ffffff",
    label: <FormattedMessage description="VirtualTemplateRace: marble runner 5" defaultMessage="Arancione" />,
  },
  6: {
    color: "#F45AF1",
    border: "#ffffff",
    label: <FormattedMessage description="VirtualTemplateRace: marble runner 6" defaultMessage="Rosa" />,
  },
  7: {
    color: "#861016",
    border: "#ffffff",
    label: <FormattedMessage description="VirtualTemplateRace: marble runner 7" defaultMessage="Marrone" />,
  },
  8: {
    color: "#5B238E",
    border: "#ffffff",
    label: <FormattedMessage description="VirtualTemplateRace: marble runner 8" defaultMessage="Viola" />,
  },
  9: {
    color: "#FFFFFF",
    border: "#222222",
    label: <FormattedMessage description="VirtualTemplateRace: marble runner 9" defaultMessage="Bianca" />,
  },
  10: {
    color: "#000000",
    border: "#ffffff",
    label: <FormattedMessage description="VirtualTemplateRace: marble runner 10" defaultMessage="Nera" />,
  },
};

const StyledContentBiglie = styled.div``;
const StyledVincenteHeader = styled.div`
  display: grid;
  grid-template-columns: auto repeat(5, 64px);
  justify-items: stretch;
  text-align: center;
  background-color: #fff;
  padding: 0 10px;
`;
const StyledContentBetting = styled.div`
  overflow: hidden auto;
  height: 683px;
  margin-top: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledContentCluster = styled.div`
  display: grid;
  grid-template-columns: 49.5% 49.5%;
  column-gap: 1%;
  background-color: #ededed;
  padding: 10px;
`;
const StyledContentRunnersList = styled.div`
  background-color: #fff;
  padding: 0 10px;
`;
const StyledTemplateHeader = styled.div<{ numberBetting: number }>`
  display: grid;
  grid-template-columns: auto ${(props) => props.numberBetting * 60 + "px"} 185px 250px;
  justify-items: stretch;
  text-align: center;
  grid-column-gap: 10px;
`;
const StyledRowVincente = styled.div`
  display: grid;
  grid-template-columns: auto 55px 55px 55px 55px 55px;
  grid-template-rows: 65px;
  border-bottom: 1px solid #dcdcdc;
  align-items: center;
  grid-column-gap: 10px;
`;
const StyledRow = styled.div<{ numberBetting: number }>`
  display: grid;
  grid-template-columns: auto ${(props) => props.numberBetting * 60 + "px"} 185px 250px;
  grid-template-rows: 65px;
  border-bottom: 1px solid #dcdcdc;
  align-items: center;
  grid-column-gap: 10px;
`;
const StyledTemplateTitle = styled.div`
  font-size: 14px;
  color: #005936;
  font-weight: 900;
  padding: 10px;
  text-transform: uppercase;
`;
const StyledTemplateSubHeader = styled.div<{ numberBetting: number }>`
  display: grid;
  grid-template-columns: auto ${(props) => props.numberBetting * 60 + "px"} 185px 250px;
  grid-column-gap: 10px;
`;
const StyledTemplateSubTitle = styled.div`
  font-size: 16px;
  color: #fff;
  text-align: center;
  background-color: #0b7d3e;
  font-weight: 900;
  padding: 5px;
  display: flex;
  & > div {
    flex: 1;
  }
`;
const StyledTemplateSubTitleVincente = styled.div`
  font-size: 16px;
  color: #fff;
  text-align: center;
  background-color: #0b7d3e;
  font-weight: 900;
  padding: 5px;
`;
const StyledTemaplateSwitchButton = styled.div<{ numberBetting: number }>`
  display: grid;
  grid-template-columns: auto ${(props) => props.numberBetting * 60 + "px"} 185px 250px;
  grid-column-gap: 10px;
`;
const StyledSwitchButton = styled.div<{ numberBetting: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.numberBetting}, 55px);
  text-align: center;
  justify-content: space-between;
  & > div {
    height: 30px;

    background-color: #f4f4f4;
  }
`;
const StyledContentRunner = styled.div`
  display: grid;
  grid-template-columns: 43px 43px auto;
  align-items: center;
  grid-column-gap: 10px;
`;
const StyledNumberRunner = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 100%;
  border: 2px solid #bbbbbb;
  font-size: 22px;
  color: #0b7d3e;
  font-weight: 900;
  line-height: 40px;
  text-align: center;
`;
const StyledNameRunner = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 900;
  margin-left: 10px;
`;
const StyledCircleRunner = styled.div<{ color: string; colorBorder: string }>`
  width: 40px;
  height: 40px;
  border: 1px solid ${(props) => props.colorBorder};
  background-color: ${(props) => props.color};
  border-radius: 100%;
`;
const StyledContentButtonEsiti = styled.div<{ numberBetting: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.numberBetting}, 55px);
  grid-template-rows: 45px;
  align-items: center;
  justify-content: space-between;
`;
const StyledContentButtonEsitiVincente = styled.div<{ numberBetting: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.numberBetting}, 55px);
  grid-template-rows: 45px;
  align-items: center;
  justify-content: space-between;
  grid-column-gap: 10px;
  & > div {
    width: 55px;
    height: 45px;
  }
`;

const StyledTemplateContentBettingAltri = styled.div`
  background-color: #fff;
  grid-column-gap: 10px;
  padding: 0 10px;
`;

const StyledContentSelection = styled.div<{ isVisible: boolean }>`
  position: absolute;
  bottom: 0px;
  left: 0;
  z-index: 1;
  width: 98%;
  height: 80px;
  padding: 0px 1%;
  background-color: #333333;
  display: grid;
  grid-template-columns: 1fr 140px 140px;
  grid-gap: 10px;
  align-items: center;
  transition: transform 0.3s;
  transform: ${(props) => (props.isVisible ? "translate(0px, 0px)" : "translate(0px, 80px)")};
`;
const StyledButtonInvia = styled.button<{ isEnabled: boolean }>`
  grid-column: 3;
  width: 140px;
  height: 40px;
  border: 2px solid #aac21f;
  border-radius: 8px;
  font-size: 18px;
  background-color: #aac21f;
  color: #fff;
  display: grid;
  grid-template-columns: auto 70px;
  align-items: center;
  font-weight: bold;
  opacity: ${(props) => (props.isEnabled ? "1.0" : "0.4")};
  cursor: ${(props) => (props.isEnabled ? "pointer" : "none")};
  & > span {
    font-size: 13px;
    padding: 4px;
    margin-left: 5px;
    border-radius: 10px;
    background-color: #fff;
    color: #000;
    font-weight: bold;
  }
`;
const StyledButtonAnnulla = styled.button`
  grid-column: 2;
  border: 2px solid #fff;
  width: 140px;
  height: 40px;
  border-radius: 8px;
  font-size: 18px;
  background-color: #333333;
  color: #fff;
  display: grid;
  grid-template-columns: auto 38px;
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  & > span {
    font-size: 13px;
    padding: 4px;
    margin-left: 5px;
    border-radius: 10px;
    background-color: #fff;
    color: #000;
    font-weight: bold;
  }
`;

function AggregateBox({ children: [head, tail] }: { children: [string, Array<number>] }) {
  return (
    <div
      css={css`
        height: 40px;
        border-radius: 4px;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        line-height: 18px;
      `}
    >
      <div
        css={css`
          color: #ffffff;
          font-family: Mulish;
          font-size: 22px;
          letter-spacing: 0;
          background-color: #333333;
          font-weight: 900;
          margin: 2px;
          border-radius: 4px 0px 0px 4px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
        `}
      >
        {head}
      </div>
      <div
        css={css`
          color: #0b7d3e;
          font-family: Mulish;
          font-size: 18px;
          letter-spacing: -0.5px;
          font-weight: 900;
          padding: 8px;
        `}
      >
        {tail.length ? tail.join("-") : "-"}
      </div>
    </div>
  );
}
