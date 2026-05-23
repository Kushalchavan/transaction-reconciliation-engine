import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3000"),
  MONGODB_URI: z.string(),
  TIMESTAMP_TOLERANCE_SECONDS: z.string().default("300"),
  QUANTITY_TOLERANCE_PCT: z.string().default("0.01"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    " Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors
  );

  process.exit(1);
}

export const env = {
  PORT: Number(parsedEnv.data.PORT),
  MONGODB_URI: parsedEnv.data.MONGODB_URI,
  TIMESTAMP_TOLERANCE_SECONDS: Number(
    parsedEnv.data.TIMESTAMP_TOLERANCE_SECONDS
  ),
  QUANTITY_TOLERANCE_PCT: Number(
    parsedEnv.data.QUANTITY_TOLERANCE_PCT
  ),
};