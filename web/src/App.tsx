import { useCallback, useEffect, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { fetchCarteiras, fetchSummary } from "@/lib/api";
import type { CarteiraItem, ChatData, PortfolioSummary } from "@/types";
import { Sidebar, NAV } from "@/components/Sidebar";
import { WalletSelector } from "@/components/WalletSelector";
import { DateSelector } from "@/components/DateSelector";
import { KpiRow } from "@/components/KpiRow";
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
  const [active, setActive] = useState("visao-geral");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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

  function navigate(id: string) {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const carteiraAtual = carteiras.find((c) => c.idCarteira === idCarteira);
  const semDados = summary && summary.quantidadePosicoes === 0;
  const busy = loadingSummary || bootLoading;
  const pageTitle = NAV.find((n) => n.id === active)?.label ?? "Visão geral";

  return (
    <div className="min-h-screen">
      {/* Sidebar fixa (lg+) */}
      <aside className="z-40 hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-[248px] lg:flex-col">
        <Sidebar active={active} onNavigate={navigate} patrimonio={summary?.totalBruto} carteiraNome={carteiraAtual?.noResumido} />
      </aside>

      <div className="lg:pl-[248px]">
        {/* Marca no mobile */}
        <div className="flex items-center gap-2.5 bg-sidebar px-4 py-3 text-white lg:hidden">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none">
              <path d="M5 15 L10 9 L13.5 12.5 L19 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="19" cy="6" r="1.9" fill="white" />
            </svg>
          </div>
          <span className="text-base font-extrabold tracking-tight">Zarya</span>
        </div>

        {/* Topbar de conteúdo */}
        <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur">
          <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div className="min-w-0">
              <h1 className="text-lg font-extrabold tracking-tight">{pageTitle}</h1>
              {dtPesquisa && (
                <p className="num text-xs text-muted-foreground">Posição em {formatDateLong(dtPesquisa)}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
            </div>
          </div>
        </header>

        {/* Corpo */}
        <div className="p-4 lg:p-6 xl:grid xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-6">
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
                <section ref={(el) => (sectionRefs.current["visao-geral"] = el)} className="scroll-mt-24">
                  <KpiRow summary={summary} />
                </section>
                <section ref={(el) => (sectionRefs.current["alocacao"] = el)} className="scroll-mt-24 grid grid-cols-1 gap-5 2xl:grid-cols-2">
                  <DonutAllocation summary={summary} />
                  <TopPositions summary={summary} />
                </section>
                <section ref={(el) => (sectionRefs.current["vencimentos"] = el)} className="scroll-mt-24">
                  <VencimentosCard summary={summary} />
                </section>
              </div>
            ) : null}
          </main>

          <aside
            id="copiloto"
            ref={(el) => (sectionRefs.current["copiloto"] = el)}
            className="mt-5 h-[560px] scroll-mt-24 xl:mt-0 xl:h-[calc(100vh-7rem)] xl:sticky xl:top-[5.5rem]"
          >
            <ChatPanel
              context={{ idCarteira, noResumido: carteiraAtual?.noResumido, dtPesquisa }}
              onData={handleChatData}
            />
          </aside>
        </div>
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
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <Skeleton className="h-48" />
    </div>
  );
}
