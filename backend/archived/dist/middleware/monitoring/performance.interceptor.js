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
var PerformanceInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const performance_middleware_1 = require("./performance.middleware");
let PerformanceInterceptor = PerformanceInterceptor_1 = class PerformanceInterceptor {
    performanceMiddleware;
    logger = new common_1.Logger(PerformanceInterceptor_1.name);
    constructor(performanceMiddleware) {
        this.performanceMiddleware = performanceMiddleware;
    }
    intercept(context, next) {
        const handler = context.getHandler();
        const controller = context.getClass();
        const methodName = handler.name;
        const controllerName = controller.name;
        const startTime = Date.now();
        const startMemory = process.memoryUsage();
        this.logger.debug(`Starting ${controllerName}.${methodName}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - startTime;
            const endMemory = process.memoryUsage();
            const memoryDelta = {
                heapUsed: endMemory.heapUsed - startMemory.heapUsed,
                heapTotal: endMemory.heapTotal - startMemory.heapTotal,
                external: endMemory.external - startMemory.external,
                rss: endMemory.rss - startMemory.rss,
            };
            this.logger.debug(`Completed ${controllerName}.${methodName}`, {
                duration: `${duration}ms`,
                memoryDelta: {
                    heapUsed: `${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`,
                    heapTotal: `${(memoryDelta.heapTotal / 1024 / 1024).toFixed(2)}MB`,
                },
            });
            if (duration > 1000) {
                this.logger.warn(`Slow method detected: ${controllerName}.${methodName}`, {
                    duration: `${duration}ms`,
                });
            }
            if (memoryDelta.heapUsed > 10 * 1024 * 1024) {
                this.logger.warn(`High memory usage detected: ${controllerName}.${methodName}`, {
                    heapUsed: `${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`,
                });
            }
        }));
    }
};
exports.PerformanceInterceptor = PerformanceInterceptor;
exports.PerformanceInterceptor = PerformanceInterceptor = PerformanceInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [performance_middleware_1.PerformanceMiddleware])
], PerformanceInterceptor);
//# sourceMappingURL=performance.interceptor.js.map