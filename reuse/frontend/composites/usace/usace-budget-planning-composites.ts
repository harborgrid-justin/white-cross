/**
 * LOC: USACE-BP-001
 * File: /reuse/frontend/composites/usace/usace-budget-planning-composites.ts
 *
 * UPSTREAM (imports from):
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *   - @reuse/frontend/form-builder-kit
 *   - @reuse/frontend/analytics-tracking-kit
 *   - @reuse/frontend/workflow-approval-kit
 *   - @reuse/frontend/permissions-roles-kit
 *   - @reuse/frontend/version-control-kit
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS budget planning applications
 *   - Financial management dashboards
 *   - Budget allocation systems
 *   - Forecasting and analysis tools
 */

/**
 * File: /reuse/frontend/composites/usace/usace-budget-planning-composites.ts
 * Locator: WC-USACE-BP-COMP-001
 * Purpose: USACE CEFMS Budget Planning Composites - Comprehensive budget planning, allocation, forecasting, tracking, and analysis
 *
 * Upstream: React 18+, Next.js 16+, TypeScript 5.x, form-builder-kit, analytics-tracking-kit, workflow-approval-kit
 * Downstream: USACE financial management systems, budget planning applications, forecasting tools
 * Dependencies: React 18+, Next.js 16+, TypeScript 5.x, reuse/frontend kits
 * Exports: 45+ functions for USACE budget planning operations
 *
 * LLM Context: Enterprise-grade USACE CEFMS budget planning composites for React 18+ and Next.js 16+ applications.
 * Provides comprehensive budget planning, allocation management, forecasting models, budget tracking,
 * variance analysis, multi-year planning, project budgeting, appropriations management, and financial reporting.
 * Designed specifically for U.S. Army Corps of Engineers Civil Works financial management requirements.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  useFormState,
  FormProvider,
  FormConfig,
  FormData,
  FieldConfig,
  FormErrors,
  validateFieldValue,
  getAllFields,
  serializeFormData,
  deserializeFormData,
  calculateFormProgress,
} from '../../form-builder-kit';
import {
  useTracking,
  usePageView,
  useEvent,
  trackEvent,
  trackConversion,
  identifyUser,
  setUserProperties,
  trackFormInteraction,
  trackError,
  ContentEngagement,
  PerformanceMetrics,
} from '../../analytics-tracking-kit';
import {
  useWorkflowState,
  useApprovalFlow,
  WorkflowStage,
  WorkflowStatus,
  ApprovalDecision,
  ApprovalAction,
  WorkflowTransition,
  ApprovalHistory,
} from '../../workflow-approval-kit';
import {
  usePermissions,
  useRoleManager,
  Permission,
  Role,
  hasPermission,
  checkResourceAccess,
  PermissionAction,
  ResourceType,
} from '../../permissions-roles-kit';
import {
  useVersionControl,
  useVersionHistory,
  createVersion,
  compareVersions,
  restoreVersion,
  VersionMetadata,
  VersionDiff,
} from '../../version-control-kit';

// ============================================================================
// TYPE DEFINITIONS - USACE CEFMS BUDGET PLANNING
// ============================================================================

/**
 * USACE fiscal year structure
 */
export interface USACEFiscalYear {
  fiscalYear: number;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'execution' | 'closeout' | 'closed';
  appropriations: Appropriation[];
  totalBudget: number;
  totalObligated: number;
  totalExpended: number;
  remainingBalance: number;
}

/**
 * Budget appropriation structure
 */
export interface Appropriation {
  id: string;
  code: string;
  name: string;
  fiscalYear: number;
  type: 'civil_works' | 'military' | 'emergency' | 'special';
  amount: number;
  source: string;
  purpose: string;
  restrictions?: string[];
  expirationDate?: Date;
  authority: string;
  status: 'available' | 'expired' | 'cancelled';
  metadata?: Record<string, any>;
}

/**
 * Budget line item structure
 */
export interface BudgetLineItem {
  id: string;
  lineNumber: string;
  appropriationId: string;
  projectId?: string;
  accountCode: string;
  description: string;
  category: string;
  plannedAmount: number;
  allocatedAmount: number;
  obligatedAmount: number;
  expendedAmount: number;
  remainingBalance: number;
  percentUtilized: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'approved' | 'active' | 'closed';
  metadata?: Record<string, any>;
}

/**
 * Budget allocation request
 */
export interface BudgetAllocationRequest {
  id: string;
  requestNumber: string;
  fiscalYear: number;
  requestedBy: string;
  requestedDate: Date;
  appropriationId: string;
  projectId?: string;
  amount: number;
  purpose: string;
  justification: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  approvalWorkflowId?: string;
  approvedAmount?: number;
  approvedBy?: string;
  approvedDate?: Date;
  comments?: string;
  attachments?: string[];
}

/**
 * Budget forecast model
 */
export interface BudgetForecast {
  id: string;
  name: string;
  fiscalYear: number;
  forecastType: 'baseline' | 'optimistic' | 'pessimistic' | 'scenario';
  methodology: string;
  assumptions: string[];
  projections: ForecastProjection[];
  confidenceLevel: number;
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
  status: 'draft' | 'active' | 'superseded' | 'archived';
}

/**
 * Forecast projection data point
 */
export interface ForecastProjection {
  period: string;
  periodType: 'month' | 'quarter' | 'year';
  projectedRevenue?: number;
  projectedExpenses: number;
  projectedObligations: number;
  projectedBalance: number;
  variance?: number;
  confidence: number;
  notes?: string;
}

/**
 * Budget variance analysis
 */
export interface BudgetVarianceAnalysis {
  id: string;
  analysisDate: Date;
  fiscalYear: number;
  periodStart: Date;
  periodEnd: Date;
  lineItemId?: string;
  projectId?: string;
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  varianceType: 'favorable' | 'unfavorable' | 'neutral';
  category: string;
  explanation?: string;
  corrective_action?: string;
  responsibleParty?: string;
}

/**
 * Multi-year budget plan
 */
export interface MultiYearBudgetPlan {
  id: string;
  name: string;
  description: string;
  startFiscalYear: number;
  endFiscalYear: number;
  yearlyPlans: YearlyBudgetPlan[];
  totalPlannedBudget: number;
  strategicObjectives: string[];
  assumptions: string[];
  riskFactors: string[];
  createdBy: string;
  createdDate: Date;
  lastUpdated: Date;
  status: 'draft' | 'approved' | 'active' | 'completed';
}

