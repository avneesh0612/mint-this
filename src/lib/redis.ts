import { Redis } from "ioredis";

export const redis = new Redis({
  port: 19298,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  tls: {},
});
