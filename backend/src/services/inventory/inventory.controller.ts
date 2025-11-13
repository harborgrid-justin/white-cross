import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { StockManagementService } from './services/stock-management.service';
import { AlertsService } from './services/alerts.service';
import { PurchaseOrderService } from '@/services/purchase-order.service';
import { ReorderAutomationService } from '@/services/reorder-automation.service';
import { TransactionService } from '@/services/transaction.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { CreateInventoryTransactionDto } from './dto/create-inventory-transaction.dto';
import { PurchaseOrderStatus } from './entities/purchase-order.entity';
import { AlertSeverity, AlertType } from './dto/inventory-alert.dto';

import { BaseController } from '@/common/base';
@ApiTags('inventory')
@Controller('inventory')
@ApiBearerAuth()
export class InventoryController extends BaseController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly stockManagementService: StockManagementService,
    private readonly alertsService: AlertsService,
    private readonly purchaseOrderService: PurchaseOrderService,
    private readonly reorderAutomationService: ReorderAutomationService,
    private readonly transactionService: TransactionService,
  ) {}

  // ============ Inventory CRUD Operations ============

  @Post()
  @ApiOperation({
    summary: 'Create a new inventory item',
    description:
      'Creates a new inventory item with complete specifications including supplier information, stock levels, reorder points, and categorization. Supports medical supplies, medications, and general healthcare inventory.',
  })
  @ApiBody({ type: CreateInventoryItemDto })
  @ApiResponse({
    status: 201,
    description: 'Inventory item created successfully with generated UUID',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        category: { type: 'string' },
        supplier: { type: 'string' },
        currentStock: { type: 'number' },
        minimumStock: { type: 'number' },
        reorderPoint: { type: 'number' },
        unitPrice: { type: 'number' },
        location: { type: 'string' },
        expirationDate: { type: 'string', format: 'date', nullable: true },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Insufficient permissions for inventory management',
  })
  @ApiResponse({
    status: 409,
    description: 'Item with this name already exists',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createInventoryItem(@Body() createDto: CreateInventoryItemDto) {
    return this.inventoryService.createInventoryItem(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all inventory items',
    description:
      'Retrieves paginated inventory items with comprehensive filtering by category, supplier, location, stock levels, and expiration dates. Includes stock status indicators and reorder recommendations.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    example: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    example: 20,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by item category (medications, supplies, equipment)',
  })
  @ApiQuery({
    name: 'supplier',
    required: false,
    description: 'Filter by supplier name',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    description: 'Filter by storage location',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: 'boolean',
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'lowStock',
    required: false,
    type: 'boolean',
    description: 'Show only low stock items',
  })
  @ApiQuery({
    name: 'expired',
    required: false,
    type: 'boolean',
    description: 'Show only expired items',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory items retrieved successfully with stock status',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              category: { type: 'string' },
              supplier: { type: 'string' },
              currentStock: { type: 'number' },
              minimumStock: { type: 'number' },
              stockStatus: {
                type: 'string',
                enum: ['in_stock', 'low_stock', 'out_of_stock'],
                example: 'in_stock',
              },
              location: { type: 'string' },
              unitPrice: { type: 'number' },
              expirationDate: {
                type: 'string',
                format: 'date',
                nullable: true,
              },
              daysToExpiry: { type: 'number', nullable: true },
              requiresReorder: { type: 'boolean' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          },
        },
        summary: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            lowStockCount: { type: 'number' },
            expiredCount: { type: 'number' },
            totalValue: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllInventoryItems(
    @Query('category') category?: string,
    @Query('supplier') supplier?: string,
    @Query('location') location?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.inventoryService.getAllInventoryItems({
      category,
      supplier,
      location,
      isActive,
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search inventory items' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns matching inventory items' })
  async searchInventoryItems(
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ) {
    return this.inventoryService.searchInventoryItems(query, limit);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get inventory items count' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns item count' })
  async getInventoryItemsCount(@Query('isActive') isActive?: boolean) {
    return this.inventoryService.getInventoryItemsCount(isActive);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single inventory item by ID',
    description:
      'Retrieves detailed information for a specific inventory item including full specifications, stock history, transaction logs, and usage analytics.',
  })
  @ApiParam({ name: 'id', description: 'Inventory item UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description:
      'Inventory item retrieved successfully with detailed information',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        supplier: { type: 'string' },
        supplierContact: { type: 'string' },
        currentStock: { type: 'number' },
        minimumStock: { type: 'number' },
        maximumStock: { type: 'number' },
        reorderPoint: { type: 'number' },
        reorderQuantity: { type: 'number' },
        unitPrice: { type: 'number' },
        totalValue: { type: 'number' },
        location: { type: 'string' },
        barcode: { type: 'string', nullable: true },
        expirationDate: { type: 'string', format: 'date', nullable: true },
        batchNumber: { type: 'string', nullable: true },
        isControlled: { type: 'boolean' },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        stockMovements: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string', format: 'date-time' },
              type: { type: 'string', enum: ['in', 'out', 'adjustment'] },
              quantity: { type: 'number' },
              reason: { type: 'string' },
              userId: { type: 'string' },
            },
          },
        },
        alerts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['low_stock', 'expired', 'expiring_soon'],
              },
              message: { type: 'string' },
              severity: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getInventoryItem(@Param('id') id: string) {
    return this.inventoryService.getInventoryItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item UUID' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async updateInventoryItem(
    @Param('id') id: string,
    @Body() updateDto: UpdateInventoryItemDto,
  ) {
    return this.inventoryService.updateInventoryItem(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory item (soft delete)' })
  @ApiParam({ name: 'id', description: 'Inventory item UUID' })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async deleteInventoryItem(@Param('id') id: string) {
    return this.inventoryService.deleteInventoryItem(id);
  }

  // ============ Stock Management Operations ============

  @Get(':id/stock')
  @ApiTags('stock')
  @ApiOperation({ summary: 'Get current stock level for an item' })
  @ApiParam({ name: 'id', description: 'Inventory item UUID' })
  @ApiResponse({ status: 200, description: 'Returns current stock quantity' })
  async getCurrentStock(@Param('id') id: string) {
    const stock = await this.stockManagementService.getCurrentStock(id);
    return { inventoryItemId: id, currentStock: stock };
  }

  @Post(':id/stock/adjust')
  @ApiTags('stock')
  @ApiOperation({
    summary: 'Adjust stock level with audit trail',
    description:
      'Adjusts inventory stock levels with comprehensive audit logging. Supports positive and negative adjustments with mandatory reason codes. Tracks user, timestamp, and maintains complete audit trail for regulatory compliance.',
  })
  @ApiParam({ name: 'id', description: 'Inventory item UUID', format: 'uuid' })
  @ApiBody({ type: StockAdjustmentDto })
  @ApiResponse({
    status: 200,
    description: 'Stock adjusted successfully with audit record created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        inventoryItemId: { type: 'string', format: 'uuid' },
        previousStock: { type: 'number' },
        adjustmentQuantity: { type: 'number' },
        newStock: { type: 'number' },
        adjustmentType: {
          type: 'string',
          enum: ['increase', 'decrease', 'correction'],
        },
        reason: { type: 'string' },
        adjustedBy: { type: 'string' },
        adjustedAt: { type: 'string', format: 'date-time' },
        batchNumber: { type: 'string', nullable: true },
        expirationDate: { type: 'string', format: 'date', nullable: true },
        cost: { type: 'number', nullable: true },
        auditId: { type: 'string', format: 'uuid' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid adjustment data or insufficient stock for decrease',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions for stock adjustments',
  })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async adjustStock(
    @Param('id') id: string,
    @Body() adjustmentDto: StockAdjustmentDto,
  ) {
    return this.stockManagementService.adjustStock(id, adjustmentDto);
  }

  @Get(':id/stock/history')
  @ApiTags('stock')
  @ApiOperation({ summary: 'Get stock history for an item' })
  @ApiParam({ name: 'id', description: 'Inventory item UUID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns stock history with pagination',
  })
  async getStockHistory(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.stockManagementService.getStockHistory(id, page, limit);
  }

  @Get('stock/low')
  @ApiTags('stock')
  @ApiOperation({ summary: 'Get items with low stock' })
  @ApiResponse({ status: 200, description: 'Returns low stock items' })
  async getLowStockItems() {
    return this.stockManagementService.getLowStockItems();
  }

  @Get('stock/out')
  @ApiTags('stock')
  @ApiOperation({ summary: 'Get items that are out of stock' })
  @ApiResponse({ status: 200, description: 'Returns out of stock items' })
  async getOutOfStockItems() {
    return this.stockManagementService.getOutOfStockItems();
  }

  // ============ Alerts Operations ============

  @Get('alerts/all')
  @ApiTags('alerts')
  @ApiOperation({
    summary: 'Get all inventory alerts',
    description:
      'Retrieves all active inventory alerts including low stock warnings, expiration notices, and reorder recommendations. Sorted by severity and priority with actionable recommendations.',
  })
  @ApiQuery({
    name: 'severity',
    required: false,
    enum: ['low', 'medium', 'high', 'critical'],
    description: 'Filter by alert severity',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['low_stock', 'out_of_stock', 'expired', 'expiring_soon'],
    description: 'Filter by alert type',
  })
  @ApiResponse({
    status: 200,
    description: 'Inventory alerts retrieved successfully sorted by severity',
    schema: {
      type: 'object',
      properties: {
        alerts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              inventoryItemId: { type: 'string', format: 'uuid' },
              itemName: { type: 'string' },
              alertType: {
                type: 'string',
                enum: ['low_stock', 'out_of_stock', 'expired', 'expiring_soon'],
              },
              severity: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'critical'],
              },
              message: { type: 'string' },
              currentStock: { type: 'number' },
              minimumStock: { type: 'number' },
              expirationDate: {
                type: 'string',
                format: 'date',
                nullable: true,
              },
              daysToExpiry: { type: 'number', nullable: true },
              recommendedAction: { type: 'string' },
              priority: { type: 'number' },
              createdAt: { type: 'string', format: 'date-time' },
              location: { type: 'string' },
              category: { type: 'string' },
            },
          },
        },
        summary: {
          type: 'object',
          properties: {
            totalAlerts: { type: 'number' },
            criticalCount: { type: 'number' },
            highCount: { type: 'number' },
            mediumCount: { type: 'number' },
            lowCount: { type: 'number' },
            actionRequired: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getInventoryAlerts() {
    return this.alertsService.getInventoryAlerts();
  }

  @Get('alerts/critical')
  @ApiTags('alerts')
  @ApiOperation({ summary: 'Get critical alerts only' })
  @ApiResponse({ status: 200, description: 'Returns critical alerts' })
  async getCriticalAlerts() {
    return this.alertsService.getCriticalAlerts();
  }

  @Get('alerts/summary')
  @ApiTags('alerts')
  @ApiOperation({ summary: 'Get alert summary with recommendations' })
  @ApiResponse({
    status: 200,
    description: 'Returns alert summary and recommendations',
  })
  async getAlertSummary() {
    return this.alertsService.generateAlertSummary();
  }

  @Get('alerts/type/:type')
  @ApiTags('alerts')
  @ApiOperation({ summary: 'Get alerts by type' })
  @ApiParam({ name: 'type', enum: AlertType })
  @ApiResponse({ status: 200, description: 'Returns alerts of specified type' })
  async getAlertsByType(@Param('type') type: AlertType) {
    return this.alertsService.getAlertsByType(type);
  }

  @Get('alerts/severity/:severity')
  @ApiTags('alerts')
  @ApiOperation({ summary: 'Get alerts by severity' })
  @ApiParam({ name: 'severity', enum: AlertSeverity })
  @ApiResponse({
    status: 200,
    description: 'Returns alerts of specified severity',
  })
  async getAlertsBySeverity(@Param('severity') severity: AlertSeverity) {
    return this.alertsService.getAlertsBySeverity(severity);
  }

  @Get(':id/alerts')
  @ApiTags('alerts')
  @ApiOperation({ summary: 'Get alerts for specific item' })
  @ApiParam({ name: 'id', description: 'Inventory item UUID' })
  @ApiResponse({ status: 200, description: 'Returns alerts for the item' })
  async getItemAlerts(@Param('id') id: string) {
    return this.alertsService.getItemAlerts(id);
  }

  // ============ Purchase Order Operations ============

  @Post('purchase-orders')
  @ApiTags('purchase-orders')
  @ApiOperation({
    summary: 'Create a new purchase order',
    description:
      'Creates a comprehensive purchase order with line items, vendor information, delivery details, and approval workflow integration. Supports automated reorder generation and budget validation.',
  })
  @ApiBody({ type: CreatePurchaseOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Purchase order created successfully with order number',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        orderNumber: { type: 'string', example: 'PO-2024-001234' },
        vendorId: { type: 'string', format: 'uuid' },
        vendorName: { type: 'string' },
        status: {
          type: 'string',
          enum: [
            'draft',
            'pending_approval',
            'approved',
            'sent',
            'received',
            'cancelled',
          ],
          example: 'draft',
        },
        totalAmount: { type: 'number' },
        taxAmount: { type: 'number' },
        shippingAmount: { type: 'number' },
        grandTotal: { type: 'number' },
        expectedDeliveryDate: { type: 'string', format: 'date' },
        createdBy: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        lineItems: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              inventoryItemId: { type: 'string', format: 'uuid' },
              itemName: { type: 'string' },
              quantity: { type: 'number' },
              unitPrice: { type: 'number' },
              totalPrice: { type: 'number' },
            },
          },
        },
        approvalRequired: { type: 'boolean' },
        budgetValidated: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid order data, validation errors, or budget exceeded',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Insufficient permissions for purchase order creation',
  })
  @ApiResponse({
    status: 404,
    description: 'Vendor or inventory items not found',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createPurchaseOrder(@Body() createDto: CreatePurchaseOrderDto) {
    return this.purchaseOrderService.createPurchaseOrder(createDto);
  }

  @Get('purchase-orders')
  @ApiTags('purchase-orders')
  @ApiOperation({ summary: 'Get all purchase orders' })
  @ApiQuery({ name: 'status', required: false, enum: PurchaseOrderStatus })
  @ApiQuery({ name: 'vendorId', required: false })
  @ApiResponse({ status: 200, description: 'Returns purchase orders' })
  async getPurchaseOrders(
    @Query('status') status?: PurchaseOrderStatus,
    @Query('vendorId') vendorId?: string,
  ) {
    return this.purchaseOrderService.getPurchaseOrders(status, vendorId);
  }

  @Get('purchase-orders/:id')
  @ApiTags('purchase-orders')
  @ApiOperation({ summary: 'Get purchase order by ID' })
  @ApiParam({ name: 'id', description: 'Purchase order UUID' })
  @ApiResponse({ status: 200, description: 'Returns purchase order' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getPurchaseOrderById(@Param('id') id: string) {
    return this.purchaseOrderService.getPurchaseOrderById(id);
  }

  @Patch('purchase-orders/:id/status')
  @ApiTags('purchase-orders')
  @ApiOperation({ summary: 'Update purchase order status' })
  @ApiParam({ name: 'id', description: 'Purchase order UUID' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  async updatePurchaseOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: PurchaseOrderStatus; receivedDate?: string },
  ) {
    const receivedDate = body.receivedDate
      ? new Date(body.receivedDate)
      : undefined;
    return this.purchaseOrderService.updatePurchaseOrderStatus(
      id,
      body.status,
      receivedDate,
    );
  }

  // ============ Reorder Automation Operations ============

  @Post('reorder/analyze')
  @ApiTags('reorder')
  @ApiOperation({
    summary: 'Analyze inventory and generate reorder recommendations',
  })
  @ApiResponse({ status: 200, description: 'Returns reorder recommendations' })
  async analyzeInventory() {
    return this.reorderAutomationService.analyzeInventory();
  }

  // ============ Transaction Operations ============

  @Post('transactions')
  @ApiTags('inventory')
  @ApiOperation({ summary: 'Create an inventory transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  async createTransaction(@Body() createDto: CreateInventoryTransactionDto) {
    return this.transactionService.createTransaction(createDto);
  }

  @Get(':id/transactions')
  @ApiTags('inventory')
  @ApiOperation({ summary: 'Get transactions for an item' })
  @ApiParam({ name: 'id', description: 'Inventory item UUID' })
  @ApiResponse({ status: 200, description: 'Returns transactions' })
  async getTransactionsByItem(@Param('id') id: string) {
    return this.transactionService.getTransactionsByItem(id);
  }
}
