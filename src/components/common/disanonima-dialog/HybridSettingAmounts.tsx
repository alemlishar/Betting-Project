import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";
import styled, { css } from "styled-components/macro";
import { FormattedMessage } from "react-intl";
import { DisanonimaState } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { useState } from "react";
import { decimalToInteger } from "src/helpers/formatUtils";
import { parseAsMoney } from "src/helpers/format-data";

type HybridSettingAmountsProps = {
  totalAmount: number;
  onChangeDisanonima: React.Dispatch<React.SetStateAction<DisanonimaState>>;
};

export function HybridSettingAmounts({ totalAmount, onChangeDisanonima }: HybridSettingAmountsProps) {
  //DEBT: recupero soglia_contanti quando sarà disponibile il servizio
  const soglia_contanti = 199999;
  const [cashThresholdError, setCashThresholdError] = useState<boolean>(false);
  const [cashValue, setCashValue] = useState<string>("0,00");
  const [titleAmount, setTitleAmount] = useState<string>(decimalToInteger(totalAmount));
  const [titleAmountError, setTitleAmountError] = useState<boolean>(false);

  const checkValidityCashThreshold = (actualCash: string) => {
    if (Number(actualCash) > soglia_contanti) {
      setCashThresholdError(true);
      onChangeDisanonima((prevState) => {
        return {
          ...prevState,
          alertState: {
            isVisible: true,
            type: "danger",
            title: (
              <FormattedMessage
                description="Title of danger disanonima alert in hybrid payment option max cash Treeshold"
                defaultMessage="Importo non valido"
              />
            ),
            message: (
              <FormattedMessage
                description="Description of danger disanonima alert in hybrid payment option max cash Treeshold"
                defaultMessage="Il pagamento in contanti non può superare {cashthreshold}"
                values={{ cashthreshold: formatCurrency(decimalToIntegerValue(soglia_contanti)) }}
              />
            ),
          },
        };
      });
    } else {
      setCashThresholdError(false);
      setTitleAmountError(false);
      onChangeDisanonima((prevState) => {
        return {
          ...prevState,
          alertState: {
            isVisible: false,
            type: "",
            title: "",
            message: "",
          },
        };
      });
    }
  };

  const onChangeCashValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleanCashString = event.target.value.replaceAll(",", "").replaceAll(".", "");
    if (!/^[0-9]{0,}$/.test(cleanCashString)) {
      return;
    }
    const newTitleAmount = totalAmount - Number(cleanCashString);
    setCashValue(decimalToInteger(cleanCashString));

    setTitleAmount(decimalToInteger(newTitleAmount > 0 ? newTitleAmount : 0));
    checkValidityCashThreshold(cleanCashString);
  };

  return (
    <>
      <div
        css={css`
          display: grid;
          grid-template-columns: [titleAmountLabel] 130px [titelAmountInput] 200px [cashAmountLabel] 157px [cashAmountInput] 200px;
          column-gap: 20px;
          align-items: center;
          margin: 30px 50px;
        `}
      >
        <StyledLabel
          css={css`
            grid-column: titleAmountLabel;
          `}
        >
          <FormattedMessage description="title amount label in hybrid payment" defaultMessage="Importo titolo" />
        </StyledLabel>
        <StyledInput
          css={css`
            grid-column: titelAmountInput;
          `}
          value={titleAmount}
          hasError={titleAmountError}
          onChange={(event) => {
            const cleanNumber = event.target.value.replaceAll(",", "").replaceAll(".", "");

            if (!/^[0-9]{0,}$/.test(cleanNumber)) return;

            const titleAmountValue = Number(cleanNumber);
            const newCashValue = totalAmount - titleAmountValue;
            if (newCashValue < 0) {
              setTitleAmountError(true);
              onChangeDisanonima((prevState) => {
                return {
                  ...prevState,
                  alertState: {
                    isVisible: true,
                    type: "danger",
                    title: (
                      <FormattedMessage
                        description="Title of danger disanonima alert in hybrid payment option title amount input invalid"
                        defaultMessage="Importo non valido"
                      />
                    ),
                    message: (
                      <FormattedMessage
                        description="Description of danger disanonima alert in hybrid payment option title amount input invalid"
                        defaultMessage="L'importo inserito è superiore alla vincita totale "
                      />
                    ),
                  },
                };
              });
            } else {
              setTitleAmountError(false);
              checkValidityCashThreshold(newCashValue.toString());
            }

            setTitleAmount(decimalToInteger(cleanNumber));
            setCashValue(decimalToInteger(newCashValue > 0 ? newCashValue : 0));
          }}
          onBlur={() => {
            const cleanNumber = titleAmount.replaceAll(".", "").replaceAll(",", ".");
            setTitleAmount(parseAsMoney(Number(cleanNumber), true, true));
          }}
        />
        <StyledLabel
          css={css`
            grid-column: cashAmountLabel;
          `}
        >
          <FormattedMessage description="cash amount label in hybrid payment" defaultMessage="Importo contanti" />
        </StyledLabel>
        <StyledInput
          css={css`
            grid-column: cashAmountInput;
          `}
          value={cashValue}
          hasError={cashThresholdError}
          onChange={onChangeCashValue}
          onBlur={() => {
            const cleanNumber = cashValue.replaceAll(".", "").replaceAll(",", ".");
            setCashValue(parseAsMoney(Number(cleanNumber), true, true));
          }}
        />
      </div>
    </>
  );
}

const StyledInput = styled.input<{
  hasError?: boolean;
}>`
  box-sizing: border-box;
  height: 60px;
  border: ${(props) => (props.hasError ? " 4px solid #E31C21" : " 2px solid #979797")};
  border-radius: 8px;
  text-align: right;
  outline: none;
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  color: #444444;
  font-family: Roboto;
  font-size: 1.125rem;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 20px;
  padding-right: 30px;
`;

const StyledLabel = styled.div`
  color: #333333;
  font-family: Roboto;
  inline-size: min-content;
  font-size: 1.125rem;
  line-height: 21.5px;
  font-weight: 400;
`;
