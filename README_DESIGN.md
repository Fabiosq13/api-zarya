# Zarya — frontend (versão enxuta)

Reformulação do app `web/` focada em clareza e leveza. Lógica e fluxo de dados
intactos (preload de carteiras por `no_Resumido`, seleção carteira+data,
indicadores/gráficos, e o copiloto Gemini que reconsulta e atualiza o painel).

## Principais mudanças desta versão

- **Marca:** apenas "Zarya" (sem subtítulo).
- **Mais leve:** removidos **Recharts** e **Framer Motion**. Gráficos agora são
  SVG/CSS próprios e as animações são feitas em CSS. Bundle JS caiu de
  **~952 KB para ~427 KB** (gzip 285 KB → 135 KB). Sem orbs animadas/película de
  grão e com bem menos `backdrop-filter`.
- **Fonte:** uma só família (**Inter Tight**), números com algarismos tabulares.
- **Gráficos corrigidos:** o donut mostra só o número no centro (nunca nomes
  longos), e a legenda trunca nomes com colunas alinhadas — nada mais sobreposto
  ou cortado. "Maiores posições" virou lista de barras em CSS.
- **Layout novo e mais claro:** topo com marca + seletores; um cartão de resumo
  (patrimônio + variação no dia + líquido/rendimento/posições); dois cartões de
  análise (alocação e maiores posições); e os vencimentos. Menos indicadores
  soltos.

## Componentes

`SummaryCard` (resumo), `DonutAllocation` (SVG leve), `TopPositions` (barras CSS),
`VencimentosCard`, `ChatPanel` (copiloto), `WalletSelector`, `DateSelector`,
`AnimatedNumber` (count-up em rAF). Estilo em `web/src/index.css` +
`web/tailwind.config.js` (uma fonte, tokens, animações CSS).

## Rodar

```bash
# backend (raiz): preencha ZARYA_TOKEN e GEMINI_API_KEY no .env
npm install && npm run dev      # :3000
# frontend
cd web && npm install && npm run dev   # :5173
```

Deploy no Railway: veja `DEPLOY.md` (o backend serve o frontend buildado).
