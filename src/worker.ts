import { redis } from "./lib/redis.js";
import { sdk } from "./lib/thirdwebSdk.js";

while (true) {
  try {
    let lastId = "$";

    const streamData = await redis.xread("BLOCK", 0, "STREAMS", "NFTS", lastId);

    if (streamData) {
      for (const stream of streamData) {
        try {
          const messages = stream[1];
          for (const message of messages) {
            const contract = await sdk.getContract(
              "0x0F64Ee63629CCc31b417133cF125FbCC3bD75840",
            );

            const data = JSON.parse(message[1][1]) as {
              name: string;
              description: string;
              image: string;
              address: string;
            };

            const nft = await contract.erc721.mintTo(data.address, data);

            console.log(
              "worker success: ",
              "id",
              nft.id,
              "tx",
              nft.receipt.transactionHash.toString(),
              "to",
              nft.receipt.to.toString(),
            );
          }
        } catch (e) {
          console.error("worker error:", e);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}
