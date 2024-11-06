import React from "react";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components/macro";
import { StyledDialogContainer } from "src/components/common/full-screen-alert/StyledDialogContainer";
import { ReactComponent as IconDanger } from "src/assets/images/icon-danger.svg";

export function AlertAccettazione() {
  return (
    <StyledDialogContainer>
      <StyledDialog open>
        <div
          css={css`
            background-color: #ffb800;
            position: relative;
            display: grid;
            grid-template-rows: [heading] max-content [description] max-content;
            grid-template-columns: [icon] 58px [message] auto;
            padding: 70px;
            grid-column-gap: 30px;
            grid-row-gap: 5px;
            align-items: center;
            box-sizing: border-box;
            border-radius: 8px;
            color: #333333;
          `}
        >
          <IconDanger
            style={{ gridRow: `1 / -1`, gridColumn: `icon` }}
            css={css`
              height: 58px;
              width: 58px;
            `}
          />
          <div
            style={{ gridRow: `heading`, gridColumn: `message` }}
            css={css`
              font-family: Mulish;
              font-size: 30px;
              font-weight: 800;
            `}
          >
            <FormattedMessage
              description="Titolo Alert vendita in accettazione"
              defaultMessage="Scommessa in accettazione"
            />
          </div>
          <div
            style={{ gridRow: `description`, gridColumn: `message` }}
            css={css`
              font-family: Roboto;
              font-size: 18px;
            `}
          >
            <FormattedMessage
              description="Submessage modale accettazione Alert "
              defaultMessage="I nostri quotisti stanno valutando la tua scommessa, attendi l’esito per poter effettuare nuove operazioni"
            />
          </div>
        </div>
      </StyledDialog>
    </StyledDialogContainer>
  );
}

const StyledDialog = styled.dialog`
  height: 200px;
  width: 1065px;
  border: 0;
  padding: 0;
  border-radius: 8px;
`;
