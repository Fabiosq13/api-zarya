import type { ReactNode } from "react";

interface Props {
  carteiraNome?: string;
  children: ReactNode; // seletores (carteira + data)
}

export function Header({ carteiraNome, children }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-panel/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path d="M5 15 L10 9 L13.5 12.5 L19 6" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="19" cy="6" r="1.9" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-extrabold tracking-tight">Zarya</span>
          {carteiraNome && (
            <>
              <span className="hidden h-5 w-px bg-border sm:block" />
              <span className="hidden truncate text-sm font-medium text-muted-foreground sm:block" title={carteiraNome}>
                {carteiraNome}
              </span>
            </>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">{children}</div>
      </div>
    </header>
  );
}
