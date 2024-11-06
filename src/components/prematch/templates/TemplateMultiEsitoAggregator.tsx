import React from "react";
import { css } from "styled-components/macro";
import { EsitoQuotaPrematchMemo, EsitoNonQuotatoPrematchMemo } from "src/components/prematch/templates/Esito";
import { capitalize } from "lodash";
import { getFlattenedHeaderLayoutInfo } from "src/components/prematch/templates/TemplateMultiScommessa";
import magliettaHome from "src/assets/images/maglietta-home.svg";
import magliettaAway from "src/assets/images/maglietta-away.svg";
import {
  Scommessa,
  InfoAggiuntiva,
  InfoAggiuntivaAggregator,
  InfoAggiuntivaAggregatorGroup,
  Column,
} from "src/components/prematch/prematch-api";
import { ChiaveInfoAggiuntiva, ChiaveScommessa, makeChiaveScommessa, makeChiaveInfoAggiuntiva } from "src/types/chiavi";
import { setFallbackImageSrc } from "src/components/prematch/templates/utils";
import { DescrizioneAvvenimentoInfoAggiuntivaAggregatorMemo } from "src/components/prematch/templates/DescrizioneAvvenimento";
import { TemplateProps } from "src/components/prematch/templates/Template";

// TODO performance

export function TemplateMultiEsitoAggregator({
  disciplina,
  manifestazione,
  avvenimento,
  infoAggiuntivaAggregatorGroupMap,
  infoAggiuntivaAggregatorList,
  infoAggiuntivaMap,
  metaScommessaTemplate,
  scommessaMap,
}: TemplateProps) {
  const { columns } = getFlattenedHeaderLayoutInfo(metaScommessaTemplate.infoTemplate, Infinity);
  if (!avvenimento) {
    return null;
  }
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns:
          [avvenimento] 1fr
          repeat(${columns.length}, [col] min-content)
          [n-plus] min-content;
        grid-gap: 10px 10px;
        grid-template-rows: [header] auto repeat(
            ${infoAggiuntivaAggregatorList.length},
            [avvenimento] auto [separator] 1px
          );
        padding: 10px;
      `}
    >
      {/* descrizione avvenimento */}
      <div
        css={css`
          grid-column: avvenimento;
          grid-row: header;
        `}
      >
        <DescrizioneAvvenimentoInfoAggiuntivaAggregatorMemo
          disciplina={disciplina}
          manifestazione={manifestazione}
          avvenimento={avvenimento}
          infoAggiuntivaAggregatorGroupMap={infoAggiuntivaAggregatorGroupMap}
        />
      </div>
      {/* background colonne header */}
      <div
        css={css`
          grid-column: col / span ${columns.length};
          grid-row: header;
          background-color: #0b7d3e;
        `}
      ></div>
      {/* colonne header */}
      {columns.map(({ column }, columnIndex) => {
        return (
          <div
            key={columnIndex}
            style={{ gridColumn: `col ${columnIndex + 1}` }}
            css={css`
              align-self: center;
              grid-row: header;
              color: white;
              font-family: Roboto;
              font-size: 0.75rem;
              font-weight: 500;
              letter-spacing: 0;
              line-height: 19px;
              text-align: center;
              height: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-width: 47px;
              padding: 0px 0px;
              position: relative;
            `}
          >
            {column.header && (column.header.length <= 3 ? column.header : capitalize(column.header))}
          </div>
        );
      })}
      {/* lista info aggiuntiva aggregator */}
      {infoAggiuntivaAggregatorList.map((infoAggiuntivaAggregator, infoAggiuntivaAggregatorIndex) => {
        // let numeroScommesse = infoAggiuntivaAggregator.numeroScommesse;
        const infoAggiuntivaAggregatorGroup =
          infoAggiuntivaAggregatorGroupMap[infoAggiuntivaAggregator.codiceInfoAggiuntivaAggregatorGroup];
        return (
          <React.Fragment key={infoAggiuntivaAggregator.idInfoAggiuntiva}>
            <div
              style={{ gridRow: `avvenimento ${infoAggiuntivaAggregatorIndex + 1}` }}
              css={css`
                grid-column: avvenimento;
              `}
            >
              <DescrizioneInfoAggiuntivaAggregator
                infoAggiuntivaAggregator={infoAggiuntivaAggregator}
                infoAggiuntivaAggregatorGroup={infoAggiuntivaAggregatorGroup}
              />
            </div>
            {/* quote */}
            {columns.map(({ column, sectionIndex, columnGroup, columnGroupIndex }, columnFlatIndex) => {
              // TODO fare meno spesso
              // DEBT dedupe getInfoAggiuntiveByAvvenimento call
              const infoAggiuntiveByInfoAggiuntivaAggregator = getInfoAggiuntiveByInfoAggiuntivaAggregator(
                infoAggiuntivaAggregator,
                column,
                scommessaMap,
                infoAggiuntivaMap,
              );
              const infoAggiuntiva = (() => {
                const infoAggiuntivaDefault = infoAggiuntiveByInfoAggiuntivaAggregator.find(
                  (infoAggiuntiva) => infoAggiuntiva.idInfoAggiuntiva === column.idInfoAggiuntiva,
                );
                const infoAggiuntivaPrima = infoAggiuntiveByInfoAggiuntivaAggregator[0];
                return infoAggiuntivaDefault ?? infoAggiuntivaPrima;
              })();
              const esito = infoAggiuntiva?.esitoList.find((esito) => esito.codiceEsito === column.codiceEsito);
              // if (esito) {
              //   numeroScommesse -= 1;
              // }
              return (
                <div
                  key={`${columnFlatIndex}`}
                  style={{ gridRow: `avvenimento ${infoAggiuntivaAggregatorIndex + 1}` }}
                  css={css`
                    grid-column: col ${columnFlatIndex + 1};
                    justify-self: center;
                  `}
                >
                  {infoAggiuntiva && esito ? (
                    <EsitoQuotaPrematchMemo
                      esito={esito}
                      infoAggiuntiva={infoAggiuntiva}
                      avvenimento={avvenimento}
                      manifestazione={manifestazione}
                      disciplina={disciplina}
                      scommessa={
                        scommessaMap[
                          avvenimento.codicePalinsesto +
                            "-" +
                            avvenimento.codiceAvvenimento +
                            "-" +
                            infoAggiuntiva.codiceScommessa
                        ]
                      }
                    />
                  ) : (
                    <EsitoNonQuotatoPrematchMemo />
                  )}
                </div>
              );
            })}
            {/* <div
              style={{
                gridRow: `avvenimento ${infoAggiuntivaAggregatorIndex + 1}`,
              }}
              css={css`
                grid-column: n-plus;
                justify-self: end;
              `}
            >
              {numeroScommesse > 0 && (
                <NPlusMemo
                  numeroScommesse={numeroScommesse}
                  onClick={openSchedaInfoAggiuntivaAggregator}
                  infoAggiuntivaAggregator={infoAggiuntivaAggregator}
                />
              )}
            </div> */}
            <div
              style={{ gridRow: `separator ${infoAggiuntivaAggregatorIndex + 1}` }}
              css={css`
                background-color: #dcdcdc;
                grid-column: 1 / -1;
                margin: 0px -10px;
              `}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

// TODO performance
export function getInfoAggiuntiveByInfoAggiuntivaAggregator(
  infoAggiuntivaAggregator: InfoAggiuntivaAggregator,
  column: Column,
  scommessaMap: Record<ChiaveScommessa, Scommessa>,
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva>,
) {
  const scommesse = column.codiceScommessaList
    .map((codiceScommessa) => {
      return scommessaMap[
        makeChiaveScommessa({
          codicePalinsesto: infoAggiuntivaAggregator.codicePalinsesto,
          codiceAvvenimento: infoAggiuntivaAggregator.codiceAvvenimento,
          codiceScommessa,
        })
      ];
    })
    .filter(Boolean);
  const infoAggiuntive = scommesse
    .flatMap((scommessa) => {
      return scommessa.infoAggiuntivaKeyDataList
        .filter(
          (infoAggiuntivaKeyData) =>
            infoAggiuntivaKeyData.idInfoAggiuntiva === infoAggiuntivaAggregator.idInfoAggiuntiva,
        )
        .flatMap((infoAggiuntivaKeyData) => {
          return infoAggiuntivaMap[makeChiaveInfoAggiuntiva(infoAggiuntivaKeyData)];
        });
    })
    .filter(Boolean);
  return infoAggiuntive;
}

type DescrizioneInfoAggiuntivaAggregatorProps = {
  infoAggiuntivaAggregator: InfoAggiuntivaAggregator;
  infoAggiuntivaAggregatorGroup: InfoAggiuntivaAggregatorGroup;
};
function DescrizioneInfoAggiuntivaAggregator({
  infoAggiuntivaAggregator,
  infoAggiuntivaAggregatorGroup,
}: DescrizioneInfoAggiuntivaAggregatorProps) {
  // const { openSchedaInfoAggiuntivaAggregatorPrematch } = useNavigazioneActions(); // TODO: decommentare quando verrà implementato la scheda giocatore
  return (
    <div
      // onClick={() => openSchedaInfoAggiuntivaAggregatorPrematch(infoAggiuntivaAggregator)}
      css={css`
        display: grid;
        grid-template-columns: min-content auto;
        grid-template-rows: auto auto;
        grid-column-gap: 8px;
        grid-row-gap: 4px;
      `}
    >
      <img
        css={css`
          grid-column: 1;
          grid-row: 1;
          box-sizing: border-box;
          height: 25px;
          width: 25px;
          border: 0.77px solid #cbcbcb;
          border-radius: 50%;
        `}
        alt={""}
        src={infoAggiuntivaAggregatorGroup.urlIcona}
        onError={setFallbackImageSrc(infoAggiuntivaAggregatorGroup.home ? magliettaHome : magliettaAway)}
      />{" "}
      <div
        css={css`
          grid-column: 2;
          grid-row: 1;
          color: gray;
          font-size: 0.9rem;
          align-self: center;
          &:hover {
            cursor: default;
          }
        `}
      >
        {infoAggiuntivaAggregatorGroup.descrizione}
      </div>
      <div
        css={css`
          grid-column: 1 / span 2;
          grid-row: 2;
          font-weight: 600;
          font-size: 1rem;
          &:hover {
            cursor: default;
          }
        `}
      >
        {infoAggiuntivaAggregator.descrizione}
      </div>
    </div>
  );
}
