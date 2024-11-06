import React, { useState, useRef, useEffect, useContext } from "react";
import { Toast } from "src/components/common/toast-message/Toast";
import { useEmettiVoucher, usePagaVoucher } from "src/components/common/voucher-dialog/useVoucher";
import styled from "styled-components";
import closeDialog from "src/assets/images/closeDialog.png";
import { mutate } from "swr";
import { ErrorType } from "src/components/common/voucher-dialog/VoucherDialog";
import configuration from "src/helpers/configuration";
import { FormattedMessage } from "react-intl";

import { Alert } from "src/components/common/blocking-alert/BlockingAlert";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { EmitVoucherRequest, RefundVoucherRequest } from "src/services/useWebsocketTransaction";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";

type propsType = {
  method: string;
  setMethod: (button: string) => void;
  pushToast(content: React.ReactNode, duration: number): void;
  closeToast(content: React.ReactNode): void;
  closeDialog: Function;
  firstButtonLabel: string;
  secondButtonLabel: string;
  onError: ErrorType;
  onSetError(error: ErrorType): void;
  setIsHidden: (e: boolean) => void;
  onEmitVoucher(
    params: EmitVoucherRequest,
    {
      onSuccess,
      onError,
    }: {
      onSuccess(params: { amount: number }): void;
      onError(params: {}): void;
    },
  ): void;
  onRefundVoucher(
    params: RefundVoucherRequest,
    {
      onSuccess,
      onError,
    }: {
      onSuccess(params: { amount: number }): void;
      onError(params: any): void; // DEBT
    },
  ): void;
};
export const BodyDialog = (props: propsType) => {
  const { balanceAmount } = useContext(GlobalStateContext);
  const { openBlockingAlertState, closeBlockingAlertState } = useNavigazioneActions();

  const method = props.method;
  const setMethod = props.setMethod;
  const pushToast = props.pushToast;
  const closeToast = props.closeToast;
  const onError = props.onError;
  const onSetError = props.onSetError;
  const { onRefundVoucher, setIsHidden, closeDialog } = props;

  //EMISSIONE VOUCHER
  const inputRef = useRef<HTMLInputElement>(null);
  const [fixedAmountsClicked, setFixedAmountsClicked] = useState(false);
  const amounts = [10, 20, 50, 70, 100];

  const emettiVoucher = useEmettiVoucher({
    pushToast,
    closeToast,
    fixedAmountsClicked,
    setFixedAmountsClicked,
    inputRef,
  });

  useEffect(() => {
    if (method === "Emetti") {
      onSetError(emettiVoucher.error);
    }
  }, [emettiVoucher.error, method, onSetError]);

  const emitVoucher = () => {
    props.closeDialog();
    openBlockingAlertState(
      <Alert
        type={"warning"}
        heading={
          <FormattedMessage
            defaultMessage="Emissione Voucher in corso"
            description="waiting emit voucher header title of emit voucher alert"
          />
        }
        description={
          <FormattedMessage
            defaultMessage="Attendi l'esito per poter effettuare nuove operazioni"
            description="waiting emit voucher description title of emit voucher alert"
          />
        }
        hasHourGlassIcon={true}
      />,
    );
    props.onEmitVoucher(
      { value: parseFloat(emettiVoucher.importo.toString()).toFixed(2) },
      {
        onSuccess({ amount }) {
          closeBlockingAlertState();
          mutate("balanceAmountService");
          pushToast(
            <Toast
              type="success"
              heading={
                <FormattedMessage
                  description="default header title emit voucher toast"
                  defaultMessage="Emissione voucher di {amount} andata a buon fine"
                  values={{ amount: `€  ${amount.toFixed(2).replace(".", ",")}` }}
                />
              }
              description={
                <FormattedMessage
                  description="default desctiption emit voucher toast"
                  defaultMessage="Saldo cassa aggiornato"
                />
              }
            />,
            5000,
          );
        },
        onError() {
          openBlockingAlertState(
            <Alert
              type={"danger"}
              heading={
                <FormattedMessage
                  defaultMessage="Errore durante emissione del voucher"
                  description="generic emit voucher error alert"
                />
              }
              description={""}
              onClose={closeBlockingAlertState}
            />,
          );
        },
      },
    );
  };

  //PAGAMENTO VOUCHER
  const pagaVoucher = usePagaVoucher({ onSetError, onError, method });

  const refundVoucher = () => {
    setIsHidden(true);
    openBlockingAlertState(
      <Alert
        type={"warning"}
        heading={
          <FormattedMessage
            defaultMessage="Pagamento Voucher in corso"
            description="waiting sell voucher header title of sell voucher alert"
          />
        }
        description={
          <FormattedMessage
            defaultMessage="Attendi l'esito per poter effettuare nuove operazioni"
            description="waiting sell voucher description title of sell voucher alert"
          />
        }
        hasHourGlassIcon={true}
      />,
    );
    onRefundVoucher(
      { voucherId: pagaVoucher.codeInput.toUpperCase(), cashBalance: balanceAmount },
      {
        onSuccess({ amount }) {
          closeBlockingAlertState();
          closeDialog();
          mutate("balanceAmountService");
          pushToast(
            <Toast
              type="success"
              heading={
                <FormattedMessage
                  description="default header title refund voucher toast"
                  defaultMessage="Pagamento voucher di {amount} andato a buon fine"
                  values={{ amount: `€  ${amount.toFixed(2).replace(".", ",")}` }}
                />
              }
              description={
                <FormattedMessage
                  description="default desctiption refund voucher toast"
                  defaultMessage="Saldo cassa aggiornato correttamente"
                />
              }
            />,
            5000,
          );
        },
        onError(error) {
          closeBlockingAlertState();
          //Caso saldo cassa insufficiente
          if (
            error.response.error &&
            error.response.error.properties &&
            error.response.error.properties.length !== 0 &&
            error.response.error.properties[0].value === configuration.SALDO_CASSA_ERROR_VOUCHER_ID
          ) {
            setIsHidden(false);
            return onSetError({ method: "Paga", status: true, message: "Saldo Cassa" });
          }
          //Caso biglietto scaduto
          else if (
            error.response.error &&
            error.response.error.properties &&
            error.response.error.properties.length !== 0 &&
            error.response.error.properties[0].value === configuration.VOUCHER_EXPIRED_BLOCKED
          ) {
            setIsHidden(false);
            return onSetError({
              method: "Paga",
              status: true,
              message: "Codice scaduto o bloccato",
            });
          } else {
            closeDialog();
            closeToast(<Toast type="danger" heading="Codice errato o non esistente" />);
          }
        },
      },
    );
  };

  return (
    <StyledBody
      onClick={() => {
        pagaVoucher.setIsOnFocus(false);
      }}
    >
      <TopButtons>
        <StyledButton
          data-qa="Voucher_Emetti"
          active={method === "Emetti" ? true : false}
          onClick={() => setMethod("Emetti")}
        >
          {props.firstButtonLabel}
        </StyledButton>
        <StyledButton
          data-qa="Voucher_Paga"
          active={method === "Paga" ? true : false}
          onClick={() => setMethod("Paga")}
        >
          {props.secondButtonLabel}
        </StyledButton>
      </TopButtons>
      <BodyMethodDialog>
        {method === "Emetti" && (
          <>
            <RowOfPredefinedAmounts rows={1}>
              {amounts.map((amount, index) => (
                <VoucherBox
                  data-qa={`Voucher_Taglio_${amount}`}
                  key={"amount" + index}
                  isActive={emettiVoucher.activeArray[index] === true ? true : false}
                  onClick={() => {
                    setFixedAmountsClicked(true);
                    emettiVoucher.setImportFromAmountBox(amount, index);
                  }}
                >
                  {amount} €
                </VoucherBox>
              ))}
            </RowOfPredefinedAmounts>
            <RowOfValues rows={6}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
                <VoucherBox
                  data-qa={`Voucher_TN${number}`}
                  key={"nr" + number}
                  isActive={false}
                  onClick={() => emettiVoucher.updateInputBox(number)}
                >
                  {number}
                </VoucherBox>
              ))}
            </RowOfValues>
            <RowOfInput>
              <ColumnVoucher>
                <FormattedMessage defaultMessage="Inserisci" description="Emetti Voucher text"></FormattedMessage>
                <br></br>
                <strong>
                  <FormattedMessage
                    defaultMessage="Importo Voucher"
                    description="Emetti Voucher text"
                  ></FormattedMessage>
                </strong>
              </ColumnVoucher>

              <ColumnVoucher>
                <InputVoucher
                  placeholder="€"
                  data-qa="Voucher_Importo"
                  method={method}
                  ref={inputRef}
                  value={emettiVoucher.importoInput}
                  onBlur={() => emettiVoucher.formatMoney()}
                  onKeyDown={(e) => (e.key === "." ? e.preventDefault() : emettiVoucher.handleOnKeydown(e.key))}
                  onChange={(e) => {
                    emettiVoucher.changeInputOnKeydown(e.target.value);
                  }}
                  onFocus={() => emettiVoucher.setFocus()}
                  focus={false}
                  error={onError}
                ></InputVoucher>
              </ColumnVoucher>
            </RowOfInput>
            <RowOfButton>
              <ButtonConferma
                data-qa="Voucher_BNT_Conferma"
                onClick={() => emitVoucher()}
                disabled={
                  emettiVoucher.importo === 0 ||
                  emettiVoucher.importoInput === "" ||
                  emettiVoucher.importoInput === "€ 0,00" ||
                  emettiVoucher.error.status
                }
              >
                <ButtonText>
                  <FormattedMessage
                    defaultMessage="Conferma"
                    description="Button Confrim of Emssione voucher"
                  ></FormattedMessage>
                </ButtonText>
              </ButtonConferma>
            </RowOfButton>
          </>
        )}
        {method === "Paga" && (
          <>
            <div>
              <RowOfValues rows={6}>
                {configuration.NUMPAD_PAGA_VOUCHER.map((value) => (
                  <VoucherBox
                    key={value}
                    isActive={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetError({ method: "Paga", status: false, message: "" });
                      pagaVoucher.updateVoucherCodeBox(value);
                    }}
                  >
                    {value}
                  </VoucherBox>
                ))}
              </RowOfValues>
              <RowOfInput>
                <ColumnVoucher>
                  Inserisci
                  <br />
                  <strong>Codice IB</strong>
                </ColumnVoucher>
                <ColumnVoucher>
                  <InputVoucher
                    onClick={(e) => e.stopPropagation()}
                    method={method}
                    type="search"
                    ref={pagaVoucher.inputRefPaga}
                    value={pagaVoucher.formattedVoucherCode}
                    onChange={(e) => {
                      pagaVoucher.changeInputOnKeydown(e.target.value);
                    }}
                    placeholder="C123 4567 8901 2345"
                    pattern={pagaVoucher.spacedProgressiveRegex()}
                    focus={pagaVoucher.isOnFocus}
                    error={onError}
                    autoFocus={true}
                  ></InputVoucher>
                </ColumnVoucher>
              </RowOfInput>
              <RowOfButton>
                <ButtonConferma
                  disabled={pagaVoucher.codeInput.length < 16 || (onError.status && onError.method === "Paga")}
                  onClick={() => refundVoucher()}
                >
                  <ButtonText>
                    <FormattedMessage
                      defaultMessage="Conferma"
                      description="Button Confrim of Payment Voucher"
                    ></FormattedMessage>
                  </ButtonText>
                </ButtonConferma>
              </RowOfButton>
            </div>
          </>
        )}
      </BodyMethodDialog>
    </StyledBody>
  );
};

