import { IndirizzoType } from "src/components/common/disanonima-dialog/ResidenceData";
import { useForeignClickOpen } from "src/components/prematch/templates/utils";
import icoArrowDownGreen from "src/assets/images/icon-arrow-down-green.svg";
import icoArrowUpGreen from "src/assets/images/icon-arrow-up-green.svg";
import styled, { css } from "styled-components/macro";
import useSWR from "swr";
import { getCitiesByProvince } from "src/components/common/disanonima-dialog/disanonima-api";
import { FormattedMessage } from "react-intl";
import { useState } from "react";
import { StyledOption } from "src/components/common/disanonima-dialog/SelectGender";

type CityInputType = {
  address: IndirizzoType;
  onChangeAddress: React.Dispatch<React.SetStateAction<IndirizzoType>>;
};
export const CityInput = ({ address, onChangeAddress }: CityInputType) => {
  const { isOpen, setIsOpen, selectRef } = useForeignClickOpen<HTMLButtonElement>();
  const { data: citiesData } = useSWR(address.province, getCitiesByProvince, { dedupingInterval: 60 * 60 * 1000 });
  const [cityHint, setCityHint] = useState("");
  const isDisable = address.province === "";
  const citiesFiltered =
    citiesData?.cities?.filter(({ description }) => {
      return description.toLowerCase().includes(cityHint);
    }) || [];
  return (
    <div
      css={css`
        position: relative;
      `}
      onKeyDown={(event) => {
        const keyPressed = event.key;
        if (event.key === "Backspace") {
          setCityHint((prevState) => {
            return prevState.slice(0, prevState.length - 2);
          });
        } else if (/^[a-zA-Z]$/.test(event.key)) {
          setCityHint((prevState) => {
            return prevState.concat(keyPressed.toLowerCase());
          });
        }
      }}
    >
      <button
        ref={selectRef}
        onClick={() => setIsOpen(!isOpen)}
        css={css`
          box-sizing: border-box;
          height: 60px;
          min-width: 597px;
          outline: none;
          border: 2px solid #979797;
          border-radius: ${isOpen ? "8px 8px 0 0" : "8px"};
          background-color: #ffffff;
          box-shadow: ${isOpen ? " 1px 2px 4px 0 rgba(0, 0, 0, 0.5)" : ""};
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
          text-transform: capitalize;
          &:hover {
            cursor: pointer;
          }
          &:disabled {
            background-color: #ededed;
            border: none;
            opacity: 0.2;
            color: #444444;
            font-family: Roboto;
            font-size: 18px;
            font-style: italic;
            font-weight: 300;
            letter-spacing: 0;
            line-height: 20px;
            cursor: default;
          }
        `}
        disabled={isDisable}
      >
        <span
          css={css`
            width: calc(100% - 45px);
            justify-content: center;
          `}
        >
          {address.city === "" ? (
            <FormattedMessage defaultMessage="Seleziona..." description="default city value" />
          ) : (
            address.city.toLowerCase()
          )}
        </span>

        <span
          css={css`
            width: 45px;
            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          {!isDisable && (
            <img
              css={css`
                width: 15px;
                height: 15px;
              `}
              onClick={() => setIsOpen(!isOpen)}
              src={isOpen ? icoArrowUpGreen : icoArrowDownGreen}
              alt={""}
            />
          )}
        </span>
      </button>
      {isOpen && (
        <div
          css={css`
            position: absolute;
            background-color: #ffffff;
            min-width: 597px;
            z-index: 1;
            box-sizing: border-box;
            border: 2px solid #979797;
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.5);
            max-height: 180px;
            overflow-y: scroll;
            &::-webkit-scrollbar-thumb {
              background: #d8d8d8;
              height: 30px;
              border-radius: 5px;
            }
            &::-webkit-scrollbar {
              width: 9px;
            }
            &::-webkit-scrollbar-track {
              margin-right: 12px;
            }
          `}
        >
          {citiesFiltered.map((city) => {
            return (
              <StyledOption
                css={css`
                  text-transform: capitalize;
                `}
                isActiveFilter={city.description.toLowerCase() === address.city.toLowerCase()}
                onClick={() => {
                  onChangeAddress((prevState) => ({ ...prevState, city: city.description, cap: city.cap }));
                  setIsOpen(false);
                }}
              >
                {city.description.toLowerCase()}
              </StyledOption>
            );
          })}
        </div>
      )}
    </div>
  );
};
