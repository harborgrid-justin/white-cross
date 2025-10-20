/**
 * Phase 3: Advanced Medication Workflows
 * 
 * Complex business logic for medication management including:
 * - Five Rights verification
 * - Drug interaction checking
 * - Automated compliance monitoring
 * - Emergency protocols
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../reduxStore';
import { medicationsActions } from '../slices/medicationsSlice';
import { studentsActions } from '../slices/studentsSlice';
import { communicationActions } from '../slices/communicationSlice';

// Types for workflow operations
export interface FiveRightsVerification {
  rightPatient: boolean;
  rightMedication: boolean;
  rightDose: boolean;
  rightRoute: boolean;
  rightTime: boolean;
  verifiedBy: string;
  timestamp: string;
  studentId: string;
  medicationId: string;
}

export interface DrugInteraction {
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CONTRAINDICATED';
  description: string;
  medications: string[];
  recommendation: string;
}

export interface MedicationAdministrationWorkflow {
  studentId: string;
  medicationId: string;
  scheduledTime: string;
  actualTime?: string;
  dosageGiven: string;
  route: string;
  administeredBy: string;
  witnessId?: string;
  notes?: string;
  fiveRights: FiveRightsVerification;
  interactions: DrugInteraction[];
  adverseReactions?: string[];
}

/**
 * Five Rights Verification Workflow
 */
export const verifyFiveRights = createAsyncThunk<
  FiveRightsVerification,
  {
    studentId: string;
    medicationId: string;
    plannedDosage: string;
    plannedRoute: string;
    plannedTime: string;
    nurseId: string;
  },
  { state: RootState }
>(
  'workflows/verifyFiveRights',
  async (params, { getState }) => {
    const state = getState();
    const student = state.students.entities[params.studentId];
    const medication = state.medications.entities[params.medicationId];

    if (!student || !medication) {
      throw new Error('Student or medication not found');
    }

    // Verify each of the five rights
    const verification: FiveRightsVerification = {
      rightPatient: true, // TODO: Implement barcode scanning verification
      rightMedication: medication.medicationId === params.medicationId,
      rightDose: medication.dosage === params.plannedDosage,
      rightRoute: medication.route === params.plannedRoute,
      rightTime: isWithinAdministrationWindow(params.plannedTime, medication.frequency),
      verifiedBy: params.nurseId,
      timestamp: new Date().toISOString(),
      studentId: params.studentId,
      medicationId: params.medicationId
    };

    // Log verification attempt
    console.log('Five Rights Verification:', verification);

    return verification;
  }
);

/**
 * Drug Interaction Detection Workflow
 */
export const checkDrugInteractions = createAsyncThunk<
  DrugInteraction[],
  { studentId: string; newMedicationId?: string },
  { state: RootState }
>(
  'workflows/checkDrugInteractions',
  async ({ studentId, newMedicationId }, { getState }) => {
    const state = getState();
    const student = state.students.entities[studentId];
    
    if (!student) {
      throw new Error('Student not found');
    }

    const activeMedications = student.medications?.filter(med => med.isActive) || [];
    const medicationsToCheck = newMedicationId 
      ? [...activeMedications.map(med => med.medicationId), newMedicationId]
      : activeMedications.map(med => med.medicationId);

    // Simulate drug interaction checking (in production, integrate with drug database)
    const interactions: DrugInteraction[] = [];

    // Check for known dangerous combinations
    const knownInteractions = [
      {
        medications: ['warfarin', 'aspirin'],
        severity: 'MAJOR' as const,
        description: 'Increased risk of bleeding',
        recommendation: 'Monitor INR closely and consider alternative therapy'
      },
      {
        medications: ['digoxin', 'furosemide'],
        severity: 'MODERATE' as const,
        description: 'Increased risk of digoxin toxicity due to potassium depletion',
        recommendation: 'Monitor potassium levels and digoxin levels'
      }
    ];

    for (const interaction of knownInteractions) {
      const hasAllMeds = interaction.medications.every(med => 
        medicationsToCheck.some(checkMed => 
          state.medications.entities[checkMed]?.medication?.name.toLowerCase().includes(med)
        )
      );

      if (hasAllMeds) {
        interactions.push(interaction);
      }
    }

    return interactions;
  }
);

/**
 * Complete Medication Administration Workflow
 */
export const administrateMedication = createAsyncThunk<
  MedicationAdministrationWorkflow,
  {
    studentId: string;
    medicationId: string;
    dosageGiven: string;
    route: string;
    administeredBy: string;
    witnessId?: string;
    notes?: string;
    actualTime?: string;
  },
  { state: RootState }
