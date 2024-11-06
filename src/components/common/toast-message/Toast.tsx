import React, { useCallback, useState } from "react";
import styled from "styled-components/macro";
import { ReactComponent as IconDangerWhite } from "src/assets/images/icon-danger-white.svg";
import { ReactComponent as IconDoneWhite } from "src/assets/images/icon-done-white.svg";
import { ReactComponent as IconDanger } from "src/assets/images/icon-danger.svg";

type ToastItem = {
  content: React.ReactNode;
  localId: number;
};
/** @see {ToastHub} */
export function useToastHub() {
  const [items, setItems] = useState<Array<ToastItem>>([]);
  const push = useCallback((content: React.ReactNode, duration: number) => {
    const localId = Math.random();
    const item: ToastItem = {
      content,
      localId,
    };
    setItems((items) => [...items, item]);
    setTimeout(() => {
      setItems((items) => items.filter((i) => i !== item));
    }, duration);
  }, []);

  //Funzione per chiudere toast (error) al click o all'escape
  const close = useCallback((content: React.ReactNode) => {
    const localId = Math.random();
    const item: ToastItem = {
      content,
      localId,
    };
    setItems((items) => [...items, item]);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
      }
      if (e.key === "Escape") {
        setItems([]);
      }
    };
    const handleClick = () => {
      setItems([]);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", handleClick, false);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", handleClick, false);
    };
  }, []);

  return {
    push,
    items,
    close,
  };
}

type ToastHubProps = { items: Array<ToastItem> };
/** @see {useToastHub} */
export function ToastHub({ items }: ToastHubProps) {
  return (
    <>
      {items.map(({ content: reactNode, localId }) => (
        <React.Fragment key={localId}>{reactNode}</React.Fragment>
      ))}
    </>
  );
}

type ToastProps = {
  type: "success" | "warning" | "danger";
  heading: React.ReactNode;
  description?: React.ReactNode;
};

export function Toast(props: ToastProps) {
  const { type } = props;
  switch (type) {
    case "success":
      return <ToastSuccess {...props} />;
    case "warning":
      return <ToastWarning {...props} />;
    case "danger":
      return <ToastError {...props} />;
  }
}

// TODO: cambiare icona WARNING
function ToastSuccess({ heading, description }: ToastProps) {
  return (
    <StyledToastMessageWrapper>
      <StyledToastMessageContainer backgroundColor={"#0B7D3E"} hasDescription={!!description}>
        <IconDoneWhite style={{ gridRow: `-1 / 1`, gridColumn: `icon`, height: `34px`, width: `34px` }} />
        <StyledHeading color={"#FFFFFF"}>{heading}</StyledHeading>
        {description && <StyledDescription color={"#FFFFFF"}>{description}</StyledDescription>}
      </StyledToastMessageContainer>
    </StyledToastMessageWrapper>
  );
}

function ToastWarning({ heading, description }: ToastProps) {
  return (
    <StyledToastMessageWrapper>
      <StyledToastMessageContainer backgroundColor={"#FFB800"} hasDescription={!!description}>
        <IconDanger style={{ gridRow: `-1 / 1`, gridColumn: `icon`, height: `34px`, width: `34px` }} />
        <StyledHeading color={"#333333"}>{heading}</StyledHeading>
        {description && <StyledDescription color={"#333333"}>{description}</StyledDescription>}
      </StyledToastMessageContainer>
    </StyledToastMessageWrapper>
  );
}

function ToastError({ heading, description }: ToastProps) {
  return (
    <StyledToastMessageWrapper>
      <StyledToastMessageContainer backgroundColor={"#E72530"} hasDescription={!!description}>
        <IconDangerWhite style={{ gridRow: `-1 / 1`, gridColumn: `icon`, height: `34px`, width: `34px` }} />
        <StyledHeading color={"#FFFFFF"}>{heading}</StyledHeading>
        {description && <StyledDescription color={"#FFFFFF"}>{description}</StyledDescription>}
      </StyledToastMessageContainer>
    </StyledToastMessageWrapper>
  );
}

const StyledToastMessageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100vw;
  position: absolute;
  top: 0;
  right: 0;
`;

const StyledToastMessageContainer = styled.div<{ backgroundColor: string; hasDescription: boolean }>`
  display: grid;
  grid-template-columns: [icon] min-content [message] auto;
  grid-template-rows: [heading] min-content ${(props) => (props.hasDescription ? "[description] min-content" : "")};
  column-gap: 20px;
  grid-row-gap: 1px;
  align-items: center;
  padding: 16px 24px;
  background-color: ${(props) => props.backgroundColor};
  width: 720px;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
  z-index: 10;
  animation: slide-in-top 0.6s ease-in-out forwards;

  @keyframes slide-in-top {
    0% {
      transform: translateY(-76px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

const StyledHeading = styled.div<{ color: string }>`
  grid-row: heading;
  grid-column: message;
  color: ${(props) => props.color};
  font-family: Roboto;
  font-weight: 900;
  font-size: 1.25rem;
`;

const StyledDescription = styled.div<{ color: string }>`
  grid-row: description;
  grid-column: message;
  color: ${(props) => props.color};
  font-family: Roboto;
  font-size: 1rem;
`;
