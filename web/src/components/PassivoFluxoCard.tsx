import { ArrowLeftRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PassivoSummary } from "@/types";

export function PassivoFluxoCard({ summary }: { summary: PassivoSummary }) {
  const { aplicadoTotal, resgatadoTotal } = summary;
  const max = Math.max(aplicadoTotal, resgatadoTotal, 1);
  const net = aplicadoTotal - resgatadoTotal;

  return (
    <Card className="fade-up h-full">
      <div className="flex items-center gap-2.5 border-b border-border p-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <ArrowLeftRight className="h-4 w-4" />
        </span>
        <div>
          <p className="eyebrow">Movimentação</p>
          <h3 className="text-[0.95rem] font-bold tracking-tight">Aplicações e resgates</h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-[0.72rem] font-medium text-muted-foreground">Captação líquida</p>
        <p className={cn("num mt-1 text-2xl font-extrabold tracking-tight", net >= 0 ? "text-gain" : "text-loss")}>
          {net >= 0 ? "+" : ""}
          {formatBRL(net)}
        </p>

        <div className="mt-5 space-y-3.5">
          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-ink/90">Aplicado</span>
              <span className="num text-sm font-bold text-gain">{formatBRL(aplicadoTotal)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[hsl(220_18%_93%)]">
              <div
                className="h-full rounded-full bg-gain"
                style={{ width: `${aplicadoTotal > 0 ? Math.max(2, (aplicadoTotal / max) * 100) : 0}%`, animation: "growBar .6s cubic-bezier(.16,1,.3,1) both" }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-ink/90">Resgatado</span>
              <span className="num text-sm font-bold text-loss">{formatBRL(resgatadoTotal)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[hsl(220_18%_93%)]">
              <div
                className="h-full rounded-full bg-loss"
                style={{ width: `${resgatadoTotal > 0 ? Math.max(2, (resgatadoTotal / max) * 100) : 0}%`, animation: "growBar .6s cubic-bezier(.16,1,.3,1) both" }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
