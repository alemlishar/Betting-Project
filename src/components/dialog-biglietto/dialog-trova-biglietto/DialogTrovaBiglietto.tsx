import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import styled from "styled-components/macro";
import closeDialog from "../../../assets/images/closeDialog.png";
import { MessagesMapping, MessagesMappingEnum } from "../../../mapping/MessagesMapping";
import { AlertBox } from "../../common/alert-box/AlertBox";

export function DialogTrovaBiglietto({
  onTicketCodeChange,
  ticketError,
}: {
  onTicketCodeChange(ticketId: string): void;
  ticketError:
    | {
        code: MessagesMappingEnum;
        message: string;
        description: string;
      }
    | undefined
    | boolean;
}) {
  const [ticketCode, setTicketCode] = useState("");
  const ticketErrorMessages = ticketError &&
    typeof ticketError !== "boolean" && {
      message: MessagesMapping.whichMessage(ticketError.code),
      messageDetails: MessagesMapping.whichMessageDetails(ticketError.code),
    };
  const ticketErrorMessages404 = ticketError &&
    typeof ticketError === "boolean" && {
      message: <FormattedMessage description="404 error response" defaultMessage="Servizio non disponibile" />,
      messageDetails: "",
    };

  const modalElement = useRef<HTMLDivElement | null>(null);
  const spacedTicketCode = () => {
    const splitTicketCode = ticketCode.split("");
    return insertSpaceEachFourItems(splitTicketCode).join("");
  };

  const ticketCodeMatchesPattern = () => stringMatchesPatterns(ticketCode, [sportRegex, virtualRegex, horsesRegex]);

  const ticketCodeMatchesProgressivePattern = () =>
    stringMatchesProgressivePattern(ticketCode, [sportRegex, virtualRegex, horsesRegex]);

  const spacedProgressiveRegex = (): string => {
    const spacedSportRegex = insertSpaceEachFourItems(sportRegex);
    const spacedVirtualRegex = insertSpaceEachFourItems(virtualRegex);
    const spacedHorsesRegex = insertSpaceEachFourItems(horsesRegex);
    return `(${makeProgressiveRegex(spacedSportRegex)})|(${makeProgressiveRegex(
      spacedVirtualRegex,
    )})|(${makeProgressiveRegex(spacedHorsesRegex)})`;
  };

  const buttonIsDisabled = !ticketCodeMatchesPattern();

  // Tab Cage
  useEffect(() => {
    const focusinHandler = (event: FocusEvent) => {
      if (modalElement.current) {
        if (!modalElement.current.contains(event.target as any)) {
          modalElement.current.focus();
        }
      }
    };
    document.addEventListener("focusin", focusinHandler, true);
    return () => {
      document.removeEventListener("focusin", focusinHandler, true);
    };
  }, []);

  //DEBT
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (keyboardNavigationContext.current === "blocking-operation") {
        return;
      }
      if (event.key === "Enter" && !buttonIsDisabled) {
        onTicketCodeChange(ticketCode);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [buttonIsDisabled, onTicketCodeChange, ticketCode, keyboardNavigationContext]);

  return (
    <StyledTrovaBigliettoWrapper open>
      {ticketErrorMessages && (
        <AlertBox
          alertType="error"
          message={{ text: ticketErrorMessages.message, details: ticketErrorMessages.messageDetails }}
        />
      )}
      {ticketErrorMessages404 && (
        <AlertBox
          alertType="error"
          message={{ text: ticketErrorMessages404.message, details: ticketErrorMessages404.messageDetails }}
        />
      )}

      {ticketCode.length > 0 && !ticketCodeMatchesProgressivePattern() && (
        <AlertBox
          alertType="error"
          message={{ text: MessagesMapping.whichMessage(MessagesMappingEnum.ERROR_CODE_NOT_VALID_TICKET) }}
        />
      )}
      <StyledTrovaBiglietto ref={modalElement} tabIndex={0}>
        <StyledDialogForm
          onSubmit={(event) => {
            event.preventDefault();
            onTicketCodeChange(ticketCode);
          }}
        >
          <StyledDialogTitle>Recupera Biglietto</StyledDialogTitle>
          <StyledDialogText>Inserisci il codice IB che trovi sul biglietto emesso</StyledDialogText>
          <StyledInput
            type="search"
            placeholder="DF07 E401 1A0E 5608 C70A"
            onChange={(event) => {
              setTicketCode(event.target.value.replace(/ /g, ""));
            }}
            data-qa="recupera-biglietto-ib-text"
            value={spacedTicketCode()}
            pattern={spacedProgressiveRegex()}
            autoFocus={true}
          />
          <StyledPrimaryButton
            data-qa={`recupera-biglietto-btnprocedi-${buttonIsDisabled ? "disabled" : "enabled"}`}
            disabled={buttonIsDisabled}
          >
            Procedi
          </StyledPrimaryButton>
        </StyledDialogForm>
      </StyledTrovaBiglietto>
    </StyledTrovaBigliettoWrapper>
  );
}

