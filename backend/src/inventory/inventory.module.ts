/**
 * Inventory Module
 *
 * NestJS module for inventory management functionality
 * Provides services for inventory alerts, notifications, reordering, reporting, and disposal
 */
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../infrastructure/email/email.module';
import { SharedModule } from '../shared/shared.module';
import { InventoryAlertService } from './services/inventory-alert.service';
import { InventoryNotificationService } from './services/inventory-notification.service';
import { InventoryReorderService } from './services/inventory-reorder.service';
import { InventoryReportService } from './services/inventory-report.service';
import { InventoryDisposalService } from './services/inventory-disposal.service';
import { InventoryStockManagementService } from './services/stock-management.service';
import { InventoryPurchaseOrderService } from './services/purchase-order.service';
import { InventoryTransactionService } from './services/transaction.service';
import { InventoryReorderAutomationService } from './services/reorder-automation.service';

@Module({
  imports: [
    DatabaseModule,
    EmailModule,
    SharedModule,
  ],
  providers: [
    InventoryAlertService,
    InventoryNotificationService,
    InventoryReorderService,
    InventoryReportService,
    InventoryDisposalService,
    InventoryStockManagementService,
    InventoryPurchaseOrderService,
    InventoryTransactionService,
    InventoryReorderAutomationService,
  ],
  exports: [
    InventoryAlertService,
    InventoryNotificationService,
    InventoryReorderService,
    InventoryReportService,
    InventoryDisposalService,
    InventoryStockManagementService,
    InventoryPurchaseOrderService,
    InventoryTransactionService,
    InventoryReorderAutomationService,
  ],
})
export class InventoryModule {}
