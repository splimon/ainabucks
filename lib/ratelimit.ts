import redis from "@/database/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Create a ratelimiter, that allows 5 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, "1m"), // 5 requests per minute
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit;
