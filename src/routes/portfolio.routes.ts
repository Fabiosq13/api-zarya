import type { FastifyInstance } from "fastify";
import {
  chatHandler,
  carteirasHandler,
  summaryHandler,
} from "../controllers/portfolio.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export async function portfolioRoutes(app: FastifyInstance) {
  // Todas as rotas de dados exigem autenticação.
  app.get("/api/v1/portfolio/carteiras", { preHandler: requireAuth }, carteirasHandler);
  app.get("/api/v1/portfolio/summary", { preHandler: requireAuth }, summaryHandler);
  app.post("/api/v1/portfolio/chat", { preHandler: requireAuth }, chatHandler);
}