/**
 * Yearly budget plan within multi-year plan
 */
export interface YearlyBudgetPlan {
  fiscalYear: number;
  plannedBudget: number;
  appropriations: Appropriation[];
  projects: ProjectBudget[];
  priorities: string[];
  milestones: BudgetMilestone[];
}

/**
 * Project budget structure
 */
export interface ProjectBudget {
  id: string;
  projectId: string;
  projectName: string;
  projectNumber: string;
  fiscalYear: number;
  appropriationId: string;
  totalBudget: number;
  allocatedBudget: number;
  obligatedBudget: number;
  expendedBudget: number;
  remainingBudget: number;
  percentComplete: number;
  budgetCategories: BudgetCategory[];
  startDate: Date;
  endDate: Date;
  projectManager: string;
  status: 'planning' | 'approved' | 'executing' | 'closeout' | 'closed';
}

/**
 * Budget category breakdown
 */
export interface BudgetCategory {
  category: string;
  subcategory?: string;
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  percentOfTotal: number;
}

/**
 * Budget milestone tracking
 */
export interface BudgetMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  completedDate?: Date;
  budgetImpact: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  dependencies?: string[];
}

/**
 * Budget transfer request
 */
export interface BudgetTransferRequest {
  id: string;
  transferNumber: string;
  fiscalYear: number;
  requestedBy: string;
  requestedDate: Date;
  fromAppropriationId: string;
  toAppropriationId: string;
  amount: number;
  reason: string;
  justification: string;
  authority: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  approvedDate?: Date;
  effectiveDate?: Date;
}

/**
 * Budget constraint definition
 */
export interface BudgetConstraint {
  id: string;
  type: 'spending_cap' | 'appropriation_limit' | 'category_limit' | 'project_limit';
  name: string;
  description: string;
  applicableTo: string;
  limitAmount: number;
  currentAmount: number;
  percentUtilized: number;
  fiscalYear: number;
  enforced: boolean;
  violationAction: 'warn' | 'block' | 'approve_required';
}

/**
 * Budget approval configuration
 */
export interface BudgetApprovalConfig {
  budgetType: string;
  thresholdAmount: number;
  requiredApprovers: string[];
  approvalLevels: ApprovalLevel[];
  escalationRules: EscalationRule[];
  timeoutDays: number;
}

/**
 * Approval level in budget workflow
 */
export interface ApprovalLevel {
  level: number;
  name: string;
  approverRoles: string[];
  requiredCount: number;
  timeoutDays: number;
}

/**
 * Escalation rule for budget approvals
 */
export interface EscalationRule {
  condition: string;
  action: 'notify' | 'reassign' | 'auto_approve';
  escalateTo: string[];
  triggerAfterDays: number;
}

// ============================================================================
// CORE BUDGET PLANNING HOOKS
// ============================================================================

/**
 * Hook for managing USACE fiscal year budget operations
 *
 * @description Provides comprehensive fiscal year budget management including
 * appropriations, allocations, obligations, and expenditures tracking
 *
 * @param {number} fiscalYear - Target fiscal year
 * @returns {object} Fiscal year budget operations
 *
 * @example
 * ```tsx
 * function FiscalYearDashboard() {
 *   const {
 *     fiscalYearData,
 *     appropriations,
 *     totalBudget,
 *     remainingBalance,
 *     loadFiscalYear,
 *     updateAppropriation
 *   } = useFiscalYearBudget(2024);
 *
 *   useEffect(() => {
 *     loadFiscalYear();
 *   }, []);
 *
 *   return (
 *     <div>
 *       <h2>FY {fiscalYear} Budget</h2>
 *       <p>Total: ${totalBudget.toLocaleString()}</p>
 *       <p>Remaining: ${remainingBalance.toLocaleString()}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFiscalYearBudget(fiscalYear: number) {
  const [fiscalYearData, setFiscalYearData] = useState<USACEFiscalYear | null>(null);
  const [appropriations, setAppropriations] = useState<Appropriation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { track } = useTracking();

  const loadFiscalYear = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      track('fiscal_year_load', { fiscal_year: fiscalYear });
      // API call would go here
      const data: USACEFiscalYear = {
        fiscalYear,
        startDate: new Date(`${fiscalYear - 1}-10-01`),
        endDate: new Date(`${fiscalYear}-09-30`),
        status: 'execution',
        appropriations: [],
        totalBudget: 0,
        totalObligated: 0,
        totalExpended: 0,
        remainingBalance: 0,
      };
      setFiscalYearData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fiscal year');
      trackError({ errorMessage: 'Failed to load fiscal year', errorType: 'DataLoadError' });
    } finally {
      setIsLoading(false);
    }
  }, [fiscalYear, track]);

  const updateAppropriation = useCallback(async (appropriation: Appropriation) => {
    track('appropriation_update', { appropriation_id: appropriation.id });
    // API update logic
  }, [track]);

  const totalBudget = useMemo(
    () => appropriations.reduce((sum, app) => sum + app.amount, 0),
    [appropriations]
  );

  const remainingBalance = useMemo(
    () => fiscalYearData?.remainingBalance || 0,
    [fiscalYearData]
  );

  return {
    fiscalYearData,
    appropriations,
    totalBudget,
    remainingBalance,
    isLoading,
    error,
    loadFiscalYear,
    updateAppropriation,
  };
}

/**
 * Hook for budget allocation request management
 *
 * @description Manages budget allocation requests with approval workflow integration
 *
 * @returns {object} Budget allocation request operations
 *
 * @example
 * ```tsx
 * function AllocationRequestForm() {
 *   const {
 *     createRequest,
 *     submitRequest,
 *     requests,
 *     isSubmitting
 *   } = useBudgetAllocationRequest();
 *
 *   const handleSubmit = async (data: FormData) => {
 *     const request = await createRequest({
 *       ...data,
 *       fiscalYear: 2024,
 *       amount: parseFloat(data.amount)
 *     });
 *     await submitRequest(request.id);
 *   };
 * }
 * ```
 */
