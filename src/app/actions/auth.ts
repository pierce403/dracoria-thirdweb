'use server';

import type { VerifyLoginPayloadParams } from "thirdweb/auth";
import { cookies } from "next/headers";
import { getThirdwebAuth } from "../utils/thirdwebAuth";
import { createSessionHandlers } from "../utils/auth-session";

async function session() {
  return createSessionHandlers(getThirdwebAuth(), await cookies());
}

export async function generatePayload(params: { address: string; chainId?: number }) {
  return (await session()).generatePayload(params);
}

export async function login(payload: VerifyLoginPayloadParams) {
  return (await session()).login(payload);
}

export async function isLoggedIn(address: string) {
  return (await session()).isLoggedIn(address);
}

export async function logout() {
  return (await session()).logout();
}
