/**
 * App: Customer Registration
 * Package: api/src/common/dtos
 * File: problem-details.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: ProblemDetailsDto
 * Description: Defines the standard error envelope returned by the API for consistent client handling and documentation.
 */
import { ApiProperty } from '@nestjs/swagger';

export class ProblemDetailsDto {
  @ApiProperty({ description: 'HTTP status code associated with the error.', example: 400 })
  public statusCode!: number;

  @ApiProperty({ description: 'Short error identifier.', example: 'Bad Request' })
  public error!: string;

  @ApiProperty({
    description: 'Human readable error message or collection of validation issues.',
    example: ['email must be an email', 'privacySettings must be defined'],
  })
  public message!: string | string[];

  @ApiProperty({ description: 'The request path that triggered the error.', example: '/customers' })
  public path!: string;

  @ApiProperty({ description: 'ISO-8601 timestamp indicating when the error occurred.', example: '2025-09-25T20:04:09Z' })
  public timestamp!: string;

  @ApiProperty({ description: 'Correlation identifier for tracing the request across systems.', example: 'a3d6ef72-c5c5-4cda-829f-2c16eed32e8b', required: false })
  public requestId?: string;
}
