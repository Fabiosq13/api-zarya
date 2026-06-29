import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, Eyebrow } from "@/components/ui/card";
import { formatBRL, formatBRLCompact, formatPct } from "@/lib/format";
import type { PortfolioSummary } from "@/types";

interface Props {
  summary: PortfolioSummary;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="glass-strong rounded-xl border border-white/[0.08] px-3 py-2 text-xs">
      <p className="mb-1 font-semibold text-foreground">{item.nome}</p>
      <p className="tnum font-mono text-primary">{formatBRL(item.valor)}</p>
      <p className="tnum font-mono text-muted-foreground">
        {formatPct(item.percentual)} da carteira
      </p>
    </div>
  );
}

export function TopAssetsChart({ summary }: Props) {
  const data = summary.maioresPosicoes.slice(0, 8).map((d) => ({
    ...d,
    nomeCurto: d.nome.length > 18 ? `${d.nome.slice(0, 17)}…` : d.nome,
  }));

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <Eyebrow>Concentração</Eyebrow>
        <CardTitle>Maiores posições</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[268px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 18, top: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barFill" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7B6CFF" stopOpacity={0.65} />
                  <stop offset="55%" stopColor="#4DA6FF" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#38E0C8" stopOpacity={1} />
                </linearGradient>
              </defs>
              <XAxis
                type="number"
                tickFormatter={(v) => formatBRLCompact(v)}
                tick={{ fill: "hsl(230 13% 60%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="nomeCurto"
                width={118}
                tick={{ fill: "hsl(228 30% 82%)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(232 20% 30% / 0.35)" }}
              />
              <Bar
                dataKey="valor"
                radius={[0, 7, 7, 0]}
                barSize={18}
                isAnimationActive
                animationDuration={750}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill="url(#barFill)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
