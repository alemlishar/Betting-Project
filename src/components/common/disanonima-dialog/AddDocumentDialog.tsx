import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AnagraficaDTO } from "src/components/common/disanonima-dialog/disanonima-dto";
import { DisanonimaState, StyledDisanonimaTitle } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { CustomerDocumentInfo } from "src/components/common/disanonima-dialog/DocumentRegistration";
import { SelectDocument, SelectDocumentType } from "src/components/common/disanonima-dialog/SelectTipoDocumento";
import {
  existDate,
  expirationDateCheck,
  formatDate,
  getReversedDate,
  isDateFormatValid,
  validityDateCheck,
} from "src/components/common/disanonima-dialog/utils";
import { StyledDialogContainer } from "src/components/common/full-screen-alert/StyledDialogContainer";
import { StyledButton } from "src/components/prenotazioni/Prenotazione";
import { dateFormatterWithYear } from "src/helpers/format-date";
import styled, { css } from "styled-components/macro";

type AddDocumentDialogType = {
  customerInfo: AnagraficaDTO;
  onChangeDisanonima: React.Dispatch<React.SetStateAction<DisanonimaState>>;
  closeAddDocumentDialog: () => void;
};

export const emptyDocument: CustomerDocumentInfo = {
  tipoDoc: "SELEZIONA",
  numDoc: "",
  docRilasciatoDa: "",
  dataRilascio: "",
  docDataScad: "",
};

