import React, { useEffect, useRef, useState } from "react";
import { useAddEsitoToBiglietto, useIsEsitoInBiglietto } from "src/components/esito/useEsito";
import {
  Avvenimento,
  Disciplina,
  Esito,
  InfoAggiuntiva,
  Manifestazione,
  Scommessa,
} from "src/components/prematch/prematch-api";
import { StatoEsito } from "src/components/smart-search/smart-api";
import { formatCents } from "src/helpers/MoneyFormatterUtility";
import { ChiaveEsitoBigliettoComponents, makeChiaveEsito } from "src/types/chiavi";
import styled from "styled-components/macro";

// DEBT: Migliorare le performance
// DEBT 2: finire di parametrizzare

export type EsitoProps = {
  esito: Esito;
  infoAggiuntiva: InfoAggiuntiva;
  modalitaVisualizzazione?: number;
  isSchedaAvvenimentoButton?: boolean;
  avvenimento: Avvenimento;
  scommessa: Scommessa;
  manifestazione: Manifestazione;
  disciplina: Disciplina;
};

export function EsitoQuotaConVariazione(
  props: EsitoProps & { backgroundColorIsInCarrelloEsitoButton: string; colorBytypeEsito: string },
) {
  const {
    esito,
    infoAggiuntiva,
    backgroundColorIsInCarrelloEsitoButton,
    colorBytypeEsito,
    avvenimento,
    scommessa,
    manifestazione,
    disciplina,
  } = props;
  const isInCarrello = useIsEsitoInBiglietto(makeChiaveEsito(infoAggiuntiva, esito));
  const statoEsito = getStatoEsito(esito, infoAggiuntiva);
  const addEsitoToBiglietto = useAddEsitoToBiglietto();
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
    <StyledEsitoQuotaButton
      onClick={addEsito(
        infoAggiuntiva,
        esito,
        addEsitoToBiglietto.esitoSport,
        avvenimento,
        scommessa,
        manifestazione,
        disciplina,
      )}
      isInCarrello={isInCarrello}
      variazioneQuota={variazioneQuota}
      statoEsito={statoEsito}
      data-qa={`esito_${makeChiaveEsito(infoAggiuntiva, esito)}`}
      coloriVariazioneEsito={esitoColors(variazioneQuota, statoEsito, isInCarrello ?? false, colorBytypeEsito)}
      disabled={statoEsito !== "aperto"}
      backgroundColorIsInCarrelloEsitoButton={backgroundColorIsInCarrelloEsitoButton}
    >
      {statoEsito !== "chiuso" ? formatCents(esito.quota, 2) : "-"}
    </StyledEsitoQuotaButton>
  );
}

export function EsitoQuota(
  props: EsitoProps & { backgroundColorIsInCarrelloEsitoButton: string; colorBytypeEsito: string },
) {
  const {
    esito,
    infoAggiuntiva,
    backgroundColorIsInCarrelloEsitoButton,
    colorBytypeEsito,
    avvenimento,
    scommessa,
    manifestazione,
    disciplina,
  } = props;
  const esistoKey = makeChiaveEsito(infoAggiuntiva, esito);
  const isInCarrello = useIsEsitoInBiglietto(esistoKey);
  const statoEsito = getStatoEsito(esito, infoAggiuntiva);
  const addEsitoToBiglietto = useAddEsitoToBiglietto();
  return (
    <StyledEsitoQuotaButton
      onClick={addEsito(
        infoAggiuntiva,
        esito,
        addEsitoToBiglietto.esitoSport,
        avvenimento,
        scommessa,
        manifestazione,
        disciplina,
      )}
      isInCarrello={isInCarrello}
      data-qa={`esito_${esistoKey}`}
      coloriVariazioneEsito={esitoColors("nessuna", statoEsito, isInCarrello ?? false, colorBytypeEsito)}
      disabled={statoEsito !== "aperto"}
      backgroundColorIsInCarrelloEsitoButton={backgroundColorIsInCarrelloEsitoButton}
    >
      {statoEsito !== "chiuso" ? formatCents(esito.quota, 2) : "-"}
    </StyledEsitoQuotaButton>
  );
}

