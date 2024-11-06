import styled from "styled-components/macro";

export const StyledEsitoContainer = styled.div<{ columns: 2 | 4 }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.columns === 4 ? "1fr 1fr 1fr 1fr" : "1fr 1fr"};
  column-gap: 11px;
  row-gap: 11px;
  margin-top: 11px;
`;
