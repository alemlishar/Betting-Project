import React from "react";
import { BadgeLive } from "src/components/prematch/TopLive";
import { css } from "styled-components/macro";

export function LivescorePlaceholder() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 45px;
        width: 100px;
        border-radius: 3px;
        background-color: #333333;
      `}
    >
      <BadgeLive />
    </div>
  );
}

export function LivescorePlaceholderHotBets() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 54px;
        width: 100px;
        background-color: #333333;
        border-radius: 0 4px 0 0;
      `}
    >
      <BadgeLive />
    </div>
  );
}
