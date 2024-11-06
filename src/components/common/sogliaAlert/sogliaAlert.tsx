import React from "react";
import { FullAlert } from "../sogliaAlert/fullAlert";

export const SogliaAlert = ({
  closeDialog,
  onDismiss,
  onContinue,
}: {
  closeDialog: () => void;
  onDismiss: () => void;
  onContinue: () => void;
}) => {
  return (
    <FullAlert
      closeDialog={closeDialog}
      errorDesc={"Avviare disanonimazione"}
      errorText={"Per vendere questo biglietto dovrai eseguire la procedura di disanonimazione per l’antiriciclaggio"}
      alertType={"warning"}
      alertText={"L'importo di puntata supera la soglia antiriciclaggio"}
      isActionRequired
      onDismiss={closeDialog}
      onContinue={onContinue}
    />
  );
};
