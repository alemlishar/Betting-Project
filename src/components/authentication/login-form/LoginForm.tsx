import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { AlertBox } from "src/components/common/alert-box/AlertBox";
import styled from "styled-components";

import { ReactComponent as EyeClosed } from "src/assets/images/ic_eye_blind.svg";
import { ReactComponent as EyeOpen } from "src/assets/images/ic_eye.svg";
import configuration from "src/helpers/configuration";
import { useLoginForm } from "src/components/authentication/login-form/useLoginForm";

export function LoginForm() {
  const [iconRevealPassword, setIconRevealPassword] = useState(false);
  const { inputs, handleInputChange, handleSubmit, error } = useLoginForm();
  const isError = error.length > 0;

  return (
    <Form onSubmit={handleSubmit}>
      <ContentMess>
        {isError && (
          <AlertBox
            alertType="error"
            message={{
              text: (
                <FormattedMessage
                  description="login Error: {message}"
                  defaultMessage="{message}"
                  values={{ message: error }}
                />
              ),
            }}
            customStyle={{ width: "370px", height: "50px", fontSize: "16px", top: "50px" }}
          />
        )}
      </ContentMess>
      <InputLogin
        error={isError}
        placeholder="User Name"
        value={inputs.username ?? ""}
        name="username"
        required={true}
        onInput={handleInputChange}
        data-qa="username"
      />
      <ContentMess />
      <StyledPasswordWapper>
        <StyledEyeOpenIcon onClick={() => setIconRevealPassword((value) => !value)}>
          {iconRevealPassword ? <EyeOpen /> : <EyeClosed />}
        </StyledEyeOpenIcon>
        <InputPasswordLogin
          error={isError}
          placeholder="Password"
          type={iconRevealPassword ? "text" : "password"}
          value={inputs.password ?? ""}
          name="password"
          required={true}
          onInput={handleInputChange}
          data-qa="password"
        />
      </StyledPasswordWapper>
      <LoginButton type="submit" data-qa="login">
        <FormattedMessage description="text button login" defaultMessage="Accedi al Terminale" />
      </LoginButton>
      <StyledInfoConteiner>
        <StyledInfoText>
          <h4>
            <FormattedMessage description="title info authentication" defaultMessage="Problemi con l'accesso?" />
          </h4>

          <span>
            <FormattedMessage
              description="description info authentication"
              defaultMessage="Chiedi al referente del tuo punto vendita o contatta il Customer Service"
            />
          </span>
        </StyledInfoText>
        <StyledInfoNumber>
          <span>
            <FormattedMessage
              description="title info Customer Service authentication"
              defaultMessage="Customer Service"
            />
          </span>
          <StyledTelNumber>{configuration.NUNBER_CUSTOMER_SERVICE}</StyledTelNumber>
        </StyledInfoNumber>
      </StyledInfoConteiner>
    </Form>
  );
}

const Form = styled.form`
  align-items: center;
  align-self: center;
  position: relative;
  grid-template-rows: 200px 75px 75px 75px 500px auto;
  display: grid;
  height: 100vh;
  &:valid button {
    opacity: 1;
  }
`;

const InputLogin = styled.input<{ error: boolean; value?: string }>`
  height: 70px;
  width: 330px;
  padding-bottom: 15px;
  padding: 0px 20px;

  background-color: transparent;
  border-radius: 8px;

  font-size: 22px;
  color: #fff;
  margin: 0 auto;
  font-weight: bold;

  opacity: ${(props) => (props.value ? "100%" : "50%")};
  border: ${(props) => (props.error ? " 2px solid red" : " 1px solid #fff")};
  &::placeholder {
    color: #fff;
    opacity: 70%;
  }
  &:disabled {
    color: #979797;
    background-color: transparent;
  }
  &:focus {
    outline: none;
    border: 4px solid #bed62f;
    background-color: transparent;
    opacity: 100%;
  }
  &:required {
    opacity: 100%;
  }
  > div {
    display: flex;
    align-items: center;

    svg {
      position: relative;
      right: 16px;
      top: 0px;

      path {
        fill: #ffffff;
      }
      circle {
        stroke: #ffffff;
      }
    }
  }
`;
const InputPasswordLogin = styled(InputLogin)`
  padding-right: 60px;
  width: 290px;
`;
const ContentMess = styled.div`
  height: 80px;
`;

const LoginButton = styled.button`
  height: 70px;
  width: 387px;
  border: none;
  font-size: 24px;
  border-radius: 8px;
  background-color: #aac21f;
  color: white;
  font-style: italic;
  margin: 0 auto;
  opacity: 0.7;
  cursor: pointer;
  &:disabled {
    background-color: #aac21f;
    cursor: default;
  }
  &:focus {
    outline: 0px;
  }
  &:hover {
    background-color: #9cb31d;
    outline: 0px;
  }
`;

const StyledInfoNumber = styled.div`
  font-size: 18px;
  flex: 1;
  text-align: center;
  span {
    letter-spacing: 4.3px;
    text-transform: uppercase;
    font-size: 16px;
  }
`;
const StyledTelNumber = styled.div`
  font-size: 39px;
  font-weight: 500;
`;
const StyledEyeOpenIcon = styled.div`
  position: absolute;
  padding: 25px;
  right: 0;
  z-index: 9;
  opacity: 50%;
`;
const StyledPasswordWapper = styled.div`
  position: relative;
  margin: 0 auto;
`;
const StyledInfoConteiner = styled.div`
  width: 640px;
  height: 100px;
  border-radius: 8px;
  font-size: 18px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
  background-color: rgba(50, 205, 50, 0.2);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const StyledInfoText = styled.div`
  font-size: 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  h4 {
    margin: 0;
  }
`;
