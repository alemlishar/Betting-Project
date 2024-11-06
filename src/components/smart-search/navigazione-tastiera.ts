import { useCallback, useLayoutEffect } from "react";
import { SmartSearchState } from "src/components/smart-search/useSmartSearch";
import { SuggerimentiSmart, InfoAggiuntivaSmart, getStatoEsito } from "src/components/smart-search/smart-api";
import { beep } from "src/components/smart-search/SmartSearch";
import { makeChiaveInfoAggiuntiva, ChiaveEsitoBigliettoComponents } from "src/types/chiavi";
import { getListaEsitiDinamicaColumnsNumber } from "src/components/smart-search/isListaEsitiDinamica";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";

// DEBT sblocca situazione se la selezione e fuori range
// DEBT fix apertura navigazione con freccia giu se smart search non è attiva;
// DEBT refactor isInfoAggiuntiveAssenti
// DEBT refactor getLastRowIndex
// DEBT Cambio placeholder input quando ha focus stato 0
// DEBT dopo selezione entità con mouse, il focus non torna sull'input
// DEBT se nell'input è presente del testo e premo INS la posizione del cursore non è corretta ( anche con arrow up / arrow left )
// DEBT fix scroll su arrow up / arrow left quando passo a input
// DEBT refactor sezione, prematch, live in unica hook
// DEBT move everything that has `if (keyboardNavigationContext.current === "blocking-operation") { return; }` inside this file

