import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatBRL, formatPct } from "@/lib/format";
import type { PortfolioSummary } from "@/types";

interface Props {
  summary: PortfolioSummary;
}

export function TopPositions({ summary }: Props) {
  const data = summary.maioresPosicoes.slice(0, 8);
  const max = data.length ? Math.max(...data.map((d) => d.valor)) : 1;

  return (
    <Card className="h-full">
      <CardHeader>
        <p className="eyebrow">Concentração</p>
        <h3 className="mt-1 text-[0.95rem] font-semibold tracking-tight">Maiores posições</h3>
      </CardHeader>
      <CardContent className="space-y-3.5">
        {data.map((d, i) => (
          <div key={d.nome} className="min-w-0">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-sm text-foreground/90" title={d.nome}>
                {d.nome}
              </span>
              <span className="num shrink-0 text-xs text-muted-foreground">
                {formatBRL(d.valor)}
                <span className="ml-1.5 font-semibold text-foreground">{formatPct(d.percentual)}</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className="aurora h-full rounded-full"
                style={{
                  width: `${Math.max(2, (d.valor / max) * 100)}%`,
                  animation: `growBar .6s cubic-bezier(.16,1,.3,1) both`,
                  animationDelay: `${i * 0.04}s`,
                }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Sem posições.</p>
        )}
      </CardContent>
    </Card>
  );
}
