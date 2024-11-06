import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { StyledButtonGreen } from "src/components/common/disanonima-dialog/CodiceFiscale";
import { AnagraficaDTO } from "src/components/common/disanonima-dialog/disanonima-dto";
import { DisanonimaState, StyledDisanonimaTitle } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import {
  formatDate,
  getReversedDate,
  isDateFormatValid,
  validityDateCheck,
} from "src/components/common/disanonima-dialog/utils";
import styled, { css } from "styled-components/macro";

type CustomerInfoProps = {
  onChangeDisanonima: React.Dispatch<React.SetStateAction<DisanonimaState>>;
  customerInfo: AnagraficaDTO;
};

type PersonalInfo = {
  nome: string;
  cognome: string;
  dataNascita: string;
};

export function CustomerInfo({ onChangeDisanonima, customerInfo }: CustomerInfoProps) {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ nome: "", cognome: "", dataNascita: "" });
  const [errorDate, setErrorDate] = useState(false);
  const isDisable =
    personalInfo.nome === "" || personalInfo.cognome === "" || personalInfo.dataNascita === "" || errorDate;

  const validityCheck = () => {
    onChangeDisanonima((prevState) => {
      const reversedDate = getReversedDate(personalInfo.dataNascita);
      return {
        ...prevState,
        customerInfo: { ...prevState.customerInfo, ...personalInfo, dataNascita: reversedDate },
        step: "docRegistration",
      };
    });

    // if (isInvalidNome || isInvalidCognome) {
    //   onChangeDisanonima((prevState) => {
    //     return {
    //       ...prevState,
    //       alertState: {
    //         isVisible: true,
    //         type: "danger",
    //         title: (
    //           <FormattedMessage
    //             description="Title of danger disanonima alert"
    //             defaultMessage="Dati anagrafici non validi"
    //           />
    //         ),
    //         message: (
    //           <FormattedMessage
    //             description="Title of danger disanonima alert"
    //             defaultMessage="I dati anagrafici immessi non corrispondono al Codice Fiscale inserito."
    //           />
    //         ),
    //       },
    //     };
    //   });
    // }
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
          <FormattedMessage description="label of name input in customer info step" defaultMessage="Nome" />
        </StyledLabel>
        <StyledInput
          data-qa="customer_info_nome"
          style={{ gridRow: "customerName" }}
          type="text"
          value={personalInfo.nome}
          onKeyDown={(event) => {
            const eventKey = event.key;
            if (eventKey === " ") {
              setPersonalInfo((prevState) => {
                return { ...prevState, nome: prevState.nome.concat(eventKey) };
              });
            }
          }}
          onChange={(event) => {
            const text = event.target.value;
            setPersonalInfo((prevState) => {
              return { ...prevState, nome: text };
            });
          }}
          placeholder="Inserisci nome"
        />

        <StyledLabel style={{ gridRow: "surname" }}>
          <FormattedMessage description="label of surname input in customer info step" defaultMessage="Cognome" />
        </StyledLabel>
        <StyledInput
          data-qa="customer_info_cognome"
          style={{ gridRow: "surname" }}
          type="text"
          value={personalInfo.cognome}
          onKeyDown={(event) => {
            const eventKey = event.key;
            if (eventKey === " ") {
              setPersonalInfo((prevState) => {
                return { ...prevState, cognome: prevState.cognome.concat(eventKey) };
              });
            }
          }}
          onChange={(event) => {
            const text = event.target.value;
            setPersonalInfo((prevState) => {
              return { ...prevState, cognome: text };
            });
          }}
          placeholder="Inserisci cognome"
        />

        <StyledLabel style={{ gridRow: "gender" }}>
          <FormattedMessage description="label of gender input in customer info step" defaultMessage="Sesso" />
        </StyledLabel>
        <StyledStaticInfo style={{ gridRow: "gender", width: "128px" }}>
          <span
            css={css`
              padding-left: 30px;
            `}
          >
            {customerInfo.sesso}
          </span>
        </StyledStaticInfo>
        <StyledLabel style={{ gridRow: "dateofbirth" }}>
          <FormattedMessage
            description="label of dateofbirth input in customer info step"
            defaultMessage="Data di nascita"
          />
        </StyledLabel>
        <div
          css={css`
            grid-column: input;
            grid-row: dateofbirth;
          `}
        >
          <StyledInput
            data-qa="customer_info_data_di_nascita"
            hasError={errorDate}
            style={{ width: "175px" }}
            value={personalInfo.dataNascita}
            maxLength={10}
            onChange={(event) => {
              const text = event.target.value;

              const formatText = formatDate(text);

              if (isDateFormatValid(formatText)) {
                setPersonalInfo((prevState) => {
                  return {
                    ...prevState,
                    dataNascita: formatDate(text),
                  };
                });
                formatText.length >= 10 && setErrorDate(!validityDateCheck(text));
              }
            }}
            onBlur={() => {
              setErrorDate(!validityDateCheck(personalInfo.dataNascita));
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
                margin-top: 2px;
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
            description="label of country input in customer info step"
            defaultMessage="Provincia di nascita"
          />
        </StyledLabel>
        <StyledStaticInfo style={{ gridRow: "country", width: "128px" }}>
          <span
            css={css`
              padding-left: 30px;
            `}
          >
            {customerInfo.provinciaNascita}
          </span>
        </StyledStaticInfo>
        <StyledLabel style={{ gridRow: "birthplace" }}>
          <FormattedMessage
            description="label of birthplace input in customer info step"
            defaultMessage="Comune di nascita"
          />
        </StyledLabel>
        <StyledStaticInfo style={{ gridRow: "birthplace", width: "597px" }}>
          <span
            css={css`
              padding-left: 30px;
            `}
          >
            {customerInfo.comuneDiNascita}
          </span>
        </StyledStaticInfo>
      </div>
      <div
        css={css`
          position: absolute;
          bottom: 50px;
          right: 50px;
        `}
      >
        <StyledButtonGreen data-qa="customer_info_CTA_avanti" onClick={validityCheck} disabled={isDisable}>
          <FormattedMessage defaultMessage="Avanti" description="avanti button in personal data step" />
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

export const StyledInput = styled.input<{
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

const StyledStaticInfo = styled.div`
  height: 60px;
  border-radius: 8px;
  background-color: #ededed;
  color: #444444;
  font-family: Roboto;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 20px;
  display: flex;
  align-items: center;
`;
