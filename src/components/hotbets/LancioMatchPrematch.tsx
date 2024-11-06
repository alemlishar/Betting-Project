import React from "react";
import { HotbetsDateTime } from "src/components/hotbets/Hotbets";
import { LancioMatchTemplate } from "src/components/hotbets/LancioMatchTemplate";
import { Avvenimento, Disciplina, InfoAggiuntiva, Scommessa } from "src/components/prematch/prematch-api";
import { EsitoQuotaDescrizioneHotBetsPrematchMemo } from "src/components/prematch/templates/Esito";
import { NPlusPremtachMemo } from "src/components/prematch/templates/NPlus";
import { useAlberaturaPrematch } from "src/components/prematch/usePrematch";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import {
  ChiaveInfoAggiuntiva,
  ChiaveScommessa,
  makeChiaveInfoAggiuntiva,
  makeChiaveManifestazione,
  makeChiaveScommessa,
} from "src/types/chiavi";

type LancioMatchPrematchProps = {
  index: number;
  avvenimento: Avvenimento;
  disciplina: Disciplina;
  infoAggiuntivaMap: Record<ChiaveInfoAggiuntiva, InfoAggiuntiva>;
  scommessaMap: Record<ChiaveScommessa, Scommessa>;
};

export function LancioMatchPrematch(props: LancioMatchPrematchProps) {
  const { index, disciplina, avvenimento, scommessaMap, infoAggiuntivaMap } = props;
  const { openSchedaAvvenimentoPrematch } = useNavigazioneActions();
  const alberaturaPrematch = useAlberaturaPrematch();

  const manifestazione =
    alberaturaPrematch &&
    alberaturaPrematch.manifestazioneMap[
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
      headerColor={"#005936"}
      NPlus={NPlusPremtachMemo}
      Esito={EsitoQuotaDescrizioneHotBetsPrematchMemo}
      openSchedaAvvenimento={openSchedaAvvenimentoPrematch}
      HotbetsHeaderInfo={HotbetsDateTime}
    />
  );
}