>(
  'workflows/administrateMedication',
  async (params, { dispatch, getState }) => {
    // Step 1: Verify Five Rights
    const fiveRights = await dispatch(verifyFiveRights({
      studentId: params.studentId,
      medicationId: params.medicationId,
      plannedDosage: params.dosageGiven,
      plannedRoute: params.route,
      plannedTime: params.actualTime || new Date().toISOString(),
      nurseId: params.administeredBy
    })).unwrap();

    // Step 2: Check for drug interactions
    const interactions = await dispatch(checkDrugInteractions({
      studentId: params.studentId
    })).unwrap();

    // Step 3: Check for contraindications
    if (interactions.some(i => i.severity === 'CONTRAINDICATED')) {
      throw new Error('Contraindicated drug interaction detected. Administration blocked.');
    }

    // Step 4: Create administration record
    const administration: MedicationAdministrationWorkflow = {
      ...params,
      scheduledTime: params.actualTime || new Date().toISOString(),
      actualTime: params.actualTime || new Date().toISOString(),
      fiveRights,
      interactions
    };

    // Step 5: Log administration
    // TODO: Save to medication logs

    // Step 6: Send notifications if required
    const state = getState();
    const medication = state.medications.entities[params.medicationId];
    
    if (medication?.requiresParentConsent) {
      dispatch(communicationActions.create({
        type: 'MEDICATION_ADMINISTERED',
        subject: 'Medication Administration Notice',
        content: `Your child has been administered ${medication.medication?.name} at school.`,
        recipientType: 'PARENT',
        recipientIds: [params.studentId], // Will resolve to parent contacts
        priority: 'NORMAL'
      }));
    }

    // Step 7: Check for adverse reactions monitoring
    if (interactions.some(i => i.severity === 'MAJOR')) {
      // Schedule follow-up monitoring
      setTimeout(() => {
        dispatch(communicationActions.create({
          type: 'MONITORING_REMINDER',
          subject: 'Medication Monitoring Required',
          content: `Student requires monitoring for potential adverse reactions after medication administration.`,
          recipientType: 'NURSE',
          recipientIds: [params.administeredBy],
          priority: 'HIGH'
        }));
      }, 30 * 60 * 1000); // 30 minutes
    }

    return administration;
  }
);

/**
 * Emergency Medication Protocol
 */
export const emergencyMedicationProtocol = createAsyncThunk<
  void,
  {
    studentId: string;
    emergencyType: 'ANAPHYLAXIS' | 'ASTHMA_ATTACK' | 'SEIZURE' | 'DIABETIC_EMERGENCY';
    location: string;
    responderId: string;
  },
  { state: RootState }
>(
  'workflows/emergencyMedicationProtocol',
  async (params, { dispatch, getState }) => {
    const state = getState();
    const student = state.students.entities[params.studentId];
    
    if (!student) {
      throw new Error('Student not found');
    }

    // Emergency medication protocols
    const protocols = {
      ANAPHYLAXIS: {
        medication: 'epinephrine',
        dose: '0.3mg',
        route: 'intramuscular',
        followUp: ['Call 911', 'Contact parents', 'Prepare for second dose if needed']
      },
      ASTHMA_ATTACK: {
        medication: 'albuterol',
        dose: '2 puffs',
        route: 'inhalation',
        followUp: ['Monitor breathing', 'Call parents if severe', 'Document peak flow if available']
      },
      SEIZURE: {
        medication: 'diazepam',
        dose: '5mg',
        route: 'rectal',
        followUp: ['Call 911 if seizure >5 minutes', 'Recovery position', 'Contact parents']
      },
      DIABETIC_EMERGENCY: {
        medication: 'glucagon',
        dose: '1mg',
        route: 'intramuscular',
        followUp: ['Check blood glucose', 'Call 911', 'Contact parents']
      }
    };

    const protocol = protocols[params.emergencyType];
    
    // Find appropriate emergency medication
    const emergencyMed = student.medications?.find(med => 
      med.isActive && 
      med.medication?.name.toLowerCase().includes(protocol.medication.toLowerCase())
    );

    if (!emergencyMed) {
      // Alert that emergency medication is not available
      dispatch(communicationActions.create({
        type: 'EMERGENCY_ALERT',
        subject: `EMERGENCY: ${protocol.medication} not available for ${student.firstName} ${student.lastName}`,
        content: `Emergency medication ${protocol.medication} is not available. Immediate medical attention required.`,
        recipientType: 'EMERGENCY',
        recipientIds: ['emergency-team'],
        priority: 'URGENT'
      }));
      
      throw new Error(`Emergency medication ${protocol.medication} not available for student`);
    }

    // Administer emergency medication (bypasses normal verification for emergencies)
    const emergencyAdministration = await dispatch(administrateMedication({
      studentId: params.studentId,
      medicationId: emergencyMed.id,
      dosageGiven: protocol.dose,
      route: protocol.route,
      administeredBy: params.responderId,
      notes: `EMERGENCY ADMINISTRATION - ${params.emergencyType}`,
      actualTime: new Date().toISOString()
    })).unwrap();

    // Execute follow-up protocols
    for (const followUpAction of protocol.followUp) {
      dispatch(communicationActions.create({
        type: 'EMERGENCY_FOLLOWUP',
        subject: `Emergency Follow-up: ${followUpAction}`,
        content: `Action required: ${followUpAction} for ${student.firstName} ${student.lastName}`,
        recipientType: 'NURSE',
        recipientIds: [params.responderId],
        priority: 'URGENT'
      }));
    }

    // Log emergency event
    console.log('Emergency medication administered:', {
      student: student.firstName + ' ' + student.lastName,
      emergencyType: params.emergencyType,
      medication: protocol.medication,
      timestamp: new Date().toISOString(),
      responderId: params.responderId,
      location: params.location
    });
  }
);

