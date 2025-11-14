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
exports.InventoryDisposalService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const inventory_notification_service_1 = require("./inventory-notification.service");
let InventoryDisposalService = class InventoryDisposalService extends base_1.BaseService {
    requestContext;
    sequelize;
    notificationService;
    constructor(requestContext, sequelize, notificationService) {
        super(requestContext);
        this.requestContext = requestContext;
        this.sequelize = sequelize;
        this.notificationService = notificationService;
    }
    async markExpiredForDisposal() {
        const expiredItems = await this.sequelize.query(`
      SELECT id, medication_id, medication_name, batch_number, quantity, expiration_date
      FROM medication_inventory_alerts
      WHERE expiry_status = 'EXPIRED'
    `, {
            type: sequelize_2.QueryTypes.SELECT,
        });
        this.logger.log(`Found ${expiredItems.length} expired inventory items to mark for disposal`);
        if (expiredItems.length === 0) {
            return 0;
        }
        const disposalRecords = [];
        for (const item of expiredItems) {
            try {
                const disposalRecord = {
                    medicationId: item.medication_id,
                    medicationName: item.medication_name,
                    batchNumber: item.batch_number,
                    quantity: item.quantity,
                    reason: 'EXPIRED',
                    status: 'PENDING_DISPOSAL',
                    markedAt: new Date(),
                };
                disposalRecords.push(disposalRecord);
                this.logger.log(`Marked for disposal: ${item.medication_name} (Batch: ${item.batch_number}), Qty: ${item.quantity}`, {
                    medicationId: item.medication_id,
                    batchNumber: item.batch_number,
                    quantity: item.quantity,
                    expirationDate: item.expiration_date,
                    disposalStatus: 'PENDING_DISPOSAL',
                });
            }
            catch (error) {
                this.logger.error(`Failed to mark item for disposal: ${item.medication_name}`, {
                    error: error instanceof Error ? error.message : String(error),
                    medicationId: item.medication_id,
                    batchNumber: item.batch_number,
                });
            }
        }
        this.logger.log(`Disposal workflow initiated for ${disposalRecords.length} expired items`, {
            totalQuantity: disposalRecords.reduce((sum, r) => sum + r.quantity, 0),
            medications: disposalRecords.map((r) => r.medicationName).join(', '),
        });
        await this.notificationService.sendDisposalNotification(disposalRecords);
        return disposalRecords.length;
    }
};
exports.InventoryDisposalService = InventoryDisposalService;
exports.InventoryDisposalService = InventoryDisposalService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        sequelize_2.Sequelize,
        inventory_notification_service_1.InventoryNotificationService])
], InventoryDisposalService);
//# sourceMappingURL=inventory-disposal.service.js.map