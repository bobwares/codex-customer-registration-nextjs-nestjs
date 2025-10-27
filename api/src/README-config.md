# App: Customer Registration
# Package: api/src
# File: README-config.md
# Version: 0.1.0
# Turns: 1
# Author: gpt-5-codex
# Date: 2025-10-27T06:28:15Z
# Exports: Documentation
# Description: Developer notes describing configuration usage within the NestJS API.

# Config usage

1. Read values anywhere by injecting `ConfigService`:

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

2. Add strongly-typed helpers if desired (create a `config.types.ts` and wrap lookups).
3. Validation lives in `src/config/validation.ts`; update when adding new env keys.
