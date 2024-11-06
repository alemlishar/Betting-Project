import React, { useCallback, useEffect, useState } from "react";
import { css } from "styled-components/macro";
import { ReactComponent as IcoDanger } from "src/assets/images/icon-danger.svg";
import { deletePrenotazioneByNickname } from "src/components/prenotazioni/prenotazioni-api";
import useSWR, { mutate } from "swr";
import { NickName } from "src/types/chiavi";
import { FormattedMessage } from "react-intl";

type EliminaPrenotazioneProps = {
  nickname: NickName;
  onAnnulla(): void;
  onProcedi(): void;
};

export function EliminaPrenotazione({ nickname, onAnnulla, onProcedi }: EliminaPrenotazioneProps) {
  const deletePrenotazione = useCallback(async () => {
    await mutate("deleteBooking", deletePrenotazioneByNickname(nickname));
    onProcedi();
  }, [nickname, onProcedi]);
  return (
    <div
      css={css`
        height: 70px;
        border-radius: 8px;
        background-color: #ffb800;
        padding: 10px;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: [icon-alert] 65px [message] 1fr repeat(2, [button] auto);
        grid-column-gap: 10px;
        align-items: center;
      `}
    >
      <IcoDanger
        css={css`
          height: 25px;
          width: auto;
          grid-column: icon-alert;
          margin: 0 10px 0 20px;
        `}
      />
      <div
        css={css`
          grid-column: message;
          color: #222222;
          font-family: Roboto;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0;
          line-height: 16px;
        `}
      >
        <FormattedMessage
          defaultMessage="Vuoi procedere con l’eliminazione della prenotazione"
          description="label messagge delete booking"
        />
        <span
          css={css`
            font-weight: 800;
          `}
        >
          {nickname}
        </span>
        ?
      </div>
      <button
        data-qa={`${nickname} booking-annull-delete-button`}
        css={css`
          grid-column: button 1;
          box-sizing: border-box;
          height: 50px;
          width: 150px;
          border: 2px solid #222222;
          border-radius: 8px;
          background-color: transparent;
          color: #222222;
          font-family: Mulish;
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 0;
          line-height: 18px;
          text-align: center;
          cursor: pointer;
        `}
        onClick={() => {
          onAnnulla();
        }}
      >
        <FormattedMessage defaultMessage="Annulla" description="label button annull delete booking" />
      </button>
      <button
        data-qa={`${nickname} booking-procede-delete-button`}
        css={css`
          grid-column: button 2;
          height: 50px;
          width: 150px;
          border-radius: 8px;
          background-color: #222222;
          color: #ffffff;
          font-family: Mulish;
          font-size: 18px;
          font-weight: bold;
          letter-spacing: 0;
          line-height: 18px;
          text-align: center;
          border: none;
          cursor: pointer;
        `}
        onClick={() => {
          deletePrenotazione();
        }}
      >
        <FormattedMessage defaultMessage="Procedi" description="label button procede delete booking" />
      </button>
    </div>
  );
}
