import React, { useCallback, useEffect, useLayoutEffect } from "react";
import beepFile from "src/assets/beep.mp3";
import icoArrowDownBlack from "src/assets/images/icon-arrow-down-black.png";
import { ReactComponent as IcoCloseWhite } from "src/assets/images/icon-close-white-rounded.svg";
import icoDangerWhite from "src/assets/images/icon-danger-white.png";
import { ReactComponent as IcoHomeWhite } from "src/assets/images/icon-home-white-rounded.svg";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { formatIdInfoAggiuntiva } from "src/components/smart-search/formatting";
import { AvvenimentoSmart, SuggerimentiSmart } from "src/components/smart-search/smart-api";
import { SmartSearch0 } from "src/components/smart-search/SmartSearch0";
import { SmartSearch1 } from "src/components/smart-search/SmartSearch1";
import { SmartSearch2 } from "src/components/smart-search/SmartSearch2";
import { SmartSearch3 } from "src/components/smart-search/SmartSearch3";
import { SmartSearch4 } from "src/components/smart-search/SmartSearch4";
import { SmartSearchHeaderDescriptionMemo } from "src/components/smart-search/SmartSearchHeaderDescription";
import { SmartSearchSlotsMemo, smartSearchSlotSpacing } from "src/components/smart-search/SmartSearchSlot";
import { SmartSearchState } from "src/components/smart-search/useSmartSearch";
import styled, { css } from "styled-components/macro";

// DEBT memoize header

