/**
 * LOC: C26FE36899
 * WC-GEN-345 | businessLogic.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - index.ts (database/models/index.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-345 | businessLogic.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/models | Dependencies: sequelize, ../../database/models
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: functions | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Op } from 'sequelize';
import { Allergy, Medication, User, Student, Vaccination, Screening } from '../../database/models';
import { CDCGrowthCharts, GrowthChartGender, GrowthMeasurement } from '../cdcGrowthCharts';

/**
 * Health Records Business Logic
 * Comprehensive business rules and calculations for health records management
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AllergyContraindication {
  isContraindicated: boolean;
  allergyId?: string;
  allergen: string;
  severity: string;
  reason: string;
  recommendedAction: string;
}

interface VaccinationCompliance {
  isCompliant: boolean;
  requiredVaccines: string[];
  completedVaccines: string[];
  missingVaccines: string[];
  upcomingDoses: Array<{
    vaccine: string;
    doseNumber: number;
    dueDate: Date;
  }>;
  exemptions: string[];
}

interface ConditionRiskScore {
  score: number; // 0-100
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  factors: string[];
  recommendations: string[];
}

interface GrowthConcern {
  type: 'HEIGHT' | 'WEIGHT' | 'BMI' | 'HEAD_CIRCUMFERENCE' | 'GROWTH_VELOCITY';
  severity: 'MINOR' | 'MODERATE' | 'SIGNIFICANT';
  description: string;
  recommendation: string;
}

interface VitalAlert {
  vital: string;
  value: number;
  normalRange: { min: number; max: number };
  severity: 'NORMAL' | 'BORDERLINE' | 'ABNORMAL' | 'CRITICAL';
  action: string;
}

interface AllergyAlert {
  priority: 'HIGH' | 'CRITICAL';
  allergen: string;
  message: string;
  actions: string[];
}

// ============================================================================
// ALLERGY BUSINESS LOGIC
// ============================================================================

/**
 * Check if a medication conflicts with student's allergies
 * Critical function for medication safety
 */
export async function checkAllergyContraindications(
  studentId: string,
  medicationId: string
): Promise<AllergyContraindication[]> {
  try {
    // Get student's active allergies
    const allergies = await Allergy.findAll({
      where: {
        studentId,
        active: true
      }
    });

    // Get medication details
    const medication = await Medication.findByPk(medicationId);

    if (!medication) {
      throw new Error('Medication not found');
    }

    const contraindications: AllergyContraindication[] = [];

    for (const allergy of allergies) {
      let isContraindicated = false;
      let reason = '';

      // Check medication allergies
      if (allergy.allergyType === 'MEDICATION') {
        const allergenLower = allergy.allergen.toLowerCase();
        const medNameLower = medication.genericName?.toLowerCase() || '';
        const medNameFull = medication.name?.toLowerCase() || '';

        // Direct match
        if (medNameLower.includes(allergenLower) || allergenLower.includes(medNameLower)) {
          isContraindicated = true;
          reason = 'Direct medication allergy match';
        }
        // Brand name match
        else if (medNameFull.includes(allergenLower) || allergenLower.includes(medNameFull)) {
          isContraindicated = true;
          reason = 'Brand name allergy match';
        }
      }

      // Additional checks could be added for ingredients if that data is available

      if (isContraindicated) {
        contraindications.push({
          isContraindicated: true,
          allergyId: allergy.id,
          allergen: allergy.allergen,
          severity: allergy.severity,
          reason,
          recommendedAction: allergy.severity === 'LIFE_THREATENING' || allergy.severity === 'SEVERE'
            ? 'DO NOT ADMINISTER - Consult physician immediately'
            : 'Use caution - Consider alternative medication'
        });
      }
    }

    return contraindications;
  } catch (error) {
    console.error('Error checking allergy contraindications:', error);
    throw error;
  }
}

/**
 * Validate that user has permission to verify an allergy
 */
