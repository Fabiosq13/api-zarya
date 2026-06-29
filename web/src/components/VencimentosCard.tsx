import { CalendarClock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBRL, formatDateShort } from "@/lib/format";
import type { PortfolioSummary } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  summary: PortfolioSummary;
}

function urgencia(d: number) {
  if (d <= 15) return "danger" as const;
  if (d <= 45) return "warning" as const;
  return "secondary" as const;
}
function barColor(d: number) {
  if (d <= 15) return "bg-loss";
  if (d <= 45) return "bg-gold";
  return "bg-accent";
}

export function VencimentosCard({ summary }: Props) {
  const itens = summary.vencendoEm90Dias;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <p className="eyebrow">Liquidez programada</p>
          <h3 className="mt-1 flex items-center gap-2 text-[0.95rem] font-semibold tracking-tight">
            <CalendarClock className="h-4 w-4 text-gold" />
            Vencimentos em 90 dias
          </h3>
        </div>
        {itens.length > 0 && <Badge variant="warning">{itens.length}</Badge>}
      </CardHeader>
      <CardContent>
        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <CheckCircle2 className="h-8 w-8 text-gain/70" />
            <p className="text-sm text-muted-foreground">Nenhum vencimento nos próximos 90 dias.</p>
          </div>
        ) : (
          <div className="grid max-h-[260px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
            {itens.map((v, i) => (
              <div
                key={`${v.ativo}-${i}`}
                className="fade-in relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3"
                style={{ animationDelay: `${Math.min(i, 12) * 0.03}s` }}
              >
                <span className={cn("absolute inset-y-0 left-0 w-1", barColor(v.diasParaVencimento))} />
                <div className="min-w-0 pl-1.5">
                  <p className="truncate text-sm font-medium" title={v.ativo}>
                    {v.ativo}
                  </p>
                  <p className="num truncate text-[0.7rem] text-muted-foreground">
                    {v.emissor ?? "—"} · {formatDateShort(v.dtVencimento)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="num text-sm font-semibold">{formatBRL(v.valor)}</span>
                  <Badge variant={urgencia(v.diasParaVencimento)}>{v.diasParaVencimento}d</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
