import type { FastifyInstance } from "fastify";
import {
  chatHandler,
  carteirasHandler,
  summaryHandler,
} from "../controllers/portfolio.controller.js";

export async function portfolioRoutes(app: FastifyInstance) {
  app.get("/api/v1/portfolio/carteiras", carteirasHandler);
  app.get("/api/v1/portfolio/summary", summaryHandler);
  app.post("/api/v1/portfolio/chat", chatHandler);
}