export const AddDocumentDialog = ({
  customerInfo,
  onChangeDisanonima,
  closeAddDocumentDialog,
}: AddDocumentDialogType) => {
  const intl = useIntl();
  const { nome, cognome, dataNascita, provinciaNascita, comuneDiNascita, taxCode } = customerInfo;
  const date = new Date(dataNascita);
  const [newDocument, setNewDcoument] = useState<CustomerDocumentInfo>(emptyDocument);
  const [hasExpired, setHasExpired] = useState(false);
  const [errorDate, setErrorDate] = useState({ dataRilascio: false, docDataScad: false });

  const isDisabled =
    newDocument.tipoDoc === "SELEZIONA" ||
    newDocument.numDoc === "" ||
    newDocument.docRilasciatoDa === "" ||
    newDocument.dataRilascio === "" ||
    newDocument.dataRilascio!.length < 10 ||
    newDocument.docDataScad === "" ||
    newDocument.docDataScad.length < 10 ||
    errorDate.dataRilascio ||
    errorDate.docDataScad ||
    hasExpired;

  const saveDocument = () => {
    const newDocumentUpdated = {
      ...newDocument,
      dataRilascio: getReversedDate(newDocument.dataRilascio!),
      docDataScad: getReversedDate(newDocument.docDataScad),
    };

    onChangeDisanonima((prevState) => {
      return { ...prevState, documentsList: [newDocumentUpdated, ...prevState.documentsList] };
    });

    closeAddDocumentDialog();
  };

  return (
    <StyledDialogContainer style={{ height: "100%" }}>
      <StyledDialogBody>
        <StyledDisanonimaTitle>
          <FormattedMessage
            description="Title of add document registration step in disanonima"
            defaultMessage="Aggiunta Documento"
          />
        </StyledDisanonimaTitle>
        <StyledCustomerContainer>
          <div
            css={css`
              display: grid;
              grid-template-columns: [nameLabel] 170px [customerData] auto;
              grid-template-rows: [customerName] auto [fiscalCode] auto [dateofbirth] auto [birthPlace] auto;
              column-gap: 20px;
              padding: 20px;
            `}
          >
            <StyledLabel style={{ gridRow: "customerName" }}>
              <FormattedMessage
                description="label of name in document registration step"
                defaultMessage="Nome e Cognome"
              />
            </StyledLabel>
            <StyledCustomerData style={{ gridRow: "customerName", textTransform: "capitalize" }}>
              {nome.toLowerCase()} {cognome.toLowerCase()}
            </StyledCustomerData>

            <StyledLabel style={{ gridRow: "fiscalCode" }}>
              <FormattedMessage
                description="label of fiscal code in document registration step"
                defaultMessage="Codice fiscale"
              />
            </StyledLabel>
            <StyledCustomerData style={{ gridRow: "fiscalCode" }}>{taxCode}</StyledCustomerData>

            <StyledLabel style={{ gridRow: "dateofbirth" }}>
              <FormattedMessage
                description="label of dateofbirth in document registration step"
                defaultMessage="Data di nascita"
              />
            </StyledLabel>
            <StyledCustomerData style={{ gridRow: "dateofbirth" }}>
              {dateFormatterWithYear.format(date)}
            </StyledCustomerData>

            <StyledLabel style={{ gridRow: "birthPlace" }}>
              <FormattedMessage
                description="label of birthPlace in document registration step"
                defaultMessage="Luogo di nascita"
              />
            </StyledLabel>
            <StyledCustomerData style={{ gridRow: "birthPlace", textTransform: "capitalize" }}>
              {comuneDiNascita.toLowerCase()}, {provinciaNascita}
            </StyledCustomerData>
          </div>
        </StyledCustomerContainer>

        <div
          css={css`
            display: grid;
            grid-template-columns: [nameLabel] 130px [input] auto;
            grid-template-rows: [document] auto [documentNumber] auto [enteDocument] auto;
            column-gap: 20px;
            row-gap: 20px;

            padding: 15px 50px;
          `}
        >
          <StyledLabel style={{ gridRow: "document" }}>
            <FormattedMessage
              description="label of Tipo Documento input in add document step"
              defaultMessage="Tipo Documento"
            />
          </StyledLabel>
          <div style={{ gridRow: "document", gridColumn: "input" }}>
            <SelectDocument
              data-qa="add_document_type_document"
              document={newDocument.tipoDoc}
              onChange={(selectedDocument: SelectDocumentType) => {
                setNewDcoument((prevState) => {
                  return { ...prevState, tipoDoc: selectedDocument };
                });
              }}
            />
          </div>

          <StyledLabel style={{ gridRow: "documentNumber" }}>
            <FormattedMessage
              description="label of document number input in add document info step"
              defaultMessage="Numero Documento"
            />
          </StyledLabel>
          <StyledInputContainer style={{ gridRow: "documentNumber" }}>
            <StyledInput
              type="text"
              data-qa="add_document_num_doc"
              placeholder={intl.formatMessage({
                defaultMessage: "Inserisci numero del documento",
                description: "Labal inpun of  document number input in add document info step ",
              })}
              value={newDocument.numDoc}
              onKeyDown={(event) => {
                const eventKey = event.key;
                if (eventKey === " ") {
                  setNewDcoument((prevState) => {
                    return { ...prevState, numDoc: prevState.numDoc.concat(eventKey) };
                  });
                }
              }}
              onChange={(event) => {
                const text = event.target.value;
                setNewDcoument((prevState) => {
                  return { ...prevState, numDoc: text };
                });
              }}
            />
          </StyledInputContainer>

          <StyledLabel style={{ gridRow: "enteDocument" }}>
            <FormattedMessage
              description="label of ente input in add document info step"
              defaultMessage="Ente di rilascio"
            />
          </StyledLabel>
          <StyledInputContainer style={{ gridRow: "enteDocument" }}>
            <StyledInput
              data-qa="add_document_ente_rilascio"
              placeholder={intl.formatMessage({
                defaultMessage: "Inserisci ente di rilascio",
                description: "Labal input of  ente input in add document info step ",
              })}
              value={newDocument.docRilasciatoDa}
              onKeyDown={(event) => {
                const eventKey = event.key;
                if (eventKey === " ") {
                  setNewDcoument((prevState) => {
                    return { ...prevState, docRilasciatoDa: prevState.docRilasciatoDa.concat(eventKey) };
                  });
                }
              }}
              onChange={(event) => {
                const text = event.target.value;
                setNewDcoument((prevState) => {
                  return { ...prevState, docRilasciatoDa: text };
                });
              }}
            />
          </StyledInputContainer>
        </div>
        <div
          css={css`
            display: grid;
            grid-template-columns: [dataRilascioLabel] 130px [ dataRilascioInput] 175px [dataScadenzaLabel] 130px [ dataScadenzaInput] auto;
            grid-template-rows: [date] auto [error] auto;
            column-gap: 20px;
            row-gap: 2px;
            padding: 5px 50px;
          `}
        >
          <StyledLabel style={{ gridColumn: "dataRilascioLabel" }}>
            <FormattedMessage
              description="label of data di rilascio input in add document info step"
              defaultMessage="Data di rilascio"
            />
          </StyledLabel>
          <StyledInputContainer hasError={errorDate.dataRilascio} style={{ gridColumn: "dataRilascioInput" }}>
            <StyledInput
              data-qa="add_document_data_rilascio"
              value={newDocument.dataRilascio}
              maxLength={10}
              onChange={(event) => {
                const text = event.target.value;
                const formatText = formatDate(text);

                if (isDateFormatValid(formatText)) {
                  setNewDcoument((prevState) => {
                    return { ...prevState, dataRilascio: formatText };
                  });
                  formatText.length >= 10 &&
                    setErrorDate((prevState) => ({ ...prevState, dataRilascio: !validityDateCheck(formatText) }));
                }
              }}
              onBlur={() => {
                setErrorDate((prevState) => ({
                  ...prevState,
                  dataRilascio: !validityDateCheck(newDocument.dataRilascio!),
                }));
              }}
            />
          </StyledInputContainer>
          {errorDate.dataRilascio && (
            <div
              css={css`
                color: #e72530;
                font-family: Roboto;
                font-size: 14px;
                letter-spacing: 0;
                line-height: 14px;
                grid-column: dataRilascioInput;
                grid-row: error;
              `}
            >
              <FormattedMessage
                defaultMessage="Data non valida"
                description="label errore invalid documento scaduto in aggiungi documento"
                values={{
                  br: () => {
                    return <br />;
                  },
                }}
              />
            </div>
          )}

          <StyledLabel style={{ gridColumn: "dataScadenzaLabel" }}>
            <FormattedMessage
              description="label of Scadenza Documento input in add document info step"
              defaultMessage="Scadenza Documento"
            />
          </StyledLabel>
          <StyledInputContainer
            hasError={hasExpired || errorDate.docDataScad}
            style={{ gridColumn: "dataScadenzaInput" }}
          >
            <StyledInput
              data-qa="add_document_data_scadenza"
              value={newDocument.docDataScad}
              maxLength={10}
              onChange={(event) => {
                const text = event.target.value;
                const formatText = formatDate(text);

                if (isDateFormatValid(formatText)) {
                  setNewDcoument((prevState) => {
                    return { ...prevState, docDataScad: formatText };
                  });
                  if (formatText.length === 10) {
                    setHasExpired(expirationDateCheck(formatText));

                    setErrorDate((prevState) => ({ ...prevState, docDataScad: !existDate(formatText) }));
                  }
                }
              }}
              onBlur={() => {
                if (newDocument.docDataScad.length < 10) {
                  setErrorDate((prevState) => ({ ...prevState, docDataScad: newDocument.docDataScad.length > 0 }));
                }
              }}
            />
          </StyledInputContainer>
          {hasExpired ? (
            <div
              css={css`
                color: #e72530;
                font-family: Roboto;
                font-size: 14px;
                letter-spacing: 0;
                line-height: 14px;
                grid-column: dataScadenzaInput;
                grid-row: error;
              `}
            >
              <FormattedMessage
                defaultMessage="Documento scaduto"
                description="label errore documento scaduto in aggiungi documento"
              />
            </div>
          ) : (
            errorDate.docDataScad && (
              <div
                css={css`
                  color: #e72530;
                  font-family: Roboto;
                  font-size: 14px;
                  letter-spacing: 0;
                  line-height: 14px;
                  grid-column: dataScadenzaInput;
                  grid-row: error;
                `}
              >
                <FormattedMessage
                  defaultMessage="Data non valida"
                  description="label errore data sbagliata documento scaduto in aggiungi documento"
                  values={{
                    br: () => {
                      return <br />;
                    },
                  }}
                />
              </div>
            )
          )}
        </div>
        <div
          css={css`
            position: absolute;
            bottom: 30px;
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
            onClick={closeAddDocumentDialog}
          >
            <FormattedMessage defaultMessage="Annulla" description="prev button in add document info step" />
          </StyledButton>
          <StyledButtonGreen
            data-qa="add_document_aggiungi_button"
            css={css`
              width: 180px;
            `}
            disabled={isDisabled}
            onClick={saveDocument}
          >
            <FormattedMessage defaultMessage="Aggiungi" description="add button in add document info step" />
          </StyledButtonGreen>
        </div>
      </StyledDialogBody>
    </StyledDialogContainer>
  );
};

const StyledDialogBody = styled.div`
  position: absolute;
  height: 802px;
  width: 787px;
  background-color: #ffffff;
  top: 0;
  right: 30px;
  border-radius: 0 0 12px 12px;
`;

export const StyledLabel = styled.div`
  color: #333333;
  grid-column: nameLabel;
  font-family: Mulish;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 30px;
  display: flex;
  align-items: center;
`;

export const StyledCustomerData = styled.div`
  color: #333333;
  font-family: Mulish;
  font-size: 1rem;
  letter-spacing: 0;
  //font-weight: 700;
  line-height: 30px;
`;

export const StyledCustomerContainer = styled.div`
  box-sizing: border-box;
  height: 160px;
  width: 687px;
  border: 3px solid #bbbbbb;
  margin: 30px 50px 15px 50px;
  border-radius: 8px;
  background-color: #ffffff;
`;

export const StyledButtonGreen = styled(StyledButton)`
  color: #fff;
  background-color: #005936;
  min-width: 180px;
  &:disabled {
    opacity: 0.5;
  }
`;

const StyledInput = styled.input`
  width: 90%;

  font-size: 1.125rem;
  color: #444444;
  font-family: Roboto;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 20px;

  border: none;
  outline: none;
  &::-webkit-inner-spin-button {
    display: none;
    -webkit-appearance: none;
  }
  &::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }

  &::placeholder {
    opacity: 0.2;
    color: #444444;
    font-family: Roboto;

    font-style: italic;
    font-weight: 300;
    line-height: 20px;
  }
`;
const StyledInputContainer = styled.div<{
  hasError?: boolean;
}>`
  box-sizing: border-box;
  grid-column: input;
  border: ${(props) => (props.hasError ? "4px solid #E72530" : " 2px solid #979797")};
  border-radius: 8px;
  width: 100%;
  padding-left: 30px;

  &:focus-within {
    border: ${(props) => (props.hasError ? "4px solid #E72530" : " 4px solid #aac21f")};

    ${StyledInput} {
      height: 56px;
    }
  }
  ${StyledInput} {
    height: ${(props) => (props.hasError ? "56px" : "60px")};
  }
`;
