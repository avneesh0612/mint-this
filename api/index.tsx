import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { serveStatic } from "frog/serve-static";
import { handle } from "frog/vercel";
import neynarClient from "../src/lib/neynarClient.js";
import { redis } from "../src/lib/redis.js";
import getSvg from "../src/utils/_svg.js";
import { sdk } from "../src/lib/thirdwebSdk.js";

// import { neynar } from 'frog/hubs'

export const app = new Frog({
  hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
  basePath: "/api",
});

const ADD_URL = process.env.ADD_URL!;
console.log("ADD_URL", ADD_URL);

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
          Mint casts or cast media you like as NFTs right from the app using
          this cast action! Click on the link below to add the action.
        </h2>
      </div>
    ),
    intents: [
      <Button.Link href={new URL(ADD_URL).toString()}>Add Action</Button.Link>,
    ],
  });
});

app.hono.post("/mint", async (c) => {
  try {
    const body = await c.req.json();
    const { action } = await neynarClient.validateFrameAction(
      body.trustedData.messageBytes
    );

    let image;
    // @ts-ignore
    image = action.cast.embeds[0]?.url;

    if (!image) {
      const svg = getSvg(
        action.cast.text,
        action.cast.author.display_name || action.cast.author.username,
        action.cast.author.pfp_url || "https://warpcast.com/assets/logo.svg"
      );

      const ipfs = await sdk.storage.upload(svg);
      image = ipfs;
    }

    const data = {
      name: "Mint this!",
      description: `${action.cast.text} \n\n - ${
        action.cast.author.display_name || action.cast.author.username
      }`,
      image,
      address: action.interactor.verified_addresses.eth_addresses[0],
      username: action.interactor.username,
    };

    const ack = await redis.xadd("NFTS", "*", "data", JSON.stringify(data));

    let message = `Minted! NFT will be in your wallet soon.`;

    return c.json({ message });
  } catch (e) {
    console.error("error at /mint", e);
    return c.json({ message: "Error. Try Again." }, 500);
  }
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
