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
var DistrictService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const models_1 = require("../../../database/models");
const audit_service_1 = require("./audit.service");
const administration_enums_1 = require("../enums/administration.enums");
let DistrictService = DistrictService_1 = class DistrictService extends base_1.BaseService {
    requestContext;
    districtModel;
    schoolModel;
    licenseModel;
    auditService;
    sequelize;
    constructor(requestContext, districtModel, schoolModel, licenseModel, auditService, sequelize) {
        super({
            serviceName: 'DistrictService',
            logger: new common_1.Logger(DistrictService_1.name),
            enableAuditLogging: true,
        });
        this.requestContext = requestContext;
        this.districtModel = districtModel;
        this.schoolModel = schoolModel;
        this.licenseModel = licenseModel;
        this.auditService = auditService;
        this.sequelize = sequelize;
    }
    async createDistrict(data) {
        try {
            const normalizedCode = data.code.toUpperCase().trim();
            const existing = await this.districtModel.findOne({
                where: { code: normalizedCode },
            });
            if (existing) {
                throw new common_1.BadRequestException(`District with code '${normalizedCode}' already exists`);
            }
            const district = await this.districtModel.create({
                ...data,
                code: normalizedCode,
            });
            await this.auditService.createAuditLog(administration_enums_1.AuditAction.CREATE, 'District', district.id, undefined, { name: district.name, code: district.code });
            this.logger.log(`District created: ${district.name} (${district.code})`);
            return district;
        }
        catch (error) {
            this.logger.error('Error creating district:', error);
            throw error;
        }
    }
    async getDistricts(queryDto) {
        try {
            const { page = 1, limit = 20 } = queryDto;
            const offset = (page - 1) * limit;
            const { rows: districts, count: total } = await this.districtModel.findAndCountAll({
                offset,
                limit,
                include: ['schools'],
                order: [['name', 'ASC']],
            });
            const pagination = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };
            return { data: districts, pagination };
        }
        catch (error) {
            this.logger.error('Error fetching districts:', error);
            throw error;
        }
    }
    async getDistrictById(id) {
        try {
            const district = await this.districtModel.findByPk(id, {
                include: ['schools', 'licenses'],
            });
            if (!district) {
                throw new common_1.NotFoundException('District not found');
            }
            return district;
        }
        catch (error) {
            this.logger.error('Error fetching district:', error);
            throw error;
        }
    }
    async updateDistrict(id, data) {
        try {
            const district = await this.getDistrictById(id);
            Object.assign(district, data);
            await district.save();
            await this.auditService.createAuditLog(administration_enums_1.AuditAction.UPDATE, 'District', id, undefined, data);
            this.logger.log(`District updated: ${district.name} (${id})`);
            return district;
        }
        catch (error) {
            this.logger.error('Error updating district:', error);
            throw error;
        }
    }
    async deleteDistrict(id) {
        const transaction = await this.sequelize.transaction();
        try {
            const district = await this.districtModel.findByPk(id);
            if (!district) {
                throw new common_1.NotFoundException('District not found');
            }
            const activeSchools = await this.schoolModel.count({
                where: { districtId: id, isActive: true },
                transaction,
            });
            if (activeSchools > 0) {
                throw new common_1.BadRequestException(`Cannot delete district with ${activeSchools} active school(s)`);
            }
            const activeLicenses = await this.licenseModel.count({
                where: { districtId: id, status: administration_enums_1.LicenseStatus.ACTIVE },
                transaction,
            });
            if (activeLicenses > 0) {
                throw new common_1.BadRequestException(`Cannot delete district with ${activeLicenses} active license(s)`);
            }
            district.isActive = false;
            await district.save({ transaction });
            await this.auditService.createAuditLog(administration_enums_1.AuditAction.DELETE, 'District', id, undefined, { deactivated: true });
            await transaction.commit();
            this.logger.log(`District deactivated: ${id}`);
        }
        catch (error) {
            await transaction.rollback();
            this.logger.error('Error deleting district:', error);
            throw error;
        }
    }
};
exports.DistrictService = DistrictService;
exports.DistrictService = DistrictService = DistrictService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.District)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.School)),
    __param(3, (0, sequelize_1.InjectModel)(models_1.License)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object, Object, Object, audit_service_1.AuditService,
        sequelize_typescript_1.Sequelize])
], DistrictService);
//# sourceMappingURL=district.service.js.map