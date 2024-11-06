import React, { useState } from "react";
import styled, { css } from "styled-components/macro";
import LogInBg from "src/assets/images/bg_photo.png";
import { ReactComponent as SisalLogo } from "src/assets/images/logo_colorato.svg";
import { ReactComponent as ComputerLogo } from "src/assets/images/ico_tg.svg";
import { FormattedMessage } from "react-intl";
import { LoginForm } from "src/components/authentication/login-form/LoginForm";

export function Authentication() {
  const [errorImgBg, setErrorImgBg] = useState(false);
  return (
    <StyledContainer>
      <StyledContent>
        <StyledSisalLogo>
          <SisalLogo
            css={css`
              height: 70px;
              width: 330px;
              padding-bottom: 15px;
              padding: 0px 20px;
              background-color: transparent;
              border-radius: 8px;

              font-size: 22px;
              color: #fff;
              font-family: Roboto;
              margin: 0 auto;
              font-weight: bold;
            `}
          />
        </StyledSisalLogo>
        <StyleComputerLogo>
          <StyledTerminalConteiner>
            <ComputerLogo
              css={css`
                padding: 0px 20px;
                box-sizing: border-box;
                height: 103px;
                width: 103px;
                border: 3px solid #333333;
                border-radius: 8px;
                font-size: 22px;
                color: #fff;
                margin: 0;
                font-weight: bold;
              `}
            />
            <StyledTerminalText>
              <h4>
                <FormattedMessage description="Authentication: title" defaultMessage="Terminale di gioco" />
              </h4>

              <span>
                <FormattedMessage
                  description="Authentication: description"
                  defaultMessage=" Accedi a tutte le funzionalità {br} di vendita e gestione"
                  values={{ br: <br /> }}
                />
              </span>
            </StyledTerminalText>
          </StyledTerminalConteiner>
        </StyleComputerLogo>
      </StyledContent>
      <StyledContentForm isErrorImgBg={errorImgBg}>
        {!errorImgBg && <StyledFormBg src={LogInBg} onError={() => setErrorImgBg(true)} />}
        <LoginForm />
      </StyledContentForm>
    </StyledContainer>
  );
}

const StyledTerminalConteiner = styled.div`
  border: rgba(0, 0, 0, 0.24);
  position: relative;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.24);
  width: 555px;
  height: 120px;
  font-size: 18px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
  align-items: left;
  align-content: flex-end;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &::before {
    content: "";
    height: 10px;
    width: 495px;
    position: absolute;
    bottom: 0;
    background-color: #bed62f;
  }
`;
const StyledTerminalText = styled.div`
  display: flex;
  flex-direction: column;
  color: #333333;
  margin-left: 20px;
  flex: 1;
  span {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 24px;
    color: #777777;
    margin: 0;
  }
  h4 {
    margin: 0 0 8px 0;
    font-size: 32px;
  }
`;

const StyledContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  display: grid;
  align-items: center;
  grid-template-columns: [terminale] 50% [login] 50%;
  font-family: Roboto;
`;
const StyledContent = styled.div`
  grid-column: terminale;
  align-items: center;
  grid-template-rows: [sisalLogo] 365px [computerLogo] 100px;
  display: grid;
  height: 100vh;
`;
const StyledSisalLogo = styled.div`
  grid-row: sisalLogo;
  align-items: center;
  overflow: hidden;
  display: grid;
`;
const StyleComputerLogo = styled.div`
  grid-row: computerLogo;
  align-items: center;
  display: grid;
  > p {
    font-size: 18px;
    font-family: Mulish;
    font-weight: 900;
  }
`;
const StyledContentForm = styled.div<{ isErrorImgBg: boolean }>`
  grid-column: login;
  align-items: center;
  display: grid;
  height: 100vh;
  position: relative;
  background-color: ${(props) => (props.isErrorImgBg ? "#333" : "#FFF")};
  overflow-y: hidden;
`;
const StyledFormBg = styled.img`
  position: absolute;
  top: 0;
`;
