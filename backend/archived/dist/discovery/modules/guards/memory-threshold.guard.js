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
var MemoryThresholdGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryThresholdGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const memory_monitor_service_1 = require("../services/memory-monitor.service");
let MemoryThresholdGuard = MemoryThresholdGuard_1 = class MemoryThresholdGuard {
    discoveryService;
    reflector;
    memoryMonitor;
    logger = new common_1.Logger(MemoryThresholdGuard_1.name);
    constructor(discoveryService, reflector, memoryMonitor) {
        this.discoveryService = discoveryService;
        this.reflector = reflector;
        this.memoryMonitor = memoryMonitor;
    }
    canActivate(context) {
        const handler = context.getHandler();
        const controller = context.getClass();
        const memorySensitive = this.reflector.get('memory-sensitive', controller) ||
            this.reflector.get('memory-sensitive', handler);
        if (!memorySensitive) {
            return true;
        }
        const memoryStats = this.memoryMonitor.getMemoryStats();
        const currentMemoryMB = memoryStats.current.heapUsed / 1024 / 1024;
        const warningThreshold = memorySensitive.warningThreshold || 400;
        const blockThreshold = memorySensitive.blockThreshold || 480;
        if (currentMemoryMB > blockThreshold) {
            this.logger.error(`Blocking memory-sensitive operation: ${controller.name}.${handler.name} - Memory: ${currentMemoryMB.toFixed(2)}MB`);
            throw new common_1.ServiceUnavailableException('Service temporarily unavailable due to high memory usage');
        }
        if (currentMemoryMB > warningThreshold) {
            this.logger.warn(`Allowing memory-sensitive operation with warning: ${controller.name}.${handler.name} - Memory: ${currentMemoryMB.toFixed(2)}MB`);
        }
        return true;
    }
};
exports.MemoryThresholdGuard = MemoryThresholdGuard;
exports.MemoryThresholdGuard = MemoryThresholdGuard = MemoryThresholdGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.DiscoveryService,
        core_1.Reflector,
        memory_monitor_service_1.MemoryMonitorService])
], MemoryThresholdGuard);
//# sourceMappingURL=memory-threshold.guard.js.map