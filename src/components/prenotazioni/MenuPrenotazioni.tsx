import { orderBy } from "lodash";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import IcoRefresh from "src/assets/images/bt_refresh.svg";
import IcoClose from "src/assets/images/closeDialog.png";
import IcoDangerWhite from "src/assets/images/icon-danger-white.png";
import IcoSearchGrey from "src/assets/images/icon-search-grey.svg";
import { Loader } from "src/components/common/loader/loader";
import { TicketIndex } from "src/components/dialog-prenotazione/DialogPrenotazioneMultiBiglietto";
import { DialogPrenotazioneState } from "src/components/dialog-prenotazione/useDialogPrenotazione";
import { EmptyPrenotazioni } from "src/components/prenotazioni/EmptyPrenotazioni";
import { Prenotazione } from "src/components/prenotazioni/Prenotazione";
import {
  getListaPrenotazioni,
  getPrenotazioneByCode,
  Prenotazione as SchedaPrenotazione,
  Ticket,
} from "src/components/prenotazioni/prenotazioni-api";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { beep } from "src/components/smart-search/SmartSearch";
import { dateFormatterWithoutweekDay, timeFormatterWithSecond } from "src/helpers/format-date";
import { BonusConfigClassType } from "src/types/bonusConfig.type";
import { NickName } from "src/types/chiavi";
import { AmountsChangedResponse, VenditaSuccessResponse } from "src/types/vendita.types";
import styled, { css } from "styled-components/macro";
import useSWR, { mutate } from "swr";
import configuration from "src/helpers/configuration";

