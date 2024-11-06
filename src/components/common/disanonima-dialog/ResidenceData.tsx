import React, { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { StyledButtonGreen, StyledLabel } from "src/components/common/disanonima-dialog/AddDocumentDialog";
import { AddressInput } from "src/components/common/disanonima-dialog/AddressInput";
import { CityInput } from "src/components/common/disanonima-dialog/CityInput";
import { StyledInput } from "src/components/common/disanonima-dialog/CustomerInfo";
import { ReactComponent as IconCheck } from "src/assets/images/ico_check_on.svg";
import { AnagraficaDTO } from "src/components/common/disanonima-dialog/disanonima-dto";
import { DisanonimaState, StyledDisanonimaTitle } from "src/components/common/disanonima-dialog/DisanonimaDialog";
import { ProvinceInput } from "src/components/common/disanonima-dialog/ProvinceInput";
import styled, { css } from "styled-components/macro";

type ResidenceDataProps = {
  onChangeDisanonima: React.Dispatch<React.SetStateAction<DisanonimaState>>;
  customerInfo: AnagraficaDTO;
  isRegisteredUser: boolean;
};
export type IndirizzoType = {
  address: string;
  cap: string;
  province: string;
  city: string;
};

export const emptyAddress: IndirizzoType = {
  address: "",
  cap: "",
  province: "",
  city: "",
};
export function ResidenceData({ customerInfo, onChangeDisanonima, isRegisteredUser }: ResidenceDataProps) {
  const intl = useIntl();

  const [residenza, setResidenza] = useState<IndirizzoType>({
    address: customerInfo.indirizzoResidenza,
    cap: "",
    province: customerInfo.provinciaResidenza,
    city: customerInfo.comuneResidenza,
  });
  const [domicilio, setDomicilio] = useState<IndirizzoType>({
    address: customerInfo.indirizzoDomicilio,
    cap: "",
    province: customerInfo.provinciaDomicilio,
    city: customerInfo.comuneDomicilio,
  });
  const [flagResDomDiversi, setFlagResDomDiversi] = useState(customerInfo.flagResDomDiversi);

  const disableWarning = useCallback(() => {
    onChangeDisanonima((prevState) => ({
      ...prevState,
      alertState: { isVisible: false, message: "", title: "", type: "warning" },
    }));
  }, [onChangeDisanonima]);

  const goToNextStep = () => {
    onChangeDisanonima((prevState) => {
      return {
        ...prevState,
        customerInfo: {
          ...prevState.customerInfo,
          comuneResidenza: residenza.city,
          provinciaResidenza: residenza.province,
          indirizzoResidenza: residenza.address,
          flagResDomDiversi: flagResDomDiversi,
          comuneDomicilio: domicilio.city,
          provinciaDomicilio: domicilio.province,
          indirizzoDomicilio: domicilio.address,
        },
        step: "privacyData",
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

  const isDisable =
    residenza.address === "" ||
    residenza.cap === "" ||
    residenza.province === "" ||
    residenza.city === "" ||
    (flagResDomDiversi === "Y" &&
      (domicilio.address === "" || domicilio.cap === "" || domicilio.province === "" || domicilio.city === ""));
  return (
    <>
      <StyledDisanonimaTitle>
        <FormattedMessage
          description="Title of residence data step in disanonima"
          defaultMessage="Indirizzo di residenza"
        />
      </StyledDisanonimaTitle>
      <div
        css={css`
          display: grid;
          grid-template-columns: [nameLabel] 130px [input] 597px;
          column-gap: 20px;
          padding-top: 30px;
          margin-left: 50px;
        `}
      >
        <StyledLabel style={{ gridColumn: "nameLabel" }}>
          <FormattedMessage
            defaultMessage="Indirizzo"
            description="address label in residence data step in disanonima "
          />
        </StyledLabel>
        <div style={{ gridColumn: "input" }} onClick={disableWarning}>
          <AddressInput address={residenza} onChangeAddress={setResidenza} />
        </div>
      </div>

      <div
        css={css`
          display: grid;
          grid-template-columns: [capLabel] 130px [capInput] 269px [provinceLabel] 120px [provinceInput] 168px;
          column-gap: 20px;
          padding-top: 20px;
          margin-left: 50px;
        `}
      >
        <StyledLabel style={{ gridColumn: "capLabel" }}>
          <FormattedMessage defaultMessage="Cap" description="cap label in residence data step in disanonima " />
        </StyledLabel>
        <StyledInput
          value={residenza.cap}
          maxLength={5}
          onClick={disableWarning}
          onChange={(event) => {
            const text = event.target.value;
            if (/^[0-9]{0,}$/.test(text)) {
              setResidenza((prevState) => ({ ...prevState, cap: text }));
            }
          }}
          style={{ gridColumn: "capInput", width: "269px" }}
          placeholder={intl.formatMessage({
            defaultMessage: "00100",
            description: "placeholder of cap input in residence step ",
          })}
        ></StyledInput>
        <StyledLabel style={{ gridColumn: "provinceLabel", justifyContent: "center" }}>
          <FormattedMessage
            defaultMessage="Provincia"
            description="provincia label in residence data step in disanonima "
          />
        </StyledLabel>
        <div onClick={disableWarning}>
          <ProvinceInput address={residenza} onChangeAddress={setResidenza} />
        </div>
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: [nameLabel] 130px [input] auto;
          column-gap: 20px;
          padding-top: 20px;
          margin-left: 50px;
        `}
        onClick={disableWarning}
      >
        <StyledLabel style={{ gridColumn: "nameLabel" }}>
          <FormattedMessage defaultMessage="Comune" description="comune label in residence data step in disanonima " />
        </StyledLabel>
        <CityInput address={residenza} onChangeAddress={setResidenza} />
      </div>

      <StyledDisanonimaTitle>
        <FormattedMessage
          description="Title of living address section in disanonima"
          defaultMessage="Indirizzo di domicilio"
        />
      </StyledDisanonimaTitle>

      <StyledCheckBox>
        <StyledCheckBoxInput
          type="checkbox"
          id="domicilioCheckbox"
          name="domicilioCheckbox"
          value="domicilioCheckbox"
          onClick={() => {
            flagResDomDiversi === "N" ? setFlagResDomDiversi("Y") : setFlagResDomDiversi("N");
            disableWarning();
          }}
        />
        {flagResDomDiversi === "N" ? <IconCheck /> : ""}
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
            description="description of checkbox in residence step"
            defaultMessage="Il domicilio coincide con la residenza"
          />
        </div>
      </StyledCheckBox>
      {flagResDomDiversi === "Y" && (
        <>
          <div
            css={css`
              display: grid;
              grid-template-columns: [nameLabel] 130px [input] 597px;
              column-gap: 20px;
              margin-left: 50px;
            `}
          >
            <StyledLabel style={{ gridColumn: "nameLabel" }}>
              <FormattedMessage
                defaultMessage="Indirizzo"
                description="address label in residence data step in disanonima "
              />
            </StyledLabel>
            <div style={{ gridColumn: "input" }} onClick={disableWarning}>
              <AddressInput address={domicilio} onChangeAddress={setDomicilio} />
            </div>
          </div>

          <div
            css={css`
              display: grid;
              grid-template-columns: [capLabel] 130px [capInput] 269px [provinceLabel] 120px [provinceInput] 168px;
              column-gap: 20px;
              padding-top: 20px;
              margin-left: 50px;
            `}
          >
            <StyledLabel style={{ gridColumn: "capLabel" }}>
              <FormattedMessage defaultMessage="Cap" description="cap label in residence data step in disanonima " />
            </StyledLabel>
            <StyledInput
              value={domicilio.cap}
              maxLength={5}
              onClick={disableWarning}
              onChange={(event) => {
                const text = event.target.value;
                if (/^[0-9]{0,}$/.test(text)) {
                  setDomicilio((prevState) => ({ ...prevState, cap: text }));
                }
              }}
              style={{ gridColumn: "capInput", width: "269px" }}
              placeholder={intl.formatMessage({
                defaultMessage: "00100",
                description: "placeholder of cap input in residence step ",
              })}
            ></StyledInput>
            <StyledLabel style={{ gridColumn: "provinceLabel", justifyContent: "center" }}>
              <FormattedMessage
                defaultMessage="Provincia"
                description="provincia label in residence data step in disanonima "
              />
            </StyledLabel>
            <div onClick={disableWarning}>
              <ProvinceInput address={domicilio} onChangeAddress={setDomicilio} />
            </div>
          </div>
          <div
            css={css`
              display: grid;
              grid-template-columns: [nameLabel] 130px [input] auto;
              column-gap: 20px;
              padding-top: 20px;
              margin-left: 50px;
            `}
            onClick={disableWarning}
          >
            <StyledLabel style={{ gridColumn: "nameLabel" }}>
              <FormattedMessage
                defaultMessage="Comune"
                description="comune label in residence data step in disanonima "
              />
            </StyledLabel>
            <CityInput address={domicilio} onChangeAddress={setDomicilio} />
          </div>
        </>
      )}
      <div
        css={css`
          position: absolute;
          bottom: 30px;
          right: 50px;
        `}
      >
        <StyledButtonGreen disabled={isDisable} onClick={goToNextStep}>
          <FormattedMessage defaultMessage="Avanti" description="avanti button in fiscal code step" />
        </StyledButtonGreen>
      </div>
    </>
  );
}

const StyledCheckBox = styled.div`
  display: grid;
  grid-template-columns: [checkbox] 40px [label] 640px;
  grid-column-gap: 20px;
  align-items: center;
  padding: 30px 50px;
  svg {
    position: absolute;
    height: auto;
    z-index: 1;
    width: 35px;
    margin: 6px 7px;
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
