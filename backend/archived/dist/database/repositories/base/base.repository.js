"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryError = exports.BaseRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const repository_interface_1 = require("../interfaces/repository.interface");
const types_1 = require("../../types");
const cache_manager_interface_1 = require("../../interfaces/cache/cache-manager.interface");
const database_enums_1 = require("../../types/database.enums");
class BaseRepository {
    logger;
    model;
    auditLogger;
    cacheManager;
    entityName;
    cacheKeyBuilder;
    constructor(model, auditLogger, cacheManager, entityName) {
        this.model = model;
        this.auditLogger = auditLogger;
        this.cacheManager = cacheManager;
        this.entityName = entityName;
        this.cacheKeyBuilder = new cache_manager_interface_1.CacheKeyBuilder();
        this.logger = new common_1.Logger(`${entityName}Repository`);
    }
    async findById(id, options) {
        try {
            const cacheKey = this.cacheKeyBuilder.entity(this.entityName, id);
            if (options?.cacheKey || this.shouldCache()) {
                const cached = await this.cacheManager.get(cacheKey);
                if (cached) {
                    this.logger.debug(`Cache hit for ${this.entityName}:${id}`);
                    return cached;
                }
            }
            const findOptions = this.buildFindOptions(options);
            const result = await this.model.findByPk(id, findOptions);
            if (!result) {
                return null;
            }
            const entity = this.mapToEntity(result);
            if (this.shouldCache()) {
                const ttl = options?.cacheTTL || (0, database_enums_1.getCacheTTL)(this.entityName);
                await this.cacheManager.set(cacheKey, entity, ttl);
            }
            return entity;
        }
        catch (error) {
            this.logger.error(`Error finding ${this.entityName} by ID:`, error);
            throw new repository_interface_1.RepositoryError(`Failed to find ${this.entityName}`, 'FIND_ERROR', 500, { id, error: error.message });
        }
    }
    async findMany(criteria, options) {
        try {
            const page = criteria.pagination?.page || 1;
            const limit = criteria.pagination?.limit || 20;
            const offset = (0, types_1.calculateSkip)(page, limit);
            const whereClause = this.buildWhereClause(criteria.where);
            const orderClause = this.buildOrderClause(criteria.orderBy || options?.orderBy);
            const findOptions = {
                where: whereClause,
                order: orderClause,
                limit,
                offset,
                ...this.buildFindOptions(options),
            };
            const { rows, count } = await this.model.findAndCountAll(findOptions);
            const entities = rows.map((row) => this.mapToEntity(row));
            return {
                data: entities,
                pagination: (0, types_1.createPaginationMetadata)(page, limit, count),
            };
        }
        catch (error) {
            this.logger.error(`Error finding ${this.entityName} records:`, error);
            throw new repository_interface_1.RepositoryError(`Failed to find ${this.entityName} records`, 'FIND_MANY_ERROR', 500, { error: error.message });
        }
    }
    async create(data, context) {
        let transaction;
        try {
            await this.validateCreate(data);
            transaction = await this.model.sequelize.transaction();
            const createOptions = {
                transaction,
            };
            const result = await this.model.create(data, createOptions);
            await this.auditLogger.logCreate(this.entityName, result.id, context, this.sanitizeForAudit(result.get()));
            await this.invalidateCaches(result);
            if (transaction) {
                await transaction.commit();
            }
            this.logger.log(`Created ${this.entityName}:${result.id} by user ${context.userId}`);
            return this.mapToEntity(result);
        }
        catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            this.logger.error(`Error creating ${this.entityName}:`, error);
            if (error instanceof repository_interface_1.RepositoryError) {
                throw error;
            }
            throw new repository_interface_1.RepositoryError(`Failed to create ${this.entityName}`, 'CREATE_ERROR', 500, { error: error.message });
        }
    }
    async update(id, data, context) {
        let transaction;
        try {
            const existing = await this.model.findByPk(id);
            if (!existing) {
                throw new repository_interface_1.RepositoryError(`${this.entityName} not found`, 'NOT_FOUND', 404, { id });
            }
            await this.validateUpdate(id, data);
            transaction = await this.model.sequelize.transaction();
            const updateOptions = {
                where: { id },
                transaction,
                returning: true,
            };
            await this.model.update(data, updateOptions);
            const updated = await this.model.findByPk(id, { transaction });
            if (!updated) {
                throw new repository_interface_1.RepositoryError(`${this.entityName} not found after update`, 'UPDATE_ERROR', 500, { id });
            }
            const changes = this.calculateChanges(existing.get(), updated.get());
            if (Object.keys(changes).length > 0) {
                await this.auditLogger.logUpdate(this.entityName, id, context, changes);
            }
            await this.invalidateCaches(updated);
            if (transaction) {
                await transaction.commit();
            }
            this.logger.log(`Updated ${this.entityName}:${id} by user ${context.userId}`);
            return this.mapToEntity(updated);
        }
        catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            this.logger.error(`Error updating ${this.entityName}:`, error);
            if (error instanceof repository_interface_1.RepositoryError) {
                throw error;
            }
            throw new repository_interface_1.RepositoryError(`Failed to update ${this.entityName}`, 'UPDATE_ERROR', 500, { id, error: error.message });
        }
    }
    async delete(id, context) {
        let transaction;
        try {
            const existing = await this.model.findByPk(id);
            if (!existing) {
                throw new repository_interface_1.RepositoryError(`${this.entityName} not found`, 'NOT_FOUND', 404, { id });
            }
            transaction = await this.model.sequelize.transaction();
            const destroyOptions = {
                where: { id },
                transaction,
            };
            await this.model.destroy(destroyOptions);
            await this.auditLogger.logDelete(this.entityName, id, context, this.sanitizeForAudit(existing.get()));
            await this.invalidateCaches(existing);
            if (transaction) {
                await transaction.commit();
            }
            this.logger.log(`Deleted ${this.entityName}:${id} by user ${context.userId}`);
        }
        catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            this.logger.error(`Error deleting ${this.entityName}:`, error);
            if (error instanceof repository_interface_1.RepositoryError) {
                throw error;
            }
            throw new repository_interface_1.RepositoryError(`Failed to delete ${this.entityName}`, 'DELETE_ERROR', 500, { id, error: error.message });
        }
    }
    async exists(criteria) {
        try {
            const count = await this.model.count({
                where: criteria,
            });
            return count > 0;
        }
        catch (error) {
            this.logger.error(`Error checking ${this.entityName} existence:`, error);
            return false;
        }
    }
    async bulkCreate(data, context) {
        let transaction;
        try {
            transaction = await this.model.sequelize.transaction();
            const results = await this.model.bulkCreate(data, {
                transaction,
                validate: true,
                returning: true,
            });
            await this.auditLogger.logBulkOperation('BULK_CREATE', this.entityName, context, { count: results.length });
            if (transaction) {
                await transaction.commit();
            }
            this.logger.log(`Bulk created ${results.length} ${this.entityName} records`);
            return results.map((r) => this.mapToEntity(r));
        }
        catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            this.logger.error(`Error bulk creating ${this.entityName}:`, error);
            throw new repository_interface_1.RepositoryError(`Failed to bulk create ${this.entityName}`, 'BULK_CREATE_ERROR', 500, { error: error.message });
        }
    }
    async count(criteria) {
        try {
            return await this.model.count({
                where: criteria,
            });
        }
        catch (error) {
            this.logger.error(`Error counting ${this.entityName}:`, error);
            throw new repository_interface_1.RepositoryError(`Failed to count ${this.entityName}`, 'COUNT_ERROR', 500, { error: error.message });
        }
    }
    mapToEntity(model) {
        return model.get({ plain: true });
    }
    buildFindOptions(options) {
        const findOptions = {};
        if (options?.include) {
            findOptions.include = this.buildIncludeClause(options.include);
        }
        if (options?.select) {
            findOptions.attributes = this.buildAttributesClause(options.select);
        }
        return findOptions;
    }
    buildIncludeClause(include) {
        if (!include)
            return [];
        return Object.keys(include).filter((key) => include[key]);
    }
    buildAttributesClause(select) {
        if (!select)
            return [];
        return Object.keys(select).filter((key) => select[key]);
    }
    buildWhereClause(where) {
        if (!where)
            return {};
        if (where.AND || where.OR || where.NOT) {
            const clause = {};
            if (where.AND) {
                clause[sequelize_1.Op.and] = where.AND;
            }
            if (where.OR) {
                clause[sequelize_1.Op.or] = where.OR;
            }
            if (where.NOT) {
                clause[sequelize_1.Op.not] = where.NOT;
            }
            return clause;
        }
        return where;
    }
    buildOrderClause(orderBy) {
        if (!orderBy)
            return [];
        if (Array.isArray(orderBy)) {
            return orderBy.map((order) => {
                const key = Object.keys(order)[0];
                return [key, order[key].toUpperCase()];
            });
        }
        return Object.entries(orderBy).map(([key, direction]) => [
            key,
            direction.toUpperCase(),
        ]);
    }
    calculateChanges(before, after) {
        const changes = {};
        for (const key in after) {
            if (before[key] !== after[key] &&
                key !== 'updatedAt' &&
                key !== 'createdAt') {
                changes[key] = {
                    before: before[key],
                    after: after[key],
                };
            }
        }
        return changes;
    }
    async validateCreate(data) {
    }
    async validateUpdate(id, data) {
    }
    shouldCache() {
        return true;
    }
}
exports.BaseRepository = BaseRepository;
var repository_interface_2 = require("../interfaces/repository.interface");
Object.defineProperty(exports, "RepositoryError", { enumerable: true, get: function () { return repository_interface_2.RepositoryError; } });
//# sourceMappingURL=base.repository.js.map