import { Redis } from "@upstash/redis";
import "server-only";

export const redis: Redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});
