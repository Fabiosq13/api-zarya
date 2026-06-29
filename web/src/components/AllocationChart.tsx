import { useState } from "react";
import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, Eyebrow } from "@/components/ui/card";
import { seriesColor } from "@/lib/palette";
import { formatBRL, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GroupedItem, PortfolioSummary } from "@/types";

type Dim = "porClasse" | "porFamilia" | "porAtivo";

const DIMS: { key: Dim; label: string }[] = [
  { key: "porClasse", label: "Classe" },
  { key: "porFamilia", label: "Família" },
  { key: "porAtivo", label: "Ativo" },
];

interface Props {
  summary: PortfolioSummary;
  dimension?: Dim;
}

export function AllocationChart({ summary, dimension }: Props) {
  const [dim, setDim] = useState<Dim>(dimension ?? "porClasse");
  const [active, setActive] = useState(0);

  const raw = summary[dim] as GroupedItem[];
  const data = raw.slice(0, 8);
  const resto = raw.slice(8);
  if (resto.length) {
    data.push({
      nome: `Outros (${resto.length})`,
      valor: resto.reduce((a, b) => a + b.valor, 0),
      percentual: resto.reduce((a, b) => a + b.percentual, 0),
    });
  }

  const activeItem = data[active] ?? data[0];

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <Eyebrow>Composição</Eyebrow>
          <CardTitle>Alocação por {DIMS.find((d) => d.key === dim)?.label.toLowerCase()}</CardTitle>
        </div>
        <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
          {DIMS.map((d) => (
            <button
              key={d.key}
              onClick={() => {
                setDim(d.key);
                setActive(0);
              }}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                dim === d.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-[210px_1fr]">
          <div className="relative mx-auto h-[210px] w-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="valor"
                  nameKey="nome"
                  cx="50%"
                  cy="50%"
                  innerRadius={66}
                  outerRadius={92}
                  paddingAngle={2.5}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                  activeIndex={active}
                  activeShape={(props: any) => (
                    <Sector {...props} outerRadius={props.outerRadius + 7} cornerRadius={3} />
                  )}
                  cornerRadius={3}
                  onMouseEnter={(_, idx) => setActive(idx)}
                  isAnimationActive
                  animationDuration={700}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={seriesColor(i)} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="max-w-[120px] truncate font-mono text-[0.66rem] uppercase tracking-wide text-muted-foreground">
                {activeItem?.nome}
              </span>
              <span className="tnum font-display text-2xl font-semibold text-foreground">
                {formatPct(activeItem?.percentual ?? 0)}
              </span>
              <span className="tnum mt-0.5 font-mono text-[0.66rem] text-muted-foreground">
                {formatBRL(activeItem?.valor ?? 0)}
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            {data.map((item, i) => (
              <motion.button
                key={item.nome}
                onMouseEnter={() => setActive(i)}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.035 }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                  active === i ? "bg-white/[0.06]" : "hover:bg-white/[0.03]",
                )}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform"
                  style={{
                    backgroundColor: seriesColor(i),
                    transform: active === i ? "scale(1.35)" : "scale(1)",
                  }}
                />
                <span className="flex-1 truncate text-sm text-foreground/90">
                  {item.nome}
                </span>
                <span className="tnum hidden shrink-0 font-mono text-[0.7rem] text-muted-foreground sm:block">
                  {formatBRL(item.valor)}
                </span>
                <span className="tnum w-14 shrink-0 text-right text-xs font-semibold text-foreground">
                  {formatPct(item.percentual)}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
