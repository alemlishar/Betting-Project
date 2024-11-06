import React, { useMemo } from "react";
import styled, { css } from "styled-components/macro";
import {
  Ticket,
  TicketResult,
  SviluppoSistema as SviluppoSistemaType,
} from "src/components/prenotazioni/prenotazioni-api";
import { ReactComponent as IconTrashGrey } from "src/assets/images/icon-trash-grey.svg";
import { formatCents } from "src/helpers/MoneyFormatterUtility";
import { ReactComponent as IconDanger } from "src/assets/images/icon-danger.svg";
import { getNotAvailableOutcomesStatus } from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { getTicketType } from "src/components/prenotazioni/MenuPrenotazioni";
import { orderBy } from "lodash";
import { ChiaveAvvenimento, makeChiaveAvvenimento } from "src/types/chiavi";
import { SviluppoSistema } from "src/components/dialog-prenotazione/SviluppoSistema";
import { FormattedMessage } from "react-intl";
import { PrematchEventBox } from "../common/prematch-date-box/PrematchEventBox";
import { LiveEventBox } from "src/components/common/livescore-box/LiveEventBox";
import { getCurrentTypeFromSportId } from "src/components/live/livescore/utilsLivescore";
import configuration from "src/helpers/configuration";

type DialogPrenotazioneBodyProps = {
  ticket: Ticket;
  sviluppoSistema?: SviluppoSistemaType;
  deleteEsitoFromTicket(codiceEsitoToDelete: string): void;
};

