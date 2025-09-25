/**
 * App: Customer Registration
 * Package: api
 * File: problem-details.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: ProblemDetailsDto
 * Description: RFC 7807 compliant error payload for documenting API responses.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProblemDetailsDto {
  @ApiProperty({ description: 'Problem type URI', example: 'https://httpstatuses.org/404' })
  type!: string;

  @ApiProperty({ description: 'Short error summary', example: 'Not Found' })
  title!: string;

  @ApiProperty({ description: 'HTTP status code', example: 404 })
  status!: number;

  @ApiPropertyOptional({ description: 'Detailed human-readable error message' })
  detail?: string;

  @ApiPropertyOptional({ description: 'Request-specific instance URI' })
  instance?: string;
}
