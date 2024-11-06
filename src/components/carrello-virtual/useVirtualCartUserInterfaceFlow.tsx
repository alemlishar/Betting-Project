import { useCallback, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "src/components/common/blocking-alert/BlockingAlert";
import { Toast } from "src/components/common/toast-message/Toast";
import { StartSellingVirtualTransactionCallbacks } from "src/services/useWebsocketTransaction";
import { SellErrorPropertyType, SuccessResponse } from "src/types/vendita.types";
import { formatCurrency } from "src/helpers/formatCurrencyAmountUtils";
import { mutate } from "swr";
import { useVirtualUpdateClientsContext } from "src/components/common/context-clients/VirtualClientsContext";
import { PiedinoState } from "src/components/carrello-common/Piedino";

export function useVirtualCartUserInterfaceFlow({
  openBlockingAlertState,
  closeBlockingAlertState,
  pushToast,
  onLastSoldTicket,
  onPiedinoChange,
  piedino,
}: {
  openBlockingAlertState: (newBlockingAlert: React.ReactNode) => void;
  closeBlockingAlertState: () => void;
  pushToast: (content: React.ReactNode, duration: number) => void;
  onLastSoldTicket: (lastSoldTicket: string | null) => void;
  onPiedinoChange(piedino: PiedinoState): void;
  piedino: PiedinoState;
}) {
  const virtualCartClientsContext = useVirtualUpdateClientsContext();
  const activeClientId = virtualCartClientsContext !== null ? virtualCartClientsContext.activeClientIndex : 0;
  const onErrorInsertEventToVirtualCart = useCallback(() => {
    return openBlockingAlertState(
      <Alert
        type="danger"
        heading={
          <FormattedMessage defaultMessage="Attenzione!" description="alert heading attention add to virtual cart" />
        }
        description={
          <FormattedMessage
            defaultMessage="La scommessa non è compatibile con quanto già inserito nel biglietto"
            description="alert description attention add to virtual cart"
          />
        }
        onClose={closeBlockingAlertState}
      />,
    );
  }, [closeBlockingAlertState, openBlockingAlertState]);
  const openAlertWatingVirtualSelling = useCallback(() => {
    return openBlockingAlertState(
      <Alert
        type={"warning"}
        heading={
          <FormattedMessage
            defaultMessage="Vendita del biglietto in corso"
            description="waiting sell header title of sell alert"
          />
        }
        description={
          <FormattedMessage
            defaultMessage="Attendi l'esito per poter effettuare nuove operazioni"
            description="waiting sell description title of sell alert"
          />
        }
        hasHourGlassIcon={true}
      />,
    );
  }, [openBlockingAlertState]);

  const onSellingVirtualCartFlow: StartSellingVirtualTransactionCallbacks = useMemo(() => {
    return {
      onStart(params: { isSplitPlay: boolean }) {
        openBlockingAlertState(
          <Alert
            type="danger"
            heading={
              <FormattedMessage
                defaultMessage="Vendita del biglietto non riuscita"
                description="alert heading selling failed"
              />
            }
            description={
              <FormattedMessage defaultMessage="Giocata Frazionata" description="alert failed giocata frazionata" />
            }
            onClose={closeBlockingAlertState}
          />,
        );
      },
      onStartError(params: { description: string }) {
        openBlockingAlertState(
          <Alert
            type="danger"
            heading={
              <FormattedMessage
                defaultMessage="Vendita del biglietto non riuscita"
                description="alert heading selling failed"
              />
            }
            description={
              <FormattedMessage
                defaultMessage="{placeholder}"
                description="alert failed {placeholder}"
                values={{ placeholder: params.description }}
              />
            }
            onClose={closeBlockingAlertState}
          />,
        );
      },
      onGenericError(params: { description: string }) {
        openBlockingAlertState(
          <Alert
            type={"danger"}
            heading={
              <FormattedMessage
                defaultMessage="Vendita del biglietto non riuscita"
                description="default header title of sell alert"
              />
            }
            description={
              <FormattedMessage
                defaultMessage="{placeholder}"
                description="alert failed {placeholder}"
                values={{ placeholder: params.description }}
              />
            }
            onClose={closeBlockingAlertState}
          />,
        );
      },
      onSuccess(amount: number, result: SuccessResponse) {
        mutate("balanceAmountService");
        onLastSoldTicket(result.ticketId);
        const activePiedino = piedino[activeClientId];
        onPiedinoChange({
          ...piedino,
          [activeClientId]: {
            totale: activePiedino.totale + amount,
            riscosso: activePiedino.riscosso,
            emesso: activePiedino.emesso + 1,
          },
        });
        pushToast(
          <Toast
            type="success"
            heading={
              <FormattedMessage
                defaultMessage="La scommessa è andata a buon fine"
                description="success sell header of sell toast"
              />
            }
            description={
              <FormattedMessage
                defaultMessage="Importo da riscuotere pari a {amount}"
                description="success sell description of sell toast"
                values={{ amount: formatCurrency(amount) }}
              />
            }
          />,
          5000,
        );
        closeBlockingAlertState();
      },
      onSpecificError(params: { errorCodeObj?: SellErrorPropertyType; properties: Array<SellErrorPropertyType> }) {
        const errorCode = params.errorCodeObj && params.errorCodeObj.value ? params.errorCodeObj.value : "";
        const secondMsg = params.properties[1] !== undefined ? params.properties[1].value : "";
        openBlockingAlertState(
          <Alert
            type={"danger"}
            heading={
              <FormattedMessage
                defaultMessage="Vendita del biglietto non riuscita"
                description="default header title of sell alert"
              />
            }
            description={
              <FormattedMessage
                defaultMessage="{placeholder}"
                description="alert failed {placeholder}"
                values={{ placeholder: "(" + params.properties[0].value + ") " + errorCode + ": " + secondMsg }}
              />
            }
            onClose={closeBlockingAlertState}
          />,
        );
      },
    };
  }, [closeBlockingAlertState, onLastSoldTicket, openBlockingAlertState, pushToast]);

  return { onErrorInsertEventToVirtualCart, onSellingVirtualCartFlow, openAlertWatingVirtualSelling };
}
