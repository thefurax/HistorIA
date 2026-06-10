import dotenv from 'dotenv';
dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const HISTORIA_GPT_ACTION_KEY = process.env.HISTORIA_GPT_ACTION_KEY || 'historia-dev-secret-2026';
export const PUBLIC_MAP_BASE_URL = process.env.PUBLIC_MAP_BASE_URL || 'http://localhost:5173/map';
