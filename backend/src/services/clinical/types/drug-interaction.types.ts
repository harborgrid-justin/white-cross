/**
 * @fileoverview Drug Interaction Types
 * @module clinical/types
 * @description Type definitions for drug interaction functionality
 */

export enum InteractionSeverity {
  CONTRAINDICATED = 'CONTRAINDICATED',
  MAJOR = 'MAJOR',
  MODERATE = 'MODERATE',
  MINOR = 'MINOR',
}

export enum RiskLevel {
  NONE = 'NONE',
  LOW = 'LOW',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface DrugInfo {
  id: string;
  genericName: string;
  brandNames: string[];
}

export interface InteractionDetail {
  drug1: DrugInfo;
  drug2: DrugInfo;
  severity: InteractionSeverity;
  description: string;
  clinicalEffects: string[];
  management: string[];
  references: string[];
}

export interface AllergyDetail {
  drug: DrugInfo;
  allergyType: string;
  reaction: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
}

export interface InteractionResult {
  hasInteractions: boolean;
  interactions: InteractionDetail[];
  allergies: AllergyDetail[];
  riskLevel: RiskLevel;
}

export interface InteractionCheckDto {
  drugIds: string[];
  studentId?: string;
}

export interface AddDrugDto {
  genericName: string;
  brandNames?: string[];
  rxnormCode?: string;
  drugClass?: string;
  strength?: string;
  form?: string;
  controlledSubstanceSchedule?: string;
  description?: string;
}

export interface UpdateDrugDto {
  genericName?: string;
  brandNames?: string[];
  rxnormCode?: string;
  drugClass?: string;
  strength?: string;
  form?: string;
  controlledSubstanceSchedule?: string;
  description?: string;
  isActive?: boolean;
}

export interface AddInteractionDto {
  drug1Id: string;
  drug2Id: string;
  severity: InteractionSeverity;
  description: string;
  clinicalEffects: string[];
  management: string[];
  references: string[];
}

export interface UpdateInteractionDto {
  severity?: InteractionSeverity;
  description?: string;
  clinicalEffects?: string[];
  management?: string[];
  references?: string[];
}

export interface AddAllergyDto {
  studentId: string;
  drugId: string;
  allergyType: string;
  reaction: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  diagnosedDate: Date;
  notes?: string;
}

export interface UpdateAllergyDto {
  allergyType?: string;
  reaction?: string;
  severity?: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  diagnosedDate?: Date;
  notes?: string;
}

export interface BulkImportResult {
  imported: number;
  failed: number;
  errors: string[];
}

export interface InteractionStatistics {
  totalDrugs: number;
  totalInteractions: number;
  bySeverity: Record<string, number>;
  topInteractingDrugs: Array<{
    drug: any;
    interactionCount: number;
  }>;
}