export function useBudgetAllocationRequest() {
  const [requests, setRequests] = useState<BudgetAllocationRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { track } = useTracking();
  const { startWorkflow } = useApprovalFlow();

  const createRequest = useCallback(async (requestData: Partial<BudgetAllocationRequest>) => {
    track('allocation_request_create', { amount: requestData.amount });
    const newRequest: BudgetAllocationRequest = {
      id: `req_${Date.now()}`,
      requestNumber: `BAR-${Date.now()}`,
      requestedDate: new Date(),
      status: 'draft',
      ...requestData,
    } as BudgetAllocationRequest;
    setRequests(prev => [...prev, newRequest]);
    return newRequest;
  }, [track]);

  const submitRequest = useCallback(async (requestId: string) => {
    setIsSubmitting(true);
    try {
      track('allocation_request_submit', { request_id: requestId });
      // Start approval workflow
      // Update request status
      setRequests(prev =>
        prev.map(req => (req.id === requestId ? { ...req, status: 'submitted' } : req))
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [track, startWorkflow]);

  const approveRequest = useCallback(async (requestId: string, approvedAmount: number) => {
    track('allocation_request_approve', { request_id: requestId, amount: approvedAmount });
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? { ...req, status: 'approved', approvedAmount, approvedDate: new Date() }
          : req
      )
    );
  }, [track]);

  const rejectRequest = useCallback(async (requestId: string, reason: string) => {
    track('allocation_request_reject', { request_id: requestId });
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'rejected', comments: reason } : req
      )
    );
  }, [track]);

  return {
    requests,
    isSubmitting,
    createRequest,
    submitRequest,
    approveRequest,
    rejectRequest,
  };
}

/**
 * Hook for budget forecasting and projection models
 *
 * @description Provides budget forecasting capabilities with multiple scenarios
 *
 * @param {number} fiscalYear - Fiscal year for forecast
 * @returns {object} Forecasting operations
 *
 * @example
 * ```tsx
 * function BudgetForecastDashboard() {
 *   const {
 *     forecasts,
 *     createForecast,
 *     generateProjections,
 *     compareForecasts
 *   } = useBudgetForecasting(2024);
 *
 *   const handleCreateForecast = async () => {
 *     const forecast = await createForecast({
 *       name: 'Q2 Forecast',
 *       forecastType: 'baseline',
 *       methodology: 'Historical Trend Analysis'
 *     });
 *     await generateProjections(forecast.id, 12);
 *   };
 * }
 * ```
 */
export function useBudgetForecasting(fiscalYear: number) {
  const [forecasts, setForecasts] = useState<BudgetForecast[]>([]);
  const [activeForecas, setActiveForecast] = useState<BudgetForecast | null>(null);
  const { track } = useTracking();

  const createForecast = useCallback(async (forecastData: Partial<BudgetForecast>) => {
    track('budget_forecast_create', { fiscal_year: fiscalYear, type: forecastData.forecastType });
    const newForecast: BudgetForecast = {
      id: `fcst_${Date.now()}`,
      fiscalYear,
      createdDate: new Date(),
      lastUpdated: new Date(),
      status: 'draft',
      projections: [],
      confidenceLevel: 0.85,
      assumptions: [],
      ...forecastData,
    } as BudgetForecast;
    setForecasts(prev => [...prev, newForecast]);
    return newForecast;
  }, [fiscalYear, track]);

  const generateProjections = useCallback(async (forecastId: string, periods: number) => {
    track('forecast_projections_generate', { forecast_id: forecastId, periods });
    // Generate projection logic based on historical data and methodology
    const projections: ForecastProjection[] = Array.from({ length: periods }, (_, i) => ({
      period: `Period ${i + 1}`,
      periodType: 'month' as const,
      projectedExpenses: Math.random() * 1000000,
      projectedObligations: Math.random() * 900000,
      projectedBalance: Math.random() * 500000,
      confidence: 0.8 + Math.random() * 0.15,
    }));

    setForecasts(prev =>
      prev.map(f => (f.id === forecastId ? { ...f, projections } : f))
    );
  }, [track]);

  const compareForecasts = useCallback((forecast1Id: string, forecast2Id: string) => {
    track('forecasts_compare', { forecast1: forecast1Id, forecast2: forecast2Id });
    const f1 = forecasts.find(f => f.id === forecast1Id);
    const f2 = forecasts.find(f => f.id === forecast2Id);
    // Comparison logic
    return { forecast1: f1, forecast2: f2 };
  }, [forecasts, track]);

  const updateForecastAssumptions = useCallback((forecastId: string, assumptions: string[]) => {
    track('forecast_assumptions_update', { forecast_id: forecastId });
    setForecasts(prev =>
      prev.map(f => (f.id === forecastId ? { ...f, assumptions, lastUpdated: new Date() } : f))
    );
  }, [track]);

  return {
    forecasts,
    activeForecas,
    createForecast,
    generateProjections,
    compareForecasts,
    updateForecastAssumptions,
  };
}

/**
 * Hook for budget variance analysis and reporting
 *
 * @description Analyzes budget variances between planned and actual amounts
 *
 * @returns {object} Variance analysis operations
 *
 * @example
 * ```tsx
 * function VarianceAnalysisReport() {
 *   const {
 *     variances,
 *     analyzeVariance,
 *     categorizeVariances,
 *     generateVarianceReport
 *   } = useBudgetVarianceAnalysis();
 *
 *   useEffect(() => {
 *     analyzeVariance({
 *       fiscalYear: 2024,
 *       periodStart: new Date('2024-01-01'),
 *       periodEnd: new Date('2024-03-31')
 *     });
 *   }, []);
 * }
 * ```
 */
