import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { VirtualRaceAccopiataTrioButton } from "src/components/virtual/template/VirtualRaceAccopiataTrioButton";
import { VirtualRaceEsitoButton } from "src/components/virtual/template/VirtualRaceEsitoButton";
import { ClusterButton } from "src/components/virtual/template/VirtualTemplateFootball";
import {
  RunnerId,
  AccoppiataPosition,
  EventoVirtualeRace,
  InternalState,
  ScommessaVirtualeBase,
  ScommessaVirtualeRace,
  TrioPosition,
} from "src/components/virtual/virtual-dto";
import configuration from "src/helpers/configuration";
import styled, { css } from "styled-components/macro";
import { SwitchVirtual } from "src/components/virtual/template/SwitchVirtual";
import { VirtualRaceRunnerButton } from "src/components/virtual/template/VirtualRaceRunnerButton";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { Alert } from "src/components/common/blocking-alert/BlockingAlert";
import { useAddEsitoToBiglietto } from "src/components/esito/useEsito";
import {
  getChiaveAccoppiataTrioBigliettoVirtualComponents,
  partitionByRunnerId,
  partitionByRunnerIdDisordine,
} from "src/components/virtual/helpers";

export function VirtualTemplateRace({
  event,
  activeClientIndex,
}: {
  event: EventoVirtualeRace;
  activeClientIndex: number;
}) {
  const { accoppiataTrioVirtual } = useAddEsitoToBiglietto();
  const [viewSelectedClusterId, setViewSelectedlusterId] = useState<"principali" | "altri">("principali");
  const { racerVirtualeList: runnersList, dataEvento } = event;

  const inCorso = new Date(dataEvento).getTime() <= new Date().getTime();
  const ALTRI = 0;
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

  const clusters = bettingListMap[ALTRI] ? ["principali", "altri"] : ["principali"];

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

  const numberBetting = bettingListMap[VINCENTE_PIAZZATO].scommessaVirtualeBaseList.length;

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
    <StyledContentRace>
      <StyledContentCluster>
        {clusters.map((cluster) => {
          return (
            <ClusterButton
              key={cluster}
              isSelected={cluster === viewSelectedClusterId}
              onSelect={() => {
                if (cluster === "altri") {
                  setInternalState({ type: "nothing" });
                }
                setViewSelectedlusterId(cluster as "principali" | "altri");
              }}
              isWidthFull={true}
            >
              {clusterListVirtualRace[cluster as "principali" | "altri"]}
            </ClusterButton>
          );
        })}
      </StyledContentCluster>
      <StyledContentBetting>
        {viewSelectedClusterId === "principali" ? (
          <StyledContentRunnersList isContentAccoppiataTrio={internalState.type !== "nothing"}>
            <StyledTemplateHeader numberBetting={numberBetting} isBettingDisordine={isBettingDisordine}>
              <div></div>
              <StyledTemplateTitle>
                {numberBetting > 2 ? (
                  <FormattedMessage
                    description="VirtualTemplateRace: title template virtual race VINCENTE_PIAZZATO"
                    defaultMessage="Vincente piazzato"
                  />
                ) : (
                  <FormattedMessage
                    description="VirtualTemplateRace: title template virtual race VINC/PIAZ"
                    defaultMessage="VINC/PIAZ"
                  />
                )}
              </StyledTemplateTitle>
              <StyledTemplateTitle>
                <FormattedMessage
                  description="VirtualTemplateRace: title template virtual race ACCOPPIATA_TRIO"
                  defaultMessage="Accopiata"
                />
              </StyledTemplateTitle>
              <StyledTemplateTitle>
                <FormattedMessage
                  description="VirtualTemplateRace: title template virtual race TRIO"
                  defaultMessage="Trio"
                />
              </StyledTemplateTitle>
            </StyledTemplateHeader>
            <StyledTemplateSubHeader numberBetting={numberBetting} isBettingDisordine={isBettingDisordine}>
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
                    description="VirtualTemplateRace: subtitle template virtual race trio in ordine"
                    defaultMessage="In ordine"
                  />
                </div>
                {isBettingDisordine && (
                  <div>
                    <FormattedMessage
                      description="VirtualTemplateRace: subtitle template virtual race trio non in ordine"
                      defaultMessage="Discord"
                    />
                  </div>
                )}
              </StyledTemplateSubTitle>
              <StyledTemplateSubTitle>
                <div>
                  {" "}
                  <FormattedMessage
                    description="VirtualTemplateRace: subtitle template virtual race trio in ordine"
                    defaultMessage="In ordine"
                  />
                </div>
                {isBettingDisordine && (
                  <div>
                    <FormattedMessage
                      description="VirtualTemplateRace: subtitle template virtual race trio non in ordine"
                      defaultMessage="Discord"
                    />
                  </div>
                )}
              </StyledTemplateSubTitle>
            </StyledTemplateSubHeader>
            <StyledTemaplateSwitchButton numberBetting={numberBetting} isBettingDisordine={isBettingDisordine}>
              <div></div>
              <StyledSwitchButton numberBetting={numberBetting}>
                {bettingListMap[VINCENTE_PIAZZATO].scommessaVirtualeBaseList.map((scommessa) => {
                  return <div key={scommessa.id}></div>;
                })}
              </StyledSwitchButton>
              <StyledSwitchButton numberBetting={isBettingDisordine ? 3 : 2}>
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
                })}
                {isBettingDisordine && <div></div>}
              </StyledSwitchButton>
              <StyledSwitchButton numberBetting={isBettingDisordine ? 4 : 3}>
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
                })}
                {isBettingDisordine && <div></div>}
              </StyledSwitchButton>
            </StyledTemaplateSwitchButton>
            {runnersList.map((runner) => (
              <StyledRow key={runner.id} numberBetting={numberBetting} isBettingDisordine={isBettingDisordine}>
                <StyledContentRunner>
                  <StyledNumberRunner>{runner.id}</StyledNumberRunner>
                  <StyledNameRunner>{runner.name}</StyledNameRunner>
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
            {bettingListMap[ALTRI].scommessaVirtualeBaseList.map((scommessa) => (
              <div key={scommessa.id}>
                <StyledTemplateTitleAltri>{scommessa.descrizione}</StyledTemplateTitleAltri>
                <StyledTemplateContentBettingAltri>
                  {scommessa.esitoVirtualeList.map((esito) => (
                    <div key={scommessa.id}>
                      <VirtualRaceEsitoButton scommessa={scommessa} evento={event} esito={esito} inCorso={inCorso} />
                    </div>
                  ))}
                </StyledTemplateContentBettingAltri>
              </div>
            ))}
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
    </StyledContentRace>
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

export const clusterListVirtualRace = {
  principali: <FormattedMessage description="VirtualTemplateRace:cluster principali" defaultMessage="Principali" />,
  altri: <FormattedMessage description="VirtualTemplateRace:cluster altri" defaultMessage="Altri" />,
};
export const CLUSTER_PRINCIPALI = { [VINCENTE_PIAZZATO]: true, [ACCOPPIATA_TRIO]: true };

export const TEMPLATE_VINCENTE_PIAZZATO = {
  [VINCENTE]: {
    label: (
      <FormattedMessage description="VirtualTemplateRace: subtitle template virtual race vincente" defaultMessage="V" />
    ),
  },
  [PIAZZATO_2]: {
    label: (
      <FormattedMessage description="VirtualTemplateRace: subtitle template virtual race p2" defaultMessage="P2" />
    ),
  },
  [PIAZZATO_3]: {
    label: (
      <FormattedMessage description="VirtualTemplateRace: subtitle template virtual race p3" defaultMessage="P3" />
    ),
  },
  [PIAZZATO_4]: {
    label: (
      <FormattedMessage description="VirtualTemplateRace: subtitle template virtual race p4" defaultMessage="P4" />
    ),
  },
  [BIGLIE_VINCENTE]: {
    label: (
      <FormattedMessage
        description="VirtualTemplateRace: subtitle template virtual biglie vincente"
        defaultMessage="V"
      />
    ),
  },
  [BIGLIE_PIAZZATO_2]: {
    label: (
      <FormattedMessage description="VirtualTemplateRace: subtitle template virtual biglie p2" defaultMessage="P2" />
    ),
  },
  [BIGLIE_PIAZZATO_3]: {
    label: (
      <FormattedMessage description="VirtualTemplateRace: subtitle template virtual biglie p3" defaultMessage="P3" />
    ),
  },
};

const StyledContentRace = styled.div`
  position: relative;
`;

const StyledContentBetting = styled.div`
  position: relative;
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
const StyledContentRunnersList = styled.div<{ isContentAccoppiataTrio: boolean }>`
  background-color: #fff;
  padding: ${(props) => (props.isContentAccoppiataTrio ? "0 10px 80px 10px" : "0 10px")};
`;
const StyledTemplateHeader = styled.div<{ numberBetting: number; isBettingDisordine: boolean }>`
  display: grid;
  grid-template-columns: auto ${(props) => props.numberBetting * 60 + "px"} ${(props) =>
      props.isBettingDisordine ? "185px 250px" : "120px 180px"};
  justify-items: stretch;
  text-align: center;
  grid-column-gap: 10px;
`;
const StyledRow = styled.div<{ numberBetting: number; isBettingDisordine: boolean }>`
  display: grid;
  grid-template-columns: auto ${(props) => props.numberBetting * 60 + "px"} ${(props) =>
      props.isBettingDisordine ? "185px 250px" : "120px 180px"};
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
const StyledTemplateSubHeader = styled.div<{ numberBetting: number; isBettingDisordine: boolean }>`
  display: grid;
  grid-template-columns: auto ${(props) => props.numberBetting * 60 + "px"} ${(props) =>
      props.isBettingDisordine ? "185px 250px" : "120px 180px"};
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
const StyledTemaplateSwitchButton = styled.div<{ numberBetting: number; isBettingDisordine: boolean }>`
  display: grid;
  grid-template-columns: auto ${(props) => props.numberBetting * 60 + "px"} ${(props) =>
      props.isBettingDisordine ? "185px 250px" : "120px 180px"};
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
  grid-template-columns: 40px auto;
  align-items: center;
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
const StyledContentButtonEsiti = styled.div<{ numberBetting: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.numberBetting}, 55px);
  grid-template-rows: 45px;
  align-items: center;
  justify-content: space-between;
`;

const StyledTemplateTitleAltri = styled.div`
  font-size: 16px;
  color: #fff;
  text-align: center;
  background-color: #005936;
  font-weight: 900;
  padding: 10px 20px;
  display: flex;
  width: 100%;
  margin-top: 10px;
`;
const StyledTemplateContentBettingAltri = styled.div`
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  flex-flow: row wrap;
  flex-direction: row;
  padding: 5px;
  & > div {
    max-width: 20%;
    flex: 20%;
    margin: 5px 0;
    & > button {
      min-height: 44px;
      width: 96%;
    }
  }
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
