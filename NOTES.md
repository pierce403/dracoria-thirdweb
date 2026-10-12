# Cloudflare migration notes

## 2026-10-12 preparation

Source: f98d770cb6552d06bd15767ff6ec21a4a3363a6a. Independent clone on
codex/cloudflare-migration. No source app AGENTS.md was present. Read the migration
coordination instructions and installed/read the upstream migrate-to-vinext skill.
The initial compatibility checker reported 100%, five supported features, no issues.

The app has one public page, Thirdweb wallet login server actions, and static Dragon
and Garden cards. Chat/settings controls and their advertised endpoints are not
implemented; the unused balance helper does not gate the page. These are preserved.

The port uses vinext 1.1.0, Vite 8.3.4, Cloudflare Vite plugin 1.63.1, Wrangler
4.149.0, patched React/RSC 19.3.0 and Next 16.4.0 for compatibility/recovery tooling.
Thirdweb 5.23.0's pinned Radix packages required React 18; the port uses pinned
Thirdweb 5.121.6 to satisfy React 19 without forced peer overrides. The stale old
lock was retained under ignored local evidence, then resolved for the new exact
pins. Coinbase SDK imports also required the explicit optional peer @x402/evm
2.28.0; no wallet module was stubbed. Bulma remains 1.0.0; its compiled CSS entry avoids an unnecessary Sass build.

Auth changes remove private key/client debug logs and defer signer creation to a
server-only request function. Session cookies are HttpOnly, Secure, SameSite=Strict,
path=/, with a 24-hour lifetime. Five-minute login challenges are bound to a browser
nonce cookie cleared on each login attempt. This is browser challenge binding,
not a durable global nonce revocation store. Session identity must match the active
wallet, including after wallet switches. Domain, URI, signature and expiry validation
remain in Thirdweb, with finite payload dates checked before it runs.

The existing Vercel environment names do not supply the signer/domain expected by
this source. No production signing key or private Thirdweb API key was retrieved.
Only verified NEXT_PUBLIC_THIRDWEB_CLIENT_ID was supplied to the build subprocess.
Production cutover is held pending owner confirmation/provisioning of the correct
server signer and THIRDWEB_DOMAIN. Disposable generated local signers are only for
validation. No blockchain transaction is performed.

## Validation and deployment contract

Native Git uses Node 22.23.3, npm ci, npm run build:cloudflare, npx wrangler deploy.
vercel.json disables future Vercel Git builds while preserving deployed recovery.
Initial Wrangler config has no production routes. The coordinator owns all release
changes. Build identity is served at /deployment.json with Cache-Control:no-store.

Eight disposable-signer auth tests cover valid login/logout, secure cookie options,
wallet identity changes, absent/consumed browser challenge, wrong domain/URI/signature,
expired or malformed payloads, and expired/malformed/wrong-domain sessions.
The built Worker passes 18 route/action checks in scripts/smoke-auth.mjs, including
real signed login/logout, wallet switch, signature/domain/expiry rejection and
cross-origin HTTP 403. Root and deployment marker return 200; missing and existing
unimplemented API paths return 404. Browser page and wallet chooser render without
console errors; no actual wallet is connected.

Lint succeeds with four warnings about pre-existing unused placeholder handlers
and an unused font value. Typecheck, Cloudflare build and Wrangler dry run pass.
The Worker bundle is approximately 6.2 MiB raw / 2.4 MiB gzip; 1,301 static files.

Current audit: zero critical, 13 high and 28 moderate package findings. High root
causes are braces in build globs, js-yaml in SDK OpenAPI generation, and nested ws
versions in wallet libraries. The application has no WebSocket server, YAML/ZIP
parser or user-controlled build-glob endpoint. Moderate findings also affect SDK
URI/UUID helpers and unused OG dependencies. These package findings remain for an
upstream-reviewed update; a passing port is not a claim that the entire SDK graph
is advisory-free. No forced peer or transitive major override was applied.

Ignored .migration contains build/test/audit/runtime logs and browser screenshot.
The ignored chmod600 .dev.vars contains a generated disposable local-only signer,
localhost domain and the public client ID; it must never be copied to production.

Final clean npm ci from the candidate lock succeeded under Node 22.23.3. After it,
the Cloudflare build, all eight auth tests, typecheck, lint and Wrangler dry run
passed again. No production push or deployment has been performed by this port.
