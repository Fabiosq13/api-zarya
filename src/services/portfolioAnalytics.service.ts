import type {
  NormalizedPosition,
  PortfolioSummary,
  GroupedItem,
  VencimentoItem,
} from "../types/portfolio.types.js";
import { pct, round2 } from "../utils/number.util.js";

function sum<T>(arr: T[], f: (x: T) => number): number {
  return round2(arr.reduce((acc, x) => acc + (f(x) || 0), 0));
}

/** Agrupa por uma chave, soma um valor e calcula o % sobre o total. Ordena desc. */
function groupAndRank<T>(
  arr: T[],
  key: (x: T) => string,
  val: (x: T) => number,
  total: number,
): GroupedItem[] {
  const map = new Map<string, number>();
  for (const x of arr) {
    const k = key(x);
    map.set(k, (map.get(k) ?? 0) + (val(x) || 0));
  }
  return [...map.entries()]
    .map(([nome, valor]) => ({ nome, valor: round2(valor), percentual: pct(valor, total) }))
    .sort((a, b) => b.valor - a.valor);
}

/**
 * Calcula TODAS as agregações determinísticas de uma vez (O(n)).
 * É a fonte de verdade dos números — a LLM apenas narra o que sai daqui.
 */
export function buildSummary(positions: NormalizedPosition[]): PortfolioSummary {
  const totalBruto = sum(positions, (p) => p.vlEstoque);

  const porClasse = groupAndRank(positions, (p) => p.noClasse, (p) => p.vlEstoque, totalBruto);
  const porFamilia = groupAndRank(positions, (p) => p.noFamiliaProduto, (p) => p.vlEstoque, totalBruto);
  const porAtivo = groupAndRank(positions, (p) => p.noAtivo, (p) => p.vlEstoque, totalBruto);
  const porCarteira = groupAndRank(positions, (p) => `Carteira ${p.nuPortfolio}`, (p) => p.vlEstoque, totalBruto);

  const maioresPosicoes = porAtivo.slice(0, 10);

  const vencendoEm90Dias: VencimentoItem[] = positions
    .filter((p) => p.diasParaVencimento != null && p.diasParaVencimento >= 0 && p.diasParaVencimento <= 90)
    .map((p) => ({
      ativo: p.noAtivo,
      emissor: p.noEmissor,
      dtVencimento: p.dtVencimento as string,
      diasParaVencimento: p.diasParaVencimento as number,
      valor: round2(p.vlEstoque),
    }))
    .sort((a, b) => a.diasParaVencimento - b.diasParaVencimento);

  return {
    totalBruto,
    totalLiquido: sum(positions, (p) => p.vlLiquido),
    rendimentoLiquidoTotal: sum(positions, (p) => p.vlRendimentoLiquido),
    rendimentoDia: sum(positions, (p) => p.vlRendimentoDia),
    tributosTotais: sum(positions, (p) => p.vlTributos),
    irrfTotal: sum(positions, (p) => p.vlIRRF),
    iofTotal: sum(positions, (p) => p.vlIOF),
    quantidadePosicoes: positions.length,

    porClasse,
    porFamilia,
    porAtivo,
    porCarteira,
    maioresPosicoes,
    vencendoEm90Dias,
  };
}
