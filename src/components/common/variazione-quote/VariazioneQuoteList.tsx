import React from "react";
import styled from "styled-components/macro";
import { EventoType } from "src/types/carrello.types";
import { ReactComponent as LiveIcon } from "../../../assets/images/live.svg";
import { SwitchFixed } from "src/components/carrello/avvenimenti/SwitchFixed";

export function VariazioneQuoteList({
  selectedEvents,
  isSistema,
}: {
  selectedEvents: EventoType[];
  isSistema: boolean;
}) {
  //ev -> indice evento (0)
  // es -> indice esito (1)
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <StyledCarrelloContainer ref={containerRef} className={selectedEvents.length > 4 ? "shadow" : ""}>
        {selectedEvents.map((evento: EventoType, indexEvento: number) => (
          <div key={`${evento.id}_${evento.esiti[0].id}_events`}>
            {isSistema && (
              <SwitchFixed
                dataQa={`carrello-fissa-${evento.codicePalinsesto}-${evento.codiceAvvenimento}`}
                id={evento.id}
                updateIsFixed={() => {}}
                isSelected={false}
                disable={true}
                isFixed={evento.isFixed}
                hasQuotaVariata={evento.hasQuoteVariate}
              />
            )}
            <StyledCarrelloBodyEventContainer className={isSistema ? "system" : ""}>
              <StyledCarrelloBodyEventData className={!evento.hasQuoteVariate ? "closed" : ""}>
                <StyledCarrelloBodyProgramDataWrapper>
                  <StyledCarrelloBodyProgramData className={!evento.hasQuoteVariate ? "closed" : ""}>
                    {evento.codiceAvvenimento}
                  </StyledCarrelloBodyProgramData>
                </StyledCarrelloBodyProgramDataWrapper>
                <StyledCarrelloBodyMatchData className={!evento.hasQuoteVariate ? "closed" : ""}>
                  {evento.descrizioneAvvenimento}
                </StyledCarrelloBodyMatchData>
              </StyledCarrelloBodyEventData>
              {evento.live && (
                <StyledIsLiveEvent className={!evento.hasQuoteVariate ? "closed" : ""}>
                  <LiveIcon />
                </StyledIsLiveEvent>
              )}
            </StyledCarrelloBodyEventContainer>
            {evento.esiti.map((esito, indexEsito) => {
              return (
                <>
                  <StyledCarrelloBodyEventResultContainer
                    key={`${evento.id}_${esito.id}`}
                    className={!esito.quotaVariata ? "is-closed-suspended" : ""}
                  >
                    <StyledCarrelloBodyResultContainer className={isSistema ? "system" : ""}>
                      <StyledCarrelloBodyEsitoContainer className={!esito.quotaVariata ? "is-suspended" : ""}>
                        <StyledCarrelloIndexEsito className={!esito.quotaVariata ? "closed" : ""}>
                          <div className="testo">{esito.indice}</div>
                        </StyledCarrelloIndexEsito>
                        <StyledCarrelloBodyClasseEsito>{esito.descrizioneScommessa}</StyledCarrelloBodyClasseEsito>
                        <StyledCarrelloBodyEsito>{esito.descrizioneEsito}</StyledCarrelloBodyEsito>
                      </StyledCarrelloBodyEsitoContainer>
                      <DivEsitoChiuso className="test">
                        {esito.stato !== undefined && esito.stato !== 1 && (
                          <StyledCarrelloBodyTypeEsito>
                            {esito.stato === 0 ? "Esito Chiuso" : "Esito Sospeso"}
                          </StyledCarrelloBodyTypeEsito>
                        )}

                        <StyledCarrelloBodyQuoteContainer
                          className={esito.stato !== undefined && esito.stato !== 1 ? "hasEsitoStato" : "noEsitoStato"}
                        >
                          {esito.stato !== undefined && esito.stato === 0 && (
                            <StyledCarrelloBodyQuote className="is-closed">-</StyledCarrelloBodyQuote>
                          )}
                          {esito.stato !== undefined && esito.stato === 1 && !esito.quotaVariata && (
                            <StyledCarrelloBodyQuote className={!esito.quotaVariata ? "is-closed" : ""}>
                              {(esito.quota / 100).toFixed(2)}
                            </StyledCarrelloBodyQuote>
                          )}

                          {esito.stato !== undefined && esito.stato === 1 && esito.quotaVariata && (
                            <StyledCarrelloBodyQuoteUpDownContainer
                              className={` ${
                                esito.quotaVariataUpDown === "down" || esito.quotaVariataUpDown === "up"
                                  ? ""
                                  : "change-width"
                              }`}
                            >
                              <StyledCarrelloBodyQuote className={esito.quotaVariataUpDown}>
                                {(esito.quota / 100).toFixed(2)}
                              </StyledCarrelloBodyQuote>
                              <StyledCarrelloBodyQuoteUpDown
                                className={esito.quotaVariataUpDown}
                              ></StyledCarrelloBodyQuoteUpDown>
                            </StyledCarrelloBodyQuoteUpDownContainer>
                          )}
                          {esito.stato !== undefined && esito.stato === 2 && (
                            <StyledCarrelloBodyQuote className="is-suspended">
                              {(esito.quota / 100).toFixed(2)}
                            </StyledCarrelloBodyQuote>
                          )}
                        </StyledCarrelloBodyQuoteContainer>
                      </DivEsitoChiuso>
                    </StyledCarrelloBodyResultContainer>
                    <hr className={esito.stato !== undefined && esito.stato !== 1 ? "closed-suspended" : ""}></hr>
                  </StyledCarrelloBodyEventResultContainer>
                </>
              );
            })}
          </div>
        ))}
      </StyledCarrelloContainer>
    </>
  );
}

