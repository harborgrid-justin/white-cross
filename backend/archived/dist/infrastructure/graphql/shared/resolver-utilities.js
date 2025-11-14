"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResolver = exports.EntityMappers = exports.FieldResolverPatterns = exports.DataLoaderUtils = exports.PaginationUtils = exports.StandardArgs = exports.ResolverDecorators = exports.CommonRoles = exports.HIPAAAuditLogger = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const guards_1 = require("../guards");
const auth_1 = require("../../../services/auth");
const database_1 = require("../../../database");
class HIPAAAuditLogger {
    static logPhiAccess(operation, context, details = {}) {
        const userId = context.req?.user?.userId || context.req?.user?.id;
        console.log(`PHI ACCESS: ${operation}`, {
            userId,
            timestamp: new Date().toISOString(),
            ...details,
        });
    }
    static logPhiModification(operation, context, details = {}) {
        const userId = context.req?.user?.userId || context.req?.user?.id;
        console.log(`PHI MODIFICATION: ${operation}`, {
            userId,
            timestamp: new Date().toISOString(),
            ...details,
        });
    }
    static logPhiDeletion(operation, context, details = {}) {
        const userId = context.req?.user?.userId || context.req?.user?.id;
        console.warn(`PHI MODIFICATION: ${operation}`, {
            userId,
            timestamp: new Date().toISOString(),
            ...details,
        });
    }
}
exports.HIPAAAuditLogger = HIPAAAuditLogger;
exports.CommonRoles = {
    PHI_ACCESS: [
        database_1.UserRole.ADMIN,
        database_1.UserRole.SCHOOL_ADMIN,
        database_1.UserRole.DISTRICT_ADMIN,
        database_1.UserRole.NURSE,
    ],
    STUDENT_ACCESS: [
        database_1.UserRole.ADMIN,
        database_1.UserRole.SCHOOL_ADMIN,
        database_1.UserRole.DISTRICT_ADMIN,
        database_1.UserRole.NURSE,
        database_1.UserRole.COUNSELOR,
    ],
    ADMIN_ONLY: [database_1.UserRole.ADMIN],
    HEALTHCARE_STAFF: [
        database_1.UserRole.ADMIN,
        database_1.UserRole.SCHOOL_ADMIN,
        database_1.UserRole.DISTRICT_ADMIN,
        database_1.UserRole.NURSE,
    ],
};
class ResolverDecorators {
    static PhiQuery(returnType, name, options = {}) {
        return function (target, propertyName, descriptor) {
            (0, graphql_1.Query)(() => returnType, { name, ...options })(target, propertyName, descriptor);
            (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard)(target, propertyName, descriptor);
            (0, auth_1.Roles)(...exports.CommonRoles.PHI_ACCESS)(target, propertyName, descriptor);
        };
    }
    static StudentQuery(returnType, name, options = {}) {
        return function (target, propertyName, descriptor) {
            (0, graphql_1.Query)(() => returnType, { name, ...options })(target, propertyName, descriptor);
            (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard)(target, propertyName, descriptor);
            (0, auth_1.Roles)(...exports.CommonRoles.STUDENT_ACCESS)(target, propertyName, descriptor);
        };
    }
    static PhiMutation(returnType, options = {}) {
        return function (target, propertyName, descriptor) {
            (0, graphql_1.Mutation)(() => returnType, options)(target, propertyName, descriptor);
            (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard)(target, propertyName, descriptor);
            (0, auth_1.Roles)(...exports.CommonRoles.PHI_ACCESS)(target, propertyName, descriptor);
        };
    }
    static AdminMutation(returnType, options = {}) {
        return function (target, propertyName, descriptor) {
            (0, graphql_1.Mutation)(() => returnType, options)(target, propertyName, descriptor);
            (0, common_1.UseGuards)(guards_1.GqlAuthGuard, guards_1.GqlRolesGuard)(target, propertyName, descriptor);
            (0, auth_1.Roles)(...exports.CommonRoles.ADMIN_ONLY)(target, propertyName, descriptor);
        };
    }
}
exports.ResolverDecorators = ResolverDecorators;
class StandardArgs {
    static Pagination() {
        return {
            page: (0, graphql_1.Args)('page', { type: () => Number, defaultValue: 1 }),
            limit: (0, graphql_1.Args)('limit', { type: () => Number, defaultValue: 20 }),
            orderBy: (0, graphql_1.Args)('orderBy', { type: () => String, defaultValue: 'createdAt' }),
            orderDirection: (0, graphql_1.Args)('orderDirection', { type: () => String, defaultValue: 'DESC' }),
        };
    }
    static Id() {
        return (0, graphql_1.Args)('id', { type: () => graphql_1.ID });
    }
    static Filters(filterType) {
        return (0, graphql_1.Args)('filters', { type: () => filterType, nullable: true });
    }
}
exports.StandardArgs = StandardArgs;
class PaginationUtils {
    static transformToListResponse(serviceResult, page, limit) {
        const data = serviceResult.data || [];
        const meta = serviceResult.meta || {};
        return {
            data,
            pagination: {
                page: meta.page || page,
                limit: meta.limit || limit,
                total: meta.total || 0,
                totalPages: meta.pages || Math.ceil((meta.total || 0) / limit),
            },
        };
    }
    static buildServiceFilters(pagination, filters) {
        const serviceFilters = {
            page: pagination.page || 1,
            limit: pagination.limit || 20,
            orderBy: pagination.orderBy || 'createdAt',
            orderDirection: pagination.orderDirection || 'DESC',
        };
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    serviceFilters[key] = value;
                }
            });
        }
        return serviceFilters;
    }
}
exports.PaginationUtils = PaginationUtils;
class DataLoaderUtils {
    static async safeLoad(context, loaderName, id, fallback = null) {
        try {
            const loader = context.loaders?.[loaderName];
            if (!loader) {
                console.warn(`DataLoader '${loaderName}' not found in context`);
                return fallback;
            }
            return await loader.load(id);
        }
        catch (error) {
            console.error(`Error loading data with ${loaderName} for ID ${id}:`, error);
            return fallback;
        }
    }
    static async safeLoadMany(context, loaderName, ids, fallback = []) {
        try {
            const loader = context.loaders?.[loaderName];
            if (!loader) {
                console.warn(`DataLoader '${loaderName}' not found in context`);
                return fallback;
            }
            return await loader.loadMany(ids);
        }
        catch (error) {
            console.error(`Error loading batch data with ${loaderName} for IDs ${ids.join(', ')}:`, error);
            return fallback;
        }
    }
}
exports.DataLoaderUtils = DataLoaderUtils;
class FieldResolverPatterns {
    static createSingleEntityResolver(loaderName, idField = 'id', fallback = null) {
        return async function (parent, context) {
            const id = parent[idField];
            if (!id)
                return fallback;
            return DataLoaderUtils.safeLoad(context, loaderName, id, fallback);
        };
    }
    static createArrayEntityResolver(loaderName, idField = 'id', fallback = []) {
        return async function (parent, context) {
            const id = parent[idField];
            if (!id)
                return fallback;
            const result = await DataLoaderUtils.safeLoad(context, loaderName, id, fallback);
            return Array.isArray(result) ? result : fallback;
        };
    }
    static createCountResolver(arrayResolverFn) {
        return async function (parent, context) {
            const result = await arrayResolverFn(parent, context);
            return result.length;
        };
    }
}
exports.FieldResolverPatterns = FieldResolverPatterns;
class EntityMappers {
    static mapToDto(source, mapping) {
        const result = {};
        Object.entries(mapping).forEach(([targetKey, sourceKeyOrFn]) => {
            if (typeof sourceKeyOrFn === 'function') {
                result[targetKey] = sourceKeyOrFn(source);
            }
            else {
                result[targetKey] = source[sourceKeyOrFn];
            }
        });
        return result;
    }
    static mapHealthRecordToDto(record) {
        return {
            id: record.id,
            studentId: record.studentId,
            recordType: record.recordType,
            title: record.title,
            description: record.description,
            recordDate: record.recordDate,
            provider: record.provider || undefined,
            providerNpi: record.providerNpi || undefined,
            facility: record.facility || undefined,
            facilityNpi: record.facilityNpi || undefined,
            diagnosis: record.diagnosis || undefined,
            diagnosisCode: record.diagnosisCode || undefined,
            treatment: record.treatment || undefined,
            followUpRequired: record.followUpRequired,
            followUpDate: record.followUpDate || undefined,
            followUpCompleted: record.followUpCompleted,
            attachments: record.attachments || [],
            metadata: record.metadata || undefined,
            isConfidential: record.isConfidential,
            notes: record.notes || undefined,
            createdBy: record.createdBy || undefined,
            updatedBy: record.updatedBy || undefined,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        };
    }
    static mapStudentToDto(student) {
        return {
            ...student,
            fullName: `${student.firstName} ${student.lastName}`,
            photo: student.photo || undefined,
            medicalRecordNum: student.medicalRecordNum || undefined,
            nurseId: student.nurseId || undefined,
        };
    }
    static mapContactToDto(contact) {
        return {
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email ?? undefined,
            phone: contact.phone ?? undefined,
            type: contact.type,
            relationTo: contact.relationTo ?? undefined,
            isActive: contact.isActive,
            createdAt: contact.createdAt,
            updatedAt: contact.updatedAt,
        };
    }
}
exports.EntityMappers = EntityMappers;
class BaseResolver {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(pagination, filters) {
        const serviceFilters = PaginationUtils.buildServiceFilters(pagination, filters);
        const result = await this.service.findAll(serviceFilters);
        return PaginationUtils.transformToListResponse(result, pagination.page || 1, pagination.limit || 20);
    }
    async findOne(id) {
        return await this.service.findOne(id);
    }
    async create(input, context, entityName) {
        const userId = context.req?.user?.userId || context.req?.user?.id;
        HIPAAAuditLogger.logPhiModification(`${entityName} created`, context, {
            entityType: entityName.toLowerCase(),
        });
        return await this.service.create({
            ...input,
            createdBy: userId,
        });
    }
    async update(id, input, context, entityName) {
        const userId = context.req?.user?.userId || context.req?.user?.id;
        HIPAAAuditLogger.logPhiModification(`${entityName} updated`, context, {
            entityId: id,
            entityType: entityName.toLowerCase(),
        });
        return await this.service.update(id, {
            ...input,
            updatedBy: userId,
        });
    }
    async remove(id, context, entityName) {
        HIPAAAuditLogger.logPhiDeletion(`${entityName} deleted`, context, {
            entityId: id,
            entityType: entityName.toLowerCase(),
        });
        await this.service.remove(id);
        return {
            success: true,
            message: `${entityName} deleted successfully`,
        };
    }
}
exports.BaseResolver = BaseResolver;
//# sourceMappingURL=resolver-utilities.js.map