import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

const SIZE = 168;
const STROKE = 20;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

interface Props {
  summary: PortfolioSummary;
}

export function DonutAllocation({ summary }: Props) {
  const [dim, setDim] = useState<Dim>("porClasse");
  const [active, setActive] = useState(0);

  const data = useMemo(() => {
    const raw = summary[dim] as GroupedItem[];
    const top = raw.slice(0, 8);
    const rest = raw.slice(8);
    if (rest.length) {
      top.push({
        nome: `Outros (${rest.length})`,
        valor: rest.reduce((a, b) => a + b.valor, 0),
        percentual: rest.reduce((a, b) => a + b.percentual, 0),
      });
    }
    return top;
  }, [summary, dim]);

  const activeItem = data[Math.min(active, data.length - 1)] ?? data[0];

  // segmentos do anel
  let acc = 0;
  const arcs = data.map((d, i) => {
    const len = (d.percentual / 100) * C;
    const arc = { len, offset: -acc, color: seriesColor(i) };
    acc += len;
    return arc;
  });

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Composição</p>
          <h3 className="mt-1 text-[0.95rem] font-semibold tracking-tight">Alocação</h3>
        </div>
        <div className="flex shrink-0 gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] p-1">
          {DIMS.map((d) => (
            <button
              key={d.key}
              onClick={() => {
                setDim(d.key);
                setActive(0);
              }}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                dim === d.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          {/* Donut */}
          <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
              <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  fill="none"
                  stroke="hsl(230 18% 20%)"
                  strokeWidth={STROKE}
                />
                {arcs.map((a, i) => (
                  <circle
                    key={i}
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={R}
                    fill="none"
                    stroke={a.color}
                    strokeWidth={active === i ? STROKE + 4 : STROKE}
                    strokeDasharray={`${a.len} ${C - a.len}`}
                    strokeDashoffset={a.offset}
                    onMouseEnter={() => setActive(i)}
                    style={{ transition: "stroke-width .15s", cursor: "pointer" }}
                  />
                ))}
              </g>
            </svg>
            {/* Centro — só número, nunca texto longo */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="num text-2xl font-bold tracking-tight text-foreground">
                {formatPct(activeItem?.percentual ?? 0)}
              </span>
              <span className="num mt-0.5 text-[0.7rem] text-muted-foreground">
                {formatBRL(activeItem?.valor ?? 0)}
              </span>
            </div>
          </div>

          {/* Legenda — nomes truncados, colunas alinhadas */}
          <div className="min-w-0 flex-1 space-y-0.5 self-stretch">
            {data.map((item, i) => (
              <button
                key={item.nome}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex w-full min-w-0 items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors",
                  active === i ? "bg-white/[0.06]" : "hover:bg-white/[0.03]",
                )}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: seriesColor(i) }}
                />
                <span className="min-w-0 flex-1 truncate text-sm text-foreground/90" title={item.nome}>
                  {item.nome}
                </span>
                <span className="num hidden shrink-0 text-[0.72rem] text-muted-foreground md:block">
                  {formatBRL(item.valor)}
                </span>
                <span className="num w-12 shrink-0 text-right text-xs font-semibold">
                  {formatPct(item.percentual)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
