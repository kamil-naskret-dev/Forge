# Forge

> Real-time collaborative code editor — like Google Docs, but for code.

Multiple developers can edit the same file simultaneously with live cursor presence, instant sync, AI assistance, and shared code execution. Built as a portfolio project demonstrating production-grade distributed systems architecture.

---

## Features

- **Real-time collaboration** — CRDT-based conflict-free editing via Yjs (same algorithm as Notion, Figma, Linear)
- **Live presence** — see other users' cursors and selections with animated indicators
- **Monaco Editor** — the same editor that powers VS Code, with syntax highlighting for 20+ languages
- **Multi-file support** — VS Code-like sidebar with file tree and tabs
- **AI assistant** — Claude-powered streaming suggestions with `/explain`, `/refactor`, `/fix`, `/test` commands
- **Code execution** — run code in a sandbox (Judge0) and share output with the entire room
- **Snapshots & history** — save project state, browse timeline, restore and diff any version
- **Chat** — built-in messaging with emoji reactions on specific lines of code
- **Rooms** — create a room, share a link, collaborators join instantly

---

## Tech Stack

| Layer           | Technology                              |
| --------------- | --------------------------------------- |
| Backend         | NestJS 11 + Socket.io WebSocket Gateway |
| Real-time sync  | Yjs CRDT + y-redis                      |
| Database        | PostgreSQL 16 + Prisma 5                |
| Cache / pub-sub | Redis 7 + BullMQ                        |
| Frontend        | React 19 + Vite 8                       |
| Editor          | Monaco Editor                           |
| Styling         | TailwindCSS + shadcn/ui                 |
| State           | Zustand                                 |
| AI              | Anthropic Claude API (streaming)        |
| Code execution  | Judge0 API                              |
| Monorepo        | npm workspaces + Turborepo              |
| Deployment      | Railway                                 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (for local Postgres + Redis)

### 1. Clone & install

```bash
git clone https://github.com/your-username/forge.git
cd forge
npm install
```

### 2. Environment

```bash
cp .env.example .env
# Fill in your values — see .env.example for descriptions
```

### 3. Start infrastructure

```bash
docker compose -f docker/docker-compose.dev.yml up -d
```

### 4. Database setup

```bash
npm run db:migrate --workspace=@forge/api
npm run db:seed --workspace=@forge/api
```

### 5. Run

```bash
npm run dev
# API → http://localhost:3001
# Web → http://localhost:5173
```

---

## Project Structure

```
forge/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React + Vite frontend
├── packages/
│   ├── types/        # @forge/types — shared TypeScript types
│   └── config/       # @forge/config — shared ESLint / TS / Prettier config
└── docker/           # Docker Compose for local dev
```

---

## Scripts

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start all apps in dev mode     |
| `npm run build`     | Build all packages             |
| `npm run lint`      | Lint all packages              |
| `npm run typecheck` | Type-check all packages        |
| `npm run test`      | Run unit tests                 |
| `npm run format`    | Format all files with Prettier |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
