import styled from "styled-components/macro";

export const StyledDialogContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0;
  background-color: rgba(0, 0, 0, 0.61);
  z-index: 2;
  overflow: hidden;
`;
