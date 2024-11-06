import React, { useContext, useState } from "react";
import sisalLogoWhite from "src/assets/images/sisal-logo-white.png";
import { logoutFetch } from "src/components/authentication/authentication-api";
import { useAuth } from "src/components/authentication/useAuthentication";
import { mutateCurrentUserFetch } from "src/components/authentication/useUser";
import SaldoCassaDialog from "src/components/common/saldoCassaDialog/SaldoCassaDialog";
import { SezioneAttiva, useNavigazioneActions } from "src/components/root-container/useNavigazione";

import { parseAsMoney } from "src/helpers/format-data";

import { commit, version } from "src/version";
import styled, { css } from "styled-components/macro";
import { mutate } from "swr";
import { ReactComponent as IconBordero } from "src/assets/images/bt_bordero.svg";
import { ReactComponent as IconBorderoAcido } from "src/assets/images/bt_bordero_acido.svg";
import { ReactComponent as LogOut } from "../../assets/images/bt_logout_white.svg";
import { ReactComponent as IcoSaldo } from "../../assets/images/bt_saldo.svg";
import ErrorProvider from "../common/saldoCassaDialog/errorContext";
import { KeyboardNavigationContext } from "../root-container/root-container.component";
import { GlobalStateContext } from "src/components/common/context-provider/ContextProvider";

