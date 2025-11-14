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
exports.ClinicalDecisionSupportService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const models_5 = require("../../database/models");
const base_1 = require("../../common/base");
let ClinicalDecisionSupportService = class ClinicalDecisionSupportService extends base_1.BaseService {
    clinicalProtocolModel;
    healthRecordModel;
    medicationModel;
    vitalSignsModel;
    studentModel;
    sequelize;
    constructor(clinicalProtocolModel, healthRecordModel, medicationModel, vitalSignsModel, studentModel, sequelize) {
        super("ClinicalDecisionSupportService");
        this.clinicalProtocolModel = clinicalProtocolModel;
        this.healthRecordModel = healthRecordModel;
        this.medicationModel = medicationModel;
        this.vitalSignsModel = vitalSignsModel;
        this.studentModel = studentModel;
        this.sequelize = sequelize;
    }
    async analyzePatientCondition(patientId, context) {
        const patientData = await this.gatherPatientData(patientId);
        const vitalSignsAnalysis = await this.analyzeVitalSigns(patientId, patientData.vitalSigns);
        const medicationAnalysis = await this.analyzeMedications(patientId, patientData.medications);
        const protocolAnalysis = await this.assessClinicalProtocols(patientId, context, patientData);
        const riskAssessment = await this.generateRiskAssessment(patientData, context);
        const recommendations = await this.generateRecommendations({
            vitalSignsAnalysis,
            medicationAnalysis,
            protocolAnalysis,
            riskAssessment,
            context,
        });
        const alerts = await this.generateClinicalAlerts({
            vitalSignsAnalysis,
            medicationAnalysis,
            protocolAnalysis,
            riskAssessment,
        });
        return {
            patientId,
            analysisTimestamp: new Date(),
            vitalSignsAnalysis,
            medicationAnalysis,
            protocolAnalysis,
            riskAssessment,
            recommendations,
            alerts,
            confidenceScore: this.calculateConfidenceScore(recommendations, alerts),
            requiresImmediateAttention: this.requiresImmediateAttention(alerts),
        };
    }
    async checkMedicationGuidelines(medicationDetails, patientId) {
        const patientData = await this.gatherPatientData(patientId);
        const interactions = await this.checkDrugInteractions(medicationDetails, patientData.medications);
        const contraindications = await this.checkContraindications(medicationDetails, patientData);
        const dosageGuidelines = await this.checkDosageGuidelines(medicationDetails, patientData);
        const allergyAlerts = await this.checkAllergyAlerts(medicationDetails, patientData.allergies);
        return {
            medication: medicationDetails,
            interactions,
            contraindications,
            dosageGuidelines,
            allergyAlerts,
            overallSafety: this.assessMedicationSafety({
                interactions,
                contraindications,
                dosageGuidelines,
                allergyAlerts,
            }),
            recommendations: this.generateMedicationRecommendations({
                interactions,
                contraindications,
                dosageGuidelines,
                allergyAlerts,
            }),
        };
    }
    async getClinicalProtocols(condition, patientAge, severity) {
        const protocols = await this.clinicalProtocolModel.findAll({
            where: {
                condition: {
                    [this.sequelize.Op.iLike]: `%${condition}%`,
                },
                isActive: true,
                minAge: {
                    [this.sequelize.Op.lte]: patientAge,
                },
                maxAge: {
                    [this.sequelize.Op.or]: [
                        { [this.sequelize.Op.gte]: patientAge },
                        { [this.sequelize.Op.is]: null },
                    ],
                },
            },
            order: [
                ['priority', 'DESC'],
                ['updatedAt', 'DESC'],
            ],
        });
        return protocols.filter(protocol => protocol.severityLevels.includes(severity) ||
            protocol.severityLevels.includes('ALL'));
    }
    async generateTreatmentPlan(patientId, diagnosis) {
        const patientData = await this.gatherPatientData(patientId);
        const protocols = await this.getClinicalProtocols(diagnosis.condition, patientData.age, diagnosis.severity);
        const patientFactors = await this.analyzePatientFactors(patientData, diagnosis);
        const treatmentOptions = await this.generateTreatmentOptions(protocols, patientFactors);
        const riskBenefitAnalysis = await this.assessRisksAndBenefits(treatmentOptions, patientData);
        const monitoringPlan = await this.generateMonitoringPlan(diagnosis, treatmentOptions);
        return {
            patientId,
            diagnosis,
            protocols: protocols.map(p => p.id),
            patientFactors,
            treatmentOptions,
            riskBenefitAnalysis,
            monitoringPlan,
            generatedAt: new Date(),
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
            requiresReview: this.requiresSpecialistReview(diagnosis, patientFactors),
        };
    }
    async monitorTreatmentProgress(patientId, treatmentPlanId) {
        const currentData = await this.gatherPatientData(patientId);
        const treatmentPlan = await this.getTreatmentPlan(treatmentPlanId);
        const progressMetrics = await this.calculateProgressMetrics(currentData, treatmentPlan);
        const complications = await this.detectComplications(currentData, treatmentPlan);
        const recommendations = await this.generateProgressRecommendations(progressMetrics, complications);
        return {
            patientId,
            treatmentPlanId,
            progressMetrics,
            complications,
            recommendations,
            assessmentDate: new Date(),
            nextReviewDate: this.calculateNextReviewDate(progressMetrics, complications),
            requiresAdjustment: this.requiresTreatmentAdjustment(progressMetrics, complications),
        };
    }
    async getPreventiveCareRecommendations(patientId, age) {
        const patientData = await this.gatherPatientData(patientId);
        const screenings = await this.getRecommendedScreenings(age, patientData);
        const immunizations = await this.getImmunizationRecommendations(age, patientData);
        const lifestyle = await this.generateLifestyleRecommendations(patientData);
        const riskFactors = await this.assessRiskFactors(patientData);
        return {
            patientId,
            age,
            screenings,
            immunizations,
            lifestyle,
            riskFactors,
            nextCheckupDate: this.calculateNextCheckupDate(age, riskFactors),
            generatedAt: new Date(),
        };
    }
    async gatherPatientData(patientId) {
        const [student, healthRecords, medications, vitalSigns, allergies] = await Promise.all([
            this.studentModel.findByPk(patientId),
            this.healthRecordModel.findAll({
                where: { studentId: patientId },
                order: [['createdAt', 'DESC']],
                limit: 10,
            }),
            this.medicationModel.findAll({
                where: { studentId: patientId, isActive: true },
            }),
            this.vitalSignsModel.findAll({
                where: { studentId: patientId },
                order: [['measuredAt', 'DESC']],
                limit: 5,
            }),
            [],
        ]);
        if (!student) {
            throw new Error(`Patient ${patientId} not found`);
        }
        return {
            id: student.id,
            age: this.calculateAge(student.dateOfBirth),
            gender: student.gender,
            healthRecords,
            medications,
            vitalSigns,
            allergies,
            medicalHistory: healthRecords.filter(r => r.recordType === 'MEDICAL_HISTORY'),
            currentConditions: healthRecords.filter(r => r.recordType === 'CONDITION'),
        };
    }
    calculateAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    async analyzeVitalSigns(patientId, vitalSigns) {
        if (vitalSigns.length === 0) {
            return {
                status: 'NO_DATA',
                anomalies: [],
                trends: [],
                recommendations: ['Vital signs monitoring recommended'],
            };
        }
        const latest = vitalSigns[0];
        const anomalies = [];
        const trends = [];
        if (latest.temperature && (latest.temperature < 95 || latest.temperature > 100.4)) {
            anomalies.push({
                type: 'TEMPERATURE',
                value: latest.temperature,
                severity: latest.temperature > 104 || latest.temperature < 93 ? 'CRITICAL' : 'MODERATE',
                message: `Abnormal temperature: ${latest.temperature}°F`,
            });
        }
        if (latest.heartRate && (latest.heartRate < 60 || latest.heartRate > 100)) {
            anomalies.push({
                type: 'HEART_RATE',
                value: latest.heartRate,
                severity: latest.heartRate > 120 || latest.heartRate < 50 ? 'CRITICAL' : 'MODERATE',
                message: `Abnormal heart rate: ${latest.heartRate} bpm`,
            });
        }
        if (vitalSigns.length >= 3) {
            const recent = vitalSigns.slice(0, 3);
        }
        return {
            status: anomalies.length > 0 ? 'ANOMALIES_DETECTED' : 'NORMAL',
            anomalies,
            trends,
            recommendations: this.generateVitalSignsRecommendations(anomalies),
        };
    }
    async analyzeMedications(patientId, medications) {
        const interactions = [];
        const alerts = [];
        for (let i = 0; i < medications.length; i++) {
            for (let j = i + 1; j < medications.length; j++) {
                const interaction = await this.checkInteraction(medications[i], medications[j]);
                if (interaction) {
                    interactions.push(interaction);
                }
            }
        }
        medications.forEach(med => {
            if (this.isHighRiskMedication(med)) {
                alerts.push({
                    type: 'HIGH_RISK_MEDICATION',
                    medication: med.name,
                    severity: 'HIGH',
                    message: `${med.name} is a high-risk medication requiring close monitoring`,
                });
            }
        });
        return {
            currentMedications: medications.length,
            interactions,
            alerts,
            adherenceScore: await this.calculateAdherenceScore(medications),
            recommendations: this.generateMedicationAnalysisRecommendations(interactions, alerts),
        };
    }
    async assessClinicalProtocols(patientId, context, patientData) {
        const relevantProtocols = await this.clinicalProtocolModel.findAll({
            where: {
                condition: {
                    [this.sequelize.Op.iLike]: `%${context.condition || 'general'}%`,
                },
                isActive: true,
            },
        });
        const adherence = [];
        const violations = [];
        for (const protocol of relevantProtocols) {
            const adherenceCheck = await this.checkProtocolAdherence(protocol, patientData, context);
            if (adherenceCheck.compliant) {
                adherence.push({
                    protocolId: protocol.id,
                    protocolName: protocol.name,
                    adherenceScore: adherenceCheck.score,
                });
            }
            else {
                violations.push({
                    protocolId: protocol.id,
                    protocolName: protocol.name,
                    violation: adherenceCheck.violation,
                    severity: adherenceCheck.severity,
                });
            }
        }
        return {
            protocolsEvaluated: relevantProtocols.length,
            adherence,
            violations,
            recommendations: this.generateProtocolRecommendations(violations),
        };
    }
    async generateRiskAssessment(patientData, context) {
        let riskScore = 0;
        const riskFactors = [];
        if (patientData.age > 65) {
            riskScore += 20;
            riskFactors.push({ factor: 'AGE', score: 20, description: 'Advanced age' });
        }
        if (patientData.medications.length > 5) {
            riskScore += 15;
            riskFactors.push({ factor: 'POLYPHARMACY', score: 15, description: 'Multiple medications' });
        }
        const chronicCount = patientData.currentConditions.length;
        if (chronicCount > 0) {
            riskScore += chronicCount * 10;
            riskFactors.push({
                factor: 'CHRONIC_CONDITIONS',
                score: chronicCount * 10,
                description: `${chronicCount} chronic condition(s)`,
            });
        }
        const recentHospitalizations = patientData.healthRecords.filter(r => r.recordType === 'HOSPITALIZATION' &&
            r.createdAt > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)).length;
        if (recentHospitalizations > 0) {
            riskScore += recentHospitalizations * 25;
            riskFactors.push({
                factor: 'RECENT_HOSPITALIZATION',
                score: recentHospitalizations * 25,
                description: `${recentHospitalizations} recent hospitalization(s)`,
            });
        }
        return {
            overallRisk: this.categorizeRisk(riskScore),
            riskScore,
            riskFactors,
            mitigationStrategies: this.generateMitigationStrategies(riskFactors),
        };
    }
    async generateRecommendations(analysis) {
        const recommendations = [];
        if (analysis.vitalSignsAnalysis.anomalies.length > 0) {
            recommendations.push({
                type: 'VITAL_SIGNS_MONITORING',
                priority: 'HIGH',
                title: 'Immediate Vital Signs Monitoring',
                description: 'Patient shows vital sign anomalies requiring immediate attention',
                actions: ['Monitor vital signs every 15 minutes', 'Notify supervising clinician'],
                rationale: analysis.vitalSignsAnalysis.anomalies.map(a => a.message).join('; '),
            });
        }
        if (analysis.medicationAnalysis.interactions.length > 0) {
            recommendations.push({
                type: 'MEDICATION_REVIEW',
                priority: 'HIGH',
                title: 'Medication Interaction Review',
                description: 'Potential drug interactions detected',
                actions: ['Review medication regimen', 'Consider alternative medications'],
                rationale: `${analysis.medicationAnalysis.interactions.length} potential interaction(s) identified`,
            });
        }
        analysis.protocolAnalysis.violations.forEach(violation => {
            recommendations.push({
                type: 'PROTOCOL_ADHERENCE',
                priority: violation.severity === 'CRITICAL' ? 'CRITICAL' : 'MEDIUM',
                title: `Protocol Violation: ${violation.protocolName}`,
                description: violation.violation,
                actions: ['Review clinical protocol', 'Document rationale for deviation'],
                rationale: `Deviation from ${violation.protocolName} protocol`,
            });
        });
        if (analysis.riskAssessment.overallRisk === 'HIGH' || analysis.riskAssessment.overallRisk === 'CRITICAL') {
            recommendations.push({
                type: 'RISK_MITIGATION',
                priority: 'HIGH',
                title: 'High-Risk Patient Management',
                description: 'Patient identified as high risk requiring enhanced monitoring',
                actions: analysis.riskAssessment.mitigationStrategies,
                rationale: `Risk score: ${analysis.riskAssessment.riskScore}`,
            });
        }
        return recommendations.sort((a, b) => this.priorityToNumber(b.priority) - this.priorityToNumber(a.priority));
    }
    async generateClinicalAlerts(analysis) {
        const alerts = [];
        analysis.vitalSignsAnalysis.anomalies
            .filter(a => a.severity === 'CRITICAL')
            .forEach(anomaly => {
            alerts.push({
                level: 'CRITICAL',
                category: 'VITAL_SIGNS',
                title: 'Critical Vital Signs Alert',
                message: anomaly.message,
                requiresImmediateAction: true,
                notifySupervisor: true,
            });
        });
        analysis.medicationAnalysis.alerts
            .filter(a => a.severity === 'CRITICAL')
            .forEach(alert => {
            alerts.push({
                level: 'CRITICAL',
                category: 'MEDICATION',
                title: 'Critical Medication Alert',
                message: alert.message,
                requiresImmediateAction: true,
                notifySupervisor: true,
            });
        });
        analysis.protocolAnalysis.violations
            .filter(v => v.severity === 'CRITICAL')
            .forEach(violation => {
            alerts.push({
                level: 'CRITICAL',
                category: 'PROTOCOL',
                title: 'Critical Protocol Violation',
                message: violation.violation,
                requiresImmediateAction: true,
                notifySupervisor: true,
            });
        });
        return alerts;
    }
    calculateConfidenceScore(recommendations, alerts) {
        const highPriorityRecs = recommendations.filter(r => r.priority === 'HIGH' || r.priority === 'CRITICAL').length;
        const criticalAlerts = alerts.filter(a => a.level === 'CRITICAL').length;
        const baseConfidence = 75;
        const recBonus = highPriorityRecs * 5;
        const alertBonus = criticalAlerts * 10;
        return Math.min(baseConfidence + recBonus + alertBonus, 95);
    }
    requiresImmediateAttention(alerts) {
        return alerts.some(alert => alert.level === 'CRITICAL' && alert.requiresImmediateAction);
    }
    async checkDrugInteractions(medication, currentMedications) {
        const interactions = [];
        for (const currentMed of currentMedications) {
            if (this.hasKnownInteraction(medication.name, currentMed.name)) {
                interactions.push({
                    medications: [medication.name, currentMed.name],
                    severity: 'MODERATE',
                    description: `Potential interaction between ${medication.name} and ${currentMed.name}`,
                    recommendation: 'Monitor patient closely and consult pharmacist',
                });
            }
        }
        return interactions;
    }
    async checkContraindications(medication, patientData) {
        const contraindications = [];
        const renalConditions = patientData.currentConditions.filter(c => c.details?.toLowerCase().includes('renal') || c.details?.toLowerCase().includes('kidney'));
        if (renalConditions.length > 0 && this.isRenallyCleared(medication.name)) {
            contraindications.push({
                condition: 'Renal Impairment',
                medication: medication.name,
                severity: 'HIGH',
                description: `${medication.name} is primarily renally cleared and may accumulate in renal impairment`,
                recommendation: 'Dose adjustment required, consult nephrologist',
            });
        }
        return contraindications;
    }
    async checkDosageGuidelines(medication, patientData) {
        const guidelines = [];
        if (patientData.age < 12 && !medication.pediatricDose) {
            guidelines.push({
                medication: medication.name,
                issue: 'AGE_INAPPROPRIATE',
                message: 'Pediatric dosing guidelines should be followed',
                recommendation: 'Consult pediatric dosing reference',
            });
        }
        return guidelines;
    }
    async checkAllergyAlerts(medication, allergies) {
        const alerts = [];
        const drugAllergies = allergies.filter(a => a.type === 'DRUG' && a.details?.toLowerCase().includes(medication.name.toLowerCase()));
        if (drugAllergies.length > 0) {
            alerts.push({
                medication: medication.name,
                allergy: drugAllergies[0].details,
                severity: 'CRITICAL',
                message: `Patient allergic to ${medication.name}`,
                recommendation: 'Do not administer - seek alternative medication',
            });
        }
        return alerts;
    }
    assessMedicationSafety(analysis) {
        const criticalIssues = [
            ...analysis.contraindications.filter(c => c.severity === 'CRITICAL'),
            ...analysis.allergyAlerts.filter(a => a.severity === 'CRITICAL'),
        ];
        if (criticalIssues.length > 0) {
            return 'UNSAFE';
        }
        const moderateIssues = [
            ...analysis.interactions.filter(i => i.severity === 'MODERATE' || i.severity === 'SEVERE'),
            ...analysis.contraindications.filter(c => c.severity === 'MODERATE' || c.severity === 'HIGH'),
        ];
        if (moderateIssues.length > 0) {
            return 'CAUTION';
        }
        return 'SAFE';
    }
    generateMedicationRecommendations(analysis) {
        const recommendations = [];
        if (analysis.allergyAlerts.length > 0) {
            recommendations.push('Do not administer - patient has allergy to this medication');
        }
        if (analysis.contraindications.length > 0) {
            recommendations.push('Review contraindications before administration');
        }
        if (analysis.interactions.length > 0) {
            recommendations.push('Monitor for drug interaction effects');
        }
        if (analysis.dosageGuidelines.length > 0) {
            recommendations.push('Verify dosage appropriateness for patient age/condition');
        }
        return recommendations;
    }
    generateVitalSignsRecommendations(anomalies) {
        const recommendations = [];
        if (anomalies.some(a => a.type === 'TEMPERATURE' && a.severity === 'CRITICAL')) {
            recommendations.push('Immediate medical attention required for abnormal temperature');
        }
        if (anomalies.some(a => a.type === 'HEART_RATE' && a.severity === 'CRITICAL')) {
            recommendations.push('Cardiac monitoring indicated for abnormal heart rate');
        }
        if (anomalies.length > 0) {
            recommendations.push('Repeat vital signs in 15 minutes');
        }
        return recommendations;
    }
    generateMedicationAnalysisRecommendations(interactions, alerts) {
        const recommendations = [];
        if (interactions.length > 0) {
            recommendations.push('Consult pharmacist regarding potential drug interactions');
        }
        if (alerts.some(a => a.severity === 'HIGH')) {
            recommendations.push('High-risk medication - enhanced monitoring required');
        }
        return recommendations;
    }
    generateProtocolRecommendations(violations) {
        const recommendations = [];
        violations.forEach(violation => {
            recommendations.push(`Review adherence to ${violation.protocolName} protocol`);
        });
        return recommendations;
    }
    categorizeRisk(score) {
        if (score >= 80)
            return 'CRITICAL';
        if (score >= 60)
            return 'HIGH';
        if (score >= 40)
            return 'MODERATE';
        return 'LOW';
    }
    generateMitigationStrategies(riskFactors) {
        const strategies = [];
        if (riskFactors.some(f => f.factor === 'AGE')) {
            strategies.push('Consider geriatric assessment and dose adjustments');
        }
        if (riskFactors.some(f => f.factor === 'POLYPHARMACY')) {
            strategies.push('Comprehensive medication review recommended');
        }
        if (riskFactors.some(f => f.factor === 'CHRONIC_CONDITIONS')) {
            strategies.push('Multidisciplinary care coordination');
        }
        return strategies;
    }
    priorityToNumber(priority) {
        switch (priority) {
            case 'CRITICAL': return 4;
            case 'HIGH': return 3;
            case 'MEDIUM': return 2;
            case 'LOW': return 1;
            default: return 0;
        }
    }
    async checkInteraction(med1, med2) {
        const knownInteractions = [
            ['aspirin', 'warfarin'],
            ['digoxin', 'amiodarone'],
            ['lithium', 'diuretics'],
        ];
        const med1Name = med1.name.toLowerCase();
        const med2Name = med2.name.toLowerCase();
        const hasInteraction = knownInteractions.some(([a, b]) => (med1Name.includes(a) && med2Name.includes(b)) ||
            (med1Name.includes(b) && med2Name.includes(a)));
        if (hasInteraction) {
            return {
                medications: [med1.name, med2.name],
                severity: 'MODERATE',
                description: `Potential interaction between ${med1.name} and ${med2.name}`,
                recommendation: 'Monitor patient closely and consult pharmacist',
            };
        }
        return null;
    }
    isHighRiskMedication(medication) {
        const highRiskMeds = [
            'warfarin', 'insulin', 'digoxin', 'lithium', 'chemotherapy',
            'anticoagulants', 'antiarrhythmics', 'immunosuppressants'
        ];
        return highRiskMeds.some(riskMed => medication.name.toLowerCase().includes(riskMed));
    }
    async calculateAdherenceScore(medications) {
        if (medications.length === 0)
            return 100;
        return 85;
    }
    async checkProtocolAdherence(protocol, patientData, context) {
        return {
            compliant: true,
            score: 90,
            violation: null,
            severity: null,
        };
    }
    async analyzePatientFactors(patientData, diagnosis) {
        const factors = [];
        if (patientData.age < 12) {
            factors.push({ factor: 'PEDIATRIC', impact: 'HIGH', description: 'Pediatric patient requiring specialized care' });
        }
        if (patientData.currentConditions.length > 2) {
            factors.push({ factor: 'COMORBIDITIES', impact: 'HIGH', description: 'Multiple comorbidities affecting treatment choices' });
        }
        return factors;
    }
    async generateTreatmentOptions(protocols, patientFactors) {
        const options = [];
        protocols.forEach(protocol => {
            options.push({
                protocolId: protocol.id,
                name: protocol.name,
                type: protocol.treatmentType,
                description: protocol.description,
                suitabilityScore: this.calculateSuitabilityScore(protocol, patientFactors),
                risks: [],
                benefits: [],
            });
        });
        return options.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    }
    calculateSuitabilityScore(protocol, factors) {
        let score = 75;
        factors.forEach(factor => {
            if (factor.impact === 'HIGH') {
                score -= 10;
            }
        });
        return Math.max(score, 0);
    }
    async assessRisksAndBenefits(treatmentOptions, patientData) {
        return treatmentOptions.map(option => ({
            treatmentId: option.protocolId,
            risks: option.risks,
            benefits: option.benefits,
            riskBenefitRatio: option.risks.length / (option.benefits.length + 1),
            recommendation: option.suitabilityScore > 70 ? 'RECOMMENDED' : 'CAUTION',
        }));
    }
    async generateMonitoringPlan(diagnosis, treatmentOptions) {
        return {
            vitalSignsFrequency: 'DAILY',
            labTests: ['CBC', 'CMP'],
            followUpSchedule: 'WEEKLY',
            alertThresholds: {
                temperature: { min: 95, max: 100.4 },
                heartRate: { min: 60, max: 100 },
            },
            monitoringDuration: 30,
        };
    }
    requiresSpecialistReview(diagnosis, factors) {
        return diagnosis.severity === 'CRITICAL' ||
            factors.some(f => f.impact === 'CRITICAL') ||
            diagnosis.condition.toLowerCase().includes('cancer');
    }
    async getTreatmentPlan(treatmentPlanId) {
        throw new Error('Treatment plan retrieval not implemented');
    }
    async calculateProgressMetrics(currentData, treatmentPlan) {
        return [
            {
                metric: 'VITAL_SIGNS_STABILITY',
                currentValue: 85,
                targetValue: 90,
                status: 'ON_TRACK',
                trend: 'IMPROVING',
            },
        ];
    }
    async detectComplications(currentData, treatmentPlan) {
        return [];
    }
    async generateProgressRecommendations(metrics, complications) {
        const recommendations = [];
        if (complications.length > 0) {
            recommendations.push('Address detected complications immediately');
        }
        if (metrics.some(m => m.status === 'OFF_TRACK')) {
            recommendations.push('Treatment adjustment may be necessary');
        }
        return recommendations;
    }
    calculateNextReviewDate(metrics, complications) {
        const baseDays = complications.length > 0 ? 1 : 7;
        return new Date(Date.now() + baseDays * 24 * 60 * 60 * 1000);
    }
    requiresTreatmentAdjustment(metrics, complications) {
        return complications.length > 0 || metrics.some(m => m.status === 'OFF_TRACK');
    }
    async getRecommendedScreenings(age, patientData) {
        const screenings = [];
        if (age >= 3 && age <= 18) {
            screenings.push({
                type: 'VISION',
                frequency: 'ANNUAL',
                nextDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                rationale: 'Age-appropriate vision screening',
            });
        }
        return screenings;
    }
    async getImmunizationRecommendations(age, patientData) {
        return [
            {
                vaccine: 'Influenza',
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: 'DUE',
                rationale: 'Annual influenza vaccination recommended',
            },
        ];
    }
    async generateLifestyleRecommendations(patientData) {
        const recommendations = [];
        recommendations.push('Maintain balanced diet with adequate nutrition');
        recommendations.push('Regular physical activity appropriate for age');
        recommendations.push('Adequate sleep and stress management');
        return recommendations;
    }
    async assessRiskFactors(patientData) {
        const factors = [];
        if (patientData.medications.length > 3) {
            factors.push({ factor: 'POLYPHARMACY', score: 15, description: 'Multiple medications increase risk' });
        }
        return factors;
    }
    calculateNextCheckupDate(age, riskFactors) {
        const baseMonths = age < 12 ? 3 : 12;
        const riskAdjustment = riskFactors.length * 7;
        return new Date(Date.now() + (baseMonths * 30 - riskAdjustment) * 24 * 60 * 60 * 1000);
    }
    hasKnownInteraction(med1, med2) {
        const interactions = [
            ['aspirin', 'warfarin'],
            ['digoxin', 'amiodarone'],
        ];
        return interactions.some(([a, b]) => (med1.toLowerCase().includes(a) && med2.toLowerCase().includes(b)) ||
            (med1.toLowerCase().includes(b) && med2.toLowerCase().includes(a)));
    }
    isRenallyCleared(medication) {
        const renalMeds = ['digoxin', 'lithium', 'aminoglycosides'];
        return renalMeds.some(med => medication.toLowerCase().includes(med));
    }
};
exports.ClinicalDecisionSupportService = ClinicalDecisionSupportService;
exports.ClinicalDecisionSupportService = ClinicalDecisionSupportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.ClinicalProtocol)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.HealthRecord)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Medication)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.VitalSigns)),
    __param(4, (0, sequelize_1.InjectModel)(models_5.Student)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, sequelize_typescript_1.Sequelize])
], ClinicalDecisionSupportService);
//# sourceMappingURL=clinical-decision-support.service.js.map