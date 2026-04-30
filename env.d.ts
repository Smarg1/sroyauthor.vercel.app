/// <reference types="node" />

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';

      VERCEL_PROJECT_PRODUCTION_URL?: string;

      SUPABASE_PUBLISHABLE_KEY: string;
      SUPABASE_URL: string;
    }
  }
}