export function EsitoQuotaDescrizione(
  props: EsitoProps & {
    backgroundColorIsInCarrelloEsitoButton: string;
    descrizioneEnabledTextColor: string;
    descrizioneTextColor: string;
    backGroundColorDescrizioneButton: string;
    colorBytypeEsito: string;
  },
) {
  const {
    esito,
    manifestazione,
    disciplina,
    infoAggiuntiva,
    modalitaVisualizzazione,
    isSchedaAvvenimentoButton,
    descrizioneTextColor,
    backgroundColorIsInCarrelloEsitoButton,
    backGroundColorDescrizioneButton,
    colorBytypeEsito,
    avvenimento,
    scommessa,
  } = props;
  const esistoKey = makeChiaveEsito(infoAggiuntiva, esito);
  const isInCarrello = useIsEsitoInBiglietto(esistoKey);
  const statoEsito = getStatoEsito(esito, infoAggiuntiva);
  const isDisable = esito.quota === 100 || esito.stato === 0 || statoEsito !== "aperto";
  const addEsitoToBiglietto = useAddEsitoToBiglietto();
  return (
    <StyledEsitoQuotaDescrizioneButton
      onClick={addEsito(
        infoAggiuntiva,
        esito,
        addEsitoToBiglietto.esitoSport,
        avvenimento,
        scommessa,
        manifestazione,
        disciplina,
      )}
      isInCarrello={isInCarrello}
      data-qa={`esito_${esistoKey}`}
      modalitaVisualizzazione={modalitaVisualizzazione}
      isSchedaAvvenimentoButton={isSchedaAvvenimentoButton}
      disabled={isDisable}
      backgroundColorIsInCarrelloEsitoButton={backgroundColorIsInCarrelloEsitoButton}
      coloriVariazioneEsito={esitoColors(
        "nessuna",
        statoEsito,
        isInCarrello ?? false,
        colorBytypeEsito,
        descrizioneTextColor,
      )}
      backGroundColorDescrizioneButton={backGroundColorDescrizioneButton}
    >
      <StyledEsitoDescrizione>{esito.descrizione}</StyledEsitoDescrizione>
      <div>{!isDisable ? formatCents(esito.quota, 2) : "-"}</div>
    </StyledEsitoQuotaDescrizioneButton>
  );
}

export function EsitoQuotaDescrizioneConVariazione(
  props: EsitoProps & {
    backgroundColorIsInCarrelloEsitoButton: string;
    descrizioneEnabledTextColor: string;
    descrizioneTextColor: string;
    backGroundColorDescrizioneButton: string;
    colorBytypeEsito: string;
  },
) {
  const {
    esito,
    manifestazione,
    disciplina,
    infoAggiuntiva,
    modalitaVisualizzazione,
    isSchedaAvvenimentoButton,
    backgroundColorIsInCarrelloEsitoButton,
    backGroundColorDescrizioneButton,
    descrizioneTextColor,
    colorBytypeEsito,
    avvenimento,
    scommessa,
  } = props;
  const esistoKey = makeChiaveEsito(infoAggiuntiva, esito);
  const isInCarrello = useIsEsitoInBiglietto(esistoKey);
  const statoEsito = getStatoEsito(esito, infoAggiuntiva);
  const isDisable = esito.quota === 100 || esito.stato === 0 || statoEsito !== "aperto";
  const addEsitoToBiglietto = useAddEsitoToBiglietto();
  const ultimaQuotaRef = useRef(esito.quota);
  const [variazioneQuota, setVariazioneQuota] = useState<VariazioneQuota>("nessuna");
  const coloriVariazioneEsito = esitoColors(
    variazioneQuota,
    statoEsito,
    isInCarrello ?? false,
    colorBytypeEsito,
    descrizioneTextColor,
  );
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
    <StyledEsitoQuotaDescrizioneConVariazioneButton
      onClick={addEsito(
        infoAggiuntiva,
        esito,
        addEsitoToBiglietto.esitoSport,
        avvenimento,
        scommessa,
        manifestazione,
        disciplina,
      )}
      isInCarrello={isInCarrello}
      data-qa={`esito_${esistoKey}`}
      variazioneQuota={variazioneQuota}
      modalitaVisualizzazione={modalitaVisualizzazione}
      isSchedaAvvenimentoButton={isSchedaAvvenimentoButton}
      disabled={isDisable}
      backgroundColorIsInCarrelloEsitoButton={backgroundColorIsInCarrelloEsitoButton}
      coloriVariazioneEsito={coloriVariazioneEsito}
      backGroundColorDescrizioneButton={backGroundColorDescrizioneButton}
    >
      <StyledEsitoDescrizione>{esito.descrizione}</StyledEsitoDescrizione>
      <div>{!isDisable ? formatCents(esito.quota, 2) : "-"}</div>
    </StyledEsitoQuotaDescrizioneConVariazioneButton>
  );
}

