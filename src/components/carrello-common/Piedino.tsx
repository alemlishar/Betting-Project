import { useCallback, useContext, useEffect } from "react";
import {
  StyledBiglietto,
  StyledBigliettoContainer,
  StyledBigliettoContainerRiscossi,
  StyledBigliettoRiscossi,
  StyledBigliettoSum,
  StyledBigliettoSumRiscossi,
  StyledCarrelloButton,
  StyledCarrelloEuroQuote,
  StyledCarrelloFooter,
  StyledCarrelloTotal,
  StyledCarrelloTotalContainer,
} from "src/components/carrello/carrello-utility/cart-style/Carrello.style";
import { useVirtualUpdateClientsContext } from "src/components/common/context-clients/VirtualClientsContext";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { parseAsMoney } from "src/helpers/format-data";

import { ImpostazioniScommessaType } from "src/types/carrello.types";

export type PiedinoState = Array<{
  totale: number;
  emesso: number;
  riscosso: number;
}>;

export function Piedino({
  piedino,
  onPiedinoChange,
  updateImpostazioni,
}: {
  piedino: PiedinoState;
  onPiedinoChange(piedino: PiedinoState): void;
  updateImpostazioni: (impostazioniScommessa: ImpostazioniScommessaType[]) => void;
}) {
  const { impostazioni } = useContext(GlobalStateContext);
  const { activeClientIndex: activeVirtualClientId } = useVirtualUpdateClientsContext();

  const activeClientId = activeVirtualClientId;
  const activePiedino = piedino[activeClientId];

  const isFooterActive =
    (activePiedino?.totale !== undefined && activePiedino.totale !== 0) ||
    (activePiedino?.emesso !== undefined && activePiedino.emesso !== 0) ||
    (activePiedino?.riscosso !== undefined && activePiedino.riscosso !== 0);

  /**
   * AZZERA CLIENTE
   */

  const onHandleDelete = useCallback(() => {
    onPiedinoChange({ ...piedino, [activeClientId]: { emesso: 0, riscosso: 0, totale: 0 } });
    if (impostazioni) {
      updateImpostazioni(impostazioni);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClientId]);

  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (event.ctrlKey && event.key === "Delete") {
        onHandleDelete();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onHandleDelete, keyboardNavigationContext]);
  return (
    <StyledCarrelloFooter>
      <StyledCarrelloButton
        data-qa="carrello-azzera-cliente"
        isActive={isFooterActive}
        onClick={() => {
          if (isFooterActive) {
            onHandleDelete();
          }
        }}
      >
        AZZERA
      </StyledCarrelloButton>
      {isFooterActive && (
        <StyledBigliettoContainerRiscossi>
          <StyledBigliettoRiscossi>B.Riscossi</StyledBigliettoRiscossi>
          <StyledBigliettoSumRiscossi
            className={activePiedino.riscosso || activePiedino.riscosso !== 0 ? "active" : "not-active"}
          >
            {activePiedino.riscosso || `0`}
          </StyledBigliettoSumRiscossi>
        </StyledBigliettoContainerRiscossi>
      )}
      {isFooterActive && (
        <StyledBigliettoContainer>
          <StyledBiglietto>B.Emessi</StyledBiglietto>
          <StyledBigliettoSum className={activePiedino.emesso || activePiedino.emesso !== 0 ? "active" : "not-active"}>
            {activePiedino.emesso || `0`}
          </StyledBigliettoSum>
        </StyledBigliettoContainer>
      )}

      <StyledCarrelloTotalContainer>
        <StyledCarrelloTotal>Totale cliente {activeClientId + 1}</StyledCarrelloTotal>
        <StyledCarrelloEuroQuote
          data-qa="carrello-totale-cliente"
          disabled={activePiedino.totale === undefined || activePiedino.totale === 0}
        >
          {parseAsMoney(activePiedino.totale) || `0,00`}
        </StyledCarrelloEuroQuote>
      </StyledCarrelloTotalContainer>
    </StyledCarrelloFooter>
  );
}
