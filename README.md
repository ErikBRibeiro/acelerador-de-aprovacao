# Acelerador de Aprovação

Plataforma web (MVP) que substitui a planilha Excel de preparação de intérpretes
por uma experiência de estudo organizada: glossário, cards de palavras com áudio
neural, dashboards de aluno e professor, e cronograma de estudo de 10 dias.

> **Status:** MVP de demonstração. Dados mockados, persistência em `localStorage`,
> sem backend. Arquitetura preparada para evoluir (API/banco + login reais).

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** (paleta azul marinho + branco — identidade Elite)
- **Zustand** + `localStorage` (progresso do aluno, cronograma, perfil ativo)
- **Web Speech API** (`speechSynthesis`) para áudio neural

## Como rodar (local)

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Build de produção

```bash
npm run build
npm start
```

## Testes

```bash
npm test
```

## Deploy (Vercel)

```bash
npm install -g vercel   # se ainda não tiver
vercel --prod
```

Ou conecte o repositório em https://vercel.com — deploy automático a cada push.

## Estrutura

```
app/                 Rotas (Home, /select, /student/*, /teacher/*)
components/          Componentes reutilizáveis (WordCard, Sidebar, etc.)
data/                Dados mockados — EDITAR AQUI o conteúdo real
  words.ts           As 50 palavras do glossário (substituir pelo conteúdo real)
  students.ts        Alunos mockados (dashboard do professor)
  schedule.ts        Cronograma de 10 dias
  categories.ts      Lista de categorias / nichos
lib/                 Tipos, store (Zustand), métricas, helper de áudio
```

## Onde o conteúdo real entra

- **Palavras:** editar `data/words.ts` (modelo `Word` em `lib/types.ts`). Os campos
  `imageUrl` e `audioHumanUrl` aceitam URLs reais — `audioHumanUrl` vazio mostra o
  botão "Human" desabilitado ("coming soon").
- **Categorias/nichos:** `data/categories.ts`.
- **Cronograma:** `data/schedule.ts`.

## Navegação

`/` → `/select` (escolha de perfil) → `/student` ou `/teacher`. Sem login real:
o perfil escolhido fica salvo no `localStorage`.
