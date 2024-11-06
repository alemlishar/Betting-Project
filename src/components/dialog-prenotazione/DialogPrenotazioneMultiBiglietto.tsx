import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  deletePrenotazioneByNickname,
  deleteTicketFromPrenotazineByNickname,
  Prenotazione,
  Ticket,
} from "src/components/prenotazioni/prenotazioni-api";
import styled, { css } from "styled-components/macro";
import { StyledBadgeSystem } from "src/components/prenotazioni/Prenotazione";
import {
  StyledDialog,
  StyledMinimizationIconContainer,
  StyledMinimizationIcon,
} from "src/components/dialog-prenotazione/DialogPrenotazioneSingoloBiglietto";
import { StyledDialogContainer } from "src/components/common/full-screen-alert/StyledDialogContainer";
import icoArrowUpWhite from "src/assets/images/icon-arrow-up-white-big.svg";
import {
  useScrollingSliderControls,
  SliderControllerButton,
} from "src/components/common/slider-controller/SliderController";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { HeaderButtonDialogProps } from "src/components/dialog-prenotazione/dialog-prenotazione-header/DialogHeader";
import { DialogPrenotazioneFooter } from "src/components/dialog-prenotazione/dialog-prenotazione-footer/DialogPrenotazioneFooter";
import { DialogPrenotazioneBody } from "src/components/dialog-prenotazione/DialogPrenotazioneBody";
import { NickName } from "src/types/chiavi";
import { ReactComponent as IcoMinus } from "src/assets/images/icon-preno-minus-black.svg";
import { ReactComponent as IcoClose } from "src/assets/images/icon-preno-close-black.svg";
import { ReactComponent as IconDoneWhite } from "src/assets/images/icon-done-white.svg";
import { ReactComponent as IconDangerWhite } from "src/assets/images/icon-danger-white.svg";
import { useSviluppoSistema } from "src/components/dialog-prenotazione/useSviluppoSistema";

import {
  DialogPrenotazioneState,
  getBonusForTicket,
  modificaBiglietto,
} from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { DialogMultibigliettoSubHeader } from "src/components/dialog-prenotazione/dialog-prenotazione-header/DialogMultibigliettoSubHeader";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { useCartClientsContext, useUpdateClientsContext } from "src/components/common/context-clients/ClientsContext";
import { FormattedMessage } from "react-intl";
import configuration from "src/helpers/configuration";
import { ReactComponent as IconErrorWhite } from "src/assets/images/icon_error_white.svg";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";
import { getTicketType } from "src/components/prenotazioni/MenuPrenotazioni";
import { mutate } from "swr";
import { DialogPrenotazioneVenditaMultiBiglietto } from "src/components/dialog-prenotazione/DialogPrenotazioneVenditaMultibiglietto";
import { AmountsChangedResponse, VenditaSuccessResponse } from "src/types/vendita.types";
import { decimalToIntegerValue, formatCurrency } from "src/helpers/formatCurrencyAmountUtils";
import { BonusConfigClassType } from "src/types/bonusConfig.type";

export type TicketIndex = number;
type DialogPrenotazioneMultiBigliettoProps = {
  schedaPrenotazione: Prenotazione;
  HeaderButtonDialog: React.ComponentType<HeaderButtonDialogProps>;
  onTicketDelete(nickname: NickName, ticketIndex: number): void;
  pushToast(content: React.ReactNode, duration: number): void;
  dialogPrenotazioneState: DialogPrenotazioneState;
  onVendiTicket(
    nickname: NickName,
    ticketViewed: number[],
    ticketToSellList: Ticket[],
    ticketToSellListIndex: number,
    selledTicketsList: Record<TicketIndex, VenditaSuccessResponse["response"]>,
    notSelledTicketsList: Record<TicketIndex, string>,
    totalSellTicket: number,
    allTicketSent: boolean,
    bonusConfig?: BonusConfigClassType[],
    amountChangedTicketResponse?: AmountsChangedResponse,
  ): void;
};

