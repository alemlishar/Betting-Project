import { useContext } from "react";
import { EsitiVirtualInBigliettoContext, useAddEsitoToBiglietto } from "src/components/esito/useEsito";
import { EventoVirtualeRace, RacerVirtualeList, ScommessaVirtualeBase } from "src/components/virtual/virtual-dto";
import configuration from "src/helpers/configuration";
import { ChiaveEsitoBigliettoVirtualComponents, makeChiaveEsitoVirtual } from "src/types/chiavi";
import { css } from "styled-components/macro";

export function VirtualRaceRunnerButton({
  evento,
  scommessa,
  inCorso,
  runner,
  isEnabled,
}: {
  evento: EventoVirtualeRace;
  scommessa: ScommessaVirtualeBase;
  inCorso: boolean;
  runner: RacerVirtualeList;
  isEnabled: boolean;
}) {
  const chiaveEsitoBigliettoVirtualComponents = getChiaveEsitoBigliettoVirtualComponents({
    evento,
    scommessa,
    runner,
  });
  const addEsitoToBiglietto = useAddEsitoToBiglietto();
  const esitiVirtualInCarrello = useContext(EsitiVirtualInBigliettoContext);
  const isInCarrello = esitiVirtualInCarrello.has(makeChiaveEsitoVirtual(chiaveEsitoBigliettoVirtualComponents));
  const quota = FORMATTED_FIELD_DISCIPLINA_VIRTUAL[scommessa.id].formattedField(runner, evento.provider);

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
        pointer-events: ${inCorso || !isEnabled ? "none" : "auto"};
        cursor: ${inCorso ? "default" : "pointer"};
        :hover {
          background-color: ${inCorso ? "#ededed" : "#aac21f"};
        }
        opacity: ${inCorso ? 0.8 : !isEnabled ? 0.5 : 1};
      `}
      onClick={() => {
        addEsitoToBiglietto.esitoVirtual(chiaveEsitoBigliettoVirtualComponents);
      }}
    >
      <div
        css={css`
          color: #333333;
        `}
      >
        {inCorso ? "-" : quota}
      </div>
    </button>
  );
}

function getChiaveEsitoBigliettoVirtualComponents({
  evento,
  scommessa,
  runner,
}: {
  evento: EventoVirtualeRace;
  scommessa: ScommessaVirtualeBase;
  runner: RacerVirtualeList;
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
  const { name, id, probwin } = runner;
  const formattedQuota = FORMATTED_FIELD_DISCIPLINA_VIRTUAL[idScommessa].formattedField(runner, provider);
  return {
    dataEvento,
    descrizioneScommessa,
    descrizioneEsito: name,
    descrdisc,
    descrEvento: coursename,
    eventId,
    formattedData,
    formattedOrario,
    formattedQuota,
    idDisciplina,
    idEsito: id,
    idScommessa,
    probwin: Number(probwin),
    provider,
    quota: Number(formattedQuota) * 100,
    result,
    rtp,
    sogeicodevento,
    sogeicodpalinsesto,
    stato,
  };
}

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
