import React, { useCallback, useMemo } from "react";
import { useVirtualUpdateClientsContext } from "src/components/common/context-clients/VirtualClientsContext";
import styled, { css } from "styled-components/macro";
import { FormattedMessage } from "react-intl";
import { ReactComponent as BackArrow } from "../../../assets/images/back.svg";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";
import { PuntataSistemaVirtual } from "src/components/carrello-virtual/sviluppo-sistema/PuntataSistemaVirtual";
import { useLastDefinedValue } from "src/components/carrello-virtual/CarrelloVirtual";

export const SviluppoSistemaVirtual = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
}) => {
  const { giocataSistemisticaData, activeVirtualClient } = useVirtualUpdateClientsContext();

  const giocataSistemisticaSviluppataResponseComplete = useLastDefinedValue(
    giocataSistemisticaData,
    activeVirtualClient.puntataSistema,
  );
  const giocataSistemisticaSviluppataResponse =
    giocataSistemisticaSviluppataResponseComplete.lastDefinedValue.sviluppoByCardinalita;
  const cardinalities = activeVirtualClient.puntataSistema;

  return (
    <>
      {isOpen && (
        <StyledSviluppoSistema>
          <StyledSviluppoSistemaHeader>
            <div>
              <p className={"title"}>Sviluppa sistema</p>
              <p className={"subtitle"}>Inserisci l’importo di puntata per le combinazioni desiderate</p>
            </div>
            <div>
              <button
                disabled={true}
                className={"btn"}
                onClick={() => {
                  console.log("Stampo l'anteprima e canto");
                }}
              >
                Stampa Anteprima
              </button>
              <button className={"back"} onClick={() => onClose(false)}>
                <BackArrow />
              </button>
            </div>
          </StyledSviluppoSistemaHeader>
          <StyledSviluppoSistemaBody>
            <StyledSviluppoSistemaGrid row={"HEAD"}>
              <StyledSviluppoGridRow gridColumn={"legature"} gridRow={"head"}>
                <FormattedMessage
                  description="legature del sistema"
                  defaultMessage="Legature<br></br><b>del sistema</b>"
                  values={{
                    b: (chunks: string) => (
                      <span
                        css={css`
                          font-weight: 400;
                          color: #333333;
                          font-size: 16px;
                        `}
                      >
                        {chunks}
                      </span>
                    ),
                    br: () => <br />,
                  }}
                />
              </StyledSviluppoGridRow>

              <StyledSviluppoGridRow gridColumn={"combinazioni"} gridRow={"head"}>
                <FormattedMessage
                  description="combinazioni totali"
                  defaultMessage="Combinazioni<br></br><b>totali</b>"
                  values={{
                    b: (chunks: string) => (
                      <span
                        css={css`
                          font-weight: 400;
                          color: #333333;
                          font-size: 16px;
                        `}
                      >
                        {chunks}
                      </span>
                    ),
                    br: () => <br />,
                  }}
                />
              </StyledSviluppoGridRow>

              <StyledSviluppoGridRow
                gridColumn={"vincitaMinMax"}
                gridRow={"head"}
                css={css`
                  text-align: right;
                `}
              >
                <FormattedMessage
                  description="vincita Min - Max per combinazione"
                  defaultMessage="Vincita Min - Max<br></br><b>per combinazione</b>"
                  values={{
                    b: (chunks: string) => (
                      <span
                        css={css`
                          font-weight: 400;
                          color: #333333;
                          font-size: 16px;
                        `}
                      >
                        {chunks}
                      </span>
                    ),
                    br: () => <br />,
                  }}
                />
              </StyledSviluppoGridRow>

              <StyledSviluppoGridRow
                gridColumn={"costo"}
                gridRow={"head"}
                css={css`
                  text-align: right;
                `}
              >
                <FormattedMessage
                  description="Costo per combinazione"
                  defaultMessage="Costo<br></br><b>per combinazione</b>"
                  values={{
                    b: (chunks: string) => (
                      <span
                        css={css`
                          font-weight: 400;
                          color: #333333;
                          font-size: 16px;
                        `}
                      >
                        {chunks}
                      </span>
                    ),
                    br: () => <br />,
                  }}
                />
              </StyledSviluppoGridRow>

              <StyledSviluppoGridRow
                gridColumn={"puntata"}
                gridRow={"head"}
                css={css`
                  text-align: right;
                  margin-right: 70px;
                `}
              >
                <FormattedMessage
                  description="puntata totale"
                  defaultMessage="Puntata<br></br><b>totale</b>"
                  values={{
                    b: (chunks: string) => (
                      <span
                        css={css`
                          font-weight: 400;
                          color: #333333;
                          font-size: 16px;
                        `}
                      >
                        {chunks}
                      </span>
                    ),
                    br: () => <br />,
                  }}
                />
              </StyledSviluppoGridRow>
            </StyledSviluppoSistemaGrid>
            <StyledSviluppoSistemaBodyContainer>
              {cardinalities
                .slice(0)
                .reverse()
                .map((cardinality) => {
                  const indexToShow = cardinalities.indexOf(
                    cardinalities.find((l) => l.cardinalita === cardinality.cardinalita) || cardinalities[0],
                  );
                  const currentBet = cardinalities[indexToShow].importo;
                  const currentGiocataSistemistica = Object.values(giocataSistemisticaSviluppataResponse).filter(
                    (giocataSistemistica) => {
                      return giocataSistemistica.cardinalita === cardinality.cardinalita;
                    },
                  )[0];

                  return (
                    <React.Fragment key={indexToShow}>
                      <StyledSviluppoSistemaGrid row={"BODY"}>
                        <StyledSviluppoGridRow
                          gridColumn={"legature"}
                          gridRow={"legatura"}
                          css={css`
                            text-align: center;
                            margin-right: 10px;
                          `}
                        >
                          <FormattedMessage
                            description="sviluppo della cardinalità"
                            defaultMessage="{cardinalita} <b> su {eventsNumber}</b>"
                            values={{
                              cardinalita: cardinality.cardinalita,
                              b: (chunks: string) => (
                                <span
                                  css={css`
                                    color: #7b7b7b;
                                  `}
                                >
                                  {chunks}
                                </span>
                              ),
                              eventsNumber: cardinalities.length,
                            }}
                          />
                        </StyledSviluppoGridRow>

                        <StyledSviluppoGridRow
                          gridColumn={"combinazioni"}
                          gridRow={"legatura"}
                          css={css`
                            margin: auto;
                            align-self: center;
                            text-align: center;
                            font-weight: 400;
                          `}
                        >
                          <div
                            css={css`
                              background-color: #f4f4f4;
                              border-radius: 25px;
                              min-width: 70px;
                              height: 30px;
                              line-height: 30px;
                              inline-size: fit-content;
                              margin-right: 20px;
                            `}
                          >
                            <FormattedMessage
                              description="combinazioni per legatura"
                              defaultMessage="x{combinazioni}"
                              values={{
                                combinazioni: currentGiocataSistemistica.numeroSviluppi,
                              }}
                            />
                          </div>
                        </StyledSviluppoGridRow>

                        <StyledSviluppoGridRow
                          gridColumn={"vincitaMinMax"}
                          gridRow={"legatura"}
                          css={css`
                            font-weight: bold;

                            text-align: right;
                          `}
                        >
                          {formatCurrency(decimalToIntegerValue(currentGiocataSistemistica.vincitaMinima))} -{" "}
                          {formatCurrency(decimalToIntegerValue(currentGiocataSistemistica.vincitaMassima))}
                        </StyledSviluppoGridRow>

                        <StyledSviluppoGridRow
                          gridColumn={"costo"}
                          gridRow={"legatura"}
                          css={css`
                            font-weight: bold;

                            text-align: right;
                          `}
                        >
                          {formatCurrency(currentBet * currentGiocataSistemistica.numeroSviluppi)}
                        </StyledSviluppoGridRow>

                        <StyledSviluppoGridRow
                          gridColumn={"puntata"}
                          gridRow={"legatura"}
                          css={css`
                            font-weight: bold;

                            margin-left: 22px;
                          `}
                        >
                          <PuntataSistemaVirtual indexToShow={cardinality.cardinalita} />
                        </StyledSviluppoGridRow>
                      </StyledSviluppoSistemaGrid>

                      <StyledLine />
                    </React.Fragment>
                  );
                })}
            </StyledSviluppoSistemaBodyContainer>
          </StyledSviluppoSistemaBody>
        </StyledSviluppoSistema>
      )}
    </>
  );
};
const StyledLine = styled.div`
  border: none;
  height: 1px;
  color: #bbbbbb;
  background-color: #bbbbbb;
`;
const StyledSviluppoSistema = styled.div`
  position: absolute;
  width: calc(100vw - 848px);
  height: 100%;
  right: calc(100% - 2px);
  top: 0;
  border-radius: 4px 0 0 4px;
  background-color: #333;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
`;
const StyledSviluppoSistemaHeader = styled.header`
  padding-left: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  height: 70px;
  p {
    &.title {
      color: #aac21f;
      font-family: Mulish, sans-serif;
      font-size: 23px;
      font-weight: 800;
      margin: 0;
      margin-top: 6px;
    }
    &.subtitle {
      color: #ffffff;
      font-family: Mulish, sans-serif;
      font-size: 17px;
      font-weight: 800;
      margin: 0;
    }
  }

  button {
    float: left;
    box-shadow: none;
    background-color: transparent;
    cursor: pointer;
    &:focus {
      outline: 0;
    }
    &.btn {
      height: 40px;
      width: 210px;
      border: 2px solid #ffffff;
      color: #ffffff;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 800;

      &:disabled {
        border: 2px solid #979797;
        color: #979797;
        cursor: default;
      }
    }
    &.back {
      width: 40px;
      height: 40px;
      margin-left: 10px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 20px;

      &:hover {
        background-color: #fff;
        svg g {
          stroke: #333333;
        }
      }
    }
  }
`;

