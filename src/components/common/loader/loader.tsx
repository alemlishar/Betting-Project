import React from "react";
import { css } from "styled-components/macro";
import SisalLoader from "src/assets/images/loader.png";

export function Loader() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100vw;
        height: calc(100vh - 130px);
        background-color: #b2b2b2;
        z-index: 2;
      `}
    >
      <div
        css={css`
          width: 130px;
          height: 130px;
          position: relative;
          background-image: url(${SisalLoader});
          background-repeat: no-repeat;
          background-position: center;
          overflow: hidden;
          mask-image: url(${SisalLoader});
          mask-size: 130px;
          mask-repeat: no-repeat;
          mask-position: center;
          &::before {
            content: "";
            position: absolute;
            background-color: #ffffff;
            width: 130px;
            top: 0;
            animation: fill 2.5s ease-in-out infinite both;
          }
          @keyframes fill {
            0% {
              height: 100%;
            }
            100% {
              height: 0;
            }
          }
        `}
      />
    </div>
  );
}
