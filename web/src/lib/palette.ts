/** Aurora-tuned categorical palette, shared across charts and the hero ribbon. */
export const SERIES = [
  "#7B6CFF", // indigo
  "#38E0C8", // teal
  "#4DA6FF", // azure
  "#E9C46A", // champagne
  "#F472B6", // pink
  "#A78BFA", // violet
  "#34D8A0", // emerald
  "#60A5FA", // blue
  "#FBBF24", // amber
  "#FB7185", // rose
];

export const seriesColor = (i: number) => SERIES[i % SERIES.length];
