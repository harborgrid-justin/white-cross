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
exports.ComplianceReportBuilderService = void 0;
const common_1 = require("@nestjs/common");
const compliance_status_enum_1 = require("../enums/compliance-status.enum");
const report_status_enum_1 = require("../enums/report-status.enum");
const report_type_enum_1 = require("../enums/report-type.enum");
const base_1 = require("../../common/base");
let ComplianceReportBuilderService = class ComplianceReportBuilderService extends base_1.BaseService {
    constructor() {
        super("ComplianceReportBuilderService");
    }
    buildImmunizationReport(params) {
        const { metrics } = params;
        const sections = [
            {
                sectionTitle: 'Executive Summary',
                sectionType: 'summary',
                data: {
                    totalStudents: metrics.totalStudents,
                    compliantStudents: metrics.compliantStudents,
                    nonCompliantStudents: metrics.nonCompliantStudents,
                    complianceRate: metrics.complianceRate,
                    targetRate: 95,
                    periodStart: params.periodStart,
                    periodEnd: params.periodEnd,
                },
                summary: `${metrics.compliantStudents} of ${metrics.totalStudents} students (${metrics.complianceRate}%) are compliant with state immunization requirements. ${metrics.nonCompliantStudents} students require follow-up.`,
            },
            {
                sectionTitle: 'Compliance by Vaccine Type',
                sectionType: 'breakdown',
                data: metrics.vaccineCompliance,
                tables: [
                    {
                        headers: [
                            'Vaccine',
                            'Compliant Students',
                            'Compliance Rate',
                            'Status',
                        ],
                        rows: Object.entries(metrics.vaccineCompliance).map(([vaccine, data]) => [
                            vaccine,
                            data.compliant.toString(),
                            `${data.rate}%`,
                            data.rate >= 95 ? 'Compliant' : 'Below Target',
                        ]),
                    },
                ],
                summary: 'HPV vaccination rate is below the 90% target, requiring focused intervention.',
            },
            {
                sectionTitle: 'Grade-Level Analysis',
                sectionType: 'analysis',
                data: metrics.gradeLevelAnalysis,
                summary: 'Compliance rates decrease with grade level, with high school showing lowest compliance at 90.3%.',
            },
        ];
        const findings = this.identifyImmunizationFindings(metrics.totalStudents, metrics.complianceRate, metrics.nonCompliantStudents, metrics.vaccineCompliance);
        const recommendations = this.generateImmunizationRecommendations(metrics.nonCompliantStudents, metrics.vaccineCompliance);
        return {
            id: this.generateReportId(),
            reportType: report_type_enum_1.ReportType.IMMUNIZATION_COMPLIANCE,
            title: 'Immunization Compliance Report',
            description: 'State-mandated immunization compliance status with detailed breakdown',
            periodStart: params.periodStart,
            periodEnd: params.periodEnd,
            generatedDate: new Date(),
            schoolId: params.schoolId,
            summary: {
                totalRecords: metrics.totalStudents,
                compliantRecords: metrics.compliantStudents,
                nonCompliantRecords: metrics.nonCompliantStudents,
                complianceRate: metrics.complianceRate,
                status: metrics.complianceRate >= 95
                    ? compliance_status_enum_1.ComplianceStatus.COMPLIANT
                    : compliance_status_enum_1.ComplianceStatus.PARTIALLY_COMPLIANT,
            },
            sections,
            findings,
            recommendations,
            status: report_status_enum_1.ReportStatus.COMPLETED,
            format: params.format,
            generatedBy: params.generatedBy,
            createdAt: new Date(),
        };
    }
    buildControlledSubstanceReport(params) {
        const { metrics } = params;
        const sections = [
            {
                sectionTitle: 'Controlled Substance Administration Log',
                sectionType: 'log',
                data: metrics.scheduleBreakdown,
                summary: `${metrics.compliantRecords} of ${metrics.totalRecords} controlled substance transactions properly documented.`,
            },
        ];
        const findings = [
            {
                severity: 'LOW',
                category: 'Documentation',
                issue: 'Missing witness signatures on Schedule II administrations',
                details: '2 Schedule II medication administrations lack required witness signatures',
                affectedCount: 2,
                requiresAction: true,
                responsibleParty: 'Licensed Nurse',
            },
        ];
        return {
            id: this.generateReportId(),
            reportType: report_type_enum_1.ReportType.CONTROLLED_SUBSTANCE,
            title: 'Controlled Substance Log Report',
            description: 'DEA-compliant controlled substance transaction report',
            periodStart: params.periodStart,
            periodEnd: params.periodEnd,
            generatedDate: new Date(),
            schoolId: params.schoolId,
            summary: {
                totalRecords: metrics.totalRecords,
                compliantRecords: metrics.compliantRecords,
                nonCompliantRecords: metrics.nonCompliantRecords,
                complianceRate: metrics.complianceRate,
                status: compliance_status_enum_1.ComplianceStatus.COMPLIANT,
            },
            sections,
            findings,
            recommendations: [
                'Ensure all Schedule II administrations have witness signatures',
                'Implement digital signature capture for witness verification',
            ],
            status: report_status_enum_1.ReportStatus.COMPLETED,
            format: params.format,
            generatedBy: params.generatedBy,
            createdAt: new Date(),
        };
    }
    buildHIPAAAuditReport(params) {
        const { metrics } = params;
        const sections = [
            {
                sectionTitle: 'PHI Access Summary',
                sectionType: 'security',
                data: {
                    totalAccessEvents: metrics.totalAccessEvents,
                    authorizedAccess: metrics.compliantAccess,
                    suspiciousAccess: metrics.nonCompliantAccess,
                    accessByRole: metrics.accessByRole,
                },
                summary: `${metrics.compliantAccess} of ${metrics.totalAccessEvents} PHI access events were properly authorized.`,
            },
        ];
        const findings = [
            {
                severity: 'HIGH',
                category: 'Unauthorized Access',
                issue: 'After-hours PHI access without business justification',
                details: '36 instances of PHI access outside normal business hours without documented reason',
                affectedCount: 36,
                requiresAction: true,
                responsibleParty: 'HIPAA Compliance Officer',
            },
        ];
        return {
            id: this.generateReportId(),
            reportType: report_type_enum_1.ReportType.HIPAA_AUDIT,
            title: 'HIPAA Compliance Audit Report',
            description: 'Protected Health Information (PHI) access and security audit',
            periodStart: params.periodStart,
            periodEnd: params.periodEnd,
            generatedDate: new Date(),
            schoolId: params.schoolId,
            summary: {
                totalRecords: metrics.totalAccessEvents,
                compliantRecords: metrics.compliantAccess,
                nonCompliantRecords: metrics.nonCompliantAccess,
                complianceRate: metrics.complianceRate,
                status: compliance_status_enum_1.ComplianceStatus.COMPLIANT,
            },
            sections,
            findings,
            recommendations: [
                'Review access logs for suspicious activity incidents',
                'Implement automated alerts for after-hours access',
                'Conduct staff training on HIPAA access policies',
            ],
            status: report_status_enum_1.ReportStatus.COMPLETED,
            format: params.format,
            generatedBy: params.generatedBy,
            createdAt: new Date(),
        };
    }
    buildScreeningReport(params) {
        const { metrics } = params;
        const sections = [
            {
                sectionTitle: 'Screening Completion Overview',
                sectionType: 'summary',
                data: metrics.screeningBreakdown,
                summary: `${metrics.screenedStudents} of ${metrics.totalStudents} students have completed required health screenings.`,
            },
        ];
        return {
            id: this.generateReportId(),
            reportType: report_type_enum_1.ReportType.HEALTH_SCREENINGS,
            title: 'Health Screening Compliance Report',
            description: 'State-mandated health screening completion status',
            periodStart: params.periodStart,
            periodEnd: params.periodEnd,
            generatedDate: new Date(),
            schoolId: params.schoolId,
            summary: {
                totalRecords: metrics.totalStudents,
                compliantRecords: metrics.screenedStudents,
                nonCompliantRecords: metrics.pendingScreenings,
                complianceRate: metrics.complianceRate,
                status: compliance_status_enum_1.ComplianceStatus.COMPLIANT,
            },
            sections,
            findings: [],
            recommendations: [
                'Schedule additional dental screening dates',
                'Send reminder notices for pending screenings',
            ],
            status: report_status_enum_1.ReportStatus.COMPLETED,
            format: params.format,
            generatedBy: params.generatedBy,
            createdAt: new Date(),
        };
    }
    identifyImmunizationFindings(totalStudents, complianceRate, nonCompliantStudents, vaccineCompliance) {
        const findings = [];
        if (vaccineCompliance.HPV.rate < 90) {
            findings.push({
                severity: 'MEDIUM',
                category: 'HPV Vaccine',
                issue: 'HPV vaccination rate below target',
                details: `Only ${vaccineCompliance.HPV.rate}% of eligible students have received HPV vaccine (target: 90%)`,
                affectedCount: totalStudents - vaccineCompliance.HPV.compliant,
                requiresAction: true,
                responsibleParty: 'School Nurse',
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            });
        }
        if (complianceRate < 95) {
            findings.push({
                severity: 'MEDIUM',
                category: 'Overall Compliance',
                issue: 'School-wide immunization compliance below state target',
                details: `Current compliance rate of ${complianceRate}% is below the required 95% threshold`,
                affectedCount: nonCompliantStudents,
                requiresAction: true,
                responsibleParty: 'School Administration',
                dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            });
        }
        return findings;
    }
    generateImmunizationRecommendations(nonCompliantStudents, vaccineCompliance) {
        return [
            `Send reminder notices to parents of ${nonCompliantStudents} non-compliant students`,
            'Schedule on-campus vaccine clinic for HPV vaccinations',
            'Implement automated reminder system for upcoming vaccine due dates',
            'Partner with local health department for vaccine access programs',
            'Review exemption requests for validity and completeness',
        ];
    }
    generateReportId() {
        return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
};
exports.ComplianceReportBuilderService = ComplianceReportBuilderService;
exports.ComplianceReportBuilderService = ComplianceReportBuilderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ComplianceReportBuilderService);
//# sourceMappingURL=compliance-report-builder.service.js.map