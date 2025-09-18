/**
 * App: Customer Registration
 * Package: api/src/customer/dto
 * File: update-customer.dto.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: UpdateCustomerDto
 * Description: DTO representing updates to customer registrations with optional fields.
 */
import { PartialType } from '@nestjs/mapped-types';

import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
