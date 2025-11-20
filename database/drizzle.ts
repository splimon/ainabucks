import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import config from "@/lib/config";

const pool = new Pool({ connectionString: config.env.databaseUrl });

export const db = drizzle({ client: pool, casing: "snake_case" });
