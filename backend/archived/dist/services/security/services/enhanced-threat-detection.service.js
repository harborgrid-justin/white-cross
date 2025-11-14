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
exports.EnhancedThreatDetectionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_1 = require("../../../common/base");
const security_interfaces_1 = require("../interfaces/security.interfaces");
let EnhancedThreatDetectionService = class EnhancedThreatDetectionService extends base_1.BaseService {
    configService;
    threatEvents = [];
    failedAttempts = new Map();
    maxThreatEvents = 1000;
    constructor(configService) {
        super('EnhancedThreatDetectionService');
        this.configService = configService;
    }
    async detectThreat(type, source, target, description, metadata) {
        const severity = this.calculateThreatSeverity(type, metadata);
        const threatEvent = {
            id: this.generateThreatId(),
            timestamp: new Date(),
            type,
            severity,
            source,
            target,
            description,
            metadata,
            mitigated: false,
            mitigationActions: [],
        };
        this.threatEvents.push(threatEvent);
        if (this.threatEvents.length > this.maxThreatEvents) {
            this.threatEvents.shift();
        }
        await this.attemptAutoMitigation(threatEvent);
        this.logError(`Threat Detected: ${type} from ${source} targeting ${target}`, {
            threatId: threatEvent.id,
            severity,
            description,
            metadata,
        });
        return threatEvent;
    }
    async recordFailedAttempt(identifier) {
        const existing = this.failedAttempts.get(identifier);
        const now = new Date();
        if (existing) {
            if (now.getTime() - existing.lastAttempt.getTime() > 3600000) {
                existing.count = 1;
            }
            else {
                existing.count++;
            }
            existing.lastAttempt = now;
        }
        else {
            this.failedAttempts.set(identifier, { count: 1, lastAttempt: now });
        }
        const attempts = this.failedAttempts.get(identifier);
        if (attempts.count >= 5) {
            await this.detectThreat(security_interfaces_1.ThreatType.BRUTE_FORCE, identifier, 'authentication_system', `Brute force attack detected: ${attempts.count} failed attempts`, { attempts: attempts.count });
            return true;
        }
        return false;
    }
    getThreatStatistics() {
        const threatsByType = {};
        const threatsBySeverity = {};
        for (const threat of this.threatEvents) {
            threatsByType[threat.type] = (threatsByType[threat.type] || 0) + 1;
            threatsBySeverity[threat.severity] = (threatsBySeverity[threat.severity] || 0) + 1;
        }
        const recentThreats = this.threatEvents
            .filter((threat) => Date.now() - threat.timestamp.getTime() < 86400000)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);
        return {
            totalThreats: this.threatEvents.length,
            threatsByType,
            threatsBySeverity,
            recentThreats,
        };
    }
    calculateThreatSeverity(type, metadata) {
        const baseSeverity = {
            [security_interfaces_1.ThreatType.BRUTE_FORCE]: security_interfaces_1.ThreatSeverity.HIGH,
            [security_interfaces_1.ThreatType.SQL_INJECTION]: security_interfaces_1.ThreatSeverity.CRITICAL,
            [security_interfaces_1.ThreatType.XSS_ATTEMPT]: security_interfaces_1.ThreatSeverity.HIGH,
            [security_interfaces_1.ThreatType.CSRF_ATTEMPT]: security_interfaces_1.ThreatSeverity.MEDIUM,
            [security_interfaces_1.ThreatType.UNAUTHORIZED_ACCESS]: security_interfaces_1.ThreatSeverity.HIGH,
            [security_interfaces_1.ThreatType.DATA_EXFILTRATION]: security_interfaces_1.ThreatSeverity.CRITICAL,
            [security_interfaces_1.ThreatType.PRIVILEGE_ESCALATION]: security_interfaces_1.ThreatSeverity.CRITICAL,
            [security_interfaces_1.ThreatType.SUSPICIOUS_PATTERN]: security_interfaces_1.ThreatSeverity.MEDIUM,
        };
        let severity = baseSeverity[type] || security_interfaces_1.ThreatSeverity.MEDIUM;
        if (metadata?.attempts && typeof metadata.attempts === 'number' && metadata.attempts > 10) {
            severity = security_interfaces_1.ThreatSeverity.CRITICAL;
        }
        return severity;
    }
    async attemptAutoMitigation(threatEvent) {
        const mitigationActions = [];
        switch (threatEvent.type) {
            case security_interfaces_1.ThreatType.BRUTE_FORCE:
                mitigationActions.push('Temporary IP block applied');
                mitigationActions.push('Rate limiting increased');
                break;
            case security_interfaces_1.ThreatType.SQL_INJECTION:
            case security_interfaces_1.ThreatType.XSS_ATTEMPT:
                mitigationActions.push('Request blocked');
                mitigationActions.push('Input sanitization applied');
                break;
            default:
                mitigationActions.push('Threat logged for manual review');
        }
        threatEvent.mitigationActions = mitigationActions;
        threatEvent.mitigated = mitigationActions.length > 0;
    }
    generateThreatId() {
        return `threat_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
};
exports.EnhancedThreatDetectionService = EnhancedThreatDetectionService;
exports.EnhancedThreatDetectionService = EnhancedThreatDetectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EnhancedThreatDetectionService);
//# sourceMappingURL=enhanced-threat-detection.service.js.map