import React from "react";
import Helmet from "react-helmet";
import { Authentication } from "src/components/authentication/Authentication";
import { authContext } from "src/components/authentication/useAuthentication";
import { useUser } from "src/components/authentication/useUser";
import RootContainer from "src/components/root-container/root-container.component";
import configuration from "src/helpers/configuration";
import { I18nProvider } from "src/i18n/I18nProvider";

export default function App() {
  const user = useUser();
  return (
    <authContext.Provider value={{ user: user.state }}>
      <I18nProvider>
        <Helmet>
          <style type="text/css">
            {`body {
                        margin: 0;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                      }
                      * {
                        user-select: none;
                        font-family: Roboto, sans-serif;
                      }
                    `}
          </style>
        </Helmet>
        {user.state !== configuration.RESPONSE_FETCH.CURRENT_USER_NOT_LOGGED ? <RootContainer /> : <Authentication />}
      </I18nProvider>
    </authContext.Provider>
  );
}
