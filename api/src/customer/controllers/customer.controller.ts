/**
 * # App: Customer Registration API
 * # Package: api/src/customer/controllers
 * # File: customer.controller.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Exports: CustomerController
 * # Description: Exposes RESTful CRUD endpoints for customer resources including list, fetch, create,
 * #              update, and delete operations with Problem Details error responses and Swagger metadata.
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
  ApiTags,
} from '@nestjs/swagger';
import { CustomerEntity } from '../entities';
import {
  CreateCustomerPayload,
  CustomerService,
  UpdateCustomerProfilePayload,
} from '../services/customer.service';
import {
  CreateCustomerDto,
  CustomerAddressDto,
  CustomerPhoneNumberDto,
  CustomerPrivacySettingsDto,
} from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { ResponseCustomerDto } from '../dtos/response-customer.dto';
import { ProblemDetail } from '../../common/http/problem-detail';

@ApiTags('Customer')
@ApiExtraModels(
  ProblemDetail,
  ResponseCustomerDto,
  CustomerAddressDto,
  CustomerPhoneNumberDto,
  CustomerPrivacySettingsDto,
)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'List customers' })
  @ApiOkResponse({ description: 'A collection of customers.', type: ResponseCustomerDto, isArray: true })
  async listCustomers(): Promise<ResponseCustomerDto[]> {
    const customers = await this.customerService.listCustomers();
    return customers.map((customer) => CustomerController.toResponseDto(customer));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a customer by identifier' })
  @ApiParam({ name: 'id', type: String, description: 'Customer identifier', example: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a' })
  @ApiOkResponse({ description: 'Customer found.', type: ResponseCustomerDto })
  @ApiNotFoundResponse({ description: 'Customer not found.', type: ProblemDetail })
  async getCustomer(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<ResponseCustomerDto> {
    const customer = await this.customerService.findCustomerById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return CustomerController.toResponseDto(customer);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiCreatedResponse({ description: 'Customer successfully created.', type: ResponseCustomerDto })
  @ApiBadRequestResponse({ description: 'Invalid payload supplied.', type: ProblemDetail })
  async createCustomer(@Body() payload: CreateCustomerDto): Promise<ResponseCustomerDto> {
    const createPayload: CreateCustomerPayload = {
      customerId: payload.id,
      firstName: payload.firstName,
      middleName: payload.middleName ?? null,
      lastName: payload.lastName,
      privacySettings: payload.privacySettings,
      emails: payload.emails,
    };

    if (payload.address) {
      createPayload.address = payload.address;
    }

    if (payload.phoneNumbers) {
      createPayload.phoneNumbers = payload.phoneNumbers;
    }

    const entity = await this.customerService.createCustomer(createPayload);

    return CustomerController.toResponseDto(entity);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing customer' })
  @ApiParam({ name: 'id', type: String, description: 'Customer identifier', example: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a' })
  @ApiOkResponse({ description: 'Customer successfully updated.', type: ResponseCustomerDto })
  @ApiBadRequestResponse({ description: 'Invalid payload supplied.', type: ProblemDetail })
  @ApiNotFoundResponse({ description: 'Customer not found.', type: ProblemDetail })
  async updateCustomer(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() payload: UpdateCustomerDto,
  ): Promise<ResponseCustomerDto> {
    const changes: UpdateCustomerProfilePayload = {};

    if (payload.firstName !== undefined) {
      changes.firstName = payload.firstName;
    }
    if (payload.middleName !== undefined) {
      changes.middleName = payload.middleName ?? null;
    }
    if (payload.lastName !== undefined) {
      changes.lastName = payload.lastName;
    }
    if (payload.address !== undefined) {
      changes.address = payload.address;
    }
    if (payload.privacySettings !== undefined) {
      changes.privacySettings = payload.privacySettings;
    }
    if (payload.emails !== undefined) {
      changes.emails = payload.emails;
    }
    if (payload.phoneNumbers !== undefined) {
      changes.phoneNumbers = payload.phoneNumbers;
    }

    const entity = await this.customerService.updateCustomerProfile(id, changes);

    return CustomerController.toResponseDto(entity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an existing customer' })
  @ApiParam({ name: 'id', type: String, description: 'Customer identifier', example: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a' })
  @ApiNoContentResponse({ description: 'Customer deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Customer not found.', type: ProblemDetail })
  async deleteCustomer(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const existing = await this.customerService.findCustomerById(id);
    if (!existing) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    await this.customerService.deleteCustomer(id);
  }

  private static toResponseDto(entity: CustomerEntity): ResponseCustomerDto {
    return {
      id: entity.customerId,
      firstName: entity.firstName,
      middleName: entity.middleName,
      lastName: entity.lastName,
      emails: entity.emails?.map((email) => email.email) ?? [],
      phoneNumbers:
        entity.phoneNumbers?.map((phone) => ({
          type: phone.type,
          number: phone.number,
        })) ?? [],
      address: entity.address
        ? {
            line1: entity.address.line1,
            line2: entity.address.line2,
            city: entity.address.city,
            state: entity.address.state,
            postalCode: entity.address.postalCode,
            country: entity.address.country,
          }
        : null,
      privacySettings: {
        marketingEmailsEnabled: entity.privacySettings.marketingEmailsEnabled,
        twoFactorEnabled: entity.privacySettings.twoFactorEnabled,
      },
    };
  }
}
