/**
 * LOC: VENDAPI001
 * File: /reuse/edwards/financial/composites/downstream/vendor-management-rest-api-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ./backend-procurement-modules
 *
 * DOWNSTREAM (imported by):
 *   - Main API router
 *   - Vendor application modules
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { IsNumber, IsString, IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ProcurementService, PurchaseOrderStatus, PurchaseOrder } from './backend-procurement-modules';

/**
 * Vendor status
 */
export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

/**
 * Create vendor DTO
 */
export class CreateVendorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  taxId!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contactEmail?: string;
}

/**
 * Create purchase order DTO
 */
export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  vendorId!: number;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  requiredDate!: Date;

  @ApiProperty({ type: 'array' })
  @IsNotEmpty()
  lines!: Array<{
    itemId: number;
    quantity: number;
    unitPrice: number;
    description: string;
  }>;
}

/**
 * Vendor management REST API controller
 */
@ApiTags('Vendor Management')
@ApiBearerAuth()
@Controller('api/v1/vendors')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class VendorManagementController {
  private readonly logger = new Logger(VendorManagementController.name);

  constructor(private readonly procurementService: ProcurementService) {}

  /**
   * Creates vendor
   * POST /api/v1/vendors
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create vendor' })
  @ApiResponse({ status: 201 })
  async createVendor(@Body() dto: CreateVendorDto): Promise<{
    vendorId: number;
    vendorName: string;
    status: VendorStatus;
  }> {
    this.logger.log(`REST API: Creating vendor ${dto.vendorName}`);

    return {
      vendorId: Math.floor(Math.random() * 1000000),
      vendorName: dto.vendorName,
      status: VendorStatus.PENDING,
    };
  }

  /**
   * Retrieves vendor by ID
   * GET /api/v1/vendors/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200 })
  async getVendor(@Param('id', ParseIntPipe) id: number): Promise<any> {
    this.logger.log(`REST API: Retrieving vendor ${id}`);

    return {
      vendorId: id,
      vendorName: `Vendor ${id}`,
      status: VendorStatus.ACTIVE,
      taxId: '12-3456789',
    };
  }

  /**
   * Creates purchase order
   * POST /api/v1/vendors/:id/purchase-orders
   */
  @Post(':id/purchase-orders')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create purchase order' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 201 })
  async createPurchaseOrder(
    @Param('id', ParseIntPipe) vendorId: number,
    @Body() dto: CreatePurchaseOrderDto
  ): Promise<PurchaseOrder> {
    this.logger.log(`REST API: Creating purchase order for vendor ${vendorId}`);

    dto.vendorId = vendorId;

    return this.procurementService.createPurchaseOrder(
      dto.vendorId,
      dto.lines,
      dto.requiredDate,
      1
    );
  }

  /**
   * Approves purchase order
   * POST /api/v1/vendors/purchase-orders/:poId/approve
   */
  @Post('purchase-orders/:poId/approve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve purchase order' })
  @ApiParam({ name: 'poId', type: Number })
  @ApiResponse({ status: 200 })
  async approvePurchaseOrder(
    @Param('poId', ParseIntPipe) poId: number
  ): Promise<{ success: boolean; approvedDate: Date }> {
    this.logger.log(`REST API: Approving purchase order ${poId}`);

    return this.procurementService.approvePurchaseOrder(poId, 1);
  }
}
