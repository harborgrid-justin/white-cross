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
var InventoryMaintenanceProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryMaintenanceProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("bullmq");
const job_type_enum_1 = require("../enums/job-type.enum");
const cache_service_1 = require("../../cache/cache.service");
const inventory_alert_service_1 = require("../../../services/inventory/services/inventory-alert.service");
const inventory_notification_service_1 = require("../../../services/inventory/services/inventory-notification.service");
const inventory_reorder_service_1 = require("../../../services/inventory/services/inventory-reorder.service");
const inventory_report_service_1 = require("../../../services/inventory/services/inventory-report.service");
const inventory_disposal_service_1 = require("../../../services/inventory/services/inventory-disposal.service");
const CACHE_TAG_INVENTORY = 'inventory';
let InventoryMaintenanceProcessor = InventoryMaintenanceProcessor_1 = class InventoryMaintenanceProcessor {
    configService;
    cacheService;
    alertService;
    notificationService;
    reorderService;
    reportService;
    disposalService;
    logger = new common_1.Logger(InventoryMaintenanceProcessor_1.name);
    constructor(configService, cacheService, alertService, notificationService, reorderService, reportService, disposalService) {
        this.configService = configService;
        this.cacheService = cacheService;
        this.alertService = alertService;
        this.notificationService = notificationService;
        this.reorderService = reorderService;
        this.reportService = reportService;
        this.disposalService = disposalService;
    }
    async processInventoryMaintenance(job) {
        const { organizationId, forceRefresh } = job.data;
        try {
            this.logger.log('Starting inventory maintenance job', {
                jobId: job.id,
                organizationId,
                forceRefresh,
            });
            const startTime = Date.now();
            await this.alertService.refreshMaterializedView();
            const alerts = await this.alertService.identifyCriticalAlerts(organizationId);
            const reorderSuggestions = await this.reorderService.generateReorderSuggestions(organizationId);
            if (alerts.length > 0) {
                await this.notificationService.sendAlertNotifications(alerts, reorderSuggestions);
            }
            if (this.configService.get('INVENTORY_DAILY_REPORT', false)) {
                await this.reportService.generateAndSendInventoryReport(organizationId);
            }
            const expiredCount = await this.disposalService.markExpiredForDisposal();
            if (expiredCount > 0) {
                this.logger.log(`Marked ${expiredCount} expired items for disposal`);
            }
            this.cacheService.invalidateByTag(CACHE_TAG_INVENTORY);
            this.logger.debug('Inventory cache invalidated');
            const duration = Date.now() - startTime;
            this.logger.log(`Inventory maintenance completed: ${alerts.length} alerts, ${reorderSuggestions.length} reorder suggestions, ${expiredCount} disposals in ${duration}ms`);
            return {
                alertsIdentified: alerts.length,
                reorderSuggestionsCount: reorderSuggestions.length,
                expiredItemsMarkedForDisposal: expiredCount,
                duration,
                alerts,
                reorderSuggestions,
            };
        }
        catch (error) {
            this.logger.error('Inventory maintenance job failed', error);
            throw error;
        }
    }
};
exports.InventoryMaintenanceProcessor = InventoryMaintenanceProcessor;
__decorate([
    (0, bull_1.Process)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], InventoryMaintenanceProcessor.prototype, "processInventoryMaintenance", null);
exports.InventoryMaintenanceProcessor = InventoryMaintenanceProcessor = InventoryMaintenanceProcessor_1 = __decorate([
    (0, bull_1.Processor)(job_type_enum_1.JobType.INVENTORY_MAINTENANCE),
    __metadata("design:paramtypes", [config_1.ConfigService,
        cache_service_1.CacheService,
        inventory_alert_service_1.InventoryAlertService,
        inventory_notification_service_1.InventoryNotificationService,
        inventory_reorder_service_1.InventoryReorderService,
        inventory_report_service_1.InventoryReportService,
        inventory_disposal_service_1.InventoryDisposalService])
], InventoryMaintenanceProcessor);
//# sourceMappingURL=inventory-maintenance.processor.js.map