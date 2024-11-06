import React from "react";
import { InfoAggiuntivaAggregator, InfoAggiuntivaAggregatorGroup } from "src/components/prematch/prematch-api";
import { setFallbackImageSrc } from "src/components/prematch/templates/utils";
import magliettaHome from "src/assets/images/maglietta-home.svg";
import magliettaAway from "src/assets/images/maglietta-away.svg";
import { css } from "styled-components/macro";

type DescrizioneInfoAggiuntivaAggregatorProps = {
  infoAggiuntivaAggregator: InfoAggiuntivaAggregator;
  infoAggiuntivaAggregatorGroup: InfoAggiuntivaAggregatorGroup;
};
export function DescrizioneInfoAggiuntivaAggregator({
  infoAggiuntivaAggregator,
  infoAggiuntivaAggregatorGroup,
}: DescrizioneInfoAggiuntivaAggregatorProps) {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: min-content auto;
        grid-template-rows: auto auto;
        grid-column-gap: 8px;
        grid-row-gap: 4px;
        /* &:hover {
          cursor: pointer;
        } */
      `}
    >
      <img
        css={css`
          grid-column: 1;
          grid-row: 1;
          box-sizing: border-box;
          height: 25px;
          width: 25px;
          border: 0.77px solid #cbcbcb;
          border-radius: 50%;
        `}
        alt={""}
        src={infoAggiuntivaAggregatorGroup.urlIcona}
        onError={setFallbackImageSrc(infoAggiuntivaAggregatorGroup.home ? magliettaHome : magliettaAway)}
      />{" "}
      <div
        css={css`
          grid-column: 2;
          grid-row: 1;
          color: gray;
          font-size: 0.9rem;
          align-self: center;
        `}
      >
        {infoAggiuntivaAggregatorGroup.descrizione}
      </div>
      <div
        css={css`
          grid-column: 1 / span 2;
          grid-row: 2;
          font-weight: 600;
          font-size: 1rem;
        `}
      >
        {infoAggiuntivaAggregator.descrizione}
      </div>
    </div>
  );
}
