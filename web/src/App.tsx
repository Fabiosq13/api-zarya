import { useCallback, useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { fetchCarteiras, fetchSummary } from "@/lib/api";
import type { CarteiraItem, ChatData, PortfolioSummary } from "@/types";
import { WalletSelector } from "@/components/WalletSelector";
import { DateSelector } from "@/components/DateSelector";
import { SummaryCard } from "@/components/SummaryCard";
import { DonutAllocation } from "@/components/DonutAllocation";
import { TopPositions } from "@/components/TopPositions";
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

  const handleChatData = useCallback(
    (data: ChatData) => {
      setSummary(data.summary);
      if (data.dtPesquisa) setDtPesquisa(data.dtPesquisa);
      if (data.idCarteira != null && carteiras.some((c) => c.idCarteira === data.idCarteira)) {
        setIdCarteira(data.idCarteira);
      }
    },
    [carteiras],
  );

  const carteiraAtual = carteiras.find((c) => c.idCarteira === idCarteira);
  const semDados = summary && summary.quantidadePosicoes === 0;
  const busy = loadingSummary || bootLoading;

  return (
    <div className="min-h-screen w-full">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-end sm:justify-between lg:px-6">
          <div className="flex items-center gap-2.5 self-start sm:self-auto sm:pb-1">
            <div className="aurora grid h-9 w-9 place-items-center rounded-xl">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M5 15 L10 9 L13.5 12.5 L19 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="19" cy="6" r="1.9" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Zarya</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            {bootLoading ? (
              <>
                <Skeleton className="h-11 w-full sm:w-[20rem]" />
                <Skeleton className="h-11 w-full sm:w-[13rem]" />
              </>
            ) : (
              <>
                <WalletSelector carteiras={carteiras} value={idCarteira} onChange={setIdCarteira} />
                <DateSelector value={dtPesquisa} onChange={setDtPesquisa} />
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_380px] lg:p-6">
        <main className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-loss/30 bg-loss/10 px-4 py-3 text-sm text-loss">
              <TriangleAlert className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {busy ? (
            <DashboardSkeleton />
          ) : semDados ? (
            <EmptyState carteira={carteiraAtual?.noResumido} data={dtPesquisa} />
          ) : summary ? (
            <div key={`${idCarteira}-${dtPesquisa}`} className="space-y-4">
              <SummaryCard summary={summary} carteiraNome={carteiraAtual?.noResumido} dtPesquisa={dtPesquisa} />
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <DonutAllocation summary={summary} />
                <TopPositions summary={summary} />
              </div>
              <VencimentosCard summary={summary} />
            </div>
          ) : null}
        </main>

        <aside className="lg:sticky lg:top-[5.5rem] lg:h-[calc(100vh-6.5rem)]">
          <ChatPanel
            context={{ idCarteira, noResumido: carteiraAtual?.noResumido, dtPesquisa }}
            onData={handleChatData}
          />
        </aside>
      </div>
    </div>
  );
}

function EmptyState({ carteira, data }: { carteira?: string; data: string }) {
  return (
    <div className="surface flex flex-col items-center justify-center gap-3 rounded-2xl py-20 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold/12">
        <TriangleAlert className="h-6 w-6 text-gold" />
      </div>
      <p className="text-lg font-semibold">Sem posições nesta data</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Não há dados para {carteira ?? "esta carteira"} em {formatDateLong(data)}. Escolha outra data.
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-44" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <Skeleton className="h-48" />
    </div>
  );
}
