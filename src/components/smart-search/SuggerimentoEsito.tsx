import React, { useEffect, useState, useRef } from "react";
import styled, { css } from "styled-components/macro";
import {
  AvvenimentoSmart,
  ClasseEsitoSmart,
  EsitoSmart,
  InfoAggiuntivaSmart,
  StatoEsito,
} from "src/components/smart-search/smart-api";
import { formatCents } from "src/helpers/MoneyFormatterUtility";
import { KeyboardHighlight } from "src/components/smart-search/KeyboardHighlight";
import { ChiaveEsitoBigliettoComponents, makeChiaveEsito } from "src/types/chiavi";
import { StyledTypedText } from "src/components/smart-search/StyledHighlightedText";
import { useIsEsitoInBiglietto } from "src/components/esito/useEsito";

type SuggerimentoEsitoProps = {
  classeEsito: ClasseEsitoSmart;
  typed?: string;
  esito: EsitoSmart;
  statoEsito: StatoEsito;
  isSelected: boolean;
  showCodice: boolean;
  infoAggiuntiva?: InfoAggiuntivaSmart;
  onAddEsito(chiaveEsitoComponents: ChiaveEsitoBigliettoComponents): void;
  avvenimento: AvvenimentoSmart;
};
function SuggerimentoEsito({
  classeEsito,
  typed,
  esito,
  statoEsito,
  isSelected,
  showCodice,
  onAddEsito,
  infoAggiuntiva,
  avvenimento,
}: SuggerimentoEsitoProps) {
  const highlightType = isNaN(Number(typed)) ? "descrizione" : "codice";
  const isInCarrello = useIsEsitoInBiglietto(makeChiaveEsito(esito));
  const codiceParts = esito.codiceEsito.toString().split(new RegExp(`(${typed})`, "gi"));
  const codiceEsitoHighlight =
    highlightType === "descrizione"
      ? esito.codiceEsito
      : codiceParts.map((codicePart, i) => {
          return codicePart === typed && i === 1 ? (
            <StyledTypedText key={makeChiaveEsito(esito)}>{codicePart}</StyledTypedText>
          ) : (
            codicePart
          );
        });

  const descriptionParts = esito.descrizione.split(new RegExp(`(${typed})`, "gi"));
  const descrizioneEsito =
    highlightType === "descrizione" && typed && typed.length > 2
      ? descriptionParts.map((descriptionPart, i) => {
          return descriptionPart.toLowerCase() === typed.toLowerCase() ? (
            <StyledTypedText key={makeChiaveEsito(esito)}>{descriptionPart}</StyledTypedText>
          ) : (
            descriptionPart
          );
        })
      : esito.descrizione;

  const ultimaQuotaRef = useRef(esito.quota);
  const [variazioneQuota, setVariazioneQuota] = useState<VariazioneQuota>("nessuna");
  useEffect(() => {
    if (esito.quota !== ultimaQuotaRef.current) {
      const variazioneQuota = esito.quota > ultimaQuotaRef.current ? "rialzo" : "ribasso";
      ultimaQuotaRef.current = esito.quota;
      setVariazioneQuota(variazioneQuota);
      const timeoutId = setTimeout(() => {
        setVariazioneQuota("nessuna");
      }, 6000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [esito.quota]);
  return (
    <KeyboardHighlight isSelected={isSelected}>
      <StyledEsitoContainer
        key={esito.codiceEsito}
        variazioneQuota={variazioneQuota}
        statoEsito={statoEsito}
        onClick={() => {
          if (statoEsito === "aperto") {
            const {
              codicePalinsesto,
              codiceAvvenimento,
              codiceClasseEsito,
              codiceScommessa,
              idInfoAggiuntiva,
              codiceEsito,
              quota,
              legaturaAAMS,
              multipla,
              legaturaMax,
              legaturaMin,
              blackListMax,
              blackListMin,
              siglaDisciplina,
              siglaManifestazione,
            } = esito;

            const { codiceDisciplina, categoria, codiceManifestazione, formattedDataAvvenimento } = avvenimento;

            onAddEsito({
              codicePalinsesto,
              codiceAvvenimento,
              codiceClasseEsito,
              codiceScommessa,
              codiceDisciplina,
              idInfoAggiuntiva,
              codiceEsito,
              descrizioneAvvenimento: avvenimento.descrizione,
              descrizioneScommessa: infoAggiuntiva !== undefined ? infoAggiuntiva.descrizione : classeEsito.descrizione,
              descrizioneEsito: esito.descrizione,
              quota,
              legaturaAAMS,
              multipla,
              legaturaMax,
              legaturaMin,
              blackListMax,
              blackListMin,
              isLive: categoria !== 0,
              isFissa: esito.isFissa,
              codiceManifestazione,
              formattedDataAvvenimento,
              dataAvvenimento: infoAggiuntiva?.data,
              siglaDisciplina,
              siglaManifestazione,
            });
          }
        }}
        data-qa={`smart_search_fissa_Esito_${makeChiaveEsito(esito)}`}
        isInCarrello={isInCarrello}
      >
        {showCodice && <StyledShowCodice>{codiceEsitoHighlight}</StyledShowCodice>}
        <StyledEsitoDescrizioneContainer>
          <StyledEsitoDescrizione> {descrizioneEsito} </StyledEsitoDescrizione>
          <StyledFormatCents>
            {statoEsito === "chiuso" ? "-" : formatCents(esito.quota, 2).replace(".", ",")}
          </StyledFormatCents>
        </StyledEsitoDescrizioneContainer>
        <QuotaArrow variazioneQuota={variazioneQuota} />
      </StyledEsitoContainer>
    </KeyboardHighlight>
  );
}
export const SuggerimentoEsitoMemo = React.memo(SuggerimentoEsito);

const StyledShowCodice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px 0 0 4px;
  width: 40px;
  height: 46px;
  font-family: Roboto;
  font-weight: 700;
  font-size: 1.125rem;
  margin: 2px;
  background-color: #333333;
  color: #ffffff;
`;

const StyledEsitoDescrizioneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;

const StyledEsitoDescrizione = styled.div`
  font-family: Roboto;
  font-weight: 700;
  font-size: 1rem;
`;

const StyledFormatCents = styled.div`
  font-family: Roboto;
  font-size: 1.125rem;
`;

const StyledEsitoContainer = styled.div<{
  variazioneQuota: VariazioneQuota;
  statoEsito: StatoEsito;
  isInCarrello: boolean | undefined;
}>`
  display: flex;
  align-items: center;
  position: relative;
  background-color: ${(props) =>
    esitoColors(props.variazioneQuota, false, props.statoEsito, props.isInCarrello ?? false).backgroundColor};
  border-radius: 4px;
  height: 50px;
  cursor: default;
  ${StyledEsitoDescrizione} {
    color: ${(props) =>
      esitoColors(props.variazioneQuota, false, props.statoEsito, props.isInCarrello ?? false).descrizioneColor};
  }
  ${StyledFormatCents} {
    color: ${(props) =>
      esitoColors(props.variazioneQuota, false, props.statoEsito, props.isInCarrello ?? false).quotaColor};
    font-weight: ${(props) => (props.variazioneQuota !== "nessuna" ? "bold" : "")};
  }
  path {
    fill: ${(props) =>
      esitoColors(props.variazioneQuota, false, props.statoEsito, props.isInCarrello ?? false).arrowColor};
  }

  &:hover {
    background-color: ${(props) =>
      esitoColors(props.variazioneQuota, true, props.statoEsito, props.isInCarrello ?? false).backgroundColor};
    ${StyledEsitoDescrizione} {
      color: ${(props) =>
        esitoColors(props.variazioneQuota, true, props.statoEsito, props.isInCarrello ?? false).descrizioneColor};
    }
    ${StyledFormatCents} {
      color: ${(props) =>
        esitoColors(props.variazioneQuota, true, props.statoEsito, props.isInCarrello ?? false).quotaColor};
    }
    path {
      fill: ${(props) =>
        esitoColors(props.variazioneQuota, true, props.statoEsito, props.isInCarrello ?? false).arrowColor};
    }
  }
`;

function QuotaArrow({ variazioneQuota }: { variazioneQuota: VariazioneQuota }) {
  if (variazioneQuota === "nessuna") {
    return null;
  }
  const arrowStyle =
    variazioneQuota === "rialzo"
      ? css`
          position: absolute;
          top: 4px;
          right: 4px;
        `
      : css`
          position: absolute;
          bottom: 4px;
          left: 4px;
          transform: rotate(180deg);
        `;
  return (
    <svg viewBox="0 0 100 100" width="30" height="30" css={arrowStyle}>
      <path d="M100 100L0 0L100 0L100 100Z" />
    </svg>
  );
}

type VariazioneQuota = "rialzo" | "ribasso" | "nessuna";
function esitoColors(variazioneQuota: VariazioneQuota, hover: boolean, statoEsito: StatoEsito, isInCarrello: boolean) {
  if (statoEsito === "chiuso" || statoEsito === "sospeso") {
    return { backgroundColor: "#979797", descrizioneColor: "#333333", quotaColor: "#333333", arrowColor: "" };
  }
  switch (variazioneQuota) {
    case "nessuna":
      if (hover) {
        return { backgroundColor: "#aac21f", descrizioneColor: "#ffffff", quotaColor: "#FFF", arrowColor: "" };
      } else {
        if (isInCarrello) {
          return { backgroundColor: "#aac21f", descrizioneColor: "#FFFFFF", quotaColor: "#FFFFFF", arrowColor: "" };
        } else {
          return { backgroundColor: "#FFFFFF", descrizioneColor: "#333333", quotaColor: "#333333", arrowColor: "" };
        }
      }
    case "rialzo":
      if (hover) {
        return { backgroundColor: "#3B914C", descrizioneColor: "#FFF", quotaColor: "#FFF", arrowColor: "#FFF" };
      } else {
        return {
          backgroundColor: "#CEE5D8",
          descrizioneColor: "#333333",
          quotaColor: "#3B914C",
          arrowColor: "#3B914C",
        };
      }
    case "ribasso":
      if (hover) {
        return { backgroundColor: "#EB1E23", descrizioneColor: "#FFF", quotaColor: "#FFF", arrowColor: "#FFF" };
      } else {
        return {
          backgroundColor: "#FBD2D3",
          descrizioneColor: "#333333",
          quotaColor: "#EB1E23",
          arrowColor: "#EB1E23",
        };
      }
  }
}
