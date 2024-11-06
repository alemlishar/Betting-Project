import React, { useCallback, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { orderMenuVirtual } from "src/components/virtual/helpers";
import { IconDisciplinaVirtual } from "src/components/virtual/IconDisciplinaVirtual";
import { getVirtualEventState } from "src/components/virtual/virtual-api";
import { VirtualState, VirtualStateNavigation } from "src/components/virtual/virtual-dto";
import { VirtualTimer } from "src/components/virtual/VirtualTimer";
import { css } from "styled-components";
import styled from "styled-components/macro";
import useSWR, { mutate } from "swr";

type MenuVirtualDisciplinaType = {
  alberaturaVirtual: Array<VirtualState>;
  virtualState: VirtualStateNavigation | undefined;
};
export function MenuVirtualDisciplina({ alberaturaVirtual: data, virtualState }: MenuVirtualDisciplinaType) {
  const { openSchedaVirtual } = useNavigazioneActions();
  const alberaturaVirtual = orderMenuVirtual(data);
  const [virtualEventState, setVirtualEventState] = useState<VirtualState>();
  const { data: status } = useSWR(
    () => {
      return virtualEventState ? [virtualEventState] : null;
    },
    getVirtualEventState,
    { refreshInterval: 6000 },
  );

  const { data: forceChangeEvent } = useSWR<VirtualState>("force_change_virtual_event");

  const eventIdDefault = alberaturaVirtual.find(
    (alberartura) => alberartura.codiceDisciplina === virtualState?.codiceDisciplina,
  );

  const [viewActiveEvent, setViewActiveEvent] = useState<VirtualState>(
    eventIdDefault ? eventIdDefault : alberaturaVirtual[0],
  );
  const [viewSelectedEvent, setViewSelectedEvent] = useState<VirtualState>(
    eventIdDefault ? eventIdDefault : alberaturaVirtual[0],
  );
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  const onChangeEvent = useCallback(
    (alberaturaVirtualEvent: VirtualState) => {
      setViewActiveEvent(alberaturaVirtualEvent);
      setViewSelectedEvent(alberaturaVirtualEvent);
      const { codiceEvento, codicePalinsesto } = alberaturaVirtualEvent.detailId;
      openSchedaVirtual({
        codiceDisciplina: alberaturaVirtualEvent.codiceDisciplina,
        eventId: alberaturaVirtualEvent.eventId,
        sogeicodPalinsesto: codicePalinsesto,
        sogeicodevento: codiceEvento,
      });
    },
    [openSchedaVirtual],
  );
  const alertTimeover = useCallback((index: number, virtualEvent: VirtualState) => {
    if (index !== 0) {
      return;
    }
    setVirtualEventState(virtualEvent);
  }, []);

  useEffect(() => {
    if (STATUS_EVENT_VIRTUAL.CLOSE === status) {
      mutate("alberatura_virtual");
      setVirtualEventState(undefined);
    }
    return;
  }, [status]);

  useEffect(() => {
    if (!forceChangeEvent) {
      return;
    }
    const viewActiveEventStart = alberaturaVirtual.find((alberartura) => {
      const now = new Date();
      const startTime = new Date(alberartura.startTime);
      const diff = startTime.getTime() - now.getTime();
      return diff > 0;
    });
    if (!viewActiveEventStart) {
      return;
    }
    onChangeEvent(viewActiveEventStart);
    mutate("force_change_virtual_event", null);
  }, [alberaturaVirtual, forceChangeEvent, onChangeEvent]);

  useEffect(() => {
    const currentEvent = alberaturaVirtual.find(
      (alberaturaEvent) => alberaturaEvent.codiceDisciplina === virtualState?.codiceDisciplina,
    );
    if (!virtualState || !currentEvent) {
      const viewActiveEventStart = alberaturaVirtual.find((alberartura) => {
        const now = new Date();
        const startTime = new Date(alberartura.startTime);
        const diff = startTime.getTime() - now.getTime();
        return diff > 0;
      });
      onChangeEvent(viewActiveEventStart ?? alberaturaVirtual[0]);
    }

    if (!currentEvent || currentEvent.codiceDisciplina === viewActiveEvent.codiceDisciplina) {
      if (currentEvent && currentEvent.eventId !== viewActiveEvent.eventId) {
        onChangeEvent(currentEvent);
      }
      return;
    }

    onChangeEvent(currentEvent);
  }, [alberaturaVirtual, onChangeEvent, viewActiveEvent, virtualState]);

  useEffect(() => {
    const codiciDiscipline = alberaturaVirtual.map((alberatura) => alberatura.codiceDisciplina);

    const onKeyDown = (event: KeyboardEvent) => {
      const currentSelectedEventIndex = codiciDiscipline.indexOf(viewSelectedEvent.codiceDisciplina);
      if (
        keyboardNavigationContext.current === "blocking-operation" ||
        keyboardNavigationContext.current !== "smart-search"
      ) {
        return;
      }
      if (event.key === "ArrowDown") {
        const virtualEvent = alberaturaVirtual[currentSelectedEventIndex + 1];
        if (!virtualEvent) {
          setViewSelectedEvent(alberaturaVirtual[0]);
          return;
        }
        setViewSelectedEvent(virtualEvent);
        return;
      }
      if (event.key === "ArrowUp") {
        const virtualEvent = alberaturaVirtual[currentSelectedEventIndex - 1];
        if (!virtualEvent) {
          setViewSelectedEvent(alberaturaVirtual[alberaturaVirtual.length - 1]);
          return;
        }
        setViewSelectedEvent(virtualEvent);
        return;
      }
      if (event.key === "Enter") {
        onChangeEvent(alberaturaVirtual[currentSelectedEventIndex]);
        return;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [alberaturaVirtual, keyboardNavigationContext, onChangeEvent, viewSelectedEvent]);

  return (
    <div
      css={css`
        height: 825px;
        overflow: hidden auto;
        &::-webkit-scrollbar {
          display: none;
        }
      `}
    >
      {alberaturaVirtual.map((item, index) => {
        return (
          <StyledMenuRow
            key={item.eventId}
            active={item.codiceDisciplina === viewActiveEvent.codiceDisciplina}
            selected={item.codiceDisciplina === viewSelectedEvent.codiceDisciplina}
            onClick={() => onChangeEvent(item)}
            onMouseOver={() => setViewSelectedEvent(viewActiveEvent)}
          >
            <StyledIcon>
              <IconDisciplinaVirtual codiceDisciplina={item.codiceDisciplina} />
            </StyledIcon>
            <StyledMenuDescription>
              <h4>{item.subtitle}</h4>
              <p>
                {item.detailId.type === "singola" ? (
                  item.title
                ) : (
                  <>
                    <FormattedMessage
                      description="MenuVirtual: title description type campionato"
                      defaultMessage="Giornata"
                    />
                    <span>{item.title}</span>
                  </>
                )}
              </p>
            </StyledMenuDescription>
            <div>
              <VirtualTimer
                startedTimer={item.startTime}
                formattedTimer={item.formattedTime}
                onTimeover={() => alertTimeover(index, item)}
              />
            </div>
          </StyledMenuRow>
        );
      })}
    </div>
  );
}

const STATUS_EVENT_VIRTUAL = {
  OPEN: 1,
  CLOSE: 0,
  START: 2,
};

const StyledMenuRow = styled.div<{ active: boolean; selected: boolean }>`
  background-color: white;
  cursor: pointer;
  margin-bottom: 3px;
  display: grid;
  align-items: center;
  min-height: 68px;
  grid-template-columns: 40px auto 70px;
  position: relative;
  padding-right: 10px;
  &::before {
    content: "";
    border: 4px solid #aac21f;
    border-width: ${(props) => (props.active ? "4px" : "2px")};
    position: absolute;
    width: ${(props) => (props.active ? "292px" : "296px")};
    height: 100%;
    display: ${(props) => (props.active || props.selected ? "block" : "none")};
    // z-index: 2;
  }
  &::after {
    content: "";
    right: -3px;
    background-color: #aac21f;
    position: absolute;
    width: 6px;
    height: 6px;
    transform: rotate(45deg);
    display: ${(props) => (props.active ? "block" : "none")};
  }
  &:hover {
    &::before {
      content: "";
      border: 2px solid #aac21f;
      border-width: ${(props) => (props.active ? "4px" : "2px")};
      position: absolute;
      width: ${(props) => (props.active ? "292px" : "296px")};
      height: 100%;
      display: block;
      // z-index: 2;
    }
  }
`;
const StyledIcon = styled.div`
  position: relative;
  height: 100%;
  z-index: 0;
  & > svg {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const StyledMenuDescription = styled.div`
  padding: 10px;
  color: #333;
  h4 {
    font-size: 16px;
    margin: 0;
    span {
      margin-left: 3px;
    }
  }
  p {
    font-size: 14px;
    margin: 0;
  }
`;
