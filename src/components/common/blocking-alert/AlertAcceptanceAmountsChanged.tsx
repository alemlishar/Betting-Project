import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IconDangerWhite } from "src/assets/images/icon-danger-white.svg";
import { ReactComponent as IconTimer } from "src/assets/images/icon-timer.svg";
import {
  alertColors,
  StyledAlertButtonPrimary,
  StyledAlertButtonSecondary,
  StyledAlertTitle,
  StyledDescription,
  StyledHeading,
} from "src/components/common/blocking-alert/BlockingAlert";
import { StyledDialogContainer } from "src/components/common/full-screen-alert/StyledDialogContainer";
import { parseAsMoney } from "src/helpers/format-data";
import { formatCents } from "src/helpers/MoneyFormatterUtility";
import { css } from "styled-components/macro";

type AlertTimeoutProps = {
  primaryButtonAction: () => void;
  secondaryButtonAction: () => void;
  oldPuntata: number;
  newPuntata: number;
};
export function AlertAcceptanceAmountsChanged(props: AlertTimeoutProps) {
  const { oldPuntata, newPuntata, primaryButtonAction, secondaryButtonAction } = props;
  const themeAlert = alertColors("danger");

  const [counter, setCounter] = useState(60);
  useEffect(() => {
    const interval = setInterval(() => {
      if (counter > 0) {
        setCounter((counter) => counter - 1);
      } else {
        secondaryButtonAction();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [counter, setCounter, secondaryButtonAction]);

  return (
    <StyledDialogContainer>
      <div
        css={css`
          display: flex;
          align-items: center;
          background-color: ${themeAlert.backgroundColor};
          height: 128px;
          width: 1065px;
          border-radius: 8px 8px 0 0;
          box-sizing: border-box;
          padding: 0 30px;
        `}
      >
        <StyledAlertTitle themeAlert={themeAlert}>
          <IconDangerWhite style={{ gridRow: `-1 / 1`, gridColumn: `icon`, height: `58px`, width: `58px` }} />
          <StyledHeading themeAlert={themeAlert}>
            <FormattedMessage
              description="header title of amounts changed acceptance alert"
              defaultMessage="Proposta nuova puntata"
            />
          </StyledHeading>
        </StyledAlertTitle>
      </div>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 30px;
          width: 1065px;
          border-radius: 0 0 8px 8px;
          box-sizing: border-box;
          background-color: #ffffff;
          color: #333333;
        `}
      >
        <StyledDescription>
          <FormattedMessage
            defaultMessage="La scommessa può essere convalidata per un importo di € {newamount}"
            description="description of amounts changed acceptance alert"
            values={{ newamount: formatCents(newPuntata, 2).replace(".", ",") }}
          />
        </StyledDescription>

        <div
          css={css`
            display: grid;
            grid-template-rows: [separator-top]30px [description] 23px [value] 21px [separator-bottom]auto;
            grid-template-columns: [puntata] auto [countdown] max-content [iconTimer]min-content;
            grid-column-gap: 30px;
            margin: 30px 0;
          `}
        >
          <div
            style={{ gridRow: `${"separator-top"}` }}
            css={css`
              grid-column: 1 / -1;
              height: 1px;
              background-color: #979797;
            `}
          />
          <div
            css={css`
              grid-column: puntata;
              grid-row: description;
              height: 23px;
              width: 91px;
              color: #333333;
              font-family: Mulish;
              font-size: 1.125rem;
              font-weight: 900;
              letter-spacing: 0;
              line-height: 23px;
              text-transform: uppercase;
            `}
          >
            <FormattedMessage
              defaultMessage="Puntata"
              description="new amount title of amounts changed acceptance alert"
            />
          </div>
          <div
            css={css`
              grid-column: puntata;
              grid-row: value;
              height: 21px;
              width: 209px;
              color: #333333;
              font-family: Roboto;
              font-size: 1.125rem;
              letter-spacing: 0;
              line-height: 21px;
            `}
          >
            <FormattedMessage
              defaultMessage="Da {oldpuntata} a"
              description="old amount label of amounts changed acceptance alert"
              values={{ oldpuntata: parseAsMoney(oldPuntata) }}
            />
            <span
              css={`
                font-weight: 700;
              `}
            >{` € ${formatCents(newPuntata, 2).replace(".", ",")}`}</span>
          </div>

          <div
            css={css`
              grid-column: countdown;
              grid-row: description;
              color: #333333;
              font-family: Mulish;
              font-size: 1.125rem;
            `}
          >
            <FormattedMessage
              defaultMessage="Proposta in scadenza tra"
              description="countdown label of amounts changed acceptance alert"
            />
          </div>

          <div
            css={css`
              grid-column: countdown;
              grid-row: value;
              font-size: 1.125rem;
              font-weight: 900;
              letter-spacing: 0;
              line-height: 21px;
              text-align: right;
              color: #333333;
              font-family: Roboto;
            `}
          >
            {`${counter === 60 ? "00:01:00" : counter > 9 ? `00:00:${counter}` : `00:00:0${counter}`}`}
          </div>
          <IconTimer style={{ gridRow: `0 / 1`, gridColumn: `iconTimer` }} />
        </div>

        <div
          style={{ gridRow: `${"separator-bottom"}` }}
          css={css`
            grid-column: 1 / -1;
            height: 1px;
            background-color: #979797;
          `}
        />
        <div
          css={css`
            display: grid;
            grid-template-columns: repeat(2, [button] 150px);
            grid-column-gap: 10px;
            justify-content: flex-end;
            margin-top: 30px;
          `}
        >
          <StyledAlertButtonSecondary
            onClick={() => {
              secondaryButtonAction();
            }}
          >
            <FormattedMessage
              description="rifiuta button of amounts changed acceptance alert"
              defaultMessage="Rifiuta"
            />
          </StyledAlertButtonSecondary>

          <StyledAlertButtonPrimary
            onClick={() => {
              primaryButtonAction();
            }}
          >
            <FormattedMessage
              description="accetta button of amounts changed acceptance alert"
              defaultMessage="Accetta"
            />
          </StyledAlertButtonPrimary>
        </div>
      </div>
    </StyledDialogContainer>
  );
}
