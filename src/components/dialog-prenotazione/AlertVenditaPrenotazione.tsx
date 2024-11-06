import React from "react";
import { FormattedMessage } from "react-intl";
import { StyledDialogContainer } from "src/components/common/full-screen-alert/StyledDialogContainer";
import styled, { css } from "styled-components/macro";
import { ReactComponent as IconHourGlass } from "src/assets/images/icon-hourglass.svg";
import {
  alertColors,
  StyledAlertTitle,
  StyledDescription,
  StyledHeading,
} from "src/components/common/blocking-alert/BlockingAlert";

type AlertVenditaPrenotazioneProps = {
  selledTickets: number;
  totalTickets: number;
};

export function AlertVenditaPrenotazioneWithProgressBar(props: AlertVenditaPrenotazioneProps) {
  return (
    <AlertWithProgressBar
      {...props}
      title={
        <FormattedMessage
          description="Vendita prenotazione in corso Label Alert "
          defaultMessage="Vendita prenotazione in corso"
        />
      }
      description={
        <FormattedMessage
          description="Submessage Vendita prenotazione in corso Label Alert "
          defaultMessage="Attendi l’esito per poter effettuare nuove operazioni"
        />
      }
      colorProgressBar={"#333"}
    />
  );
}

export function AlertUnderAcceptancePrenotazioneWithProgressBar(props: AlertVenditaPrenotazioneProps) {
  return (
    <AlertWithProgressBar
      {...props}
      title={
        <FormattedMessage
          description="Vendita prenotazione in accettazione Label Alert "
          defaultMessage="Scommessa in accettazione"
        />
      }
      description={
        <FormattedMessage
          description="Submessage Vendita prenotazione in accettazione Label Alert "
          defaultMessage="I nostri quotisti stanno valutando la tua scommessa, attendi l’esito per poter effettuare nuove operazioni"
        />
      }
      colorProgressBar={"#CBCBCB"}
    />
  );
}

type AlertWithProgresBarProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  selledTickets: number;
  totalTickets: number;
  colorProgressBar: string;
};
export function AlertWithProgressBar({
  title,
  description,
  selledTickets,
  totalTickets,
  colorProgressBar,
}: AlertWithProgresBarProps) {
  return (
    <StyledDialogContainer>
      <StyledDialog open>
        <div
          css={css`
            display: flex;
            align-items: center;
            background-color: #ffb800;
            height: 128px;
            width: 1065px;
            border-radius: 8px 8px 0 0;
            box-sizing: border-box;
            padding: 0 30px;
          `}
        >
          <StyledAlertTitle themeAlert={alertColors("warning")}>
            <IconHourGlass style={{ gridRow: `-1 / 1`, gridColumn: `icon`, height: `58px`, width: `58px` }} />
            <StyledHeading themeAlert={alertColors("warning")}>{title}</StyledHeading>
          </StyledAlertTitle>
        </div>

        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 30px;
            width: 1065px;
            box-sizing: border-box;
            background-color: #ffffff;
            color: #333333;
            border-radius: 0 0 8px 8px;
          `}
        >
          <StyledDescription>{description}</StyledDescription>

          <div
            css={css`
              height: 18px;
              border-radius: 0 0 8px 8px;
              background-color: #ffffff;
              box-sizing: border-box;
              display: grid;
              grid-template-columns: [progress] 907px [counter] auto;
              grid-column-gap: 20px;
              align-items: center;
              padding: 30px 0;
            `}
          >
            <StyledProgressContainer style={{ gridColumn: `progress` }}>
              <progress
                id={"venditaMultibigliettoProgress"}
                max={totalTickets}
                value={selledTickets}
                css={css`
                  &&[value] {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 18px;
                    width: 907px;
                    box-sizing: border-box;
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    &::-webkit-progress-bar {
                      padding: 0px;
                      background-color: transparent;
                    }
                    &::-webkit-progress-value {
                      background-color: ${colorProgressBar};
                      border-radius: 9px;
                    }
                  }
                `}
              />
            </StyledProgressContainer>
            <label
              htmlFor={"venditaMultibigliettoProgress"}
              css={css`
                color: ${colorProgressBar};
                font-family: Mulish;
                font-weight: 900;
                font-size: 18px;
              `}
              style={{ gridColumn: `counter` }}
            >
              {`${selledTickets} `}
              <span
                css={css`
                  font-family: Mulish;
                  font-weight: 400;
                `}
              >
                <FormattedMessage
                  description="counte Vendita prenotazione in corso Label Alert "
                  defaultMessage="di {totale}"
                  values={{ totale: totalTickets }}
                />
              </span>
            </label>
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

const StyledProgressContainer = styled.div`
  height: 18px;
  box-sizing: border-box;
  border: 2px solid #cbcbcb;
  border-radius: 9px;
  background-color: transparent;
  position: relative;
`;
