import React, { useContext } from "react";
import { ReactComponent as IconDangerWhite } from "src/assets/images/icon-danger-white.svg";
import { ReactComponent as IconDanger } from "src/assets/images/icon-danger.svg";
import { ReactComponent as IconDoneWhite } from "src/assets/images/icon-done-white.svg";
import { ReactComponent as IconHourGlass } from "src/assets/images/icon-hourglass.svg";
import { StyledDialogContainer } from "src/components/common/full-screen-alert/StyledDialogContainer";
import { KeyboardNavigationContext } from "src/components/root-container/root-container.component";
import styled, { css } from "styled-components/macro";

export type BlockingAlertProps = {
  item: React.ReactNode;
};

// TODO: valutare se impostare la modale centrata (css) già in questo componente
export const BlockingAlert = ({ item }: BlockingAlertProps) => {
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  keyboardNavigationContext.current = "blocking-operation"; // DEBT
  return <>{item}</>;
};

type typeAlertColor = ReturnType<typeof alertColors>;
type AlertProps = {
  type: AlertType;
  heading: React.ReactNode;
  description: React.ReactNode;
  hasHourGlassIcon?: boolean;
  onClose?: () => void;
  primaryButtonAction?: () => void;
  primaryButtonText?: React.ReactNode;
  secondaryButtonAction?: () => void;
  secondaryButtonText?: React.ReactNode;
};

export function Alert(props: AlertProps) {
  const { type, hasHourGlassIcon } = props;
  switch (type) {
    case "success":
      return <AlertTemplate {...props} Icon={IconDoneWhite} themeAlert={alertColors(type)} />;
    case "warning":
      return (
        <AlertTemplate {...props} Icon={hasHourGlassIcon ? IconHourGlass : IconDanger} themeAlert={alertColors(type)} />
      );
    case "danger":
      return <AlertTemplate {...props} Icon={IconDangerWhite} themeAlert={alertColors(type)} />;
  }
}

function AlertTemplate(
  props: AlertProps & { themeAlert: typeAlertColor; Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> },
) {
  const {
    type,
    heading,
    description,
    onClose,
    themeAlert,
    Icon,
    primaryButtonAction,
    primaryButtonText,
    secondaryButtonAction,
    secondaryButtonText,
  } = props;

  return (
    <StyledDialogContainer
      onClick={(event) => {
        if (type !== "warning" && onClose && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          background-color: ${themeAlert.backgroundColor};
          height: 128px;
          width: 1065px;
          border-radius: 8px 8px 0 0;
          box-sizing: border-box;
          padding: 0 30px;
        `}
      >
        <StyledAlertTitle themeAlert={themeAlert} hasOnCloseButton={!!onClose}>
          <Icon style={{ gridRow: `-1 / 1`, gridColumn: `icon`, height: `58px`, width: `58px` }} />
          <StyledHeading themeAlert={themeAlert}>{heading}</StyledHeading>
        </StyledAlertTitle>
      </div>

      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 30px;
          width: 1065px;
          border-radius: 0 0 8px 8px;
          box-sizing: border-box;
          background-color: #ffffff;
          color: #333333;
        `}
      >
        <StyledDescription>{description}</StyledDescription>

        {(primaryButtonText || secondaryButtonText) && (
          <div
            css={css`
              display: grid;
              grid-template-columns: repeat(${primaryButtonText && secondaryButtonText ? 2 : 1}, [button] auto);
              grid-column-gap: 10px;
              justify-content: flex-end;
              margin-top: 30px;
            `}
          >
            {secondaryButtonAction && secondaryButtonText && (
              <StyledAlertButtonSecondary
                onClick={() => {
                  secondaryButtonAction();
                }}
              >
                {secondaryButtonText}
              </StyledAlertButtonSecondary>
            )}

            {primaryButtonAction && primaryButtonText && (
              <StyledAlertButtonPrimary
                onClick={() => {
                  primaryButtonAction();
                }}
              >
                {primaryButtonText}
              </StyledAlertButtonPrimary>
            )}
          </div>
        )}
      </div>
    </StyledDialogContainer>
  );
}

export const StyledAlertTitle = styled.div<{ themeAlert: typeAlertColor; hasOnCloseButton?: boolean }>`
  display: grid;
  grid-template-columns: [icon] 58px [message] auto;
  align-items: center;
  column-gap: 30px;
  grid-row-gap: 1px;
  width: 100%;
`;

export const StyledHeading = styled.div<{ themeAlert: typeAlertColor }>`
  grid-column: message;
  color: ${(props) => props.themeAlert.textColor};
  font-family: Mulish;
  font-weight: 800;
  font-size: 1.875rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-word;
  overflow: hidden;
`;

export const StyledDescription = styled.div`
  font-family: Roboto;
  font-size: 1.125rem;
  display: -webkit-box;
  line-height: 21px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  word-break: break-word;
  overflow: hidden;
`;

export const StyledAlertButton = styled.button`
  height: 50px;
  min-width: 150px;
  border-radius: 8px;
  font-family: Mulish;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  padding: 0 30px;
  border: none;
  cursor: pointer;
  &:hover {
    filter: brightness(0.9);
  }
`;

export const StyledAlertButtonPrimary = styled(StyledAlertButton)`
  background-color: #333333;
  color: #ffffff;
`;

export const StyledAlertButtonSecondary = styled(StyledAlertButton)`
  border: 2px solid #333333;
  background-color: #ffffff;
  color: #333333;
`;

type AlertType = "success" | "warning" | "danger";
export function alertColors(type: AlertType) {
  switch (type) {
    case "success":
      return {
        backgroundColor: "#0B7D3E",
        textColor: "#FFFFFF",
        borderColor: "#FFFFFF",
      };
    case "warning":
      return {
        backgroundColor: "#FFB800",
        textColor: "#333333",
        borderColor: "#333333",
      };
    default:
      return {
        backgroundColor: "#EB1E23",
        textColor: "#FFFFFF",
        borderColor: "#FFFFFF",
      };
  }
}
