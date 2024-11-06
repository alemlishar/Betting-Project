import React, { useState } from "react";

import styled from "styled-components/macro";
import { ReactComponent as IconPrint } from "../../../assets/images/icon-bt-print.svg";
import { ReactComponent as IconHistory } from "../../../assets/images/icon-bt-storico.svg";
import { ReactComponent as IconPrintColor } from "../../../assets/images/icon-bt-print-color.svg";
import { ReactComponent as IconHistoryColor } from "../../../assets/images/icon-bt-storico-color.svg";

export const HeaderDialogSaldoCassa = () => {
  const [acidColorHistory, setAcidColorHistory] = useState<boolean>(false);
  const [acidColorPrint, setAcidColorPrint] = useState<boolean>(false);
  return (
    <StyledHeaderSaldoCassa>
      <StyledLeftDiv>
        <StyledTextHeader fontSize="30" subTitle={false} italic={false} fontWeight="bold" fontFamily="Mulish">
          {" "}
          Saldo Cassa
        </StyledTextHeader>
        <StyledTextHeader fontSize="18" subTitle={true} fontWeight="300" italic={false} fontFamily="Roboto, sans-serif">
          Inserisci manualmente le operazioni che influiscono sul saldo cassa giornaliero.{" "}
        </StyledTextHeader>
        <StyledTextHeader fontSize="18" subTitle={true} italic={true} fontWeight="300" fontFamily="Roboto, sans-serif">
          Sovvenzioni, prelievi, vendite con titolo e POS o pagamenti con titolo
        </StyledTextHeader>
      </StyledLeftDiv>
      <StyledRighttDiv>
        <WrapperIcon>
          {" "}
          {!acidColorHistory && <IconHistory onMouseEnter={() => setAcidColorHistory(true)} />}
          {acidColorHistory && <IconHistoryColor onMouseLeave={() => setAcidColorHistory(false)} />}
        </WrapperIcon>
        <WrapperIcon>
          {" "}
          {!acidColorPrint && <IconPrint onMouseEnter={() => setAcidColorPrint(true)} />}
          {acidColorPrint && <IconPrintColor onMouseLeave={() => setAcidColorPrint(false)} />}
        </WrapperIcon>
      </StyledRighttDiv>
    </StyledHeaderSaldoCassa>
  );
};

const WrapperIcon = styled.div`
  box-sizing: border-box;
  height: 60px;
  width: 60px;
  align-items: center;
  justify-content: center;
  display: flex;
  border: 2.4px solid #ffffff;
  border-radius: 8px;
  background-color: #ffffff;
  &:hover {
    cursor: pointer;
  }
`;
const StyledLeftDiv = styled.div`
  width: 284px;
  padding-left: 60px;
  padding-top: 45px;
`;
const StyledRighttDiv = styled.div`
  padding-top: 45px;
  padding-left: 40px;
  padding-right: 60px;
  width: 146px;
  justify-content: space-between;
  align-items: center;
  display: flex;
  padding-bottom: 37px;
`;
const StyledHeaderSaldoCassa = styled.div`
  display: flex;

  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  flex: 0 0 auto;
  background-color: #333333;

  width: 100%;
  height: 280px;
`;

const StyledTextHeader = styled.div<{
  fontSize: string;
  italic: Boolean;
  fontWeight: string;
  fontFamily: string;
  subTitle: Boolean;
}>`
  display: inline-block;
  color: #ffffff;
  font-weight: ${(props) => props.fontWeight};
  font-style: ${(props) => (props.italic === true ? "italic" : "none")};
  font-size: ${(props) => props.fontSize + "px"};
  font-family: ${(props) => props.fontFamily};

  ${(props) =>
    props.subTitle === true
      ? `    line-height: 24px;
    letter-spacing: 1px;`
      : ` line-height: 44px;
    letter-spacing: 1px;
    padding-bottom:7px`};
`;
export default HeaderDialogSaldoCassa;
