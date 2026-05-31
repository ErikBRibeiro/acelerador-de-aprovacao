# Acelerador de Aprovação — MVP Design Spec

**Date:** 2026-05-31
**Status:** Approved
**Type:** Demo/Pitch MVP

## Visão Geral

Plataforma web que substitui uma planilha Excel para preparação e aprovação de
intérpretes em processos seletivos (testes de interpretação inglês-português).
Foco em glossário, estudo de vocabulário técnico, memorização e dashboards de
progresso para aluno e professor.

Este é um **MVP de demonstração** — será apresentado por um sócio para uma
empresa, com o objetivo de vender o produto. Toda a persistência é local
(localStorage), os dados são mockados, mas a experiência deve parecer um
produto real e polido.

### Objetivos do MVP

1. Home page de apresentação do produto
2. Tela de estudos com cards de palavras (grid + filtros)
3. Card expansível com detalhes completos da palavra
4. Áudio neural via `speechSynthesis` + estrutura para áudio humano
5. Dashboard do aluno (progresso, estrelas, próximas revisões)
6. Dashboard do professor (lista de alunos, métricas)
7. Glossário com busca e filtros
8. Cronograma de 10 dias funcional (marcar dias concluídos)
9. Visual limpo: azul marinho + branco (identidade Elite Language Services)

### Não-objetivos (fora do escopo do MVP)

- Backend / banco de dados real
- Autenticação real (login é apenas seleção de perfil)
- Edição de palavras pelo usuário (personalização é só estrutural)
- Upload real de áudio humano (apenas URLs mockadas)
- Cronogramas além do plano de 10 dias

## Stack Técnica

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** para estilização
- **Zustand** + `localStorage` para estado do aluno (estrelas, progresso, cronograma)
- **Dados mockados** em arquivos `.ts` (`/data/*.ts`)
- **Web Speech API** (`speechSynthesis`) para áudio neural
- **Deploy:** Vercel (`vercel --prod`), roda local com `npm run dev`

Arquitetura preparada para evoluir: trocar a camada de dados mockados por
chamadas a API/banco (Prisma/Supabase) e seleção de perfil por auth real.

## Identidade Visual

- **Paleta:** azul marinho (`#1e3a8a`), branco, cinzas neutros. Vermelho
  (`#dc2626`) e âmbar (`#f59e0b`) apenas como acentos (alertas, estrelas).
- **Cards:** fundo branco, borda superior colorida (3px), sombra suave.
- **Tipografia:** forte e em navy para palavras/títulos; cinza para apoio.
- **Estilo geral:** clean, educacional, profissional. Referência: Elite,
  Notion, Linear.

## Estrutura de Páginas e Rotas

```
/                      Home — apresentação + CTA "Get Started"
/select                Profile Selection — botões "I'm a Student" / "I'm a Teacher"

/student               Student Dashboard — métricas, próximas revisões
/student/study         Word Cards — grid + filtros por categoria
/student/schedule      Study Schedule — plano de 10 dias, marcar concluído

/teacher               Teacher Dashboard — tabela de alunos, palavras difíceis
/teacher/glossary      Glossary — busca + filtros, visão completa das palavras
```

### Fluxo de Navegação

```
Home (/) → /select → escolhe perfil
                   ├─ Student → /student → /student/study, /student/schedule
                   └─ Teacher → /teacher → /teacher/glossary
```

Cada área (student/teacher) tem uma **sidebar fixa** com logo, links de
navegação e badge do perfil ativo.

## Modelo de Dados

### `Word` — entrada do glossário

```ts
type Word = {
  id: string
  word: string              // "ambulance"
  translation: string       // "ambulância"
  definition: string
  exampleEN: string         // frase em inglês
  examplePT: string         // tradução da frase
  category: string          // "Emergency & 911"
  subcategory: string       // "First Response"
  imageUrl: string          // URL da imagem
  audioHumanUrl: string     // URL do áudio humano (mock por ora)
  linguisticType: 'cognate' | 'false-cognate' | 'equivalent'
  testFrequency: 'high' | 'medium' | 'low'
  tags: string[]            // ["911", "BLS", "medical"]
}
```

