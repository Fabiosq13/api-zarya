import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  Landmark,
  Receipt,
  ScrollText,
  TrendingUp,
} from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { formatBRL, formatNumber } from "@/lib/format";
import type { PortfolioSummary } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  summary: PortfolioSummary;
}

export function KpiCards({ summary }: Props) {
  const positivoDia = summary.rendimentoDia >= 0;
  const positivoTotal = summary.rendimentoLiquidoTotal >= 0;

  const items = [
    {
      label: "Rend. acumulado",
      value: summary.rendimentoLiquidoTotal,
      icon: TrendingUp,
      accent: positivoTotal ? "text-gain" : "text-loss",
      dot: positivoTotal ? "bg-gain" : "bg-loss",
      money: true,
      trend: positivoTotal,
    },
    {
      label: "Rend. no dia",
      value: summary.rendimentoDia,
      icon: positivoDia ? ArrowUpRight : ArrowDownRight,
      accent: positivoDia ? "text-gain" : "text-loss",
      dot: positivoDia ? "bg-gain" : "bg-loss",
      money: true,
      trend: positivoDia,
    },
    {
      label: "Tributos totais",
      value: summary.tributosTotais,
      icon: Receipt,
      accent: "text-gold",
      dot: "bg-gold",
      money: true,
    },
    {
      label: "IRRF",
      value: summary.irrfTotal,
      icon: ScrollText,
      accent: "text-aurora-2",
      dot: "bg-aurora-2",
      money: true,
    },
    {
      label: "IOF",
      value: summary.iofTotal,
      icon: Landmark,
      accent: "text-aurora-3",
      dot: "bg-aurora-3",
      money: true,
    },
    {
      label: "Posições",
      value: summary.quantidadePosicoes,
      icon: Coins,
      accent: "text-primary",
      dot: "bg-primary",
      money: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -3 }}
            className="glass group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] p-4"
          >
            {/* top accent hairline */}
            <span
              className={cn(
                "absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100",
                item.dot,
              )}
            />
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                <span className={cn("h-1.5 w-1.5 rounded-full", item.dot)} />
                {item.label}
              </span>
              <Icon className={cn("h-3.5 w-3.5 opacity-60", item.accent)} />
            </div>
            <AnimatedNumber
              value={item.value}
              format={item.money ? formatBRL : formatNumber}
              className={cn(
                "tnum block font-sans text-lg font-bold tracking-tight sm:text-xl",
                item.trend !== undefined ? item.accent : "text-foreground",
              )}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
