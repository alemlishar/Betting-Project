import React from "react";
import styled, { css } from "styled-components/macro";
import icoArrowDownGreen from "src/assets/images/icon-arrow-down-green.svg";
import icoArrowUpGreen from "src/assets/images/icon-arrow-up-green.svg";
import icoArrowDownYellow from "src/assets/images/icon-arrow-down-yellow.svg";
import icoArrowUpYellow from "src/assets/images/icon-arrow-up-yellow.svg";
import icoArrowDownWhite from "src/assets/images/icon-arrow-down-white.svg";
import icoArrowUpWhite from "src/assets/images/icon-arrow-up-white.svg";
import icoArrowDownGrey from "src/assets/images/icon-arrow-down-grey.svg";
import icoArrowUpGrey from "src/assets/images/icon-arrow-up-grey-big.svg";
import { IdInfoAggiuntiva } from "src/types/chiavi";
import { useForeignClickOpen } from "src/components/prematch/templates/utils";
import { InfoAggiuntiva, Esito } from "src/components/prematch/prematch-api";
import { formatCents } from "src/helpers/MoneyFormatterUtility";

export type InfoAggiuntivaSelectProps = {
  infoAggiuntive: { idInfoAggiuntiva: IdInfoAggiuntiva; descrizione: string }[];
  value: IdInfoAggiuntiva;
  onChange(chiaveInfoAggiuntiva: IdInfoAggiuntiva): void;
  regExp: string;
};

