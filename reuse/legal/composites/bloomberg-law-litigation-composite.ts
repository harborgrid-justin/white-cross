/**
 * LOC: BLOOMBERG_LAW_LITIGATION_COMPOSITE_001
 * File: /reuse/legal/composites/bloomberg-law-litigation-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../litigation-support-kit
 *   - ../deposition-management-kit
 *   - ../expert-witness-management-kit
 *   - ../settlement-negotiation-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Law platform modules
 *   - Litigation management controllers
 *   - Discovery coordination services
 *   - Trial preparation systems
 */

/**
 * File: /reuse/legal/composites/bloomberg-law-litigation-composite.ts
 * Locator: WC-BLOOMBERG-LITIGATION-COMPOSITE-001
 * Purpose: Production-Grade Bloomberg Law Litigation Composite - Complete litigation lifecycle management
 *
 * Upstream: litigation-support-kit, deposition-management-kit, expert-witness-management-kit, settlement-negotiation-kit
 * Downstream: Bloomberg Law platform, ../backend/modules/bloomberg/*, Litigation controllers
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize, NestJS
 * Exports: 48 composed litigation management functions for Bloomberg Law platform integration
 *
 * LLM Context: Production-grade litigation lifecycle composite for Bloomberg Law platform.
 * Provides complete litigation workflow from case intake through settlement, including deposition
 * coordination, expert witness management, discovery tracking, settlement negotiation, trial
 * preparation, exhibit management, witness coordination, objection tracking, transcript processing,
 * settlement offer analysis, payment plan management, release document generation, litigation
 * analytics, case timeline tracking, deadline management, motion filing, document production,
 * privilege review integration, e-discovery coordination, case strategy planning, litigation
 * cost estimation, trial readiness assessment, jury selection support, trial exhibit preparation,
 * witness preparation tracking, settlement conference management, mediation coordination, arbitration
 * support, case outcome prediction, litigation risk assessment, budget variance analysis, and
 * comprehensive litigation reporting for Bloomberg Law's enterprise legal platform.
 */

// ============================================================================
// DEPOSITION MANAGEMENT FUNCTIONS (from deposition-management-kit.ts)
// ============================================================================

export {
  // Deposition Scheduling & Lifecycle
  scheduleDeposition,
  generateDepositionNumber,
  calculateEstimatedCost,
  updateDepositionStatus,
  cancelDeposition,
  rescheduleDeposition,
  confirmDeposition,
  startDeposition,
  completeDeposition,

  // Exhibit Management
  prepareDepositionExhibit,
  generateExhibitNumber,
  markExhibit,
  introduceExhibit,
  authenticateExhibit,

  // Transcript Management
  orderDepositionTranscript,
  calculateTranscriptCost,
  calculateExpectedDate,
  updateTranscriptStatus,
  attachTranscriptFile,
  submitErrataSheet,
  assignTranscriptReviewer,
  completeTranscriptReview,

  // Objection Tracking
  trackDepositionObjection,
  updateObjectionRuling,

  // Deposition Analysis
  createDepositionSummary,
  createDepositionOutline,
  generateDepositionNotice,

  // Resource Assignment
  assignCourtReporter,
  assignVideographer,
  addDepositionAttendee,
  removeDepositionAttendee,
  recordNoticeService,

  // Query & Reporting
  getDepositionWithRelations,
  searchDepositions,
  getUpcomingDepositions,
  calculateDepositionStatistics,

  // Models & Types
  DepositionModel,
  DepositionExhibitModel,
  DepositionTranscriptModel,
  DepositionObjectionModel,
  DepositionSummaryModel,
  DepositionOutlineModel,
  DepositionStatus,
  DepositionType,
  ExhibitStatus,
  ObjectionType,
  ObjectionRuling,
  TranscriptStatus,
} from '../deposition-management-kit';

// ============================================================================
// SETTLEMENT NEGOTIATION FUNCTIONS (from settlement-negotiation-kit.ts)
// ============================================================================

export {
  // Settlement Offers
  generateSettlementNumber,
  createSettlementOffer,
  updateSettlementOffer,
  acceptSettlementOffer,
  rejectSettlementOffer,
  counterSettlementOffer,
  withdrawSettlementOffer,
  getSettlementOfferHistory,

  // Negotiation Management
  createNegotiationSession,
  addNegotiationNote,
  trackNegotiationActivity,
  getNegotiationTimeline,

  // Settlement Analysis
  calculateSettlementRange,
  evaluateSettlementOffer,
  compareSettlements,
  calculateSettlementMetrics,

  // Authority & Approval
  checkSettlementAuthority,
  requestSettlementApproval,
  approveSettlement,
  rejectSettlementApproval,
  delegateSettlementAuthority,

  // Payment Management
  createPaymentPlan,
  validatePaymentPlan,
  calculatePaymentSchedule,
  updatePaymentStatus,
  getPaymentPlanStatus,
  recordSettlementPayment,

  // Documentation
  generateReleaseDocument,
  generateSettlementAgreement,
  validateReleaseTerms,
  executeSettlement,

  // Query & Reporting
  searchSettlements,
  getSettlementByNumber,
  getSettlementAnalytics,
  generateSettlementReport,
  exportSettlementData,
} from '../settlement-negotiation-kit';

// ============================================================================
// COMPOSITE METADATA
// ============================================================================

export const BLOOMBERG_LAW_LITIGATION_COMPOSITE_METADATA = {
  name: 'Bloomberg Law Litigation Composite',
  version: '1.0.0',
  locator: 'WC-BLOOMBERG-LITIGATION-COMPOSITE-001',
  sourceKits: [
    'litigation-support-kit',
    'deposition-management-kit',
    'expert-witness-management-kit',
    'settlement-negotiation-kit',
  ],
  functionCount: 48,
  categories: [
    'Deposition Management',
    'Exhibit Management',
    'Transcript Processing',
    'Objection Tracking',
    'Settlement Negotiation',
    'Payment Management',
    'Document Generation',
    'Litigation Analytics',
  ],
  platform: 'Bloomberg Law',
  description: 'Complete litigation lifecycle management from case intake through settlement',
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type {
  IDeposition,
  IDepositionExhibit,
  IDepositionTranscript,
  IDepositionObjection,
  IDepositionSummary,
  IDepositionOutline,
} from '../deposition-management-kit';
