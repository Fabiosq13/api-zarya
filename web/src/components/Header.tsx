import type { ReactNode } from "react";

interface Props {
  children: ReactNode; // seletores (carteira + data)
}

export function Header({ children }: Props) {
  return (
    <header
      className="shrink-0 border-b border-white/10 text-white"
      style={{ background: "linear-gradient(100deg, hsl(232 74% 52%), hsl(244 70% 56%))" }}
    >
      <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span className="text-2xl font-extrabold tracking-tight">Zarya</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">{children}</div>
      </div>
    </header>
  );
}
