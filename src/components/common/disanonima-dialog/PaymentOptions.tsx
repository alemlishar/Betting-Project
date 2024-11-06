import React, { useState, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AnagraficaDTO } from "src/components/common/disanonima-dialog/disanonima-dto";
import { DisanonimaState, StyledDisanonimaTitle } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { StyledButtonGreen } from "src/components/common/disanonima-dialog/CodiceFiscale";
import { StyledRadioButton, StyledRadioChecked } from "src/components/common/disanonima-dialog/DocumentRegistration";
import { HybridSettingAmounts } from "src/components/common/disanonima-dialog/HybridSettingAmounts";
import { SelectPaymentTipology } from "src/components/common/disanonima-dialog/SelectPaymentTipology";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";
import styled, { css } from "styled-components/macro";
import { StyledButton } from "src/components/prenotazioni/Prenotazione";

type PaymentOptionsProps = {
  customerInfo: AnagraficaDTO;
  totalAmount: number;
  ticketId?: string;
  onChangeDisanonima: React.Dispatch<React.SetStateAction<DisanonimaState>>;
};
export type PaymentType = "uniqueTitle" | "hybrid";
export type PaymentTypologiesType = { id: number; description: string };

export function PaymentOptions({ customerInfo, totalAmount, onChangeDisanonima }: PaymentOptionsProps) {
  const backToNext = useCallback(() => {
    onChangeDisanonima((prevState) => {
      return { ...prevState, step: "privacyData" };
    });
  }, []);

  const intl = useIntl();
  const soglia_contanti = 199999;
  const [paymentType, setPaymentType] = useState<PaymentType>("uniqueTitle");
  const { nome, cognome } = customerInfo;
  const defaultPaymentTipology = {
    id: 0,
    description: intl.formatMessage({
      defaultMessage: "Seleziona...",
      description: "paymentTypologies no description",
    }),
  };
  const forwardToNext = useNavigazioneActions();

  const [paymentTypologySelected, setPaymentTypologySelected] = useState<PaymentTypologiesType>(defaultPaymentTipology);
  console.log(totalAmount < soglia_contanti);
  const isDisable = paymentType == "uniqueTitle" && paymentTypologySelected.id == 4 ? false : true;

  return (
    <>
      <StyledDisanonimaTitle>
        <FormattedMessage description="Payment options title" defaultMessage="Opzioni pagamento" />
      </StyledDisanonimaTitle>
      <StyledGrid>
        <div
          css={css`
            display: grid;
            grid-template-columns: [infoLabel] 170px [infoValue] auto;
            grid-template-rows: [customerName] auto [totalAmount] auto;
            column-gap: 20px;
            padding: 20px;
          `}
        >
          <div
            css={css`
              grid-row: customerName;
              grid-column: infoLabel;
              font-weight: 700;
            `}
          >
            <FormattedMessage
              description="Name and surname label in payment options step"
              defaultMessage="Nome e Cognome"
            />
          </div>
          <div
            css={css`
              grid-row: customerName;
              grid-column: infoValue;
              text-transform: capitalize;
            `}
          >
            {nome.toLowerCase()} {cognome.toLowerCase()}
          </div>

          <div
            css={css`
              grid-row: totalAmount;
              grid-column: infoLabel;
              font-weight: 700;
            `}
          >
            <FormattedMessage
              description="Total amount label in payment options step"
              defaultMessage="Totale Importo"
            />
          </div>
          <div
            css={css`
              grid-row: totalAmount;
              grid-column: infoValue;
            `}
          >
            {formatCurrency(decimalToIntegerValue(totalAmount))}
          </div>
        </div>
      </StyledGrid>

      <StyledPaymentOptionsBox>
        <FormattedMessage
          description="Payment option label in payment options step"
          defaultMessage="Opzione pagamento"
        />

        <StyledRadioButton
          onClick={() => {
            setPaymentType("uniqueTitle");
            setPaymentTypologySelected(defaultPaymentTipology);
            onChangeDisanonima((prevState) => ({
              ...prevState,
              alertState: { ...prevState.alertState, isVisible: false },
            }));
          }}
        >
          {paymentType === "uniqueTitle" && <StyledRadioChecked></StyledRadioChecked>}
        </StyledRadioButton>
        <StyledRadioLabel isSelected={paymentType === "uniqueTitle"}>
          <FormattedMessage
            description="Unique title radio button label in payment options step"
            defaultMessage="Titolo unico"
          />
        </StyledRadioLabel>

        <StyledRadioButton
          onClick={() => {
            setPaymentType("hybrid");
            setPaymentTypologySelected(defaultPaymentTipology);
          }}
        >
          {paymentType === "hybrid" && <StyledRadioChecked></StyledRadioChecked>}
        </StyledRadioButton>
        <StyledRadioLabel isSelected={paymentType === "hybrid"}>
          <FormattedMessage
            description="Hibrid title radio button label in payment options step"
            defaultMessage="Ibrido"
          />
        </StyledRadioLabel>
      </StyledPaymentOptionsBox>
      {paymentType === "hybrid" && (
        <HybridSettingAmounts totalAmount={totalAmount} onChangeDisanonima={onChangeDisanonima} />
      )}
      <div
        css={css`
          top: 20 px;
          margin: 0 50px;
          display: grid;
          grid-template-columns: [labelSelectPayment]130px [selectPayment]auto;
          grid-column-gap: 20px;
        `}
      >
        <div
          css={css`
            grid-column: labelSelectPayment;
            color: #333333;
            font-family: Roboto;
            font-size: 18px;
            letter-spacing: 0;
            line-height: 21.5px;
            display: flex;
            align-items: center;
          `}
        >
          <FormattedMessage
            description="Tipologia titolo label in payment options step"
            defaultMessage="Tipologia titolo"
          />
        </div>
        <div
          css={css`
            grid-column: selectPayment;
          `}
        >
          <SelectPaymentTipology
            paymentType={paymentType}
            viewContanti={totalAmount < soglia_contanti}
            paymentTypology={paymentTypologySelected}
            onChangePaymentTypologies={setPaymentTypologySelected}
          />
        </div>
      </div>

      <div
        css={css`
          margin: 0 50px;
          display: grid;
          grid-template-columns: [LabelClientName]130px [ClientName]auto;
          grid-column-gap: 20px;
        `}
      >
        <div
          css={css`
            grid-column: LabelClientName;
            color: #333333;
            font-family: Roboto;
            font-size: 18px;
            letter-spacing: 0;
            line-height: 21.5px;
          `}
        >
          <FormattedMessage description="Payer Client Name" defaultMessage="Nome Cliente" />
        </div>
        <div
          css={css`
            grid-column: ClientName;
          `}
        >
          <div
            css={css`
              font-family: Roboto;
              font-size: 1.125 rem;
              letter-spacing: 0;
              line-height: 21.5px;
              display: flex;
              align-items: center;
              background-color: darkgrey;
              text-transform: capitalize;
            `}
          >
            {nome.toLowerCase()} {cognome.toLowerCase()}
          </div>
        </div>
      </div>

      <div
        css={css`
          position: absolute;
          bottom: 50px;
          right: 50px;
          display: flex;
          justify-content: space-between;
          width: 380px;
        `}
      >
        <StyledButton
          onClick={backToNext}
          data-qa="add_document_annulla_button"
          css={css`
            background-color: #ffffff;
            width: 180px;
          `}
        >
          <FormattedMessage defaultMessage="Indietro" description="Indietro opzioni pagamento di disanonima Dialog" />
        </StyledButton>

        <StyledButtonGreen disabled={isDisable}>
          <FormattedMessage
            defaultMessage="Procedi"
            description="procedi button opzioni pagamento di disanonimazione"
          />
        </StyledButtonGreen>
      </div>
    </>
  );
}

const StyledGrid = styled.div`
  height: 100px;
  width: 747px;
  box-sizing: border-box;
  height: 100px;
  width: 747px;
  border: 3px solid #bbbbbb;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 30px 50px 15px 50px;
  color: #333333;
  font-family: Mulish;
  font-size: 1rem;
  line-height: 30px;
  letter-spacing: 0;
  line-height: 30px;
`;

const StyledPaymentOptionsBox = styled.div`
  height: 60px;
  width: 524px;
  margin: 30px 273px 30px 50px;
  display: grid;
  grid-template-columns: [optionLabel] 120px [uniqueTitleBtn] 37px [uniqueTitleLabel] 158px [hybridBtn] 37px [hybridLabel] auto;
  column-gap: 20px;
  align-items: center;
  font-size: 1.125rem;
  font-family: Roboto;
`;

const StyledRadioLabel = styled.div<{
  isSelected: boolean;
}>`
  font-weight: ${(props) => (props.isSelected ? "700" : "400")};
`;
