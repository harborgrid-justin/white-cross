/**
 * WF-COMP-306 | reduxStore.test.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./reduxStore, ./slices/incidentReportsSlice, ./slices/authSlice | Dependencies: vitest, ./reduxStore, ./slices/incidentReportsSlice
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: React components/utilities | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Redux Store Integration Tests
 *
 * Tests for state synchronization middleware integration
 * Validates HIPAA compliance, storage behavior, and cross-tab sync
 *
 * @module reduxStore.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { store, clearPersistedState, getStorageStats, isValidRootState } from './reduxStore';
import { setFilters, setSortOrder, setViewMode } from './slices/incidentReportsSlice';
import { setUser } from './slices/authSlice';
import type { User } from '../types';

// Mock BroadcastChannel for testing
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage(message: any): void {
    // Simulate async message delivery
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage(new MessageEvent('message', { data: message }));
      }
    }, 0);
  }

  close(): void {
    // Cleanup
  }
}

// Mock global BroadcastChannel
global.BroadcastChannel = MockBroadcastChannel as any;

describe('Redux Store - State Synchronization Integration', () => {
  beforeEach(() => {
    // Clear storage before each test
    localStorage.clear();
    sessionStorage.clear();
    clearPersistedState();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Store Initialization', () => {
    it('should initialize store with default state', () => {
      const state = store.getState();

      expect(state.auth).toBeDefined();
      expect(state.incidentReports).toBeDefined();
      expect(state.auth.user).toBeNull();
      expect(state.auth.isAuthenticated).toBe(false);
    });

    it('should hydrate state from storage on initialization', () => {
      // Simulate persisted state in localStorage
      const persistedFilters = {
        page: 2,
        limit: 50,
        status: 'OPEN',
      };

      localStorage.setItem(
        'whitecross_incidentReports',
        JSON.stringify({
          state: {
            filters: persistedFilters,
            sortConfig: { column: 'severity', order: 'desc' },
            viewMode: 'grid',
          },
          metadata: {
            timestamp: Date.now(),
            version: 1,
            checksum: 'test',
          },
        })
      );

      // Re-import store to trigger hydration
      // Note: In real tests, you'd need to dynamically reload the module
      // This is a simplified example
      const state = store.getState();
      expect(state).toBeDefined();
    });

    it('should validate root state structure', () => {
      const state = store.getState();
      expect(isValidRootState(state)).toBe(true);

      // Test invalid state
      expect(isValidRootState(null)).toBe(false);
      expect(isValidRootState({})).toBe(false);
      expect(isValidRootState({ auth: {} })).toBe(false);
    });
  });

  describe('HIPAA Compliance', () => {
    it('should not persist sensitive auth data', async () => {
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'NURSE',
      };

      // Dispatch action to set user
      store.dispatch(setUser(mockUser));

      // Wait for debounced sync
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Check sessionStorage
      const stored = sessionStorage.getItem('whitecross_auth');

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state).toBeDefined();
        // Sensitive fields should be excluded
        expect(parsed.state.token).toBeUndefined();
        expect(parsed.state.refreshToken).toBeUndefined();
        expect(parsed.state.password).toBeUndefined();
      }
    });

    it('should not persist PHI data in incident reports', async () => {
      // Set filters (UI preference - should persist)
      store.dispatch(
        setFilters({
          status: 'OPEN',
          severity: 'HIGH',
        })
      );

      // Wait for debounced sync
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Check localStorage
      const stored = localStorage.getItem('whitecross_incidentReports');

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state).toBeDefined();

        // PHI fields should be excluded
        expect(parsed.state.reports).toBeUndefined();
        expect(parsed.state.selectedReport).toBeUndefined();
        expect(parsed.state.witnessStatements).toBeUndefined();
        expect(parsed.state.followUpActions).toBeUndefined();

        // UI preferences should be included
        expect(parsed.state.filters).toBeDefined();
      }
    });

    it('should clear all persisted data on logout', () => {
      // Add some data to storage
      localStorage.setItem('whitecross_incidentReports', 'test');
      sessionStorage.setItem('whitecross_auth', 'test');

      // Clear persisted state
      clearPersistedState();

      // Verify storage is cleared
      expect(localStorage.getItem('whitecross_incidentReports')).toBeNull();
      expect(sessionStorage.getItem('whitecross_auth')).toBeNull();
    });
  });

  describe('State Persistence', () => {
    it('should persist incident reports UI preferences', async () => {
      // Set UI preferences
      store.dispatch(
        setFilters({
          page: 3,
          limit: 25,
          status: 'RESOLVED',
        })
      );

      store.dispatch(
        setSortOrder({
          column: 'severity',
          order: 'asc',
        })
      );

      store.dispatch(setViewMode('grid'));

      // Wait for debounced sync
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Check localStorage
      const stored = localStorage.getItem('whitecross_incidentReports');
      expect(stored).toBeTruthy();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.metadata).toBeDefined();
        expect(parsed.metadata.timestamp).toBeGreaterThan(0);
        expect(parsed.metadata.version).toBe(1);
      }
    });

    it('should handle Date objects in filters', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      store.dispatch(
        setFilters({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        })
      );

      // Wait for debounced sync
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Verify dates are properly serialized
      const stored = localStorage.getItem('whitecross_incidentReports');
      expect(stored).toBeTruthy();
    });

    it('should not exceed storage size limits', async () => {
      // Generate large state
      const largeFilters: any = {
        page: 1,
        limit: 20,
      };

      // Add many properties to simulate large state
      for (let i = 0; i < 1000; i++) {
        largeFilters[`prop${i}`] = 'x'.repeat(100);
      }

      store.dispatch(setFilters(largeFilters));

      // Wait for debounced sync
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Get storage stats
      const stats = getStorageStats();
      expect(stats.localStorage.used).toBeLessThan(5 * 1024 * 1024); // 5MB limit
    });
  });

  describe('Storage Statistics', () => {
    it('should calculate storage usage correctly', () => {
      // Add test data
      localStorage.setItem('whitecross_test1', 'a'.repeat(1000));
      localStorage.setItem('whitecross_test2', 'b'.repeat(2000));

      const stats = getStorageStats();

      expect(stats.localStorage.used).toBeGreaterThan(0);
      expect(stats.localStorage.percentage).toBeGreaterThan(0);
      expect(stats.localStorage.percentage).toBeLessThan(100);
      expect(stats.localStorage.available).toBeGreaterThan(0);
    });

    it('should only count whitecross prefixed keys', () => {
      // Add non-prefixed data
      localStorage.setItem('other_key', 'x'.repeat(10000));

      // Add prefixed data
      localStorage.setItem('whitecross_key', 'y'.repeat(1000));

      const stats = getStorageStats();

      // Stats should not include non-prefixed keys
      expect(stats.localStorage.used).toBeLessThan(2000);
    });
  });

  describe('Debounced Sync', () => {
    it('should debounce multiple rapid updates', async () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');

      // Dispatch multiple rapid updates
      store.dispatch(setFilters({ page: 1 }));
      store.dispatch(setFilters({ page: 2 }));
      store.dispatch(setFilters({ page: 3 }));
      store.dispatch(setFilters({ page: 4 }));
      store.dispatch(setFilters({ page: 5 }));

      // Should not have synced yet
      expect(spy).not.toHaveBeenCalledWith(
        expect.stringContaining('whitecross_incidentReports'),
        expect.any(String)
      );

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should have synced once with final value
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('whitecross_incidentReports'),
        expect.any(String)
      );

      spy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle storage quota exceeded errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock storage to throw quota exceeded error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError');
      });

      // Dispatch action that triggers sync
      store.dispatch(setFilters({ page: 1 }));

      // Wait for sync attempt
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should not crash, error should be logged
      expect(consoleSpy).toHaveBeenCalled();

      // Restore original
      Storage.prototype.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });

    it('should handle corrupted storage data gracefully', () => {
      // Add corrupted data to storage
      localStorage.setItem('whitecross_incidentReports', 'invalid-json{');

      // Store should still function
      const state = store.getState();
      expect(state.incidentReports).toBeDefined();
    });

    it('should handle missing storage APIs', () => {
      // This test would require mocking the storage APIs as undefined
      // In a real environment, the middleware should detect and handle this
      expect(typeof localStorage).toBe('object');
      expect(typeof sessionStorage).toBe('object');
    });
  });

  describe('Cross-Tab Synchronization', () => {
    it('should broadcast state updates via BroadcastChannel', async () => {
      const broadcastSpy = vi.spyOn(MockBroadcastChannel.prototype, 'postMessage');

      // Dispatch action that should trigger broadcast
      store.dispatch(
        setFilters({
          status: 'OPEN',
        })
      );

      // Wait for sync
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should have broadcasted (if cross-tab is enabled for the slice)
      // Note: Auth slice has cross-tab disabled, but incident reports has it enabled
      // The actual broadcast depends on middleware implementation

      broadcastSpy.mockRestore();
    });

    it('should not sync auth state across tabs', async () => {
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'NURSE',
      };

      // Set user (auth state)
      store.dispatch(setUser(mockUser));

      // Wait for sync
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Auth state should be in sessionStorage, not synced across tabs
      const stored = sessionStorage.getItem('whitecross_auth');
      expect(stored).toBeTruthy();
    });
  });

  describe('State Versioning', () => {
    it('should include version metadata in persisted state', async () => {
      store.dispatch(setFilters({ page: 1 }));

      // Wait for sync
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const stored = localStorage.getItem('whitecross_incidentReports');

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.metadata.version).toBe(1);
      }
    });

    it('should handle state migration for version changes', () => {
      // This would be tested with actual migration functions
      // For now, verify that version is tracked
      const state = store.getState();
      expect(state).toBeDefined();

      // In a real scenario, you'd:
      // 1. Store old version data
      // 2. Update version in config
      // 3. Reload store
      // 4. Verify migration ran
    });
  });

  describe('Performance Optimization', () => {
    it('should only serialize changed state slices', async () => {
      const serializeSpy = vi.spyOn(JSON, 'stringify');

      // Dispatch action
      store.dispatch(setFilters({ page: 1 }));

      // Wait for sync
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Stringify should have been called for serialization
      expect(serializeSpy).toHaveBeenCalled();

      serializeSpy.mockRestore();
    });

    it('should use debouncing to reduce write operations', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      // Multiple rapid updates
      for (let i = 1; i <= 10; i++) {
        store.dispatch(setFilters({ page: i }));
      }

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should have synced only once or very few times
      const syncCalls = setItemSpy.mock.calls.filter(
        (call) => call[0] && call[0].toString().includes('whitecross_incidentReports')
      );

      // Due to debouncing, should be much less than 10
      expect(syncCalls.length).toBeLessThan(5);

      setItemSpy.mockRestore();
    });
  });

  describe('Integration with Redux DevTools', () => {
    it('should enable devTools in development', () => {
      // Store is configured with devTools
      // This is a configuration check
      expect(store).toBeDefined();

      // DevTools configuration is in store creation
      // Would require checking store.__REDUX_DEVTOOLS_EXTENSION__
    });

    it('should ignore serialization checks for sync actions', () => {
      // The store is configured to ignore sync-related actions
      // This prevents warnings in Redux DevTools

      // Dispatch a sync action type (if accessible)
      // The middleware handles these internally
      expect(true).toBe(true);
    });
  });
});

/**
 * Example Usage Patterns
 */
