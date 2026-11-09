# MEMORY — paulorgdc.dev (portfólio)
Portfólio e vitrine de projetos em paulorgdc.dev, deploy na Vercel.

## Stack
- Next.js 16.3 · React 19.2 · Tailwind 4 · TypeScript 5 · ESLint · npm

## Comandos
- `npm install`
- `npm run dev` · `npm run build` · `npm start` · `npm run lint`

## Variáveis de ambiente
- Nenhuma exigida.

## Regras de ouro
1. Este Next.js tem breaking changes: ler `node_modules/next/dist/docs/` antes de escrever código (ver `AGENTS.md`/`CLAUDE.md`).
2. App Router em `src/app/`; componentes reutilizáveis em `src/components/`.
3. Não remover o bloco `nextjs-agent-rules` do `AGENTS.md` (o `next dev` o recria).
