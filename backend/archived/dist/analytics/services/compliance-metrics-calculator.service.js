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
exports.ComplianceMetricsCalculatorService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
let ComplianceMetricsCalculatorService = class ComplianceMetricsCalculatorService extends base_1.BaseService {
    constructor() {
        super("ComplianceMetricsCalculatorService");
    }
    calculateImmunizationMetrics(totalStudents) {
        const compliantStudents = Math.floor(totalStudents * 0.943);
        const nonCompliantStudents = totalStudents - compliantStudents;
        const complianceRate = Number(((compliantStudents / totalStudents) * 100).toFixed(1));
        const vaccineCompliance = {
            MMR: { compliant: Math.floor(totalStudents * 0.962), rate: 96.2 },
            DTaP: { compliant: Math.floor(totalStudents * 0.958), rate: 95.8 },
            Varicella: { compliant: Math.floor(totalStudents * 0.941), rate: 94.1 },
            HPV: { compliant: Math.floor(totalStudents * 0.873), rate: 87.3 },
            Hepatitis: { compliant: Math.floor(totalStudents * 0.951), rate: 95.1 },
        };
        const gradeLevelAnalysis = {
            kindergarten: {
                students: Math.floor(totalStudents * 0.15),
                compliant: Math.floor(totalStudents * 0.15 * 0.975),
            },
            elementary: {
                students: Math.floor(totalStudents * 0.4),
                compliant: Math.floor(totalStudents * 0.4 * 0.952),
            },
            middle: {
                students: Math.floor(totalStudents * 0.25),
                compliant: Math.floor(totalStudents * 0.25 * 0.928),
            },
            high: {
                students: Math.floor(totalStudents * 0.2),
                compliant: Math.floor(totalStudents * 0.2 * 0.903),
            },
        };
        return {
            compliantStudents,
            nonCompliantStudents,
            complianceRate,
            vaccineCompliance,
            gradeLevelAnalysis,
        };
    }
    calculateControlledSubstanceMetrics(totalRecords) {
        const compliantRecords = Math.floor(totalRecords * 0.993);
        const nonCompliantRecords = totalRecords - compliantRecords;
        const complianceRate = 99.3;
        const scheduleBreakdown = {
            scheduleII: { transactions: 145, compliant: 145 },
            scheduleIII: { transactions: 89, compliant: 88 },
            scheduleIV: { transactions: 53, compliant: 52 },
        };
        return {
            compliantRecords,
            nonCompliantRecords,
            complianceRate,
            scheduleBreakdown,
        };
    }
    calculateHIPAAMetrics() {
        const totalAccessEvents = 5234;
        const compliantAccess = 5198;
        const nonCompliantAccess = 36;
        const complianceRate = 99.3;
        const accessByRole = {
            nurses: 3456,
            administrators: 1234,
            teachers: 544,
        };
        return {
            totalAccessEvents,
            compliantAccess,
            nonCompliantAccess,
            complianceRate,
            accessByRole,
        };
    }
    calculateScreeningMetrics(totalStudents) {
        const screenedStudents = Math.floor(totalStudents * 0.92);
        const pendingScreenings = totalStudents - screenedStudents;
        const complianceRate = 92.0;
        const screeningBreakdown = {
            vision: {
                completed: Math.floor(totalStudents * 0.94),
                pending: Math.floor(totalStudents * 0.06),
            },
            hearing: {
                completed: Math.floor(totalStudents * 0.93),
                pending: Math.floor(totalStudents * 0.07),
            },
            dental: {
                completed: Math.floor(totalStudents * 0.86),
                pending: Math.floor(totalStudents * 0.14),
            },
            scoliosis: {
                completed: Math.floor(totalStudents * 0.91),
                pending: Math.floor(totalStudents * 0.09),
            },
        };
        return {
            screenedStudents,
            pendingScreenings,
            complianceRate,
            screeningBreakdown,
        };
    }
    calculateGradeLevelRate(compliant, total) {
        if (total === 0)
            return 0;
        return Number(((compliant / total) * 100).toFixed(1));
    }
    determineComplianceStatus(complianceRate, threshold = 95) {
        if (complianceRate >= threshold) {
            return 'COMPLIANT';
        }
        else if (complianceRate >= threshold * 0.8) {
            return 'PARTIALLY_COMPLIANT';
        }
        else {
            return 'NON_COMPLIANT';
        }
    }
    calculatePercentage(numerator, denominator, decimals = 1) {
        if (denominator === 0)
            return 0;
        return Number(((numerator / denominator) * 100).toFixed(decimals));
    }
};
exports.ComplianceMetricsCalculatorService = ComplianceMetricsCalculatorService;
exports.ComplianceMetricsCalculatorService = ComplianceMetricsCalculatorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ComplianceMetricsCalculatorService);
//# sourceMappingURL=compliance-metrics-calculator.service.js.map