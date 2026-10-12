'use client'
import { ConnectButton } from "thirdweb/react";
import { client } from "../utils/client";
import { login, logout, generatePayload, isLoggedIn } from "../actions/auth";

// Hosting migration proceeds with the existing broken login explicitly deferred.
// Keep the original signed-auth flow below for the later credential/auth repair.
const walletLoginDeferred = true;

export const LoginButton = () => {
    if (walletLoginDeferred) {
        return (
            <div role="status" style={{ padding: "1rem" }}>
                <p>Wallet sign-in is currently unavailable and will be repaired later.</p>
                <button className="button" type="button" disabled>Wallet sign-in unavailable</button>
            </div>
        );
    }
    return (<ConnectButton
        client={client}
        auth={{
            isLoggedIn: async (address) => {
                return await isLoggedIn(address);
            },
            doLogin: async (params) => {
                await login(params);
            },
            getLoginPayload: async ({ address }) => generatePayload({ address }),
            doLogout: async () => {
                await logout();
            }
        }}
    />);
}
