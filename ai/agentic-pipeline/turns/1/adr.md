# ADR 1: NestJS API Scaffold and Health Module

**Status**: Accepted

**Date**: 2025-09-24

## Context
The project required a standardized NestJS 11 backend scaffold with linting, formatting, and testing support alongside an operational health monitoring module. Task guidance specified exact dependency versions and file contents, but omitted explicit `.prettier` content.

## Decision
- Initialize a manual NestJS project structure under `api/` using the provided package, TypeScript, and Jest configurations.
- Create a `.prettierrc` JSON configuration with opinionated defaults to satisfy formatting commands while acknowledging the missing `.prettier` specification.
- Implement the health module per instructions, including controller methods, TypeScript tests, and E2E tests referencing the new endpoints.

## Consequences
- The project now has a reproducible skeleton ready for further domain features and database integration.
- The `.prettierrc` file may require adjustment if future guidance provides conflicting formatting rules.
- Health endpoints deliver runtime metadata and automated coverage, enabling future CI checks.
