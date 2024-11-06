import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled from "styled-components/macro";

export const ImpostazioniQuote = ({
  expanded,
  setIsChange,
  impostazioniDiQuote,
  setImpostazioniDiQuote,
}: {
  expanded: boolean;
  setIsChange: (e: boolean) => void;
  impostazioniDiQuote: number;
  setImpostazioniDiQuote: (e: number) => void;
}) => {
  type TypeVariazioniQuota = {
    id: number;
    label: string;
  };

  const intl = useIntl();

  const variazioniQuote: TypeVariazioniQuota[] = [
    {
      id: 1,
      label: intl.formatMessage({
        defaultMessage: "Non accetto variazioni di quote",
        description: "label no variazione quota",
      }),
    },
    {
      id: 2,
      label: intl.formatMessage({
        defaultMessage: "Accetto tutte le variazioni di quote",
        description: "label default variazione quota",
      }),
    },
    // { id: 3, label: "Accetto variazioni di quote più alte" },
  ];

  const changeChoice = (e: any) => {
    if (Number(e.target.id) !== impostazioniDiQuote) {
      setIsChange(true);
      setImpostazioniDiQuote(Number(e.target.id));
    }
  };

  return (
    <>
      {!expanded && (
        <StyledContainerQuote>
          <FormattedMessage defaultMessage="IMPOSTAZIONI DI QUOTA" description="label impostazioni quota" />

          {variazioniQuote.map((quota) => {
            return (
              <StyledBoxRadioQuote key={quota.id}>
                <StyledRadioInput
                  type="radio"
                  id={quota.id.toString()}
                  name="variazioniQuote"
                  value={quota.label}
                  defaultChecked={quota.id === impostazioniDiQuote} //TODO gestire memoria operatori
                  onClick={(e: any) => changeChoice(e)}
                />
                <StyledRadioLabel>{quota.label}</StyledRadioLabel>
              </StyledBoxRadioQuote>
            );
          })}
        </StyledContainerQuote>
      )}
    </>
  );
};
const StyledContainerQuote = styled.div`
  font-family: Mulish;
  font-size: 18px;
  font-weight: 800;
  padding: 0 20px;
  margin-top: 25px;
`;
const StyledBoxRadioQuote = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;
const StyledRadioInput = styled.input`
  height: 37px;
  width: 37px;
  &[type="radio"] {
    appearance: none;
    width: 37px;
    height: 37px;
    padding: 7.4px;
    background-clip: content-box;
    border: 2px solid #444444;
    background-color: #ffffff;
    border-radius: 18.5px;
    :checked {
      background-color: #aac21f;
    }
    :focus {
      outline: none;
    }
  }
`;

const StyledRadioLabel = styled.div`
  font-family: Mulish;
  font-size: 18px;
  font-weight: bold;
  margin-left: 20px;
`;
