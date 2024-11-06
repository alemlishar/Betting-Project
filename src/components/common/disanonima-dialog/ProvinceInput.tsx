import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { StyledInput } from "src/components/common/disanonima-dialog/AddressInput";
import { getProvinces } from "src/components/common/disanonima-dialog/disanonima-api";
import { IndirizzoType } from "src/components/common/disanonima-dialog/ResidenceData";
import { useForeignClickOpen } from "src/components/prematch/templates/utils";
import { StyledOption } from "src/components/common/disanonima-dialog/SelectGender";
import styled, { css } from "styled-components/macro";
import useSWR from "swr";

type ProvinceInputType = {
  address: IndirizzoType;
  onChangeAddress: React.Dispatch<React.SetStateAction<IndirizzoType>>;
};

export const ProvinceInput = ({ address, onChangeAddress }: ProvinceInputType) => {
  const intl = useIntl();
  const { isOpen, setIsOpen, selectRef } = useForeignClickOpen<HTMLDivElement>();

  const [province, setProvince] = useState(address.province);

  useEffect(() => {
    setProvince(address.province);
  }, [address.province]);

  const { data: provinceData } = useSWR("provinceList", getProvinces, { dedupingInterval: 60 * 60 * 1000 });
  const [hasError, setHasError] = useState(false);

  const HintList = useMemo(() => {
    if (!provinceData) return [];
    if (province === "") return provinceData.provinces;
    return provinceData.provinces.filter(({ code }) => {
      if (province.length === 1) return code.charAt(0).toLowerCase().includes(province.toLowerCase());
      return code.toLowerCase() === province.toLowerCase();
    });
  }, [province, provinceData]);

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
          border: ${isOpen ? "2px solid #aac21f" : hasError ? "2px solid #e72530" : "2px solid #979797"};
          border-bottom: ${isOpen ? "0" : hasError ? "2px solid #e72530" : "2px solid #979797"};
          border-radius: ${isOpen && HintList.length !== 0 ? "8px 8px 0 0" : "8px"};
          background-color: #ffffff;
          box-shadow: ${isOpen ? " 1px 1px 4px 0 rgba(0, 0, 0, 0.5)" : ""};
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
            border-bottom: ${isOpen ? "0" : "2px solid #aac21f"};
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
              defaultMessage: "Cerca...",
              description: "placeholder of province input in residence step ",
            })}
            value={province}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            onChange={(event) => {
              const text = event.target.value;
              onChangeAddress((prevState) => ({ ...prevState, province: "", city: "" }));
              setProvince(text);
            }}
            onKeyDown={(event) => {
              const eventKey = event.key;
              if (eventKey === " ") {
                onChangeAddress((prevState) => ({ ...prevState, province: prevState.province.concat(eventKey) }));
                onChangeAddress((prevState) => ({ ...prevState, province: "", city: "" }));
                setProvince((prevState) => prevState.concat(eventKey));
              }
            }}
            onBlur={() => {
              setHasError(HintList.length === 0);
            }}
          />
        </span>
      </div>
      {isOpen && (
        <div
          css={css`
            position: absolute;
            background-color: #ffffff;
            min-width: 100%;
            max-height: 180px;
            overflow-y: scroll;
            z-index: 1;
            box-sizing: border-box;
            border: 2px solid #aac21f;
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.5);
            &::-webkit-scrollbar-thumb {
              background: #d8d8d8;
              height: 30px;
              border-radius: 5px;
            }
            &::-webkit-scrollbar {
              width: 9px;
            }
          `}
        >
          {HintList &&
            HintList.map((hint) => {
              return (
                <StyledOption
                  isActiveFilter={hint.code.toLowerCase() === address.province.toLowerCase()}
                  onClick={() => {
                    onChangeAddress((prevState) => ({ ...prevState, province: hint.code, city: "" }));
                    setProvince(hint.code);
                    setIsOpen(false);
                    setHasError(false);
                  }}
                >
                  {hint.code}
                </StyledOption>
              );
            })}
          {!HintList && (
            <StyledEmptyOption>
              <FormattedMessage
                defaultMessage="Nessun risultato disponibile"
                description="empty result description in address input"
              />
            </StyledEmptyOption>
          )}
        </div>
      )}
      {hasError && !isOpen && (
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
            defaultMessage="Provincia non trovata"
            description="label errore provincia in residence step"
          />
        </div>
      )}
    </div>
  );
};

const StyledEmptyOption = styled.div`
  height: 60px;
  display: flex;
  font-family: Roboto;
  font-size: 1.125rem;
  align-items: center;
  padding: 0 30px;
  line-height: 45px;
  color: #444444;
  font-weight: 400;
  user-select: none;
`;
