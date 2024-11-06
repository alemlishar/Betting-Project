import React from "react";
import { makeChiaveScommessa, makeChiaveInfoAggiuntiva, ChiaveScommessa, ChiaveInfoAggiuntiva } from "src/types/chiavi";
import { TemplateAvvenimento2C } from "./TemplateAvvenimento2C";
import {
  Scommessa,
  SchedaAvvenimentoContainer,
  Disciplina,
  Manifestazione,
  Avvenimento,
  MetaScommessaTemplate,
  InfoAggiuntiva,
} from "../../prematch-api";
import { TemplateAvvenimento2CMA } from "./TemplateAvvenimento2CMA";
import { TemplateAvvenimentoNCMA } from "src/components/prematch/templates/avvenimento/TemplateAvvenimentoNCMA";
import { TemplateAvvenimentoNC } from "src/components/prematch/templates/avvenimento/TemplateAvvenimentoNC";
import { TemplateAvvenimentoDL } from "src/components/prematch/templates/avvenimento/TemplateAvvenimentoDL";
import { TemplateAvvenimentoDLMA } from "src/components/prematch/templates/avvenimento/TemplateAvvenimentoDLMA";

export type TemplateAvvenimentoProps = {
  schedaAvvenimento: SchedaAvvenimentoContainer | undefined;
  disciplina: Disciplina;
  manifestazione: Manifestazione;
  avvenimento: Avvenimento;
  metaScommessaTemplate: MetaScommessaTemplate;
  scommessaMap: Record<ChiaveScommessa, Scommessa> | undefined;
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva> | undefined;
  isOpen: Boolean;
  setToggleAccordion(metaScommessaTemplate: MetaScommessaTemplate, value: Boolean): void;
};
export function TemplateAvvenimento(props: TemplateAvvenimentoProps) {
  const InferredTemplate = chooseTemplate(props);
  return (
    <>
      {/* {SHOW_TEMPLATE_NAME && <TemplateName label={InferredTemplate.name} />} */}
      <InferredTemplate {...props} />
    </>
  );
}

function chooseTemplate(props: TemplateAvvenimentoProps) {
  const { schedaAvvenimento, metaScommessaTemplate, avvenimento } = props;
  const scommesse = metaScommessaTemplate.codiceScommessaList
    .map(
      (codiceScommessa) =>
        schedaAvvenimento?.scommessaMap[
          makeChiaveScommessa({
            codicePalinsesto: avvenimento.codicePalinsesto,
            codiceAvvenimento: avvenimento.codiceAvvenimento,
            codiceScommessa,
          })
        ],
    )
    .filter(Boolean);
  const firstScommessa = scommesse[0] as Scommessa | undefined;

  if (!firstScommessa) {
    return TemplateAvvenimentoUnimplemented;
  }
  const firstInfoAggiuntiva = firstScommessa
    ? schedaAvvenimento?.infoAggiuntivaMap[makeChiaveInfoAggiuntiva(firstScommessa.infoAggiuntivaKeyDataList[0])]
    : undefined;
  if (!firstInfoAggiuntiva) {
    return TemplateAvvenimentoUnimplemented;
  }
  const isInfoTemplate = !metaScommessaTemplate.scommessaTemplate && metaScommessaTemplate.infoTemplate != null;
  const infoAggiuntiveAssenti = firstInfoAggiuntiva.idInfoAggiuntiva === 0;
  const isListaEsitiDinamica = firstScommessa.listaEsitiDinamica;
  const modalitaVisualizzazione = firstScommessa.modalitaVisualizzazione;
  const numeroEsiti = firstInfoAggiuntiva.esitoList.length;
  if (!isInfoTemplate && infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti >= 2 && numeroEsiti <= 4) {
    return TemplateAvvenimento2C;
  }

  if (!isInfoTemplate && infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti > 4) {
    return TemplateAvvenimentoNC;
  }

  if (
    !isInfoTemplate &&
    infoAggiuntiveAssenti &&
    isListaEsitiDinamica &&
    (modalitaVisualizzazione === 2 || modalitaVisualizzazione === 3)
  ) {
    return TemplateAvvenimentoDL;
  }
  if (
    !isInfoTemplate &&
    !infoAggiuntiveAssenti &&
    isListaEsitiDinamica &&
    (modalitaVisualizzazione === 2 || modalitaVisualizzazione === 3)
  ) {
    return TemplateAvvenimentoDLMA;
  }

  if (!isInfoTemplate && !infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti >= 2 && numeroEsiti <= 4) {
    return TemplateAvvenimento2CMA;
  }

  if (!isInfoTemplate && !infoAggiuntiveAssenti && !isListaEsitiDinamica && numeroEsiti > 4) {
    return TemplateAvvenimentoNCMA;
  }
  return TemplateAvvenimentoUnimplemented;
}

function TemplateAvvenimentoUnimplemented() {
  return <></>;
}
