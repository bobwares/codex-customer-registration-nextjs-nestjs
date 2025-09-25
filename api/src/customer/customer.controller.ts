/**
 * App: Customer Registration
 * Package: api
 * File: customer.controller.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: CustomerController
 * Description: REST controller exposing CRUD operations for customer
 *              registration records with OpenAPI documentation.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerResponseDto } from './dtos/customer-response.dto';
import { ProblemDetailsDto } from '../common/dtos/problem-details.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'List customers' })
  @ApiOkResponse({ type: [CustomerResponseDto], description: 'Collection of customers' })
  async findAll(): Promise<CustomerResponseDto[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a customer by identifier' })
  @ApiParam({ name: 'id', description: 'Customer identifier', type: String })
  @ApiOkResponse({ type: CustomerResponseDto, description: 'Requested customer record' })
  @ApiNotFoundResponse({ description: 'Customer not found', type: ProblemDetailsDto })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<CustomerResponseDto> {
    return this.customerService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiCreatedResponse({ type: CustomerResponseDto, description: 'Customer created successfully' })
  @ApiBadRequestResponse({ description: 'Validation error', type: ProblemDetailsDto })
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return this.customerService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing customer' })
  @ApiParam({ name: 'id', description: 'Customer identifier', type: String })
  @ApiOkResponse({ type: CustomerResponseDto, description: 'Updated customer record' })
  @ApiBadRequestResponse({ description: 'Validation error', type: ProblemDetailsDto })
  @ApiNotFoundResponse({ description: 'Customer not found', type: ProblemDetailsDto })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', description: 'Customer identifier', type: String })
  @ApiNoContentResponse({ description: 'Customer removed' })
  @ApiNotFoundResponse({ description: 'Customer not found', type: ProblemDetailsDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.customerService.remove(id);
  }
}
