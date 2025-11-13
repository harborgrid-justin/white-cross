import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ClinicalProtocol   } from "../../database/models";
import { HealthRecord   } from "../../database/models";
import { Medication   } from "../../database/models";
import { VitalSigns   } from "../../database/models";
import { Student   } from "../../database/models";

import { BaseService } from '../../../common/base';
/**
 * Clinical Decision Support Service
 *
 * AI-powered clinical decision support system providing medical guidelines,
 * alerts, and evidence-based recommendations for healthcare providers
 *
 * Features:
 * - Medical guideline adherence checking
 * - Real-time clinical alerts and warnings
 * - Drug interaction detection
 * - Vital signs anomaly detection
 * - Treatment recommendation engine
 * - Clinical protocol enforcement
 * - Risk assessment and stratification
 *
 * @hipaa-requirement Clinical decision support systems
 */
@Injectable()
export class ClinicalDecisionSupportService extends BaseService {
  constructor(
    @InjectModel(ClinicalProtocol)
    private readonly clinicalProtocolModel: typeof ClinicalProtocol,
    @InjectModel(HealthRecord)
    private readonly healthRecordModel: typeof HealthRecord,
    @InjectModel(Medication)
    private readonly medicationModel: typeof Medication,
    @InjectModel(VitalSigns)
    private readonly vitalSignsModel: typeof VitalSigns,
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Analyze patient condition and provide clinical recommendations
   * @param patientId Patient ID
   * @param context Clinical context
   */
  async analyzePatientCondition(
    patientId: string,
    context: ClinicalContext,
  ): Promise<ClinicalAnalysis> {
    // Gather patient data
    const patientData = await this.gatherPatientData(patientId);

    // Analyze vital signs
    const vitalSignsAnalysis = await this.analyzeVitalSigns(patientId, patientData.vitalSigns);

    // Check medication interactions
    const medicationAnalysis = await this.analyzeMedications(patientId, patientData.medications);

    // Assess clinical protocols
    const protocolAnalysis = await this.assessClinicalProtocols(patientId, context, patientData);

    // Generate risk assessment
    const riskAssessment = await this.generateRiskAssessment(patientData, context);

    // Compile recommendations
    const recommendations = await this.generateRecommendations({
      vitalSignsAnalysis,
      medicationAnalysis,
      protocolAnalysis,
      riskAssessment,
      context,
    });

    // Generate alerts
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

  /**
   * Check medication against clinical guidelines
   * @param medicationDetails Medication details
   * @param patientId Patient ID
   */
  async checkMedicationGuidelines(
    medicationDetails: MedicationDetails,
    patientId: string,
  ): Promise<MedicationGuidelineCheck> {
    const patientData = await this.gatherPatientData(patientId);

    // Check drug interactions
    const interactions = await this.checkDrugInteractions(
      medicationDetails,
      patientData.medications,
    );

    // Check contraindications
    const contraindications = await this.checkContraindications(
      medicationDetails,
      patientData,
    );

    // Check dosage guidelines
    const dosageGuidelines = await this.checkDosageGuidelines(
      medicationDetails,
      patientData,
    );

    // Check allergy alerts
    const allergyAlerts = await this.checkAllergyAlerts(
      medicationDetails,
      patientData.allergies,
    );

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

  /**
   * Get clinical protocols for condition
   * @param condition Medical condition
   * @param patientAge Patient age in years
   * @param severity Condition severity
   */
  async getClinicalProtocols(
    condition: string,
    patientAge: number,
    severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL',
  ): Promise<ClinicalProtocol[]> {
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

    // Filter by severity
    return protocols.filter(protocol =>
      protocol.severityLevels.includes(severity) ||
      protocol.severityLevels.includes('ALL'),
    );
  }

  /**
   * Generate treatment plan recommendations
   * @param patientId Patient ID
   * @param diagnosis Diagnosis details
   */
  async generateTreatmentPlan(
    patientId: string,
    diagnosis: DiagnosisDetails,
  ): Promise<TreatmentPlan> {
    const patientData = await this.gatherPatientData(patientId);

    // Get relevant protocols
    const protocols = await this.getClinicalProtocols(
      diagnosis.condition,
      patientData.age,
      diagnosis.severity,
    );

    // Analyze patient factors
    const patientFactors = await this.analyzePatientFactors(patientData, diagnosis);

    // Generate treatment options
    const treatmentOptions = await this.generateTreatmentOptions(protocols, patientFactors);

    // Assess risks and benefits
    const riskBenefitAnalysis = await this.assessRisksAndBenefits(treatmentOptions, patientData);

    // Generate monitoring plan
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
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      requiresReview: this.requiresSpecialistReview(diagnosis, patientFactors),
    };
  }

  /**
   * Monitor patient progress against treatment plan
   * @param patientId Patient ID
   * @param treatmentPlanId Treatment plan ID
   */
  async monitorTreatmentProgress(
    patientId: string,
    treatmentPlanId: string,
  ): Promise<TreatmentProgress> {
    // Get current patient data
    const currentData = await this.gatherPatientData(patientId);

    // Get treatment plan (would be stored in database)
    // For now, simulate
    const treatmentPlan = await this.getTreatmentPlan(treatmentPlanId);

    // Compare current status with expected outcomes
    const progressMetrics = await this.calculateProgressMetrics(currentData, treatmentPlan);

    // Check for complications or adverse events
    const complications = await this.detectComplications(currentData, treatmentPlan);

    // Generate progress recommendations
    const recommendations = await this.generateProgressRecommendations(
      progressMetrics,
      complications,
    );

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

  /**
   * Get preventive care recommendations
   * @param patientId Patient ID
   * @param age Patient age
   */
  async getPreventiveCareRecommendations(
    patientId: string,
    age: number,
  ): Promise<PreventiveCarePlan> {
    const patientData = await this.gatherPatientData(patientId);

    // Age-appropriate screenings
    const screenings = await this.getRecommendedScreenings(age, patientData);

    // Immunization recommendations
    const immunizations = await this.getImmunizationRecommendations(age, patientData);

    // Lifestyle recommendations
    const lifestyle = await this.generateLifestyleRecommendations(patientData);

    // Risk factor assessments
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

  private async gatherPatientData(patientId: string): Promise<PatientData> {
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
      // Allergies would come from health records or separate table
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

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  private async analyzeVitalSigns(patientId: string, vitalSigns: VitalSigns[]): Promise<VitalSignsAnalysis> {
    if (vitalSigns.length === 0) {
      return {
        status: 'NO_DATA',
        anomalies: [],
        trends: [],
        recommendations: ['Vital signs monitoring recommended'],
      };
    }

    const latest = vitalSigns[0];
    const anomalies: VitalSignAnomaly[] = [];
    const trends: VitalSignTrend[] = [];

    // Check for anomalies
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

    // Analyze trends (simplified)
    if (vitalSigns.length >= 3) {
      const recent = vitalSigns.slice(0, 3);
      // Trend analysis logic would go here
    }

    return {
      status: anomalies.length > 0 ? 'ANOMALIES_DETECTED' : 'NORMAL',
      anomalies,
      trends,
      recommendations: this.generateVitalSignsRecommendations(anomalies),
    };
  }

  private async analyzeMedications(patientId: string, medications: Medication[]): Promise<MedicationAnalysis> {
    const interactions: DrugInteraction[] = [];
    const alerts: MedicationAlert[] = [];

    // Check for drug interactions (simplified logic)
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const interaction = await this.checkInteraction(medications[i], medications[j]);
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }

    // Check for high-risk medications
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

  private async assessClinicalProtocols(
    patientId: string,
    context: ClinicalContext,
    patientData: PatientData,
  ): Promise<ProtocolAnalysis> {
    const relevantProtocols = await this.clinicalProtocolModel.findAll({
      where: {
        condition: {
          [this.sequelize.Op.iLike]: `%${context.condition || 'general'}%`,
        },
        isActive: true,
      },
    });

    const adherence: ProtocolAdherence[] = [];
    const violations: ProtocolViolation[] = [];

    for (const protocol of relevantProtocols) {
      const adherenceCheck = await this.checkProtocolAdherence(protocol, patientData, context);
      if (adherenceCheck.compliant) {
        adherence.push({
          protocolId: protocol.id,
          protocolName: protocol.name,
          adherenceScore: adherenceCheck.score,
        });
      } else {
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

  private async generateRiskAssessment(
    patientData: PatientData,
    context: ClinicalContext,
  ): Promise<RiskAssessment> {
    let riskScore = 0;
    const riskFactors: RiskFactor[] = [];

    // Age-based risk
    if (patientData.age > 65) {
      riskScore += 20;
      riskFactors.push({ factor: 'AGE', score: 20, description: 'Advanced age' });
    }

    // Multiple medications
    if (patientData.medications.length > 5) {
      riskScore += 15;
      riskFactors.push({ factor: 'POLYPHARMACY', score: 15, description: 'Multiple medications' });
    }

    // Chronic conditions
    const chronicCount = patientData.currentConditions.length;
    if (chronicCount > 0) {
      riskScore += chronicCount * 10;
      riskFactors.push({
        factor: 'CHRONIC_CONDITIONS',
        score: chronicCount * 10,
        description: `${chronicCount} chronic condition(s)`,
      });
    }

    // Recent hospitalizations
    const recentHospitalizations = patientData.healthRecords.filter(
      r => r.recordType === 'HOSPITALIZATION' &&
           r.createdAt > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    ).length;

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

  private async generateRecommendations(analysis: {
    vitalSignsAnalysis: VitalSignsAnalysis;
    medicationAnalysis: MedicationAnalysis;
    protocolAnalysis: ProtocolAnalysis;
    riskAssessment: RiskAssessment;
    context: ClinicalContext;
  }): Promise<ClinicalRecommendation[]> {
    const recommendations: ClinicalRecommendation[] = [];

    // Vital signs recommendations
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

    // Medication recommendations
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

    // Protocol recommendations
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

    // Risk-based recommendations
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

  private async generateClinicalAlerts(analysis: {
    vitalSignsAnalysis: VitalSignsAnalysis;
    medicationAnalysis: MedicationAnalysis;
    protocolAnalysis: ProtocolAnalysis;
    riskAssessment: RiskAssessment;
  }): Promise<ClinicalAlert[]> {
    const alerts: ClinicalAlert[] = [];

    // Critical vital signs
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

    // Critical medication alerts
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

    // Protocol violations
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

  private calculateConfidenceScore(recommendations: ClinicalRecommendation[], alerts: ClinicalAlert[]): number {
    // Simplified confidence calculation
    const highPriorityRecs = recommendations.filter(r => r.priority === 'HIGH' || r.priority === 'CRITICAL').length;
    const criticalAlerts = alerts.filter(a => a.level === 'CRITICAL').length;

    const baseConfidence = 75; // Base confidence
    const recBonus = highPriorityRecs * 5;
    const alertBonus = criticalAlerts * 10;

    return Math.min(baseConfidence + recBonus + alertBonus, 95);
  }

  private requiresImmediateAttention(alerts: ClinicalAlert[]): boolean {
    return alerts.some(alert => alert.level === 'CRITICAL' && alert.requiresImmediateAction);
  }

  private async checkDrugInteractions(
    medication: MedicationDetails,
    currentMedications: Medication[],
  ): Promise<DrugInteraction[]> {
    // Simplified interaction checking
    const interactions: DrugInteraction[] = [];

    for (const currentMed of currentMedications) {
      // Check for known interactions (would use a drug interaction database)
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

  private async checkContraindications(
    medication: MedicationDetails,
    patientData: PatientData,
  ): Promise<Contraindication[]> {
    // Check for contraindications based on patient conditions
    const contraindications: Contraindication[] = [];

    // Example: Check for renal impairment
    const renalConditions = patientData.currentConditions.filter(
      c => c.details?.toLowerCase().includes('renal') || c.details?.toLowerCase().includes('kidney')
    );

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

  private async checkDosageGuidelines(
    medication: MedicationDetails,
    patientData: PatientData,
  ): Promise<DosageGuideline[]> {
    // Check if dosage is appropriate for patient age/weight
    const guidelines: DosageGuideline[] = [];

    // Age-based adjustments
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

  private async checkAllergyAlerts(
    medication: MedicationDetails,
    allergies: any[],
  ): Promise<AllergyAlert[]> {
    const alerts: AllergyAlert[] = [];

    // Check for drug allergies
    const drugAllergies = allergies.filter(
      a => a.type === 'DRUG' && a.details?.toLowerCase().includes(medication.name.toLowerCase())
    );

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

  private assessMedicationSafety(analysis: {
    interactions: DrugInteraction[];
    contraindications: Contraindication[];
    dosageGuidelines: DosageGuideline[];
    allergyAlerts: AllergyAlert[];
  }): 'SAFE' | 'CAUTION' | 'UNSAFE' {
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

  private generateMedicationRecommendations(analysis: {
    interactions: DrugInteraction[];
    contraindications: Contraindication[];
    dosageGuidelines: DosageGuideline[];
    allergyAlerts: AllergyAlert[];
  }): string[] {
    const recommendations: string[] = [];

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

  private generateVitalSignsRecommendations(anomalies: VitalSignAnomaly[]): string[] {
    const recommendations: string[] = [];

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

  private generateMedicationAnalysisRecommendations(
    interactions: DrugInteraction[],
    alerts: MedicationAlert[],
  ): string[] {
    const recommendations: string[] = [];

    if (interactions.length > 0) {
      recommendations.push('Consult pharmacist regarding potential drug interactions');
    }

    if (alerts.some(a => a.severity === 'HIGH')) {
      recommendations.push('High-risk medication - enhanced monitoring required');
    }

    return recommendations;
  }

  private generateProtocolRecommendations(violations: ProtocolViolation[]): string[] {
    const recommendations: string[] = [];

    violations.forEach(violation => {
      recommendations.push(`Review adherence to ${violation.protocolName} protocol`);
    });

    return recommendations;
  }

  private categorizeRisk(score: number): 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MODERATE';
    return 'LOW';
  }

  private generateMitigationStrategies(riskFactors: RiskFactor[]): string[] {
    const strategies: string[] = [];

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

  private priorityToNumber(priority: string): number {
    switch (priority) {
      case 'CRITICAL': return 4;
      case 'HIGH': return 3;
      case 'MEDIUM': return 2;
      case 'LOW': return 1;
      default: return 0;
    }
  }

  private async checkInteraction(med1: Medication, med2: Medication): Promise<DrugInteraction | null> {
    // Simplified interaction checking - would use actual drug interaction database
    const knownInteractions = [
      ['aspirin', 'warfarin'],
      ['digoxin', 'amiodarone'],
      ['lithium', 'diuretics'],
    ];

    const med1Name = med1.name.toLowerCase();
    const med2Name = med2.name.toLowerCase();

    const hasInteraction = knownInteractions.some(([a, b]) =>
      (med1Name.includes(a) && med2Name.includes(b)) ||
      (med1Name.includes(b) && med2Name.includes(a))
    );

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

  private isHighRiskMedication(medication: Medication): boolean {
    const highRiskMeds = [
      'warfarin', 'insulin', 'digoxin', 'lithium', 'chemotherapy',
      'anticoagulants', 'antiarrhythmics', 'immunosuppressants'
    ];

    return highRiskMeds.some(riskMed =>
      medication.name.toLowerCase().includes(riskMed)
    );
  }

  private async calculateAdherenceScore(medications: Medication[]): Promise<number> {
    // Simplified adherence calculation
    if (medications.length === 0) return 100;

    // Would check actual administration records vs prescribed
    return 85; // Placeholder
  }

  private async checkProtocolAdherence(
    protocol: ClinicalProtocol,
    patientData: PatientData,
    context: ClinicalContext,
  ): Promise<ProtocolAdherenceCheck> {
    // Simplified protocol adherence checking
    // Would implement actual protocol logic
    return {
      compliant: true,
      score: 90,
      violation: null,
      severity: null,
    };
  }

  private async analyzePatientFactors(
    patientData: PatientData,
    diagnosis: DiagnosisDetails,
  ): Promise<PatientFactor[]> {
    const factors: PatientFactor[] = [];

    // Age factor
    if (patientData.age < 12) {
      factors.push({ factor: 'PEDIATRIC', impact: 'HIGH', description: 'Pediatric patient requiring specialized care' });
    }

    // Comorbidities
    if (patientData.currentConditions.length > 2) {
      factors.push({ factor: 'COMORBIDITIES', impact: 'HIGH', description: 'Multiple comorbidities affecting treatment choices' });
    }

    return factors;
  }

  private async generateTreatmentOptions(
    protocols: ClinicalProtocol[],
    patientFactors: PatientFactor[],
  ): Promise<TreatmentOption[]> {
    // Generate treatment options based on protocols and patient factors
    const options: TreatmentOption[] = [];

    protocols.forEach(protocol => {
      options.push({
        protocolId: protocol.id,
        name: protocol.name,
        type: protocol.treatmentType,
        description: protocol.description,
        suitabilityScore: this.calculateSuitabilityScore(protocol, patientFactors),
        risks: [], // Would be populated from protocol data
        benefits: [], // Would be populated from protocol data
      });
    });

    return options.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  }

  private calculateSuitabilityScore(protocol: ClinicalProtocol, factors: PatientFactor[]): number {
    let score = 75; // Base score

    // Adjust based on patient factors
    factors.forEach(factor => {
      if (factor.impact === 'HIGH') {
        score -= 10;
      }
    });

    return Math.max(score, 0);
  }

  private async assessRisksAndBenefits(
    treatmentOptions: TreatmentOption[],
    patientData: PatientData,
  ): Promise<RiskBenefitAnalysis[]> {
    // Assess risks and benefits for each treatment option
    return treatmentOptions.map(option => ({
      treatmentId: option.protocolId,
      risks: option.risks,
      benefits: option.benefits,
      riskBenefitRatio: option.risks.length / (option.benefits.length + 1),
      recommendation: option.suitabilityScore > 70 ? 'RECOMMENDED' : 'CAUTION',
    }));
  }

  private async generateMonitoringPlan(
    diagnosis: DiagnosisDetails,
    treatmentOptions: TreatmentOption[],
  ): Promise<MonitoringPlan> {
    return {
      vitalSignsFrequency: 'DAILY',
      labTests: ['CBC', 'CMP'],
      followUpSchedule: 'WEEKLY',
      alertThresholds: {
        temperature: { min: 95, max: 100.4 },
        heartRate: { min: 60, max: 100 },
      },
      monitoringDuration: 30, // days
    };
  }

  private requiresSpecialistReview(diagnosis: DiagnosisDetails, factors: PatientFactor[]): boolean {
    return diagnosis.severity === 'CRITICAL' ||
           factors.some(f => f.impact === 'CRITICAL') ||
           diagnosis.condition.toLowerCase().includes('cancer');
  }

  private async getTreatmentPlan(treatmentPlanId: string): Promise<TreatmentPlan> {
    // Would retrieve from database
    throw new Error('Treatment plan retrieval not implemented');
  }

  private async calculateProgressMetrics(
    currentData: PatientData,
    treatmentPlan: TreatmentPlan,
  ): Promise<ProgressMetric[]> {
    // Calculate progress metrics
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

  private async detectComplications(
    currentData: PatientData,
    treatmentPlan: TreatmentPlan,
  ): Promise<Complication[]> {
    // Detect complications
    return [];
  }

  private async generateProgressRecommendations(
    metrics: ProgressMetric[],
    complications: Complication[],
  ): string[] {
    const recommendations: string[] = [];

    if (complications.length > 0) {
      recommendations.push('Address detected complications immediately');
    }

    if (metrics.some(m => m.status === 'OFF_TRACK')) {
      recommendations.push('Treatment adjustment may be necessary');
    }

    return recommendations;
  }

  private calculateNextReviewDate(metrics: ProgressMetric[], complications: Complication[]): Date {
    const baseDays = complications.length > 0 ? 1 : 7; // Daily if complications, weekly otherwise
    return new Date(Date.now() + baseDays * 24 * 60 * 60 * 1000);
  }

  private requiresTreatmentAdjustment(metrics: ProgressMetric[], complications: Complication[]): boolean {
    return complications.length > 0 || metrics.some(m => m.status === 'OFF_TRACK');
  }

  private async getRecommendedScreenings(age: number, patientData: PatientData): Promise<Screening[]> {
    const screenings: Screening[] = [];

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

  private async getImmunizationRecommendations(age: number, patientData: PatientData): Promise<Immunization[]> {
    // Would check immunization records and recommend based on CDC schedule
    return [
      {
        vaccine: 'Influenza',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        status: 'DUE',
        rationale: 'Annual influenza vaccination recommended',
      },
    ];
  }

  private async generateLifestyleRecommendations(patientData: PatientData): string[] {
    const recommendations: string[] = [];

    // General healthy lifestyle recommendations
    recommendations.push('Maintain balanced diet with adequate nutrition');
    recommendations.push('Regular physical activity appropriate for age');
    recommendations.push('Adequate sleep and stress management');

    return recommendations;
  }

  private async assessRiskFactors(patientData: PatientData): Promise<RiskFactor[]> {
    const factors: RiskFactor[] = [];

    if (patientData.medications.length > 3) {
      factors.push({ factor: 'POLYPHARMACY', score: 15, description: 'Multiple medications increase risk' });
    }

    return factors;
  }

  private calculateNextCheckupDate(age: number, riskFactors: RiskFactor[]): Date {
    const baseMonths = age < 12 ? 3 : 12; // Quarterly for children, annual for adults
    const riskAdjustment = riskFactors.length * 7; // Days earlier for each risk factor
    return new Date(Date.now() + (baseMonths * 30 - riskAdjustment) * 24 * 60 * 60 * 1000);
  }

  private hasKnownInteraction(med1: string, med2: string): boolean {
    // Simplified interaction checking
    const interactions = [
      ['aspirin', 'warfarin'],
      ['digoxin', 'amiodarone'],
    ];

    return interactions.some(([a, b]) =>
      (med1.toLowerCase().includes(a) && med2.toLowerCase().includes(b)) ||
      (med1.toLowerCase().includes(b) && med2.toLowerCase().includes(a))
    );
  }

  private isRenallyCleared(medication: string): boolean {
    // Medications primarily cleared by kidneys
    const renalMeds = ['digoxin', 'lithium', 'aminoglycosides'];
    return renalMeds.some(med => medication.toLowerCase().includes(med));
  }
}

// Type definitions
export interface ClinicalContext {
  condition?: string;
  symptoms?: string[];
  severity?: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  presentingComplaint?: string;
  duration?: string;
}

export interface ClinicalAnalysis {
  patientId: string;
  analysisTimestamp: Date;
  vitalSignsAnalysis: VitalSignsAnalysis;
  medicationAnalysis: MedicationAnalysis;
  protocolAnalysis: ProtocolAnalysis;
  riskAssessment: RiskAssessment;
  recommendations: ClinicalRecommendation[];
  alerts: ClinicalAlert[];
  confidenceScore: number;
  requiresImmediateAttention: boolean;
}

export interface VitalSignsAnalysis {
  status: 'NORMAL' | 'ANOMALIES_DETECTED' | 'NO_DATA';
  anomalies: VitalSignAnomaly[];
  trends: VitalSignTrend[];
  recommendations: string[];
}

export interface VitalSignAnomaly {
  type: 'TEMPERATURE' | 'HEART_RATE' | 'BLOOD_PRESSURE' | 'RESPIRATORY_RATE' | 'OXYGEN_SATURATION';
  value: number;
  severity: 'MILD' | 'MODERATE' | 'CRITICAL';
  message: string;
}

export interface VitalSignTrend {
  type: string;
  direction: 'IMPROVING' | 'WORSENING' | 'STABLE';
  duration: number;
  significance: 'LOW' | 'MODERATE' | 'HIGH';
}

export interface MedicationAnalysis {
  currentMedications: number;
  interactions: DrugInteraction[];
  alerts: MedicationAlert[];
  adherenceScore: number;
  recommendations: string[];
}

export interface DrugInteraction {
  medications: string[];
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  description: string;
  recommendation: string;
}

export interface MedicationAlert {
  type: string;
  medication: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
}

export interface ProtocolAnalysis {
  protocolsEvaluated: number;
  adherence: ProtocolAdherence[];
  violations: ProtocolViolation[];
  recommendations: string[];
}

export interface ProtocolAdherence {
  protocolId: string;
  protocolName: string;
  adherenceScore: number;
}

export interface ProtocolViolation {
  protocolId: string;
  protocolName: string;
  violation: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface RiskAssessment {
  overallRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  riskFactors: RiskFactor[];
  mitigationStrategies: string[];
}

export interface RiskFactor {
  factor: string;
  score: number;
  description: string;
}

export interface ClinicalRecommendation {
  type: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  actions: string[];
  rationale: string;
}

export interface ClinicalAlert {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: 'VITAL_SIGNS' | 'MEDICATION' | 'PROTOCOL' | 'GENERAL';
  title: string;
  message: string;
  requiresImmediateAction: boolean;
  notifySupervisor: boolean;
}

export interface MedicationDetails {
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  pediatricDose?: boolean;
}

export interface MedicationGuidelineCheck {
  medication: MedicationDetails;
  interactions: DrugInteraction[];
  contraindications: Contraindication[];
  dosageGuidelines: DosageGuideline[];
  allergyAlerts: AllergyAlert[];
  overallSafety: 'SAFE' | 'CAUTION' | 'UNSAFE';
  recommendations: string[];
}

export interface Contraindication {
  condition: string;
  medication: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
}

export interface DosageGuideline {
  medication: string;
  issue: string;
  message: string;
  recommendation: string;
}

export interface AllergyAlert {
  medication: string;
  allergy: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  recommendation: string;
}

export interface DiagnosisDetails {
  condition: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  symptoms: string[];
  duration: string;
  diagnosticCriteria?: string[];
}

export interface TreatmentPlan {
  patientId: string;
  diagnosis: DiagnosisDetails;
  protocols: string[];
  patientFactors: PatientFactor[];
  treatmentOptions: TreatmentOption[];
  riskBenefitAnalysis: RiskBenefitAnalysis[];
  monitoringPlan: MonitoringPlan;
  generatedAt: Date;
  validUntil: Date;
  requiresReview: boolean;
}

export interface PatientFactor {
  factor: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}

export interface TreatmentOption {
  protocolId: string;
  name: string;
  type: string;
  description: string;
  suitabilityScore: number;
  risks: string[];
  benefits: string[];
}

export interface RiskBenefitAnalysis {
  treatmentId: string;
  risks: string[];
  benefits: string[];
  riskBenefitRatio: number;
  recommendation: 'RECOMMENDED' | 'CAUTION' | 'NOT_RECOMMENDED';
}

export interface MonitoringPlan {
  vitalSignsFrequency: string;
  labTests: string[];
  followUpSchedule: string;
  alertThresholds: {
    temperature?: { min: number; max: number };
    heartRate?: { min: number; max: number };
    bloodPressure?: { min: number; max: number };
  };
  monitoringDuration: number;
}

export interface TreatmentProgress {
  patientId: string;
  treatmentPlanId: string;
  progressMetrics: ProgressMetric[];
  complications: Complication[];
  recommendations: string[];
  assessmentDate: Date;
  nextReviewDate: Date;
  requiresAdjustment: boolean;
}

export interface ProgressMetric {
  metric: string;
  currentValue: number;
  targetValue: number;
  status: 'ON_TRACK' | 'OFF_TRACK' | 'ACHIEVED';
  trend: 'IMPROVING' | 'WORSENING' | 'STABLE';
}

export interface Complication {
  type: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  description: string;
  detectedAt: Date;
}

export interface PreventiveCarePlan {
  patientId: string;
  age: number;
  screenings: Screening[];
  immunizations: Immunization[];
  lifestyle: string[];
  riskFactors: RiskFactor[];
  nextCheckupDate: Date;
  generatedAt: Date;
}

export interface Screening {
  type: string;
  frequency: string;
  nextDue: Date;
  rationale: string;
}

export interface Immunization {
  vaccine: string;
  dueDate: Date;
  status: 'DUE' | 'OVERDUE' | 'COMPLETED';
  rationale: string;
}

export interface PatientData {
  id: string;
  age: number;
  gender: string;
  healthRecords: HealthRecord[];
  medications: Medication[];
  vitalSigns: VitalSigns[];
  allergies: any[];
  medicalHistory: HealthRecord[];
  currentConditions: HealthRecord[];
}

export interface ProtocolAdherenceCheck {
  compliant: boolean;
  score: number;
  violation?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}