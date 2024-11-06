import { useEffect, useState } from "react";
import { getBlankClientIndex, updateSviluppoSistemaType } from "src/components/carrello/helpers";
import { useCartClientsContext, useUpdateClientsContext } from "src/components/common/context-clients/ClientsContext";
import { getPronostici } from "src/components/dialog-biglietto/ticket-api";
import { ChiavePronostico, makeChiavePronostico } from "src/types/chiavi";
import { PronosticiParamsType } from "src/types/pronosticiParams.types";
import { TicketType } from "src/types/ticket.types";
import useSWR from "swr";

export const useDialogActions = ({
  dettaglioBiglietto,
  onAddMultyEsitoToCart,
  onOpenDangerToastRebet,
  setMinimize,
  onClose,
}: {
  dettaglioBiglietto: TicketType;
  setMinimize(isMinimized: boolean): void;
  onClose(): void;
  onAddMultyEsitoToCart(pronostici: Array<PronosticiParamsType>): void;
  onOpenDangerToastRebet(): void;
}) => {
  const clients = useCartClientsContext();
  const { events } = dettaglioBiglietto;
  const [predictionKeys, setPredictionKeys] = useState<Array<ChiavePronostico> | undefined>();
  const { data: predictionsData } = useSWR(
    (() => {
      return predictionKeys ? [predictionKeys] : null;
    })(),
    getPronostici,
  );

  const { setCartClients, setActiveClientIndex: setActiveClientId } = useUpdateClientsContext();
  const [isViewWarningRebet, setIsViewWarningRebet] = useState<boolean>(false);

  const rebetAction = () => {
    const blankClientIndex = getBlankClientIndex(clients);
    if (blankClientIndex !== undefined) {
      const predictionKeysNew = events
        .filter((event) => !event.isReported)
        .map(({ eventId, marketId, outcomeId, scheduleId, addedInfo, bettingCode }) => {
          return {
            codiceAvvenimento: eventId,
            codiceClasseEsito: marketId,
            codicePalinsesto: scheduleId,
            idInfoAggiuntiva: addedInfo,
            codiceScommessa: bettingCode ?? 0,
            codiceEsito: outcomeId,
            quota: 0,
          };
        });
      setPredictionKeys(predictionKeysNew);

      if (dettaglioBiglietto.cardinalitiesDeployment.length > 0) {
        // ADD new sviluppo sistema

        //@dettaglioBiglietto.events contains all prediction
        const eventsArrayWithSameId = dettaglioBiglietto.events.map((t) => {
          return `${t.eventId}_${t.scheduleId}`;
        });
        //check if there are more predictions for the same event
        const realCardinality = eventsArrayWithSameId.filter((key, pos) => {
          return eventsArrayWithSameId.indexOf(key) === pos;
        });

        const newSviluppoSistema = realCardinality.map((c, index) => ({
          indice: realCardinality.length - index,
          bet: 0,
          combinazioni: 1,
          isAvailable: true,
          winAmounts: { max: 0, min: 0 },
        }));

        const updatedSviluppoSistema = updateSviluppoSistemaType(
          dettaglioBiglietto.cardinalitiesDeployment,
          newSviluppoSistema,
        );

        if (updatedSviluppoSistema) {
          clients[blankClientIndex] = { ...clients[blankClientIndex], sviluppoSistema: updatedSviluppoSistema };
        }
      }
      setCartClients(clients);
      setActiveClientId(blankClientIndex);
    } else {
      setIsViewWarningRebet(true);
    }
  };

  useEffect(() => {
    // ADD multy esito to cart
    if (predictionsData === undefined) {
      return;
    }
    const isError = predictionsData.some((p) => !p.value);
    if (isError) {
      onOpenDangerToastRebet();
      onClose();
      return;
    }
    const predictions = predictionsData.map((p) => {
      const {
        codicePalinsesto,
        codiceAvvenimento,
        codiceScommessa,
        idInfoAggiuntiva,
        codiceClasseEsito,
        codiceEsito,
      } = p.value;
      const currentEvent = events.find(
        (cEvent) =>
          makeChiavePronostico({
            codicePalinsesto,
            codiceAvvenimento,
            codiceScommessa,
            idInfoAggiuntiva,
            codiceClasseEsito,
            codiceEsito,
          }) ===
          `${cEvent.scheduleId}-${cEvent.eventId}-${cEvent.bettingCode}-${cEvent.addedInfo}-${cEvent.marketId}-${cEvent.outcomeId}`,
      );
      return { ...p.value, isFissa: currentEvent?.isFixed };
    });
    onAddMultyEsitoToCart(predictions);
    onClose();
  }, [onAddMultyEsitoToCart, onClose, predictionsData, events, onOpenDangerToastRebet]);

  const minimizedProceed = () => {
    setIsViewWarningRebet(false);
    setMinimize(true);
  };

  return {
    rebetAction,
    isViewWarningRebet,
    minimizedProceed,
  };
};
