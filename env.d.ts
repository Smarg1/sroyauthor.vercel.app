export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VERCEL_PROJECT_PRODUCTION_URL: string;

      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string;
      NEXT_PUBLIC_SUPABASE_URL: string;

      POSTGRES_DATABASE: string;
      POSTGRES_HOST: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_PRISMA_URL: string;
      POSTGRES_URL: string;
      POSTGRES_URL_NON_POOLING: string;
      POSTGRES_USER: string;

      SUPABASE_JWT_SECRET: string;
      SUPABASE_PUBLISHABLE_KEY: string;
      SUPABASE_SECRET_KEY: string;
      SUPABASE_URL: string;

      VERCEL_OIDC_TOKEN: string;
    }
  }
}
