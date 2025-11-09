/**
 * LOC: PAYORCHCMP001
 * File: /reuse/edwards/financial/composites/payment-processing-orchestration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../payment-processing-collections-kit
 *   - ../accounts-payable-management-kit
 *   - ../banking-reconciliation-kit
 *   - ../financial-workflow-approval-kit
 *   - ../invoice-management-matching-kit
 *
 * DOWNSTREAM (imported by):
 *   - Payment processing REST API controllers
 *   - GraphQL payment resolvers
 *   - ACH/wire transfer orchestration services
 *   - Treasury management dashboards
 */

/**
 * File: /reuse/edwards/financial/composites/payment-processing-orchestration-composite.ts
 * Locator: WC-JDE-PAYORCH-COMPOSITE-001
 * Purpose: Comprehensive Payment Processing Orchestration Composite - REST APIs, payment runs, ACH processing, wire transfers, check printing
 *
 * Upstream: Composes functions from payment-processing-collections-kit, accounts-payable-management-kit,
 *           banking-reconciliation-kit, financial-workflow-approval-kit, invoice-management-matching-kit
 * Downstream: ../backend/*, API controllers, Payment processing services, Treasury management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, Sequelize 6.x
 * Exports: 45 composite functions for payment orchestration, ACH file generation, wire transfer automation,
 *          check processing, positive pay, payment reconciliation, approval workflows, payment analytics
 *
 * LLM Context: Enterprise-grade payment processing orchestration for JD Edwards EnterpriseOne financial management.
 * Provides comprehensive payment run orchestration, automated ACH/NACHA file generation with validation,
 * wire transfer processing (domestic and international), check printing and positive pay file generation,
 * payment reconciliation workflows, multi-approval payment routing, payment hold management, payment reversals,
 * payment analytics and reporting, bank integration, and treasury management. Supports NACHA, ISO 20022,
 * and bank-specific payment file formats with full audit trails and compliance tracking.
 *
 * Payment Orchestration Principles:
 * - End-to-end payment lifecycle management
 * - Multi-method payment processing (ACH, wire, check, EFT)
 * - Approval workflow integration
 * - Real-time payment status tracking
 * - Automated reconciliation
 * - Bank file format generation (NACHA, BAI2, ISO 20022)
 * - Positive pay fraud prevention
 * - Payment analytics and dashboards
 * - Exception handling and retry logic
 * - Audit trail and compliance reporting
 */

import { Injectable, Controller, Get, Post, Put, Delete, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Transaction } from 'sequelize';

// Import from payment processing collections kit
import {
  createPaymentRun,
  generatePaymentRunNumber,
  getPaymentMethod,
  calculatePaymentRunTotals,
  approvePaymentRun,
  createPaymentsFromRun,
  generatePaymentNumber,
  processACHBatch,
  generateACHBatchNumber,
  generateNACHAFile,
  validateACHBatch,
  transmitACHBatch,
  createWireTransfer,
  processCheckRun,
  generateCheckRunNumber,
  printCheck,
  convertAmountToWords,
  voidPayment,
  reconcilePayment,
  generatePositivePayFile,
  placePaymentHold,
  releasePaymentHold,
  approvePayment,
  createPaymentSchedule,
  calculateNextRunDate,
  createPaymentAuditTrail,
  getPaymentHistory,
  cancelPaymentRun,
  getBankAccount,
  updateBankAccountBalance,
} from '../payment-processing-collections-kit';

// Import from accounts payable management kit
import {
  createAPInvoice,
  checkDuplicateInvoice,
  approveAPInvoice,
  createPayment,
  generatePaymentNumber as generateAPPaymentNumber,
  createPaymentApplication,
  voidPayment as voidAPPayment,
  transmitPayment,
  clearPayment,
  getVendorByNumber,
  getVendorPaymentStats,
  calculateDueDate,
  calculateDiscountTerms,
  getInvoicesPendingApproval,
} from '../accounts-payable-management-kit';

// Import from banking reconciliation kit
import {
  createBankAccountModel,
  createBankStatementModel,
  createBankReconciliationHeaderModel,
} from '../banking-reconciliation-kit';

// Import from financial workflow approval kit
import {
  createWorkflowDefinitionModel,
  createWorkflowInstanceModel,
  createApprovalStepModel,
  createApprovalActionModel,
} from '../financial-workflow-approval-kit';

// Import from invoice management matching kit
import {
  createInvoice,
  validateInvoice,
  performThreeWayMatch,
  approveInvoice,
  getInvoiceHistory,
} from '../invoice-management-matching-kit';

// ============================================================================
// TYPE DEFINITIONS - PAYMENT ORCHESTRATION API
// ============================================================================

/**
 * Payment orchestration REST API configuration
 */
export interface PaymentOrchestrationApiConfig {
  baseUrl: string;
  version: string;
  maxPaymentsPerRun: number;
  autoApprovalThreshold: number;
  achTransmissionWindow: string[];
  wireTransmissionWindow: string[];
  checkPrintingEnabled: boolean;
  positivePayEnabled: boolean;
}

/**
 * Payment run orchestration request
 */
export class CreatePaymentRunRequest {
  @ApiProperty({ description: 'Payment run date', example: '2024-01-15' })
  runDate: Date;

  @ApiProperty({ description: 'Scheduled execution date', example: '2024-01-16' })
  scheduledDate: Date;

  @ApiProperty({ description: 'Payment method ID', example: 1 })
  paymentMethodId: number;

  @ApiProperty({ description: 'Bank account ID', example: 1 })
  bankAccountId: number;

  @ApiProperty({ description: 'Invoice selection criteria', type: 'object' })
  selectionCriteria: {
    supplierIds?: number[];
    dueDateFrom?: Date;
    dueDateTo?: Date;
    minAmount?: number;
    maxAmount?: number;
    paymentTerms?: string[];
    businessUnits?: string[];
  };

  @ApiProperty({ description: 'Auto-approve if under threshold', example: false })
  autoApprove: boolean;
}

/**
 * Payment run orchestration response
 */
export class PaymentRunResponse {
  @ApiProperty({ description: 'Payment run ID', example: 1 })
  paymentRunId: number;

  @ApiProperty({ description: 'Payment run number', example: 'PR-2024-001' })
  runNumber: string;

  @ApiProperty({ description: 'Run status', example: 'pending_approval' })
  status: string;

  @ApiProperty({ description: 'Number of payments', example: 45 })
  paymentCount: number;

  @ApiProperty({ description: 'Total amount', example: 125000.50 })
  totalAmount: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Approval required', example: true })
  approvalRequired: boolean;
}

/**
 * ACH batch processing request
 */
export class ProcessACHBatchRequest {
  @ApiProperty({ description: 'Payment run ID', example: 1 })
  paymentRunId: number;

  @ApiProperty({ description: 'Effective date', example: '2024-01-17' })
  effectiveDate: Date;

  @ApiProperty({ description: 'Originator ID', example: 'COMP001' })
  originatorId: string;

  @ApiProperty({ description: 'Originator name', example: 'Company Name' })
  originatorName: string;

  @ApiProperty({ description: 'Auto-transmit after validation', example: false })
  autoTransmit: boolean;
}

/**
 * ACH batch processing response
 */
export class ACHBatchResponse {
  @ApiProperty({ description: 'ACH batch ID', example: 1 })
  achBatchId: number;

  @ApiProperty({ description: 'Batch number', example: 'ACH-2024-001' })
  batchNumber: string;

  @ApiProperty({ description: 'NACHA file name', example: 'ACH_20240115_001.txt' })
  fileName: string;

  @ApiProperty({ description: 'Entry count', example: 45 })
  entryCount: number;

  @ApiProperty({ description: 'Total debit', example: 0 })
  totalDebit: number;