type SmartSearchProps = {
  state: SmartSearchState;
  onStateChange(state: SmartSearchState): void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  suggerimenti: SuggerimentiSmart | undefined;
  keyboardNavigationContext: { current: KeyboardNavigationContext };
};
export type SmartSearchRef = {
  focusInput(): void;
};
function SmartSearch({ state, onStateChange, inputRef, suggerimenti, keyboardNavigationContext }: SmartSearchProps) {
  const { goToHomeBySmartSearch } = useNavigazioneActions();
  const { text } = state;
  const hasSmartInputError =
    state.type !== "0" && state.subtype.type === "risultati" && state.subtype.nessunaCorrispondenza === true;
  const isSmartSearchInputActive = state.subtype.type === "risultati" || state.subtype.type === "focus";
  const isCollapsed = state.type === "0";
  const isMinimized = isCollapsed && state.subtype.type === "inattivo";
  useLayoutEffect(() => {
    if (inputRef.current) {
      // focus managment
      if (state.subtype.type === "focus" || state.subtype.type === "risultati") {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [state.type, state.subtype.type, inputRef]);
  useEffect(() => {
    // serve per il primo caricamento perchè smartSearchRef non viene popolato subito
    setTimeout(() => {
      if (inputRef.current) {
        // focus managment
        inputRef.current.focus();
      }
    }, 0);
  }, [inputRef]);

  const inputPlaceholder = (() => {
    if (state.type === "0" && state.subtype.type === "inattivo") {
      return `Premi il tasto INS per iniziare`;
    } else if ((state.type === "0" && state.subtype.type === "focus") || state.type === "1") {
      return `12345 o Roma - Lazio`;
    }
  })();

  const onFixAvvenimento = useCallback(
    (avvenimento: AvvenimentoSmart) => {
      onStateChange({
        type: "2",
        subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
        text: "",
        avvenimento,
        infoAggiuntivaAccordionToggle: {},
      });
    },
    [onStateChange],
  );

  return (
    <StyledSmartSearchContainer isMinimized={isMinimized}>
      {isMinimized ? (
        <StyledSmartSearchMinimized
          onClick={() => {
            onStateChange({
              type: "0",
              subtype: { type: "focus" },
              text: "",
            });
          }}
        >
          <div
            css={css`
              color: #aac21f;
              font-family: Mulish;
              font-size: 1.188rem;
              font-weight: 800;
              letter-spacing: 0;
              grid-column: title;
            `}
          >
            Ricerca avvenimento
          </div>
          <div
            css={css`
              color: #ffffff;
              font-family: Roboto;
              font-size: 0.938rem;
              font-weight: 500;
              letter-spacing: 0;
              margin-top: 4px;
              grid-column: description;
            `}
          >
            Inserisci il codice avvenimento o ricercalo testualmente
          </div>
          <div
            css={css`
              color: #ffffff;
              font-family: Mulish;
              font-size: 0.813rem;
              font-weight: 800;
              letter-spacing: 0;
              line-height: 21px;
              text-align: center;
              box-sizing: border-box;
              border: 1px solid #e0e0e0;
              opacity: 0.7;
              border-radius: 15px;
              padding: 0 3px;
              width: 32px;
              grid-column: ins;
            `}
          >
            Ins
          </div>

          <div
            css={css`
              height: 25px;
              width: 25px;
              background-color: #ffffff;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
              border-radius: 50%;
              align-self: center;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            `}
          >
            <img
              src={icoArrowDownBlack}
              alt="icon-toggle"
              css={css`
                margin-left: 1px;
                margin-top: 2px;
              `}
            />
          </div>
        </StyledSmartSearchMinimized>
      ) : (
        <SmartSearchHeaderContainer>
          <StyledSmartSearchHeader>
            {hasSmartInputError && (
              <StyledNessunaCorrispondenzaContainer>
                <StyledNessunaCorrispondenzaText>
                  <img
                    alt="danger"
                    src={icoDangerWhite}
                    css={css`
                      margin: 12px 20px;
                      height: auto;
                      width: 25px;
                    `}
                  />
                  Nessuna corrispondenza
                </StyledNessunaCorrispondenzaText>
              </StyledNessunaCorrispondenzaContainer>
            )}
            <StyledSmartInputContainer isActive={isSmartSearchInputActive} hasError={hasSmartInputError}>
              {state.avvenimento ? (
                <StyledFixedInputCode>{state.avvenimento.codiceAvvenimento}</StyledFixedInputCode>
              ) : null}
              {state.classeEsito ? (
                <StyledFixedInputCode>{state.classeEsito.codiceClasseEsito}</StyledFixedInputCode>
              ) : null}
              {state.infoAggiuntiva ? (
                <StyledFixedInputCode>
                  {formatIdInfoAggiuntiva(state.infoAggiuntiva.codedIdInfoAggiuntiva)}
                </StyledFixedInputCode>
              ) : null}
              <StyledSmartInput
                ref={inputRef}
                value={text}
                placeholder={inputPlaceholder}
                onFocus={() => {
                  // focus managment
                  if (state.type === "0") {
                    onStateChange({ ...state, subtype: { type: "focus" } });
                  } else {
                    onStateChange({
                      ...state,
                      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                    });
                  }
                  keyboardNavigationContext.current = "smart-search";
                }}
                onBlur={() => {
                  // focus managment
                  if (state.type === "0" && state.subtype.type === "focus") {
                    // setTimout inserito per permettere di cliccare correttamente sulle sezioni sottostanti la smart search
                    setTimeout(() => {
                      onStateChange({
                        type: "0",
                        subtype: { type: "inattivo" },
                        text: "",
                      });
                    }, 100);
                  }
                }}
                onChange={(event) => {
                  if (state.type === "0") {
                    onStateChange({
                      text: event.target.value,
                      type: "1",
                      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                    });
                  } else if (state.type === "1") {
                    onStateChange({
                      ...state,
                      text: event.target.value,
                      soloAvvenimentiConCodiceCompleto: false,
                      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                    });
                  } else {
                    onStateChange({
                      ...state,
                      text: event.target.value,
                      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                    });
                  }
                }}
                data-qa={"smart_search_cerca"}
              />
            </StyledSmartInputContainer>
            <SmartSearchHeaderDescriptionMemo state={state} />
            <div
              css={css`
                display: ${isCollapsed ? "none" : "flex"};
                align-items: center;
              `}
            >
              <StyledCloseButton
                onClick={() => {
                  onStateChange({ type: "0", subtype: { type: "focus" }, text: "" });
                  goToHomeBySmartSearch();
                  // DEBT resetta navigazione sisal.it alla pagina principale
                }}
                data-qa={"smart_search_home"}
              >
                <IcoHomeWhite />
              </StyledCloseButton>
              <StyledCloseButton
                onClick={() => {
                  onStateChange({ type: "0", subtype: { type: "focus" }, text: "" });
                }}
                data-qa={"smart_search_chiudi"}
              >
                <IcoCloseWhite />
              </StyledCloseButton>
            </div>
          </StyledSmartSearchHeader>
          {!isCollapsed && (
            <SmartSearchSlotsMemo
              type={state.type}
              avvenimento={state.avvenimento}
              classeEsito={state.classeEsito}
              infoAggiuntiva={state.infoAggiuntiva}
              onStateChange={onStateChange}
            />
          )}
        </SmartSearchHeaderContainer>
      )}

      {!isCollapsed && (
        <StyledSmartSearchRisultatiContainer>
          <StyledSmartSearchRisultati>
            {(() => {
              if (!suggerimenti) {
                return null;
              }
              switch (state.type) {
                case "0": {
                  return <SmartSearch0 state={state} />;
                }
                case "1": {
                  return (
                    <SmartSearch1 state={state} suggerimenti={suggerimenti.avvenimentoList} onFix={onFixAvvenimento} />
                  );
                }
                case "2": {
                  return (
                    <SmartSearch2
                      state={state}
                      onStateChange={onStateChange}
                      suggerimenti={suggerimenti.classeEsitoList}
                    />
                  );
                }
                case "3": {
                  return (
                    <SmartSearch3
                      state={state}
                      onStateChange={onStateChange}
                      suggerimenti={suggerimenti.infoAggiuntivaList}
                    />
                  );
                }
                case "4": {
                  return <SmartSearch4 state={state} suggerimenti={suggerimenti.esitoList} />;
                }
                default:
                  throw new Error();
              }
            })()}
          </StyledSmartSearchRisultati>
        </StyledSmartSearchRisultatiContainer>
      )}
    </StyledSmartSearchContainer>
  );
}
export const SmartSearchMemo = React.memo(SmartSearch);

// lazy import makes the file into a separate bundle
const beepAudio = new Audio(beepFile);
export function beep() {
  beepAudio.pause();
  beepAudio.currentTime = 0;
  beepAudio.play();
  const SHOW_VISUAL_FEEDBACK_OF_BEEP = false;
  if (SHOW_VISUAL_FEEDBACK_OF_BEEP) {
    const beepElement = document.createElement("div");
    beepElement.innerText = "beep " + beepCount++;
    beepElement.setAttribute(
      "style",
      "color: red; font-weight: bold; border: 2px solid red; border-radius: 4px; font-size: 40px; background-color: rgba(255,255,255,0.8); padding: 0px 10px; margin: 10px;",
    );
    beepListElement.appendChild(beepElement);
    setTimeout(() => {
      beepListElement.removeChild(beepElement);
    }, 2000);
  }
}
const beepListElement = document.createElement("div");
document.body.appendChild(beepListElement);
beepListElement.setAttribute("style", "position: fixed; top: 0px; left: 0px;");
let beepCount = 0;

const StyledSmartSearchContainer = styled.div<{ isMinimized: boolean }>`
  background-color: #333333;
  border-radius: 4px;
  grid-area: smartsearch;
`;

const SmartSearchHeaderContainer = styled.div`
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const StyledSmartSearchHeader = styled.div`
  display: flex;
  position: relative;
`;

const StyledSmartInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  caret-color: #aac21f;
  margin-left: 12px;
  width: 100%;
  padding: 0px;
  font-size: 1.125rem;
  font-weight: 500;
  font-family: Roboto;

  &::placeholder {
    font-weight: 300;
    font-style: italic;
    color: #ffffff;
    opacity: 85%;
  }
`;

const StyledSmartInputContainer = styled.div<{
  isActive: boolean;
  hasError: boolean;
}>`
  border-radius: ${(props) => (props.isActive ? "8px" : "4px")};
  border: ${(props) =>
    props.hasError ? " 4px solid #E31C21" : props.isActive ? " 4px solid #aac21f" : " 2px solid white"};
  padding: ${(props) => (!props.isActive && !props.hasError ? "2px" : "")};
  display: flex;
  flex-shrink: 0;
  width: calc(33.33% - ${smartSearchSlotSpacing} / 2);
  box-sizing: border-box;

  ${StyledSmartInput} {
    color: ${(props) => (props.isActive && props.hasError ? "#E31C21" : "#FFFFFF")};
  }
`;

const StyledFixedInputCode = styled.div`
  border-radius: 4px;
  background-color: #444444;
  color: white;
  margin: 4px 4px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  font-size: 1.125rem;
  font-weight: 500;
  font-family: Roboto;
`;

const StyledNessunaCorrispondenzaContainer = styled.div`
  background-color: #e72530;
  width: calc(33.33% - ${smartSearchSlotSpacing} / 2);
  border-radius: 8px;
  position: absolute;
  top: calc(-100% - 4px);
  height: auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  z-index: 2;
`;

const StyledNessunaCorrispondenzaText = styled.div`
  display: flex;
  align-items: center;
  color: #ffffff;
  font-weight: 600;
`;

const StyledCloseButton = styled.div`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 16px;
  &:hover {
    background-color: #565656;
    cursor: pointer;
  }
`;

const StyledSmartSearchRisultatiContainer = styled.div`
  height: calc(64.4vh - 10px);
  overflow: hidden auto;
  padding: 15px 20px 20px;
  border-radius: 0 0 4px 4px;
  scroll-snap-type: y mandatory;
  scroll-padding: 10px;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const StyledSmartSearchRisultati = styled.div`
  background-color: #333333;
`;

const StyledSmartSearchMinimized = styled.div`
  display: grid;
  grid-template-columns: [title] max-content [description] auto [ins] min-content [arrow] min-content;
  column-gap: 10px;
  align-items: center;
  height: 45px;
  border-radius: 4px;
  background-color: #333333;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 0 10px;
  box-sizing: border-box;
`;
