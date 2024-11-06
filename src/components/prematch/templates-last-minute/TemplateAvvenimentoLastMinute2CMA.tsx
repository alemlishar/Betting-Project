import React, { useCallback } from "react";
import { makeChiaveScommessa, makeChiaveInfoAggiuntiva } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { EsitoQuotaDescrizionePrematchMemo } from "src/components/prematch/templates/Esito";
import { NPlusDescrizionePremtachMemo } from "src/components/prematch/templates/NPlus";
import {
  getInfoAggiuntiveByAvvenimento,
  getCodiceScommessaList,
  TemplateAvvenimentoLastMinuteProps,
} from "src/components/prematch/LastMinute";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { Avvenimento } from "src/components/prematch/prematch-api";

/*
con info aggiuntiva (idInfoAggiuntiva != 0)
con lista esiti dinamica a false
con scommessaTemplate a true quindi infoTempalte assente
minimo 2 esiti massimo 4 esiti

esempio 2 esiti: CALCIO -> ITA SERIA A -> GOAL -> UNDER/OVER
esempio 3 esiti: CALCIO -> ITA SERIA A -> GOAL -> SEGNA GOAL
esempio 4 esiti: CALCIO -> ITA SERIE A -> DOPPIOTEMPO -> COMBO: U/O 1T + U/O 2T
*/

// DEBT 2: NPlusDescrizioneMemo sostituito temporaneamente con NPlusDescrizione per il prematch

export function TemplateAvvenimentoLastMinute2CMA({
  disciplina,
  manifestazione,
  avvenimento,
  infoAggiuntivaMap,
  scommessaMap,
}: TemplateAvvenimentoLastMinuteProps) {
  const { openSchedaAvvenimentoPrematch } = useNavigazioneActions();

  const onOpenAvvenimento = useCallback(
    (avvenimento: Avvenimento) => {
      openSchedaAvvenimentoPrematch({
        disciplina,
        manifestazione,
        avvenimento,
        previousSezione: "sport",
        codiceAvvenimento: avvenimento.codiceAvvenimento,
        codiceDisciplina: avvenimento.codiceDisciplina,
        codiceManifestazione: avvenimento.codiceManifestazione,
        codicePalinsesto: avvenimento.codicePalinsesto,
      });
    },
    [disciplina, manifestazione, openSchedaAvvenimentoPrematch],
  );
  // DEBT 3 memoizzare
  const openAvvenimento = () => {
    onOpenAvvenimento(avvenimento);
  };
  if (!scommessaMap) {
    return <></>;
  }
  if (!infoAggiuntivaMap) {
    return <></>;
  }

  const scommessa =
    scommessaMap[
      makeChiaveScommessa({
        codicePalinsesto: avvenimento.codicePalinsesto,
        codiceAvvenimento: avvenimento.codiceAvvenimento,
        codiceScommessa: avvenimento.firstScommessa.codiceScommessa,
      })
    ];
  const firstInfoAggiuntiva = infoAggiuntivaMap[makeChiaveInfoAggiuntiva(scommessa.infoAggiuntivaKeyDataList[0])];
  const numeroEsiti = firstInfoAggiuntiva.esitoList.length;
  const { codicePalinsesto, codiceAvvenimento } = avvenimento;
  const infoAggiuntive = getInfoAggiuntiveByAvvenimento(
    codicePalinsesto,
    codiceAvvenimento,
    getCodiceScommessaList(scommessaMap),
    scommessaMap,
    infoAggiuntivaMap,
  );
  const numeroInfoAggiuntive = infoAggiuntive.length;
  const numeroScommesse = avvenimento.numeroScommesse - numeroInfoAggiuntive;
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: [info-aggiuntiva] auto repeat(${numeroEsiti}, [esito] min-content);
        grid-template-rows:
          repeat(
            ${getInfoAggiuntiveByAvvenimento(
              avvenimento.codicePalinsesto,
              avvenimento.codiceAvvenimento,
              getCodiceScommessaList(scommessaMap),
              scommessaMap,
              infoAggiuntivaMap,
            ).length},
            [info-aggiuntiva] auto
          )
          [n-plus] auto;
        row-gap: 10px;
        column-gap: 10px;
      `}
    >
      {infoAggiuntive.map((infoAggiuntiva, infoAggiuntivaIndex) => {
        return (
          <React.Fragment key={infoAggiuntiva.key}>
            <div
              style={{ gridRow: `info-aggiuntiva ${infoAggiuntivaIndex + 1}` }}
              css={css`
                grid-column: info-aggiuntiva;
                display: flex;
                align-items: center;
                justify-content: flex-end;
              `}
            >
              <div
                css={css`
                  color: #005936;
                  font-family: Roboto;
                  font-size: 14px;
                  font-weight: bold;
                  letter-spacing: 0;
                  line-height: 19px;
                  text-align: right;
                  align-self: center;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  word-break: break-word;
                `}
              >
                {infoAggiuntiva.descrizione}
              </div>
            </div>
            {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
              return (
                <div
                  key={esito.codiceEsito}
                  style={{
                    gridColumn: `esito ${esitoIndex + 1}`,
                    gridRow: `info-aggiuntiva ${infoAggiuntivaIndex + 1}`,
                  }}
                  css={css`
                    display: flex;
                    justify-content: center;
                    width: 65px;
                  `}
                >
                  <EsitoQuotaDescrizionePrematchMemo
                    esito={esito}
                    infoAggiuntiva={infoAggiuntiva}
                    avvenimento={avvenimento}
                    scommessa={
                      scommessaMap[
                        makeChiaveScommessa({
                          codicePalinsesto: avvenimento.codicePalinsesto,
                          codiceAvvenimento: avvenimento.codiceAvvenimento,
                          codiceScommessa: infoAggiuntiva.codiceScommessa,
                        })
                      ]
                    }
                    manifestazione={manifestazione}
                    disciplina={disciplina}
                  />
                </div>
              );
            })}
          </React.Fragment>
        );
      })}
      <div
        style={{ gridRow: `n-plus` }}
        css={css`
          grid-column: info-aggiuntiva / -1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        `}
      >
        {numeroScommesse > 0 && (
          <NPlusDescrizionePremtachMemo
            numeroScommesse={numeroScommesse}
            onClick={openAvvenimento}
            codiceAvvenimento={avvenimento.codiceAvvenimento}
            codicePalinsesto={avvenimento.codicePalinsesto}
          />
        )}
      </div>
    </div>
  );
}