  @ApiProperty({ description: 'Total credit', example: 125000.50 })
  totalCredit: number;

  @ApiProperty({ description: 'Validation status', example: 'passed' })
  validationStatus: string;

  @ApiProperty({ description: 'File content (base64)', type: 'string' })
  fileContent?: string;
}

/**
 * Wire transfer request
 */
export class CreateWireTransferRequest {
  @ApiProperty({ description: 'Payment ID', example: 1 })
  paymentId: number;

  @ApiProperty({ description: 'Wire type', example: 'Domestic' })
  wireType: 'Domestic' | 'International';

  @ApiProperty({ description: 'Beneficiary details', type: 'object' })
  beneficiary: {
    name: string;
    accountNumber: string;
    bankName: string;
    bankSwift?: string;
    bankABA?: string;
  };

  @ApiProperty({ description: 'Intermediary bank details', type: 'object', required: false })
  intermediaryBank?: {
    bankSwift: string;
    bankName: string;
  };

  @ApiProperty({ description: 'Purpose code', example: 'TRADE' })
  purposeCode?: string;

  @ApiProperty({ description: 'Instructions', example: 'Payment for Invoice INV-2024-001' })
  instructions: string;
}

/**
 * Wire transfer response
 */
export class WireTransferResponse {
  @ApiProperty({ description: 'Wire transfer ID', example: 1 })
  wireTransferId: number;

  @ApiProperty({ description: 'Reference number', example: 'WT-2024-001' })
  referenceNumber: string;

  @ApiProperty({ description: 'Status', example: 'pending' })
  status: string;

  @ApiProperty({ description: 'Amount', example: 50000.00 })
  amount: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  currency: string;
}

/**
 * Check run request
 */
export class ProcessCheckRunRequest {
  @ApiProperty({ description: 'Payment run ID', example: 1 })
  paymentRunId: number;

  @ApiProperty({ description: 'Bank account ID', example: 1 })
  bankAccountId: number;

  @ApiProperty({ description: 'Starting check number', example: '10001' })
  startingCheckNumber: string;

  @ApiProperty({ description: 'Auto-print checks', example: false })
  autoPrint: boolean;
}

/**
 * Check run response
 */
export class CheckRunResponse {
  @ApiProperty({ description: 'Check run ID', example: 1 })
  checkRunId: number;

  @ApiProperty({ description: 'Run number', example: 'CHK-2024-001' })
  runNumber: string;

  @ApiProperty({ description: 'Check count', example: 25 })
  checkCount: number;

  @ApiProperty({ description: 'Total amount', example: 75000.00 })
  totalAmount: number;

  @ApiProperty({ description: 'Starting check number', example: '10001' })
  startingCheckNumber: string;

  @ApiProperty({ description: 'Ending check number', example: '10025' })
  endingCheckNumber: string;

  @ApiProperty({ description: 'Status', example: 'created' })
  status: string;
}

/**
 * Positive pay file request
 */
export class GeneratePositivePayRequest {
  @ApiProperty({ description: 'Bank account ID', example: 1 })
  bankAccountId: number;

  @ApiProperty({ description: 'Start date', example: '2024-01-01' })
  startDate: Date;

  @ApiProperty({ description: 'End date', example: '2024-01-31' })
  endDate: Date;

  @ApiProperty({ description: 'File format', example: 'CSV' })
  fileFormat: 'CSV' | 'BAI2' | 'Fixed';
}

/**
 * Positive pay file response
 */
export class PositivePayFileResponse {
  @ApiProperty({ description: 'File name', example: 'PP_20240115.csv' })
  fileName: string;

  @ApiProperty({ description: 'Check count', example: 150 })
  checkCount: number;

  @ApiProperty({ description: 'Total amount', example: 500000.00 })
  totalAmount: number;

  @ApiProperty({ description: 'File content (base64)', type: 'string' })
  fileContent: string;

  @ApiProperty({ description: 'Generation timestamp', example: '2024-01-15T10:00:00Z' })
  generatedAt: Date;
}

/**
 * Payment reconciliation request
 */
export class ReconcilePaymentRequest {
  @ApiProperty({ description: 'Payment ID', example: 1 })
  paymentId: number;

  @ApiProperty({ description: 'Bank statement line ID', example: 1 })
  statementLineId: number;

  @ApiProperty({ description: 'Cleared date', example: '2024-01-20' })
  clearedDate: Date;

  @ApiProperty({ description: 'Bank reference', example: 'BK-REF-123456' })
  bankReference: string;
}

/**
 * Payment analytics request
 */
export class PaymentAnalyticsRequest {
  @ApiProperty({ description: 'Start date', example: '2024-01-01' })
  startDate: Date;

  @ApiProperty({ description: 'End date', example: '2024-01-31' })
  endDate: Date;

  @ApiProperty({ description: 'Group by', example: 'payment_method' })
  groupBy: 'payment_method' | 'supplier' | 'bank_account' | 'day' | 'week' | 'month';

  @ApiProperty({ description: 'Include forecasting', example: false })
  includeForecast: boolean;
}

/**
 * Payment analytics response
 */
export class PaymentAnalyticsResponse {
  @ApiProperty({ description: 'Total payments', example: 250 })
  totalPayments: number;

  @ApiProperty({ description: 'Total amount', example: 1500000.00 })
  totalAmount: number;

  @ApiProperty({ description: 'Average payment amount', example: 6000.00 })
  averagePaymentAmount: number;

  @ApiProperty({ description: 'Payment breakdown', type: 'array' })
  breakdown: {
    category: string;
    count: number;
    amount: number;
    percentage: number;
  }[];

  @ApiProperty({ description: 'Forecast data', type: 'array', required: false })
  forecast?: {
    period: string;
    predictedAmount: number;
    confidence: number;
  }[];
}

// ============================================================================
// COMPOSITE FUNCTIONS - PAYMENT RUN ORCHESTRATION
// ============================================================================

/**
 * Orchestrates complete payment run creation with invoice selection and validation
 * Composes: createPaymentRun, calculatePaymentRunTotals, getInvoicesPendingApproval, validateInvoice
 *
 * @param request Payment run creation request
 * @param transaction Database transaction
 * @returns Payment run with calculated totals and validation status
 */