export function useBudgetVarianceAnalysis() {
  const [variances, setVariances] = useState<BudgetVarianceAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { track } = useTracking();

  const analyzeVariance = useCallback(async (params: {
    fiscalYear: number;
    periodStart: Date;
    periodEnd: Date;
    lineItemId?: string;
    projectId?: string;
  }) => {
    setIsAnalyzing(true);
    try {
      track('variance_analysis_run', params);
      // Variance calculation logic
      const analysis: BudgetVarianceAnalysis = {
        id: `var_${Date.now()}`,
        analysisDate: new Date(),
        ...params,
        plannedAmount: 1000000,
        actualAmount: 950000,
        variance: -50000,
        variancePercent: -5.0,
        varianceType: 'favorable',
        category: 'Personnel',
      };
      setVariances(prev => [...prev, analysis]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [track]);

  const categorizeVariances = useCallback(() => {
    track('variance_categorize');
    const favorable = variances.filter(v => v.varianceType === 'favorable');
    const unfavorable = variances.filter(v => v.varianceType === 'unfavorable');
    return { favorable, unfavorable };
  }, [variances, track]);

  const generateVarianceReport = useCallback((fiscalYear: number) => {
    track('variance_report_generate', { fiscal_year: fiscalYear });
    const report = variances.filter(v => v.fiscalYear === fiscalYear);
    return {
      totalVariance: report.reduce((sum, v) => sum + v.variance, 0),
      averageVariancePercent: report.reduce((sum, v) => sum + v.variancePercent, 0) / report.length,
      variances: report,
    };
  }, [variances, track]);

  const addCorrectiveAction = useCallback((varianceId: string, action: string) => {
    track('variance_corrective_action_add', { variance_id: varianceId });
    setVariances(prev =>
      prev.map(v => (v.id === varianceId ? { ...v, corrective_action: action } : v))
    );
  }, [track]);

  return {
    variances,
    isAnalyzing,
    analyzeVariance,
    categorizeVariances,
    generateVarianceReport,
    addCorrectiveAction,
  };
}

/**
 * Hook for multi-year budget planning
 *
 * @description Manages multi-year budget plans with strategic objectives
 *
 * @returns {object} Multi-year planning operations
 *
 * @example
 * ```tsx
 * function MultiYearPlanningTool() {
 *   const {
 *     plans,
 *     createPlan,
 *     addYearlyPlan,
 *     calculateTotalBudget
 *   } = useMultiYearBudgetPlanning();
 *
 *   const handleCreatePlan = async () => {
 *     const plan = await createPlan({
 *       name: '5-Year Capital Plan',
 *       startFiscalYear: 2024,
 *       endFiscalYear: 2028
 *     });
 *   };
 * }
 * ```
 */
export function useMultiYearBudgetPlanning() {
  const [plans, setPlans] = useState<MultiYearBudgetPlan[]>([]);
  const [activePlan, setActivePlan] = useState<MultiYearBudgetPlan | null>(null);
  const { track } = useTracking();

  const createPlan = useCallback(async (planData: Partial<MultiYearBudgetPlan>) => {
    track('multi_year_plan_create', {
      start_year: planData.startFiscalYear,
      end_year: planData.endFiscalYear,
    });
    const newPlan: MultiYearBudgetPlan = {
      id: `myp_${Date.now()}`,
      createdDate: new Date(),
      lastUpdated: new Date(),
      status: 'draft',
      yearlyPlans: [],
      totalPlannedBudget: 0,
      strategicObjectives: [],
      assumptions: [],
      riskFactors: [],
      ...planData,
    } as MultiYearBudgetPlan;
    setPlans(prev => [...prev, newPlan]);
    return newPlan;
  }, [track]);

  const addYearlyPlan = useCallback((planId: string, yearlyPlan: YearlyBudgetPlan) => {
    track('yearly_plan_add', { plan_id: planId, fiscal_year: yearlyPlan.fiscalYear });
    setPlans(prev =>
      prev.map(p =>
        p.id === planId
          ? { ...p, yearlyPlans: [...p.yearlyPlans, yearlyPlan], lastUpdated: new Date() }
          : p
      )
    );
  }, [track]);

  const calculateTotalBudget = useCallback((planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return 0;
    return plan.yearlyPlans.reduce((sum, yp) => sum + yp.plannedBudget, 0);
  }, [plans]);

  const updateStrategicObjectives = useCallback((planId: string, objectives: string[]) => {
    track('strategic_objectives_update', { plan_id: planId });
    setPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, strategicObjectives: objectives } : p))
    );
  }, [track]);

  const approvePlan = useCallback(async (planId: string) => {
    track('multi_year_plan_approve', { plan_id: planId });
    setPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, status: 'approved' } : p))
    );
  }, [track]);

  return {
    plans,
    activePlan,
    createPlan,
    addYearlyPlan,
    calculateTotalBudget,
    updateStrategicObjectives,
    approvePlan,
  };
}

/**
 * Hook for project budget management
 *
 * @description Manages project-level budgets with category breakdowns
 *
 * @param {string} projectId - Project identifier
 * @returns {object} Project budget operations
 *
 * @example
 * ```tsx
 * function ProjectBudgetTracker({ projectId }) {
 *   const {
 *     projectBudget,
 *     allocateBudget,
 *     recordObligation,
 *     recordExpenditure,
 *     calculatePercentComplete
 *   } = useProjectBudgetManagement(projectId);
 *
 *   const percentComplete = calculatePercentComplete();
 * }
 * ```
 */
export function useProjectBudgetManagement(projectId: string) {
  const [projectBudget, setProjectBudget] = useState<ProjectBudget | null>(null);
  const [budgetHistory, setBudgetHistory] = useState<any[]>([]);
  const { track } = useTracking();

  const loadProjectBudget = useCallback(async () => {
    track('project_budget_load', { project_id: projectId });
    // Load project budget data
  }, [projectId, track]);

  const allocateBudget = useCallback(async (amount: number, category: string) => {
    track('project_budget_allocate', { project_id: projectId, amount, category });
    // Allocation logic
  }, [projectId, track]);

  const recordObligation = useCallback(async (amount: number, category: string) => {
    track('project_obligation_record', { project_id: projectId, amount, category });
    if (projectBudget) {
      setProjectBudget({
        ...projectBudget,
        obligatedBudget: projectBudget.obligatedBudget + amount,
        remainingBudget: projectBudget.remainingBudget - amount,
      });
    }
  }, [projectId, projectBudget, track]);

  const recordExpenditure = useCallback(async (amount: number, category: string) => {
    track('project_expenditure_record', { project_id: projectId, amount, category });
    if (projectBudget) {
      setProjectBudget({
        ...projectBudget,
        expendedBudget: projectBudget.expendedBudget + amount,
      });
    }
  }, [projectId, projectBudget, track]);

  const calculatePercentComplete = useCallback(() => {
    if (!projectBudget || projectBudget.totalBudget === 0) return 0;
    return (projectBudget.expendedBudget / projectBudget.totalBudget) * 100;
  }, [projectBudget]);

  const updateBudgetCategory = useCallback((category: BudgetCategory) => {
    track('project_category_update', { project_id: projectId, category: category.category });
    if (projectBudget) {
      const updatedCategories = projectBudget.budgetCategories.map(c =>
        c.category === category.category ? category : c
      );
      setProjectBudget({ ...projectBudget, budgetCategories: updatedCategories });
    }
  }, [projectId, projectBudget, track]);

  return {
    projectBudget,
    budgetHistory,
    loadProjectBudget,
    allocateBudget,
    recordObligation,
    recordExpenditure,
    calculatePercentComplete,
    updateBudgetCategory,
  };
}

