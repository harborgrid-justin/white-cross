/**
 * LOC: USACE-AS-JE-001
 * File: /reuse/frontend/composites/usace/downstream/journal-entry-management.ts
 *
 * UPSTREAM (imports from):
 *   - ../usace-accounting-systems-composites.ts
 *   - ../../../form-builder-kit
 *   - ../../../analytics-tracking-kit
 *   - ../../../workflow-approval-kit
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - Journal entry creation forms
 *   - Entry approval workflows
 *   - Batch entry processors
 *   - Recurring entry managers
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/journal-entry-management.ts
 * Locator: WC-USACE-AS-JE-001
 * Purpose: Journal Entry Management - Complete journal entry workflows and automation
 *
 * Upstream: usace-accounting-systems-composites, form-builder-kit, workflow-approval-kit
 * Downstream: Journal entry forms, approval workflows, batch processors
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x
 * Exports: 13+ React components and hooks for journal entry management
 *
 * LLM Context: Production-ready journal entry management system for USACE CEFMS. Provides
 * complete workflows for manual entry creation, batch processing, recurring entries, entry
 * templates, approval routing, posting automation, and audit compliance. Includes real-time
 * balance validation, double-entry verification, and integration with workflow approvals.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  useJournalEntry,
  useBatchJournalEntry,
  createJournalEntryForm,
  validateJournalEntryBalance,
  type JournalEntry,
  type JournalEntryLine,
  type AccountingBatch,
} from '../usace-accounting-systems-composites';
import {
  useFormState,
  type FormConfig,
} from '../../../form-builder-kit';
import {
  useTracking,
  trackEvent,
  trackError,
} from '../../../analytics-tracking-kit';
import {
  useWorkflowState,
  useApprovalFlow,
  type WorkflowStatus,
} from '../../../workflow-approval-kit';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface JournalEntryTemplate {
  id: string;
  name: string;
  description: string;
  entryType: string;
  lineItemTemplates: LineItemTemplate[];
  fiscalPeriodBased: boolean;
  accountDimensionDefaults: Record<string, string>;
  createdBy: string;
  createdDate: Date;
}

export interface LineItemTemplate {
  accountId: string;
  accountNumber: string;
  description: string;
  side: 'debit' | 'credit';
  amountType: 'fixed' | 'variable' | 'calculated';
  fixedAmount?: number;
  calculationFormula?: string;
}

export interface RecurringEntry {
  id: string;
  name: string;
  template: JournalEntryTemplate;
  frequency: 'monthly' | 'quarterly' | 'annually';
  startDate: Date;
  endDate?: Date;
  nextRunDate: Date;
  isActive: boolean;
  autoPost: boolean;
  lastRun?: Date;
}

export interface EntryValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  balanceCheck: {
    totalDebits: number;
    totalCredits: number;
    difference: number;
    isBalanced: boolean;
  };
}

export interface ValidationError {
  severity: 'error';
  field: string;
  message: string;
  lineNumber?: number;
}

export interface ValidationWarning {
  severity: 'warning';
  field: string;
  message: string;
  lineNumber?: number;
}

// ============================================================================
// JOURNAL ENTRY TEMPLATES
// ============================================================================

/**
 * Hook for journal entry template management
 *
 * @description Manage reusable journal entry templates
 *
 * @returns {object} Template management operations
 *
 * @example
 * ```tsx
 * function JournalEntryTemplateManager() {
 *   const {
 *     templates,
 *     createTemplate,
 *     applyTemplate,
 *     updateTemplate,
 *     deleteTemplate
 *   } = useJournalEntryTemplates();
 *
 *   return (
 *     <div>
 *       <TemplateList templates={templates} onApply={applyTemplate} />
 *       <button onClick={() => createTemplate(newTemplateData)}>
 *         Create Template
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useJournalEntryTemplates() {
  const [templates, setTemplates] = useState<JournalEntryTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<JournalEntryTemplate | null>(null);
  const { track } = useTracking();
  const { createEntry, addLine } = useJournalEntry();

  const createTemplate = useCallback((templateData: Partial<JournalEntryTemplate>) => {
    track('journal_entry_template_create', { template_name: templateData.name });

    const newTemplate: JournalEntryTemplate = {
      id: `template_${Date.now()}`,
      name: templateData.name || 'Untitled Template',
      description: templateData.description || '',
      entryType: templateData.entryType || 'standard',
      lineItemTemplates: templateData.lineItemTemplates || [],
      fiscalPeriodBased: templateData.fiscalPeriodBased || false,
      accountDimensionDefaults: templateData.accountDimensionDefaults || {},
      createdBy: 'current_user',
      createdDate: new Date(),
    };

    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, [track]);

  const updateTemplate = useCallback((templateId: string, updates: Partial<JournalEntryTemplate>) => {
    track('journal_entry_template_update', { template_id: templateId });

    setTemplates(prev =>
      prev.map(t => (t.id === templateId ? { ...t, ...updates } : t))
    );
  }, [track]);

  const deleteTemplate = useCallback((templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      track('journal_entry_template_delete', { template_id: templateId });
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  }, [track]);

  const applyTemplate = useCallback((templateId: string, variableAmounts?: Record<string, number>) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;

    track('journal_entry_template_apply', { template_id: templateId });

    const entry = createEntry({
      entryType: template.entryType as any,
      description: template.description,
      fiscalYear: new Date().getFullYear(),
      fiscalPeriod: Math.floor((new Date().getMonth() + 1) / 3) + 1,
      preparedBy: 'current_user',
    });

    template.lineItemTemplates.forEach((lineTemplate, index) => {
      let amount = 0;
      if (lineTemplate.amountType === 'fixed') {
        amount = lineTemplate.fixedAmount || 0;
      } else if (lineTemplate.amountType === 'variable' && variableAmounts) {
        amount = variableAmounts[`line_${index}`] || 0;
      }

      addLine(entry.id, {
        accountId: lineTemplate.accountId,
        accountNumber: lineTemplate.accountNumber,
        description: lineTemplate.description,
        debitAmount: lineTemplate.side === 'debit' ? amount : 0,
        creditAmount: lineTemplate.side === 'credit' ? amount : 0,
      });
    });

    return entry;
  }, [templates, createEntry, addLine, track]);

  const duplicateTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return null;

    track('journal_entry_template_duplicate', { template_id: templateId });

    return createTemplate({
      ...template,
      name: `${template.name} (Copy)`,
    });
  }, [templates, createTemplate, track]);

  return {
    templates,
    selectedTemplate,
    setSelectedTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate,
    duplicateTemplate,
  };
}

// ============================================================================
// RECURRING JOURNAL ENTRIES
// ============================================================================

/**
 * Hook for recurring journal entry management
 *
 * @description Automate recurring journal entries
 *
 * @returns {object} Recurring entry operations
 *
 * @example
 * ```tsx
 * function RecurringEntryManager() {
 *   const {
 *     recurringEntries,
 *     createRecurring,
 *     runRecurring,
 *     deactivateRecurring,
 *     upcomingRuns
 *   } = useRecurringJournalEntries();
 *
 *   return (
 *     <div>
 *       <RecurringEntriesList entries={recurringEntries} />
 *       <UpcomingRunsCalendar runs={upcomingRuns} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useRecurringJournalEntries() {
  const [recurringEntries, setRecurringEntries] = useState<RecurringEntry[]>([]);
  const { track } = useTracking();
  const { applyTemplate } = useJournalEntryTemplates();

  const createRecurring = useCallback((recurringData: Partial<RecurringEntry>) => {
    track('recurring_entry_create', { name: recurringData.name });

    const newRecurring: RecurringEntry = {
      id: `recurring_${Date.now()}`,
      name: recurringData.name || 'Untitled Recurring Entry',
      template: recurringData.template!,
      frequency: recurringData.frequency || 'monthly',
      startDate: recurringData.startDate || new Date(),
      endDate: recurringData.endDate,
      nextRunDate: recurringData.startDate || new Date(),
      isActive: true,
      autoPost: recurringData.autoPost || false,
    };

    setRecurringEntries(prev => [...prev, newRecurring]);
    return newRecurring;
  }, [track]);

  const runRecurring = useCallback((recurringId: string) => {
    const recurring = recurringEntries.find(r => r.id === recurringId);
    if (!recurring) return null;

    track('recurring_entry_run', { recurring_id: recurringId });

    const entry = applyTemplate(recurring.template.id);

    // Calculate next run date
    const nextRun = new Date(recurring.nextRunDate);
    if (recurring.frequency === 'monthly') {
      nextRun.setMonth(nextRun.getMonth() + 1);
    } else if (recurring.frequency === 'quarterly') {
      nextRun.setMonth(nextRun.getMonth() + 3);
    } else if (recurring.frequency === 'annually') {
      nextRun.setFullYear(nextRun.getFullYear() + 1);
    }

    setRecurringEntries(prev =>
      prev.map(r =>
        r.id === recurringId
          ? { ...r, lastRun: new Date(), nextRunDate: nextRun }
          : r
      )
    );

    return entry;
  }, [recurringEntries, applyTemplate, track]);

  const deactivateRecurring = useCallback((recurringId: string) => {
    track('recurring_entry_deactivate', { recurring_id: recurringId });

    setRecurringEntries(prev =>
      prev.map(r => (r.id === recurringId ? { ...r, isActive: false } : r))
    );
  }, [track]);

  const activateRecurring = useCallback((recurringId: string) => {
    track('recurring_entry_activate', { recurring_id: recurringId });

    setRecurringEntries(prev =>
      prev.map(r => (r.id === recurringId ? { ...r, isActive: true } : r))
    );
  }, [track]);

  const upcomingRuns = useMemo(() => {
    const upcoming = recurringEntries
      .filter(r => r.isActive && r.nextRunDate)
      .map(r => ({
        recurringId: r.id,
        name: r.name,
        runDate: r.nextRunDate,
        frequency: r.frequency,
        autoPost: r.autoPost,
      }))
      .sort((a, b) => a.runDate.getTime() - b.runDate.getTime());

    return upcoming.slice(0, 10); // Next 10 runs
  }, [recurringEntries]);

  const overdueRuns = useMemo(() => {
    const now = new Date();
    return recurringEntries.filter(r => r.isActive && r.nextRunDate < now);
  }, [recurringEntries]);

  return {
    recurringEntries,
    createRecurring,
    runRecurring,
    deactivateRecurring,
    activateRecurring,
    upcomingRuns,
    overdueRuns,
  };
}

// ============================================================================
// ADVANCED ENTRY VALIDATION
// ============================================================================

/**
 * Hook for advanced entry validation
 *
 * @description Comprehensive validation beyond basic balance checking
 *
 * @returns {object} Validation operations
 *
 * @example
 * ```tsx
 * function EntryValidationPanel({ entry }) {
 *   const {
 *     validateEntry,
 *     validationResult,
 *     hasErrors,
 *     hasWarnings,
 *     canPost
 *   } = useAdvancedEntryValidation();
 *
 *   useEffect(() => {
 *     if (entry) validateEntry(entry);
 *   }, [entry]);
 *
 *   return (
 *     <div>
 *       {hasErrors && <ErrorPanel errors={validationResult.errors} />}
 *       {hasWarnings && <WarningPanel warnings={validationResult.warnings} />}
 *       <button disabled={!canPost}>Post Entry</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAdvancedEntryValidation() {
  const [validationResult, setValidationResult] = useState<EntryValidationResult | null>(null);
  const { track } = useTracking();

  const validateEntry = useCallback((entry: JournalEntry) => {
    track('journal_entry_validate_advanced', { entry_id: entry.id });

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic validation
    if (!entry.description || entry.description.trim() === '') {
      errors.push({
        severity: 'error',
        field: 'description',
        message: 'Entry description is required',
      });
    }

    if (entry.lineItems.length < 2) {
      errors.push({
        severity: 'error',
        field: 'lineItems',
        message: 'Entry must have at least 2 line items',
      });
    }

    // Balance validation
    const totalDebits = entry.lineItems.reduce((sum, line) => sum + line.debitAmount, 0);
    const totalCredits = entry.lineItems.reduce((sum, line) => sum + line.creditAmount, 0);
    const difference = Math.abs(totalDebits - totalCredits);
    const isBalanced = difference < 0.01;

    if (!isBalanced) {
      errors.push({
        severity: 'error',
        field: 'balance',
        message: `Entry is out of balance by ${difference.toFixed(2)}`,
      });
    }

    // Line item validation
    entry.lineItems.forEach((line, index) => {
      if (!line.accountId) {
        errors.push({
          severity: 'error',
          field: `lineItems[${index}].accountId`,
          message: 'Account is required',
          lineNumber: index + 1,
        });
      }

      if (!line.description || line.description.trim() === '') {
        errors.push({
          severity: 'error',
          field: `lineItems[${index}].description`,
          message: 'Line description is required',
          lineNumber: index + 1,
        });
      }

      if (line.debitAmount === 0 && line.creditAmount === 0) {
        errors.push({
          severity: 'error',
          field: `lineItems[${index}].amount`,
          message: 'Line must have either debit or credit amount',
          lineNumber: index + 1,
        });
      }

      if (line.debitAmount > 0 && line.creditAmount > 0) {
        errors.push({
          severity: 'error',
          field: `lineItems[${index}].amount`,
          message: 'Line cannot have both debit and credit',
          lineNumber: index + 1,
        });
      }

      // Warnings
      if (line.debitAmount > 1000000 || line.creditAmount > 1000000) {
        warnings.push({
          severity: 'warning',
          field: `lineItems[${index}].amount`,
          message: 'Large transaction amount - please verify',
          lineNumber: index + 1,
        });
      }

      if (line.description.length < 10) {
        warnings.push({
          severity: 'warning',
          field: `lineItems[${index}].description`,
          message: 'Description may be too brief',
          lineNumber: index + 1,
        });
      }
    });

    // Date validation
    if (entry.entryDate > new Date()) {
      errors.push({
        severity: 'error',
        field: 'entryDate',
        message: 'Entry date cannot be in the future',
      });
    }

    if (entry.postingDate < entry.entryDate) {
      errors.push({
        severity: 'error',
        field: 'postingDate',
        message: 'Posting date cannot be before entry date',
      });
    }

    const result: EntryValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      balanceCheck: {
        totalDebits,
        totalCredits,
        difference,
        isBalanced,
      },
    };

    setValidationResult(result);
    return result;
  }, [track]);

  const hasErrors = useMemo(() => {
    return validationResult ? validationResult.errors.length > 0 : false;
  }, [validationResult]);

  const hasWarnings = useMemo(() => {
    return validationResult ? validationResult.warnings.length > 0 : false;
  }, [validationResult]);

  const canPost = useMemo(() => {
    return validationResult ? validationResult.isValid && validationResult.balanceCheck.isBalanced : false;
  }, [validationResult]);

  return {
    validateEntry,
    validationResult,
    hasErrors,
    hasWarnings,
    canPost,
  };
}

// ============================================================================
// BATCH ENTRY WORKFLOW
// ============================================================================

/**
 * Hook for batch entry workflow management
 *
 * @description Complete workflow for batch entry creation and posting
 *
 * @returns {object} Batch workflow operations
 *
 * @example
 * ```tsx
 * function BatchEntryWorkflow() {
 *   const {
 *     workflowStep,
 *     batchData,
 *     moveToNextStep,
 *     moveToPreviousStep,
 *     addEntryToBatch,
 *     validateBatch,
 *     postBatch,
 *     batchSummary
 *   } = useBatchEntryWorkflow();
 *
 *   return (
 *     <div>
 *       <WorkflowSteps current={workflowStep} />
 *       {workflowStep === 'create' && <BatchCreation />}
 *       {workflowStep === 'entries' && <EntriesManagement />}
 *       {workflowStep === 'validate' && <ValidationStep />}
 *       {workflowStep === 'post' && <PostingConfirmation />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBatchEntryWorkflow() {
  const {
    batches,
    isProcessing,
    createBatch,
    addEntryToBatch,
    validateBatch,
    postBatch,
  } = useBatchJournalEntry();

  const [workflowStep, setWorkflowStep] = useState<'create' | 'entries' | 'validate' | 'post' | 'complete'>('create');
  const [currentBatch, setCurrentBatch] = useState<AccountingBatch | null>(null);
  const [batchValidation, setBatchValidation] = useState<any>(null);
  const { track } = useTracking();

  const startBatchWorkflow = useCallback((batchType: string, fiscalYear: number, fiscalPeriod: number) => {
    track('batch_workflow_start', { batch_type: batchType });

    const batch = createBatch({
      batchType: batchType as any,
      fiscalYear,
      fiscalPeriod,
      description: `Batch ${batchType} - ${new Date().toLocaleDateString()}`,
      createdBy: 'current_user',
    });

    setCurrentBatch(batch);
    setWorkflowStep('entries');
  }, [createBatch, track]);

  const moveToNextStep = useCallback(() => {
    const steps: typeof workflowStep[] = ['create', 'entries', 'validate', 'post', 'complete'];
    const currentIndex = steps.indexOf(workflowStep);

    if (currentIndex < steps.length - 1) {
      track('batch_workflow_next', { from: workflowStep, to: steps[currentIndex + 1] });
      setWorkflowStep(steps[currentIndex + 1]);
    }
  }, [workflowStep, track]);

  const moveToPreviousStep = useCallback(() => {
    const steps: typeof workflowStep[] = ['create', 'entries', 'validate', 'post', 'complete'];
    const currentIndex = steps.indexOf(workflowStep);

    if (currentIndex > 0) {
      track('batch_workflow_previous', { from: workflowStep, to: steps[currentIndex - 1] });
      setWorkflowStep(steps[currentIndex - 1]);
    }
  }, [workflowStep, track]);

  const addEntry = useCallback((entry: JournalEntry) => {
    if (!currentBatch) return;

    track('batch_workflow_add_entry', { batch_id: currentBatch.id });
    addEntryToBatch(currentBatch.id, entry);
  }, [currentBatch, addEntryToBatch, track]);

  const validateBatchStep = useCallback(() => {
    if (!currentBatch) return false;

    track('batch_workflow_validate', { batch_id: currentBatch.id });
    const validation = validateBatch(currentBatch.id);
    setBatchValidation(validation);

    if (validation.isValid) {
      moveToNextStep();
    }

    return validation.isValid;
  }, [currentBatch, validateBatch, moveToNextStep, track]);

  const postBatchStep = useCallback(async () => {
    if (!currentBatch) return;

    track('batch_workflow_post', { batch_id: currentBatch.id });
    await postBatch(currentBatch.id);
    setWorkflowStep('complete');
  }, [currentBatch, postBatch, track]);

  const batchSummary = useMemo(() => {
    if (!currentBatch) return null;

    return {
      batchNumber: currentBatch.batchNumber,
      entryCount: currentBatch.totalEntries,
      totalDebits: currentBatch.totalDebits,
      totalCredits: currentBatch.totalCredits,
      isBalanced: currentBatch.isBalanced,
      status: currentBatch.status,
    };
  }, [currentBatch]);

  return {
    workflowStep,
    currentBatch,
    batchData: currentBatch,
    startBatchWorkflow,
    moveToNextStep,
    moveToPreviousStep,
    addEntry,
    validateBatchStep,
    postBatchStep,
    batchSummary,
    batchValidation,
    isProcessing,
  };
}

// ============================================================================
// ENTRY APPROVAL WORKFLOW INTEGRATION
// ============================================================================

/**
 * Hook for journal entry approval workflow
 *
 * @description Integrate journal entries with approval workflows
 *
 * @returns {object} Approval workflow operations
 *
 * @example
 * ```tsx
 * function EntryApprovalPanel({ entryId }) {
 *   const {
 *     approvalStatus,
 *     submitForApproval,
 *     approveEntry,
 *     rejectEntry,
 *     approvalHistory,
 *     canApprove
 *   } = useEntryApprovalWorkflow(entryId);
 *
 *   return (
 *     <div>
 *       <ApprovalStatus status={approvalStatus} />
 *       {canApprove && (
 *         <ApprovalActions onApprove={approveEntry} onReject={rejectEntry} />
 *       )}
 *       <ApprovalHistory history={approvalHistory} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useEntryApprovalWorkflow(entryId?: string) {
  const { submitForApproval, approveEntry, entries } = useJournalEntry();
  const { startWorkflow, updateWorkflow } = useApprovalFlow();

  const [approvalStatus, setApprovalStatus] = useState<WorkflowStatus>('draft');
  const [approvalHistory, setApprovalHistory] = useState<any[]>([]);
  const [canApprove, setCanApprove] = useState(false);
  const { track } = useTracking();

  const entry = useMemo(() => {
    return entries.find(e => e.id === entryId);
  }, [entries, entryId]);

  useEffect(() => {
    if (entry) {
      setApprovalStatus(entry.status === 'pending_approval' ? 'pending' :
                        entry.status === 'approved' ? 'approved' :
                        entry.status === 'rejected' ? 'rejected' : 'draft');
    }
  }, [entry]);

  const submitEntry = useCallback(async () => {
    if (!entryId) return;

    track('entry_approval_submit', { entry_id: entryId });
    await submitForApproval(entryId);
    setApprovalStatus('pending');
  }, [entryId, submitForApproval, track]);

  const approve = useCallback(async (approver: string, comments?: string) => {
    if (!entryId) return;

    track('entry_approval_approve', { entry_id: entryId });
    approveEntry(entryId, approver);

    setApprovalHistory(prev => [...prev, {
      action: 'approved',
      approver,
      date: new Date(),
      comments,
    }]);

    setApprovalStatus('approved');
  }, [entryId, approveEntry, track]);

  const reject = useCallback((rejector: string, reason: string) => {
    if (!entryId) return;

    track('entry_approval_reject', { entry_id: entryId });

    setApprovalHistory(prev => [...prev, {
      action: 'rejected',
      rejector,
      date: new Date(),
      reason,
    }]);

    setApprovalStatus('rejected');
  }, [entryId, track]);

  return {
    entry,
    approvalStatus,
    submitEntry,
    approve,
    reject,
    approvalHistory,
    canApprove,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  useJournalEntryTemplates,
  useRecurringJournalEntries,
  useAdvancedEntryValidation,
  useBatchEntryWorkflow,
  useEntryApprovalWorkflow,
};
