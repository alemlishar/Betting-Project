import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import { HeaderDialog } from "src/components/common/voucher-dialog/HeaderDialog";
import { BodyDialog } from "src/components/common/voucher-dialog/BodyDialog";
import { AlertBox } from "src/components/common/alert-box/AlertBox";
import { FormattedMessage } from "react-intl";
import { EmitVoucherRequest, RefundVoucherRequest } from "src/services/useWebsocketTransaction";

export type ErrorType = {
  method: string;
  status: boolean;
  message: string;
};
export const VoucherDialog = (props: {
  pushToast(content: React.ReactNode, duration: number): void;
  closeToast(content: React.ReactNode): void;
  isOpen: boolean;
  closeDialog: Function;
  onSetIsSaldoCassaDialogOpen: (event: boolean) => void;
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
}) => {
  const { isOpen, onEmitVoucher, onRefundVoucher } = props;
  const [method, setMethod] = useState("Emetti");
  const [error, setError] = useState<ErrorType>({ method: method, status: false, message: "" });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const handleClickOutside = (event: any) => {
    if (wrapperRef.current != null) {
      if (wrapperRef && !wrapperRef.current.contains(event.target)) {
        props.closeDialog();
      }
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        props.closeDialog();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });
  return (
    <React.Fragment>
      {isOpen && (
        <StyledDialog isHidden={isHidden}>
          <StyledDialogBox ref={wrapperRef}>
            {error.status && error.method === method && error.message !== "Saldo Cassa" && (
              <AlertBox alertType="error" message={{ text: error.message }} customStyle={{ height: "70px" }} />
            )}
            {error.status && error.method === "Paga" && error.message === "Saldo Cassa" && (
              <AlertBox
                voucherLayout={true}
                alertType="error"
                message={{
                  text: (
                    <FormattedMessage
                      description="saldo cassa error voucher"
                      defaultMessage="Saldo cassa insufficiente."
                    />
                  ),
                  details: (
                    <FormattedMessage
                      description="saldo cassa error voucher detail"
                      defaultMessage="Effettua una sovvenzione."
                    />
                  ),
                }}
                action={{
                  label: "Saldo Cassa",
                  action: () => {
                    props.onSetIsSaldoCassaDialogOpen(true);
                    props.closeDialog();
                  },
                }}
              />
            )}
            <HeaderDialog>
              <StyledDiv>
                <StyledTextHeader fontSize="30" subTitle={false} italic={false} fontWeight="bold" fontFamily="Mulish">
                  Voucher
                </StyledTextHeader>
                <StyledTextHeader
                  fontSize="18"
                  subTitle={true}
                  fontWeight="300"
                  italic={false}
                  fontFamily="Roboto, sans-serif"
                >
                  <FormattedMessage
                    description="Header Dialog Voucher text'"
                    defaultMessage="Emetti un nuovo Voucher o Pagane uno emesso da sala"
                  />
                </StyledTextHeader>
                <StyledTextHeader
                  fontSize="18"
                  subTitle={true}
                  italic={true}
                  fontWeight="300"
                  fontFamily="Roboto, sans-serif"
                ></StyledTextHeader>
              </StyledDiv>
            </HeaderDialog>
            <Break />
            <BodyDialog
              setIsHidden={setIsHidden}
              method={method}
              setMethod={setMethod}
              onError={error}
              onSetError={setError}
              pushToast={props.pushToast}
              closeToast={props.closeToast}
              closeDialog={props.closeDialog}
              firstButtonLabel="Emetti"
              secondButtonLabel="Paga"
              onEmitVoucher={onEmitVoucher}
              onRefundVoucher={onRefundVoucher}
            />
          </StyledDialogBox>
        </StyledDialog>
      )}
    </React.Fragment>
  );
};

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

const StyledDiv = styled.div`
  width: 100%;
  padding-left: 60px;
  padding-top: 45px;
`;

const Break = styled.div`
  flex-basis: 100%;
  height: 0;
`;

const StyledDialogBox = styled.div`
  display: flex;
  border-radius: 12px;
  flex-wrap: wrap;
  width: 650px;

  position: relative;
  background-color: #ffffff;
`;
const StyledDialog = styled.div<{ isHidden: boolean }>`
  ${(props) =>
    props.isHidden === false
      ? `   display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    width: 100%;
    height: 100vh;
    top: 0;
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.77);`
      : ` display:none`};
`;

export default VoucherDialog;
