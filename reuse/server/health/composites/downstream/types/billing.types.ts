/**
 * Billing and Revenue Cycle Types
 *
 * Type definitions for billing, claims, payments, revenue cycle management,
 * and financial transactions.
 *
 * @module billing.types
 * @since 1.0.0
 */

import { EntityStatus, Address } from './common.types';

/**
 * Insurance claim
 *
 * @example
 * ```typescript
 * const claim: InsuranceClaim = {
 *   claimId: 'CLM-123',
 *   patientId: 'PAT-456',
 *   encounterId: 'ENC-789',
 *   claimType: '837P',
 *   payerId: 'PAYER-001',
 *   totalCharges: 1500.00,
 *   submittedDate: new Date(),
 *   status: 'submitted'
 * };
 * ```
 */
export interface InsuranceClaim {
  claimId: string;
  patientId: string;
  encounterId: string;
  claimType: '837P' | '837I' | '837D' | 'UB04' | 'CMS1500';
  payerId: string;
  payerName?: string;
  subscriberId?: string;
  totalCharges: number;
  submittedDate: Date;
  receivedDate?: Date;
  paidDate?: Date;
  status: 'draft' | 'submitted' | 'accepted' | 'denied' | 'paid' | 'appealed';
  denialReason?: string;
  paidAmount?: number;
  adjustments?: number;
  patientResponsibility?: number;
  lineItems?: ClaimLineItem[];
}

/**
 * Claim line item
 *
 * @example
 * ```typescript
 * const lineItem: ClaimLineItem = {
 *   lineNumber: 1,
 *   procedureCode: '99213',
 *   diagnosisCodes: ['E11.9', 'I10'],
 *   serviceDate: new Date(),
 *   units: 1,
 *   chargeAmount: 150.00,
 *   allowedAmount: 120.00,
 *   paidAmount: 96.00
 * };
 * ```
 */
export interface ClaimLineItem {
  lineNumber: number;
  procedureCode: string;
  modifier?: string[];
  diagnosisCodes: string[];
  serviceDate: Date;
  units: number;
  chargeAmount: number;
  allowedAmount?: number;
  paidAmount?: number;
  deductible?: number;
  coinsurance?: number;
  copay?: number;
  denialCode?: string;
  denialReason?: string;
}

/**
 * Payment posting
 *
 * @example
 * ```typescript
 * const payment: PaymentPosting = {
 *   paymentId: 'PAY-123',
 *   claimId: 'CLM-456',
 *   paymentDate: new Date(),
 *   paymentAmount: 500.00,
 *   paymentMethod: 'EFT',
 *   payerId: 'PAYER-001',
 *   checkNumber: 'CHK-789'
 * };
 * ```
 */
export interface PaymentPosting {
  paymentId: string;
  claimId: string;
  paymentDate: Date;
  paymentAmount: number;
  paymentMethod: 'EFT' | 'check' | 'credit_card' | 'cash' | 'other';
  payerId?: string;
  checkNumber?: string;
  transactionId?: string;
  eraNumber?: string;
  adjustments?: PaymentAdjustment[];
  remarks?: string[];
}

/**
 * Payment adjustment
 *
 * @example
 * ```typescript
 * const adjustment: PaymentAdjustment = {
 *   adjustmentType: 'contractual',
 *   adjustmentAmount: 50.00,
 *   adjustmentCode: 'CO-45',
 *   adjustmentReason: 'Contractual adjustment per contract'
 * };
 * ```
 */
export interface PaymentAdjustment {
  adjustmentType: 'contractual' | 'denial' | 'write_off' | 'correction' | 'other';
  adjustmentAmount: number;
  adjustmentCode?: string;
  adjustmentReason?: string;
}

/**
 * Accounts receivable aging report entry
 *
 * @example
 * ```typescript
 * const aging: ARAgingEntry = {
 *   patientId: 'PAT-123',
 *   claimId: 'CLM-456',
 *   totalBalance: 1000.00,
 *   current: 500.00,
 *   days31to60: 300.00,
 *   days61to90: 200.00,
 *   over90: 0,
 *   lastPaymentDate: new Date('2025-10-15')
 * };
 * ```
 */
export interface ARAgingEntry {
  patientId: string;
  claimId: string;
  totalBalance: number;
  current: number;
  days31to60: number;
  days61to90: number;
  days91to120?: number;
  over120?: number;
  lastPaymentDate?: Date;
  lastStatementDate?: Date;
  payerType: 'insurance' | 'patient' | 'other';
}

/**
 * Revenue cycle KPIs
 *
 * @example
 * ```typescript
 * const kpis: RevenueCycleKPIs = {
 *   daysInAR: 45,
 *   cleanClaimRate: 0.92,
 *   denialRate: 0.08,
 *   collectionRate: 0.95,
 *   netCollectionRate: 0.89
 * };
 * ```
 */
export interface RevenueCycleKPIs {
  daysInAR: number;
  cleanClaimRate: number;
  denialRate: number;
  collectionRate: number;
  netCollectionRate: number;
  firstPassResolutionRate?: number;
  averageReimbursementTime?: number;
  badDebtPercentage?: number;
}
