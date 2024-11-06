import React from "react";
import {
  EsitoNonQuotatoMemo,
  EsitoProps,
  EsitoQuotaConVariazione,
  EsitoQuotaDescrizione,
  EsitoQuotaDescrizioneConVariazione,
} from "src/components/esito/Esito";

export const EsitoQuotaConVariazioneLiveMemo = React.memo((props: EsitoProps) => (
  <EsitoQuotaConVariazione {...props} backgroundColorIsInCarrelloEsitoButton={"#aac21f"} colorBytypeEsito={"#aac21f"} />
));

export const EsitoQuotaDescrizioneLiveMemo = React.memo((props: EsitoProps) => (
  <EsitoQuotaDescrizione
    {...props}
    backgroundColorIsInCarrelloEsitoButton={"#aac21f"}
    descrizioneEnabledTextColor={"#ffffff"}
    descrizioneTextColor={"#FFB800"}
    backGroundColorDescrizioneButton={"#aac21f"}
    colorBytypeEsito={"#aac21f"}
  />
));

export const EsitoQuotaDescrizioneConVariazioneHotBetsLiveMemo = React.memo((props: EsitoProps) => (
  <EsitoQuotaDescrizioneConVariazione
    {...props}
    backgroundColorIsInCarrelloEsitoButton={"#aac21f"}
    descrizioneEnabledTextColor={"#ffffff"}
    descrizioneTextColor={"#333333"}
    backGroundColorDescrizioneButton={"#aac21f"}
    colorBytypeEsito={"#aac21f"}
  />
));

export const EsitoNonQuotatoLiveMemo = React.memo((props: {}) => <EsitoNonQuotatoMemo />);
