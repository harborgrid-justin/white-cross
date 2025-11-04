/**
 * Query Keys Factory for Vendor Domain
 *
 * Provides hierarchical query keys that enable efficient cache invalidation
 * and automatic refetching. Keys are structured from general to specific
 * to allow invalidating entire categories or specific items.
 *
 * @module hooks/domains/vendors/query-keys
 *
 * @example
 * ```typescript
 * // Invalidate all vendor queries
 * queryClient.invalidateQueries({ queryKey: vendorKeys.all });
 *
 * // Invalidate specific vendor
 * queryClient.invalidateQueries({ queryKey: vendorKeys.detail('vendor-123') });
 *
 * // Invalidate vendor contracts
 * queryClient.invalidateQueries({ queryKey: vendorKeys.contracts('vendor-123') });
 *
 * // Query with filters
 * const queryKey = vendorKeys.list({ status: 'ACTIVE', type: 'SUPPLIER' });
 * ```
 *
 * @remarks
 * Key hierarchy enables efficient invalidation:
 * - vendorKeys.all → Invalidates ALL vendor queries
 * - vendorKeys.list(filters) → Specific filtered lists
 * - vendorKeys.detail(id) → Individual vendor details
 * - vendorKeys.contracts(vendorId) → Vendor-specific contracts
 *
 * @since 1.0.0
 */
export const vendorKeys = {
  all: ['vendors'] as const,
  list: (filters?: any) => [...vendorKeys.all, 'list', filters] as const,
  paginated: (filters?: any) => [...vendorKeys.all, 'paginated', filters] as const,
  detail: (id: string) => [...vendorKeys.all, 'detail', id] as const,
  analytics: (vendorId: string, period?: string) => [...vendorKeys.all, 'analytics', vendorId, period] as const,
  performance: (vendorId: string) => [...vendorKeys.all, 'performance', vendorId] as const,

  // Contracts
  contracts: (vendorId?: string) => [...vendorKeys.all, 'contracts', vendorId] as const,
  contract: (contractId: string) => [...vendorKeys.all, 'contract', contractId] as const,

  // Evaluations
  evaluations: (vendorId?: string) => [...vendorKeys.all, 'evaluations', vendorId] as const,
  evaluation: (evaluationId: string) => [...vendorKeys.all, 'evaluation', evaluationId] as const,

  // Documents
  documents: (vendorId: string) => [...vendorKeys.all, 'documents', vendorId] as const,

  // Payments
  payments: (vendorId?: string) => [...vendorKeys.all, 'payments', vendorId] as const,
} as const;
