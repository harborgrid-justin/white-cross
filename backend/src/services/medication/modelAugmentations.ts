/**
 * LOC: 7359200817-AUG
 * WC-SVC-MED-AUG | Medication Model Type Augmentations
 *
 * UPSTREAM (imports from): database/models
 * DOWNSTREAM (imported by): All medication service modules
 */

/**
 * WC-SVC-MED-AUG | Medication Model Type Augmentations
 * Purpose: TypeScript type augmentations for Sequelize model associations
 * Upstream: database/models | Dependencies: Sequelize models
 * Downstream: All medication modules | Called by: TypeScript compiler
 * Related: medicationService.ts, database models
 * Exports: Type augmentations
 * Last Updated: 2025-10-18 | Dependencies: sequelize
 * Critical Path: Type safety for model associations
 * LLM Context: Sequelize model type extensions for associations
 */

import {
  Medication,
  StudentMedication,
  MedicationLog,
  MedicationInventory,
  Student,
  User,
  IncidentReport
} from '../../database/models';

// Type augmentations for model associations
declare module '../../database/models' {
  interface Medication {
    inventory?: MedicationInventory[];
    studentMedications?: StudentMedication[];
    name: string;
    strength: string;
    dosageForm: string;
  }

  interface StudentMedication {
    medication?: Medication;
    student?: Student;
    logs?: MedicationLog[];
    id: string;
    isActive: boolean;
    frequency: string;
    dosage: string;
    studentId: string;
  }

  interface MedicationLog {
    nurse?: User;
    studentMedication?: StudentMedication;
    timeGiven: Date;
  }

  interface MedicationInventory {
    medication?: Medication;
    quantity: number;
    reorderLevel: number;
    expirationDate: Date;
    batchNumber: string;
    medicationId: string;
  }

  interface Student {
    medications?: any[];
    firstName: string;
    lastName: string;
    studentNumber: string;
    id: string;
  }

  interface User {
    firstName: string;
    lastName: string;
  }

  interface IncidentReport {
    student?: Student;
    reportedBy?: User;
    studentId: string;
  }
}

// Re-export models for convenience
export {
  Medication,
  StudentMedication,
  MedicationLog,
  MedicationInventory,
  Student,
  User,
  IncidentReport
};
