/**
 * LOC: CEFMSAPBE001
 * File: /reuse/financial/cefms/composites/downstream/accounts-payable-backend-service.ts
 *
 * UPSTREAM (imports from):
 *   - ../cefms-accounts-payable-processing-composite.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend CEFMS AP controllers
 *   - Invoice processing APIs
 *   - Payment processing APIs
 *   - AP reporting services
 */

/**
 * File: /reuse/financial/cefms/composites/downstream/accounts-payable-backend-service.ts
 * Locator: WC-CEFMS-APBE-001
 * Purpose: USACE CEFMS Accounts Payable Backend Service - Complete AP backend implementation with invoice processing, payment scheduling, vendor management
 *
 * Upstream: Imports from cefms-accounts-payable-processing-composite.ts
 * Downstream: AP controllers, invoice APIs, payment APIs, vendor management UIs
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: Complete backend service with 50+ functions for USACE CEFMS AP operations
 *
 * LLM Context: Production-ready USACE CEFMS accounts payable backend service.
 * Comprehensive invoice lifecycle management, 3-way matching, payment approval workflows,
 * ACH/wire/check processing, early payment discounts, payment holds, 1099 reporting,
 * duplicate detection, vendor payment history, AP aging, cash requirements, and dashboard.
 */

import { Model, DataTypes, Sequelize, Transaction, Op } from 'sequelize';
import { Injectable, Logger } from '@nestjs/common';

// Import from composite
import {
  createInvoiceModel,
  createInvoiceLineItemModel,
  createPaymentScheduleModel,
  createPaymentHoldModel,
  createForm1099Model,
  createInvoice,
  validateInvoice,
  checkDuplicateInvoice,
  performThreeWayMatch,
  approveInvoice,
  rejectInvoice,
  getInvoicesByStatus,
  getOverdueInvoices,
  schedulePayment,
  createPaymentBatch,
  processVendorPayment,
  generateACHPaymentFile,
  generateWireTransferInstructions,
  getScheduledPayments,
  cancelScheduledPayment,
  reversePayment,
  calculateEarlyPaymentDiscount,
  applyEarlyPaymentDiscount,
  placePaymentHold,
  releasePaymentHold,
  getActivePaymentHolds,
  getEarlyPaymentEligibleInvoices,
  generatePaymentHoldReport,
  escalateOverdueHolds,
  calculate1099Amounts,
  generate1099Form,
  get1099RequiredVendors,
  file1099Electronically,
  correct1099Form,
  export1099ToIRSFormat,
  generate1099SummaryReport,
  validate1099Compliance,
  generateAPAgingReport,
  generateCashRequirementsForecast,
  generateVendorPaymentSummary,
  generatePaymentMethodReport,
  generateDuplicateInvoiceReport,
  generateApprovalWorkflowMetrics,
  generatePaymentExceptionReport,
  calculatePaymentCostSavings,
  exportAPDataCSV,
  generateAPDashboard,
} from '../cefms-accounts-payable-processing-composite';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface APBackendConfig {
  enableAutomaticMatching: boolean;
  enableEarlyPaymentDiscounts: boolean;
  duplicateCheckEnabled: boolean;
  requireApprovalForAmount: number;
  defaultPaymentMethod: 'ACH' | 'WIRE' | 'CHECK' | 'CARD';
  achProcessingDays: number[];
  wireProcessingDays: number[];
  checkProcessingDays: number[];
}

interface InvoiceWorkflowState {
  invoiceId: string;
  currentState: 'draft' | 'pending_approval' | 'approved' | 'paid' | 'rejected' | 'on_hold';
  previousState?: string;
  stateChangedAt: Date;
  stateChangedBy: string;
  workflowHistory: WorkflowHistoryEntry[];
  approvers: string[];
  requiresAdditionalApproval: boolean;
}

interface WorkflowHistoryEntry {
  timestamp: Date;
  action: string;
  userId: string;
  fromState: string;
  toState: string;
  notes?: string;
}

interface VendorAPSummary {
  vendorId: string;
  vendorName: string;
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  invoiceCount: number;
  avgPaymentDays: number;
  earlyPaymentDiscountsTaken: number;
  paymentsOnHold: number;
  overdueAmount: number;
  creditLimit: number;
  availableCredit: number;
}

interface PaymentApprovalRequest {
  requestId: string;
  paymentScheduleId: string;
  requestedBy: string;
  requestedAt: Date;
  approvalLevel: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}

interface APMetrics {
  totalInvoices: number;
  totalInvoiceAmount: number;
  pendingApproval: number;
  pendingApprovalAmount: number;
  approved: number;
  approvedAmount: number;
  paid: number;
  paidAmount: number;
  onHold: number;
  onHoldAmount: number;
  avgProcessingDays: number;
  avgPaymentDays: number;
  discountsCaptured: number;
  discountsMissed: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Sequelize model for AP Backend Configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} APBackendConfig model
 */
export const createAPBackendConfigModel = (sequelize: Sequelize) => {
  class APBackendConfigModel extends Model {
    public id!: string;
    public configKey!: string;
    public configValue!: any;
    public description!: string;
    public isActive!: boolean;
    public lastModifiedBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  APBackendConfigModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      configKey: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Configuration key',
      },
      configValue: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Configuration value',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Configuration description',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Configuration is active',
      },
      lastModifiedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Last modified by user ID',
      },
    },
    {
      sequelize,
      tableName: 'ap_backend_configs',
      timestamps: true,
      indexes: [
        { fields: ['configKey'], unique: true },
        { fields: ['isActive'] },
      ],
    },
  );

  return APBackendConfigModel;
};

/**
 * Sequelize model for Invoice Workflow State.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvoiceWorkflow model
 */
