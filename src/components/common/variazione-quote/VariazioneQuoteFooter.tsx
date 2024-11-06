import React from "react";
import styled from "styled-components/macro";
import { EventoType } from "src/types/carrello.types";
import { parseAsMoney } from "src/helpers/format-data";
import { truncate } from "src/helpers/format-data";
import { Puntata } from "src/components/carrello/puntata/Puntata";
import { BonusMultipla } from "src/components/carrello/avvenimenti/footer/bonus-multipla/BonusMultipla";
import { VenditaOptionalParameters } from "../../../types/vendita.types";

export function VariazioneQuoteFooter({
  isSistema,
  bet,
  potentialWinning,
  bonusMultipla,
  calculateBonusMultipla,
  sistemaFooterData,
  sistemaIntegrale,
  totQuote,
  selectedEvents,
  dismissVariazioneQuoteModal,
  venditaMultipla,
  venditaSistema,
  setShowChangeQuoteFlag,
}: {
  isSistema: boolean;
  bet: number;
  potentialWinning: number;
  bonusMultipla: number;
  calculateBonusMultipla: (b: number, n: number, e: boolean, s: number, q: number) => void;
  sistemaFooterData: { minWinningAmount: number; maxWinningAmount: number } | undefined;
  sistemaIntegrale: boolean;
  totQuote: number;
  selectedEvents: EventoType[];
  dismissVariazioneQuoteModal: () => void;
  venditaMultipla: (params?: VenditaOptionalParameters) => void;
  venditaSistema: (params?: VenditaOptionalParameters) => void;
  setShowChangeQuoteFlag: (a: boolean) => void;
}) {
  return (
    <>
      {!isSistema ? (
        <MultiplaFooterWrapper>
          <StyledRecapFooter>
            <StyledQuoteRow>
              <BonusMultipla
                bonusMultipla={bonusMultipla}
                calculateBonusMultipla={calculateBonusMultipla}
                selectedEvents={selectedEvents}
              />
              <StyledTotalQuote>
                Quota totale <StyledBonusQuoteAmount>({truncate(totQuote, 2)})</StyledBonusQuoteAmount>
              </StyledTotalQuote>
            </StyledQuoteRow>
            <StyledPuntata>
              <StyledPuntataResult>
                <p>Puntata</p>
                <StyledBuonoGioco className={"disabled"}>Buono gioco</StyledBuonoGioco>
              </StyledPuntataResult>
              <Puntata bet={bet} disablePuntataInput={true} />
            </StyledPuntata>
            <StyledPotentialWinRow>
              Vincita potenziale <StyledPotentialWinAmount> {parseAsMoney(potentialWinning)} </StyledPotentialWinAmount>
            </StyledPotentialWinRow>
          </StyledRecapFooter>
          <StyleButtons>
            <FirstButton
              onClick={() => {
                dismissVariazioneQuoteModal();
              }}
            >
              Annulla{" "}
              <div>
                <p className={"shortcut"}>{"F1"}</p>
              </div>
            </FirstButton>
            <SecondButton
              onClick={() => {
                dismissVariazioneQuoteModal();
                venditaMultipla({ newFlag: 1 });
              }}
            >
              Si, solo queste{" "}
              <div>
                <p className={"shortcut"}>{"F2"}</p>
              </div>
            </SecondButton>
            <ThirdButton
              onClick={() => {
                dismissVariazioneQuoteModal();
                venditaMultipla({ newFlag: 2 });
              }}
            >
              Accetta tutte{" "}
              <div>
                <p className={"shortcut"}>{"F3"}</p>
              </div>
            </ThirdButton>
          </StyleButtons>
        </MultiplaFooterWrapper>
      ) : (
        <>
          <SistemaFooterWrapper>
            <SistemaFooterInfo>
              <SistemaFooterInfoRow className={"bet"}>
                <div>
                  Puntata
                  <SistemaButtonBuonoSconto>Buono gioco</SistemaButtonBuonoSconto>
                </div>
                <p>{parseAsMoney(bet)}</p>
              </SistemaFooterInfoRow>

              {!sistemaIntegrale && (
                <div>
                  <SistemaFooterInfoRow>
                    <div>Vincita potenziale minima</div>
                    <p>{parseAsMoney(sistemaFooterData ? sistemaFooterData.minWinningAmount : 0)}</p>
                  </SistemaFooterInfoRow>
                  <SistemaFooterInfoRow>
                    <div>Vincita potenziale massima</div>
                    <p>{parseAsMoney(sistemaFooterData ? sistemaFooterData.maxWinningAmount : 0)}</p>
                  </SistemaFooterInfoRow>
                </div>
              )}
            </SistemaFooterInfo>
          </SistemaFooterWrapper>
          <StyleButtons>
            <FirstButton
              onClick={() => {
                dismissVariazioneQuoteModal();
              }}
            >
              Annulla{" "}
              <div>
                <p className={"shortcut"}>{"F1"}</p>
              </div>
            </FirstButton>
            <SecondButton
              onClick={() => {
                dismissVariazioneQuoteModal();
                venditaSistema({ newFlag: 1 });
              }}
            >
              Si, solo queste{" "}
              <div>
                <p className={"shortcut"}>{"F2"}</p>
              </div>
            </SecondButton>
            <ThirdButton
              onClick={() => {
                dismissVariazioneQuoteModal();
                venditaSistema({ newFlag: 2 });
              }}
            >
              Accetta tutte{" "}
              <div>
                <p className={"shortcut"}>{"F3"}</p>
              </div>
            </ThirdButton>
          </StyleButtons>
        </>
      )}
    </>
  );
}

