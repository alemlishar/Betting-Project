import React, { createRef, RefObject, useEffect, useMemo, useState } from "react";
import { LiveEventBox } from "src/components/common/livescore-box/LiveEventBox";
import { PrematchEventBox } from "src/components/common/prematch-date-box/PrematchEventBox";
import DettaglioSistemaAccordion from "src/components/dialog-biglietto/dialog-dettaglio-biglietto/events-central-body/dettaglio-sistema-accordion/DettaglioSistemaAccordion";
import { formattedQuota } from "src/helpers/formatUtils";
import { EventStatusMapping } from "src/mapping/event-status/event-status.class";
import { EventStatusEnum } from "src/mapping/event-status/event-status.enum";
import { TicketTypeEnum } from "src/mapping/TicketTypeMapping";
import { EventType } from "src/types/event.types";
import { TicketType } from "src/types/ticket.types";
import styled from "styled-components/macro";
import { ReactComponent as CiclismoIcon } from "src/assets/images/icon_ciclismo.svg";
import { ReactComponent as CalcioDeluxeIcon } from "src/assets/images/icon_calcio_deluxe.svg";

import { ReactComponent as CavalliDeluxeIcon } from "src/assets/images/icon_cavalli_deluxe.svg";
import { ReactComponent as CaniDeluxeIcon } from "src/assets/images/icon_cani_deluxe.svg";
import { ReactComponent as CalcioIcon } from "src/assets/images/icon_calcio.svg";
import { ReactComponent as CorsaCavalliIcon } from "src/assets/images/icon_corsa_cavalli.svg";
import { ReactComponent as CorsaCaniIcon } from "src/assets/images/icon_corsa_cani.svg";
import { ReactComponent as Football } from "src/assets/images/icon_football.svg";
import { ReactComponent as MotoCiclismoIcon } from "src/assets/images/icon_motociclismo.svg";
import { ReactComponent as FootballLeagueIcon } from "src/assets/images/icon_football_league.svg";
import { ReactComponent as TennisIcon } from "src/assets/images/icon_tennis.svg";

import { ReactComponent as AutomobilismoIcon } from "src/assets/images/icon_automobilismo.svg";
import { css } from "styled-components";
import { LivescorePlaceholder } from "src/components/common/livescore-box/LivescorePlaceholder";

