import React, { useCallback, useState } from "react";
import { FormattedMessage } from "react-intl";
import { StyledDialogContainer } from "src/components/common/full-screen-alert/StyledDialogContainer";
import { ReactComponent as IconFingerPrint } from "src/assets/images/icon-fingerprint-white.svg";
import styled, { css } from "styled-components/macro";
import { IntroductionDisanonima } from "src/components/common/disanonima-dialog/IntroductionDisanonima";
import { CodiceFiscaleDisanonima } from "src/components/common/disanonima-dialog/CodiceFiscale";
import { CustomerInfo } from "src/components/common/disanonima-dialog/CustomerInfo";
import {
  CustomerDocumentInfo,
  DocumentRegistration,
} from "src/components/common/disanonima-dialog/DocumentRegistration";
import { AnagraficaDTO } from "src/components/common/disanonima-dialog/disanonima-dto";
import { AddDocumentDialog, emptyDocument } from "src/components/common/disanonima-dialog/AddDocumentDialog";
import { DisanonimaAlert } from "src/components/common/disanonima-dialog/DisanonimaAlert";
import { ForeignCustomerInfo } from "src/components/common/disanonima-dialog/ForeignCustomerInfo";
import configuration from "src/helpers/configuration";
import { ResidenceData } from "src/components/common/disanonima-dialog/ResidenceData";
import { PrivacyData } from "src/components/common/disanonima-dialog/PrivacyData";
import { PaymentOptions } from "src/components/common/disanonima-dialog/PaymentOptions";

export type AlertState = {
  isVisible: boolean;
  type: string;
  title: React.ReactNode;
  message: React.ReactNode;
};

export type DisanonimaState = {
  step: DisanonimaStep;
  fiscalCode: string;
  customerInfo: AnagraficaDTO;
  alertState: AlertState;
  documentsList: CustomerDocumentInfo[];
  selectedDocument: CustomerDocumentInfo;
  isRegisteredUser: boolean;
};

const defaultCustomer: AnagraficaDTO = {
  autorizzazioneTrattamentoDatiPersonali: "N",
  capDomiciliazione: "",
  codZona: "",
  cognome: "",
  comuneDiNascita: "",
  comuneDomiciliazione: "",
  comuneDomicilio: "",
  comuneResidenza: "",
  consensoScopiPromozionali: "N",
  dataNascita: "",
  docDataScad: "",
  docRilasciatoDa: "",
  email: "",
  flagResDomDiversi: "N",
  iban: "",
  idCard: "",
  idCg: "",
  idTransaction: "",
  indirizzoDomiciliazione: "",
  indirizzoDomicilio: "",
  indirizzoResidenza: "",
  listaPep: "1",
  loyalty: false,
  nazionalita: "",
  nome: "",
  numDoc: "",
  provinciaDomicilio: "",
  provinciaNascita: "",
  provinciaResidenza: "",
  pv: "",
  rice: "",
  sesso: "",
  taxCode: "",
  telefono: "",
  tipoDoc: "",
};

export const getDocumentTypeLabel = (documentType: string) => {
  switch (documentType) {
    case configuration.DISANONIMADOCUMENTTYPE.CARTA_IDENTITA:
      return (
        <FormattedMessage
          description="Identity card description in disanonima dialog"
          defaultMessage="Carta d'Identità"
        />
      );
    case configuration.DISANONIMADOCUMENTTYPE.PATENTE:
      return (
        <FormattedMessage description="Driving license description in disanonima dialog" defaultMessage="Patente" />
      );
    case configuration.DISANONIMADOCUMENTTYPE.PASSAPORTO:
      return <FormattedMessage description="Passaport description in disanonima dialog" defaultMessage="Passaporto" />;
    default:
      return documentType;
  }
};

type DisanonimaProps = {
  totalAmount: number;
  ticketId?: string;
};

