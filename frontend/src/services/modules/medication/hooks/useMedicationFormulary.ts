/**
 * WF-COMP-287 | useMedicationFormulary.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../api | Dependencies: @tanstack/react-query, ../api
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, functions, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Medication Formulary Hook
 *
 * Purpose: React Query integration for medication formulary operations
 *
 * Caching Strategy:
 * - Formulary search: 24 hours (rarely changes)
 * - Drug monographs: 1 week
 * - Barcode scans: No cache (always fresh)
 * - LASA warnings: 24 hours
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { medicationFormularyApi } from '../api';
import type {
  Medication,
  FormularyFilters,
  DrugInteraction,
  DrugMonograph,
  BarcodeResult,
  LASAMedication,
} from '../api';

// Query Keys
export const formularyKeys = {
  all: ['medication-formulary'] as const,
  lists: () => [...formularyKeys.all, 'list'] as const,
  list: (filters?: FormularyFilters) => [...formularyKeys.lists(), filters] as const,
  details: () => [...formularyKeys.all, 'detail'] as const,
  detail: (id: string) => [...formularyKeys.details(), id] as const,
  search: (query: string) => [...formularyKeys.all, 'search', query] as const,
  ndc: (ndc: string) => [...formularyKeys.all, 'ndc', ndc] as const,
  interactions: (ids: string[]) => [...formularyKeys.all, 'interactions', ids] as const,
  monograph: (id: string) => [...formularyKeys.all, 'monograph', id] as const,
  alternatives: (id: string) => [...formularyKeys.all, 'alternatives', id] as const,
  lasa: (id: string) => [...formularyKeys.all, 'lasa', id] as const,
  categories: () => [...formularyKeys.all, 'categories'] as const,
  forms: () => [...formularyKeys.all, 'forms'] as const,
} as const;

// Hook Return Type
export interface UseMedicationFormularyReturn {
  // Query results
  searchFormulary: ReturnType<typeof useQuery<any>>;
  // getMedicationById: (id: string) => ReturnType<typeof useQuery<Medication>>; // Commented out - violates Rules of Hooks

  // Mutations
  scanBarcode: ReturnType<typeof useMutation<BarcodeResult, Error, string>>;
  checkInteractions: ReturnType<typeof useMutation<DrugInteraction[], Error, string[]>>;
  createMedication: ReturnType<typeof useMutation<Medication, Error, any>>;
  updateMedication: ReturnType<typeof useMutation<Medication, Error, { id: string; data: any }>>;
  deactivateMedication: ReturnType<typeof useMutation<void, Error, { id: string; reason: string }>>;

  // Helper functions
  invalidateFormulary: () => Promise<void>;
}

/**
 * Medication Formulary Hook
 */
export function useMedicationFormulary(options?: {
  searchQuery?: string;
  filters?: FormularyFilters;
}): UseMedicationFormularyReturn {
  const queryClient = useQueryClient();

  // Search formulary
  const searchFormulary = useQuery({
    queryKey: formularyKeys.search(options?.searchQuery || ''),
    queryFn: () => medicationFormularyApi.searchFormulary(options?.searchQuery || '', options?.filters),
    enabled: !!options?.searchQuery && options.searchQuery.length >= 2,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days (cache time)
  });

  // Get medication by ID (factory function)
  // Note: This factory function pattern violates Rules of Hooks
  // TODO: Refactor to use a separate custom hook like `useMedicationById(id)`
  // const getMedicationById = (id: string) => {
  //   return useQuery({
  //     queryKey: formularyKeys.detail(id),
  //     queryFn: () => medicationFormularyApi.getMedicationById(id),
  //     enabled: !!id,
  //     staleTime: 24 * 60 * 60 * 1000, // 24 hours
  //   });
  // };

  // Scan barcode (mutation - no cache)
  const scanBarcode = useMutation({
    mutationFn: (barcode: string) => medicationFormularyApi.getMedicationByBarcode(barcode),
    onSuccess: (data) => {
      // Cache the medication if found
      if (data.medication) {
        queryClient.setQueryData(
          formularyKeys.detail(data.medication.id),
          data.medication
        );
      }
    },
  });

  // Check drug interactions
  const checkInteractions = useMutation({
    mutationFn: (medicationIds: string[]) => medicationFormularyApi.checkDrugInteractions(medicationIds),
    onSuccess: (data, variables) => {
      // Cache interaction results
      queryClient.setQueryData(
        formularyKeys.interactions(variables),
        data
      );
    },
  });

  // Create medication (admin only)
  const createMedication = useMutation({
    mutationFn: (data: any) => medicationFormularyApi.createMedication(data),
    onSuccess: (newMedication) => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: formularyKeys.lists() });

      // Add to cache
      queryClient.setQueryData(
        formularyKeys.detail(newMedication.id),
        newMedication
      );

      // Invalidate categories if changed
      queryClient.invalidateQueries({ queryKey: formularyKeys.categories() });
    },
  });

  // Update medication (admin only)
  const updateMedication = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      medicationFormularyApi.updateMedication(id, data),
    onSuccess: (updatedMedication, variables) => {
      // Update cache
      queryClient.setQueryData(
        formularyKeys.detail(variables.id),
        updatedMedication
      );

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: formularyKeys.lists() });
    },
  });

  // Deactivate medication (admin only)
  const deactivateMedication = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      medicationFormularyApi.deactivateMedication(id, reason),
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: formularyKeys.detail(variables.id) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: formularyKeys.lists() });
    },
  });

  // Helper: Invalidate all formulary data
  const invalidateFormulary = async () => {
    await queryClient.invalidateQueries({ queryKey: formularyKeys.all });
  };

  return {
    searchFormulary,
    // getMedicationById, // Commented out - violates Rules of Hooks
    scanBarcode,
    checkInteractions,
    createMedication,
    updateMedication,
    deactivateMedication,
    invalidateFormulary,
  };
}

/**
 * Get drug monograph hook
 */
export function useDrugMonograph(medicationId: string | undefined) {
  return useQuery({
    queryKey: formularyKeys.monograph(medicationId!),
    queryFn: () => medicationFormularyApi.getDrugMonograph(medicationId!),
    enabled: !!medicationId,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 1 week
    gcTime: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

/**
 * Get alternative medications hook
 */
export function useAlternativeMedications(medicationId: string | undefined) {
  return useQuery({
    queryKey: formularyKeys.alternatives(medicationId!),
    queryFn: () => medicationFormularyApi.getAlternativeMedications(medicationId!),
    enabled: !!medicationId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * Get LASA warnings hook
 * CRITICAL SAFETY FEATURE
 */
export function useLASAWarnings(medicationId: string | undefined) {
  return useQuery({
    queryKey: formularyKeys.lasa(medicationId!),
    queryFn: () => medicationFormularyApi.checkLASAMedications(medicationId!),
    enabled: !!medicationId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    // Show warnings immediately
    refetchOnMount: true,
  });
}

/**
 * Get medication categories
 */
export function useMedicationCategories() {
  return useQuery({
    queryKey: formularyKeys.categories(),
    queryFn: () => medicationFormularyApi.getCategories(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

/**
 * Get medication forms
 */
export function useMedicationForms() {
  return useQuery({
    queryKey: formularyKeys.forms(),
    queryFn: () => medicationFormularyApi.getForms(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