type GlobalEventListenersParams = {
  keyboardNavigationContext: { current: KeyboardNavigationContext };
  onAddEsito: (chiaveEsitoComponents: ChiaveEsitoBigliettoComponents) => void;
  smartSearchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  smartSearchState: SmartSearchState;
  onSmartSearchStateChange(smartSearchState: SmartSearchState): void;
  smartSearchSuggerimenti: SuggerimentiSmart | undefined;
  onOpenSezioneSport(): void;
  onOpenSezioneLive(): void;
  onOpenSezioneVirtual(): void;
  onOpenSezionePrenotazione(): void;
  onOpenVoucher(): void;
  changeActiveClient(): void;
  onSelectFirstPrediction(): void;
  onArrowDownUp(direction: 1 | -1): void;
  sezione: "live" | "bordero" | "prenotazione" | "virtual" | "sport";
  convertFormattedToString(): void;
  selectInput: React.MutableRefObject<Record<number, HTMLInputElement | null>>;
  activeClientId: number;
  longPressPropDecrease: {
    onMouseDown(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onMouseLeave(e: MouseEvent): void;
    onTouchStart(e: TouchEvent): void;
    onTouchEnd(e: TouchEvent): void;
    onKeyDown(e: KeyboardEvent): void;
    onKeyUp(e: KeyboardEvent): void;
  };
  longPressPropsIncrease: {
    onMouseDown(e: MouseEvent): void;
    onMouseUp(e: MouseEvent): void;
    onMouseLeave(e: MouseEvent): void;
    onTouchStart(e: TouchEvent): void;
    onTouchEnd(e: TouchEvent): void;
    onKeyDown(e: KeyboardEvent): void;
    onKeyUp(e: KeyboardEvent): void;
  };
  openDettaglioAvvenimento(): void;
  deleteEsito(): void;
  onSwitchMultiplaSistema(): void;
};

export function useGlobalEventListeners({
  onAddEsito,
  smartSearchInputRef,
  smartSearchState,
  onSmartSearchStateChange,
  smartSearchSuggerimenti,
  keyboardNavigationContext,
  onOpenSezioneLive,
  onOpenSezioneVirtual,
  onOpenSezioneSport,
  onOpenSezionePrenotazione,
  onOpenVoucher,
  changeActiveClient,
  onSelectFirstPrediction,
  onArrowDownUp,
  sezione,
  convertFormattedToString,
  selectInput,
  activeClientId,
  longPressPropDecrease,
  longPressPropsIncrease,
  openDettaglioAvvenimento,
  deleteEsito,
  onSwitchMultiplaSistema,
}: GlobalEventListenersParams) {
  const keydown = useCallback(
    (event: KeyboardEvent) => {
      //#region default behaviors
      if (event.key === "Tab") {
        event.preventDefault();
      }

      if (["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].includes(event.key)) {
        event.preventDefault();
      }

      // prevent page reload
      if (event.ctrlKey && (event.key === "r" || event.key === "R")) {
        event.preventDefault();
      }

      //#endregion default behaviors

      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }

      if (keyboardNavigationContext.current !== "dialog-recupera-biglietto") {
        if (event.key === "F1") {
          onOpenSezioneSport();
        }
        if (event.key === "F2") {
          onOpenSezioneLive();
        }
        if (event.key === "F3") {
          onOpenSezioneVirtual();
        }
        if (event.key === "F7") {
          onOpenSezionePrenotazione();
        }
        if (event.key === "F8") {
          event.preventDefault(); //TODO: do we need this?
          onOpenVoucher();
        }
      }

      if (event.key === "Insert" && event.location !== 3) {
        if (smartSearchState.type === "0" || keyboardNavigationContext.current === "cart") {
          onSmartSearchStateChange({ type: "0", subtype: { type: "focus" }, text: "" });
        } else {
          onSmartSearchStateChange({
            ...smartSearchState,
            subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
          });
        }
      }

      if (
        event.key === "/" &&
        keyboardNavigationContext.current !== "dialog-recupera-biglietto" &&
        event.location === 3
      ) {
        event.preventDefault();
        changeActiveClient();
      }

      /**
       * BEGIN VIRTUAL SHORTCUT SECTION
       * This shortcut are for virtual use only
       */
      if (sezione === "virtual") {
        if (event.key === "Tab" && keyboardNavigationContext.current !== "cart") {
          event.preventDefault();
          onSelectFirstPrediction();
          keyboardNavigationContext.current = "cart";
        }

        if (event.key === "ArrowDown" && keyboardNavigationContext.current === "cart") {
          event.preventDefault();
          onArrowDownUp(1);
        }
        if (event.key === "ArrowUp" && keyboardNavigationContext.current === "cart") {
          event.preventDefault();
          onArrowDownUp(-1);
        }
        if (event.key === "+" && keyboardNavigationContext.current === "cart") {
          event.preventDefault();
          longPressPropsIncrease.onKeyDown(event);
        }

        if (event.key === "-" && keyboardNavigationContext.current === "cart") {
          event.preventDefault();
          longPressPropDecrease.onKeyDown(event);
        }
        if (event.key === "+" && keyboardNavigationContext.current !== "cart") {
          event.preventDefault();
          selectInput.current[activeClientId]?.focus();
          convertFormattedToString();
          keyboardNavigationContext.current = "cart";
        }
        if (event.key === "Enter" && !event.ctrlKey) {
          event.preventDefault();
          openDettaglioAvvenimento();
        }
        if (event.key === "Delete" && !event.ctrlKey) {
          event.preventDefault();
          deleteEsito();
        }
        if (event.key === "*") {
          event.preventDefault();
          onSwitchMultiplaSistema();
        }
      }

      //#region smart search

      if (!smartSearchSuggerimenti) {
        return;
      }
      if (keyboardNavigationContext.current !== "smart-search") {
        return;
      }
      const { text } = smartSearchState;
      const inputHasFocus = document.activeElement === smartSearchInputRef.current;

      switch (smartSearchState.type) {
        case "4": {
          const { esitoList } = smartSearchSuggerimenti;
          const primoEsito = esitoList[0];
          const columnsNumber = getListaEsitiDinamicaColumnsNumber(smartSearchState.classeEsito);
          // fissa esito con codice completo
          if (event.key === "Enter" && !event.ctrlKey && inputHasFocus) {
            if (
              (primoEsito && primoEsito.codiceEsito.toString() === text) ||
              (primoEsito && primoEsito.descrizione.toLowerCase() === text.toLowerCase())
            ) {
              if (getStatoEsito(primoEsito, smartSearchState.infoAggiuntiva) === "aperto") {
                const {
                  codiceEsito,
                  quota,
                  legaturaAAMS,
                  multipla,
                  legaturaMax,
                  legaturaMin,
                  blackListMax,
                  blackListMin,
                  siglaDisciplina,
                  siglaManifestazione,
                } = primoEsito;
                const {
                  codicePalinsesto,
                  codiceAvvenimento,
                  codiceClasseEsito,
                  codiceScommessa,
                  idInfoAggiuntiva,
                  data,
                } = smartSearchState.infoAggiuntiva;
                const {
                  codiceDisciplina,
                  codiceManifestazione,
                  formattedDataAvvenimento,
                  categoria,
                } = smartSearchState.avvenimento;

                onAddEsito({
                  codicePalinsesto,
                  codiceAvvenimento,
                  codiceClasseEsito,
                  codiceScommessa,
                  idInfoAggiuntiva,
                  codiceDisciplina,
                  codiceEsito,
                  descrizioneScommessa: smartSearchState.infoAggiuntiva.descrizione,
                  descrizioneAvvenimento: smartSearchState.avvenimento.descrizione,
                  descrizioneEsito: primoEsito.descrizione,
                  quota,
                  legaturaAAMS,
                  multipla,
                  legaturaMax,
                  legaturaMin,
                  blackListMax,
                  blackListMin,
                  isLive: categoria !== 0,
                  codiceManifestazione,
                  formattedDataAvvenimento,
                  dataAvvenimento: data,
                  siglaDisciplina,
                  siglaManifestazione,
                });
                onSmartSearchStateChange({
                  type: "1",
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                  text: "",
                });
              } else {
                beep();
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: true },
                });
              }
            } else {
              const visualizzaTutti = esitoList.length === 0;
              beep();
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "risultati", nessunaCorrispondenza: true, visualizzaTutti },
              });
            }
          }
          // fissa esito da navigazione
          if (event.key === "Enter" && !event.ctrlKey && smartSearchState.subtype.type === "navigazione") {
            const esitoEvidenziato = esitoList[smartSearchState.subtype.esitoEvidenziatoIndex];
            if (getStatoEsito(esitoEvidenziato, smartSearchState.infoAggiuntiva) === "aperto") {
              const {
                codiceEsito,
                quota,
                legaturaAAMS,
                multipla,
                legaturaMax,
                legaturaMin,
                blackListMax,
                blackListMin,
                siglaDisciplina,
                siglaManifestazione,
              } = esitoEvidenziato;
              const {
                codicePalinsesto,
                codiceAvvenimento,
                codiceClasseEsito,
                codiceScommessa,
                idInfoAggiuntiva,
                data,
              } = smartSearchState.infoAggiuntiva;
              const {
                codiceDisciplina,
                codiceManifestazione,
                formattedDataAvvenimento,
                categoria,
              } = smartSearchState.avvenimento;

              onAddEsito({
                codicePalinsesto,
                codiceAvvenimento,
                codiceClasseEsito,
                codiceScommessa,
                idInfoAggiuntiva,
                descrizioneScommessa: smartSearchState.infoAggiuntiva.descrizione,
                codiceDisciplina,
                codiceEsito,
                descrizioneAvvenimento: smartSearchState.avvenimento.descrizione,
                descrizioneEsito: esitoEvidenziato.descrizione,
                quota,
                legaturaAAMS,
                multipla,
                legaturaMax,
                legaturaMin,
                blackListMax,
                blackListMin,
                isLive: categoria !== 0,
                codiceManifestazione,
                formattedDataAvvenimento,
                dataAvvenimento: data,
                siglaDisciplina,
                siglaManifestazione,
              });
            }
          }
          // torna a passaggio precedente
          if (event.key === "Backspace" && text === "") {
            const { avvenimento, classeEsito } = smartSearchState;
            onSmartSearchStateChange({
              type: "3",
              subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
              text: "",
              avvenimento,
              classeEsito,
              infoAggiuntivaAccordionToggle: {},
            });
          }
          // passa a navigazione
          if (event.key === "ArrowDown" && primoEsito && smartSearchState.subtype.type !== "navigazione") {
            onSmartSearchStateChange({
              ...smartSearchState,
              subtype: { type: "navigazione", esitoEvidenziatoIndex: 0 },
            });
          }
          // naviga giu
          // DEBT: fix ultima riga
          if (event.key === "ArrowDown" && smartSearchState.subtype.type === "navigazione") {
            const esitoDownIndex = smartSearchState.subtype.esitoEvidenziatoIndex + columnsNumber;
            const { esitoEvidenziatoIndex } = smartSearchState.subtype;

            if (esitoDownIndex < esitoList.length) {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", esitoEvidenziatoIndex: esitoDownIndex },
              });
            } else {
              const totalEsiti = esitoList.length;
              const totalRow = Math.ceil(totalEsiti / columnsNumber);
              const islastRow = totalRow === 1 || totalRow === Math.ceil((esitoEvidenziatoIndex + 1) / columnsNumber);
              if (smartSearchState.subtype.esitoEvidenziatoIndex < esitoList.length - 1 && !islastRow) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "navigazione", esitoEvidenziatoIndex: esitoList.length - 1 },
                });
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                });
              }
            }
          }
          // naviga su
          if (event.key === "ArrowUp" && smartSearchState.subtype.type === "navigazione") {
            const esitoUpIndex = smartSearchState.subtype.esitoEvidenziatoIndex - columnsNumber;
            if (smartSearchState.subtype.esitoEvidenziatoIndex < columnsNumber) {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
              });
            } else {
              if (esitoUpIndex >= 0) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "navigazione", esitoEvidenziatoIndex: esitoUpIndex },
                });
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                });
              }
            }
          }
          // naviga a sinistra
          if (event.key === "ArrowLeft" && smartSearchState.subtype.type === "navigazione") {
            const esitoLefIndex = smartSearchState.subtype.esitoEvidenziatoIndex - 1;
            if (esitoLefIndex >= 0) {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", esitoEvidenziatoIndex: esitoLefIndex },
              });
            } else {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
              });
            }
          }
          // naviga a destra
          if (event.key === "ArrowRight" && smartSearchState.subtype.type === "navigazione") {
            const esitoRightIndex = smartSearchState.subtype.esitoEvidenziatoIndex + 1;
            if (esitoRightIndex < esitoList.length) {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", esitoEvidenziatoIndex: esitoRightIndex },
              });
            } else {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
              });
            }
          }
          break;
        }

        case "3": {
          const { infoAggiuntivaList } = smartSearchSuggerimenti;
          const primaInfoAggiuntiva = infoAggiuntivaList[0];
          const primoEsito = primaInfoAggiuntiva?.esitoList[0];
          const infoAggiuntiveAssenti = infoAggiuntivaList.length === 1 && infoAggiuntivaList[0].idInfoAggiuntiva === 0;
          const { avvenimento, classeEsito } = smartSearchState;

          const { infoAggiuntivaAccordionToggle } = smartSearchState;
          const isInfoAggiuntivaAccordionOpen = (infoAggiuntiva: InfoAggiuntivaSmart) => {
            return (
              infoAggiuntivaAccordionToggle[makeChiaveInfoAggiuntiva(infoAggiuntiva)] ??
              (infoAggiuntiveAssenti || smartSearchState.text === "")
            );
          };

          const infoAggiuntivaEvidenziata =
            smartSearchState.subtype.type === "navigazione"
              ? infoAggiuntivaList[smartSearchState.subtype.infoAggiuntivaEvidenziataIndex]
              : undefined;
          const esitoEvidenziato =
            smartSearchState.subtype.type === "navigazione" &&
            smartSearchState.subtype.esitoEvidenziatoIndex !== undefined
              ? infoAggiuntivaEvidenziata?.esitoList[smartSearchState.subtype.esitoEvidenziatoIndex]
              : undefined;

          // fissa info aggiuntiva con codice completo
          if (event.key === "Enter" && !event.ctrlKey && inputHasFocus && !infoAggiuntiveAssenti) {
            if (
              (primaInfoAggiuntiva && primaInfoAggiuntiva.codedIdInfoAggiuntiva.toString() === text) ||
              (primaInfoAggiuntiva && primaInfoAggiuntiva.descrizione.toLowerCase() === text.toLowerCase())
            ) {
              onSmartSearchStateChange({
                type: "4",
                subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                avvenimento,
                classeEsito,
                infoAggiuntiva: primaInfoAggiuntiva,
                text: "",
              });
            } else {
              const visualizzaTutti = infoAggiuntivaList.length === 0;
              beep();
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "risultati", nessunaCorrispondenza: true, visualizzaTutti },
              });
            }
          }

          // fissa esito con codice completo
          if (event.key === "Enter" && !event.ctrlKey && inputHasFocus && infoAggiuntiveAssenti) {
            if (
              (primoEsito && primoEsito.codiceEsito.toString() === text) ||
              (primoEsito && primoEsito.descrizione.toLowerCase() === text.toLowerCase())
            ) {
              if (getStatoEsito(primoEsito, primaInfoAggiuntiva) === "aperto") {
                const {
                  codiceEsito,
                  quota,
                  legaturaAAMS,
                  multipla,
                  legaturaMax,
                  legaturaMin,
                  blackListMax,
                  blackListMin,
                  siglaDisciplina,
                  siglaManifestazione,
                } = primoEsito;

                const {
                  codicePalinsesto,
                  codiceAvvenimento,
                  codiceClasseEsito,
                  codiceScommessa,
                  idInfoAggiuntiva,
                  data,
                } = primaInfoAggiuntiva;
                const {
                  codiceDisciplina,
                  codiceManifestazione,
                  formattedDataAvvenimento,
                  categoria,
                } = smartSearchState.avvenimento;

                onAddEsito({
                  codicePalinsesto,
                  codiceAvvenimento,
                  codiceClasseEsito,
                  codiceScommessa,
                  idInfoAggiuntiva,
                  codiceEsito,
                  descrizioneScommessa: primaInfoAggiuntiva.descrizione,
                  codiceDisciplina,
                  descrizioneAvvenimento: smartSearchState.avvenimento.descrizione,
                  descrizioneEsito: primoEsito.descrizione,
                  quota,
                  legaturaAAMS,
                  multipla,
                  legaturaMax,
                  legaturaMin,
                  blackListMax,
                  blackListMin,
                  isLive: categoria !== 0,
                  codiceManifestazione,
                  formattedDataAvvenimento,
                  dataAvvenimento: data,
                  siglaDisciplina,
                  siglaManifestazione,
                });
                onSmartSearchStateChange({
                  type: "1",
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                  text: "",
                });
              } else {
                if (primaInfoAggiuntiva.idInfoAggiuntiva === 0) {
                  beep();
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: true },
                  });
                } else {
                  beep();
                  onSmartSearchStateChange({
                    type: "4",
                    subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: true },
                    text,
                    avvenimento: smartSearchState.avvenimento,
                    classeEsito: smartSearchState.classeEsito,
                    infoAggiuntiva: primaInfoAggiuntiva,
                  });
                }
              }
            } else {
              const visualizzaTutti = primaInfoAggiuntiva.esitoList.length === 0;
              beep();
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "risultati", nessunaCorrispondenza: true, visualizzaTutti },
              });
            }
          }

          // fissa infoAggiuntiva o esito da navigazione
          if (
            event.key === "Enter" &&
            !event.ctrlKey &&
            smartSearchState.subtype.type === "navigazione" &&
            infoAggiuntivaEvidenziata
          ) {
            if (smartSearchState.subtype.esitoEvidenziatoIndex === undefined) {
              onSmartSearchStateChange({
                type: "4",
                subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                avvenimento,
                classeEsito,
                infoAggiuntiva: infoAggiuntivaEvidenziata,
                text: "",
              });
            } else {
              if (esitoEvidenziato && getStatoEsito(esitoEvidenziato, infoAggiuntivaEvidenziata) === "aperto") {
                const {
                  codiceEsito,
                  quota,
                  legaturaAAMS,
                  multipla,
                  legaturaMax,
                  legaturaMin,
                  blackListMax,
                  blackListMin,
                  siglaDisciplina,
                  siglaManifestazione,
                } = esitoEvidenziato;
                const {
                  codicePalinsesto,
                  codiceAvvenimento,
                  codiceClasseEsito,
                  codiceScommessa,
                  idInfoAggiuntiva,
                  data,
                } = infoAggiuntivaEvidenziata;
                const {
                  codiceDisciplina,
                  codiceManifestazione,
                  formattedDataAvvenimento,
                  categoria,
                } = smartSearchState.avvenimento;

                onAddEsito({
                  codicePalinsesto,
                  codiceAvvenimento,
                  codiceClasseEsito,
                  codiceScommessa,
                  idInfoAggiuntiva,
                  descrizioneScommessa: primaInfoAggiuntiva.descrizione,
                  codiceDisciplina,
                  codiceEsito,
                  descrizioneAvvenimento: smartSearchState.avvenimento.descrizione,
                  descrizioneEsito: esitoEvidenziato.descrizione,
                  quota,
                  legaturaAAMS,
                  multipla,
                  legaturaMax,
                  legaturaMin,
                  blackListMax,
                  blackListMin,
                  isLive: categoria !== 0,
                  codiceManifestazione,
                  formattedDataAvvenimento,
                  dataAvvenimento: data,
                  siglaDisciplina,
                  siglaManifestazione,
                });
              }
            }
          }

          // torna a passaggio precedente
          if (event.key === "Backspace" && text === "") {
            onSmartSearchStateChange({
              type: "2",
              subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
              text: "",
              avvenimento,
              infoAggiuntivaAccordionToggle: {},
            });
          }

          // passa a navigazione
          if (event.key === "ArrowDown" && smartSearchState.subtype.type !== "navigazione" && primaInfoAggiuntiva) {
            if (isInfoAggiuntivaAccordionOpen(primaInfoAggiuntiva)) {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex: 0, esitoEvidenziatoIndex: 0 },
              });
            } else {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex: 0 },
              });
            }
          }

          // naviga giu
          if (
            event.key === "ArrowDown" &&
            smartSearchState.subtype.type === "navigazione" &&
            infoAggiuntivaEvidenziata
          ) {
            const { infoAggiuntivaEvidenziataIndex, esitoEvidenziatoIndex } = smartSearchState.subtype;
            if (esitoEvidenziatoIndex === undefined) {
              if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaEvidenziata)) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex, esitoEvidenziatoIndex: 0 },
                });
              } else {
                const infoAggiuntivaGiu = infoAggiuntivaList[infoAggiuntivaEvidenziataIndex + 1];
                if (infoAggiuntivaGiu) {
                  if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaGiu)) {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaEvidenziataIndex + 1,
                        esitoEvidenziatoIndex: 0,
                      },
                    });
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaEvidenziataIndex + 1,
                      },
                    });
                  }
                } else {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                  });
                }
              }
            } else {
              const columnsNumber = getListaEsitiDinamicaColumnsNumber(smartSearchState.classeEsito);
              const esitoGiuIndex = esitoEvidenziatoIndex + columnsNumber;
              const esitoGiu = infoAggiuntivaEvidenziata.esitoList[esitoGiuIndex];
              if (esitoGiu) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: {
                    type: "navigazione",
                    infoAggiuntivaEvidenziataIndex,
                    esitoEvidenziatoIndex: esitoGiuIndex,
                  },
                });
              } else {
                const infoAggiuntivaGiuIndex = infoAggiuntivaEvidenziataIndex + 1;
                const infoAggiuntivaGiu = infoAggiuntivaList[infoAggiuntivaGiuIndex];

                const totalEsiti = infoAggiuntivaEvidenziata.esitoList.length;
                const totalRow = Math.ceil(totalEsiti / columnsNumber);
                const islastRow = totalRow === 1 || totalRow === Math.ceil((esitoEvidenziatoIndex + 1) / columnsNumber);

                if (esitoEvidenziatoIndex < infoAggiuntivaEvidenziata.esitoList.length - 1) {
                  if (islastRow) {
                    if (infoAggiuntivaGiu) {
                      if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaGiu)) {
                        onSmartSearchStateChange({
                          ...smartSearchState,
                          subtype: {
                            type: "navigazione",
                            infoAggiuntivaEvidenziataIndex: infoAggiuntivaGiuIndex,
                            esitoEvidenziatoIndex: Math.min(
                              esitoEvidenziatoIndex % columnsNumber,
                              infoAggiuntivaGiu.esitoList.length - 1,
                            ),
                          },
                        });
                      } else {
                        onSmartSearchStateChange({
                          ...smartSearchState,
                          subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex: infoAggiuntivaGiuIndex },
                        });
                      }
                    } else {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                      });
                    }
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        infoAggiuntivaEvidenziataIndex,
                        esitoEvidenziatoIndex: infoAggiuntivaEvidenziata.esitoList.length - 1,
                      },
                    });
                  }
                } else {
                  if (infoAggiuntivaGiu) {
                    if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaGiu)) {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          infoAggiuntivaEvidenziataIndex: infoAggiuntivaGiuIndex,
                          esitoEvidenziatoIndex: Math.min(
                            esitoEvidenziatoIndex % columnsNumber,
                            infoAggiuntivaGiu.esitoList.length - 1,
                          ),
                        },
                      });
                    } else {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex: infoAggiuntivaGiuIndex },
                      });
                    }
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                    });
                  }
                }
              }
            }
          }

          // naviga su
          if (event.key === "ArrowUp" && smartSearchState.subtype.type === "navigazione" && infoAggiuntivaEvidenziata) {
            const { infoAggiuntivaEvidenziataIndex, esitoEvidenziatoIndex } = smartSearchState.subtype;
            const columnsNumber = getListaEsitiDinamicaColumnsNumber(smartSearchState.classeEsito);
            const infoAggiuntivaUpIndex = infoAggiuntivaEvidenziataIndex - 1;
            const infoAggiuntivaUp = infoAggiuntivaList[infoAggiuntivaUpIndex];

            if (esitoEvidenziatoIndex === undefined) {
              // sono in un accordion chiuso
              if (infoAggiuntivaUp) {
                if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaUp)) {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: {
                      type: "navigazione",
                      infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                      esitoEvidenziatoIndex: infoAggiuntivaUp.esitoList.length - 1,
                      // DEBT verificare che esitoEvidenziatoIndex sia corretto
                    },
                  });
                } else {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex },
                  });
                }
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                });
              }
            } else {
              // sono in un esito
              const esitoUpIndex = esitoEvidenziatoIndex - columnsNumber;
              const esitoUp = infoAggiuntivaEvidenziata.esitoList[esitoUpIndex];

              if (esitoUp) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: {
                    type: "navigazione",
                    infoAggiuntivaEvidenziataIndex: infoAggiuntivaEvidenziataIndex,
                    esitoEvidenziatoIndex: esitoUpIndex,
                  },
                });
              } else {
                if (infoAggiuntivaUp) {
                  if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaUp)) {
                    const lastRowIndex =
                      infoAggiuntivaUp.esitoList.length %
                      getListaEsitiDinamicaColumnsNumber(smartSearchState.classeEsito);
                    const columnIndex = esitoEvidenziatoIndex % columnsNumber;
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                        esitoEvidenziatoIndex: Math.min(
                          infoAggiuntivaUp.esitoList.length - lastRowIndex + columnIndex,
                          infoAggiuntivaUp.esitoList.length - 1,
                        ),
                      },
                    });
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex },
                    });
                  }
                } else {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                  });
                }
              }
            }
          }

          // naviga a sinistra
          if (
            event.key === "ArrowLeft" &&
            smartSearchState.subtype.type === "navigazione" &&
            infoAggiuntivaEvidenziata
          ) {
            const { infoAggiuntivaEvidenziataIndex, esitoEvidenziatoIndex } = smartSearchState.subtype;
            if (esitoEvidenziatoIndex !== undefined) {
              if (esitoEvidenziatoIndex === 0) {
                if (infoAggiuntivaEvidenziataIndex === 0) {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                  });
                } else {
                  const infoAggiuntivaLeftIndex = infoAggiuntivaEvidenziataIndex - 1;
                  const infoAggiuntivaLeft = infoAggiuntivaList[infoAggiuntivaLeftIndex];
                  if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaLeft)) {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaLeftIndex,
                        esitoEvidenziatoIndex: infoAggiuntivaLeft.esitoList.length - 1,
                      },
                    });
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex: infoAggiuntivaLeftIndex },
                    });
                  }
                }
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: {
                    type: "navigazione",
                    infoAggiuntivaEvidenziataIndex,
                    esitoEvidenziatoIndex: esitoEvidenziatoIndex - 1,
                  },
                });
              }
            }
          }

          // naviga a destra
          if (
            event.key === "ArrowRight" &&
            smartSearchState.subtype.type === "navigazione" &&
            infoAggiuntivaEvidenziata
          ) {
            const { infoAggiuntivaEvidenziataIndex, esitoEvidenziatoIndex } = smartSearchState.subtype;
            if (esitoEvidenziatoIndex !== undefined) {
              const esitoRightIndex = esitoEvidenziatoIndex + 1;
              if (esitoRightIndex < infoAggiuntivaEvidenziata.esitoList.length) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: {
                    type: "navigazione",
                    infoAggiuntivaEvidenziataIndex,
                    esitoEvidenziatoIndex: esitoRightIndex,
                  },
                });
              } else {
                const infoAggiuntivaRightIndex = infoAggiuntivaEvidenziataIndex + 1;
                const infoAggiuntivaRight = infoAggiuntivaList[infoAggiuntivaRightIndex];
                if (infoAggiuntivaRight) {
                  if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaRight)) {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaRightIndex,
                        esitoEvidenziatoIndex: 0,
                      },
                    });
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex: infoAggiuntivaRightIndex },
                    });
                  }
                } else {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                  });
                }
              }
            }
          }

          // toggle accordion
          if (
            (event.key === " " || event.key === "Spacebar") &&
            smartSearchState.subtype.type === "navigazione" &&
            infoAggiuntivaEvidenziata
          ) {
            const { infoAggiuntivaEvidenziataIndex } = smartSearchState.subtype;
            const chiaveInfoAggiuntiva = makeChiaveInfoAggiuntiva(infoAggiuntivaEvidenziata);
            if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaEvidenziata)) {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex },
                infoAggiuntivaAccordionToggle: {
                  ...infoAggiuntivaAccordionToggle,
                  [chiaveInfoAggiuntiva]: false,
                },
              });
            } else {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", infoAggiuntivaEvidenziataIndex, esitoEvidenziatoIndex: 0 },
                infoAggiuntivaAccordionToggle: {
                  ...infoAggiuntivaAccordionToggle,
                  [chiaveInfoAggiuntiva]: true,
                },
              });
            }
          }

          break;
        }

        case "2": {
          const { classeEsitoList } = smartSearchSuggerimenti;
          const { avvenimento, infoAggiuntivaAccordionToggle } = smartSearchState;
          const primaClasseEsito = classeEsitoList[0];
          const classeEsitoEvidenziata =
            smartSearchState.subtype.type === "navigazione"
              ? classeEsitoList[smartSearchState.subtype.classeEsitoEvidenziataIndex]
              : undefined;
          const infoAggiuntivaEvidenziata =
            smartSearchState.subtype.type === "navigazione" &&
            smartSearchState.subtype.infoAggiuntivaEvidenziataIndex !== undefined
              ? classeEsitoEvidenziata?.infoAggiuntivaList[smartSearchState.subtype.infoAggiuntivaEvidenziataIndex]
              : undefined;
          const esitoEvidenziato =
            smartSearchState.subtype.type === "navigazione" &&
            smartSearchState.subtype.esitoEvidenziatoIndex !== undefined
              ? infoAggiuntivaEvidenziata?.esitoList[smartSearchState.subtype.esitoEvidenziatoIndex]
              : undefined;

          const isInfoAggiuntivaAccordionOpen = (infoAggiuntiva: InfoAggiuntivaSmart) => {
            return (
              infoAggiuntivaAccordionToggle[makeChiaveInfoAggiuntiva(infoAggiuntiva)] ?? smartSearchState.text === ""
            );
          };

          // fisso classe esito con codice completo o esito tramite shortcut
          if (event.key === "Enter" && !event.ctrlKey && inputHasFocus) {
            if (smartSearchSuggerimenti) {
              if (classeEsitoList.length === 0) {
                beep();
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: true, visualizzaTutti: true },
                });
              } else if (
                primaClasseEsito.codiceClasseEsito.toString() === smartSearchState.text ||
                primaClasseEsito.descrizione.toLowerCase() === smartSearchState.text.toLowerCase()
              ) {
                onSmartSearchStateChange({
                  type: "3",
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                  text: "",
                  avvenimento: smartSearchState.avvenimento,
                  classeEsito: primaClasseEsito,
                  infoAggiuntivaAccordionToggle: {},
                });
              } else if (smartSearchSuggerimenti.searchMode === "shortcut") {
                if (
                  smartSearchSuggerimenti.classeEsitoList.length === 1 &&
                  smartSearchSuggerimenti.classeEsitoList[0] &&
                  smartSearchSuggerimenti.classeEsitoList[0].infoAggiuntivaList.length === 1 &&
                  smartSearchSuggerimenti.classeEsitoList[0].infoAggiuntivaList[0] &&
                  smartSearchSuggerimenti.classeEsitoList[0].infoAggiuntivaList[0].esitoList.length === 1 &&
                  smartSearchSuggerimenti.classeEsitoList[0].infoAggiuntivaList[0].esitoList[0]
                ) {
                  const esito = smartSearchSuggerimenti.classeEsitoList[0].infoAggiuntivaList[0].esitoList[0];
                  if (
                    getStatoEsito(esito, smartSearchSuggerimenti.classeEsitoList[0].infoAggiuntivaList[0]) === "aperto"
                  ) {
                    const firstInfoAggiuntiva = smartSearchSuggerimenti.classeEsitoList[0].infoAggiuntivaList[0];
                    onAddEsito({
                      ...esito,
                      codicePalinsesto: avvenimento.codicePalinsesto,
                      codiceAvvenimento: avvenimento.codiceAvvenimento,
                      codiceClasseEsito: firstInfoAggiuntiva.codiceClasseEsito,
                      codiceScommessa: firstInfoAggiuntiva.codiceScommessa,
                      codiceManifestazione: avvenimento.codiceManifestazione,
                      idInfoAggiuntiva: firstInfoAggiuntiva.idInfoAggiuntiva,
                      codiceDisciplina: avvenimento.codiceDisciplina,
                      descrizioneScommessa: firstInfoAggiuntiva.descrizione,
                      descrizioneAvvenimento: avvenimento.descrizione,
                      descrizioneEsito: esito.descrizione,
                      formattedDataAvvenimento: avvenimento.formattedDataAvvenimento,
                    });
                    onSmartSearchStateChange({
                      type: "1",
                      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                      text: "",
                    });
                  } else {
                    if (smartSearchSuggerimenti.classeEsitoList[0].infoAggiuntivaList[0].idInfoAggiuntiva === 0) {
                      beep();
                      onSmartSearchStateChange({
                        type: "3",
                        subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                        text: "",
                        avvenimento: smartSearchState.avvenimento,
                        classeEsito: smartSearchSuggerimenti.classeEsitoList[0],
                        infoAggiuntivaAccordionToggle: {},
                      });
                    } else {
                      beep();
                      onSmartSearchStateChange({
                        type: "4",
                        subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                        text: "",
                        avvenimento: smartSearchState.avvenimento,
                        classeEsito: smartSearchSuggerimenti.classeEsitoList[0],
                        infoAggiuntiva: smartSearchSuggerimenti.classeEsitoList[0].infoAggiuntivaList[0],
                      });
                    }
                  }
                } else {
                  beep();
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "risultati", nessunaCorrispondenza: true, visualizzaTutti: true },
                  });
                }
              } else {
                beep();
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: true, visualizzaTutti: false },
                });
              }
            }
          }

          // fisso classe esito, info aggiuntiva, esito da navigazione
          if (event.key === "Enter" && !event.ctrlKey && smartSearchState.subtype.type === "navigazione") {
            if (esitoEvidenziato && infoAggiuntivaEvidenziata) {
              if (getStatoEsito(esitoEvidenziato, infoAggiuntivaEvidenziata) === "aperto") {
                const {
                  codiceEsito,
                  quota,
                  legaturaAAMS,
                  multipla,
                  legaturaMax,
                  legaturaMin,
                  blackListMax,
                  blackListMin,
                  siglaManifestazione,
                  siglaDisciplina,
                } = esitoEvidenziato;
                const {
                  codicePalinsesto,
                  codiceAvvenimento,
                  codiceClasseEsito,
                  codiceScommessa,
                  idInfoAggiuntiva,
                  data,
                } = infoAggiuntivaEvidenziata;

                const {
                  codiceDisciplina,
                  categoria,
                  codiceManifestazione,
                  formattedDataAvvenimento,
                } = smartSearchState.avvenimento;

                onAddEsito({
                  codicePalinsesto,
                  codiceAvvenimento,
                  codiceClasseEsito,
                  codiceScommessa,
                  idInfoAggiuntiva,
                  codiceEsito,
                  descrizioneScommessa: infoAggiuntivaEvidenziata.descrizione,
                  codiceDisciplina,
                  descrizioneAvvenimento: smartSearchState.avvenimento.descrizione,
                  descrizioneEsito: esitoEvidenziato.descrizione,
                  quota,
                  legaturaAAMS,
                  multipla,
                  legaturaMax,
                  legaturaMin,
                  blackListMax,
                  blackListMin,
                  isLive: categoria !== 0,
                  codiceManifestazione,
                  formattedDataAvvenimento,
                  dataAvvenimento: data,
                  siglaDisciplina,
                  siglaManifestazione,
                });
              }
            } else if (infoAggiuntivaEvidenziata && classeEsitoEvidenziata) {
              onSmartSearchStateChange({
                type: "4",
                subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                avvenimento,
                classeEsito: classeEsitoEvidenziata,
                infoAggiuntiva: infoAggiuntivaEvidenziata,
                text: "",
              });
            } else if (classeEsitoEvidenziata) {
              onSmartSearchStateChange({
                type: "3",
                subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                avvenimento,
                classeEsito: classeEsitoEvidenziata,
                text: "",
                infoAggiuntivaAccordionToggle: {},
              });
            }
          }

          // torna a passaggio precedente
          if (event.key === "Backspace" && text === "") {
            onSmartSearchStateChange({
              type: "1",
              subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
              text: "",
            });
          }

          // passa a navigazione
          if (event.key === "ArrowDown" && smartSearchState.subtype.type !== "navigazione" && primaClasseEsito) {
            const primaInfoAggiuntiva = primaClasseEsito.infoAggiuntivaList[0];
            const infoAggiuntiveAssenti =
              primaClasseEsito.infoAggiuntivaList.length === 1 &&
              primaClasseEsito.infoAggiuntivaList[0].idInfoAggiuntiva === 0;

            if (text === "") {
              if (infoAggiuntiveAssenti || isInfoAggiuntivaAccordionOpen(primaInfoAggiuntiva)) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: {
                    type: "navigazione",
                    classeEsitoEvidenziataIndex: 0,
                    infoAggiuntivaEvidenziataIndex: 0,
                    esitoEvidenziatoIndex: 0,
                  },
                });
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "navigazione", classeEsitoEvidenziataIndex: 0, infoAggiuntivaEvidenziataIndex: 0 },
                });
              }
            } else {
              if (infoAggiuntiveAssenti) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "navigazione", classeEsitoEvidenziataIndex: 0 },
                });
              } else {
                if (isInfoAggiuntivaAccordionOpen(primaInfoAggiuntiva)) {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: {
                      type: "navigazione",
                      classeEsitoEvidenziataIndex: 0,
                      infoAggiuntivaEvidenziataIndex: 0,
                      esitoEvidenziatoIndex: 0,
                    },
                  });
                } else {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "navigazione", classeEsitoEvidenziataIndex: 0, infoAggiuntivaEvidenziataIndex: 0 },
                  });
                }
              }
            }
          }

          // naviga giu
          if (event.key === "ArrowDown" && smartSearchState.subtype.type === "navigazione") {
            const {
              classeEsitoEvidenziataIndex,
              infoAggiuntivaEvidenziataIndex,
              esitoEvidenziatoIndex,
            } = smartSearchState.subtype;

            if (
              infoAggiuntivaEvidenziataIndex !== undefined &&
              esitoEvidenziatoIndex !== undefined &&
              infoAggiuntivaEvidenziata &&
              classeEsitoEvidenziata
            ) {
              const columnsNumber = getListaEsitiDinamicaColumnsNumber(classeEsitoEvidenziata);

              const esitoList = infoAggiuntivaEvidenziata.esitoList;
              const esitoDownIndex = esitoEvidenziatoIndex + columnsNumber;

              const totalEsiti = esitoList.length;
              const totalRow = Math.ceil(totalEsiti / columnsNumber);
              const islastRow = totalRow === 1 || totalRow === Math.ceil((esitoEvidenziatoIndex + 1) / columnsNumber);

              if (esitoDownIndex < esitoList.length) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: {
                    type: "navigazione",
                    classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                    infoAggiuntivaEvidenziataIndex: infoAggiuntivaEvidenziataIndex,
                    esitoEvidenziatoIndex: esitoDownIndex,
                  },
                });
              } else {
                const infoAggiuntivaDownIndex = infoAggiuntivaEvidenziataIndex + 1;
                const infoAggiuntivaDown = classeEsitoEvidenziata.infoAggiuntivaList[infoAggiuntivaDownIndex];

                if (infoAggiuntivaDown) {
                  if (
                    isInfoAggiuntivaAccordionOpen(classeEsitoEvidenziata.infoAggiuntivaList[infoAggiuntivaDownIndex])
                  ) {
                    if (islastRow) {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                          infoAggiuntivaEvidenziataIndex: infoAggiuntivaDownIndex,
                          esitoEvidenziatoIndex: esitoEvidenziatoIndex % columnsNumber,
                        },
                      });
                    } else {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                          infoAggiuntivaEvidenziataIndex: infoAggiuntivaEvidenziataIndex,
                          esitoEvidenziatoIndex: esitoList.length - 1,
                        },
                      });
                    }
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaDownIndex,
                      },
                    });
                  }
                } else {
                  const classeEsitoDownIndex = classeEsitoEvidenziataIndex + 1;
                  const classeEsitoDown = smartSearchSuggerimenti.classeEsitoList[classeEsitoDownIndex];

                  if (classeEsitoDown) {
                    if (islastRow) {
                      const infoAggiuntiveAssentiDown =
                        classeEsitoDown.infoAggiuntivaList.length === 1 &&
                        classeEsitoDown.infoAggiuntivaList[0].idInfoAggiuntiva === 0;
                      const primaInfoAggiuntivaDown = classeEsitoDown.infoAggiuntivaList[0];

                      if (infoAggiuntiveAssentiDown) {
                        if (isInfoAggiuntivaAccordionOpen(primaInfoAggiuntivaDown)) {
                          onSmartSearchStateChange({
                            ...smartSearchState,
                            subtype: {
                              type: "navigazione",
                              classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                              infoAggiuntivaEvidenziataIndex: 0,
                              esitoEvidenziatoIndex: primaInfoAggiuntivaDown.esitoList[
                                esitoEvidenziatoIndex % columnsNumber
                              ]
                                ? esitoEvidenziatoIndex % columnsNumber
                                : primaInfoAggiuntivaDown.esitoList.length - 1,
                            },
                          });
                        } else {
                          onSmartSearchStateChange({
                            ...smartSearchState,
                            subtype: {
                              type: "navigazione",
                              classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                            },
                          });
                        }
                      } else {
                        if (isInfoAggiuntivaAccordionOpen(primaInfoAggiuntivaDown)) {
                          onSmartSearchStateChange({
                            ...smartSearchState,
                            subtype: {
                              type: "navigazione",
                              classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                              infoAggiuntivaEvidenziataIndex: 0,
                              esitoEvidenziatoIndex: primaInfoAggiuntivaDown.esitoList[
                                esitoEvidenziatoIndex % columnsNumber
                              ]
                                ? esitoEvidenziatoIndex % columnsNumber
                                : primaInfoAggiuntivaDown.esitoList.length - 1,
                            },
                          });
                        } else {
                          onSmartSearchStateChange({
                            ...smartSearchState,
                            subtype: {
                              type: "navigazione",
                              classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                              infoAggiuntivaEvidenziataIndex: 0,
                            },
                          });
                        }
                      }
                    } else {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                          infoAggiuntivaEvidenziataIndex: infoAggiuntivaEvidenziataIndex,
                          esitoEvidenziatoIndex: infoAggiuntivaEvidenziata.esitoList.length - 1,
                        },
                      });
                    }
                  } else {
                    const isLastInfoAggiuntiva =
                      infoAggiuntivaEvidenziataIndex === classeEsitoEvidenziata.infoAggiuntivaList.length - 1;

                    if (isLastInfoAggiuntiva && islastRow) {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                      });
                    } else {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                          infoAggiuntivaEvidenziataIndex: infoAggiuntivaEvidenziataIndex,
                          esitoEvidenziatoIndex: esitoList.length - 1,
                        },
                      });
                    }
                  }
                }
              }
            } else if (
              infoAggiuntivaEvidenziataIndex !== undefined &&
              infoAggiuntivaEvidenziata &&
              classeEsitoEvidenziata
            ) {
              const infoAggiuntivaDownIndex = infoAggiuntivaEvidenziataIndex + 1;
              const infoAggiuntivaDown = classeEsitoEvidenziata.infoAggiuntivaList[infoAggiuntivaDownIndex];

              if (infoAggiuntivaDown) {
                if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaDown)) {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: {
                      type: "navigazione",
                      classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                      infoAggiuntivaEvidenziataIndex: infoAggiuntivaDownIndex,
                      esitoEvidenziatoIndex: 0,
                    },
                  });
                } else {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: {
                      type: "navigazione",
                      classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                      infoAggiuntivaEvidenziataIndex: infoAggiuntivaDownIndex,
                    },
                  });
                }
              } else {
                const classeEsitoDownIndex = classeEsitoEvidenziataIndex + 1;
                const classeEsitoDown = smartSearchSuggerimenti.classeEsitoList[classeEsitoDownIndex];
                if (classeEsitoDown) {
                  const primaInfoAggiuntivaDown = classeEsitoDown.infoAggiuntivaList[0];
                  const infoAggiuntiveAssentiDown =
                    classeEsitoDown.infoAggiuntivaList.length === 1 && primaInfoAggiuntivaDown.idInfoAggiuntiva === 0;

                  if (infoAggiuntiveAssentiDown) {
                    if (isInfoAggiuntivaAccordionOpen(primaInfoAggiuntivaDown)) {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                          infoAggiuntivaEvidenziataIndex: 0,
                          esitoEvidenziatoIndex: 0,
                        },
                      });
                    } else {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                        },
                      });
                    }
                  } else {
                    if (isInfoAggiuntivaAccordionOpen(primaInfoAggiuntivaDown)) {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                          infoAggiuntivaEvidenziataIndex: 0,
                          esitoEvidenziatoIndex: 0,
                        },
                      });
                    } else {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                          infoAggiuntivaEvidenziataIndex: 0,
                        },
                      });
                    }
                  }
                } else {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                  });
                }
              }
            } else if (classeEsitoEvidenziata) {
              const classeEsitoDownIndex = classeEsitoEvidenziataIndex + 1;
              const classeEsitoDown = smartSearchSuggerimenti.classeEsitoList[classeEsitoDownIndex];
              if (classeEsitoDown) {
                const primaInfoAggiuntiva = classeEsitoDown.infoAggiuntivaList[0];
                const infoAggiuntiveAssentiDown =
                  classeEsitoDown.infoAggiuntivaList.length === 1 && primaInfoAggiuntiva.idInfoAggiuntiva === 0;

                if (isInfoAggiuntivaAccordionOpen(primaInfoAggiuntiva)) {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: {
                      type: "navigazione",
                      classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                      infoAggiuntivaEvidenziataIndex: 0,
                      esitoEvidenziatoIndex: 0,
                    },
                  });
                } else {
                  if (infoAggiuntiveAssentiDown) {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                      },
                    });
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                        infoAggiuntivaEvidenziataIndex: 0,
                      },
                    });
                  }
                }
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                });
              }
            }
          }

          // naviga su
          if (event.key === "ArrowUp" && smartSearchState.subtype.type === "navigazione") {
            const {
              classeEsitoEvidenziataIndex,
              infoAggiuntivaEvidenziataIndex,
              esitoEvidenziatoIndex,
            } = smartSearchState.subtype;
            if (
              esitoEvidenziatoIndex !== undefined &&
              infoAggiuntivaEvidenziataIndex !== undefined &&
              infoAggiuntivaEvidenziata &&
              classeEsitoEvidenziata
            ) {
              const columnsNumber = getListaEsitiDinamicaColumnsNumber(classeEsitoEvidenziata);
              const columnEvidenziata = esitoEvidenziatoIndex % columnsNumber;
              const esitoUpIndex = esitoEvidenziatoIndex - columnsNumber;
              if (esitoUpIndex >= 0) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: {
                    type: "navigazione",
                    classeEsitoEvidenziataIndex,
                    infoAggiuntivaEvidenziataIndex,
                    esitoEvidenziatoIndex: esitoUpIndex,
                  },
                });
              } else {
                const infoAggiuntivaUpIndex = infoAggiuntivaEvidenziataIndex - 1;
                const infoAggiuntivaUp = classeEsitoEvidenziata.infoAggiuntivaList[infoAggiuntivaUpIndex];
                if (infoAggiuntivaUp) {
                  if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaUp)) {
                    const columnsNumberUp = getListaEsitiDinamicaColumnsNumber(classeEsitoEvidenziata);
                    const lastRowIndex = Math.max(
                      0,
                      Math.trunc(infoAggiuntivaUp.esitoList.length / columnsNumberUp) * columnsNumberUp -
                        columnsNumberUp,
                    );
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        classeEsitoEvidenziataIndex,
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                        esitoEvidenziatoIndex: Math.min(
                          lastRowIndex + columnEvidenziata,
                          infoAggiuntivaUp.esitoList.length - 1,
                        ),
                      },
                    });
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        classeEsitoEvidenziataIndex,
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                      },
                    });
                  }
                } else {
                  const classeEsitoUpIndex = classeEsitoEvidenziataIndex - 1;
                  const classeEsitoUp = classeEsitoList[classeEsitoUpIndex];
                  if (classeEsitoUp) {
                    const infoAggiuntivaUpIndex = classeEsitoUp.infoAggiuntivaList.length - 1;
                    const infoAggiuntivaUp = classeEsitoUp.infoAggiuntivaList[infoAggiuntivaUpIndex];
                    const columnsNumberUp = getListaEsitiDinamicaColumnsNumber(classeEsitoUp);

                    const infoAggiuntiveAssentiUp =
                      classeEsitoUp.infoAggiuntivaList.length === 1 &&
                      classeEsitoUp.infoAggiuntivaList[0].idInfoAggiuntiva === 0;

                    if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaUp)) {
                      const totalEsitiUp = infoAggiuntivaUp.esitoList.length;
                      const offsetUp = (Math.ceil(totalEsitiUp / columnsNumberUp) - 1) * columnsNumberUp;
                      const maxAvailableIndexUp = totalEsitiUp - offsetUp - 1;

                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                          infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                          esitoEvidenziatoIndex:
                            esitoEvidenziatoIndex > maxAvailableIndexUp
                              ? infoAggiuntivaUp.esitoList.length - 1
                              : offsetUp + esitoEvidenziatoIndex,
                        },
                      });
                    } else {
                      if (infoAggiuntiveAssentiUp) {
                        onSmartSearchStateChange({
                          ...smartSearchState,
                          subtype: {
                            type: "navigazione",
                            classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                          },
                        });
                      } else {
                        onSmartSearchStateChange({
                          ...smartSearchState,
                          subtype: {
                            type: "navigazione",
                            classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                            infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                          },
                        });
                      }
                    }
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                    });
                  }
                }
              }
            } else if (
              infoAggiuntivaEvidenziataIndex !== undefined &&
              infoAggiuntivaEvidenziata &&
              classeEsitoEvidenziata
            ) {
              const infoAggiuntivaUpIndex = infoAggiuntivaEvidenziataIndex - 1;
              const infoAggiuntivaUp = classeEsitoEvidenziata.infoAggiuntivaList[infoAggiuntivaUpIndex];
              if (infoAggiuntivaUp) {
                if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaUp)) {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: {
                      type: "navigazione",
                      classeEsitoEvidenziataIndex,
                      infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                      esitoEvidenziatoIndex: infoAggiuntivaUp.esitoList.length - 1,
                    },
                  });
                } else {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: {
                      type: "navigazione",
                      classeEsitoEvidenziataIndex,
                      infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                    },
                  });
                }
              } else {
                const classeEsitoUpIndex = classeEsitoEvidenziataIndex - 1;
                const classeEsitoUp = classeEsitoList[classeEsitoUpIndex];
                if (classeEsitoUp) {
                  const infoAggiuntiveAssentiUp =
                    classeEsitoUp.infoAggiuntivaList.length === 1 &&
                    classeEsitoUp.infoAggiuntivaList[0].idInfoAggiuntiva === 0;
                  const infoAggiuntivaUpIndex = classeEsitoUp.infoAggiuntivaList.length - 1;
                  const infoAggiuntivaUp = classeEsitoUp.infoAggiuntivaList[infoAggiuntivaUpIndex];
                  if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaUp)) {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                        esitoEvidenziatoIndex: infoAggiuntivaUp.esitoList.length - 1,
                      },
                    });
                  } else {
                    if (smartSearchState.text !== "" && infoAggiuntiveAssentiUp) {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                        },
                      });
                    } else {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                          infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                        },
                      });
                    }
                  }
                } else {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                  });
                }
              }
            } else if (classeEsitoEvidenziata) {
              const classeEsitoUpIndex = classeEsitoEvidenziataIndex - 1;
              const classeEsitoUp = classeEsitoList[classeEsitoUpIndex];
              if (classeEsitoUp) {
                const infoAggiuntiveAssentiUp =
                  classeEsitoUp.infoAggiuntivaList.length === 1 &&
                  classeEsitoUp.infoAggiuntivaList[0].idInfoAggiuntiva === 0;
                if (infoAggiuntiveAssentiUp) {
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "navigazione", classeEsitoEvidenziataIndex: classeEsitoUpIndex },
                  });
                } else {
                  const infoAggiuntivaUpIndex = classeEsitoUp.infoAggiuntivaList.length - 1;
                  const infoAggiuntivaUp = classeEsitoUp.infoAggiuntivaList[infoAggiuntivaUpIndex];
                  if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaUp)) {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                        esitoEvidenziatoIndex: infoAggiuntivaUp.esitoList.length - 1,
                      },
                    });
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                      },
                    });
                  }
                }
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                });
              }
            }
          }

          // naviga a sinistra solo se dentro a esito
          if (
            event.key === "ArrowLeft" &&
            smartSearchState.subtype.type === "navigazione" &&
            classeEsitoEvidenziata &&
            infoAggiuntivaEvidenziata
          ) {
            const {
              classeEsitoEvidenziataIndex,
              infoAggiuntivaEvidenziataIndex,
              esitoEvidenziatoIndex,
            } = smartSearchState.subtype;
            if (esitoEvidenziatoIndex !== undefined) {
              if (esitoEvidenziatoIndex === 0) {
                if (infoAggiuntivaEvidenziataIndex === 0) {
                  const classeEsitoUpIndex = classeEsitoEvidenziataIndex - 1;
                  const classeEsitoUp = classeEsitoList[classeEsitoUpIndex];
                  if (classeEsitoUp) {
                    const infoAggiuntivaUpIndex = classeEsitoUp.infoAggiuntivaList.length - 1;
                    const infoAggiuntivaUp = classeEsitoUp.infoAggiuntivaList[infoAggiuntivaUpIndex];
                    const infoAggiuntiveAssentiUp =
                      classeEsitoUp.infoAggiuntivaList.length === 1 &&
                      classeEsitoUp.infoAggiuntivaList[0].idInfoAggiuntiva === 0;
                    if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaUp)) {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                          infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                          esitoEvidenziatoIndex: infoAggiuntivaUp.esitoList.length - 1,
                        },
                      });
                    } else {
                      if (infoAggiuntiveAssentiUp) {
                        onSmartSearchStateChange({
                          ...smartSearchState,
                          subtype: {
                            type: "navigazione",
                            classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                          },
                        });
                      } else {
                        onSmartSearchStateChange({
                          ...smartSearchState,
                          subtype: {
                            type: "navigazione",
                            classeEsitoEvidenziataIndex: classeEsitoUpIndex,
                            infoAggiuntivaEvidenziataIndex: infoAggiuntivaUpIndex,
                          },
                        });
                      }
                    }
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                    });
                  }
                } else {
                  if (infoAggiuntivaEvidenziataIndex) {
                    const infoAggiuntivaLeftIndex = infoAggiuntivaEvidenziataIndex - 1;
                    const infoAggiuntivaLeft = classeEsitoEvidenziata.infoAggiuntivaList[infoAggiuntivaLeftIndex];
                    if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaLeft)) {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                          infoAggiuntivaEvidenziataIndex: infoAggiuntivaLeftIndex,
                          esitoEvidenziatoIndex: infoAggiuntivaLeft.esitoList.length - 1,
                        },
                      });
                    } else {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                          infoAggiuntivaEvidenziataIndex: infoAggiuntivaLeftIndex,
                        },
                      });
                    }
                  }
                }
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: {
                    type: "navigazione",
                    classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                    infoAggiuntivaEvidenziataIndex,
                    esitoEvidenziatoIndex: esitoEvidenziatoIndex - 1,
                  },
                });
              }
            }
          }

          // naviga a destra
          if (
            event.key === "ArrowRight" &&
            smartSearchState.subtype.type === "navigazione" &&
            classeEsitoEvidenziata &&
            infoAggiuntivaEvidenziata &&
            esitoEvidenziato
          ) {
            const {
              classeEsitoEvidenziataIndex,
              infoAggiuntivaEvidenziataIndex,
              esitoEvidenziatoIndex,
            } = smartSearchState.subtype;
            if (esitoEvidenziatoIndex !== undefined) {
              const esitoRightIndex = esitoEvidenziatoIndex + 1;
              if (esitoRightIndex < infoAggiuntivaEvidenziata.esitoList.length) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: {
                    type: "navigazione",
                    classeEsitoEvidenziataIndex,
                    infoAggiuntivaEvidenziataIndex,
                    esitoEvidenziatoIndex: esitoRightIndex,
                  },
                });
              } else if (infoAggiuntivaEvidenziataIndex !== undefined) {
                const infoAggiuntivaDownIndex = infoAggiuntivaEvidenziataIndex + 1;
                const infoAggiuntivaDown = classeEsitoEvidenziata.infoAggiuntivaList[infoAggiuntivaDownIndex];
                if (infoAggiuntivaDown) {
                  if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaDown)) {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        classeEsitoEvidenziataIndex,
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaDownIndex,
                        esitoEvidenziatoIndex: 0,
                      },
                    });
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: {
                        type: "navigazione",
                        classeEsitoEvidenziataIndex: classeEsitoEvidenziataIndex,
                        infoAggiuntivaEvidenziataIndex: infoAggiuntivaDownIndex,
                      },
                    });
                  }
                } else {
                  const classeEsitoDownIndex = classeEsitoEvidenziataIndex + 1;
                  const classeEsitoDown = classeEsitoList[classeEsitoDownIndex];
                  if (classeEsitoDown) {
                    const infoAggiuntiveAssentiDown =
                      classeEsitoDown.infoAggiuntivaList.length === 1 &&
                      classeEsitoDown.infoAggiuntivaList[0].idInfoAggiuntiva === 0;
                    const infoAggiuntivaFirst = classeEsitoDown.infoAggiuntivaList[0];
                    if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaFirst)) {
                      onSmartSearchStateChange({
                        ...smartSearchState,
                        subtype: {
                          type: "navigazione",
                          classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                          infoAggiuntivaEvidenziataIndex: 0,
                          esitoEvidenziatoIndex: 0,
                        },
                      });
                    } else {
                      if (infoAggiuntiveAssentiDown) {
                        onSmartSearchStateChange({
                          ...smartSearchState,
                          subtype: {
                            type: "navigazione",
                            classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                          },
                        });
                      } else {
                        onSmartSearchStateChange({
                          ...smartSearchState,
                          subtype: {
                            type: "navigazione",
                            classeEsitoEvidenziataIndex: classeEsitoDownIndex,
                            infoAggiuntivaEvidenziataIndex: 0,
                          },
                        });
                      }
                    }
                  } else {
                    onSmartSearchStateChange({
                      ...smartSearchState,
                      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                    });
                  }
                }
              }
            }
          }

          // toggle accordion
          if (
            (event.key === " " || event.key === "Spacebar") &&
            smartSearchState.subtype.type === "navigazione" &&
            classeEsitoEvidenziata &&
            infoAggiuntivaEvidenziata
          ) {
            const { classeEsitoEvidenziataIndex, infoAggiuntivaEvidenziataIndex } = smartSearchState.subtype;

            const infoAggiuntiveAssenti =
              classeEsitoEvidenziata.infoAggiuntivaList.length === 1 &&
              classeEsitoEvidenziata.infoAggiuntivaList[0].idInfoAggiuntiva === 0;

            if (!infoAggiuntiveAssenti) {
              const chiaveInfoAggiuntiva = makeChiaveInfoAggiuntiva(infoAggiuntivaEvidenziata);
              if (isInfoAggiuntivaAccordionOpen(infoAggiuntivaEvidenziata)) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "navigazione", classeEsitoEvidenziataIndex, infoAggiuntivaEvidenziataIndex },
                  infoAggiuntivaAccordionToggle: {
                    ...infoAggiuntivaAccordionToggle,
                    [chiaveInfoAggiuntiva]: false,
                  },
                });
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: {
                    type: "navigazione",
                    classeEsitoEvidenziataIndex,
                    infoAggiuntivaEvidenziataIndex,
                    esitoEvidenziatoIndex: 0,
                  },
                  infoAggiuntivaAccordionToggle: {
                    ...infoAggiuntivaAccordionToggle,
                    [chiaveInfoAggiuntiva]: true,
                  },
                });
              }
            }
          }

          break;
        }

        case "1": {
          const { avvenimentoList } = smartSearchSuggerimenti;
          const firstAvvenimento = avvenimentoList[0];

          // fisso avvenimento con codice completo
          if (event.key === "Enter" && !event.ctrlKey && inputHasFocus) {
            const nessunAvvenimentoTrovato = avvenimentoList.length === 0;
            const unSoloAvvenimentoTrovato = avvenimentoList.length === 1;

            if (nessunAvvenimentoTrovato) {
              beep();
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "risultati", nessunaCorrispondenza: true, visualizzaTutti: true },
              });
            } else if (unSoloAvvenimentoTrovato) {
              if (
                avvenimentoList[0].codiceAvvenimento.toString() === smartSearchState.text ||
                avvenimentoList[0].descrizione.toLowerCase() === smartSearchState.text.toLowerCase()
              ) {
                onSmartSearchStateChange({
                  type: "2",
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                  text: "",
                  avvenimento: avvenimentoList[0],
                  infoAggiuntivaAccordionToggle: {},
                });
              } else {
                beep();
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: true, visualizzaTutti: false },
                });
              }
            } else {
              if (
                firstAvvenimento.codiceAvvenimento.toString() === smartSearchState.text ||
                firstAvvenimento.descrizione.toLocaleLowerCase() === smartSearchState.text.toLocaleLowerCase()
              ) {
                if (
                  avvenimentoList.some(
                    (avvenimento) =>
                      (avvenimento.codiceAvvenimento === firstAvvenimento.codiceAvvenimento &&
                        avvenimento.codicePalinsesto !== firstAvvenimento.codicePalinsesto) ||
                      avvenimento.descrizione.toLocaleLowerCase() === smartSearchState.text.toLocaleLowerCase(),
                  )
                ) {
                  beep();
                  // qui dobbiamo comunicare di restingere la ricerca degli avvenimenti al codice completo
                  onSmartSearchStateChange({
                    ...smartSearchState,
                    subtype: { type: "navigazione", avvenimentoEvidenziatoIndex: 0 },
                    soloAvvenimentiConCodiceCompleto: true,
                  });
                } else {
                  onSmartSearchStateChange({
                    type: "2",
                    subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                    text: "",
                    avvenimento: firstAvvenimento,
                    infoAggiuntivaAccordionToggle: {},
                  });
                }
              } else {
                beep();
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: true, visualizzaTutti: false },
                });
              }
            }
          }

          // fissa avvenimento da navigazione
          if (event.key === "Enter" && !event.ctrlKey && smartSearchState.subtype.type === "navigazione") {
            const avvenimento = avvenimentoList[smartSearchState.subtype.avvenimentoEvidenziatoIndex];
            if (avvenimento) {
              onSmartSearchStateChange({
                type: "2",
                subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                text: "",
                avvenimento,
                infoAggiuntivaAccordionToggle: {},
              });
            }
          }

          if (event.key === "Backspace" && text === "") {
            onSmartSearchStateChange({
              ...smartSearchState,
              subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
            });
          }

          // passa a navigazione
          if (event.key === "ArrowDown" && firstAvvenimento && smartSearchState.subtype.type !== "navigazione") {
            onSmartSearchStateChange({
              ...smartSearchState,
              subtype: { type: "navigazione", avvenimentoEvidenziatoIndex: 0 },
            });
          }

          // naviga giu
          if (event.key === "ArrowDown" && smartSearchState.subtype.type === "navigazione") {
            const avvenimentoDownIndex = smartSearchState.subtype.avvenimentoEvidenziatoIndex + 2;
            if (avvenimentoDownIndex < avvenimentoList.length) {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", avvenimentoEvidenziatoIndex: avvenimentoDownIndex },
              });
            } else {
              if (smartSearchState.subtype.avvenimentoEvidenziatoIndex < avvenimentoList.length - 1) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "navigazione", avvenimentoEvidenziatoIndex: avvenimentoList.length - 1 },
                });
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                });
              }
            }
          }

          // naviga su
          if (event.key === "ArrowUp" && smartSearchState.subtype.type === "navigazione") {
            const avvenimentoUpIndex = smartSearchState.subtype.avvenimentoEvidenziatoIndex - 2;
            if (avvenimentoUpIndex >= 0) {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", avvenimentoEvidenziatoIndex: avvenimentoUpIndex },
              });
            } else {
              if (smartSearchState.subtype.avvenimentoEvidenziatoIndex === 1) {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "navigazione", avvenimentoEvidenziatoIndex: 0 },
                });
              } else {
                onSmartSearchStateChange({
                  ...smartSearchState,
                  subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                });
              }
            }
          }

          // naviga a sinistra
          if (event.key === "ArrowLeft" && smartSearchState.subtype.type === "navigazione") {
            const avvenimentoLeftIndex = smartSearchState.subtype.avvenimentoEvidenziatoIndex - 1;
            if (smartSearchState.subtype.avvenimentoEvidenziatoIndex === 0) {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
              });
            } else {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", avvenimentoEvidenziatoIndex: avvenimentoLeftIndex },
              });
            }
            break;
          }

          // naviga a destra
          if (event.key === "ArrowRight" && smartSearchState.subtype.type === "navigazione") {
            const avvenimentoRightIndex = smartSearchState.subtype.avvenimentoEvidenziatoIndex + 1;
            if (smartSearchState.subtype.avvenimentoEvidenziatoIndex === avvenimentoList.length - 1) {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
              });
            } else {
              onSmartSearchStateChange({
                ...smartSearchState,
                subtype: { type: "navigazione", avvenimentoEvidenziatoIndex: avvenimentoRightIndex },
              });
            }
            break;
          }

          break;
        }
      }

      //#endregion smart search
    },
    [
      keyboardNavigationContext,
      sezione,
      smartSearchSuggerimenti,
      smartSearchState,
      smartSearchInputRef,
      onOpenSezioneSport,
      onOpenSezioneLive,
      onOpenSezioneVirtual,
      onOpenSezionePrenotazione,
      onOpenVoucher,
      onSmartSearchStateChange,
      changeActiveClient,
      onSelectFirstPrediction,
      onArrowDownUp,
      longPressPropsIncrease,
      longPressPropDecrease,
      selectInput,
      activeClientId,
      convertFormattedToString,
      openDettaglioAvvenimento,
      deleteEsito,
      onSwitchMultiplaSistema,
      onAddEsito,
    ],
  );
  const keyup = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "Backspace": {
          if (
            smartSearchInputRef.current &&
            smartSearchInputRef.current.value === "" &&
            smartSearchState.type === "1"
          ) {
            // onStateChange({
            //   type: "0",
            //   subtype: { type: "focus" },
            //   text: "",
            // });
          }
          break;
        }
        case "+": {
          if (keyboardNavigationContext.current === "cart") {
            longPressPropsIncrease.onKeyUp(event);
          }
          break;
        }
        case "-": {
          if (keyboardNavigationContext.current === "cart") {
            longPressPropDecrease.onKeyUp(event);
          }
          break;
        }
      }
    },
    [
      keyboardNavigationContext,
      longPressPropDecrease,
      longPressPropsIncrease,
      smartSearchInputRef,
      smartSearchState.type,
    ],
  );
  useLayoutEffect(() => {
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("keyup", keyup);
    };
  }, [keydown, keyup]);
}
