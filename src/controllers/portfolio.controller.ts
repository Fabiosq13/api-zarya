import type { FastifyRequest, FastifyReply } from "fastify";
import { randomUUID } from "node:crypto";
import { chatBodySchema, type ChatBody } from "../schemas/portfolio.schema.js";
import * as conversation from "../services/conversation.service.js";
import * as agent from "../services/agent.service.js";
import { env } from "../config/env.js";
import type { ChatMessage } from "../types/portfolio.types.js";

export async function chatHandler(req: FastifyRequest, reply: FastifyReply) {
  const parsed = chatBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return reply.status(400).send({
      erro: "validacao",
      detalhes: parsed.error.flatten().fieldErrors,
    });
  }

  const body: ChatBody = parsed.data;
  const startedAt = Date.now();

  // Monta o histórico de entrada (stateful por id OU stateless com messages).
  let conversationId = body.conversationId;
  let inputHistory: ChatMessage[];

  if (body.messages && body.messages.length > 0) {
    // Modo stateless: cliente envia todo o histórico.
    inputHistory = body.messages;
    conversationId = conversationId ?? randomUUID();
  } else {
    // Modo stateful: usa o id e adiciona a nova mensagem.
    conversationId = conversationId ?? randomUUID();
    const prev = await conversation.load(conversationId);
    inputHistory = [...prev, { role: "user", content: body.message as string }];
  }

  const result = await agent.runTurn(inputHistory);

  // Persiste o histórico atualizado (também útil no modo stateless para continuidade).
  await conversation.save(conversationId, result.history);

  return reply.send({
    answer: result.answer,
    toolUsed: result.toolUsed,
    data: result.data,
    meta: {
      conversationId,
      cacheHit: result.cacheHit,
      processingTimeMs: Date.now() - startedAt,
      model: env.GEMINI_MODEL,
    },
  });
}
