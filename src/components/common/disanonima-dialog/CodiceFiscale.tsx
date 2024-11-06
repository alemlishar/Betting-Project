import React, { useCallback, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IconCodiceFiscale } from "src/assets/images/icon-codice-fiscale.svg";
import { getCustomerInfo, getSagInfo } from "src/components/common/disanonima-dialog/disanonima-api";
import { DisanonimaState, StyledDisanonimaTitle } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { SelectNationality, SelectNationalityMemo } from "src/components/common/disanonima-dialog/NationalitySelect";
import { ReactComponent as IcoDangerBlack } from "src/assets/images/icon-danger.svg";
import { ReactComponent as IconCheck } from "src/assets/images/ico_check_on.svg";
import styled, { css } from "styled-components/macro";
import { mutate } from "swr";
import { StyledButton } from "src/components/prenotazioni/Prenotazione";
import { CustomerInfoDTO, SagInfoDTO } from "src/components/common/disanonima-dialog/disanonima-dto";
import { isExpiredDate } from "src/components/common/disanonima-dialog/utils";

type CodiceFiscaleDisanonimaProps = {
  onChangeDisanonima: React.Dispatch<React.SetStateAction<DisanonimaState>>;
};

export function CodiceFiscaleDisanonima({ onChangeDisanonima }: CodiceFiscaleDisanonimaProps) {
  const inputCodiceFiscaleRef = useRef<HTMLInputElement | null>(null);

  const [inputCodiceFiscaleState, setInputCodiceFiscaleState] = useState({
    isInvalid: false,
    isActive: false,
    text: "",
  });
  const [nationalitySelectInput, setNationalitySelectInput] = useState<SelectNationality>(0);
  const [checkBoxForeignFiscalCode, setCheckBoxForeignFiscalCode] = useState(false);
  const inputError = inputCodiceFiscaleState.isInvalid;
  const isForeignNationality = nationalitySelectInput === 1;

  const isDisable = isForeignNationality
    ? !checkBoxForeignFiscalCode
    : inputError || inputCodiceFiscaleState.text.length < 16;

  const regex = /(^[a-zA-Z]{0,6}$)/;
  const regexData = /(^[a-zA-Z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{0,2}$)|(^[a-zA-Z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[a-tA-T]{0,1}$)|(^[a-zA-Z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[a-tA-T]{1}[0-9lmnpqrstuvLMNPQRSTUV]{0,2}$)/;
  const regexLuogo = /(^[a-zA-Z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[a-tA-T]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[a-zA-Z][0-9lmnpqrstuvLMNPQRSTUV]{0,3}$)/;
  const regexCharControl = /(^[a-zA-Z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[a-tA-T]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[a-zA-Z][0-9lmnpqrstuvLMNPQRSTUV]{3}[a-zA-Z]{0,1}$)/;

  const invalidCodiceInput = (codeBiglietto: string) => {
    return (
      codeBiglietto.length > 0 &&
      !(
        regex.test(codeBiglietto) ||
        regexData.test(codeBiglietto) ||
        regexLuogo.test(codeBiglietto) ||
        regexCharControl.test(codeBiglietto)
      )
    );
  };

  const setNationalitySelect = useCallback(
    (nationality: SelectNationality) => {
      setCheckBoxForeignFiscalCode(false);
      setNationalitySelectInput(nationality);
    },
    [setNationalitySelectInput],
  );

  const changeCheckBoxForeignFiscalCode = () => {
    return setCheckBoxForeignFiscalCode(!checkBoxForeignFiscalCode);
  };

  const openDatiAnagraficiStep = useCallback(async () => {
    if (checkBoxForeignFiscalCode) {
      onChangeDisanonima((prevState) => {
        return {
          ...prevState,
          step: "foreignCustomerInfo",
        };
      });
      setCheckBoxForeignFiscalCode(false);
    } else {
      const customerInfo: CustomerInfoDTO = await mutate(
        "customerInfo",
        getCustomerInfo(inputCodiceFiscaleState.text.toUpperCase()),
      );

      if (customerInfo && customerInfo.anagrafica) {
        onChangeDisanonima((prevState) => {
          const { numDoc, tipoDoc, docDataScad, docRilasciatoDa } = customerInfo.anagrafica; //TODO da rimuovere quando riceveremo nella response la lista dei documenti
          const documentExpiryDate = new Date(docDataScad);
          const isDocumentExpired = isExpiredDate(documentExpiryDate);
          return {
            ...prevState,
            fiscalCode: inputCodiceFiscaleState.text,
            step: "docRegistration",
            customerInfo: customerInfo.anagrafica,
            //TODO: da sostituire con la lista dei documenti della response, quando la riceveremo
            documentsList:
              numDoc && tipoDoc && docDataScad && docRilasciatoDa
                ? [{ numDoc, tipoDoc, docDataScad, docRilasciatoDa, dataRilascio: "" }]
                : [],
            isRegisteredUser: true,
            alertState: {
              isVisible: !isDocumentExpired,
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
      } else {
        const sagInfo: SagInfoDTO = await mutate("sagInfo", getSagInfo(inputCodiceFiscaleState.text.toUpperCase()));
        onChangeDisanonima((prevState) => {
          return {
            ...prevState,
            fiscalCode: inputCodiceFiscaleState.text,
            step: "customerInfo",
            customerInfo: {
              ...prevState.customerInfo,
              taxCode: inputCodiceFiscaleState.text,
              ...sagInfo,
              provinciaNascita: sagInfo.provinciaDiNascita,
            },
          };
        });
      }
    }
  }, [inputCodiceFiscaleState, checkBoxForeignFiscalCode]);

  return (
    <>
      <StyledDisanonimaTitle>
        <FormattedMessage description="Title of fiscal code step in disanonima" defaultMessage="Codice Fiscale" />
      </StyledDisanonimaTitle>
      <div
        css={css`
          display: grid;
          grid-template-columns: [description] 354px [icon] auto;
          column-gap: 20px;
          padding: 30px 50px 0;
        `}
      >
        <div
          css={css`
            grid-column: description;
            color: #333333;
            font-family: Mulish;
            font-size: 1rem;
            align-self: center;
          `}
        >
          <div
            css={css`
              font-weight: 800;
              line-height: 30px;
              padding-bottom: 20px;
            `}
          >
            <FormattedMessage description="Title of fiscal code step" defaultMessage="Scansione del codice fiscale" />
          </div>
          <div
            css={css`
              line-height: 23px;
              font-weight: 400;
            `}
          >
            <FormattedMessage
              description="Description of fiscal code step"
              defaultMessage="Puoi acquisire il codice effettuando una scansione del tesserino o inserirlo manualmente nell’apposito campo"
            />
          </div>
        </div>
        <IconCodiceFiscale
          css={css`
            width: 373px;
            grid-column: icon;
          `}
        />
      </div>

      <div
        css={css`
          display: grid;
          grid-template-columns: [label] auto [input] 597px;
          grid-template-rows: [nationality] auto [codiceFiscale] auto;
          column-gap: 20px;
          row-gap: ${isForeignNationality ? "0" : "20px"};
          padding: 30px 50px;
        `}
      >
        <div
          css={css`
            grid-row: nationality;
            grid-column: label;
            align-self: center;
            font-weight: 400;
            color: #333333;
            font-family: Roboto;
            font-size: 1rem;
            line-height: 21.5px;
          `}
        >
          <FormattedMessage
            description="Label of nationality input"
            defaultMessage="Nazionalità <br></br> cliente"
            values={{
              b: (chunks: string) => (
                <span
                  css={css`
                    font-weight: 400;
                    color: #333333;
                    font-size: 16px;
                  `}
                >
                  {chunks}
                </span>
              ),
              br: () => <br />,
            }}
          />
        </div>
        <div
          css={css`
            grid-column: input;
          `}
        >
          <SelectNationalityMemo value={nationalitySelectInput} onChange={setNationalitySelect} />
        </div>

        {!isForeignNationality && (
          <div
            css={css`
              grid-row: codiceFiscale;
              grid-column: label;
              align-self: center;
              font-weight: 400;
              color: #333333;
              font-family: Roboto;
              font-size: 1rem;
              line-height: 21.5px;
            `}
          >
            <FormattedMessage description="Label of fiscal code input" defaultMessage="Codice Fiscale" />
          </div>
        )}
        {!isForeignNationality && (
          <StyledCodiceInputContainer
            isActive={inputCodiceFiscaleState.isActive}
            hasError={inputError}
            css={css`
              grid-row: codiceFiscale;
              grid-column: input;
            `}
          >
            <StyledCodiceInput
              type="text"
              ref={inputCodiceFiscaleRef}
              placeholder="Inserisci il codice"
              value={inputCodiceFiscaleState.text}
              onChange={(event) => {
                const text = event.target.value;
                setInputCodiceFiscaleState({
                  ...inputCodiceFiscaleState,
                  text,
                  isInvalid: invalidCodiceInput(text),
                });
                event.currentTarget.maxLength = 16;
              }}
              onBlur={() => {
                setInputCodiceFiscaleState({
                  ...inputCodiceFiscaleState,
                  isActive: false,
                });
              }}
              onFocus={() => {
                setInputCodiceFiscaleState({
                  ...inputCodiceFiscaleState,
                  isActive: true,
                });
              }}
            />
          </StyledCodiceInputContainer>
        )}
        {inputCodiceFiscaleState.isInvalid && (
          <div
            css={css`
              grid-column: input;
              color: #e72530;
              font-family: Roboto;
              font-size: 0.875rem;
              font-weight: 500;
              line-height: 14px;
              margin-top: -15px;
            `}
          >
            {inputCodiceFiscaleState.isInvalid ? (
              <FormattedMessage description="codice fiscale non corretto" defaultMessage="Codice non corretto" />
            ) : (
              ""
            )}
          </div>
        )}
      </div>

      {isForeignNationality && (
        <div
          css={css`
            box-sizing: border-box;
            height: 177px;
            width: 747px;
            padding: 22px 20px;
            border: 3px solid #bbbbbb;
            margin: 0 50px 30px;
            border-radius: 8px;
            background-color: #ffffff;
          `}
        >
          <div
            css={css`
              display: grid;
              grid-template-columns: [icon-alert] 25px [title] auto;
              grid-column-gap: 11px;
              align-items: center;
              padding-bottom: 25px;
            `}
          >
            <IcoDangerBlack style={{ gridRow: `head`, gridColumn: `icon-alert`, height: `25px`, width: `25px` }} />
            <div
              css={css`
                grid-column: title;
                grid-row: head;
                color: #333333;
                font-family: Mulish;
                font-size: 1.375rem;
                font-weight: 700;
                line-height: 27px;
              `}
            >
              <FormattedMessage
                description="title of checkbox in foreign fiscal code"
                defaultMessage="Richiesta di conferma"
              />
            </div>
          </div>
          <StyledCheckBox>
            <StyledCheckBoxInput
              type="checkbox"
              id="foreignCheckbox"
              name="foreignCheckbox"
              value="foreignCheckbox"
              onClick={changeCheckBoxForeignFiscalCode}
            />
            {checkBoxForeignFiscalCode && <IconCheck />}
            <div
              css={css`
                grid-column: label;
                color: #333333;
                font-family: Mulish;
                font-size: 1.125rem;
                line-height: 30px;
                font-weight: 400;
              `}
            >
              <FormattedMessage
                description="description of checkbox in foreign fiscal code"
                defaultMessage="Confermo che il cliente è straniero e mi assumo la responsabilità normativa che il cliente non è cittadino italiano e non gli è stato attribuito un codice fiscale."
              />
            </div>
          </StyledCheckBox>
        </div>
      )}

      <div
        css={css`
          position: absolute;
          bottom: 50px;
          right: 50px;
        `}
      >
        <StyledButtonGreen disabled={isDisable} onClick={openDatiAnagraficiStep}>
          <FormattedMessage defaultMessage="Avanti" description="avanti button in fiscal code step" />
        </StyledButtonGreen>
      </div>
    </>
  );
}

const StyledCodiceInput = styled.input`
  caret-color: #aac21f;
  box-sizing: border-box;
  height: 60px;
  border: none;
  font-size: 1rem;
  outline: none;
  padding: 0;
  margin-left: 28px;

  &:focus {
    height: 56px;
  }

  &::placeholder {
    opacity: 0.2;
    color: #444444;
    font-family: Roboto;
    font-size: 1rem;
    font-style: italic;
    font-weight: 300;
    line-height: 20px;
  }
`;

const StyledCodiceInputContainer = styled.div<{
  isActive: boolean;
  hasError: boolean;
}>`
  border-radius: 8px;
  width: 593px;
  border: ${(props) =>
    props.hasError
      ? " 4px solid #E31C21"
      : props.isActive && !props.hasError
      ? " 4px solid #aac21f"
      : " 2px solid #979797"};
`;

const StyledCheckBox = styled.div`
  display: grid;
  grid-template-columns: [checkbox] 40px [label] 640px;
  grid-column-gap: 20px;
  align-items: center;
  svg {
    position: absolute;
    height: auto;
    z-index: 1;
    width: 35px;
    margin: 25px 7px;
  }
`;

const StyledCheckBoxInput = styled.input`
  &[type="checkbox"] {
    appearance: none;
    grid-column: checkbox;
    box-sizing: border-box;
    z-index: 2;
    height: 40px;
    width: 40px;
    border: 2px solid #222222;
    border-radius: 9px;
    &:focus {
      outline: none;
    }
  }
`;

export const StyledButtonGreen = styled(StyledButton)`
  color: #fff;
  background-color: #005936;
  width: 180px;
  &:disabled {
    opacity: 0.5;
  }
`;
