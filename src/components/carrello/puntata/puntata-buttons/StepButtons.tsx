import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import styled from "styled-components/macro";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";

export const PuntataButtons = ({
  maxBet,
  minBet,
  step,
  bet,
  setBet,
  isOnFocus,
  setFocusHere,
  visibleParam,
  setSelectInputByButton,
  disablePuntataInput,
  classeLegatura,
  isPuntataSistema,
}: {
  maxBet?: number;
  minBet?: number;
  step?: number;
  bet: number;
  setBet?: (b: number) => void;
  isOnFocus: boolean | undefined;
  setFocusHere: () => void;
  visibleParam: boolean | undefined;
  setSelectInputByButton: (e: boolean) => void;
  disablePuntataInput?: boolean;
  classeLegatura?: number;
  isPuntataSistema: boolean;
}) => {
  let msToWait: number = 100; //TODO - DEBT: define magic numbers elsewhere
  const [timer, setTimer] = useState<any>(0);
  const [changeDirection, setChangeDirection] = useState<-1 | 1 | 0>(0);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  const startTimer = (action: -1 | 1, changeRate: number) => {
    setChangeDirection(action);
    setFocusHere();
    setTimer(
      setTimeout(() => {
        if (changeDirection !== 0) {
          startTimer(changeDirection, changeRate + 1);
        } else {
          startTimer(action, changeRate + 1);
        }
      }, msToWait),
    );
  };
  // DEBT
  useEffect(() => {
    if (isOnFocus) {
      const onKeyDown = (event: KeyboardEvent) => {
        if (keyboardNavigationContext.current === "blocking-operation") {
          return;
        }
        if (event.key === "+" && keyboardNavigationContext.current !== "dialog-recupera-biglietto") {
          setSelectInputByButton(true);
          startTimer(1, 1);
        }
        if (event.key === "-" && keyboardNavigationContext.current !== "dialog-recupera-biglietto") {
          setSelectInputByButton(true);
          startTimer(-1, 1);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnFocus]);

  if (isOnFocus) {
    document.addEventListener("keyup", () => {
      clearTimeout(timer);
    });
  }

  const stepChangeBet = useCallback(
    (direction: number) => {
      if (!disablePuntataInput) {
        if (step && minBet && maxBet && setBet) {
          let newBetValue = parseFloat((bet + step * direction).toFixed(2));

          if (newBetValue < minBet && direction === -1) {
            if (isPuntataSistema) {
              setBet(0.0);
            }
          } else {
            if ((direction === 1 && newBetValue <= maxBet) || (direction === -1 && newBetValue >= minBet)) {
              setBet(newBetValue);
            }
          }
        }
      }
    },
    [bet, disablePuntataInput, isPuntataSistema, maxBet, minBet, setBet, step],
  );

  useEffect(() => {
    if (timer !== 0 && changeDirection !== 0) {
      stepChangeBet(changeDirection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  const onLongPress = useCallback(
    (direction: number) => {
      stepChangeBet(direction);
    },
    [stepChangeBet],
  );

  const onClick = useCallback(
    (direction: -1 | 1) => {
      stepChangeBet(direction);
    },
    [stepChangeBet],
  );

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 200,
  };

  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();
  const directionButton = useRef<number>(0);
  function isTouchEvent(event: React.MouseEvent | React.TouchEvent) {
    return "touches" in event;
  }

  const preventDefault = useCallback((event) => {
    if (!isTouchEvent(event)) {
      return;
    }

    if (event.touches.length < 2 && event.preventDefault) {
      event.preventDefault();
    }
  }, []);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent, direction) => {
      if (defaultOptions.shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        });
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        directionButton.current = direction;
        onLongPress(direction);
        setLongPressTriggered(true);
      }, defaultOptions.delay);
    },
    [defaultOptions.shouldPreventDefault, defaultOptions.delay, preventDefault, onLongPress],
  );
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (longPressTriggered) {
      interval = setInterval(() => {
        onLongPress(directionButton.current);
      }, msToWait);
    }
    return () => clearInterval(interval);
  }, [longPressTriggered, msToWait, onLongPress]);

  const clear = useCallback(
    (shouldTriggerClick, direction) => {
      timeout.current && clearTimeout(timeout.current);
      shouldTriggerClick && !longPressTriggered && onClick(direction);
      setLongPressTriggered(false);

      if (defaultOptions.shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [longPressTriggered, onClick, defaultOptions.shouldPreventDefault, preventDefault],
  );

  return (
    <ButtonsContainer ref={wrapperRef}>
      <StepInputButton
        data-qa={`carrello-puntata-minus${isPuntataSistema ? "-" + classeLegatura : ""}`}
        isHighlighted={disablePuntataInput || (bet <= (minBet ? minBet : 0) && !visibleParam)}
        disabled={disablePuntataInput || (bet <= (minBet ? minBet : 0) && !visibleParam) || (step || 0.5) >= bet}
        className={
          disablePuntataInput || (bet <= (minBet ? minBet : 0) && !visibleParam) || (step || 0.5) >= bet
            ? "disabled"
            : ""
        }
        onMouseDown={(e) => {
          setSelectInputByButton(true);
          start(e, -1);
        }}
        onTouchStart={(e) => {
          setSelectInputByButton(true);
          start(e, -1);
        }}
        onMouseUp={() => clear(true, -1)}
        onMouseLeave={() => clear(false, -1)}
        onTouchEnd={() => clear(true, -1)}
      >
        -
      </StepInputButton>
      <StepInputButton
        data-qa={`carrello-puntata-plus${isPuntataSistema ? "-" + classeLegatura : ""}`}
        isHighlighted={disablePuntataInput || (bet >= (maxBet ? maxBet : 0) && !visibleParam)}
        disabled={disablePuntataInput || (bet >= (maxBet ? maxBet : 0) && !visibleParam)}
        onMouseDown={(e) => {
          setSelectInputByButton(true);
          start(e, 1);
        }}
        onTouchStart={(e) => {
          setSelectInputByButton(true);
          start(e, 1);
        }}
        onMouseUp={() => clear(true, 1)}
        onMouseLeave={() => clear(false, 1)}
        onTouchEnd={() => clear(true, 1)}
      >
        +
      </StepInputButton>
    </ButtonsContainer>
  );
};

const ButtonsContainer = styled.div`
  width: 83px;
  display: flex;
  justify-content: space-between;
  height: 40px;
  margin-left: 5px;
`;

const StepInputButton = styled.button<{
  isHighlighted: boolean;
  disabled: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 9px;
  border: 2px solid #222222;
  box-sizing: border-box;
  background-color: transparent;
  font-size: 30px;
  font-family: Mulish, sans-serif;
  font-weight: 800;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    color: #cbcbcb !important;
    border-color: #cbcbcb !important;
    cursor: default;
  }
  &:hover {
    color: ${(props) => (props.isHighlighted === false ? "#aac21f" : "#cbcbcb")};
    border-color: ${(props) => (props.isHighlighted === false ? "#aac21f" : "#cbcbcb")};
  }

  &:focus {
    outline: 0;
    color: ${(props) => (props.disabled === false ? "#aac21f" : "#cbcbcb")};
  }

  &:active {
    border-color: #aac21f;
    background-color: #aac21f;
    color: white;
    outline: 0;
  }
`;
