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
exports.BaseQueueProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
class BaseQueueProcessor {
    logger;
    constructor(processorName) {
        this.logger = new common_1.Logger(processorName);
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async executeJobWithCommonHandling(job, jobData, executionFn) {
        const startTime = Date.now();
        const identifier = jobData.messageId || jobData.type || 'unknown';
        const operation = jobData.operation || job.name;
        this.logger.log(`Processing ${operation} for ${identifier}`);
        try {
            const result = await executionFn();
            const processingTime = Date.now() - startTime;
            this.logger.log(`${operation} completed for ${identifier} (${processingTime}ms)`);
            return {
                success: true,
                data: result,
                metadata: {
                    processingTime,
                    attempts: job.attemptsMade,
                    completedAt: new Date(),
                },
            };
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;
            this.logger.error(`${operation} failed for ${identifier}: ${errorMessage}`, errorStack);
            return {
                success: false,
                error: {
                    message: errorMessage,
                    stack: errorStack,
                },
                metadata: {
                    processingTime,
                    attempts: job.attemptsMade,
                    completedAt: new Date(),
                },
            };
        }
    }
    onActive(job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
    }
    onCompleted(job, result) {
        this.logger.log(`Job ${job.id} completed successfully (attempts: ${result.metadata.attempts})`);
    }
    onFailed(job, error) {
        this.logger.error(`Job ${job.id} failed after ${job.attemptsMade} attempts: ${error.message}`);
    }
}
exports.BaseQueueProcessor = BaseQueueProcessor;
__decorate([
    (0, bull_1.OnQueueActive)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BaseQueueProcessor.prototype, "onActive", null);
__decorate([
    (0, bull_1.OnQueueCompleted)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BaseQueueProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bull_1.OnQueueFailed)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], BaseQueueProcessor.prototype, "onFailed", null);
//# sourceMappingURL=base.processor.js.map