import { motion } from "framer-motion";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Eyebrow } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBRL, formatDateShort } from "@/lib/format";
import type { PortfolioSummary } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  summary: PortfolioSummary;
}

function urgencia(dias: number) {
  if (dias <= 15) return "danger" as const;
  if (dias <= 45) return "warning" as const;
  return "secondary" as const;
}

function barColor(dias: number) {
  if (dias <= 15) return "bg-loss";
  if (dias <= 45) return "bg-gold";
  return "bg-aurora-3";
}

export function VencimentosCard({ summary }: Props) {
  const itens = summary.vencendoEm90Dias;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <Eyebrow>Liquidez programada</Eyebrow>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-gold" />
            Vencimentos em 90 dias
          </CardTitle>
        </div>
        {itens.length > 0 && <Badge variant="warning">{itens.length}</Badge>}
      </CardHeader>
      <CardContent className="flex-1">
        {itens.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-center">
            <CheckCircle2 className="h-9 w-9 text-gain/70" />
            <p className="text-sm text-muted-foreground">
              Nenhum vencimento nos próximos 90 dias.
            </p>
          </div>
        ) : (
          <div className="grid max-h-[280px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {itens.map((v, i) => (
              <motion.div
                key={`${v.ativo}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035 }}
                className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 transition-colors hover:bg-white/[0.04]"
              >
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 w-1",
                    barColor(v.diasParaVencimento),
                  )}
                />
                <div className="min-w-0 pl-1.5">
                  <p className="truncate text-sm font-medium">{v.ativo}</p>
                  <p className="truncate font-mono text-[0.68rem] text-muted-foreground">
                    {v.emissor ?? "—"} · {formatDateShort(v.dtVencimento)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="tnum text-sm font-semibold">
                    {formatBRL(v.valor)}
                  </span>
                  <Badge variant={urgencia(v.diasParaVencimento)}>
                    {v.diasParaVencimento}d
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