type MainHeaderProps = {
  onOpenVoucher(): void;
  onOpenRecuperaBigliettoDialog(): void;
  sezioneAttiva: SezioneAttiva;
  onOpenLastSoldTicket(): void;
  isSaldoCassaDialogOpen: boolean;
  onSetIsSaldoCassaDialogOpen(isOpen: boolean): void;
  pushToast(content: React.ReactNode, duration: number): void;
};
function MainHeader({
  onOpenVoucher,
  onOpenRecuperaBigliettoDialog,
  sezioneAttiva,
  onOpenLastSoldTicket,
  isSaldoCassaDialogOpen,
  onSetIsSaldoCassaDialogOpen,
  pushToast,
}: MainHeaderProps) {
  const auth = useAuth();
  //const updateMessageTerminale = useUpdateMessageContext();
  const { balanceAmount } = useContext(GlobalStateContext);
  const keyboardNavigationContext = useContext(KeyboardNavigationContext);
  //const [logoutWhite, setLogoutWhite] = useState<boolean>(true);
  const [borderoWhite, setBorderoWhite] = useState<boolean>(true);
  const {
    openSezioneSport,
    openSezioneLive,
    openSezioneVirtual,
    openSezionePrenotazione,
    openSezioneBordero,
  } = useNavigazioneActions();
  const logoutUser = async () => {
    try {
      const { result } = await mutate("logoutUser", logoutFetch());
      if (result.status === "OK") {
      }
    } catch (error) {
      // Handle an error while updating the user here
    } finally {
      mutateCurrentUserFetch();
    }
  };
  const closeSaldoCassaDialog = () => {
    keyboardNavigationContext.current = "smart-search";
    onSetIsSaldoCassaDialogOpen(false);
  };

  return (
    <StyledHeader>
      <div
        css={css`
          position: fixed;
          top: 0px;
          left: 8px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 10px;
        `}
      >
        {commit} {version}
      </div>
      <StyledHeaderTop>
        <img
          alt="sisal-logo"
          src={sisalLogoWhite}
          css={css`
            height: 30px;
            width: auto;
            margin: 0 20px;
          `}
        />
        <ErrorProvider>
          <SaldoCassaDialog isOpen={isSaldoCassaDialogOpen} closeDialog={closeSaldoCassaDialog} pushToast={pushToast} />
        </ErrorProvider>
        <FloatingRight>
          <BorderoIcon
            onClick={() => {
              sezioneAttiva !== "bordero" ? openSezioneBordero() : openSezioneSport();
            }}
            onMouseEnter={() => {
              setBorderoWhite(false);
            }}
            onMouseLeave={() => {
              setBorderoWhite(true);
            }}
          >
            {borderoWhite && sezioneAttiva !== "bordero" && <IconBordero />}
            {(!borderoWhite || sezioneAttiva === "bordero") && <IconBorderoAcido />}
          </BorderoIcon>
          <StyledSaldoCassaBox
            onClick={() => {
              keyboardNavigationContext.current = "dialog-recupera-biglietto";
              onSetIsSaldoCassaDialogOpen(true);
            }}
          >
            <StyledTextSaldoCassa>
              <p className="saldoCassa">SALDO CASSA</p>
              <p className="balance">{parseAsMoney(balanceAmount)}</p>
            </StyledTextSaldoCassa>
            <IcoSaldo />
          </StyledSaldoCassaBox>
          <StyleLogIn>
            <StyleUserText>
              <p className="operatore">OPERATORE</p>
              <p className="user"> {auth.user}</p>
            </StyleUserText>
            <StyleIcon>
              <LogOut
                onClick={() => {
                  logoutUser();
                }}
                title={"Log Out"}
                data-qa="logout"
              />
            </StyleIcon>
          </StyleLogIn>
        </FloatingRight>
      </StyledHeaderTop>
      <StyledHeaderBottom>
        <StyledPrimaryButton
          isActive={sezioneAttiva === "sport"}
          onClick={() => {
            openSezioneSport();
          }}
        >
          Sport
          <StyledKeyboardHint>F1</StyledKeyboardHint>
        </StyledPrimaryButton>
        <StyledPrimaryButton
          isActive={sezioneAttiva === "live"}
          onClick={(event) => {
            openSezioneLive();
          }}
        >
          Live
          <StyledKeyboardHint>F2</StyledKeyboardHint>
        </StyledPrimaryButton>
        <StyledPrimaryButton
          isActive={sezioneAttiva === "virtual"}
          onClick={() => {
            openSezioneVirtual();
          }}
        >
          Virtual
          <StyledKeyboardHint>F3</StyledKeyboardHint>
        </StyledPrimaryButton>
        <StyledPrimaryButton isActive={false}>
          Ippica
          <StyledKeyboardHint>F4</StyledKeyboardHint>
        </StyledPrimaryButton>
        <StyledPrimaryButton isActive={false}>
          Totocalcio
          <StyledKeyboardHint>F5</StyledKeyboardHint>
        </StyledPrimaryButton>
        <StyledPrimaryButton isActive={false}>
          Totogol
          <StyledKeyboardHint>F6</StyledKeyboardHint>
        </StyledPrimaryButton>
        <div
          css={css`
            flex-grow: 1;
          `}
        ></div>
        <StyledHeaderSecondaryButton
          isActive={sezioneAttiva === "prenotazione"}
          css={css`
            background-color: #ffffff;
            color: #333333;
          `}
          onClick={() => {
            openSezionePrenotazione();
          }}
        >
          <StyledHeaderSecondaryButtonTitle>
            Prenotazioni
            <StyledKeyboardHint>F7</StyledKeyboardHint>
          </StyledHeaderSecondaryButtonTitle>
          <StyledTipologyActive isActive={sezioneAttiva === "prenotazione"} />
          <StyledHeaderSecondaryButtonDescription isActive={sezioneAttiva === "prenotazione"}>
            App/web, sala e precompilate
          </StyledHeaderSecondaryButtonDescription>
        </StyledHeaderSecondaryButton>
        <StyledHeaderSecondaryButton
          css={css`
            background-color: #ffffff;
            color: #333333;
          `}
          onClick={() => {
            onOpenVoucher();
          }}
        >
          <StyledHeaderSecondaryButtonTitle>
            Voucher
            <StyledKeyboardHint>F8</StyledKeyboardHint>
          </StyledHeaderSecondaryButtonTitle>
          <StyledHeaderSecondaryButtonDescription isActive={false}>
            Emetti o paga
          </StyledHeaderSecondaryButtonDescription>
        </StyledHeaderSecondaryButton>
        <StyledHeaderSecondaryButton
          css={css`
            background-color: #ffffff;
            color: #333333;
          `}
        >
          <StyledHeaderSecondaryButtonTitle>
            MySisal
            <StyledKeyboardHint>F9</StyledKeyboardHint>
          </StyledHeaderSecondaryButtonTitle>
          <StyledHeaderSecondaryButtonDescription isActive={false}>
            Crea profilo gioco
          </StyledHeaderSecondaryButtonDescription>
        </StyledHeaderSecondaryButton>

        <StyledHeaderSecondaryButton
          onClick={onOpenRecuperaBigliettoDialog}
          css={css`
            min-width: 225px;
          `}
        >
          <StyledHeaderSecondaryButtonTitle data-qa="btn-Recupera-F11">
            Recupera
            <StyledKeyboardHint
              css={css`
                border: none;
                font-family: Roboto;
                font-weight: 700;
              `}
            >
              F11
            </StyledKeyboardHint>
          </StyledHeaderSecondaryButtonTitle>
          <StyledHeaderSecondaryButtonDescription isActive={false}>
            Biglietto da codice
          </StyledHeaderSecondaryButtonDescription>
        </StyledHeaderSecondaryButton>
        <StyledHeaderSecondaryButton
          onClick={onOpenLastSoldTicket}
          css={css`
            min-width: 225px;
          `}
        >
          <StyledHeaderSecondaryButtonTitle>
            Ultimo Biglietto
            <StyledKeyboardHint
              css={css`
                border: none;
                font-family: Roboto;
                font-weight: 700;
              `}
            >
              F12
            </StyledKeyboardHint>
          </StyledHeaderSecondaryButtonTitle>
          <StyledHeaderSecondaryButtonDescription isActive={false}>
            Emesso sul terminale
          </StyledHeaderSecondaryButtonDescription>
        </StyledHeaderSecondaryButton>
      </StyledHeaderBottom>
    </StyledHeader>
  );
}
export const MainHeaderMemo = React.memo(MainHeader);

