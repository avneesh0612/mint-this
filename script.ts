import { sdk } from "./src/lib/thirdwebSdk.js";
import { redis } from "./src/lib/redis.js";

console.log(new Date().toISOString() + " - " + "script.ts");

const ack = await redis.xadd(
  "NFTS",
  "*",
  "data",
  JSON.stringify({
    name: "WarpCast NFT",
    description: `$abc`,
  }),
);

console.log("done: ", ack);

console.log(new Date().toISOString() + " - " + "script.ts" + " - " + "end");