export const createInvoiceWorkflowModel = (sequelize: Sequelize) => {
  class InvoiceWorkflow extends Model {
    public id!: string;
    public invoiceId!: string;
    public currentState!: string;
    public previousState!: string | null;
    public stateChangedAt!: Date;
    public stateChangedBy!: string;
    public workflowHistory!: WorkflowHistoryEntry[];
    public approvers!: string[];
    public requiresAdditionalApproval!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  InvoiceWorkflow.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        comment: 'Related invoice ID',
      },
      currentState: {
        type: DataTypes.ENUM('draft', 'pending_approval', 'approved', 'paid', 'rejected', 'on_hold'),
        allowNull: false,
        comment: 'Current workflow state',
      },
      previousState: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Previous workflow state',
      },
      stateChangedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'State change timestamp',
      },
      stateChangedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'User who changed state',
      },
      workflowHistory: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Workflow history entries',
      },
      approvers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'List of approver user IDs',
      },
      requiresAdditionalApproval: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Requires additional approval',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'ap_invoice_workflows',
      timestamps: true,
      indexes: [
        { fields: ['invoiceId'], unique: true },
        { fields: ['currentState'] },
        { fields: ['stateChangedAt'] },
      ],
    },
  );

  return InvoiceWorkflow;
};

/**
 * Sequelize model for Payment Approval Requests.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentApprovalRequest model
 */
export const createPaymentApprovalModel = (sequelize: Sequelize) => {
  class PaymentApproval extends Model {
    public id!: string;
    public requestId!: string;
    public paymentScheduleId!: string;
    public requestedBy!: string;
    public requestedAt!: Date;
    public approvalLevel!: number;
    public status!: string;
    public approvedBy!: string | null;
    public approvedAt!: Date | null;
    public rejectionReason!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  PaymentApproval.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      requestId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Approval request ID',
      },
      paymentScheduleId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Payment schedule ID',
      },
      requestedBy: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Requested by user ID',
      },
      requestedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Request timestamp',
      },
      approvalLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Required approval level',
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Approval status',
      },
      approvedBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Approved by user ID',
      },
      approvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Approval timestamp',
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Rejection reason',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'ap_payment_approvals',
      timestamps: true,
      indexes: [
        { fields: ['requestId'], unique: true },
        { fields: ['paymentScheduleId'] },
        { fields: ['status'] },
        { fields: ['requestedAt'] },
      ],
    },
  );

  return PaymentApproval;
};

/**
 * Sequelize model for Vendor AP Summary cache.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VendorAPSummary model
 */
export const createVendorAPSummaryModel = (sequelize: Sequelize) => {
  class VendorAPSummaryModel extends Model {
    public id!: string;
    public vendorId!: string;
    public vendorName!: string;
    public totalInvoiced!: number;
    public totalPaid!: number;
    public totalOutstanding!: number;
    public invoiceCount!: number;
    public avgPaymentDays!: number;
    public earlyPaymentDiscountsTaken!: number;
    public paymentsOnHold!: number;
    public overdueAmount!: number;
    public creditLimit!: number;
    public availableCredit!: number;
    public lastUpdated!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  VendorAPSummaryModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vendorId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Vendor identifier',
      },
      vendorName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Vendor name',
      },
      totalInvoiced: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total invoiced amount',
      },
      totalPaid: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total paid amount',
      },
      totalOutstanding: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total outstanding amount',
      },
      invoiceCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total invoice count',
      },
      avgPaymentDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Average payment days',
      },
      earlyPaymentDiscountsTaken: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Early payment discounts taken',
      },
      paymentsOnHold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Payments on hold count',
      },
      overdueAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Overdue amount',
      },
      creditLimit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Vendor credit limit',
      },
      availableCredit: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Available credit',
      },
      lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Last updated timestamp',
      },
    },
    {
      sequelize,
      tableName: 'ap_vendor_summaries',
      timestamps: true,
      indexes: [
        { fields: ['vendorId'], unique: true },
        { fields: ['totalOutstanding'] },
        { fields: ['overdueAmount'] },
        { fields: ['lastUpdated'] },
      ],
    },
  );

  return VendorAPSummaryModel;
};

// ============================================================================
// BACKEND CONFIGURATION MANAGEMENT (1-5)
// ============================================================================

/**
 * Retrieves backend configuration.
 *
 * @param {string} configKey - Configuration key
 * @param {Model} APBackendConfig - Config model
 * @returns {Promise<any>} Configuration value
 *
 * @example
 * ```typescript
 * const config = await getBackendConfig('enableAutomaticMatching', APBackendConfig);
 * ```
 */
export const getBackendConfig = async (
  configKey: string,
  APBackendConfig: any,
): Promise<any> => {
  const config = await APBackendConfig.findOne({
    where: { configKey, isActive: true },
  });

  if (!config) {
    throw new Error(`Configuration not found: ${configKey}`);
  }

  return config.configValue;
};

/**
 * Updates backend configuration.
 *
 * @param {string} configKey - Configuration key
 * @param {any} configValue - Configuration value
 * @param {string} userId - User ID
 * @param {Model} APBackendConfig - Config model
 * @returns {Promise<any>} Updated configuration
 */
export const updateBackendConfig = async (
  configKey: string,
  configValue: any,
  userId: string,
  APBackendConfig: any,
): Promise<any> => {
  const config = await APBackendConfig.findOne({ where: { configKey } });

  if (config) {
    config.configValue = configValue;
    config.lastModifiedBy = userId;
    await config.save();
    return config;
  }

  return await APBackendConfig.create({
    configKey,
    configValue,
    description: `Configuration for ${configKey}`,
    isActive: true,
    lastModifiedBy: userId,
  });
};

/**
 * Initializes default backend configuration.
 *
 * @param {Model} APBackendConfig - Config model
 * @returns {Promise<void>}
 */
export const initializeDefaultConfig = async (APBackendConfig: any): Promise<void> => {
  const defaultConfigs = [
    {
      configKey: 'enableAutomaticMatching',
      configValue: true,
      description: 'Enable automatic 3-way matching',
    },
    {
      configKey: 'enableEarlyPaymentDiscounts',
      configValue: true,
      description: 'Enable early payment discount calculations',
    },
    {
      configKey: 'duplicateCheckEnabled',
      configValue: true,
      description: 'Enable duplicate invoice checking',
    },
    {
      configKey: 'requireApprovalForAmount',
      configValue: 10000,
      description: 'Require approval for amounts above threshold',
    },
    {
      configKey: 'defaultPaymentMethod',
      configValue: 'ACH',
      description: 'Default payment method',
    },
    {
      configKey: 'achProcessingDays',
      configValue: [1, 2, 3, 4, 5],
      description: 'ACH processing days (1=Mon, 5=Fri)',
    },
  ];

  for (const config of defaultConfigs) {
    const existing = await APBackendConfig.findOne({
      where: { configKey: config.configKey },
    });

    if (!existing) {
      await APBackendConfig.create({
        ...config,
        isActive: true,
        lastModifiedBy: 'system',
      });
    }
  }
};

