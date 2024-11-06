import React, { useEffect } from "react";
import styled from "styled-components/macro";
import { GeneralInfo, ScopeObject } from "src/components/common/bordero/borderoTypes";
import useSWR from "swr";

import BlockBox from "src/components/common/bordero/BlockBox";

import { borderoResults } from "src/components/common/bordero/bordero-api";
export enum BorderoTitlesEnum {
  SPORT_QF = "Sport a quota fissa",
  ACCOUNT = "Movimento cassa",
  INTERNET_VOUCHER = "Virtual a quota fissa",
  VOUCHER_PROMOTIONS = "Voucher e Promozioni",
  GLOBAL_DEPOSIT = "Totali",
}

export const BodyBordero = (props: { onSetInfoAggiuntive: (info: GeneralInfo) => void }) => {
  const { data: borderoResponse } = useSWR("detailedBalance", borderoResults);

  useEffect(() => {
    if (borderoResponse !== undefined) {
      props.onSetInfoAggiuntive(borderoResponse.generalInfo);
    }
  }, [borderoResponse, props]);

  return (
    <StyledBody row={5}>
      {borderoResponse &&
        borderoResponse.scopes.map((scope: ScopeObject, index: number) => (
          <BlockBox key={index + "_" + scope.movements} scope={scope}></BlockBox>
        ))}
    </StyledBody>
  );
};

const StyledBody = styled.div<{ row: number }>`
  display: flex;
  justify-content: space-between;
  margin-top: 45px;
  font-family: Mulish, Roboto;
  flex-flow: row wrap;
`;

export default BodyBordero;
