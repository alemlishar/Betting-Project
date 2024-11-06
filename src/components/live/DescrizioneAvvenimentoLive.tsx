import React from "react";
import { css } from "styled-components/macro";
import { DescrizioneAvvenimentoProps } from "src/components/prematch/templates/DescrizioneAvvenimento";
import { RedCards } from "src/components/live/livescore/RedCards/RedCards";
import { LivescoreBox } from "src/components/live/LiveScoreBox";
import { LivescorePlaceholder } from "src/components/common/livescore-box/LivescorePlaceholder";

export function DescrizioneAvvenimentoLive({ avvenimento, onOpen }: DescrizioneAvvenimentoProps) {
  const isTeamVsTeamEvent = avvenimento.descrizione.includes("-");

  return (
    <div
      css={css`
        grid-column: avvenimento;
        display: grid;
        grid-template-columns: [livescore] minmax(100px, max-content) [descrizione] auto;
        grid-column-gap: 10px;
      `}
    >
      <div
        css={css`
          grid-column: livescore;
          box-sizing: border-box;
        `}
      >
        {avvenimento.livescore ? (
          <LivescoreBox codiceDisciplina={avvenimento.codiceDisciplina} livescore={avvenimento.livescore} />
        ) : (
          <LivescorePlaceholder />
        )}
      </div>
      <div
        css={css`
          grid-column: descrizione;
          color: #333333;
          width: fit-content;
          font-family: Roboto;
          font-size: 1rem;
          line-height: 23px;
          font-weight: 700;
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}
        onClick={() => {
          onOpen(avvenimento);
        }}
      >
        {avvenimento.descrizione.split(" - ").map((team, i) => {
          if (isTeamVsTeamEvent) {
            return (
              <div
                key={i}
                css={css`
                  display: grid;
                  grid-template-columns: [desc] min-content [card] 23px;
                  column-gap: 6px;
                  align-items: center;
                  cursor: pointer;
                `}
              >
                <div
                  css={css`
                    grid-column: desc;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    max-width: 175px;
                  `}
                >
                  {team}
                </div>
                <div
                  css={css`
                    grid-column: card;
                  `}
                >
                  {avvenimento.livescore && avvenimento.livescore.cardList.length > 0 && (
                    <RedCards livescore={avvenimento.livescore} teamId={i === 0 ? 1 : 2} />
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={i}
              css={css`
                cursor: pointer;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                word-break: break-word;
                overflow: hidden;
              `}
            >
              {team}
            </div>
          );
        })}
      </div>
    </div>
  );
}
