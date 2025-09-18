/**
 * App: Customer Registration
 * Package: api.customers.dtos
 * File: update-customer.dto.ts
 * Version: 0.1.1
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: UpdateCustomerDto
 * Description: DTO enabling partial updates to customers while reusing validation constraints
 *              from the creation contract.
 */
import { PartialType } from '@nestjs/mapped-types';

import { CreateCustomerDto, PhoneNumberDto, PostalAddressDto, PrivacySettingsDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  address?: PostalAddressDto;
  privacySettings?: PrivacySettingsDto;
  emails?: string[];
  phoneNumbers?: PhoneNumberDto[];
}
