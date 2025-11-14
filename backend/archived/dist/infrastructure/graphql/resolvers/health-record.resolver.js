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
exports.HealthRecordResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const guards_1 = require("../guards");
const auth_1 = require("../../../services/auth");
const database_1 = require("../../../database");
const dto_1 = require("../dto");
const health_record_1 = require("../../../health-record");
const guards_2 = require("../guards");
let HealthRecordResolver = class HealthRecordResolver {
    healthRecordService;
    constructor(healthRecordService) {
        this.healthRecordService = healthRecordService;
    }
    mapHealthRecordToDto(record) {
        return ResolverUtilities.mapHealthRecordToDto(record);
    }
    async getHealthRecords(page, limit, orderBy, orderDirection, filters, context) {
        const userId = context.req?.user?.id;
        console.log('PHI ACCESS: Health records queried', {
            userId,
            timestamp: new Date().toISOString(),
            filters: {
                studentId: filters?.studentId,
                recordType: filters?.recordType,
            },
        });
        const serviceFilters = {
            page,
            limit,
            orderBy,
            orderDirection,
        };
        if (filters) {
            if (filters.studentId)
                serviceFilters.studentId = filters.studentId;
            if (filters.recordType)
                serviceFilters.recordType = filters.recordType;
            if (filters.isConfidential !== undefined)
                serviceFilters.isConfidential = filters.isConfidential;
            if (filters.followUpRequired !== undefined)
                serviceFilters.followUpRequired = filters.followUpRequired;
            if (filters.followUpCompleted !== undefined)
                serviceFilters.followUpCompleted = filters.followUpCompleted;
            if (filters.fromDate)
                serviceFilters.fromDate = filters.fromDate;
            if (filters.toDate)
                serviceFilters.toDate = filters.toDate;
            if (filters.search)
                serviceFilters.search = filters.search;
        }
        const result = await this.healthRecordService.findAll(serviceFilters);
        const healthRecords = result.data || [];
        const paginationData = result.meta || {};
        return {
            healthRecords: healthRecords.map((record) => this.mapHealthRecordToDto(record)),
            pagination: {
                page: paginationData.page || page,
                limit: paginationData.limit || limit,
                total: paginationData.total || 0,
                totalPages: paginationData.pages || 0,
            },
        };
    }
    async getHealthRecord(id, context) {
        const userId = context.req?.user?.id;
        console.log('PHI ACCESS: Health record retrieved', {
            userId,
            healthRecordId: id,
            timestamp: new Date().toISOString(),
        });
        const record = await this.healthRecordService.findOne(id);
        if (!record) {
            return null;
        }
        return this.mapHealthRecordToDto(record);
    }
    async getHealthRecordsByStudent(studentId, context) {
        const userId = context.req?.user?.id;
        console.log('PHI ACCESS: Student health records retrieved', {
            userId,
            studentId,
            timestamp: new Date().toISOString(),
        });
        const records = await this.healthRecordService.findByStudent(studentId);
        return records.map((record) => this.mapHealthRecordToDto(record));
    }
    async createHealthRecord(input, context) {
        const userId = context.req?.user?.id;
        console.log('PHI MODIFICATION: Health record created', {
            userId,
            studentId: input.studentId,
            recordType: input.recordType,
            timestamp: new Date().toISOString(),
        });
        const record = await this.healthRecordService.create({
            ...input,
            createdBy: userId,
        });
        return this.mapHealthRecordToDto(record);
    }
    async updateHealthRecord(id, input, context) {
        const userId = context.req?.user?.id;
        console.log('PHI MODIFICATION: Health record updated', {
            userId,
            healthRecordId: id,
            timestamp: new Date().toISOString(),
        });
        const record = await this.healthRecordService.update(id, {
            ...input,
            updatedBy: userId,
        });
        return this.mapHealthRecordToDto(record);
    }
    async deleteHealthRecord(id, context) {
        const userId = context.req?.user?.id;
        console.warn('PHI MODIFICATION: Health record deleted', {
            userId,
            healthRecordId: id,
            timestamp: new Date().toISOString(),
        });
        await this.healthRecordService.remove(id);
        return {
            success: true,
            message: 'Health record deleted successfully',
        };
    }
    async student(healthRecord, context) {
        try {
            return await context.loaders.studentLoader.load(healthRecord.studentId);
        }
        catch (error) {
            console.error(`Error loading student for health record ${healthRecord.id}:`, error);
            return null;
        }
    }
    async chronicConditions(healthRecord, context) {
        try {
            const chronicConditions = await context.loaders.chronicConditionsByStudentLoader.load(healthRecord.studentId);
            return chronicConditions || [];
        }
        catch (error) {
            console.error(`Error loading chronic conditions for health record ${healthRecord.id}:`, error);
            return [];
        }
    }
};
exports.HealthRecordResolver = HealthRecordResolver;
__decorate([
    (0, graphql_1.Query)(() => dto_1.HealthRecordListResponseDto, { name: 'healthRecords' }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('page', { type: () => Number, defaultValue: 1 })),
    __param(1, (0, graphql_1.Args)('limit', { type: () => Number, defaultValue: 20 })),
    __param(2, (0, graphql_1.Args)('orderBy', { type: () => String, defaultValue: 'recordDate' })),
    __param(3, (0, graphql_1.Args)('orderDirection', { type: () => String, defaultValue: 'DESC' })),
    __param(4, (0, graphql_1.Args)('filters', { type: () => dto_1.HealthRecordFilterInputDto, nullable: true })),
    __param(5, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, dto_1.HealthRecordFilterInputDto, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordResolver.prototype, "getHealthRecords", null);
__decorate([
    (0, graphql_1.Query)(() => dto_1.HealthRecordDto, { name: 'healthRecord', nullable: true }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordResolver.prototype, "getHealthRecord", null);
__decorate([
    (0, graphql_1.Query)(() => [dto_1.HealthRecordDto], { name: 'healthRecordsByStudent' }),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('studentId', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordResolver.prototype, "getHealthRecordsByStudent", null);
__decorate([
    (0, graphql_1.Mutation)(() => dto_1.HealthRecordDto),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.HealthRecordInputDto, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordResolver.prototype, "createHealthRecord", null);
__decorate([
    (0, graphql_1.Mutation)(() => dto_1.HealthRecordDto),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN, database_1.UserRole.SCHOOL_ADMIN, database_1.UserRole.DISTRICT_ADMIN, database_1.UserRole.NURSE),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('input')),
    __param(2, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.HealthRecordUpdateInputDto, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordResolver.prototype, "updateHealthRecord", null);
__decorate([
    (0, graphql_1.Mutation)(() => dto_1.DeleteResponseDto),
    (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard),
    (0, auth_1.Roles)(database_1.UserRole.ADMIN),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordResolver.prototype, "deleteHealthRecord", null);
__decorate([
    (0, graphql_1.ResolveField)(() => dto_1.StudentDto, { name: 'student', nullable: true }),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.HealthRecordDto, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordResolver.prototype, "student", null);
__decorate([
    (0, graphql_1.ResolveField)(() => [dto_1.ChronicConditionDto], {
        name: 'chronicConditions',
        nullable: 'items',
    }),
    (0, guards_2.PHIField)(),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.HealthRecordDto, Object]),
    __metadata("design:returntype", Promise)
], HealthRecordResolver.prototype, "chronicConditions", null);
exports.HealthRecordResolver = HealthRecordResolver = __decorate([
    (0, graphql_1.Resolver)(() => dto_1.HealthRecordDto),
    __metadata("design:paramtypes", [health_record_1.HealthRecordService])
], HealthRecordResolver);
//# sourceMappingURL=health-record.resolver.js.map