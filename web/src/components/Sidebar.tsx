import { CalendarClock, LayoutDashboard, type LucideIcon, PieChart, Sparkles } from "lucide-react";
import { formatBRLCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const NAV: NavItem[] = [
  { id: "visao-geral", label: "Visão geral", icon: LayoutDashboard },
  { id: "alocacao", label: "Alocação", icon: PieChart },
  { id: "vencimentos", label: "Vencimentos", icon: CalendarClock },
  { id: "copiloto", label: "Copiloto IA", icon: Sparkles },
];

interface Props {
  active: string;
  onNavigate: (id: string) => void;
  patrimonio?: number;
  carteiraNome?: string;
}

export function Sidebar({ active, onNavigate, patrimonio, carteiraNome }: Props) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Marca */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M5 15 L10 9 L13.5 12.5 L19 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="19" cy="6" r="1.9" fill="white" />
          </svg>
        </div>
        <span className="text-lg font-extrabold tracking-tight text-white">Zarya</span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="px-3 pb-2 pt-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-sidebar-muted">
          Painel
        </p>
        {NAV.map((item) => {
          const Icon = item.icon;
          const on = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                on ? "bg-sidebar-elev text-white" : "text-sidebar-muted hover:bg-sidebar-elev/60 hover:text-sidebar-foreground",
              )}
            >
              {on && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
              <Icon className={cn("h-4.5 w-4.5", on ? "text-primary" : "")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Rodapé — patrimônio ao vivo */}
      <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-elev/50 p-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gain" />
          <span className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-sidebar-muted">Patrimônio</span>
        </div>
        <p className="num mt-1.5 text-xl font-extrabold tracking-tight text-white">
          {patrimonio != null ? formatBRLCompact(patrimonio) : "—"}
        </p>
        {carteiraNome && (
          <p className="mt-0.5 truncate text-[0.72rem] text-sidebar-muted" title={carteiraNome}>
            {carteiraNome}
          </p>
        )}
      </div>
    </div>
  );
}