type InfoAggiuntivaSelectHeaderSpecialProps = {
  icoArrowUp: string;
  icoArrowDown: string;
  backGroundColorSelect: string;
  colorHoverElementTendina: string;
};
export type InfoAggiuntivaSelectHeaderType = typeof InfoAggiuntivaSelectHeaderPrematch;
function InfoAggiuntivaSelectHeader({
  infoAggiuntive,
  regExp,
  value,
  icoArrowUp,
  icoArrowDown,
  backGroundColorSelect,
  colorHoverElementTendina,
  onChange,
}: InfoAggiuntivaSelectProps & InfoAggiuntivaSelectHeaderSpecialProps) {
  const { selectRef, isOpen, setIsOpen } = useForeignClickOpen();
  const infoAggiuntiva = infoAggiuntive.find((infoAggiuntiva) => infoAggiuntiva.idInfoAggiuntiva === value);
  return (
    <React.Fragment>
      <div
        ref={selectRef}
        css={css`
          display: flex;
          align-items: center;
          width: 100%;
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <StyledDescrizioneInfoAggiuntiva>
          {infoAggiuntiva ? getModifiedDescription(infoAggiuntiva, regExp) : "-"}
        </StyledDescrizioneInfoAggiuntiva>
        {isOpen ? (
          <StyledTriangle src={icoArrowUp} alt={"icon open select"} />
        ) : (
          <StyledTriangle src={icoArrowDown} alt={"icon close select"} />
        )}
        {/* viene usato <img src/> al posto del component perchè un svg element non risulta contenuto nel bottone con il test .contains(event.target) */}
      </div>
      {isOpen && (
        // TODO: evitare di usare z-index
        <div
          css={`
            position: absolute;
            color: #ffff;
            cursor: pointer;
            border-radius: 0 0 4px 4px;
            background-color: ${backGroundColorSelect};
            box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.5);
            z-index: 1;
            top: 30px;
            margin-bottom: 30px;
          `}
        >
          {infoAggiuntive.map((infoAggiuntiva) => {
            // DEBT suddividere
            return (
              <div
                css={`
                  height: 40px;
                  width: 55px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-family: Roboto;
                  font-size: 1rem;
                  font-weight: 700;
                  &:hover {
                    color: ${colorHoverElementTendina};
                  }
                `}
                key={infoAggiuntiva.idInfoAggiuntiva}
                onClick={() => {
                  onChange(infoAggiuntiva.idInfoAggiuntiva);
                  setIsOpen(false);
                }}
              >
                {getModifiedDescription(infoAggiuntiva, regExp)}
              </div>
            );
          })}
        </div>
      )}
    </React.Fragment>
  );
}
export function InfoAggiuntivaSelectHeaderHomePrematch(props: InfoAggiuntivaSelectProps) {
  return (
    <InfoAggiuntivaSelectHeader
      {...props}
      icoArrowUp={icoArrowUpGrey}
      icoArrowDown={icoArrowDownGrey}
      backGroundColorSelect={"#005936"}
      colorHoverElementTendina={"#aac21f"}
    />
  );
}
export function InfoAggiuntivaSelectHeaderPrematch(props: InfoAggiuntivaSelectProps) {
  return (
    <InfoAggiuntivaSelectHeader
      {...props}
      icoArrowUp={icoArrowUpWhite}
      icoArrowDown={icoArrowDownWhite}
      backGroundColorSelect={"#005936"}
      colorHoverElementTendina={"#aac21f"}
    />
  );
}
export function InfoAggiuntivaSelectHeaderLive(props: InfoAggiuntivaSelectProps) {
  return (
    <InfoAggiuntivaSelectHeader
      {...props}
      icoArrowUp={icoArrowUpGrey}
      icoArrowDown={icoArrowDownGrey}
      backGroundColorSelect={"#333333"}
      colorHoverElementTendina={"#FFB800"}
    />
  );
}

type InfoAggiuntivaSelectSpecialProps = {
  icoArrowUp: string;
  icoArrowDown: string;
  backGroundColorSelect: string;
  backgroundColorElementTendina: string;
  isEnabled: boolean;
  opacitySelect: string;
};
export function InfoAggiuntivaSelect({
  infoAggiuntive,
  value,
  onChange,
  regExp,
  icoArrowUp,
  icoArrowDown,
  isEnabled,
  backGroundColorSelect,
  opacitySelect,
  backgroundColorElementTendina,
}: InfoAggiuntivaSelectProps & InfoAggiuntivaSelectSpecialProps) {
  const { selectRef, isOpen, setIsOpen } = useForeignClickOpen();
  const infoAggiuntiva = infoAggiuntive.find((infoAggiuntiva) => infoAggiuntiva.idInfoAggiuntiva === value);
  return (
    <div
      css={css`
        position: relative;
        height: 45px;
      `}
    >
      <div
        ref={selectRef}
        css={css`
          box-sizing: border-box;
          border: 1.62px solid #cbcbcb;
          opacity: 0.99;
          border-radius: 4px;
          height: 100%;
          width: 55px;
          color: #333333;
          font-family: Roboto;
          font-size: 0.9375rem;
          letter-spacing: 0;
          line-height: 19px;
          text-align: center;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          padding: 1px calc(4px - 1.62px);
          opacity: ${isEnabled ? 0.99 : opacitySelect};
          cursor: ${isEnabled ? "pointer" : "default"};
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <StyledDescrizioneInfoAggiuntiva>
          {infoAggiuntiva ? getModifiedDescription(infoAggiuntiva, regExp) : "-"}
        </StyledDescrizioneInfoAggiuntiva>
        {
          isEnabled ? (
            <>
              {isOpen ? (
                <StyledTriangle src={icoArrowUp} alt={"icon open select"} />
              ) : (
                <StyledTriangle src={icoArrowDown} alt={"icon close select"} />
              )}
            </>
          ) : (
            ""
          ) /* viene usato <img src/> al posto del component perchè un svg element non risulta contenuto nel bottone con il test .contains(event.target) */
        }
      </div>
      {isEnabled && isOpen && (
        // TODO: evitare di usare z-index
        <div
          css={`
            position: absolute;
            color: #ffffff;
            cursor: pointer;
            border-radius: 0 0 4px 4px;
            background-color: ${backGroundColorSelect};
            box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.5);
            z-index: 1;
            margin-bottom: 30px;
          `}
        >
          {infoAggiuntive.map((infoAggiuntiva) => {
            // DEBT suddividere
            return (
              <div
                css={`
                  height: 40px;
                  width: 55px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  font-family: Roboto;
                  font-size: 0.9375rem;
                  font-weight: 700;
                  &:hover {
                    background-color: ${backgroundColorElementTendina};
                    border-radius: 4px;
                  }
                `}
                key={infoAggiuntiva.idInfoAggiuntiva}
                onClick={() => {
                  onChange(infoAggiuntiva.idInfoAggiuntiva);
                  setIsOpen(false);
                }}
              >
                {getModifiedDescription(infoAggiuntiva, regExp)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function InfoAggiuntivaSelectPrematch(props: InfoAggiuntivaSelectProps) {
  return (
    <InfoAggiuntivaSelect
      {...props}
      icoArrowUp={icoArrowUpGreen}
      icoArrowDown={icoArrowDownGreen}
      backGroundColorSelect={"#005936"}
      backgroundColorElementTendina={"#aac21f"}
      isEnabled={props.infoAggiuntive.length > 1}
      opacitySelect={"0.6"}
    />
  );
}
export function InfoAggiuntivaSelectLive(props: InfoAggiuntivaSelectProps) {
  return (
    <InfoAggiuntivaSelect
      {...props}
      icoArrowUp={icoArrowUpYellow}
      icoArrowDown={icoArrowDownYellow}
      backGroundColorSelect={"#333333"}
      backgroundColorElementTendina={"#FFB800"}
      isEnabled={props.infoAggiuntive.length > 0}
      opacitySelect={"0.99"}
    />
  );
}

type InfoAggiuntivaAggregatorSelectHeaderProps = {
  list: Array<string>;
  value: string | undefined;
  onChange(descrizioneEsito: string): void;
};

export function InfoAggiuntivaAggregatorSelectHeader({
  list,
  value,
  onChange,
}: InfoAggiuntivaAggregatorSelectHeaderProps) {
  const { selectRef, isOpen, setIsOpen } = useForeignClickOpen();
  return (
    <React.Fragment>
      <div
        ref={selectRef}
        css={css`
          display: flex;
          align-items: center;
          min-width: 120px;
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <StyledDescrizioneInfoAggiuntiva>{value ? value : "-"}</StyledDescrizioneInfoAggiuntiva>
        {
          isOpen ? (
            <StyledTriangle src={icoArrowUpWhite} alt={"icon open select"} />
          ) : (
            <StyledTriangle src={icoArrowDownWhite} alt={"icon close select"} />
          ) /* viene usato <img src/> al posto del component perchè un svg element non risulta contenuto nel bottone con il test .contains(event.target) */
        }
      </div>
      {isOpen && (
        // TODO: evitare di usare z-index
        <div
          css={`
            position: absolute;
            color: #ffff;
            cursor: pointer;
            border-radius: 0 0 4px 4px;
            background-color: #005936;
            box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.5);
            z-index: 1;
            top: 30px;
            margin-bottom: 30px;
          `}
        >
          {list.map((descrizione) => {
            // DEBT suddividere
            return (
              <div
                css={`
                  height: 40px;
                  width: 120px;
                  display: grid;
                  align-items: center;
                  justify-content: center;
                  font-family: Roboto;
                  font-size: 1rem;
                  font-weight: 700;
                  &:hover {
                    color: #aac21f;
                  }
                `}
                key={descrizione}
                onClick={() => {
                  onChange(descrizione);
                  setIsOpen(false);
                }}
              >
                {descrizione}
              </div>
            );
          })}
        </div>
      )}
    </React.Fragment>
  );
}

type InfoAggiuntivaAggregatorSelectEsitoProps = {
  infoAggiuntiva: InfoAggiuntiva | undefined;
  value: string | undefined;
  onChange(esito: Esito): void;
};
function InfoAggiuntivaAggregatorSelectEsito({
  infoAggiuntiva,
  value,
  onChange,
}: InfoAggiuntivaAggregatorSelectEsitoProps) {
  const { selectRef, isOpen, setIsOpen } = useForeignClickOpen();
  const isEnabled = infoAggiuntiva && infoAggiuntiva.esitoList.length > 0;
  // const infoAggiuntiva = infoAggiuntive.find((infoAggiuntiva) => infoAggiuntiva.idInfoAggiuntiva === value);
  return (
    <div
      css={css`
        position: relative;
        height: 100%;
      `}
    >
      <div
        ref={selectRef}
        css={css`
          box-sizing: border-box;
          border: 1.62px solid #cbcbcb;
          opacity: 0.99;
          border-radius: 4px;
          height: 100%;
          min-width: 120px;
          color: #333333;
          font-family: Roboto;
          font-size: 1rem;
          letter-spacing: 0;
          line-height: 19px;
          text-align: center;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          padding: 1px calc(4px - 1.62px);
          opacity: ${isEnabled ? 1 : 0.6};
          cursor: ${isEnabled ? "pointer" : "default"};
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <StyledDescrizioneInfoAggiuntiva>
          {value ? value : "-"}
          {/* {infoAggiuntiva ? getModifiedDescription(infoAggiuntiva, regExp) : "-"} */}
        </StyledDescrizioneInfoAggiuntiva>
        {
          isEnabled ? (
            <>
              {isOpen ? (
                <StyledTriangle src={icoArrowUpGreen} alt={"icon open select"} />
              ) : (
                <StyledTriangle src={icoArrowDownGreen} alt={"icon close select"} />
              )}
            </>
          ) : (
            ""
          ) /* viene usato <img src/> al posto del component perchè un svg element non risulta contenuto nel bottone con il test .contains(event.target) */
        }
      </div>
      {isOpen && (
        // TODO: evitare di usare z-index
        <div
          css={`
            position: absolute;
            color: #ffffff;
            cursor: pointer;
            border-radius: 0 0 4px 4px;
            background-color: #005936;
            box-shadow: 0 -1px 4px 0 rgba(0, 0, 0, 0.5);
            z-index: 1;
            margin-bottom: 30px;
          `}
        >
          {infoAggiuntiva?.esitoList.map((esito) => {
            // DEBT suddividere
            return (
              <div
                css={`
                  height: 40px;
                  width: 120px;
                  display: grid;
                  grid-template-columns: repeat(2, 1fr [col-start]);
                  align-items: center;
                  font-family: Roboto;
                  font-size: 1rem;
                  &:hover {
                    background-color: #aac21f;
                    border-radius: 4px;
                  }
                `}
                key={esito.codiceEsito}
                onClick={() => {
                  onChange(esito);
                  setIsOpen(false);
                }}
              >
                <span
                  css={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: 700;
                  `}
                >
                  {esito.descrizione}
                </span>
                <span
                  css={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: 400;
                  `}
                >
                  {formatCents(esito.quota, 2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export const InfoAggiuntivaAggregatorSelectEsitoMemo = React.memo(InfoAggiuntivaAggregatorSelectEsito);

const StyledTriangle = styled.img`
  width: 8px;
  margin-left: 4px;
  margin-right: 4px;
`;

const StyledDescrizioneInfoAggiuntiva = styled.div`
  text-align: center;
  flex-grow: 1;
`;

function getModifiedDescription(
  infoAggiuntiva: { idInfoAggiuntiva: IdInfoAggiuntiva; descrizione: string },
  regExp: string,
) {
  return (infoAggiuntiva.descrizione.match(new RegExp(regExp)) ?? []).slice(1).join("");
}
