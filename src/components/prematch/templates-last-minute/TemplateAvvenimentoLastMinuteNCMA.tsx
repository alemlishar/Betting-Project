import React, { useCallback } from "react";
import {
  getCodiceScommessaList,
  getInfoAggiuntiveByAvvenimento,
  TemplateAvvenimentoLastMinuteProps,
} from "src/components/prematch/LastMinute";
import { Avvenimento } from "src/components/prematch/prematch-api";
import { EsitoQuotaDescrizionePrematchMemo } from "src/components/prematch/templates/Esito";
import { NPlusDescrizionePremtachMemo } from "src/components/prematch/templates/NPlus";
import { rightAlignedColumn } from "src/components/prematch/templates/utils";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { makeChiaveEsito, makeChiaveInfoAggiuntiva, makeChiaveScommessa } from "src/types/chiavi";
import { css } from "styled-components/macro";

// DEBT 2: NPlusDescrizioneMemo sostituito temporaneamente con NPlusDescrizione per il prematch
export function TemplateAvvenimentoLastMinuteNCMA({
  disciplina,
  manifestazione,
  avvenimento,
  scommessaMap,
  infoAggiuntivaMap,
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
  ); // DEBT 1 memoizzare

  if (!scommessaMap) {
    return <></>;
  }
  if (!infoAggiuntivaMap) {
    return <></>;
  }

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
  const openAvvenimento = () => {
    onOpenAvvenimento(avvenimento);
  };
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: [descrizione-info-aggiuntiva] auto [esiti] min-content;
        grid-template-rows: [avvenimento] auto;
        row-gap: 10px;
        column-gap: 10px;
      `}
    >
      {infoAggiuntive.map((infoAggiuntiva, infoAggiuntivaIndex) => {
        return (
          <React.Fragment key={makeChiaveInfoAggiuntiva({ ...infoAggiuntiva })}>
            <div
              style={{ gridRow: ` avvenimento ${infoAggiuntivaIndex + 1}` }}
              css={css`
                grid-column: descrizione-info-aggiuntiva;
                color: #005936;
                font-weight: 700;
                font-size: 14px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                word-break: break-word;
                align-self: start;
                justify-self: start;
                padding-top: 12px;
              `}
            >
              {infoAggiuntiva.descrizione}
            </div>
            <div
              style={{ gridRow: ` avvenimento ${infoAggiuntivaIndex + 1}` }}
              css={css`
                grid-column: esiti;
                display: grid;
                grid-template-columns: repeat(4, [quota] min-content);
                grid-column-gap: 10px;
                grid-row-gap: 10px;
              `}
            >
              {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
                return (
                  <div
                    key={makeChiaveEsito({ ...infoAggiuntiva, codiceEsito: esito.codiceEsito })}
                    css={css`
                      grid-column: ${rightAlignedColumn(4, infoAggiuntiva.esitoList.length, esitoIndex)};
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
            </div>
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
        {numeroScommesse > 0 ? (
          <NPlusDescrizionePremtachMemo
            numeroScommesse={numeroScommesse}
            onClick={openAvvenimento}
            codiceAvvenimento={avvenimento.codiceAvvenimento}
            codicePalinsesto={avvenimento.codicePalinsesto}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
