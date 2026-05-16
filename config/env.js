import 'dotenv/config'; // This loads .env variables IMMEDIATELY upon import

export const { 
    DB_URI, 
    EMAIL_PASSWORD, 
    JWT_SECRET, 
    JWT_EXPIRES_IN_ACCESS,
    JWT_EXPIRES_IN_REFRESH,
    ARCJET_KEY, 
    NODE_ENV, 
    REDIS_URL 
} = process.env;

// Debugging: This will run as soon as any file imports this one
if (!DB_URI) {
    console.error("❌ DB_URI is missing from process.env!");
}