export function DialogPrenotazioneMultiBiglietto({
  schedaPrenotazione,
  HeaderButtonDialog,
  onTicketDelete,
  dialogPrenotazioneState,
  onVendiTicket,
}: DialogPrenotazioneMultiBigliettoProps) {
  const {
    closeDialogPrenotazione,
    minimizeDialogPrenotazione,
    endSellingOnDialogPrenotazione,
    openSellDialogPrenotazione,
    openSellDialogPrenotazioneMultiBigliettoFromModulo,
    endSellingOnDialogPrenotazioneWithAmountChangedRejected,
    openTicketDialogPrenotazioneMultiBiglietto,
  } = useNavigazioneActions();
  // DEBT
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  const { bonusConfig } = useContext(GlobalStateContext);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (event.key === "Escape") {
        closeDialogPrenotazione(schedaPrenotazione.mainNickname);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeDialogPrenotazione]);

  const selledTickets = dialogPrenotazioneState.selledTickets;
  const notSelledTickets = dialogPrenotazioneState.notSelledTickets;
  const amountChangedTicketResponse = dialogPrenotazioneState.amountChangedTicketResponse;
  const sellTicketState = dialogPrenotazioneState.sellTicketState;
  const validTicketsToView = useMemo(
    () =>
      schedaPrenotazione.tickets.filter(
        (ticket) => ticket.status !== "Sent" || (ticket.status === "Sent" && selledTickets[ticket.index]),
      ),

    [schedaPrenotazione, selledTickets],
  );

  const validTickets = useMemo(
    () =>
      validTicketsToView.filter(
        (ticket) => notSelledTickets[ticket.index] !== configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_REJECETED,
      ),
    [notSelledTickets, validTicketsToView],
  );

  const clients = useCartClientsContext();
  const updateClients = useUpdateClientsContext();

  const selectedTicketIndex = useMemo(() => {
    const index = validTicketsToView.findIndex(({ index }) => index >= dialogPrenotazioneState.actualTicketIndex);
    return index > -1 ? index : validTicketsToView.length - 1;
  }, [validTicketsToView, dialogPrenotazioneState.actualTicketIndex]);

  const selectedTicket = validTicketsToView[selectedTicketIndex];
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { left, right, scrollBy } = useScrollingSliderControls(scrollContainerRef);
  const [isDeleting, setIsDeleting] = useState(false);
  const { sviluppoSistema } = useSviluppoSistema(selectedTicket);

  const isSelled =
    selledTickets[selectedTicket.index] && selledTickets[selectedTicket.index].status === configuration.SELL_STATUS.OK;
  const isFailed = notSelledTickets[selectedTicket.index];
  const isRejected =
    notSelledTickets[selectedTicket.index] === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_REJECETED;
  const isVisibile = !isRejected;

  const [ticketViewed, setTicketViewed] = useState<Array<TicketIndex>>([selectedTicket.index]);

  const ticketsNumber = validTickets.length - Object.keys(selledTickets).length;
  const totalSelledTicketPrice = dialogPrenotazioneState.totalSellTicket;

  /**
   * Flusso Eliminazione
   */

  const deleteTicket = useCallback(
    async (nickname: NickName, ticketIndex: number) => {
      if (validTickets.length - Object.keys(selledTickets).length === 1) {
        await deletePrenotazioneByNickname(nickname);
        closeDialogPrenotazione(schedaPrenotazione.mainNickname);
      } else {
        onTicketDelete(nickname, ticketIndex);
      }
    },
    [validTickets.length, selledTickets, closeDialogPrenotazione, schedaPrenotazione.mainNickname, onTicketDelete],
  );

  const deleteEsitoFromTicket = (codiceEsitoToDelete: string) => {
    const outcomeList = selectedTicket.results.filter((outcome) => {
      return (
        `${outcome.codicePalinsesto}-${outcome.codiceAvvenimento}-${outcome.codiceScommessa}-${outcome.codiceInfoAggiuntiva}-${outcome.codiceEsito}` !==
        codiceEsitoToDelete
      );
    });

    mutate(
      [schedaPrenotazione.mainNickname],
      {
        ...schedaPrenotazione,
        tickets: schedaPrenotazione.tickets.map((ticket) => {
          if (ticket.index === selectedTicket.index) {
            return { ...ticket, results: outcomeList };
          }
          return ticket;
        }),
      },
      false,
    );
  };

  const deleteClosedOrSuspendedOutcomes = () => {
    const notClosedOrSuspendedOutcomeList = selectedTicket.results.filter((outcome) => {
      return !(outcome.stato === 0 && outcome.quota) && outcome.stato !== 2;
    });
    mutate(
      [schedaPrenotazione.mainNickname],
      {
        ...schedaPrenotazione,
        tickets: schedaPrenotazione.tickets.map((ticket, ticketIndex) => {
          if (ticketIndex === selectedTicketIndex) {
            return { ...ticket, results: notClosedOrSuspendedOutcomeList };
          }
          return ticket;
        }),
      },
      false,
    );
  };

  /**
   * Flusso modifica
   */
  const modificaBigliettoOfMultiBiglietto = useCallback(
    (ticket: Ticket) => {
      return modificaBiglietto(clients, sviluppoSistema, updateClients, ticket);
    },
    [clients, updateClients, sviluppoSistema],
  );

  /**
   * Flusso Vendita
   */

  const isSellingWithProgressBar = !!(
    dialogPrenotazioneState.sellTicketState && dialogPrenotazioneState.sellTicketState.isSellingWithProgressBar
  );

  const vendiBiglietto = useCallback(
    async (isVendiTutte: boolean, ticketToSell?: Ticket, temporaryNotSelledTickets?: Record<number, string>) => {
      //we discard the selledTickets or temporaryNotSelledTickets of the rejected amount changed if they exist
      const indexListToBeDiscarded = temporaryNotSelledTickets
        ? [...Object.keys(selledTickets), ...Object.keys(temporaryNotSelledTickets)]
        : Object.keys(selledTickets);

      const filteredValidTicketList = validTickets.filter((ticket) => {
        return !indexListToBeDiscarded.includes(ticket.index.toString());
      });

      const ticketToSellList = (() => {
        if (isVendiTutte) {
          if (ticketToSell) {
            //case: amount changed accepted
            return filteredValidTicketList.map((ticket) =>
              ticket.index === ticketToSell.index ? ticketToSell : ticket,
            );
          }
          return filteredValidTicketList;
        }
        return [ticketToSell ?? selectedTicket];
      })();

      if (isVendiTutte) {
        openSellDialogPrenotazioneMultiBigliettoFromModulo(
          selectedTicket.index,
          ticketViewed,
          ticketToSell ? dialogPrenotazioneState.sellTicketState?.progressBarActualCounter : 1,
          ticketToSell ? dialogPrenotazioneState.sellTicketState?.progressBarTotalCounter : ticketToSellList.length,
          temporaryNotSelledTickets,
        );
      } else {
        openSellDialogPrenotazione(selectedTicket.index);
      }

      const ticketToSellListIndex = 0;
      const allTicketSent = filteredValidTicketList.length === 1;

      onVendiTicket(
        schedaPrenotazione.mainNickname,
        ticketViewed,
        ticketToSellList,
        ticketToSellListIndex,
        selledTickets,
        temporaryNotSelledTickets ? temporaryNotSelledTickets : notSelledTickets,
        totalSelledTicketPrice,
        allTicketSent,
        bonusConfig,
        ticketToSell && amountChangedTicketResponse,
      );
    },
    [
      schedaPrenotazione,
      selledTickets,
      notSelledTickets,
      totalSelledTicketPrice,
      amountChangedTicketResponse,
      selectedTicket,
      ticketViewed,
      validTickets,
      dialogPrenotazioneState.sellTicketState?.progressBarActualCounter,
      onVendiTicket,
      openSellDialogPrenotazione,
      openSellDialogPrenotazioneMultiBigliettoFromModulo,
    ],
  );

  const vendiTutte = useCallback(async () => {
    const isVendiTutte = true;
    vendiBiglietto(isVendiTutte);
  }, [vendiBiglietto]);

  const acceptedTicketFromAcceptance = useCallback(() => {
    if (amountChangedTicketResponse) {
      //for close changed amount alert

      const newAmount = amountChangedTicketResponse.attrExtConsole.amount.amount;
      const ticketType = getTicketType(selectedTicket);

      if (validTickets.length - Object.keys(selledTickets).length >= 1) {
        const newTicket =
          ticketType === "Sistema"
            ? (() => {
                const newSystemClasses = selectedTicket.systemClasses.map((sviluppo) => {
                  const newSviluppo = amountChangedTicketResponse.attrExtConsole.amount.numSviluppi.find(
                    (numSviluppo) => numSviluppo.tipo === sviluppo.key,
                  );
                  return newSviluppo
                    ? { ...sviluppo, value: { ...sviluppo.value, bettingPrice: newSviluppo.amount } }
                    : sviluppo;
                });
                return { ...selectedTicket, sellingPrice: newAmount, systemClasses: newSystemClasses };
              })()
            : (() => {
                const { potentialWin: newPotentialWin } = getBonusForTicket(
                  { ...selectedTicket, sellingPrice: newAmount },
                  bonusConfig,
                );

                return { ...selectedTicket, sellingPrice: newAmount, paymentPrice: newPotentialWin.value };
              })();

        mutate(
          [schedaPrenotazione.mainNickname],
          {
            ...schedaPrenotazione,
            tickets: schedaPrenotazione.tickets.map((ticket) =>
              ticket.index === selectedTicket.index ? newTicket : ticket,
            ),
          },
          false,
        );

        vendiBiglietto(isSellingWithProgressBar, newTicket);
      } else {
        endSellingOnDialogPrenotazione();
      }
    }
  }, [
    amountChangedTicketResponse,
    isSellingWithProgressBar,
    validTickets,
    selledTickets,
    selectedTicket,
    endSellingOnDialogPrenotazione,
    bonusConfig,
    notSelledTickets,
    schedaPrenotazione,
    vendiBiglietto,
  ]);

  const vendiSingoloBiglietto = useCallback(() => {
    const isVendiTutte = false;
    vendiBiglietto(isVendiTutte);
  }, [vendiBiglietto]);

  const rejectedTicketFromAcceptance = useCallback(async () => {
    //Passiamo il ticket allo stato sent
    const ticketIndexToDelete = selectedTicket.index;
    if (validTickets.length - Object.keys(selledTickets).length === 1) {
      await deletePrenotazioneByNickname(schedaPrenotazione.mainNickname);
    } else {
      await deleteTicketFromPrenotazineByNickname(schedaPrenotazione.mainNickname, ticketIndexToDelete);
    }

    const temporaryNotSelledTickets = {
      ...notSelledTickets,
      [ticketIndexToDelete]: configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_REJECETED,
    };

    const temporarySelledTicket = validTickets.filter(({ index }) => {
      return index !== ticketIndexToDelete;
    });

    const totalTicketsToSell = temporarySelledTicket.length - Object.keys(selledTickets).length;

    if (isSellingWithProgressBar && totalTicketsToSell >= 1) {
      vendiBiglietto(isSellingWithProgressBar, undefined, temporaryNotSelledTickets);
    } else {
      endSellingOnDialogPrenotazioneWithAmountChangedRejected(temporaryNotSelledTickets);
    }
  }, [
    validTickets,
    selledTickets,
    selectedTicket,

    schedaPrenotazione,
    notSelledTickets,
    endSellingOnDialogPrenotazioneWithAmountChangedRejected,
    isSellingWithProgressBar,
    vendiBiglietto,
  ]);

  if (!schedaPrenotazione) {
    return null;
  }

  if (sellTicketState) {
    return (
      <DialogPrenotazioneVenditaMultiBiglietto
        dialogPrenotazioneState={dialogPrenotazioneState}
        selectedTicket={selectedTicket}
        acceptedTicketFromAcceptance={acceptedTicketFromAcceptance}
        rejectedTicketFromAcceptance={rejectedTicketFromAcceptance}
      />
    );
  }

  return (
    <StyledDialogContainer
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closeDialogPrenotazione(schedaPrenotazione.mainNickname);
        }
      }}
    >
      <StyledDialog open>
        <StyledDialogHeader>
          <StyledMinimizationIconContainer>
            <StyledMinimizationIcon onClick={() => minimizeDialogPrenotazione()}>
              <IcoMinus />
            </StyledMinimizationIcon>
            <StyledMinimizationIcon onClick={() => closeDialogPrenotazione(schedaPrenotazione.mainNickname)}>
              <IcoClose />
            </StyledMinimizationIcon>
          </StyledMinimizationIconContainer>
          <HeaderButtonDialog
            onVendiTutte={() => vendiTutte()}
            ticketsNumber={ticketsNumber}
            schedaPrenotazione={schedaPrenotazione}
            importoBigliettiVenduti={totalSelledTicketPrice}
            validTickets={validTickets}
          />
        </StyledDialogHeader>
        <div
          css={css`
            display: flex;
          `}
        >
          <div
            css={css`
              overflow: hidden;
              flex-grow: 1;
            `}
          >
            <div
              ref={scrollContainerRef}
              css={css`
                height: 70px;
                background-color: #222222;
                display: grid;
                align-items: center;
                grid-template-columns: repeat(${schedaPrenotazione.tickets.length}, [ticket] min-content);
                grid-column-gap: 10px;
                padding: 0 30px;
                overflow-x: scroll;
                &::-webkit-scrollbar {
                  width: 0;
                  display: none;
                }
              `}
            >
              {validTicketsToView.map((ticket: Ticket, ticketIndex: number) => {
                const isSelected = selectedTicket?.index === ticket.index;
                const isTicketSelled = selledTickets[ticket.index] ?? false;
                const isNotSelled = notSelledTickets[ticket.index] ?? false;
                const isErrorIcon =
                  notSelledTickets[ticket.index] === configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_TIMEOUT ||
                  isRejected;
                return (
                  <span
                    key={ticket.index}
                    onClick={() => {
                      openTicketDialogPrenotazioneMultiBiglietto(ticket.index);
                      setTicketViewed([...ticketViewed, ticket.index]);
                      setIsDeleting(false);
                    }}
                    css={css`
                      grid-column: ticket ${ticketIndex + 1};
                      display: flex;
                      align-items: center;
                      justify-content: space-evenly;
                      height: 60px;
                      width: 110px;
                      border-radius: 8px;
                      background-color: #ffffff;
                      opacity: ${isSelected ? "1" : "0.5"};
                      border: ${isSelected ? "3px solid #AAC21F;" : "none"};
                      color: #333333;
                      font-family: Mulish;
                      font-size: 20px;
                      font-weight: 800;
                      letter-spacing: 0;
                      text-align: center;
                      box-sizing: border-box;
                      position: relative;
                    `}
                  >
                    {isNotSelled && (
                      <span
                        css={css`
                          height: 22px;
                          width: 22px;
                          border-radius: 0 0 5px 5px;
                          background-color: red;
                          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
                          position: absolute;
                          top: ${isSelected ? "-3px" : "0"};
                          right: ${isSelected ? "6px" : "9px"};
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        `}
                      >
                        {isErrorIcon ? (
                          <IconErrorWhite height={16} width={16} />
                        ) : (
                          <IconDangerWhite height={16} width={16} />
                        )}
                      </span>
                    )}
                    {isTicketSelled && (
                      <span
                        css={css`
                          height: 22px;
                          width: 22px;
                          border-radius: 0 0 5px 5px;
                          background-color: #0b7d3e;
                          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
                          position: absolute;
                          top: ${isSelected ? "-3px" : "0"};
                          right: ${isSelected ? "6px" : "9px"};
                          display: flex;
                          align-items: center;
                          justify-content: center;
                        `}
                      >
                        <IconDoneWhite height={16} width={16} />
                      </span>
                    )}
                    {ticket.index + 1}
                    {ticket.systemClasses !== null && <StyledBadgeSystem>sistema</StyledBadgeSystem>}
                  </span>
                );
              })}
            </div>
          </div>
          <div
            css={css`
              background-color: #005936;
              display: flex;
              flex-direction: column;
              box-shadow: -2px 2px 4px 0 rgba(0, 0, 0, 0.17);
            `}
          >
            <SliderControllerButton
              isEnabled={right}
              onClick={() => scrollBy(1)}
              icon={
                <img
                  css={css`
                    transform: rotate(90deg);
                  `}
                  src={icoArrowUpWhite}
                  alt={""}
                />
              }
            />
            <SliderControllerButton
              isEnabled={left}
              onClick={() => scrollBy(-1)}
              icon={
                <img
                  css={css`
                    transform: rotate(-90deg);
                  `}
                  src={icoArrowUpWhite}
                  alt={""}
                />
              }
            />
          </div>
        </div>
        {isSelled ? (
          <div
            css={css`
              border-radius: 0 0 12px 12px;
              background-color: #ffffff;
              box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.5);
              padding: 30px;
            `}
          >
            <div
              css={css`
                height: 70px;
                width: 1065px;
                border-radius: 8px;
                background-color: #0b7d3e;
                display: grid;
                grid-template-columns: [icon] 27px [message] auto;
                grid-column-gap: 18px;
                align-items: center;
                color: #ffffff;
                font-family: Roboto;
                font-size: 18px;
                box-sizing: border-box;
                padding: 20px 30px;
              `}
            >
              <IconDoneWhite style={{ gridColumn: `icon` }} />
              <div style={{ gridColumn: `message` }}>
                <FormattedMessage
                  description="Vendita andata a buon fine biglietto modulo gestione prenotazione multibiglietto"
                  defaultMessage="Vendita scommessa andata a buon fine. Importo da riscuotere pari a <bold>{importo}</bold>"
                  values={{
                    bold: (chunk: string) => {
                      return (
                        <span
                          css={css`
                            font-weight: 900;
                          `}
                        >
                          {chunk}
                        </span>
                      );
                    },
                    importo: formatCurrency(decimalToIntegerValue(selectedTicket.sellingPrice)),
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {isDeleting ? (
              <div
                css={css`
                  padding: 10px 20px;
                  background-color: #fff;
                `}
              >
                <div
                  css={css`
                    height: 70px;
                    background-color: #fff;
                    display: grid;
                    grid-template-columns: auto 1fr auto auto;
                    column-gap: 10px;
                    align-items: center;
                    background-color: #ffb800;
                    border-radius: 8px;
                    padding: 0 10px;
                    font-family: Mulish;
                    font-size: 1.125rem;
                    font-weight: 500;
                  `}
                >
                  <div
                    css={css`
                      border-radius: 50%;
                      border: 2px solid black;
                      width: 20px;
                      height: 20px;
                      text-align: center;
                      margin: 8px;
                    `}
                  >
                    !
                  </div>
                  <div>
                    <FormattedMessage
                      description="messaggio header biglietto modulo gestione prenotazione multibiglietto"
                      defaultMessage="Sei sicuro di voler eliminare questo"
                    />
                    <span
                      css={css`
                        font-weight: 700;
                      `}
                    >
                      <FormattedMessage
                        description="messaggio header biglietto modulo gestione prenotazione multibiglietto"
                        defaultMessage="biglietto"
                      />
                    </span>{" "}
                    <FormattedMessage
                      description="messaggio header biglietto modulo gestione prenotazione multibiglietto"
                      defaultMessage="dalla prenotazione?"
                    />
                  </div>
                  <StyledYellowButton
                    onClick={() => {
                      setIsDeleting(false);
                    }}
                  >
                    <FormattedMessage
                      description="button annulla header biglietto modulo gestione prenotazione multibiglietto"
                      defaultMessage="Annulla"
                    />
                  </StyledYellowButton>
                  <StyledYellowButton
                    onClick={() => {
                      if (selectedTicket) {
                        deleteTicket(schedaPrenotazione.mainNickname, selectedTicket.index);
                        setIsDeleting(false);
                      }
                    }}
                  >
                    <FormattedMessage
                      description="button procedi header biglietto modulo gestione prenotazione multibiglietto"
                      defaultMessage="Procedi"
                    />
                  </StyledYellowButton>
                </div>
              </div>
            ) : (
              !isRejected && (
                <DialogMultibigliettoSubHeader
                  ticket={selectedTicket}
                  nickname={schedaPrenotazione.mainNickname}
                  deleteClosedOrSuspendedOutcomes={deleteClosedOrSuspendedOutcomes}
                  onTicketDelete={deleteTicket}
                  onTicketModify={modificaBigliettoOfMultiBiglietto}
                  onVendi={vendiSingoloBiglietto}
                />
              )
            )}
            {selectedTicket && (
              <>
                {isFailed && (
                  <div
                    css={css`
                      background-color: #ffffff;
                      box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.5);
                      padding: 15px 30px;
                    `}
                  >
                    <div
                      css={css`
                        height: 70px;
                        width: 1065px;
                        border-radius: 8px;
                        background-color: #eb1e23;
                        display: grid;
                        grid-template-columns: [icon] 27px [message] auto;
                        grid-column-gap: 18px;
                        align-items: center;
                        color: #ffffff;
                        font-family: Roboto;
                        font-size: 18px;
                        box-sizing: border-box;
                        padding: 20px 30px;
                        align-content: center;
                      `}
                    >
                      <IconDangerWhite style={{ gridColumn: `icon` }} />
                      <div
                        style={{ gridColumn: `message` }}
                        css={css`
                          font-weight: 500;
                        `}
                      >
                        {getNotSelledTicketMessage(notSelledTickets[selectedTicket.index])}
                      </div>
                    </div>
                  </div>
                )}
                {isVisibile && (
                  <>
                    <DialogPrenotazioneBody
                      ticket={selectedTicket}
                      sviluppoSistema={sviluppoSistema}
                      deleteEsitoFromTicket={deleteEsitoFromTicket}
                    />
                    <DialogPrenotazioneFooter ticket={selectedTicket} sviluppoSistema={sviluppoSistema} />
                  </>
                )}
              </>
            )}
          </>
        )}
      </StyledDialog>
    </StyledDialogContainer>
  );
}

