/**
 * App: Customer Registration
 * Package: api/src/customers/dto
 * File: update-customer.dto.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: UpdateCustomerDto
 * Description: Extends the create DTO with optional fields for partial
 *              updates while preserving validation rules.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
