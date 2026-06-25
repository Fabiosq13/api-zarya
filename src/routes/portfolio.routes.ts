import type { FastifyInstance } from "fastify";
import { chatHandler } from "../controllers/portfolio.controller.js";

export async function portfolioRoutes(app: FastifyInstance) {
  app.post("/api/v1/portfolio/chat", chatHandler);
}
