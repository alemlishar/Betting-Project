import { UserType } from "src/components/authentication/authenticationTypes";
import { fetchJSONplain, fetchPostJSONplain } from "src/helpers/fetch-json";
import { APIResponseType } from "src/types/apiResponse.types";

export type LoginFetchdResponse =
  | { result: string }
  | {
      error: {
        code: string;
        message: string;
        description: string;
      };
    };

export function loginFetch(paramsUser: UserType): Promise<APIResponseType<LoginFetchdResponse>> {
  return fetchPostJSONplain(`${process.env.REACT_APP_ENDPOINT}/authentication/userLogin`, paramsUser);
}
export function logoutFetch(): Promise<APIResponseType<{ staste: string }>> {
  return fetchJSONplain(`${process.env.REACT_APP_ENDPOINT}/authentication/userLogout`);
}
export function currentUserFetch(): Promise<APIResponseType<string>> {
  return fetchJSONplain(`${process.env.REACT_APP_ENDPOINT}/authentication/currentUser`);
}
