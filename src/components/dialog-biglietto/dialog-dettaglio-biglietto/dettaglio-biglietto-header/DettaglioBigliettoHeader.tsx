import React, { useCallback, useMemo } from "react";
import styled, { css } from "styled-components/macro";
import { useDialogActions } from "src/components/dialog-biglietto/dialog-dettaglio-biglietto/dettaglio-biglietto-header/useDialogActions";
import { useDialogShortcuts } from "src/components/dialog-biglietto/dialog-dettaglio-biglietto/dettaglio-biglietto-header/useDIalogShortcuts";
import { ReactComponent as IconDanger } from "src/assets/images/icon-danger.svg";
import { PronosticiParamsType } from "src/types/pronosticiParams.types";
import { TicketType } from "src/types/ticket.types";
import { EventStatusMapping } from "src/mapping/event-status/event-status.class";
import { DispositiveOperationEnum, DispositiveOperationMapping } from "src/mapping/DispositiveOperationMapping";
import { EventStatusEnum } from "src/mapping/event-status/event-status.enum";
import { TicketStatusEnum, TicketStatusMapping } from "src/mapping/TicketStatusMapping";
import { TicketTypeMapping } from "src/mapping/TicketTypeMapping";
import { Toast } from "src/components/common/toast-message/Toast";
import { ReactComponent as IcoDanger } from "src/assets/images/icon-danger.svg";
import { checkIfCanAnnulla } from "src/components/dialog-biglietto/CheckBiglietto";
import { Alert } from "src/components/common/blocking-alert/BlockingAlert";
import { FormattedMessage } from "react-intl";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { DisanonimaDialog } from "src/components/common/disanonima-dialog/DisanonimaDialog";

