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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const inventory_alert_dto_1 = require("../dto/inventory-alert.dto");
const base_1 = require("../../../common/base");
let AlertsService = class AlertsService extends base_1.BaseService {
    sequelize;
    constructor(sequelize) {
        super('AlertsService');
        this.sequelize = sequelize;
    }
    async getInventoryAlerts() {
        try {
            const alerts = [];
            const now = new Date();
            const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            const query = `
        SELECT
          i.*,
          COALESCE(stock.total_quantity, 0)::integer as current_stock,
          stock.earliest_expiration,
          maint.next_maintenance_date
        FROM inventory_items i
        LEFT JOIN (
          SELECT
            inventory_item_id,
            SUM(quantity)::integer as total_quantity,
            MIN(expiration_date) as earliest_expiration
          FROM inventory_transactions
          WHERE expiration_date IS NOT NULL
          GROUP BY inventory_item_id
        ) stock ON i.id = stock.inventory_item_id
        LEFT JOIN (
          SELECT
            inventory_item_id,
            MIN(next_maintenance_date) as next_maintenance_date
          FROM maintenance_logs
          WHERE next_maintenance_date IS NOT NULL
          AND next_maintenance_date > NOW()
          GROUP BY inventory_item_id
        ) maint ON i.id = maint.inventory_item_id
        WHERE i.is_active = true
      `;
            const [results] = await this.sequelize.query(query, {
                type: sequelize_1.QueryTypes.SELECT,
            });
            const items = results;
            for (const item of items) {
                if (item.current_stock <= item.reorder_level) {
                    alerts.push({
                        id: `low_stock_${item.id}`,
                        type: item.current_stock === 0
                            ? inventory_alert_dto_1.AlertType.OUT_OF_STOCK
                            : inventory_alert_dto_1.AlertType.LOW_STOCK,
                        severity: item.current_stock === 0
                            ? inventory_alert_dto_1.AlertSeverity.CRITICAL
                            : inventory_alert_dto_1.AlertSeverity.HIGH,
                        message: item.current_stock === 0
                            ? `${item.name} is out of stock`
                            : `${item.name} is low in stock (${item.current_stock} remaining, reorder at ${item.reorder_level})`,
                        itemId: item.id,
                        itemName: item.name,
                    });
                }
                if (item.earliest_expiration) {
                    const expirationDate = new Date(item.earliest_expiration);
                    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
                    if (expirationDate <= now) {
                        alerts.push({
                            id: `expired_${item.id}`,
                            type: inventory_alert_dto_1.AlertType.EXPIRED,
                            severity: inventory_alert_dto_1.AlertSeverity.CRITICAL,
                            message: `${item.name} has expired items`,
                            itemId: item.id,
                            itemName: item.name,
                            daysUntilAction: daysUntilExpiration,
                        });
                    }
                    else if (expirationDate <= thirtyDaysFromNow) {
                        alerts.push({
                            id: `near_expiry_${item.id}`,
                            type: inventory_alert_dto_1.AlertType.NEAR_EXPIRY,
                            severity: daysUntilExpiration <= 7
                                ? inventory_alert_dto_1.AlertSeverity.HIGH
                                : inventory_alert_dto_1.AlertSeverity.MEDIUM,
                            message: `${item.name} expires in ${daysUntilExpiration} days`,
                            itemId: item.id,
                            itemName: item.name,
                            daysUntilAction: daysUntilExpiration,
                        });
                    }
                }
                if (item.next_maintenance_date) {
                    const maintenanceDate = new Date(item.next_maintenance_date);
                    const daysUntilMaintenance = Math.ceil((maintenanceDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
                    if (maintenanceDate <= now) {
                        alerts.push({
                            id: `maintenance_overdue_${item.id}`,
                            type: inventory_alert_dto_1.AlertType.MAINTENANCE_DUE,
                            severity: inventory_alert_dto_1.AlertSeverity.HIGH,
                            message: `${item.name} maintenance is overdue`,
                            itemId: item.id,
                            itemName: item.name,
                            daysUntilAction: daysUntilMaintenance,
                        });
                    }
                    else if (daysUntilMaintenance <= 7) {
                        alerts.push({
                            id: `maintenance_due_${item.id}`,
                            type: inventory_alert_dto_1.AlertType.MAINTENANCE_DUE,
                            severity: inventory_alert_dto_1.AlertSeverity.MEDIUM,
                            message: `${item.name} maintenance due in ${daysUntilMaintenance} days`,
                            itemId: item.id,
                            itemName: item.name,
                            daysUntilAction: daysUntilMaintenance,
                        });
                    }
                }
            }
            const severityOrder = {
                [inventory_alert_dto_1.AlertSeverity.CRITICAL]: 0,
                [inventory_alert_dto_1.AlertSeverity.HIGH]: 1,
                [inventory_alert_dto_1.AlertSeverity.MEDIUM]: 2,
                [inventory_alert_dto_1.AlertSeverity.LOW]: 3,
            };
            alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
            return alerts;
        }
        catch (error) {
            this.logError('Error getting inventory alerts:', error);
            throw error;
        }
    }
    async getCriticalAlerts() {
        try {
            const allAlerts = await this.getInventoryAlerts();
            return allAlerts.filter((alert) => alert.severity === inventory_alert_dto_1.AlertSeverity.CRITICAL);
        }
        catch (error) {
            this.logError('Error getting critical alerts:', error);
            throw error;
        }
    }
    async getAlertsByType(type) {
        try {
            const allAlerts = await this.getInventoryAlerts();
            return allAlerts.filter((alert) => alert.type === type);
        }
        catch (error) {
            this.logError('Error getting alerts by type:', error);
            throw error;
        }
    }
    async getAlertsBySeverity(severity) {
        try {
            const allAlerts = await this.getInventoryAlerts();
            return allAlerts.filter((alert) => alert.severity === severity);
        }
        catch (error) {
            this.logError('Error getting alerts by severity:', error);
            throw error;
        }
    }
    async getAlertCounts() {
        try {
            const alerts = await this.getInventoryAlerts();
            const counts = {
                total: alerts.length,
                byType: {
                    LOW_STOCK: alerts.filter((a) => a.type === inventory_alert_dto_1.AlertType.LOW_STOCK)
                        .length,
                    OUT_OF_STOCK: alerts.filter((a) => a.type === inventory_alert_dto_1.AlertType.OUT_OF_STOCK)
                        .length,
                    EXPIRED: alerts.filter((a) => a.type === inventory_alert_dto_1.AlertType.EXPIRED).length,
                    NEAR_EXPIRY: alerts.filter((a) => a.type === inventory_alert_dto_1.AlertType.NEAR_EXPIRY)
                        .length,
                    MAINTENANCE_DUE: alerts.filter((a) => a.type === inventory_alert_dto_1.AlertType.MAINTENANCE_DUE).length,
                },
                bySeverity: {
                    CRITICAL: alerts.filter((a) => a.severity === inventory_alert_dto_1.AlertSeverity.CRITICAL)
                        .length,
                    HIGH: alerts.filter((a) => a.severity === inventory_alert_dto_1.AlertSeverity.HIGH).length,
                    MEDIUM: alerts.filter((a) => a.severity === inventory_alert_dto_1.AlertSeverity.MEDIUM)
                        .length,
                    LOW: alerts.filter((a) => a.severity === inventory_alert_dto_1.AlertSeverity.LOW).length,
                },
            };
            return counts;
        }
        catch (error) {
            this.logError('Error getting alert counts:', error);
            throw error;
        }
    }
    async getItemAlerts(inventoryItemId) {
        try {
            const allAlerts = await this.getInventoryAlerts();
            return allAlerts.filter((alert) => alert.itemId === inventoryItemId);
        }
        catch (error) {
            this.logError('Error getting item alerts:', error);
            throw error;
        }
    }
    async generateAlertSummary() {
        try {
            const alerts = await this.getInventoryAlerts();
            const counts = await this.getAlertCounts();
            const summary = {
                timestamp: new Date(),
                totalAlerts: counts.total,
                criticalCount: counts.bySeverity.CRITICAL,
                highCount: counts.bySeverity.HIGH,
                mediumCount: counts.bySeverity.MEDIUM,
                lowCount: counts.bySeverity.LOW,
                typeBreakdown: counts.byType,
                topAlerts: alerts.slice(0, 10),
                recommendations: this.generateRecommendations(alerts),
            };
            return summary;
        }
        catch (error) {
            this.logError('Error generating alert summary:', error);
            throw error;
        }
    }
    generateRecommendations(alerts) {
        const recommendations = [];
        const criticalAlerts = alerts.filter((a) => a.severity === inventory_alert_dto_1.AlertSeverity.CRITICAL);
        const outOfStockAlerts = alerts.filter((a) => a.type === inventory_alert_dto_1.AlertType.OUT_OF_STOCK);
        const expiredAlerts = alerts.filter((a) => a.type === inventory_alert_dto_1.AlertType.EXPIRED);
        const lowStockAlerts = alerts.filter((a) => a.type === inventory_alert_dto_1.AlertType.LOW_STOCK);
        if (criticalAlerts.length > 0) {
            recommendations.push(`Address ${criticalAlerts.length} critical alert(s) immediately`);
        }
        if (outOfStockAlerts.length > 0) {
            recommendations.push(`Reorder ${outOfStockAlerts.length} out-of-stock item(s) urgently`);
        }
        if (expiredAlerts.length > 0) {
            recommendations.push(`Remove ${expiredAlerts.length} expired item(s) from inventory`);
        }
        if (lowStockAlerts.length > 5) {
            recommendations.push(`Review reorder levels for ${lowStockAlerts.length} low-stock items`);
        }
        if (recommendations.length === 0) {
            recommendations.push('All inventory levels are within acceptable ranges');
        }
        return recommendations;
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map