export function EventsCentralBody({ dettaglioBiglietto }: { dettaglioBiglietto: TicketType }) {
  const [eventMap, setEventMap] = useState<Map<number, Array<EventType>> | null>();
  const [largestResultBoxWidth, setLargestResultBoxWidth] = useState(100);

  //CHECK IF THERE ARE MORE PREDICTIONS FOR THE SAME EVENT
  const eventsArrayWithSameId = dettaglioBiglietto.events.map((t) => {
    return `${t.eventId}_${t.scheduleId}`;
  });
  const numberOfEvents = eventsArrayWithSameId.filter((item, pos) => {
    return eventsArrayWithSameId.indexOf(item) === pos;
  }).length;

  const newEventMap = () => {
    const eventRefactor: Map<number, Array<EventType>> = new Map<number, Array<EventType>>();
    dettaglioBiglietto.events.forEach((event) => {
      let eventsWithSameId = dettaglioBiglietto.events.filter((elemToFilter) => {
        return elemToFilter.eventId === event.eventId;
      });
      eventRefactor.set(event.eventId, eventsWithSameId);
    });
    setEventMap(eventRefactor);
  };

  const refs: Array<RefObject<HTMLDivElement>> = useMemo(() => {
    if (eventMap) {
      return Array.from(eventMap.values()).map(() => createRef<HTMLDivElement>());
    } else {
      return [];
    }
  }, [eventMap]);

  useEffect(newEventMap, [dettaglioBiglietto.events]);

  const finalOutcome = (matchEvent: EventType) =>
    matchEvent.status !== EventStatusEnum.UNDEFINED.toString() &&
    matchEvent.status !== EventStatusEnum.CANCELED.toString() &&
    matchEvent.isReported &&
    matchEvent.outcomeResult !== undefined &&
    matchEvent.outcomeResult !== "" &&
    matchEvent.outcomeResult !== null
      ? matchEvent.outcomeResult
      : "-";

  useEffect(() => {
    if (refs) {
      const widths = refs.filter((v) => v && v.current && v.current.offsetWidth).map((v: any) => v.current.offsetWidth);
      const largestWidth = Math.max(...widths);
      setLargestResultBoxWidth(largestWidth > 100 ? largestWidth : 100);
    }
  }, [refs]);
  const renderEventCompetitionContainer = (matchEvent: EventType[]) => {
    return (
      <StyledDialogBodyEventCompetitionContainer>
        <StyledDialogBodyEventCompetitionDescription>
          {dettaglioBiglietto.sportCode === "SPORT" && (
            <>
              <StyledDialogBodyEventSportIco src={matchEvent[0].eventIconUrl} />
              <p>{matchEvent[0].competitionDescription}</p>
            </>
          )}
          {dettaglioBiglietto.sportCode === "VIRTUAL" && (
            <>
              <div
                css={css`
                  width: auto;
                  width: 23px;
                  margin-right: 5px;
                `}
              >
                {iconsMap[matchEvent[0].sportId]}
              </div>
              <p>
                <strong>{matchEvent[0].eventType}</strong>
                {` ${matchEvent[0].scheduleId}-${matchEvent[0].marketId}`}
              </p>
            </>
          )}
        </StyledDialogBodyEventCompetitionDescription>
        <StyledDialogBodyEventCompetitionMatch
          data-qa={`avvenimento-${matchEvent[0].scheduleId}-${matchEvent[0].eventId}`}
        >
          {matchEvent[0].isFixed && `(F) `} {matchEvent[0].eventDescription}
        </StyledDialogBodyEventCompetitionMatch>
        {matchEvent.map((singleOutcome: EventType) => renderAddedDescription(singleOutcome))}
      </StyledDialogBodyEventCompetitionContainer>
    );
  };

  const renderAddedDescription = (matchEvent: EventType) => {
    return (
      <StyledDialogBodyEventCompetitionInfoContainer key={matchEvent.eventId + matchEvent.outcomeDescription}>
        <StyledDialogBodyEventCompetitionInfoMarket>
          {matchEvent.addedInfoDescription !== undefined
            ? matchEvent.addedInfoDescription
            : matchEvent.marketDescription}
        </StyledDialogBodyEventCompetitionInfoMarket>
        <StyledDialogBodyEventCompetitionInfoRisultato
          style={{ backgroundColor: EventStatusMapping.whichColor(matchEvent.status) }}
        >
          {matchEvent.outcomeDescription}
        </StyledDialogBodyEventCompetitionInfoRisultato>
        <StyledDialogBodyEventCompetitionInfoQuota
          data-qa={`rigascomm-${matchEvent.scheduleId}-${matchEvent.eventId}-${matchEvent.marketId}-${matchEvent.addedInfo}-${matchEvent.outcomeId}`}
        >
          ({formattedQuota(matchEvent.outcomeValue)})
        </StyledDialogBodyEventCompetitionInfoQuota>
        <StyledDialogBodyEventResultContainer>
          <StyledDialogBodyEventResult
            data-qa={`esitowin-${matchEvent.scheduleId}-${matchEvent.eventId}-${matchEvent.marketId}-${matchEvent.addedInfo}-${matchEvent.outcomeId}`}
          >
            {finalOutcome(matchEvent)}
          </StyledDialogBodyEventResult>
          <StyledDialogBodyEventBox
            data-qa={`statoesito-${matchEvent.scheduleId}-${matchEvent.eventId}-${matchEvent.marketId}-${matchEvent.addedInfo}-${matchEvent.outcomeId}-${matchEvent.status}`}
            style={{ backgroundColor: EventStatusMapping.whichColor(matchEvent.status) }}
          />
        </StyledDialogBodyEventResultContainer>
      </StyledDialogBodyEventCompetitionInfoContainer>
    );
  };

  return (
    <StyledDialogBodyEventsContainer>
      {eventMap &&
        Array.from(eventMap.values()).map((matchEvent: EventType[], i) => (
          <StyledDialogBodyEvent key={matchEvent[0].eventId}>
            <StyledEventResultColumn ref={refs[i]} theme={{ largestResultBoxWidth }}>
              {matchEvent[0].livescore ? (
                <LiveEventBox eventType={matchEvent[0].eventType} livescore={matchEvent[0].livescore} />
              ) : matchEvent[0].live ? (
                <LivescorePlaceholder />
              ) : (
                <PrematchEventBox datetime={matchEvent[0].eventTimestamp} />
              )}
            </StyledEventResultColumn>
            {renderEventCompetitionContainer(matchEvent)}
          </StyledDialogBodyEvent>
        ))}
      {dettaglioBiglietto.ticketType === TicketTypeEnum.SYSTEM && (
        <DettaglioSistemaAccordion
          ticketStatus={dettaglioBiglietto.status}
          cardinalitiesDeployment={dettaglioBiglietto.cardinalitiesDeployment}
          length={numberOfEvents}
        />
      )}
    </StyledDialogBodyEventsContainer>
  );
}

