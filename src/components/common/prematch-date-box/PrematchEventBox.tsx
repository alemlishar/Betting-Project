import React from "react";
import { css } from "styled-components/macro";
import { dateFormatter, timeFormatter } from "src/helpers/format-date";

export type PrematchEventBoxProps = {
  datetime: string;
};
export function PrematchEventBox({ datetime = "2020-11-05T12:30:00.000Z" }: PrematchEventBoxProps) {
  const date = new Date(datetime);
  return (
    <>
      <div
        css={css`
          height: 25px;
          background-color: #979797;
          color: #ffffff;
          font-family: Roboto;
          font-size: 0.8125rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 3px 3px 0 0;
        `}
      >
        {dateFormatter.format(date)}
      </div>
      <div
        css={css`
          height: 35px;
          background-color: #ffffff;
          border: 1px solid #dcdcdc;
          border-top: none;
          color: #333333;
          font-family: Roboto;
          font-size: 0.8125rem;
          font-weight: 500;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 0 0 3px 3px;
          box-sizing: border-box;
        `}
      >
        {timeFormatter.format(date)}
      </div>
    </>
  );
}
