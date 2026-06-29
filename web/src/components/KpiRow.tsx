import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { formatBRL, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PortfolioSummary } from "@/types";

interface Props {
  summary: PortfolioSummary;
}

export function KpiRow({ summary }: Props) {
  const upDia = summary.rendimentoDia >= 0;
  const upAcum = summary.rendimentoLiquidoTotal >= 0;
  const diaPct = summary.totalBruto > 0 ? (summary.rendimentoDia / summary.totalBruto) * 100 : 0;

  const cards = [
    { label: "Patrimônio bruto", value: summary.totalBruto, tone: "text-ink", chip: null as null | { up: boolean; text: string } },
    { label: "Patrimônio líquido", value: summary.totalLiquido, tone: "text-ink", sub: "líquido de tributos" },
    {
      label: "Rendimento no dia",
      value: summary.rendimentoDia,
      tone: upDia ? "text-gain" : "text-loss",
      chip: { up: upDia, text: formatPct(Math.abs(diaPct)) },
    },
    { label: "Rendimento acumulado", value: summary.rendimentoLiquidoTotal, tone: upAcum ? "text-gain" : "text-loss" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {cards.map((c, i) => (
        <div
          key={c.label}
          className="card card-hover fade-up rounded-[var(--radius)] p-4 sm:p-5"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="flex items-start justify-between">
            <p className="eyebrow">{c.label}</p>
            {"chip" in c && c.chip && (
              <span className={cn("num inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[0.7rem] font-bold", c.chip.up ? "chip-gain" : "chip-loss")}>
                {c.chip.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {c.chip.text}
              </span>
            )}
          </div>
          <AnimatedNumber
            value={c.value}
            format={formatBRL}
            className={cn("num mt-2 block text-xl font-extrabold tracking-tight sm:text-2xl", c.tone)}
          />
          {"sub" in c && c.sub && <p className="mt-1 text-[0.72rem] text-muted-foreground">{c.sub}</p>}
        </div>
      ))}
    </div>
  );
}
