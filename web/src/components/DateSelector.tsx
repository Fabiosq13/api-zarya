import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { formatDateLong } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
}

export function DateSelector({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(`${value}T00:00:00`) : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="eyebrow flex items-center gap-1.5">
        <CalendarDays className="h-3 w-3" /> Data
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <button
            className={cn(
              "group flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-sm font-medium transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring/60 data-[state=open]:border-primary/50 sm:w-[13rem]",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <span className="num">{value ? formatDateLong(value) : "Selecione"}</span>
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
