import type { createAuth, VerifyLoginPayloadParams } from "thirdweb/auth";

type Auth = ReturnType<typeof createAuth>;
type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "strict";
  path: string;
  maxAge: number;
};
export type CookieStore = {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options: CookieOptions): unknown;
};

export const SESSION_SECONDS = 60 * 60 * 24;
export const CHALLENGE_SECONDS = 5 * 60;
const nonceCookie = "dracoria-login-nonce";
const cookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
  maxAge,
});

// Request-scoped cookie storage also makes authentication testable with disposable keys.
export function createSessionHandlers(auth: Auth, store: CookieStore) {
  return {
    async generatePayload(params: Parameters<Auth["generatePayload"]>[0]) {
      const payload = await auth.generatePayload(params);
      store.set(nonceCookie, payload.nonce, cookieOptions(CHALLENGE_SECONDS));
      return payload;
    },
    async login(params: VerifyLoginPayloadParams) {
      const nonce = store.get(nonceCookie)?.value;
      store.set(nonceCookie, "", cookieOptions(0));
      if (!nonce || params?.payload?.nonce !== nonce) {
        throw new Error("Invalid login challenge");
      }
      const dates = [params.payload.issued_at, params.payload.expiration_time, params.payload.invalid_before].map(Date.parse);
      if (dates.some((date) => !Number.isFinite(date)) || dates[1] - dates[0] > CHALLENGE_SECONDS * 1000) {
        throw new Error("Invalid login challenge");
      }
      const verified = await auth.verifyPayload(params);
      if (!verified.valid) throw new Error("Invalid login signature or expired challenge");
      const jwt = await auth.generateJWT({ payload: verified.payload });
      store.set("jwt", jwt, cookieOptions(SESSION_SECONDS));
    },
    async isLoggedIn(address: string) {
      if (!/^0x[0-9a-f]{40}$/i.test(address)) return false;
      const jwt = store.get("jwt")?.value;
      if (!jwt) return false;
      try {
        const result = await auth.verifyJWT({ jwt });
        return result.valid && result.parsedJWT.sub.toLowerCase() === address.toLowerCase();
      } catch {
        return false;
      }
    },
    async logout() {
      store.set("jwt", "", cookieOptions(0));
      store.set(nonceCookie, "", cookieOptions(0));
    },
  };
}
