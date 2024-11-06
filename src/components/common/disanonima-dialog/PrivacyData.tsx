import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { AnagraficaDTO } from "src/components/common/disanonima-dialog/disanonima-dto";
import { DisanonimaState, StyledDisanonimaTitle } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { ReactComponent as IconCheck } from "src/assets/images/ico_check_on.svg";
import styled, { css } from "styled-components/macro";
import useSWR from "swr";
import { getPPEConfiguration } from "src/components/common/disanonima-dialog/disanonima-api";
import { SelectPPERole } from "src/components/common/disanonima-dialog/SelectPPERole";
import { StyledButtonGreen } from "src/components/common/disanonima-dialog/AddDocumentDialog";

type PrivacyDataProps = {
  onChangeDisanonima: React.Dispatch<React.SetStateAction<DisanonimaState>>;
  customerInfo: AnagraficaDTO;
};

export function PrivacyData({ customerInfo, onChangeDisanonima }: PrivacyDataProps) {
  const { data: configPpe } = useSWR("PPEConfiguration", getPPEConfiguration, { dedupingInterval: 60 * 60 * 1000 });

  const [isPPE, setIsPPE] = useState<boolean>(false);

  useEffect(() => {
    if (configPpe) {
      const isNotPPE = configPpe.item.find(({ description }) => description === "NESSUNA");
      setIsPPE(customerInfo.listaPep !== isNotPPE?.id);
    }
  }, [customerInfo.listaPep, configPpe, setIsPPE]);

  const isDisable =
    isPPE &&
    configPpe &&
    configPpe.item.find(({ description }) => description === "NESSUNA")?.id === customerInfo.listaPep;

  const disableWarning = useCallback(() => {
    onChangeDisanonima((prevState) => ({
      ...prevState,
      alertState: { isVisible: false, message: "", title: "", type: "warning" },
    }));
  }, [onChangeDisanonima]);

  const goToPaymentOptions = () => {
    disableWarning();
    onChangeDisanonima((prevState) => {
      return {
        ...prevState,
        step: "paymentOptions",
      };
    });
  };

  return (
    <>
      <StyledDisanonimaTitle>
        <FormattedMessage
          description="Title of privacy data step in disanonima"
          defaultMessage="Trattamento dati personali"
        />
      </StyledDisanonimaTitle>

      <StyledCheckBox>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <StyledCheckBoxInput
            type="checkbox"
            id="privacyDataCheckbox"
            onClick={() => {
              customerInfo.autorizzazioneTrattamentoDatiPersonali === "N"
                ? onChangeDisanonima((prevState) => ({
                    ...prevState,
                    customerInfo: { ...prevState.customerInfo, autorizzazioneTrattamentoDatiPersonali: "Y" },
                  }))
                : onChangeDisanonima((prevState) => ({
                    ...prevState,
                    customerInfo: { ...prevState.customerInfo, autorizzazioneTrattamentoDatiPersonali: "N" },
                  }));
              disableWarning();
            }}
          />
          {customerInfo.autorizzazioneTrattamentoDatiPersonali === "Y" ? <IconCheck /> : ""}
        </div>
        <div
          css={css`
            grid-column: label;
            color: #333333;
            font-family: Mulish;
            font-size: 1.125rem;
            line-height: 30px;
            font-weight: 400;
          `}
        >
          <FormattedMessage
            description="description of checkbox privacy data in privacy data"
            defaultMessage="Trattamento dati per attività promozionali e di marketing diretto, la partecipazione a manifestazioni a premio e ricerche di mercato, senza riferimenti alle vincite"
          />
        </div>
      </StyledCheckBox>

      <StyledCheckBox>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <StyledCheckBoxInput
            type="checkbox"
            id="consensoScopiPromozionaliCheckbox"
            onClick={() => {
              customerInfo.consensoScopiPromozionali === "N"
                ? onChangeDisanonima((prevState) => ({
                    ...prevState,
                    customerInfo: { ...prevState.customerInfo, consensoScopiPromozionali: "Y" },
                  }))
                : onChangeDisanonima((prevState) => ({
                    ...prevState,
                    customerInfo: { ...prevState.customerInfo, consensoScopiPromozionali: "N" },
                  }));
              disableWarning();
            }}
          />
          {customerInfo.consensoScopiPromozionali === "Y" ? <IconCheck /> : ""}
        </div>
        <div
          css={css`
            grid-column: label;
            color: #333333;
            font-family: Mulish;
            font-size: 1.125rem;
            line-height: 30px;
            font-weight: 400;
          `}
        >
          <FormattedMessage
            description="description of checkbox privacy sisal in privacy data step"
            defaultMessage="Trattamento dati per comunicazione a società del gruppo Sisal per le medesime finalità di cui al punto 3"
          />
        </div>
      </StyledCheckBox>

      <StyledDisanonimaTitle>
        <FormattedMessage description="Title of PEP data step in disanonima" defaultMessage="PEP" />
      </StyledDisanonimaTitle>
      <StyledCheckBox>
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <StyledCheckBoxInput
            type="checkbox"
            id="pepCheckbox"
            onClick={() => {
              if (isPPE) {
                const isNotPPE = configPpe && configPpe.item.find(({ description }) => description === "NESSUNA");
                isNotPPE &&
                  onChangeDisanonima((prevState) => ({
                    ...prevState,
                    customerInfo: { ...prevState.customerInfo, listaPep: isNotPPE.id },
                  }));
              }
              setIsPPE(!isPPE);
              disableWarning();
            }}
          />
          {isPPE ? <IconCheck /> : ""}
        </div>

        <div
          css={css`
            grid-column: label;
            color: #333333;
            font-family: Mulish;
            font-size: 1.125rem;
            line-height: 30px;
            font-weight: 400;
          `}
        >
          <FormattedMessage
            description="description of PEP data in privacy data step"
            defaultMessage="Il cliente è una persona politicamente esposta"
          />
        </div>
      </StyledCheckBox>

      {isPPE && (
        <div
          css={css`
            margin: 0px 50px;
          `}
          onClick={disableWarning}
        >
          <SelectPPERole roleList={configPpe?.item || []} onChange={onChangeDisanonima} value={customerInfo.listaPep} />
        </div>
      )}
      <div
        css={css`
          position: absolute;
          bottom: 30px;
          right: 50px;
        `}
      >
        <StyledButtonGreen disabled={isDisable} onClick={goToPaymentOptions}>
          <FormattedMessage defaultMessage="Avanti" description="avanti button in fiscal code step" />
        </StyledButtonGreen>
      </div>
    </>
  );
}

const StyledCheckBox = styled.div`
  display: grid;
  grid-template-columns: [checkbox] 40px [label] 640px;
  grid-column-gap: 20px;
  align-items: center;
  padding: 30px 50px;
  svg {
    position: absolute;
    height: auto;
    z-index: 1;
    width: 35px;
    margin: 0px;
    margin-left: 2px;
  }
`;

const StyledCheckBoxInput = styled.input`
  &[type="checkbox"] {
    appearance: none;
    grid-column: checkbox;
    box-sizing: border-box;
    z-index: 2;
    height: 40px;
    width: 40px;
    border: 2px solid #222222;
    border-radius: 9px;
    &:focus {
      outline: none;
    }
    margin: 0;
  }
`;
