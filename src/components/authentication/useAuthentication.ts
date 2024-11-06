import { createContext, useContext } from "react";
export type AuthType = {
  user: string | undefined;
};

export const authContext = createContext<AuthType>(null as any);

export function useAuth() {
  return useContext(authContext);
}
