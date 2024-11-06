import React, { useCallback } from "react";
import { makeChiaveScommessa, makeChiaveEsito } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { DescrizioneAvvenimentoMemo } from "src/components/prematch/templates/DescrizioneAvvenimento";
import { TemplateProps } from "src/components/prematch/templates/Template";
import { rightAlignedColumn } from "src/components/prematch/templates/utils";
import { EsitoQuotaDescrizionePrematchMemo } from "src/components/prematch/templates/Esito";
import { NPlusDescrizionePremtachMemo } from "src/components/prematch/templates/NPlus";
import { SelectFiltroGiornalieroMemo } from "src/components/prematch/templates/FiltroGiornaliero";
import { Avvenimento } from "src/components/prematch/prematch-api";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

/*
senza info aggiuntiva (singola info aggiuntiva con idInfoAggiuntiva 0)
con lista esiti dinamica a false
con scommessaTemplate a true quindi infoTempalte assente
con piùdi 4 esiti
esempio: CALCIO -> ITA SERIA A -> RISULTATI -> RISULTATO ESATTO 26 ESITI
*/

// DEBT performance

export function TemplateNC({
  disciplina,
  manifestazione,
  avvenimentoList,
  infoAggiuntivaMap,
  metaScommessaTemplate,
  scommessaMap,
  filtroGiornaliero,
  onFiltroGiornalieroChange,
}: TemplateProps) {
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
        grid-template-columns: [descrizione-avvenimento] 1fr [esiti] auto;
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
          <React.Fragment key={avvenimento.key}>
            <div
              // hidden={avvenimentoIndex === 0}
              style={{ gridRow: `separator ${avvenimentoIndex + 1}` }}
              css={css`
                grid-column: 1 / -1;
                height: 1px;
                background-color: #dcdcdc;
                margin: 0px -10px;
              `}
            />
            <div
              style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
              css={css`
                grid-column: descrizione-avvenimento;
              `}
            >
              <DescrizioneAvvenimentoMemo avvenimento={avvenimento} onOpen={onOpenAvvenimento} />
            </div>
            <div
              style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
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
                      min-width: 55px;
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
          </React.Fragment>
        );
      })}
    </div>
  );
}
