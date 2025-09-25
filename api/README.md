# Customer Registration API

## Database and Migrations

1. Start the PostgreSQL instance:
   ```bash
   docker compose -f ../db/docker-compose.yml up -d
   ```
2. Validate connectivity and credentials:
   ```bash
   npm run db:validate
   ```
3. Generate a new migration from entity changes:
   ```bash
   npm run typeorm:migration:generate -- src/migrations/<Name>
   ```
4. Build the project and apply compiled migrations (CI / production):
   ```bash
   npm run build
   npm run typeorm:migration:run:js
   ```
5. Revert the latest compiled migration if required:
   ```bash
   npm run typeorm:migration:revert:js
   ```
