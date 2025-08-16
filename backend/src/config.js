import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // adjust path if needed
export const PORT = process.env.PORT || 8080;
export const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';

export const DATABASE_URL = process.env.DATABASE_URL;

export const UPSTASH_REDIS_URL = process.env.UPSTASH_REDIS_URL;
export const UPSTASH_REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN;

export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
export const EMAIL_FROM = process.env.EMAIL_FROM || 'no-reply@example.com';

export const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export const INVOICE_ISSUER = process.env.INVOICE_ISSUER || 'Mini Auction Inc.';
export const INVOICE_ISSUER_EMAIL = process.env.INVOICE_ISSUER_EMAIL || 'sales@example.com';
