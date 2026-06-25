import type { ZaryaPosition } from "../types/zarya.types.js";
import type { NormalizedPosition } from "../types/portfolio.types.js";
import { isSentinelDate, diasAteVencimento } from "../utils/date.util.js";
import { toNumber } from "../utils/number.util.js";

/**
 * Converte uma posição CRUA da Zarya em uma posição NORMALIZADA:
 * - datas sentinela viram null;
 * - números são forçados a valores finitos;
 * - cria campos derivados (diasParaVencimento).
 */
export function normalizePosition(raw: ZaryaPosition): NormalizedPosition {
  const dtVencimento = isSentinelDate(raw.dt_Vencimento) ? null : raw.dt_Vencimento ?? null;

  return {
    nuPortfolio: toNumber(raw.nu_Portfolio),
    noClasse: raw.no_Classe?.trim() || "Não classificado",
    noSubClasse: raw.no_Sub_Classe?.trim() || "Não classificado",
    noFamiliaProduto: raw.no_Familia_Produto?.trim() || "Não classificado",
    noAtivo: raw.no_Ativo?.trim() || "—",
    noEmissor: raw.no_Emissor?.trim() || null,
    noIndice: raw.no_Indice?.trim() || null,

    vlEstoque: toNumber(raw.vl_Estoque),
    vlLiquido: toNumber(raw.vl_Liquido),
    vlRendimentoLiquido: toNumber(raw.vl_Rendimento_Liquido),
    vlRendimentoDia: toNumber(raw.vl_Rendimento_Dia),
    vlTributos: toNumber(raw.vl_Tributos),
    vlIRRF: toNumber(raw.vl_IRRF),
    vlIOF: toNumber(raw.vl_IOF),

    dtVencimento,
    diasParaVencimento: dtVencimento ? diasAteVencimento(dtVencimento) : null,
  };
}

export function normalizeAll(positions: ZaryaPosition[]): NormalizedPosition[] {
  return positions.map(normalizePosition);
}
