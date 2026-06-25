import { z } from "zod";

/** Uma mensagem de chat enviada pelo cliente. */
export const chatMessageSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string().min(1).max(4000),
});

/**
 * Corpo do POST /api/v1/portfolio/chat.
 * Duas formas de uso:
 *  - stateful: enviar `conversationId` + `message` (o backend guarda o histórico);
 *  - stateless: enviar `messages` (histórico completo a cada request).
 * Pelo menos um caminho deve ser fornecido.
 */
export const chatBodySchema = z
  .object({
    conversationId: z.string().min(1).max(100).optional(),
    message: z.string().trim().min(1).max(4000).optional(),
    messages: z.array(chatMessageSchema).min(1).max(50).optional(),
  })
  .refine((b) => !!b.message || (b.messages && b.messages.length > 0), {
    message: "Informe 'message' (com conversationId) ou 'messages'.",
  });

export type ChatBody = z.infer<typeof chatBodySchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
