import { atom } from "recoil";

type AuthPageState = "login" | "register" | "forgotPassword";

const initalAuthPageState: AuthPageState = "login";

export const authPageState = atom<AuthPageState>({
  key: "authPageState",
  default: initalAuthPageState,
});
