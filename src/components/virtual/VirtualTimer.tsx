import { useLayoutEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components/macro";

const fullDateFormatter = new Intl.DateTimeFormat("it-It", {
  minute: "numeric",
  second: "numeric",
});

type VirtualTimerType = { startedTimer: string; formattedTimer: string; onTimeover?: () => void };

export function VirtualTimer({ startedTimer, formattedTimer, onTimeover: alertTimeover }: VirtualTimerType) {
  const displayElementRef = useRef<HTMLParagraphElement | null>(null);
  const startTime = new Date(startedTimer);
  const now = new Date();
  const diff = startTime.getTime() - now.getTime();
  const [isTimedOver, setIsTimedOver] = useState(diff < 0);
  useLayoutEffect(() => {
    const loop = () => {
      const startTime = new Date(startedTimer);
      const now = new Date();
      const diff = startTime.getTime() - now.getTime();
      if (displayElementRef.current) {
        displayElementRef.current.innerText = fullDateFormatter.format(diff);
      }
      const isTimeover = diff < 0;
      if (isTimeover) {
        clearInterval(intervalId);
        !isTimedOver && alertTimeover?.();
        setIsTimedOver(true);
        if (displayElementRef.current) {
          displayElementRef.current.innerText = "00:00";
        }
      }
    };
    const intervalId = setInterval(loop, 1000);
    setTimeout(loop, 0);
    return () => {
      clearInterval(intervalId);
    };
  }, [alertTimeover, startedTimer, isTimedOver]);
  return (
    <StyledContent>
      <StyledStartTimer>
        <p ref={displayElementRef}></p>
      </StyledStartTimer>
      <StyledEndTimer>
        <p>
          {isTimedOver ? (
            <FormattedMessage description="VirtualTimer: status in corso timer" defaultMessage="in corso..." />
          ) : (
            formattedTimer
          )}
        </p>
      </StyledEndTimer>
    </StyledContent>
  );
}
const StyledContent = styled.div`
  grid-column: terminale;
  align-items: center;
  grid-template-rows: [start] 60% [end] 40%;
  display: grid;
  box-sizing: border-box;
  height: 48px;
  width: 70px;
  border: 1.3px solid grey;
  border-radius: 3px;
`;
const StyledStartTimer = styled.div`
  grid-row: start;
  align-items: center;
  overflow: hidden;
  display: grid;
  > p {
    font-size: 16px;
    font-weight: 500;
    margin: 0 auto;
    color: #333333;
  }
`;
const StyledEndTimer = styled.div`
  grid-row: end;
  align-items: center;
  display: grid;
  background-color: grey;
  width: 67px;
  height: 24px;
  padding-right: 2px;
  > p {
    color: #fff;
    font-size: 12px;
    margin: auto;
    text-align: center;
  }
  border-radius: 0 0 3px 3px;
`;
