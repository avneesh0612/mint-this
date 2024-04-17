import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { serveStatic } from "frog/serve-static";
import neynarClient from "./lib/neynarClient.js";
import { sdk } from "./lib/thirdwebSdk.js";
import getSvg from "./utils/_svg.js";
import { redis } from "./lib/redis.js";

export const app = new Frog({
  hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
  basePath: "/api",
});

const ADD_URL =
  "https://warpcast.com/~/add-cast-action?actionType=post&name=Mint+this&icon=person&postUrl=https://d166-2405-201-800c-6a-cc9f-1e4c-a835-46a1.ngrok-free.app/api/mint";

app.frame("/", (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          gm! Add cast action to view followers count
        </h2>
      </div>
    ),
    intents: [<Button.Link href={ADD_URL}>Add Action</Button.Link>],
  });
});

app.hono.post("/mint", async (c) => {
  try {
    const body = await c.req.json();
    const { action } = await neynarClient.validateFrameAction(
      body.trustedData.messageBytes,
    );

    let image;
    // @ts-ignore
    image = action.cast.embeds[0]?.url;

    if (!image) {
      const svg = getSvg(
        action.cast.text,
        action.cast.author.display_name || action.cast.author.username,
        action.cast.author.pfp_url || "https://warpcast.com/assets/logo.png",
      );

      const ipfs = await sdk.storage.upload(svg);
      image = ipfs;
    }

    const data = {
      name: "WarpCast NFT",
      description: `${action.cast.text} \n\n - ${
        action.cast.author.display_name || action.cast.author.username
      }`,
      image,
      address: action.interactor.verified_addresses.eth_addresses[0],
    };

    console.log("hi", data);
    const ack = await redis.xadd("NFTS", "*", "data", JSON.stringify(data));
    console.log("done: ", ack);

    let message = `Minted! NFT will be in your wallet soon.`;

    return c.json({ message });
  } catch (e) {
    console.error("error at /mint", e);
    return c.json({ message: "Error. Try Again." }, 500);
  }
});

app.use("/*", serveStatic({ root: "./public" }));
devtools(app, { serveStatic });

if (typeof Bun !== "undefined") {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  });
  console.log("Server is running on port 3000");
}
