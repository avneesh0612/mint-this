import { sdk } from "./src/lib/thirdwebSdk.js";

console.log(new Date().toISOString() + " - " + "script.ts");
const contract = await sdk.getContract(
  "0x0F64Ee63629CCc31b417133cF125FbCC3bD75840"
);

const nft = await contract.erc721.mint({
  name: "WarpCast NFT",
  description: `$abc`,
});

console.log(nft);

console.log(new Date().toISOString() + " - " + "script.ts" + " - " + "end");