const BodyMethodDialog = styled.div`
  width: 100%;
`;

const StyledButton = styled.button<{
  active: Boolean;
}>`
  font-size: 20px;
  font-weight: 800;
  line-height: 23px;
  text-align: center;
  height: 50px;
  border-radius: 30px !important;
  font-family: Mulish;
  width: 255px;
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
  margin: 20px 0px;
  justify-content: space-between;
`;

const StyledBody = styled.div`
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

const ButtonConferma = styled.button`
  height: 65px;
  width: 100%;
  border: none;
  border-radius: 10px;
  background-color: #005936;

  color: #ffffff;
  cursor: pointer;
  &:disabled {
    background-color: #979797;
    cursor: default;
  }
  &:focus {
    outline: 0px;
  }
`;

const ButtonText = styled.div`
  font-family: Roboto;
  font-size: 23px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 27px;
  text-align: center;
  &.disabled {
    color: #bbbbbb;
  }
  &.enabled {
    color: #ffffff;
  }
`;

const InputVoucher = styled.input<{
  method: string;
  focus: boolean;
  error: ErrorType;
}>`
  height: ${(props) => (props.method === "Emetti" ? "50px" : "60px")};
  width: ${(props) => (props.method === "Emetti" ? "180px" : "305px")};
  padding: 0px 20px;
  text-align: ${(props) => (props.method === "Emetti" ? "right" : "left")};
  align-self: center;
  caret-color: #aac21f;
  border-radius: 8px;
  font-size: ${(props) => (props.method === "Emetti" ? "27px" : "20px")};
  font-size: ${(props) => (props.method === "Paga" && props.focus ? "none" : "")};
  color: #000000;
  font-family: Roboto;
  text-transform: uppercase;
  font-weight: bold;
  border: 4px solid #ededed;
  &::placeholder {
    color: #979797;
  }
  &:disabled {
    background-color: #ededed;
  }
  ${(props) =>
    (props.method === "Emetti" && !props.error.status) ||
    (props.method === "Paga" && props.focus && !props.error.status)
      ? ` &:focus {
    outline: none;
    border: 4px solid #aac21f;
  }`
      : `outline: none;
      border: 4px solid #ededed;`};
  border: ${(props) => (props.error.status && props.error.method === props.method ? "4px solid #eb1e23" : "")};
  &::placeholder {
    font-weight: 300;
    font-style: italic;
    color: #ffffff;
    opacity: 85%;
  }
  &.red-outline {
    border-color: red;
  }
  & :invalid {
    border: 4px solid #eb1e23;
  }

  ${(props) =>
    props.method === "Paga"
      ? `  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    background-image: url(${closeDialog});
    height: 18px;
    width: 18px;
    cursor:pointer;
  }`
      : ``};
