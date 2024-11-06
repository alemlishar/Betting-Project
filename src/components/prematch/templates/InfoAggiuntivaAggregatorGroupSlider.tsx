import React, { useRef } from "react";
import styled, { css } from "styled-components/macro";
import { Avvenimento, InfoAggiuntivaAggregatorGroup, FiltroGiornaliero } from "src/components/prematch/prematch-api";
import { ChiaveAvvenimento } from "src/types/chiavi";
import magliettaHome from "src/assets/images/maglietta-home.svg";
import magliettaAway from "src/assets/images/maglietta-away.svg";
import { setFallbackImageSrc } from "src/components/prematch/templates/utils";
import { SelectFiltroGiornalieroMemo } from "src/components/prematch/templates/FiltroGiornaliero";
import icoArrowUpWhite from "src/assets/images/icon-arrow-up-white-big.svg";
import icoArrowDownWhite from "src/assets/images/icon-arrow-down-white-big.svg";
import { dateFormatter, timeFormatter } from "src/helpers/format-date";
import {
  useScrollingSliderControls,
  SliderControllerButton,
} from "src/components/common/slider-controller/SliderController";

// TODO performance

type InfoAggiuntivaAggregatorGroupSliderProps = {
  avvenimento: Avvenimento | undefined;
  onAvvenimentoChange(avvenimento: Avvenimento): void;
  filtroGiornaliero: FiltroGiornaliero;
  onFiltroGiornalieroChange(filtroGiornaliero: FiltroGiornaliero): void;
  infoAggiuntivaAggregatorGroupMapByAvvenimento: Record<
    ChiaveAvvenimento,
    Record<string, InfoAggiuntivaAggregatorGroup>
  >;
  avvenimentoList: Array<Avvenimento>;
};
function InfoAggiuntivaAggregatorGroupSlider({
  avvenimento: value,
  onAvvenimentoChange,
  filtroGiornaliero,
  onFiltroGiornalieroChange,
  avvenimentoList,
  infoAggiuntivaAggregatorGroupMapByAvvenimento,
}: InfoAggiuntivaAggregatorGroupSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { left, right, scrollBy } = useScrollingSliderControls(scrollContainerRef);
  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <div
        css={css`
          width: 183px;
          background-color: #0b7d3e;
          display: flex;
          align-items: center;
          padding: 8px;
        `}
      >
        <SelectFiltroGiornalieroMemo
          value={filtroGiornaliero}
          onChange={onFiltroGiornalieroChange}
          theme={selectFiltroGiornalieroTheme}
        />
      </div>
      <div
        css={css`
          overflow: hidden;
          flex-grow: 1;
        `}
      >
        <div
          ref={scrollContainerRef}
          css={css`
            overflow-x: scroll;
            &::-webkit-scrollbar {
              width: 0;
              display: none;
            }
            /* margin-bottom: -20px; */
            background-color: #ededed;
          `}
        >
          <div
            css={css`
              display: grid;
              grid-template-columns: repeat(${avvenimentoList.length}, min-content);
              grid-column-gap: 8px;
              padding: 8px;
            `}
          >
            {avvenimentoList.map((avvenimento, index) => {
              const infoAggiuntivaGroupMap = infoAggiuntivaAggregatorGroupMapByAvvenimento[avvenimento.key];
              if (!infoAggiuntivaGroupMap) {
                return null;
              }
              const infoAggiuntivaGroupMapEntries = Object.entries(infoAggiuntivaGroupMap);
              const casa = infoAggiuntivaGroupMapEntries.find(
                ([, infoAggiuntivaGroup]) => infoAggiuntivaGroup.home,
              )?.[1];
              const ospite = infoAggiuntivaGroupMapEntries.find(
                ([, infoAggiuntivaGroup]) => !infoAggiuntivaGroup.home,
              )?.[1];
              if (!casa || !ospite) {
                return null;
              }
              const isSelected = avvenimento.key === value?.key;
              const date = new Date(avvenimento.data);
              return (
                <StyledInfoAggiuntivaAggregatorGroupSliderContainer
                  style={{ gridColumn: index + 1, gridRow: 1 }}
                  onClick={() => onAvvenimentoChange(avvenimento)}
                  isSelected={isSelected}
                  key={avvenimento.key + index}
                >
                  <div>
                    <img
                      css={css`
                        box-sizing: border-box;
                        height: 25px;
                        width: 25px;
                        border: 0.77px solid #cbcbcb;
                        border-radius: 50%;
                      `}
                      src={casa.urlIcona}
                      alt={""}
                      onError={setFallbackImageSrc(magliettaHome)}
                    />{" "}
                    <img
                      css={css`
                        box-sizing: border-box;
                        height: 25px;
                        width: 25px;
                        border: 0.77px solid #cbcbcb;
                        border-radius: 50%;
                      `}
                      src={ospite.urlIcona}
                      alt={""}
                      onError={setFallbackImageSrc(magliettaAway)}
                    />
                  </div>
                  <div
                    css={css`
                      color: #333333;
                      font-family: Roboto;
                      font-size: 0.875rem;
                      font-weight: 700;
                      letter-spacing: 0;
                      line-height: 23px;
                      text-align: center;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      overflow: hidden;
                    `}
                  >
                    {avvenimento.descrizione}
                  </div>
                  <div
                    css={css`
                      color: #333333;
                      font-family: Roboto;
                      font-size: 0.75rem;
                      letter-spacing: 0;
                      line-height: 14px;
                      text-align: center;
                    `}
                  >
                    {dateFormatter.format(date)} - {timeFormatter.format(date)}
                  </div>
                </StyledInfoAggiuntivaAggregatorGroupSliderContainer>
              );
            })}
          </div>
        </div>
      </div>
      <div
        css={css`
          background-color: #0b7d3e;
          display: flex;
          flex-direction: column;
          box-shadow: -2px 2px 4px 0 rgba(0, 0, 0, 0.17);
        `}
      >
        <SliderControllerButton
          isEnabled={left}
          onClick={() => scrollBy(-1)}
          icon={
            <img
              css={css`
                transform: rotate(-90deg);
              `}
              src={icoArrowUpWhite}
              alt={""}
            />
          }
        />
        <SliderControllerButton
          isEnabled={right}
          onClick={() => scrollBy(1)}
          icon={
            <img
              css={css`
                transform: rotate(90deg);
              `}
              src={icoArrowUpWhite}
              alt={""}
            />
          }
        />
      </div>
    </div>
  );
}
export const InfoAggiuntivaAggregatorGroupSliderMemo = React.memo(InfoAggiuntivaAggregatorGroupSlider);

const selectFiltroGiornalieroTheme = {
  keybackgroundColor: "#0B7D3E",
  keycolor: "#FFFFFF",
  keybordercolor: "#FFFFFF",
  iconUp: icoArrowUpWhite,
  iconDown: icoArrowDownWhite,
};

const StyledInfoAggiuntivaAggregatorGroupSliderContainer = styled.div<{ isSelected: boolean }>`
  height: 80px;
  width: 220px;
  border-radius: 8px;
  box-sizing: border-box;
  text-align: center;
  background-color: ${(props) => (props.isSelected ? " #ffffff" : "#EDEDED")};
  border: ${(props) => (props.isSelected ? "3px solid #aac21f" : "2px solid #CBCBCB")};
  padding: ${(props) => (props.isSelected ? "7px 1px 1px 1px" : "8px 2px 2px 2px")};
  &:hover {
    cursor: pointer;
  }
`;
