import React, { useCallback } from "react";
import { Avvenimento, InfoAggiuntiva, MetaScommessaTemplate, Scommessa } from "src/components/prematch/prematch-api";
import { DescrizioneAvvenimentoMemo } from "src/components/prematch/templates/DescrizioneAvvenimento";
import { EsitoQuotaPrematchMemo } from "src/components/prematch/templates/Esito";
import { SelectFiltroGiornalieroMemo } from "src/components/prematch/templates/FiltroGiornaliero";
import { NPlusDescrizionePremtachMemo } from "src/components/prematch/templates/NPlus";
import { TemplateProps } from "src/components/prematch/templates/Template";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { ChiaveInfoAggiuntiva, ChiaveScommessa, makeChiaveInfoAggiuntiva, makeChiaveScommessa } from "src/types/chiavi";
import { css } from "styled-components/macro";

/*
con info aggiuntiva (idInfoAggiuntiva != 0)
con lista esiti dinamica a false
con scommessaTemplate a true quindi infoTempalte assente
minimo 2 esiti massimo 4 esiti

esempio 2 esiti: CALCIO -> ITA SERIA A -> GOAL -> UNDER/OVER
esempio 3 esiti: CALCIO -> ITA SERIA A -> GOAL -> SEGNA GOAL
esempio 4 esiti: CALCIO -> ITA SERIE A -> DOPPIOTEMPO -> COMBO: U/O 1T + U/O 2T
*/

// TODO performance

export function Template2CMA({
  disciplina,
  manifestazione,
  avvenimentoList,
  infoAggiuntivaMap,
  metaScommessaTemplate,
  scommessaMap,
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
        grid-template-columns: [avvenimento] 1fr [info-aggiuntiva] 1fr repeat(${numeroEsiti}, [esito] min-content);
        grid-template-rows: [intestazione] auto ${avvenimentoList
            .map(
              (avvenimento, avvenimentoIndex) =>
                `repeat(${
                  getInfoAggiuntiveByAvvenimento(
                    avvenimento.codicePalinsesto,
                    avvenimento.codiceAvvenimento,
                    metaScommessaTemplate.codiceScommessaList,
                    scommessaMap,
                    infoAggiuntivaMap,
                  ).length
                }, [info-aggiuntiva-${avvenimentoIndex}] auto) [n-plus-${avvenimentoIndex}] auto [separator-${avvenimentoIndex}] auto`,
            )
            .join(" ")};
        row-gap: 10px;
        column-gap: 10px;
        padding: 10px;
      `}
    >
      <div
        css={css`
          grid-column: avvenimento;
          grid-row: intestazione;
        `}
      >
        <SelectFiltroGiornalieroMemo value={filtroGiornaliero} onChange={onFiltroGiornalieroChange} />
      </div>
      <div
        css={css`
          grid-column: esito 1 / span ${numeroEsiti};
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
              padding: 0 5px;
              min-width: 55px;
            `}
          >
            {esito.descrizione}
          </div>
        );
      })}

      {avvenimentoList.map((avvenimento, avvenimentoIndex) => {
        const { codicePalinsesto, codiceAvvenimento } = avvenimento;
        const infoAggiuntive = getInfoAggiuntiveByAvvenimento(
          codicePalinsesto,
          codiceAvvenimento,
          metaScommessaTemplate.codiceScommessaList,
          scommessaMap,
          infoAggiuntivaMap,
        );
        const numeroInfoAggiuntive = infoAggiuntive.length;
        const numeroScommesse = avvenimento.numeroScommesse - numeroInfoAggiuntive;
        // DEBT 3 memoizzare
        const openAvvenimento = () => {
          onOpenAvvenimento(avvenimento);
        };

        return (
          <React.Fragment key={avvenimento.key}>
            {avvenimentoList.length > 1 && (
              <div
                style={{ gridRow: `${"separator-" + avvenimentoIndex}` }}
                css={css`
                  grid-column: 1 / -1;
                  height: 1px;
                  background-color: #dcdcdc;
                  margin: 0px -10px;
                `}
              />
            )}
            <div
              style={{ gridRow: `${"info-aggiuntiva-" + avvenimentoIndex} 1 / span ${numeroInfoAggiuntive}` }}
              css={css`
                grid-column: avvenimento;
              `}
            >
              <DescrizioneAvvenimentoMemo avvenimento={avvenimento} onOpen={openAvvenimento} />
            </div>
            {infoAggiuntive.map((infoAggiuntiva, infoAggiuntivaIndex) => {
              return (
                <React.Fragment key={infoAggiuntiva.key}>
                  <div
                    style={{ gridRow: `${"info-aggiuntiva-" + avvenimentoIndex} ${infoAggiuntivaIndex + 1}` }}
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
                        font-weight: 700;
                        text-align: end;
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
                          gridRow: `${"info-aggiuntiva-" + avvenimentoIndex} ${infoAggiuntivaIndex + 1}`,
                        }}
                        css={css`
                          display: flex;
                          justify-content: center;
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
                </React.Fragment>
              );
            })}
            <div
              style={{ gridRow: `${"n-plus-" + avvenimentoIndex}` }}
              css={css`
                grid-column: info-aggiuntiva / -1;
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
          </React.Fragment>
        );
      })}
    </div>
  );
}

// DEBT performance
function getInfoAggiuntiveByAvvenimento(
  codicePalinsesto: number,
  codiceAvvenimento: number,
  codiceScommessaList: MetaScommessaTemplate["codiceScommessaList"],
  scommessaMap: Record<ChiaveScommessa, Scommessa>,
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva>,
) {
  return codiceScommessaList
    .map(
      (codiceScommessa) => scommessaMap[makeChiaveScommessa({ codicePalinsesto, codiceAvvenimento, codiceScommessa })],
    )
    .filter(Boolean)
    .flatMap((scommessa) =>
      scommessa.infoAggiuntivaKeyDataList
        .map((infoAggiuntivaKeyData) => infoAggiuntivaMap[infoAggiuntivaKeyData.key])
        .filter(Boolean),
    );
}
