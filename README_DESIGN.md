# Zarya — frontend (tema institucional)

Layout corporativo claro com **rail navy + conteúdo claro**. Lógica e fluxo de
dados intactos (preload por `no_Resumido`, seleção carteira+data, indicadores/
gráficos, e o copiloto Gemini que reconsulta e atualiza o painel).

## Direção visual

- **Shell com sidebar navy fixa** (marca, navegação por seções, patrimônio ao
  vivo no rodapé) + topbar com título da seção e seletores (carteira/data).
- **Tema claro institucional:** cartões brancos, hairlines, sombras sutis, um
  azul corporativo de acento; verde/vermelho semânticos. Sem "glass"/blur pesado.
- **Tipografia:** Plus Jakarta Sans (uma família), números tabulares.
- **Leve:** sem Recharts/Framer. Donut em SVG, barras em CSS, animações em CSS.
  Bundle JS ~430 KB (gzip ~136 KB).

## Componentes

`Sidebar`, `KpiRow` (4 indicadores), `DonutAllocation` (SVG), `TopPositions`
(barras CSS), `VencimentosCard`, `ChatPanel`, `WalletSelector`, `DateSelector`,
`AnimatedNumber`. Tema em `web/src/index.css` + `web/tailwind.config.js`.

## Rodar

```bash
npm install && npm run dev        # backend :3000 (ZARYA_TOKEN, GEMINI_API_KEY no .env)
cd web && npm install && npm run dev   # :5173
```

Deploy no Railway: ver `DEPLOY.md` (backend serve o frontend buildado).
