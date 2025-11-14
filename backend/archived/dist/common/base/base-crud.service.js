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
exports.BaseCrudService = void 0;
const common_1 = require("@nestjs/common");
const base_service_1 = require("./base.service");
let BaseCrudService = class BaseCrudService extends base_service_1.BaseService {
    defaultLimit = 50;
    maxLimit = 1000;
    constructor(context) {
        super(context);
    }
    async createEntity(data, options = {}) {
        return this.executeWithLogging('create entity', async () => {
            this.validateCreateData(data);
            const entity = await this.model.create(data, options);
            this.logInfo(`Entity created: ${entity.constructor.name} ID ${entity.id}`);
            return {
                success: true,
                data: entity,
                message: 'Entity created successfully'
            };
        });
    }
    async findEntityById(id, options = {}) {
        return this.executeWithLogging('find entity by ID', async () => {
            this.validateUUID(id, 'Entity ID');
            const entity = await this.model.findByPk(id, options);
            if (!entity) {
                throw new common_1.NotFoundException(`${this.model.name} with ID ${id} not found`);
            }
            return {
                success: true,
                data: entity
            };
        });
    }
    async findEntities(params = {}) {
        return this.executeWithLogging('find entities', async () => {
            const { page = 1, limit = this.defaultLimit, where, include, order } = params;
            const validatedLimit = Math.min(limit, this.maxLimit);
            const offset = (page - 1) * validatedLimit;
            const { rows, count } = await this.model.findAndCountAll({
                where,
                include,
                order: order || [['createdAt', 'DESC']],
                limit: validatedLimit,
                offset,
                distinct: true
            });
            const totalPages = Math.ceil(count / validatedLimit);
            return {
                success: true,
                data: {
                    rows,
                    count,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalItems: count,
                        itemsPerPage: validatedLimit,
                        hasNextPage: page < totalPages,
                        hasPreviousPage: page > 1
                    }
                }
            };
        });
    }
    async updateEntityById(id, updates, options = {}) {
        return this.executeWithLogging('update entity', async () => {
            this.validateUUID(id, 'Entity ID');
            this.validateUpdateData(updates);
            const entity = await this.model.findByPk(id);
            if (!entity) {
                throw new common_1.NotFoundException(`${this.model.name} with ID ${id} not found`);
            }
            const updatedEntity = await entity.update(updates, options);
            this.logInfo(`Entity updated: ${this.model.name} ID ${id}`);
            return {
                success: true,
                data: updatedEntity,
                message: 'Entity updated successfully'
            };
        });
    }
    async deleteEntityById(id, soft = true) {
        return this.executeWithLogging('delete entity', async () => {
            this.validateUUID(id, 'Entity ID');
            const entity = await this.model.findByPk(id);
            if (!entity) {
                throw new common_1.NotFoundException(`${this.model.name} with ID ${id} not found`);
            }
            if (soft && 'deletedAt' in entity) {
                await entity.update({ deletedAt: new Date() });
            }
            else {
                await entity.destroy();
            }
            this.logInfo(`Entity ${soft ? 'soft deleted' : 'permanently deleted'}: ${this.model.name} ID ${id}`);
            return {
                success: true,
                data: null,
                message: `Entity ${soft ? 'soft deleted' : 'permanently deleted'} successfully`
            };
        });
    }
    async batchCreateEntities(dataArray, options = {}) {
        return this.executeWithLogging('batch create entities', async () => {
            if (!Array.isArray(dataArray) || dataArray.length === 0) {
                throw new common_1.BadRequestException('Data array cannot be empty');
            }
            dataArray.forEach((data, index) => {
                try {
                    this.validateCreateData(data);
                }
                catch (error) {
                    throw new common_1.BadRequestException(`Invalid data at index ${index}: ${error.message}`);
                }
            });
            const entities = await this.model.bulkCreate(dataArray, {
                ...options,
                validate: true,
                returning: true
            });
            this.logInfo(`Batch created ${entities.length} ${this.model.name} entities`);
            return {
                success: true,
                data: entities,
                message: `${entities.length} entities created successfully`,
                metadata: { count: entities.length }
            };
        });
    }
    async countEntities(where = {}) {
        return this.executeWithLogging('count entities', async () => {
            const count = await this.model.count({ where });
            return {
                success: true,
                data: count,
                metadata: { filter: where }
            };
        });
    }
    async entityExists(id) {
        this.validateUUID(id, 'Entity ID');
        const count = await this.model.count({ where: { id } });
        return count > 0;
    }
    validateCreateData(data) {
        if (!data || typeof data !== 'object') {
            throw new common_1.BadRequestException('Invalid data provided');
        }
    }
    validateUpdateData(data) {
        if (!data || typeof data !== 'object') {
            throw new common_1.BadRequestException('Invalid update data provided');
        }
        if (Object.keys(data).length === 0) {
            throw new common_1.BadRequestException('No update fields provided');
        }
    }
};
exports.BaseCrudService = BaseCrudService;
exports.BaseCrudService = BaseCrudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], BaseCrudService);
//# sourceMappingURL=base-crud.service.js.map