const MultiplaFooterWrapper = styled.div`
  /* box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.21);*/
  height: auto;
  position: relative;
  top: 10px;
`;

const StyledRecapFooter = styled.div`
  position: relative;
  background-color: #f4f4f4;
  justify-content: space-evenly;
  margin-left: 20px;
  margin-top: 10px;
  max-width: 490px;
  height: 125px;
  padding: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  box-sizing: border-box;
  border-radius: 10px;

  div {
    display: flex;
  }
  &.has-Closed-Suspended {
    height: 225px;
    margin-bottom: 60px;
  }
  &.no-Closed-Suspended {
    margin-bottom: 10px;
  }
`;

const StyledQuoteRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: 100;
  width: 100%;
`;

const StyledTotalQuote = styled.div`
  text-align: right;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  display: flex;
  justify-content: flex-end;
  font-weight: 100;
`;

const StyledBonusQuoteAmount = styled.div`
  font-weight: 700;
  margin-left: 5px;
`;

const StyledPotentialWinRow = styled.div`
  position: absolute;
  font-size: 18px;
  font-family: Mulish;
  font-weight: 900;
`;

const StyledPotentialWinAmount = styled.div`
  font-size: 20px;
  display: inline-flex;
  float: right;
  min-width: 150px;
  max-width: 200px;
  left: 125px;
  position: relative;
  &.error {
    color: #ff0000;
  }
`;

const StyledPuntata = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
`;

const StyledPuntataResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  > p {
    font-size: 18px;
    font-family: Mulish;
    font-weight: 900;
  }
`;

const StyledBuonoGioco = styled.div`
  border: 2px solid #222222;
  border-radius: 9px;
  width: 120px;
  height: 40px;
  justify-content: center;
  display: flex;
  align-items: center;
  font-size: 17px;
  margin-left: 10px;
  box-sizing: border-box;
  &.disabled {
    border: 2px solid #999999;
    color: #999999;
  }
