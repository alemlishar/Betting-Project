import React from "react";
import useSWR from "swr";
import {
  getCampionatoEventDetailsMock,
  getSingleEventDetails as getSingleEventsDetails,
} from "src/components/virtual/virtual-api";
import {
  EventoVirtualeBase,
  EventoVirtualeCalcioSingolo,
  EventoVirtualeCalcioSingoloConCLuster,
  EventoVirtualeCampionato,
  EventoVirtualeRace,
  VirtualStateNavigation,
} from "src/components/virtual/virtual-dto";
import { VirtualTemplateAllStarLeague } from "src/components/virtual/template/VirtualTemplateAllStarLeague";
import styled, { css } from "styled-components/macro";
import configuration from "src/helpers/configuration";
import { TopEventsVirtual } from "src/components/virtual/TopEventsVirtual";
import { VirtualTemplateCalcioSingolo } from "src/components/virtual/template/VirtualTemplateCalcioSingolo";
import { VirtualTemplateFootball } from "src/components/virtual/template/VirtualTemplateFootball";
// import mockCampionato from "src/components/virtual/mock/football-all-star-league.json";
import { VirtualTemplateRace } from "src/components/virtual/template/VirtualTemplateRace";
import { VirtualTemplateBiglie } from "src/components/virtual/template/VirtualTemplateBiglie";
import { FormattedMessage } from "react-intl";

const {
  CALCIO,
  CALCIO_PRO,
  CALCIO_ULTRA,
  MATCH_DAY,
  RIGORI,
  FOOTBAL_ALL_STARS,
  FOOTBAL_ALL_STARS_LEAGUE,
  CANI,
  IPPICA,
  CICLISMO,
  AUTOMOBILISMO,
  BIGLIE,
  CANI_DELUXE,
  CAVALLI_DELUXE,
} = configuration.CODICE_DISCIPLINA_VIRTUAL;

type PalinsestoVirtualProps = {
  virtualState: VirtualStateNavigation;
  onVirtualStateChange(value: VirtualStateNavigation | undefined): void;
  activeClientIndex: number;
};

export function PalinsestoVirtual({ onVirtualStateChange, virtualState, activeClientIndex }: PalinsestoVirtualProps) {
  switch (virtualState.codiceDisciplina) {
    // calcio singolo
    case CALCIO:
    case CALCIO_PRO:
    case CALCIO_ULTRA:
    case RIGORI: {
      return (
        <CalcioSingolo
          virtualState={virtualState}
          onVirtualStateChange={onVirtualStateChange}
          activeClientIndex={activeClientIndex}
        />
      );
    }
    // calcio singolo con cluster
    case FOOTBAL_ALL_STARS: {
      return (
        <CalcioSingoloConCluster
          virtualState={virtualState}
          onVirtualStateChange={onVirtualStateChange}
          activeClientIndex={activeClientIndex}
        />
      );
    }
    // calcio campionato
    case FOOTBAL_ALL_STARS_LEAGUE:
    case MATCH_DAY: {
      return (
        <CalcioCampionato
          virtualState={virtualState}
          onVirtualStateChange={onVirtualStateChange}
          activeClientIndex={activeClientIndex}
        />
      );
    }
    // race
    case CANI:
    case IPPICA:
    case CICLISMO:
    case AUTOMOBILISMO:
    case CANI_DELUXE:
    case CAVALLI_DELUXE: {
      return (
        <Race
          virtualState={virtualState}
          onVirtualStateChange={onVirtualStateChange}
          activeClientIndex={activeClientIndex}
        />
      );
    }
    // biglie
    case BIGLIE: {
      return (
        <Biglie
          virtualState={virtualState}
          onVirtualStateChange={onVirtualStateChange}
          activeClientIndex={activeClientIndex}
        />
      );
    }
    default:
      return null;
  }
}

function Dettaglio({ children: [top, template] }: { children: [React.ReactNode, React.ReactNode] }) {
  return (
    <StyledDettaglioVirtual>
      <div
        css={css`
          padding-bottom: 10px;
          grid-row: listEvents;
        `}
      >
        {top}
      </div>
      <StyleContentDettaglioVirtual>{template}</StyleContentDettaglioVirtual>
    </StyledDettaglioVirtual>
  );
}

const StyledDettaglioVirtual = styled.div`
  display: grid;
  grid-template-rows: [listEvents] 150px [detail] auto;
  position: relative;
  height: 900px;
  overflow: hidden;
`;
const StyleContentDettaglioVirtual = styled.div`
  grid-row: detail;
  overflow: hidden;
`;

function useSingleEvents<T>({
  sogeicodPalinsesto,
  sogeicodevento,
}: {
  sogeicodevento: string;
  sogeicodPalinsesto: string;
}) {
  const { data } = useSWR(["detail_event_single_virtual", sogeicodPalinsesto, sogeicodevento], getSingleEventsDetails, {
    dedupingInterval: 60 * 1000,
  });
  return data as Array<T> | undefined;
}
function useCampionatoEvents<T>({
  sogeicodPalinsesto,
  sogeicodevento,
}: {
  sogeicodevento: string;
  sogeicodPalinsesto: string;
}) {
  const { data } = useSWR(["detail_event_campionato_virtual"], getCampionatoEventDetailsMock, {
    dedupingInterval: 60 * 1000,
  });
  return data as Array<T> | undefined;
}

