import Fastify, { type FastifyInstance } from "fastify";
import helmet from "@fastify/helmet";
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
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: "1 minute",
  });

  registerErrorHandler(app);

  app.get("/health", async () => ({ status: "ok", ts: new Date().toISOString() }));

  await app.register(portfolioRoutes);

  return app;
}
