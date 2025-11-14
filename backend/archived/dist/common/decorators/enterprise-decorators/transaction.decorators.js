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
exports.SequelizeTransactionManager = exports.TRANSACTION_METADATA = void 0;
exports.Transaction = Transaction;
exports.NestedTransaction = NestedTransaction;
exports.ReadOnlyTransaction = ReadOnlyTransaction;
exports.TransactionTimeout = TransactionTimeout;
exports.TransactionBoundary = TransactionBoundary;
const common_1 = require("@nestjs/common");
exports.TRANSACTION_METADATA = 'enterprise:transaction';
let SequelizeTransactionManager = class SequelizeTransactionManager {
    sequelize;
    constructor(sequelize) {
        this.sequelize = sequelize;
    }
    async beginTransaction(options) {
        const transactionOptions = {};
        if (options?.isolationLevel) {
            transactionOptions.isolationLevel = this.mapIsolationLevel(options.isolationLevel);
        }
        return await this.sequelize.transaction(transactionOptions);
    }
    async commitTransaction(transaction) {
        await transaction.commit();
    }
    async rollbackTransaction(transaction) {
        await transaction.rollback();
    }
    async executeInTransaction(operation, options) {
        const transaction = await this.beginTransaction(options);
        try {
            const result = await operation(transaction);
            await this.commitTransaction(transaction);
            return result;
        }
        catch (error) {
            await this.rollbackTransaction(transaction);
            if (options?.retryOnDeadlock && this.isDeadlockError(error)) {
                return await this.retryOperation(operation, options);
            }
            throw error;
        }
    }
    isInTransaction() {
        return false;
    }
    mapIsolationLevel(level) {
        const levels = {
            'READ_UNCOMMITTED': 'READ_UNCOMMITTED',
            'READ_COMMITTED': 'READ_COMMITTED',
            'REPEATABLE_READ': 'REPEATABLE_READ',
            'SERIALIZABLE': 'SERIALIZABLE'
        };
        return levels[level] || 'READ_COMMITTED';
    }
    isDeadlockError(error) {
        return error?.name === 'SequelizeDatabaseError' &&
            error?.original?.code === 'ER_LOCK_DEADLOCK';
    }
    async retryOperation(operation, options) {
        const maxRetries = options.maxRetries || 3;
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.executeInTransaction(operation, {
                    ...options,
                    retryOnDeadlock: false
                });
            }
            catch (error) {
                lastError = error;
                if (!this.isDeadlockError(error) || attempt === maxRetries) {
                    break;
                }
                const delay = Math.pow(2, attempt) * 100;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw lastError;
    }
};
exports.SequelizeTransactionManager = SequelizeTransactionManager;
exports.SequelizeTransactionManager = SequelizeTransactionManager = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SEQUELIZE')),
    __metadata("design:paramtypes", [Object])
], SequelizeTransactionManager);
function Transaction(options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const transactionManager = this.transactionManager;
            if (!transactionManager) {
                console.warn(`No transaction manager available for ${methodName}`);
                return await originalMethod.apply(this, args);
            }
            if (transactionManager.isInTransaction() && !options.isolationLevel) {
                return await originalMethod.apply(this, args);
            }
            return await transactionManager.executeInTransaction(async (transaction) => {
                const transactionContext = { ...this, transaction };
                return await originalMethod.apply(transactionContext, args);
            }, options);
        };
        (0, common_1.SetMetadata)(exports.TRANSACTION_METADATA, options)(target, propertyKey, descriptor);
    };
}
function NestedTransaction(options = {}) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        descriptor.value = async function (...args) {
            const transactionManager = this.transactionManager;
            if (!transactionManager) {
                return await originalMethod.apply(this, args);
            }
            return await transactionManager.executeInTransaction(async (transaction) => {
                const transactionContext = { ...this, transaction };
                return await originalMethod.apply(transactionContext, args);
            }, options);
        };
        (0, common_1.SetMetadata)('enterprise:nested-transaction', options)(target, propertyKey, descriptor);
    };
}
function ReadOnlyTransaction() {
    return Transaction({
        isolationLevel: 'READ_COMMITTED'
    });
}
function TransactionTimeout(timeoutMs) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`Transaction timeout after ${timeoutMs}ms`)), timeoutMs);
            });
            return await Promise.race([
                originalMethod.apply(this, args),
                timeoutPromise
            ]);
        };
    };
}
function TransactionBoundary(options = {}) {
    return function (target, propertyKey, descriptor) {
        (0, common_1.SetMetadata)('enterprise:transaction-boundary', options)(target, propertyKey, descriptor);
    };
}
//# sourceMappingURL=transaction.decorators.js.map