// 20 chars, begins with DF
export const sportRegex = ["(D|d)", "(F|f)", ...new Array(18).fill("[a-zA-Z0-9]")];

// 12 chars, begins with EC
export const virtualRegex = ["(E|e)", "(C|c)", ...new Array(10).fill("[a-zA-Z0-9]")];

// 12 chars, begins with A
export const horsesRegex = ["(A|a)", ...new Array(11).fill("[a-zA-Z0-9]")];

// Utils
// common functions to be moved elsewhere
export const insertSpaceEachFourItems = (baseArray: Array<any>): Array<any> => {
  const array = [...baseArray];
  const spacesNumber = Math.floor(array.length / 4);
  for (let i = 0; i < spacesNumber; i++) {
    const spacePosition = (i + 1) * 4 + i;
    if (array.length > spacePosition && array[spacePosition].trim().length) {
      array.splice(spacePosition, 0, " ");
    }
  }
  return array;
};

const makeRegex = (regexArray: Array<string>): string =>
  `(^(${regexArray.reduce((accumulator, current) => accumulator + current, "")})$)`;

export const makeProgressiveRegex = (regexArray: Array<string>): string =>
  regexArray.map((_, index, array) => `(^(${array.slice(0, index + 1).join("")})$)`).join("|");

export const stringMatchesPatterns = (ticketCode: string, patterns: Array<Array<string>>): boolean => {
  const commonRegex = patterns.reduce((merged, pattern) => `${merged}(${makeRegex(pattern)})|`, "").slice(0, -1);
  return new RegExp(commonRegex).test(ticketCode);
};

const stringMatchesProgressivePattern = (ticketCode: string, patterns: Array<Array<string>>): boolean => {
  const commonProgressiveRegex = patterns
    .reduce((merged, pattern) => `${merged}(${makeProgressiveRegex(pattern)})|`, "")
    .slice(0, -1);
  return new RegExp(commonProgressiveRegex).test(ticketCode);
};

const StyledTrovaBigliettoWrapper = styled.dialog`
  position: relative;
  border: 0;
  padding: 0;
  background-color: transparent;
`;

const StyledTrovaBiglietto = styled.div`
  width: 566px;
  height: 355px;
  color: #555;
  padding: 0;
  border: none;
  background-color: transparent;
`;

const StyledDialogForm = styled.form`
  display: flex;
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-sizing: border-box;
  padding: 52px 60px 60px 60px;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledDialogTitle = styled.p`
  font-family: Mulish;
  font-weight: 800;
  font-size: 1.875rem;
  line-height: 38px;
  color: #333333;
  margin: 0 0 5px 0;
`;

export const StyledDialogText = styled.p`
  font-family: Roboto;
  font-weight: 400;
  font-size: 1.125rem;
  line-height: 21px;
  color: #333333;
  margin: 0 0 35px 0;
`;

const StyledInput = styled.input`
  align-self: center;
  width: 330px;
  padding: 15.76px;
  border: 4px solid #bebebe;
  border-radius: 8px;
  font-size: 1.25rem;
  caret-color: #a0b800;
  margin-bottom: 20px;
  text-transform: uppercase;

  &:focus {
    border: 4px solid #a0b800;
    outline-color: transparent;
  }

  &:invalid {
    border: 4px solid #eb1e23;
  }

  &::placeholder {
    font-family: Roboto;
    font-weight: 300;
    font-style: italic;
    color: #909090;
    font-size: 1.25rem;
    opacity: 1;
  }

  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    background-image: url(${closeDialog});
    height: 18px;
    width: 18px;
  }
`;

const StyledPrimaryButton = styled.button`
  width: 330px;
  font-family: Roboto;
  font-size: 1.375rem;
  font-weight: 700;
  padding: 17px;
  background-color: #005936;
  color: white;
  border: none;
  align-self: center;
  border-radius: 8px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
