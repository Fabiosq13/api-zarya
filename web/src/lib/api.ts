import type {
  CarteirasResponse,
  ChatContext,
  ChatResponse,
  SummaryResponse,
} from "@/types";

// Em dev usamos o proxy do Vite (/api -> backend). Em produção, defina VITE_API_URL.
const BASE = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let detalhe = "";
    try {
      const body = await res.json();
      detalhe = body?.mensagem || body?.erro || "";
    } catch {
      /* ignore */
    }
    throw new Error(detalhe || `Falha na requisição (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function fetchCarteiras(dtPesquisa?: string): Promise<CarteirasResponse> {
  const qs = dtPesquisa ? `?dtPesquisa=${dtPesquisa}` : "";
  return request<CarteirasResponse>(`/api/v1/portfolio/carteiras${qs}`);
}

export function fetchSummary(
  dtPesquisa: string,
  idCarteira: number,
): Promise<SummaryResponse> {
  return request<SummaryResponse>(
    `/api/v1/portfolio/summary?dtPesquisa=${dtPesquisa}&idCarteira=${idCarteira}`,
  );
}

export function sendChat(params: {
  conversationId?: string;
  message: string;
  context?: ChatContext;
}): Promise<ChatResponse> {
  return request<ChatResponse>(`/api/v1/portfolio/chat`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}
