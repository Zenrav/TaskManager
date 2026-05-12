import dotenv from "dotenv";

dotenv.config();

export const {DB_URI, EMAIL_PASSWORD, JWT_SECRET, JWT_EXPIRES_IN, ARCJET_KEY, NODE_ENV, REDIS_URL} = process.env

