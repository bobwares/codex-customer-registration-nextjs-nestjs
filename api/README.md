<!--
App: Customer Registration
Package: api
File: README.md
Version: 0.1.0
Turns: 4
Author: Codex Agent
Date: 2025-09-26T05:05:17Z
Description: Backend API documentation covering setup, endpoints, and observability tooling.
-->

# Customer Registration API

## Prerequisites

* Node.js 20+
* PostgreSQL database with the `customer_domain` schema migrations applied (see `db/`)

## Setup

```bash
cd api
npm install
```

## Running the API

```bash
npm run start:dev
```

The service listens on `http://localhost:3000`.

* Swagger UI: `http://localhost:3000/api/docs`
* OpenAPI JSON: `http://localhost:3000/api/openapi.json`

To regenerate the OpenAPI document without starting the server:

```bash
npm run openapi:emit
```

The generated spec is saved to `api/openapi/openapi.json`.

## Testing

```bash
# Unit tests
npm test

# End-to-end tests
npm run test:e2e
```

## Logging

Structured logs are emitted in JSON by default with per-request correlation IDs. Override via environment variables:

* `LOG_LEVEL` (`error`, `warn`, `log`, `debug`, `verbose`)
* `LOG_FORMAT` (`json`, `text`)
