import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { getAddressHint, getProvinces } from "src/components/common/disanonima-dialog/disanonima-api";
import { ProvinceAPIDTO } from "src/components/common/disanonima-dialog/disanonima-dto";
import { IndirizzoType } from "src/components/common/disanonima-dialog/ResidenceData";
import { useForeignClickOpen } from "src/components/prematch/templates/utils";
import styled, { css } from "styled-components/macro";
import useSWR, { mutate } from "swr";

type AddressInputType = {
  address: IndirizzoType;
  onChangeAddress: React.Dispatch<React.SetStateAction<IndirizzoType>>;
};
export const AddressInput = ({ address, onChangeAddress }: AddressInputType) => {
  const intl = useIntl();
  const { data: HintList } = useSWR(address.address, getAddressHint);

  const { isOpen, setIsOpen, selectRef } = useForeignClickOpen<HTMLDivElement>();
  const HintOpened = isOpen && HintList;
  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <div
        ref={selectRef}
        css={css`
          box-sizing: border-box;
          height: 60px;
          width: 100%;
          outline: none;
          border: ${HintOpened ? "2px solid #aac21f" : "2px solid #979797"};
          border-bottom: ${HintOpened ? "0" : "2px solid #979797"};
          border-radius: ${HintOpened ? "8px 8px 0 0" : "8px"};
          background-color: #ffffff;
          box-shadow: ${HintOpened ? " 1px 1px 4px 0 rgba(0, 0, 0, 0.5)" : ""};
          color: #444444;
          font-family: Roboto;
          font-size: 1.125rem;
          letter-spacing: 0;
          font-weight: 700;
          line-height: 20px;
          text-align: left;
          padding-left: 30px;
          display: flex;
          align-items: center;
          &:hover {
            cursor: pointer;
          }
          &:focus-within {
            border: 2px solid #aac21f;
            border-bottom: ${HintOpened ? "0" : "2px solid #aac21f"};
          }
        `}
      >
        <span
          css={css`
            width: calc(100% - 45px);
            justify-content: center;
          `}
        >
          <StyledInput
            placeholder={intl.formatMessage({
              defaultMessage: "Inserisci l'indirizzo",
              description: "placeholder of address input in residence step ",
            })}
            value={address.address}
            onClick={() => setIsOpen(!HintOpened)}
            onChange={(event) => {
              const text = event.target.value;
              onChangeAddress((prevState) => ({ ...prevState, address: text, cap: "", province: "", city: "" }));
            }}
            onKeyDown={(event) => {
              const eventKey = event.key;
              if (eventKey === " ") {
                onChangeAddress((prevState) => ({ ...prevState, address: prevState.address.concat(eventKey) }));
              }
            }}
          />
        </span>
      </div>
      {HintOpened && (
        <div
          css={css`
            position: absolute;
            background-color: #ffffff;
            min-width: 100%;
            z-index: 1;
            box-sizing: border-box;
            border: 2px solid #aac21f;
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.5);
          `}
        >
          {HintList &&
            HintList.map((hint) => {
              const info = hint.display_name.split(",");
              const cap = info[info.length - 2];
              const regione = info[info.length - 3];
              const provincia = info[info.length - 4].substring(1);
              const comune = info[info.length - 5];
              return (
                <StyledOption
                  onClick={async () => {
                    const provinceData: ProvinceAPIDTO = await mutate("provinceList", getProvinces);
                    const provinceCode = provinceData.provinces.find(({ description }) => {
                      return description.toLowerCase() === provincia.toLowerCase();
                    })?.code;
                    onChangeAddress((prevState) => ({
                      ...prevState,
                      city: provinceCode ? comune : "",
                      province: provinceCode || "",
                      cap: provinceCode ? cap : "",
                      address: info[0],
                    }));
                    setIsOpen(false);
                  }}
                >
                  {info[0]}, {comune}, {regione}
                </StyledOption>
              );
            })}
          {HintList && HintList.length === 0 && (
            <StyledEmptyOption>
              <FormattedMessage
                defaultMessage="Nessun risultato disponibile"
                description="empty result description in address input"
              />
            </StyledEmptyOption>
          )}
        </div>
      )}
    </div>
  );
};

const StyledOption = styled.div<{ isActiveFilter?: boolean }>`
  height: 60px;
  display: flex;
  font-size: 1.125rem;
  align-items: center;
  padding: 0 30px;
  color: ${(props) => (props.isActiveFilter ? "#aac21f" : "#444444")};
  font-weight: ${(props) => (props.isActiveFilter ? "700" : "400")};
  user-select: none;
  &:hover {
    color: #fff;
    background-color: #aac21f;
    font-weight: 700;
    cursor: pointer;
    border: 0;
  }
`;

const StyledEmptyOption = styled.div`
  height: 60px;
  display: flex;
  font-family: Roboto;
  font-size: 1.125rem;
  align-items: center;
  padding: 0 30px;
  color: #444444;
  font-weight: 400;
  user-select: none;
`;

export const StyledInput = styled.input`
  font-size: 1.125rem;
  font-weight: 700;
  width: 100%;
  caret-color: #aac21f;
  border: none;
  outline: none;
  &::placeholder {
    opacity: 0.2;
    color: #444444;
    font-family: Roboto;
    font-size: 1.125rem;
    font-style: italic;
    font-weight: 300;
    line-height: 20px;
  }
`;
