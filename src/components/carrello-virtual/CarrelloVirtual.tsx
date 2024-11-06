import { StyledCarrelloBody } from "src/components/carrello/carrello-utility/cart-style/Carrello.style";
import { AvvenimentiVirtualList } from "src/components/carrello-virtual/avvenimenti/AvvenimentiVirtualList";
import { css } from "styled-components";
import { MultiplaVirtualFooter } from "src/components/carrello-virtual/footer/MultiplaVirtualFooter";
import { useVirtualUpdateClientsContext } from "src/components/common/context-clients/VirtualClientsContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SistemaVirtualFooter } from "src/components/carrello-virtual/footer/SistemaVirtualFooter";
import { SviluppoSistemaVirtual } from "src/components/carrello-virtual/sviluppo-sistema/SviluppoSistemaVirtual";
import { CarrelloVirtualHeader } from "src/components/carrello-virtual/CarrelloVirtualHeader";
import { CardinalityAndSellingAmount, GiocataSistemisticaSviluppataVirtualResponse } from "src/types/sistemi.types";
import { VirtualEventType } from "src/types/carrello.types";
import { DisanonimaDialog } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { SogliaAlertVirtual } from "src/components/common/sogliaAlertVirtual/sogliaAlertVirtual";

export function CarrelloVirtual() {
  const virtualCartClientsContext = useVirtualUpdateClientsContext();
  const currentVirtualClient = virtualCartClientsContext.activeVirtualClient;
  const isSistemaVirtualActive = currentVirtualClient.isSviluppoSistemaActive;
  const selectedEvents = currentVirtualClient.selectedEvents;
  const [isSviluppoSistemaOpen, setIsSviluppoSistemaOpen] = useState<boolean>(false);

  const { openBlockingAlertState } = useNavigazioneActions();
  const [isSogliaSuperata, setSogliaSuperata] = useState<boolean>(false);

  const openEvents: Array<VirtualEventType> = useMemo(() => {
    return selectedEvents.filter((evento) => {
      return evento.stato !== undefined && evento.stato === 1;
    });
  }, [selectedEvents]);

  useEffect(() => {
    if (isSviluppoSistemaOpen && (selectedEvents.length === 0 || !isSistemaVirtualActive)) {
      setIsSviluppoSistemaOpen(false);
    }
  }, [isSistemaVirtualActive, isSviluppoSistemaOpen, selectedEvents.length]);

  const updateStatusEvents = useCallback(() => {
    const currentDate = new Date();
    const updatedEvents = selectedEvents.map((evento) => {
      const eventDate = new Date(new Date(evento.dataAvvenimento).toISOString());
      const isExpired = eventDate.valueOf() - currentDate.valueOf() <= 0;
      if (isExpired) {
        return {
          ...evento,
          stato: 0,
        };
      } else {
        return evento;
      }
    });
    if (JSON.stringify(selectedEvents) !== JSON.stringify(updatedEvents)) {
      return virtualCartClientsContext.updateVirtualClientEvents(updatedEvents);
    } else {
      return;
    }
  }, [selectedEvents, virtualCartClientsContext]);
  useEffect(() => {
    if (selectedEvents.length !== 0) {
      const interval = setInterval(() => {
        updateStatusEvents();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedEvents.length, updateStatusEvents]);

  return (
    <>
      <CarrelloVirtualHeader onCloseSviluppo={setIsSviluppoSistemaOpen} />
      {isSviluppoSistemaOpen && (
        <SviluppoSistemaVirtual isOpen={isSviluppoSistemaOpen} onClose={setIsSviluppoSistemaOpen} />
      )}
      <StyledCarrelloBody>
        <div
          css={css`
            flex-grow: 1;
            position: relative;
          `}
        >
          <div
            css={css`
              position: absolute;
              width: 100%;
              height: 100%;
            `}
          >
            <AvvenimentiVirtualList onCloseSviluppoSistema={setIsSviluppoSistemaOpen} />
          </div>
        </div>
        {isSogliaSuperata && (
          <SogliaAlertVirtual
            closeDialog={() => {
              setSogliaSuperata(false);
            }}
            onDismiss={() => setSogliaSuperata(false)}
            onContinue={() => {
              setSogliaSuperata(false);
              openBlockingAlertState(
                <DisanonimaDialog
                  totalAmount={
                    isSistemaVirtualActive
                      ? 0 //DEBT aggiungere la puntata del sistema quando sarà disponibile
                      : currentVirtualClient.puntata
                  }
                />,
              );
            }}
          />
        )}
        {selectedEvents.length > 0 && !isSistemaVirtualActive && (
          <MultiplaVirtualFooter openEvents={openEvents} setSogliaSuperata={setSogliaSuperata} />
        )}
        {selectedEvents.length > 0 && isSistemaVirtualActive && (
          <SistemaVirtualFooter
            isSviluppoSistemaOpen={isSviluppoSistemaOpen}
            toggleSviluppoSistema={setIsSviluppoSistemaOpen}
            openEvents={openEvents}
          />
        )}
      </StyledCarrelloBody>
    </>
  );
}

export function useLastDefinedValue(
  giocataSistemisticaData:
    | {
        result?: GiocataSistemisticaSviluppataVirtualResponse;
        error?: unknown;
      }
    | undefined,
  puntataSistema: CardinalityAndSellingAmount[],
) {
  const [lastDefinedValue, setLastDefinedValue] = useState<GiocataSistemisticaSviluppataVirtualResponse>({
    vincitaMinimaTotale: 0,
    vincitaTotale: 0,
    sviluppoByCardinalita: puntataSistema.map((legatura) => {
      return {
        integrale: false,
        cardinalita: legatura.cardinalita,
        importo: legatura.importo * 100,
        importoTotale: 0,
        vincitaMinima: 0,
        vincitaTotaleSistemaIntegrale: 0,
        vincitaTotale: 0,
        vincita: 0,
        esito: 0,
        numeroSviluppi: 0,
        bonusApplicato: false,
        vincitaMassimaCombinazione: 0,
        vincitaMassima: 0,
        importoMassimoCombinazione: 0,
        quotaMassima: 0,
      };
    }),
  });
  useEffect(() => {
    if (giocataSistemisticaData !== undefined && giocataSistemisticaData.result !== undefined) {
      setLastDefinedValue(giocataSistemisticaData.result);
    }
  }, [giocataSistemisticaData]);
  return { lastDefinedValue };
}
