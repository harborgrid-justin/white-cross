import { InteractionSeverity } from '../enums/interaction-severity.enum';

/**
 * Individual Drug Interaction Details
 */
export interface DrugInteractionDetail {
  drug1: {
    id: string;
    genericName: string;
    brandNames?: string[];
  };
  drug2: {
    id: string;
    genericName: string;
    brandNames?: string[];
  };
  severity: InteractionSeverity;
  description: string;
  clinicalEffects?: string;
  management?: string;
  references?: string[];
}

/**
 * Student Drug Allergy Details
 */
export interface StudentAllergyDetail {
  drug: {
    id: string;
    genericName: string;
    brandNames?: string[];
  };
  allergyType: string;
  reaction: string;
  severity: string;
}

/**
 * Overall Risk Level Assessment
 */
export type RiskLevel = 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

/**
 * Drug Interaction Check Result
 * Complete response for drug interaction checking
 */
export interface InteractionResult {
  /** Whether any interactions or allergies were found */
  hasInteractions: boolean;

  /** List of drug-drug interactions found */
  interactions: DrugInteractionDetail[];

  /** List of student allergies found (if studentId provided) */
  allergies?: StudentAllergyDetail[];

  /** Overall risk level assessment */
  riskLevel: RiskLevel;
}
