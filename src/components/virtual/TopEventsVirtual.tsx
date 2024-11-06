import { VirtualTimer } from "src/components/virtual/VirtualTimer";
import styled, { css } from "styled-components/macro";
import { ReactComponent as RightIcon } from "src/assets/images/icon-arrow-up-white.svg";
import { IconDisciplinaVirtual } from "src/components/virtual/IconDisciplinaVirtual";
import {
  useScrollingSliderControls,
  SliderControllerButton,
} from "src/components/common/slider-controller/SliderController";
import { VirtualHours } from "src/components/virtual/VirtualHours";
import { useCallback, useRef, useState } from "react";
import { EventoVirtualeBase } from "src/components/virtual/virtual-dto";
import { mutate } from "swr";

export function TopEventsVirtual<T extends EventoVirtualeBase>({
  options,
  selectedEventId,
  onSelect,
}: {
  options: Array<{ title: React.ReactNode; heading: React.ReactNode; event: T }>;
  selectedEventId: number;
  onSelect(event: EventoVirtualeBase): void;
}) {
  const selectedOption = options.find((option) => option.event.eventId === selectedEventId) ?? options[0];
  const codiceDisciplina = `${selectedOption.event.provider}_${selectedOption.event.idDisciplina}`;
  const [focusedEventId, setFocusedEventId] = useState<number>(selectedEventId);
  const onChangeEvent = (evento: EventoVirtualeBase) => {
    onSelect(evento);
    setFocusedEventId(evento.eventId);
  };
  const eventsScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { left, right, scrollBy } = useScrollingSliderControls(eventsScrollContainerRef);
  const alertTimeover = useCallback(() => {
    if (options[0].event.eventId !== selectedEventId) {
      return;
    }
    console.log("###force_change_virtual_event", options[0].event.eventId, selectedEventId);
    mutate("force_change_virtual_event", selectedEventId);
  }, [options, selectedEventId]);
  return (
    <>
      <StyledDisciplineTitle>{selectedOption.title}</StyledDisciplineTitle>
      <StyledTopEvents>
        <StyledIcon>
          <IconDisciplinaVirtual codiceDisciplina={codiceDisciplina} />
        </StyledIcon>
        <div
          ref={eventsScrollContainerRef}
          css={css`
            align-items: center;
            width: 964px;
            overflow: auto hidden;
            display: flex;
            &::-webkit-scrollbar {
              display: none;
            }
          `}
        >
          <div
            css={css`
              align-items: center;
              display: flex;
              flex-direction: row;
              margin-right: 50px;
              flex: 1;
            `}
          >
            {options.map((option, index) => {
              return (
                <StyledEventsItem
                  key={option.event.eventId}
                  isActive={option.event.eventId === focusedEventId || option.event.eventId === selectedEventId}
                  onClick={() => onChangeEvent(option.event)}
                  onMouseOver={() => setFocusedEventId(option.event.eventId)}
                >
                  <StyledTimer>
                    {index === 0 ? (
                      <VirtualTimer
                        key={option.event.eventId}
                        startedTimer={option.event.dataEvento}
                        formattedTimer={option.event.formattedOrario}
                        onTimeover={alertTimeover}
                      />
                    ) : (
                      <VirtualHours formattedOrario={option.event.formattedOrario} />
                    )}
                  </StyledTimer>
                  <StyledEventDescription>
                    <div>
                      <h4>{option.heading}</h4>
                    </div>
                  </StyledEventDescription>
                </StyledEventsItem>
              );
            })}
          </div>
        </div>
        <StyledNextPreviousButton>
          <SliderControllerButton
            isEnabled={right}
            onClick={() => scrollBy(964, false)}
            icon={
              <RightIcon
                css={css`
                  height: 16px;
                  width: 16px;
                  position: relative;
                  transform: rotate(90deg);
                  cursor: pointer;
                `}
              />
            }
          />
          <SliderControllerButton
            isEnabled={left}
            onClick={() => scrollBy(-964, false)}
            icon={
              <RightIcon
                css={css`
                  height: 16px;
                  width: 16px;
                  transform: rotate(-90deg);
                  position: relative;
                  cursor: pointer;
                `}
              />
            }
          />
        </StyledNextPreviousButton>
      </StyledTopEvents>
    </>
  );
}

const StyledDisciplineTitle = styled.div`
  color: #333333;
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 10px;
`;
const StyledTopEvents = styled.div`
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  overflow: hidden;
  height: fit-content;
  width: 1045px;
  height: 88px;
  background: #ededed;
  display: grid;
  grid-template-columns: 40px 1010px;
  align-items: center;
  position: relative;
  grid-column-gap: 5px;
`;
const StyledEventsItem = styled.div<{ isActive: boolean }>`
  background-color: ${(props) => (props.isActive ? "white" : "#EDEDED")};
  display: grid;
  align-items: center;
  height: 64px;
  cursor: pointer;
  min-width: 250px;
  max-width: 250px;
  margin-right: 10px;
  grid-template-columns: 90px auto;
  position: relative;
  border: 2px solid #979797;
  &::before {
    content: "";
    border: 4px solid #aac21f;
    border-radius: 8px;
    position: absolute;
    width: 246px;
    height: 97%;
    display: ${(props) => (props.isActive ? "block" : "none")};
    // z-index: 3;
    margin-left: -2px;
  }
  border-radius: 8px;
  &:hover {
    background-color: #fff;
    &::before {
      content: "";
      border: 4px solid #aac21f;
      border-radius: 8px;
      position: absolute;
      width: 246px;
      height: 97%;
      display: block;
      // z-index: 3;
      margin-left: -2px;
    }
  }
`;
const StyledIcon = styled.div`
  position: relative;
  height: 100%;
  & > svg {
    position: absolute;
    top: 0;
    left: 0;
  }
`;
const StyledEventDescription = styled.div`
  color: #333;
  padding-right: 10px;
  & > div {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  h4 {
    font-size: 16px;
    margin: 0;
    span {
      margin-left: 3px;
    }
  }
`;
const StyledTimer = styled.div`
  padding: 8px 10px;
`;
const StyledNextPreviousButton = styled.div`
  border-radius: 0 8px 0 0;
  width: 46px;
  height: 88px;
  background: #0b7d3e;
  position: absolute;
  right: 0;
  top: 0;
  & > div {
    height: 44px;
  }
`;
