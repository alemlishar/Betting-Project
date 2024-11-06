import React, { useState } from "react";
import styled from "styled-components/macro";
import { BodyMethodSaldoCassa } from "./BodyMethodSaldoCassa";

export const BodyDialogSaldoCassa = (props: {
  closeDialog: Function;
  pushToast(content: React.ReactNode, duration: number): void;
}) => {
  const [method, setMethod] = useState("contanti");
  const { closeDialog } = props;
  return (
    <>
      {" "}
      <StyledBodySaldoCassa>
        <TopButtons>
          {" "}
          <ButtonContanti active={method === "contanti" ? true : false} onClick={() => setMethod("contanti")}>
            Contanti
          </ButtonContanti>
          <ButtonContanti active={method === "altri" ? true : false} onClick={() => setMethod("altri")}>
            Altri metodi
          </ButtonContanti>
        </TopButtons>
        <BodyMethodSaldoCassa method={method} closeDialog={closeDialog} pushToast={props.pushToast} />
      </StyledBodySaldoCassa>
    </>
  );
};

const ButtonContanti = styled.button<{
  active: Boolean;
}>`
  font-size: 20px;
  font-weight: 800;
  line-height: 23px;
  text-align: center;
  height: 40px;
  font-family: Mulish;
  width: 225px;
  :hover {
    cursor: pointer;
  }
  ${(props) =>
    props.active === true
      ? ` box-sizing: border-box;
      
      border: 1px solid #AAC21F;
     
      background-color: #005936;
      color: #ffffff;
     
     
    color:#ffffff;
    border-radius: 20px;
    background-color: #AAC21F`
      : `color:#AAC21F;
      background-color: #ffffff;
      border: 1px solid #ffffff;
      font-family: Mulish;
      text-align: center;`};
  &:focus {
    outline: none;
  }
`;

const TopButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledBodySaldoCassa = styled.div`
  display: flex;
  border-radius: 12px;
  flex-wrap: wrap;
  padding-left: 60px;
  padding-right: 60px;
  padding-top: 40px;
  //min-height: 650px;
  background-color: #ffffff;
  width: 100%;
`;
export default BodyDialogSaldoCassa;
