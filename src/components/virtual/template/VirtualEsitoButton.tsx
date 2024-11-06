import { useContext } from "react";
import { EsitiVirtualInBigliettoContext, useAddEsitoToBiglietto } from "src/components/esito/useEsito";
import { EsitoVirtuale, EventoVirtualeBase, ScommessaVirtualeBase } from "src/components/virtual/virtual-dto";
import { ChiaveEsitoBigliettoVirtualComponents, makeChiaveEsitoVirtual } from "src/types/chiavi";
import { css } from "styled-components/macro";

export function VirtualEsitoButton<T extends EventoVirtualeBase>({
  evento,
  scommessa,
  esito,
  inCorso,
  getDescrizioneEvento,
}: {
  evento: T;
  scommessa: ScommessaVirtualeBase;
  esito: EsitoVirtuale;
  inCorso: boolean;
  getDescrizioneEvento(event: T): string;
}) {
  const chiaveEsitoBigliettoVirtualComponents = getChiaveEsitoBigliettoVirtualComponents({
    evento,
    scommessa,
    esito,
    getDescrizioneEvento,
  });
  const addEsitoToBiglietto = useAddEsitoToBiglietto();
  const esitiVirtualInCarrello = useContext(EsitiVirtualInBigliettoContext);
  const isInCarrello = esitiVirtualInCarrello.has(makeChiaveEsitoVirtual(chiaveEsitoBigliettoVirtualComponents));
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
        {esito.descrizione}
      </div>
      <div
        css={css`
          color: #333333;
        `}
      >
        {inCorso ? "-" : Number(esito.quota) / 100}
      </div>
    </button>
  );
}

function getChiaveEsitoBigliettoVirtualComponents<T extends EventoVirtualeBase>({
  evento,
  scommessa,
  esito,
  getDescrizioneEvento,
}: {
  evento: T;
  scommessa: ScommessaVirtualeBase;
  esito: EsitoVirtuale;
  getDescrizioneEvento(event: T): string;
}): ChiaveEsitoBigliettoVirtualComponents {
  const { dataEvento, descrdisc, eventId, formattedData, formattedOrario, idDisciplina, provider } = evento;
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
    descrEvento: getDescrizioneEvento(evento),
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
