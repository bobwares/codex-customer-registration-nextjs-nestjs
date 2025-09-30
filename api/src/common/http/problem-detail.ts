/**
 * # App: Customer Registration API
 * # Package: api/src/common/http
 * # File: problem-detail.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Exports: ProblemDetail
 * # Description: Defines the RFC7807-inspired Problem Details response envelope documented in Swagger and
 * #              returned by the global HTTP exception filter.
 */
import { ApiProperty } from '@nestjs/swagger';

export class ProblemDetail {
  @ApiProperty({ example: 400, description: 'HTTP status code for the error response.' })
  statusCode!: number;

  @ApiProperty({ example: 'Bad Request', description: 'Short error classification or reason phrase.' })
  error!: string;

  @ApiProperty({
    example: 'Validation failed for the submitted payload.',
    description: 'Human readable error message or summary.',
  })
  message!: string | string[];

  @ApiProperty({ example: '/customers', description: 'Request path that triggered the error.' })
  path!: string;

  @ApiProperty({
    example: '2025-09-30T17:20:00.000Z',
    description: 'UTC timestamp when the error was generated.',
  })
  timestamp!: string;
}