const StyledCarrelloContainer = styled.div`
  height: 633px;
  max-height: 100%;
  overflow-y: scroll;
  padding-bottom: 2px;
  &.shadow {
    background:
   
    /* Shadow covers */ linear-gradient(white 30%, rgba(255, 255, 255, 0)),
      linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%,
      /* Shadows */ radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.21)) 0 100%;
    background-repeat: no-repeat;
    background-size: 100% 40px, 100% 40px, 100% 3px, 100% 3px;

    /* Opera doesn't support this in the shorthand */
    background-attachment: local, local, scroll, scroll;
  }

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

const StyledCarrelloBodyEventContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  &.system {
    margin-left: 37px;
    margin-top: -14px;
  }
  &.closed {
    color: #999999;
  }
`;
const DivEsitoChiuso = styled.div`
  display: flex;
`;
const StyledCarrelloBodyEventData = styled.div`
  display: flex;
  justify-content: space-between;
  width: fit-content;
  margin-bottom: 5px;
  &.closed {
    color: #999999;
  }
`;

const StyledCarrelloBodyMatchData = styled.div`
  color: #333333;
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  &.closed {
    color: #999999;
  }
`;

const StyledCarrelloBodyProgramDataWrapper = styled.div`
  margin-right: 1px;
  width: 47px;
  display: flex;
  align-items: center;
`;

const StyledIsLiveEvent = styled.div`
  display: flex;
  justify-content: center;
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
  &.closed {
    opacity: 45%;
  }
`;

const StyledCarrelloBodyProgramData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  min-width: 20px;
  padding-left: 3px;
  padding-right: 3px;
  border-radius: 5px;
  background-color: #f0f0f0;
  color: #000000;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  &.closed {
    color: #999999;
  }
`;

const StyledCarrelloBodyEventResultContainer = styled.div`
  &.is-closed-suspended {
    //margin-bottom: 25px;
  }
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
      &.closed-suspended {
        // top: 15px;
      }
    }
  }
`;

const StyledCarrelloBodyResultContainer = styled.div`
  display: flex;
  justify-content: space-between;
  height: 20px;
  margin-left: 20px;
  border: 2px solid transparent;
  &.system {
    margin-left: 35px;
  }
  &.active {
    background-color: rgba(170, 194, 31, 0.2);
    border-color: #aac21f;
    border-radius: 9px;
    &:after {
      content: none;
    }
  }
  .space {
    height: 15px;
  }
`;

const StyledCarrelloBodyEsitoContainer = styled.div`
  color: #333333;
  display: flex;
  width: fit-content;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  &.is-suspended {
    color: #999999;
  }
`;

const StyledCarrelloBodyQuoteUpDownContainer = styled.div`
  display: flex;
  width: 60px;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  &.change-width {
    width: 41px !important;
  }
`;

const StyledCarrelloBodyClasseEsito = styled.div`
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
`;

const StyledCarrelloBodyEsito = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 900;
  line-height: 21px;
  margin-left: 10px;
`;
const StyledCarrelloIndexEsito = styled.div`
  height: 20px;
  width: 20px;
  display: flex;
  margin-right: 24px;
  color: #ffffff;
  border-radius: 5px;
  background-color: #222222;
  .testo {
    height: 16px;
    font-family: Roboto;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 0;
    line-height: 16px;
    margin: auto;
  }
  &.closed {
    color: #999999;
    background-color: #4e4e4e;
  }
`;
const StyledCarrelloBodyQuoteContainer = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;
  &.noEsitoStato {
    width: auto;
  }
  &.hasEsitoStato {
    width: auto;
  }
`;

const StyledCarrelloBodyTypeEsito = styled.div`
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
  float: right;
  margin-right: 5px;

  line-height: 20px;
  text-align: center;
`;

const StyledCarrelloBodyQuote = styled.div`
  color: #000000;
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: bold;
  margin-right: 5px;
  letter-spacing: 0;
  line-height: 21px;
  text-align: right;
  &.is-closed {
    // margin-left: 30px;
    color: #999999;
  }
  &.is-suspended {
    color: #999999;
  }
  &.up {
    margin-right: 0px;
    color: #3b914c;
  }
  &.down {
    margin-right: 0px;

    color: #db1a11;
  }
`;

const StyledCarrelloBodyQuoteUpDown = styled.div`
  width: 0;
  height: 0;
  &.up {
    border-top: 8.48px solid #3b914c;
    border-left: 8.48px solid transparent;
  }
  &.down {
    margin-bottom: -4px;
    border-bottom: 8.48px solid #db1a11;
    border-right: 8.48px solid transparent;
  }
`;
