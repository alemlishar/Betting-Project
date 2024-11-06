import React from "react";
import { css } from "styled-components/macro";
import { AlberaturaLive } from "src/components/live/live-api";
import { Avvenimento, Disciplina, Manifestazione } from "src/components/prematch/prematch-api";
import {
  CodiceDisciplina,
  ChiaveManifestazione,
  makeChiaveManifestazione,
  makeChiaveAvvenimento,
} from "src/types/chiavi";
import { setFallbackImageSrc } from "src/components/prematch/templates/utils";
import { orderBy } from "lodash";
import { LiveState } from "src/components/live/useLive";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

type MenuLiveProps = {
  state: LiveState;
  alberatura: AlberaturaLive | undefined;
};
export function MenuLive({ state, alberatura }: MenuLiveProps) {
  const maps = alberatura ? makeAlberaturaMaps(alberatura) : emptyAlberaturaMaps;
  const {
    closeAllToggleDisciplinaMenuLive,
    openSchedaDisciplinaLive,
    toggleDisciplinaMenuLive,
  } = useNavigazioneActions();
  const {
    disciplinaList,
    manifestazioneListByDisciplina,
    avvenimentoListByManifestazione,
    numeroAvvenimentiByDisciplina,
  } = maps;
  const { codiceDisciplinaOpen, chiaviManifestazioneOpen } = state;
  const disciplinaSortedList = orderBy(disciplinaList, [
    (disciplina) => disciplina.posizione,
    (disciplina) => disciplina.descrizione,
  ]);
  const { openSchedaAvvenimentoLive } = useNavigazioneActions();
  return (
    <div
      css={css`
        background-color: white;
        border-top-right-radius: 4px;
        height: fit-content;
        width: 300px;
        max-height: calc(100vh - 160px);
      `}
    >
      <div
        onClick={() => {
          closeAllToggleDisciplinaMenuLive();
        }}
        css={css`
          box-sizing: border-box;
          height: 50px;
          border-radius: 0 4px 0 0;
          background-color: #333333;
          display: flex;
          align-items: center;
          padding-left: 60px;
          padding-right: 10px;
          color: #ffffff;
          font-family: Mulish;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0;
          line-height: 18px;
        `}
      >
        Live Ora
        <div
          css={css`
            box-sizing: border-box;
            height: 22px;
            border: 2px solid #ffb800;
            border-radius: 10px;
            color: #ffffff;
            font-family: Roboto;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 0;
            line-height: 16px;
            text-align: center;
            margin-left: auto;
            padding: 2px 6px;
            min-width: 42px;
          `}
        >
          {alberatura ? Object.keys(alberatura.avvenimentoFeMap).length : 0}
        </div>
      </div>
      <div
        css={css`
          max-height: calc(100vh - 210px);
          overflow: auto;

          ::-webkit-scrollbar {
            width: 0 !important;
          }
        `}
      >
        {disciplinaSortedList.map((disciplina) => {
          const manifestazioneList = manifestazioneListByDisciplina[disciplina.codiceDisciplina];
          const numeroAvvenimenti = numeroAvvenimentiByDisciplina[disciplina.codiceDisciplina];
          const isSelectedDisciplina =
            state.selected.type === "disciplina" &&
            state.selected.disciplina.codiceDisciplina === disciplina.codiceDisciplina;
          const isDisciplinaOpen = codiceDisciplinaOpen === disciplina.codiceDisciplina;
          return (
            <React.Fragment key={disciplina.codiceDisciplina}>
              <div
                css={css`
                  background-color: #ffffff;
                  padding: 12px 10px 12px 20px;
                  display: flex;
                  position: relative;
                  cursor: pointer;
                  border: ${isSelectedDisciplina ? "2px solid #aac21f" : "none"};
                  border-bottom: ${isSelectedDisciplina ? "2px solid #aac21f" : "1px solid #dcdcdc"};
                  box-shadow: "none";
                  &:hover {
                    background-color: #f4f4f4;
                  }
                  align-items: center;
                `}
                onClick={() => {
                  const firstManifestazioneByDisciplina = manifestazioneList[0];
                  openSchedaDisciplinaLive({
                    disciplina,
                    isSelectedDisciplina,
                    isDisciplinaOpen,
                    manifestazione: firstManifestazioneByDisciplina,
                  });
                }}
                data-qa={`sport_live_${disciplina.codiceDisciplina}`}
              >
                <div
                  css={css`
                    width: 25px;
                    height: 25px;
                    box-sizing: border-box;
                    border-radius: 20px;
                    border: 3px solid #005936;
                  `}
                ></div>
                <div
                  css={css`
                    color: #333333;
                    font-family: Mulish;
                    font-size: 1.125rem;
                    font-weight: 800;
                    letter-spacing: 0;
                    line-height: 18px;
                    margin-left: 18px;
                    text-transform: capitalize;
                  `}
                >
                  {disciplina.descrizione}
                </div>
                <div
                  css={css`
                    box-sizing: border-box;
                    background-color: #ffb800;
                    height: 22px;
                    border: 2px solid #ffb800;
                    border-radius: 10px;
                    color: #333333;
                    font-family: Roboto;
                    font-size: 14px;
                    font-weight: bold;
                    letter-spacing: 0;
                    line-height: 16px;
                    text-align: center;
                    margin-left: auto;
                    padding: 2px 6px;
                    min-width: 42px;
                  `}
                >
                  {numeroAvvenimenti}
                </div>
              </div>
              {isDisciplinaOpen &&
                manifestazioneList.map((manifestazione) => {
                  const chiaveManifestazione = makeChiaveManifestazione(manifestazione);
                  const avvenimentoList = orderBy(avvenimentoListByManifestazione[chiaveManifestazione], [
                    (avvenimento) => new Date(avvenimento.data),
                    (avvenimento) => avvenimento.descrizione,
                  ]);
                  const isManifestazioneOpen = chiaviManifestazioneOpen[chiaveManifestazione];
                  return (
                    <React.Fragment key={chiaveManifestazione}>
                      <div
                        onClick={() => {
                          toggleDisciplinaMenuLive(chiaveManifestazione);
                        }}
                        data-qa={`manifestazione_${manifestazione.codiceDisciplina}_${manifestazione.codiceManifestazione}`}
                        css={css`
                          background-color: #f4f4f4;
                          height: 30px;
                          display: flex;
                          align-items: center;
                          color: #979797;
                          font-family: Mulish;
                          font-size: 0.875rem;
                          font-weight: 800;
                          letter-spacing: 0;
                          line-height: 18px;
                          padding-left: 54px;
                          cursor: pointer;
                        `}
                      >
                        <img
                          src={manifestazione.urlIcona}
                          onError={setFallbackImageSrc(
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEW7u7s18zFcAAAAC0lEQVQIHWMYYQAAAPAAASEIRrcAAAAASUVORK5CYII= ",
                          )}
                          css={css`
                            width: 18px;
                            height: 18px;
                            border-radius: 50%;
                            margin-right: 10px;
                          `}
                          alt="manifestazione"
                        />
                        {manifestazione.descrizione}
                      </div>
                      {isManifestazioneOpen &&
                        avvenimentoList.map((avvenimento) => {
                          const isSelectedAvvenimento =
                            state.selected.type === "avvenimento" &&
                            makeChiaveAvvenimento({
                              codicePalinsesto: state.selected.codicePalinsesto,
                              codiceAvvenimento: state.selected.codiceAvvenimento,
                            }) === makeChiaveAvvenimento(avvenimento);
                          return (
                            <div
                              css={css`
                                background-color: "#FCFCFC";
                                padding: ${isSelectedAvvenimento ? "11px 19px 11px 53px" : "12px 20px 12px 54px"};
                                position: relative;
                                align-items: center;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                border: ${isSelectedAvvenimento ? "2px solid #aac21f" : "1px solid #f4f4f4"};
                                box-sizing: border-box;
                                opacity: 0.72;
                                color: #000000;
                                font-family: Roboto;
                                font-size: 1rem;
                                letter-spacing: 0;
                                line-height: 19px;
                                text-transform: capitalize;
                                cursor: pointer;
                              `}
                              key={makeChiaveAvvenimento(avvenimento)}
                              onClick={() => {
                                openSchedaAvvenimentoLive({
                                  disciplina,
                                  manifestazione,
                                  avvenimento,
                                  previousSezione: "live",
                                  codiceDisciplina: avvenimento.codiceDisciplina,
                                  codiceManifestazione: avvenimento.codiceManifestazione,
                                  codiceAvvenimento: avvenimento.codiceAvvenimento,
                                  codicePalinsesto: avvenimento.codicePalinsesto,
                                });
                              }}
                            >
                              {avvenimento.descrizione.toLowerCase()}
                            </div>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const emptyAlberaturaMaps: ReturnType<typeof makeAlberaturaMaps> = {
  disciplinaList: [],
  manifestazioneListByDisciplina: {},
  avvenimentoListByManifestazione: {},
  numeroAvvenimentiByDisciplina: {},
};
export function makeAlberaturaMaps({ disciplinaMap, manifestazioneMap, avvenimentoFeMap }: AlberaturaLive) {
  const disciplinaList: Array<Disciplina> = Object.values(disciplinaMap);
  const numeroAvvenimentiByDisciplina: Record<CodiceDisciplina, number> = Object.fromEntries(
    Object.keys(disciplinaMap).map((codiceDisciplina) => [codiceDisciplina, 0]),
  );
  const manifestazioneUnorderedListByDisciplina: Record<CodiceDisciplina, Array<Manifestazione>> = Object.fromEntries(
    Object.keys(disciplinaMap).map((codiceDisciplina) => [codiceDisciplina, []]),
  );
  for (const manifestazione of Object.values(manifestazioneMap)) {
    manifestazioneUnorderedListByDisciplina[manifestazione.codiceDisciplina].push(manifestazione);
  }

  const manifestazioneListByDisciplina: Record<CodiceDisciplina, Array<Manifestazione>> = [];
  disciplinaList.forEach((disciplina) => {
    const manifestazioniOrdered = orderBy(manifestazioneUnorderedListByDisciplina[disciplina.codiceDisciplina], [
      (manifestazione) => (manifestazione.posizione === 0 ? Number.MAX_VALUE : manifestazione.posizione),
      (manifestazione) => manifestazione.descrizione,
    ]);
    manifestazioneListByDisciplina[disciplina.codiceDisciplina] = manifestazioniOrdered;
  });

  const avvenimentoListByManifestazione: Record<ChiaveManifestazione, Array<Avvenimento>> = Object.fromEntries(
    Object.keys(manifestazioneMap).map((chiaveManifestazione) => [chiaveManifestazione, []]),
  );
  for (const avvenimento of Object.values(avvenimentoFeMap)) {
    avvenimentoListByManifestazione[makeChiaveManifestazione(avvenimento)].push(avvenimento);
    numeroAvvenimentiByDisciplina[avvenimento.codiceDisciplina] += 1;
  }
  return {
    disciplinaList,
    manifestazioneListByDisciplina,
    avvenimentoListByManifestazione,
    numeroAvvenimentiByDisciplina,
  };
}
