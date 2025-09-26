/**
 * App: Customer Registration
 * Package: api/src/customer
 * File: customer.controller.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:00:59Z
 * Exports: CustomerController
 * Description: REST controller exposing CRUD endpoints for customers with OpenAPI metadata and validation.
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
  ApiExtraModels,
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

@ApiTags('Customer')
@ApiExtraModels(ProblemDetailsDto, CustomerResponseDto)
@Controller('customers')
export class CustomerController {
  public constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  @ApiOkResponse({ type: [CustomerResponseDto] })
  public async findAll(): Promise<CustomerResponseDto[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a customer by identifier' })
  @ApiParam({ name: 'id', type: String, description: 'Customer identifier (UUID)' })
  @ApiOkResponse({ type: CustomerResponseDto })
  @ApiNotFoundResponse({ description: 'Customer not found', type: ProblemDetailsDto })
  public async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<CustomerResponseDto> {
    return this.customerService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiCreatedResponse({ type: CustomerResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload', type: ProblemDetailsDto })
  public async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    return this.customerService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing customer' })
  @ApiParam({ name: 'id', type: String, description: 'Customer identifier (UUID)' })
  @ApiOkResponse({ type: CustomerResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload', type: ProblemDetailsDto })
  @ApiNotFoundResponse({ description: 'Customer not found', type: ProblemDetailsDto })
  public async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', type: String, description: 'Customer identifier (UUID)' })
  @ApiNoContentResponse({ description: 'Customer deleted successfully' })
  @ApiNotFoundResponse({ description: 'Customer not found', type: ProblemDetailsDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.customerService.remove(id);
  }
}
