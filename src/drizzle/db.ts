import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { relations } from "./relations";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql, relations: relations });
