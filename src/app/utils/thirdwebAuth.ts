import { createAuth } from "thirdweb/auth"
import { privateKeyToAccount } from "thirdweb/wallets"
import { client } from "./client"

const privateApiKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY

// print the key
console.log("privateApiKey", privateApiKey);

if (!privateApiKey) {
    throw new Error("THIRDWEB_SECRET_KEY is not set")
}

export const thirdwebAuth = createAuth({
    domain: process.env.THIRDWEB_DOMAIN || "",
    adminAccount: privateKeyToAccount({ client: client, privateKey: privateApiKey }),
})