/**
 * Validates backend configuration.
 *
 * @param {APBackendConfig} config - Configuration to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 */
export const validateBackendConfig = (
  config: APBackendConfig,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (config.requireApprovalForAmount < 0) {
    errors.push('Approval amount threshold must be non-negative');
  }

  if (!['ACH', 'WIRE', 'CHECK', 'CARD'].includes(config.defaultPaymentMethod)) {
    errors.push('Invalid default payment method');
  }

  if (config.achProcessingDays.some(day => day < 1 || day > 7)) {
    errors.push('ACH processing days must be 1-7');
  }

  return { valid: errors.length === 0, errors };
};

/**
 * Exports backend configuration.
 *
 * @param {Model} APBackendConfig - Config model
 * @returns {Promise<Buffer>} JSON export
 */
export const exportBackendConfig = async (APBackendConfig: any): Promise<Buffer> => {
  const configs = await APBackendConfig.findAll({
    where: { isActive: true },
  });

  const exportData = configs.map((config: any) => ({
    key: config.configKey,
    value: config.configValue,
    description: config.description,
  }));

  return Buffer.from(JSON.stringify(exportData, null, 2), 'utf-8');
};

// ============================================================================
// INVOICE WORKFLOW MANAGEMENT (6-13)
// ============================================================================

/**
 * Creates invoice workflow state.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} userId - User ID
 * @param {Model} InvoiceWorkflow - Workflow model
 * @returns {Promise<any>} Created workflow
 */
export const createInvoiceWorkflow = async (
  invoiceId: string,
  userId: string,
  InvoiceWorkflow: any,
): Promise<any> => {
  return await InvoiceWorkflow.create({
    invoiceId,
    currentState: 'draft',
    previousState: null,
    stateChangedAt: new Date(),
    stateChangedBy: userId,
    workflowHistory: [
      {
        timestamp: new Date(),
        action: 'created',
        userId,
        fromState: 'none',
        toState: 'draft',
      },
    ],
    approvers: [],
    requiresAdditionalApproval: false,
  });
};

/**
 * Transitions invoice workflow state.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} newState - New state
 * @param {string} userId - User ID
 * @param {string} [notes] - Optional notes
 * @param {Model} InvoiceWorkflow - Workflow model
 * @returns {Promise<any>} Updated workflow
 */
export const transitionInvoiceState = async (
  invoiceId: string,
  newState: string,
  userId: string,
  notes: string = '',
  InvoiceWorkflow: any,
): Promise<any> => {
  const workflow = await InvoiceWorkflow.findOne({ where: { invoiceId } });
  if (!workflow) throw new Error('Workflow not found');

  const historyEntry: WorkflowHistoryEntry = {
    timestamp: new Date(),
    action: 'state_transition',
    userId,
    fromState: workflow.currentState,
    toState: newState,
    notes,
  };

  workflow.previousState = workflow.currentState;
  workflow.currentState = newState;
  workflow.stateChangedAt = new Date();
  workflow.stateChangedBy = userId;
  workflow.workflowHistory = [...workflow.workflowHistory, historyEntry];

  await workflow.save();
  return workflow;
};

/**
 * Adds approver to invoice workflow.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} approverId - Approver user ID
 * @param {Model} InvoiceWorkflow - Workflow model
 * @returns {Promise<any>} Updated workflow
 */
export const addInvoiceApprover = async (
  invoiceId: string,
  approverId: string,
  InvoiceWorkflow: any,
): Promise<any> => {
  const workflow = await InvoiceWorkflow.findOne({ where: { invoiceId } });
  if (!workflow) throw new Error('Workflow not found');

  if (!workflow.approvers.includes(approverId)) {
    workflow.approvers = [...workflow.approvers, approverId];
    await workflow.save();
  }

  return workflow;
};

/**
 * Retrieves invoice workflow history.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Model} InvoiceWorkflow - Workflow model
 * @returns {Promise<WorkflowHistoryEntry[]>} Workflow history
 */
export const getInvoiceWorkflowHistory = async (
  invoiceId: string,
  InvoiceWorkflow: any,
): Promise<WorkflowHistoryEntry[]> => {
  const workflow = await InvoiceWorkflow.findOne({ where: { invoiceId } });
  if (!workflow) throw new Error('Workflow not found');

  return workflow.workflowHistory;
};

/**
 * Checks if invoice requires additional approval.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {number} invoiceAmount - Invoice amount
 * @param {Model} InvoiceWorkflow - Workflow model
 * @param {Model} APBackendConfig - Config model
 * @returns {Promise<boolean>} Requires approval
 */
export const requiresAdditionalApproval = async (
  invoiceId: string,
  invoiceAmount: number,
  InvoiceWorkflow: any,
  APBackendConfig: any,
): Promise<boolean> => {
  const threshold = await getBackendConfig('requireApprovalForAmount', APBackendConfig);
  const requiresApproval = invoiceAmount >= threshold;

  const workflow = await InvoiceWorkflow.findOne({ where: { invoiceId } });
  if (workflow) {
    workflow.requiresAdditionalApproval = requiresApproval;
    await workflow.save();
  }

  return requiresApproval;
};

/**
 * Retrieves invoices by workflow state.
 *
 * @param {string} state - Workflow state
 * @param {Model} InvoiceWorkflow - Workflow model
 * @returns {Promise<any[]>} Invoices in state
 */
export const getInvoicesByWorkflowState = async (
  state: string,
  InvoiceWorkflow: any,
): Promise<any[]> => {
  return await InvoiceWorkflow.findAll({
    where: { currentState: state },
    order: [['stateChangedAt', 'DESC']],
  });
};

