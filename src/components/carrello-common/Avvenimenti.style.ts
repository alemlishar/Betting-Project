import styled from "styled-components/macro";

export const StyledCarrelloContainer = styled.div<{
  isMultiplaVirtual: boolean;
  hasShadow: boolean;
  isSistemaCorrezioneErrori: boolean;
  isSistemaIntegrale: boolean;
}>`
  max-height: ${(props) =>
    props.isMultiplaVirtual
      ? "576px"
      : props.isSistemaIntegrale
      ? "590px"
      : props.isSistemaCorrezioneErrori
      ? "530px"
      : "100%"};
  overflow-y: scroll;
  padding-bottom: 2px;
  ${(props) =>
    props.hasShadow
      ? ` background:
    linear-gradient(white 30%, rgba(255, 255, 255, 0)),
      linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%,
    radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.21)) 0 100%;
    background-repeat: no-repeat;
    background-size: 100% 40px, 100% 40px, 100% 3px, 100% 3px;
    background-attachment: local, local, scroll, scroll;`
      : ``}

  &::-webkit-scrollbar {
    display: none;
  }

  > div {
    border: solid transparent;
    box-sizing: border-box;
    position: relative;
    width: calc(100% - 3px);
    left: 2px;
    &.is-closed-suspended {
      margin-bottom: 20px;
    }
  }
`;

export const StyledCarrelloBodyEmpty = styled.div`
  color: #434343;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 16px;
  margin-top: 20px;
`;

export const StyledCarrelloBodyEmptyMessage = styled.div`
  margin-bottom: 10px;
  text-align: center;
`;

export const StyledCarrelloBodyEventContainer = styled.div<{ isSistema: boolean; gameType: "VIRTUAL" | "SPORT" }>`
  display: flex;
  justify-content: space-between;
  margin-left: ${(props) => (props.isSistema && props.gameType === "SPORT" ? "37px" : "20px")};
  margin-top: ${(props) => (props.isSistema && props.gameType === "SPORT" ? "-14px" : "0px")};
`;
export const DivEsitoChiuso = styled.div`
  display: flex;
`;
export const StyledCarrelloBodyEventData = styled.div`
  display: flex;
  justify-content: space-between;
  width: fit-content;
  margin-bottom: 5px;
  &:hover {
    cursor: pointer;
  }
`;

export const StyledCarrelloBodyMatchData = styled.div<{ gameType: "VIRTUAL" | "SPORT" }>`
  color: #333333;
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  margin-left: ${(props) => (props.gameType === "VIRTUAL" ? "22px" : "0px")};
  margin-top: ${(props) => (props.gameType === "VIRTUAL" ? "8px" : "0px")};
`;

export const StyledCarrelloBodyProgramDataWrapper = styled.div<{ gameType: "VIRTUAL" | "SPORT" }>`
  margin-right: 1px;
  width: ${(props) => (props.gameType === "SPORT" ? "47px" : "auto")};
  display: flex;
  align-items: center;
`;

export const StyledIsLiveEvent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 56px;
  font-family: Roboto, sans-serif;
  font-weight: 900;
  font-style: italic;
  svg {
    width: 37px;
    fill: #ffffff;
    opacity: 1;
  }
`;

export const StyledCarrelloBodyProgramData = styled.div<{ gameType: "VIRTUAL" | "SPORT" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  min-width: 20px;
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 5px;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  line-height: 14px;
  background-color: ${(props) => (props.gameType === "VIRTUAL" ? "transparent" : "#f0f0f0")};
  margin-top: ${(props) => (props.gameType === "VIRTUAL" ? "5px" : "0px")};
  color: ${(props) => (props.gameType === "VIRTUAL" ? "#a2a2a2" : "#000000")};
  font-size: ${(props) => (props.gameType === "VIRTUAL" ? "16px" : "12px")};
`;

export const StyledCarrelloBodyEventResultContainer = styled.div`
  hr {
    display: none;
    margin-bottom: 0px;
  }
  &:last-child {
    hr {
      display: block;
      position: relative;
      width: calc(100% - 36px);
      height: 1px;
      background-color: #d8d8d8;
      border: 0;
    }
  }
`;

