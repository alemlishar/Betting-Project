import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { ReactComponent as IcoDanger } from "../../../../assets/images/icon-danger.svg";
import { ReactComponent as IcoArrow } from "../../../../assets/images/icon-triangle.svg";
import { LegatureSviluppoSistema } from "src/components/carrello/sviluppo-sistema/legature-sviluppo-sistema/LegatureSviluppoSistema";
import { SviluppoSistemaType, CartErrorsType } from "src/types/carrello.types";

export const WarningDropdownSistema = ({
  alertType,
  message,
  legature,
  legatureToShow,
  hasErrors,
  indexLegaturaOnFocus,
  updateBetLegatura,
  updateErrorsLegatura,
  changeLegaturaOnFocus,
}: {
  alertType: "systemWarnings";
  message: { text: string };
  legatureToShow: SviluppoSistemaType[] | undefined;
  legature: SviluppoSistemaType[] | undefined;
  hasErrors: (legatura: SviluppoSistemaType) => boolean;
  indexLegaturaOnFocus: number;
  updateBetLegatura: (bet: number, legaturaId: number | undefined) => void;
  updateErrorsLegatura: (errors: CartErrorsType, legaturaId: number | undefined) => void;
  changeLegaturaOnFocus: React.Dispatch<{
    direction?: 1 | -1 | undefined;
    set?: number | undefined;
  }>;
}) => {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const legatureAvailable = legatureToShow?.filter((legatura) => legatura.isAvailable);
    let realHeight = 0;
    let stringifyHeight = "";
    const minHeight = 70;
    if (legatureAvailable !== undefined && legatureAvailable.length < 9) {
      realHeight = 9 * 70 - legatureAvailable.length * 70;
    } else {
      realHeight = minHeight;
    }
    stringifyHeight = String(realHeight);
    const listNotAvailable = document.getElementById("visible");
    const listClose = document.getElementById("invisible");
    if (listNotAvailable !== null) {
      listNotAvailable.style.height = stringifyHeight + "px";
    } else if (listClose !== null) {
      listClose.style.height = "0px";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);
  return (
    <StyledWarningDialog className={alertType}>
      <div className="rectangular" />
      <StyledWarningText>
        <div>
          <IcoDanger />
          {message.text}
          <StyledIcoButton onClick={() => setExpanded(!expanded)} className={expanded ? "shadowUp" : "shadowDown"}>
            <IcoArrow className={expanded ? "arrowUp" : "arrowDown"} />
          </StyledIcoButton>
        </div>
      </StyledWarningText>
      <StyledLegatureNotAvaible id={expanded ? "visible" : "invisible"}>
        {legature &&
          expanded &&
          legatureToShow
            ?.filter((legatura) => !legatura.isAvailable)
            .map((legatura) => {
              const indexToShow = legature.indexOf(legature.find((l) => l.indice === legatura.indice) || legature[0]);
              return (
                <LegatureSviluppoSistema
                  key={indexToShow}
                  legatura={legatura}
                  legature={legature}
                  indexToShow={indexToShow}
                  hasErrors={hasErrors}
                  indexLegaturaOnFocus={indexLegaturaOnFocus}
                  updateBetLegatura={updateBetLegatura}
                  updateErrorsLegatura={updateErrorsLegatura}
                  changeLegaturaOnFocus={changeLegaturaOnFocus}
                  visibleParam={false}
                />
              );
            })}
      </StyledLegatureNotAvaible>
    </StyledWarningDialog>
  );
};

const StyledWarningDialog = styled.div`
  position: relative;
  padding-left: 20px;
  padding-right: 20px;
  left: -20px;
  width: 100%;
  z-index: 10;

  &.systemWarnings {
    overflow-x: hidden;
    background-color: white;
    color: #333333;
    border: #ffb800;
    border-width: 3px;
    border-radius: 8px;
    border-style: solid;
    //width: 987px;
    width: calc(100% - 5px);
  }
  div.rectangular {
    width: 17px;
    height: 70px;
    background: #ffb800;
    margin-left: -2rem;
    border-radius: 8px;
    position: fixed;
  }
`;

const StyledLegatureNotAvaible = styled.div`
  opacity: 50%;
  overflow-y: auto;
  input {
    pointer-events: none;
  }
  .invisible {
    height: 0px;
  }
  .visible {
    padding-right: 20px;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledWarningText = styled.dialog`
  width: 100%;
  height: 70px;
  font-family: Roboto, sans-serif;
  font-size: 18px;
  font-weight: 500;
  border-radius: 8px;
  border: 0;
  position: static;
  margin-left: -10px;
  top: -90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 10;
  > div {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    > svg {
      margin-right: 20px;
    }
  }
`;

const StyledIcoButton = styled.div`
  box-sizing: border-box;
  margin-left: auto;
  height: 25px;
  width: 25px;
  border-radius: 12.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.5);
  .shadowUp {
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.5);
  }
  .shadowDown {
    box-shadow: -1px 1px 3px 0 rgba(0, 0, 0, 0.5);
  }

  svg {
    fill: #333333;
    height: 12px;
    width: auto;
    &.arrowUp {
      transform: rotate(-90deg);
    }
    &.arrowDown {
      transform: rotate(90deg);
    }
  }
`;
