import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorKeys } from '../config';
import { 
  useVendor, 
  useVendors, 
  useVendorContracts, 
  useVendorEvaluations, 
  useVendorPayments,
  useVendorDocuments,
  useVendorAnalytics,
  useVendorPerformance,
  useVendorCompliance
} from '../queries/useVendorQueries';
import { 
  useCreateVendor, 
  useUpdateVendor, 
  useCreateVendorContract, 
  useCreateVendorEvaluation,
  useApprovePayment,
  useUploadVendorDocument,
  useBulkApprovePayments
} from '../mutations/useVendorMutations';
import type { Vendor, VendorContract, VendorEvaluation } from '../config';

// Vendor Management Workflow
export const useVendorWorkflow = (vendorId?: string) => {
  const queryClient = useQueryClient();
  
  const vendor = useVendor(vendorId!);
  const contracts = useVendorContracts(vendorId);
  const evaluations = useVendorEvaluations(vendorId);
  const payments = useVendorPayments(vendorId);
  const documents = useVendorDocuments(vendorId!);
  const analytics = useVendorAnalytics(vendorId!, 'monthly');
  const performance = useVendorPerformance(vendorId!);
  
  const updateVendor = useUpdateVendor();
  const createContract = useCreateVendorContract();
  const createEvaluation = useCreateVendorEvaluation();
  const uploadDocument = useUploadVendorDocument();
  
  const sendReminder = useMutation({
    mutationFn: async ({ vendorId, type, message }: {
      vendorId: string;
      type: 'DOCUMENT_EXPIRY' | 'EVALUATION_DUE' | 'CONTRACT_RENEWAL' | 'PAYMENT_OVERDUE';
      message?: string;
    }): Promise<void> => {
      const response = await fetch(`/api/vendors/${vendorId}/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message }),
      });
      if (!response.ok) throw new Error('Failed to send reminder');
    },
  });

  return {
    // Data
    vendor: vendor.data,
    contracts: contracts.data,
    evaluations: evaluations.data,
    payments: payments.data,
    documents: documents.data,
    analytics: analytics.data,
    performance: performance.data,
    
    // Loading states
    isLoading: vendor.isLoading || contracts.isLoading || evaluations.isLoading,
    isLoadingPayments: payments.isLoading,
    isLoadingDocuments: documents.isLoading,
    isLoadingAnalytics: analytics.isLoading,
    
    // Error states
    error: vendor.error || contracts.error || evaluations.error,
    
    // Actions
    updateVendor: updateVendor.mutate,
    createContract: createContract.mutate,
    createEvaluation: createEvaluation.mutate,
    uploadDocument: uploadDocument.mutate,
    sendReminder: sendReminder.mutate,
    
    // Action states
    isUpdating: updateVendor.isPending,
    isCreatingContract: createContract.isPending,
    isCreatingEvaluation: createEvaluation.isPending,
    isUploadingDocument: uploadDocument.isPending,
    isSendingReminder: sendReminder.isPending,
    
    // Refetch functions
    refetchVendor: vendor.refetch,
    refetchContracts: contracts.refetch,
    refetchEvaluations: evaluations.refetch,
    refetchPayments: payments.refetch,
    refetchDocuments: documents.refetch,
  };
};

// Vendor Onboarding Process
export const useVendorOnboarding = () => {
  const queryClient = useQueryClient();
  
  const createVendor = useCreateVendor();
  
  const processOnboarding = useMutation({
    mutationFn: async (onboardingData: {
      step: number;
      data: any;
      vendorId?: string;
    }): Promise<{
      currentStep: number;
      nextStep: number;
      isComplete: boolean;
      vendor: Vendor;
      requirements: Array<{
        type: string;
        status: 'PENDING' | 'COMPLETED' | 'FAILED';
        description: string;
      }>;
    }> => {
      const response = await fetch('/api/vendors/onboarding/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      });
      if (!response.ok) throw new Error('Failed to process onboarding step');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.all });
    },
  });

  const validateVendorData = useMutation({
    mutationFn: async (vendorData: any): Promise<{
      isValid: boolean;
      errors: Array<{
        field: string;
        message: string;
      }>;
      warnings: Array<{
        field: string;
        message: string;
      }>;
    }> => {
      const response = await fetch('/api/vendors/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });
      if (!response.ok) throw new Error('Failed to validate vendor data');
      return response.json();
    },
  });

  return {
    // Actions
    createVendor: createVendor.mutate,
    processOnboarding: processOnboarding.mutate,
    validateVendorData: validateVendorData.mutate,
    
    // Action states
    isCreating: createVendor.isPending,
    isProcessing: processOnboarding.isPending,
    isValidating: validateVendorData.isPending,
    
    // Results
    onboardingResult: processOnboarding.data,
    validationResult: validateVendorData.data,
  };
};

// Vendor Performance Management
export const useVendorPerformanceManagement = (filters?: {
  category?: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  performanceThreshold?: number;
}) => {
  const vendors = useVendors(filters);
  const compliance = useVendorCompliance();
  
  const performanceReport = useQuery({
    queryKey: [...vendorKeys.all, 'performance-report', filters],
    queryFn: async (): Promise<{
      summary: {
        totalVendors: number;
        highPerformers: number;
        underPerformers: number;
        atRiskVendors: number;
      };
      
      performanceMetrics: {
        averageRating: number;
        averageDeliveryRate: number;
        averageQualityScore: number;
        costSavingsTotal: number;
      };
      
      topPerformers: Array<{
        vendor: Vendor;
        score: number;
        strengths: string[];
      }>;
      
      underPerformers: Array<{
        vendor: Vendor;
        score: number;
        issues: string[];
        recommendations: string[];
      }>;
      
      trends: Array<{
        period: string;
        averageRating: number;
        issueCount: number;
        improvementCount: number;
      }>;
    }> => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters?.performanceThreshold) params.append('threshold', filters.performanceThreshold.toString());
      
      const response = await fetch(`/api/vendors/performance-report?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch performance report');
      return response.json();
    },
    enabled: !!vendors.data,
  });

  const generatePerformanceReview = useMutation({
    mutationFn: async ({ vendorIds, period, includeRecommendations }: {
      vendorIds: string[];
      period: 'quarterly' | 'annual';
      includeRecommendations: boolean;
    }) => {
      const response = await fetch('/api/vendors/generate-performance-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorIds, period, includeRecommendations }),
      });
      if (!response.ok) throw new Error('Failed to generate performance review');
      return response.blob();
    },
  });

  return {
    // Data
    vendors: vendors.data,
    compliance: compliance.data,
    performanceReport: performanceReport.data,
    
    // Loading states
    isLoading: vendors.isLoading || compliance.isLoading || performanceReport.isLoading,
    
    // Actions
    generatePerformanceReview: generatePerformanceReview.mutate,
    
    // Action states
    isGeneratingReview: generatePerformanceReview.isPending,
    
    // Refetch
    refetch: () => {
      vendors.refetch();
      compliance.refetch();
      performanceReport.refetch();
    },
  };
};

