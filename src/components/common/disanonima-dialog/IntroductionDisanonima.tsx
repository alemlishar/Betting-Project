import React, { useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IconDocument } from "src/assets/images/info-aml-document.svg";
import { StyledButtonGreen } from "src/components/common/disanonima-dialog/CodiceFiscale";
import { DisanonimaState, StyledDisanonimaTitle } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import styled, { css } from "styled-components/macro";
import { StyledButton } from "src/components/prenotazioni/Prenotazione";

type IntroductionDisanonimaProps = {
  onChangeDisanonima: React.Dispatch<React.SetStateAction<DisanonimaState>>;
};

export function IntroductionDisanonima({ onChangeDisanonima }: IntroductionDisanonimaProps) {
  const openCodiceFiscaleStep = useCallback(() => {
    onChangeDisanonima((prevState) => {
      return { ...prevState, step: "codiceFiscale" };
    });
  }, []);
  const { closeBlockingAlertState } = useNavigazioneActions();

  return (
    <>
      <StyledDisanonimaTitle>
        <FormattedMessage description="Title Introduzione of DisanonimaDialog" defaultMessage="Introduzione" />
      </StyledDisanonimaTitle>
      <div
        css={css`
          padding: 30px 50px;
          display: flex;
          justify-content: center;
        `}
      >
        <IconDocument
          css={css`
            width: 373px;
          `}
        />
      </div>
      <div
        css={css`
          padding: 0px 50px;
        `}
      >
        <div
          css={css`
            color: #333333;
            font-family: Mulish;
            font-size: 1.125rem;
            font-weight: 800;
            letter-spacing: 0;
            line-height: 30px;
            margin-bottom: 20px;
          `}
        >
          <FormattedMessage
            description="Introduzione soglia alert info documenti dialog-disanonimazione"
            defaultMessage="Assicurati che il cliente sia in possesso dei seguenti documenti"
          />
        </div>

        <div
          css={css`
            margin-bottom: 20px;
            color: #333333;
            font-family: Mulish;
            font-size: 1.125rem;
            letter-spacing: 0;
            line-height: 23px;
            text-align: left;
          `}
        >
          <div
            css={css`
              margin-bottom: 20px;
            `}
          >
            <StyledDotList />

            <FormattedMessage
              description="introduzione detailsInfo documenti validi"
              defaultMessage="Documento d’identità"
            />
          </div>

          <div
            css={css`
              margin-bottom: 20px;
            `}
          >
            <StyledDotList />
            <FormattedMessage
              description="introduzione detailsInfo  tipo di documento da possedere dialog-disanonimazione"
              defaultMessage="Codice Fiscale/Carta Regionale dei servizi e Titolo di pagamento alternativo ai contanti"
            />
          </div>
          <div>
            <StyledDotList />

            <FormattedMessage
              description="introduzione detailsInfo ricevuta della giocata dialog-disanonimazione"
              defaultMessage="Ricevuta della giocata"
            />
          </div>
        </div>
      </div>

      <div
        css={css`
          position: absolute;
          bottom: 50px;
          right: 50px;
          display: flex;
          justify-content: space-between;
          width: 380px;
        `}
      >
        <StyledButton
          data-qa="add_document_annulla_button"
          css={css`
            background-color: #ffffff;
            width: 180px;
          `}
          onClick={closeBlockingAlertState}
        >
          <FormattedMessage defaultMessage="Annulla" description="chiudi introduzione disanonima Dialog" />
        </StyledButton>

        <StyledButtonGreen onClick={openCodiceFiscaleStep}>
          <FormattedMessage defaultMessage="Procedi" description="procedi button introduzione disanonimazione" />
        </StyledButtonGreen>
      </div>
    </>
  );
}

const StyledDotList = styled.span`
  width: 8px;
  height: 8px;
  margin: 0 10px 0 0;
  box-sizing: border-box;
  border-radius: 20px;
  background-color: #333333;
  display: inline-block;
`;
