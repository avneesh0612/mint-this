import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { config } from "dotenv";

config();

if (!process.env.PRIVATE_KEY || !process.env.SECRET_KEY) {
  throw new Error("Make sure you set NEYNAR_API_KEY in your .env file");
}

export const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY,
  "degen-chain",
  {
    secretKey: process.env.SECRET_KEY,
  },
);
