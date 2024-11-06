import React from "react";
import {
  InfoAggiuntiva,
  Avvenimento,
  InfoAggiuntivaAggregator,
  InfoAggiuntivaAggregatorGroup,
  Scommessa,
  Manifestazione,
  Disciplina,
} from "src/components/prematch/prematch-api";
import { ChiaveScommessa, makeChiaveEsito, makeChiaveScommessa } from "src/types/chiavi";
import { css } from "styled-components/macro";
import { rightAlignedColumn } from "src/components/prematch/templates/utils";
import { EsitoQuotaDescrizionePrematchMemo } from "src/components/prematch/templates/Esito";
import { DescrizioneInfoAggiuntivaAggregator } from "src/components/prematch/templates/DescrizioneInfoAggiuntivaAggregator";
import { dateFormatter, timeFormatter } from "src/helpers/format-date";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

type InfoAggiuntivaAggregatorGroupDialogProps = {
  infoAggiuntiva: InfoAggiuntiva;
  avvenimento: Avvenimento;
  manifestazione: Manifestazione;
  disciplina: Disciplina;
  infoAggiuntivaAggregator: InfoAggiuntivaAggregator;
  infoAggiuntivaAggregatorGroup: InfoAggiuntivaAggregatorGroup;
  scommessaMap: Record<ChiaveScommessa, Scommessa>;
};

export function InfoAggiuntivaAggregatorGroupDialog({
  infoAggiuntiva,
  avvenimento,
  manifestazione,
  disciplina,
  infoAggiuntivaAggregator,
  infoAggiuntivaAggregatorGroup,
  scommessaMap,
}: InfoAggiuntivaAggregatorGroupDialogProps) {
  const date = new Date(avvenimento.data);
  const { onCloseInfoAggiuntivaAggregatorModal } = useNavigazioneActions();

  return (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCloseInfoAggiuntivaAggregatorModal();
        }
      }}
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 2;
        background-color: rgba(0, 0, 0, 0.61);
      `}
    >
      <dialog
        open
        css={css`
          position: relative;
          border: 0;
          padding: 0;
          background-color: transparent;
        `}
      >
        <div
          css={css`
            height: 55px;
            border-radius: 12px 12px 0 0;
            background-color: #0b7d3e;
            color: #ffffff;
            display: flex;
            align-items: center;
            padding: 0 30px;
          `}
        >
          <span
            css={css`
              font-family: Mulish;
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 0;
              line-height: 26px;
            `}
          >
            {infoAggiuntiva.descrizione}
          </span>
          <span
            css={css`
              font-family: Roboto;
              font-size: 14px;
              letter-spacing: 0;
              line-height: 23px;
              margin-left: 30px;
            `}
          >
            {avvenimento.descrizione} | {dateFormatter.format(date)} - {timeFormatter.format(date)}
          </span>
        </div>
        <div
          css={css`
            min-width: 1051px;
            height: 381px;
            color: #555;
            padding: 0;
            border: none;
            border-radius: 0 0 12px 12px;
            background-color: #ffffff;
            box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.5);
          `}
        >
          <TemplateDialogNC
            infoAggiuntiva={infoAggiuntiva}
            infoAggiuntivaAggregator={infoAggiuntivaAggregator}
            infoAggiuntivaAggregatorGroup={infoAggiuntivaAggregatorGroup}
            avvenimento={avvenimento}
            scommessaMap={scommessaMap}
            manifestazione={manifestazione}
            disciplina={disciplina}
          />
        </div>
      </dialog>
    </div>
  );
}

type TemplateDialogNCProps = {
  infoAggiuntiva: InfoAggiuntiva;
  infoAggiuntivaAggregator: InfoAggiuntivaAggregator;
  infoAggiuntivaAggregatorGroup: InfoAggiuntivaAggregatorGroup;
  avvenimento: Avvenimento;
  disciplina: Disciplina;
  manifestazione: Manifestazione;
  scommessaMap: Record<ChiaveScommessa, Scommessa>;
};

export function TemplateDialogNC({
  infoAggiuntiva,
  infoAggiuntivaAggregator,
  infoAggiuntivaAggregatorGroup,
  avvenimento,
  manifestazione,
  disciplina,
  scommessaMap,
}: TemplateDialogNCProps) {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: [descrizione-avvenimento] 1fr [esiti] auto;
        row-gap: 10px;
        column-gap: 10px;
        padding: 30px;
      `}
    >
      <React.Fragment key={infoAggiuntiva.key}>
        <div
          css={css`
            grid-column: descrizione-avvenimento;
          `}
        >
          <DescrizioneInfoAggiuntivaAggregator
            infoAggiuntivaAggregator={infoAggiuntivaAggregator}
            infoAggiuntivaAggregatorGroup={infoAggiuntivaAggregatorGroup}
          />
        </div>
        <div
          css={css`
            grid-column: esiti;
            display: grid;
            grid-column-gap: 10px;
            grid-row-gap: 10px;
            grid-template-columns: repeat(4, [esito] min-content);
          `}
        >
          {infoAggiuntiva.esitoList.map((esito, esitoIndex) => {
            return (
              <div
                key={makeChiaveEsito({ ...infoAggiuntiva, codiceEsito: esito.codiceEsito })}
                css={css`
                  grid-column: ${rightAlignedColumn(4, infoAggiuntiva.esitoList.length, esitoIndex)};
                  width: 55px;
                `}
              >
                <EsitoQuotaDescrizionePrematchMemo
                  esito={esito}
                  infoAggiuntiva={infoAggiuntiva}
                  avvenimento={avvenimento}
                  scommessa={
                    scommessaMap[
                      makeChiaveScommessa({
                        codicePalinsesto: avvenimento.codicePalinsesto,
                        codiceAvvenimento: avvenimento.codiceAvvenimento,
                        codiceScommessa: infoAggiuntiva.codiceScommessa,
                      })
                    ]
                  }
                  manifestazione={manifestazione}
                  disciplina={disciplina}
                />
              </div>
            );
          })}
        </div>
      </React.Fragment>
    </div>
  );
}