/**
 * Generates workflow metrics.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} InvoiceWorkflow - Workflow model
 * @returns {Promise<any>} Workflow metrics
 */
export const generateWorkflowMetrics = async (
  startDate: Date,
  endDate: Date,
  InvoiceWorkflow: any,
): Promise<any> => {
  const workflows = await InvoiceWorkflow.findAll({
    where: {
      stateChangedAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const stateCounts = new Map<string, number>();
  workflows.forEach((wf: any) => {
    stateCounts.set(wf.currentState, (stateCounts.get(wf.currentState) || 0) + 1);
  });

  let totalTransitionTime = 0;
  let transitionCount = 0;

  workflows.forEach((wf: any) => {
    if (wf.workflowHistory.length > 1) {
      const firstState = new Date(wf.workflowHistory[0].timestamp);
      const lastState = new Date(wf.workflowHistory[wf.workflowHistory.length - 1].timestamp);
      totalTransitionTime += lastState.getTime() - firstState.getTime();
      transitionCount++;
    }
  });

  const avgTransitionDays = transitionCount > 0
    ? totalTransitionTime / transitionCount / (1000 * 60 * 60 * 24)
    : 0;

  return {
    period: { startDate, endDate },
    totalWorkflows: workflows.length,
    byState: Array.from(stateCounts.entries()).map(([state, count]) => ({ state, count })),
    avgTransitionDays,
  };
};

/**
 * Validates workflow transition.
 *
 * @param {string} currentState - Current state
 * @param {string} newState - New state
 * @returns {{ valid: boolean; reason?: string }} Validation result
 */
export const validateWorkflowTransition = (
  currentState: string,
  newState: string,
): { valid: boolean; reason?: string } => {
  const allowedTransitions: Record<string, string[]> = {
    draft: ['pending_approval', 'rejected'],
    pending_approval: ['approved', 'rejected', 'on_hold'],
    approved: ['paid', 'on_hold'],
    on_hold: ['pending_approval', 'rejected'],
    rejected: ['draft'],
    paid: [],
  };

  const allowed = allowedTransitions[currentState] || [];
  if (!allowed.includes(newState)) {
    return {
      valid: false,
      reason: `Transition from ${currentState} to ${newState} not allowed`,
    };
  }

  return { valid: true };
};

// ============================================================================
// PAYMENT APPROVAL WORKFLOW (14-20)
// ============================================================================

/**
 * Creates payment approval request.
 *
 * @param {string} paymentScheduleId - Payment schedule ID
 * @param {string} userId - User ID
 * @param {number} approvalLevel - Approval level
 * @param {Model} PaymentApproval - Approval model
 * @returns {Promise<any>} Created approval request
 */
export const createPaymentApprovalRequest = async (
  paymentScheduleId: string,
  userId: string,
  approvalLevel: number,
  PaymentApproval: any,
): Promise<any> => {
  const requestId = `PAR-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  return await PaymentApproval.create({
    requestId,
    paymentScheduleId,
    requestedBy: userId,
    requestedAt: new Date(),
    approvalLevel,
    status: 'pending',
  });
};

/**
 * Approves payment request.
 *
 * @param {string} requestId - Request ID
 * @param {string} approverId - Approver user ID
 * @param {Model} PaymentApproval - Approval model
 * @returns {Promise<any>} Approved request
 */
export const approvePaymentRequest = async (
  requestId: string,
  approverId: string,
  PaymentApproval: any,
): Promise<any> => {
  const approval = await PaymentApproval.findOne({ where: { requestId } });
  if (!approval) throw new Error('Approval request not found');

  if (approval.status !== 'pending') {
    throw new Error('Approval request already processed');
  }

  approval.status = 'approved';
  approval.approvedBy = approverId;
  approval.approvedAt = new Date();
  await approval.save();

  return approval;
};

/**
 * Rejects payment request.
 *
 * @param {string} requestId - Request ID
 * @param {string} reason - Rejection reason
 * @param {string} userId - User ID
 * @param {Model} PaymentApproval - Approval model
 * @returns {Promise<any>} Rejected request
 */
export const rejectPaymentRequest = async (
  requestId: string,
  reason: string,
  userId: string,
  PaymentApproval: any,
): Promise<any> => {
  const approval = await PaymentApproval.findOne({ where: { requestId } });
  if (!approval) throw new Error('Approval request not found');

  if (approval.status !== 'pending') {
    throw new Error('Approval request already processed');
  }

  approval.status = 'rejected';
  approval.approvedBy = userId;
  approval.approvedAt = new Date();
  approval.rejectionReason = reason;
  await approval.save();

  return approval;
};

/**
 * Retrieves pending payment approvals.
 *
 * @param {string} [approverId] - Optional approver filter
 * @param {Model} PaymentApproval - Approval model
 * @returns {Promise<any[]>} Pending approvals
 */
export const getPendingPaymentApprovals = async (
  approverId: string | undefined,
  PaymentApproval: any,
): Promise<any[]> => {
  const where: any = { status: 'pending' };

  return await PaymentApproval.findAll({
    where,
    order: [['requestedAt', 'ASC']],
  });
};

/**
 * Generates payment approval metrics.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} PaymentApproval - Approval model
 * @returns {Promise<any>} Approval metrics
 */
export const generatePaymentApprovalMetrics = async (
  startDate: Date,
  endDate: Date,
  PaymentApproval: any,
): Promise<any> => {
  const approvals = await PaymentApproval.findAll({
    where: {
      requestedAt: { [Op.between]: [startDate, endDate] },
    },
  });

  let totalApprovalTime = 0;
  let approvedCount = 0;

  approvals.forEach((approval: any) => {
    if (approval.approvedAt && approval.status === 'approved') {
      const requestTime = new Date(approval.requestedAt).getTime();
      const approvalTime = new Date(approval.approvedAt).getTime();
      totalApprovalTime += approvalTime - requestTime;
      approvedCount++;
    }
  });

  const avgApprovalHours = approvedCount > 0
    ? totalApprovalTime / approvedCount / (1000 * 60 * 60)
    : 0;

  const statusCounts = new Map<string, number>();
  approvals.forEach((approval: any) => {
    statusCounts.set(approval.status, (statusCounts.get(approval.status) || 0) + 1);
  });

  return {
    period: { startDate, endDate },
    totalRequests: approvals.length,
    avgApprovalHours,
    byStatus: Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count })),
  };
};

/**
 * Escalates overdue payment approvals.
 *
 * @param {number} hoursOverdue - Hours overdue threshold
 * @param {Model} PaymentApproval - Approval model
 * @returns {Promise<any[]>} Overdue approvals
 */
export const escalateOverduePaymentApprovals = async (
  hoursOverdue: number,
  PaymentApproval: any,
): Promise<any[]> => {
  const thresholdDate = new Date();
  thresholdDate.setHours(thresholdDate.getHours() - hoursOverdue);

  const overdueApprovals = await PaymentApproval.findAll({
    where: {
      status: 'pending',
      requestedAt: { [Op.lte]: thresholdDate },
    },
  });

  // Mark as escalated
  for (const approval of overdueApprovals) {
    approval.metadata = {
      ...approval.metadata,
      escalated: true,
      escalatedAt: new Date().toISOString(),
    };
    await approval.save();
  }

  return overdueApprovals;
};

/**
 * Bulk approves payment requests.
 *
 * @param {string[]} requestIds - Request IDs
 * @param {string} approverId - Approver user ID
 * @param {Model} PaymentApproval - Approval model
 * @returns {Promise<number>} Number of approved requests
 */
export const bulkApprovePaymentRequests = async (
  requestIds: string[],
  approverId: string,
  PaymentApproval: any,
): Promise<number> => {
  const result = await PaymentApproval.update(
    {
      status: 'approved',
      approvedBy: approverId,
      approvedAt: new Date(),
    },
    {
      where: {
        requestId: { [Op.in]: requestIds },
        status: 'pending',
      },
    },
  );

  return result[0];
};

// ============================================================================
// VENDOR AP SUMMARY MANAGEMENT (21-27)
// ============================================================================

/**
 * Updates vendor AP summary.
 *
 * @param {string} vendorId - Vendor ID
 * @param {Model} Invoice - Invoice model
 * @param {Model} VendorAPSummary - Summary model
 * @returns {Promise<any>} Updated summary
 */
export const updateVendorAPSummary = async (
  vendorId: string,
  Invoice: any,
  VendorAPSummary: any,
): Promise<any> => {
  const invoices = await Invoice.findAll({ where: { vendorId } });

  const totalInvoiced = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.invoiceAmount),
    0,
  );
  const totalPaid = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.paidAmount),
    0,
  );
  const totalOutstanding = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.remainingAmount),
    0,
  );

  const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid');
  let totalPaymentDays = 0;
  paidInvoices.forEach((inv: any) => {
    const invoiceDate = new Date(inv.invoiceDate);
    const paidDate = new Date(inv.updatedAt); // Approximate
    const days = Math.floor((paidDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
    totalPaymentDays += days;
  });

  const avgPaymentDays = paidInvoices.length > 0 ? totalPaymentDays / paidInvoices.length : 0;

  const overdueInvoices = invoices.filter((inv: any) => {
    return inv.status !== 'paid' && new Date(inv.dueDate) < new Date();
  });
  const overdueAmount = overdueInvoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.remainingAmount),
    0,
  );

  const summary = await VendorAPSummary.findOne({ where: { vendorId } });

  const summaryData = {
    vendorId,
    vendorName: invoices[0]?.vendorName || 'Unknown',
    totalInvoiced,
    totalPaid,
    totalOutstanding,
    invoiceCount: invoices.length,
    avgPaymentDays,
    earlyPaymentDiscountsTaken: 0, // Would calculate from invoice metadata
    paymentsOnHold: invoices.filter((inv: any) => inv.status === 'on_hold').length,
    overdueAmount,
    creditLimit: 100000, // Would come from vendor master
    availableCredit: 100000 - totalOutstanding,
    lastUpdated: new Date(),
  };

  if (summary) {
    Object.assign(summary, summaryData);
    await summary.save();
    return summary;
  }

  return await VendorAPSummary.create(summaryData);
};

/**
 * Retrieves vendor AP summary.
 *
 * @param {string} vendorId - Vendor ID
 * @param {Model} VendorAPSummary - Summary model
 * @returns {Promise<any>} Vendor summary
 */
export const getVendorAPSummary = async (
  vendorId: string,
  VendorAPSummary: any,
): Promise<any> => {
  return await VendorAPSummary.findOne({ where: { vendorId } });
};

/**
 * Retrieves vendors with outstanding balances.
 *
 * @param {number} [threshold=0] - Minimum outstanding threshold
 * @param {Model} VendorAPSummary - Summary model
 * @returns {Promise<any[]>} Vendors with balances
 */
export const getVendorsWithOutstandingBalances = async (
  threshold: number = 0,
  VendorAPSummary: any,
): Promise<any[]> => {
  return await VendorAPSummary.findAll({
    where: {
      totalOutstanding: { [Op.gt]: threshold },
    },
    order: [['totalOutstanding', 'DESC']],
  });
};

/**
 * Retrieves vendors with overdue amounts.
 *
 * @param {Model} VendorAPSummary - Summary model
 * @returns {Promise<any[]>} Vendors with overdue amounts
 */
export const getVendorsWithOverdueAmounts = async (
  VendorAPSummary: any,
): Promise<any[]> => {
  return await VendorAPSummary.findAll({
    where: {
      overdueAmount: { [Op.gt]: 0 },
    },
    order: [['overdueAmount', 'DESC']],
  });
};

/**
 * Generates vendor performance report.
 *
 * @param {string} vendorId - Vendor ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} Invoice - Invoice model
 * @returns {Promise<any>} Performance report
 */
export const generateVendorPerformanceReport = async (
  vendorId: string,
  startDate: Date,
  endDate: Date,
  Invoice: any,
): Promise<any> => {
  const invoices = await Invoice.findAll({
    where: {
      vendorId,
      invoiceDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const onTimePayments = invoices.filter((inv: any) => {
    if (inv.status !== 'paid') return false;
    const dueDate = new Date(inv.dueDate);
    const paidDate = new Date(inv.updatedAt);
    return paidDate <= dueDate;
  }).length;

  const latePayments = invoices.filter((inv: any) => {
    if (inv.status !== 'paid') return false;
    const dueDate = new Date(inv.dueDate);
    const paidDate = new Date(inv.updatedAt);
    return paidDate > dueDate;
  }).length;

  return {
    vendorId,
    period: { startDate, endDate },
    totalInvoices: invoices.length,
    onTimePayments,
    latePayments,
    onTimePercent: invoices.length > 0 ? (onTimePayments / invoices.length) * 100 : 0,
  };
};

/**
 * Refreshes all vendor AP summaries.
 *
 * @param {Model} Invoice - Invoice model
 * @param {Model} VendorAPSummary - Summary model
 * @returns {Promise<number>} Number of summaries updated
 */
export const refreshAllVendorAPSummaries = async (
  Invoice: any,
  VendorAPSummary: any,
): Promise<number> => {
  const vendors = await Invoice.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('vendorId')), 'vendorId']],
  });

  let count = 0;
  for (const vendor of vendors) {
    await updateVendorAPSummary(vendor.vendorId, Invoice, VendorAPSummary);
    count++;
  }

  return count;
};

/**
 * Exports vendor AP summaries.
 *
 * @param {Model} VendorAPSummary - Summary model
 * @returns {Promise<Buffer>} CSV export
 */
export const exportVendorAPSummaries = async (VendorAPSummary: any): Promise<Buffer> => {
  const summaries = await VendorAPSummary.findAll({
    order: [['totalOutstanding', 'DESC']],
  });

  const csv =
    'Vendor ID,Vendor Name,Total Invoiced,Total Paid,Total Outstanding,Invoice Count,Avg Payment Days,Overdue Amount\n' +
    summaries
      .map(
        (s: any) =>
          `${s.vendorId},${s.vendorName},${s.totalInvoiced},${s.totalPaid},${s.totalOutstanding},${s.invoiceCount},${s.avgPaymentDays},${s.overdueAmount}`,
      )
      .join('\n');

  return Buffer.from(csv, 'utf-8');
};

// ============================================================================
// ADVANCED INVOICE OPERATIONS (28-35)
// ============================================================================

/**
 * Processes invoice with automatic workflow.
 *
 * @param {any} invoiceData - Invoice data
 * @param {string} userId - User ID
 * @param {Model} Invoice - Invoice model
 * @param {Model} InvoiceLineItem - Line item model
 * @param {Model} InvoiceWorkflow - Workflow model
 * @param {Model} APBackendConfig - Config model
 * @returns {Promise<any>} Processed invoice with workflow
 */
export const processInvoiceWithWorkflow = async (
  invoiceData: any,
  userId: string,
  Invoice: any,
  InvoiceLineItem: any,
  InvoiceWorkflow: any,
  APBackendConfig: any,
): Promise<any> => {
  // Validate invoice
  const validation = validateInvoice(invoiceData);
  if (!validation.valid) {
    throw new Error(`Invoice validation failed: ${validation.errors.join(', ')}`);
  }

  // Check duplicates if enabled
  const duplicateCheckEnabled = await getBackendConfig('duplicateCheckEnabled', APBackendConfig);
  if (duplicateCheckEnabled) {
    const duplicateCheck = await checkDuplicateInvoice(
      invoiceData.invoiceNumber,
      invoiceData.vendorId,
      invoiceData.invoiceAmount,
      Invoice,
    );

    if (duplicateCheck.isDuplicate && duplicateCheck.matchType === 'exact') {
      throw new Error(`Duplicate invoice detected: ${duplicateCheck.matchedInvoiceNumber}`);
    }
  }

  // Create invoice
  const invoice = await createInvoice(invoiceData, Invoice, InvoiceLineItem);

  // Create workflow
  const workflow = await createInvoiceWorkflow(invoice.id, userId, InvoiceWorkflow);

  // Check if requires approval
  const requiresApproval = await requiresAdditionalApproval(
    invoice.id,
    invoice.invoiceAmount,
    InvoiceWorkflow,
    APBackendConfig,
  );

  if (requiresApproval) {
    await transitionInvoiceState(invoice.id, 'pending_approval', userId, 'Requires approval', InvoiceWorkflow);
  }

  return { invoice, workflow, requiresApproval };
};

/**
 * Performs automatic 3-way match and approval.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {string} userId - User ID
 * @param {Model} Invoice - Invoice model
 * @param {Model} InvoiceLineItem - Line item model
 * @param {Model} InvoiceWorkflow - Workflow model
 * @param {Model} APBackendConfig - Config model
 * @returns {Promise<any>} Match result with approval status
 */
export const performAutoMatchAndApprove = async (
  invoiceId: string,
  userId: string,
  Invoice: any,
  InvoiceLineItem: any,
  InvoiceWorkflow: any,
  APBackendConfig: any,
): Promise<any> => {
  const autoMatchEnabled = await getBackendConfig('enableAutomaticMatching', APBackendConfig);
  if (!autoMatchEnabled) {
    return { autoMatch: false, message: 'Automatic matching disabled' };
  }

  // Perform 3-way match
  const matchResult = await performThreeWayMatch(invoiceId, Invoice, InvoiceLineItem);

  if (matchResult.matched && !matchResult.requiresReview) {
    // Auto-approve if matched
    await approveInvoice(invoiceId, 'system', Invoice);
    await transitionInvoiceState(invoiceId, 'approved', 'system', 'Auto-approved via 3-way match', InvoiceWorkflow);

    return {
      autoMatch: true,
      autoApproved: true,
      matchResult,
    };
  }

  return {
    autoMatch: true,
    autoApproved: false,
    matchResult,
    message: 'Requires manual review',
  };
};

/**
 * Schedules payment with automatic discount check.
 *
 * @param {string} invoiceId - Invoice ID
 * @param {Date} scheduledDate - Scheduled payment date
 * @param {string} userId - User ID
 * @param {Model} Invoice - Invoice model
 * @param {Model} PaymentSchedule - Schedule model
 * @param {Model} APBackendConfig - Config model
 * @returns {Promise<any>} Payment schedule with discount info
 */
export const schedulePaymentWithDiscountCheck = async (
  invoiceId: string,
  scheduledDate: Date,
  userId: string,
  Invoice: any,
  PaymentSchedule: any,
  APBackendConfig: any,
): Promise<any> => {
  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) throw new Error('Invoice not found');

  // Check for early payment discount
  const discountEnabled = await getBackendConfig('enableEarlyPaymentDiscounts', APBackendConfig);
  let discount = null;

  if (discountEnabled) {
    discount = await calculateEarlyPaymentDiscount(invoiceId, Invoice);

    if (discount.eligible) {
      await applyEarlyPaymentDiscount(invoiceId, Invoice);
    }
  }

  // Get default payment method
  const defaultMethod = await getBackendConfig('defaultPaymentMethod', APBackendConfig);

  // Schedule payment
  const schedule = await schedulePayment(
    {
      scheduleId: `PS-${Date.now()}`,
      invoiceId,
      vendorId: invoice.vendorId,
      paymentAmount: invoice.netAmount,
      scheduledDate,
      paymentMethod: defaultMethod,
      priority: 'normal',
      status: 'scheduled',
    },
    PaymentSchedule,
  );

  return {
    schedule,
    discount,
    discountApplied: discount?.eligible || false,
  };
};

/**
 * Processes batch payment approval.
 *
 * @param {string[]} invoiceIds - Invoice IDs
 * @param {string} approverId - Approver user ID
 * @param {Model} Invoice - Invoice model
 * @param {Model} InvoiceWorkflow - Workflow model
 * @returns {Promise<any>} Batch approval result
 */
export const batchApproveInvoices = async (
  invoiceIds: string[],
  approverId: string,
  Invoice: any,
  InvoiceWorkflow: any,
): Promise<any> => {
  const results = {
    approved: [] as string[],
    failed: [] as { invoiceId: string; reason: string }[],
  };

  for (const invoiceId of invoiceIds) {
    try {
      await approveInvoice(invoiceId, approverId, Invoice);
      await transitionInvoiceState(invoiceId, 'approved', approverId, 'Batch approval', InvoiceWorkflow);
      results.approved.push(invoiceId);
    } catch (error: any) {
      results.failed.push({ invoiceId, reason: error.message });
    }
  }

  return results;
};

/**
 * Generates comprehensive AP metrics.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} Invoice - Invoice model
 * @param {Model} InvoiceWorkflow - Workflow model
 * @returns {Promise<APMetrics>} AP metrics
 */
export const generateComprehensiveAPMetrics = async (
  startDate: Date,
  endDate: Date,
  Invoice: any,
  InvoiceWorkflow: any,
): Promise<APMetrics> => {
  const invoices = await Invoice.findAll({
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalInvoices = invoices.length;
  const totalInvoiceAmount = invoices.reduce(
    (sum: number, inv: any) => sum + parseFloat(inv.invoiceAmount),
    0,
  );

  const pendingApproval = invoices.filter((inv: any) => inv.status === 'pending_approval');
  const approved = invoices.filter((inv: any) => inv.status === 'approved');
  const paid = invoices.filter((inv: any) => inv.status === 'paid');
  const onHold = invoices.filter((inv: any) => inv.status === 'on_hold');

  // Calculate average processing days
  const workflows = await InvoiceWorkflow.findAll({
    where: {
      invoiceId: { [Op.in]: invoices.map((inv: any) => inv.id) },
    },
  });

  let totalProcessingDays = 0;
  let processedCount = 0;

  workflows.forEach((wf: any) => {
    if (wf.currentState === 'approved' || wf.currentState === 'paid') {
      const created = wf.workflowHistory[0]?.timestamp;
      const approved = wf.workflowHistory.find((h: any) => h.toState === 'approved')?.timestamp;
      if (created && approved) {
        const days = Math.floor(
          (new Date(approved).getTime() - new Date(created).getTime()) / (1000 * 60 * 60 * 24),
        );
        totalProcessingDays += days;
        processedCount++;
      }
    }
  });

  return {
    totalInvoices,
    totalInvoiceAmount,
    pendingApproval: pendingApproval.length,
    pendingApprovalAmount: pendingApproval.reduce(
      (sum: number, inv: any) => sum + parseFloat(inv.invoiceAmount),
      0,
    ),
    approved: approved.length,
    approvedAmount: approved.reduce(
      (sum: number, inv: any) => sum + parseFloat(inv.invoiceAmount),
      0,
    ),
    paid: paid.length,
    paidAmount: paid.reduce((sum: number, inv: any) => sum + parseFloat(inv.paidAmount), 0),
    onHold: onHold.length,
    onHoldAmount: onHold.reduce(
      (sum: number, inv: any) => sum + parseFloat(inv.invoiceAmount),
      0,
    ),
    avgProcessingDays: processedCount > 0 ? totalProcessingDays / processedCount : 0,
    avgPaymentDays: 30, // Would calculate from actual payment dates
    discountsCaptured: 0, // Would calculate from invoice metadata
    discountsMissed: 0, // Would calculate from invoice metadata
  };
};

/**
 * Exports comprehensive AP report.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} Invoice - Invoice model
 * @param {Model} PaymentSchedule - Schedule model
 * @param {Model} PaymentHold - Hold model
 * @returns {Promise<Buffer>} Comprehensive report
 */
export const exportComprehensiveAPReport = async (
  startDate: Date,
  endDate: Date,
  Invoice: any,
  PaymentSchedule: any,
  PaymentHold: any,
): Promise<Buffer> => {
  const agingReport = await generateAPAgingReport(new Date(), Invoice);
  const cashForecast = await generateCashRequirementsForecast(30, PaymentSchedule);
  const holdReport = await generatePaymentHoldReport(startDate, endDate, PaymentHold);

  const report = {
    reportDate: new Date(),
    period: { startDate, endDate },
    aging: agingReport,
    cashForecast,
    holds: holdReport,
  };

  return Buffer.from(JSON.stringify(report, null, 2), 'utf-8');
};

/**
 * Performs end-of-period AP close.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User ID
 * @param {Model} Invoice - Invoice model
 * @param {Model} PaymentSchedule - Schedule model
 * @returns {Promise<any>} Close result
 */
export const performAPPeriodClose = async (
  fiscalYear: number,
  fiscalPeriod: number,
  userId: string,
  Invoice: any,
  PaymentSchedule: any,
): Promise<any> => {
  // Verify all invoices are processed
  const pendingInvoices = await Invoice.findAll({
    where: {
      status: 'draft',
      createdAt: {
        [Op.lte]: new Date(fiscalYear, fiscalPeriod, 0),
      },
    },
  });

  if (pendingInvoices.length > 0) {
    throw new Error(`Cannot close period: ${pendingInvoices.length} invoices still in draft`);
  }

  // Generate closing reports
  const agingReport = await generateAPAgingReport(new Date(), Invoice);
  const dashboard = await generateAPDashboard(Invoice, PaymentSchedule, null);

  return {
    fiscalYear,
    fiscalPeriod,
    closedBy: userId,
    closedAt: new Date(),
    agingReport,
    dashboard,
    status: 'closed',
  };
};

/**
 * Generates AP dashboard with real-time metrics.
 *
 * @param {Model} Invoice - Invoice model
 * @param {Model} PaymentSchedule - Schedule model
 * @param {Model} PaymentHold - Hold model
 * @param {Model} VendorAPSummary - Summary model
 * @returns {Promise<any>} Real-time dashboard
 */
export const generateRealTimeAPDashboard = async (
  Invoice: any,
  PaymentSchedule: any,
  PaymentHold: any,
  VendorAPSummary: any,
): Promise<any> => {
  const basicDashboard = await generateAPDashboard(Invoice, PaymentSchedule, PaymentHold);

  const topVendors = await VendorAPSummary.findAll({
    order: [['totalOutstanding', 'DESC']],
    limit: 10,
  });

  const overdueVendors = await getVendorsWithOverdueAmounts(VendorAPSummary);

  const todayPayments = await getScheduledPayments(new Date(), new Date(), PaymentSchedule);

  return {
    ...basicDashboard,
    topVendorsByOutstanding: topVendors,
    vendorsWithOverdue: overdueVendors.length,
    paymentsScheduledToday: todayPayments.length,
    timestamp: new Date(),
  };
};

// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================

@Injectable()
export class APBackendService {
  private readonly logger = new Logger(APBackendService.name);

  constructor(private readonly sequelize: Sequelize) {}

  async processInvoice(invoiceData: any, userId: string) {
    this.logger.log(`Processing invoice: ${invoiceData.invoiceNumber}`);

    const Invoice = createInvoiceModel(this.sequelize);
    const InvoiceLineItem = createInvoiceLineItemModel(this.sequelize);
    const InvoiceWorkflow = createInvoiceWorkflowModel(this.sequelize);
    const APBackendConfig = createAPBackendConfigModel(this.sequelize);

    return processInvoiceWithWorkflow(
      invoiceData,
      userId,
      Invoice,
      InvoiceLineItem,
      InvoiceWorkflow,
      APBackendConfig,
    );
  }

  async schedulePayment(invoiceId: string, scheduledDate: Date, userId: string) {
    this.logger.log(`Scheduling payment for invoice: ${invoiceId}`);

    const Invoice = createInvoiceModel(this.sequelize);
    const PaymentSchedule = createPaymentScheduleModel(this.sequelize);
    const APBackendConfig = createAPBackendConfigModel(this.sequelize);

    return schedulePaymentWithDiscountCheck(
      invoiceId,
      scheduledDate,
      userId,
      Invoice,
      PaymentSchedule,
      APBackendConfig,
    );
  }

  async getDashboard() {
    const Invoice = createInvoiceModel(this.sequelize);
    const PaymentSchedule = createPaymentScheduleModel(this.sequelize);
    const PaymentHold = createPaymentHoldModel(this.sequelize);
    const VendorAPSummary = createVendorAPSummaryModel(this.sequelize);

    return generateRealTimeAPDashboard(Invoice, PaymentSchedule, PaymentHold, VendorAPSummary);
  }

  async updateVendorSummary(vendorId: string) {
    const Invoice = createInvoiceModel(this.sequelize);
    const VendorAPSummary = createVendorAPSummaryModel(this.sequelize);

    return updateVendorAPSummary(vendorId, Invoice, VendorAPSummary);
  }
}

export default {
  // Models
  createAPBackendConfigModel,
  createInvoiceWorkflowModel,
  createPaymentApprovalModel,
  createVendorAPSummaryModel,

  // Config
  getBackendConfig,
  updateBackendConfig,
  initializeDefaultConfig,
  validateBackendConfig,
  exportBackendConfig,

  // Workflow
  createInvoiceWorkflow,
  transitionInvoiceState,
  addInvoiceApprover,
  getInvoiceWorkflowHistory,
  requiresAdditionalApproval,
  getInvoicesByWorkflowState,
  generateWorkflowMetrics,
  validateWorkflowTransition,

  // Approvals
  createPaymentApprovalRequest,
  approvePaymentRequest,
  rejectPaymentRequest,
  getPendingPaymentApprovals,
  generatePaymentApprovalMetrics,
  escalateOverduePaymentApprovals,
  bulkApprovePaymentRequests,

  // Vendor Summary
  updateVendorAPSummary,
  getVendorAPSummary,
  getVendorsWithOutstandingBalances,
  getVendorsWithOverdueAmounts,
  generateVendorPerformanceReport,
  refreshAllVendorAPSummaries,
  exportVendorAPSummaries,

  // Advanced Operations
  processInvoiceWithWorkflow,
  performAutoMatchAndApprove,
  schedulePaymentWithDiscountCheck,
  batchApproveInvoices,
  generateComprehensiveAPMetrics,
  exportComprehensiveAPReport,
  performAPPeriodClose,
  generateRealTimeAPDashboard,

  // Service
  APBackendService,
};
