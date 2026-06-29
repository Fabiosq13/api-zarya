const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const brlCompact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 2,
});

const pctFmt = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatBRL = (n: number) => brl.format(n ?? 0);
export const formatBRLCompact = (n: number) => brlCompact.format(n ?? 0);
export const formatPct = (n: number) => `${pctFmt.format(n ?? 0)}%`;
export const formatNumber = (n: number) =>
  new Intl.NumberFormat("pt-BR").format(n ?? 0);

/** "2025-06-05" -> "05 de jun. de 2025" */
export function formatDateLong(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** "2025-06-05" -> "05/06/2025" */
export function formatDateShort(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("pt-BR");
}