export const StyledCarrelloBodyResultContainer = styled.div<{
  isSistema: boolean;
  isActive: boolean;
  gameType: "SPORT" | "VIRTUAL";
}>`
  display: flex;
  justify-content: space-between;
  height: 20px;
  border: 2px solid transparent;
  margin-left: ${(props) => (props.isSistema && props.gameType === "SPORT" ? "35px" : "20px")};
  ${(props) =>
    props.isActive
      ? ` background-color: rgba(170, 194, 31, 0.2);
    border-color: #aac21f;
    border-radius: 9px;
    &:after {
      content: none;
    }`
      : ""}
`;

export const StyledCarrelloBodyEsitoContainer = styled.div<{ isSuspended: boolean }>`
  color: ${(props) => (props.isSuspended ? "#999999" : "#333333")};
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

export const StyledCarrelloBodyQuoteUpDownContainer = styled.div<{ isVariazioneQuota: boolean }>`
  display: flex;
  width: ${(props) => (props.isVariazioneQuota ? "60px" : "41px")};
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
`;

export const StyledCarrelloBodyClasseEsito = styled.div`
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  white-space: nowrap;
  overflow: hidden;
  max-width: 256px;
  text-overflow: ellipsis;
`;

export const StyledCarrelloBodyEsito = styled.div<{
  gameType: "SPORT" | "VIRTUAL";
}>`
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 900;
  line-height: 21px;
  margin-left: 10px;
  max-width: ${(props) => (props.gameType === "SPORT" ? "83px" : "150px")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const StyledCarrelloIndexEsito = styled.div`
  height: 20px;
  width: 20px;
  display: flex;
  margin-right: 16px;
  color: #ffffff;
  border-radius: 5px;
  background-color: #222222;
  > div {
    height: 16px;
    font-family: Roboto;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0;
    line-height: 16px;
    margin: auto;
  }
`;
export const StyledCarrelloBodyQuoteContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledCarrelloBodyTypeEsito = styled.div<{ gameType: "VIRTUAL" | "SPORT" }>`
  height: 20px;
  width: 81.07px;
  border-radius: 5px;
  background-color: #f0f0f0;
  color: #000000;
  font-family: Roboto;
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 14px;
  float: ${(props) => (props.gameType === "VIRTUAL" ? "left" : "right")};
  margin-right: 5px;
  line-height: 20px;
  text-align: center;
`;

export const StyledCarrelloBodyTrash = styled.div`
  height: 30px;
  width: 34px;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  img {
    cursor: pointer;
  }
`;

export const StyledCarrelloLine = styled.div`
  box-sizing: border-box;
  height: 1px;
  width: 492px;
  border: 0.5px solid #d8d8d8;
  margin-right: auto;
  margin-left: auto;
`;

export const StyledCarrelloBodyQuote = styled.div<{ quoteState: string }>`
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: bold;
  margin-right: ${(props) => (props.quoteState === "up" || props.quoteState === "down" ? "0px" : "5px")};
  letter-spacing: 0;
  line-height: 21px;
  text-align: right;
  color: ${(props) =>
    props.quoteState === "CLOSE" || props.quoteState === "SUSPENDED"
      ? "#999999"
      : props.quoteState === "up"
      ? "#3b914c"
      : props.quoteState === "down"
      ? "#db1a11"
      : "#000000"};
`;

export const StyledCarrelloBodyQuoteUpDown = styled.div<{ variazioneQuota: string }>`
  width: 0;
  height: 0;
  ${(props) =>
    props.variazioneQuota === "up"
      ? `
  border-top: 8.48px solid #3b914c;
    border-left: 8.48px solid transparent;
  `
      : props.variazioneQuota === "down"
      ? ` margin-bottom: -4px;
    border-bottom: 8.48px solid #db1a11;
    border-right: 8.48px solid transparent;`
      : ``}
`;

//VIRTUAL
export const StyledTipoTesto = styled.span`
  margin-left: 14px;
`;
export const StyledDateVirtualMatch = styled.span`
  color: #383838;
`;
export const StyledSeparator = styled.span`
  margin: 0px 8px;
`;
export const StyledTimeVirtualMatch = styled.span`
  color: #383838;
  font-weight: 700;
`;
export const StyledTipoEvento = styled.div`
  margin-left: 20px;
  margin-bottom: 8px;
  height: 20px;
  color: #a2a2a2;
  font-size: 18px;
  display: flex;
  align-items: center;
  svg {
    height: 20px;
    width: 20px;
  }
`;
