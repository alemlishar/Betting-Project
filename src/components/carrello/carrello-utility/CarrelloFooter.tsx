import React, { useContext, useEffect } from "react";
import styled from "styled-components/macro";
import { parseAsMoney } from "../../../helpers/format-data";
import { CartErrorsType } from "src/types/carrello.types";
import { AlertBox } from "../../common/alert-box/AlertBox";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { FormattedMessage } from "react-intl";

export function CarrelloFooter({
  bet,
  validate,
  isSistemaActive,
  setValidate,
  isDefaultSettingsChange,
}: {
  bet: number;
  validate: CartErrorsType;
  isSistemaActive: boolean;
  setValidate: (e: CartErrorsType) => void;
  isDefaultSettingsChange: boolean | undefined;
}) {
  const { config, maxThresholdValue } = useContext(GlobalStateContext);

  const updateErrors = (e: CartErrorsType) => {
    setValidate({ ...validate, ...e });
  };

  useEffect(() => {
    const sogliaAntiriciclaggioValidation = maxThresholdValue ? bet >= maxThresholdValue : false;
    if (validate.sogliaAntiriciclaggioValidation !== sogliaAntiriciclaggioValidation) {
      updateErrors({ sogliaAntiriciclaggioValidation });
    }
  }, [bet, validate]);

  useEffect(() => {
    const betSistemaIsGreaterThanUserMax =
      config && config.CONI && config.CONI.maxCostTicket ? bet > config.CONI.maxCostTicket : false;

    if (validate.betSistemaIsGreaterThanUserMax !== betSistemaIsGreaterThanUserMax) {
      updateErrors({ betSistemaIsGreaterThanUserMax });
    }
  }, [bet, validate]);

  return (
    <CartFooterAlerts>
      {validate.betSistemaIsGreaterThanUserMax && (
        <CustomizeAlertBox>
          <AlertBox
            alertType="error"
            message={{
              text: (
                <FormattedMessage
                  description="error message max user bet"
                  defaultMessage="Hai superato il tuo massimale di vendita pari a {amount} per singolo biglietto. Contatta il tuo responsabile."
                  values={{
                    amount: parseAsMoney(
                      config && config.CONI && config.CONI.maxCostTicket ? config.CONI.maxCostTicket : 1000,
                    ),
                  }}
                />
              ),
            }}
            customStyle={{ fontSize: "16px" }}
          />
        </CustomizeAlertBox>
      )}
      {isDefaultSettingsChange === true && (
        <CustomizeAlertBox>
          <AlertBox
            alertType="success"
            message={{
              text: (
                <FormattedMessage
                  description="ok save settings"
                  defaultMessage="Salvataggio impostazioni andato a buon fine"
                />
              ),
            }}
            customStyle={{ fontSize: "16px" }}
            customTextColor="#ffffff"
          />
        </CustomizeAlertBox>
      )}
      {isDefaultSettingsChange === false && (
        <CustomizeAlertBox>
          <AlertBox
            alertType="error"
            message={{
              text: (
                <FormattedMessage
                  description="ko save settings"
                  defaultMessage="Salvataggio impostazioni non andato a buon fine"
                />
              ),
            }}
            customStyle={{ fontSize: "16px" }}
          />
        </CustomizeAlertBox>
      )}
      {validate.sogliaAntiriciclaggioValidation && !validate.betSistemaIsGreaterThanUserMax && isSistemaActive && (
        <CustomizeAlertBox>
          <AlertBox
            alertType="warning"
            message={{
              text: (
                <FormattedMessage
                  description="error message antiriciclaggio"
                  defaultMessage="L'importo di puntata supera la soglia antiriciclaggio."
                />
              ),
            }}
            customStyle={{ fontSize: "16px" }}
          />
        </CustomizeAlertBox>
      )}
    </CartFooterAlerts>
  );
}

export const CartFooterAlerts = styled.div`
  background-color: #f4f4f4;
  width: 100%;
  border-radius: 8px;
  padding-bottom: 5px;
  max-height: 160px;
`;

const CustomizeAlertBox = styled.div`
  height: 60px;
  position: relative;
  z-index: 1;
  bottom: -88px;
`;