`;

const ColumnVoucher = styled.div`
  font-size: 22px;
`;
const RowOfInput = styled.div`
  margin: 30px 0px;
  justify-content: space-between;
  align-items: center;
  display: flex;
  width: 100%;
`;
const RowOfButton = styled.div`
  margin: 20px 0px;
  justify-content: space-between;
  align-items: center;
  display: flex;
  width: 100%;
`;

const VoucherBox = styled.div<{
  isActive: boolean;
}>`
  color: ${(props) => (props.isActive === true ? "#ffffff" : "#000000")};
  background-color: ${(props) => (props.isActive === true ? "#aac21f" : "none")};
  border-color: ${(props) => (props.isActive === true ? "#aac21f!important" : "grey")};
  width: 100%;
`;
const RowOfValues = styled.div<{
  rows: number;
}>`
  width: 100%;
  margin-bottom: 20px;
  // display: flex;
  ${VoucherBox} {
    margin-right: 4%;
    display: inline-block;
    text-align: center;
    font-size: 30px;
    // margin-bottom: 15px;
    margin-top: 20px;
    border-radius: 10px;
    font-weight: bold;
    padding: 10px 0px;
    background-color: #e4e3e3;
    width: calc(100% / ${(props) => props.rows} - 3.7%);
    &:nth-child(6n) {
      margin-right: 0;
    }
    hr {
      width: 100%;
    }
  }
`;
const RowOfPredefinedAmounts = styled.div<{
  rows: number;
}>`
  display: flex;
  margin-top: 20px;
  width: 100%;
  ${VoucherBox} {
    &:hover {
      cursor: pointer;
    }

    text-align: center;

    padding: 10px;
    font-weight: bold;
    font-size: 28px;

    border-radius: 10px;
    margin-right: 2%;
    border: 2px solid grey;
  }
`;

export default BodyDialog;