// Vendor Payment Management
export const useVendorPaymentManagement = (vendorId?: string) => {
  const queryClient = useQueryClient();
  
  const payments = useVendorPayments(vendorId, { status: 'PENDING' });
  const approvePayment = useApprovePayment();
  const bulkApprove = useBulkApprovePayments();
  
  const paymentWorkflow = useMutation({
    mutationFn: async ({ action, paymentIds, data }: {
      action: 'APPROVE' | 'REJECT' | 'HOLD' | 'BATCH_PROCESS';
      paymentIds: string[];
      data?: any;
    }): Promise<{
      processed: number;
      failed: number;
      results: Array<{
        paymentId: string;
        status: 'SUCCESS' | 'FAILED';
        message: string;
      }>;
    }> => {
      const response = await fetch('/api/vendor-payments/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, paymentIds, data }),
      });
      if (!response.ok) throw new Error('Failed to process payment workflow');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.payments(vendorId) });
    },
  });

  const reconcilePayments = useMutation({
    mutationFn: async ({ vendorId, period }: {
      vendorId: string;
      period: string;
    }): Promise<{
      totalInvoices: number;
      totalPaid: number;
      discrepancies: Array<{
        invoiceNumber: string;
        expectedAmount: number;
        paidAmount: number;
        difference: number;
        reason?: string;
      }>;
    }> => {
      const response = await fetch(`/api/vendors/${vendorId}/reconcile-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period }),
      });
      if (!response.ok) throw new Error('Failed to reconcile payments');
      return response.json();
    },
  });

  return {
    // Data
    pendingPayments: payments.data,
    
    // Loading states
    isLoading: payments.isLoading,
    
    // Actions
    approvePayment: approvePayment.mutate,
    bulkApprove: bulkApprove.mutate,
    paymentWorkflow: paymentWorkflow.mutate,
    reconcilePayments: reconcilePayments.mutate,
    
    // Action states
    isApproving: approvePayment.isPending,
    isBulkApproving: bulkApprove.isPending,
    isProcessingWorkflow: paymentWorkflow.isPending,
    isReconciling: reconcilePayments.isPending,
    
    // Results
    workflowResult: paymentWorkflow.data,
    reconciliationResult: reconcilePayments.data,
    
    // Refetch
    refetch: payments.refetch,
  };
};

// Vendor Contract Management
export const useVendorContractManagement = (vendorId?: string) => {
  const queryClient = useQueryClient();
  
  const contracts = useVendorContracts(vendorId);
  const createContract = useCreateVendorContract();
  
  const contractLifecycle = useMutation({
    mutationFn: async ({ contractId, action, data }: {
      contractId: string;
      action: 'RENEW' | 'AMEND' | 'TERMINATE' | 'EXTEND';
      data?: any;
    }): Promise<VendorContract> => {
      const response = await fetch(`/api/vendor-contracts/${contractId}/lifecycle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data }),
      });
      if (!response.ok) throw new Error('Failed to process contract lifecycle');
      return response.json();
    },
    onSuccess: (updatedContract) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(updatedContract.vendorId) });
    },
  });

  const generateContractReport = useMutation({
    mutationFn: async ({ vendorId, includeAmendments }: {
      vendorId?: string;
      includeAmendments: boolean;
    }) => {
      const response = await fetch('/api/vendor-contracts/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, includeAmendments }),
      });
      if (!response.ok) throw new Error('Failed to generate contract report');
      return response.blob();
    },
  });

  const expiringContracts = useQuery({
    queryKey: [...vendorKeys.all, 'contracts-expiring', vendorId],
    queryFn: async (): Promise<Array<{
      contract: VendorContract;
      daysUntilExpiry: number;
      renewalRecommendation: 'RENEW' | 'RENEW_WITH_CHANGES' | 'DO_NOT_RENEW';
      reason: string;
    }>> => {
      const params = vendorId ? `?vendorId=${vendorId}` : '';
      const response = await fetch(`/api/vendor-contracts/expiring${params}`);
      if (!response.ok) throw new Error('Failed to fetch expiring contracts');
      return response.json();
    },
    refetchInterval: 24 * 60 * 60 * 1000, // Daily refresh
  });

  return {
    // Data
    contracts: contracts.data,
    expiringContracts: expiringContracts.data,
    
    // Loading states
    isLoading: contracts.isLoading,
    isLoadingExpiring: expiringContracts.isLoading,
    
    // Actions
    createContract: createContract.mutate,
    contractLifecycle: contractLifecycle.mutate,
    generateContractReport: generateContractReport.mutate,
    
    // Action states
    isCreating: createContract.isPending,
    isProcessingLifecycle: contractLifecycle.isPending,
    isGeneratingReport: generateContractReport.isPending,
    
    // Refetch
    refetchContracts: contracts.refetch,
    refetchExpiring: expiringContracts.refetch,
  };
};