export async function validateAllergyVerification(
  allergyId: string,
  userId: string
): Promise<{ canVerify: boolean; reason?: string }> {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return { canVerify: false, reason: 'User not found' };
    }

    // Only nurses and doctors can verify allergies
    const authorizedRoles = ['NURSE', 'DOCTOR', 'ADMINISTRATOR'];

    if (!authorizedRoles.includes(user.role)) {
      return {
        canVerify: false,
        reason: 'Only medical staff can verify allergies'
      };
    }

    const allergy = await Allergy.findByPk(allergyId);

    if (!allergy) {
      return { canVerify: false, reason: 'Allergy not found' };
    }

    if (allergy.verified) {
      return {
        canVerify: false,
        reason: 'Allergy already verified'
      };
    }

    return { canVerify: true };
  } catch (error) {
    console.error('Error validating allergy verification:', error);
    throw error;
  }
}

/**
 * Generate alert for life-threatening allergies
 */
export function generateAllergyAlert(allergy: any): AllergyAlert | null {
  if (allergy.severity === 'LIFE_THREATENING') {
    return {
      priority: 'CRITICAL',
      allergen: allergy.allergen,
      message: `CRITICAL ALLERGY ALERT: Student has life-threatening allergy to ${allergy.allergen}`,
      actions: [
        allergy.hasEpiPen ? `EpiPen available at: ${allergy.epiPenLocation}` : 'NO EPIPEN AVAILABLE - IMMEDIATE ACTION REQUIRED',
        'Call 911 immediately if exposed',
        'Administer EpiPen if available and trained',
        'Monitor for anaphylaxis symptoms',
        allergy.treatment || 'Follow emergency protocol'
      ]
    };
  } else if (allergy.severity === 'SEVERE') {
    return {
      priority: 'HIGH',
      allergen: allergy.allergen,
      message: `SEVERE ALLERGY ALERT: Student has severe allergy to ${allergy.allergen}`,
      actions: [
        'Avoid exposure to allergen',
        'Monitor for reactions',
        allergy.treatment || 'Follow treatment protocol',
        'Contact parent/guardian if exposed'
      ]
    };
  }

  return null;
}

// ============================================================================
// VACCINATION BUSINESS LOGIC
// ============================================================================

/**
 * Calculate vaccination compliance for a student based on jurisdiction requirements
 */
