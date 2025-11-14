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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryReorderAutomationService = exports.ReorderPriority = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const models_1 = require("../../../database/models");
const stock_management_service_1 = require("./stock-management.service");
var ReorderPriority;
(function (ReorderPriority) {
    ReorderPriority["CRITICAL"] = "CRITICAL";
    ReorderPriority["HIGH"] = "HIGH";
    ReorderPriority["MEDIUM"] = "MEDIUM";
    ReorderPriority["LOW"] = "LOW";
})(ReorderPriority || (exports.ReorderPriority = ReorderPriority = {}));
let InventoryReorderAutomationService = class InventoryReorderAutomationService extends base_1.BaseService {
    requestContext;
    inventoryItemModel;
    stockManagementService;
    constructor(requestContext, inventoryItemModel, stockManagementService) {
        super(requestContext);
        this.requestContext = requestContext;
        this.inventoryItemModel = inventoryItemModel;
        this.stockManagementService = stockManagementService;
    }
    async analyzeInventory() {
        try {
            const recommendations = [];
            const items = await this.inventoryItemModel.findAll({
                where: { isActive: true },
            });
            for (const item of items) {
                const currentStock = await this.stockManagementService.getCurrentStock(item.id);
                if (currentStock <= item.reorderLevel) {
                    const priority = this.determinePriority(currentStock, item.reorderLevel);
                    const recommendedOrderQuantity = Math.max(item.reorderQuantity, item.reorderLevel * 2 - currentStock);
                    recommendations.push({
                        itemId: item.id,
                        itemName: item.name,
                        priority,
                        currentStock,
                        reorderPoint: item.reorderLevel,
                        recommendedOrderQuantity,
                        reason: this.generateReason(currentStock, item.reorderLevel),
                    });
                }
            }
            recommendations.sort((a, b) => {
                const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            this.logger.log(`Inventory analysis completed: ${recommendations.length} items need reordering`);
            return recommendations;
        }
        catch (error) {
            this.logger.error('Error analyzing inventory:', error);
            throw error;
        }
    }
    determinePriority(currentStock, reorderLevel) {
        if (currentStock === 0) {
            return ReorderPriority.CRITICAL;
        }
        else if (currentStock < reorderLevel / 2) {
            return ReorderPriority.HIGH;
        }
        else if (currentStock <= reorderLevel) {
            return ReorderPriority.MEDIUM;
        }
        else {
            return ReorderPriority.LOW;
        }
    }
    generateReason(currentStock, reorderLevel) {
        if (currentStock === 0) {
            return 'OUT OF STOCK - Immediate reorder required';
        }
        else if (currentStock < reorderLevel / 2) {
            return `Below half of reorder level (${reorderLevel})`;
        }
        else {
            return `At or below reorder point (${reorderLevel})`;
        }
    }
};
exports.InventoryReorderAutomationService = InventoryReorderAutomationService;
exports.InventoryReorderAutomationService = InventoryReorderAutomationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.InventoryItem)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object, stock_management_service_1.InventoryStockManagementService])
], InventoryReorderAutomationService);
//# sourceMappingURL=reorder-automation.service.js.map