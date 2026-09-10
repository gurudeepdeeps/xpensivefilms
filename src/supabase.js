/**
 * Cloudflare Migration: Supabase client has been retired in favor of Cloudflare D1 + Pages Functions.
 * Refer to src/services/api.js for all database and backend operations.
 */
import { api } from './services/api';

export { api };
export const isCloudflareActive = true;