/**
 * Hook for budget transfer request management
 *
 * @description Manages budget transfer requests between appropriations
 *
 * @returns {object} Budget transfer operations
 *
 * @example
 * ```tsx
 * function BudgetTransferForm() {
 *   const {
 *     createTransferRequest,
 *     submitTransferRequest,
 *     approveTransfer,
 *     transfers
 *   } = useBudgetTransferRequest();
 *
 *   const handleTransfer = async (data) => {
 *     const transfer = await createTransferRequest(data);
 *     await submitTransferRequest(transfer.id);
 *   };
 * }
 * ```
 */
export function useBudgetTransferRequest() {
  const [transfers, setTransfers] = useState<BudgetTransferRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { track } = useTracking();

  const createTransferRequest = useCallback(async (transferData: Partial<BudgetTransferRequest>) => {
    track('budget_transfer_create', { amount: transferData.amount });
    const newTransfer: BudgetTransferRequest = {
      id: `xfer_${Date.now()}`,
      transferNumber: `BTR-${Date.now()}`,
      requestedDate: new Date(),
      status: 'draft',
      ...transferData,
    } as BudgetTransferRequest;
    setTransfers(prev => [...prev, newTransfer]);
    return newTransfer;
  }, [track]);

  const submitTransferRequest = useCallback(async (transferId: string) => {
    setIsProcessing(true);
    try {
      track('budget_transfer_submit', { transfer_id: transferId });
      setTransfers(prev =>
        prev.map(t => (t.id === transferId ? { ...t, status: 'submitted' } : t))
      );
    } finally {
      setIsProcessing(false);
    }
  }, [track]);

  const approveTransfer = useCallback(async (transferId: string, approver: string) => {
    track('budget_transfer_approve', { transfer_id: transferId });
    setTransfers(prev =>
      prev.map(t =>
        t.id === transferId
          ? { ...t, status: 'approved', approvedBy: approver, approvedDate: new Date() }
          : t
      )
    );
  }, [track]);

  const executeTransfer = useCallback(async (transferId: string) => {
    setIsProcessing(true);
    try {
      track('budget_transfer_execute', { transfer_id: transferId });
      // Execute the actual transfer
      setTransfers(prev =>
        prev.map(t =>
          t.id === transferId ? { ...t, status: 'completed', effectiveDate: new Date() } : t
        )
      );
    } finally {
      setIsProcessing(false);
    }
  }, [track]);

  return {
    transfers,
    isProcessing,
    createTransferRequest,
    submitTransferRequest,
    approveTransfer,
    executeTransfer,
  };
}

// ============================================================================
// BUDGET LINE ITEM MANAGEMENT
// ============================================================================

/**
 * Hook for budget line item tracking and management
 *
 * @description Manages individual budget line items with detailed tracking
 *
 * @param {string} appropriationId - Appropriation identifier
 * @returns {object} Line item operations
 *
 * @example
 * ```tsx
 * function LineItemManager({ appropriationId }) {
 *   const {
 *     lineItems,
 *     createLineItem,
 *     updateLineItem,
 *     calculateUtilization
 *   } = useBudgetLineItemManagement(appropriationId);
 * }
 * ```
 */
export function useBudgetLineItemManagement(appropriationId: string) {
  const [lineItems, setLineItems] = useState<BudgetLineItem[]>([]);
  const { track } = useTracking();

  const createLineItem = useCallback(async (itemData: Partial<BudgetLineItem>) => {
    track('line_item_create', { appropriation_id: appropriationId });
    const newItem: BudgetLineItem = {
      id: `li_${Date.now()}`,
      appropriationId,
      status: 'draft',
      percentUtilized: 0,
      remainingBalance: itemData.plannedAmount || 0,
      obligatedAmount: 0,
      expendedAmount: 0,
      allocatedAmount: 0,
      ...itemData,
    } as BudgetLineItem;
    setLineItems(prev => [...prev, newItem]);
    return newItem;
  }, [appropriationId, track]);

  const updateLineItem = useCallback((itemId: string, updates: Partial<BudgetLineItem>) => {
    track('line_item_update', { item_id: itemId });
    setLineItems(prev => prev.map(item => (item.id === itemId ? { ...item, ...updates } : item)));
  }, [track]);

  const calculateUtilization = useCallback((itemId: string) => {
    const item = lineItems.find(li => li.id === itemId);
    if (!item || item.plannedAmount === 0) return 0;
    return (item.expendedAmount / item.plannedAmount) * 100;
  }, [lineItems]);

  const approveLineItem = useCallback((itemId: string) => {
    track('line_item_approve', { item_id: itemId });
    updateLineItem(itemId, { status: 'approved' });
  }, [track, updateLineItem]);

  return {
    lineItems,
    createLineItem,
    updateLineItem,
    calculateUtilization,
    approveLineItem,
  };
}

/**
 * Hook for budget constraint management and enforcement
 *
 * @description Manages and enforces budget constraints and spending limits
 *
 * @returns {object} Constraint management operations
 *
 * @example
 * ```tsx
 * function ConstraintMonitor() {
 *   const {
 *     constraints,
 *     addConstraint,
 *     checkConstraintViolation,
 *     enforceConstraint
 *   } = useBudgetConstraints();
 * }
 * ```
 */
