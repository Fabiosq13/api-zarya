import Fastify, { type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { env } from "./config/env.js";
import { portfolioRoutes } from "./routes/portfolio.routes.js";
import { registerErrorHandler } from "./middlewares/error.middleware.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      // logs estruturados (pino) — redige cabeçalhos sensíveis
      redact: ["req.headers.authorization", "req.headers.cookie"],
    },
  });

  await app.register(helmet);

  const corsOrigin =
    env.CORS_ORIGIN === "*"
      ? true
      : env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);
  await app.register(cors, {
    origin: corsOrigin,
    methods: ["GET", "POST", "OPTIONS"],
  });

  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: "1 minute",
  });

  registerErrorHandler(app);

  app.get("/health", async () => ({
    status: "ok",
    ts: new Date().toISOString(),
    zaryaBaseUrl: env.ZARYA_BASE_URL, // facilita confirmar qual host está em uso
    redis: env.REDIS_URL ? "configurado" : "memoria",
  }));

  await app.register(portfolioRoutes);

  app.log.info(`Zarya base URL em uso: ${env.ZARYA_BASE_URL}`);

  return app;
}
