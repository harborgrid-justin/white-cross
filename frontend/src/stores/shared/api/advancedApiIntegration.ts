/**
 * Advanced API Integration
 *
 * Enterprise-grade RTK Query API endpoints for advanced features including:
 * - Analytics and health metrics
 * - Bulk operations with progress tracking
 * - Workflow orchestration
 * - Audit trail and compliance APIs
 * - Real-time data synchronization
 * - System monitoring and caching
 *
 * @module advancedApiIntegration
 */

import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { store, type RootState } from '../../reduxStore';

// Types for Phase 3 API operations
export interface AnalyticsApiRequest {
  type: 'HEALTH_METRICS' | 'TREND_ANALYSIS' | 'RISK_ASSESSMENT' | 'COMPLIANCE_REPORT';
  parameters: Record<string, any>;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: Record<string, any>;
}

export interface AnalyticsApiResponse<T = any> {
  success: boolean;
  data: T;
  metadata: {
    generatedAt: string;
    processingTime: number;
    dataPoints: number;
    cacheHit: boolean;
  };
  warnings?: string[];
}

export interface BulkOperationRequest {
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT';
  entity: string;
  data: any[];
  options: {
    validateFirst: boolean;
    rollbackOnError: boolean;
    batchSize: number;
    timeout: number;
  };
}

export interface BulkOperationResponse {
  operationId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress: {
    total: number;
    processed: number;
    failed: number;
    percentage: number;
  };
  results?: {
    successful: any[];
    failed: Array<{
      index: number;
      item: any;
      error: string;
    }>;
  };
  rollbackId?: string;
}

export interface WorkflowExecutionRequest {
  workflowType: 'STUDENT_ENROLLMENT' | 'MEDICATION_MANAGEMENT' | 'EMERGENCY_RESPONSE';
  input: Record<string, any>;
  options?: {
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timeout: number;
    retryPolicy: {
      maxRetries: number;
      backoffStrategy: 'LINEAR' | 'EXPONENTIAL';
    };
  };
}

export interface WorkflowExecutionResponse {
  executionId: string;
  workflowId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: {
    currentStage: string;
    completedStages: number;
    totalStages: number;
    percentage: number;
  };
  results?: {
    stageResults: Array<{
      stage: string;
      status: string;
      output: any;
      duration: number;
    }>;
    finalOutput: any;
  };
  error?: string;
}

export interface AuditQueryRequest {
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  complianceFlags?: string[];
  pagination: {
    page: number;
    limit: number;
  };
}

