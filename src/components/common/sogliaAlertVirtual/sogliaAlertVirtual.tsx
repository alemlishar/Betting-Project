import React from "react";
import { FullAlertVirtual } from "src/components/common/sogliaAlertVirtual/fullAlertVirtual";
import { FullAlert } from "../sogliaAlert/fullAlert";

export const SogliaAlertVirtual = ({
  closeDialog,
  onDismiss,
  onContinue,
}: {
  closeDialog: () => void;
  onDismiss: () => void;
  onContinue: () => void;
}) => {
  return (
    <FullAlertVirtual
      closeDialog={closeDialog}
      errorText={
        "L'importo di puntata supera la soglia antiriciclaggio. Per vendere questo biglietto dovrai eseguire la procedura di disanonimazione per l’antiriciclaggio"
      }
      alertType={"warning"}
      headerText={"Avviare Disanonimazione"}
      isActionRequired
      onDismiss={closeDialog}
      onContinue={onContinue}
    />
  );
};
