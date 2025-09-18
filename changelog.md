# Changelog

## Turn 1 – 2025-09-18T20:25:00Z
### Summary
- Completed SQLite-safe entity mappings by introducing shared column type helpers and refactoring customer service persistence logic.
- Stabilized API e2e harness and unit tests with deterministic UUIDs, fetch polyfills, and repository mocks that cover new manager interactions.
- Expanded UI tooling (ts-node, jest-environment-jsdom) and fetch mocking so Next.js component tests execute under Jest.
- Authored top-level documentation, version history, and agentic pipeline artifacts for the initial project turn.

### Testing
- API: `npm run lint`, `npm test -- --runInBand`, `npm run test:e2e`
- UI: `npm run lint`, `npm test`
