<!--
App: Customer Registration
Package: ai/agentic-pipeline/turns/1
File: adr.md
Version: 0.1.0
Turns: [1]
Author: ChatGPT
Date: 2025-09-18T16:44:28Z
Description: Architecture Decision Record describing adoption of the full-stack Next.js + NestJS pattern.
-->
# ADR 1: Adopt Full-Stack Next.js + NestJS Baseline

**Status**: Accepted

**Date**: 2025-09-18

## Context
The Customer Registration project required a coherent front-end and back-end implementation. The codex project context mandated using the `full-stack-app-nextjs-nestjs` pattern. We needed to establish initial scaffolding, testing, and documentation aligned with this pattern.

## Decision
Build the repository with a Next.js 14 UI, NestJS 10 API, PostgreSQL migrations, and shared JSON schemas mirroring the provided pattern instructions. Implement foundational customer registration features, validation, and automated tests in both layers.

## Consequences
- **Positive**: Provides a modern, type-safe stack with aligned tooling (TypeScript, Jest, Tailwind, TypeORM). Facilitates rapid iteration for future customer flows.
- **Negative**: Requires maintaining Node.js toolchains for both UI and API. TypeORM introduces runtime dependencies on PostgreSQL.
- **Follow-up**: Implement integration tests and CI workflows, and configure Docker-based local development in future turns.