export function DettaglioBigliettoHeader({
  dettaglioBiglietto,
  balanceAmountIsEnough,
  setMinimize,
  pushToast,
  onClose,
  onAddMultyEsitoToCart,
  onPayment,
  onAnnullaBiglietto,
  isValidating,
  isButtonDisabled,
}: {
  dettaglioBiglietto: TicketType;
  balanceAmountIsEnough: boolean;
  setMinimize(minimized: boolean): void;
  onClose(): void;
  onAddMultyEsitoToCart(pronostici: Array<PronosticiParamsType>): void;
  pushToast(content: React.ReactNode, duration: number): void;
  onClose: () => void;
  onPayment(ticketId: string, ticketResponseDetail: TicketType): void;
  onAnnullaBiglietto(): void;
  isValidating: boolean;
  isButtonDisabled: boolean;
}) {
  const { closeBlockingAlertState, openBlockingAlertState } = useNavigazioneActions();
  const dispositiveOperationEnum = useMemo<DispositiveOperationEnum[] | null>(() => {
    const notReportedMatchEventsCounter = EventStatusMapping.getAmountNotReportedEvents(dettaglioBiglietto.events);
    const dispositiveOp = TicketStatusMapping.whichDispositiveOp(
      dettaglioBiglietto.status,
      checkIfCanAnnulla(new Date().getTime(), dettaglioBiglietto),
      dettaglioBiglietto.isDeAnonymization,
      notReportedMatchEventsCounter,
    );
    return dispositiveOp;
  }, [dettaglioBiglietto]);
  const reportedMatchEventsCounter = EventStatusMapping.getAmountNotReportedEvents(dettaglioBiglietto.events);

  const dataQaButton = (dispositiveOperation: DispositiveOperationEnum): string => {
    switch (dispositiveOperation) {
      case DispositiveOperationEnum.REBET:
        return `rebet`;
      case DispositiveOperationEnum.ANNULLA:
        return "annulla";
      case DispositiveOperationEnum.PAGA:
        return "pagabiglietto";
      case DispositiveOperationEnum.RIMBORSA:
        return "rimborsabiglietto";
      default:
        return "";
    }
  };
  const statusToCount = [
    [EventStatusEnum.LOSING],
    [EventStatusEnum.WINNING],
    [EventStatusEnum.UNDEFINED],
    [EventStatusEnum.CANCELED],
  ];
  const eventStatusCountList = statusToCount
    .map((status) => ({
      counter: EventStatusMapping.getAmountEventsByStatus(dettaglioBiglietto.events, status),
      color: EventStatusMapping.whichColor(status[0]),
      name: status,
    }))
    .filter((status) => status.counter);

  const isDispositiveOperationsButtonDisabled = (operation: DispositiveOperationEnum): boolean => {
    return (
      dettaglioBiglietto.status === TicketStatusEnum.BLOCKED ||
      (TicketStatusEnum.WINNING &&
        TicketStatusEnum.PAYABLE_REFUNDABLE &&
        (operation === "Paga" || operation === "Rimborsa") &&
        !balanceAmountIsEnough)
    );
  };
  // warning Pronostici Rebet
  const onOpenDangerToastRebet = useCallback(() => {
    pushToast(
      <Toast type="danger" heading="Impossibile effettuare il rebet" description="Alcuni esiti hanno cambiato stato" />,
      5000,
    );
  }, [pushToast]);

  const { rebetAction, isViewWarningRebet, minimizedProceed } = useDialogActions({
    dettaglioBiglietto,
    setMinimize,
    onClose,
    onAddMultyEsitoToCart,
    onOpenDangerToastRebet,
  });

  const disanonimaPagaAction = () => {
    setMinimize(true);

    openBlockingAlertState(
      <Alert
        type={"warning"}
        heading={
          <FormattedMessage
            defaultMessage="Avviare disanonimazione"
            description="default header title of popup disanonina alert"
          />
        }
        description={
          <FormattedMessage
            defaultMessage="L’importo di puntata supera la soglia di antiriciclaggio. Per vendere questo biglietto dovrai eseguire la procedura di disanonimazione per l’antiriciclaggio"
            description="description of disanonina alert"
          />
        }
        primaryButtonAction={() => {
          openBlockingAlertState(
            <DisanonimaDialog totalAmount={dettaglioBiglietto.paymentAmount} ticketId={dettaglioBiglietto.ticketId} />,
          );
        }}
        primaryButtonText={
          <FormattedMessage
            defaultMessage="Disanonima e paga"
            description="default primary action popup disanonina alert"
          />
        }
        secondaryButtonAction={closeBlockingAlertState}
        secondaryButtonText={
          <FormattedMessage defaultMessage="Annulla" description="annulla button of popup disanonina alert" />
        }
      />,
    );
  };

  useDialogShortcuts({
    dispositiveOperationEnum,
    onClose,
    dettaglioBiglietto,
    isDispositiveOperationsButtonDisabled,
    disanonimaPagaAction,
    onPayment,
    isViewWarningRebet,
    rebetAction,
    onAnnullaBiglietto,
  });
  const dispositiveOperationAction = (operation: DispositiveOperationEnum) => {
    switch (operation) {
      case "Rebet":
        return rebetAction();
      case "Annulla":
        onAnnullaBiglietto();
        return;
      case "Paga":
        onClose();
        return onPayment(dettaglioBiglietto.ticketId, dettaglioBiglietto);
      case "Disanonima e Paga":
        return disanonimaPagaAction();
      case "Rimborsa":
        onClose();
        return onPayment(dettaglioBiglietto.ticketId, dettaglioBiglietto);
      default:
        return;
    }
  };

  return (
    <>
      <StyledDettaglioBigliettoHeader>
        {isViewWarningRebet && (
          <BoxWarning
            heading={"Entrambi i carrelli risultano già compilati."}
            description={"Svuotane almeno uno per rigiocare la scommessa."}
            onCancel={() => onClose()}
            onProceed={() => minimizedProceed()}
          />
        )}

        <StyledDialogBodyInfoAggiuntivaContainerLeft>
          <StyledDialogBodyInfoAggiuntivaStatus
            style={{ backgroundColor: TicketStatusMapping.whichColor(dettaglioBiglietto.status) }}
            data-qa={`stato-${dettaglioBiglietto.ticketId}`}
          >
            {TicketStatusMapping.whichLabel(dettaglioBiglietto.status)}
          </StyledDialogBodyInfoAggiuntivaStatus>
          <StyledDialogBodyInfoAggiuntivaContainerType>
            <StyledDialogBodyInfoAggiuntivaType>
              {TicketTypeMapping.whichLabel(dettaglioBiglietto.ticketType.valueOf())}
            </StyledDialogBodyInfoAggiuntivaType>
            <StyledDialogBodyInfoAggiuntivaContainerNumbers>
              {eventStatusCountList.map((status) => (
                <StyledDialogBodyInfoAggiuntivaEventsStatusCount
                  key={status.color}
                  className={"status_counter status_counter_" + status.name}
                  style={{ backgroundColor: status.color }}
                >
                  {status.counter}
                </StyledDialogBodyInfoAggiuntivaEventsStatusCount>
              ))}
              <StyledDialogBodyInfoAggiuntivaEventsStatusTotal>
                / {dettaglioBiglietto.events.length}
              </StyledDialogBodyInfoAggiuntivaEventsStatusTotal>
            </StyledDialogBodyInfoAggiuntivaContainerNumbers>
          </StyledDialogBodyInfoAggiuntivaContainerType>
        </StyledDialogBodyInfoAggiuntivaContainerLeft>

        <StyledDialogBodyInfoAggiuntivaContainerRight>
          <StyledDialogBodyInfoAggiuntivaContainerType>
            {!isValidating &&
              dispositiveOperationEnum?.sort().map((operation: DispositiveOperationEnum) => (
                <Button
                  onClick={() => dispositiveOperationAction(operation)}
                  key={operation}
                  disabled={isDispositiveOperationsButtonDisabled(operation) || isButtonDisabled}
                  data-qa={`${dataQaButton(operation)}-${dettaglioBiglietto.ticketId}`}
                >
                  <StyledDialogBodyButtonLabel>
                    {DispositiveOperationMapping.whichLabel(operation, reportedMatchEventsCounter)}
                  </StyledDialogBodyButtonLabel>
                  <StyledDialogBodyButtonShortcut>
                    {DispositiveOperationMapping.whichShortcut(operation)}
                  </StyledDialogBodyButtonShortcut>
                </Button>
              ))}
          </StyledDialogBodyInfoAggiuntivaContainerType>
        </StyledDialogBodyInfoAggiuntivaContainerRight>
      </StyledDettaglioBigliettoHeader>
    </>
  );
}