const StyledDialogHeader = styled.div`
  height: 90px;
  border-radius: 12px 12px 0 0;
  background-color: #333333;
  position: relative;
`;

const StyledYellowButton = styled.div`
  width: 150px;
  height: 50px;
  border: 2px solid black;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-family: Mulish;
  font-size: 1.125rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: #fff;
    background-color: #000;
  }
`;

export function getNotSelledTicketMessage(propertyValue: string) {
  switch (propertyValue) {
    case configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_REJECETED:
      return (
        <>
          <FormattedMessage
            description="rejected heading in modulo gestione multibiglietto"
            defaultMessage="Scommessa rifiutata."
          />
          <span
            css={css`
              font-weight: 400;
              padding-left: 3px;
            `}
          >
            <FormattedMessage
              description="rejected description in modulo gestione nultibiglietto"
              defaultMessage="I nostri quotisti non hanno accettato la tua giocata"
            />
          </span>
        </>
      );

    case configuration.SELL_ERROR_CODE.UNDER_ACCEPTANCE_TIMEOUT:
      return (
        <>
          <FormattedMessage
            description="timeout heading in modulo gestione multibiglietto"
            defaultMessage="Scommessa non valutata. "
          />
          <div
            css={css`
              font-weight: 400;
            `}
          >
            <FormattedMessage
              description="timeout description in modulo gestione multibiglietto"
              defaultMessage="A causa dell'intenso traffico non siamo riusciti a prendere in carico la richiesta. Riprova ad effettuare la vendita"
            />
          </div>
        </>
      );
    default:
      return (
        <>
          <FormattedMessage
            description="Vendita non andata a buon fine biglietto modulo gestione prenotazione multibiglietto"
            defaultMessage="Vendita non andata a buon fine."
          />
          <span
            css={css`
              font-weight: 400;
              padding-left: 3px;
            `}
          >
            {propertyValue}
          </span>
        </>
      );
  }
}
