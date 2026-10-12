import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { createThirdwebClient } from "thirdweb";
import { createAuth, signLoginPayload } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { createSessionHandlers, CHALLENGE_SECONDS, SESSION_SECONDS, type CookieStore } from "../src/app/utils/auth-session";

const client = createThirdwebClient({ clientId: "disposable-local-auth-tests" });
const account = () => privateKeyToAccount({ client, privateKey: `0x${randomBytes(32).toString("hex")}` });
const adminAccount = account();
const wallet = account();
const otherWallet = account();
const auth = createAuth({ domain: "dracoria.test", adminAccount, login: { uri: "https://dracoria.test", payloadExpirationTimeSeconds: CHALLENGE_SECONDS }, jwt: { expirationTimeSeconds: SESSION_SECONDS } });
function setup(backend = auth) {
  const values = new Map<string, { value: string; options: Parameters<CookieStore["set"]>[2] }>();
  const store: CookieStore = { get: (name) => values.get(name), set(name, value, options) { if (options.maxAge === 0) values.delete(name); else values.set(name, { value, options }); } };
  return { values, handlers: createSessionHandlers(backend, store) };
}

test("valid signed login uses secure cookies and binds the session to the connected wallet", async () => {
  const { values, handlers } = setup();
  const payload = await handlers.generatePayload({ address: wallet.address });
  assert.equal(values.get("dracoria-login-nonce")?.options.maxAge, CHALLENGE_SECONDS);
  await handlers.login(await signLoginPayload({ account: wallet, payload }));
  assert.deepEqual(values.get("jwt")?.options, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
  assert.equal(await handlers.isLoggedIn(wallet.address), true);
  assert.equal(await handlers.isLoggedIn(wallet.address.toLowerCase()), true);
  assert.equal(await handlers.isLoggedIn(otherWallet.address), false);
  assert.equal(await handlers.isLoggedIn(""), false);
  await handlers.logout();
  assert.equal(await handlers.isLoggedIn(wallet.address), false);
  assert.equal(values.size, 0);
});

test("a consumed or missing browser challenge cannot log in", async () => {
  const { handlers } = setup();
  const payload = await handlers.generatePayload({ address: wallet.address });
  const signed = await signLoginPayload({ account: wallet, payload });
  await handlers.login(signed);
  await assert.rejects(handlers.login(signed), /challenge/);
  await assert.rejects(setup().handlers.login(signed), /challenge/);
});

for (const mutation of ["domain", "uri", "expiry", "signature", "invalidDate"] as const) {
  test(`rejects login with wrong ${mutation}`, async () => {
    const { handlers, values } = setup();
    const payload = await handlers.generatePayload({ address: wallet.address });
    if (mutation === "domain") payload.domain = "attacker.test";
    if (mutation === "uri") payload.uri = "https://attacker.test";
    if (mutation === "expiry") payload.expiration_time = new Date(Date.now() - 1000).toISOString();
    if (mutation === "invalidDate") payload.expiration_time = "invalid";
    const signed = await signLoginPayload({ account: mutation === "signature" ? otherWallet : wallet, payload });
    await assert.rejects(handlers.login(signed));
    assert.equal(values.has("jwt"), false);
    assert.equal(values.has("dracoria-login-nonce"), false);
  });
}

test("expired, malformed and wrong-domain sessions return false", async () => {
  const expiredAuth = createAuth({ domain: "dracoria.test", adminAccount, login: { uri: "https://dracoria.test", payloadExpirationTimeSeconds: CHALLENGE_SECONDS }, jwt: { expirationTimeSeconds: -60 } });
  const { values, handlers } = setup(expiredAuth);
  const payload = await handlers.generatePayload({ address: wallet.address });
  await handlers.login(await signLoginPayload({ account: wallet, payload }));
  assert.equal(await handlers.isLoggedIn(wallet.address), false);
  const options = values.get("jwt")!.options;
  values.set("jwt", { value: "malformed", options });
  assert.equal(await handlers.isLoggedIn(wallet.address), false);
  const foreignAuth = createAuth({ domain: "attacker.test", adminAccount });
  const foreignPayload = await foreignAuth.generatePayload({ address: wallet.address });
  const verified = await foreignAuth.verifyPayload(await signLoginPayload({ account: wallet, payload: foreignPayload }));
  assert.ok(verified.valid);
  values.set("jwt", { value: await foreignAuth.generateJWT({ payload: verified.payload }), options });
  assert.equal(await handlers.isLoggedIn(wallet.address), false);
});