type BoxWarningProps = {
  heading: string;
  description: string;
  onCancel: () => void;
  onProceed: () => void;
};

function BoxWarning({ heading, description, onCancel, onProceed }: BoxWarningProps) {
  return (
    <StyledBoxMessageWrapper>
      <StyledBoxMessageContainer>
        <IconDanger style={{ gridRow: `-1 / 1`, gridColumn: `icon`, height: `34px`, width: `34px` }} />
        <StyledBoxMessageDescription>
          <StyledHeading color={"#333333"}>{heading}</StyledHeading>
          {description && <StyledDescription color={"#333333"}>{description}</StyledDescription>}
        </StyledBoxMessageDescription>
        <BoxMessageButton onClick={onCancel} color={"transparent"}>
          Annulla
        </BoxMessageButton>
        <BoxMessageButton onClick={onProceed} color={"black"}>
          Procedi
        </BoxMessageButton>
      </StyledBoxMessageContainer>
    </StyledBoxMessageWrapper>
  );
}

const StyledBoxMessageWrapper = styled.div`
  display: block;
  align-items: flex-start;
  width: calc(100% - 48px);
  position: absolute;
  top: 13px;
  margin-left: -5px;
`;

const StyledBoxMessageContainer = styled.div`
  display: grid;
  grid-template-columns: [icon] min-content [message] auto [btnCancel] min-content [btnProceed] min-content;
  column-gap: 5px;
  grid-row-gap: 2px;
  align-items: center;
  padding: 10px 16px;
  background-color: #ffb800;
  width: 100%;
  border-radius: 8px;
  box-sizing: border-box;
  z-index: 10;
  animation: slide-in-top 0.6s ease-in-out forwards;

  @keyframes slide-in-top {
    0% {
      transform: translateY(-76px);
    }
    50% {
      transform: translateY(0);
    }
  }
`;
const StyledBoxMessageDescription = styled.div`
  display: grid;
  grid-template-rows: [heading] min-content [description] min-content;
  grid-column: message;
  padding-left: 15px;
`;

