import React from "react";
import styled from "styled-components/macro";

export const DettaglioFooterRow = ({
  dataQa,
  label,
  amount,
  rowRef,
  largestColumnWidth,
  isNotEmphasisRow,
}: {
  dataQa?: string;
  label: string;
  amount: string | JSX.Element;
  rowRef: React.RefObject<HTMLDivElement>;
  largestColumnWidth: number;
  isNotEmphasisRow: boolean;
}) => {
  return (
    <StyledDettaglioBigliettoFooterRow theme={{ isNotEmphasisRow: isNotEmphasisRow }}>
      <StyledDettaglioBigliettoFooterLabel>{label}</StyledDettaglioBigliettoFooterLabel>
      <StyledDettaglioBigliettoFooterValue data-qa={dataQa ? dataQa : ""} ref={rowRef} theme={{ largestColumnWidth }}>
        {amount}
      </StyledDettaglioBigliettoFooterValue>
    </StyledDettaglioBigliettoFooterRow>
  );
};

const StyledDettaglioBigliettoFooterRow = styled.div`
  text-align: right;
  margin: 0 0 7px 0;
  display: flex;
  font-size: 16px;
  color: #444;

  ${(props) => props.theme.isNotEmphasisRow} && {
    color: #000;
    font-size: 20px;
    font-weight: 600;
    margin-top: 10px;
  }
`;

const StyledDettaglioBigliettoFooterLabel = styled.div`
  margin-right: 76px;
`;
const StyledDettaglioBigliettoFooterValue = styled.div`
  font-weight: 600;
  width: ${(props) => (props.theme.largestColumnWidth > 0 ? `${props.theme.largestColumnWidth + 10}px` : "auto")};
  display: inline-block;
`;
