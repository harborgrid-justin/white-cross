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
exports.HealthInsightsService = void 0;
const common_1 = require("@nestjs/common");
const base_1 = require("../../common/base");
let HealthInsightsService = class HealthInsightsService extends base_1.BaseService {
    constructor() {
        super("HealthInsightsService");
    }
    generateHealthInsights(data) {
        const insights = [];
        if (data.medicationAdherence > 85) {
            insights.push('Excellent medication adherence rates');
        }
        else if (data.medicationAdherence < 70) {
            insights.push('Medication adherence needs improvement');
        }
        if (data.immunizationCompliance > 90) {
            insights.push('Strong immunization compliance');
        }
        else if (data.immunizationCompliance < 80) {
            insights.push('Immunization compliance requires attention');
        }
        if (data.appointmentCompletion > 85) {
            insights.push('Good appointment completion rates');
        }
        const recordsPerStudent = data.activeHealthRecords / data.totalStudents;
        if (recordsPerStudent > 2) {
            insights.push('High health record activity per student');
        }
        else if (recordsPerStudent < 1) {
            insights.push('Low health record activity - consider increasing monitoring');
        }
        if (data.incidentCount > data.totalStudents * 0.1) {
            insights.push('High incident rate - review safety protocols');
        }
        return insights;
    }
    assessStudentRisk(metrics) {
        const factors = [];
        let riskScore = 0;
        if (metrics.incidents > 5) {
            factors.push('High incident count');
            riskScore += 3;
        }
        else if (metrics.incidents > 2) {
            factors.push('Moderate incident count');
            riskScore += 1;
        }
        if (metrics.appointments > 10) {
            factors.push('Frequent appointments');
            riskScore += 2;
        }
        else if (metrics.appointments > 5) {
            factors.push('Regular appointments');
            riskScore += 1;
        }
        if (metrics.medicationAdministrations > 20) {
            factors.push('High medication usage');
            riskScore += 2;
        }
        else if (metrics.medicationAdministrations > 10) {
            factors.push('Moderate medication usage');
            riskScore += 1;
        }
        const daysSinceLastRecord = metrics.lastHealthRecord
            ? (Date.now() - metrics.lastHealthRecord.getTime()) / (1000 * 60 * 60 * 24)
            : 999;
        if (daysSinceLastRecord > 90) {
            factors.push('Outdated health records');
            riskScore += 1;
        }
        if (metrics.upcomingAppointments > 3) {
            factors.push('Multiple upcoming appointments');
            riskScore += 1;
        }
        let level;
        if (riskScore >= 5)
            level = 'CRITICAL';
        else if (riskScore >= 3)
            level = 'HIGH';
        else if (riskScore >= 1)
            level = 'MEDIUM';
        else
            level = 'LOW';
        return { level, factors, score: riskScore };
    }
    generateStudentRecommendations(metrics) {
        const recommendations = [];
        const riskAssessment = this.assessStudentRisk(metrics);
        if (riskAssessment.level === 'CRITICAL' || riskAssessment.level === 'HIGH') {
            recommendations.push('Consider additional supervision or support');
        }
        if (metrics.incidents > 2) {
            recommendations.push('Review incident patterns and preventive measures');
        }
        if (metrics.appointments > 5 && metrics.upcomingAppointments > 2) {
            recommendations.push('Schedule follow-up appointments carefully');
        }
        if (!metrics.lastHealthRecord || metrics.lastHealthRecord < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) {
            recommendations.push('Due for health record update');
        }
        if (metrics.medicationAdministrations > 15) {
            recommendations.push('Review medication regimen and compliance');
        }
        if (recommendations.length === 0) {
            recommendations.push('Student health status is stable');
        }
        return recommendations;
    }
    generateMedicationInsights(medicationData) {
        const insights = [];
        if (medicationData.adherence > 90) {
            insights.push('Excellent medication adherence across the school');
        }
        else if (medicationData.adherence < 80) {
            insights.push('Medication adherence needs improvement');
        }
        if (medicationData.commonMedications?.length > 0) {
            insights.push(`Most common medications: ${medicationData.commonMedications.slice(0, 3).join(', ')}`);
        }
        const totalAdministrations = medicationData.medications?.reduce((sum, med) => sum + med.count, 0) || 0;
        if (totalAdministrations > 100) {
            insights.push('High volume of medication administrations');
        }
        return insights;
    }
    generateAppointmentInsights(appointmentData) {
        const insights = [];
        if (appointmentData.completionRate > 90) {
            insights.push('Excellent appointment completion rates');
        }
        else if (appointmentData.completionRate < 80) {
            insights.push('Appointment completion rates need improvement');
        }
        if (appointmentData.averageWaitTime > 30) {
            insights.push('Long average wait times for appointments');
        }
        else if (appointmentData.averageWaitTime < 10) {
            insights.push('Efficient appointment scheduling');
        }
        const noShowRate = ((appointmentData.noShowAppointments || 0) / appointmentData.totalAppointments) * 100;
        if (noShowRate > 15) {
            insights.push('High no-show rate for appointments');
        }
        return insights;
    }
    generateIncidentInsights(incidentData) {
        const insights = [];
        if (incidentData.totalIncidents === 0) {
            insights.push('No incidents reported - excellent safety record');
            return insights;
        }
        if (incidentData.resolutionTime < 2) {
            insights.push('Fast incident resolution times');
        }
        else if (incidentData.resolutionTime > 8) {
            insights.push('Slow incident resolution times');
        }
        const topIncidentType = Object.entries(incidentData.incidentTypes || {})
            .sort(([, a], [, b]) => b - a)[0];
        if (topIncidentType) {
            insights.push(`Most common incident type: ${topIncidentType[0]} (${topIncidentType[1]})`);
        }
        const criticalIncidents = incidentData.severityBreakdown?.CRITICAL || 0;
        if (criticalIncidents > 0) {
            insights.push(`${criticalIncidents} critical incidents reported`);
        }
        return insights;
    }
    calculateHealthTrends(current, previous) {
        if (!previous) {
            return {
                medicationAdherenceChange: 0,
                immunizationComplianceChange: 0,
                incidentCountChange: 0,
                appointmentCompletionChange: 0,
                trend: 'stable',
            };
        }
        const medicationChange = current.medicationAdherence - previous.medicationAdherence;
        const immunizationChange = current.immunizationCompliance - previous.immunizationCompliance;
        const incidentChange = current.incidentCount - previous.incidentCount;
        const appointmentChange = current.appointmentCompletion - previous.appointmentCompletion;
        let trend = 'stable';
        const positiveChanges = [medicationChange, immunizationChange, appointmentChange].filter(change => change > 0).length;
        const negativeChanges = [medicationChange, immunizationChange, appointmentChange, incidentChange].filter(change => change < 0).length;
        if (positiveChanges > negativeChanges) {
            trend = 'improving';
        }
        else if (negativeChanges > positiveChanges) {
            trend = 'declining';
        }
        return {
            medicationAdherenceChange: medicationChange,
            immunizationComplianceChange: immunizationChange,
            incidentCountChange: incidentChange,
            appointmentCompletionChange: appointmentChange,
            trend,
        };
    }
};
exports.HealthInsightsService = HealthInsightsService;
exports.HealthInsightsService = HealthInsightsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HealthInsightsService);
//# sourceMappingURL=health-insights.service.js.map