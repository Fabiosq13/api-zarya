/** Paleta categórica corporativa — tons sólidos e profissionais sobre fundo claro. */
export const SERIES = [
  "#3A57E8", // azul (primário)
  "#0E9488", // teal
  "#16976A", // verde
  "#C98A12", // âmbar
  "#7C5CFC", // violeta
  "#2563EB", // azul royal
  "#0EA5E9", // céu
  "#E11D48", // rosa/vermelho
  "#64748B", // ardósia
  "#D97706", // laranja
];

export const seriesColor = (i: number) => SERIES[i % SERIES.length];
