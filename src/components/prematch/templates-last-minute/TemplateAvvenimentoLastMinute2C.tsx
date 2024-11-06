import React, { useCallback } from "react";
import { makeChiaveInfoAggiuntiva, makeChiaveScommessa } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { EsitoQuotaDescrizionePrematchMemo } from "src/components/prematch/templates/Esito";
import { NPlusPremtachMemo } from "src/components/prematch/templates/NPlus";
import { TemplateAvvenimentoLastMinuteProps } from "src/components/prematch/LastMinute";
import { Avvenimento } from "src/components/prematch/prematch-api";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

//DEBT 2: NPlusMemo sostituito temporaneamente con NPlus per il prematch

export function TemplateAvvenimentoLastMinute2C({
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
  );
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
  const numeroEsiti = infoAggiuntiva.esitoList.length;
  const numeroScommesse = avvenimento.numeroScommesse - 1;
  // DEBT 3 memoizzare
  const openAvvenimento = () => {
    onOpenAvvenimento(avvenimento);
  };
  return (
    <div
      css={css`
        grid-column: esiti;
        grid-row: 1 / -1;
        display: grid;
        grid-template-columns: [cde] auto repeat(${numeroEsiti}, [esito] min-content) [n-plus] auto;
        row-gap: 10px;
        column-gap: 10px;
        justify-content: end;
        background-color: #ffffff;
      `}
    >
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
          align-self: center;
        `}
      >
        {scommessa.descrizione}
      </div>
      {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
        return (
          <div
            key={esito.codiceEsito}
            style={{
              gridColumn: `esito ${esitoIndex + 1}`,
            }}
            css={css`
              justify-self: center;
              width: 65px;
            `}
          >
            <EsitoQuotaDescrizionePrematchMemo
              esito={esito}
              infoAggiuntiva={infoAggiuntiva}
              isSchedaAvvenimentoButton={false}
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
          grid-row: 1 / -1;
          grid-column: n-plus;
          justify-self: end;
        `}
      >
        {numeroScommesse > 0 ? (
          <NPlusPremtachMemo
            numeroScommesse={numeroScommesse}
            onClick={openAvvenimento}
            codiceAvvenimento={avvenimento.codiceAvvenimento}
            codicePalinsesto={avvenimento.codicePalinsesto}
          />
        ) : (
          <div
            css={css`
              width: 55px;
            `}
          ></div>
        )}
      </div>
    </div>
  );
}
