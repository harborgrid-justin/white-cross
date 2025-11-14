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
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const base_1 = require("../../../common/base");
let ComplianceService = class ComplianceService extends base_1.BaseService {
    eventEmitter;
    constructor(eventEmitter) {
        super('ComplianceService');
        this.eventEmitter = eventEmitter;
    }
    getComplianceMetrics() {
        try {
            const metrics = {
                hipaaCompliance: 98.5,
                consentFormCompletion: 92.3,
                immunizationCompliance: 95.7,
                staffCertifications: 100,
                documentRetention: 97.2,
            };
            this.logInfo('Compliance metrics retrieved', metrics);
            const lowMetrics = Object.entries(metrics).filter(([, value]) => value < 95);
            if (lowMetrics.length > 0) {
                this.eventEmitter.emit('analytics.compliance.warning', {
                    lowMetrics: lowMetrics.map(([name, value]) => ({ name, value })),
                    timestamp: new Date(),
                });
            }
            return metrics;
        }
        catch (error) {
            this.logError('Error getting compliance metrics', {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map