import dotenv from "dotenv";

dotenv.config();

const DEFAULT_DEV_JWT_SECRET = "dev_super_secreto";
const NODE_ENV = process.env.NODE_ENV || "development";
const isDevelopment = NODE_ENV === "development";

const jwtSecret =
  process.env.JWT_SECRET || (isDevelopment ? DEFAULT_DEV_JWT_SECRET : undefined);

if (!jwtSecret) {
  throw new Error(
    "JWT_SECRET environment variable must be defined (no fallback available outside development)."
  );
}

export const ENV = {
  PORT: process.env.PORT || 4000,
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASS: process.env.DB_PASS || "postgres",
  DB_NAME: process.env.DB_NAME || "SpeakUp",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  JWT_SECRET: jwtSecret,
  NODE_ENV,
};