const makeOnSelect = ({
  onVirtualStateChange,
  events,
}: {
  onVirtualStateChange: (value: VirtualStateNavigation) => void;
  events: Array<EventoVirtualeBase> | undefined;
}) => (event: EventoVirtualeBase) => {
  if (events) {
    const { eventId, idDisciplina, provider } = event;
    onVirtualStateChange({
      eventId,
      codiceDisciplina: `${provider}_${idDisciplina}`,
      sogeicodPalinsesto: events[0].sogeicodpalinsesto,
      sogeicodevento: events[0].sogeicodevento,
    });
  }
};

function CalcioSingolo({ virtualState, onVirtualStateChange }: PalinsestoVirtualProps) {
  const events = useSingleEvents<EventoVirtualeCalcioSingolo>(virtualState);
  const event = events?.find((e) => e.eventId === virtualState.eventId);
  if (!events || !event) {
    return null;
  }
  return (
    <Dettaglio>
      <TopEventsVirtual
        onSelect={makeOnSelect({ onVirtualStateChange, events })}
        selectedEventId={virtualState.eventId}
        options={events.map((event) => {
          return {
            title: event.descrdisc,
            heading: `${event.playerVirtualeList[0].name}-${event.playerVirtualeList[1].name}`,
            event,
          };
        })}
      />
      <VirtualTemplateCalcioSingolo event={event} />
    </Dettaglio>
  );
}

function CalcioSingoloConCluster({ virtualState, onVirtualStateChange }: PalinsestoVirtualProps) {
  const events = useSingleEvents<EventoVirtualeCalcioSingoloConCLuster>(virtualState);
  const event = events?.find((e) => e.eventId === virtualState.eventId);
  if (!events || !event) {
    return null;
  }
  return (
    <Dettaglio>
      <TopEventsVirtual
        onSelect={makeOnSelect({ onVirtualStateChange, events })}
        selectedEventId={virtualState.eventId}
        options={events.map((event) => {
          return {
            title: event.descrdisc,
            heading: `${event.playerVirtualeList[0].name}-${event.playerVirtualeList[1].name}`,
            event,
          };
        })}
      />
      <VirtualTemplateFootball event={event} />
    </Dettaglio>
  );
}

function CalcioCampionato({ virtualState, onVirtualStateChange }: PalinsestoVirtualProps) {
  const data = useCampionatoEvents<EventoVirtualeCampionato>(virtualState);
  if (!data) {
    return null;
  }
  const events: Array<EventoVirtualeCampionato> = data.map((evento) => ({
    ...evento,
    dataEvento: new Date(new Date().getTime() + 60 * 60 * 1000).toJSON(),
  })) as any; //TODO: REMOVE MOCK
  const event = events[0]; //TODO: REMOVE MOCK
  if (!events || !event) {
    return null;
  }
  return (
    <Dettaglio>
      <TopEventsVirtual
        onSelect={makeOnSelect({ onVirtualStateChange, events })}
        //selectedEventId={virtualState.eventId}
        selectedEventId={event.eventId} //TODO: REMOVE MOCK
        options={events.map((event) => {
          return {
            title: event.descrdisc + " MOCK", // footablll all stars league
            heading: (
              <FormattedMessage
                description="CalcioCampionato: title description type campionato"
                defaultMessage="Giornata {giornata}"
                values={{ giornata: event.giornata }}
              />
            ),
            event,
          };
        })}
      />
      <VirtualTemplateAllStarLeague event={event} />
    </Dettaglio>
  );
}

function Race({ virtualState, onVirtualStateChange, activeClientIndex }: PalinsestoVirtualProps) {
  const events = useSingleEvents<EventoVirtualeRace>(virtualState);
  const event = events?.find((e) => e.eventId === virtualState.eventId);
  if (!events || !event) {
    return null;
  }

  return (
    <Dettaglio>
      <TopEventsVirtual
        onSelect={makeOnSelect({ onVirtualStateChange, events })}
        selectedEventId={virtualState.eventId}
        options={events.map((event) => {
          return {
            title: event.descrdisc,
            heading: event.coursename,
            event,
          };
        })}
      />
      <VirtualTemplateRace event={event} activeClientIndex={activeClientIndex} />
    </Dettaglio>
  );
}

function Biglie({ virtualState, onVirtualStateChange, activeClientIndex }: PalinsestoVirtualProps) {
  const events = useSingleEvents<EventoVirtualeRace>(virtualState);
  const event = events?.find((e) => e.eventId === virtualState.eventId);
  if (!events || !event) {
    return null;
  }
  return (
    <Dettaglio>
      <TopEventsVirtual
        onSelect={makeOnSelect({ onVirtualStateChange, events })}
        selectedEventId={virtualState.eventId}
        options={events.map((event) => {
          return {
            title: event.descrdisc,
            heading: event.coursename,
            event,
          };
        })}
      />
      <VirtualTemplateBiglie event={event} activeClientIndex={activeClientIndex} />
    </Dettaglio>
  );
}
