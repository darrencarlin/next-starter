import type {Config} from "drizzle-kit";
import {defineConfig} from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL ?? "";

const drizzleConfig = {
  schema: "./src/lib/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {url: DATABASE_URL},
} satisfies Config;

export default defineConfig(drizzleConfig);
