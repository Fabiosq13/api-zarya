import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { Eyebrow } from "@/components/ui/card";
import { seriesColor } from "@/lib/palette";
import { formatBRL, formatPct } from "@/lib/format";
import { formatDateLong } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PortfolioSummary } from "@/types";

interface Props {
  summary: PortfolioSummary;
  carteiraNome?: string;
  dtPesquisa: string;
}

export function HeroPanel({ summary, carteiraNome, dtPesquisa }: Props) {
  const positivoDia = summary.rendimentoDia >= 0;
  const positivoAcum = summary.rendimentoLiquidoTotal >= 0;

  // Daily move as a share of net worth — a real, honest ratio (not invented %).
  const diaPct =
    summary.totalBruto > 0
      ? (summary.rendimentoDia / summary.totalBruto) * 100
      : 0;

  // Allocation ribbon: top classes + an "outros" remainder. Real structure, not decor.
  const ribbon = (() => {
    const top = summary.porClasse.slice(0, 6);
    const rest = summary.porClasse.slice(6);
    const restPct = rest.reduce((a, b) => a + b.percentual, 0);
    const segs = top.map((c, i) => ({
      nome: c.nome,
      pct: c.percentual,
      color: seriesColor(i),
    }));
    if (restPct > 0.01)
      segs.push({ nome: "Outros", pct: restPct, color: "#3B3F57" });
    return segs;
  })();

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass relative overflow-hidden rounded-[1.6rem] border border-white/[0.07] p-6 sm:p-8"
    >
      {/* Ambient aurora */}
      <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 animate-aurora-drift rounded-full bg-primary/25 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/3 h-64 w-64 animate-aurora-drift rounded-full bg-aurora-3/20 blur-[110px] [animation-delay:-8s]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <Eyebrow>Patrimônio bruto</Eyebrow>
            {carteiraNome && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-0.5 text-[0.7rem] font-medium text-foreground/85">
                <Sparkles className="h-3 w-3 text-primary" />
                {carteiraNome}
              </span>
            )}
            <span className="font-mono text-[0.7rem] text-muted-foreground/80">
              {formatDateLong(dtPesquisa)}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-medium text-muted-foreground sm:text-3xl">
              R$
            </span>
            <AnimatedNumber
              value={summary.totalBruto}
              format={(n) =>
                new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(n)
              }
              className="font-display text-[2.6rem] font-semibold leading-none tracking-tight text-foreground tnum sm:text-[3.6rem]"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold tnum",
                positivoDia
                  ? "border-gain/30 bg-gain/10 text-gain"
                  : "border-loss/30 bg-loss/10 text-loss",
              )}
            >
              {positivoDia ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {formatBRL(summary.rendimentoDia)}
              <span className="font-mono text-[0.7rem] font-normal opacity-80">
                ({formatPct(Math.abs(diaPct))})
              </span>
            </div>
            <span className="text-sm text-muted-foreground">no dia</span>

            <span className="mx-1 hidden h-4 w-px bg-white/10 sm:block" />

            <span className="text-sm text-muted-foreground">
              Acumulado{" "}
              <span
                className={cn(
                  "tnum font-semibold",
                  positivoAcum ? "text-gain" : "text-loss",
                )}
              >
                {formatBRL(summary.rendimentoLiquidoTotal)}
              </span>
            </span>
          </div>
        </div>

        {/* Net worth, quietly secondary */}
        <div className="shrink-0 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-right">
          <Eyebrow>Patrimônio líquido</Eyebrow>
          <p className="tnum mt-1.5 font-display text-2xl font-semibold tracking-tight text-foreground">
            {formatBRL(summary.totalLiquido)}
          </p>
          <p className="mt-0.5 font-mono text-[0.7rem] text-muted-foreground">
            {summary.quantidadePosicoes} posições ativas
          </p>
        </div>
      </div>

      {/* Allocation ribbon — real composition, doubling as the hero's texture */}
      {ribbon.length > 0 && (
        <div className="relative mt-7">
          <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full">
            {ribbon.map((s, i) => (
              <motion.div
                key={s.nome + i}
                title={`${s.nome} · ${formatPct(s.pct)}`}
                initial={{ width: 0 }}
                animate={{ width: `${s.pct}%` }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ backgroundColor: s.color }}
                className="h-full first:rounded-l-full last:rounded-r-full"
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {ribbon.map((s, i) => (
              <span
                key={s.nome + i}
                className="flex items-center gap-1.5 text-[0.72rem] text-muted-foreground"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-foreground/80">{s.nome}</span>
                <span className="tnum font-mono text-[0.68rem] opacity-70">
                  {formatPct(s.pct)}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