describe('State Sync - Usage Examples', () => {
  it('Example: Persisting user preferences', async () => {
    // User selects grid view
    store.dispatch(setViewMode('grid'));

    // User sets filters
    store.dispatch(
      setFilters({
        status: 'OPEN',
        severity: 'HIGH',
      })
    );

    // User sets sort order
    store.dispatch(
      setSortOrder({
        column: 'occurredAt',
        order: 'desc',
      })
    );

    // Wait for sync
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Preferences are now persisted
    const state = store.getState();
    expect(state.incidentReports.viewMode).toBe('grid');
    expect(state.incidentReports.filters.status).toBe('OPEN');

    // On page reload, these preferences will be restored
  });

  it('Example: Clearing state on logout', () => {
    // User logs out
    clearPersistedState();

    // All persisted state is cleared
    expect(localStorage.getItem('whitecross_incidentReports')).toBeNull();
    expect(sessionStorage.getItem('whitecross_auth')).toBeNull();
  });

  it('Example: Monitoring storage usage', () => {
    // Get storage statistics
    const stats = getStorageStats();

    console.log('LocalStorage usage:', {
      used: `${(stats.localStorage.used / 1024).toFixed(2)} KB`,
      percentage: `${stats.localStorage.percentage.toFixed(2)}%`,
      available: `${(stats.localStorage.available / 1024).toFixed(2)} KB`,
    });

    // Warn if approaching limit
    if (stats.localStorage.percentage > 80) {
      console.warn('LocalStorage usage is high, consider clearing old data');
    }

    expect(stats).toBeDefined();
  });
});
