import React from "react";
import { Livescore } from "src/components/live/live-api";
import configuration from "src/helpers/configuration";
import styled from "styled-components/macro";

interface RedCardsProps {
  livescore: Livescore | undefined | null;
  teamId: typeof configuration.TEAM1_ID | typeof configuration.TEAM2_ID;
}

export function RedCards({ livescore, teamId }: RedCardsProps) {
  if (!livescore || livescore === null) {
    return null;
  }
  const { cardList } = livescore;

  const redCardsByTeam = cardList.filter((card) => {
    return (
      (card.type === configuration.LIVESCORE_CARD_TYPE.SECOND_YELLOW_CARD ||
        card.type === configuration.LIVESCORE_CARD_TYPE.RED_CARD) &&
      card.playerTeam === teamId
    );
  });

  if (redCardsByTeam.length > 0) {
    return <StyledRedCard>{redCardsByTeam.length}</StyledRedCard>;
  }
  return <></>;
}

const StyledRedCard = styled.div`
  height: 20px;
  width: 17px;
  background-color: #e72530;
  border-radius: 1px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  font-family: Roboto;
  line-height: 20px;
  margin: 0 3px;
`;
