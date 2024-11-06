import React from "react";
import { StyledMinimizationIcon } from "src/components/dialog-prenotazione/DialogPrenotazioneSingoloBiglietto";
import { DialogPrenotazioneState } from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import styled, { css } from "styled-components/macro";
import { ReactComponent as IcoClose } from "src/assets/images/icon-preno-close-black.svg";
import { ReactComponent as IcoPlus } from "src/assets/images/icon-preno-plus-black.svg";
import { FormattedMessage } from "react-intl";

type DialogPrenotazioneProps = {
  dialogPrenotazioneState: DialogPrenotazioneState;
};

export function DialogPrenotazioneMinimizzata({ dialogPrenotazioneState }: DialogPrenotazioneProps) {
  const { closeDialogPrenotazione, unminimizeDialogPrenotazione } = useNavigazioneActions();

  const nickname =
    dialogPrenotazioneState.dialogPrenotazioneCode || dialogPrenotazioneState.dialogPrenotazioneNickname || "";
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: [nickname] max-content [buttons] 90px;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        bottom: 0;
        left: 70px;
        height: 60px;
        min-width: 450px;
        background-color: #333333;
        padding: 0 10px 0 20px;
        border-radius: 12px 12px 0 0;
        box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.44);
        z-index: 2;
      `}
    >
      <div
        css={css`
          color: #ffffff;
          font-family: Mulish;
          font-size: 18px;
          letter-spacing: 0;
        `}
      >
        <FormattedMessage description=" Prenotazione label minimizzata" defaultMessage="Prenotazione: " />{" "}
        <span
          css={css`
            font-weight: bold;
          `}
        >
          {nickname}
        </span>
      </div>
      <StyledIconContainer>
        <StyledMinimizationIcon
          onClick={() => {
            unminimizeDialogPrenotazione();
          }}
        >
          <IcoPlus />
        </StyledMinimizationIcon>
        <StyledMinimizationIcon onClick={() => closeDialogPrenotazione(nickname)}>
          <IcoClose />
        </StyledMinimizationIcon>
      </StyledIconContainer>
    </div>
  );
}

const StyledIconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
