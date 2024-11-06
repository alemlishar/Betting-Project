import React from "react";
import { FormattedMessage } from "react-intl";
import { EventoVirtualeCalcioSingolo, ScommessaVirtualeBase } from "src/components/virtual/virtual-dto";
import configuration from "src/helpers/configuration";
import { css } from "styled-components/macro";
import { VirtualEsitoButton } from "./VirtualEsitoButton";

export function VirtualTemplateCalcioSingolo({
  event,
  filterScommesseBy = () => true,
}: {
  event: EventoVirtualeCalcioSingolo;
  filterScommesseBy?(scommesa: ScommessaVirtualeBase): boolean;
}) {
  const inCorso = new Date(event.dataEvento).getTime() <= new Date().getTime();
  const codiceDisciplina = `${event.provider}_${event.idDisciplina}`;
  const { underOver, doppiaChance, other } = getScommesseByGroup(
    codiceDisciplina,
    event.scommessaVirtualeBaseList.filter(filterScommesseBy),
  );

  return (
    <div
      css={css`
        overflow: hidden auto;
        height: ${configuration.CODICE_DISCIPLINA_VIRTUAL.FOOTBAL_ALL_STARS ? "683px" : "758px"};
        &::-webkit-scrollbar {
          display: none;
        }
      `}
    >
      {other.map((scommessa, index) => {
        return <ScommessaOther key={index} evento={event} scommessa={scommessa} inCorso={inCorso} />;
      })}
      {underOver.length > 0 && <ScommessaUnderOver evento={event} scommesse={underOver} inCorso={inCorso} />}
      {doppiaChance.length > 0 && <ScommessaDoppiaChance evento={event} scommesse={doppiaChance} inCorso={inCorso} />}
    </div>
  );
}

function HeaderScommessa({ children }: { children: React.ReactNode }) {
  return (
    <div
      css={css`
        background-color: #005936;
        height: 40px;
        color: white;
        padding: 0 20px;
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: 16px;
        font-family: Mulish;
      `}
    >
      {children}
    </div>
  );
}

