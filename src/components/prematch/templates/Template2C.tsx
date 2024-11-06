import React, { useCallback } from "react";
import { makeChiaveScommessa, makeChiaveInfoAggiuntiva } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { DescrizioneAvvenimentoMemo } from "src/components/prematch/templates/DescrizioneAvvenimento";
import { TemplateProps } from "src/components/prematch/templates/Template";
import { EsitoQuotaPrematchMemo } from "src/components/prematch/templates/Esito";
import { NPlusPremtachMemo } from "src/components/prematch/templates/NPlus";
import { SelectFiltroGiornalieroMemo } from "src/components/prematch/templates/FiltroGiornaliero";
import { Avvenimento } from "src/components/prematch/prematch-api";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

/*
  senza info aggiuntiva (singola info aggiuntiva con idInfoAggiuntiva 0)
  con lista esiti dinamica a false
  con scommessaTemplate a true quindi infoTempalte assente
  minimo 2 esiti massimo 4 esiti
  esempio 2 esiti: CALCIO -> ITA SERIA A -> PRINCIPALI -> GOAL/NOGOAL
  esempio 2 esiti: CALCIO -> ITA SERIA A -> GOAL -> GOAL/NOGOAL
  esempio 3 esiti: CALCIO -> ITA SERIA A -> GOAL -> SEGNA ULTIMO GOAL
  esempio 4 esiti: CALCIO -> ITA SERIA A -> GOAL-> 1° TEMPO SOMMA GOAL
*/

export function Template2C({
  disciplina,
  manifestazione,
  metaScommessaTemplate,
  avvenimentoList,
  scommessaMap,
  infoAggiuntivaMap,
  filtroGiornaliero,
  onFiltroGiornalieroChange,
}: TemplateProps) {
  const firstAvvenimento = avvenimentoList[0];
  const firstScommessa =
    scommessaMap[
      makeChiaveScommessa({
        codicePalinsesto: firstAvvenimento.codicePalinsesto,
        codiceAvvenimento: firstAvvenimento.codiceAvvenimento,
        codiceScommessa: metaScommessaTemplate.codiceScommessaList[0],
      })
    ];
  const firstInfoAggiuntiva = infoAggiuntivaMap[makeChiaveInfoAggiuntiva(firstScommessa.infoAggiuntivaKeyDataList[0])];
  const numeroEsiti = firstInfoAggiuntiva.esitoList.length;
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
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: [descrizione-avvenimento] 1fr repeat(${numeroEsiti}, [esito] min-content) [n-plus] auto;
        grid-template-rows: [intestazione] auto repeat(${avvenimentoList.length}, [separator] auto [avvenimento] auto);
        row-gap: 10px;
        column-gap: 10px;
        padding: 10px;
      `}
    >
      <div
        css={css`
          grid-column: descrizione-avvenimento;
          grid-row: intestazione;
        `}
      >
        <SelectFiltroGiornalieroMemo value={filtroGiornaliero} onChange={onFiltroGiornalieroChange} />
      </div>
      <div
        style={{ gridColumn: `esito 1 / span ${numeroEsiti}` }}
        css={css`
          grid-row: intestazione;
          background-color: #0b7d3e;
        `}
      />
      {firstInfoAggiuntiva.esitoList.map((esito, index) => {
        return (
          <div
            key={`${esito.codiceEsito}-${index}`}
            style={{ gridColumn: `esito ${index + 1}` }}
            css={css`
              grid-row: intestazione;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 50px;
              color: #ffffff;
              font-family: Roboto;
              font-size: 0.875rem;
              font-weight: 700;
              letter-spacing: 0;
              line-height: 16px;
              text-align: center;
              padding: 0 4px;
            `}
          >
            {esito.descrizione}
          </div>
        );
      })}
      {avvenimentoList.map((avvenimento, avvenimentoIndex) => {
        const { codicePalinsesto, codiceAvvenimento } = avvenimento;
        const infoAggiuntive = metaScommessaTemplate.codiceScommessaList
          .map(
            (codiceScommessa) =>
              scommessaMap[makeChiaveScommessa({ codicePalinsesto, codiceAvvenimento, codiceScommessa })],
          )
          .filter(Boolean)
          .flatMap((scommessa) =>
            scommessa.infoAggiuntivaKeyDataList
              .map((infoAggiuntivaKeyData) => infoAggiuntivaMap[infoAggiuntivaKeyData.key])
              .filter(Boolean),
          );
        const infoAggiuntiva = infoAggiuntive[0];
        const numeroScommesse = avvenimento.numeroScommesse - infoAggiuntive.length;
        // DEBT 3 memoizzare
        const openAvvenimento = () => {
          onOpenAvvenimento(avvenimento);
        };
        return (
          <React.Fragment key={avvenimento.key + avvenimentoIndex}>
            <div
              style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
              css={css`
                grid-column: descrizione-avvenimento;
              `}
            >
              <DescrizioneAvvenimentoMemo avvenimento={avvenimento} onOpen={onOpenAvvenimento} />
            </div>

            <div
              // hidden={avvenimentoIndex === 0}
              style={{ gridRow: `separator ${avvenimentoIndex + 1}` }}
              css={css`
                grid-column: 1 / -1;
                height: 1px;
                background-color: #dcdcdc;
                margin: 0 -10px;
              `}
            />

            {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
              // DEBT deduplicare
              return (
                <div
                  key={esito.codiceEsito}
                  style={{
                    gridColumn: `esito ${esitoIndex + 1}`,
                    gridRow: `avvenimento ${avvenimentoIndex + 1}`,
                  }}
                  css={css`
                    justify-self: center;
                  `}
                >
                  <EsitoQuotaPrematchMemo
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
              style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
              css={css`
                grid-column: n-plus;
                justify-self: end;
              `}
            >
              {numeroScommesse !== 0 && (
                <NPlusPremtachMemo
                  numeroScommesse={numeroScommesse}
                  onClick={openAvvenimento}
                  codiceAvvenimento={avvenimento.codiceAvvenimento}
                  codicePalinsesto={avvenimento.codicePalinsesto}
                />
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
