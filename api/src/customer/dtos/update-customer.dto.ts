/**
 * App: Customer Registration
 * Package: api
 * File: update-customer.dto.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: UpdateCustomerDto
 * Description: DTO supporting partial updates to the customer aggregate.
 */
import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
