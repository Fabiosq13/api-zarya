import { Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBRLCompact } from "@/lib/format";
import type { CarteiraItem } from "@/types";

interface Props {
  carteiras: CarteiraItem[];
  value?: number;
  onChange: (idCarteira: number) => void;
  disabled?: boolean;
}

export function WalletSelector({ carteiras, value, onChange, disabled }: Props) {
  const atual = carteiras.find((c) => c.idCarteira === value);

  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label className="flex items-center gap-1.5 font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        <Wallet className="h-3 w-3" />
        Carteira
      </label>
      <Select
        value={value != null ? String(value) : undefined}
        onValueChange={(v) => onChange(Number(v))}
        disabled={disabled}
      >
        <SelectTrigger className="w-full sm:w-[22rem]">
          <SelectValue placeholder="Selecione a carteira">
            {atual && (
              <span className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/12 text-[0.7rem] font-bold text-primary">
                  {atual.noResumido.slice(0, 2).toUpperCase()}
                </span>
                <span className="truncate font-medium">{atual.noResumido}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {carteiras.map((c) => (
            <SelectItem key={c.idCarteira} value={String(c.idCarteira)}>
              <div className="flex w-full items-center gap-3 pr-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-[0.72rem] font-bold text-primary">
                  {c.noResumido.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium leading-tight">
                    {c.noResumido}
                  </p>
                  <p className="font-mono text-[0.66rem] text-muted-foreground">
                    {c.quantidadePosicoes} posições
                  </p>
                </div>
                <span className="tnum shrink-0 font-mono text-xs font-medium text-foreground/80">
                  {formatBRLCompact(c.valorTotal)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
