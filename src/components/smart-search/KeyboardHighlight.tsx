import React, { useLayoutEffect, useRef } from "react";
import styled from "styled-components/macro";

type KeyboardHighlightProps = {
  isSelected: boolean;
  children: React.ReactNode;
};
export function KeyboardHighlight({ isSelected, children }: KeyboardHighlightProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ block: "nearest" });
    }
  }, [isSelected]);
  if (isSelected) {
    return <StyledOuter ref={ref}>{children}</StyledOuter>;
  }
  return children as any;
}

const StyledOuter = styled.div`
  border-radius: 4px;
  padding: 3px;
  margin: -3px;
  box-shadow: 0px 0px 0px 4px #aac21f;
`;