const StyledSviluppoSistemaBody = styled.div`
  background-color: #ffffff;
  width: 100%;
  margin-top: 30px;
  height: calc(100% - 100px);
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
`;

const StyledSviluppoSistemaBodyContainer = styled.div`
  max-height: 90%;
  position: relative;
  padding-left: 2rem;
  left: -2rem;
  width: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  &.reduce {
    max-height: 565px;
  }
`;

const StyledSviluppoGridRow = styled.div<{ gridRow: string; gridColumn: string }>`
  grid-row: ${(props) => props.gridRow};
  grid-column: ${(props) => props.gridColumn};
  font-family: Roboto;
  color: #444444;
`;

const StyledSviluppoSistemaGrid = styled.div<{ row: "HEAD" | "BODY" }>`
  display: grid;
  grid-template-columns: [legature] 110px [combinazioni] 140px [vincitaMinMax] 290px [costo] 160px [puntata] 220px;
  grid-template-rows: ${(props) => (props.row === "HEAD" ? "[head] 60px" : "[legatura]")};
  align-items: center;
  grid-column-gap: 10px;
  grid-row-gap: ${(props) => (props.row === "BODY" ? "5px" : "0px")};
  font-family: Roboto;
  font-size: 18px;
  box-sizing: border-box;
  margin-bottom: ${(props) => (props.row === "HEAD" ? "15px" : "13px")};
  padding: ${(props) => (props.row === "HEAD" ? "10px" : "0px")};
  background-color: ${(props) => (props.row === "HEAD" ? "#f3f3f3" : "#ffffff")};
`;
