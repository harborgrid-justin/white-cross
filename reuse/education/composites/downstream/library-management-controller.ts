/**
 * LOC: EDU-DOWN-LIBRARY-MANAGEMENT-CTRL
 * File: library-management-controller.ts
 * Purpose: Library Management REST Controller - Production-grade HTTP endpoints
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  LibraryManagementService,
  LibraryItem,
  CheckOut,
  LibraryReservation,
} from './library-management-service';
import { JwtAuthGuard } from './security/guards/jwt-auth.guard';
import { RolesGuard } from './security/guards/roles.guard';

@ApiTags('library-management')
@ApiBearerAuth()
@Controller('library-management')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LibraryManagementController {
  private readonly logger = new Logger(LibraryManagementController.name);

  constructor(private readonly libraryManagementService: LibraryManagementService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Check out library item' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: { type: 'string' },
        itemId: { type: 'string' }
      }
    }
  })
  @ApiCreatedResponse({ description: 'Item checked out', type: CheckOut })
  @ApiBadRequestResponse({ description: 'Checkout failed' })
  async checkoutItem(
    @Body('studentId', ParseUUIDPipe) studentId: string,
    @Body('itemId', ParseUUIDPipe) itemId: string
  ): Promise<CheckOut> {
    return this.libraryManagementService.checkoutItem(studentId, itemId);
  }

  @Post('return/:checkoutId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Return library item' })
  @ApiParam({ name: 'checkoutId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Item returned' })
  @ApiBadRequestResponse({ description: 'Return failed' })
  async returnItem(
    @Param('checkoutId', ParseUUIDPipe) checkoutId: string
  ): Promise<CheckOut> {
    return this.libraryManagementService.returnItem(checkoutId);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search library catalog' })
  @ApiQuery({ name: 'query', type: 'string', description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results', type: [LibraryItem] })
  async searchLibraryCatalog(
    @Query('query') query: string
  ): Promise<LibraryItem[]> {
    return this.libraryManagementService.searchLibraryCatalog(query);
  }

  @Get('items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get library item details' })
  @ApiParam({ name: 'itemId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Item details retrieved', type: LibraryItem })
  @ApiNotFoundResponse({ description: 'Item not found' })
  async getItemDetails(
    @Param('itemId', ParseUUIDPipe) itemId: string
  ): Promise<LibraryItem> {
    return this.libraryManagementService.getItemDetails(itemId);
  }

  @Post('reserve')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Reserve library item' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentId: { type: 'string' },
        itemId: { type: 'string' }
      }
    }
  })
  @ApiCreatedResponse({ description: 'Item reserved', type: LibraryReservation })
  @ApiBadRequestResponse({ description: 'Reservation failed' })
  async reserveItem(
    @Body('studentId', ParseUUIDPipe) studentId: string,
    @Body('itemId', ParseUUIDPipe) itemId: string
  ): Promise<LibraryReservation> {
    return this.libraryManagementService.reserveItem(studentId, itemId);
  }

  @Get('student/:studentId/checkouts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get student checkouts' })
  @ApiParam({ name: 'studentId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Checkouts retrieved', type: [CheckOut] })
  async getStudentCheckouts(
    @Param('studentId', ParseUUIDPipe) studentId: string
  ): Promise<CheckOut[]> {
    return this.libraryManagementService.getStudentCheckouts(studentId);
  }

  @Put('checkout/:checkoutId/renew')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renew library checkout' })
  @ApiParam({ name: 'checkoutId', type: 'string' })
  @ApiResponse({ status: 200, description: 'Checkout renewed' })
  async renewCheckout(
    @Param('checkoutId', ParseUUIDPipe) checkoutId: string
  ): Promise<CheckOut> {
    return this.libraryManagementService.renewCheckout(checkoutId);
  }

  @Get('overdue')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get overdue items' })
  @ApiResponse({ status: 200, description: 'Overdue items retrieved', type: [CheckOut] })
  async getOverdueItems(): Promise<CheckOut[]> {
    return this.libraryManagementService.getOverdueItems();
  }

  @Get('report')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate library report' })
  @ApiResponse({ status: 200, description: 'Report generated' })
  async generateLibraryReport(): Promise<Record<string, any>> {
    return this.libraryManagementService.generateLibraryReport();
  }

  @Put('items/:itemId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update library item status' })
  @ApiParam({ name: 'itemId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['available', 'checked_out', 'reserved', 'damaged'] }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Item status updated' })
  async updateItemStatus(
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body('status') status: string
  ): Promise<LibraryItem> {
    return this.libraryManagementService.updateItemStatus(itemId, status);
  }
}
