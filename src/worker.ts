import neynarClient from "./lib/neynarClient.js";
import { redis } from "./lib/redis.js";
import { sdk } from "./lib/thirdwebSdk.js";
import dotenv from "dotenv";

dotenv.config();

while (true) {
  try {
    let lastId = "$";

    const streamData = await redis.xread("BLOCK", 0, "STREAMS", "NFTS", lastId);

    if (streamData) {
      for (const stream of streamData) {
        try {
          const messages = stream[1];
          for (const message of messages) {
            if (!process.env.COLLECTION_ADDRESS) {
              console.error("COLLECTION_ADDRESS not set");
            }

            const contract = await sdk.getContract(
              process.env.COLLECTION_ADDRESS ||
                "0x0F64Ee63629CCc31b417133cF125FbCC3bD75840"
            );

            const data = JSON.parse(message[1][1]) as {
              name: string;
              description: string;
              image: string;
              address: string;
              username: string;
            };

            const nft = await contract.erc721.mintTo(data.address, data);

            if (!process.env.SIGNER_UUID) {
              console.error("SIGNER_UUID not set");
            } else {
              await neynarClient.publishCast(
                process.env.SIGNER_UUID,
                `gm @${
                  data.username
                }! Your NFT has been minted successfully! \n \n Check out the tx here: https://explorer.degen.tips/tx/${nft.receipt.transactionHash.toString()}`
              );
            }

            console.log(
              "worker success: ",
              "id",
              nft.id,
              "tx",
              nft.receipt.transactionHash.toString(),
              "to",
              nft.receipt.to.toString()
            );
          }
        } catch (e) {
          console.error("worker error:", e);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
}
