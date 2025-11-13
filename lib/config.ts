/*
 * /lib/config.ts
 * Configuration file for the application.
 */

const config = {
  env: {
    prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
    databaseUrl: process.env.DATABASE_URL!,
    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_REST_URL!,
      redisToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
      qstashUrl: process.env.QSTASH_URL!,
      qstashToken: process.env.QSTASH_TOKEN!,
      qstashCurrentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
      qstashNextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
    },
  },
};

export default config;
