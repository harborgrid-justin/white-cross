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
exports.InventoryAlertService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
let InventoryAlertService = class InventoryAlertService extends base_1.BaseService {
    requestContext;
    sequelize;
    constructor(requestContext, sequelize) {
        super(requestContext);
        this.requestContext = requestContext;
        this.sequelize = sequelize;
    }
    async identifyCriticalAlerts(organizationId) {
        const alerts = [];
        try {
            const whereClause = organizationId ? `AND organization_id = '${organizationId}'` : '';
            const criticalItems = await this.sequelize.query(`
        SELECT *
        FROM medication_inventory_alerts
        WHERE (expiry_status = 'EXPIRED'
           OR (expiry_status = 'NEAR_EXPIRY' AND days_until_expiry <= 7)
           OR stock_status = 'LOW_STOCK'
           OR quantity = 0)
           ${whereClause}
        ORDER BY
          CASE expiry_status WHEN 'EXPIRED' THEN 1 WHEN 'NEAR_EXPIRY' THEN 2 ELSE 3 END,
          CASE stock_status WHEN 'LOW_STOCK' THEN 1 WHEN 'WARNING' THEN 2 ELSE 3 END
      `, {
                type: sequelize_2.QueryTypes.SELECT,
            });
            for (const item of criticalItems) {
                if (item.expiry_status === 'EXPIRED') {
                    alerts.push({
                        type: 'EXPIRED',
                        medicationId: item.medication_id,
                        medicationName: item.medication_name,
                        batchNumber: item.batch_number,
                        quantity: item.quantity,
                        expirationDate: item.expiration_date,
                        severity: 'CRITICAL',
                    });
                }
                if (item.expiry_status === 'NEAR_EXPIRY' && item.days_until_expiry <= 7) {
                    alerts.push({
                        type: 'NEAR_EXPIRY',
                        medicationId: item.medication_id,
                        medicationName: item.medication_name,
                        batchNumber: item.batch_number,
                        quantity: item.quantity,
                        expirationDate: item.expiration_date,
                        severity: 'HIGH',
                    });
                }
                if (item.quantity === 0) {
                    alerts.push({
                        type: 'OUT_OF_STOCK',
                        medicationId: item.medication_id,
                        medicationName: item.medication_name,
                        batchNumber: item.batch_number,
                        quantity: 0,
                        reorderLevel: item.reorder_level,
                        severity: 'CRITICAL',
                    });
                }
                else if (item.stock_status === 'LOW_STOCK') {
                    alerts.push({
                        type: 'LOW_STOCK',
                        medicationId: item.medication_id,
                        medicationName: item.medication_name,
                        batchNumber: item.batch_number,
                        quantity: item.quantity,
                        reorderLevel: item.reorder_level,
                        severity: item.quantity <= item.reorder_level * 0.5 ? 'HIGH' : 'MEDIUM',
                    });
                }
            }
            this.logger.debug(`Identified ${alerts.length} critical inventory alerts`);
        }
        catch (error) {
            this.logger.error('Failed to identify critical alerts', error);
        }
        return alerts;
    }
    async getInventoryStatus() {
        const status = await this.sequelize.query(`
      SELECT
        COUNT(*) as total_items,
        SUM(CASE WHEN expiry_status = 'EXPIRED' THEN 1 ELSE 0 END) as expired_items,
        SUM(CASE WHEN expiry_status = 'NEAR_EXPIRY' THEN 1 ELSE 0 END) as near_expiry_items,
        SUM(CASE WHEN stock_status = 'LOW_STOCK' THEN 1 ELSE 0 END) as low_stock_items,
        SUM(CASE WHEN expiry_status = 'OK' AND stock_status = 'OK' THEN 1 ELSE 0 END) as ok_items
      FROM medication_inventory_alerts
    `, {
            type: sequelize_2.QueryTypes.SELECT,
        });
        return status[0];
    }
    async getExpiringItems(organizationId) {
        const expiringItems = await this.sequelize.query(`
      SELECT
        medication_name,
        batch_number,
        quantity,
        expiration_date,
        days_until_expiry
      FROM medication_inventory_alerts
      WHERE expiry_status IN ('NEAR_EXPIRY', 'EXPIRED')
        ${organizationId ? 'AND organization_id = :organizationId' : ''}
      ORDER BY days_until_expiry ASC
    `, {
            replacements: organizationId ? { organizationId } : {},
            type: sequelize_2.QueryTypes.SELECT,
        });
        return expiringItems.map((item) => ({
            medicationName: item.medication_name,
            batchNumber: item.batch_number,
            quantity: item.quantity,
            expirationDate: item.expiration_date,
            daysUntilExpiry: item.days_until_expiry,
        }));
    }
    async refreshMaterializedView() {
        try {
            await this.sequelize.query('REFRESH MATERIALIZED VIEW CONCURRENTLY medication_inventory_alerts', {
                type: sequelize_2.QueryTypes.RAW,
            });
            this.logger.debug('Inventory alerts materialized view refreshed');
        }
        catch (error) {
            this.logger.error('Failed to refresh materialized view', error);
            throw error;
        }
    }
};
exports.InventoryAlertService = InventoryAlertService;
exports.InventoryAlertService = InventoryAlertService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        sequelize_2.Sequelize])
], InventoryAlertService);
//# sourceMappingURL=inventory-alert.service.js.map