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

export interface GroupedItem {
  nome: string;
  valor: number;
  percentual: number;
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

export interface SummaryResponse {
  dtPesquisa: string;
  idCarteira: number;
  summary: PortfolioSummary;
  posicoes: DetailedPosition[];
  meta: { cacheHit: boolean };
}

export interface ChatData {
  dtPesquisa: string;
  idCarteira: number;
  summary: PortfolioSummary;
}

export interface ChatResponse {
  answer: string;
  toolUsed: boolean;
  data: ChatData | null;
  meta: {
    conversationId: string;
    cacheHit: boolean;
    processingTimeMs: number;
    model: string;
  };
}

export interface ChatContext {
  idCarteira?: number;
  noResumido?: string;
  dtPesquisa?: string;
}
