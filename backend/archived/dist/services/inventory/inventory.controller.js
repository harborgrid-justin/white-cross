"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("./inventory.service");
const stock_management_service_1 = require("./services/stock-management.service");
const alerts_service_1 = require("./services/alerts.service");
const purchase_order_service_1 = require("@/services/purchase-order.service");
const reorder_automation_service_1 = require("@/services/reorder-automation.service");
const transaction_service_1 = require("@/services/transaction.service");
const create_inventory_item_dto_1 = require("./dto/create-inventory-item.dto");
const update_inventory_item_dto_1 = require("./dto/update-inventory-item.dto");
const stock_adjustment_dto_1 = require("./dto/stock-adjustment.dto");
const create_purchase_order_dto_1 = require("./dto/create-purchase-order.dto");
const create_inventory_transaction_dto_1 = require("./dto/create-inventory-transaction.dto");
const models_1 = require("../../database/models");
const inventory_alert_dto_1 = require("./dto/inventory-alert.dto");
const base_1 = require("../../common/base");
let InventoryController = class InventoryController extends base_1.BaseController {
    inventoryService;
    stockManagementService;
    alertsService;
    purchaseOrderService;
    reorderAutomationService;
    transactionService;
    constructor(inventoryService, stockManagementService, alertsService, purchaseOrderService, reorderAutomationService, transactionService) {
        super();
        this.inventoryService = inventoryService;
        this.stockManagementService = stockManagementService;
        this.alertsService = alertsService;
        this.purchaseOrderService = purchaseOrderService;
        this.reorderAutomationService = reorderAutomationService;
        this.transactionService = transactionService;
    }
    async createInventoryItem(createDto) {
        return this.inventoryService.createInventoryItem(createDto);
    }
    async getAllInventoryItems(category, supplier, location, isActive) {
        return this.inventoryService.getAllInventoryItems({
            category,
            supplier,
            location,
            isActive,
        });
    }
    async searchInventoryItems(query, limit) {
        return this.inventoryService.searchInventoryItems(query, limit);
    }
    async getInventoryItemsCount(isActive) {
        return this.inventoryService.getInventoryItemsCount(isActive);
    }
    async getInventoryItem(id) {
        return this.inventoryService.getInventoryItem(id);
    }
    async updateInventoryItem(id, updateDto) {
        return this.inventoryService.updateInventoryItem(id, updateDto);
    }
    async deleteInventoryItem(id) {
        return this.inventoryService.deleteInventoryItem(id);
    }
    async getCurrentStock(id) {
        const stock = await this.stockManagementService.getCurrentStock(id);
        return { inventoryItemId: id, currentStock: stock };
    }
    async adjustStock(id, adjustmentDto) {
        return this.stockManagementService.adjustStock(id, adjustmentDto);
    }
    async getStockHistory(id, page, limit) {
        return this.stockManagementService.getStockHistory(id, page, limit);
    }
    async getLowStockItems() {
        return this.stockManagementService.getLowStockItems();
    }
    async getOutOfStockItems() {
        return this.stockManagementService.getOutOfStockItems();
    }
    async getInventoryAlerts() {
        return this.alertsService.getInventoryAlerts();
    }
    async getCriticalAlerts() {
        return this.alertsService.getCriticalAlerts();
    }
    async getAlertSummary() {
        return this.alertsService.generateAlertSummary();
    }
    async getAlertsByType(type) {
        return this.alertsService.getAlertsByType(type);
    }
    async getAlertsBySeverity(severity) {
        return this.alertsService.getAlertsBySeverity(severity);
    }
    async getItemAlerts(id) {
        return this.alertsService.getItemAlerts(id);
    }
    async createPurchaseOrder(createDto) {
        return this.purchaseOrderService.createPurchaseOrder(createDto);
    }
    async getPurchaseOrders(status, vendorId) {
        return this.purchaseOrderService.getPurchaseOrders(status, vendorId);
    }
    async getPurchaseOrderById(id) {
        return this.purchaseOrderService.getPurchaseOrderById(id);
    }
    async updatePurchaseOrderStatus(id, body) {
        const receivedDate = body.receivedDate
            ? new Date(body.receivedDate)
            : undefined;
        return this.purchaseOrderService.updatePurchaseOrderStatus(id, body.status, receivedDate);
    }
    async analyzeInventory() {
        return this.reorderAutomationService.analyzeInventory();
    }
    async createTransaction(createDto) {
        return this.transactionService.createTransaction(createDto);
    }
    async getTransactionsByItem(id) {
        return this.transactionService.getTransactionsByItem(id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new inventory item',
        description: 'Creates a new inventory item with complete specifications including supplier information, stock levels, reorder points, and categorization. Supports medical supplies, medications, and general healthcare inventory.',
    }),
    (0, swagger_1.ApiBody)({ type: create_inventory_item_dto_1.CreateInventoryItemDto }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or validation errors',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions for inventory management',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Item with this name already exists',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: require("../../database/models/inventory-item.model").InventoryItem }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_item_dto_1.CreateInventoryItemDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createInventoryItem", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all inventory items',
        description: 'Retrieves paginated inventory items with comprehensive filtering by category, supplier, location, stock levels, and expiration dates. Includes stock status indicators and reorder recommendations.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: 'number',
        example: 1,
        description: 'Page number for pagination',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: 'number',
        example: 20,
        description: 'Items per page',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        description: 'Filter by item category (medications, supplies, equipment)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'supplier',
        required: false,
        description: 'Filter by supplier name',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'location',
        required: false,
        description: 'Filter by storage location',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        type: 'boolean',
        description: 'Filter by active status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'lowStock',
        required: false,
        type: 'boolean',
        description: 'Show only low stock items',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'expired',
        required: false,
        type: 'boolean',
        description: 'Show only expired items',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/inventory-item.model").InventoryItem] }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('supplier')),
    __param(2, (0, common_1.Query)('location')),
    __param(3, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAllInventoryItems", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search inventory items' }),
    (0, swagger_1.ApiQuery)({ name: 'q', description: 'Search query' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns matching inventory items' }),
    openapi.ApiResponse({ status: 200, type: [require("../../database/models/inventory-item.model").InventoryItem] }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "searchInventoryItems", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get inventory items count' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns item count' }),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryItemsCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get single inventory item by ID',
        description: 'Retrieves detailed information for a specific inventory item including full specifications, stock history, transaction logs, and usage analytics.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item UUID', format: 'uuid' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Inventory item retrieved successfully with detailed information',
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inventory item not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/inventory-item.model").InventoryItem }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryItem", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update inventory item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/inventory-item.model").InventoryItem }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_item_dto_1.UpdateInventoryItemDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updateInventoryItem", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete inventory item (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found' }),
    openapi.ApiResponse({ status: 200, type: require("../../database/models/inventory-item.model").InventoryItem }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "deleteInventoryItem", null);
__decorate([
    (0, common_1.Get)(':id/stock'),
    (0, swagger_1.ApiTags)('stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current stock level for an item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns current stock quantity' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getCurrentStock", null);
__decorate([
    (0, common_1.Post)(':id/stock/adjust'),
    (0, swagger_1.ApiTags)('stock'),
    (0, swagger_1.ApiOperation)({
        summary: 'Adjust stock level with audit trail',
        description: 'Adjusts inventory stock levels with comprehensive audit logging. Supports positive and negative adjustments with mandatory reason codes. Tracks user, timestamp, and maintains complete audit trail for regulatory compliance.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item UUID', format: 'uuid' }),
    (0, swagger_1.ApiBody)({ type: stock_adjustment_dto_1.StockAdjustmentDto }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid adjustment data or insufficient stock for decrease',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions for stock adjustments',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Inventory item not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stock_adjustment_dto_1.StockAdjustmentDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Get)(':id/stock/history'),
    (0, swagger_1.ApiTags)('stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock history for an item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item UUID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns stock history with pagination',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getStockHistory", null);
__decorate([
    (0, common_1.Get)('stock/low'),
    (0, swagger_1.ApiTags)('stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get items with low stock' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns low stock items' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLowStockItems", null);
__decorate([
    (0, common_1.Get)('stock/out'),
    (0, swagger_1.ApiTags)('stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get items that are out of stock' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns out of stock items' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getOutOfStockItems", null);
__decorate([
    (0, common_1.Get)('alerts/all'),
    (0, swagger_1.ApiTags)('alerts'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all inventory alerts',
        description: 'Retrieves all active inventory alerts including low stock warnings, expiration notices, and reorder recommendations. Sorted by severity and priority with actionable recommendations.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'severity',
        required: false,
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'Filter by alert severity',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        enum: ['low_stock', 'out_of_stock', 'expired', 'expiring_soon'],
        description: 'Filter by alert type',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/inventory-alert.dto").InventoryAlertDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryAlerts", null);
__decorate([
    (0, common_1.Get)('alerts/critical'),
    (0, swagger_1.ApiTags)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get critical alerts only' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns critical alerts' }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/inventory-alert.dto").InventoryAlertDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getCriticalAlerts", null);
__decorate([
    (0, common_1.Get)('alerts/summary'),
    (0, swagger_1.ApiTags)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alert summary with recommendations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns alert summary and recommendations',
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/inventory-alert.dto").AlertSummaryDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAlertSummary", null);
__decorate([
    (0, common_1.Get)('alerts/type/:type'),
    (0, swagger_1.ApiTags)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alerts by type' }),
    (0, swagger_1.ApiParam)({ name: 'type', enum: inventory_alert_dto_1.AlertType }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns alerts of specified type' }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/inventory-alert.dto").InventoryAlertDto] }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAlertsByType", null);
__decorate([
    (0, common_1.Get)('alerts/severity/:severity'),
    (0, swagger_1.ApiTags)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alerts by severity' }),
    (0, swagger_1.ApiParam)({ name: 'severity', enum: inventory_alert_dto_1.AlertSeverity }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns alerts of specified severity',
    }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/inventory-alert.dto").InventoryAlertDto] }),
    __param(0, (0, common_1.Param)('severity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAlertsBySeverity", null);
__decorate([
    (0, common_1.Get)(':id/alerts'),
    (0, swagger_1.ApiTags)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get alerts for specific item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns alerts for the item' }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/inventory-alert.dto").InventoryAlertDto] }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getItemAlerts", null);
__decorate([
    (0, common_1.Post)('purchase-orders'),
    (0, swagger_1.ApiTags)('purchase-orders'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new purchase order',
        description: 'Creates a comprehensive purchase order with line items, vendor information, delivery details, and approval workflow integration. Supports automated reorder generation and budget validation.',
    }),
    (0, swagger_1.ApiBody)({ type: create_purchase_order_dto_1.CreatePurchaseOrderDto }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid order data, validation errors, or budget exceeded',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Authentication required',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions for purchase order creation',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Vendor or inventory items not found',
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_order_dto_1.CreatePurchaseOrderDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createPurchaseOrder", null);
__decorate([
    (0, common_1.Get)('purchase-orders'),
    (0, swagger_1.ApiTags)('purchase-orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all purchase orders' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: models_1.PurchaseOrderStatus }),
    (0, swagger_1.ApiQuery)({ name: 'vendorId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns purchase orders' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('vendorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('purchase-orders/:id'),
    (0, swagger_1.ApiTags)('purchase-orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchase order by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Purchase order UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns purchase order' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getPurchaseOrderById", null);
__decorate([
    (0, common_1.Patch)('purchase-orders/:id/status'),
    (0, swagger_1.ApiTags)('purchase-orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Update purchase order status' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Purchase order UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "updatePurchaseOrderStatus", null);
__decorate([
    (0, common_1.Post)('reorder/analyze'),
    (0, swagger_1.ApiTags)('reorder'),
    (0, swagger_1.ApiOperation)({
        summary: 'Analyze inventory and generate reorder recommendations',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns reorder recommendations' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "analyzeInventory", null);
__decorate([
    (0, common_1.Post)('transactions'),
    (0, swagger_1.ApiTags)('inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Create an inventory transaction' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transaction created successfully' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_transaction_dto_1.CreateInventoryTransactionDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Get)(':id/transactions'),
    (0, swagger_1.ApiTags)('inventory'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transactions for an item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Inventory item UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns transactions' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getTransactionsByItem", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('inventory'),
    (0, common_1.Controller)('inventory'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService, typeof (_a = typeof stock_management_service_1.StockManagementService !== "undefined" && stock_management_service_1.StockManagementService) === "function" ? _a : Object, alerts_service_1.AlertsService, typeof (_b = typeof purchase_order_service_1.PurchaseOrderService !== "undefined" && purchase_order_service_1.PurchaseOrderService) === "function" ? _b : Object, typeof (_c = typeof reorder_automation_service_1.ReorderAutomationService !== "undefined" && reorder_automation_service_1.ReorderAutomationService) === "function" ? _c : Object, typeof (_d = typeof transaction_service_1.TransactionService !== "undefined" && transaction_service_1.TransactionService) === "function" ? _d : Object])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map