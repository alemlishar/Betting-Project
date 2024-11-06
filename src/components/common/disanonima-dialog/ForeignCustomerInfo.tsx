import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { StyledButtonGreen } from "src/components/common/disanonima-dialog/CodiceFiscale";
import { DisanonimaState, StyledDisanonimaTitle } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { SelectGender } from "src/components/common/disanonima-dialog/SelectGender";
import {
  formatDate,
  getReversedDate,
  isDateFormatValid,
  validityDateCheck,
} from "src/components/common/disanonima-dialog/utils";
import styled, { css } from "styled-components/macro";

type ForeignCustomerInfoProps = {
  onChangeDisanonima: React.Dispatch<React.SetStateAction<DisanonimaState>>;
};

type ForeignPersonalInfo = {
  nome: string;
  cognome: string;
  sesso: string;
  dataNascita: string;
  provinciaNascita: string;
  comuneDiNascita: string;
};
const emptyForeignInfo: ForeignPersonalInfo = {
  nome: "",
  cognome: "",
  sesso: "-",
  dataNascita: "",
  provinciaNascita: "",
  comuneDiNascita: "",
};
export function ForeignCustomerInfo({ onChangeDisanonima }: ForeignCustomerInfoProps) {
  const intl = useIntl();
  const [foreignPersonalInfo, setForeignPersonalInfo] = useState<ForeignPersonalInfo>(emptyForeignInfo);
  const [errorDate, setErrorDate] = useState(false);
  const { nome, cognome, sesso, dataNascita, provinciaNascita, comuneDiNascita } = foreignPersonalInfo;
  const isDisable =
    nome === "" ||
    cognome === "" ||
    dataNascita === "" ||
    sesso === "-" ||
    provinciaNascita === "" ||
    dataNascita == "" ||
    comuneDiNascita === "" ||
    errorDate;

  const validityCheck = () => {
    onChangeDisanonima((prevState) => {
      const reversedDate = getReversedDate(foreignPersonalInfo.dataNascita);
      return {
        ...prevState,
        customerInfo: { ...prevState.customerInfo, ...foreignPersonalInfo, dataNascita: reversedDate },
        step: "docRegistration",
      };
    });
  };

  return (
    <>
      <StyledDisanonimaTitle>
        <FormattedMessage description="Title of customer info step in disanonima" defaultMessage="Dati anagrafici" />
      </StyledDisanonimaTitle>
      <div
        css={css`
          display: grid;
          grid-template-columns: [nameLabel] 130px [input] auto;
          grid-template-rows: [customerName] auto [surname] auto [gender] auto [dateofbirth] auto [country] auto [birthplace] auto;
          column-gap: 20px;
          row-gap: 20px;
          padding: 30px 50px;
        `}
      >
        <StyledLabel style={{ gridRow: "customerName" }}>
          <FormattedMessage description="label of name input in foreign customer info step" defaultMessage="Nome" />
        </StyledLabel>
        <StyledInput
          data-qa="foreingn_customer_info_data_name"
          style={{ gridRow: "customerName" }}
          type="text"
          value={nome}
          onKeyDown={(event) => {
            const eventKey = event.key;
            if (eventKey === " ") {
              setForeignPersonalInfo((prevState) => {
                return { ...prevState, nome: prevState.nome.concat(eventKey) };
              });
            }
          }}
          onChange={(event) => {
            const text = event.target.value;
            setForeignPersonalInfo((prevState) => {
              return { ...prevState, nome: text };
            });
          }}
          placeholder={intl.formatMessage({
            defaultMessage: "Inserisci nome",
            description: "placeholder of name input in foreign customer info step ",
          })}
        />

        <StyledLabel style={{ gridRow: "surname" }}>
          <FormattedMessage
            description="label of surname input in foreign customer info step"
            defaultMessage="Cognome"
          />
        </StyledLabel>
        <StyledInput
          data-qa="foreingn_customer_info_data_surname"
          style={{ gridRow: "surname" }}
          type="text"
          value={cognome}
          onKeyDown={(event) => {
            const eventKey = event.key;
            if (eventKey === " ") {
              setForeignPersonalInfo((prevState) => {
                return { ...prevState, cognome: prevState.cognome.concat(eventKey) };
              });
            }
          }}
          onChange={(event) => {
            const text = event.target.value;
            setForeignPersonalInfo((prevState) => {
              return { ...prevState, cognome: text };
            });
          }}
          placeholder={intl.formatMessage({
            defaultMessage: "Inserisci cognome",
            description: "placeholder of surname input in foreign customer info step ",
          })}
        />

        <StyledLabel style={{ gridRow: "gender" }}>
          <FormattedMessage description="label of gender input in foreign customer info step" defaultMessage="Sesso" />
        </StyledLabel>
        <div style={{ gridRow: "gender", width: "128px" }}>
          <SelectGender
            data-qa="foreingn_customer_info_data_sesso"
            value={sesso}
            onChange={(selectedGender) => {
              setForeignPersonalInfo((prevState) => {
                return { ...prevState, sesso: selectedGender };
              });
            }}
          ></SelectGender>
        </div>
        <StyledLabel style={{ gridRow: "dateofbirth" }}>
          <FormattedMessage
            description="label of dateofbirth input in foreign customer info step"
            defaultMessage="Data di nascita"
          />
        </StyledLabel>
        <div
          css={css`
            grid-row: dateofbirth;
            grid-column: input;
          `}
        >
          <StyledInput
            data-qa="foreingn_customer_info_data_di_nascita"
            hasError={errorDate}
            style={{ width: "175px" }}
            value={dataNascita}
            maxLength={10}
            onChange={(event) => {
              const text = event.target.value;

              const formatText = formatDate(text);

              if (isDateFormatValid(formatText)) {
                setForeignPersonalInfo((prevState) => {
                  return {
                    ...prevState,
                    dataNascita: formatDate(text),
                  };
                });
                formatText.length >= 10 && setErrorDate(!validityDateCheck(text));
              }
            }}
            onBlur={() => {
              setErrorDate(!validityDateCheck(dataNascita));
            }}
          />
          {errorDate && (
            <div
              css={css`
                color: #e72530;
                font-family: Roboto;
                font-size: 14px;
                letter-spacing: 0;
                line-height: 14px;
                margin-top: 3px;
              `}
            >
              <FormattedMessage
                defaultMessage="Data non valida"
                description="label errore invalid data  in customer info"
              />
            </div>
          )}
        </div>

        <StyledLabel style={{ gridRow: "country" }}>
          <FormattedMessage
            description="label of nationality input in foreign customer info step"
            defaultMessage="Nazionalità"
          />
        </StyledLabel>
        <StyledInput
          data-qa="foreingn_customer_info_data_di_nazionalità"
          style={{ gridRow: "country" }}
          value={provinciaNascita}
          placeholder={intl.formatMessage({
            description: "placeholder of nationality input in foreign customer info step",
            defaultMessage: "Inserisci nazionalità",
          })}
          onKeyDown={(event) => {
            const eventKey = event.key;
            if (eventKey === " ") {
              setForeignPersonalInfo((prevState) => {
                return { ...prevState, provinciaNascita: prevState.provinciaNascita.concat(eventKey) };
              });
            }
          }}
          onChange={(event) => {
            const text = event.target.value;
            setForeignPersonalInfo((prevState) => {
              return { ...prevState, provinciaNascita: text };
            });
          }}
        />

        <StyledLabel style={{ gridRow: "birthplace" }}>
          <FormattedMessage
            description="label of birthplace input in foreign customer info step"
            defaultMessage="Luogo di nascita"
          />
        </StyledLabel>
        <StyledInput
          data-qa="foreingn_customer_info_data_di_luogo"
          style={{ gridRow: "birthplace" }}
          value={comuneDiNascita}
          placeholder={intl.formatMessage({
            description: "placeholder of birthplace input in foreign customer info step",
            defaultMessage: "Inserisci luogo di nascita",
          })}
          onKeyDown={(event) => {
            const eventKey = event.key;
            if (eventKey === " ") {
              setForeignPersonalInfo((prevState) => {
                return { ...prevState, comuneDiNascita: prevState.comuneDiNascita.concat(eventKey) };
              });
            }
          }}
          onChange={(event) => {
            const text = event.target.value;
            setForeignPersonalInfo((prevState) => {
              return { ...prevState, comuneDiNascita: text };
            });
          }}
        />
      </div>
      <div
        css={css`
          position: absolute;
          bottom: 50px;
          right: 50px;
        `}
      >
        <StyledButtonGreen onClick={validityCheck} disabled={isDisable}>
          <FormattedMessage
            data-qa="foreingn_customer_info_CTA_avanti"
            defaultMessage="Avanti"
            description="avanti button in personal data step"
          />
        </StyledButtonGreen>
      </div>
    </>
  );
}

const StyledLabel = styled.div`
  grid-column: nameLabel;
  align-self: center;
  font-weight: 400;
  color: #333333;
  font-family: Roboto;
  font-size: 1.125rem;
  line-height: 21.5px;
  height: 60px;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{
  hasError?: boolean;
}>`
  box-sizing: border-box;
  grid-column: input;
  height: 60px;
  font-size: 1.125rem;
  font-weight: 700;
  padding-left: 28px;
  width: 597px;
  border-radius: 8px;
  border: ${(props) => (props.hasError ? " 4px solid #E31C21" : " 2px solid #979797")};

  &::placeholder {
    opacity: 0.2;
    color: #444444;
    font-family: Roboto;
    font-size: 1rem;
    font-style: italic;
    font-weight: 300;
    line-height: 20px;
  }
  &:focus {
    height: 56px;
    outline: none;
    border: 4px solid #aac21f;
  }
`;