const StyleIcon = styled.div`
  padding-left: 10px;
  padding-right: 3px;
  padding-top: 9px;
  padding-bottom: 2px;
  color: white;
  border: 1px solid #e0e0e0;
  border-radius: 0px 8px 8px 0px;
  &:hover {
    cursor: pointer;
  }
`;
const StyleLogIn = styled.div`
  height: 40px;
  width: 230px;
  margin-right: 5px;
  padding-left: 2px;
  display: flex;
  align-items: center;
  flex-direction: row;
  &:hover {
    cursor: pointer;
  }
`;

const StyleUserText = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  width: 200px;
  height: 40px;
  padding-right: 3px;
  padding-left: 5px;
  border-radius: 8px 0px 0px 8px;
  p {
    margin: 0px;

    &.operatore {
      height: 15px;
      color: #333333;
      font-family: Roboto;
      font-size: 10px;
      letter-spacing: 0;
      line-height: 13px;
      text-align: right;
    }
    &.user {
      height: 17px;
      color: #333333;
      font-family: Mulish;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0;
      line-height: 14.4px;
      text-align: right;
      text-decoration: none;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 195px;
    }
  }
  svg {
    height: 40px;
    width: 38px;
  }
`;

const StyledHeader = styled.header`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  grid-row: header;
  z-index: 2;
`;

const StyledHeaderTop = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  background-color: #005936;
  height: 55px;
  width: 100%;
  justify-content: space-between;
`;
const FloatingRight = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;

  padding-right: 15px;
  margin-top: 15px;
  justify-items: center;
`;
const StyledHeaderBottom = styled.div`
  display: flex;
  background-color: #ffffff;
  height: 65px;
  width: 100%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
`;

const StyledHeaderSecondaryButton = styled.div<{
  isActive?: boolean;
}>`
  height: 65px;
  background-color: #333333;
  border: none;
  color: #ffffff;
  font-size: ${(props) => (props.isActive ? "1.375rem" : "1.125rem")};
  text-align: left;
  padding: ${(props) => (props.isActive ? "0px 24px " : "11px 10px 13px")};
  position: relative;
  bottom: ${(props) => (props.isActive ? "12px" : "")};
  box-shadow: ${(props) => (props.isActive ? "0px 2px 3px 0px rgba(0, 0, 0, 0.5)" : "")};
  border-radius: ${(props) => (props.isActive ? "4px" : "")};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;
const BorderoIcon = styled.div`
  float: right;
  margin-right: 20px;
  &:hover {
    cursor: pointer;
  }
`;
const StyledHeaderSecondaryButtonTitle = styled.b`
  display: flex;
  font-family: Mulish;
  font-weight: 800;
  font-size: 1.125rem;
`;

const StyledTipologyActive = styled.div<{ isActive: boolean }>`
  height: 6px;
  /* width: 100%; */
  width: calc(100% - 20px);
  position: absolute;
  bottom: 0;
  left: 10px;
  background-color: ${(props) => (props.isActive ? "#aac21f" : "")};
`;

const StyledHeaderSecondaryButtonDescription = styled.small<{
  isActive: boolean;
}>`
  display: ${(props) => (props.isActive ? "none" : "block")};
  font-size: 0.875rem;
  opacity: 0.8;
  font-family: Roboto;
`;

const StyledPrimaryButton = styled.div<{
  isActive: boolean;
}>`
  border-radius: 4px;
  box-shadow: ${(props) => (props.isActive ? "0px 2px 3px 0px rgba(0, 0, 0, 0.5)" : "")};
  font-family: Mulish;
  font-weight: 900;
  font-size: ${(props) => (props.isActive ? "1.375rem" : "1.25rem")};
  display: flex;
  align-items: center;
  margin: 0px 15px;
  padding: ${(props) => (props.isActive ? "0px 16px" : "")};
  position: relative;
  bottom: ${(props) => (props.isActive ? "12px" : "")};
  background-color: #ffffff;
  border-bottom: ${(props) => (props.isActive ? "8px solid #AAC21F" : "")};
  color: #333333;
  &:hover {
    cursor: pointer;
  }
`;

const StyledKeyboardHint = styled.div`
  height: 15px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 3px 6px;
  font-family: Mulish;
  font-weight: 900;
  font-size: 0.813rem;
  color: #000000;
  margin-left: 3.5px;
`;
const StyledSaldoCassaBox = styled.div`
  height: 40px;
  width: 165px;
  margin-right: 8px;
  // margin-top: 13px;
  display: flex;
  align-items: center;
  flex-direction: row;
  &:hover {
    cursor: pointer;
  }
`;
const StyledTextSaldoCassa = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  width: 120px;
  height: 40px;
  padding-right: 8px;
  border-radius: 8px 0px 0px 8px;
  p {
    margin: 0px;

    &.saldoCassa {
      height: 15px;
      color: #333333;
      font-family: Roboto;
      font-size: 10px;
      letter-spacing: 0;
      line-height: 13px;
      text-align: right;
    }
    &.balance {
      height: 17px;
      color: #333333;
      font-family: Mulish;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0;
      line-height: 14.4px;
      text-align: right;
    }
  }
  svg {
    height: 40px;
    width: 38px;
  }
`;
