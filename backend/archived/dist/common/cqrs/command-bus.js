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
var CommandBus_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBus = void 0;
const common_1 = require("@nestjs/common");
let CommandBus = CommandBus_1 = class CommandBus {
    transactionManager;
    logger = new common_1.Logger(CommandBus_1.name);
    handlers = new Map();
    constructor(transactionManager) {
        this.transactionManager = transactionManager;
    }
    registerHandler(commandType, handler) {
        this.handlers.set(commandType, handler);
        this.logger.log(`Registered command handler for: ${commandType}`);
    }
    async execute(command) {
        const startTime = Date.now();
        const correlationId = this.generateCorrelationId();
        try {
            this.logger.log(`Executing command: ${command.type}`, {
                correlationId,
                commandType: command.type
            });
            const handler = this.handlers.get(command.type);
            if (!handler) {
                throw new Error(`No handler registered for command: ${command.type}`);
            }
            let result;
            if (this.transactionManager) {
                result = await this.transactionManager.executeInTransaction(() => handler.execute(command));
            }
            else {
                result = await handler.execute(command);
            }
            const executionTime = Date.now() - startTime;
            this.logger.log(`Command executed successfully: ${command.type}`, {
                correlationId,
                executionTime,
                success: result.success
            });
            return {
                ...result,
                correlationId
            };
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            this.logger.error(`Command execution failed: ${command.type}`, {
                correlationId,
                executionTime,
                error: error.message,
                stack: error.stack
            });
            return {
                success: false,
                error: error.message,
                correlationId
            };
        }
    }
    getRegisteredCommands() {
        return Array.from(this.handlers.keys());
    }
    hasHandler(commandType) {
        return this.handlers.has(commandType);
    }
    generateCorrelationId() {
        return `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.CommandBus = CommandBus;
exports.CommandBus = CommandBus = CommandBus_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)('TRANSACTION_MANAGER')),
    __metadata("design:paramtypes", [Object])
], CommandBus);
//# sourceMappingURL=command-bus.js.map