import styled from "styled-components/macro";

export const StyledCarrelloWrapper = styled.div`
  height: 100%;
  width: 530px;
  border-radius: 4px 0 0 4px;
  background-color: #444444;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const StyledCarrelloButton = styled.button<{
  isActive: boolean;
}>`
  height: 30px;
  cursor: ${(props) => (props.isActive ? "pointer" : "default")};
  width: 70px;
  color: #ffffff;
  font-family: Mulish, sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 16px;
  border: 2px solid #ffffff;
  border-radius: 8px;
  text-align: center;
  opacity: ${(props) => (props.isActive ? 1 : 0.3)};
  background-color: transparent;
  outline: initial;
  margin-left: 13px;
  margin-bottom: 10px;
  &:hover {
    color: ${(props) => (props.isActive ? "#aac21f" : "")};
    border-color: ${(props) => (props.isActive ? "#aac21f" : "")};
  }
`;

export const StyledCarrelloBody = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 166px);
  width: 530px;
  background-color: #ffffff;
  justify-content: space-between;
`;

export const StyledCarrelloFooter = styled.div`
  background-color: transparent;
  display: flex;
  height: 56px;
  align-items: center;
  justify-content: space-between;
`;

export const StyledBigliettoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: -130px;
  margin-bottom: 10px;
`;
export const StyledBiglietto = styled.div`
  opacity: 0.3;
  color: #ffffff;
  font-family: Mulish, sans-serif;
  font-size: 14px;
  font-weight: 800;
  line-height: 18px;
`;
export const StyledBigliettoSum = styled.div`
  opacity: 0.6;
  color: #ffffff;
  font-family: Mulish, sans-serif;
  font-size: 21px;
  font-weight: 800;
  line-height: 26px;
  margin-left: 46px;
  &.active {
    opacity: 1;
    &:hover {
      color: #aac21f;
      border-color: #aac21f;
    }
  }
  &.not-active {
    opacity: 0.6;
  }
`;
export const StyledBigliettoContainerRiscossi = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: -130px;
  margin-bottom: 10px;
`;
export const StyledBigliettoRiscossi = styled.div`
  opacity: 0.3;
  color: #ffffff;
  font-family: Mulish, sans-serif;
  font-size: 14px;
  font-weight: 800;
  line-height: 18px;
`;
export const StyledBigliettoSumRiscossi = styled.div`
  opacity: 0.6;
  color: #ffffff;
  font-family: Mulish, sans-serif;
  font-size: 21px;
  font-weight: 800;
  line-height: 26px;
  margin-left: 54px;
  &.active {
    opacity: 1;
    &:hover {
      color: #aac21f;
      border-color: #aac21f;
    }
  }
  &.not-active {
    opacity: 0.6;
  }
`;
export const StyledCarrelloTotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  margin-bottom: 10px;
`;

export const StyledCarrelloTotal = styled.div`
  opacity: 0.3;
  color: #ffffff;
  font-family: Mulish, sans-serif;
  font-size: 14px;
  font-weight: 800;
  text-align: right;
  line-height: 18px;
`;

export const StyledCarrelloEuroQuote = styled.div<{
  disabled: boolean;
}>`
  color: #ffffff;
  font-family: Mulish, sans-serif;
  font-size: 21px;
  font-weight: 800;
  line-height: 26px;
  margin-left: 42px;
  opacity: ${(props) => (props.disabled ? "0.6" : "1")};
`;
