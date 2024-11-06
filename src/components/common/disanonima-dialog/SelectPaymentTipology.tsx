import { values } from "lodash";
import React, { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import icoArrowDownGreen from "src/assets/images/icon-arrow-down-green.svg";
import icoArrowUpGreen from "src/assets/images/icon-arrow-up-green.svg";
import { PaymentType, PaymentTypologiesType } from "src/components/common/disanonima-dialog/PaymentOptions";
import { StyledOption } from "src/components/common/disanonima-dialog/SelectGender";
import { useForeignClickOpen } from "src/components/prematch/templates/utils";
import { css } from "styled-components/macro";

type SelectPaymentTipologyProps = {
  paymentType: PaymentType;
  viewContanti: boolean;
  paymentTypology: PaymentTypologiesType;
  onChangePaymentTypologies: React.Dispatch<React.SetStateAction<PaymentTypologiesType>>;
};

export const SelectPaymentTipology = ({
  paymentType,
  viewContanti,
  paymentTypology,
  onChangePaymentTypologies,
}: SelectPaymentTipologyProps) => {
  const { isOpen, setIsOpen, selectRef } = useForeignClickOpen<HTMLButtonElement>();
  const intl = useIntl();

  const paymentTypologiesList: PaymentTypologiesType[] = useMemo(() => {
    const commonPaymentTypologiesTemp: PaymentTypologiesType[] = [
      {
        id: 0,
        description: intl.formatMessage({
          defaultMessage: "Seleziona...",
          description: "paymentTypologies no description",
        }),
      },
      {
        id: 1,
        description: intl.formatMessage({
          defaultMessage: "Assegno",
          description: "paymentTypologies Assegno description",
        }),
      },
      {
        id: 2,
        description: intl.formatMessage({
          defaultMessage: "Assegno circolare",
          description: "paymentTypologies assegnoCircolare description",
        }),
      },
      {
        id: 3,
        description: intl.formatMessage({
          defaultMessage: "Bonifico Bancario",
          description: "paymentTypologies bonificoBancario description",
        }),
      },
    ];
    if (paymentType === "hybrid") {
      return commonPaymentTypologiesTemp;
    }

    if (viewContanti) {
      const allPaymentTypologiesTemp: PaymentTypologiesType[] = [
        {
          id: 0,
          description: intl.formatMessage({
            defaultMessage: "Seleziona...",
            description: "paymentTypologies no description",
          }),
        },
        {
          id: 1,
          description: intl.formatMessage({
            defaultMessage: "Assegno",
            description: "paymentTypologies Assegno description",
          }),
        },
        {
          id: 2,
          description: intl.formatMessage({
            defaultMessage: "Assegno circolare",
            description: "paymentTypologies assegnoCircolare description",
          }),
        },
        {
          id: 3,
          description: intl.formatMessage({
            defaultMessage: "Bonifico Bancario",
            description: "paymentTypologies bonificoBancario description",
          }),
        },
        {
          id: 4,
          description: intl.formatMessage({
            defaultMessage: "Domiciliazione Postale",
            description: "paymentTypologies domiciliazionePostale description",
          }),
        },

        {
          id: 6,
          description: intl.formatMessage({
            defaultMessage: "Carta con Iban",
            description: "paymentTypologies cartaConIban description",
          }),
        },

        {
          id: 5,
          description: intl.formatMessage({
            defaultMessage: "Carta Prepagata (senza Iban)",
            description: "paymentTypologies cartaPrepagataSenzaIban description",
          }),
        },

        {
          id: 7,
          description: intl.formatMessage({
            defaultMessage: "Contanti",
            description: "paymentTypologies contanti description",
          }),
        },
      ];
      return allPaymentTypologiesTemp;
    } else {
      const uniquePaymentTypologiesTemp: PaymentTypologiesType[] = [
        {
          id: 0,
          description: intl.formatMessage({
            defaultMessage: "Seleziona...",
            description: "paymentTypologies no description",
          }),
        },
        {
          id: 1,
          description: intl.formatMessage({
            defaultMessage: "Assegno",
            description: "paymentTypologies Assegno description",
          }),
        },
        {
          id: 2,
          description: intl.formatMessage({
            defaultMessage: "Assegno circolare",
            description: "paymentTypologies assegnoCircolare description",
          }),
        },
        {
          id: 3,
          description: intl.formatMessage({
            defaultMessage: "Bonifico Bancario",
            description: "paymentTypologies bonificoBancario description",
          }),
        },
        {
          id: 4,
          description: intl.formatMessage({
            defaultMessage: "Domiciliazione Postale",
            description: "paymentTypologies domiciliazionePostale description",
          }),
        },

        {
          id: 6,
          description: intl.formatMessage({
            defaultMessage: "Carta con Iban",
            description: "paymentTypologies cartaConIban description",
          }),
        },
      ];
      return uniquePaymentTypologiesTemp;
    }
  }, [paymentType, viewContanti]);

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <button
        ref={selectRef}
        onClick={() => setIsOpen(!isOpen)}
        css={css`
          box-sizing: border-box;
          height: 60px;
          width: 100%;
          outline: none;
          border: 2px solid #979797;
          border-radius: ${isOpen ? "8px 8px 0 0" : "8px"};
          background-color: #ffffff;
          box-shadow: ${isOpen ? " 1px 2px 4px 0 rgba(0, 0, 0, 0.5)" : ""};
          color: #444444;
          font-family: Roboto;
          font-size: 1.125rem;
          letter-spacing: 0;
          font-weight: 700;
          line-height: 20px;
          text-align: left;
          padding-left: 30px;
          display: flex;
          align-items: center;
          &:hover {
            cursor: pointer;
          }
        `}
      >
        <span
          css={css`
            width: calc(100% - 45px);
            justify-content: center;
          `}
        >
          {paymentTypology.description}
        </span>
        <span
          css={css`
            width: 45px;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <img
            css={css`
              width: 15px;
              height: 15px;
            `}
            onClick={() => setIsOpen(!isOpen)}
            src={isOpen ? icoArrowUpGreen : icoArrowDownGreen}
            alt={""}
          />
        </span>
      </button>
      {isOpen && (
        <div
          css={css`
            position: absolute;
            background-color: #ffffff;
            min-width: 100%;
            z-index: 1;
            box-sizing: border-box;
            border: 2px solid #979797;
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.5);
            max-height: 240px;
            overflow-y: scroll;
            &::-webkit-scrollbar-thumb {
              background: #d8d8d8;
              height: 30px;
              border-radius: 5px;
            }
            &::-webkit-scrollbar {
              width: 9px;
            }
            &::-webkit-scrollbar-track {
              margin-right: 12px;
            }
          `}
        >
          {paymentTypologiesList.map((item) => {
            return (
              <StyledOption
                isActiveFilter={item.id === paymentTypology.id}
                onClick={() => {
                  setIsOpen(false);
                  onChangePaymentTypologies(item);
                }}
              >
                {item.description}
              </StyledOption>
            );
          })}
        </div>
      )}
    </div>
  );
};
