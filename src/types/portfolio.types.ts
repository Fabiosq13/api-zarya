/**
 * Tipos do domínio interno: posição normalizada (números garantidos, datas tratadas)
 * e as agregações determinísticas calculadas pelo analytics.
 */

export interface NormalizedPosition {
  nuPortfolio: number;
  noResumido: string;
  noClasse: string;
  noSubClasse: string;
  noFamiliaProduto: string;
  noAtivo: string;
  noEmissor: string | null;
  noIndice: string | null;

  qtTotal: number;
  puEstoque: number;
  prPortfolio: number;

  vlEstoque: number;
  vlLiquido: number;
  vlRendimentoLiquido: number;
  vlRendimentoDia: number;
  vlTributos: number;
  vlIRRF: number;
  vlIOF: number;

  dtVencimento: string | null;
  diasParaVencimento: number | null;
}

/** Posição individual exposta na visão detalhada (tabela de posições). */
export interface DetailedPosition {
  ativo: string;
  classe: string;
  subClasse: string;
  familia: string;
  emissor: string | null;
  indice: string | null;
  quantidade: number;
  valor: number;
  valorLiquido: number;
  rendimentoLiquido: number;
  rendimentoDia: number;
  percentual: number;
  dtVencimento: string | null;
  diasParaVencimento: number | null;
}

export interface GroupedItem {
  nome: string;
  valor: number;
  percentual: number;
}

/** Item da lista de carteiras (tipos de carteira) selecionáveis na interface. */
export interface CarteiraItem {
  idCarteira: number;
  noResumido: string;
  valorTotal: number;
  quantidadePosicoes: number;
}

export interface CarteirasResponse {
  dtPesquisa: string;
  carteiras: CarteiraItem[];
}

export interface VencimentoItem {
  ativo: string;
  emissor: string | null;
  dtVencimento: string;
  diasParaVencimento: number;
  valor: number;
}

export interface PortfolioSummary {
  totalBruto: number;
  totalLiquido: number;
  rendimentoLiquidoTotal: number;
  rendimentoDia: number;
  tributosTotais: number;
  irrfTotal: number;
  iofTotal: number;
  quantidadePosicoes: number;

  porClasse: GroupedItem[];
  porFamilia: GroupedItem[];
  porAtivo: GroupedItem[];
  porCarteira: GroupedItem[];
  maioresPosicoes: GroupedItem[];
  vencendoEm90Dias: VencimentoItem[];
}

/** Mensagem de chat no formato do nosso domínio (mapeada para o formato do Gemini). */
export interface ChatMessage {
  role: "user" | "model";
  content: string;
}
