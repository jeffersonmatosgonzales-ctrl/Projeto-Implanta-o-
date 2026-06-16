# CLAUDE.md

## Project Commands
- **Start Dev Server**: `npm run dev` (Runs expressing server proxies, maps live Gemini CFO Copilot)
- **Production Build**: `npm run build` (Prepares React bundle and Node.js bundled CJS server)
- **Production Start**: `npm run start` (Runs fully bundled application)
- **Linter & Type Check**: `npm run lint` (`tsc --noEmit` checks high-fidelity TypeScript types)
- **Clean Artifacts**: `npm run clean`

## Codebase Architecture
- This is a high-fidelity full-stack React 19 + Express + Tailwind CSS application showcasing live financial metrics, construction budgeting, bookkeeping, and automated CPC 18 calculations for the CFO of **JUST S.A. Holding fiduciária**.
- **Important**: This workspace transitions to a local development engine via Claude Code desktop. The absolute source of truth regarding Sienge integration, local relational databases, business calculations, and development strategies is stored in **`CLAUDE_HANDOFF.md`**. Refer to it as your immediate context before making any software alterations or adding live integrations.

## Core business values
- **Taxa de Administração de Obra**: 15% (Strictly 15% calculated over active construction costs of SPEs under "Em Construção" stage - see `src/components/Reconciliation.tsx`).
- **Justfix Supplies (Granites/Rocks)**: Approx 6% calculated over active Sienge construction costs.
- **CPC 18 (Equivalência Patrimonial)**: Dynamic holding calculation matching the ownership percentiles (Matera: 85%, Neo: 60%, Blank/Acácias: 100%).