function EsitoNonQuotato() {
  return (
    <StyledEsitoNonQuotatoButton
      backgroundColorIsInCarrelloEsitoButton={"#fffff"}
      coloriVariazioneEsito={esitoColors("nessuna", "chiuso", false)}
      disabled
    >
      -
    </StyledEsitoNonQuotatoButton>
  );
}
export const EsitoNonQuotatoMemo = React.memo(EsitoNonQuotato);

export function EsitoQuotaHotBets(
  props: EsitoProps & {
    backgroundColorIsInCarrelloEsitoButton: string;
    colorBytypeEsito: string;
    hasQuotaMaggiorata?: boolean;
  },
) {
  const {
    esito,
    infoAggiuntiva,
    backgroundColorIsInCarrelloEsitoButton,
    colorBytypeEsito,
    hasQuotaMaggiorata,
    avvenimento,
    scommessa,
    manifestazione,
    disciplina,
  } = props;
  const esistoKey = makeChiaveEsito(infoAggiuntiva, esito);
  const isInCarrello = useIsEsitoInBiglietto(esistoKey);
  const statoEsito = getStatoEsito(esito, infoAggiuntiva);
  const addEsitoToBiglietto = useAddEsitoToBiglietto();
  return (
    <StyledEsitoQuotaHotBetsButton
      onClick={addEsito(
        infoAggiuntiva,
        esito,
        addEsitoToBiglietto.esitoSport,
        avvenimento,
        scommessa,
        manifestazione,
        disciplina,
      )}
      isInCarrello={isInCarrello}
      data-qa={`esito_${esistoKey}`}
      coloriVariazioneEsito={esitoColors("nessuna", statoEsito, isInCarrello ?? false, colorBytypeEsito)}
      disabled={statoEsito !== "aperto"}
      backgroundColorIsInCarrelloEsitoButton={backgroundColorIsInCarrelloEsitoButton}
      hasQuotaMaggiorata={hasQuotaMaggiorata ?? false}
    >
      {statoEsito !== "chiuso" ? formatCents(esito.quota, 2) : "-"}
    </StyledEsitoQuotaHotBetsButton>
  );
}

const addEsito = (
  infoAggiuntiva: InfoAggiuntiva,
  esito: Esito,
  addEsitoToBiglietto: (chiaveEsitoComponents: ChiaveEsitoBigliettoComponents) => void,
  avvenimento: Avvenimento,
  scommessa: Scommessa,
  manifestazione: Manifestazione,
  disciplina: Disciplina,
) => {
  const {
    codicePalinsesto,
    codiceAvvenimento,
    codiceClasseEsito,
    codiceScommessa,
    idInfoAggiuntiva,
    legaturaAAMS,
    legaturaMax,
    legaturaMin,
    data,
  } = infoAggiuntiva;

  const { codiceEsito, quota } = esito;

  const { codiceDisciplina, codiceManifestazione, formattedDataAvvenimento, categoria } = avvenimento;

  const { multipla, blackListMax, blackListMin } = scommessa;

  return () =>
    addEsitoToBiglietto({
      codicePalinsesto,
      codiceAvvenimento,
      codiceClasseEsito,
      codiceScommessa,
      idInfoAggiuntiva,
      descrizioneScommessa: infoAggiuntiva.descrizione,
      codiceDisciplina,
      codiceEsito,
      descrizioneAvvenimento: avvenimento.descrizione,
      descrizioneEsito: esito.descrizione,
      quota,
      legaturaAAMS,
      multipla,
      legaturaMax,
      legaturaMin,
      blackListMax,
      blackListMin,
      isLive: categoria !== 0,
      isFissa: esito.fissa,
      codiceManifestazione,
      formattedDataAvvenimento,
      dataAvvenimento: data,
      siglaDisciplina: disciplina.sigla !== undefined ? disciplina.sigla : disciplina.descrizione,
      siglaManifestazione: manifestazione.sigla,
      avvenimento: avvenimento,
      manifestazione: manifestazione,
      disciplina: disciplina,
    });
};

export function getStatoEsito(esito: Esito, infoAggiuntiva: InfoAggiuntiva): StatoEsito {
  if (esito.stato === 0) {
    return "chiuso";
  }
  if (esito.stato === 1) {
    if (infoAggiuntiva.stato === 2) {
      return "sospeso";
    }
    return "aperto";
  }
  return "chiuso"; // caso di default in caso di dati inconsistenti
}