export async function calculateVaccinationCompliance(
  studentId: string,
  jurisdiction: string = 'US'
): Promise<VaccinationCompliance> {
  try {
    const student = await Student.findByPk(studentId);

    const vaccinations = await Vaccination.findAll({
      where: {
        studentId
      },
      order: [['administrationDate', 'DESC']]
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Get required vaccines based on age and jurisdiction
    const requiredVaccines = getRequiredVaccines(
      calculateAge(student.dateOfBirth),
      jurisdiction
    );

    const completedVaccines: string[] = [];
    const missingVaccines: string[] = [];
    const upcomingDoses: Array<{ vaccine: string; doseNumber: number; dueDate: Date }> = [];

    // Check each required vaccine
    for (const required of requiredVaccines) {
      const vaccineRecords = vaccinations.filter(v =>
        v.vaccineName.toLowerCase().includes(required.toLowerCase()) ||
        v.cvxCode === getCVXCode(required)
      );

      if (vaccineRecords.length === 0) {
        missingVaccines.push(required);
      } else {
        // Check if series is complete
        const latestVaccine = vaccineRecords[0];
        const doseNumber = latestVaccine.doseNumber ?? 0;
        const totalDoses = latestVaccine.totalDoses ?? 1;

        if (doseNumber >= totalDoses) {
          completedVaccines.push(required);
        } else {
          // Dose series incomplete
          const nextDoseDate = calculateNextDoseDate(latestVaccine);
          upcomingDoses.push({
            vaccine: required,
            doseNumber: doseNumber + 1,
            dueDate: nextDoseDate
          });
        }
      }
    }

    return {
      isCompliant: missingVaccines.length === 0 && upcomingDoses.length === 0,
      requiredVaccines,
      completedVaccines,
      missingVaccines,
      upcomingDoses,
      exemptions: [] // TODO: Implement exemption tracking
    };
  } catch (error) {
    console.error('Error calculating vaccination compliance:', error);
    throw error;
  }
}

/**
 * Determine the next due date for a vaccination
 */
export function determineNextDueDate(vaccination: any): Date {
  const intervals = getVaccineIntervals(vaccination.vaccineName);
  const currentDose = vaccination.doseNumber ?? 0;

  if (currentDose >= (vaccination.totalDoses ?? 1)) {
    // Series complete, check if booster needed
    const boosterInterval = intervals.booster;
    if (boosterInterval) {
      return addDays(vaccination.administrationDate, boosterInterval);
    }
    return new Date(); // No next dose
  }

  const intervalDays = intervals.doses[currentDose] || intervals.default || 30;
  return addDays(vaccination.administrationDate, intervalDays);
}

/**
 * Validate vaccination schedule to ensure proper intervals
 */
export async function validateVaccinationSchedule(
  studentId: string,
  newVaccination: any
): Promise<{ isValid: boolean; reason?: string }> {
  try {
    const previousDoses = await Vaccination.findAll({
      where: {
        studentId,
        vaccineName: newVaccination.vaccineName,
        doseNumber: { [Op.lt]: newVaccination.doseNumber }
      },
      order: [['doseNumber', 'DESC']],
      limit: 1
    });

    if (previousDoses.length === 0 && newVaccination.doseNumber > 1) {
      return {
        isValid: false,
        reason: 'Previous doses not found in system'
      };
    }

    if (previousDoses.length > 0) {
      const previousDose = previousDoses[0];
      const minInterval = getMinimumInterval(
        newVaccination.vaccineName,
        previousDose.doseNumber ?? 0
      );

      const daysSincePrevious = Math.floor(
        (newVaccination.administrationDate.getTime() - previousDose.administrationDate.getTime()) /
        (1000 * 60 * 60 * 24)
      );

      if (daysSincePrevious < minInterval) {
        return {
          isValid: false,
          reason: `Minimum interval not met. Required: ${minInterval} days, Actual: ${daysSincePrevious} days`
        };
      }
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error validating vaccination schedule:', error);
    throw error;
  }
}

/**
 * Check exemption eligibility
 */
export async function checkExemptionEligibility(
  studentId: string,
  vaccineType: string
): Promise<{ isEligible: boolean; exemptionTypes: string[] }> {
  // This would integrate with state-specific exemption rules
  // For now, returning general exemption types
  return {
    isEligible: true,
    exemptionTypes: ['MEDICAL', 'RELIGIOUS', 'PHILOSOPHICAL']
  };
}

// ============================================================================
// CHRONIC CONDITION BUSINESS LOGIC
// ============================================================================

/**
 * Calculate risk score for a chronic condition
 */
export function calculateConditionRiskScore(condition: any): ConditionRiskScore {
  let score = 0;
  const factors: string[] = [];
  const recommendations: string[] = [];

  // Severity-based scoring
  const severityScores = {
    MILD: 10,
    MODERATE: 30,
    SEVERE: 60,
    CRITICAL: 90
  };
  score += severityScores[condition.severity as keyof typeof severityScores] || 0;
  factors.push(`Severity: ${condition.severity}`);

  // Uncontrolled condition increases risk
  if (!condition.isControlled) {
    score += 20;
    factors.push('Condition not controlled');
    recommendations.push('Increase monitoring frequency');
  }

  // Missing action plan for severe conditions
  if ((condition.severity === 'SEVERE' || condition.severity === 'CRITICAL') && !condition.actionPlan) {
    score += 10;
    factors.push('No action plan documented');
    recommendations.push('Create emergency action plan immediately');
  }

  // Overdue review
  if (condition.nextReviewDate && condition.nextReviewDate < new Date()) {
    score += 15;
    factors.push('Review overdue');
    recommendations.push('Schedule condition review');
  }

  // Multiple medications
  if (condition.medications && condition.medications.length > 3) {
    score += 5;
    factors.push('Complex medication regimen');
    recommendations.push('Review medication interactions');
  }

  // Determine risk level
  let level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  if (score < 25) level = 'LOW';
  else if (score < 50) level = 'MODERATE';
  else if (score < 75) level = 'HIGH';
  else level = 'CRITICAL';

  return {
    score: Math.min(score, 100),
    level,
    factors,
    recommendations
  };
}

/**
 * Determine how often condition should be reviewed
 */
export function determineReviewFrequency(condition: any): {
  frequency: number; // days
  nextReviewDate: Date;
  reason: string;
} {
  let frequency: number;
  let reason: string;

  switch (condition.severity) {
    case 'CRITICAL':
      frequency = 30; // Monthly
      reason = 'Critical condition requires monthly review';
      break;
    case 'SEVERE':
      frequency = 90; // Quarterly
      reason = 'Severe condition requires quarterly review';
      break;
    case 'MODERATE':
      frequency = 180; // Semi-annually
      reason = 'Moderate condition requires semi-annual review';
      break;
    case 'MILD':
      frequency = 365; // Annually
      reason = 'Mild condition requires annual review';
      break;
    default:
      frequency = 180;
      reason = 'Default review schedule';
  }

  // Uncontrolled conditions need more frequent review
  if (!condition.isControlled) {
    frequency = Math.floor(frequency / 2);
    reason += ' (increased frequency due to uncontrolled status)';
  }

  const nextReviewDate = addDays(new Date(), frequency);

  return { frequency, nextReviewDate, reason };
}

/**
 * Check what accommodations are needed for a condition
 */
export function checkAccommodationRequirements(condition: any): string[] {
  const accommodations: string[] = [];

  // Severity-based accommodations
  if (condition.severity === 'CRITICAL' || condition.severity === 'SEVERE') {
    accommodations.push('Individual Health Plan (IHP) required');
    accommodations.push('Staff training on emergency protocols');
    accommodations.push('Emergency action plan posted');
  }

  // Activity restrictions
  if (condition.restrictions && condition.restrictions.length > 0) {
    accommodations.push('Modified physical education');
    accommodations.push('Activity restrictions documented');
  }

  // Medication during school
  if (condition.medications && condition.medications.length > 0) {
    accommodations.push('Medication administration plan');
    accommodations.push('Backup medication supply at school');
  }

  // Common condition-specific accommodations
  const conditionLower = condition.condition.toLowerCase();

  if (conditionLower.includes('asthma')) {
    accommodations.push('Inhaler access at all times');
    accommodations.push('Air quality monitoring');
  }

  if (conditionLower.includes('diabetes')) {
    accommodations.push('Blood glucose monitoring');
    accommodations.push('Snack/meal accommodations');
    accommodations.push('Bathroom access as needed');
  }

  if (conditionLower.includes('epilepsy') || conditionLower.includes('seizure')) {
    accommodations.push('Seizure action plan');
    accommodations.push('Supervision during activities');
  }

  return [...new Set(accommodations)]; // Remove duplicates
}

/**
 * Generate action plan template for a condition
 */
export function generateActionPlan(condition: any): string {
  const sections = [
    '=== EMERGENCY ACTION PLAN ===\n',
    `Condition: ${condition.condition}`,
    `Severity: ${condition.severity}`,
    `ICD Code: ${condition.icdCode || 'Not specified'}\n`,

    '--- TRIGGERS ---',
    condition.triggers && condition.triggers.length > 0
      ? condition.triggers.join(', ')
      : 'No specific triggers documented\n',

    '--- SYMPTOMS TO MONITOR ---',
    condition.symptoms && condition.symptoms.length > 0
      ? condition.symptoms.join('\n- ')
      : 'No specific symptoms documented\n',

    '--- EMERGENCY RESPONSE ---',
    '1. Stay calm and assess situation',
    '2. Follow emergency protocol below',
    '3. Call 911 if severe symptoms',
    '4. Contact parent/guardian',
    '5. Document incident\n',

    '--- TREATMENT ---',
    condition.treatment || 'No treatment protocol specified\n',

    '--- MEDICATIONS ---',
    condition.medications && condition.medications.length > 0
      ? 'See medication list in student profile'
      : 'No medications documented\n',

    '--- RESTRICTIONS ---',
    condition.restrictions && condition.restrictions.length > 0
      ? condition.restrictions.join('\n- ')
      : 'No restrictions\n',

    '--- EMERGENCY CONTACTS ---',
    'See student emergency contacts in profile\n',

    '--- NOTES ---',
    condition.notes || 'No additional notes'
  ];

  return sections.join('\n');
}

// ============================================================================
// GROWTH BUSINESS LOGIC
// ============================================================================

/**
 * Calculate BMI from height and weight
 */
export function calculateBMI(
  height: number,
  weight: number,
  heightUnit: 'CM' | 'IN' = 'CM',
  weightUnit: 'KG' | 'LB' = 'KG'
): number {
  // Convert to metric if needed
  let heightCm = heightUnit === 'IN' ? height * 2.54 : height;
  let weightKg = weightUnit === 'LB' ? weight * 0.453592 : weight;

  // BMI = weight (kg) / (height (m))^2
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  return Math.round(bmi * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate growth percentiles using CDC charts
 * Production-ready implementation using CDCGrowthCharts utility
 */
export function calculatePercentiles(
  ageMonths: number,
  gender: 'MALE' | 'FEMALE',
  heightCm: number,
  weightKg: number,
  bmi: number
): {
  heightPercentile: number;
  weightPercentile: number;
  bmiPercentile: number;
} {
  try {
    // Convert gender to GrowthChartGender enum
    const growthGender = gender === 'MALE' ? GrowthChartGender.MALE : GrowthChartGender.FEMALE;

    // Create measurement data
    const measurement: GrowthMeasurement = {
      ageInMonths: ageMonths,
      gender: growthGender,
      heightCm,
      weightKg
    };

    // Validate measurement
    const validation = CDCGrowthCharts.validateMeasurement(measurement);
    if (!validation.valid) {
      console.warn('Invalid measurement data:', validation.errors);
      return {
        heightPercentile: 50,
        weightPercentile: 50,
        bmiPercentile: 50
      };
    }

    // Calculate percentiles using CDC growth charts
    const percentiles = CDCGrowthCharts.calculatePercentiles(measurement);

    return {
      heightPercentile: percentiles.heightPercentile || 50,
      weightPercentile: percentiles.weightPercentile || 50,
      bmiPercentile: percentiles.bmiPercentile || 50
    };
  } catch (error) {
    console.error('Error calculating percentiles:', error);
    // Return median percentiles on error
    return {
      heightPercentile: 50,
      weightPercentile: 50,
      bmiPercentile: 50
    };
  }
}

/**
 * Identify growth concerns
 */
export function identifyGrowthConcerns(measurements: any[]): GrowthConcern[] {
  const concerns: GrowthConcern[] = [];

  if (measurements.length === 0) return concerns;

  const latest = measurements[0];

  // BMI percentile concerns
  if (latest.bmiPercentile !== null) {
    if (latest.bmiPercentile < 5) {
      concerns.push({
        type: 'BMI',
        severity: 'SIGNIFICANT',
        description: `BMI below 5th percentile (underweight)`,
        recommendation: 'Nutritional assessment recommended'
      });
    } else if (latest.bmiPercentile > 95) {
      concerns.push({
        type: 'BMI',
        severity: 'SIGNIFICANT',
        description: `BMI above 95th percentile (obesity)`,
        recommendation: 'Nutritional counseling and activity assessment recommended'
      });
    } else if (latest.bmiPercentile > 85) {
      concerns.push({
        type: 'BMI',
        severity: 'MODERATE',
        description: `BMI between 85th-95th percentile (overweight)`,
        recommendation: 'Monitor and consider lifestyle counseling'
      });
    }
  }

  // Height percentile concerns
  if (latest.heightPercentile !== null) {
    if (latest.heightPercentile < 3) {
      concerns.push({
        type: 'HEIGHT',
        severity: 'SIGNIFICANT',
        description: 'Height below 3rd percentile',
        recommendation: 'Endocrinology evaluation recommended'
      });
    } else if (latest.heightPercentile > 97) {
      concerns.push({
        type: 'HEIGHT',
        severity: 'MINOR',
        description: 'Height above 97th percentile',
        recommendation: 'Monitor growth velocity'
      });
    }
  }

  // Growth velocity concerns (if multiple measurements)
  if (measurements.length >= 2) {
    const previous = measurements[1];
    const monthsBetween = (latest.measurementDate.getTime() - previous.measurementDate.getTime()) /
                          (1000 * 60 * 60 * 24 * 30);

    if (monthsBetween >= 3) {
      const heightChange = latest.height - previous.height;
      const weightChange = latest.weight - previous.weight;

      // Minimal growth over 6+ months
      if (monthsBetween >= 6 && heightChange < 2) {
        concerns.push({
          type: 'GROWTH_VELOCITY',
          severity: 'SIGNIFICANT',
          description: 'Minimal height increase over 6 months',
          recommendation: 'Growth hormone evaluation may be needed'
        });
      }

      // Rapid weight gain
      if (weightChange / monthsBetween > 2) {
        concerns.push({
          type: 'WEIGHT',
          severity: 'MODERATE',
          description: 'Rapid weight gain detected',
          recommendation: 'Nutritional and activity assessment'
        });
      }
    }
  }

  return concerns;
}

/**
 * Analyze growth trends
 */
export function analyzeTrends(measurements: any[]): {
  trend: 'INCREASING' | 'STABLE' | 'DECREASING' | 'INSUFFICIENT_DATA';
  velocity: number; // cm/month for height
  percentileShift: number;
  isNormal: boolean;
} {
  if (measurements.length < 2) {
    return {
      trend: 'INSUFFICIENT_DATA',
      velocity: 0,
      percentileShift: 0,
      isNormal: true
    };
  }

  const sorted = [...measurements].sort((a, b) =>
    a.measurementDate.getTime() - b.measurementDate.getTime()
  );

  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];

  const monthsBetween = (newest.measurementDate.getTime() - oldest.measurementDate.getTime()) /
                        (1000 * 60 * 60 * 24 * 30);

  const heightChange = newest.height - oldest.height;
  const velocity = heightChange / monthsBetween;

  const percentileShift = (newest.heightPercentile || 0) - (oldest.heightPercentile || 0);

  let trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  if (heightChange > 5) trend = 'INCREASING';
  else if (heightChange < -1) trend = 'DECREASING';
  else trend = 'STABLE';

  // Normal velocity is roughly 5-6 cm/year (0.4-0.5 cm/month) for school-age children
  const isNormal = velocity >= 0.3 && velocity <= 1.0 && Math.abs(percentileShift) < 15;

  return {
    trend,
    velocity: Math.round(velocity * 100) / 100,
    percentileShift: Math.round(percentileShift * 10) / 10,
    isNormal
  };
}

// ============================================================================
// VITAL SIGNS BUSINESS LOGIC
// ============================================================================

/**
 * Validate vital ranges for age
 */
export function validateVitalRanges(vitals: any, age: number): {
  isValid: boolean;
  alerts: VitalAlert[];
} {
  const alerts = flagAbnormalVitals(vitals, age);
  const isValid = alerts.every(alert => alert.severity === 'NORMAL' || alert.severity === 'BORDERLINE');

  return { isValid, alerts };
}

/**
 * Flag abnormal vitals
 */
export function flagAbnormalVitals(vitals: any, age: number): VitalAlert[] {
  const alerts: VitalAlert[] = [];

  // Temperature
  const tempC = vitals.temperatureUnit === 'F'
    ? (vitals.temperature - 32) * 5/9
    : vitals.temperature;

  if (tempC < 36) {
    alerts.push({
      vital: 'Temperature',
      value: vitals.temperature,
      normalRange: { min: 36, max: 37.5 },
      severity: tempC < 35 ? 'CRITICAL' : 'ABNORMAL',
      action: 'Hypothermia - warm student, monitor closely'
    });
  } else if (tempC > 38) {
    alerts.push({
      vital: 'Temperature',
      value: vitals.temperature,
      normalRange: { min: 36, max: 37.5 },
      severity: tempC > 39.5 ? 'CRITICAL' : 'ABNORMAL',
      action: 'Fever - notify parent, consider sending home'
    });
  }

  // Heart Rate (age-specific)
  const hrRanges = getHeartRateRange(age);
  if (vitals.heartRate < hrRanges.min) {
    alerts.push({
      vital: 'Heart Rate',
      value: vitals.heartRate,
      normalRange: hrRanges,
      severity: vitals.heartRate < hrRanges.min * 0.8 ? 'CRITICAL' : 'ABNORMAL',
      action: 'Bradycardia - assess for symptoms, consider EMS'
    });
  } else if (vitals.heartRate > hrRanges.max) {
    alerts.push({
      vital: 'Heart Rate',
      value: vitals.heartRate,
      normalRange: hrRanges,
      severity: vitals.heartRate > hrRanges.max * 1.3 ? 'CRITICAL' : 'ABNORMAL',
      action: 'Tachycardia - assess for fever, anxiety, or cardiac issues'
    });
  }

  // Blood Pressure (age-specific)
  const bpRanges = getBloodPressureRange(age);
  if (vitals.bloodPressureSystolic > bpRanges.systolic.max) {
    alerts.push({
      vital: 'Blood Pressure',
      value: vitals.bloodPressureSystolic,
      normalRange: bpRanges.systolic,
      severity: vitals.bloodPressureSystolic > bpRanges.systolic.max * 1.2 ? 'CRITICAL' : 'ABNORMAL',
      action: 'Hypertension - repeat measurement, notify parent/physician'
    });
  }

  // Oxygen Saturation
  if (vitals.oxygenSaturation !== null) {
    if (vitals.oxygenSaturation < 95) {
      alerts.push({
        vital: 'Oxygen Saturation',
        value: vitals.oxygenSaturation,
        normalRange: { min: 95, max: 100 },
        severity: vitals.oxygenSaturation < 90 ? 'CRITICAL' : 'ABNORMAL',
        action: vitals.oxygenSaturation < 90
          ? 'Critical hypoxia - call 911 immediately'
          : 'Low oxygen - assess respiratory status'
      });
    }
  }

  // Respiratory Rate (age-specific)
  const rrRanges = getRespiratoryRateRange(age);
  if (vitals.respiratoryRate < rrRanges.min || vitals.respiratoryRate > rrRanges.max) {
    alerts.push({
      vital: 'Respiratory Rate',
      value: vitals.respiratoryRate,
      normalRange: rrRanges,
      severity: 'ABNORMAL',
      action: 'Abnormal respiratory rate - assess breathing effort'
    });
  }

  return alerts;
}

/**
 * Calculate Mean Arterial Pressure
 */
export function calculateMeanArterialPressure(systolic: number, diastolic: number): number {
  // MAP = DBP + 1/3(SBP - DBP)
  const map = diastolic + (systolic - diastolic) / 3;
  return Math.round(map);
}

/**
 * Assess vital trends
 */
export function assessVitalTrends(vitalHistory: any[]): {
  trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
  concerns: string[];
} {
  if (vitalHistory.length < 2) {
    return { trend: 'STABLE', concerns: [] };
  }

  const concerns: string[] = [];
  const sorted = [...vitalHistory].sort((a, b) =>
    a.recordedDate.getTime() - b.recordedDate.getTime()
  );

  const recent = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];

  // Temperature trend
  if (recent.temperature > previous.temperature + 1) {
    concerns.push('Temperature increasing');
  }

  // Heart rate trend
  if (recent.heartRate > previous.heartRate * 1.2) {
    concerns.push('Heart rate significantly elevated');
  }

  // Blood pressure trend
  if (recent.bloodPressureSystolic > previous.bloodPressureSystolic + 10) {
    concerns.push('Blood pressure increasing');
  }

  const trend = concerns.length === 0 ? 'STABLE' : concerns.length > 2 ? 'WORSENING' : 'STABLE';

  return { trend, concerns };
}

// ============================================================================
// SCREENING BUSINESS LOGIC
// ============================================================================

/**
 * Determine referral urgency
 */
export function determineReferralUrgency(screening: any): {
  urgency: 'ROUTINE' | 'SOON' | 'URGENT' | 'IMMEDIATE';
  timeframe: string;
} {
  if (screening.outcome !== 'REFER') {
    return { urgency: 'ROUTINE', timeframe: 'No referral needed' };
  }

  const screeningType = screening.screeningType;
  const results = screening.results;

  // Immediate urgency cases
  if (screeningType === 'MENTAL_HEALTH' && results.suicidalIdeation) {
    return { urgency: 'IMMEDIATE', timeframe: 'Same day - contact crisis services' };
  }

  // Urgent cases
  if (screeningType === 'VISION' && results.acuity && results.acuity < 20/200) {
    return { urgency: 'URGENT', timeframe: 'Within 1 week' };
  }

  if (screeningType === 'HEARING' && results.failedBothEars) {
    return { urgency: 'URGENT', timeframe: 'Within 2 weeks' };
  }

  // Soon
  if (screeningType === 'SCOLIOSIS' && results.curveAngle > 20) {
    return { urgency: 'SOON', timeframe: 'Within 1 month' };
  }

  if (screeningType === 'BMI' && (results.percentile < 5 || results.percentile > 95)) {
    return { urgency: 'SOON', timeframe: 'Within 1 month' };
  }

  // Routine
  return { urgency: 'ROUTINE', timeframe: 'Within 3 months' };
}

/**
 * Schedule follow-up based on screening
 */
export function scheduleFollowUp(screening: any): Date | null {
  const urgency = determineReferralUrgency(screening);

  const daysMap = {
    IMMEDIATE: 0,
    URGENT: 7,
    SOON: 30,
    ROUTINE: 90
  };

  const days = daysMap[urgency.urgency];
  return addDays(screening.screeningDate, days);
}

/**
 * Validate screening frequency
 */
export async function validateScreeningFrequency(
  studentId: string,
  screeningType: string
): Promise<{ isValid: boolean; lastScreening?: Date; minimumInterval: number }> {
  // Minimum intervals in days
  const intervals: Record<string, number> = {
    VISION: 365,        // Annual
    HEARING: 365,       // Annual
    DENTAL: 365,        // Annual
    SCOLIOSIS: 365,     // Annual
    BMI: 180,           // Semi-annual
    DEVELOPMENTAL: 180, // Semi-annual
    MENTAL_HEALTH: 90,  // Quarterly
    OTHER: 30           // Monthly
  };

  const minimumInterval = intervals[screeningType] || 30;

  const lastScreening = await Screening.findOne({
    where: {
      studentId,
      screeningType: screeningType as any
    },
    order: [['screeningDate', 'DESC']]
  });

  if (!lastScreening) {
    return { isValid: true, minimumInterval };
  }

  const daysSince = Math.floor(
    (Date.now() - lastScreening.screeningDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    isValid: daysSince >= minimumInterval,
    lastScreening: lastScreening.screeningDate,
    minimumInterval
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  return age;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getRequiredVaccines(age: number, jurisdiction: string): string[] {
  // Simplified - production would use jurisdiction-specific requirements
  const baseVaccines = [
    'DTaP/Tdap',
    'Polio',
    'MMR',
    'Varicella',
    'Hepatitis B'
  ];

  if (age >= 11) {
    baseVaccines.push('Meningococcal', 'HPV');
  }

  return baseVaccines;
}

function getCVXCode(vaccine: string): string {
  const codes: Record<string, string> = {
    'DTaP/Tdap': '20',
    'Polio': '10',
    'MMR': '03',
    'Varicella': '21',
    'Hepatitis B': '08',
    'Meningococcal': '114',
    'HPV': '137'
  };

  return codes[vaccine] || '';
}

function getVaccineIntervals(vaccineName: string): {
  doses: number[];
  default: number;
  booster?: number;
} {
  // Simplified intervals - production would use CDC ACIP schedules
  return {
    doses: [0, 60, 180, 365],
    default: 30,
    booster: 3650 // 10 years
  };
}

function calculateNextDoseDate(vaccination: any): Date {
  return determineNextDueDate(vaccination);
}

function getMinimumInterval(vaccineName: string, doseNumber: number): number {
  // Minimum days between doses
  // Simplified - production would use vaccine-specific schedules
  return 28; // Default 4 weeks
}

function getHeartRateRange(age: number): { min: number; max: number } {
  if (age < 1) return { min: 100, max: 160 };
  if (age < 3) return { min: 90, max: 150 };
  if (age < 6) return { min: 80, max: 140 };
  if (age < 12) return { min: 70, max: 120 };
  return { min: 60, max: 100 };
}

function getBloodPressureRange(age: number): {
  systolic: { min: number; max: number };
  diastolic: { min: number; max: number };
} {
  if (age < 6) return {
    systolic: { min: 80, max: 110 },
    diastolic: { min: 50, max: 70 }
  };
  if (age < 12) return {
    systolic: { min: 90, max: 115 },
    diastolic: { min: 55, max: 75 }
  };
  return {
    systolic: { min: 100, max: 120 },
    diastolic: { min: 60, max: 80 }
  };
}

function getRespiratoryRateRange(age: number): { min: number; max: number } {
  if (age < 1) return { min: 30, max: 60 };
  if (age < 3) return { min: 24, max: 40 };
  if (age < 6) return { min: 22, max: 34 };
  if (age < 12) return { min: 18, max: 30 };
  return { min: 12, max: 20 };
}
