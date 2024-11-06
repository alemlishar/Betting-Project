import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IcoImpostazioni } from "src/assets/images/ico_impostazioni.svg";
import { ImpostazioniInformazioni } from "src/components/carrello/impostazioni-scommessa/impostazioni-informazioni/impostazioniInformazioni";
import { ImpostazioniPredefinite } from "src/components/carrello/impostazioni-scommessa/impostazioni-predefinite/impostazioniPredefinite";
import { ImpostazioniPuntata } from "src/components/carrello/impostazioni-scommessa/impostazioni-puntata/impostazioniPuntata";
import { ImpostazioniQuote } from "src/components/carrello/impostazioni-scommessa/impostazioni-quota/impostazioniQuote";
import { postUserPreferences } from "src/components/carrello/impostazioni-scommessa/user-preferences-api";
import { useCartClientsContext } from "src/components/common/context-clients/ClientsContext";
import { ImpostazioniScommessaType } from "src/types/carrello.types";
import styled from "styled-components/macro";
import useSWR, { mutate } from "swr";

export const ImpostazioniScommessa = ({
  isOptionActive,
  setOptionActive,
  isChange,
  triggerChange,
  setIsChange,
  activeClient,
  valuePredefinita,
  setValuePredefinita,
  updateClientImpostazioni,
  updateAllClientsImpostazioni,
  isDefaultSettingsChange,
  setIsDefaultSettingsChange,
  setTriggerChange,
}: {
  isOptionActive: boolean;
  triggerChange: boolean;
  setOptionActive: (activeOption: boolean) => void;
  setIsChange: (e: boolean) => void;
  setTriggerChange: (i: boolean) => void;
  isChange: boolean;
  valuePredefinita: boolean;
  setValuePredefinita: (e: boolean) => void;
  activeClient: number;
  updateClientImpostazioni: (e: Array<ImpostazioniScommessaType>) => void;
  updateAllClientsImpostazioni: (e: Array<ImpostazioniScommessaType>) => void;
  isDefaultSettingsChange: boolean | undefined;
  setIsDefaultSettingsChange: (b: boolean | undefined) => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const clients = useCartClientsContext();
  const [impostazioniDiQuote, setImpostazioniDiQuote] = useState(clients[activeClient].impostazioniScommessa[0].share);
  const [impostazioniDiPuntata, setImpostazioniDiPuntata] = useState(
    clients[activeClient].impostazioniScommessa[0].bet,
  );

  useEffect(() => {
    setImpostazioniDiQuote(clients[activeClient].impostazioniScommessa[0].share);
    setImpostazioniDiPuntata(clients[activeClient].impostazioniScommessa[0].bet);
  }, [clients, activeClient, triggerChange]);

  const impostazioniScommessa: Array<ImpostazioniScommessaType> = [
    {
      share: impostazioniDiQuote,
      bet: impostazioniDiPuntata,
    },
  ];

  const useOutsideClick = (ref: any, callback: () => void) => {
    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target) && isOptionActive === true) {
        callback();
      }
    };
    useEffect(() => {
      if (isOptionActive) {
        const onKeyDown = (e: KeyboardEvent) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
          }
          if (e.key === "Escape" && isOptionActive) {
            callback();
          }
        };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("click", handleClick, false);
        return () => {
          document.removeEventListener("keydown", onKeyDown);
          document.removeEventListener("click", handleClick, false);
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOptionActive]);
  };

  useOutsideClick(ref, () => {
    if (!isOptionActive) {
      setTriggerChange(true);
    } else {
      setTriggerChange(false);
    }
    setIsChange(false);
    setOptionActive(false);
  });

  /**
   * TODO: subscribe ApiService with swr
   * need a lot of time to test
   *
   * SALVATAGGIO NUOVE IMPOSTAZIONI
   */

  const [settingsToSend, setSettingsToSend] = useState<ImpostazioniScommessaType>();
  const { data: updateClientPreferences } = useSWR(settingsToSend ? [settingsToSend] : null, postUserPreferences);
  const saveImpostazioni = () => {
    if (valuePredefinita) {
      setSettingsToSend({ bet: impostazioniScommessa[0].bet ? 1 : 0, share: impostazioniScommessa[0].share });
      if (updateClientPreferences) {
        if (updateClientPreferences.error) {
          setIsDefaultSettingsChange(false);
        } else if (updateClientPreferences.result) {
          mutate("userDefaultPreferences");
          updateAllClientsImpostazioni(impostazioniScommessa);
          setIsDefaultSettingsChange(true);
        }
      } else {
        setIsDefaultSettingsChange(false);
      }
    } else {
      updateClientImpostazioni(impostazioniScommessa);
      setIsDefaultSettingsChange(true);
    }
    setOptionActive(false);
  };

  const closeDialog = (event: any) => {
    if (event.target === event.currentTarget) {
      setOptionActive(false);
    }
  };
  useEffect(() => {
    //TODO chiedere per quanto tempo lo devo visualizzare
    if (isDefaultSettingsChange !== undefined) {
      const timer = setTimeout(() => {
        setIsDefaultSettingsChange(undefined);
      }, 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDefaultSettingsChange]);

  return (
    <>
      {isOptionActive && (
        <StyledOverlayContainer ref={ref} onClick={closeDialog}>
          <StyledOverlay>
            <StyledOverlayHeader className="arrow_box">
              <StyledIcoCircle>
                <IcoImpostazioni />
              </StyledIcoCircle>
              <StyledTitleOverlay>
                <FormattedMessage
                  defaultMessage="IMPOSTAZIONI DI SCOMMESSA"
                  description="label principale delle opzioni carrello"
                />
              </StyledTitleOverlay>
            </StyledOverlayHeader>
            <StyledOverlayBody>
              <InformationBox onClick={() => setExpanded(!expanded)}>
                <ImpostazioniInformazioni expanded={expanded} />
              </InformationBox>
              <ImpostazioniQuote
                expanded={expanded}
                setIsChange={setIsChange}
                impostazioniDiQuote={impostazioniDiQuote}
                setImpostazioniDiQuote={setImpostazioniDiQuote}
              />
              <ImpostazioniPuntata
                expanded={expanded}
                setIsChange={setIsChange}
                impostazioniDiPuntata={impostazioniDiPuntata}
                setImpostazioniDiPuntata={setImpostazioniDiPuntata}
              />
              <ImpostazioniPredefinite
                setValuePredefinita={setValuePredefinita}
                expanded={expanded}
                isChange={isChange}
              />
              <StyledOverlayButton disabled={!isChange} onClick={() => saveImpostazioni()}>
                <FormattedMessage
                  defaultMessage="Salva impostazioni"
                  description="label salvataggio opzioni carrello"
                />
              </StyledOverlayButton>
            </StyledOverlayBody>
          </StyledOverlay>
        </StyledOverlayContainer>
      )}
    </>
  );
};

const StyledOverlayContainer = styled.div`
  position: absolute;
  background-color: #ffffff;
  z-index: 1;
  width: 100%;
  height: 765px;

  display: flex;
`;
const StyledOverlay = styled.div`
  background: white;
  /* width: 510px;
  height: 746px; */
  margin: 10px;
  box-shadow: 0 1px 20px 0 rgba(0, 0, 0, 0.52);
  z-index: 1;
`;
const StyledOverlayHeader = styled.div`
  display: flex;
  align-items: center;
  &.arrow_box {
    position: relative;
    background: #005936;
    height: 50px;
  }
  &.arrow_box:after {
    bottom: 100%;
    right: 25px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: rgba(136, 183, 213, 0);
    border-bottom-color: #005936;
    border-width: 9px;
  }
`;
const StyledIcoCircle = styled.div`
  svg {
    height: 35px;
    width: auto;
    margin-left: 20px;
  }
`;
const StyledTitleOverlay = styled.div`
  height: 26px;
  width: 282px;
  color: #ffffff;
  font-family: Mulish;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 26px;
  margin-right: 164px;
  right: 0px;
  position: absolute;
`;
const StyledOverlayBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  height: 655px;
`;

const InformationBox = styled.div`
  font-size: 16px;
  display: flex;
  min-height: 59px;
  width: 100%;
  border-radius: 8px;
  background-color: #f4f4f4;
  flex-direction: column;
`;

const StyledOverlayButton = styled.button`
  box-sizing: border-box;
  cursor: pointer;
  height: 50px;
  width: 470px;
  border: 2px solid #005936;
  border-radius: 7px;
  background-color: #005936;
  color: #ffffff;
  font-family: Mulish;
  font-size: 18px;
  font-weight: 800;
  line-height: 23px;
  text-align: center;
  margin-top: 30px;
  &:disabled {
    cursor: default;
  }
`;
