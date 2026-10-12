import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createThirdwebClient } from "thirdweb";
import { signLoginPayload } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";

const base = process.env.SMOKE_BASE_URL || "http://localhost:8794";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) {
  throw new Error("This disposable-signer smoke test is restricted to localhost");
}
const manifest = await readFile("dist/server/__vinext_action_owner_manifest.js", "utf8");
const owners = JSON.parse(manifest.replace(/^export default /, "").replace(/;\s*$/, ""));
const ids = Object.fromEntries(Object.keys(owners).map((key) => [key.split("#")[1], key]));
const client = createThirdwebClient({ clientId: "disposable-local-auth-tests" });
const account = () => privateKeyToAccount({ client, privateKey: `0x${randomBytes(32).toString("hex")}` });
const wallet = account();
const otherWallet = account();
const jar = new Map();
let assertions = 0;
async function invoke(name, args, origin = base) {
  const response = await fetch(`${base}/`, { method: "POST", headers: {
    "Content-Type": "text/plain;charset=UTF-8", "Next-Action": ids[name],
    Origin: origin, Cookie: [...jar].map(([key, value]) => `${key}=${value}`).join("; "),
  }, body: JSON.stringify(args) });
  for (const cookie of response.headers.getSetCookie()) {
    const [pair] = cookie.split(";");
    const split = pair.indexOf("=");
    if (/Max-Age=0(?:;|$)/i.test(cookie)) jar.delete(pair.slice(0, split));
    else jar.set(pair.slice(0, split), pair.slice(split + 1));
    assert.match(cookie, /; Secure/i); assert.match(cookie, /; HttpOnly/i); assert.match(cookie, /; SameSite=strict/i);
  }
  const body = await response.text();
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const first = body.split("\n").find((line) => line.startsWith("0:"));
  const result = JSON.parse(first.slice(2), (_key, value) => value === "$undefined" ? undefined : value).returnValue;
  if (!result.ok) throw new Error("Action rejected");
  assertions++;
  return result.data;
}
for (const [path, status] of [["/", 200], ["/deployment.json", 200], ["/api/dragon/chat", 404], ["/api/updateSettings", 404], ["/missing-smoke-route", 404]]) {
  const response = await fetch(`${base}${path}`); assert.equal(response.status, status); assertions++;
  if (path === "/deployment.json") assert.equal(response.headers.get("cache-control"), "no-store");
}
let payload = await invoke("generatePayload", [{ address: wallet.address }]);
assert.equal(payload.domain, new URL(base).host);
await invoke("login", [await signLoginPayload({ account: wallet, payload })]);
assert.equal(await invoke("isLoggedIn", [wallet.address]), true);
assert.equal(await invoke("isLoggedIn", [otherWallet.address]), false);
await invoke("logout", []);
assert.equal(await invoke("isLoggedIn", [wallet.address]), false);
for (const mode of ["domain", "expiry", "signature"]) {
  payload = await invoke("generatePayload", [{ address: wallet.address }]);
  if (mode === "domain") payload.domain = "wrong.example";
  if (mode === "expiry") payload.expiration_time = new Date(Date.now() - 1000).toISOString();
  await assert.rejects(invoke("login", [await signLoginPayload({ account: mode === "signature" ? otherWallet : wallet, payload })]));
  assert.equal(jar.has("jwt"), false); assertions++;
}
await assert.rejects(invoke("generatePayload", [{ address: wallet.address }], "https://wrong.example"), /HTTP 403/);
assertions++;
console.log(`Built Worker smoke passed: ${assertions} route/action checks; valid login/logout, secure cookies, wallet switch, bad signature/domain/expiry, and cross-origin rejection.`);
