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
exports.PHIAccessService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../../database");
const base_1 = require("../../../common/base");
let PHIAccessService = class PHIAccessService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super('PHIAccessService');
        this.auditLogModel = auditLogModel;
    }
    async logPHIAccess(entry) {
        try {
            await this.auditLogModel.create({
                userId: entry.userId || null,
                action: entry.action,
                entityType: entry.entityType,
                entityId: entry.entityId || null,
                changes: {
                    isPHIAccess: true,
                    studentId: entry.studentId,
                    accessType: entry.accessType,
                    dataCategory: entry.dataCategory,
                    success: entry.success !== undefined ? entry.success : true,
                    errorMessage: entry.errorMessage,
                    details: entry.changes || {},
                },
                ipAddress: entry.ipAddress || null,
                userAgent: entry.userAgent || null,
            });
            this.logInfo(`PHI Access: ${entry.accessType} ${entry.dataCategory} for student ${entry.studentId} by user ${entry.userId || 'SYSTEM'}`);
        }
        catch (error) {
            this.logError('Failed to create PHI access log:', error);
        }
    }
    async getPHIAccessLogs(filters = {}) {
        try {
            const { userId, studentId, accessType, dataCategory, startDate, endDate, page = 1, limit = 50, } = filters;
            const skip = (page - 1) * limit;
            const whereClause = {
                [sequelize_2.Op.and]: [(0, sequelize_2.literal)(`changes->>'isPHIAccess' = 'true'`)],
            };
            if (userId) {
                whereClause.userId = userId;
            }
            if (studentId) {
                whereClause[sequelize_2.Op.and].push((0, sequelize_2.literal)(`changes->>'studentId' = '${studentId}'`));
            }
            if (accessType) {
                whereClause[sequelize_2.Op.and].push((0, sequelize_2.literal)(`changes->>'accessType' = '${accessType}'`));
            }
            if (dataCategory) {
                whereClause[sequelize_2.Op.and].push((0, sequelize_2.literal)(`changes->>'dataCategory' = '${dataCategory}'`));
            }
            if (startDate) {
                whereClause.createdAt = { [sequelize_2.Op.gte]: startDate };
            }
            if (endDate) {
                whereClause.createdAt = { ...whereClause.createdAt, [sequelize_2.Op.lte]: endDate };
            }
            const { rows: data, count: total } = await this.auditLogModel.findAndCountAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit,
            });
            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.logError('Error fetching PHI access logs:', error);
            throw new Error('Failed to fetch PHI access logs');
        }
    }
    async getStudentPHIAccessLogs(studentId, page = 1, limit = 20) {
        return this.getPHIAccessLogs({
            studentId,
            page,
            limit,
        });
    }
    async getUserPHIAccessLogs(userId, page = 1, limit = 20) {
        return this.getPHIAccessLogs({
            userId,
            page,
            limit,
        });
    }
};
exports.PHIAccessService = PHIAccessService;
exports.PHIAccessService = PHIAccessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], PHIAccessService);
//# sourceMappingURL=phi-access.service.js.map