type MenuPrenotazioniProps = {
  dialogPrenotazioneState: DialogPrenotazioneState;
  onTicketSell(
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
  pushToast(content: React.ReactNode, duration: number): void;
};
export function MenuPrenotazioni({ dialogPrenotazioneState, onTicketSell, pushToast }: MenuPrenotazioniProps) {
  const inputSearchPrenotazioniRef = useRef<HTMLInputElement | null>(null);
  const [inputSearchPrenotazioniState, setInputSearchPrenotazioniState] = useState({
    isActive: true,
    isInvalid: false,
    isShort: false,
    notFound: false,
    text: "",
  });

  const [selectedFilterTab, setSelectedFilterTab] = useState<"all" | "appWeb" | "room">("all");
  const { openDialogPrenotazioneByCode } = useNavigazioneActions();
  const { data: listaPrenotazioni } = useSWR("listaPrenotazioni", getListaPrenotazioni, {
    dedupingInterval: 60 * 60 * 1000,
    revalidateOnFocus: false,
  });

  const inputError =
    inputSearchPrenotazioniState.isInvalid ||
    inputSearchPrenotazioniState.isShort ||
    inputSearchPrenotazioniState.notFound;

  const regexValidateInput = /(^[aAdD][0-9]{0,10}$)|(^[xX][0-9]{0,14}$)/;
  const isShort =
    inputSearchPrenotazioniState.text.length > 0 &&
    /(^[aAdD][0-9]{0,9}$)|(^[xX][0-9]{0,10}$)/.test(inputSearchPrenotazioniState.text);
  const startsWihtX = /^[xX]/.test(inputSearchPrenotazioniState.text);

  const invalidInput = (codeBiglietto: string) => {
    return codeBiglietto.length > 0 && !regexValidateInput.test(codeBiglietto);
  };

  const keyboardNavigationContext = useContext(KeyboardNavigationContext);

  useLayoutEffect(() => {
    if (inputSearchPrenotazioniRef.current) {
      // focus managment
      if (inputSearchPrenotazioniState.isActive) {
        inputSearchPrenotazioniRef.current.focus();
      } else {
        inputSearchPrenotazioniRef.current.blur();
      }
    }
  }, [inputSearchPrenotazioniState.isActive, inputSearchPrenotazioniRef]);

  useEffect(() => {
    // serve per il primo caricamento perchè inputSearchPrenotazioniRef non viene popolato subito
    setTimeout(() => {
      if (inputSearchPrenotazioniRef.current) {
        // focus managment
        inputSearchPrenotazioniRef.current.focus();
      }
    }, 0);
  }, [inputSearchPrenotazioniRef]);

  const [prenotazioneToRemove, setPrenotazioneToRemove] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (
      dialogPrenotazioneState.isMinimized ||
      (listaPrenotazioni &&
        !dialogPrenotazioneState.dialogPrenotazioneCode &&
        !dialogPrenotazioneState.dialogPrenotazioneNickname &&
        !dialogPrenotazioneState.dialogPrenotazioneNotAvailable)
    ) {
      updateList();
    }
    // eslint-disable-next-line
  }, [dialogPrenotazioneState]);

  const [lastUpdate, setLastUpdate] = useState(
    `${dateFormatterWithoutweekDay.format(new Date())} - ${timeFormatterWithSecond.format(new Date())}`,
  );

  const updateList = (prenotazineToDelete?: string) => {
    if (prenotazineToDelete) {
      const newList = listaPrenotazioni?.bookingInfos.filter(
        (bookingInfo) => bookingInfo.nickName !== prenotazineToDelete,
      );
      mutate("listaPrenotazioni", { ...listaPrenotazioni, bookingInfos: newList }, false);
      setPrenotazioneToRemove(undefined);
    }
    mutate("listaPrenotazioni");
    const date = new Date();
    setLastUpdate(`${dateFormatterWithoutweekDay.format(date)} - ${timeFormatterWithSecond.format(date)}`);
  };

  // DEBT
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }

      if (event.key === "F7") {
        setSelectedFilterTab("all");
        updateList();
      } else if (event.ctrlKey && (event.key === "a" || event.key === "A")) {
        updateList();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!listaPrenotazioni) {
    return <Loader />;
  }

  const listaPrenotazioniFiltered =
    selectedFilterTab !== "all"
      ? listaPrenotazioni?.bookingInfos.filter((prenotazione) => {
          const attribute = getFirstMappedAttribute(prenotazione.attributes);
          return attribute && getBookingProvenanceInfo(attribute)!.type === selectedFilterTab;
        })
      : listaPrenotazioni?.bookingInfos;

  const listaPrenotazioniOrdered = orderBy(
    listaPrenotazioniFiltered,
    [(prenotazione) => new Date(prenotazione.creationTime)],
    ["desc"],
  );

  return (
    <>
      <StyledContainerPrenotazioni>
        <div
          css={css`
            display: grid;
            grid-template-columns: [titlePrenotazioni] 1fr [refresh] auto;
            padding: 50px 40px 70px 40px;
          `}
        >
          <div
            css={css`
              grid-column: titlePrenotazioni;
            `}
          >
            <StyledPrenotazioniTitle>
              <FormattedMessage description="prenotazioni header title" defaultMessage="Prenotazioni" />
            </StyledPrenotazioniTitle>
            <StyledPrenotazioniSubTitle>
              <FormattedMessage
                description="prenotazioni header subtitle"
                defaultMessage="Gestisci le prenotazioni effettuate dall' <b>applicazione MatchPoint</b>, dal <b>sito web</b> o dai <b>prenotatori di sala</b><br></br><b>Ricerca</b> il codice prenotazione o il codice <b>precompilata</b>"
                values={{
                  b: (chunks: string) => <span className="subtitle-bold">{chunks}</span>,
                  br: () => <br />,
                }}
              />
            </StyledPrenotazioniSubTitle>
          </div>
          <div
            css={css`
              display: inline-flex;
              grid-column: refresh;
              align-items: flex-start;
              padding-top: 10px;
            `}
          >
            <div
              css={css`
                color: #979797;
                font-family: Roboto;
                font-size: 14px;
                letter-spacing: 0;
                line-height: 19px;
                text-align: right;
                padding-right: 10px;
              `}
            >
              <div>
                <FormattedMessage
                  description="prenotazioni ultimo aggiornamento"
                  defaultMessage="Ultimo aggiornamento"
                />
              </div>
              <div
                css={css`
                  font-weight: bold;
                `}
              >
                {lastUpdate}
              </div>
            </div>
            <button
              data-qa="refresh_prenotazioni"
              css={css`
                box-sizing: border-box;
                padding: 10px 10px 10px 21px;
                border: 2px solid #333333;
                background-color: #ffffff;
                border-radius: 25px;
                display: inline-flex;
                align-items: center;
                height: 40px;
                width: 120px;
                cursor: pointer;
              `}
              onClick={() => {
                updateList();
              }}
            >
              <img
                src={IcoRefresh}
                css={css`
                  width: 18.5px;
                  height: 18.5px;
                  margin-right: 20px;
                `}
                alt=""
              />
              <div
                css={css`
                  box-sizing: border-box;
                  border: 1px solid #e0e0e0;
                  border-radius: 10px;
                  width: 49px;
                  height: 21px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-weight: bold;
                  line-height: 21px;
                  font-family: Mulish;
                  display: grid;
                  grid-template-columns: [filtriTab] 1fr [inputSearchCode] auto;
                `}
              >
                ctrl A
              </div>
            </button>
          </div>
        </div>

        <div
          css={css`
            display: grid;
            grid-template-columns: [filtriTab] 1fr [inputError] max-content [inputSearchCode] auto;
            column-gap: 10px;
            align-items: center;
            position: sticky;
            top: 0px;
            background-color: #ffffff;
            box-sizing: border-box;
            padding: 15px 40px;
            height: 80px;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
          `}
        >
          {listaPrenotazioni.bookingInfos?.length > 0 && (
            <div
              css={css`
                grid-column: filtriTab;
              `}
            >
              <div
                css={css`
                  display: grid;
                  grid-template-columns: repeat(3, [button] max-content);
                  align-self: center;
                `}
              >
                <StyledFilterButton
                  css={css`
                    grid-column: button 1;
                    width: 110px;
                  `}
                  isActive={selectedFilterTab === "all"}
                  onClick={() => setSelectedFilterTab("all")}
                >
                  <FormattedMessage description="All label of filter tab in booking list" defaultMessage="Tutte" />
                </StyledFilterButton>
                <StyledFilterButton
                  css={css`
                    grid-column: button 2;
                    width: 170px;
                  `}
                  isActive={selectedFilterTab === "appWeb"}
                  onClick={() => setSelectedFilterTab("appWeb")}
                >
                  <FormattedMessage
                    description="App and web label of filter tab in booking list"
                    defaultMessage="App e Web"
                  />
                </StyledFilterButton>
                <StyledFilterButton
                  css={css`
                    grid-column: button 3;
                    width: 105px;
                  `}
                  isActive={selectedFilterTab === "room"}
                  onClick={() => setSelectedFilterTab("room")}
                >
                  <FormattedMessage description="Room label of filter tab in booking list" defaultMessage="Sala" />
                </StyledFilterButton>
              </div>
            </div>
          )}

          {inputError && (
            <div
              css={css`
                grid-column: inputError;
                background-color: #e31c21;
                color: #ffffff;
                font-family: Roboto;
                font-size: 18px;
                font-weight: 500;
                letter-spacing: 0;
                line-height: 16px;
                padding: 15px 20px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                height: 50px;
              `}
            >
              <img
                alt="danger"
                src={IcoDangerWhite}
                css={css`
                  margin-right: 20px;
                  height: auto;
                  width: 25px;
                `}
              />
              {inputSearchPrenotazioniState.isInvalid ? (
                <FormattedMessage
                  description="prenotazioni search codice non corretto"
                  defaultMessage="Codice non corretto"
                />
              ) : inputSearchPrenotazioniState.isShort ? (
                startsWihtX ? (
                  <FormattedMessage
                    description="prenotazioni search codice incompleto"
                    defaultMessage="Codice incompleto"
                  />
                ) : (
                  <FormattedMessage
                    description="prenotazioni search codice incompleto con numero caratteri"
                    defaultMessage="Codice incompleto, inserire 11 caratteri"
                  />
                )
              ) : inputSearchPrenotazioniState.notFound ? (
                startsWihtX ? (
                  <FormattedMessage
                    description="prenotazioni search precompilata non trovata"
                    defaultMessage="Precompilata non trovata"
                  />
                ) : (
                  <FormattedMessage
                    description="prenotazioni search prenotazione non trovata"
                    defaultMessage="Prenotazione non trovata"
                  />
                )
              ) : (
                ""
              )}
            </div>
          )}
          <StyledInputContainer
            isActive={inputSearchPrenotazioniState.isActive}
            hasError={inputError}
            css={css`
              grid-column: inputSearchCode;
            `}
          >
            <StyledInput
              data-qa="codice_prenotazione"
              ref={inputSearchPrenotazioniRef}
              placeholder={"Inserisci codice"}
              type="search"
              value={inputSearchPrenotazioniState.text}
              onChange={(event) => {
                const text = event.target.value;
                setInputSearchPrenotazioniState({
                  ...inputSearchPrenotazioniState,
                  text,
                  isInvalid: invalidInput(text),
                  notFound: false,
                  isShort: false,
                });
                // do not set maxLength as react prop, it breaks paste
                if (/^[aAdD]/.test(text)) {
                  event.currentTarget.maxLength = 11;
                }
                if (/^[xX]/.test(text)) {
                  event.currentTarget.maxLength = 15;
                }
              }}
              onBlur={() => {
                setInputSearchPrenotazioniState({
                  ...inputSearchPrenotazioniState,
                  isActive: false,
                  isShort,
                });
              }}
              onFocus={() => {
                setInputSearchPrenotazioniState({
                  ...inputSearchPrenotazioniState,
                  isActive: true,
                });
              }}
              onKeyDown={(event) => {
                if (keyboardNavigationContext.current === "blocking-operation") {
                  return;
                }
                if (event.key === "Enter" && !event.ctrlKey && inputSearchPrenotazioniState.isActive) {
                  if (isShort) {
                    beep();
                    setInputSearchPrenotazioniState({
                      ...inputSearchPrenotazioniState,
                      isActive: true,
                      isShort: true,
                    });
                  } else {
                    if (!inputError) {
                      (async () => {
                        try {
                          await getPrenotazioneByCode(inputSearchPrenotazioniState.text);
                          openDialogPrenotazioneByCode(inputSearchPrenotazioniState.text);
                        } catch (error) {
                          setInputSearchPrenotazioniState({ ...inputSearchPrenotazioniState, notFound: true });
                          beep();
                        }
                      })();
                    } else {
                      beep();
                    }
                  }
                }
              }}
              css={css`
                &::-webkit-search-cancel-button {
                  margin-right: ${inputSearchPrenotazioniRef.current?.focus
                    ? inputSearchPrenotazioniRef.current.value === ""
                      ? "-20px"
                      : "5px"
                    : "5px"};
                }
              `}
            />
          </StyledInputContainer>
        </div>
        <div
          css={css`
            padding: 0px 40px;
          `}
        >
          {listaPrenotazioniOrdered.length > 0 ? (
            listaPrenotazioniOrdered.map((prenotazione, prenotazioneIndex) => {
              const date = new Date(prenotazione.creationTime);
              const ticketsCountMessage = prenotazione.openTicketsCount > 1 ? `(${prenotazione.openTicketsCount})` : "";
              return (
                <DeleteAnimationContainer key={prenotazioneIndex}>
                  <DeleteAnimationElement
                    className={
                      prenotazioneToRemove && prenotazioneToRemove === prenotazione.nickName
                        ? `delete-prenotazione`
                        : ``
                    }
                  >
                    <Prenotazione
                      prenotazione={prenotazione}
                      date={date}
                      ticketsCountMessage={ticketsCountMessage}
                      onSuccessDelete={() => {
                        setPrenotazioneToRemove(prenotazione.nickName);
                        setTimeout(() => {
                          updateList(prenotazione.nickName);
                        }, 1000);
                      }}
                      onTicketSell={onTicketSell}
                      pushToast={pushToast}
                    />
                  </DeleteAnimationElement>
                </DeleteAnimationContainer>
              );
            })
          ) : (
            <EmptyPrenotazioni />
          )}
        </div>
      </StyledContainerPrenotazioni>
    </>
  );
}

