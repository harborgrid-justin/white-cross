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
exports.SequelizeUnitOfWorkService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const base_1 = require("../../common/base");
let SequelizeUnitOfWorkService = class SequelizeUnitOfWorkService extends base_1.BaseService {
    sequelize;
    auditLogger;
    transaction = null;
    constructor(sequelize, auditLogger) {
        super({ serviceName: 'SequelizeUnitOfWorkService' });
        this.sequelize = sequelize;
        this.auditLogger = auditLogger;
    }
    async begin() {
        if (this.transaction) {
            throw new Error('Transaction already in progress');
        }
        this.transaction = await this.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        });
        this.logDebug('Transaction begun');
    }
    async commit() {
        if (!this.transaction) {
            throw new Error('No transaction in progress');
        }
        await this.transaction.commit();
        this.transaction = null;
        this.logDebug('Transaction committed');
    }
    async rollback() {
        if (!this.transaction) {
            throw new Error('No transaction in progress');
        }
        await this.transaction.rollback();
        this.transaction = null;
        this.logDebug('Transaction rolled back');
    }
    isInTransaction() {
        return this.transaction !== null;
    }
    async executeInTransaction(operation, context) {
        const transactionId = context.transactionId || this.generateTransactionId();
        const startTime = Date.now();
        this.logInfo(`Starting transaction ${transactionId}`);
        try {
            const result = await this.sequelize.transaction({
                isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
            }, async (t) => {
                this.transaction = t;
                this.logDebug(`Transaction ${transactionId} executing operation`);
                const operationResult = await operation(this);
                this.logDebug(`Transaction ${transactionId} operation completed successfully`);
                return operationResult;
            });
            const duration = Date.now() - startTime;
            await this.auditLogger.logTransaction('TRANSACTION_COMMIT', context, {
                transactionId,
                duration,
                success: true,
            });
            this.logInfo(`Transaction ${transactionId} committed successfully (${duration}ms)`);
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            await this.auditLogger.logTransaction('TRANSACTION_ROLLBACK', context, {
                transactionId,
                duration,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            this.logError(`Transaction ${transactionId} rolled back (${duration}ms)`, error instanceof Error ? error.stack : String(error));
            throw error;
        }
        finally {
            this.transaction = null;
        }
    }
    generateTransactionId() {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 15);
        return `txn_${timestamp}_${randomStr}`;
    }
};
exports.SequelizeUnitOfWorkService = SequelizeUnitOfWorkService;
exports.SequelizeUnitOfWorkService = SequelizeUnitOfWorkService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('IAuditLogger')),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize, Object])
], SequelizeUnitOfWorkService);
//# sourceMappingURL=sequelize-unit-of-work.service.js.map