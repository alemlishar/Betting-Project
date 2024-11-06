import React from "react";
import { LivescorePlaceholderHotBets } from "src/components/common/livescore-box/LivescorePlaceholder";
import { LancioMatchTemplate } from "src/components/hotbets/LancioMatchTemplate";
import { EsitoQuotaDescrizioneConVariazioneHotBetsLiveMemo } from "src/components/live/templates/Esito";
import { useLive } from "src/components/live/useLive";
import { Avvenimento, Disciplina, InfoAggiuntiva, Scommessa } from "src/components/prematch/prematch-api";
import { NPlusLiveMemo } from "src/components/prematch/templates/NPlus";
import { BadgeLive } from "src/components/prematch/TopLive";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import {
  ChiaveInfoAggiuntiva,
  ChiaveScommessa,
  makeChiaveInfoAggiuntiva,
  makeChiaveManifestazione,
  makeChiaveScommessa,
} from "src/types/chiavi";

type LancioMatchLiveProps = {
  index: number;
  avvenimento: Avvenimento;
  disciplina: Disciplina;
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva>;
  scommessaMap: Record<ChiaveScommessa, Scommessa>;
};
export function LancioMatchLive(props: LancioMatchLiveProps) {
  const { index, disciplina, avvenimento, scommessaMap, infoAggiuntivaMap } = props;
  const { openSchedaAvvenimentoLive } = useNavigazioneActions();
  const { alberatura } = useLive();

  const manifestazione =
    alberatura &&
    alberatura.manifestazioneMap[
      makeChiaveManifestazione({
        codiceDisciplina: disciplina!.codiceDisciplina,
        codiceManifestazione: avvenimento.codiceManifestazione,
      })
    ];

  const scommessa = scommessaMap
    ? (scommessaMap[
        makeChiaveScommessa({
          ...avvenimento,
          codiceScommessa: avvenimento.firstScommessa.codiceScommessa,
        })
      ] as Scommessa)
    : undefined;

  const infoAggiuntiva =
    scommessa && infoAggiuntivaMap
      ? infoAggiuntivaMap[makeChiaveInfoAggiuntiva(scommessa.infoAggiuntivaKeyDataList[0])]
      : undefined;

  if (!infoAggiuntiva || !scommessa || !manifestazione) {
    return null;
  }

  return (
    <LancioMatchTemplate
      index={index}
      avvenimento={avvenimento}
      disciplina={disciplina}
      manifestazione={manifestazione}
      scommessa={scommessa}
      infoAggiuntiva={infoAggiuntiva}
      headerColor={"#333333"}
      NPlus={NPlusLiveMemo}
      Esito={EsitoQuotaDescrizioneConVariazioneHotBetsLiveMemo}
      openSchedaAvvenimento={openSchedaAvvenimentoLive}
      HotbetsHeaderInfo={LivescorePlaceholderHotBets}
      Badge={BadgeLive}
    />
  );
}
