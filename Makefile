# App: Customer Registration
# Package: project_root
# File: Makefile
# Version: 0.1.0
# Turns: 5
# Author: Codex Agent
# Date: 2025-09-25T20:43:14Z
# Exports: compose-up, compose-down, compose-logs, db-up, db-down, db-logs, db-psql, db-wait, api-dev, api-build, api-test, migrate-generate, migrate-run, migrate-revert, clean
# Description: Provides standardized Docker Compose, database, application, and migration commands for local development and CI.
#
SHELL := /bin/bash

# Paths
ENV ?= infra/.env
COMPOSE := docker compose --env-file $(ENV) -f infra/docker-compose.yml
API_DIR := api
DATASOURCE := $(API_DIR)/src/database/data-source.ts

# Migration name (override: make migrate-generate NAME=add_customer_table)
NAME ?= migration

.PHONY: compose-up compose-down compose-logs         db-up db-down db-logs db-psql db-wait         api-dev api-build api-test         migrate-generate migrate-run migrate-revert         clean

## Docker Compose (full stack)
compose-up:
	$(COMPOSE) up -d

compose-down:
	$(COMPOSE) down -v

compose-logs:
	$(COMPOSE) logs -f

## Database-only shortcuts
db-up:
	$(COMPOSE) up -d db

db-down:
	$(COMPOSE) stop db

db-logs:
	$(COMPOSE) logs -f db

# Open psql in the db container using container env (POSTGRES_USER/POSTGRES_DB)
db-psql:
	$(COMPOSE) exec db psql -U $$POSTGRES_USER -d $$POSTGRES_DB

# Wait until Postgres is accepting connections
db-wait:
	until $(COMPOSE) exec db pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB >/dev/null 2>&1; do \
		echo "Waiting for database..."; sleep 1; \
	done; echo "Database is ready."

## API app commands
api-dev:
	cd $(API_DIR) && npm run start:dev

api-build:
	cd $(API_DIR) && npm run build

api-test:
	cd $(API_DIR) && npm test

## TypeORM migrations (0.3.x)
migrate-generate:
	cd $(API_DIR) && npx typeorm migration:generate -d $(DATASOURCE) src/migrations/$(NAME)

migrate-run:
	cd $(API_DIR) && npx typeorm migration:run -d $(DATASOURCE)

migrate-revert:
	cd $(API_DIR) && npx typeorm migration:revert -d $(DATASOURCE)

## Clean untracked files (use with care)
clean:
	git clean -fdx
