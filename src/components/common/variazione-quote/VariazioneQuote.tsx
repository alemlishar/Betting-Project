import React from "react";
import { EventoType } from "src/types/carrello.types";
import styled from "styled-components/macro";
import { VariazioneQuoteList } from "./VariazioneQuoteList";
import { VariazioneQuoteFooter } from "./VariazioneQuoteFooter";
import { AlertBox } from "../alert-box/AlertBox";
import { VenditaOptionalParameters } from "../../../types/vendita.types";
import { FormattedMessage } from "react-intl";

export const VariazioneQuote = ({
  selectedEvents,
  isSistema,
  bet,
  potentialWinning,
  bonusMultipla,
  calculateBonusMultipla,
  sistemaFooterData,
  sistemaIntegrale,
  totQuote,
  dismissVariazioneQuoteModal,
  venditaMultipla,
  venditaSistema,
  setShowChangeQuoteFlag,
}: {
  selectedEvents: EventoType[];
  isSistema: boolean;
  bet: number;
  potentialWinning: number;
  bonusMultipla: number;
  calculateBonusMultipla: (b: number, n: number, e: boolean, s: number, q: number) => void;
  sistemaFooterData: { minWinningAmount: number; maxWinningAmount: number } | undefined;
  sistemaIntegrale: boolean;
  totQuote: number;
  dismissVariazioneQuoteModal: () => void;
  venditaMultipla: (params?: VenditaOptionalParameters) => void;
  venditaSistema: (params?: VenditaOptionalParameters) => void;
  setShowChangeQuoteFlag: (a: boolean) => void;
}) => {
  return (
    <StyledCarrelloModal>
      <StyledCarrelloBody>
        <CustomizeAlertBox>
          <AlertBox
            alertType="warning"
            message={{
              text: (
                <FormattedMessage
                  description="warning quote variate"
                  defaultMessage="Quote variate, accetti le variazioni?"
                />
              ),
            }}
            customStyle={{ fontSize: "16px" }}
          />
        </CustomizeAlertBox>
        <VariazioneQuoteList selectedEvents={selectedEvents} isSistema={isSistema} />
        {selectedEvents.length > 0 && (
          <VariazioneQuoteFooter
            isSistema={isSistema}
            bet={bet}
            potentialWinning={potentialWinning}
            bonusMultipla={bonusMultipla}
            calculateBonusMultipla={calculateBonusMultipla}
            sistemaFooterData={sistemaFooterData}
            sistemaIntegrale={sistemaIntegrale}
            totQuote={totQuote}
            selectedEvents={selectedEvents}
            dismissVariazioneQuoteModal={dismissVariazioneQuoteModal}
            venditaMultipla={venditaMultipla}
            venditaSistema={venditaSistema}
            setShowChangeQuoteFlag={setShowChangeQuoteFlag}
          />
        )}
      </StyledCarrelloBody>
    </StyledCarrelloModal>
  );
};

const StyledCarrelloModal = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  width: 1980px;
  height: 140%;
  min-height: 130%;
  top: -180px;
  left: -1450px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
`;

const StyledCarrelloBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 816px;
  width: 530px;
  background-color: #ffffff;
  justify-content: space-between;
  position: absolute;
  top: 293px;
`;
const CustomizeAlertBox = styled.div`
  position: relative;
  z-index: 1;
  bottom: -22px;
`;
