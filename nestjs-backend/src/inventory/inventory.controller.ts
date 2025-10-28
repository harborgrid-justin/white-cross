import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { StockManagementService } from './services/stock-management.service';
import { AlertsService } from './services/alerts.service';
import { PurchaseOrderService } from './services/purchase-order.service';
import { ReorderAutomationService } from './services/reorder-automation.service';
import { TransactionService } from './services/transaction.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { StockAdjustmentDto } from './dto/stock-adjustment.dto';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { CreateInventoryTransactionDto } from './dto/create-inventory-transaction.dto';
import { PurchaseOrderStatus } from './entities/purchase-order.entity';
import { AlertType, AlertSeverity } from './dto/inventory-alert.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
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
  @ApiOperation({ summary: 'Create a new inventory item' })
  @ApiResponse({ status: 201, description: 'Inventory item created successfully' })
  @ApiResponse({ status: 409, description: 'Item with this name already exists' })
  async createInventoryItem(@Body() createDto: CreateInventoryItemDto) {
    return this.inventoryService.createInventoryItem(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inventory items' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'supplier', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns all inventory items' })
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
  async searchInventoryItems(@Query('q') query: string, @Query('limit') limit?: number) {
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
  @ApiOperation({ summary: 'Get single inventory item by ID' })
  @ApiParam({ name: 'id', description: 'Inventory item UUID' })
  @ApiResponse({ status: 200, description: 'Returns inventory item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async getInventoryItem(@Param('id') id: string) {
    return this.inventoryService.getInventoryItem(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item UUID' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async updateInventoryItem(@Param('id') id: string, @Body() updateDto: UpdateInventoryItemDto) {
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
  @ApiOperation({ summary: 'Adjust stock level with audit trail' })
  @ApiParam({ name: 'id', description: 'Inventory item UUID' })
  @ApiResponse({ status: 200, description: 'Stock adjusted successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async adjustStock(@Param('id') id: string, @Body() adjustmentDto: StockAdjustmentDto) {
    return this.stockManagementService.adjustStock(id, adjustmentDto);
  }

  @Get(':id/stock/history')
  @ApiTags('stock')
  @ApiOperation({ summary: 'Get stock history for an item' })
  @ApiParam({ name: 'id', description: 'Inventory item UUID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns stock history with pagination' })
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
  @ApiOperation({ summary: 'Get all inventory alerts' })
  @ApiResponse({ status: 200, description: 'Returns all alerts sorted by severity' })
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
  @ApiResponse({ status: 200, description: 'Returns alert summary and recommendations' })
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
  @ApiResponse({ status: 200, description: 'Returns alerts of specified severity' })
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
  @ApiOperation({ summary: 'Create a new purchase order' })
  @ApiResponse({ status: 201, description: 'Purchase order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
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
    const receivedDate = body.receivedDate ? new Date(body.receivedDate) : undefined;
    return this.purchaseOrderService.updatePurchaseOrderStatus(id, body.status, receivedDate);
  }

  // ============ Reorder Automation Operations ============

  @Post('reorder/analyze')
  @ApiTags('reorder')
  @ApiOperation({ summary: 'Analyze inventory and generate reorder recommendations' })
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
