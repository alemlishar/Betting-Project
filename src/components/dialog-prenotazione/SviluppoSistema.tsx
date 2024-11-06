import { useMemo, useState } from "react";
import { SviluppoSistema as SviluppoSistemaType } from "src/components/prenotazioni/prenotazioni-api";
import { orderBy } from "lodash";
import styled, { css } from "styled-components/macro";
import icoArrowDownGrey from "src/assets/images/icon-arrow-down-light-grey.svg";
import icoArrowUpGrey from "src/assets/images/icon-arrow-up-light-grey.svg";
import { FormattedMessage } from "react-intl";
import { formatCurrency, decimalToIntegerValue } from "src/helpers/formatCurrencyAmountUtils";

type SviluppoSistemaProps = {
  sviluppoSistema: SviluppoSistemaType;
};

export function SviluppoSistema({ sviluppoSistema }: SviluppoSistemaProps) {
  const sviluppoByCardinalitaOrdered = useMemo(
    () =>
      sviluppoSistema
        ? orderBy(
            Object.values(sviluppoSistema.sviluppoByCardinalita).filter((sviluppo) => sviluppo.importo),
            [(sviluppo) => sviluppo.cardinalita],
            ["desc"],
          )
        : [],
    [sviluppoSistema],
  );

  const [accordionToggle, setAccordionToggle] = useState<Record<number, boolean>>({});

  const toggleAccordionByCardinalita = (cardinalita: number) => {
    setAccordionToggle((s) => ({ ...s, [cardinalita]: !accordionToggle[cardinalita] }));
  };

  return (
    <div>
      <div
        css={css`
          color: #000000;
          font-family: Roboto;
          font-size: 20px;
          font-weight: bold;
          margin: 30px 0 25px;
        `}
      >
        <FormattedMessage
          description="Header Dettaglio sistema  dettaglio Prenotazione "
          defaultMessage="Dettaglio sistema"
        />
      </div>

      {sviluppoByCardinalitaOrdered.map((sviluppo, sviluppoIndex) => (
        <div
          key={sviluppo.cardinalita}
          css={css`
            display: grid;
            grid-template-columns: [cardinalita] max-content [costo] auto [numeroSviluppi] minmax(38px, max-content) [arrow] minmax(
                12px,
                max-content
              );
            grid-template-rows: ${accordionToggle[sviluppo.cardinalita]
              ? "[head] min-content [separator] 20px [costoTotale] min-content [vincitaMin] min-content [vincitaMax] min-content"
              : "[costoTotale] min-content [vincitaMin] min-content [vincitaMax] min-content"};
            align-items: center;
            grid-column-gap: 10px;
            font-family: Roboto;
            font-size: 1.125rem;
            box-sizing: border-box;
            margin-bottom: 1px;
            padding: 30px;
            background-color: #f3f3f3;
            border-top-left-radius: ${sviluppoIndex === 0 ? "8px" : "0"};
            border-top-right-radius: ${sviluppoIndex === 0 ? "8px" : "0"};
            border-bottom-right-radius: ${sviluppoByCardinalitaOrdered.length === sviluppoIndex + 1 ? "8px" : "0"};
            border-bottom-left-radius: ${sviluppoByCardinalitaOrdered.length === sviluppoIndex + 1 ? "8px" : "0"};
          `}
          onClick={() => toggleAccordionByCardinalita(sviluppo.cardinalita)}
        >
          {/* HEADER ACCORDION */}
          <StyledSviluppoGridRow
            gridColumn={"cardinalita"}
            gridRow={"head"}
            css={css`
              font-weight: bold;
            `}
          >
            <FormattedMessage
              description="sviluppo della cardinalità"
              defaultMessage="{cardinalita} <b> su {eventsNumber}</b>"
              values={{
                cardinalita: sviluppo.cardinalita,
                b: (chunks: string) => (
                  <span
                    css={css`
                      color: #7b7b7b;
                    `}
                  >
                    {chunks}
                  </span>
                ),
                eventsNumber: sviluppoSistema?.numeroAvvenimentiBase,
              }}
            />
          </StyledSviluppoGridRow>
          <StyledSviluppoGridRow
            gridColumn={"costo"}
            gridRow={"head"}
            css={css`
              font-weight: bold;
              color: #444444;
              text-align: right;
            `}
          >
            {formatCurrency(decimalToIntegerValue(sviluppo.importo))}
          </StyledSviluppoGridRow>
          <div
            css={css`
              grid-row: head;
              grid-column: numeroSviluppi;
              text-align: center;
              color: #333333;
              font-family: Roboto;
              font-size: 1rem;
              background-color: #ffffff;
              border-radius: 12px;
              box-sizing: border-box;
              padding: 1px;
            `}
          >
            <FormattedMessage
              description="moltiplicatore sviluppo "
              defaultMessage="x{sviluppo}"
              values={{ sviluppo: sviluppo.numeroSviluppi }}
            />
          </div>
          <StyledArrow
            css={css`
              grid-row: head;
              grid-column: arrow;
              width: 12px;
              height: auto;
            `}
            src={accordionToggle[sviluppo.cardinalita] ? icoArrowUpGrey : icoArrowDownGrey}
            alt={"icon close select"}
          />

          {/* BODY ACCORDION */}
          {accordionToggle[sviluppo.cardinalita] && (
            <>
              <StyledSviluppoGridRow gridColumn={"cardinalita"} gridRow={"costoTotale"}>
                <FormattedMessage
                  description="Total cost description in system development"
                  defaultMessage="Costo Totale"
                />
              </StyledSviluppoGridRow>
              <StyledSviluppoGridRow
                gridColumn={"costo"}
                gridRow={"costoTotale"}
                css={css`
                  font-weight: bold;
                  text-align: right;
                  color: #000000;
                `}
              >
                {formatCurrency(decimalToIntegerValue(sviluppo.importoTotale))}
              </StyledSviluppoGridRow>
              <StyledSviluppoGridRow
                gridColumn={"cardinalita"}
                gridRow={"vincitaMin"}
                css={css`
                  font-size: 1rem;
                `}
              >
                <FormattedMessage
                  defaultMessage="Vincita Minima per combinazione"
                  description="minumum win for combination in system development"
                />
              </StyledSviluppoGridRow>
              <StyledSviluppoGridRow
                gridColumn={"costo"}
                gridRow={"vincitaMin"}
                css={css`
                  text-align: right;
                `}
              >
                {formatCurrency(decimalToIntegerValue(sviluppo.vincitaMinima))}
              </StyledSviluppoGridRow>
              <StyledSviluppoGridRow
                gridColumn={"cardinalita"}
                gridRow={"vincitaMax"}
                css={css`
                  font-size: 1rem;
                `}
              >
                <FormattedMessage
                  defaultMessage="Vincita Massima per combinazione"
                  description="maximum win for combination in system development"
                />
              </StyledSviluppoGridRow>
              <StyledSviluppoGridRow
                gridColumn={"costo"}
                gridRow={"vincitaMax"}
                css={css`
                  text-align: right;
                `}
              >
                {formatCurrency(decimalToIntegerValue(sviluppo.vincitaMassima))}
              </StyledSviluppoGridRow>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const StyledArrow = styled.img`
  width: 12px;
  height: 9px;
  margin-left: 4px;
  margin-right: 4px;
`;

const StyledSviluppoGridRow = styled.div<{ gridRow: string; gridColumn: string }>`
  grid-row: ${(props) => props.gridRow};
  grid-column: ${(props) => props.gridColumn};
  font-family: Roboto;
  color: #333333;
`;
