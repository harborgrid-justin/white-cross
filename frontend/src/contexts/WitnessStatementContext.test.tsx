/**
 * Witness Statement Context Tests
 *
 * Comprehensive test suite for WitnessStatementContext
 * Tests CRUD operations, optimistic updates, error handling, and state management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  WitnessStatementProvider,
  useWitnessStatements
} from './WitnessStatementContext';
import { incidentReportsApi } from '../services/modules/incidentReportsApi';
import { WitnessType } from '../types/incidents';
import type { WitnessStatement } from '../types/incidents';

// Mock the API module
vi.mock('../services/modules/incidentReportsApi');

// Mock toast utilities
vi.mock('../utils/toast', () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn(),
}));

// ==========================================
// TEST SETUP
// ==========================================

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {}, // Suppress error logs in tests
  },
});

const createWrapper = (queryClient: QueryClient, incidentId?: string) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <WitnessStatementProvider incidentId={incidentId}>
        {children}
      </WitnessStatementProvider>
    </QueryClientProvider>
  );
};

// Mock witness statement data
const mockStatement: WitnessStatement = {
  id: '1',
  incidentReportId: 'incident-1',
  witnessName: 'John Doe',
  witnessType: WitnessType.STAFF,
  witnessContact: 'john.doe@example.com',
  statement: 'I witnessed the incident occur in the hallway.',
  verified: false,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

const mockVerifiedStatement: WitnessStatement = {
  ...mockStatement,
  id: '2',
  verified: true,
  verifiedBy: 'admin-1',
  verifiedAt: '2024-01-15T11:00:00Z',
};

// ==========================================
// TESTS
// ==========================================

describe('WitnessStatementContext', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  // ==========================================
  // HOOK USAGE VALIDATION
  // ==========================================

  describe('Hook Usage', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useWitnessStatements());
      }).toThrow('useWitnessStatements must be used within a WitnessStatementProvider');

      consoleError.mockRestore();
    });

    it('should provide context value when used within provider', () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.statements).toEqual([]);
      expect(result.current.loadWitnessStatements).toBeInstanceOf(Function);
      expect(result.current.createWitnessStatement).toBeInstanceOf(Function);
    });
  });

  // ==========================================
  // INITIAL STATE
  // ==========================================

  describe('Initial State', () => {
    it('should initialize with empty state', () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      expect(result.current.statements).toEqual([]);
      expect(result.current.selectedStatement).toBeNull();
      expect(result.current.currentIncidentId).toBeNull();
      expect(result.current.formState).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should initialize with provided incident ID', () => {
      const incidentId = 'incident-1';
      const wrapper = createWrapper(queryClient, incidentId);
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      expect(result.current.currentIncidentId).toBe(incidentId);
    });
  });

  // ==========================================
  // LOADING STATEMENTS
  // ==========================================

  describe('Load Witness Statements', () => {
    it('should load statements for incident', async () => {
      const mockStatements = [mockStatement, mockVerifiedStatement];
      vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValue({
        statements: mockStatements,
      });

      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      act(() => {
        result.current.loadWitnessStatements('incident-1');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.statements).toEqual(mockStatements);
      expect(incidentReportsApi.getWitnessStatements).toHaveBeenCalledWith('incident-1');
    });

    it('should handle loading errors', async () => {
      const error = new Error('Failed to load statements');
      vi.mocked(incidentReportsApi.getWitnessStatements).mockRejectedValue(error);

      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      act(() => {
        result.current.loadWitnessStatements('incident-1');
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });
    });
  });

  // ==========================================
  // CREATE STATEMENT
  // ==========================================

  describe('Create Witness Statement', () => {
    it('should create new statement successfully', async () => {
      const newStatementData = {
        incidentReportId: 'incident-1',
        witnessName: 'Jane Smith',
        witnessType: WitnessType.STUDENT,
        statement: 'I saw what happened.',
      };

      const createdStatement: WitnessStatement = {
        ...newStatementData,
        id: '3',
        verified: false,
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
      };

      vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValue({
        statements: [mockStatement],
      });

      vi.mocked(incidentReportsApi.addWitnessStatement).mockResolvedValue({
        statement: createdStatement,
      });

      const wrapper = createWrapper(queryClient, 'incident-1');
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let createdResult: WitnessStatement | undefined;

      await act(async () => {
        createdResult = await result.current.createWitnessStatement(newStatementData);
      });

      expect(createdResult).toEqual(createdStatement);
      expect(incidentReportsApi.addWitnessStatement).toHaveBeenCalledWith(newStatementData);
    });

    it('should handle create errors', async () => {
      const error = new Error('Failed to create statement');
      vi.mocked(incidentReportsApi.addWitnessStatement).mockRejectedValue(error);

      const wrapper = createWrapper(queryClient, 'incident-1');
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(async () => {
        await act(async () => {
          await result.current.createWitnessStatement({
            incidentReportId: 'incident-1',
            witnessName: 'Test',
            witnessType: WitnessType.STAFF,
            statement: 'Test statement',
          });
        });
      }).rejects.toThrow('Failed to create statement');
    });
  });

  // ==========================================
  // UPDATE STATEMENT
  // ==========================================

  describe('Update Witness Statement', () => {
    it('should update statement successfully', async () => {
      const updateData = {
        statement: 'Updated statement text',
      };

      const updatedStatement: WitnessStatement = {
        ...mockStatement,
        ...updateData,
        updatedAt: '2024-01-15T13:00:00Z',
      };

      vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValue({
        statements: [mockStatement],
      });

      vi.mocked(incidentReportsApi.updateWitnessStatement).mockResolvedValue({
        statement: updatedStatement,
      });

      const wrapper = createWrapper(queryClient, 'incident-1');
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let updatedResult: WitnessStatement | undefined;

      await act(async () => {
        updatedResult = await result.current.updateWitnessStatement('1', updateData);
      });

      expect(updatedResult).toEqual(updatedStatement);
      expect(incidentReportsApi.updateWitnessStatement).toHaveBeenCalledWith('1', updateData);
    });
  });

  // ==========================================
  // DELETE STATEMENT
  // ==========================================

  describe('Delete Witness Statement', () => {
    it('should delete statement successfully', async () => {
      vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValue({
        statements: [mockStatement, mockVerifiedStatement],
      });

      vi.mocked(incidentReportsApi.deleteWitnessStatement).mockResolvedValue({
        success: true,
      });

      const wrapper = createWrapper(queryClient, 'incident-1');
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.deleteWitnessStatement('1');
      });

      expect(incidentReportsApi.deleteWitnessStatement).toHaveBeenCalledWith('1');
    });

    it('should clear selected statement when deleting it', async () => {
      vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValue({
        statements: [mockStatement],
      });

      vi.mocked(incidentReportsApi.deleteWitnessStatement).mockResolvedValue({
        success: true,
      });

      const wrapper = createWrapper(queryClient, 'incident-1');
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.setSelectedStatement(mockStatement);
      });

      expect(result.current.selectedStatement).toEqual(mockStatement);

      await act(async () => {
        await result.current.deleteWitnessStatement('1');
      });

      await waitFor(() => {
        expect(result.current.selectedStatement).toBeNull();
      });
    });
  });

  // ==========================================
  // VERIFY/UNVERIFY STATEMENT
  // ==========================================

  describe('Verify Witness Statement', () => {
    it('should verify statement successfully', async () => {
      const verifiedStatement: WitnessStatement = {
        ...mockStatement,
        verified: true,
        verifiedBy: 'admin-1',
        verifiedAt: '2024-01-15T14:00:00Z',
      };

      vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValue({
        statements: [mockStatement],
      });

      vi.mocked(incidentReportsApi.verifyWitnessStatement).mockResolvedValue({
        statement: verifiedStatement,
      });

      const wrapper = createWrapper(queryClient, 'incident-1');
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let verifiedResult: WitnessStatement | undefined;

      await act(async () => {
        verifiedResult = await result.current.verifyStatement('1');
      });

      expect(verifiedResult).toEqual(verifiedStatement);
      expect(incidentReportsApi.verifyWitnessStatement).toHaveBeenCalledWith('1');
    });

    it('should unverify statement successfully', async () => {
      const unverifiedStatement: WitnessStatement = {
        ...mockVerifiedStatement,
        verified: false,
        verifiedBy: undefined,
        verifiedAt: undefined,
      };

      vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValue({
        statements: [mockVerifiedStatement],
      });

      vi.mocked(incidentReportsApi.updateWitnessStatement).mockResolvedValue({
        statement: unverifiedStatement,
      });

      const wrapper = createWrapper(queryClient, 'incident-1');
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let unverifiedResult: WitnessStatement | undefined;

      await act(async () => {
        unverifiedResult = await result.current.unverifyStatement('2');
      });

      expect(unverifiedResult).toEqual(unverifiedStatement);
      expect(incidentReportsApi.updateWitnessStatement).toHaveBeenCalledWith('2', {
        verified: false,
      });
    });
  });

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================

  describe('State Management', () => {
    it('should set and clear selected statement', () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      act(() => {
        result.current.setSelectedStatement(mockStatement);
      });

      expect(result.current.selectedStatement).toEqual(mockStatement);

      act(() => {
        result.current.clearSelectedStatement();
      });

      expect(result.current.selectedStatement).toBeNull();
    });

    it('should set and clear form state', () => {
      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      const formData = {
        witnessName: 'Test Witness',
        witnessType: WitnessType.PARENT,
      };

      act(() => {
        result.current.setFormState(formData);
      });

      expect(result.current.formState).toEqual(formData);

      act(() => {
        result.current.clearFormState();
      });

      expect(result.current.formState).toBeNull();
    });
  });

  // ==========================================
  // OPERATION LOADING STATES
  // ==========================================

  describe('Operation Loading States', () => {
    it('should track create operation loading state', async () => {
      vi.mocked(incidentReportsApi.addWitnessStatement).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      const wrapper = createWrapper(queryClient, 'incident-1');
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      expect(result.current.operationLoading.create).toBe(false);

      act(() => {
        result.current.createWitnessStatement({
          incidentReportId: 'incident-1',
          witnessName: 'Test',
          witnessType: WitnessType.STAFF,
          statement: 'Test',
        });
      });

      await waitFor(() => {
        expect(result.current.operationLoading.create).toBe(true);
      });
    });
  });

  // ==========================================
  // REFETCH FUNCTIONALITY
  // ==========================================

  describe('Refetch Functionality', () => {
    it('should refetch statements on demand', async () => {
      const mockStatements = [mockStatement];
      vi.mocked(incidentReportsApi.getWitnessStatements).mockResolvedValue({
        statements: mockStatements,
      });

      const wrapper = createWrapper(queryClient, 'incident-1');
      const { result } = renderHook(() => useWitnessStatements(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(incidentReportsApi.getWitnessStatements).toHaveBeenCalledTimes(1);

      await act(async () => {
        await result.current.refetch();
      });

      expect(incidentReportsApi.getWitnessStatements).toHaveBeenCalledTimes(2);
    });
  });
});
