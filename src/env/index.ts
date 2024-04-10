import { z } from "zod";
import { config } from "dotenv";

config();

const schema = z.object({
  TOKEN: z.string(),
  GUILD_ID: z.string(),
  EPIC_CLIENT_ID: z.string(),
  EPIC_CLIENT_SECRET: z.string(),
});

const _env = schema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
