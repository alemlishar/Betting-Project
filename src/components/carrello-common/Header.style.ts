import styled from "styled-components/macro";

export const StyledCarrelloHeadboard = styled.div`
  height: 60px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
`;

export const StyledCarrelloHeader = styled.div`
  display: flex;
  justify-content: space-between;
  height: 50px;
  align-items: center;
  width: 530px;
  background-color: #333333;
`;

export const StyledCarrelloTicketTypeContainer = styled.div`
  display: flex;
`;

export const StyledCarrelloButton = styled.button<{ isOptionActive: boolean }>`
  height: 30px;
  cursor: pointer;
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
  opacity: 0.3;
  background-color: transparent;
  outline: initial;
  margin-left: 20px;
  margin-bottom: 1px;

  &:hover {
    color: #aac21f;
    border-color: #aac21f;
  }

  color: ${(props) => (props.isOptionActive === true ? "#aac21f" : "#ffffff")};
  border-color: ${(props) => (props.isOptionActive === true ? "#aac21f" : "#ffffff")};
`;

export const StyledCarrelloBodyTicketType = styled.div<{ isActive: boolean; isAvailable: boolean; hasBorder: boolean }>`
  opacity: ${(props) => (props.isAvailable ? 1 : 0.3)};
  color: #ffffff;
  font-family: Mulish, sans-serif;
  font-size: 16px;
  font-weight: 800;
  line-height: 25px;
  margin-left: 20px;
  cursor: ${(props) => (props.isAvailable && !props.isActive ? "pointer" : "default")};
  height: 31.5px;
  width: 81.5px;
  text-align: center;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${(props) => (props.hasBorder ? "1.5px solid transparent" : "none")};
  border-color: ${(props) => (props.isActive ? "#fff" : "transparent")};
  box-sizing: border-box;
  &:last-child {
    margin-left: 20px;
  }
`;

export const StyledSettingsContainer = styled.div`
  display: flex;
  margin-right: 10px;
  align-items: center;
  justify-content: center;
`;

export const StyledSettingsButton = styled.div<{ isActive: boolean }>`
  cursor: ${(props) => (props.isActive === true ? "pointer" : "default")};
  svg {
    &:hover {
      fill: #aac21f !important;
      color: #aac21f !important;
      border-color: #aac21f !important;
    }
    height: 20px;
    width: 20px;
    fill: #ffffff;
    opacity: ${(props) => (props.isActive === true ? "1" : "0.3")};
  }
`;