export function DialogPrenotazioneBody({
  ticket,
  sviluppoSistema,
  deleteEsitoFromTicket,
}: DialogPrenotazioneBodyProps) {
  const getMessage = (status?: string) => {
    switch (status) {
      case configuration.NOT_AVAILABLE_OUTCOMES_STATUS.SOME:
        return "Alcuni esiti non sono più in palinsesto";
      case configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL:
        return "Gli esiti non sono più in palinsesto";
      case configuration.NOT_AVAILABLE_OUTCOMES_STATUS.NOTANY:
        return "";
      default:
        return "";
    }
  };

  const notAvailableOutcomesStatus = getNotAvailableOutcomesStatus(ticket);
  const notAvailableMessage = getMessage(notAvailableOutcomesStatus);

  const filteredOutcomeList = ticket.results.filter(
    (outcome: TicketResult) => !(outcome.stato === 0 && !outcome.quota),
  );

  const ticketResultUniqueMap = useMemo(() => {
    return getTicketResultUniqueMap(filteredOutcomeList);
  }, [filteredOutcomeList]);

  const ticketResultUniqueMapLength = Object.keys(ticketResultUniqueMap).length;
  const ticketType = getTicketType(ticket);

  return (
    <div
      css={css`
        max-height: 556px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 0;
        }
      `}
    >
      <StyledDialogPrenotazioneBody>
        {(notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.SOME ||
          notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.ALL) && (
          <div
            css={css`
              height: 70px;
              border-radius: 8px;
              background-color: #ffb800;
              padding: 10px;
              box-sizing: border-box;
              display: grid;
              grid-template-columns: [icon-alert] 50px [message] auto;
              grid-column-gap: 5px;
              align-items: center;
              margin-bottom: 17px;
            `}
          >
            <IconDanger
              css={css`
                height: 27px;
                width: auto;
                grid-column: icon-alert;
                margin: 0 0 0 10px;
              `}
            />
            <div
              css={css`
                grid-column: message;
                color: #222222;
                font-family: Roboto;
                font-size: 1.125rem;
                font-weight: 500;
                letter-spacing: 0;
                line-height: 16px;
              `}
            >
              {ticketType === "Sistema" &&
              notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.SOME ? (
                <FormattedMessage
                  description="Label alert esiti non in palinsesto sistema modulo gestione prenotazione"
                  defaultMessage="Alcuni esiti non sono più in palinsesto. Per giocare il sistema riportalo nel carrello"
                />
              ) : (
                <FormattedMessage
                  description="Label alert esiti non in palinsesto modulo gestione prenotazione"
                  defaultMessage="{textmessage}"
                  values={{ textmessage: notAvailableMessage }}
                />
              )}
            </div>
          </div>
        )}

        <div
          css={css`
            display: grid;
            grid-template-columns: [time] minmax(100px, max-content) [description] auto;
            grid-template-rows: repeat(${ticketResultUniqueMapLength}, [bet] min-content [separator] 1px);
            align-items: end;
            grid-column-gap: 20px;
            grid-row-gap: 20px;
          `}
        >
          {ticket &&
            Object.keys(ticketResultUniqueMap).map((codiceAvvenimento, betIndex) => {
              const esiti = ticketResultUniqueMap[codiceAvvenimento];
              const firstEsito = esiti[0];
              const livescoreType = (() => {
                const { isSetBased, isCountdownPeriodBased } = getCurrentTypeFromSportId(firstEsito.codiceDisciplina);
                if (isSetBased) {
                  return "Tennis";
                }
                if (isCountdownPeriodBased) {
                  return "Hockey";
                }
                return "Calcio";
              })();
              return (
                <React.Fragment key={firstEsito.index ?? 0}>
                  {esiti.length > 0 && firstEsito && (
                    <>
                      <div
                        style={{
                          gridColumn: `time / description`,
                          gridRow: `bet ${betIndex + 1} / separator ${betIndex + 1}`,
                        }}
                        css={css`
                          width: fit-content;
                          min-width: 100px;
                          height: 60px;
                          align-self: flex-start;
                        `}
                      >
                        {firstEsito.livescore ? (
                          <LiveEventBox eventType={livescoreType} livescore={firstEsito.livescore} />
                        ) : (
                          <PrematchEventBox datetime={firstEsito.dataAvvenimento} />
                        )}
                      </div>
                      <div
                        style={{
                          gridColumn: `description`,
                          gridRow: `bet ${betIndex + 1} / separator ${betIndex + 1}`,
                        }}
                        css={css`
                          display: grid;
                          grid-template-rows: [manifestazione] 20px [evento] 20px [info-aggiuntiva] minmax(25px, auto);
                        `}
                      >
                        <div
                          style={{ gridRow: `manifestazione` }}
                          css={css`
                            color: #999999;
                            font-family: Roboto;
                            font-size: 0.875rem;
                            display: flex;
                            align-items: center;
                          `}
                        >
                          <div
                            css={css`
                              height: 17px;
                              width: 17px;
                              margin-right: 8px;
                              box-sizing: border-box;
                            `}
                          >
                            <img
                              css={css`
                                margin: -4px;
                              `}
                              alt={firstEsito.siglaDisciplina}
                              src={firstEsito.iconaDisciplina}
                            />
                          </div>
                          <span>{firstEsito.descrizioneManifestazione}</span>
                        </div>
                        <div
                          style={{ gridRow: `evento` }}
                          css={css`
                            color: #333333;
                            font-family: Roboto;
                            font-size: 1rem;
                            font-weight: bold;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                          `}
                        >
                          {ticketType === "Sistema" && firstEsito.fissa && (
                            <span
                              css={css`
                                letter-spacing: 0;
                                line-height: 19px;
                                margin-right: 5px;
                              `}
                            >
                              {`(F)`}
                            </span>
                          )}
                          {firstEsito.descrizioneAvvenimento}
                        </div>
                        <div
                          style={{
                            gridRow: `info-aggiuntiva`,
                          }}
                          css={css`
                            display: grid;
                            grid-template-columns: [descrizione] minmax(auto, max-content) [esito] min-content [quota] auto ${esiti.length >
                                1 || ticketResultUniqueMapLength > 1
                                ? "[trash] min-content"
                                : ""};
                            grid-template-rows: repeat(${esiti.length}, [scommessa] min-content);
                            grid-column-gap: 20px;
                            grid-row-gap: 14px;
                            align-self: flex-end;
                            color: #000000;
                            font-family: Roboto;
                            font-size: 0.875rem;
                            font-weight: 300;
                            margin-top: 5px;
                            align-items: center;
                          `}
                        >
                          {esiti.map((esito, esitoIndex) => {
                            return (
                              <React.Fragment key={esito.pronosticoKey}>
                                <div
                                  style={{
                                    gridRow: `scommessa ${esitoIndex + 1}`,
                                    gridColumn: `descrizione`,
                                  }}
                                  css={css`
                                    max-width: 300px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                    grid-column: descrizione;
                                  `}
                                >
                                  {esito.descrizioneInfoAggiuntiva
                                    ? esito.descrizioneInfoAggiuntiva
                                    : esito.descrizioneScommessa}
                                </div>
                                <div
                                  style={{ gridRow: `scommessa ${esitoIndex + 1}`, gridColumn: `esito` }}
                                  css={css`
                                    box-sizing: border-box;
                                    border: 1px solid #dcdcdc;
                                    border-radius: 25px;
                                    color: #222222;
                                    font-family: Roboto;
                                    font-size: 1rem;
                                    font-weight: 500;
                                    padding: 2px 16px;
                                    width: min-content;
                                    max-width: 300px;
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                  `}
                                >
                                  {esito.descrizioneEsito}
                                </div>
                                <div
                                  style={{ gridRow: `scommessa ${esitoIndex + 1}`, gridColumn: `quota` }}
                                  css={css`
                                    text-align: right;
                                    font-size: 18px;
                                    color: #000000;
                                    font-weight: bold;
                                    justify-self: flex-end;
                                  `}
                                >
                                  {(() => {
                                    if (esito.stato === 0) {
                                      return (
                                        <div>
                                          {" "}
                                          <div
                                            css={css`
                                              border-radius: 5px;
                                              padding: 3px 5px;
                                              background-color: #f0f0f0;
                                              display: inline-flex;
                                              font-weight: normal;
                                              margin-right: 20px;
                                              font-size: 12px;
                                              letter-spacing: 0;
                                              line-height: 14px;
                                            `}
                                          >
                                            <FormattedMessage
                                              description="esito chiuso dialog prenotazione body"
                                              defaultMessage="Esito Chiuso"
                                            />
                                          </div>
                                          <span
                                            css={css`
                                              opacity: 0.5;
                                              color: #333333;
                                            `}
                                          >
                                            -
                                          </span>
                                        </div>
                                      );
                                    }

                                    if (esito.quotaVariata) {
                                      const decreasedQuota = esito.quota < esito.quotaOld;
                                      const increasedQuota = esito.quota > esito.quotaOld;
                                      const isEsitoSospeso = esito.stato === 2;
                                      const quotaColor = isEsitoSospeso
                                        ? "#333333"
                                        : increasedQuota
                                        ? "#3B914C"
                                        : "#EB1E23";
                                      return (
                                        <div
                                          css={css`
                                            display: inline-flex;
                                          `}
                                        >
                                          {isEsitoSospeso && (
                                            <div
                                              css={css`
                                                border-radius: 5px;
                                                padding: 3px 5px;
                                                background-color: #f0f0f0;
                                                display: inline-flex;
                                                font-weight: normal;
                                                margin-right: 20px;
                                                font-size: 12px;
                                                letter-spacing: 0;
                                                line-height: 14px;
                                              `}
                                            >
                                              <FormattedMessage
                                                description="esito Sospeso dialog prenotazione body"
                                                defaultMessage="Esito Sospeso"
                                              />
                                            </div>
                                          )}
                                          <div
                                            css={css`
                                              font-family: Roboto;
                                              font-size: 1rem;
                                              color: ${quotaColor};
                                              display: flex;
                                              align-items: baseline;
                                              font-weight: normal;
                                            `}
                                          >
                                            {`da ${formatCents(esito.quotaOld, 2)} a `}
                                            <span
                                              css={css`
                                                font-weight: bold;
                                                font-size: 18px;
                                                margin-left: 5px;
                                              `}
                                            >
                                              {formatCents(esito.quota, 2)}
                                            </span>
                                            {increasedQuota && (
                                              <span
                                                css={css`
                                                  width: 0;
                                                  height: 0;
                                                  margin-left: 5px;
                                                  border-style: solid;
                                                  border-width: 0 9px 9px 0;
                                                  border-color: transparent ${quotaColor} transparent transparent;
                                                `}
                                              />
                                            )}
                                            {decreasedQuota && (
                                              <span
                                                css={css`
                                                  width: 0;
                                                  height: 0;
                                                  margin-left: 5px;
                                                  border-style: solid;
                                                  border-width: 0 0 9px 9px;
                                                  border-color: transparent transparent ${quotaColor} transparent;
                                                `}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      );
                                    }
                                    if (esito.stato === 2) {
                                      return (
                                        <div>
                                          {" "}
                                          <div
                                            css={css`
                                              border-radius: 5px;
                                              padding: 3px 5px;
                                              background-color: #f0f0f0;
                                              display: inline-flex;
                                              font-weight: normal;
                                              margin-right: 20px;
                                              font-size: 12px;
                                              letter-spacing: 0;
                                              line-height: 14px;
                                            `}
                                          >
                                            <FormattedMessage
                                              description="esito Sospeso dialog prenotazione body"
                                              defaultMessage="Esito Sospeso"
                                            />
                                          </div>
                                          <span
                                            css={css`
                                              opacity: 0.5;
                                              color: #333333;
                                            `}
                                          >
                                            {formatCents(esito.quota, 2)}
                                          </span>
                                        </div>
                                      );
                                    }

                                    return <>{formatCents(esito.quota, 2)}</>;
                                  })()}
                                </div>
                                {ticketType === "Multipla" && filteredOutcomeList.length > 1 && (
                                  <div
                                    style={{ gridRow: `scommessa ${esitoIndex + 1}`, gridColumn: `trash` }}
                                    css={css`
                                      cursor: pointer;
                                      #iconTrashGrey {
                                        &:hover {
                                          fill: #aac21f;
                                        }
                                      }
                                    `}
                                    onClick={() =>
                                      deleteEsitoFromTicket(
                                        `${esito.codicePalinsesto}-${esito.codiceAvvenimento}-${esito.codiceScommessa}-${esito.codiceInfoAggiuntiva}-${esito.codiceEsito}`,
                                      )
                                    }
                                  >
                                    <IconTrashGrey />
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                      <div
                        hidden={
                          ticketType !== "Sistema" &&
                          (betIndex + 1 === ticketResultUniqueMapLength || ticketResultUniqueMapLength === 1)
                        }
                        style={{ gridRow: `separator ${betIndex + 1}` }}
                        css={css`
                          grid-column: 1 / -1;
                          height: 1px;
                          background-color: #dcdcdc;
                          margin: 0 -30px;
                        `}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}
        </div>
        {ticketType === "Sistema" &&
          (notAvailableOutcomesStatus === configuration.NOT_AVAILABLE_OUTCOMES_STATUS.NOTANY && sviluppoSistema ? (
            <SviluppoSistema sviluppoSistema={sviluppoSistema} />
          ) : (
            <div>
              <div
                css={css`
                  color: #000000;
                  font-family: Roboto;
                  font-size: 20px;
                  font-weight: bold;
                  margin: 30px 0 25px;
                `}
              >
                <FormattedMessage
                  description="dettaglio sistema dialog prenotazione body"
                  defaultMessage="Dettaglio sistema"
                />
              </div>
              <div
                css={css`
                  background-color: lightgray;
                  border-radius: 8px;
                  padding: 1em 2em;
                  font-style: italic;
                `}
              >
                <FormattedMessage
                  description="dati non disponibili dialog prenotazione body"
                  defaultMessage="Dati non disponibili"
                />
              </div>
            </div>
          ))}
      </StyledDialogPrenotazioneBody>
    </div>
  );
}

export function getTicketResultUniqueMap(filteredOutcomeList: Array<TicketResult>) {
  let ticketMap: Record<ChiaveAvvenimento, Array<TicketResult>> = {};

  filteredOutcomeList.forEach((ticketResult) => {
    if (!ticketMap[makeChiaveAvvenimento(ticketResult)]) {
      ticketMap = { ...ticketMap, [makeChiaveAvvenimento(ticketResult)]: [] };
    }
    ticketMap[makeChiaveAvvenimento(ticketResult)].push(ticketResult);
  });
  Object.keys(ticketMap).forEach((chiaveAvvenimento) => {
    ticketMap[chiaveAvvenimento] = orderBy(ticketMap[chiaveAvvenimento], (item) => item.codiceEsito);
  });
  return ticketMap;
}

const StyledDialogPrenotazioneBody = styled.div`
  background-color: white;
  padding: 30px;
`;