function ScommessaOther({
  evento,
  scommessa,
  inCorso,
}: {
  evento: EventoVirtualeCalcioSingolo;
  scommessa: ScommessaVirtualeBase;
  inCorso: boolean;
}) {
  return (
    <div
      css={css`
        margin-bottom: 10px;
      `}
    >
      <HeaderScommessa>{scommessa.descrizione}</HeaderScommessa>
      <div
        css={css`
          display: flex;
          background-color: white;
        `}
      >
        <div
          css={css`
            flex-grow: 1;
          `}
        />
        <div
          css={css`
            display: grid;
            grid-template-columns: ${isScommesseRisultatoEsattoGruppi(scommessa)
              ? "repeat(5, min-content)"
              : "repeat(8, min-content)"};
            padding: 5px;
            direction: rtl;
          `}
        >
          {scommessa.esitoVirtualeList.map((esito) => {
            return (
              <div
                key={esito.id}
                css={css`
                  height: 45px;
                  width: ${isScommesseRisultatoEsattoGruppi(scommessa) ? "198px" : "120px"};
                  padding: 5px;
                `}
              >
                <VirtualEsitoButton
                  evento={evento}
                  scommessa={scommessa}
                  esito={esito}
                  inCorso={inCorso}
                  getDescrizioneEvento={getDescrizioneEvento}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScommessaUnderOver({
  evento,
  scommesse,
  inCorso,
}: {
  evento: EventoVirtualeCalcioSingolo;
  scommesse: Array<ScommessaVirtualeBase>;
  inCorso: boolean;
}) {
  return (
    <div
      css={css`
        margin-bottom: 10px;
      `}
    >
      <HeaderScommessa>
        <FormattedMessage description="virtaul calcio singolo under over header" defaultMessage="Under / Over" />
      </HeaderScommessa>
      {scommesse.map((scommessa, index, array) => {
        return (
          <div
            key={scommessa.id}
            css={css`
              background-color: white;
              display: flex;
              align-items: center;
              padding: 5px;
              border-bottom: ${index < array.length - 1 ? "1px solid #ededed" : ""};
            `}
          >
            <div
              css={css`
                flex-grow: 1;
                padding-left: 15px;
                font-family: Roboto;
                font-size: 0.9rem;
                color: #333333;
              `}
            >
              {scommessa.descrizione}
            </div>
            {scommessa.esitoVirtualeList.map((esito) => {
              return (
                <div
                  key={esito.id}
                  css={css`
                    padding: 5px;
                    height: 45px;
                    width: 100px;
                  `}
                >
                  <VirtualEsitoButton
                    evento={evento}
                    scommessa={scommessa}
                    esito={esito}
                    inCorso={inCorso}
                    getDescrizioneEvento={getDescrizioneEvento}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function ScommessaDoppiaChance({
  evento,
  scommesse,
  inCorso,
}: {
  evento: EventoVirtualeCalcioSingolo;
  scommesse: Array<ScommessaVirtualeBase>;
  inCorso: boolean;
}) {
  const esiti = scommesse
    .flatMap((scommessa) => scommessa.esitoVirtualeList.map((esito) => ({ scommessa, esito })))
    .filter(({ esito }) => ["1X", "X2", "12"].includes(esito.descrizione));
  return (
    <div
      css={css`
        margin-bottom: 10px;
      `}
    >
      <HeaderScommessa>
        <FormattedMessage description="virtaul calcio singolo doppia chance header" defaultMessage="Doppia Chance" />
      </HeaderScommessa>
      <div
        css={css`
          display: flex;
          background-color: white;
        `}
      >
        <div
          css={css`
            flex-grow: 1;
          `}
        />
        {esiti.map(({ scommessa, esito }) => {
          return (
            <div
              key={`${scommessa.id}-${esito.id}`}
              css={css`
                padding: 5px;
                height: 45px;
                width: 100px;
              `}
            >
              <VirtualEsitoButton
                evento={evento}
                scommessa={scommessa}
                esito={esito}
                inCorso={inCorso}
                getDescrizioneEvento={getDescrizioneEvento}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
const codiceDisciplina = configuration.CODICE_DISCIPLINA_VIRTUAL;
const codiceScommessa = configuration.CODICE_SCOMMESSA_VIRTUAL;

const underOverSommesseId: Record<string, Record<number, true>> = {
  [codiceDisciplina.CALCIO]: {
    [codiceScommessa.CALCIO_UNDER_OVER_1_5]: true,
    [codiceScommessa.CALCIO_UNDER_OVER_2_5]: true,
  },
  [codiceDisciplina.CALCIO_PRO]: {
    [codiceScommessa.CALCIO_PRO_UNDER_OVER_1_5]: true,
    [codiceScommessa.CALCIO_PRO_UNDER_OVER_2_5]: true,
  },
  [codiceDisciplina.CALCIO_ULTRA]: {
    [codiceScommessa.CALCIO_ULTRA_UNDER_OVER_1_5]: true,
    [codiceScommessa.CALCIO_ULTRA_UNDER_OVER_2_5]: true,
  },
  [codiceDisciplina.FOOTBAL_ALL_STARS]: {
    [codiceScommessa.FOOTBALL_UNDER_OVER_1_5]: true,
    [codiceScommessa.FOOTBALL_UNDER_OVER_2_5]: true,
    [codiceScommessa.FOOTBALL_UNDER_OVER_3_5]: true,
  },
  [codiceDisciplina.MATCH_DAY]: {
    [codiceScommessa.MATCHDAY_ULTRA_UNDER_OVER_1_5]: true,
    [codiceScommessa.MATCHDAY_ULTRA_UNDER_OVER_2_5]: true,
  },
  [codiceDisciplina.RIGORI]: {
    [codiceScommessa.RIGORE_UNDER_OVER_5_5]: true,
  },
};

function isScommessaUnderOver(codiceDisciplina: string, scommessa: ScommessaVirtualeBase) {
  return underOverSommesseId[codiceDisciplina][scommessa.id];
}

const doppiaChanceScommesseId: Record<string, Record<number, true>> = {
  [codiceDisciplina.CALCIO]: {
    [codiceScommessa.CALCIO_DOPPIA_CHANCE_IN]: true,
    [codiceScommessa.CALCIO_DOPPIA_CHANCE_OUT]: true,
    [codiceScommessa.CALCIO_DOPPIA_CHANCE_IN_OUT]: true,
  },
  [codiceDisciplina.CALCIO_PRO]: {
    [codiceScommessa.CALCIO_PRO_DOPPIA_CHANCE_IN]: true,
    [codiceScommessa.CALCIO_PRO_DOPPIA_CHANCE_OUT]: true,
    [codiceScommessa.CALCIO_PRO_DOPPIA_CHANCE_IN_OUT]: true,
  },
  [codiceDisciplina.CALCIO_ULTRA]: {
    [codiceScommessa.CALCIO_ULTRA_DOPPIA_CHANCE_IN]: true,
    [codiceScommessa.CALCIO_ULTRA_DOPPIA_CHANCE_OUT]: true,
    [codiceScommessa.CALCIO_ULTRA_DOPPIA_CHANCE_IN_OUT]: true,
  },
  [codiceDisciplina.FOOTBAL_ALL_STARS]: {
    [codiceScommessa.FOOTBALL_DOPPIA_CHANCE_IN]: true,
    [codiceScommessa.FOOTBALL_DOPPIA_CHANCE_OUT]: true,
    [codiceScommessa.FOOTBALL_DOPPIA_CHANCE_IN_OUT]: true,
  },
  [codiceDisciplina.MATCH_DAY]: {
    [codiceScommessa.MATCHDAY_ULTRA_DOPPIA_CHANCE_IN]: true,
    [codiceScommessa.MATCHDAY_ULTRA_DOPPIA_CHANCE_OUT]: true,
    [codiceScommessa.MATCHDAY_ULTRA_DOPPIA_CHANCE_IN_OUT]: true,
  },
  [codiceDisciplina.RIGORI]: {},
};

function isScommessaDoppiaChance(codiceDisciplina: string, scommessa: ScommessaVirtualeBase) {
  return doppiaChanceScommesseId[codiceDisciplina][scommessa.id];
}

function isScommessaOther(codiceDisciplina: string, scommessa: ScommessaVirtualeBase) {
  return !(isScommessaUnderOver(codiceDisciplina, scommessa) || isScommessaDoppiaChance(codiceDisciplina, scommessa));
}

function getScommesseByGroup(codiceDisciplina: string, scommesse: Array<ScommessaVirtualeBase>) {
  return {
    underOver: scommesse.filter((scommessa) => isScommessaUnderOver(codiceDisciplina, scommessa)),
    doppiaChance: scommesse.filter((scommessa) => isScommessaDoppiaChance(codiceDisciplina, scommessa)),
    other: scommesse.filter((scommessa) => isScommessaOther(codiceDisciplina, scommessa)),
  };
}

function getDescrizioneEvento(event: EventoVirtualeCalcioSingolo) {
  return `${event.playerVirtualeList[0].name}-${event.playerVirtualeList[1].name}`;
}
function isScommesseRisultatoEsattoGruppi(scommessa: ScommessaVirtualeBase) {
  const { CALCIO, CALCIO_PRO, CALCIO_ULTRA, RIGORI } = configuration.CODICE_SCOMMESSA_RISULTATO_ESATTO_GRUPPI;
  const idScommesseList = [CALCIO, CALCIO_PRO, CALCIO_ULTRA, RIGORI];
  return idScommesseList.includes(scommessa.id);
}
