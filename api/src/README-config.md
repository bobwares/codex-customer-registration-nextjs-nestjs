# Config usage

1) Read values anywhere by injecting ConfigService:

```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExampleService {
  constructor(private readonly config: ConfigService) {}

  getDbHost(): string {
    return this.config.get<string>('db.host', '127.0.0.1');
  }
}
```

2) Add strongly-typed helpers if desired (create a config.types.ts and wrap lookups).
3) Validation lives in src/config/validation.ts; update when adding new env keys.

## Database & Migrations

1. Validate credentials with `npm run db:validate` (reads `ai/context/.env` by default).
2. Run TypeORM migrations during development: `npm run typeorm:migration:run`.
3. Build the project before applying compiled migrations in CI: `npm run build` then `npm run typeorm:migration:run:js`.
4. Generate new migrations with `npm run typeorm:migration:generate` after updating entities.
