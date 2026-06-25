import { GoogleGenAI, Type, type Content, type Tool } from "@google/genai";
import { env } from "../config/env.js";
import { validarDtPesquisa } from "../utils/date.util.js";
import { buildSystemPrompt } from "./prompt.js";
import * as zarya from "./zarya.service.js";
import * as analytics from "./portfolioAnalytics.service.js";
import * as cache from "./cache.service.js";
import { normalizeAll } from "./normalize.js";
import type { ChatMessage, PortfolioSummary } from "../types/portfolio.types.js";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const TOOL_NAME = "consultarComposicaoCarteira";
const MAX_ITERATIONS = 4; // proteção contra loop de tool calls

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: TOOL_NAME,
        description:
          "Busca a composição da carteira do usuário em uma data específica e retorna totais, " +
          "exposição por classe, maiores ativos, rendimentos, tributos e vencimentos. " +
          "Use SOMENTE quando o usuário pedir dados reais da carteira (posições, valores, " +
          "exposição, concentração, rendimento, tributos, vencimentos). " +
          "NÃO use em saudações, conversa geral ou perguntas conceituais. " +
          "Se o usuário pedir dados mas não informar a data e ela não puder ser inferida do " +
          "contexto, NÃO chame esta função — pergunte a data a ele.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            dtPesquisa: {
              type: Type.STRING,
              description: "Data da posição no formato YYYY-MM-DD, extraída da conversa.",
            },
            idCarteira: {
              type: Type.INTEGER,
              description: "ID da carteira. Use 0 para a visão geral (padrão).",
            },
          },
          required: ["dtPesquisa"],
        },
      },
    ],
  },
];

export interface AgentResult {
  answer: string;
  toolUsed: boolean;
  data: { dtPesquisa: string; idCarteira: number; summary: PortfolioSummary } | null;
  cacheHit: boolean;
  history: ChatMessage[];
}

/** Converte nosso histórico de domínio para o formato Content do Gemini. */
function toContents(history: ChatMessage[]): Content[] {
  return history.map((m) => ({ role: m.role, parts: [{ text: m.content }] }));
}

/** Executa a ferramenta de verdade: valida data -> cache -> Zarya -> analytics. */
async function executarFerramenta(args: Record<string, unknown>): Promise<{
  resultParaLLM: unknown;
  data: AgentResult["data"];
  cacheHit: boolean;
}> {
  const dtPesquisa = typeof args.dtPesquisa === "string" ? args.dtPesquisa : undefined;
  const idCarteira = typeof args.idCarteira === "number" ? args.idCarteira : 0;

  const check = validarDtPesquisa(dtPesquisa);
  if (!check.ok) {
    return {
      resultParaLLM: {
        erro: "data_invalida",
        motivo: check.motivo,
        instrucao:
          "A data não pôde ser usada. Peça ao usuário, de forma educada, qual data ele deseja " +
          "para a posição da carteira (ex.: 2025-06-05).",
      },
      data: null,
      cacheHit: false,
    };
  }

  const key = `comp:${check.value}:${idCarteira}`;
  let normalized = await cache.get<ReturnType<typeof normalizeAll>>(key);
  let cacheHit = true;

  if (!normalized) {
    cacheHit = false;
    const raw = await zarya.buscaComposicao({ dtPesquisa: check.value, idCarteira });
    normalized = normalizeAll(raw.Object);
    await cache.set(key, normalized, env.CACHE_TTL_SECONDS);
  }

  const summary = analytics.buildSummary(normalized);

  // Curto-circuito: carteira vazia para a data -> não há o que narrar.
  const semDados = summary.quantidadePosicoes === 0;

  return {
    resultParaLLM: semDados
      ? { aviso: "sem_dados", mensagem: "Não há posições para esta data/carteira." }
      : summary,
    data: { dtPesquisa: check.value, idCarteira, summary },
    cacheHit,
  };
}

/**
 * Roda um turno completo do agente.
 * Decide (via function calling) se conversa ou consulta a carteira, executa a
 * ferramenta no backend e devolve a narração + os dados calculados.
 */
export async function runTurn(history: ChatMessage[]): Promise<AgentResult> {
  const systemInstruction = buildSystemPrompt(new Date());
  const contents = toContents(history);

  let toolUsed = false;
  let cacheHit = false;
  let data: AgentResult["data"] = null;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const res = await ai.models.generateContent({
      model: env.GEMINI_MODEL,
      config: { systemInstruction, temperature: 0.2, tools },
      contents,
    });

    const calls = res.functionCalls;
    const fc = calls?.[0];

    if (!fc || fc.name !== TOOL_NAME) {
      const answer = res.text ?? "";
      const nextHistory: ChatMessage[] = [...history, { role: "model", content: answer }];
      return { answer, toolUsed, data, cacheHit, history: nextHistory };
    }

    toolUsed = true;
    const exec = await executarFerramenta(fc.args ?? {});
    if (exec.data) data = exec.data;
    cacheHit = exec.cacheHit;

    // Reinjeta a chamada do modelo e a resposta da ferramenta no contexto,
    // para que o modelo narre (ou peça a data) na próxima iteração.
    contents.push({ role: "model", parts: [{ functionCall: fc }] });
    contents.push({
      role: "user",
      parts: [
        {
          functionResponse: {
            name: TOOL_NAME,
            response: exec.resultParaLLM as Record<string, unknown>,
          },
        },
      ],
    });
  }

  // Excedeu o limite de iterações sem uma resposta textual.
  const fallback = "Não consegui concluir a consulta agora. Pode reformular a pergunta?";
  return {
    answer: fallback,
    toolUsed,
    data,
    cacheHit,
    history: [...history, { role: "model", content: fallback }],
  };
}