type typeEsitoColor = ReturnType<typeof esitoColors>;
const StyledEsitoButton = styled.button<{
  isInCarrello?: boolean;
  variazioneQuota?: VariazioneQuota;
  modalitaVisualizzazione?: number;
  statoEsito?: StatoEsito;
  isSchedaAvvenimentoButton?: boolean;
  coloriVariazioneEsito: typeEsitoColor;
  backGroundColorDescrizioneButton?: string;
  backgroundColorIsInCarrelloEsitoButton: string;
  hasQuotaMaggiorata?: boolean;
}>`
  height: 45px;
  background-color: ${(props) => (props.isInCarrello ? props.backgroundColorIsInCarrelloEsitoButton : "#ededed")};
  color: ${(props) => (props.isInCarrello ? "#ffffff" : "#333333")};
  font-size: ${(props) =>
    props.modalitaVisualizzazione === 2 || props.modalitaVisualizzazione === 3 ? "0.875rem" : "1rem"};
  font-family: Roboto;
  letter-spacing: 0;
  line-height: 19px;
  text-align: center;
  border: none;
  border-radius: 8px;
  margin: 0;
`;

const StyledEsitoQuotaButton = styled(StyledEsitoButton)`
  min-width: 55px;
  padding: 0 1px;
  background-color: ${(props) => props.coloriVariazioneEsito?.noHover.backgroundColor || "#ededed"};
  cursor: pointer;
  color: ${(props) => props.coloriVariazioneEsito?.noHover.quotaColor || "#333333"};
  &:hover {
    /* prematch background-color: ${(props) => props.coloriVariazioneEsito?.hover.backgroundColor || "aac21f"};
    live background-color: ${(props) => props.coloriVariazioneEsito?.hover.backgroundColor || "444444"}; */
    background-color: ${(props) => props.coloriVariazioneEsito.hover.backgroundColor};
    color: ${(props) => props.coloriVariazioneEsito.hover.quotaColor};
  }
  &:disabled {
    background-color: ${(props) => props.coloriVariazioneEsito.noHover.backgroundColor || "ededed"};
    /* rgb(51, 51, 51) = #333333 */
    color: rgb(51, 51, 51);
    opacity: 0.6;
    cursor: default;
  }
  border: 1.62px solid ${(props) => props.coloriVariazioneEsito?.noHover.borderColor || "#ededed"};
`;

const StyledEsitoDescrizione = styled.div`
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const StyledEsitoQuotaDescrizioneButton = styled(StyledEsitoButton)`
  width: 100%;
  min-width: ${(props) => (props.isSchedaAvvenimentoButton ? "120px" : "55px")};
  padding: 0 1px;
  cursor: pointer;
  &:hover,
  &:hover div {
    background-color: ${(props) =>
      props.coloriVariazioneEsito
        ? props.coloriVariazioneEsito.hover.backgroundColor
        : ""}; // DEBT 2: Prevedere caso default
    color: ${(props) => (props.coloriVariazioneEsito ? props.coloriVariazioneEsito.hover.descrizioneColor : "")};
  }
  &:disabled {
    background-color: #ededed;
    /* rgb(51 51 51) = #333333 */
    color: rgb(51 51 51);
    opacity: 0.6;
    cursor: default;
  }
  ${StyledEsitoDescrizione} {
    color: ${(props) => (props.coloriVariazioneEsito ? props.coloriVariazioneEsito.noHover.descrizioneColor : "")};
  }
`;

const StyledEsitoQuotaDescrizioneConVariazioneButton = styled(StyledEsitoQuotaDescrizioneButton)`
  border: ${(props) =>
    props.variazioneQuota !== "nessuna"
      ? `solid 1.62px ${props.coloriVariazioneEsito?.noHover.quotaColor}` || "none"
      : "none"};
  color: ${(props) => props.coloriVariazioneEsito?.noHover.quotaColor || "#333333"};
  background-color: ${(props) => props.coloriVariazioneEsito?.noHover.backgroundColor || "#ededed"};
`;

const StyledEsitoNonQuotatoButton = styled(StyledEsitoButton)`
  width: 55px;
  opacity: 0.6;
