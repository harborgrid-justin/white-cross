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
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const models_1 = require("../../../database/models");
let AuditService = AuditService_1 = class AuditService extends base_1.BaseService {
    requestContext;
    auditLogModel;
    constructor(requestContext, auditLogModel) {
        super({
            serviceName: 'AuditService',
            logger: new common_1.Logger(AuditService_1.name),
            enableAuditLogging: true,
        });
        this.requestContext = requestContext;
        this.auditLogModel = auditLogModel;
    }
    async createAuditLog(action, entityType, entityId, userId, changes, ipAddress, userAgent) {
        try {
            const audit = await this.auditLogModel.create({
                action,
                entityType,
                entityId,
                userId,
                changes,
                ipAddress,
                userAgent,
            });
            this.logger.log(`Audit log created: ${action} on ${entityType} ${entityId || ''}`);
            return audit;
        }
        catch (error) {
            this.logger.error('Error creating audit log:', error);
            throw error;
        }
    }
    async getAuditLogs(queryDto) {
        try {
            const { page = 1, limit = 50, ...filters } = queryDto;
            const offset = (page - 1) * limit;
            const whereClause = {};
            if (filters.userId) {
                whereClause.userId = filters.userId;
            }
            if (filters.entityType) {
                whereClause.entityType = filters.entityType;
            }
            if (filters.entityId) {
                whereClause.entityId = filters.entityId;
            }
            if (filters.action) {
                whereClause.action = filters.action;
            }
            if (filters.startDate || filters.endDate) {
                whereClause.createdAt = {
                    [sequelize_2.Op.between]: [
                        filters.startDate || new Date(0),
                        filters.endDate || new Date(),
                    ],
                };
            }
            const { rows: logs, count: total } = await this.auditLogModel.findAndCountAll({
                where: whereClause,
                offset,
                limit,
                order: [['createdAt', 'DESC']],
            });
            const pagination = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };
            return {
                data: logs,
                pagination,
            };
        }
        catch (error) {
            this.logger.error('Error fetching audit logs:', error);
            throw new Error('Failed to fetch audit logs');
        }
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.AuditLog)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object])
], AuditService);
//# sourceMappingURL=audit.service.js.map