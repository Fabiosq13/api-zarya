import { z } from "zod";
import "dotenv/config";

const schema = z.object({
  // Zarya
  ZARYA_BASE_URL: z.string().url().default("https://apishow.zarya.net.br"),
  ZARYA_TOKEN: z.string().min(1, "ZARYA_TOKEN é obrigatório"),
  ZARYA_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),

  // Gemini
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY é obrigatório"),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),

  // App
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default("0.0.0.0"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(60),
  LOG_LEVEL: z.string().default("info"),

  // Conversas (Redis)
  // Se REDIS_URL não for definida, o histórico cai para memória (útil em dev local).
  REDIS_URL: z.string().min(1).optional(),
  CONVERSATION_TTL_SECONDS: z.coerce.number().int().positive().default(604800), // 7 dias
  CONVERSATION_MAX_TURNS: z.coerce.number().int().positive().default(20),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Falha cedo: sem env válido, o processo nem sobe.
  console.error("❌ Variáveis de ambiente inválidas:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
