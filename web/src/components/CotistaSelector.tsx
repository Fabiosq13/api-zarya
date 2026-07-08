import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { CotistaItem } from "@/types";

interface Props {
  cotistas: CotistaItem[];
  value: number;
  onChange: (idCotista: number) => void;
  disabled?: boolean;
}

export function CotistaSelector({ cotistas, value, onChange, disabled }: Props) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))} disabled={disabled}>
      <SelectTrigger className="w-full text-ink sm:w-[12.5rem]">
        <SelectValue placeholder="Selecione o cotista" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">Todos os cotistas</SelectItem>
        {cotistas.map((c) => (
          <SelectItem key={c.idCotista} value={String(c.idCotista)}>
            {c.nome}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
