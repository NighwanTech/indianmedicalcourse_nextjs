import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().default("mysql://root:password@localhost:3306/imc_db"),
  JWT_SECRET: z.string().default("imc_enterprise_jwt_secret_token_2026_super_secure"),
  SMTP_HOST: z.string().default("smtp.gmail.com"),
  SMTP_PORT: z.string().default("587"),
  SMTP_USER: z.string().default("admissions@indianmedicalcourses.com"),
  SMTP_PASS: z.string().default(""),
  AIWCRM_API_URL: z.string().default("https://api.aiwcrm.com/v1/leads"),
  AIWCRM_API_KEY: z.string().default("mock_aiwcrm_api_key"),
  GOOGLE_ADS_ID: z.string().default("AW-11234567890"),
  META_PIXEL_ID: z.string().default("987654321098765"),
  NEXT_PUBLIC_APP_URL: z.string().default("https://indianmedicalcourse.com"),
});

export const env = envSchema.parse(process.env);
