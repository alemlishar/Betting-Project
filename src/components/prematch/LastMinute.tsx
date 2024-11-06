import React from "react";
import { orderBy } from "lodash";
import {
  Avvenimento,
  Disciplina,
  getLastMinute,
  InfoAggiuntiva,
  Manifestazione,
  MetaScommessaTemplate,
  Scommessa,
} from "src/components/prematch/prematch-api";
import { setFallbackImageSrc } from "src/components/prematch/templates/utils";
import { useAlberaturaPrematch } from "src/components/prematch/usePrematch";
import {
  ChiaveInfoAggiuntiva,
  ChiaveScommessa,
  makeChiaveInfoAggiuntiva,
  makeChiaveManifestazione,
  makeChiaveScommessa,
} from "src/types/chiavi";
import styled, { css } from "styled-components/macro";
import useSWR from "swr";
import { TemplateAvvenimentoLastMinute2C } from "src/components/prematch/templates-last-minute/TemplateAvvenimentoLastMinute2C";
import { TemplateAvvenimentoLastMinuteNC } from "src/components/prematch/templates-last-minute/TemplateAvvenimentoLastMinuteNC";
import { TemplateAvvenimentoLastMinute2CMA } from "src/components/prematch/templates-last-minute/TemplateAvvenimentoLastMinute2CMA";
import { TemplateAvvenimentoLastMinuteNCMA } from "src/components/prematch/templates-last-minute/TemplateAvvenimentoLastMinuteNCMA";
import { TemplateAvvenimentoLastMinuteDL } from "src/components/prematch/templates-last-minute/TemplateAvvenimentoLastMinuteDL";
import { TemplateAvvenimentoLastMinuteDLMA } from "src/components/prematch/templates-last-minute/TemplateAvvenimentoLastMinuteDLMA";
import { DescrizioneAvvenimentoDateTimeMemo } from "src/components/prematch/templates/DescrizioneAvvenimento";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