/**
 * Medication Compliance Monitoring
 */
export const monitorMedicationCompliance = createAsyncThunk<
  {
    studentId: string;
    complianceScore: number;
    missedDoses: number;
    onTimeAdministrations: number;
    issues: string[];
  },
  { studentId: string; timeframe: 'WEEK' | 'MONTH' | 'QUARTER' },
  { state: RootState }
>(
  'workflows/monitorMedicationCompliance',
  async ({ studentId, timeframe }, { getState }) => {
    const state = getState();
    const student = state.students.entities[studentId];
    
    if (!student) {
      throw new Error('Student not found');
    }

    const days = timeframe === 'WEEK' ? 7 : timeframe === 'MONTH' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Analyze medication logs for compliance
    const activeMedications = student.medications?.filter(med => med.isActive) || [];
    let totalExpectedDoses = 0;
    let actualDoses = 0;
    let onTimeDoses = 0;
    const issues: string[] = [];

    for (const medication of activeMedications) {
      // Calculate expected doses based on frequency
      const expectedDosesPerDay = getExpectedDosesPerDay(medication.frequency);
      const expectedTotalDoses = expectedDosesPerDay * days;
      totalExpectedDoses += expectedTotalDoses;

      // Count actual administrations (from logs)
      const actualAdministrations = medication.logs?.filter(log => 
        new Date(log.administeredAt) >= startDate
      ).length || 0;
      
      actualDoses += actualAdministrations;

      // Check for timing compliance
      const onTimeAdministrations = medication.logs?.filter(log => {
        const logTime = new Date(log.administeredAt);
        return logTime >= startDate && isWithinAdministrationWindow(
          logTime.toISOString(), 
          medication.frequency
        );
      }).length || 0;

      onTimeDoses += onTimeAdministrations;

      // Identify specific issues
      if (actualAdministrations < expectedTotalDoses * 0.8) {
        issues.push(`Low compliance for ${medication.medication?.name}: ${actualAdministrations}/${expectedTotalDoses} doses`);
      }

      if (medication.requiresParentConsent && !medication.parentConsentDate) {
        issues.push(`Missing parent consent for ${medication.medication?.name}`);
      }

      if (medication.endDate && new Date(medication.endDate) <= new Date()) {
        issues.push(`Expired medication: ${medication.medication?.name}`);
      }
    }

    const complianceScore = totalExpectedDoses > 0 
      ? Math.round((actualDoses / totalExpectedDoses) * 100)
      : 100;

    return {
      studentId,
      complianceScore,
      missedDoses: totalExpectedDoses - actualDoses,
      onTimeAdministrations: onTimeDoses,
      issues
    };
  }
);

// Helper functions
function isWithinAdministrationWindow(actualTime: string, frequency: string): boolean {
  // Simple implementation - in production, use more sophisticated timing logic
  const windowMinutes = 30; // 30-minute window
  const now = new Date();
  const adminTime = new Date(actualTime);
  const diffMinutes = Math.abs(now.getTime() - adminTime.getTime()) / (1000 * 60);
  
  return diffMinutes <= windowMinutes;
}

function getExpectedDosesPerDay(frequency: string): number {
  const freq = frequency.toLowerCase();
  if (freq.includes('once') || freq.includes('daily')) return 1;
  if (freq.includes('twice') || freq.includes('bid')) return 2;
  if (freq.includes('three') || freq.includes('tid')) return 3;
  if (freq.includes('four') || freq.includes('qid')) return 4;
  return 1; // Default
}