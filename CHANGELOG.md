# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Monorepo scaffold with npm workspaces + Turborepo
- Shared `@forge/types` package with domain types and WebSocket event constants
- Shared `@forge/config` package with TypeScript, ESLint, and Prettier configs
- NestJS 11 backend scaffold (`@forge/api`)
- React 19 + Vite 8 frontend scaffold (`@forge/web`)
- Husky pre-commit hooks (lint-staged + commitlint)
- GitHub Actions CI pipeline
- Docker Compose for local development (Postgres 16 + Redis 7)
