import { useCallback, useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { fetchCarteiras, fetchSummary } from "@/lib/api";
import type { CarteiraItem, ChatData, PortfolioSummary } from "@/types";
import { Header } from "@/components/Header";
import { WalletSelector } from "@/components/WalletSelector";
import { DateSelector } from "@/components/DateSelector";
import { SummaryHero } from "@/components/SummaryHero";
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
    <div className="min-h-screen">
      <Header carteiraNome={!bootLoading ? carteiraAtual?.noResumido : undefined}>
        {bootLoading ? (
          <>
            <Skeleton className="h-10 w-full sm:w-[18rem]" />
            <Skeleton className="h-10 w-full sm:w-[12.5rem]" />
          </>
        ) : (
          <>
            <WalletSelector carteiras={carteiras} value={idCarteira} onChange={setIdCarteira} />
            <DateSelector value={dtPesquisa} onChange={setDtPesquisa} />
          </>
        )}
      </Header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 p-4 lg:p-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <main className="min-w-0 space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-loss/30 bg-loss/8 px-4 py-3 text-sm text-loss">
              <TriangleAlert className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {busy ? (
            <DashboardSkeleton />
          ) : semDados ? (
            <EmptyState carteira={carteiraAtual?.noResumido} data={dtPesquisa} />
          ) : summary ? (
            <div key={`${idCarteira}-${dtPesquisa}`} className="space-y-5">
              <SummaryHero summary={summary} dtPesquisa={dtPesquisa} />
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <DonutAllocation summary={summary} />
                <TopPositions summary={summary} />
              </div>
              <VencimentosCard summary={summary} />
            </div>
          ) : null}
        </main>

        <aside className="h-[560px] xl:sticky xl:top-[5.25rem] xl:h-[calc(100vh-6.5rem)]">
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
    <div className="card flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] py-20 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold/10">
        <TriangleAlert className="h-6 w-6 text-gold" />
      </div>
      <p className="text-lg font-bold">Sem posições nesta data</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Não há dados para {carteira ?? "esta carteira"} em {formatDateLong(data)}. Escolha outra data.
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-40" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
      <Skeleton className="h-48" />
    </div>
  );
}
