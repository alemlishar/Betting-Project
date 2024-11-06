import React, { useEffect, useState } from "react";
import { AlertAccettazione } from "src/components/common/full-screen-alert/AlertAccettazione";
import { FullScreenAlert } from "src/components/common/full-screen-alert/FullScreenAlert";
import configuration from "src/helpers/configuration";

// TODO VERIFICARE ED ELIMINARE IL COMPONENTE. POSSIBLE DEAD CODE!
export const VenditaAlert = ({
  isWaitingVendi,
  codiceEsitoVendita,
  onSetCodiceEsitoVendita,
  closeDialog,
  errorText,
}: {
  isWaitingVendi: boolean;
  codiceEsitoVendita: string;
  onSetCodiceEsitoVendita: (e: string) => void;
  closeDialog: () => void;
  errorText: string;
}) => {
  const [visibleMessage, setVisibleMessage] = useState<boolean>(false);

  useEffect(() => {
    const delay = 2000;
    if (codiceEsitoVendita === configuration.SELL_STATUS.OK) {
      setVisibleMessage(true);
      const timer = setTimeout(() => {
        setVisibleMessage(!visibleMessage);
        onSetCodiceEsitoVendita(configuration.SELL_STATUS.NOT_SELLING);
        if (codiceEsitoVendita === configuration.SELL_STATUS.OK) {
          closeDialog();
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [closeDialog, codiceEsitoVendita, isWaitingVendi, onSetCodiceEsitoVendita, visibleMessage]);
  return (
    <>
      <div>
        {isWaitingVendi && (
          <FullScreenAlert
            closeDialog={() => {}}
            errorText={"Attendi l'esito per poter effettuare nuove operazioni"}
            alertType={"warning"}
            alertText={"Vendita del biglietto in corso"}
          />
        )}
      </div>
      <div>
        {(() => {
          if (codiceEsitoVendita === configuration.SELL_STATUS.NOT_SELLING) {
            return <></>;
          }

          switch (codiceEsitoVendita) {
            case configuration.SELL_STATUS.OK: {
              if (visibleMessage)
                return (
                  <FullScreenAlert
                    closeDialog={() => {}}
                    errorText={errorText}
                    alertType={"success"}
                    alertText={"La scommessa è andata a buon fine"}
                  />
                );
              else return <></>;
            }
            case configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE: {
              return <AlertAccettazione />;
            }
            default: {
              return (
                <FullScreenAlert
                  closeDialog={closeDialog}
                  errorText={errorText}
                  alertType={"error"}
                  alertText={"Vendita del biglietto non riuscita"}
                />
              );
            }
          }
        })()}
      </div>
      <div>
        {/*{isGiocataFrazionata && (*/}
        {/*  <FullScreenAlert*/}
        {/*    closeDialog={() => {setGiocataFrazionata(false)}}*/}
        {/*    errorDesc={"Avviare disanonimazione"}*/}
        {/*    errorText={*/}
        {/*      "Sono stati emessi 2 biglietti identici negli ultimi 3 min.\nIl cliente di questo biglietto è lo stesso dei due precedenti?"*/}
        {/*    }*/}
        {/*    alertType={"error"}*/}
        {/*    alertText={"Possibile giocata frazionata"}*/}
        {/*    isActionRequired*/}
        {/*    actionDismiss={actionDismiss}*/}
        {/*    actionContinue={actionContinue}*/}
        {/*  />*/}
        {/*)}*/}
      </div>
    </>
  );
};
