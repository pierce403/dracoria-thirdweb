import "server-only";
import { createAuth } from "thirdweb/auth";
import { createThirdwebClient } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { CHALLENGE_SECONDS, SESSION_SECONDS } from "./auth-session";

// Read server secrets only during a request, never during build/module evaluation.
export function getThirdwebAuth() {
  const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY;
  const domain = process.env.THIRDWEB_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
  if (!privateKey || !/^0x[0-9a-f]{64}$/i.test(privateKey)) {
    throw new Error("THIRDWEB_ADMIN_PRIVATE_KEY must be configured on the server");
  }
  if (!domain || !/^[a-z0-9.-]+(?::[0-9]+)?$/i.test(domain)) {
    throw new Error("THIRDWEB_DOMAIN must be the configured site host");
  }
  if (!clientId) throw new Error("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is required");
  const client = createThirdwebClient({ clientId });
  return createAuth({
    domain,
    adminAccount: privateKeyToAccount({ client, privateKey }),
    login: { uri: `https://${domain}`, payloadExpirationTimeSeconds: CHALLENGE_SECONDS },
    jwt: { expirationTimeSeconds: SESSION_SECONDS },
  });
}