export interface AuditQueryResponse {
  entries: Array<{
    id: string;
    timestamp: string;
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    changes: any[];
    riskLevel: string;
    complianceFlags: string[];
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  aggregations: {
    byUser: Record<string, number>;
    byAction: Record<string, number>;
    byRiskLevel: Record<string, number>;
  };
}

// Custom base query with enhanced error handling and caching
const enhancedBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: '/api/v2/',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = (state as any).auth?.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      // Add telemetry headers for Phase 3 features
      headers.set('x-client-version', '3.0.0');
      headers.set('x-feature-set', 'enterprise');
      headers.set('x-request-id', `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      
      return headers;
    },
    timeout: 30000,
  });

  try {
    const result = await baseQuery(args, api, extraOptions);
    
    // Enhanced error handling for Phase 3 operations
    if (result.error) {
      // Log errors for monitoring
      console.error('[Phase3API] Request failed:', {
        url: typeof args === 'string' ? args : args.url,
        error: result.error,
        timestamp: new Date().toISOString()
      });
      
      // Transform common errors
      if (result.error.status === 429) {
        return {
          error: {
            status: 429,
            data: {
              message: 'Rate limit exceeded. Please try again later.',
              retryAfter: result.error.data?.retryAfter || 60
            }
          }
        };
      }
      
      if (result.error.status === 'TIMEOUT_ERROR') {
        return {
          error: {
            status: 'TIMEOUT_ERROR',
            data: {
              message: 'Request timed out. The operation may still be processing.',
              suggestedAction: 'Check operation status or try again'
            }
          }
        };
      }
    }
    
    return result;
  } catch (error) {
    console.error('[Phase3API] Unexpected error:', error);
    return {
      error: {
        status: 'FETCH_ERROR',
        data: {
          message: 'Network error occurred',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    };
  }
};

// Phase 3 API definition
export const phase3Api = createApi({
  reducerPath: 'phase3Api',
  baseQuery: enhancedBaseQuery,
  tagTypes: [
    'Analytics',
    'BulkOperation',
    'WorkflowExecution',
    'AuditTrail',
    'ComplianceReport',
    'PerformanceMetrics',
    'SyncStatus'
  ],
  endpoints: (builder) => ({
    
    // ============================================================
    // ANALYTICS ENDPOINTS
    // ============================================================
    
    generateHealthMetrics: builder.query<
      AnalyticsApiResponse<any>,
      { filters?: Record<string, any> }
    >({
      query: ({ filters }) => ({
        url: 'analytics/health-metrics',
        method: 'POST',
        body: { filters }
      }),
      providesTags: ['Analytics'],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),
    
    generateTrendAnalysis: builder.query<
      AnalyticsApiResponse<any>,
      {
        period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
        lookback: number;
        metrics: string[];
      }
    >({
      query: (params) => ({
        url: 'analytics/trend-analysis',
        method: 'POST',
        body: params
      }),
      providesTags: ['Analytics'],
      keepUnusedDataFor: 600, // Cache for 10 minutes
    }),
    
    assessStudentRisks: builder.query<
      AnalyticsApiResponse<any[]>,
      { studentIds?: string[]; riskTypes?: string[] }
    >({
      query: (params) => ({
        url: 'analytics/risk-assessment',
        method: 'POST',
        body: params
      }),
      providesTags: ['Analytics'],
      keepUnusedDataFor: 180, // Cache for 3 minutes (more frequent updates for risk)
    }),
    
    generateComplianceReport: builder.query<
      AnalyticsApiResponse<any>,
      {
        startDate: string;
        endDate: string;
        categories?: string[];
        format?: 'JSON' | 'PDF' | 'XLSX';
      }
    >({
      query: (params) => ({
        url: 'analytics/compliance-report',
        method: 'POST',
        body: params
      }),
      providesTags: ['ComplianceReport'],
      keepUnusedDataFor: 1800, // Cache for 30 minutes
    }),
    
    // ============================================================
    // BULK OPERATIONS ENDPOINTS
    // ============================================================
    
    executeBulkOperation: builder.mutation<
      BulkOperationResponse,
      BulkOperationRequest
    >({
      query: (request) => ({
        url: 'bulk-operations/execute',
        method: 'POST',
        body: request
      }),
      invalidatesTags: ['BulkOperation'],
    }),
    
    getBulkOperationStatus: builder.query<
      BulkOperationResponse,
      { operationId: string }
    >({
      query: ({ operationId }) => `bulk-operations/${operationId}/status`,
      providesTags: (result, error, { operationId }) => [
        { type: 'BulkOperation', id: operationId }
      ],
      // Poll every 2 seconds for in-progress operations
      pollingInterval: (result) => 
        result?.status === 'IN_PROGRESS' ? 2000 : undefined,
    }),
    
    rollbackBulkOperation: builder.mutation<
      BulkOperationResponse,
      { operationId: string }
    >({
      query: ({ operationId }) => ({
        url: `bulk-operations/${operationId}/rollback`,
        method: 'POST'
      }),
      invalidatesTags: ['BulkOperation'],
    }),
    
    listBulkOperations: builder.query<
      {
        operations: BulkOperationResponse[];
        pagination: {
          total: number;
          page: number;
          limit: number;
        };
      },
      {
        page?: number;
        limit?: number;
        status?: string;
        entity?: string;
      }
    >({
      query: (params) => ({
        url: 'bulk-operations',
        params
      }),
      providesTags: ['BulkOperation'],
    }),
    
    // ============================================================
    // WORKFLOW ORCHESTRATION ENDPOINTS
    // ============================================================
    
    executeWorkflow: builder.mutation<
      WorkflowExecutionResponse,
      WorkflowExecutionRequest
    >({
      query: (request) => ({
        url: 'workflows/execute',
        method: 'POST',
        body: request
      }),
      invalidatesTags: ['WorkflowExecution'],
    }),
    
    getWorkflowStatus: builder.query<
      WorkflowExecutionResponse,
      { executionId: string }
    >({
      query: ({ executionId }) => `workflows/executions/${executionId}/status`,
      providesTags: (result, error, { executionId }) => [
        { type: 'WorkflowExecution', id: executionId }
      ],
      // Poll every 3 seconds for running workflows
      pollingInterval: (result) => 
        result?.status === 'RUNNING' ? 3000 : undefined,
    }),
    
    cancelWorkflowExecution: builder.mutation<
      { success: boolean; message: string },
      { executionId: string; reason?: string }
    >({
      query: ({ executionId, reason }) => ({
        url: `workflows/executions/${executionId}/cancel`,
        method: 'POST',
        body: { reason }
      }),
      invalidatesTags: ['WorkflowExecution'],
    }),
    
    getWorkflowDefinitions: builder.query<
      Array<{
        id: string;
        name: string;
        description: string;
        type: string;
        version: number;
        isActive: boolean;
      }>,
      { type?: string }
    >({
      query: ({ type }) => ({
        url: 'workflows/definitions',
        params: { type }
      }),
      providesTags: ['WorkflowExecution'],
      keepUnusedDataFor: 600, // Cache workflow definitions for 10 minutes
    }),
    
    // ============================================================
    // AUDIT TRAIL ENDPOINTS
    // ============================================================
    
    queryAuditTrail: builder.query<
      AuditQueryResponse,
      AuditQueryRequest
    >({
      query: (request) => ({
        url: 'audit/query',
        method: 'POST',
        body: request
      }),
      providesTags: ['AuditTrail'],
      keepUnusedDataFor: 120, // Cache audit results for 2 minutes
    }),
    
    exportAuditTrail: builder.mutation<
      { downloadUrl: string; expiresAt: string },
      {
        request: AuditQueryRequest;
        format: 'CSV' | 'JSON' | 'PDF';
        includeMetadata: boolean;
      }
    >({
      query: ({ request, format, includeMetadata }) => ({
        url: 'audit/export',
        method: 'POST',
        body: {
          ...request,
          exportFormat: format,
          includeMetadata
        }
      }),
    }),
    
    getAuditStatistics: builder.query<
      {
        totalEntries: number;
        riskDistribution: Record<string, number>;
        topUsers: Array<{ userId: string; actionCount: number }>;
        topActions: Array<{ action: string; count: number }>;
        complianceViolations: number;
        trendsOverTime: Array<{ date: string; count: number }>;
      },
      {
        dateRange: { start: string; end: string };
        groupBy?: 'day' | 'week' | 'month';
      }
    >({
      query: (params) => ({
        url: 'audit/statistics',
        method: 'POST',
        body: params
      }),
      providesTags: ['AuditTrail'],
      keepUnusedDataFor: 300, // Cache statistics for 5 minutes
    }),
    
    // ============================================================
    // DATA SYNCHRONIZATION ENDPOINTS
    // ============================================================
    
    getSyncStatus: builder.query<
      Record<string, {
        entity: string;
        lastSyncAt: string;
        status: 'SYNCED' | 'PENDING' | 'ERROR' | 'CONFLICT';
        conflictCount: number;
        nextSyncAt: string;
      }>,
      void
    >({
      query: () => 'sync/status',
      providesTags: ['SyncStatus'],
      keepUnusedDataFor: 60, // Cache sync status for 1 minute
    }),
    
    forceSyncEntity: builder.mutation<
      { success: boolean; syncId: string },
      { entity: string; options?: { fullSync?: boolean; resolveConflicts?: boolean } }
    >({
      query: ({ entity, options }) => ({
        url: `sync/entities/${entity}/force`,
        method: 'POST',
        body: options
      }),
      invalidatesTags: ['SyncStatus'],
    }),
    
    resolveSyncConflicts: builder.mutation<
      { resolvedCount: number; remainingConflicts: number },
      {
        entity: string;
        resolutions: Array<{
          conflictId: string;
          resolution: 'KEEP_LOCAL' | 'KEEP_REMOTE' | 'MERGE';
          mergeData?: any;
        }>;
      }
    >({
      query: ({ entity, resolutions }) => ({
        url: `sync/entities/${entity}/resolve-conflicts`,
        method: 'POST',
        body: { resolutions }
      }),
      invalidatesTags: ['SyncStatus'],
    }),
    
    // ============================================================
    // PERFORMANCE MONITORING ENDPOINTS
    // ============================================================
    
    getPerformanceMetrics: builder.query<
      Record<string, {
        entity: string;
        operation: string;
        averageResponseTime: number;
        totalRequests: number;
        errorRate: number;
        cacheHitRate: number;
        lastUpdated: string;
      }>,
      {
        entities?: string[];
        timeframe?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
      }
    >({
      query: (params) => ({
        url: 'performance/metrics',
        params
      }),
      providesTags: ['PerformanceMetrics'],
      keepUnusedDataFor: 300, // Cache performance metrics for 5 minutes
    }),
    
    getSystemHealth: builder.query<
      {
        status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
        services: Record<string, {
          status: 'UP' | 'DOWN' | 'SLOW';
          responseTime: number;
          errorRate: number;
        }>;
        alerts: Array<{
          id: string;
          severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
          message: string;
          timestamp: string;
        }>;
      },
      void
    >({
      query: () => 'health/system',
      providesTags: ['PerformanceMetrics'],
      keepUnusedDataFor: 30, // Cache system health for 30 seconds
      // Poll system health every minute
      pollingInterval: 60000,
    }),
  }),
});

// Export hooks for use in components
export const {
  // Analytics hooks
  useGenerateHealthMetricsQuery,
  useGenerateTrendAnalysisQuery,
  useAssessStudentRisksQuery,
  useGenerateComplianceReportQuery,
  
  // Bulk operations hooks
  useExecuteBulkOperationMutation,
  useGetBulkOperationStatusQuery,
  useRollbackBulkOperationMutation,
  useListBulkOperationsQuery,
  
  // Workflow hooks
  useExecuteWorkflowMutation,
  useGetWorkflowStatusQuery,
  useCancelWorkflowExecutionMutation,
  useGetWorkflowDefinitionsQuery,
  
  // Audit hooks
  useQueryAuditTrailQuery,
  useExportAuditTrailMutation,
  useGetAuditStatisticsQuery,
  
  // Sync hooks
  useGetSyncStatusQuery,
  useForceSyncEntityMutation,
  useResolveSyncConflictsMutation,
  
  // Performance hooks
  useGetPerformanceMetricsQuery,
  useGetSystemHealthQuery,
} = phase3Api;

// Enhanced error handling utilities
export const handlePhase3ApiError = (error: any) => {
  if (error?.status === 429) {
    return {
      type: 'RATE_LIMIT',
      message: 'Too many requests. Please wait before trying again.',
      retryAfter: error.data?.retryAfter || 60
    };
  }
  
  if (error?.status === 'TIMEOUT_ERROR') {
    return {
      type: 'TIMEOUT',
      message: 'Operation timed out. It may still be processing in the background.',
      suggestedAction: 'Check operation status'
    };
  }
  
  if (error?.status >= 500) {
    return {
      type: 'SERVER_ERROR',
      message: 'Server error occurred. Please try again later.',
      suggestedAction: 'Contact support if the problem persists'
    };
  }
  
  if (error?.status === 403) {
    return {
      type: 'PERMISSION_DENIED',
      message: 'You do not have permission to perform this operation.',
      suggestedAction: 'Contact your administrator'
    };
  }
  
  return {
    type: 'UNKNOWN',
    message: error?.data?.message || 'An unexpected error occurred.',
    error
  };
};

// Cache management utilities
export const invalidatePhase3Cache = (tags: string[] = []) => {
  return (dispatch: any) => {
    if (tags.length === 0) {
      // Invalidate all Phase 3 cache
      dispatch(phase3Api.util.invalidateTags([
        'Analytics',
        'BulkOperation',
        'WorkflowExecution',
        'AuditTrail',
        'ComplianceReport',
        'PerformanceMetrics',
        'SyncStatus'
      ]));
    } else {
      dispatch(phase3Api.util.invalidateTags(tags));
    }
  };
};

export const preloadPhase3Data = () => {
  return async (dispatch: any) => {
    // Preload critical data for Phase 3 features
    dispatch(phase3Api.endpoints.getSyncStatus.initiate());
    dispatch(phase3Api.endpoints.getSystemHealth.initiate());
    dispatch(phase3Api.endpoints.getWorkflowDefinitions.initiate({}));
  };
};

export default phase3Api;