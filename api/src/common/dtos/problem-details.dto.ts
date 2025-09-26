/**
 * App: Customer Registration
 * Package: api/src/common/dtos
 * File: problem-details.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T04:59:09Z
 * Exports: ProblemDetailsDto
 * Description: Canonical error envelope describing HTTP failures returned by the API.
 */
import { ApiProperty } from '@nestjs/swagger';

export class ProblemDetailsDto {
  @ApiProperty({ description: 'HTTP status code for the error response', example: 400 })
  public statusCode!: number;

  @ApiProperty({ description: 'Short classification of the error', example: 'Bad Request' })
  public error!: string;

  @ApiProperty({ description: 'Human-readable explanation of the error', example: 'Validation failed for the request body.' })
  public message!: string;

  @ApiProperty({ description: 'Request path that triggered the error', example: '/customers' })
  public path!: string;

  @ApiProperty({ description: 'Timestamp when the error was generated', example: '2025-09-26T00:00:00.000Z' })
  public timestamp!: string;

  @ApiProperty({ description: 'Correlation identifier attached to the request', example: '3f4482c9-74ff-4d36-96bc-9e40776e6d62', required: false })
  public requestId?: string;
}
