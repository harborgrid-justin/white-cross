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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUtils = exports.HealthcareBaseService = exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
let BaseService = class BaseService {
    repository;
    eventEmitter;
    logger;
    entityName;
    options;
    constructor(repository, eventEmitter, options = {}) {
        this.repository = repository;
        this.eventEmitter = eventEmitter;
        this.entityName = options.entityName || this.constructor.name.replace('Service', '');
        this.logger = new common_1.Logger(this.constructor.name);
        this.options = {
            enableCache: false,
            enableEvents: true,
            enableAudit: true,
            ...options,
        };
    }
    async findAll(options = {}) {
        const { page = 1, limit = 20, orderBy = 'createdAt', orderDirection = 'DESC', ...filters } = options;
        try {
            const skip = (page - 1) * limit;
            const findOptions = this.buildFindOptions(filters, orderBy, orderDirection);
            const [data, total] = await this.repository.findAndCount({
                ...findOptions,
                skip,
                take: limit,
            });
            const pages = Math.ceil(total / limit);
            return {
                data,
                meta: {
                    page,
                    limit,
                    total,
                    pages,
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to find ${this.entityName} entities`, error);
            throw error;
        }
    }
    async findOne(id, relations = []) {
        try {
            const entity = await this.repository.findOne({
                where: { id },
                relations,
            });
            if (!entity) {
                throw new common_1.NotFoundException(`${this.entityName} with ID ${id} not found`);
            }
            return entity;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to find ${this.entityName} with ID ${id}`, error);
            throw error;
        }
    }
    async findOneOrNull(id, relations = []) {
        try {
            return await this.repository.findOne({
                where: { id },
                relations,
            });
        }
        catch (error) {
            this.logger.error(`Failed to find ${this.entityName} with ID ${id}`, error);
            return null;
        }
    }
    async create(createDto, userId) {
        try {
            const entityData = {
                ...createDto,
                ...(userId && { createdBy: userId }),
            };
            const entity = this.repository.create(entityData);
            const savedEntity = await this.repository.save(entity);
            if (this.options.enableEvents && this.eventEmitter) {
                this.eventEmitter.emit(`${this.entityName.toLowerCase()}.created`, {
                    entity: savedEntity,
                    userId,
                });
            }
            this.logger.log(`${this.entityName} created with ID ${savedEntity.id}`);
            return savedEntity;
        }
        catch (error) {
            this.logger.error(`Failed to create ${this.entityName}`, error);
            throw error;
        }
    }
    async update(id, updateDto, userId) {
        try {
            const existingEntity = await this.findOne(id);
            const updateData = {
                ...updateDto,
                ...(userId && { updatedBy: userId }),
                updatedAt: new Date(),
            };
            Object.assign(existingEntity, updateData);
            const savedEntity = await this.repository.save(existingEntity);
            if (this.options.enableEvents && this.eventEmitter) {
                this.eventEmitter.emit(`${this.entityName.toLowerCase()}.updated`, {
                    entity: savedEntity,
                    previousEntity: existingEntity,
                    userId,
                });
            }
            this.logger.log(`${this.entityName} updated with ID ${id}`);
            return savedEntity;
        }
        catch (error) {
            this.logger.error(`Failed to update ${this.entityName} with ID ${id}`, error);
            throw error;
        }
    }
    async remove(id, userId) {
        try {
            const entity = await this.findOne(id);
            const result = await this.repository.softDelete(id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`${this.entityName} with ID ${id} not found`);
            }
            if (this.options.enableEvents && this.eventEmitter) {
                this.eventEmitter.emit(`${this.entityName.toLowerCase()}.deleted`, {
                    entityId: id,
                    entity,
                    userId,
                });
            }
            this.logger.log(`${this.entityName} soft deleted with ID ${id}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete ${this.entityName} with ID ${id}`, error);
            throw error;
        }
    }
    async hardRemove(id, userId) {
        try {
            const entity = await this.findOne(id);
            const result = await this.repository.delete(id);
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`${this.entityName} with ID ${id} not found`);
            }
            if (this.options.enableEvents && this.eventEmitter) {
                this.eventEmitter.emit(`${this.entityName.toLowerCase()}.hardDeleted`, {
                    entityId: id,
                    entity,
                    userId,
                });
            }
            this.logger.warn(`${this.entityName} hard deleted with ID ${id}`);
        }
        catch (error) {
            this.logger.error(`Failed to hard delete ${this.entityName} with ID ${id}`, error);
            throw error;
        }
    }
    async bulkCreate(createDtos, userId) {
        try {
            const entityData = createDtos.map(dto => ({
                ...dto,
                ...(userId && { createdBy: userId }),
            }));
            const entities = this.repository.create(entityData);
            const savedEntities = await this.repository.save(entities);
            if (this.options.enableEvents && this.eventEmitter) {
                this.eventEmitter.emit(`${this.entityName.toLowerCase()}.bulkCreated`, {
                    entities: savedEntities,
                    count: savedEntities.length,
                    userId,
                });
            }
            this.logger.log(`${savedEntities.length} ${this.entityName} entities created`);
            return savedEntities;
        }
        catch (error) {
            this.logger.error(`Failed to bulk create ${this.entityName} entities`, error);
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await this.repository.count({ where: { id } });
            return count > 0;
        }
        catch (error) {
            this.logger.error(`Failed to check existence of ${this.entityName} with ID ${id}`, error);
            return false;
        }
    }
    async count(filters = {}) {
        try {
            const findOptions = this.buildFindOptions(filters);
            return await this.repository.count(findOptions);
        }
        catch (error) {
            this.logger.error(`Failed to count ${this.entityName} entities`, error);
            throw error;
        }
    }
    async findByIds(ids) {
        try {
            if (ids.length === 0)
                return [];
            const entities = this.repository.findByIds
                ? await this.repository.findByIds(ids)
                : await this.repository.find({ where: { id: { $in: ids } } });
            return ids.map(id => entities.find((entity) => entity.id === id)).filter(Boolean);
        }
        catch (error) {
            this.logger.error(`Failed to find ${this.entityName} entities by IDs`, error);
            throw error;
        }
    }
    buildFindOptions(filters, orderBy, orderDirection) {
        const where = {};
        const relations = [];
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters.fromDate || filters.toDate) {
            where.createdAt = {};
            if (filters.fromDate)
                where.createdAt.gte = filters.fromDate;
            if (filters.toDate)
                where.createdAt.lte = filters.toDate;
        }
        if (filters.search) {
            this.applySearchFilter(where, filters.search);
        }
        this.applyCustomFilters(where, filters);
        const findOptions = { where };
        if (orderBy && orderDirection) {
            findOptions.order = { [orderBy]: orderDirection };
        }
        if (relations.length > 0) {
            findOptions.relations = relations;
        }
        return findOptions;
    }
    applySearchFilter(where, search) {
    }
    applyCustomFilters(where, filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && !['page', 'limit', 'orderBy', 'orderDirection', 'isActive', 'search', 'fromDate', 'toDate'].includes(key)) {
                where[key] = value;
            }
        });
    }
    getDefaultRelations() {
        return [];
    }
    validateCreateDto(createDto) {
        if (!createDto) {
            throw new common_1.BadRequestException('Create data is required');
        }
    }
    validateUpdateDto(updateDto) {
        if (!updateDto) {
            throw new common_1.BadRequestException('Update data is required');
        }
    }
    async executeInTransaction(fn) {
        return await this.repository.manager.transaction(fn);
    }
    getRepository() {
        return this.repository;
    }
    createQueryBuilder(alias) {
        return this.repository.createQueryBuilder(alias || this.entityName.toLowerCase());
    }
};
exports.BaseService = BaseService;
exports.BaseService = BaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, event_emitter_1.EventEmitter2, Object])
], BaseService);
let HealthcareBaseService = class HealthcareBaseService extends BaseService {
    constructor(repository, eventEmitter, options = {}) {
        super(repository, eventEmitter, {
            enableAudit: true,
            enableEvents: true,
            ...options,
        });
    }
    async findByStudentId(studentId, userId) {
        try {
            this.logger.log(`PHI ACCESS: ${this.entityName} records accessed for student ${studentId}`, {
                userId,
                studentId,
                entityType: this.entityName,
                timestamp: new Date().toISOString(),
            });
            return await this.repository.find({
                where: { studentId },
                order: { createdAt: 'DESC' },
            });
        }
        catch (error) {
            this.logger.error(`Failed to find ${this.entityName} entities for student ${studentId}`, error);
            throw error;
        }
    }
    async create(createDto, userId) {
        this.logger.log(`PHI MODIFICATION: ${this.entityName} created`, {
            userId,
            entityType: this.entityName,
            timestamp: new Date().toISOString(),
        });
        return await super.create(createDto, userId);
    }
    async update(id, updateDto, userId) {
        this.logger.log(`PHI MODIFICATION: ${this.entityName} updated`, {
            userId,
            entityId: id,
            entityType: this.entityName,
            timestamp: new Date().toISOString(),
        });
        return await super.update(id, updateDto, userId);
    }
    async remove(id, userId) {
        this.logger.warn(`PHI MODIFICATION: ${this.entityName} deleted`, {
            userId,
            entityId: id,
            entityType: this.entityName,
            timestamp: new Date().toISOString(),
        });
        return await super.remove(id, userId);
    }
};
exports.HealthcareBaseService = HealthcareBaseService;
exports.HealthcareBaseService = HealthcareBaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, event_emitter_1.EventEmitter2, Object])
], HealthcareBaseService);
class ServiceUtils {
    static async withErrorHandling(operation, errorContext, logger) {
        try {
            return await operation();
        }
        catch (error) {
            logger.error(`${errorContext}: ${error.message}`, error.stack);
            throw error;
        }
    }
    static validatePagination(options) {
        const { page = 1, limit = 20 } = options;
        if (page < 1) {
            throw new common_1.BadRequestException('Page must be greater than 0');
        }
        if (limit < 1 || limit > 100) {
            throw new common_1.BadRequestException('Limit must be between 1 and 100');
        }
    }
    static buildSearchQuery(searchTerm, fields) {
        if (!searchTerm || fields.length === 0)
            return {};
        const searchConditions = fields.map(field => ({
            [field]: { $regex: searchTerm, $options: 'i' }
        }));
        return { $or: searchConditions };
    }
    static sanitizeSortParams(orderBy = 'createdAt', orderDirection = 'DESC', allowedFields = ['createdAt', 'updatedAt', 'name', 'id']) {
        const sanitizedOrderBy = allowedFields.includes(orderBy) ? orderBy : 'createdAt';
        const sanitizedDirection = ['ASC', 'DESC'].includes(orderDirection.toUpperCase())
            ? orderDirection.toUpperCase()
            : 'DESC';
        return {
            orderBy: sanitizedOrderBy,
            orderDirection: sanitizedDirection,
        };
    }
}
exports.ServiceUtils = ServiceUtils;
//# sourceMappingURL=service-utilities.js.map