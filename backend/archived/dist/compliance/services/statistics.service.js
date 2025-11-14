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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const compliance_report_repository_1 = require("../repositories/compliance-report.repository");
const checklist_repository_1 = require("../repositories/checklist.repository");
const policy_repository_1 = require("../repositories/policy.repository");
const violation_repository_1 = require("../repositories/violation.repository");
const base_1 = require("../../common/base");
let StatisticsService = class StatisticsService extends base_1.BaseService {
    reportRepository;
    checklistRepository;
    policyRepository;
    violationRepository;
    constructor(reportRepository, checklistRepository, policyRepository, violationRepository) {
        super("StatisticsService");
        this.reportRepository = reportRepository;
        this.checklistRepository = checklistRepository;
        this.policyRepository = policyRepository;
        this.violationRepository = violationRepository;
    }
    async getComplianceStatistics(query) {
        const { period = 'MONTHLY', startDate, endDate } = query;
        const reports = await this.reportRepository.findAll({}, 1, 1000);
        const checklists = await this.checklistRepository.findAll({}, 1, 1000);
        const policies = await this.policyRepository.findAllPolicies({});
        const violations = await this.violationRepository.findAllViolations({}, 1, 1000);
        return {
            period,
            dateRange: startDate && endDate ? { startDate, endDate } : undefined,
            reports: {
                total: reports.total,
                compliant: reports.data.filter((r) => r.status === 'COMPLIANT').length,
                nonCompliant: reports.data.filter((r) => r.status === 'NON_COMPLIANT')
                    .length,
                pending: reports.data.filter((r) => r.status === 'PENDING').length,
            },
            checklists: {
                total: checklists.total,
                completed: checklists.data.filter((c) => c.status === 'COMPLETED')
                    .length,
                pending: checklists.data.filter((c) => c.status === 'PENDING').length,
            },
            policies: {
                total: policies.length,
                active: policies.filter((p) => p.status === 'ACTIVE').length,
                draft: policies.filter((p) => p.status === 'DRAFT').length,
            },
            violations: {
                total: violations.total,
                critical: violations.data.filter((v) => v.severity === 'CRITICAL')
                    .length,
                high: violations.data.filter((v) => v.severity === 'HIGH').length,
                resolved: violations.data.filter((v) => v.status === 'RESOLVED').length,
            },
        };
    }
    async getHipaaStatus() {
        const reports = await this.reportRepository.findAll({ reportType: 'HIPAA' }, 1, 100);
        const violations = await this.violationRepository.findAllViolations({ violationType: 'HIPAA_BREACH' }, 1, 100);
        return {
            compliant: reports.data.filter((r) => r.status === 'COMPLIANT').length > 0,
            recentReports: reports.data.slice(0, 5),
            openViolations: violations.data.filter((v) => v.status !== 'RESOLVED')
                .length,
            lastReviewDate: reports.data[0]?.reviewedAt || null,
        };
    }
    async getFerpaStatus() {
        const reports = await this.reportRepository.findAll({ reportType: 'FERPA' }, 1, 100);
        const violations = await this.violationRepository.findAllViolations({ violationType: 'FERPA_VIOLATION' }, 1, 100);
        return {
            compliant: reports.data.filter((r) => r.status === 'COMPLIANT').length > 0,
            recentReports: reports.data.slice(0, 5),
            openViolations: violations.data.filter((v) => v.status !== 'RESOLVED')
                .length,
            lastReviewDate: reports.data[0]?.reviewedAt || null,
        };
    }
    async getComplianceDashboard() {
        const [statistics, hipaaStatus, ferpaStatus] = await Promise.all([
            this.getComplianceStatistics({}),
            this.getHipaaStatus(),
            this.getFerpaStatus(),
        ]);
        return {
            overview: statistics,
            hipaa: hipaaStatus,
            ferpa: ferpaStatus,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ComplianceReportRepository')),
    __metadata("design:paramtypes", [compliance_report_repository_1.ComplianceReportRepository,
        checklist_repository_1.ChecklistRepository,
        policy_repository_1.PolicyRepository,
        violation_repository_1.ViolationRepository])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map