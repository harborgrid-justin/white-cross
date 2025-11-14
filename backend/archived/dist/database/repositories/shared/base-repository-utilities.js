"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepositoryUtilities = void 0;
const common_1 = require("@nestjs/common");
class BaseRepositoryUtilities {
    static createRepositoryLogger(repositoryName) {
        return new common_1.Logger(repositoryName);
    }
    static initializeRepository(dataSource, entityClass, repositoryName) {
        throw new Error('Deprecated: Use Sequelize repository initialization instead');
    }
    static handleRepositoryError(logger, operation, error, entityId) {
        const entityInfo = entityId ? ` (ID: ${entityId})` : '';
        const errorMessage = `Failed to ${operation}${entityInfo}: ${error.message}`;
        logger.error(errorMessage, error);
        throw new Error(errorMessage);
    }
    static logRepositorySuccess(logger, operation, entityName, entityId, additionalInfo) {
        const entityInfo = entityId ? ` (ID: ${entityId})` : '';
        const additional = additionalInfo
            ? ` - ${Object.entries(additionalInfo).map(([k, v]) => `${k}: ${v}`).join(', ')}`
            : '';
        logger.log(`Successfully ${operation} ${entityName}${entityInfo}${additional}`);
    }
    static createQueryBuilderWithErrorHandling(repository, alias, logger, operation) {
        throw new Error('Deprecated: Use Sequelize query builder patterns instead');
    }
    static async executeInTransaction(dataSource, operation, logger, operationName) {
        throw new Error('Deprecated: Use Sequelize transaction management instead');
    }
    static async findWithErrorHandling(repository, logger, entityName, findOptions) {
        throw new Error('Deprecated: Use Sequelize repository find methods instead');
    }
    static async findOneWithErrorHandling(repository, logger, entityName, findOptions) {
        throw new Error('Deprecated: Use Sequelize repository findOne methods instead');
    }
    static async saveWithErrorHandling(repository, logger, entityName, entity, entityId) {
        throw new Error('Deprecated: Use Sequelize repository save methods instead');
    }
    static async deleteWithErrorHandling(repository, logger, entityName, criteria) {
        throw new Error('Deprecated: Use Sequelize repository delete methods instead');
    }
    static async countWithErrorHandling(repository, logger, entityName, countOptions) {
        throw new Error('Deprecated: Use Sequelize repository count methods instead');
    }
    static applyPagination(queryBuilder, page = 1, limit = 10) {
        throw new Error('Deprecated: Use Sequelize pagination (limit/offset) instead');
    }
    static applySorting(queryBuilder, sortField, sortOrder = 'ASC') {
        throw new Error('Deprecated: Use Sequelize order clause instead');
    }
    static applyTextSearch(queryBuilder, searchTerm, searchFields, alias) {
        throw new Error('Deprecated: Use Sequelize Op.iLike or Op.like instead');
    }
    static applyDateRangeFilter(queryBuilder, dateField, startDate, endDate) {
        throw new Error('Deprecated: Use Sequelize Op.between, Op.gte, Op.lte instead');
    }
    static async checkExistsWithErrorHandling(repository, logger, entityName, criteria) {
        throw new Error('Deprecated: Use Sequelize repository count methods instead');
    }
}
exports.BaseRepositoryUtilities = BaseRepositoryUtilities;
//# sourceMappingURL=base-repository-utilities.js.map