const StyledDialogBodyEventsContainer = styled.div`
  border-bottom: 1px solid #eaeaea;
`;

const StyledDialogBodyEvent = styled.div`
  display: flex;
  padding-left: 30.5px;
  padding-top: 20px;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 20px;
`;

const StyledEventResultColumn = styled.div`
  display: flex;
  flex: ${(props) => `0 0 ${props.theme.largestResultBoxWidth}px`};
  flex-direction: column;
`;

const StyledDialogBodyEventCompetitionContainer = styled.div`
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const StyledDialogBodyEventSportIco = styled.img`
  width: auto;
  max-height: 28px;
  margin-right: 5px;
  img {
    height: 17px;
  }
`;

const StyledDialogBodyEventCompetitionDescription = styled.div`
  display: flex;
  color: #999999;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 14px;
  align-items: center;
  div path {
    fill: #333333 !important;
  }
  p {
    margin-top: 0;
    margin-bottom: 0;
  }
  svg {
    height: 23px;
  }
`;
const StyledDialogBodyEventCompetitionMatch = styled.div`
  color: #333333;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: bold;
  margin-top: 5px;
`;
const StyledDialogBodyEventCompetitionInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;
const StyledDialogBodyEventCompetitionInfoMarket = styled.div`
  display: flex;
  color: #000000;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 14px;
  padding-right: 15px;
  line-height: 16px;
  max-width: 300px;
`;

const StyledDialogBodyEventCompetitionInfoRisultato = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  margin-bottom: 1px;
  width: fit-content;
  padding: 0 8px;
  border-radius: 12.5px;
  color: #ffffff;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: bold;
`;
const StyledDialogBodyEventCompetitionInfoQuota = styled.div`
  color: #000000;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
`;

const StyledDialogBodyEventResultContainer = styled.div`
  display: flex;
  margin-left: auto;
  align-self: center;
  color: #000000;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 15px;
  padding-right: 30px;
`;
const StyledDialogBodyEventResult = styled.div`
  color: #000000;
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 15px;
  padding-right: 9px;
  text-align: right;
`;
const StyledDialogBodyEventBox = styled.div`
  height: 15px;
  width: 15px;
  border-radius: 100%;
  min-width: 15px;
  flex: 0 0 15px;
`;

export const iconsMap: { [key: number]: React.ReactNode } = {
  7: <CiclismoIcon />,
  9: <CalcioDeluxeIcon />,
  12: <CalcioDeluxeIcon />,
  5: <CalcioIcon />,
  2: <CorsaCaniIcon />,
  1: <CorsaCavalliIcon />,
  4: <AutomobilismoIcon />,
  58: <CavalliDeluxeIcon />,
  21: <CaniDeluxeIcon />,
  57: <Football />,
  3: <MotoCiclismoIcon />,
  6: <FootballLeagueIcon />,
  8: <TennisIcon />,
  23: <CalcioIcon />, //TODO-chiedere icona Rigori
};
