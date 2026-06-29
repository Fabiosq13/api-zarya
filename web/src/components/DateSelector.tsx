import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDateLong } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  value: string; // YYYY-MM-DD
  onChange: (iso: string) => void;
  disabled?: boolean;
}

export function DateSelector({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(`${value}T00:00:00`) : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        <CalendarDays className="h-3 w-3" />
        Data da posição
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            className={cn(
              "group flex h-[3.25rem] w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 text-sm font-medium transition-all hover:border-primary/40 hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-ring/70 data-[state=open]:border-primary/50 sm:w-[15rem]",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <span className="tnum">{value ? formatDateLong(value) : "Selecione"}</span>
            <CalendarDays className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <Calendar
            selected={selected}
            maxDate={new Date()}
            onSelect={(d) => {
              onChange(format(d, "yyyy-MM-dd"));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
