import React, { useRef } from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IcoArrowDownGrey } from "src/assets/images/icon-arrow-down-grey.svg";
import {
  SliderControllerButton,
  useScrollingSliderControls,
} from "src/components/common/slider-controller/SliderController";
import { getHotbets, getMonoquota } from "src/components/hotbets/hotbets-api";
import { LancioMatch } from "src/components/hotbets/LancioMatch";
import { MonoQuota } from "src/components/hotbets/MonoQuota";
import { dateFormatter, timeFormatter } from "src/helpers/format-date";
import styled, { css } from "styled-components/macro";
import useSWR from "swr";

export function HotBets() {
  const { data: monoQuotaContainer } = useSWR("monoquota", getMonoquota);
  const { data: lancioMatch } = useSWR("lancioMatch", getHotbets, { refreshInterval: 10000 });
  const hotbetsScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { left, right, scrollBy } = useScrollingSliderControls(hotbetsScrollContainerRef);

  if (!monoQuotaContainer || !lancioMatch) {
    return null;
  }

  return (
    <StyledHotbetsContainer>
      <div
        css={css`
          grid-row: heading;
          grid-column: title;
          color: #333333;
          font-family: Mulish;
          font-size: 1.875rem;
          font-weight: 900;
        `}
      >
        <FormattedMessage defaultMessage="In Evidenza" description="Heading sezione In Evidenza" />
      </div>
      <div
        css={css`
          grid-row: heading;
          grid-column: arrows;
          display: flex;
          justify-content: space-between;
        `}
      >
        <SliderControllerButton
          isEnabled={left}
          onClick={() => scrollBy(-960, false)}
          icon={
            <IcoArrowDownGrey
              css={css`
                height: 16px;
                width: 16px;
                margin-right: 10px;
                transform: rotate(90deg);
              `}
            />
          }
        />
        <SliderControllerButton
          isEnabled={right}
          onClick={() => scrollBy(960, false)}
          icon={
            <IcoArrowDownGrey
              css={css`
                height: 16px;
                width: 16px;
                margin-left: 10px;
                transform: rotate(-90deg);
              `}
            />
          }
        />
      </div>
      <div
        ref={hotbetsScrollContainerRef}
        css={css`
          grid-row: cards;
          grid-column: -1 / 1;
          align-items: center;
          width: 1049px;
          overflow: auto hidden;
          display: flex;
          &::-webkit-scrollbar {
            display: none;
          }
        `}
      >
        <MonoQuota monoQuotaContainer={monoQuotaContainer} />
        <LancioMatch lancioMatch={lancioMatch} />
      </div>
    </StyledHotbetsContainer>
  );
}

const StyledHotbetsContainer = styled.div`
  display: grid;
  grid-template-rows: [heading] 30px [cards] 178px;
  grid-template-columns: [title] auto [arrows] 58px;
  grid-column-gap: 10px;
  grid-row-gap: 20px;
  align-items: center;
  margin-bottom: 20px;
`;

export type HotbetsDateTimeProps = { datetime: string };
export function HotbetsDateTime({ datetime }: HotbetsDateTimeProps) {
  const date = new Date(datetime);
  return (
    <StyledDateTimeContainer>
      <StyledDateContainer>{dateFormatter.format(date)}</StyledDateContainer>
      <StyledTimeContainer>{timeFormatter.format(date)}</StyledTimeContainer>
    </StyledDateTimeContainer>
  );
}

const StyledDateTimeContainer = styled.div`
  box-sizing: border-box;
  height: 54px;
  width: 120px;
  flex-basis: 120px;
  border: 1.26px solid #979797;
  font-family: Roboto;
  font-size: 0.8125rem;
  font-weight: 500;
  grid-column: data;
  border-radius: 0 4px 0 0;
  align-self: flex-start;
`;

const StyledDateContainer = styled.div`
  background-color: #979797;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-transform: capitalize;
`;

const StyledTimeContainer = styled.div`
  background-color: #ffffff;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;
