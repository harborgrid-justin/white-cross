/**
 * Vendor Evaluation Type Definitions
 *
 * Types for vendor performance evaluations, ratings,
 * and assessment tracking.
 *
 * @module hooks/domains/vendors/vendor-evaluation-types
 *
 * @since 1.0.0
 */

/**
 * Vendor evaluation information
 */
export interface VendorEvaluation {
  id: string;
  vendorId: string;
  evaluationType: 'ANNUAL' | 'PROJECT_BASED' | 'INCIDENT' | 'RENEWAL';
  evaluationPeriod: string;

  // Ratings (1-5 scale)
  qualityRating: number;
  deliveryRating: number;
  communicationRating: number;
  costEffectivenessRating: number;
  overallRating: number;

  // Detailed Feedback
  strengths: string[];
  areasForImprovement: string[];
  comments: string;

  // Recommendations
  recommendForFutureWork: boolean;
  contractRenewalRecommendation: 'RENEW' | 'RENEW_WITH_CONDITIONS' | 'DO_NOT_RENEW';

  // System Information
  evaluatedBy: string;
  evaluationDate: string;
  reviewedBy?: string;
  reviewDate?: string;

  createdAt: string;
  updatedAt: string;
}
