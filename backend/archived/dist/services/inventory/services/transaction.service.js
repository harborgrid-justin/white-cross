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
exports.InventoryTransactionService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const request_context_service_1 = require("../../../common/context/request-context.service");
const base_1 = require("../../../common/base");
const models_1 = require("../../../database/models");
let InventoryTransactionService = class InventoryTransactionService extends base_1.BaseService {
    requestContext;
    transactionModel;
    constructor(requestContext, transactionModel) {
        super(requestContext);
        this.requestContext = requestContext;
        this.transactionModel = transactionModel;
    }
    async createTransaction(data) {
        try {
            const transaction = await this.transactionModel.create({
                ...data,
                expirationDate: data.expirationDate
                    ? new Date(data.expirationDate)
                    : undefined,
            });
            this.logger.log(`Inventory transaction created: ${transaction.type} - ${transaction.quantity} units`);
            return transaction;
        }
        catch (error) {
            this.logger.error('Error creating inventory transaction:', error);
            throw error;
        }
    }
    async getTransactionsByItem(inventoryItemId) {
        try {
            const transactions = await this.transactionModel.findAll({
                where: { inventoryItemId },
                order: [['createdAt', 'DESC']],
            });
            return transactions;
        }
        catch (error) {
            this.logger.error('Error getting transactions:', error);
            throw error;
        }
    }
};
exports.InventoryTransactionService = InventoryTransactionService;
exports.InventoryTransactionService = InventoryTransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, sequelize_1.InjectModel)(models_1.InventoryTransaction)),
    __metadata("design:paramtypes", [request_context_service_1.RequestContextService, Object])
], InventoryTransactionService);
//# sourceMappingURL=transaction.service.js.map