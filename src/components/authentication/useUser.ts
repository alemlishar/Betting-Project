import { currentUserFetch } from "src/components/authentication/authentication-api";
import useSWR, { mutate } from "swr";

export const mutateCurrentUserFetch = () => {
  mutate("currentUser");
};

export function useUser() {
  const { data } = useSWR("currentUser", currentUserFetch);

  return { state: data?.result };
}