const StyledContainerPrenotazioni = styled.div`
  z-index: 1;
  background-color: #ffffff;
  width: 100%;
  overflow-y: auto;
  height: 100vh;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const StyledPrenotazioniTitle = styled.div`
  height: 38px;
  width: 166px;
  color: #222222;
  font-family: Mulish, sans-serif;
  font-size: 1.813rem;
  font-weight: 900;
  padding-bottom: 8px;
`;

const StyledPrenotazioniSubTitle = styled.div`
  color: #979797;
  font-family: Mulish, sans-serif;
  font-weight: 400;
  font-size: 1.125rem;
  .subtitle-bold {
    font-family: Mulish, sans-serif;
    font-weight: 700;
  }
`;

const StyledInput = styled.input`
  height: 42px;
  border: none;
  outline: none;
  caret-color: #aac21f;
  margin-left: 10px;
  width: calc(100% - 10px);
  padding: 0px;
  font-size: 1.125rem;
  font-weight: 500;
  font-family: Roboto;
  color: #222222;
  border-radius: 4px;
  &::placeholder {
    color: #cbcbcb;
    font-family: Roboto;
    font-size: 1.125rem;
    font-style: italic;
    letter-spacing: 0;
    line-height: 33px;
  }
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 23px;
    width: 23px;
    background-image: url(${IcoClose});
  }
  &::-webkit-input-placeholder {
    background-image: url(${IcoSearchGrey});
    background-position: right center;
    background-size: 25px;
    background-repeat: no-repeat;
  }
