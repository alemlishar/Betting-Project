import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { HotBets } from "src/components/hotbets/Hotbets";
import { LastMinute } from "src/components/prematch/LastMinute";
import { HomePagePrematchState } from "src/components/prematch/prematch-api";
import { TopLive } from "src/components/prematch/TopLive";
import { TopPreMatch } from "src/components/prematch/TopPreMatch";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import styled, { css } from "styled-components/macro";

export function useHomePagePrematch() {
  const [state, setState] = useState<HomePagePrematchState>("prematch");
  return { state, setState };
}

export type HomePrematchProps = {
  state: HomePagePrematchState;
};

export function HomePrematch({ state }: HomePrematchProps) {
  const { changeHomePageTab } = useNavigazioneActions();
  return (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <HotBets />
      <StyledSelectorTipologyContainer>
        <StyledTipologySelector
          isActive={state === "prematch"}
          css={css`
            grid-area: top-prematch;
          `}
          onClick={() => changeHomePageTab("prematch")}
        >
          <StyledTipologySelectorLabel>Top Pre-match</StyledTipologySelectorLabel>
          <StyledTipologyActive isActive={state === "prematch"} />
        </StyledTipologySelector>
        <StyledTipologySelector
          isActive={state === "live"}
          css={css`
            grid-area: top-live;
          `}
          onClick={() => changeHomePageTab("live")}
        >
          <StyledTipologySelectorLabel>
            <FormattedMessage description="Label del tab 'top live' nella home page" defaultMessage="Top Live" />
          </StyledTipologySelectorLabel>
          <StyledTipologyActive isActive={state === "live"} />
        </StyledTipologySelector>

        <StyledTipologySelector
          isActive={state === "sceltiPerTe"}
          css={css`
            grid-area: last-minute;
          `}
          onClick={() => changeHomePageTab("sceltiPerTe")}
        >
          <StyledTipologySelectorLabel>
            <FormattedMessage description="Label del tab 'last minute' nella home page" defaultMessage="Last Minute" />
          </StyledTipologySelectorLabel>
          <StyledTipologyActive isActive={state === "sceltiPerTe"} />
        </StyledTipologySelector>
      </StyledSelectorTipologyContainer>
      {(() => {
        switch (state) {
          case "prematch":
            return <TopPreMatch />;
          case "live":
            return <TopLive />;
          case "sceltiPerTe":
            return <LastMinute />;
        }
      })()}
    </div>
  );
}

const StyledSelectorTipologyContainer = styled.div`
  display: grid;
  align-items: center;
  height: 55px;
  border-radius: 4px 4px 0 0;
  background-color: #ffffff;
  grid-template-columns: auto auto auto;
  grid-template-areas: "top-prematch top-live last-minute";
  justify-content: flex-start;
`;

const StyledTipologySelector = styled.span<{ isActive: boolean }>`
  height: 55px;
  color: #333333;
  font-size: ${(props) => (props.isActive ? "20px" : "18px")};
  cursor: pointer;
  padding: ${(props) => (props.isActive ? "16px 10px 0px 10px" : "16px 0px 0px 0px")};
  margin: ${(props) => (props.isActive ? "0 10px" : "0")};
  background-color: #ffffff;
  transform: ${(props) => (props.isActive === true ? "translateY(-20%)" : "")};
  transition: 0.2s;
  border-radius: ${(props) => (props.isActive ? "4px 4px 0 0" : "")};
  box-shadow: ${(props) => (props.isActive ? "0 2px 4px 0 rgba(0, 0, 0, 0.24)" : "")};
  box-sizing: border-box;
`;

const StyledTipologySelectorLabel = styled.div`
  font-family: Mulish;
  padding: 0 10px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
  white-space: nowrap;
`;

const StyledTipologyActive = styled.div<{ isActive: boolean }>`
  height: 5px;
  width: 100%;
  background-color: ${(props) => (props.isActive ? "#aac21f" : "#ffffff")};
  margin: 16px 0px 0px 0px;
  transition: 0.1s;
`;
