import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as PrintIcon } from "src/assets/images/icon-bt-print.svg";
import { BodyBordero } from "src/components/common/bordero/BodyBordero";
import { GeneralInfo } from "src/components/common/bordero/borderoTypes";
import styled from "styled-components/macro";
import { postStampaBordero } from "src/components/common/bordero/bordero-api";
import useSWR from "swr";
import { useUser } from "src/components/authentication/useUser";
export type ErrorType = {
  method: string;
  status: boolean;
  message: string;
};

export const Bordero = () => {
  const user = useUser();

  const [tab, setTab] = useState("operatore");
  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);
  const { data: borderoResponsePrint } = useSWR("detailedBalance", postStampaBordero);
  const onSetInfoAggiuntive = (info: GeneralInfo) => {
    setGeneralInfo(info);
  };
  const stampaBordero = () => {
    postStampaBordero();
  };
  return (
    <StyledBorderoBox>
      <StyledContentBordero>
        <StyledHeaderBordero>
          <StyledBigTextBordero>
            <FormattedMessage defaultMessage="Borderò" description="Bordero header title"></FormattedMessage>
          </StyledBigTextBordero>
          <StyledSmallTextBordero>
            <FormattedMessage
              defaultMessage="Raggiungi in modo semplice i tuoi biglietti emessi, gli importi aggiunti, Conti gioco e Voucher"
              description="Bordero header subtitle"
            ></FormattedMessage>
          </StyledSmallTextBordero>
        </StyledHeaderBordero>
        <StyledTabsSwitch>
          <StyledTab
            isActive={tab === "operatore" ? true : false}
            onClick={() => {
              if (tab !== "operatore") {
                setTab("operatore");
              }
            }}
          >
            <FormattedMessage defaultMessage="Operatore" description="First tab text"></FormattedMessage>
          </StyledTab>
          <StyledTab
            isActive={tab === "terminale" ? true : false}
            onClick={() => {
              if (tab !== "terminale") {
                setTab("terminale");
              }
            }}
          >
            <FormattedMessage defaultMessage="Terminale" description="Second tab text"></FormattedMessage>
          </StyledTab>
          <StyledStampaOperatore onClick={() => stampaBordero()}>
            <PrintIcon> </PrintIcon> Stampa Operatore
          </StyledStampaOperatore>
        </StyledTabsSwitch>
        <BodyBordero onSetInfoAggiuntive={onSetInfoAggiuntive}></BodyBordero>
      </StyledContentBordero>
      <StyledFooterBordero>
        <StyledElementFooter>
          <StyledStrongText>Data Operazioni: </StyledStrongText>
          {generalInfo?.operationDate}
        </StyledElementFooter>
        <StyledElementFooter>
          <StyledTextFooter>
            <StyledStrongText>Agenzia: </StyledStrongText>
            {generalInfo?.agency}
          </StyledTextFooter>
        </StyledElementFooter>
        <StyledElementFooter>
          <StyledTextFooter>
            <StyledStrongText>TG: </StyledStrongText>
            {generalInfo?.tg}
          </StyledTextFooter>
        </StyledElementFooter>
        <StyledElementFooter>
          <StyledTextFooter>
            <StyledStrongText>Operatore:</StyledStrongText> {generalInfo?.operatore}
          </StyledTextFooter>
        </StyledElementFooter>
      </StyledFooterBordero>
    </StyledBorderoBox>
  );
};

const StyledStrongText = styled.span`
  font-weight: 600;
`;
const StyledTextFooter = styled.div`
  padding-left: 70px;
  border-left: 1px solid grey;
`;
const StyledFooterBordero = styled.div`
  position: absolute;

  width: 100%;
  height: 66px;
  bottom: 0;
  box-shadow: -5px -5px 2px 0px #cbcbcb;
  display: flex;
`;
const StyledElementFooter = styled.div`
  padding: 20px 34px 20px 34px;
  font-size: 20px;
`;

const StyledBigTextBordero = styled.div`
  font-size: 30px;
  font-weight: 900;
  margin-top: 15px;
  font-family: Mulish, Roboto;
  color: black;
`;
const StyledSmallTextBordero = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-top: 15px;
  font-family: Mulish;
  color: #646161;
`;
const StyledStampaOperatore = styled.div`
  display: flex;
  vertical-align: middle;
  font-size: 18px;
  font-weight: 700;
  right: 25px;
  padding: 0px 20px;
  align-items: center;
  width: 180px;
  border-radius: 20px;
  top: 0;
  position: absolute;
  text-align: right;
  border: 2px solid black;
  justify-content: space-between;
  & svg {
    width: 22px;
  }
  &:hover {
    cursor: pointer;
  }
`;
const StyledTabsSwitch = styled.div`
  margin-top: 40px;
  position: relative;
`;
const StyledTab = styled.div<{
  isActive: boolean;
}>`
  padding: 10px 20px;
  display: inline-block;
  width: 150px;
  text-align: center;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 700;
  font-family: Mulish;
  &:hover {
    cursor: pointer;
  }

  ${(props) =>
    props.isActive === true ? `   background-color: #aac21f;color:white` : `   background-color: #ffffff;color:black`};
`;
const StyledHeaderBordero = styled.div`
  height: 71px;
`;
const StyledContentBordero = styled.div`
  padding: 30px;
`;
const StyledBorderoBox = styled.div`
  display: block;
  border-radius: 12px;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;

  position: relative;
  background-color: #ffffff;
`;

export default Bordero;
