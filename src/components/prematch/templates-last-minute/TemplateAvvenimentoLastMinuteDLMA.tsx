import React, { useCallback } from "react";
import { makeChiaveScommessa } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { EsitoQuotaDescrizionePrematchMemo } from "src/components/prematch/templates/Esito";
import { NPlusDescrizionePremtachMemo } from "src/components/prematch/templates/NPlus";
import { rightAlignedColumn } from "src/components/prematch/templates/utils";
import { getCodiceScommessaList, TemplateAvvenimentoLastMinuteProps } from "../LastMinute";
import { getInfoAggiuntiveByAvvenimento } from "src/components/prematch/LastMinute";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

/*
con info aggiuntive
con lista esiti dinamica a true
con scommessaTemplate a true quindi infoTempalte assente
con modalitaVisualizzazione = 2 oppure modalitaVisualizzazione = 3

esempio modalitaVisualizzazione = 2
CALCIO -> ITA SERIA A -> 1° TEMPO -> COMBO: DC IN 1T + U/O 1.5 1T

esempio modalitaVisualizzazione = 3
CALCIO -> ITA SERIA A -> GOAL -> METODO DEL GOAL X

*/
// DEBT 2: NPlusDescrizioneMemo sostituito temporaneamente con NPlusDescrizione per il prematch

export function TemplateAvvenimentoLastMinuteDLMA({
  disciplina,
  manifestazione,
  avvenimento,
  infoAggiuntivaMap,
  scommessaMap,
}: TemplateAvvenimentoLastMinuteProps) {
  const { openSchedaAvvenimentoPrematch } = useNavigazioneActions();
  const openAvvenimento = useCallback(() => {
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
  }, [avvenimento, disciplina, manifestazione, openSchedaAvvenimentoPrematch]);
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
  const modalitaVisualizzazione = scommessa.modalitaVisualizzazione;
  const { codicePalinsesto, codiceAvvenimento } = avvenimento;
  const infoAggiuntive = getInfoAggiuntiveByAvvenimento(
    codicePalinsesto,
    codiceAvvenimento,
    getCodiceScommessaList(scommessaMap),
    scommessaMap,
    infoAggiuntivaMap,
  );
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: [descrizione-avvenimento] 1fr [esiti] auto;
        grid-template-rows: [intestazione] auto [separator] auto [avvenimento] auto;
        row-gap: 10px;
        column-gap: 10px;
        padding: 10px;
      `}
    >
      <React.Fragment key={avvenimento.key}>
        <div
          style={{ gridRow: `avvenimento` }}
          css={css`
            grid-column: esiti;
            display: grid;
            grid-column-gap: 10px;
            grid-row-gap: 10px;
            grid-template-columns: repeat(${modalitaVisualizzazione}, [esito] min-content);
          `}
        >
          {infoAggiuntive.map((infoAggiuntiva) => {
            return (
              <React.Fragment key={infoAggiuntiva.key}>
                <div
                  css={css`
                    grid-column: 1 / -1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    box-sizing: border-box;
                    height: 45px;
                    padding-right: 30px;
                    padding-top: 10px;
                    color: #005936;
                    font-size: 0.875rem;
                    font-weight: bold;
                  `}
                >
                  {infoAggiuntiva.descrizione}
                </div>
                {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
                  return (
                    <div
                      key={esito.codiceEsito}
                      style={{
                        gridColumn: rightAlignedColumn(
                          modalitaVisualizzazione,
                          infoAggiuntiva.esitoList.length,
                          esitoIndex,
                        ),
                      }}
                      css={css`
                        width: ${modalitaVisualizzazione === 2 ? "315px" : "185px"};
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
            css={css`
              grid-column: 1 / -1;
              display: flex;
              align-items: center;
              justify-content: flex-end;
            `}
          >
            {avvenimento.numeroScommesse !== 0 && (
              <NPlusDescrizionePremtachMemo
                numeroScommesse={avvenimento.numeroScommesse}
                onClick={openAvvenimento}
                codiceAvvenimento={avvenimento.codiceAvvenimento}
                codicePalinsesto={avvenimento.codicePalinsesto}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    </div>
  );
}
