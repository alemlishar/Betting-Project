import React, { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import { StyledButtonGreen } from "src/components/common/disanonima-dialog/CodiceFiscale";
import {
  DisanonimaState,
  getDocumentTypeLabel,
  StyledDisanonimaTitle,
} from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { dateFormatterWithYear } from "src/helpers/format-date";
import { ReactComponent as IconPlusWhite } from "src/assets/images/icon-preno-plus-white.svg";
import styled, { css } from "styled-components/macro";
import { AnagraficaDTO } from "src/components/common/disanonima-dialog/disanonima-dto";
// import { StyledCustomerData, StyledLabel } from "src/components/common/disanonima-dialog/AddDocumentDialog";
import { isExpiredDate } from "src/components/common/disanonima-dialog/utils";

type DocumentRegistrationProps = {
  customerInfo: AnagraficaDTO;
  documentsList: CustomerDocumentInfo[];
  openAddDocumentDialog: () => void;
  onChangeDisanonima: React.Dispatch<React.SetStateAction<DisanonimaState>>;
  isRegisteredUser: boolean;
};

export type CustomerDocumentInfo = {
  tipoDoc: string;
  numDoc: string;
  docDataScad: string;
  docRilasciatoDa: string;
  dataRilascio?: string;
};

export function DocumentRegistration({
  customerInfo,
  documentsList,
  openAddDocumentDialog,
  onChangeDisanonima,
  isRegisteredUser,
}: DocumentRegistrationProps) {
  const { nome, cognome, dataNascita, provinciaNascita, comuneDiNascita, taxCode } = customerInfo;
  const hasDocuments = documentsList.length > 0;
  const [selectedDocument, setSelectedDocument] = useState<CustomerDocumentInfo>();
  const isDisable = selectedDocument === undefined;
  const dateofbirth = new Date(dataNascita);
  const rowsHeight = 80 * documentsList.length + "px";
  const footerHeight = "36px";

  const disableWarning = useCallback(() => {
    onChangeDisanonima((prevState) => ({
      ...prevState,
      alertState: { isVisible: false, message: "", title: "", type: "warning" },
    }));
  }, [onChangeDisanonima]);

  const selectDocument = (document: CustomerDocumentInfo) => {
    const isSamedocument = !!(selectedDocument && selectedDocument.numDoc === document.numDoc);
    setSelectedDocument(!isSamedocument ? document : undefined);
    disableWarning();
  };

  const isDocumentSelected = (document: CustomerDocumentInfo) => {
    return !!(selectedDocument && selectedDocument.numDoc === document.numDoc);
  };
  const goToNextStep = () => {
    onChangeDisanonima((prevState) => {
      return {
        ...prevState,
        selectedDocument: selectedDocument!,
        step: "residenceData",
        alertState: {
          isVisible: isRegisteredUser,
          type: "warning",
          title: (
            <FormattedMessage
              description="Title of warning disanonima alert in document registration"
              defaultMessage="Controllo richiesto"
            />
          ),
          message: (
            <FormattedMessage
              description="Description of warning disanonima alert in document registration"
              defaultMessage="Verifica la corrispondenza dei dati associati al cliente."
            />
          ),
        },
      };
    });
  };

  return (
    <>
      <StyledDisanonimaTitle>
        <FormattedMessage description="Title of document registration step in disanonima" defaultMessage="Documenti" />
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
          <StyledCustomerData style={{ gridRow: "fiscalCode" }}>{taxCode === "" ? "--" : taxCode}</StyledCustomerData>

          <StyledLabel style={{ gridRow: "dateofbirth" }}>
            <FormattedMessage
              description="label of dateofbirth in document registration step"
              defaultMessage="Data di nascita"
            />
          </StyledLabel>
          <StyledCustomerData style={{ gridRow: "dateofbirth" }}>
            {dateFormatterWithYear.format(dateofbirth)}
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
          font-weight: 500;
          color: #333333;
          font-family: Mulish;
          font-size: 1.25rem;
          padding: 15px 50px;
          line-height: 25px;
        `}
      >
        {hasDocuments ? (
          <>
            <FormattedMessage
              description="Selected document message Message"
              defaultMessage="Seleziona un documento dalla seguente lista o aggiungi un nuovo documento"
            />
            <StyledDocumentsGrid>
              <div
                css={css`
                  display: grid;
                  grid-template-columns: [headerDoc] 358px [headerStatus] auto;
                  grid-row: tableHeader;
                  height: 40px;
                  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
                  margin-bottom: 4px;
                  align-items: center;
                `}
              >
                <StyledBoldTitle
                  css={css`
                    grid-column: headerDoc;
                    padding-left: 77px;
                  `}
                >
                  <FormattedMessage
                    description="document header title in document registration step"
                    defaultMessage="Documento"
                  />
                </StyledBoldTitle>
                <StyledBoldTitle
                  css={css`
                    grid-column: headerStatus;
                  `}
                >
                  <FormattedMessage
                    description="state header title in document registration step"
                    defaultMessage="Stato"
                  />
                </StyledBoldTitle>
              </div>

              <div
                css={css`
                  height: 231px;
                  overflow-y: auto;
                  &::-webkit-scrollbar-thumb {
                    opacity: 0.8;
                    border-radius: 7.5px;
                    background-color: #d8d8d8;
                  }
                  &::-webkit-scrollbar {
                    width: 10px;
                    height: 75px;
                  }
                `}
              >
                {documentsList.map((document) => {
                  const documentExpiryDate = new Date(document.docDataScad);
                  const isDocumentExpired = isExpiredDate(documentExpiryDate);

                  return (
                    <div
                      css={css`
                        grid-row: document;
                        display: grid;
                        height: 78px;
                        grid-template-columns: [radioButton] 77px [typeDoc] 280px [docStatus] auto;
                        background: ${isDocumentExpired ? "#f4f4f4" : ""};
                        border-bottom: 2px solid #bbbbbb;
                      `}
                      onClick={() => !isDocumentExpired && selectDocument(document)}
                    >
                      <div
                        css={css`
                          grid-column: radioButton;
                          align-self: center;
                          padding-left: 20px;
                        `}
                      >
                        {!isDocumentExpired && (
                          <StyledRadioButton>
                            {isDocumentSelected(document) && <StyledRadioChecked></StyledRadioChecked>}
                          </StyledRadioButton>
                        )}
                      </div>
                      <div
                        css={css`
                          grid-column: typeDoc;
                          display: grid;
                          grid-template-rows: [docName] auto [docNumber] auto;
                          row-gap: 4px;
                          align-self: center;
                        `}
                      >
                        <StyledLightValue
                          isDocumentExpired={isDocumentExpired}
                          css={css`
                            grid-row: docName;
                            font-weight: 900;
                          `}
                        >
                          {getDocumentTypeLabel(document.tipoDoc)}
                        </StyledLightValue>
                        <StyledLightValue
                          isDocumentExpired={isDocumentExpired}
                          css={css`
                            grid-row: docNumber;
                          `}
                        >
                          {document.numDoc}
                        </StyledLightValue>
                      </div>

                      <div
                        css={css`
                          grid-column: docStatus;
                          display: grid;
                          grid-template-rows: [statusDesc] auto [expires] auto;
                          row-gap: 4px;
                          align-self: center;
                        `}
                      >
                        <StyledExpiredLabel
                          isDocumentExpired={isDocumentExpired}
                          css={css`
                            grid-row: statusDesc;
                            text-transform: none;
                          `}
                        >
                          {isDocumentExpired ? (
                            <FormattedMessage
                              defaultMessage="Scaduto"
                              description="Expired label of document in document registration list"
                            />
                          ) : (
                            <FormattedMessage
                              defaultMessage="In corso di validità"
                              description="Valid label of document in document registration list"
                            />
                          )}
                        </StyledExpiredLabel>
                        <StyledLightValue
                          isDocumentExpired={isDocumentExpired}
                          css={css`
                            grid-row: expires;
                          `}
                        >
                          <FormattedMessage
                            defaultMessage="Scad. {expirydate}"
                            description="Expiry date label and value of document in document registration list"
                            values={{
                              expirydate: dateFormatterWithYear.format(documentExpiryDate),
                            }}
                          />
                        </StyledLightValue>
                      </div>
                    </div>
                  );
                })}
                <div
                  css={css`
                    grid-row: remainingSpace;
                    height: calc(100% - ${rowsHeight} - ${footerHeight});
                    background: #f4f4f4;
                  `}
                ></div>
                <div
                  css={css`
                    grid-row: tableFooter;
                    height: 36px;
                    border-radius: 0 0 5px 5px;
                    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
                    background-color: #fff;
                  `}
                ></div>
              </div>
            </StyledDocumentsGrid>
          </>
        ) : (
          <FormattedMessage
            description="Document attachment Message"
            defaultMessage="Nessun documento disponibile. Aggiungi un nuovo documento per proseguire."
          />
        )}
      </div>

      <div
        css={css`
          font-weight: 400;
          color: #333333;
          font-family: Roboto;
          font-size: 1rem;
          margin: 15px 50px;
          display: flex;
          justify-content: flex-end;
        `}
      >
        <StyledButtonGreen
          css={css`
            width: 253px;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
          onClick={() => {
            openAddDocumentDialog();
            disableWarning();
          }}
          data-qa="document_registration_CTA_add_document"
        >
          <IconPlusWhite
            css={css`
              margin-right: 10px;
            `}
          />
          <FormattedMessage defaultMessage="Aggiungi Documento" description="Add document button label" />
        </StyledButtonGreen>
      </div>

      <div
        css={css`
          position: absolute;
          bottom: 30px;
          right: 50px;
        `}
      >
        <StyledButtonGreen data-qa="document_registration_CTA_avanti" onClick={goToNextStep} disabled={isDisable}>
          <FormattedMessage defaultMessage="Avanti" description="next button in document info step" />
        </StyledButtonGreen>
      </div>
    </>
  );
}

const StyledCustomerContainer = styled.div`
  box-sizing: border-box;
  height: 160px;
  width: 747px;
  border: 3px solid #bbbbbb;
  margin: 30px 50px 15px 50px;
  border-radius: 8px;
  background-color: #ffffff;
`;

const StyledLabel = styled.div`
  color: #333333;
  grid-column: nameLabel;
  font-family: Mulish;
  font-size: 1rem;
  font-weight: 700;
  line-height: 30px;
`;
const StyledCustomerData = styled.div`
  color: #333333;
  font-family: Mulish;
  font-size: 1rem;
  letter-spacing: 0;
  line-height: 30px;
  font-weight: 400;
`;

const StyledDocumentsGrid = styled.div`
  box-sizing: border-box;
  height: 281px;
  margin-top: 30px;
  grid-template-rows: [tableHeader] 40px [document] 78px [remainingSpace] 127px [tableFooter] 36px;
  width: 747px;
  border: 3px solid #bbbbbb;
  border-radius: 8px;
`;

export const StyledRadioButton = styled.div`
  width: 34px;
  height: 34px;
  background-color: #ffffff;
  border-radius: 50%;
  border: 2px solid #444444;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledBoldTitle = styled.div`
  color: #333333;
  font-family: Mulish;
  text-transform: capitalize;
  font-size: 1.125rem;
  font-weight: 900;
  line-height: 22px;
`;

const StyledLightValue = styled.div<{
  isDocumentExpired: boolean;
}>`
  color: #333333;
  font-family: Mulish;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 20px;
  opacity: ${(props) => (props.isDocumentExpired ? "0.5" : "")};
`;

const StyledExpiredLabel = styled.div<{
  isDocumentExpired: boolean;
}>`
  font-family: Mulish;
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 20px;
  color: ${(props) => (props.isDocumentExpired ? "#E72530" : "#AAC21F")};
`;

export const StyledRadioChecked = styled.div`
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background-color: #aac21f;
`;
