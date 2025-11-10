/**
 * LOC: TAXAPI001
 * File: /reuse/edwards/financial/composites/downstream/tax-management-rest-api-controllers.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - ../tax-management-compliance-composite
 *
 * DOWNSTREAM (imported by):
 *   - Main API router
 *   - Tax application modules
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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
import { IsNumber, IsString, IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Tax type
 */
export enum TaxType {
  INCOME_TAX = 'INCOME_TAX',
  SALES_TAX = 'SALES_TAX',
  USE_TAX = 'USE_TAX',
  PROPERTY_TAX = 'PROPERTY_TAX',
  PAYROLL_TAX = 'PAYROLL_TAX',
  VALUE_ADDED_TAX = 'VALUE_ADDED_TAX',
}

/**
 * Tax jurisdiction
 */
export enum TaxJurisdiction {
  FEDERAL = 'FEDERAL',
  STATE = 'STATE',
  COUNTY = 'COUNTY',
  CITY = 'CITY',
  SPECIAL_DISTRICT = 'SPECIAL_DISTRICT',
}

/**
 * Calculate tax request DTO
 */
export class CalculateTaxRequestDto {
  @ApiProperty({ enum: TaxType })
  @IsEnum(TaxType)
  @IsNotEmpty()
  taxType!: TaxType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  baseAmount!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jurisdiction!: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  taxDate!: Date;
}

/**
 * Tax calculation response DTO
 */
export class TaxCalculationResponseDto {
  @ApiProperty()
  taxAmount!: number;

  @ApiProperty()
  taxRate!: number;

  @ApiProperty()
  baseAmount!: number;

  @ApiProperty({ enum: TaxType })
  taxType!: TaxType;

  @ApiProperty()
  jurisdiction!: string;
}

/**
 * Tax management REST API controller
 */
@ApiTags('Tax Management')
@ApiBearerAuth()
@Controller('api/v1/tax')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class TaxManagementController {
  private readonly logger = new Logger(TaxManagementController.name);

  /**
   * Calculates tax
   * POST /api/v1/tax/calculate
   */
  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Calculate tax' })
  @ApiResponse({ status: 200, type: TaxCalculationResponseDto })
  async calculateTax(@Body() dto: CalculateTaxRequestDto): Promise<TaxCalculationResponseDto> {
    this.logger.log(`Calculating ${dto.taxType} for amount ${dto.baseAmount}`);

    const taxRate = 0.0825; // 8.25%
    const taxAmount = dto.baseAmount * taxRate;

    return {
      taxAmount,
      taxRate,
      baseAmount: dto.baseAmount,
      taxType: dto.taxType,
      jurisdiction: dto.jurisdiction,
    };
  }

  /**
   * Retrieves tax rates
   * GET /api/v1/tax/rates/:jurisdiction
   */
  @Get('rates/:jurisdiction')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get tax rates for jurisdiction' })
  @ApiParam({ name: 'jurisdiction', type: String })
  @ApiResponse({ status: 200 })
  async getTaxRates(@Param('jurisdiction') jurisdiction: string): Promise<{
    jurisdiction: string;
    rates: Array<{ taxType: TaxType; rate: number }>;
  }> {
    this.logger.log(`Retrieving tax rates for ${jurisdiction}`);

    return {
      jurisdiction,
      rates: [
        { taxType: TaxType.SALES_TAX, rate: 0.0825 },
        { taxType: TaxType.USE_TAX, rate: 0.0825 },
      ],
    };
  }

  /**
   * Files tax return
   * POST /api/v1/tax/returns
   */
  @Post('returns')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'File tax return' })
  @ApiResponse({ status: 201 })
  async fileTaxReturn(
    @Body() dto: { taxType: TaxType; fiscalYear: number; fiscalPeriod: number }
  ): Promise<{ returnId: number; status: string }> {
    this.logger.log(`Filing ${dto.taxType} return for FY${dto.fiscalYear} P${dto.fiscalPeriod}`);

    return {
      returnId: Math.floor(Math.random() * 1000000),
      status: 'FILED',
    };
  }
}
