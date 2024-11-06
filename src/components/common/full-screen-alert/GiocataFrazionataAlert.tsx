import { FullScreenAlert } from "./FullScreenAlert";
import React from "react";
import { VenditaOptionalParameters } from "../../../types/vendita.types";

export const GiocataFrazionataAlert = ({
  closeDialog,
  forceSell,
  disanonima,
}: {
  closeDialog: () => void;
  forceSell: (params?: VenditaOptionalParameters) => void;
  disanonima: () => void;
}) => {
  return (
    <FullScreenAlert
      closeDialog={closeDialog}
      errorDesc={"Avviare disanonimazione"}
      errorText={
        "Sono stati emessi 2 biglietti identici negli ultimi 3 min.\nIl cliente di questo biglietto è lo stesso dei due precedenti?"
      }
      alertType={"warning"}
      alertText={"Possibile giocata frazionata"}
      isActionRequired
      actionDismiss={() => {
        forceSell({ forceSell: true });
      }}
      actionContinue={disanonima}
    />
  );
};
