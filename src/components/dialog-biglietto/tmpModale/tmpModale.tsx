import React from "react";

import styled from "styled-components/macro";

export const TmpModale = (props: { isOpen: boolean; setOpen(set: boolean): void }) => {
  if (!props.isOpen) {
    return null;
  }
  return (
    <WrapperTmpModale>
      <BoldText>Processo di Disanonimazione </BoldText>
      <NormalText>
        Da definire il flusso della Raccolta dati clienti e<br />
        avvio processo di disanonimazione tramite la piattaforma SAG{" "}
      </NormalText>
      <TmpModaleDetails />
    </WrapperTmpModale>
  );
};
export const TmpModaleDetails = styled.div``;
export const WrapperTmpModale = styled.div`
  width: 700px;
  padding: 50px;
  background-color: white;
  height: 450px;
  border-radius: 10px;
`;
const BoldText = styled.div`
  font-weight: 700;
  font-size: 24px;
`;
const NormalText = styled.div`
  padding-top: 30px;
  font-weight: 400;
  font-size: 16px;
`;

export const StyledDialogBigliettoOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  background-color: rgba(0, 0, 0, 0.77);
  z-index: 2;
  &.minimized {
    width: auto;
    height: auto;
    bottom: 0;
    top: auto;
    left: 60px;
    background-color: transparent;
  }
`;

export default TmpModale;
