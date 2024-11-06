import React from "react";

import styled from "styled-components/macro";
type propsType = {
  children: React.ReactNode;
};
export const HeaderDialog = (props: propsType) => {
  return <StyledHeaderDialog>{props.children}</StyledHeaderDialog>;
};

const StyledHeaderDialog = styled.div`
  display: flex;

  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  flex: 0 0 auto;
  background-color: #333333;
  padding-bottom: 50px;
  width: 100%;
`;

export default HeaderDialog;
