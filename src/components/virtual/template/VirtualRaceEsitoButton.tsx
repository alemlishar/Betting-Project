import { useContext } from "react";
import { EsitiVirtualInBigliettoContext, useAddEsitoToBiglietto } from "src/components/esito/useEsito";
import {
  EsitoVirtuale,
  EventoVirtualeRace,
  RacerVirtualeList,
  ScommessaVirtualeBase,
} from "src/components/virtual/virtual-dto";
import configuration from "src/helpers/configuration";
import { ChiaveEsitoBigliettoVirtualComponents, makeChiaveEsitoVirtual } from "src/types/chiavi";
import { css } from "styled-components/macro";

export function VirtualRaceEsitoButton({
  evento,
  scommessa,
  inCorso,
  esito,
}: {
  evento: EventoVirtualeRace;
  scommessa: ScommessaVirtualeBase;
  inCorso: boolean;
  esito: EsitoVirtuale;
}) {
  const chiaveEsitoBigliettoVirtualComponents = getChiaveEsitoBigliettoVirtualComponents({
    evento,
    scommessa,
    esito,
  });
  const addEsitoToBiglietto = useAddEsitoToBiglietto();
  const esitiVirtualInCarrello = useContext(EsitiVirtualInBigliettoContext);
  const isInCarrello = esitiVirtualInCarrello.has(makeChiaveEsitoVirtual(chiaveEsitoBigliettoVirtualComponents));
  const descrizione = getRunnerGroupsFromGroupDescription(esito.descrizione);
  return (
    <button
      css={css`
        width: 100%;
        height: 100%;
        background-color: ${isInCarrello ? "#aac21f" : "#ededed"};
        border: none;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: Roboto;
        font-size: 1rem;
        outline: none;
        pointer-events: ${inCorso ? "none" : "auto"};
        cursor: ${inCorso ? "default" : "pointer"};
        :hover {
          background-color: ${inCorso ? "#ededed" : "#aac21f"};
        }
        opacity: ${inCorso ? 0.8 : 1};
      `}
      onClick={() => {
        addEsitoToBiglietto.esitoVirtual(chiaveEsitoBigliettoVirtualComponents);
      }}
    >
      <div
        css={css`
          color: #005936;
          font-weight: 700;
        `}
      >
        {descrizione.length > 1
          ? descrizione.map((value, index) => (
              <div
                css={css`
                  display: flex;

                  padding: 5px 0 0 0;
                `}
              >
                <div
                  css={css`
                    color: #333333;
                    padding-right: 5px;
                  `}
                >
                  {index + 1}°
                </div>
                <div>{value}</div>
              </div>
            ))
          : descrizione[0]}
      </div>

      <div
        css={css`
          color: #333333;
        `}
      >
        {inCorso ? "-" : esito.formattedQuota}
      </div>
    </button>
  );
}

function getChiaveEsitoBigliettoVirtualComponents({
  evento,
  scommessa,
  esito,
}: {
  evento: EventoVirtualeRace;
  scommessa: ScommessaVirtualeBase;
  esito: EsitoVirtuale;
}): ChiaveEsitoBigliettoVirtualComponents {
  const { dataEvento, descrdisc, eventId, formattedData, coursename, formattedOrario, idDisciplina, provider } = evento;
  const {
    descrizione: descrizioneScommessa,
    id: idScommessa,
    rtp,
    stato,
    sogeicodpalinsesto,
    sogeicodevento,
    result,
  } = scommessa;

  const { quota, descrizione: descrizioneEsito, formattedQuota, id: idEsito, probwin } = esito;
  return {
    dataEvento,
    descrizioneScommessa,
    descrizioneEsito,
    descrdisc,
    descrEvento: coursename,
    eventId,
    formattedData,
    formattedOrario,
    formattedQuota,
    idDisciplina,
    idEsito,
    idScommessa,
    probwin,
    provider,
    quota,
    result,
    rtp,
    sogeicodevento,
    sogeicodpalinsesto,
    stato,
  };
}

const RUNNER_REGEXP = /\(((\d+-?)+)\)/gi;
const getRunnerGroupsFromGroupDescription = (groupDescription: string) => {
  const matches = Array.from(groupDescription.matchAll(RUNNER_REGEXP));
  return matches.map(([, runnerIdsString]) => runnerIdsString);
};

const {
  VINCENTE,
  PIAZZATO_2,
  PIAZZATO_3,
  PIAZZATO_4,
  BIGLIE_VINCENTE,
  BIGLIE_PIAZZATO_2,
  BIGLIE_PIAZZATO_3,
} = configuration.CODICE_SCOMMESSA_VIRTUAL_RACE;

const FORMATTED_FIELD_DISCIPLINA_VIRTUAL = {
  [VINCENTE]: { formattedField: ({ formattedPrice }: RacerVirtualeList, provider: number) => formattedPrice },
  [PIAZZATO_2]: { formattedField: ({ formattedPlace }: RacerVirtualeList, provider: number) => formattedPlace },

  [PIAZZATO_3]: {
    formattedField: ({ formattedPlace, show, place }: RacerVirtualeList, provider: number) =>
      provider === 31 ? formattedPlace : ((parseInt(show, 10) > 0 ? parseInt(show) : parseInt(place)) / 100).toFixed(2),
  },
  [PIAZZATO_4]: {
    formattedField: ({ show, place }: RacerVirtualeList, provider: number) =>
      ((parseInt(show, 10) > 0 ? parseInt(show) : parseInt(place)) / 100).toFixed(2),
  },
  [BIGLIE_VINCENTE]: { formattedField: ({ formattedPrice }: RacerVirtualeList, provider: number) => formattedPrice },
  [BIGLIE_PIAZZATO_2]: {
    formattedField: ({ formattedPlace }: RacerVirtualeList, provider: number) => formattedPlace,
  },
  [BIGLIE_PIAZZATO_3]: {
    formattedField: ({ show, place }: RacerVirtualeList, provider: number) =>
      ((parseInt(show, 10) > 0 ? parseInt(show) : parseInt(place)) / 100).toFixed(2),
  },
};
