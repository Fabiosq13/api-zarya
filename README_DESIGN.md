# Zarya Insights — Frontend redesenhado ("Aurora Wealth Terminal")

Overhaul visual completo do app `web/`. **Toda a lógica e o fluxo de dados foram
preservados** — backend Fastify + Gemini, preload de carteiras por `no_Resumido`,
seleção de carteira + data, indicadores/gráficos por carteira e a IA que reconsulta
e atualiza o painel continuam idênticos.

## Como rodar

Backend (raiz do projeto):
```bash
npm install
cp .env.example .env   # preencha ZARYA_TOKEN e GEMINI_API_KEY
npm run dev            # sobe em http://localhost:3000
```

Frontend (pasta web/):
```bash
cd web
npm install            # reinstale: o node_modules não vai no pacote
npm run dev            # http://localhost:5173 (proxy /api -> :3000)
```

Build de produção do front (já validado, em `web/dist`):
```bash
cd web && npm run build
```

## O que mudou (apenas visual)

- **Tipografia**: Fraunces (serifa editorial) nos números de patrimônio · Inter Tight na UI · JetBrains Mono em dados/percentuais.
- **Paleta**: tinta meia-noite em camadas + gradiente *aurora* (índigo→azul→teal), champanhe para valor, esmeralda/rosa para ganho/perda.
- **Assinatura**: faixa "Patrimônio" (`HeroPanel.tsx`) com número serifado animado, brilho aurora e *ribbon* de alocação real.
- Componentes reestilizados: KpiCards, AllocationChart, TopAssetsChart, VencimentosCard, ChatPanel (Copiloto), WalletSelector, DateSelector + primitivos card/badge/skeleton/select/calendar.
- Novos: `src/components/HeroPanel.tsx`, `src/lib/palette.ts`, `public/favicon.svg`.

Arquivos de design: `web/src/index.css`, `web/tailwind.config.js`, `web/index.html`.
