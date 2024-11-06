import React from "react";
import styled from "styled-components/macro";
import { ReactComponent as ContiGiocoIcon } from "src/assets/images/bt_bordero_icona_contigioco.svg";

import { ReactComponent as MovimentoCassaIcon } from "../../../assets/images/bt_bordero_icona_movimento_casa.svg";
import { ReactComponent as VirtualIcon } from "../../../assets/images/bt_bordero_icona_virtual.svg";
import { ReactComponent as SportIcon } from "../../../assets/images/bt_bordero_icona_sport.svg";

import { FormattedMessage } from "react-intl";
import { ScopeObject } from "src/components/common/bordero/borderoTypes";
import configuration from "src/helpers/configuration";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";
export enum BorderoTitlesEnum {
  TOTAL = "Totali",
  SPORT_QF = "Sport a quota fissa",
  IPPICA_TOTALIZZATORE = "Ippica al totalizzatore",
  IPPICA_QF = "Ippica a quota fissa",
  IPPICA_RIFERIMENTO = "Ippica a riferimento",
  IPPICA_NAZIONALE = "Ippiche nazionali",
  ACCOUNT = "Movimento Cassa",
  GAME_ACCOUNTS = "Conti Gioco",
  VIRTUAL = "Virtual a quota fissa",
  VOUCHER_PROMOTIONS = "Voucher e Promozioni",
  GLOBAL_DEPOSIT = "Totali",
}

export enum BorderoActionEnum {
  TOTAL_EMIT = "Emesso",
  TOTAL_CANCEL = "Annullato",
  TOTAL_PAYMENT = "Pagato",
  TOTAL_REFUND = "Rimborsato",
  TOTAL_PAYMENT_REFUND = "Paga/Rimb",
  COMMON_EMIT = "Emesso",
  COMMON_CANCEL = "Annullato",
  COMMON_PAYMENT = "Pagato",
  COMMON_REFUND = "Rimborsato",
  COMMON_PAYMENT_REFUND = "Paga/Rimb",
  GLOBAL_DEPOSIT = "Entrate",
  GLOBAL_REFUND = "Uscite",
  ONLINE_ACCOUNT_CLOSE = "Emesso",
  VOUCHER_EMIT = "Emessi",
  VOUCHER_USAGE = "Utilizzati",
  VOUCHER_PAYMENT = "Pagati",
  PROMOTIONS_PROMOTION = "Promozioni",
  GAME_ACCOUNT_OPEN = "Aperture",
  GAME_ACCOUNT_CHARGING = "Ricariche",
  GAME_ACCOUNT_WITHDRAWAL = "Prelievi",
}

const iconsMap = {
  TOTAL: <MovimentoCassaIcon />,
  SPORT_QF: <SportIcon />,
  ACCOUNT: <MovimentoCassaIcon />,
  VIRTUAL: <VirtualIcon />,
  VOUCHER_PROMOTIONS: <ContiGiocoIcon />,
  GLOBAL_DEPOSIT: <ContiGiocoIcon />,
  GAME_ACCOUNTS: <ContiGiocoIcon />,
  IPPICA_TOTALIZZATORE: <SportIcon />,
  IPPICA_QF: <SportIcon />,
  IPPICA_RIFERIMENTO: <SportIcon />,
  IPPICA_NAZIONALE: <SportIcon />,
};

let amount: JSX.Element = formatCurrency(0);

export const BlockBox = (props: { scope: ScopeObject }) => {
  return (
    <StyledBoxShadow isTotale={props.scope.type === "TOTAL" ? true : false}>
      <IconTop>{iconsMap[props.scope.type]} </IconTop>
      <StyledHeaderBoxShadow isTotale={props.scope.type === "TOTAL" ? true : false}>
        {BorderoTitlesEnum[props.scope.type]}
      </StyledHeaderBoxShadow>
      <StyledBodyBoxShadow>
        <StyledTableBox>
          <StyledRowTable isHeaderRow={true}>
            <Action> </Action>
            <StyledNumber>
              <FormattedMessage description="Boxes of bordero amounts" defaultMessage="Numero" />
            </StyledNumber>
            <StyledAmount>
              <FormattedMessage description="Boxes of bordero amounts sign" defaultMessage="Importo (€) " />
            </StyledAmount>
          </StyledRowTable>
          {props.scope.movements.map((movement) => {
            if (configuration.NEGATIVE_ELEMENT_BORDERO.includes(movement.reason) && movement.amount !== 0) {
              amount =
                movement.amount !== null && movement.amount !== undefined ? (
                  formatCurrency(decimalToIntegerValue(-movement.amount))
                ) : (
                  <></>
                );
            } else {
              amount =
                movement.amount !== null && movement.amount !== undefined ? (
                  formatCurrency(decimalToIntegerValue(movement.amount))
                ) : (
                  <></>
                );
            }
            return (
              movement.reason !== "ONLINE_ACCOUNT_CLOSE" && (
                <StyledRowTable key={movement.reason} isHeaderRow={false}>
                  <Action>{BorderoActionEnum[movement.reason]}</Action>
                  <StyledNumber>{movement.number}</StyledNumber>
                  <StyledAmount>{amount}</StyledAmount>
                </StyledRowTable>
              )
            );
          })}
        </StyledTableBox>
      </StyledBodyBoxShadow>
    </StyledBoxShadow>
  );
};

const StyledRowTable = styled.div<{ isHeaderRow: boolean }>`
  display: flex;
  font-family: Mulish;

  justify-content: space-between;
  border-bottom: 1px solid #dddddd;
  padding: 8px 0px;
  margin-bottom: 6px;
  ${(props) =>
    props.isHeaderRow === true ? ` font-weight: 400;font-size: 15px;` : `    font-weight: 600;font-size: 16px;`};

  &:last-child {
    border-bottom: none;
  }
`;
const Action = styled.div`
  width: 33%;
`;
const StyledAmount = styled.div`
  width: 33%;
  text-align: right;
`;
const StyledNumber = styled.div`
  width: 33%;
  text-align: center;
`;
const StyledTableBox = styled.div``;
const StyledBodyBoxShadow = styled.div`
  padding: 0px 20px 20px 20px;
`;
const IconTop = styled.div`
  float: right;
`;
const StyledHeaderBoxShadow = styled.div<{ isTotale: boolean }>`
  padding: 20px 20px 0 20px;
  font-size: 19px;
  font-weight: 800;
  font-family: Mulish;
  ${(props) => (props.isTotale === true ? `   color:#ffffff ` : `color: black;`)};
`;
const StyledBoxShadow = styled.div<{ isTotale: boolean }>`
  border-radius: 4px 4px 10px 10px;
  margin-bottom: 25px;
  height: 292px;
  flex: 0 1 calc(20% - 12px); /* <-- adjusting for margin */
  width: 100%;
  box-shadow: 0px 2px 3px 0px #9d9d9d;
  font-family: Mulish, Roboto;
  color: black;
  ${(props) =>
    props.isTotale === true ? ` background-color:#005936; color:#ffffff` : `background-color:white;  color: #2a2a2a;`};
`;

export default BlockBox;