### `StudentProgress` — progresso por palavra (localStorage)

```ts
type StudentProgress = {
  wordId: string
  stars: 1 | 2 | 3 | 4 | 5
  lastReviewed: string      // ISO date
  reviewCount: number
}
```

### `ScheduleDay` — dia do cronograma de 10 dias

```ts
type ScheduleDay = {
  day: number               // 1–10
  title: string             // "Emergency Vocabulary"
  categories: string[]      // categorias do dia
  wordIds: string[]         // palavras sugeridas
  completed: boolean        // localStorage
}
```

### `MockStudent` — dados mockados para o dashboard do professor

```ts
type MockStudent = {
  id: string
  name: string
  avatarUrl: string
  wordsStudied: number
  averageStars: number
  lastActivity: string      // ISO date
  glossaryPercent: number
}
```

## Categorias e Nichos (estrutura preparada)

O campo `category` + `subcategory` + `tags` suporta a organização futura por
nichos. Categorias do MVP (parcialmente populadas):

- Basics (entrevistas, primeiros passos)
- Medical & Clinics
- Customer Service
- Banking
- Emergency & 911
- Insurance
- (futuro) Empresas específicas, perfis de entrevistadores, interpretação especializada

50 palavras mock simples no MVP, distribuídas entre essas categorias. O sócio
substituirá pelo conteúdo real depois.

## Componentes Principais

- **`WordCard`** — fechado (categoria, palavra, tradução, estrelas, badge de
  frequência) e expandido (definição, exemplo EN/PT, tipo linguístico, botões de
  áudio neural/humano, última revisão).
- **`StarRating`** — 1–5 estrelas, interativo (aluno ajusta domínio).
- **`AudioButton`** — neural (`speechSynthesis`) e humano (placeholder).
- **`CategoryFilter`** — filtros por categoria/subcategoria/frequência/tipo.
- **`SearchBar`** — busca no glossário.
- **`Sidebar`** — navegação por área com badge do perfil.
- **`StatCard`** — métricas dos dashboards.
- **`StudentTable`** — tabela de alunos (professor).
- **`ScheduleDayCard`** — dia do cronograma com toggle de conclusão.

## Sistema de Áudio

- **Neural:** `window.speechSynthesis` + `getVoices()` para selecionar uma voz
  en-US/en-GB. Botão "play" no card expandido lê a palavra e (opcional) a frase.
  Fallback gracioso se o navegador não tiver vozes carregadas.
- **Humano:** campo `audioHumanUrl` com `<audio>` element. URLs mockadas no MVP;
  estrutura pronta para receber arquivos reais.

## Persistência de Estado

Zustand store sincronizado com `localStorage`:

- `progress: Record<wordId, StudentProgress>` — estrelas e revisões
- `scheduleCompletion: Record<day, boolean>` — dias concluídos
- `activeProfile: 'student' | 'teacher' | null`

Dashboards do aluno derivam métricas em tempo real do store (palavras
estudadas, % glossário, média de estrelas, palavras para revisar). Dashboard do
professor usa `MockStudent[]` estático.

## Roadmap de Implementação (ordem de prioridade)

1. Setup do projeto (Next.js + Tailwind + Zustand) + tema de cores
2. Dados mockados (50 palavras, cronograma, alunos mock)
3. Home page
4. Profile Selection
5. Layout com Sidebar (student/teacher)
6. WordCard (fechado + expandido) + StarRating
7. Tela de estudos (grid + filtros)
8. Áudio neural (`speechSynthesis`) + botão humano
9. Student Dashboard (métricas derivadas do store)
10. Glossary (busca + filtros)
11. Teacher Dashboard (tabela de alunos)
12. Study Schedule (10 dias, toggle de conclusão)
13. Responsividade + polish final
14. Deploy na Vercel

## Critérios de Sucesso

- Roda local (`npm run dev`) e em link público (Vercel)
- Alterna entre perfil aluno e professor via tela de seleção
- Cards expandem com todos os campos; áudio neural funciona
- Dashboards mostram métricas coerentes; cronograma marca progresso
- Visual polido e responsivo, parece um produto real
