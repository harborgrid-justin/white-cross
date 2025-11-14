"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const email_module_1 = require("../../infrastructure/email/email.module");
const shared_module_1 = require("../../common/shared.module");
const inventory_alert_service_1 = require("./services/inventory-alert.service");
const inventory_notification_service_1 = require("./services/inventory-notification.service");
const inventory_reorder_service_1 = require("./services/inventory-reorder.service");
const inventory_report_service_1 = require("./services/inventory-report.service");
const inventory_disposal_service_1 = require("./services/inventory-disposal.service");
const stock_management_service_1 = require("./services/stock-management.service");
const purchase_order_service_1 = require("./services/purchase-order.service");
const transaction_service_1 = require("./services/transaction.service");
const reorder_automation_service_1 = require("./services/reorder-automation.service");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            email_module_1.EmailModule,
            shared_module_1.SharedModule,
        ],
        providers: [
            inventory_alert_service_1.InventoryAlertService,
            inventory_notification_service_1.InventoryNotificationService,
            inventory_reorder_service_1.InventoryReorderService,
            inventory_report_service_1.InventoryReportService,
            inventory_disposal_service_1.InventoryDisposalService,
            stock_management_service_1.InventoryStockManagementService,
            purchase_order_service_1.InventoryPurchaseOrderService,
            transaction_service_1.InventoryTransactionService,
            reorder_automation_service_1.InventoryReorderAutomationService,
        ],
        exports: [
            inventory_alert_service_1.InventoryAlertService,
            inventory_notification_service_1.InventoryNotificationService,
            inventory_reorder_service_1.InventoryReorderService,
            inventory_report_service_1.InventoryReportService,
            inventory_disposal_service_1.InventoryDisposalService,
            stock_management_service_1.InventoryStockManagementService,
            purchase_order_service_1.InventoryPurchaseOrderService,
            transaction_service_1.InventoryTransactionService,
            reorder_automation_service_1.InventoryReorderAutomationService,
        ],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map