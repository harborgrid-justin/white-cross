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
exports.SecurityAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const database_1 = require("../../../database");
const base_1 = require("../../../common/base");
let SecurityAnalysisService = class SecurityAnalysisService extends base_1.BaseService {
    auditLogModel;
    constructor(auditLogModel) {
        super('SecurityAnalysisService');
        this.auditLogModel = auditLogModel;
    }
    async detectSuspiciousLogins(startDate, endDate) {
        try {
            const failedLogins = await this.auditLogModel.findAll({
                where: {
                    createdAt: {
                        [sequelize_2.Op.between]: [startDate, endDate],
                    },
                    action: 'LOGIN',
                    [sequelize_2.Op.and]: [(0, sequelize_2.literal)(`changes->>'success' = 'false'`), { ipAddress: { [sequelize_2.Op.ne]: null } }],
                },
                order: [['createdAt', 'DESC']],
            });
            const ipFailureMap = {};
            failedLogins.forEach((log) => {
                if (log.ipAddress) {
                    ipFailureMap[log.ipAddress] = (ipFailureMap[log.ipAddress] || 0) + 1;
                }
            });
            const suspiciousIPs = Object.entries(ipFailureMap)
                .filter(([_, count]) => count >= 5)
                .map(([ip, count]) => ({
                ipAddress: ip,
                failedAttempts: count,
            }));
            return {
                period: { start: startDate, end: endDate },
                totalFailedLogins: failedLogins.length,
                suspiciousIPs,
                riskLevel: suspiciousIPs.length > 0 ? 'HIGH' : failedLogins.length > 20 ? 'MEDIUM' : 'LOW',
            };
        }
        catch (error) {
            this.logError('Error detecting suspicious logins:', error);
            throw new Error('Failed to detect suspicious logins');
        }
    }
    async generateSecurityReport(startDate, endDate) {
        try {
            const suspiciousLogins = await this.detectSuspiciousLogins(startDate, endDate);
            let overallRiskScore = 0;
            if (suspiciousLogins.riskLevel === 'HIGH')
                overallRiskScore += 3;
            else if (suspiciousLogins.riskLevel === 'MEDIUM')
                overallRiskScore += 2;
            else if (suspiciousLogins.riskLevel === 'LOW')
                overallRiskScore += 1;
            const riskLevel = overallRiskScore >= 10
                ? 'CRITICAL'
                : overallRiskScore >= 6
                    ? 'HIGH'
                    : overallRiskScore >= 3
                        ? 'MEDIUM'
                        : 'LOW';
            return {
                period: { start: startDate, end: endDate },
                overallRiskLevel: riskLevel,
                overallRiskScore,
                findings: {
                    suspiciousLogins,
                },
                summary: {
                    totalSecurityEvents: suspiciousLogins.suspiciousIPs.length,
                },
            };
        }
        catch (error) {
            this.logError('Error generating security report:', error);
            throw new Error('Failed to generate security report');
        }
    }
};
exports.SecurityAnalysisService = SecurityAnalysisService;
exports.SecurityAnalysisService = SecurityAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(database_1.AuditLog)),
    __metadata("design:paramtypes", [Object])
], SecurityAnalysisService);
//# sourceMappingURL=security-analysis.service.js.map