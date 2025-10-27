# Architecture Decision Record – Turn 1

## Context
Implemented initial NestJS API scaffold and added structured logging with request correlation using built-in ConsoleLogger extensions to satisfy governance requirements without third-party dependencies.

## Decision
Use a custom JsonLogger extending Nest's ConsoleLogger alongside AsyncLocalStorage-based middleware to emit structured JSON logs enriched with request identifiers and latency while remaining dependency-free.

## Consequences
- Provides machine-parsable logs for downstream observability systems.
- Maintains compliance with the no third-party logger constraint.
- Introduces AsyncLocalStorage usage, requiring Node.js 18+ which aligns with project runtime requirements.
