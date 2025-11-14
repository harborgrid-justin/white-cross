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
var UnitOfWork_1, RepositoryFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataRepository = exports.RepositoryFactory = exports.MultiTenantRepository = exports.SoftDeleteRepository = exports.TransactionalRepository = exports.CachedRepository = exports.ReadOnlyRepository = exports.BaseRepository = exports.UnitOfWork = exports.Specification = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const query_builder_1 = require("./query-builder");
const crud_operations_service_1 = require("../services/operations/crud-operations.service");
class Specification {
    and(spec) {
        return new AndSpecification(this, spec);
    }
    or(spec) {
        return new OrSpecification(this, spec);
    }
    not() {
        return new NotSpecification(this);
    }
}
exports.Specification = Specification;
class AndSpecification extends Specification {
    left;
    right;
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    toQuery() {
        return {
            [sequelize_1.Op.and]: [this.left.toQuery(), this.right.toQuery()],
        };
    }
}
class OrSpecification extends Specification {
    left;
    right;
    constructor(left, right) {
        super();
        this.left = left;
        this.right = right;
    }
    toQuery() {
        return {
            [sequelize_1.Op.or]: [this.left.toQuery(), this.right.toQuery()],
        };
    }
}
class NotSpecification extends Specification {
    spec;
    constructor(spec) {
        super();
        this.spec = spec;
    }
    toQuery() {
        return {
            [sequelize_1.Op.not]: this.spec.toQuery(),
        };
    }
}
let UnitOfWork = UnitOfWork_1 = class UnitOfWork {
    sequelize;
    logger = new common_1.Logger(UnitOfWork_1.name);
    transaction;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async begin() {
        if (this.transaction) {
            throw new Error('Transaction already active');
        }
        this.transaction = await this.sequelize.transaction();
        this.logInfo('Transaction started');
        return this.transaction;
    }
    async commit() {
        if (!this.transaction) {
            throw new Error('No active transaction');
        }
        await this.transaction.commit();
        this.logInfo('Transaction committed');
        this.transaction = undefined;
    }
    async rollback() {
        if (!this.transaction) {
            throw new Error('No active transaction');
        }
        await this.transaction.rollback();
        this.logInfo('Transaction rolled back');
        this.transaction = undefined;
    }
    getTransaction() {
        return this.transaction;
    }
    isActive() {
        return this.transaction !== undefined;
    }
};
exports.UnitOfWork = UnitOfWork;
exports.UnitOfWork = UnitOfWork = UnitOfWork_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sequelize_1.Sequelize])
], UnitOfWork);
class BaseRepository {
    model;
    logger;
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(`${model.name}Repository`);
    }
    async findById(id, options) {
        try {
            return await this.model.findByPk(id, options);
        }
        catch (error) {
            this.logError(`Failed to find ${this.model.name} by ID ${id}`, error);
            throw error;
        }
    }
    async findByIdOrFail(id, options) {
        const record = await this.findById(id, options);
        if (!record) {
            throw new common_1.NotFoundException(`${this.model.name} with ID ${id} not found`);
        }
        return record;
    }
    async findAll(options) {
        try {
            return await this.model.findAll(options);
        }
        catch (error) {
            this.logError(`Failed to find all ${this.model.name} records`, error);
            throw error;
        }
    }
    async findOne(options) {
        try {
            return await this.model.findOne(options);
        }
        catch (error) {
            this.logError(`Failed to find one ${this.model.name} record`, error);
            throw error;
        }
    }
    async findOneOrFail(options) {
        const record = await this.findOne(options);
        if (!record) {
            throw new common_1.NotFoundException(`${this.model.name} record not found`);
        }
        return record;
    }
    async findAndCountAll(options) {
        try {
            return await this.model.findAndCountAll(options);
        }
        catch (error) {
            this.logError(`Failed to find and count ${this.model.name} records`, error);
            throw error;
        }
    }
    async create(data, audit, transaction) {
        try {
            return await (0, crud_operations_service_1.createWithAudit)(this.model, data, audit, { transaction });
        }
        catch (error) {
            this.logError(`Failed to create ${this.model.name} record`, error);
            throw error;
        }
    }
    async update(id, data, audit, transaction) {
        try {
            return await (0, crud_operations_service_1.updateWithAudit)(this.model, id, data, audit, { transaction });
        }
        catch (error) {
            this.logError(`Failed to update ${this.model.name} record ${id}`, error);
            throw error;
        }
    }
    async delete(id, audit, transaction) {
        try {
            await (0, crud_operations_service_1.softDelete)(this.model, id, {
                deletedBy: audit.userId,
                transaction,
            });
            return true;
        }
        catch (error) {
            this.logError(`Failed to delete ${this.model.name} record ${id}`, error);
            throw error;
        }
    }
    async count(where, transaction) {
        try {
            return await this.model.count({ where, transaction });
        }
        catch (error) {
            this.logError(`Failed to count ${this.model.name} records`, error);
            throw error;
        }
    }
    async exists(where, transaction) {
        try {
            const count = await this.count(where, transaction);
            return count > 0;
        }
        catch (error) {
            this.logError(`Failed to check existence for ${this.model.name}`, error);
            throw error;
        }
    }
    async findBySpecification(spec, options) {
        try {
            return await this.model.findAll({
                ...options,
                where: spec.toQuery(),
            });
        }
        catch (error) {
            this.logError(`Failed to find ${this.model.name} by specification`, error);
            throw error;
        }
    }
    async findPaginated(options, pagination) {
        try {
            return await (0, query_builder_1.buildPaginatedQuery)(this.model, options, pagination);
        }
        catch (error) {
            this.logError(`Failed to find paginated ${this.model.name} records`, error);
            throw error;
        }
    }
    async findOptimized(config) {
        try {
            const options = (0, query_builder_1.buildOptimizedQuery)(config);
            return await this.model.findAll(options);
        }
        catch (error) {
            this.logError(`Failed to find optimized ${this.model.name} records`, error);
            throw error;
        }
    }
    async findByIds(ids, options) {
        try {
            return await this.model.findAll({
                ...options,
                where: { id: { [sequelize_1.Op.in]: ids } },
            });
        }
        catch (error) {
            this.logError(`Failed to batch find ${this.model.name} records`, error);
            throw error;
        }
    }
    async findByIdsAsMap(ids, options) {
        const records = await this.findByIds(ids, options);
        const map = new Map();
        records.forEach(record => {
            map.set(record.id, record);
        });
        return map;
    }
    async findFirst(options) {
        try {
            return await this.model.findOne({
                ...options,
                limit: 1,
            });
        }
        catch (error) {
            this.logError(`Failed to find first ${this.model.name} record`, error);
            throw error;
        }
    }
    async findLast(orderField = 'createdAt', options) {
        try {
            return await this.model.findOne({
                ...options,
                order: [[orderField, 'DESC']],
                limit: 1,
            });
        }
        catch (error) {
            this.logError(`Failed to find last ${this.model.name} record`, error);
            throw error;
        }
    }
    getModel() {
        return this.model;
    }
}
exports.BaseRepository = BaseRepository;
class ReadOnlyRepository {
    model;
    logger;
    constructor(model) {
        this.model = model;
        this.logger = new common_1.Logger(`${model.name}ReadOnlyRepository`);
    }
    async findById(id, options) {
        return await this.model.findByPk(id, options);
    }
    async findAll(options) {
        return await this.model.findAll(options);
    }
    async findOne(options) {
        return await this.model.findOne(options);
    }
    async count(where) {
        return await this.model.count({ where });
    }
    async exists(where) {
        const count = await this.count(where);
        return count > 0;
    }
}
exports.ReadOnlyRepository = ReadOnlyRepository;
class CachedRepository extends BaseRepository {
    cache = new Map();
    cacheTTL;
    constructor(model, cacheTTL = 300000) {
        super(model);
        this.cacheTTL = cacheTTL;
    }
    async findById(id, options) {
        const cacheKey = `findById:${id}`;
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            this.logDebug(`Cache hit for ${this.model.name} ${id}`);
            return cached;
        }
        const record = await super.findById(id, options);
        if (record) {
            this.setCache(cacheKey, record);
        }
        return record;
    }
    async create(data, audit, transaction) {
        const record = await super.create(data, audit, transaction);
        this.invalidateCache();
        return record;
    }
    async update(id, data, audit, transaction) {
        const record = await super.update(id, data, audit, transaction);
        this.invalidateCache(`findById:${id}`);
        return record;
    }
    async delete(id, audit, transaction) {
        const result = await super.delete(id, audit, transaction);
        this.invalidateCache(`findById:${id}`);
        return result;
    }
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (!cached) {
            return null;
        }
        const age = Date.now() - cached.timestamp;
        if (age > this.cacheTTL) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }
    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }
    invalidateCache(key) {
        if (key) {
            this.cache.delete(key);
        }
        else {
            this.cache.clear();
        }
    }
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
    clearCache() {
        this.cache.clear();
        this.logInfo(`Cache cleared for ${this.model.name}`);
    }
}
exports.CachedRepository = CachedRepository;
class TransactionalRepository extends BaseRepository {
    unitOfWork;
    constructor(model, unitOfWork) {
        super(model);
        this.unitOfWork = unitOfWork;
    }
    async executeInTransaction(operation) {
        let transaction;
        const shouldManageTransaction = !this.unitOfWork.isActive();
        try {
            if (shouldManageTransaction) {
                transaction = await this.unitOfWork.begin();
            }
            else {
                transaction = this.unitOfWork.getTransaction();
            }
            const result = await operation(transaction);
            if (shouldManageTransaction) {
                await this.unitOfWork.commit();
            }
            return result;
        }
        catch (error) {
            if (shouldManageTransaction) {
                await this.unitOfWork.rollback();
            }
            this.logError('Transaction failed', error);
            throw error;
        }
    }
    async createInTransaction(data, audit) {
        return await this.executeInTransaction(async (transaction) => {
            return await this.create(data, audit, transaction);
        });
    }
    async updateInTransaction(id, data, audit) {
        return await this.executeInTransaction(async (transaction) => {
            return await this.update(id, data, audit, transaction);
        });
    }
    async deleteInTransaction(id, audit) {
        return await this.executeInTransaction(async (transaction) => {
            return await this.delete(id, audit, transaction);
        });
    }
}
exports.TransactionalRepository = TransactionalRepository;
class SoftDeleteRepository extends BaseRepository {
    async findAllIncludingDeleted(options) {
        return await this.model.findAll({
            ...options,
            paranoid: false,
        });
    }
    async findByIdIncludingDeleted(id, options) {
        return await this.model.findByPk(id, {
            ...options,
            paranoid: false,
        });
    }
    async restore(id, audit, transaction) {
        const record = await this.findByIdIncludingDeleted(id, { transaction });
        if (!record) {
            throw new common_1.NotFoundException(`${this.model.name} with ID ${id} not found`);
        }
        if (!record.deletedAt) {
            throw new Error(`${this.model.name} ${id} is not deleted`);
        }
        await record.update({
            deletedAt: null,
            restoredBy: audit.userId,
            restoredAt: audit.timestamp,
        }, { transaction });
        this.logInfo(`Restored ${this.model.name} ${id}`);
        return record;
    }
    async findDeleted(options) {
        return await this.model.findAll({
            ...options,
            where: {
                ...(options?.where || {}),
                deletedAt: { [sequelize_1.Op.not]: null },
            },
            paranoid: false,
        });
    }
    async countDeleted(where) {
        return await this.model.count({
            where: {
                ...where,
                deletedAt: { [sequelize_1.Op.not]: null },
            },
            paranoid: false,
        });
    }
}
exports.SoftDeleteRepository = SoftDeleteRepository;
class MultiTenantRepository extends BaseRepository {
    tenantIdField;
    constructor(model, tenantIdField = 'tenantId') {
        super(model);
        this.tenantIdField = tenantIdField;
    }
    addTenantFilter(options, tenantId) {
        return {
            ...options,
            where: {
                ...(options.where || {}),
                [this.tenantIdField]: tenantId,
            },
        };
    }
    async findAllForTenant(tenantId, options) {
        return await this.findAll(this.addTenantFilter(options || {}, tenantId));
    }
    async findOneForTenant(tenantId, options) {
        return await this.findOne(this.addTenantFilter(options, tenantId));
    }
    async countForTenant(tenantId, where) {
        return await this.count({
            ...where,
            [this.tenantIdField]: tenantId,
        });
    }
    async createForTenant(tenantId, data, audit, transaction) {
        return await this.create({
            ...data,
            [this.tenantIdField]: tenantId,
        }, audit, transaction);
    }
}
exports.MultiTenantRepository = MultiTenantRepository;
let RepositoryFactory = RepositoryFactory_1 = class RepositoryFactory {
    logger = new common_1.Logger(RepositoryFactory_1.name);
    repositories = new Map();
    createRepository(model, type = 'base') {
        const key = `${model.name}:${type}`;
        if (this.repositories.has(key)) {
            return this.repositories.get(key);
        }
        let repository;
        switch (type) {
            case 'cached':
                repository = new (class extends CachedRepository {
                    constructor() {
                        super(model);
                    }
                })();
                break;
            case 'readonly':
                repository = new (class extends ReadOnlyRepository {
                    constructor() {
                        super(model);
                    }
                })();
                break;
            case 'base':
            default:
                repository = new (class extends BaseRepository {
                    constructor() {
                        super(model);
                    }
                })();
                break;
        }
        this.repositories.set(key, repository);
        this.logInfo(`Created ${type} repository for ${model.name}`);
        return repository;
    }
    getRepository(model) {
        return this.repositories.get(`${model.name}:base`);
    }
    clearRepositories() {
        this.repositories.clear();
        this.logInfo('All repositories cleared');
    }
};
exports.RepositoryFactory = RepositoryFactory;
exports.RepositoryFactory = RepositoryFactory = RepositoryFactory_1 = __decorate([
    (0, common_1.Injectable)()
], RepositoryFactory);
exports.DataRepository = {
    BaseRepository,
    ReadOnlyRepository,
    CachedRepository,
    TransactionalRepository,
    SoftDeleteRepository,
    MultiTenantRepository,
    RepositoryFactory,
    UnitOfWork,
    Specification,
    AndSpecification,
    OrSpecification,
    NotSpecification,
};
//# sourceMappingURL=data-repository.service.js.map