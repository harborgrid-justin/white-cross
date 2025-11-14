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
exports.MedicationInteractionCheckerService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../../database/models");
const models_2 = require("../../database/models");
const models_3 = require("../../database/models");
const models_4 = require("../../database/models");
const base_1 = require("../../common/base");
let MedicationInteractionCheckerService = class MedicationInteractionCheckerService extends base_1.BaseService {
    medicationModel;
    drugInteractionModel;
    studentModel;
    healthRecordModel;
    sequelize;
    SEVERITY_LEVELS = {
        MINOR: 1,
        MODERATE: 2,
        MAJOR: 3,
        CONTRAINDICATED: 4,
    };
    KNOWN_INTERACTIONS = [
        {
            drug1: 'warfarin',
            drug2: 'aspirin',
            severity: 'MAJOR',
            mechanism: 'Increased bleeding risk',
            recommendation: 'Avoid concurrent use; monitor INR closely if unavoidable',
            evidence: 'Strong evidence from multiple clinical trials',
        },
        {
            drug1: 'digoxin',
            drug2: 'amiodarone',
            severity: 'MAJOR',
            mechanism: 'Increased digoxin levels',
            recommendation: 'Reduce digoxin dose by 50%; monitor levels',
            evidence: 'Well-documented pharmacokinetic interaction',
        },
        {
            drug1: 'lithium',
            drug2: 'diuretics',
            severity: 'MAJOR',
            mechanism: 'Increased lithium toxicity',
            recommendation: 'Monitor lithium levels; adjust dose as needed',
            evidence: 'Established drug interaction',
        },
        {
            drug1: 'simvastatin',
            drug2: 'gemfibrozil',
            severity: 'MAJOR',
            mechanism: 'Increased statin levels and rhabdomyolysis risk',
            recommendation: 'Avoid combination; use alternative statin',
            evidence: 'FDA black box warning',
        },
    ];
    constructor(medicationModel, drugInteractionModel, studentModel, healthRecordModel, sequelize) {
        super("MedicationInteractionCheckerService");
        this.medicationModel = medicationModel;
        this.drugInteractionModel = drugInteractionModel;
        this.studentModel = studentModel;
        this.healthRecordModel = healthRecordModel;
        this.sequelize = sequelize;
    }
    async checkMedicationInteractions(patientId, newMedication) {
        const patientMedications = await this.getPatientMedications(patientId);
        const patientConditions = await this.getPatientConditions(patientId);
        const patientAllergies = await this.getPatientAllergies(patientId);
        const drugInteractions = await this.checkDrugDrugInteractions(newMedication, patientMedications);
        const diseaseInteractions = await this.checkDrugDiseaseInteractions(newMedication, patientConditions);
        const allergyInteractions = await this.checkDrugAllergyInteractions(newMedication, patientAllergies);
        const duplicateTherapies = await this.checkDuplicateTherapies(newMedication, patientMedications);
        const safetyScore = this.calculateSafetyScore({
            drugInteractions,
            diseaseInteractions,
            allergyInteractions,
            duplicateTherapies,
        });
        const recommendations = await this.generateInteractionRecommendations({
            drugInteractions,
            diseaseInteractions,
            allergyInteractions,
            duplicateTherapies,
            safetyScore,
        });
        const alerts = this.generateInteractionAlerts({
            drugInteractions,
            diseaseInteractions,
            allergyInteractions,
            duplicateTherapies,
        });
        return {
            patientId,
            medication: newMedication,
            drugInteractions,
            diseaseInteractions,
            allergyInteractions,
            duplicateTherapies,
            safetyScore,
            safetyRating: this.getSafetyRating(safetyScore),
            recommendations,
            alerts,
            checkedAt: new Date(),
            requiresReview: this.requiresPharmacistReview(alerts),
        };
    }
    async performMedicationReview(patientId) {
        const patientMedications = await this.getPatientMedications(patientId);
        const patientConditions = await this.getPatientConditions(patientId);
        const patientAllergies = await this.getPatientAllergies(patientId);
        if (patientMedications.length === 0) {
            return {
                patientId,
                medicationsReviewed: 0,
                interactions: [],
                recommendations: ['No current medications to review'],
                reviewDate: new Date(),
            };
        }
        const allInteractions = [];
        for (let i = 0; i < patientMedications.length; i++) {
            for (let j = i + 1; j < patientMedications.length; j++) {
                const interactions = await this.checkDrugDrugInteractions(this.medicationToDetails(patientMedications[i]), [patientMedications[j]]);
                allInteractions.push(...interactions);
            }
        }
        for (const medication of patientMedications) {
            const diseaseInteractions = await this.checkDrugDiseaseInteractions(this.medicationToDetails(medication), patientConditions);
            allInteractions.push(...diseaseInteractions);
        }
        for (const medication of patientMedications) {
            const allergyInteractions = await this.checkDrugAllergyInteractions(this.medicationToDetails(medication), patientAllergies);
            allInteractions.push(...allergyInteractions);
        }
        const appropriatenessAnalysis = await this.analyzeMedicationAppropriateness(patientMedications, patientConditions);
        const recommendations = await this.generateReviewRecommendations(allInteractions, appropriatenessAnalysis, patientMedications);
        return {
            patientId,
            medicationsReviewed: patientMedications.length,
            interactions: allInteractions,
            recommendations,
            reviewDate: new Date(),
            requiresFollowUp: allInteractions.some(i => i.severity === 'MAJOR' || i.severity === 'CONTRAINDICATED'),
        };
    }
    async checkAdverseReactions(patientId, medication) {
        const patientHistory = await this.getPatientMedicationHistory(patientId);
        const patientDemographics = await this.getPatientDemographics(patientId);
        const historicalReactions = this.analyzeHistoricalReactions(medication, patientHistory);
        const predictedReactions = await this.predictAdverseReactions(medication, patientDemographics, patientHistory);
        const diseaseRisks = await this.checkDrugInducedDiseaseRisks(medication, patientDemographics);
        return {
            medication,
            historicalReactions,
            predictedReactions,
            diseaseRisks,
            riskScore: this.calculateAdverseReactionRisk(historicalReactions, predictedReactions, diseaseRisks),
            monitoringRecommendations: this.generateMonitoringRecommendations(historicalReactions, predictedReactions),
        };
    }
    async optimizeMedicationRegimen(patientId) {
        const patientMedications = await this.getPatientMedications(patientId);
        const patientConditions = await this.getPatientConditions(patientId);
        const patientLabs = await this.getPatientLabResults(patientId);
        const effectivenessAnalysis = await this.analyzeRegimenEffectiveness(patientMedications, patientConditions, patientLabs);
        const optimizationOpportunities = await this.identifyOptimizationOpportunities(patientMedications, effectivenessAnalysis);
        const optimizedRegimen = await this.generateOptimizedRegimen(patientMedications, optimizationOpportunities);
        const improvementMetrics = this.calculateImprovementMetrics(patientMedications, optimizedRegimen);
        return {
            patientId,
            currentRegimen: patientMedications.map(m => this.medicationToDetails(m)),
            optimizedRegimen,
            optimizationOpportunities,
            improvementMetrics,
            generatedAt: new Date(),
            estimatedSavings: this.calculateCostSavings(patientMedications, optimizedRegimen),
        };
    }
    async getMedicationSafetyDashboard(patientId) {
        const medications = await this.getPatientMedications(patientId);
        const interactions = await this.performMedicationReview(patientId);
        const adherenceData = await this.getAdherenceData(patientId);
        const safetyMetrics = {
            totalMedications: medications.length,
            highRiskMedications: medications.filter(m => this.isHighRiskMedication(m.name)).length,
            interactionsCount: interactions.interactions.length,
            majorInteractions: interactions.interactions.filter(i => i.severity === 'MAJOR').length,
            adherenceRate: adherenceData.overallAdherence,
            lastReviewDate: interactions.reviewDate,
        };
        const safetyAlerts = this.generateSafetyAlerts(safetyMetrics, interactions);
        const riskScore = this.calculatePatientRiskScore(safetyMetrics);
        return {
            patientId,
            safetyMetrics,
            safetyAlerts,
            riskScore,
            riskLevel: this.getRiskLevel(riskScore),
            recommendations: this.generateSafetyRecommendations(safetyMetrics, riskScore),
            lastUpdated: new Date(),
        };
    }
    async getPatientMedications(patientId) {
        return await this.medicationModel.findAll({
            where: {
                studentId: patientId,
                isActive: true,
            },
            order: [['createdAt', 'DESC']],
        });
    }
    async getPatientConditions(patientId) {
        return await this.healthRecordModel.findAll({
            where: {
                studentId: patientId,
                recordType: 'CONDITION',
            },
            order: [['createdAt', 'DESC']],
        });
    }
    async getPatientAllergies(patientId) {
        const allergyRecords = await this.healthRecordModel.findAll({
            where: {
                studentId: patientId,
                recordType: 'ALLERGY',
            },
        });
        return allergyRecords.map(record => ({
            allergen: record.details?.allergen,
            reaction: record.details?.reaction,
            severity: record.details?.severity,
        }));
    }
    async checkDrugDrugInteractions(medication, existingMedications) {
        const interactions = [];
        for (const existingMed of existingMedications) {
            const existingDetails = this.medicationToDetails(existingMed);
            const knownInteraction = this.KNOWN_INTERACTIONS.find(interaction => (interaction.drug1 === medication.name.toLowerCase() &&
                interaction.drug2 === existingDetails.name.toLowerCase()) ||
                (interaction.drug2 === medication.name.toLowerCase() &&
                    interaction.drug1 === existingDetails.name.toLowerCase()));
            if (knownInteraction) {
                interactions.push({
                    type: 'DRUG_DRUG',
                    severity: knownInteraction.severity,
                    medications: [medication.name, existingDetails.name],
                    description: knownInteraction.mechanism,
                    recommendation: knownInteraction.recommendation,
                    evidence: knownInteraction.evidence,
                    onset: 'Varies',
                    management: knownInteraction.recommendation,
                });
            }
            if (this.areSameClass(medication, existingDetails)) {
                interactions.push({
                    type: 'DRUG_DRUG',
                    severity: 'MODERATE',
                    medications: [medication.name, existingDetails.name],
                    description: 'Medications from same therapeutic class may have additive effects',
                    recommendation: 'Monitor for enhanced therapeutic and adverse effects',
                    evidence: 'Pharmacodynamic class effect',
                    onset: 'Immediate',
                    management: 'Dose adjustment may be needed',
                });
            }
        }
        return interactions;
    }
    async checkDrugDiseaseInteractions(medication, conditions) {
        const interactions = [];
        for (const condition of conditions) {
            const conditionName = condition.details?.condition?.toLowerCase() || '';
            if (conditionName.includes('renal') || conditionName.includes('kidney')) {
                if (this.isRenallyCleared(medication.name)) {
                    interactions.push({
                        type: 'DRUG_DISEASE',
                        severity: 'MAJOR',
                        medications: [medication.name],
                        condition: condition.details?.condition,
                        description: 'Renal impairment may lead to drug accumulation',
                        recommendation: 'Dose reduction required; monitor renal function and drug levels',
                        evidence: 'Pharmacokinetic principle',
                        onset: 'Gradual',
                        management: 'Adjust dose based on creatinine clearance',
                    });
                }
            }
            if (conditionName.includes('hepatic') || conditionName.includes('liver')) {
                if (this.isHepaticallyMetabolized(medication.name)) {
                    interactions.push({
                        type: 'DRUG_DISEASE',
                        severity: 'MAJOR',
                        medications: [medication.name],
                        condition: condition.details?.condition,
                        description: 'Hepatic impairment may lead to drug accumulation',
                        recommendation: 'Dose reduction required; monitor liver function',
                        evidence: 'Pharmacokinetic principle',
                        onset: 'Gradual',
                        management: 'Adjust dose based on liver function tests',
                    });
                }
            }
            if (conditionName.includes('heart') || conditionName.includes('cardiac')) {
                if (this.affectsCardiovascularSystem(medication.name)) {
                    interactions.push({
                        type: 'DRUG_DISEASE',
                        severity: 'MODERATE',
                        medications: [medication.name],
                        condition: condition.details?.condition,
                        description: 'Cardiovascular medication may interact with existing heart condition',
                        recommendation: 'Monitor cardiac function closely',
                        evidence: 'Disease-specific consideration',
                        onset: 'Varies',
                        management: 'Regular ECG and cardiac monitoring',
                    });
                }
            }
        }
        return interactions;
    }
    async checkDrugAllergyInteractions(medication, allergies) {
        const interactions = [];
        for (const allergy of allergies) {
            if (this.isAllergicToMedication(medication.name, allergy)) {
                interactions.push({
                    type: 'DRUG_ALLERGY',
                    severity: 'CONTRAINDICATED',
                    medications: [medication.name],
                    allergen: allergy.allergen,
                    description: `Patient allergic to ${allergy.allergen}`,
                    recommendation: 'Do not administer - seek alternative medication',
                    evidence: 'Patient allergy history',
                    onset: 'Immediate',
                    management: 'Avoid medication; treat allergic reaction if occurs',
                });
            }
            if (this.hasCrossReactivity(medication.name, allergy)) {
                interactions.push({
                    type: 'DRUG_ALLERGY',
                    severity: 'MAJOR',
                    medications: [medication.name],
                    allergen: allergy.allergen,
                    description: `Potential cross-reactivity with ${allergy.allergen}`,
                    recommendation: 'Use with extreme caution; monitor closely',
                    evidence: 'Cross-reactivity potential',
                    onset: 'Varies',
                    management: 'Premedication may be required',
                });
            }
        }
        return interactions;
    }
    async checkDuplicateTherapies(medication, existingMedications) {
        const duplicates = [];
        for (const existingMed of existingMedications) {
            if (this.areDuplicateTherapies(medication, this.medicationToDetails(existingMed))) {
                duplicates.push({
                    medications: [medication.name, existingMed.name],
                    therapeuticClass: this.getTherapeuticClass(medication.name),
                    rationale: 'Duplicate therapy increases risk without additional benefit',
                    recommendation: 'Consider discontinuing one medication or adjusting doses',
                    potentialIssues: ['Increased adverse effects', 'Higher cost', 'Non-adherence'],
                });
            }
        }
        return duplicates;
    }
    calculateSafetyScore(analysis) {
        let score = 100;
        score -= analysis.drugInteractions.length * 5;
        score -= analysis.diseaseInteractions.length * 10;
        score -= analysis.allergyInteractions.length * 20;
        score -= analysis.duplicateTherapies.length * 8;
        const majorInteractions = [
            ...analysis.drugInteractions,
            ...analysis.diseaseInteractions,
            ...analysis.allergyInteractions,
        ].filter(i => i.severity === 'MAJOR' || i.severity === 'CONTRAINDICATED');
        score -= majorInteractions.length * 15;
        return Math.max(score, 0);
    }
    getSafetyRating(score) {
        if (score >= 90)
            return 'EXCELLENT';
        if (score >= 75)
            return 'GOOD';
        if (score >= 60)
            return 'FAIR';
        if (score >= 40)
            return 'POOR';
        return 'UNSAFE';
    }
    async generateInteractionRecommendations(analysis) {
        const recommendations = [];
        if (analysis.allergyInteractions.length > 0) {
            recommendations.push('CRITICAL: Do not administer - patient has allergy to this medication');
        }
        if (analysis.drugInteractions.some(i => i.severity === 'CONTRAINDICATED')) {
            recommendations.push('CONTRAINDICATED: This medication should not be used with current regimen');
        }
        if (analysis.diseaseInteractions.length > 0) {
            recommendations.push('Disease interaction detected - dose adjustment or monitoring required');
        }
        if (analysis.duplicateTherapies.length > 0) {
            recommendations.push('Duplicate therapy identified - consider regimen optimization');
        }
        if (analysis.safetyScore < 60) {
            recommendations.push('LOW SAFETY SCORE: Consult pharmacist before proceeding');
        }
        return recommendations;
    }
    generateInteractionAlerts(analysis) {
        const alerts = [];
        if (analysis.allergyInteractions.length > 0) {
            alerts.push({
                level: 'CRITICAL',
                type: 'ALLERGY',
                title: 'ALLERGIC REACTION RISK',
                message: 'Patient has allergy to this medication',
                requiresImmediateAction: true,
            });
        }
        const majorInteractions = analysis.drugInteractions.filter(i => i.severity === 'MAJOR');
        if (majorInteractions.length > 0) {
            alerts.push({
                level: 'HIGH',
                type: 'DRUG_INTERACTION',
                title: 'MAJOR DRUG INTERACTION',
                message: `${majorInteractions.length} major drug interaction(s) detected`,
                requiresImmediateAction: false,
            });
        }
        if (analysis.diseaseInteractions.length > 0) {
            alerts.push({
                level: 'HIGH',
                type: 'DISEASE_INTERACTION',
                title: 'DISEASE INTERACTION',
                message: 'Medication may interact with existing medical conditions',
                requiresImmediateAction: false,
            });
        }
        return alerts;
    }
    requiresPharmacistReview(alerts) {
        return alerts.some(alert => alert.level === 'CRITICAL' ||
            (alert.level === 'HIGH' && alert.requiresImmediateAction));
    }
    medicationToDetails(medication) {
        return {
            name: medication.name,
            dosage: medication.dosage,
            route: medication.route || 'oral',
            frequency: medication.frequency,
            class: this.getTherapeuticClass(medication.name),
        };
    }
    async analyzeMedicationAppropriateness(medications, conditions) {
        const appropriate = [];
        const inappropriate = [];
        const concerns = [];
        for (const medication of medications) {
            const isAppropriate = await this.checkMedicationAppropriateness(this.medicationToDetails(medication), conditions);
            if (isAppropriate.appropriate) {
                appropriate.push(medication);
            }
            else {
                inappropriate.push(medication);
                concerns.push(isAppropriate.concern);
            }
        }
        return {
            appropriateMedications: appropriate.length,
            inappropriateMedications: inappropriate.length,
            concerns,
        };
    }
    async generateReviewRecommendations(interactions, appropriateness, medications) {
        const recommendations = [];
        if (interactions.some(i => i.severity === 'MAJOR' || i.severity === 'CONTRAINDICATED')) {
            recommendations.push('URGENT: Major drug interactions require immediate attention');
        }
        if (appropriateness.inappropriateMedications > 0) {
            recommendations.push(`Review ${appropriateness.inappropriateMedications} potentially inappropriate medications`);
        }
        if (medications.length > 5) {
            recommendations.push('High medication burden - consider regimen simplification');
        }
        return recommendations;
    }
    async getPatientMedicationHistory(patientId) {
        return [];
    }
    async getPatientDemographics(patientId) {
        const patient = await this.studentModel.findByPk(patientId);
        return {
            age: patient ? this.calculateAge(patient.dateOfBirth) : 0,
            gender: patient?.gender,
            weight: patient?.weight,
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
    analyzeHistoricalReactions(medication, history) {
        return [];
    }
    async predictAdverseReactions(medication, demographics, history) {
        const predictions = [];
        if (demographics.age > 65) {
            if (this.isHighRiskForElderly(medication.name)) {
                predictions.push({
                    reaction: 'Increased fall risk',
                    probability: 'MODERATE',
                    riskFactors: ['Age > 65', 'Medication class'],
                    prevention: 'Monitor for dizziness, adjust dose if needed',
                });
            }
        }
        return predictions;
    }
    async checkDrugInducedDiseaseRisks(medication, demographics) {
        return [];
    }
    calculateAdverseReactionRisk(historical, predicted, diseaseRisks) {
        let risk = 0;
        risk += historical.length * 20;
        risk += predicted.filter(p => p.probability === 'HIGH').length * 15;
        risk += predicted.filter(p => p.probability === 'MODERATE').length * 10;
        risk += diseaseRisks.length * 25;
        return Math.min(risk, 100);
    }
    generateMonitoringRecommendations(historical, predicted) {
        const recommendations = [];
        if (historical.length > 0) {
            recommendations.push('Monitor closely for recurrence of previous adverse reactions');
        }
        if (predicted.some(p => p.probability === 'HIGH')) {
            recommendations.push('High-risk medication - intensive monitoring required');
        }
        return recommendations;
    }
    async getPatientLabResults(patientId) {
        return [];
    }
    async analyzeRegimenEffectiveness(medications, conditions, labs) {
        return {
            effectivenessScore: 75,
            controlledConditions: conditions.length,
            uncontrolledConditions: 0,
            sideEffectsReported: 0,
        };
    }
    async identifyOptimizationOpportunities(medications, effectiveness) {
        const opportunities = [];
        const multipleDaily = medications.filter(m => m.frequency?.includes('daily') && !m.frequency?.includes('once'));
        if (multipleDaily.length > 0) {
            opportunities.push({
                type: 'DOSING_FREQUENCY',
                description: 'Consider once-daily alternatives to improve adherence',
                potentialBenefit: 'Improved medication adherence',
                medications: multipleDaily.map(m => m.name),
            });
        }
        return opportunities;
    }
    async generateOptimizedRegimen(currentMedications, opportunities) {
        return currentMedications.map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            changes: [],
        }));
    }
    calculateImprovementMetrics(current, optimized) {
        return {
            medicationsReduced: Math.max(0, current.length - optimized.length),
            costReduction: 0,
            adherenceImprovement: 5,
            sideEffectReduction: 0,
        };
    }
    calculateCostSavings(current, optimized) {
        return 0;
    }
    async getAdherenceData(patientId) {
        return {
            overallAdherence: 85,
            medications: [],
        };
    }
    generateSafetyAlerts(metrics, review) {
        const alerts = [];
        if (metrics.majorInteractions > 0) {
            alerts.push({
                level: 'CRITICAL',
                type: 'INTERACTION',
                title: 'MAJOR DRUG INTERACTIONS',
                message: `${metrics.majorInteractions} major interactions require immediate attention`,
                actionRequired: 'Consult pharmacist immediately',
            });
        }
        if (metrics.adherenceRate < 70) {
            alerts.push({
                level: 'HIGH',
                type: 'ADHERENCE',
                title: 'LOW MEDICATION ADHERENCE',
                message: `Adherence rate is ${metrics.adherenceRate}%`,
                actionRequired: 'Review adherence barriers and interventions',
            });
        }
        return alerts;
    }
    calculatePatientRiskScore(metrics) {
        let score = 0;
        score += metrics.highRiskMedications * 15;
        score += metrics.majorInteractions * 20;
        score += (100 - metrics.adherenceRate);
        return Math.min(score, 100);
    }
    getRiskLevel(score) {
        if (score >= 70)
            return 'CRITICAL';
        if (score >= 50)
            return 'HIGH';
        if (score >= 30)
            return 'MODERATE';
        return 'LOW';
    }
    generateSafetyRecommendations(metrics, riskScore) {
        const recommendations = [];
        if (riskScore >= 70) {
            recommendations.push('CRITICAL RISK: Immediate pharmacist consultation required');
        }
        if (metrics.adherenceRate < 80) {
            recommendations.push('Implement adherence improvement strategies');
        }
        if (metrics.totalMedications > 10) {
            recommendations.push('Consider medication regimen review for simplification');
        }
        return recommendations;
    }
    areSameClass(med1, med2) {
        return med1.class === med2.class && med1.class !== undefined;
    }
    isRenallyCleared(medication) {
        const renalMedications = [
            'digoxin', 'lithium', 'aminoglycosides', 'vancomycin',
            'acyclovir', 'ganciclovir', 'tenofovir', 'cidofovir'
        ];
        return renalMedications.some(med => medication.toLowerCase().includes(med));
    }
    isHepaticallyMetabolized(medication) {
        const hepaticMedications = [
            'warfarin', 'theophylline', 'carbamazepine', 'phenytoin',
            'amiodarone', 'cyclosporine', 'tacrolimus'
        ];
        return hepaticMedications.some(med => medication.toLowerCase().includes(med));
    }
    affectsCardiovascularSystem(medication) {
        const cardioMedications = [
            'digoxin', 'amiodarone', 'beta-blockers', 'ace-inhibitors',
            'diuretics', 'anticoagulants', 'antiplatelets'
        ];
        return cardioMedications.some(med => medication.toLowerCase().includes(med));
    }
    isAllergicToMedication(medication, allergy) {
        return allergy.allergen?.toLowerCase().includes(medication.toLowerCase()) ||
            medication.toLowerCase().includes(allergy.allergen?.toLowerCase());
    }
    hasCrossReactivity(medication, allergy) {
        const penicillinAllergy = allergy.allergen?.toLowerCase().includes('penicillin');
        const cephalosporinMed = medication.toLowerCase().includes('cephalosporin');
        return penicillinAllergy && cephalosporinMed;
    }
    areDuplicateTherapies(med1, med2) {
        return med1.class === med2.class && med1.class !== 'other';
    }
    getTherapeuticClass(medication) {
        const med = medication.toLowerCase();
        if (med.includes('statin'))
            return 'statin';
        if (med.includes('beta') && med.includes('blocker'))
            return 'beta-blocker';
        if (med.includes('ace') && med.includes('inhibitor'))
            return 'ace-inhibitor';
        if (med.includes('arb'))
            return 'arb';
        if (med.includes('diuretic'))
            return 'diuretic';
        if (med.includes('antibiotic'))
            return 'antibiotic';
        if (med.includes('antidepressant'))
            return 'antidepressant';
        if (med.includes('antipsychotic'))
            return 'antipsychotic';
        return 'other';
    }
    isHighRiskMedication(medication) {
        const highRiskMeds = [
            'warfarin', 'insulin', 'digoxin', 'lithium',
            'chemotherapy', 'immunosuppressants', 'anticoagulants'
        ];
        return highRiskMeds.some(med => medication.toLowerCase().includes(med));
    }
    async checkMedicationAppropriateness(medication, conditions) {
        return { appropriate: true };
    }
    isHighRiskForElderly(medication) {
        const highRiskElderly = [
            'anticholinergics', 'benzodiazepines', 'narcotics',
            'antihistamines', 'tricyclic antidepressants'
        ];
        return highRiskElderly.some(med => medication.toLowerCase().includes(med));
    }
};
exports.MedicationInteractionCheckerService = MedicationInteractionCheckerService;
exports.MedicationInteractionCheckerService = MedicationInteractionCheckerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(models_1.Medication)),
    __param(1, (0, sequelize_1.InjectModel)(models_2.DrugInteraction)),
    __param(2, (0, sequelize_1.InjectModel)(models_3.Student)),
    __param(3, (0, sequelize_1.InjectModel)(models_4.HealthRecord)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, sequelize_typescript_1.Sequelize])
], MedicationInteractionCheckerService);
//# sourceMappingURL=medication-interaction-checker.service.js.map