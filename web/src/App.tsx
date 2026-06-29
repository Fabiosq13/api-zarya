import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";
import { fetchCarteiras, fetchSummary } from "@/lib/api";
import type { CarteiraItem, ChatData, PortfolioSummary } from "@/types";
import { WalletSelector } from "@/components/WalletSelector";
import { DateSelector } from "@/components/DateSelector";
import { HeroPanel } from "@/components/HeroPanel";
import { KpiCards } from "@/components/KpiCards";
import { AllocationChart } from "@/components/AllocationChart";
import { TopAssetsChart } from "@/components/TopAssetsChart";
import { VencimentosCard } from "@/components/VencimentosCard";
import { ChatPanel } from "@/components/ChatPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateLong } from "@/lib/format";

export default function App() {
  const [carteiras, setCarteiras] = useState<CarteiraItem[]>([]);
  const [idCarteira, setIdCarteira] = useState<number | undefined>();
  const [dtPesquisa, setDtPesquisa] = useState<string>("");
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Preload: wallet list (by no_Resumido) + a date that actually has data.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchCarteiras();
        setCarteiras(res.carteiras);
        setDtPesquisa(res.dtPesquisa);
        if (res.carteiras.length) setIdCarteira(res.carteiras[0].idCarteira);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falha ao carregar carteiras");
      } finally {
        setBootLoading(false);
      }
    })();
  }, []);

  const loadSummary = useCallback(async (date: string, id: number) => {
    setLoadingSummary(true);
    setError(null);
    try {
      const res = await fetchSummary(date, id);
      setSummary(res.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar dados");
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    if (idCarteira != null && dtPesquisa) loadSummary(dtPesquisa, idCarteira);
  }, [idCarteira, dtPesquisa, loadSummary]);

  // When the AI runs a new query, sync the panel to its result.
  const handleChatData = useCallback(
    (data: ChatData) => {
      setSummary(data.summary);
      if (data.dtPesquisa) setDtPesquisa(data.dtPesquisa);
      if (
        data.idCarteira != null &&
        carteiras.some((c) => c.idCarteira === data.idCarteira)
      ) {
        setIdCarteira(data.idCarteira);
      }
    },
    [carteiras],
  );

  const carteiraAtual = carteiras.find((c) => c.idCarteira === idCarteira);
  const semDados = summary && summary.quantidadePosicoes === 0;
  const busy = loadingSummary || bootLoading;

  return (
    <div className="grain relative min-h-screen w-full overflow-x-hidden">
      {/* Ambient canvas */}
      <div className="grid-bg pointer-events-none fixed inset-0" />
      <div className="orb -left-48 -top-48 h-[34rem] w-[34rem] animate-aurora-drift bg-primary/12" />
      <div className="orb right-[-12rem] top-1/4 h-[30rem] w-[30rem] animate-aurora-drift bg-aurora-3/10 [animation-delay:-10s]" />
      <div className="orb bottom-[-14rem] left-1/3 h-[28rem] w-[28rem] animate-aurora-drift bg-aurora-2/8 [animation-delay:-16s]" />

      {/* Sticky command bar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.05]">
        <div className="glass-strong">
          <div className="relative mx-auto flex max-w-[1640px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-end lg:justify-between lg:px-6">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl aurora-bg shadow-lg glow-primary">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path
                    d="M5 15 L10 9 L13.5 12.5 L19 6"
                    stroke="white"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="19" cy="6" r="1.9" fill="white" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold tracking-tight">
                  Zarya <span className="aurora-text">Insights</span>
                </h1>
                <p className="flex items-center gap-1.5 font-mono text-[0.66rem] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-gain animate-pulse-glow" />
                  Inteligência de carteira em tempo real
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              {bootLoading ? (
                <>
                  <Skeleton className="h-[3.25rem] w-full sm:w-[22rem]" />
                  <Skeleton className="h-[3.25rem] w-full sm:w-[15rem]" />
                </>
              ) : (
                <>
                  <WalletSelector
                    carteiras={carteiras}
                    value={idCarteira}
                    onChange={setIdCarteira}
                  />
                  <DateSelector value={dtPesquisa} onChange={setDtPesquisa} />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="relative mx-auto grid max-w-[1640px] grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_408px] lg:gap-5 lg:p-6">
        <main className="space-y-4 lg:space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">
              <TriangleAlert className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {busy ? (
            <DashboardSkeleton />
          ) : semDados ? (
            <EmptyState
              carteira={carteiraAtual?.noResumido}
              data={dtPesquisa}
            />
          ) : summary ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${idCarteira}-${dtPesquisa}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 lg:space-y-5"
              >
                <HeroPanel
                  summary={summary}
                  carteiraNome={carteiraAtual?.noResumido}
                  dtPesquisa={dtPesquisa}
                />
                <KpiCards summary={summary} />
                <div className="grid grid-cols-1 gap-4 lg:gap-5 xl:grid-cols-2">
                  <AllocationChart summary={summary} />
                  <TopAssetsChart summary={summary} />
                </div>
                <VencimentosCard summary={summary} />
              </motion.div>
            </AnimatePresence>
          ) : null}
        </main>

        <aside className="lg:sticky lg:top-[6.5rem] lg:h-[calc(100vh-7.5rem)]">
          <ChatPanel
            context={{
              idCarteira,
              noResumido: carteiraAtual?.noResumido,
              dtPesquisa,
            }}
            onData={handleChatData}
          />
        </aside>
      </div>
    </div>
  );
}

function EmptyState({ carteira, data }: { carteira?: string; data: string }) {
  return (
    <div className="glass flex flex-col items-center justify-center gap-3 rounded-[1.6rem] border border-white/[0.06] py-24 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold/12">
        <TriangleAlert className="h-7 w-7 text-gold" />
      </div>
      <p className="font-display text-lg font-semibold">Sem posições nesta data</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Não há dados para {carteira ?? "esta carteira"} em {formatDateLong(data)}.
        Escolha outra data no seletor acima.
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-52" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
      <Skeleton className="h-56" />
    </div>
  );
}