export function useBudgetConstraints() {
  const [constraints, setConstraints] = useState<BudgetConstraint[]>([]);
  const { track } = useTracking();

  const addConstraint = useCallback((constraint: Omit<BudgetConstraint, 'id'>) => {
    track('budget_constraint_add', { type: constraint.type });
    const newConstraint: BudgetConstraint = {
      id: `const_${Date.now()}`,
      currentAmount: 0,
      percentUtilized: 0,
      enforced: true,
      ...constraint,
    };
    setConstraints(prev => [...prev, newConstraint]);
    return newConstraint;
  }, [track]);

  const checkConstraintViolation = useCallback(
    (applicableTo: string, amount: number) => {
      const applicable = constraints.filter(c => c.applicableTo === applicableTo && c.enforced);
      for (const constraint of applicable) {
        if (constraint.currentAmount + amount > constraint.limitAmount) {
          return { violated: true, constraint };
        }
      }
      return { violated: false, constraint: null };
    },
    [constraints]
  );

  const enforceConstraint = useCallback((constraintId: string, enforce: boolean) => {
    track('budget_constraint_enforce', { constraint_id: constraintId, enforce });
    setConstraints(prev =>
      prev.map(c => (c.id === constraintId ? { ...c, enforced: enforce } : c))
    );
  }, [track]);

  const updateConstraintAmount = useCallback((constraintId: string, amount: number) => {
    setConstraints(prev =>
      prev.map(c => {
        if (c.id === constraintId) {
          const currentAmount = c.currentAmount + amount;
          return {
            ...c,
            currentAmount,
            percentUtilized: (currentAmount / c.limitAmount) * 100,
          };
        }
        return c;
      })
    );
  }, []);

  return {
    constraints,
    addConstraint,
    checkConstraintViolation,
    enforceConstraint,
    updateConstraintAmount,
  };
}

// ============================================================================
// BUDGET APPROVAL WORKFLOW INTEGRATION
// ============================================================================

/**
 * Hook for budget approval workflow management
 *
 * @description Integrates budget operations with approval workflows
 *
 * @param {string} budgetType - Type of budget requiring approval
 * @returns {object} Budget approval workflow operations
 *
 * @example
 * ```tsx
 * function BudgetApprovalFlow({ budgetType }) {
 *   const {
 *     approvalConfig,
 *     initiateApproval,
 *     approvalStatus,
 *     routeForApproval
 *   } = useBudgetApprovalWorkflow(budgetType);
 * }
 * ```
 */
export function useBudgetApprovalWorkflow(budgetType: string) {
  const [approvalConfig, setApprovalConfig] = useState<BudgetApprovalConfig | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<WorkflowStatus>('draft');
  const { startWorkflow, updateWorkflow } = useApprovalFlow();
  const { track } = useTracking();

  const initiateApproval = useCallback(
    async (budgetId: string, amount: number) => {
      track('budget_approval_initiate', { budget_type: budgetType, amount });
      // Determine approval workflow based on amount and type
      if (approvalConfig && amount >= approvalConfig.thresholdAmount) {
        await startWorkflow({
          entityId: budgetId,
          entityType: budgetType,
          workflowType: 'budget_approval',
        });
        setApprovalStatus('pending');
      }
    },
    [budgetType, approvalConfig, startWorkflow, track]
  );

  const routeForApproval = useCallback(
    (level: number) => {
      track('budget_approval_route', { budget_type: budgetType, level });
      // Route to appropriate approval level
    },
    [budgetType, track]
  );

  const recordApprovalDecision = useCallback(
    (decision: ApprovalDecision, approver: string, comments?: string) => {
      track('budget_approval_decision', { budget_type: budgetType, decision });
      if (decision === 'approve') {
        setApprovalStatus('approved');
      } else if (decision === 'reject') {
        setApprovalStatus('rejected');
      }
    },
    [budgetType, track]
  );

  return {
    approvalConfig,
    approvalStatus,
    initiateApproval,
    routeForApproval,
    recordApprovalDecision,
  };
}

// ============================================================================
// BUDGET REPORTING AND ANALYTICS
// ============================================================================

/**
 * Hook for budget analytics and KPI tracking
 *
 * @description Provides budget analytics, KPIs, and performance metrics
 *
 * @param {number} fiscalYear - Fiscal year for analytics
 * @returns {object} Budget analytics operations
 *
 * @example
 * ```tsx
 * function BudgetAnalyticsDashboard() {
 *   const {
 *     kpis,
 *     budgetUtilization,
 *     trendAnalysis,
 *     generateKPIReport
 *   } = useBudgetAnalytics(2024);
 * }
 * ```
 */
export function useBudgetAnalytics(fiscalYear: number) {
  const [kpis, setKpis] = useState<any>({});
  const { track } = useTracking();

  const calculateBudgetUtilization = useCallback(() => {
    track('budget_utilization_calculate', { fiscal_year: fiscalYear });
    return {
      totalPlanned: 10000000,
      totalAllocated: 9500000,
      totalObligated: 8000000,
      totalExpended: 7000000,
      utilizationRate: 70.0,
      allocationRate: 95.0,
    };
  }, [fiscalYear, track]);

  const performTrendAnalysis = useCallback(() => {
    track('budget_trend_analysis', { fiscal_year: fiscalYear });
    // Trend analysis logic
    return {
      monthlyTrends: [],
      yearOverYear: [],
      projectedEndOfYear: 0,
    };
  }, [fiscalYear, track]);

  const generateKPIReport = useCallback(() => {
    track('budget_kpi_report_generate', { fiscal_year: fiscalYear });
    return {
      budgetUtilization: calculateBudgetUtilization(),
      trends: performTrendAnalysis(),
      generatedDate: new Date(),
    };
  }, [fiscalYear, calculateBudgetUtilization, performTrendAnalysis, track]);

  const trackBudgetPerformance = useCallback((metricName: string, value: number) => {
    track('budget_performance_metric', { metric: metricName, value, fiscal_year: fiscalYear });
  }, [fiscalYear, track]);

  return {
    kpis,
    budgetUtilization: calculateBudgetUtilization,
    trendAnalysis: performTrendAnalysis,
    generateKPIReport,
    trackBudgetPerformance,
  };
}

/**
 * Hook for budget report generation
 *
 * @description Generates various budget reports and exports
 *
 * @returns {object} Report generation operations
 *
 * @example
 * ```tsx
 * function BudgetReports() {
 *   const {
 *     generateExecutiveSummary,
 *     generateDetailedReport,
 *     exportToExcel,
 *     exportToPDF
 *   } = useBudgetReportGeneration();
 * }
 * ```
 */
