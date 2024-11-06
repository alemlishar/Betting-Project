import React from "react";
import {
  Disciplina,
  Manifestazione,
  MetaScommessaTemplate,
  Avvenimento,
  Scommessa,
  InfoAggiuntiva,
  FiltroGiornaliero,
  InfoAggiuntivaAggregatorGroup,
  InfoAggiuntivaAggregator,
} from "src/components/prematch/prematch-api";
import { ChiaveInfoAggiuntiva, ChiaveScommessa, makeChiaveScommessa, makeChiaveInfoAggiuntiva } from "src/types/chiavi";
import { Template2C } from "src/components/prematch/templates/Template2C";
import { TemplateNC } from "src/components/prematch/templates/TemplateNC";
import { TemplateDL } from "src/components/prematch/templates/TemplateDL";
import { TemplateDLMA } from "src/components/prematch/templates/TemplateDLMA";
import { Template2CMA } from "src/components/prematch/templates/Template2CMA";
import { TemplateNCMA } from "src/components/prematch/templates/TemplateNCMA";
import { TemplateMultiScommessa } from "src/components/prematch/templates/TemplateMultiScommessa";
import { TemplateMultiEsito } from "src/components/prematch/templates/TemplateMultiEsito";
import { css } from "styled-components/macro";
import { TemplateMultiEsitoAggregator } from "src/components/prematch/templates/TemplateMultiEsitoAggregator";
import { TemplateMultiScommessaAggregator } from "src/components/prematch/templates/TemplateMultiScommessaAggregator";

const SHOW_TEMPLATE_NAME = process.env.NODE_ENV === "development" && true;

export type TemplateProps = {
  disciplina: Disciplina;
  manifestazione: Manifestazione;
  metaScommessaTemplate: MetaScommessaTemplate;
  avvenimentoList: Array<Avvenimento>;
  scommessaMap: Record<ChiaveScommessa, Scommessa>;
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva>;
  filtroGiornaliero: FiltroGiornaliero;
  onFiltroGiornalieroChange(filtro: FiltroGiornaliero): void;
  // extra per info aggiuntiva aggregator template
  avvenimento?: Avvenimento;
  infoAggiuntivaAggregatorGroupMap: Record<string, InfoAggiuntivaAggregatorGroup>;
  infoAggiuntivaAggregatorList: Array<InfoAggiuntivaAggregator>;
};

function TemplatePrematch(props: TemplateProps) {
  const InferredTemplate = chooseTemplate(props);
  return (
    <>
      {SHOW_TEMPLATE_NAME && <TemplateName label={InferredTemplate.name} />}
      <InferredTemplate {...props} />
    </>
  );
}

export const TemplatePrematchMemo = React.memo(TemplatePrematch);

function chooseTemplate({
  metaScommessaTemplate,
  avvenimentoList,
  scommessaMap,
  infoAggiuntivaMap,
  avvenimento,
}: TemplateProps): React.FunctionComponent<TemplateProps> {
  const firstAvvenimento = avvenimentoList[0] as Avvenimento | undefined;
  if (!firstAvvenimento) {
    return TemplateUnimplemented;
  }
  const effectiveAvvenimento = avvenimento ?? firstAvvenimento; // nei template infoAggiuntivaAggregator le scommesse sono legate all'avveniemnto selezionato, non al primo in generale
  const scommesse = metaScommessaTemplate.codiceScommessaList
    .map(
      (codiceScommessa) =>
        scommessaMap[
          makeChiaveScommessa({
            codicePalinsesto: effectiveAvvenimento.codicePalinsesto,
            codiceAvvenimento: effectiveAvvenimento.codiceAvvenimento,
            codiceScommessa,
          })
        ],
    )
    .filter(Boolean); // a volte non tutte le scommesse sono presenti nella scommessa map
  const firstScommessa = scommesse[0] as Scommessa | undefined;
  if (!firstScommessa) {
    return TemplateUnimplemented;
  }
  const firstInfoAggiuntiva = firstScommessa
    ? infoAggiuntivaMap[makeChiaveInfoAggiuntiva(firstScommessa.infoAggiuntivaKeyDataList[0])]
    : undefined;
  if (!firstInfoAggiuntiva) {
    return TemplateUnimplemented;
  }
  const isInfoTemplate = !metaScommessaTemplate.scommessaTemplate && metaScommessaTemplate.infoTemplate != null;
  const infoAggiuntiveAssenti = firstInfoAggiuntiva.idInfoAggiuntiva === 0;
  const isListaEsitiDinamica = firstScommessa.listaEsitiDinamica;
  const modalitaVisualizzazione = firstScommessa.modalitaVisualizzazione;
  const numeroEsiti = firstInfoAggiuntiva.esitoList.length;

  if (!isInfoTemplate && infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti >= 2 && numeroEsiti <= 4) {
    return Template2C;
  }

  if (!isInfoTemplate && infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti > 4) {
    return TemplateNC;
  }

  if (
    !isInfoTemplate &&
    infoAggiuntiveAssenti &&
    isListaEsitiDinamica &&
    (modalitaVisualizzazione === 2 || modalitaVisualizzazione === 3)
  ) {
    return TemplateDL;
  }

  if (
    !isInfoTemplate &&
    !infoAggiuntiveAssenti &&
    isListaEsitiDinamica &&
    (modalitaVisualizzazione === 2 || modalitaVisualizzazione === 3)
  ) {
    return TemplateDLMA;
  }

  if (!isInfoTemplate && !infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti >= 2 && numeroEsiti <= 4) {
    return Template2CMA;
  }

  if (!isInfoTemplate && !infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti > 4) {
    return TemplateNCMA;
  }

  const isInfoAggiuntivaAggregator = metaScommessaTemplate.infoAggiuntivaAggregator;

  const isMultiScommessa =
    isInfoTemplate && !isInfoAggiuntivaAggregator && metaScommessaTemplate.infoTemplate.sections[0].header;
  if (isMultiScommessa) {
    return TemplateMultiScommessa;
  }

  const isMultiEsito =
    isInfoTemplate && !isInfoAggiuntivaAggregator && !metaScommessaTemplate.infoTemplate.sections[0].header;
  if (isMultiEsito) {
    return TemplateMultiEsito;
  }

  if (isInfoAggiuntivaAggregator && !metaScommessaTemplate.infoTemplate.sections[0].header) {
    return TemplateMultiEsitoAggregator;
  }

  if (isInfoAggiuntivaAggregator && metaScommessaTemplate.infoTemplate.sections[0].header) {
    // TODO
    return TemplateMultiScommessaAggregator;
  }

  return TemplateUnimplemented;
}

function TemplateName({ label }: { label: string }) {
  return (
    <div
      css={css`
        text-align: center;
        padding: 4px;
        background-color: #dcdcdc;
      `}
    >
      {label}
    </div>
  );
}

function TemplateUnimplemented() {
  return null;
}
