# Contributing to Forge

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

---

## Development Setup

1. Fork and clone the repository
2. Follow the [Getting Started](./README.md#getting-started) guide
3. Create a feature branch from `main`

---

## Branch Naming

| Type    | Pattern                      | Example                     |
| ------- | ---------------------------- | --------------------------- |
| Feature | `feat/<scope>/<description>` | `feat/auth/google-oauth`    |
| Bug fix | `fix/<scope>/<description>`  | `fix/editor/cursor-flicker` |
| Chore   | `chore/<description>`        | `chore/update-deps`         |
| Docs    | `docs/<description>`         | `docs/api-endpoints`        |

---

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <description>
```

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`

**Scopes:** `api`, `web`, `types`, `config`, `auth`, `rooms`, `editor`, `presence`, `execution`, `ai`, `chat`, `snapshots`, `dashboard`, `ci`, `docker`, `deps`

**Examples:**

```
feat(editor): add multi-cursor presence rendering
fix(auth): handle expired refresh token on concurrent requests
chore(deps): update nestjs to v11.1
```

Commits that don't follow this format will be rejected by the `commit-msg` hook.

---

## Pull Requests

- Keep PRs focused — one feature or fix per PR
- Fill out the PR template completely
- All CI checks must pass before merging
- PRs require at least one review approval

---

## Code Style

Formatting and linting are enforced automatically:

- **Prettier** runs on every commit via `lint-staged`
- **ESLint** (API) and **oxlint** (Web) enforce code quality
- **TypeScript strict mode** is enabled across all packages

Run manually:

```bash
npm run format   # format everything
npm run lint     # lint everything
npm run typecheck  # type-check everything
```

---

## Testing

```bash
npm run test          # unit tests
npm run test:e2e      # end-to-end tests (requires Docker)
```

Write tests for all new features. PRs without tests for business logic will not be merged.