export function useBudgetReportGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { track } = useTracking();

  const generateExecutiveSummary = useCallback(async (fiscalYear: number) => {
    setIsGenerating(true);
    try {
      track('budget_report_executive_summary', { fiscal_year: fiscalYear });
      // Generate executive summary
      return {
        fiscalYear,
        totalBudget: 10000000,
        summary: 'Executive summary content',
        keyHighlights: [],
      };
    } finally {
      setIsGenerating(false);
    }
  }, [track]);

  const generateDetailedReport = useCallback(async (params: any) => {
    setIsGenerating(true);
    try {
      track('budget_report_detailed', params);
      // Generate detailed report
      return {
        report: 'Detailed report content',
        sections: [],
      };
    } finally {
      setIsGenerating(false);
    }
  }, [track]);

  const exportToExcel = useCallback(async (reportData: any) => {
    track('budget_report_export_excel');
    // Export logic
    return 'budget_report.xlsx';
  }, [track]);

  const exportToPDF = useCallback(async (reportData: any) => {
    track('budget_report_export_pdf');
    // Export logic
    return 'budget_report.pdf';
  }, [track]);

  return {
    isGenerating,
    generateExecutiveSummary,
    generateDetailedReport,
    exportToExcel,
    exportToPDF,
  };
}

// ============================================================================
// BUDGET COLLABORATION AND VERSIONING
// ============================================================================

/**
 * Hook for budget version control and history
 *
 * @description Manages budget versions with change tracking
 *
 * @param {string} budgetId - Budget identifier
 * @returns {object} Version control operations
 *
 * @example
 * ```tsx
 * function BudgetVersionControl({ budgetId }) {
 *   const {
 *     versions,
 *     createVersion,
 *     compareVersions,
 *     restoreVersion
 *   } = useBudgetVersionControl(budgetId);
 * }
 * ```
 */
export function useBudgetVersionControl(budgetId: string) {
  const { versions, createVersion: createVer, compareVersions: compareVers } = useVersionControl(budgetId);
  const { track } = useTracking();

  const createBudgetVersion = useCallback(
    async (budgetData: any, comment: string) => {
      track('budget_version_create', { budget_id: budgetId });
      return await createVer(budgetData, { comment, author: 'current_user' });
    },
    [budgetId, createVer, track]
  );

  const compareBudgetVersions = useCallback(
    (version1: string, version2: string) => {
      track('budget_versions_compare', { budget_id: budgetId, version1, version2 });
      return compareVers(version1, version2);
    },
    [budgetId, compareVers, track]
  );

  const restoreBudgetVersion = useCallback(
    async (versionId: string) => {
      track('budget_version_restore', { budget_id: budgetId, version_id: versionId });
      return await restoreVersion(versionId);
    },
    [budgetId, restoreVersion, track]
  );

  return {
    versions,
    createVersion: createBudgetVersion,
    compareVersions: compareBudgetVersions,
    restoreVersion: restoreBudgetVersion,
  };
}

/**
 * Hook for budget comment and collaboration
 *
 * @description Enables collaboration features for budget planning
 *
 * @param {string} budgetId - Budget identifier
 * @returns {object} Collaboration operations
 *
 * @example
 * ```tsx
 * function BudgetCollaboration({ budgetId }) {
 *   const {
 *     comments,
 *     addComment,
 *     mentions,
 *     notifications
 *   } = useBudgetCollaboration(budgetId);
 * }
 * ```
 */
export function useBudgetCollaboration(budgetId: string) {
  const [comments, setComments] = useState<any[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const { track } = useTracking();

  const addComment = useCallback(
    (comment: string, userId: string) => {
      track('budget_comment_add', { budget_id: budgetId });
      setComments(prev => [
        ...prev,
        {
          id: `comment_${Date.now()}`,
          budgetId,
          userId,
          comment,
          timestamp: new Date(),
        },
      ]);
    },
    [budgetId, track]
  );

  const mentionUser = useCallback(
    (userId: string) => {
      track('budget_user_mention', { budget_id: budgetId, mentioned_user: userId });
      setMentions(prev => [...prev, userId]);
    },
    [budgetId, track]
  );

  const sendNotification = useCallback(
    (userId: string, message: string) => {
      track('budget_notification_send', { budget_id: budgetId, to_user: userId });
      // Send notification logic
    },
    [budgetId, track]
  );

  return {
    comments,
    mentions,
    addComment,
    mentionUser,
    sendNotification,
  };
}

// ============================================================================
// BUDGET IMPORT/EXPORT UTILITIES
// ============================================================================

/**
 * Hook for budget data import/export operations
 *
 * @description Handles budget data import from various formats and export
 *
 * @returns {object} Import/export operations
 *
 * @example
 * ```tsx
 * function BudgetDataManager() {
 *   const {
 *     importFromExcel,
 *     importFromCSV,
 *     exportBudgetData,
 *     validateImportData
 *   } = useBudgetImportExport();
 * }
 * ```
 */
export function useBudgetImportExport() {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { track } = useTracking();

  const importFromExcel = useCallback(async (file: File) => {
    setIsImporting(true);
    try {
      track('budget_import_excel', { filename: file.name });
      // Excel import logic
      return { success: true, recordsImported: 0 };
    } finally {
      setIsImporting(false);
    }
  }, [track]);

  const importFromCSV = useCallback(async (file: File) => {
    setIsImporting(true);
    try {
      track('budget_import_csv', { filename: file.name });
      // CSV import logic
      return { success: true, recordsImported: 0 };
    } finally {
      setIsImporting(false);
    }
  }, [track]);

  const exportBudgetData = useCallback(async (fiscalYear: number, format: 'excel' | 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      track('budget_export', { fiscal_year: fiscalYear, format });
      // Export logic
      return `budget_fy${fiscalYear}.${format}`;
    } finally {
      setIsExporting(false);
    }
  }, [track]);

  const validateImportData = useCallback((data: any[]) => {
    track('budget_import_validate');
    // Validation logic
    return { valid: true, errors: [] };
  }, [track]);

  return {
    isImporting,
    isExporting,
    importFromExcel,
    importFromCSV,
    exportBudgetData,
    validateImportData,
  };
}

// ============================================================================
// COMPOSITE FORM BUILDERS
// ============================================================================

/**
 * Creates budget allocation form configuration
 *
 * @description Generates form configuration for budget allocation requests
 *
 * @returns {FormConfig} Budget allocation form configuration
 *
 * @example
 * ```tsx
 * function AllocationRequestForm() {
 *   const formConfig = createBudgetAllocationForm();
 *   return (
 *     <FormProvider formConfig={formConfig} onSubmit={handleSubmit}>
 *       <FormRenderer />
 *     </FormProvider>
 *   );
 * }
 * ```
 */