export function LastMinute() {
  const { openSchedaAvvenimentoPrematch } = useNavigazioneActions();
  const alberaturaPrematch = useAlberaturaPrematch();
  const { data } = useSWR("last minute", getLastMinute);
  if (!alberaturaPrematch || !data) {
    return null;
  }
  const { avvenimentoFeList, infoAggiuntivaMap, scommessaMap } = data;
  const { disciplinaMap, manifestazioneMap } = alberaturaPrematch;

  const avvenimentoList = orderBy(avvenimentoFeList, [
    (avvenimento) => new Date(avvenimento.data),
    (avvenimento) => avvenimento.descrizione,
  ]);

  if (!disciplinaMap || !manifestazioneMap) {
    return <></>;
  }
  return (
    <div
      css={css`
        flex-grow: 1;
        position: relative;
        overflow-y: scroll;
        ::-webkit-scrollbar {
          width: 0;
        }
      `}
    >
      <div
        css={css`
          position: absolute;
          width: 100%;
        `}
      >
        <div
          css={css`
            display: grid;
            grid-template-columns: [descrizione-avvenimento] 1fr [esiti] 1fr;
            grid-template-rows: repeat(${avvenimentoList.length}, [separator] auto [avvenimento] auto);
            row-gap: 10px;
            column-gap: 10px;
            padding: 10px;
            background-color: #ffffff;
            margin-bottom: 10px;
          `}
        >
          {avvenimentoList.map((avvenimento, avvenimentoIndex) => {
            const disciplina = disciplinaMap[avvenimento.codiceDisciplina];
            const manifestazione = manifestazioneMap[makeChiaveManifestazione(avvenimento)];
            return (
              <React.Fragment key={avvenimento.key + avvenimentoIndex}>
                <div
                  style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
                  css={css`
                    grid-column: descrizione-avvenimento;
                    margin-bottom: ${avvenimentoList.length === avvenimentoIndex + 1 ? "10px" : "0"};
                  `}
                  onClick={() =>
                    openSchedaAvvenimentoPrematch({
                      disciplina,
                      manifestazione,
                      avvenimento,
                      previousSezione: "sport",
                      codiceAvvenimento: avvenimento.codiceAvvenimento,
                      codiceDisciplina: avvenimento.codiceDisciplina,
                      codiceManifestazione: avvenimento.codiceManifestazione,

                      codicePalinsesto: avvenimento.codicePalinsesto,
                    })
                  }
                >
                  <StyledDescrizioneContainer>
                    <DescrizioneAvvenimentoDateTimeMemo datetime={avvenimento.data} />
                    <div
                      css={css`
                        grid-column: descrizione;
                        display: grid;
                        grid-template-rows: [info] auto [descrizione-avvenimento] auto;
                        row-gap: 5px;
                        cursor: pointer;
                      `}
                    >
                      <div
                        css={css`
                          grid-row: info;
                          display: flex;
                          align-items: center;
                          color: #333333;
                          font-family: Roboto;
                          font-size: 14px;
                          letter-spacing: 0;
                          line-height: 16px;
                        `}
                      >
                        <img
                          src={disciplina.urlIcona}
                          onError={setFallbackImageSrc(
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEW7u7s18zFcAAAAC0lEQVQIHWMYYQAAAPAAASEIRrcAAAAASUVORK5CYII=",
                          )}
                          css={css`
                            box-sizing: border-box;
                            height: 17px;
                            width: 17px;
                            margin-right: 6px;
                            border-radius: 50%;
                            object-fit: cover;
                          `}
                          alt="icona-disciplina"
                        />
                        <img
                          src={manifestazione?.urlIcona}
                          onError={setFallbackImageSrc(
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoAQMAAAC2MCouAAAAA1BMVEW7u7s18zFcAAAAC0lEQVQIHWMYYQAAAPAAASEIRrcAAAAASUVORK5CYII=",
                          )}
                          css={css`
                            box-sizing: border-box;
                            height: 17px;
                            width: 17px;
                            margin-right: 6px;
                            border-radius: 50%;
                            object-fit: cover;
                          `}
                          alt="icona-disciplina"
                        />
                        <span
                          css={css`
                            color: #333333;
                            font-family: Roboto;
                            font-size: 14px;
                            letter-spacing: 0;
                            line-height: 16px;
                          `}
                        >
                          {manifestazione.descrizione}
                        </span>
                      </div>
                      <StyledLabelAvvenimento>{avvenimento.descrizione}</StyledLabelAvvenimento>
                    </div>
                  </StyledDescrizioneContainer>
                </div>
                <div
                  css={css`
                    grid-column: esiti;
                    margin-bottom: ${avvenimentoList.length === avvenimentoIndex + 1 ? "10px" : "0"};
                  `}
                  style={{ gridRow: `avvenimento ${avvenimentoIndex + 1}` }}
                >
                  <TemplateAvvenimento
                    avvenimento={avvenimento}
                    disciplina={disciplina}
                    infoAggiuntivaMap={infoAggiuntivaMap}
                    manifestazione={manifestazione}
                    scommessaMap={scommessaMap}
                  />
                </div>
                <div
                  style={{ gridRow: `separator ${avvenimentoIndex + 1}` }}
                  css={css`
                    grid-column: 1 / -1;
                    height: 1px;
                    background-color: #dcdcdc;
                    margin: 0 -10px;
                  `}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const StyledDescrizioneContainer = styled.div`
  display: grid;
  grid-template-columns: [data-ora] max-content [descrizione] 1fr;
  grid-column-gap: 10px;
`;

const StyledLabelAvvenimento = styled.div`
  grid-row: descrizione-avvenimento;
  color: #333333;
  font-family: Roboto;
  font-size: 1rem;
  letter-spacing: 0;
  line-height: 23px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// TODO: spostare

export type TemplateAvvenimentoLastMinuteProps = {
  disciplina: Disciplina;
  manifestazione: Manifestazione;
  avvenimento: Avvenimento;
  scommessaMap: Record<ChiaveScommessa, Scommessa> | undefined;
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva> | undefined;
};
export function TemplateAvvenimento(props: TemplateAvvenimentoLastMinuteProps) {
  const InferredTemplate = chooseTemplate(props);
  return (
    <>
      {/* {SHOW_TEMPLATE_NAME && <TemplateName label={InferredTemplate.name} />} */}
      <InferredTemplate {...props} />
    </>
  );
}

function chooseTemplate(props: TemplateAvvenimentoLastMinuteProps) {
  const { scommessaMap, avvenimento, infoAggiuntivaMap } = props;

  const scommessa = scommessaMap
    ? (scommessaMap[
        makeChiaveScommessa({
          codicePalinsesto: avvenimento.codicePalinsesto,
          codiceAvvenimento: avvenimento.codiceAvvenimento,
          codiceScommessa: avvenimento.firstScommessa.codiceScommessa,
        })
      ] as Scommessa)
    : undefined;
  if (!scommessa) {
    return TemplateAvvenimentoUnimplemented;
  }

  const firstInfoAggiuntiva =
    scommessa && infoAggiuntivaMap
      ? infoAggiuntivaMap[makeChiaveInfoAggiuntiva(scommessa.infoAggiuntivaKeyDataList[0])]
      : undefined;
  if (!firstInfoAggiuntiva) {
    return TemplateAvvenimentoUnimplemented;
  }

  const infoAggiuntiveAssenti = firstInfoAggiuntiva.idInfoAggiuntiva === 0;
  const isListaEsitiDinamica = scommessa.listaEsitiDinamica;
  const modalitaVisualizzazione = scommessa.modalitaVisualizzazione;
  const numeroEsiti = firstInfoAggiuntiva.esitoList.length;

  if (infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti >= 2 && numeroEsiti <= 4) {
    return TemplateAvvenimentoLastMinute2C;
  }

  if (infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti > 4) {
    return TemplateAvvenimentoLastMinuteNC;
  }

  if (
    infoAggiuntiveAssenti &&
    isListaEsitiDinamica &&
    (modalitaVisualizzazione === 2 || modalitaVisualizzazione === 3)
  ) {
    return TemplateAvvenimentoLastMinuteDL;
  }

  if (
    !infoAggiuntiveAssenti &&
    isListaEsitiDinamica &&
    (modalitaVisualizzazione === 2 || modalitaVisualizzazione === 3)
  ) {
    return TemplateAvvenimentoLastMinuteDLMA;
  }

  if (!infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti >= 2 && numeroEsiti <= 4) {
    return TemplateAvvenimentoLastMinute2CMA;
  }

  if (!infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti > 4) {
    return TemplateAvvenimentoLastMinuteNCMA;
  }

  return TemplateAvvenimentoUnimplemented;
}

function TemplateAvvenimentoUnimplemented() {
  return <></>;
}

export function getInfoAggiuntiveByAvvenimento(
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

export function getCodiceScommessaList(scommessaMap: Record<string, Scommessa>) {
  const codiceScommessaList = Object.values(scommessaMap).map((scommessa) => scommessa.codiceScommessa);
  return codiceScommessaList.filter((item, index) => codiceScommessaList.indexOf(item) === index);
}
