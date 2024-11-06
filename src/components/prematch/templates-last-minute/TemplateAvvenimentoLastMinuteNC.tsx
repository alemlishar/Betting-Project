import React, { useCallback } from "react";
import { TemplateAvvenimentoLastMinuteProps } from "src/components/prematch/LastMinute";
import { Avvenimento } from "src/components/prematch/prematch-api";
import { EsitoQuotaDescrizionePrematchMemo } from "src/components/prematch/templates/Esito";
import { NPlusDescrizionePremtachMemo } from "src/components/prematch/templates/NPlus";
import { rightAlignedColumn } from "src/components/prematch/templates/utils";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { makeChiaveEsito, makeChiaveInfoAggiuntiva, makeChiaveScommessa } from "src/types/chiavi";
import { css } from "styled-components/macro";

// DEBT 2: NPlusDescrizioneMemo sostituito temporaneamente con NPlusDescrizione per il prematch
export function TemplateAvvenimentoLastMinuteNC({
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
  const scommessa =
    scommessaMap[
      makeChiaveScommessa({
        codicePalinsesto: avvenimento.codicePalinsesto,
        codiceAvvenimento: avvenimento.codiceAvvenimento,
        codiceScommessa: avvenimento.firstScommessa.codiceScommessa,
      })
    ];
  const infoAggiuntiva = infoAggiuntivaMap[makeChiaveInfoAggiuntiva(scommessa.infoAggiuntivaKeyDataList[0])];
  const numeroScommesse = avvenimento.numeroScommesse - 1; // DEBT 3 memoizzare
  const openAvvenimento = () => {
    onOpenAvvenimento(avvenimento);
  };
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: [cde] auto [esiti] min-content;
        grid-template-rows: [avvenimento] auto;
        row-gap: 10px;
        column-gap: 10px;
      `}
    >
      <React.Fragment key={avvenimento.key}>
        <div
          css={css`
            grid-column: cde;
            color: #005936;
            font-family: Roboto;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 0;
            line-height: 19px;
            text-align: right;
            align-self: start;
            margin: 13px 0;
          `}
        >
          {scommessa.descrizione}
        </div>
        <div
          style={{ gridRow: `avvenimento` }}
          css={css`
            grid-column: esiti;
            display: grid;
            grid-column-gap: 10px;
            grid-row-gap: 10px;
            grid-template-columns: repeat(4, [esito] min-content);
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
          <div
            css={css`
              grid-column: 1 / -1;
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
      </React.Fragment>
    </div>
  );
}
