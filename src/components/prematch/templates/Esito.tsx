import React from "react";
import {
  EsitoNonQuotatoMemo,
  EsitoProps,
  EsitoQuota,
  EsitoQuotaDescrizione,
  EsitoQuotaHotBets,
} from "src/components/esito/Esito";

export const EsitoQuotaPrematchMemo = React.memo((props: EsitoProps) => (
  <EsitoQuota {...props} backgroundColorIsInCarrelloEsitoButton={"#aac21f"} colorBytypeEsito={"#aac21f"} />
));

export const EsitoQuotaDescrizionePrematchMemo = React.memo((props: EsitoProps) => (
  <EsitoQuotaDescrizione
    {...props}
    descrizioneEnabledTextColor={"#ffffff"}
    descrizioneTextColor={"#005936"}
    backgroundColorIsInCarrelloEsitoButton={"#aac21f"}
    backGroundColorDescrizioneButton={"#aac21f"}
    colorBytypeEsito={"#aac21f"}
  />
));

export const EsitoQuotaDescrizioneHotBetsPrematchMemo = React.memo((props: EsitoProps) => (
  <EsitoQuotaDescrizione
    {...props}
    descrizioneEnabledTextColor={"#ffffff"}
    descrizioneTextColor={"#333333"}
    backgroundColorIsInCarrelloEsitoButton={"#aac21f"}
    backGroundColorDescrizioneButton={"#aac21f"}
    colorBytypeEsito={"#aac21f"}
  />
));

export const EsitoNonQuotatoPrematchMemo = React.memo((props: {}) => <EsitoNonQuotatoMemo />);

export const EsitoQuotaHotBetsMemo = React.memo((props: EsitoProps & { hasQuotaMaggiorata?: boolean }) => {
  const { hasQuotaMaggiorata } = props;
  return (
    <EsitoQuotaHotBets
      {...props}
      backgroundColorIsInCarrelloEsitoButton={"#aac21f"}
      colorBytypeEsito={"#aac21f"}
      hasQuotaMaggiorata={hasQuotaMaggiorata}
    />
  );
});