// Vendor Risk Assessment
export const useVendorRiskAssessment = (vendorIds?: string[]) => {
  const riskAssessment = useQuery({
    queryKey: [...vendorKeys.all, 'risk-assessment', vendorIds],
    queryFn: async (): Promise<{
      overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      
      riskFactors: Array<{
        category: 'FINANCIAL' | 'OPERATIONAL' | 'COMPLIANCE' | 'STRATEGIC';
        level: 'LOW' | 'MEDIUM' | 'HIGH';
        description: string;
        impact: number;
        probability: number;
      }>;
      
      vendorRisks: Array<{
        vendorId: string;
        vendorName: string;
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        score: number;
        topRisks: string[];
        recommendations: string[];
      }>;
      
      mitigation: Array<{
        risk: string;
        strategy: string;
        owner: string;
        timeline: string;
        status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
      }>;
    }> => {
      const params = new URLSearchParams();
      vendorIds?.forEach(id => params.append('vendorIds', id));
      
      const response = await fetch(`/api/vendors/risk-assessment?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch risk assessment');
      return response.json();
    },
    enabled: !vendorIds || vendorIds.length > 0,
    refetchInterval: 60 * 60 * 1000, // Hourly refresh
  });

  const createRiskMitigation = useMutation({
    mutationFn: async (mitigationPlan: {
      vendorId: string;
      riskCategory: string;
      strategy: string;
      owner: string;
      timeline: string;
      budget?: number;
    }): Promise<void> => {
      const response = await fetch('/api/vendors/risk-mitigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mitigationPlan),
      });
      if (!response.ok) throw new Error('Failed to create risk mitigation plan');
    },
    onSuccess: () => {
      riskAssessment.refetch();
    },
  });

  return {
    // Data
    riskAssessment: riskAssessment.data,
    
    // Loading states
    isLoading: riskAssessment.isLoading,
    
    // Actions
    createRiskMitigation: createRiskMitigation.mutate,
    
    // Action states
    isCreatingMitigation: createRiskMitigation.isPending,
    
    // Refetch
    refetch: riskAssessment.refetch,
  };
};
