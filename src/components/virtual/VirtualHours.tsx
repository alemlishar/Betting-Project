import React from "react";
import styled from "styled-components/macro";

type VirtualHoursType = { formattedOrario: string };

export function VirtualHours({ formattedOrario }: VirtualHoursType) {
  return (
    <StyledContent>
      <StyledEndTimer>
        <p>{formattedOrario}</p>
      </StyledEndTimer>
    </StyledContent>
  );
}

const StyledContent = styled.div`
  align-items: center;
  box-sizing: border-box;
  height: 47px;
  width: 70px;
  border: 1.3px solid #bbbbbb;
  border-radius: 3px;
`;
const StyledEndTimer = styled.div`
  position: absolute;
  background-color: #bbbbbb;
  width: 70px;
  height: 47px;
  padding-right: 2px;
  > p {
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
  border-radius: 3px;
`;
