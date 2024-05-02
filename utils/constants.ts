import { createThirdwebClient, defineChain } from 'thirdweb';
import { polygon } from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
})

export const myChain = polygon;


