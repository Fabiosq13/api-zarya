import { env } from "../config/env.js";
import { validarDtPesquisa } from "../utils/date.util.js";
import { round2 } from "../utils/number.util.js";
import * as zarya from "./zarya.service.js";
import * as analytics from "./portfolioAnalytics.service.js";
import * as cache from "./cache.service.js";
import { normalizeAll } from "./normalize.js";
import type {
  NormalizedPosition,
  PortfolioSummary,
  CarteiraItem,
  CarteirasResponse,
  DetailedPosition,
} from "../types/portfolio.types.js";

/**
 * Carrega a composição NORMALIZADA da carteira (com cache) para uma data/carteira.
 * É o ponto único usado tanto pelos endpoints REST quanto pelo agente do chat,
 * garantindo o mesmo tratamento determinístico em todos os caminhos.
 */
export async function loadComposition(
  dtPesquisa: string,
  idCarteira = 0,
): Promise<{ positions: NormalizedPosition[]; cacheHit: boolean }> {
  const key = `comp:${dtPesquisa}:${idCarteira}`;
  const cached = await cache.get<NormalizedPosition[]>(key);
  if (cached) return { positions: cached, cacheHit: true };

  const raw = await zarya.buscaComposicao({ dtPesquisa, idCarteira });
  const positions = normalizeAll(raw.Object);
  await cache.set(key, positions, env.CACHE_TTL_SECONDS);
  return { positions, cacheHit: false };
}

/** Resumo (indicadores + dados de gráfico) de uma carteira/data. */
export async function getSummary(
  dtPesquisa: string,
  idCarteira = 0,
): Promise<{
  summary: PortfolioSummary;
  posicoes: DetailedPosition[];
  cacheHit: boolean;
}> {
  const { positions, cacheHit } = await loadComposition(dtPesquisa, idCarteira);
  return {
    summary: analytics.buildSummary(positions),
    posicoes: analytics.buildDetailedPositions(positions),
    cacheHit,
  };
}

/** Extrai a lista de carteiras (tipos) distintas de uma composição geral (id 0). */
function extrairCarteiras(positions: NormalizedPosition[]): CarteiraItem[] {
  const map = new Map<number, CarteiraItem>();
  for (const p of positions) {
    const atual = map.get(p.nuPortfolio);
    if (atual) {
      atual.valorTotal = round2(atual.valorTotal + (p.vlEstoque || 0));
      atual.quantidadePosicoes += 1;
    } else {
      map.set(p.nuPortfolio, {
        idCarteira: p.nuPortfolio,
        noResumido: p.noResumido,
        valorTotal: round2(p.vlEstoque || 0),
        quantidadePosicoes: 1,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.valorTotal - a.valorTotal);
}

/**
 * Lista as carteiras disponíveis para a interface.
 * Procura uma data com dados a partir de `dtPesquisa` (ou da data padrão),
 * andando alguns dias para trás — útil porque nem toda data tem posição.
 */
export async function listCarteiras(dtPesquisaSolicitada?: string): Promise<CarteirasResponse> {
  const base = resolverDataBase(dtPesquisaSolicitada);

  for (let i = 0; i <= env.PORTFOLIO_LOOKBACK_DAYS; i++) {
    const dia = subtrairDias(base, i);
    const { positions } = await loadComposition(dia, 0);
    if (positions.length > 0) {
      return { dtPesquisa: dia, carteiras: extrairCarteiras(positions) };
    }
  }

  // Sem dados no intervalo procurado: cai para a data padrão conhecida.
  const fallback = env.PORTFOLIO_DEFAULT_DATE;
  const { positions } = await loadComposition(fallback, 0);
  return { dtPesquisa: fallback, carteiras: extrairCarteiras(positions) };
}

function resolverDataBase(dt?: string): string {
  const check = validarDtPesquisa(dt);
  if (check.ok) return check.value;
  return env.PORTFOLIO_DEFAULT_DATE;
}

function subtrairDias(isoDate: string, dias: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - dias);
  return d.toISOString().slice(0, 10);
}
