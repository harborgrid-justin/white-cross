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
var SchoolService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const models_1 = require("../../../database/models");
const audit_service_1 = require("./audit.service");
const administration_enums_1 = require("../enums/administration.enums");
const query_cache_service_1 = require("../../../database/services/query-cache.service");
let SchoolService = SchoolService_1 = class SchoolService extends base_1.BaseService {
    requestContext;
    schoolModel;
    districtModel;
    auditService;
    queryCacheService;
    constructor(requestContext, schoolModel, districtModel, auditService, queryCacheService) {
        super({
            serviceName: 'SchoolService',
            logger: new common_1.Logger(SchoolService_1.name),
            enableAuditLogging: true,
        });
        this.requestContext = requestContext;
        this.schoolModel = schoolModel;
        this.districtModel = districtModel;
        this.auditService = auditService;
        this.queryCacheService = queryCacheService;
    }
    async createSchool(data) {
        try {
            const district = await this.districtModel.findByPk(data.districtId);
            if (!district) {
                throw new common_1.NotFoundException('District not found');
            }
            if (!district.isActive) {
                throw new common_1.BadRequestException('Cannot create school under an inactive district');
            }
            const normalizedCode = data.code.toUpperCase().trim();
            const existing = await this.schoolModel.findOne({
                where: { code: normalizedCode },
            });
            if (existing) {
                throw new common_1.BadRequestException(`School with code '${normalizedCode}' already exists`);
            }
            const school = await this.schoolModel.create({
                ...data,
                code: normalizedCode,
            });
            await this.auditService.createAuditLog(administration_enums_1.AuditAction.CREATE, 'School', school.id, undefined, { name: school.name, code: school.code, districtId: school.districtId });
            this.logger.log(`School created: ${school.name} (${school.code})`);
            return school;
        }
        catch (error) {
            this.logger.error('Error creating school:', error);
            throw error;
        }
    }
    async getSchools(queryDto) {
        try {
            const { page = 1, limit = 20, districtId } = queryDto;
            const offset = (page - 1) * limit;
            const whereClause = {};
            if (districtId) {
                whereClause.districtId = districtId;
            }
            if (districtId && page === 1 && limit === 20) {
                const schools = await this.queryCacheService.findWithCache(this.schoolModel, {
                    where: whereClause,
                    include: ['district'],
                    order: [['name', 'ASC']],
                }, {
                    ttl: 900,
                    keyPrefix: 'school_district',
                    invalidateOn: ['create', 'update', 'destroy'],
                });
                const pagination = {
                    page,
                    limit,
                    total: schools.length,
                    totalPages: Math.ceil(schools.length / limit),
                };
                return { data: schools.slice(0, limit), pagination };
            }
            const { rows: schools, count: total } = await this.schoolModel.findAndCountAll({
                where: whereClause,
                offset,
                limit,
                include: ['district'],
                order: [['name', 'ASC']],
            });
            const pagination = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };
            return { data: schools, pagination };
        }
        catch (error) {
            this.logger.error('Error fetching schools:', error);
            throw error;
        }
    }
    async getSchoolById(id) {
        try {
            const schools = await this.queryCacheService.findWithCache(this.schoolModel, {
                where: { id },
                include: ['district'],
            }, {
                ttl: 1800,
                keyPrefix: 'school_id',
                invalidateOn: ['update', 'destroy'],
            });
            if (!schools || schools.length === 0) {
                throw new common_1.NotFoundException('School not found');
            }
            return schools[0];
        }
        catch (error) {
            this.logger.error('Error fetching school:', error);
            throw error;
        }
    }
    async updateSchool(id, data) {
        try {
            const school = await this.getSchoolById(id);
            Object.assign(school, data);
            await school.save();
            await this.auditService.createAuditLog(administration_enums_1.AuditAction.UPDATE, 'School', id, undefined, data);
            this.logger.log(`School updated: ${id}`);
            return school;
        }
        catch (error) {
            this.logger.error('Error updating school:', error);
            throw error;
        }
    }
    async deleteSchool(id) {
        try {
            const school = await this.getSchoolById(id);
            school.isActive = false;
            await school.save();
            await this.auditService.createAuditLog(administration_enums_1.AuditAction.DELETE, 'School', id, undefined, { deactivated: true });
            this.logger.log(`School deactivated: ${id}`);
        }
        catch (error) {
            this.logger.error('Error deleting school:', error);
            throw error;
        }
    }
};
exports.SchoolService = SchoolService;
exports.SchoolService = SchoolService = SchoolService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.School)),
    __param(2, (0, sequelize_1.InjectModel)(models_1.District)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object, Object, audit_service_1.AuditService,
        query_cache_service_1.QueryCacheService])
], SchoolService);
//# sourceMappingURL=school.service.js.map