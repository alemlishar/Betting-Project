import { useContext, useEffect, useMemo } from "react";
import { DispositiveOperationEnum } from "src/mapping/DispositiveOperationMapping";
import { TicketType } from "src/types/ticket.types";
import { KeyboardNavigationContext } from "../../../root-container/root-container.component";

export const useDialogShortcuts = ({
  isDispositiveOperationsButtonDisabled,
  disanonimaPagaAction,
  onPayment,
  dettaglioBiglietto,
  rebetAction,
  isViewWarningRebet,
  onClose,
  dispositiveOperationEnum,
  onAnnullaBiglietto,
}: {
  dettaglioBiglietto: TicketType;
  isDispositiveOperationsButtonDisabled: (operation: any) => boolean;
  disanonimaPagaAction: () => void;
  rebetAction: () => void;
  isViewWarningRebet: boolean;
  onPayment(ticketId: string, ticketResponseDetail: TicketType): void;
  onClose: () => void;
  dispositiveOperationEnum: DispositiveOperationEnum[] | null;
  onAnnullaBiglietto(): void;
}) => {
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  useEffect(() => {
    keyboardNavigationContext.current = "dialog-recupera-biglietto";
  }, [keyboardNavigationContext]);
  const operation = dispositiveOperationEnum?.[0];
  const isButtonActive = useMemo(() => {
    return !isDispositiveOperationsButtonDisabled(operation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation]);
  // DEBT
  useEffect(() => {
    if (keyboardNavigationContext.current === "blocking-operation") {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      //REBET case
      if (
        event.ctrlKey &&
        event.key === "r" &&
        operation === "Rebet" &&
        (isButtonActive || !isViewWarningRebet) &&
        keyboardNavigationContext.current === "dialog-recupera-biglietto"
      ) {
        event.preventDefault();
        rebetAction();
      }
      //ANNULLA case
      if (
        event.ctrlKey &&
        event.key === "a" &&
        operation === "Annulla" &&
        isButtonActive &&
        keyboardNavigationContext.current === "dialog-recupera-biglietto"
      ) {
        event.preventDefault();
        onAnnullaBiglietto();
      }
      //DISANONIMA E PAGA case
      if (
        event.ctrlKey &&
        event.key === "d" &&
        operation === "Disanonima e Paga" &&
        isButtonActive &&
        keyboardNavigationContext.current === "dialog-recupera-biglietto"
      ) {
        event.preventDefault();
        disanonimaPagaAction();
      }
      //PAGA case
      if (
        event.ctrlKey &&
        event.key === "c" &&
        operation === "Paga" &&
        isButtonActive &&
        keyboardNavigationContext.current === "dialog-recupera-biglietto"
      ) {
        event.preventDefault();
        onClose();
        onPayment(dettaglioBiglietto.ticketId, dettaglioBiglietto);
      }
      //RIMBORSA case
      if (
        event.ctrlKey &&
        event.key === "t" &&
        operation === "Rimborsa" &&
        isButtonActive &&
        keyboardNavigationContext.current === "dialog-recupera-biglietto"
      ) {
        event.preventDefault();
        onClose();
        onPayment(dettaglioBiglietto.ticketId, dettaglioBiglietto);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [
    dettaglioBiglietto,
    disanonimaPagaAction,
    isButtonActive,
    keyboardNavigationContext,
    onAnnullaBiglietto,
    onPayment,
    operation,
    rebetAction,
    onClose,
    isViewWarningRebet,
  ]);
};