`;
const FirstButton = styled.button`
  :focus {
    outline: none;
  }
  :hover {
    cursor: pointer;
  }
  font-family: Mulish;
  margin-bottom: 7px;
  font-size: 18px;
  font-weight: 600;
  color: black;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffb800;
  text-align: center;
  width: 50%;
  left: -11px;
  border: #005936;
  max-width: 100px;
  .shortcut {
    min-height: 22px;
    min-width: 22px;
    background-color: black;
    color: white;
    font-family: Roboto, sans-serif;
    font-size: 13px;
    font-weight: bold;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    padding: 0 8px;
  }
`;
const SecondButton = styled.button`
  :focus {
    outline: none;
  }
  :hover {
    cursor: pointer;
  }
  font-family: Mulish;
  margin-bottom: 7px;
  font-size: 18px;
  font-weight: 600;
  color: black;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffb800;
  text-align: center;
  width: 36%;
  left: 5px;
  top: 17px;
  border-color: black;
  border-width: 3px;
  border-radius: 10px;
  max-width: 200px;
  max-height: 50px;
  .shortcut {
    min-height: 22px;
    min-width: 22px;
    background-color: black;
    color: white;
    font-family: Roboto, sans-serif;
    font-size: 13px;
    font-weight: bold;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    padding: 0 8px;
  }
`;
const ThirdButton = styled.button`
  :focus {
    outline: none;
  }
  :hover {
    cursor: pointer;
  }
  font-weight: 600;
  font-family: Mulish;
  margin-bottom: 7px;
  font-size: 18px;
  color: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  text-align: center;
  width: 34%;
  top: 17px;
  left: 17px;
  border-color: black;
  border-width: 3px;
  border-radius: 10px;
  max-width: 200px;
  max-height: 50px;
  .shortcut {
    min-height: 22px;
    min-width: 22px;
    background-color: white;
    color: black;
    font-family: Roboto, sans-serif;
    font-size: 13px;
    font-weight: bold;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    padding: 0 8px;
  }
`;
const StyleButtons = styled.div`
background-color: #ffb800;
position:relative;
    color: #333333;
height: 90px;
width: 100%;
border-radius: 8px 8px 0 0;
display: flex;
justify-content: center;
cursor: pointer;
flex-direction: row;
div {
  display: flex;
  align-items: center;
  .label {
    color: #ffffff;
    font-family: Roboto, sans-serif;
    font-size: 17px;
    font-weight: bold;
  }
  button {
    width: 240px;
    height: 40px;
    box-shadow: none;
    font-family: Mulish, sans-serif;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 0;
    border-width: 2px;
    border-style: solid;
    border-radius: 8px;

    &.transparent {
      color: #222222;
      border-color: #222222;
      background-color: transparent;
    }

    &.full {
      color: #ffffff;
      background-color: #aac21f;
      border-color: #aac21f;
      &:disabled {
        background-color: #aac21f;
        color: #ffffff;
        opacity: 50%;
      }
    }
  }
  

`;
const SistemaFooterWrapper = styled.div`
  /* background-color: #ffffff;
box-shadow: 0 -2px 3px 0 rgba(0, 0, 0, 0.21);*/
  padding: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const SistemaFooterInfo = styled.div`
  background-color: #f4f4f4;
  width: 100%;
  border-radius: 8px;
  padding: 5px;
  max-height: 160px;
`;

const SistemaFooterInfoRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  box-sizing: border-box;
  min-height: 30px;
  color: #000000;
  letter-spacing: 0;
  line-height: 28px;
  > div {
    font-size: 18px;
  }
  p {
    font-size: 20px;
  }
  &.bet {
    margin-top: 10px;
    margin-bottom: 5px;
  }

  > * {
    font-family: Mulish, sans-serif;
    font-weight: 900;
    display: flex;
    align-items: center;
    margin: 0;
  }
`;

const SistemaButtonBuonoSconto = styled.div`
  height: 40px;
  width: 125px;
  border: 2px solid #222222;
  border-radius: 9px;
  color: #222222;
  font-family: Roboto, sans-serif;
  font-size: 17px;
  font-weight: bold;
  letter-spacing: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;
