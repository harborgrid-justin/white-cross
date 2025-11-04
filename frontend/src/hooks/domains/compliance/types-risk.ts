/**
 * Risk assessment types for compliance domain.
 *
 * @module hooks/domains/compliance/types-risk
 */

export interface RiskAssessment {
  id: string;
  title: string;
  description: string;
  scope: string[];
  assessor: {
    id: string;
    name: string;
  };
  methodology: string;
  riskCategories: RiskCategory[];
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedActions: RecommendedAction[];
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'IMPLEMENTED';
  assessmentDate: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskCategory {
  id: string;
  name: string;
  description: string;
  risks: Risk[];
  categoryRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  likelihood: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  impact: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  currentControls: string[];
  residualRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  treatmentPlan?: string;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedCost?: number;
  estimatedTimeframe: string;
  responsibleParty?: string;
  status: 'RECOMMENDED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED';
}
