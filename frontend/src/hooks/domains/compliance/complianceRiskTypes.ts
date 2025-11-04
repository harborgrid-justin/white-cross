/**
 * Compliance Domain Risk Assessment Type Definitions
 *
 * TypeScript interfaces for risk assessments, risk management, and mitigation
 * strategies for healthcare compliance in the White Cross Healthcare Platform.
 *
 * @module hooks/domains/compliance/complianceRiskTypes
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Risk assessment for evaluating compliance and security risks.
 *
 * @interface RiskAssessment
 *
 * @property {string} id - Unique risk assessment identifier
 * @property {string} title - Assessment title
 * @property {string} description - Assessment description
 * @property {string[]} scope - Areas or systems covered by assessment
 * @property {Object} assessor - Person who conducted assessment
 * @property {string} assessor.id - Assessor user ID
 * @property {string} assessor.name - Assessor full name
 * @property {string} methodology - Assessment methodology used
 * @property {RiskCategory[]} riskCategories - List of risk categories evaluated
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} overallRiskLevel - Overall risk level
 * @property {RecommendedAction[]} recommendedActions - List of recommended actions
 * @property {'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'IMPLEMENTED'} status - Current assessment status
 * @property {string} assessmentDate - Assessment date (ISO 8601)
 * @property {string} nextReviewDate - Next scheduled review date (ISO 8601)
 * @property {string} createdAt - Record creation timestamp (ISO 8601)
 * @property {string} updatedAt - Last update timestamp (ISO 8601)
 *
 * @example
 * ```typescript
 * const assessment: RiskAssessment = {
 *   id: 'assessment-001',
 *   title: 'Annual HIPAA Security Risk Assessment',
 *   description: 'Comprehensive evaluation of security risks to ePHI',
 *   scope: ['EHR System', 'Data Storage', 'Access Controls'],
 *   assessor: { id: 'user-123', name: 'Jane Smith' },
 *   methodology: 'NIST 800-66',
 *   riskCategories: [],
 *   overallRiskLevel: 'MEDIUM',
 *   recommendedActions: [],
 *   status: 'APPROVED',
 *   assessmentDate: '2025-10-01T00:00:00Z',
 *   nextReviewDate: '2026-10-01T00:00:00Z',
 *   createdAt: '2025-10-01T09:00:00Z',
 *   updatedAt: '2025-10-15T14:30:00Z'
 * };
 * ```
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

/**
 * Risk category grouping related risks.
 *
 * @interface RiskCategory
 *
 * @property {string} id - Unique category identifier
 * @property {string} name - Category name
 * @property {string} description - Category description
 * @property {Risk[]} risks - List of risks in this category
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} categoryRiskLevel - Overall category risk level
 *
 * @example
 * ```typescript
 * const category: RiskCategory = {
 *   id: 'cat-001',
 *   name: 'Access Control',
 *   description: 'Risks related to user access and authentication',
 *   risks: [],
 *   categoryRiskLevel: 'MEDIUM'
 * };
 * ```
 */
export interface RiskCategory {
  id: string;
  name: string;
  description: string;
  risks: Risk[];
  categoryRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * Individual risk within a risk category.
 *
 * @interface Risk
 *
 * @property {string} id - Unique risk identifier
 * @property {string} title - Risk title
 * @property {string} description - Detailed risk description
 * @property {'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'} likelihood - Likelihood of occurrence
 * @property {'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'} impact - Potential impact if occurs
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} riskLevel - Calculated risk level (likelihood x impact)
 * @property {string[]} currentControls - Existing controls mitigating this risk
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} residualRisk - Risk level after controls applied
 * @property {string} [treatmentPlan] - Plan for treating or mitigating risk
 *
 * @remarks
 * Risk level is typically calculated using a risk matrix:
 * - Risk Level = Likelihood x Impact
 * - CRITICAL: Very High likelihood + Very High impact
 * - HIGH: High likelihood or High impact
 * - MEDIUM: Medium likelihood or Medium impact
 * - LOW: Low likelihood and Low impact
 *
 * @example
 * ```typescript
 * const risk: Risk = {
 *   id: 'risk-001',
 *   title: 'Weak Password Policy',
 *   description: 'Users can set passwords that do not meet security requirements',
 *   likelihood: 'HIGH',
 *   impact: 'HIGH',
 *   riskLevel: 'CRITICAL',
 *   currentControls: ['Password complexity requirements', 'Annual training'],
 *   residualRisk: 'MEDIUM',
 *   treatmentPlan: 'Implement MFA and increase password minimum length to 14 characters'
 * };
 * ```
 */
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

/**
 * Recommended action to mitigate identified risks.
 *
 * @interface RecommendedAction
 *
 * @property {string} id - Unique action identifier
 * @property {string} title - Action title
 * @property {string} description - Detailed action description
 * @property {'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} priority - Action priority
 * @property {number} [estimatedCost] - Estimated implementation cost (USD)
 * @property {string} estimatedTimeframe - Estimated implementation timeframe
 * @property {string} [responsibleParty] - Person or team responsible for implementation
 * @property {'RECOMMENDED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED'} status - Action status
 *
 * @example
 * ```typescript
 * const action: RecommendedAction = {
 *   id: 'action-001',
 *   title: 'Implement Multi-Factor Authentication',
 *   description: 'Deploy MFA for all users accessing ePHI',
 *   priority: 'HIGH',
 *   estimatedCost: 5000,
 *   estimatedTimeframe: '3 months',
 *   responsibleParty: 'IT Security Team',
 *   status: 'APPROVED'
 * };
 * ```
 */
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
