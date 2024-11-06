import React, { useCallback } from "react";
import { makeChiaveScommessa, makeChiaveInfoAggiuntiva } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { rightAlignedColumn } from "src/components/prematch/templates/utils";
import { EsitoQuotaDescrizionePrematchMemo } from "src/components/prematch/templates/Esito";
import { TemplateAvvenimentoLastMinuteProps } from "src/components/prematch/LastMinute";
import { NPlusDescrizionePremtachMemo } from "src/components/prematch/templates/NPlus";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { Avvenimento } from "src/components/prematch/prematch-api";

// DEBT 2: NPlusDescrizioneMemo sostituito temporaneamente con NPlusDescrizione per il prematch

export function TemplateAvvenimentoLastMinuteDL({
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

  const modalitaVisualizzazione = scommessa.modalitaVisualizzazione;
  const infoAggiuntiva = infoAggiuntivaMap[makeChiaveInfoAggiuntiva(scommessa.infoAggiuntivaKeyDataList[0])];
  const numeroScommesse = avvenimento.numeroScommesse - 1;

  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: [esiti] auto;
        grid-template-rows: [cde] auto [esito] auto;
        row-gap: 10px;
        column-gap: 10px;
      `}
    >
      <div
        css={css`
          grid-column: esiti;
          grid-row: cde;
          color: #005936;
          font-family: Roboto;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0;
          line-height: 19px;
          align-self: center;
          text-align: right;
        `}
      >
        {scommessa.descrizione}
      </div>
      <div
        style={{ gridRow: `esito` }}
        css={css`
          grid-column: esiti;
          display: grid;
          grid-column-gap: 10px;
          grid-row-gap: 10px;
          grid-template-columns: repeat(${modalitaVisualizzazione}, [esito] min-content);
        `}
      >
        {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
          return (
            <div
              key={esito.codiceEsito}
              style={{
                gridColumn: rightAlignedColumn(modalitaVisualizzazione, infoAggiuntiva.esitoList.length, esitoIndex),
              }}
              css={css`
                width: ${modalitaVisualizzazione === 2 ? "315px" : "185px"};
              `}
            >
              <EsitoQuotaDescrizionePrematchMemo
                esito={esito}
                infoAggiuntiva={infoAggiuntiva}
                modalitaVisualizzazione={modalitaVisualizzazione}
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
          {numeroScommesse !== 0 && (
            <NPlusDescrizionePremtachMemo
              numeroScommesse={numeroScommesse}
              onClick={openAvvenimento}
              codiceAvvenimento={avvenimento.codiceAvvenimento}
              codicePalinsesto={avvenimento.codicePalinsesto}
            />
          )}
        </div>
      </div>
    </div>
  );
}