const StyledHeading = styled.div<{ color: string }>`
  grid-row: heading;
  color: ${(props) => props.color};
  font-family: Roboto;
  font-weight: 900;
  font-size: 1.25rem;
`;

const BoxMessageButton = styled.button<{ color: "black" | "transparent" }>`
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #005936;
  text-align: center;
  height: 50px;
  width: 140px;
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 10px;
  font-weight: bold;
  background-color: ${(props) => (props.color !== "black" ? "rgba(0,0,0,0)" : "#333333")};
  color: ${(props) => (props.color !== "black" ? "#333333" : "#FFFFFF")};
  border: 2px solid #333333;
  font-size: 1.25rem;
`;

const StyledDescription = styled.div<{ color: string }>`
  grid-row: description;
  color: ${(props) => props.color};
  font-family: Roboto;
  font-size: 1rem;
`;

const StyledDettaglioBigliettoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  height: 67px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.5);
  padding: 17px 25px 17px 30px;
  position: relative;
`;

const StyledDialogBodyInfoAggiuntivaContainerLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledDialogBodyInfoAggiuntivaContainerRight = styled.div`
  display: flex;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #005936;
  text-align: center;
  height: 50px;
  width: fit-content;
  border: #005936;
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 10px;
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    cursor: pointer;
  }
  &:disabled {
    cursor: initial;
    background-color: #979797;
  }
`;

const StyledDialogBodyInfoAggiuntivaStatus = styled.div`
  display: flex;
  border-radius: 12.5px;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: 112px;
  color: #ffffff;
  font-family: Mulish, sans-serif;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0;
  text-transform: capitalize;
  line-height: 15px;
`;

const StyledDialogBodyInfoAggiuntivaContainerType = styled.div`
  display: flex;
`;

const StyledDialogBodyButtonLabel = styled.div`
  color: #ffffff;
  font-family: Mulish, sans-serif;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 26px;
  margin-right: 10px;
`;

const StyledDialogBodyButtonShortcut = styled.div`
  height: 20px;
  width: 45px;
  border-radius: 10px;
  background-color: #ffffff;
  color: #333333;
  font-family: Mulish, sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 21px;
`;

const StyledDialogBodyInfoAggiuntivaType = styled.div`
  color: #333333;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 23px;
  padding-top: 5px;
  padding-right: 31px;
`;

const StyledDialogBodyInfoAggiuntivaContainerNumbers = styled.div`
  display: flex;
  margin-top: 2px;
`;

const StyledDialogBodyInfoAggiuntivaEventsStatusCount = styled.div`
  display: flex;
  height: 25px;
  width: 25px;
  border-radius: 12.5px;
  color: #ffffff;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 21px;
  align-items: center;
  justify-content: center;
  &:not(:first-child) {
    margin-left: -5px;
  }
`;

const StyledDialogBodyInfoAggiuntivaEventsStatusTotal = styled.div`
  color: #333333;
  display: flex;
  height: 25px;
  width: auto;
  border-radius: 12.5px;
  background-color: #ffffff;
  font-family: Roboto, sans-serif;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 21px;
  align-items: center;
  justify-content: center;
  padding-left: 4px;
`;

export function AnnullamentoBigliettoFullScreenBlockingModal() {
  return (
    <div
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        css={css`
          background-color: #ffb800;
          width: 50vw;
          padding: 80px;
          display: grid;
          grid-template-columns: min-content 1fr;
          grid-template-rows: auto auto;
          border-radius: 8px;
          font-family: Roboto;
          color: #333333;
          grid-row-gap: 8px;
        `}
      >
        <div
          css={css`
            grid-column: 1;
            grid-row: 1 / span 2;
            margin-right: 40px;
            align-self: center;
          `}
        >
          <IcoDanger width={54} height={54} />
        </div>
        <div
          css={css`
            grid-column: 2;
            grid-row: 1;
            font-size: 1.6rem;
            font-weight: 700;
          `}
        >
          Annullo Scommessa in corso
        </div>
        <div
          css={css`
            grid-column: 2;
            grid-row: 2;
          `}
        >
          Attendi l'esito per poter effettuare nuove operazioni
        </div>
      </div>
    </div>
  );
}
