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
var LicenseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const models_1 = require("../../../database/models");
const audit_service_1 = require("./audit.service");
const administration_enums_1 = require("../enums/administration.enums");
let LicenseService = LicenseService_1 = class LicenseService extends base_1.BaseService {
    requestContext;
    licenseModel;
    districtModel;
    auditService;
    constructor(requestContext, licenseModel, districtModel, auditService) {
        super({
            serviceName: 'LicenseService',
            logger: new common_1.Logger(LicenseService_1.name),
            enableAuditLogging: true,
        });
        this.requestContext = requestContext;
        this.licenseModel = licenseModel;
        this.districtModel = districtModel;
        this.auditService = auditService;
    }
    async createLicense(data) {
        try {
            if (data.districtId) {
                const district = await this.districtModel.findByPk(data.districtId);
                if (!district || !district.isActive) {
                    throw new common_1.BadRequestException('District not found or inactive');
                }
            }
            const normalizedKey = data.licenseKey.toUpperCase().trim();
            const existing = await this.licenseModel.findOne({
                where: { licenseKey: normalizedKey },
            });
            if (existing) {
                throw new common_1.BadRequestException('License key already exists');
            }
            this.validateLicenseType(data);
            const license = await this.licenseModel.create({
                ...data,
                licenseKey: normalizedKey,
                status: administration_enums_1.LicenseStatus.ACTIVE,
                issuedAt: new Date(),
                activatedAt: new Date(),
            });
            await this.auditService.createAuditLog(administration_enums_1.AuditAction.CREATE, 'License', license.id, undefined, { licenseKey: license.licenseKey, type: license.type });
            this.logger.log('License created');
            return license;
        }
        catch (error) {
            this.logger.error('Error creating license:', error);
            throw error;
        }
    }
    validateLicenseType(data) {
        if (data.type === administration_enums_1.LicenseType.TRIAL) {
            if (!data.maxUsers || data.maxUsers > 10) {
                throw new common_1.BadRequestException('Trial license cannot have more than 10 users');
            }
            if (!data.maxSchools || data.maxSchools > 2) {
                throw new common_1.BadRequestException('Trial license cannot have more than 2 schools');
            }
            if (!data.expiresAt) {
                throw new common_1.BadRequestException('Trial license must have an expiration date');
            }
        }
    }
    async getLicenses(queryDto) {
        try {
            const { page = 1, limit = 20, status } = queryDto;
            const offset = (page - 1) * limit;
            const whereClause = {};
            if (status) {
                whereClause.status = status;
            }
            const { rows: licenses, count: total } = await this.licenseModel.findAndCountAll({
                where: whereClause,
                offset,
                limit,
                include: ['district'],
                order: [['createdAt', 'DESC']],
            });
            const pagination = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };
            return { data: licenses, pagination };
        }
        catch (error) {
            this.logger.error('Error fetching licenses:', error);
            throw error;
        }
    }
    async getLicenseById(id) {
        try {
            const license = await this.licenseModel.findByPk(id, {
                include: ['district'],
            });
            if (!license) {
                throw new common_1.NotFoundException('License not found');
            }
            return license;
        }
        catch (error) {
            this.logger.error('Error fetching license:', error);
            throw error;
        }
    }
    async updateLicense(id, data) {
        try {
            const license = await this.getLicenseById(id);
            Object.assign(license, data);
            await license.save();
            await this.auditService.createAuditLog(administration_enums_1.AuditAction.UPDATE, 'License', id, undefined, data);
            this.logger.log('License updated');
            return license;
        }
        catch (error) {
            this.logger.error('Error updating license:', error);
            throw error;
        }
    }
    async deactivateLicense(id) {
        try {
            const license = await this.getLicenseById(id);
            license.status = administration_enums_1.LicenseStatus.SUSPENDED;
            license.deactivatedAt = new Date();
            await license.save();
            await this.auditService.createAuditLog(administration_enums_1.AuditAction.UPDATE, 'License', id, undefined, { status: administration_enums_1.LicenseStatus.SUSPENDED });
            this.logger.log('License deactivated');
            return license;
        }
        catch (error) {
            this.logger.error('Error deactivating license:', error);
            throw error;
        }
    }
};
exports.LicenseService = LicenseService;
exports.LicenseService = LicenseService = LicenseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.License)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.District)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object, Object, audit_service_1.AuditService])
], LicenseService);
//# sourceMappingURL=license.service.js.map