`;

const StyledEsitoQuotaHotBetsButton = styled(StyledEsitoButton)`
  min-width: 96px;
  height: 50px;
  padding: 0 1px;
  background-color: ${(props) => props.coloriVariazioneEsito?.noHover.backgroundColor || "#ededed"};
  cursor: pointer;
  color: ${(props) => props.coloriVariazioneEsito?.noHover.quotaColor || "#333333"};
  &:hover {
    background-color: ${(props) => props.coloriVariazioneEsito.hover.backgroundColor};
    color: ${(props) => props.coloriVariazioneEsito.hover.quotaColor};
  }
  &:disabled {
    background-color: ${(props) => props.coloriVariazioneEsito.noHover.backgroundColor || "#ededed"};
    color: rgb(51, 51, 51);
    opacity: 0.6;
    cursor: default;
  }
  border: 1.62px solid ${(props) => props.coloriVariazioneEsito?.noHover.borderColor || "#ededed"};
  border-radius: ${(props) => (props.hasQuotaMaggiorata ? "0 8px 8px 0" : "8px")};
`;

type VariazioneQuota = "rialzo" | "ribasso" | "nessuna";

function esitoColors(
  variazioneQuota: VariazioneQuota = "nessuna",
  statoEsito: StatoEsito = "aperto",
  isInCarrello: boolean,
  colorBytypeEsito: string = "",
  descrizioneColor: string = "#333333",
) {
  if (statoEsito === "chiuso" || statoEsito === "sospeso") {
    return {
      hover: {
        backgroundColor: "#ededed",
        descrizioneColor: "#333333",
        quotaColor: "#333333",
        arrowColor: "",
        borderColor: "#EDEDED",
      },
      noHover: {
        backgroundColor: "#ededed",
        descrizioneColor: "#333333",
        quotaColor: "#333333",
        arrowColor: "",
        borderColor: "#EDEDED",
      },
    };
  }
  switch (variazioneQuota) {
    case "nessuna":
      const hover = {
        backgroundColor: colorBytypeEsito,
        descrizioneColor: "#ffffff",
        quotaColor: "#ffffff",
        arrowColor: "",
        borderColor: "#ededed",
      };
      if (isInCarrello) {
        return {
          hover: hover,
          noHover: {
            backgroundColor: colorBytypeEsito,
            descrizioneColor: "#FFFFFF",
            quotaColor: "#FFFFFF",
            arrowColor: "",
            borderColor: "#ededed",
          },
        };
      } else {
        return {
          hover: hover,
          noHover: {
            backgroundColor: "#ededed",
            descrizioneColor: descrizioneColor,
            quotaColor: "#333333",
            arrowColor: "",
            borderColor: "#ededed",
          },
        };
      }

    case "rialzo":
      if (isInCarrello) {
        return {
          hover: {
            backgroundColor: "#3B914C",
            descrizioneColor: "#FFF",
            quotaColor: "#ffffff",
            arrowColor: "#FFF",
            borderColor: "#3B914C",
          },
          noHover: {
            backgroundColor: "#3B914C",
            descrizioneColor: "#FFF",
            quotaColor: "#ffffff",
            arrowColor: "#FFF",
            borderColor: "#3B914C",
          },
        };
      } else {
        return {
          hover: {
            backgroundColor: "#3B914C",
            descrizioneColor: "#FFF",
            quotaColor: "#ffffff",
            arrowColor: "#FFF",
            borderColor: "#3B914C",
          },
          noHover: {
            backgroundColor: "#CEE5D8",
            descrizioneColor: "#3B914C",
            quotaColor: "#3B914C",
            arrowColor: "#3B914C",
            borderColor: "#3B914C",
          },
        };
      }

    case "ribasso":
      if (isInCarrello) {
        return {
          hover: {
            backgroundColor: "#EB1E23",
            descrizioneColor: "#FFF",
            quotaColor: "#ffffff",
            arrowColor: "#FFF",
            borderColor: "#EB1E23",
          },
          noHover: {
            backgroundColor: "#EB1E23",
            descrizioneColor: "#FFF",
            quotaColor: "#ffffff",
            arrowColor: "#FFF",
            borderColor: "#EB1E23",
          },
        };
      } else {
        return {
          hover: {
            backgroundColor: "#EB1E23",
            descrizioneColor: "#FFF",
            quotaColor: "#ffffff",
            arrowColor: "#FFF",
            borderColor: "#EB1E23",
          },
          noHover: {
            backgroundColor: "#FBD2D3",
            descrizioneColor: "#EB1E23",
            quotaColor: "#EB1E23",
            arrowColor: "#EB1E23",
            borderColor: "#EB1E23",
          },
        };
      }
  }
}
