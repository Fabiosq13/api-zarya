import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { formatBRL, formatNumber, formatPct, formatDateLong } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PortfolioSummary } from "@/types";

interface Props {
  summary: PortfolioSummary;
  carteiraNome?: string;
  dtPesquisa: string;
}

export function SummaryCard({ summary, carteiraNome, dtPesquisa }: Props) {
  const upDia = summary.rendimentoDia >= 0;
  const upAcum = summary.rendimentoLiquidoTotal >= 0;
  const diaPct =
    summary.totalBruto > 0 ? (summary.rendimentoDia / summary.totalBruto) * 100 : 0;

  const stats = [
    { label: "Patrimônio líquido", value: formatBRL(summary.totalLiquido), tone: "text-foreground" },
    {
      label: "Rendimento acumulado",
      value: formatBRL(summary.rendimentoLiquidoTotal),
      tone: upAcum ? "text-gain" : "text-loss",
    },
    { label: "Posições", value: formatNumber(summary.quantidadePosicoes), tone: "text-foreground" },
  ];

  return (
    <section className="surface fade-up grid grid-cols-1 gap-6 rounded-2xl p-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
      <div>
        <p className="eyebrow">Patrimônio bruto</p>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-xl font-medium text-muted-foreground">R$</span>
          <AnimatedNumber
            value={summary.totalBruto}
            format={(n) =>
              new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(n)
            }
            className="num text-[2.4rem] font-bold leading-none tracking-tight text-foreground sm:text-[3rem]"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span
            className={cn(
              "num inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold",
              upDia ? "bg-gain/12 text-gain" : "bg-loss/12 text-loss",
            )}
          >
            {upDia ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {formatBRL(summary.rendimentoDia)}
            <span className="font-normal opacity-80">({formatPct(Math.abs(diaPct))})</span>
          </span>
          <span className="text-muted-foreground">no dia</span>
          {carteiraNome && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-foreground/80">{carteiraNome}</span>
            </>
          )}
          <span className="text-muted-foreground/40">·</span>
          <span className="num text-muted-foreground">{formatDateLong(dtPesquisa)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 lg:border-l lg:border-white/[0.06] lg:pl-6">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-[0.7rem] leading-tight text-muted-foreground">{s.label}</p>
            <p className={cn("num mt-1 text-base font-bold tracking-tight sm:text-lg", s.tone)}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
