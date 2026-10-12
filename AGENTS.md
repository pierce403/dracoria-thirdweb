# Dracoria development and deployment

- Use Node 22.23.3 and `npm ci`. Keep direct migration tool versions pinned.
- Cloudflare native Git builds own production: `npm run build:cloudflare`, then
  `npx wrangler deploy`. Do not put Cloudflare deployment credentials in GitHub.
- `npm run build` retains the Next recovery build. Clear generated `.next` cache
  when switching between Next and vinext because generated route types differ.
- Run `npm test`, `npm run lint`, `npm run typecheck`, the Cloudflare build and a
  Wrangler dry run for relevant auth/runtime changes. Check the built Worker too.
- Use only disposable signers for tests. Never log signer keys, session cookies,
  secrets or full Thirdweb clients. Only NEXT_PUBLIC_THIRDWEB_CLIENT_ID is public.
- Production auth requires an explicitly approved server-only signer and exact
  THIRDWEB_DOMAIN. Never substitute an API key for an Ethereum signing key.
- Keep existing Dragon/Garden/settings/chat scope. Unimplemented controls or
  endpoints are not permission to invent features during a hosting migration.
- Record migration facts, tests and unresolved release gates in NOTES.md. Keep
  `.migration`, `.dev.vars*`, environment files and generated output ignored.
- The coordination project owns DNS, native Git setup, production secrets and
  production cutover. Local migration commits are reviewable handoffs, not a
  direction to push or deploy independently.
