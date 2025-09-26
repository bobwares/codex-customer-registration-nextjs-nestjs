/**
 * App: Customer Registration
 * Package: api/src/customer/dtos
 * File: update-customer.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:00:07Z
 * Exports: UpdateCustomerDto
 * Description: DTO enabling partial updates to an existing customer leveraging optional fields with validation.
 */
import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
