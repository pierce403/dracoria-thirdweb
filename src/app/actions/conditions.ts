'use server'

import { defineChain, getContract } from "thirdweb";

import { client } from "../utils/client";
import { balanceOf } from "thirdweb/extensions/erc20"
import { polygon } from "thirdweb/chains";

export async function hasAccess(address: string): Promise<boolean> {

    const required = 1; // TODO tutorial says 1n

    const contract = getContract({
        client: client,
        chain: defineChain(polygon),
        address: "0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4", // MANA
    });

    const ownedBalance = await balanceOf({
        contract: contract,
        address: address, // TODO is ths right? Docs says it should be the owner
    });

    return ownedBalance >= required;
}