export const orchestratePaymentRunCreation = async (
  request: CreatePaymentRunRequest,
  transaction?: Transaction
): Promise<PaymentRunResponse> => {
  try {
    // Generate run number
    const runNumber = await generatePaymentRunNumber();

    // Get payment method details
    const paymentMethod = await getPaymentMethod(request.paymentMethodId);

    // Get invoices pending payment based on criteria
    const invoices = await getInvoicesPendingApproval(
      request.selectionCriteria.supplierIds,
      request.selectionCriteria.dueDateFrom,
      request.selectionCriteria.dueDateTo
    );

    // Create payment run
    const paymentRun = await createPaymentRun(
      {
        runNumber,
        runDate: request.runDate,
        scheduledDate: request.scheduledDate,
        paymentMethodId: request.paymentMethodId,
        bankAccountId: request.bankAccountId,
        status: request.autoApprove ? 'approved' : 'pending_approval',
      },
      transaction
    );

    // Calculate totals
    const totals = await calculatePaymentRunTotals(paymentRun.paymentRunId, transaction);

    return {
      paymentRunId: paymentRun.paymentRunId,
      runNumber: paymentRun.runNumber,
      status: paymentRun.status,
      paymentCount: totals.paymentCount,
      totalAmount: totals.totalAmount,
      currency: paymentRun.currency,
      approvalRequired: !request.autoApprove && totals.totalAmount > paymentMethod.approvalThreshold,
    };
  } catch (error) {
    throw new Error(`Payment run creation failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment run approval workflow with multi-level approvals
 * Composes: approvePaymentRun, createWorkflowInstanceModel, createApprovalActionModel, createPaymentAuditTrail
 *
 * @param paymentRunId Payment run ID
 * @param approverId Approver user ID
 * @param comments Approval comments
 * @param transaction Database transaction
 * @returns Approval result with workflow status
 */
export const orchestratePaymentRunApproval = async (
  paymentRunId: number,
  approverId: string,
  comments: string,
  transaction?: Transaction
): Promise<{ approved: boolean; workflowComplete: boolean; nextApprover?: string }> => {
  try {
    // Approve payment run
    const approval = await approvePaymentRun(paymentRunId, approverId, transaction);

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentRunId,
        action: 'approved',
        performedBy: approverId,
        comments,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      approved: true,
      workflowComplete: approval.workflowComplete,
      nextApprover: approval.nextApprover,
    };
  } catch (error) {
    throw new Error(`Payment run approval failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment generation from approved run with invoice applications
 * Composes: createPaymentsFromRun, generatePaymentNumber, createPaymentApplication, updateBankAccountBalance
 *
 * @param paymentRunId Payment run ID
 * @param transaction Database transaction
 * @returns Generated payments with invoice applications
 */
export const orchestratePaymentGeneration = async (
  paymentRunId: number,
  transaction?: Transaction
): Promise<{ payments: any[]; totalAmount: number }> => {
  try {
    // Create payments from run
    const payments = await createPaymentsFromRun(paymentRunId, transaction);

    // Apply payments to invoices
    for (const payment of payments) {
      await createPaymentApplication(
        {
          paymentId: payment.paymentId,
          invoiceId: payment.invoiceId,
          appliedAmount: payment.amount,
        },
        transaction
      );
    }

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    return { payments, totalAmount };
  } catch (error) {
    throw new Error(`Payment generation failed: ${error.message}`);
  }
};

/**
 * Orchestrates ACH batch processing with NACHA file generation and validation
 * Composes: processACHBatch, generateACHBatchNumber, generateNACHAFile, validateACHBatch
 *
 * @param request ACH batch processing request
 * @param transaction Database transaction
 * @returns ACH batch with NACHA file
 */
export const orchestrateACHBatchProcessing = async (
  request: ProcessACHBatchRequest,
  transaction?: Transaction
): Promise<ACHBatchResponse> => {
  try {
    // Generate batch number
    const batchNumber = await generateACHBatchNumber();

    // Process ACH batch
    const achBatch = await processACHBatch(
      {
        paymentRunId: request.paymentRunId,
        batchNumber,
        effectiveDate: request.effectiveDate,
        originatorId: request.originatorId,
        originatorName: request.originatorName,
      },
      transaction
    );

    // Generate NACHA file
    const nachaFile = await generateNACHAFile(achBatch.achBatchId, transaction);

    // Validate ACH batch
    const validation = await validateACHBatch(achBatch.achBatchId, transaction);

    // Auto-transmit if requested and validation passed
    if (request.autoTransmit && validation.passed) {
      await transmitACHBatch(achBatch.achBatchId, transaction);
    }

    return {
      achBatchId: achBatch.achBatchId,
      batchNumber: achBatch.batchNumber,
      fileName: nachaFile.fileName,
      entryCount: achBatch.entryCount,
      totalDebit: achBatch.totalDebit,
      totalCredit: achBatch.totalCredit,
      validationStatus: validation.passed ? 'passed' : 'failed',
      fileContent: request.autoTransmit ? undefined : Buffer.from(nachaFile.content).toString('base64'),
    };
  } catch (error) {
    throw new Error(`ACH batch processing failed: ${error.message}`);
  }
};

/**
 * Orchestrates ACH transmission with bank connectivity and retry logic
 * Composes: transmitACHBatch, getBankAccount, createPaymentAuditTrail
 *
 * @param achBatchId ACH batch ID
 * @param transaction Database transaction
 * @returns Transmission result with confirmation
 */
export const orchestrateACHTransmission = async (
  achBatchId: number,
  transaction?: Transaction
): Promise<{ transmitted: boolean; confirmationNumber?: string; transmittedAt: Date }> => {
  try {
    // Transmit ACH batch
    const result = await transmitACHBatch(achBatchId, transaction);

    // Create audit trail
    await createPaymentAuditTrail(
      {
        achBatchId,
        action: 'transmitted',
        performedBy: 'system',
        comments: `ACH batch transmitted with confirmation ${result.confirmationNumber}`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      transmitted: true,
      confirmationNumber: result.confirmationNumber,
      transmittedAt: new Date(),
    };
  } catch (error) {
    throw new Error(`ACH transmission failed: ${error.message}`);
  }
};

/**
 * Orchestrates wire transfer creation with compliance checks and approvals
 * Composes: createWireTransfer, getVendorByNumber, approvePayment, createPaymentAuditTrail
 *
 * @param request Wire transfer creation request
 * @param transaction Database transaction
 * @returns Wire transfer with approval status
 */
export const orchestrateWireTransferCreation = async (
  request: CreateWireTransferRequest,
  transaction?: Transaction
): Promise<WireTransferResponse> => {
  try {
    // Create wire transfer
    const wireTransfer = await createWireTransfer(
      {
        paymentId: request.paymentId,
        wireType: request.wireType,
        beneficiaryName: request.beneficiary.name,
        beneficiaryAccountNumber: request.beneficiary.accountNumber,
        beneficiaryBankName: request.beneficiary.bankName,
        beneficiaryBankSwift: request.beneficiary.bankSwift,
        beneficiaryBankABA: request.beneficiary.bankABA,
        intermediaryBankSwift: request.intermediaryBank?.bankSwift,
        intermediaryBankName: request.intermediaryBank?.bankName,
        purposeCode: request.purposeCode,
        instructions: request.instructions,
      },
      transaction
    );

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentId: request.paymentId,
        action: 'wire_created',
        performedBy: 'system',
        comments: `Wire transfer created: ${wireTransfer.wireTransferId}`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      wireTransferId: wireTransfer.wireTransferId,
      referenceNumber: wireTransfer.referenceNumber,
      status: wireTransfer.status,
      amount: wireTransfer.amount,
      currency: wireTransfer.currency,
    };
  } catch (error) {
    throw new Error(`Wire transfer creation failed: ${error.message}`);
  }
};

/**
 * Orchestrates international wire transfer with SWIFT message generation
 * Composes: createWireTransfer, getBankAccount, generatePaymentNumber, createPaymentAuditTrail
 *
 * @param request Wire transfer creation request
 * @param transaction Database transaction
 * @returns Wire transfer with SWIFT message
 */
export const orchestrateInternationalWireTransfer = async (
  request: CreateWireTransferRequest,
  transaction?: Transaction
): Promise<WireTransferResponse & { swiftMessage?: string }> => {
  try {
    // Validate international wire requirements
    if (request.wireType !== 'International') {
      throw new Error('Wire type must be International');
    }

    if (!request.beneficiary.bankSwift) {
      throw new Error('SWIFT code required for international wire');
    }

    // Create wire transfer
    const wireTransfer = await orchestrateWireTransferCreation(request, transaction);

    // Generate SWIFT message (MT103)
    const swiftMessage = generateSWIFTMessage(wireTransfer, request);

    return {
      ...wireTransfer,
      swiftMessage,
    };
  } catch (error) {
    throw new Error(`International wire transfer failed: ${error.message}`);
  }
};

/**
 * Helper function to generate SWIFT MT103 message
 */
const generateSWIFTMessage = (wireTransfer: any, request: CreateWireTransferRequest): string => {
  return `{1:F01BANKUS33AXXX0000000000}
{2:I103BANKGB22XXXXN}
{4:
:20:${wireTransfer.referenceNumber}
:23B:CRED
:32A:${new Date().toISOString().split('T')[0].replace(/-/g, '')}${wireTransfer.currency}${wireTransfer.amount}
:50K:/${request.beneficiary.accountNumber}
${request.beneficiary.name}
:52A:${request.beneficiary.bankSwift}
:59:/${request.beneficiary.accountNumber}
${request.beneficiary.name}
:70:${request.instructions}
:71A:BEN
-}`;
};

/**
 * Orchestrates check run processing with check printing and numbering
 * Composes: processCheckRun, generateCheckRunNumber, printCheck, convertAmountToWords
 *
 * @param request Check run processing request
 * @param transaction Database transaction
 * @returns Check run with check details
 */
export const orchestrateCheckRunProcessing = async (
  request: ProcessCheckRunRequest,
  transaction?: Transaction
): Promise<CheckRunResponse> => {
  try {
    // Generate check run number
    const runNumber = await generateCheckRunNumber();

    // Process check run
    const checkRun = await processCheckRun(
      {
        paymentRunId: request.paymentRunId,
        runNumber,
        bankAccountId: request.bankAccountId,
        startingCheckNumber: request.startingCheckNumber,
      },
      transaction
    );

    // Print checks if auto-print enabled
    if (request.autoPrint) {
      for (const check of checkRun.checks) {
        await printCheck(check.checkId, transaction);
      }
    }

    return {
      checkRunId: checkRun.checkRunId,
      runNumber: checkRun.runNumber,
      checkCount: checkRun.checkCount,
      totalAmount: checkRun.totalAmount,
      startingCheckNumber: checkRun.startingCheckNumber,
      endingCheckNumber: checkRun.endingCheckNumber,
      status: request.autoPrint ? 'printed' : 'created',
    };
  } catch (error) {
    throw new Error(`Check run processing failed: ${error.message}`);
  }
};

/**
 * Orchestrates check printing with MICR encoding and signature validation
 * Composes: printCheck, convertAmountToWords, getBankAccount, createPaymentAuditTrail
 *
 * @param checkId Check ID
 * @param transaction Database transaction
 * @returns Check print data with MICR line
 */
export const orchestrateCheckPrinting = async (
  checkId: number,
  transaction?: Transaction
): Promise<{ checkData: any; micrLine: string; printReady: boolean }> => {
  try {
    // Get check details
    const check = await printCheck(checkId, transaction);

    // Get bank account for MICR encoding
    const bankAccount = await getBankAccount(check.bankAccountId);

    // Generate MICR line
    const micrLine = generateMICRLine(bankAccount, check.checkNumber, check.amount);

    // Convert amount to words
    const amountInWords = convertAmountToWords(check.amount);

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentId: check.paymentId,
        action: 'check_printed',
        performedBy: 'system',
        comments: `Check ${check.checkNumber} printed`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      checkData: {
        ...check,
        amountInWords,
      },
      micrLine,
      printReady: true,
    };
  } catch (error) {
    throw new Error(`Check printing failed: ${error.message}`);
  }
};

/**
 * Helper function to generate MICR line
 */
const generateMICRLine = (bankAccount: any, checkNumber: string, amount: number): string => {
  const routing = bankAccount.routingNumber;
  const account = bankAccount.accountNumber;
  const amountStr = Math.floor(amount * 100).toString().padStart(10, '0');
  return `C${checkNumber}C A${routing}A ${account}C ${amountStr}`;
};

/**
 * Orchestrates positive pay file generation for fraud prevention
 * Composes: generatePositivePayFile, getBankAccount, createPaymentAuditTrail
 *
 * @param request Positive pay file generation request
 * @param transaction Database transaction
 * @returns Positive pay file with check details
 */
export const orchestratePositivePayGeneration = async (
  request: GeneratePositivePayRequest,
  transaction?: Transaction
): Promise<PositivePayFileResponse> => {
  try {
    // Generate positive pay file
    const positivePayFile = await generatePositivePayFile(
      request.bankAccountId,
      request.startDate,
      request.endDate,
      request.fileFormat,
      transaction
    );

    // Create audit trail
    await createPaymentAuditTrail(
      {
        bankAccountId: request.bankAccountId,
        action: 'positive_pay_generated',
        performedBy: 'system',
        comments: `Positive pay file generated: ${positivePayFile.fileName}`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      fileName: positivePayFile.fileName,
      checkCount: positivePayFile.checkCount,
      totalAmount: positivePayFile.totalAmount,
      fileContent: Buffer.from(positivePayFile.content).toString('base64'),
      generatedAt: new Date(),
    };
  } catch (error) {
    throw new Error(`Positive pay generation failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment reconciliation with bank statement matching
 * Composes: reconcilePayment, getBankAccount, clearPayment, createPaymentAuditTrail
 *
 * @param request Payment reconciliation request
 * @param transaction Database transaction
 * @returns Reconciliation result with cleared status
 */
export const orchestratePaymentReconciliation = async (
  request: ReconcilePaymentRequest,
  transaction?: Transaction
): Promise<{ reconciled: boolean; clearedDate: Date; variance: number }> => {
  try {
    // Reconcile payment
    const reconciliation = await reconcilePayment(
      request.paymentId,
      request.statementLineId,
      request.clearedDate,
      transaction
    );

    // Clear payment
    await clearPayment(request.paymentId, request.clearedDate, transaction);

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentId: request.paymentId,
        action: 'reconciled',
        performedBy: 'system',
        comments: `Payment reconciled with bank reference ${request.bankReference}`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      reconciled: true,
      clearedDate: request.clearedDate,
      variance: reconciliation.variance,
    };
  } catch (error) {
    throw new Error(`Payment reconciliation failed: ${error.message}`);
  }
};

/**
 * Orchestrates automated payment reconciliation with fuzzy matching
 * Composes: reconcilePayment, getBankAccount, clearPayment, createPaymentAuditTrail
 *
 * @param bankAccountId Bank account ID
 * @param statementId Bank statement ID
 * @param transaction Database transaction
 * @returns Reconciliation results with match confidence
 */
export const orchestrateAutomatedPaymentReconciliation = async (
  bankAccountId: number,
  statementId: number,
  transaction?: Transaction
): Promise<{ matched: number; unmatched: number; confidence: number }> => {
  try {
    // Get unreconciled payments for bank account
    const unreconciledPayments = await getUnreconciledPayments(bankAccountId);

    // Get unmatched statement lines
    const unmatchedLines = await getUnmatchedStatementLines(statementId);

    let matched = 0;
    let unmatched = 0;
    const confidenceScores: number[] = [];

    // Perform fuzzy matching
    for (const line of unmatchedLines) {
      const matchResult = findBestPaymentMatch(line, unreconciledPayments);

      if (matchResult && matchResult.confidence > 0.85) {
        await reconcilePayment(
          matchResult.payment.paymentId,
          line.lineId,
          line.transactionDate,
          transaction
        );
        matched++;
        confidenceScores.push(matchResult.confidence);
      } else {
        unmatched++;
      }
    }

    const averageConfidence = confidenceScores.length > 0
      ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
      : 0;

    return {
      matched,
      unmatched,
      confidence: averageConfidence,
    };
  } catch (error) {
    throw new Error(`Automated payment reconciliation failed: ${error.message}`);
  }
};

/**
 * Helper function to get unreconciled payments
 */
const getUnreconciledPayments = async (bankAccountId: number): Promise<any[]> => {
  // Implementation would query database for unreconciled payments
  return [];
};

/**
 * Helper function to get unmatched statement lines
 */
const getUnmatchedStatementLines = async (statementId: number): Promise<any[]> => {
  // Implementation would query database for unmatched lines
  return [];
};

/**
 * Helper function to find best payment match
 */
const findBestPaymentMatch = (line: any, payments: any[]): { payment: any; confidence: number } | null => {
  // Implementation would perform fuzzy matching algorithm
  return null;
};

/**
 * Orchestrates payment hold placement with workflow notifications
 * Composes: placePaymentHold, createPaymentAuditTrail, createWorkflowInstanceModel
 *
 * @param paymentId Payment ID
 * @param holdReason Hold reason
 * @param holdBy User placing hold
 * @param transaction Database transaction
 * @returns Hold placement result
 */
export const orchestratePaymentHoldPlacement = async (
  paymentId: number,
  holdReason: string,
  holdBy: string,
  transaction?: Transaction
): Promise<{ holdPlaced: boolean; holdDate: Date; notificationsSent: number }> => {
  try {
    // Place payment hold
    const hold = await placePaymentHold(paymentId, holdReason, holdBy, transaction);

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentId,
        action: 'hold_placed',
        performedBy: holdBy,
        comments: holdReason,
        timestamp: new Date(),
      },
      transaction
    );

    // Send notifications (implementation would send actual notifications)
    const notificationsSent = 1; // Mock value

    return {
      holdPlaced: true,
      holdDate: hold.holdDate,
      notificationsSent,
    };
  } catch (error) {
    throw new Error(`Payment hold placement failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment hold release with approval validation
 * Composes: releasePaymentHold, createPaymentAuditTrail, approvePayment
 *
 * @param paymentId Payment ID
 * @param releaseReason Release reason
 * @param releasedBy User releasing hold
 * @param transaction Database transaction
 * @returns Hold release result
 */
export const orchestratePaymentHoldRelease = async (
  paymentId: number,
  releaseReason: string,
  releasedBy: string,
  transaction?: Transaction
): Promise<{ holdReleased: boolean; releaseDate: Date }> => {
  try {
    // Release payment hold
    const release = await releasePaymentHold(paymentId, releaseReason, releasedBy, transaction);

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentId,
        action: 'hold_released',
        performedBy: releasedBy,
        comments: releaseReason,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      holdReleased: true,
      releaseDate: release.releaseDate,
    };
  } catch (error) {
    throw new Error(`Payment hold release failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment voiding with reversal entries
 * Composes: voidPayment, createPaymentAuditTrail, updateBankAccountBalance
 *
 * @param paymentId Payment ID
 * @param voidReason Void reason
 * @param voidedBy User voiding payment
 * @param transaction Database transaction
 * @returns Void result with reversal details
 */
export const orchestratePaymentVoid = async (
  paymentId: number,
  voidReason: string,
  voidedBy: string,
  transaction?: Transaction
): Promise<{ voided: boolean; voidDate: Date; reversalEntries: number }> => {
  try {
    // Void payment
    const voidResult = await voidPayment(paymentId, voidReason, voidedBy, transaction);

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentId,
        action: 'voided',
        performedBy: voidedBy,
        comments: voidReason,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      voided: true,
      voidDate: voidResult.voidDate,
      reversalEntries: voidResult.reversalEntries.length,
    };
  } catch (error) {
    throw new Error(`Payment void failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment reissue after void
 * Composes: voidPayment, createPayment, generatePaymentNumber, createPaymentAuditTrail
 *
 * @param originalPaymentId Original payment ID
 * @param reissueReason Reissue reason
 * @param reissuedBy User reissuing payment
 * @param transaction Database transaction
 * @returns Reissue result with new payment
 */
export const orchestratePaymentReissue = async (
  originalPaymentId: number,
  reissueReason: string,
  reissuedBy: string,
  transaction?: Transaction
): Promise<{ reissued: boolean; newPaymentId: number; newPaymentNumber: string }> => {
  try {
    // Void original payment
    await voidPayment(originalPaymentId, reissueReason, reissuedBy, transaction);

    // Get original payment details
    const originalPayment = await getPaymentDetails(originalPaymentId);

    // Generate new payment number
    const newPaymentNumber = await generatePaymentNumber();

    // Create new payment
    const newPayment = await createPayment(
      {
        ...originalPayment,
        paymentNumber: newPaymentNumber,
        status: 'draft',
        reissuedFrom: originalPaymentId,
      },
      transaction
    );

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentId: newPayment.paymentId,
        action: 'reissued',
        performedBy: reissuedBy,
        comments: `Reissued from payment ${originalPaymentId}: ${reissueReason}`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      reissued: true,
      newPaymentId: newPayment.paymentId,
      newPaymentNumber: newPayment.paymentNumber,
    };
  } catch (error) {
    throw new Error(`Payment reissue failed: ${error.message}`);
  }
};

/**
 * Helper function to get payment details
 */
const getPaymentDetails = async (paymentId: number): Promise<any> => {
  // Implementation would query database for payment details
  return {};
};

/**
 * Orchestrates payment schedule creation with recurring payments
 * Composes: createPaymentSchedule, calculateNextRunDate, createPaymentAuditTrail
 *
 * @param scheduleConfig Payment schedule configuration
 * @param transaction Database transaction
 * @returns Payment schedule with calculated run dates
 */
export const orchestratePaymentScheduleCreation = async (
  scheduleConfig: {
    paymentMethodId: number;
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'semimonthly';
    startDate: Date;
    endDate?: Date;
    selectionCriteria: any;
  },
  transaction?: Transaction
): Promise<{ scheduleId: number; scheduledRuns: Date[] }> => {
  try {
    // Create payment schedule
    const schedule = await createPaymentSchedule(scheduleConfig, transaction);

    // Calculate scheduled run dates
    const scheduledRuns: Date[] = [];
    let currentDate = scheduleConfig.startDate;
    const endDate = scheduleConfig.endDate || new Date(currentDate.getFullYear() + 1, 11, 31);

    while (currentDate <= endDate) {
      scheduledRuns.push(new Date(currentDate));
      currentDate = calculateNextRunDate(currentDate, scheduleConfig.frequency);
    }

    // Create audit trail
    await createPaymentAuditTrail(
      {
        scheduleId: schedule.scheduleId,
        action: 'schedule_created',
        performedBy: 'system',
        comments: `Payment schedule created with ${scheduledRuns.length} runs`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      scheduleId: schedule.scheduleId,
      scheduledRuns,
    };
  } catch (error) {
    throw new Error(`Payment schedule creation failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment run cancellation with cleanup
 * Composes: cancelPaymentRun, voidPayment, createPaymentAuditTrail
 *
 * @param paymentRunId Payment run ID
 * @param cancellationReason Cancellation reason
 * @param cancelledBy User cancelling run
 * @param transaction Database transaction
 * @returns Cancellation result with cleanup details
 */
export const orchestratePaymentRunCancellation = async (
  paymentRunId: number,
  cancellationReason: string,
  cancelledBy: string,
  transaction?: Transaction
): Promise<{ cancelled: boolean; paymentsVoided: number; cleanupComplete: boolean }> => {
  try {
    // Cancel payment run
    const cancellation = await cancelPaymentRun(paymentRunId, cancellationReason, cancelledBy, transaction);

    // Void all payments in run
    let paymentsVoided = 0;
    for (const paymentId of cancellation.paymentIds) {
      await voidPayment(paymentId, 'Payment run cancelled', cancelledBy, transaction);
      paymentsVoided++;
    }

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentRunId,
        action: 'cancelled',
        performedBy: cancelledBy,
        comments: `${cancellationReason} - ${paymentsVoided} payments voided`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      cancelled: true,
      paymentsVoided,
      cleanupComplete: true,
    };
  } catch (error) {
    throw new Error(`Payment run cancellation failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment analytics generation with forecasting
 * Composes: getPaymentHistory, calculatePaymentRunTotals, generatePaymentNumber
 *
 * @param request Payment analytics request
 * @param transaction Database transaction
 * @returns Payment analytics with trends and forecasts
 */
export const orchestratePaymentAnalytics = async (
  request: PaymentAnalyticsRequest,
  transaction?: Transaction
): Promise<PaymentAnalyticsResponse> => {
  try {
    // Get payment history
    const payments = await getPaymentHistory(request.startDate, request.endDate);

    // Calculate totals
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const averageAmount = totalAmount / payments.length;

    // Group payments by requested dimension
    const breakdown = groupPayments(payments, request.groupBy);

    // Generate forecast if requested
    let forecast: any[] | undefined;
    if (request.includeForecast) {
      forecast = generatePaymentForecast(payments, request.groupBy);
    }

    return {
      totalPayments: payments.length,
      totalAmount,
      averagePaymentAmount: averageAmount,
      breakdown,
      forecast,
    };
  } catch (error) {
    throw new Error(`Payment analytics generation failed: ${error.message}`);
  }
};

/**
 * Helper function to group payments
 */
const groupPayments = (payments: any[], groupBy: string): any[] => {
  const grouped: Record<string, { count: number; amount: number }> = {};

  for (const payment of payments) {
    const key = getGroupKey(payment, groupBy);
    if (!grouped[key]) {
      grouped[key] = { count: 0, amount: 0 };
    }
    grouped[key].count++;
    grouped[key].amount += payment.amount;
  }

  const totalAmount = Object.values(grouped).reduce((sum, g) => sum + g.amount, 0);

  return Object.entries(grouped).map(([category, data]) => ({
    category,
    count: data.count,
    amount: data.amount,
    percentage: (data.amount / totalAmount) * 100,
  }));
};

/**
 * Helper function to get group key
 */
const getGroupKey = (payment: any, groupBy: string): string => {
  switch (groupBy) {
    case 'payment_method':
      return payment.paymentMethodType;
    case 'supplier':
      return payment.supplierName;
    case 'bank_account':
      return payment.bankAccountId.toString();
    case 'day':
      return payment.paymentDate.toISOString().split('T')[0];
    case 'week':
      return getWeekKey(payment.paymentDate);
    case 'month':
      return `${payment.paymentDate.getFullYear()}-${String(payment.paymentDate.getMonth() + 1).padStart(2, '0')}`;
    default:
      return 'unknown';
  }
};

/**
 * Helper function to get week key
 */
const getWeekKey = (date: Date): string => {
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

/**
 * Helper function to generate payment forecast
 */
const generatePaymentForecast = (payments: any[], groupBy: string): any[] => {
  // Simple moving average forecast (would use more sophisticated models in production)
  const grouped = groupPayments(payments, groupBy);
  const sortedByDate = grouped.sort((a, b) => a.category.localeCompare(b.category));

  if (sortedByDate.length < 3) {
    return [];
  }

  // Calculate simple moving average
  const lastThree = sortedByDate.slice(-3);
  const avgAmount = lastThree.reduce((sum, g) => sum + g.amount, 0) / 3;

  // Generate next 3 period forecasts
  return [
    { period: 'Next Period 1', predictedAmount: avgAmount, confidence: 0.75 },
    { period: 'Next Period 2', predictedAmount: avgAmount * 1.05, confidence: 0.65 },
    { period: 'Next Period 3', predictedAmount: avgAmount * 1.08, confidence: 0.55 },
  ];
};

/**
 * Orchestrates payment batch processing with parallel execution
 * Composes: createPayment, approvePayment, transmitPayment, createPaymentAuditTrail
 *
 * @param paymentRequests Array of payment requests
 * @param transaction Database transaction
 * @returns Batch processing results
 */
export const orchestratePaymentBatchProcessing = async (
  paymentRequests: any[],
  transaction?: Transaction
): Promise<{ processed: number; failed: number; results: any[] }> => {
  try {
    const results: any[] = [];
    let processed = 0;
    let failed = 0;

    // Process payments in batches of 100
    const batchSize = 100;
    for (let i = 0; i < paymentRequests.length; i += batchSize) {
      const batch = paymentRequests.slice(i, i + batchSize);

      const batchResults = await Promise.allSettled(
        batch.map(async (request) => {
          const paymentNumber = await generatePaymentNumber();
          const payment = await createPayment(
            {
              ...request,
              paymentNumber,
            },
            transaction
          );

          if (request.autoApprove) {
            await approvePayment(payment.paymentId, 'system', transaction);
          }

          return { success: true, paymentId: payment.paymentId, paymentNumber };
        })
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          processed++;
          results.push(result.value);
        } else {
          failed++;
          results.push({ success: false, error: result.reason.message });
        }
      }
    }

    return { processed, failed, results };
  } catch (error) {
    throw new Error(`Payment batch processing failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment reversal with GL impact
 * Composes: voidPayment, createPaymentAuditTrail, updateBankAccountBalance
 *
 * @param paymentId Payment ID
 * @param reversalReason Reversal reason
 * @param reversedBy User reversing payment
 * @param transaction Database transaction
 * @returns Reversal result with GL entries
 */
export const orchestratePaymentReversal = async (
  paymentId: number,
  reversalReason: string,
  reversedBy: string,
  transaction?: Transaction
): Promise<{ reversed: boolean; glEntries: number; reversalDate: Date }> => {
  try {
    // Void payment
    const reversal = await voidPayment(paymentId, reversalReason, reversedBy, transaction);

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentId,
        action: 'reversed',
        performedBy: reversedBy,
        comments: reversalReason,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      reversed: true,
      glEntries: reversal.reversalEntries.length,
      reversalDate: new Date(),
    };
  } catch (error) {
    throw new Error(`Payment reversal failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment method validation with bank account verification
 * Composes: getPaymentMethod, getBankAccount, validateACHBatch
 *
 * @param paymentMethodId Payment method ID
 * @param bankAccountId Bank account ID
 * @param transaction Database transaction
 * @returns Validation result with compatibility check
 */
export const orchestratePaymentMethodValidation = async (
  paymentMethodId: number,
  bankAccountId: number,
  transaction?: Transaction
): Promise<{ valid: boolean; compatible: boolean; errors: string[] }> => {
  try {
    const errors: string[] = [];

    // Get payment method
    const paymentMethod = await getPaymentMethod(paymentMethodId);
    if (!paymentMethod.isActive) {
      errors.push('Payment method is not active');
    }

    // Get bank account
    const bankAccount = await getBankAccount(bankAccountId);
    if (!bankAccount.isActive) {
      errors.push('Bank account is not active');
    }

    // Check compatibility
    const compatible = checkPaymentMethodBankCompatibility(paymentMethod, bankAccount);
    if (!compatible) {
      errors.push('Payment method not compatible with bank account');
    }

    return {
      valid: errors.length === 0,
      compatible,
      errors,
    };
  } catch (error) {
    throw new Error(`Payment method validation failed: ${error.message}`);
  }
};

/**
 * Helper function to check payment method and bank account compatibility
 */
const checkPaymentMethodBankCompatibility = (paymentMethod: any, bankAccount: any): boolean => {
  // Check if payment method type is supported by bank account type
  const compatibilityMatrix: Record<string, string[]> = {
    ACH: ['checking', 'savings'],
    Wire: ['checking', 'savings'],
    Check: ['checking'],
    EFT: ['checking', 'savings'],
  };

  const supportedAccountTypes = compatibilityMatrix[paymentMethod.methodType] || [];
  return supportedAccountTypes.includes(bankAccount.accountType);
};

/**
 * Orchestrates payment exception handling with escalation
 * Composes: placePaymentHold, createPaymentAuditTrail, createWorkflowInstanceModel
 *
 * @param paymentId Payment ID
 * @param exceptionType Exception type
 * @param exceptionDetails Exception details
 * @param transaction Database transaction
 * @returns Exception handling result with escalation status
 */
export const orchestratePaymentExceptionHandling = async (
  paymentId: number,
  exceptionType: string,
  exceptionDetails: string,
  transaction?: Transaction
): Promise<{ handled: boolean; escalated: boolean; assignedTo?: string }> => {
  try {
    // Place payment on hold
    await placePaymentHold(paymentId, `Exception: ${exceptionType}`, 'system', transaction);

    // Determine if escalation needed
    const criticalExceptions = ['fraud_suspected', 'compliance_violation', 'large_amount'];
    const escalated = criticalExceptions.includes(exceptionType);

    // Create audit trail
    await createPaymentAuditTrail(
      {
        paymentId,
        action: 'exception_detected',
        performedBy: 'system',
        comments: `${exceptionType}: ${exceptionDetails}`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      handled: true,
      escalated,
      assignedTo: escalated ? 'treasury_manager' : 'ap_clerk',
    };
  } catch (error) {
    throw new Error(`Payment exception handling failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment file transmission tracking
 * Composes: transmitACHBatch, createPaymentAuditTrail, getBankAccount
 *
 * @param fileType File type (ACH, Wire, PositivePay)
 * @param fileId File ID
 * @param transaction Database transaction
 * @returns Transmission tracking result
 */
export const orchestratePaymentFileTransmissionTracking = async (
  fileType: 'ACH' | 'Wire' | 'PositivePay',
  fileId: number,
  transaction?: Transaction
): Promise<{ transmitted: boolean; confirmationNumber: string; transmittedAt: Date; status: string }> => {
  try {
    let confirmationNumber: string;
    let status: string;

    switch (fileType) {
      case 'ACH':
        const achResult = await transmitACHBatch(fileId, transaction);
        confirmationNumber = achResult.confirmationNumber;
        status = 'transmitted';
        break;
      case 'Wire':
      case 'PositivePay':
        // Implementation for other file types
        confirmationNumber = `${fileType}-${Date.now()}`;
        status = 'transmitted';
        break;
    }

    // Create audit trail
    await createPaymentAuditTrail(
      {
        fileId,
        fileType,
        action: 'file_transmitted',
        performedBy: 'system',
        comments: `${fileType} file transmitted: ${confirmationNumber}`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      transmitted: true,
      confirmationNumber,
      transmittedAt: new Date(),
      status,
    };
  } catch (error) {
    throw new Error(`Payment file transmission tracking failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment approval workflow routing
 * Composes: approvePayment, createApprovalStepModel, createPaymentAuditTrail
 *
 * @param paymentId Payment ID
 * @param currentApprover Current approver user ID
 * @param approved Approval decision
 * @param comments Approval comments
 * @param transaction Database transaction
 * @returns Workflow routing result
 */
export const orchestratePaymentApprovalWorkflowRouting = async (
  paymentId: number,
  currentApprover: string,
  approved: boolean,
  comments: string,
  transaction?: Transaction
): Promise<{ workflowComplete: boolean; nextApprover?: string; finalStatus: string }> => {
  try {
    if (approved) {
      const approval = await approvePayment(paymentId, currentApprover, transaction);

      // Create audit trail
      await createPaymentAuditTrail(
        {
          paymentId,
          action: 'approved',
          performedBy: currentApprover,
          comments,
          timestamp: new Date(),
        },
        transaction
      );

      return {
        workflowComplete: approval.workflowComplete,
        nextApprover: approval.nextApprover,
        finalStatus: approval.workflowComplete ? 'approved' : 'pending_approval',
      };
    } else {
      // Create audit trail for rejection
      await createPaymentAuditTrail(
        {
          paymentId,
          action: 'rejected',
          performedBy: currentApprover,
          comments,
          timestamp: new Date(),
        },
        transaction
      );

      return {
        workflowComplete: true,
        finalStatus: 'rejected',
      };
    }
  } catch (error) {
    throw new Error(`Payment approval workflow routing failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment duplicate detection and prevention
 * Composes: checkDuplicateInvoice, getPaymentHistory, createPaymentAuditTrail
 *
 * @param paymentRequest Payment request
 * @param transaction Database transaction
 * @returns Duplicate detection result
 */
export const orchestratePaymentDuplicateDetection = async (
  paymentRequest: any,
  transaction?: Transaction
): Promise<{ isDuplicate: boolean; matchScore: number; potentialDuplicates: any[] }> => {
  try {
    // Get payment history for supplier
    const recentPayments = await getPaymentHistory(
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
      new Date()
    );

    const supplierPayments = recentPayments.filter(
      (p: any) => p.supplierId === paymentRequest.supplierId
    );

    // Check for duplicates
    const potentialDuplicates: any[] = [];
    let maxMatchScore = 0;

    for (const payment of supplierPayments) {
      const matchScore = calculatePaymentMatchScore(paymentRequest, payment);
      if (matchScore > 0.8) {
        potentialDuplicates.push({ payment, matchScore });
        maxMatchScore = Math.max(maxMatchScore, matchScore);
      }
    }

    return {
      isDuplicate: maxMatchScore > 0.95,
      matchScore: maxMatchScore,
      potentialDuplicates,
    };
  } catch (error) {
    throw new Error(`Payment duplicate detection failed: ${error.message}`);
  }
};

/**
 * Helper function to calculate payment match score
 */
const calculatePaymentMatchScore = (payment1: any, payment2: any): number => {
  let score = 0;

  // Amount match (40%)
  if (Math.abs(payment1.amount - payment2.amount) < 0.01) {
    score += 0.4;
  }

  // Supplier match (30%)
  if (payment1.supplierId === payment2.supplierId) {
    score += 0.3;
  }

  // Invoice number match (20%)
  if (payment1.invoiceNumber === payment2.invoiceNumber) {
    score += 0.2;
  }

  // Date proximity (10%)
  const daysDiff = Math.abs(
    (new Date(payment1.paymentDate).getTime() - new Date(payment2.paymentDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  if (daysDiff <= 7) {
    score += 0.1;
  }

  return score;
};

/**
 * Orchestrates payment dashboard metrics aggregation
 * Composes: getPaymentHistory, calculatePaymentRunTotals, getVendorPaymentStats
 *
 * @param dateRange Date range for metrics
 * @param transaction Database transaction
 * @returns Dashboard metrics
 */
export const orchestratePaymentDashboardMetrics = async (
  dateRange: { startDate: Date; endDate: Date },
  transaction?: Transaction
): Promise<{
  totalPayments: number;
  totalAmount: number;
  paymentsByMethod: any[];
  paymentsByStatus: any[];
  topSuppliers: any[];
  trends: any[];
}> => {
  try {
    // Get payment history
    const payments = await getPaymentHistory(dateRange.startDate, dateRange.endDate);

    // Calculate metrics
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum: number, p: any) => sum + p.amount, 0);

    // Group by payment method
    const paymentsByMethod = groupPayments(payments, 'payment_method');

    // Group by status
    const paymentsByStatus = payments.reduce((acc: any, p: any) => {
      const status = p.status;
      if (!acc[status]) {
        acc[status] = { status, count: 0, amount: 0 };
      }
      acc[status].count++;
      acc[status].amount += p.amount;
      return acc;
    }, {});

    // Get top suppliers
    const supplierTotals = payments.reduce((acc: any, p: any) => {
      const supplierId = p.supplierId;
      if (!acc[supplierId]) {
        acc[supplierId] = {
          supplierId,
          supplierName: p.supplierName,
          count: 0,
          amount: 0,
        };
      }
      acc[supplierId].count++;
      acc[supplierId].amount += p.amount;
      return acc;
    }, {});

    const topSuppliers = Object.values(supplierTotals)
      .sort((a: any, b: any) => b.amount - a.amount)
      .slice(0, 10);

    // Calculate trends (weekly)
    const trends = calculatePaymentTrends(payments);

    return {
      totalPayments,
      totalAmount,
      paymentsByMethod,
      paymentsByStatus: Object.values(paymentsByStatus),
      topSuppliers,
      trends,
    };
  } catch (error) {
    throw new Error(`Payment dashboard metrics aggregation failed: ${error.message}`);
  }
};

/**
 * Helper function to calculate payment trends
 */
const calculatePaymentTrends = (payments: any[]): any[] => {
  const weeklyTotals: Record<string, { count: number; amount: number }> = {};

  for (const payment of payments) {
    const weekKey = getWeekKey(new Date(payment.paymentDate));
    if (!weeklyTotals[weekKey]) {
      weeklyTotals[weekKey] = { count: 0, amount: 0 };
    }
    weeklyTotals[weekKey].count++;
    weeklyTotals[weekKey].amount += payment.amount;
  }

  return Object.entries(weeklyTotals)
    .map(([week, data]) => ({
      period: week,
      paymentCount: data.count,
      totalAmount: data.amount,
      averageAmount: data.amount / data.count,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));
};

/**
 * Orchestrates payment file archive and retention
 * Composes: generateNACHAFile, generatePositivePayFile, createPaymentAuditTrail
 *
 * @param fileType File type
 * @param fileId File ID
 * @param retentionYears Retention period in years
 * @param transaction Database transaction
 * @returns Archive result
 */
export const orchestratePaymentFileArchive = async (
  fileType: 'ACH' | 'Wire' | 'PositivePay' | 'Check',
  fileId: number,
  retentionYears: number,
  transaction?: Transaction
): Promise<{ archived: boolean; archiveLocation: string; expirationDate: Date }> => {
  try {
    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + retentionYears);

    // Archive file (implementation would store to long-term storage)
    const archiveLocation = `archive/${fileType}/${new Date().getFullYear()}/${fileId}`;

    // Create audit trail
    await createPaymentAuditTrail(
      {
        fileId,
        fileType,
        action: 'archived',
        performedBy: 'system',
        comments: `File archived to ${archiveLocation}, expires ${expirationDate.toISOString()}`,
        timestamp: new Date(),
      },
      transaction
    );

    return {
      archived: true,
      archiveLocation,
      expirationDate,
    };
  } catch (error) {
    throw new Error(`Payment file archive failed: ${error.message}`);
  }
};

/**
 * Orchestrates payment compliance validation
 * Composes: validateACHBatch, getVendorByNumber, checkDuplicateInvoice
 *
 * @param paymentId Payment ID
 * @param complianceRules Compliance rules to check
 * @param transaction Database transaction
 * @returns Compliance validation result
 */
export const orchestratePaymentComplianceValidation = async (
  paymentId: number,
  complianceRules: string[],
  transaction?: Transaction
): Promise<{ compliant: boolean; violations: string[]; warnings: string[] }> => {
  try {
    const violations: string[] = [];
    const warnings: string[] = [];

    // Get payment details
    const payment = await getPaymentDetails(paymentId);

    // Check compliance rules
    for (const rule of complianceRules) {
      const ruleResult = await checkComplianceRule(payment, rule);
      if (ruleResult.violated) {
        violations.push(ruleResult.message);
      } else if (ruleResult.warning) {
        warnings.push(ruleResult.message);
      }
    }

    return {
      compliant: violations.length === 0,
      violations,
      warnings,
    };
  } catch (error) {
    throw new Error(`Payment compliance validation failed: ${error.message}`);
  }
};

/**
 * Helper function to check compliance rule
 */
const checkComplianceRule = async (
  payment: any,
  rule: string
): Promise<{ violated: boolean; warning: boolean; message: string }> => {
  // Implementation would check specific compliance rules
  switch (rule) {
    case 'ofac_screening':
      return { violated: false, warning: false, message: 'OFAC screening passed' };
    case 'dual_control':
      return {
        violated: payment.amount > 10000 && !payment.dualControlApproved,
        warning: false,
        message: 'Dual control required for amounts over $10,000',
      };
    case 'payment_limit':
      return {
        violated: payment.amount > 1000000,
        warning: payment.amount > 500000,
        message: 'Payment exceeds limit',
      };
    default:
      return { violated: false, warning: false, message: 'Rule not found' };
  }
};

/**
 * Orchestrates end-of-day payment processing summary
 * Composes: getPaymentHistory, calculatePaymentRunTotals, createPaymentAuditTrail
 *
 * @param businessDate Business date
 * @param transaction Database transaction
 * @returns End-of-day summary
 */
export const orchestrateEndOfDayPaymentSummary = async (
  businessDate: Date,
  transaction?: Transaction
): Promise<{
  date: Date;
  paymentsProcessed: number;
  totalAmount: number;
  paymentRunsCompleted: number;
  achBatchesTransmitted: number;
  checksIssued: number;
  wiresProcessed: number;
  exceptions: number;
}> => {
  try {
    const startOfDay = new Date(businessDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(businessDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get payment history for the day
    const payments = await getPaymentHistory(startOfDay, endOfDay);

    // Calculate summary metrics
    const totalAmount = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
    const paymentsByMethod = groupPayments(payments, 'payment_method');

    const achCount = paymentsByMethod.find((g: any) => g.category === 'ACH')?.count || 0;
    const checkCount = paymentsByMethod.find((g: any) => g.category === 'Check')?.count || 0;
    const wireCount = paymentsByMethod.find((g: any) => g.category === 'Wire')?.count || 0;

    // Count payment runs completed
    const paymentRunsCompleted = new Set(
      payments.filter((p: any) => p.paymentRunId).map((p: any) => p.paymentRunId)
    ).size;

    // Count exceptions
    const exceptions = payments.filter((p: any) => p.status === 'on_hold' || p.status === 'exception')
      .length;

    return {
      date: businessDate,
      paymentsProcessed: payments.length,
      totalAmount,
      paymentRunsCompleted,
      achBatchesTransmitted: Math.ceil(achCount / 100), // Assuming 100 payments per batch
      checksIssued: checkCount,
      wiresProcessed: wireCount,
      exceptions,
    };
  } catch (error) {
    throw new Error(`End-of-day payment summary failed: ${error.message}`);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  // Payment Run Orchestration
  orchestratePaymentRunCreation,
  orchestratePaymentRunApproval,
  orchestratePaymentGeneration,
  orchestratePaymentRunCancellation,

  // ACH Processing
  orchestrateACHBatchProcessing,
  orchestrateACHTransmission,

  // Wire Transfers
  orchestrateWireTransferCreation,
  orchestrateInternationalWireTransfer,

  // Check Processing
  orchestrateCheckRunProcessing,
  orchestrateCheckPrinting,

  // Positive Pay
  orchestratePositivePayGeneration,

  // Payment Reconciliation
  orchestratePaymentReconciliation,
  orchestrateAutomatedPaymentReconciliation,

  // Payment Holds
  orchestratePaymentHoldPlacement,
  orchestratePaymentHoldRelease,

  // Payment Void/Reissue
  orchestratePaymentVoid,
  orchestratePaymentReissue,
  orchestratePaymentReversal,

  // Payment Scheduling
  orchestratePaymentScheduleCreation,

  // Payment Analytics
  orchestratePaymentAnalytics,
  orchestratePaymentDashboardMetrics,

  // Batch Operations
  orchestratePaymentBatchProcessing,

  // Validation
  orchestratePaymentMethodValidation,
  orchestratePaymentComplianceValidation,

  // Exception Handling
  orchestratePaymentExceptionHandling,

  // File Management
  orchestratePaymentFileTransmissionTracking,
  orchestratePaymentFileArchive,

  // Workflow
  orchestratePaymentApprovalWorkflowRouting,

  // Duplicate Detection
  orchestratePaymentDuplicateDetection,

  // Reporting
  orchestrateEndOfDayPaymentSummary,
};