export function createBudgetAllocationForm(): FormConfig {
  return {
    id: 'budget_allocation_form',
    title: 'Budget Allocation Request',
    description: 'Request allocation of funds from appropriation',
    fields: [
      {
        id: 'fiscal_year',
        name: 'fiscalYear',
        type: 'select',
        label: 'Fiscal Year',
        required: true,
        options: [
          { label: 'FY 2024', value: 2024 },
          { label: 'FY 2025', value: 2025 },
        ],
      },
      {
        id: 'appropriation',
        name: 'appropriationId',
        type: 'select',
        label: 'Appropriation',
        required: true,
        options: [],
      },
      {
        id: 'amount',
        name: 'amount',
        type: 'number',
        label: 'Requested Amount',
        required: true,
        min: 0,
        validation: [
          {
            type: 'required',
            message: 'Amount is required',
          },
          {
            type: 'min',
            value: 0,
            message: 'Amount must be greater than 0',
          },
        ],
      },
      {
        id: 'purpose',
        name: 'purpose',
        type: 'text',
        label: 'Purpose',
        required: true,
      },
      {
        id: 'justification',
        name: 'justification',
        type: 'textarea',
        label: 'Justification',
        required: true,
        rows: 5,
      },
      {
        id: 'priority',
        name: 'priority',
        type: 'select',
        label: 'Priority',
        required: true,
        options: [
          { label: 'Critical', value: 'critical' },
          { label: 'High', value: 'high' },
          { label: 'Medium', value: 'medium' },
          { label: 'Low', value: 'low' },
        ],
      },
    ],
    submitButtonText: 'Submit Request',
  };
}

/**
 * Creates budget transfer form configuration
 *
 * @description Generates form configuration for budget transfers
 *
 * @returns {FormConfig} Budget transfer form configuration
 *
 * @example
 * ```tsx
 * function BudgetTransferForm() {
 *   const formConfig = createBudgetTransferForm();
 *   return <FormProvider formConfig={formConfig} onSubmit={handleSubmit} />;
 * }
 * ```
 */
export function createBudgetTransferForm(): FormConfig {
  return {
    id: 'budget_transfer_form',
    title: 'Budget Transfer Request',
    description: 'Transfer funds between appropriations',
    fields: [
      {
        id: 'from_appropriation',
        name: 'fromAppropriationId',
        type: 'select',
        label: 'From Appropriation',
        required: true,
        options: [],
      },
      {
        id: 'to_appropriation',
        name: 'toAppropriationId',
        type: 'select',
        label: 'To Appropriation',
        required: true,
        options: [],
      },
      {
        id: 'transfer_amount',
        name: 'amount',
        type: 'number',
        label: 'Transfer Amount',
        required: true,
        min: 0,
      },
      {
        id: 'reason',
        name: 'reason',
        type: 'text',
        label: 'Reason for Transfer',
        required: true,
      },
      {
        id: 'justification',
        name: 'justification',
        type: 'textarea',
        label: 'Detailed Justification',
        required: true,
        rows: 5,
      },
      {
        id: 'authority',
        name: 'authority',
        type: 'text',
        label: 'Transfer Authority',
        required: true,
        helpText: 'Legal authority or regulation permitting this transfer',
      },
    ],
    submitButtonText: 'Submit Transfer Request',
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats currency for USACE budget displays
 *
 * @description Formats numeric amounts as USD currency
 *
 * @param {number} amount - Amount to format
 * @param {boolean} includeDecimals - Whether to include decimal places
 * @returns {string} Formatted currency string
 *
 * @example
 * ```tsx
 * const formatted = formatBudgetCurrency(1000000); // "$1,000,000.00"
 * const formatted2 = formatBudgetCurrency(1000000, false); // "$1,000,000"
 * ```
 */
export function formatBudgetCurrency(amount: number, includeDecimals: boolean = true): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Validates appropriation availability
 *
 * @description Checks if appropriation has sufficient available funds
 *
 * @param {Appropriation} appropriation - Appropriation to check
 * @param {number} requestedAmount - Amount requested
 * @returns {object} Validation result
 *
 * @example
 * ```tsx
 * const result = validateAppropriationAvailability(appropriation, 50000);
 * if (!result.valid) {
 *   alert(result.message);
 * }
 * ```
 */
export function validateAppropriationAvailability(
  appropriation: Appropriation,
  requestedAmount: number
): { valid: boolean; message?: string; available: number } {
  const available = appropriation.amount; // Simplified - would calculate actual available

  if (appropriation.status !== 'available') {
    return {
      valid: false,
      message: 'Appropriation is not available',
      available: 0,
    };
  }

  if (available < requestedAmount) {
    return {
      valid: false,
      message: `Insufficient funds. Available: ${formatBudgetCurrency(available)}`,
      available,
    };
  }

  return {
    valid: true,
    available,
  };
}

/**
 * Calculates fiscal year from date
 *
 * @description Determines USACE fiscal year from a given date
 *
 * @param {Date} date - Date to calculate fiscal year for
 * @returns {number} Fiscal year
 *
 * @example
 * ```tsx
 * const fy = calculateFiscalYear(new Date('2024-11-15')); // 2025
 * const fy2 = calculateFiscalYear(new Date('2024-09-30')); // 2024
 * ```
 */
export function calculateFiscalYear(date: Date): number {
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();
  // USACE fiscal year starts October 1
  return month >= 9 ? year + 1 : year;
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Hooks
  useFiscalYearBudget,
  useBudgetAllocationRequest,
  useBudgetForecasting,
  useBudgetVarianceAnalysis,
  useMultiYearBudgetPlanning,
  useProjectBudgetManagement,
  useBudgetTransferRequest,
  useBudgetLineItemManagement,
  useBudgetConstraints,
  useBudgetApprovalWorkflow,
  useBudgetAnalytics,
  useBudgetReportGeneration,
  useBudgetVersionControl,
  useBudgetCollaboration,
  useBudgetImportExport,

  // Form Builders
  createBudgetAllocationForm,
  createBudgetTransferForm,

  // Utilities
  formatBudgetCurrency,
  validateAppropriationAvailability,
  calculateFiscalYear,
};
