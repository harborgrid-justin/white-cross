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
exports.InventoryReorderService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const DEFAULT_LEAD_TIME_DAYS = 7;
const SAFETY_STOCK_PERCENTAGE = 0.2;
const USAGE_CALCULATION_DAYS = 30;
let InventoryReorderService = class InventoryReorderService extends base_1.BaseService {
    requestContext;
    sequelize;
    constructor(requestContext, sequelize) {
        super(requestContext);
        this.requestContext = requestContext;
        this.sequelize = sequelize;
    }
    async generateReorderSuggestions(organizationId) {
        try {
            this.logger.debug('Generating reorder suggestions');
            const inventoryItems = await this.sequelize.query(`
        SELECT
          m.id as medication_id,
          m.name as medication_name,
          COALESCE(SUM(mi.quantity), 0) as quantity,
          COALESCE(m.reorder_level, 50) as reorder_level,
          m.organization_id
        FROM medications m
        LEFT JOIN medication_inventory mi ON m.id = mi.medication_id AND mi.quantity > 0
        WHERE m.is_active = true
          ${organizationId ? 'AND m.organization_id = :organizationId' : ''}
        GROUP BY m.id, m.name, m.reorder_level, m.organization_id
        HAVING COALESCE(SUM(mi.quantity), 0) <= COALESCE(m.reorder_level, 50) * 1.5
      `, {
                replacements: organizationId ? { organizationId } : {},
                type: sequelize_2.QueryTypes.SELECT,
            });
            const suggestions = [];
            for (const item of inventoryItems) {
                const usageStats = await this.getUsageStatistics(item.medication_id);
                const reorderPoint = this.calculateReorderPoint(usageStats.averageDailyUsage, DEFAULT_LEAD_TIME_DAYS);
                const suggestedOrderQuantity = this.calculateOrderQuantity(item.quantity, reorderPoint, usageStats.averageDailyUsage);
                const estimatedDaysRemaining = usageStats.averageDailyUsage > 0 ? item.quantity / usageStats.averageDailyUsage : 999;
                let priority;
                if (item.quantity === 0) {
                    priority = 'CRITICAL';
                }
                else if (item.quantity <= item.reorder_level * 0.5) {
                    priority = 'HIGH';
                }
                else if (item.quantity <= item.reorder_level) {
                    priority = 'MEDIUM';
                }
                else {
                    priority = 'LOW';
                }
                suggestions.push({
                    medicationId: item.medication_id,
                    medicationName: item.medication_name,
                    currentQuantity: item.quantity,
                    reorderLevel: item.reorder_level,
                    reorderPoint,
                    suggestedOrderQuantity,
                    priority,
                    estimatedDaysRemaining,
                    averageDailyUsage: usageStats.averageDailyUsage,
                    leadTimeDays: DEFAULT_LEAD_TIME_DAYS,
                });
            }
            const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
            suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            this.logger.log(`Generated ${suggestions.length} reorder suggestions (${suggestions.filter((s) => s.priority === 'CRITICAL' || s.priority === 'HIGH').length} high priority)`);
            return suggestions;
        }
        catch (error) {
            this.logger.error('Failed to generate reorder suggestions', error);
            return [];
        }
    }
    calculateReorderPoint(averageDailyUsage, leadTimeDays) {
        const leadTimeDemand = averageDailyUsage * leadTimeDays;
        const safetyStock = leadTimeDemand * SAFETY_STOCK_PERCENTAGE;
        return Math.ceil(leadTimeDemand + safetyStock);
    }
    calculateOrderQuantity(currentQuantity, reorderPoint, averageDailyUsage) {
        const targetQuantity = reorderPoint + averageDailyUsage * 30;
        const orderQuantity = Math.max(0, targetQuantity - currentQuantity);
        return Math.ceil(orderQuantity / 10) * 10;
    }
    async getUsageStatistics(medicationId) {
        try {
            const usageData = await this.sequelize.query(`
        SELECT
          COUNT(*) as total_administered,
          COUNT(DISTINCT DATE(time_given)) as days_with_usage,
          MIN(time_given) as first_usage_date,
          MAX(time_given) as last_usage_date
        FROM medication_logs ml
        JOIN student_medications sm ON ml.student_medication_id = sm.id
        WHERE sm.medication_id = :medicationId
          AND ml.time_given >= NOW() - INTERVAL '${USAGE_CALCULATION_DAYS} days'
      `, {
                replacements: { medicationId },
                type: sequelize_2.QueryTypes.SELECT,
            });
            const data = usageData[0];
            const daysInPeriod = Math.min(USAGE_CALCULATION_DAYS, data.days_with_usage || 1);
            const averageDailyUsage = data.total_administered / daysInPeriod || 0;
            const usageTrend = 'STABLE';
            return {
                medicationId,
                averageDailyUsage: Math.max(averageDailyUsage, 0.1),
                usageTrend,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get usage statistics for medication ${medicationId}`, error);
            return {
                medicationId,
                averageDailyUsage: 1,
                usageTrend: 'STABLE',
            };
        }
    }
};
exports.InventoryReorderService = InventoryReorderService;
exports.InventoryReorderService = InventoryReorderService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectConnection)()),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService,
        sequelize_2.Sequelize])
], InventoryReorderService);
//# sourceMappingURL=inventory-reorder.service.js.map