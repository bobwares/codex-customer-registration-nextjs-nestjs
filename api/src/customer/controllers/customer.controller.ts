/**
 * App: Customer Registration
 * Package: api/src/customer/controllers
 * File: customer.controller.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: CustomerController
 * Description: Exposes RESTful CRUD operations for customers, maps DTOs to domain services, and documents endpoints for Swagger UI.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { PhoneNumberDto } from '../dtos/phone-number.dto';
import { PostalAddressDto } from '../dtos/postal-address.dto';
import { PrivacySettingsDto } from '../dtos/privacy-settings.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { CustomerService, CreateCustomerInput, UpdateCustomerInput } from '../services/customer.service';
import { ProblemDetailsDto } from '../../common/dtos/problem-details.dto';
import type { CustomerEntity } from '../entities/customer.entity';

@ApiTags('Customer')
@ApiExtraModels(ProblemDetailsDto, CustomerResponseDto, PhoneNumberDto, PostalAddressDto, PrivacySettingsDto)
@Controller('customers')
export class CustomerController {
  public constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer record.' })
  @ApiCreatedResponse({ description: 'Customer successfully created.', type: CustomerResponseDto })
  @ApiBadRequestResponse({ description: 'Malformed payload.', type: ProblemDetailsDto })
  @ApiUnprocessableEntityResponse({ description: 'Validation failure.', type: ProblemDetailsDto })
  public async create(@Body() payload: CreateCustomerDto): Promise<CustomerResponseDto> {
    const created = await this.customerService.createCustomer(this.mapCreateDtoToInput(payload));
    return this.mapEntityToResponse(created);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all customers or a filtered subset by identifier.' })
  @ApiQuery({
    name: 'ids',
    required: false,
    description: 'Comma-separated list of customer identifiers to filter results.',
    example: 'c4f3f7e6-225c-4a4e-b351-3bd2691de2cf,0a594762-7d6d-4b7a-ae35-8adf043d5b12',
  })
  @ApiOkResponse({ description: 'Collection of customers.', type: CustomerResponseDto, isArray: true })
  @ApiBadRequestResponse({ description: 'Malformed query parameter.', type: ProblemDetailsDto })
  public async findAll(@Query('ids') ids?: string | string[]): Promise<CustomerResponseDto[]> {
    const normalizedIds = this.normalizeIds(ids);
    const results = await this.customerService.listCustomers(normalizedIds);
    return results.map((customer) => this.mapEntityToResponse(customer));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single customer by identifier.' })
  @ApiParam({ name: 'id', description: 'Customer identifier.', format: 'uuid' })
  @ApiOkResponse({ description: 'Customer located.', type: CustomerResponseDto })
  @ApiNotFoundResponse({ description: 'Customer not found.', type: ProblemDetailsDto })
  public async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerService.findCustomerById(id);
    if (!customer) {
      throw new NotFoundException(`Customer ${id} was not found.`);
    }
    return this.mapEntityToResponse(customer);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing customer.' })
  @ApiParam({ name: 'id', description: 'Customer identifier.', format: 'uuid' })
  @ApiOkResponse({ description: 'Customer updated.', type: CustomerResponseDto })
  @ApiBadRequestResponse({ description: 'Malformed payload.', type: ProblemDetailsDto })
  @ApiUnprocessableEntityResponse({ description: 'Validation failure.', type: ProblemDetailsDto })
  @ApiNotFoundResponse({ description: 'Customer not found.', type: ProblemDetailsDto })
  public async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() payload: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const updated = await this.customerService.updateCustomer(id, this.mapUpdateDtoToInput(payload));
    return this.mapEntityToResponse(updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer by identifier.' })
  @ApiParam({ name: 'id', description: 'Customer identifier.', format: 'uuid' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Customer deleted.' })
  @ApiNotFoundResponse({ description: 'Customer not found.', type: ProblemDetailsDto })
  public async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
    await this.customerService.removeCustomer(id);
  }

  private normalizeIds(ids?: string | string[]): string[] | undefined {
    if (!ids) {
      return undefined;
    }
    if (Array.isArray(ids)) {
      return ids.filter((value) => Boolean(value));
    }
    return ids
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }

  private mapCreateDtoToInput(dto: CreateCustomerDto): CreateCustomerInput {
    const input: CreateCustomerInput = {
      name: this.composeDisplayName(dto.firstName, dto.lastName),
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.emails[0],
      privacySettings: {
        marketingEmailsEnabled: dto.privacySettings.marketingEmailsEnabled,
        twoFactorEnabled: dto.privacySettings.twoFactorEnabled,
      },
      emails: dto.emails.map((email, index) => ({ email, isPrimary: index === 0 })),
    };

    if (dto.id) {
      input.customerId = dto.id;
    }
    if (dto.middleName !== undefined) {
      input.middleName = dto.middleName;
    }
    if (dto.phoneNumbers) {
      input.phoneNumbers = dto.phoneNumbers.map((phone) => ({
        type: phone.type,
        number: phone.number,
        extension: phone.extension ?? null,
      }));
    }
    if (dto.address) {
      input.address = {
        line1: dto.address.line1,
        line2: dto.address.line2 ?? null,
        city: dto.address.city,
        state: dto.address.state,
        postalCode: dto.address.postalCode,
        country: dto.address.country,
      };
    }

    return input;
  }

  private mapUpdateDtoToInput(dto: UpdateCustomerDto): UpdateCustomerInput {
    const input: UpdateCustomerInput = {};

    if (dto.firstName !== undefined) {
      input.firstName = dto.firstName;
    }
    if (dto.middleName !== undefined) {
      input.middleName = dto.middleName;
    }
    if (dto.lastName !== undefined) {
      input.lastName = dto.lastName;
    }
    if (dto.emails !== undefined) {
      input.emails = dto.emails
        ? dto.emails.map((email, index) => ({ email, isPrimary: index === 0 }))
        : [];
      if (dto.emails && dto.emails.length > 0) {
        input.email = dto.emails[0];
      }
    }
    if (dto.phoneNumbers !== undefined) {
      input.phoneNumbers = dto.phoneNumbers
        ? dto.phoneNumbers.map((phone) => ({
            type: phone.type,
            number: phone.number,
            extension: phone.extension ?? null,
          }))
        : [];
    }
    if (dto.address !== undefined) {
      input.address =
        dto.address === null
          ? null
          : {
              line1: dto.address.line1,
              line2: dto.address.line2 ?? null,
              city: dto.address.city,
              state: dto.address.state,
              postalCode: dto.address.postalCode,
              country: dto.address.country,
            };
    }
    if (dto.privacySettings !== undefined) {
      input.privacySettings =
        dto.privacySettings === null
          ? null
          : {
              marketingEmailsEnabled: dto.privacySettings.marketingEmailsEnabled,
              twoFactorEnabled: dto.privacySettings.twoFactorEnabled,
            };
    }

    if (dto.firstName !== undefined || dto.lastName !== undefined) {
      input.name = this.composeDisplayName(dto.firstName, dto.lastName);
    }

    return input;
  }

  private mapEntityToResponse(entity: CustomerEntity): CustomerResponseDto {
    const emails = entity.emails?.map((email) => email.email) ?? [entity.email];
    const primaryEmail = entity.emails?.find((email) => email.isPrimary)?.email ?? entity.email;

    return {
      id: entity.customerId,
      firstName: entity.firstName,
      middleName: entity.middleName ?? null,
      lastName: entity.lastName,
      displayName: entity.name,
      primaryEmail,
      emails,
      ...(entity.phoneNumbers?.length
        ? {
            phoneNumbers: entity.phoneNumbers.map((phone) => ({
              type: phone.type,
              number: phone.number,
              extension: phone.extension ?? null,
            })),
          }
        : {}),
      address: entity.address
        ? {
            line1: entity.address.line1,
            line2: entity.address.line2 ?? null,
            city: entity.address.city,
            state: entity.address.state,
            postalCode: entity.address.postalCode,
            country: entity.address.country,
          }
        : null,
      privacySettings: entity.privacySettings
        ? {
            marketingEmailsEnabled: entity.privacySettings.marketingEmailsEnabled,
            twoFactorEnabled: entity.privacySettings.twoFactorEnabled,
          }
        : null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private composeDisplayName(firstName?: string, lastName?: string): string {
    return [firstName ?? '', lastName ?? '']
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .join(' ')
      .trim();
  }
}
