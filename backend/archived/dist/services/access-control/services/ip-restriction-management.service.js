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
exports.IpRestrictionManagementService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const audit_service_1 = require("../../../database/services/audit.service");
const create_ip_restriction_dto_1 = require("../dto/create-ip-restriction.dto");
const base_1 = require("../../../common/base");
let IpRestrictionManagementService = class IpRestrictionManagementService extends base_1.BaseService {
    sequelize;
    auditService;
    constructor(sequelize, auditService) {
        super("IpRestrictionManagementService");
        this.sequelize = sequelize;
        this.auditService = auditService;
    }
    getModel(modelName) {
        return this.sequelize.models[modelName];
    }
    async getIpRestrictions() {
        try {
            const IpRestriction = this.getModel('IpRestriction');
            const restrictions = await IpRestriction.findAll({
                where: { isActive: true },
                order: [['createdAt', 'DESC']],
            });
            this.logInfo(`Retrieved ${restrictions.length} IP restrictions`);
            return restrictions;
        }
        catch (error) {
            this.logError('Error getting IP restrictions:', error);
            throw error;
        }
    }
    async addIpRestriction(data) {
        try {
            const IpRestriction = this.getModel('IpRestriction');
            const existingRestriction = await IpRestriction.findOne({
                where: {
                    ipAddress: data.ipAddress,
                    isActive: true,
                },
            });
            if (existingRestriction) {
                throw new common_1.BadRequestException('IP restriction already exists for this address');
            }
            const restriction = await IpRestriction.create({
                ipAddress: data.ipAddress,
                type: data.type,
                reason: data.reason,
                isActive: true,
                createdBy: data.createdBy,
            });
            this.logInfo(`Added IP restriction: ${data.ipAddress} (${data.type})`);
            return restriction;
        }
        catch (error) {
            this.logError('Error adding IP restriction:', error);
            throw error;
        }
    }
    async removeIpRestriction(id) {
        try {
            const IpRestriction = this.getModel('IpRestriction');
            const restriction = await this.findEntityOrFail(IpRestriction, id, 'IP');
            await restriction.update({
                isActive: false,
            });
            this.logInfo(`Removed IP restriction: ${id}`);
            return { success: true };
        }
        catch (error) {
            this.logError(`Error removing IP restriction ${id}:`, error);
            throw error;
        }
    }
    async checkIpRestriction(ipAddress, userId) {
        try {
            const IpRestriction = this.getModel('IpRestriction');
            if (!IpRestriction) {
                this.logWarning('IpRestriction model not found, skipping IP restriction check');
                return {
                    isRestricted: false,
                    reason: undefined,
                };
            }
            const restriction = await IpRestriction.findOne({
                where: {
                    ipAddress,
                    isActive: true,
                },
            });
            const isRestricted = restriction
                ? restriction.type === create_ip_restriction_dto_1.IpRestrictionType.BLACKLIST
                : false;
            if (restriction) {
                await this.auditService.logRead('IpRestriction', restriction.id, {
                    userId: userId || null,
                    userName: userId ? 'User' : 'Anonymous',
                    userRole: userId ? 'USER' : 'ANONYMOUS',
                    ipAddress: ipAddress,
                    userAgent: null,
                    timestamp: new Date(),
                });
            }
            if (!restriction) {
                return { isRestricted: false };
            }
            return {
                isRestricted,
                type: restriction.type,
                reason: restriction.reason || undefined,
            };
        }
        catch (error) {
            this.logError('Error checking IP restriction:', error);
            return { isRestricted: false };
        }
    }
};
exports.IpRestrictionManagementService = IpRestrictionManagementService;
exports.IpRestrictionManagementService = IpRestrictionManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectConnection)()),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __metadata("design:paramtypes", [sequelize_2.Sequelize,
        audit_service_1.AuditService])
], IpRestrictionManagementService);
//# sourceMappingURL=ip-restriction-management.service.js.map