`;

const StyledInputContainer = styled.div<{
  isActive: boolean;
  hasError: boolean;
}>`
  border-radius: 8px;
  border: ${(props) =>
    props.hasError ? " 4px solid #E31C21" : props.isActive ? " 4px solid #aac21f" : " 2px solid #979797"};
  padding: ${(props) => (!props.isActive && !props.hasError ? "2px" : "")};
  box-sizing: border-box;
`;

export function getTicketType(ticket: Ticket) {
  if (ticket.systemClasses !== null) {
    return "Sistema";
  } else if (ticket.results && ticket.results.length > 1) {
    return "Multipla";
  } else if (ticket.results && ticket.results.length === 1) {
    return "Singola";
  }
  return "";
}

export function getBookingProvenanceInfo(attribute: number) {
  if (
    attribute === configuration.BOOKING_PROVENANCE.SELFY ||
    attribute === configuration.BOOKING_PROVENANCE.PRENOTATORE
  ) {
    return {
      type: "room",
      message: "Sala",
    };
  } else if (
    attribute === configuration.BOOKING_PROVENANCE.SISAL_IT ||
    attribute === configuration.BOOKING_PROVENANCE.SITO_MOBILE_APP_MP
  ) {
    return {
      type: "appWeb",
      message: "App e Web",
    };
  }
}

export function getFirstMappedAttribute(attributes: number[]) {
  var mappedValuesList: number[] = Object.values(configuration.BOOKING_PROVENANCE);
  return attributes && attributes.find((item) => mappedValuesList.includes(item));
}

export function checkNotAvailablePrenotazione(prenotazione: SchedaPrenotazione) {
  let checkNotAvailableStatus: boolean = false;
  if (prenotazione.status === "Closed" || prenotazione.status === null) {
    checkNotAvailableStatus = true;
  }
  return checkNotAvailableStatus;
}

const DeleteAnimationContainer = styled.div`
  background-color: #f1f1f1;
  box-shadow: inset 0 1px 11px 0 rgba(0, 0, 0, 0.5);
  margin: 0 -40px;
`;

const DeleteAnimationElement = styled.div`
  margin: 0 40px;
  &.delete-prenotazione {
    animation: delete-prenotazione-animation 1s linear forwards;
  }
  @keyframes delete-prenotazione-animation {
    0% {
      height: 112px;
      transform: translateX(0);
    }
    50% {
      height: 112px;
      transform: translateX(-50vw);
    }
    65% {
      height: 112px;
      transform: translateX(-100vw);
    }
    75% {
      height: 84px;
      transform: translateX(-100vw);
    }
    85% {
      height: 56px;
      transform: translateX(-100vw);
    }
    100% {
      height: 0px;
      transform: translateX(-100vw);
    }
  }
`;

const StyledFilterButton = styled.button<{ isActive: boolean }>`
  height: 40px;
  width: 110px;
  border-radius: 20px;
  background-color: ${(props) => (props.isActive === true ? "#AAC21F" : "#ffff")};
  color: ${(props) => (props.isActive === true ? "#FFFFFF" : "#22222")};
  border: ${(props) => (props.isActive === true ? "1px solid #AAC21F" : "none")};
  font-size: 1.25rem;
  font-family: Mulish;
  font-weight: 800;
`;
