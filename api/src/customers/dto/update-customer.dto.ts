/**
 * # App: Customer Registration
 * # Package: api.customers.dtos
 * # File: src/customers/dto/update-customer.dto.ts
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:33:35Z
 * # Exports: UpdateCustomerDto
 * # Description: Partial DTO enabling updates to any subset of customer aggregate attributes.
 */
import { PartialType } from '@nestjs/mapped-types';

import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
