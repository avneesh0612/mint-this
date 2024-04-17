import { redis } from "./lib/redis.js";
import { sdk } from "./lib/thirdwebSdk.js";

const server = Bun.serve({
  port: 8080,
  async fetch(request) {
    try {
      let lastId = "$";

      const streamData = await redis.xread(
        "BLOCK",
        0,
        "STREAMS",
        "NFTS",
        lastId
      );

      if (streamData) {
        for (const stream of streamData) {
          console.log(stream);

          try {
            for (const message of stream.messages) {
              console.log(message);

              const contract = await sdk.getContract(
                "0x0F64Ee63629CCc31b417133cF125FbCC3bD75840"
              );

              const nft = await contract.erc721.mint();
            }
          } catch (e) {
            console.error(e);
          }
        }
      }

      return new Response("gm!");
    } catch (e) {
      console.log(e);
    }

    return new Response("Welcome to Bun!");
  },
});

console.log(`Listening on localhost:${server.port}`);
