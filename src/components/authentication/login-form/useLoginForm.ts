import { useState } from "react";
import { loginFetch } from "src/components/authentication/authentication-api";
import configuration from "src/helpers/configuration";
import { mutate } from "swr";

export const useLoginForm = () => {
  const [inputs, setInputs] = useState({ username: "", password: "" });

  const [error, setError] = useState("");
  const handleSubmit = async (event: React.FormEvent) => {
    if (event) {
      event.preventDefault();
      const newUser = {
        user: inputs.username ?? "",
        password: inputs.password ?? "",
      };
      try {
        const response = await mutate("loginUser", loginFetch(newUser));

        if (response["result"] && response["result"]["status"] === configuration.RESPONSE_FETCH.LOGIN_USER_LOGGED_IN) {
          setError("");
          return;
        } else {
          setError(response["error"]["code"] + " " + response["error"]["message"]);
        }
      } catch (error) {
        setError(error);
      } finally {
        mutate("currentUser");
      }
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setInputs({ ...inputs, [event.target.name]: event.target.value });
  };
  return {
    handleSubmit,
    handleInputChange,
    inputs,
    error,
  };
};
