"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWithAudit = createWithAudit;
exports.updateWithAudit = updateWithAudit;
exports.softDelete = softDelete;
exports.restoreRecord = restoreRecord;
exports.batchCreateWithAudit = batchCreateWithAudit;
exports.findWithIncludes = findWithIncludes;
exports.findOneWithIncludes = findOneWithIncludes;
exports.findOrCreateWithAudit = findOrCreateWithAudit;
exports.upsertWithAudit = upsertWithAudit;
exports.getCount = getCount;
exports.exists = exists;
const common_1 = require("@nestjs/common");
async function createWithAudit(model, data, audit, options) {
    const logger = new common_1.Logger('CrudOperations::createWithAudit');
    try {
        const recordData = {
            ...data,
            createdBy: audit.userId,
            createdAt: audit.timestamp,
        };
        const record = await model.create(recordData, options);
        logger.log(`Created ${model.name} record: ${record.id} by user ${audit.userId}`);
        return record;
    }
    catch (error) {
        logger.error(`Failed to create ${model.name} record`, error);
        if (error.name === 'SequelizeValidationError') {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw new common_1.InternalServerErrorException(`Failed to create ${model.name} record`);
    }
}
async function updateWithAudit(model, id, data, audit, options) {
    const logger = new common_1.Logger('CrudOperations::updateWithAudit');
    try {
        const record = await model.findByPk(id, { transaction: options?.transaction });
        if (!record) {
            throw new common_1.NotFoundException(`${model.name} record with ID ${id} not found`);
        }
        const updateData = {
            ...data,
            updatedBy: audit.userId,
            updatedAt: audit.timestamp,
        };
        if (options?.incrementVersion && 'version' in record) {
            updateData.version = (record.version || 0) + 1;
        }
        await record.update(updateData, { transaction: options?.transaction });
        logger.log(`Updated ${model.name} record: ${id} by user ${audit.userId}`);
        return record;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        logger.error(`Failed to update ${model.name} record ${id}`, error);
        throw new common_1.InternalServerErrorException(`Failed to update ${model.name} record`);
    }
}
async function softDelete(model, id, options) {
    const logger = new common_1.Logger('CrudOperations::softDelete');
    try {
        const record = await model.findByPk(id, {
            transaction: options?.transaction,
            paranoid: false
        });
        if (!record) {
            throw new common_1.NotFoundException(`${model.name} record with ID ${id} not found`);
        }
        const recordData = record;
        if (recordData.deletedAt) {
            throw new common_1.BadRequestException(`${model.name} record ${id} is already deleted`);
        }
        const deleteData = {
            deletedAt: new Date(),
        };
        if (options?.deletedBy) {
            deleteData.deletedBy = options.deletedBy;
        }
        if (options?.deleteReason) {
            deleteData.deleteReason = options.deleteReason;
        }
        await record.update(deleteData, { transaction: options?.transaction });
        logger.log(`Soft deleted ${model.name} record: ${id}`);
        return record;
    }
    catch (error) {
        logger.error(`Soft delete failed for ${model.name} ${id}`, error);
        throw error;
    }
}
async function restoreRecord(model, id, audit, options) {
    const logger = new common_1.Logger('CrudOperations::restoreRecord');
    try {
        const record = await model.findByPk(id, {
            transaction: options?.transaction,
            paranoid: false
        });
        if (!record) {
            throw new common_1.NotFoundException(`${model.name} record with ID ${id} not found`);
        }
        const recordData = record;
        if (!recordData.deletedAt) {
            throw new common_1.BadRequestException(`${model.name} record ${id} is not deleted`);
        }
        const restoreData = {
            deletedAt: null,
            deletedBy: undefined,
            deleteReason: undefined,
            updatedBy: audit.userId,
            updatedAt: audit.timestamp,
        };
        await record.update(restoreData, { transaction: options?.transaction });
        logger.log(`Restored ${model.name} record: ${id} by user ${audit.userId}`);
        return record;
    }
    catch (error) {
        logger.error(`Restore failed for ${model.name} ${id}`, error);
        throw error;
    }
}
async function batchCreateWithAudit(model, records, audit, options) {
    const logger = new common_1.Logger('CrudOperations::batchCreateWithAudit');
    const startTime = Date.now();
    const result = {
        success: false,
        totalBatches: 1,
        successfulBatches: 0,
        failedBatches: 0,
        results: [],
        errors: [],
        executionTimeMs: 0,
        averageBatchTimeMs: 0,
        throughput: 0
    };
    try {
        const recordsWithAudit = records.map(record => ({
            ...record,
            createdBy: audit.userId,
            createdAt: audit.timestamp,
        }));
        const created = await model.bulkCreate(recordsWithAudit, {
            validate: true,
            individualHooks: false,
            returning: true,
            ...options
        });
        result.results = created;
        result.successfulBatches = 1;
        result.success = true;
        logger.log(`Batch created ${created.length} ${model.name} records`);
    }
    catch (error) {
        logger.error(`Batch create failed for ${model.name}`, error);
        result.failedBatches = 1;
        result.errors.push({
            batchIndex: -1,
            error: error.message,
        });
    }
    result.executionTimeMs = Date.now() - startTime;
    result.averageBatchTimeMs = result.executionTimeMs;
    result.throughput = result.results.length > 0 ? (result.results.length / result.executionTimeMs) * 1000 : 0;
    return result;
}
async function findWithIncludes(model, where, include, options) {
    const logger = new common_1.Logger('CrudOperations::findWithIncludes');
    try {
        return await model.findAll({
            where,
            include,
            attributes: options?.attributes,
            order: options?.order,
            limit: options?.limit,
            offset: options?.offset,
            transaction: options?.transaction,
            subQuery: false,
            distinct: options?.limit || options?.offset ? true : undefined,
        });
    }
    catch (error) {
        logger.error(`Find with includes failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Failed to fetch ${model.name} records with associations`);
    }
}
async function findOneWithIncludes(model, where, include, options) {
    const logger = new common_1.Logger('CrudOperations::findOneWithIncludes');
    try {
        return await model.findOne({
            where,
            include,
            attributes: options?.attributes,
            transaction: options?.transaction,
            paranoid: options?.paranoid,
        });
    }
    catch (error) {
        logger.error(`Find one with includes failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Failed to fetch ${model.name} record with associations`);
    }
}
async function findOrCreateWithAudit(model, where, defaults, audit, options) {
    const logger = new common_1.Logger('CrudOperations::findOrCreateWithAudit');
    try {
        const defaultsWithAudit = {
            ...defaults,
            createdBy: audit.userId,
            createdAt: audit.timestamp,
        };
        const [record, created] = await model.findOrCreate({
            where,
            defaults: defaultsWithAudit,
            transaction: options?.transaction,
        });
        if (created) {
            logger.log(`Created new ${model.name} record: ${record.id} by user ${audit.userId}`);
        }
        else {
            logger.log(`Found existing ${model.name} record: ${record.id}`);
        }
        return { record, created };
    }
    catch (error) {
        logger.error(`Find or create failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Failed to find or create ${model.name} record`);
    }
}
async function upsertWithAudit(model, data, audit, options) {
    const logger = new common_1.Logger('CrudOperations::upsertWithAudit');
    try {
        const dataWithAudit = {
            ...data,
            createdBy: audit.userId,
            createdAt: audit.timestamp,
            updatedBy: audit.userId,
            updatedAt: audit.timestamp,
        };
        const [record, created] = await model.upsert(dataWithAudit, {
            transaction: options?.transaction,
            returning: true,
        });
        const action = created ? 'Created' : 'Updated';
        logger.log(`${action} ${model.name} record: ${record.id} by user ${audit.userId}`);
        return { record, created };
    }
    catch (error) {
        logger.error(`Upsert failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Failed to upsert ${model.name} record`);
    }
}
async function getCount(model, where, options) {
    const logger = new common_1.Logger('CrudOperations::getCount');
    try {
        return await model.count({
            where,
            include: options?.include,
            transaction: options?.transaction,
            paranoid: options?.paranoid,
            distinct: options?.include ? true : undefined,
        });
    }
    catch (error) {
        logger.error(`Count failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Failed to count ${model.name} records`);
    }
}
async function exists(model, where, options) {
    const logger = new common_1.Logger('CrudOperations::exists');
    try {
        const record = await model.findOne({
            where,
            attributes: ['id'],
            transaction: options?.transaction,
            paranoid: options?.paranoid,
        });
        return record !== null;
    }
    catch (error) {
        logger.error(`Exists check failed for ${model.name}`, error);
        throw new common_1.InternalServerErrorException(`Failed to check if ${model.name} record exists`);
    }
}
//# sourceMappingURL=crud-operations.service.js.map