import React from "react";
import styled, { css } from "styled-components/macro";
import IcoArrowRightGreen from "src/assets/images/icon-arrow-right-green.svg";
import IcoArrowRightYellow from "src/assets/images/icon-arrow-right-yellow.svg";
import { CodiceAvvenimento, CodicePalinsesto } from "src/types/chiavi";
import { FormattedMessage } from "react-intl";

export type NPlusProps = {
  codicePalinsesto: CodicePalinsesto;
  codiceAvvenimento: CodiceAvvenimento;
  numeroScommesse: number;
  onClick: () => void;
};
function NPlus(props: NPlusProps & { icoArrow: string }) {
  const { numeroScommesse, onClick, icoArrow } = props;
  return (
    <StyledNPlus onClick={() => onClick()} data-qa={`esito_${props.codicePalinsesto}_${props.codiceAvvenimento}_more`}>
      {`+${numeroScommesse}`} <img src={icoArrow} width={20} height={20} alt={"arrowNPlus"} />
    </StyledNPlus>
  );
}

export const NPlusPremtachMemo = React.memo((props: NPlusProps) => (
  <NPlus {...props} icoArrow={IcoArrowRightGreen} />
)) as React.ComponentType<NPlusProps>; // cast necessario perchè React.memo non preserva la parametricità del tipo

export const NPlusLiveMemo = React.memo((props: NPlusProps) => (
  <NPlus {...props} icoArrow={IcoArrowRightYellow} />
)) as React.ComponentType<NPlusProps>; // cast necessario perchè React.memo non preserva la parametricità del tipo

function NPlusDescrizione(props: NPlusProps & { icoArrow: string }) {
  const { numeroScommesse, onClick, icoArrow } = props;
  return (
    <>
      <span
        css={css`
          font-family: Roboto;
          font-size: 1rem;
        `}
      >
        <FormattedMessage defaultMessage="Altre classi d'esito" description="button altre classi d'esito" />
      </span>
      <StyledNPlusDescrizione onClick={() => onClick()}>
        {` +${numeroScommesse}`}
        <img
          src={icoArrow}
          width={20}
          height={20}
          alt={"arrowNPlus"}
          data-qa={`esito_${props.codicePalinsesto}_${props.codiceAvvenimento}_more`}
        />
      </StyledNPlusDescrizione>
    </>
  );
}

export const NPlusDescrizionePremtachMemo = React.memo((props: NPlusProps) => (
  <NPlusDescrizione {...props} icoArrow={IcoArrowRightGreen} />
)) as React.ComponentType<NPlusProps>; // cast necessario perchè React.memo non preserva la parametricità del tipo
export const NPlusDescrizioneLiveMemo = React.memo((props: NPlusProps) => (
  <NPlusDescrizione {...props} icoArrow={IcoArrowRightYellow} />
)) as React.ComponentType<NPlusProps>; // cast necessario perchè React.memo non preserva la parametricità del tipo

const StyledNPlusBase = styled.button`
  height: 45px;
  background-color: transparent;
  font-family: Roboto;
  font-size: 1rem;
  letter-spacing: 0;
  line-height: 19px;
  text-align: center;
  border: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const StyledNPlus = styled(StyledNPlusBase)`
  color: #444444;
  min-width: 55px;
`;

const StyledNPlusDescrizione = styled(StyledNPlusBase)`
  min-width: 55px;
  color: #005936;
  font-weight: 700;
`;