export function DisanonimaDialog({ totalAmount, ticketId }: DisanonimaProps) {
  const [disanonimaState, setDisanonimaState] = useState<DisanonimaState>({
    step: "introduction",
    fiscalCode: "",
    customerInfo: defaultCustomer,
    alertState: {
      isVisible: false,
      type: "",
      title: "",
      message: "",
    },
    documentsList: [],
    selectedDocument: emptyDocument,
    isRegisteredUser: false,
  });
  const [addDocument, setAddDocument] = useState(false);

  const { title, type, message, isVisible } = disanonimaState.alertState;

  const openDialogAddDocument = useCallback(() => {
    setAddDocument(true);
  }, [setAddDocument]);

  return (
    <StyledDialogContainer>
      <div
        css={css`
          display: grid;
          grid-template-rows: [alert]76px [modalDisanonima]auto;
          grid-row-gap: 20px;
        `}
      >
        <div
          css={css`
            grid-row: alert;
          `}
        >
          {isVisible && <DisanonimaAlert type={type} title={title} message={message} />}
        </div>
        <div
          css={css`
            grid-row: modalDisanonima;
          `}
        >
          <StyledDialogHeader>
            <div
              css={css`
                grid-column: iconHeader;
                padding-left: 50px;
              `}
            >
              <IconFingerPrint />
            </div>

            <div
              css={css`
                grid-column: titleHeader;
              `}
            >
              <FormattedMessage description="Title of DisanonimaModal" defaultMessage="Disanonimazione" />
            </div>
          </StyledDialogHeader>
          <div
            css={css`
              position: relative;
              display: grid;
              grid-template-columns: [progressBar] 278px [body] auto;
            `}
          >
            <div
              css={css`
                grid-column: progressBar;
                background-color: #f4f4f4;
                border-radius: 0 0 0 12px;
              `}
            ></div>
            <StyledDialogBody>
              {(() => {
                switch (disanonimaState?.step) {
                  case "introduction":
                    return <IntroductionDisanonima onChangeDisanonima={setDisanonimaState} />;
                  case "codiceFiscale":
                    return <CodiceFiscaleDisanonima onChangeDisanonima={setDisanonimaState} />;
                  case "customerInfo":
                    return (
                      <CustomerInfo
                        customerInfo={disanonimaState.customerInfo}
                        onChangeDisanonima={setDisanonimaState}
                      />
                    );
                  case "foreignCustomerInfo":
                    return <ForeignCustomerInfo onChangeDisanonima={setDisanonimaState} />;
                  case "docRegistration":
                    return (
                      <DocumentRegistration
                        customerInfo={disanonimaState.customerInfo}
                        onChangeDisanonima={setDisanonimaState}
                        openAddDocumentDialog={openDialogAddDocument}
                        documentsList={disanonimaState.documentsList}
                        isRegisteredUser={disanonimaState.isRegisteredUser}
                      />
                    );
                  case "residenceData":
                    return (
                      <ResidenceData
                        customerInfo={disanonimaState.customerInfo}
                        onChangeDisanonima={setDisanonimaState}
                        isRegisteredUser={disanonimaState.isRegisteredUser}
                      />
                    );
                  case "privacyData":
                    return (
                      <PrivacyData
                        customerInfo={disanonimaState.customerInfo}
                        onChangeDisanonima={setDisanonimaState}
                      />
                    );
                  case "paymentOptions":
                    return (
                      <PaymentOptions
                        customerInfo={disanonimaState.customerInfo}
                        totalAmount={totalAmount}
                        ticketId={ticketId}
                        onChangeDisanonima={setDisanonimaState}
                      />
                    );
                }
              })()}
            </StyledDialogBody>
            {addDocument && (
              <AddDocumentDialog
                customerInfo={disanonimaState.customerInfo}
                onChangeDisanonima={setDisanonimaState}
                closeAddDocumentDialog={() => {
                  setAddDocument(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </StyledDialogContainer>
  );
}

export const StyledDisanonimaTitle = styled.div`
  color: #333333;
  font-family: Mulish;
  font-size: 1.875rem;
  letter-spacing: 0;
  line-height: 38px;
  padding-left: 50px;
  font-weight: 800;
  margin-top: 30px; //50px;
`;

const StyledDialogHeader = styled.div`
  height: 128px;
  display: grid;
  width: 1125px;
  grid-template-columns: [iconHeader] min-content [titleHeader] auto;
  grid-column-gap: 30px;
  align-items: center;
  border-radius: 12px 12px 0 0;
  background-color: #333333;
  position: relative;
  color: #ffffff;
  font-family: Mulish;
  font-size: 1.875rem;
  letter-spacing: 0;
  line-height: 28px;
`;

const StyledDialogBody = styled.div`
  position: relative;
  grid-column: body;
  height: 832px;
  width: 847px;
  background-color: #ffffff;
  /* padding-top: 50px; */
  border-radius: 0 0 12px 0;
`;

export type DisanonimaStep =
  | "introduction"
  | "codiceFiscale"
  | "customerInfo"
  | "docRegistration"
  | "foreignCustomerInfo"
  | "residenceData"
  | "privacyData"
  | "paymentOptions";
