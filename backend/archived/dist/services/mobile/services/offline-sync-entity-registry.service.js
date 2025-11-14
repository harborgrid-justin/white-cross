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
exports.OfflineSyncEntityRegistryService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../../common/base");
let OfflineSyncEntityRegistryService = class OfflineSyncEntityRegistryService extends base_1.BaseService {
    constructor() {
        super("OfflineSyncEntityRegistryService");
    }
    entityServiceRegistry = new Map();
    registerEntityService(entityType, service) {
        this.entityServiceRegistry.set(entityType, service);
        this.logInfo(`Registered entity service for ${entityType}`);
    }
    getEntityService(entityType) {
        const service = this.entityServiceRegistry.get(entityType);
        if (!service) {
            throw new common_1.NotFoundException(`No entity service registered for ${entityType}. ` +
                `Please register the service using registerEntityService()`);
        }
        return service;
    }
    hasEntityService(entityType) {
        return this.entityServiceRegistry.has(entityType);
    }
    getRegisteredEntityTypes() {
        return Array.from(this.entityServiceRegistry.keys());
    }
    clearRegistry() {
        this.entityServiceRegistry.clear();
        this.logInfo('Entity service registry cleared');
    }
};
exports.OfflineSyncEntityRegistryService = OfflineSyncEntityRegistryService;
exports.OfflineSyncEntityRegistryService = OfflineSyncEntityRegistryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OfflineSyncEntityRegistryService);
//# sourceMappingURL=offline-sync-entity-registry.service.js.map