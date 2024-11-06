import React from "react";
import styled from "styled-components/macro";

export function Cliente({
  clientId,
  eventsNumber,
  isClientActive,
  setActiveClient,
  setSviluppoSistemaOpen,
}: {
  clientId: number;
  eventsNumber: number;
  isClientActive: boolean;
  setActiveClient: (index: number) => void;
  setSviluppoSistemaOpen: (trigger: boolean) => void;
}) {
  return (
    <StyledClienteRectangle
      data-qa={`carrello-cliente-${clientId}`}
      onClick={() => {
        setSviluppoSistemaOpen(false);
        setActiveClient(clientId);
      }}
      className={isClientActive ? "active" : ""}
    >
      <StyledClienteRectangleText className={isClientActive ? "active" : ""}>
        <p>Cliente {clientId + 1}</p>
        <StyledEventsNumber>{eventsNumber}</StyledEventsNumber>
      </StyledClienteRectangleText>
      {isClientActive && <StyledClienteRectangleActive />}
    </StyledClienteRectangle>
  );
}

const StyledClienteRectangle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  height: 60px;
  width: 137px;
  margin-left: 10px;
  cursor: pointer;
  /* &:last-child {
    margin-left: 0;
  }*/
  &.active {
    width: 178px;
    margin-top: -10px;
    border-radius: 4px 4px 0 0;
    background-color: #333333;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    cursor: default;
    &:first-child {
      margin-right: 0;
    }
    /* &:last-child {
      margin-left: 0;
    }*/
  }
`;

const StyledClienteRectangleText = styled.div`
  color: #ffffff;
  font-family: Mulish, Roboto;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 18px;
  width: 100%;
  height: calc(100% - 6px);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  > p {
    font-family: Mulish !important;
    font-width: 900;
  }
  &.active {
    font-size: 22px;
  }
`;

const StyledEventsNumber = styled.p`
  background-color: white;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-left: 10px;
  color: #333333;
  font-family: Roboto;
  font-size: 16px;
  line-height: 16px;
  text-align: center;
`;

const StyledClienteRectangleActive = styled.div`
  height: 6px;
  width: 155px;
  background-color: #aac21f;
`;
