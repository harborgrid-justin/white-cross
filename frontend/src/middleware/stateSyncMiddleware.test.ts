/**
 * WF-COMP-152 | stateSyncMiddleware.test.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ./stateSyncMiddleware | Dependencies: vitest, @reduxjs/toolkit, ./stateSyncMiddleware
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: React components/utilities | Key Features: arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * State Synchronization Middleware - Unit Tests
 *
 * Comprehensive test suite for state sync middleware functionality
 *
 * @module stateSyncMiddleware.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { AnyAction, Reducer } from '@reduxjs/toolkit';
import {
  createStateSyncMiddleware,
  loadInitialState,
  manualSync,
  clearSyncedState,
  SyncStrategy,
  ConflictStrategy,
  type StateSyncConfig,
  type StateSerializer,
} from './stateSyncMiddleware';

/* ============================================================================
 * TEST SETUP
 * ========================================================================== */

// Mock state interface
interface TestState {
  auth: {
    isAuthenticated: boolean;
    user: string | null;
    token: string | null;
  };
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
  };
}

// Mock reducer
const mockReducer: Reducer<TestState> = (
  state = {
    auth: {
      isAuthenticated: false,
      user: null,
      token: null,
    },
    ui: {
      theme: 'light',
      sidebarOpen: true,
    },
  },
  action: AnyAction
): TestState => {
  switch (action.type) {
    case 'auth/login':
      return {
        ...state,
        auth: {
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
        },
      };
    case 'ui/setTheme':
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload,
        },
      };
    case 'ui/toggleSidebar':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };
    default:
      return state;
  }
};

// Mock storage
class MockStorage implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] || null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

// Setup mock storage
let mockLocalStorage: MockStorage;
let mockSessionStorage: MockStorage;

beforeEach(() => {
  mockLocalStorage = new MockStorage();
  mockSessionStorage = new MockStorage();

  // Mock window.localStorage and window.sessionStorage
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
    writable: true,
  });

  // Mock BroadcastChannel
  global.BroadcastChannel = vi.fn().mockImplementation(() => ({
    postMessage: vi.fn(),
    close: vi.fn(),
    onmessage: null,
    onmessageerror: null,
  })) as any;
});

afterEach(() => {
  mockLocalStorage.clear();
  mockSessionStorage.clear();
  vi.clearAllTimers();
});

/* ============================================================================
 * BASIC FUNCTIONALITY TESTS
 * ========================================================================== */

describe('State Sync Middleware - Basic Functionality', () => {
  it('should create middleware without errors', () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'auth' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
        },
      ],
    };

    expect(() => createStateSyncMiddleware(config)).not.toThrow();
  });

  it('should persist state to localStorage immediately', async () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'auth' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
        },
      ],
      storagePrefix: 'test',
    };

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    // Dispatch action
    store.dispatch({
      type: 'auth/login',
      payload: { user: 'testuser', token: 'testtoken' },
    });

    // Check localStorage immediately (IMMEDIATE strategy)
    await new Promise(resolve => setTimeout(resolve, 50));
    const stored = mockLocalStorage.getItem('test_auth');
    expect(stored).not.toBeNull();
  });

  it('should exclude sensitive paths from persistence', async () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'auth' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
          excludePaths: ['token'],
        },
      ],
      storagePrefix: 'test',
    };

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    store.dispatch({
      type: 'auth/login',
      payload: { user: 'testuser', token: 'secret-token' },
    });

    await new Promise(resolve => setTimeout(resolve, 50));
    const stored = mockLocalStorage.getItem('test_auth');
    expect(stored).not.toBeNull();

    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.token).toBeUndefined();
      expect(parsed.state.user).toBe('testuser');
    }
  });
});

/* ============================================================================
 * SYNC STRATEGY TESTS
 * ========================================================================== */

describe('State Sync Middleware - Sync Strategies', () => {
  it('should sync immediately with IMMEDIATE strategy', async () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
        },
      ],
      storagePrefix: 'test',
    };

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    store.dispatch({ type: 'ui/setTheme', payload: 'dark' });

    // Should be available immediately
    await new Promise(resolve => setTimeout(resolve, 
      const stored = mockLocalStorage.getItem('test_ui');
      expect(stored).not.toBeNull();
      ;
    }, 10);
  });

  it('should debounce syncs with DEBOUNCED strategy', async () => {
    vi.useFakeTimers();

    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.DEBOUNCED,
          debounceDelay: 500,
        },
      ],
      storagePrefix: 'test',
    };

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    // Dispatch multiple actions rapidly
    store.dispatch({ type: 'ui/setTheme', payload: 'dark' });
    store.dispatch({ type: 'ui/toggleSidebar' });
    store.dispatch({ type: 'ui/setTheme', payload: 'light' });

    // Should not be available immediately
    expect(mockLocalStorage.getItem('test_ui')).toBeNull();

    // Fast forward time
    vi.advanceTimersByTime(500);

    // Should be available after debounce delay
    await new Promise(resolve => setTimeout(resolve, 
      const stored = mockLocalStorage.getItem('test_ui');
      expect(stored).not.toBeNull();
      vi.useRealTimers();
      ;
    }, 10);
  });

  it('should throttle syncs with THROTTLED strategy', async () => {
    vi.useFakeTimers();

    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.THROTTLED,
          throttleDelay: 1000,
        },
      ],
      storagePrefix: 'test',
    };

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    // First action should sync immediately
    store.dispatch({ type: 'ui/setTheme', payload: 'dark' });

    vi.advanceTimersByTime(100);

    // Subsequent actions within throttle window should be delayed
    store.dispatch({ type: 'ui/toggleSidebar' });
    store.dispatch({ type: 'ui/setTheme', payload: 'light' });

    // Advance past throttle delay
    vi.advanceTimersByTime(1000);

    await new Promise(resolve => setTimeout(resolve, 
      const stored = mockLocalStorage.getItem('test_ui');
      expect(stored).not.toBeNull();
      vi.useRealTimers();
      ;
    }, 10);
  });

  it('should not sync with MANUAL strategy', async () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.MANUAL,
        },
      ],
      storagePrefix: 'test',
    };

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    store.dispatch({ type: 'ui/setTheme', payload: 'dark' });

    await new Promise(resolve => setTimeout(resolve, 
      // Should not be synced automatically
      expect(mockLocalStorage.getItem('test_ui')).toBeNull();
      ;
    }, 100);
  });
});

/* ============================================================================
 * STATE HYDRATION TESTS
 * ========================================================================== */

describe('State Sync Middleware - State Hydration', () => {
  it('should load initial state from storage', () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
        },
      ],
      storagePrefix: 'test',
    };

    // Pre-populate storage
    const mockState = {
      theme: 'dark',
      sidebarOpen: false,
    };

    mockLocalStorage.setItem(
      'test_ui',
      JSON.stringify({
        state: mockState,
        metadata: {
          timestamp: Date.now(),
          version: 1,
        },
      })
    );

    // Load initial state
    const initialState = loadInitialState(config);

    expect(initialState).toHaveProperty('ui');
    expect((initialState as any).ui.theme).toBe('dark');
    expect((initialState as any).ui.sidebarOpen).toBe(false);
  });

  it('should ignore stale state', () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
          maxAge: 1000, // 1 second max age
        },
      ],
      storagePrefix: 'test',
    };

    // Pre-populate storage with old timestamp
    mockLocalStorage.setItem(
      'test_ui',
      JSON.stringify({
        state: { theme: 'dark', sidebarOpen: false },
        metadata: {
          timestamp: Date.now() - 2000, // 2 seconds ago
          version: 1,
        },
      })
    );

    const initialState = loadInitialState(config);

    // Should not load stale state
    expect(initialState).not.toHaveProperty('ui');
  });

  it('should handle corrupted state gracefully', () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
        },
      ],
      storagePrefix: 'test',
      debug: false,
    };

    // Pre-populate storage with invalid JSON
    mockLocalStorage.setItem('test_ui', 'invalid-json');

    const initialState = loadInitialState(config);

    // Should not crash and should return empty initial state
    expect(initialState).toEqual({});
  });
});

/* ============================================================================
 * SERIALIZATION TESTS
 * ========================================================================== */

describe('State Sync Middleware - Custom Serializers', () => {
  it('should use custom serializer', async () => {
    const customSerializer: StateSerializer = {
      serialize: (state: any) => {
        return `CUSTOM:${JSON.stringify(state)}`;
      },
      deserialize: (data: string) => {
        return JSON.parse(data.replace('CUSTOM:', ''));
      },
    };

    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
          serializer: customSerializer,
        },
      ],
      storagePrefix: 'test',
    };

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    store.dispatch({ type: 'ui/setTheme', payload: 'dark' });

    await new Promise(resolve => setTimeout(resolve, 
      const stored = mockLocalStorage.getItem('test_ui');
      expect(stored).not.toBeNull();

      if (stored) {
        const parsed = JSON.parse(stored);
        // The state should be serialized with custom serializer
        expect(parsed.state).toContain('CUSTOM:');
      }
      ;
    }, 50);
  });
});

/* ============================================================================
 * MANUAL SYNC TESTS
 * ========================================================================== */

describe('State Sync Middleware - Manual Sync', () => {
  it('should manually sync state', () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.MANUAL,
        },
      ],
      storagePrefix: 'test',
    };

    const state = {
      theme: 'dark',
      sidebarOpen: false,
    };

    manualSync('ui' as any, state, config);

    const stored = mockLocalStorage.getItem('test_ui');
    expect(stored).not.toBeNull();

    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.state.theme).toBe('dark');
    }
  });
});

/* ============================================================================
 * CLEAR STATE TESTS
 * ========================================================================== */

describe('State Sync Middleware - Clear State', () => {
  it('should clear all synced state', () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'auth' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
        },
        {
          sliceName: 'ui' as any,
          storage: 'sessionStorage',
          strategy: SyncStrategy.IMMEDIATE,
        },
      ],
      storagePrefix: 'test',
    };

    // Pre-populate storage
    mockLocalStorage.setItem('test_auth', JSON.stringify({ test: 'data' }));
    mockSessionStorage.setItem('test_ui', JSON.stringify({ test: 'data' }));

    expect(mockLocalStorage.getItem('test_auth')).not.toBeNull();
    expect(mockSessionStorage.getItem('test_ui')).not.toBeNull();

    clearSyncedState(config);

    expect(mockLocalStorage.getItem('test_auth')).toBeNull();
    expect(mockSessionStorage.getItem('test_ui')).toBeNull();
  });
});

/* ============================================================================
 * ERROR HANDLING TESTS
 * ========================================================================== */

describe('State Sync Middleware - Error Handling', () => {
  it('should call onError callback on sync failure', async () => {
    const onError = vi.fn();

    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
        },
      ],
      storagePrefix: 'test',
      onError,
    };

    // Mock storage to throw error
    mockLocalStorage.setItem = vi.fn().mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    store.dispatch({ type: 'ui/setTheme', payload: 'dark' });

    await new Promise(resolve => setTimeout(resolve, 
      expect(onError).toHaveBeenCalled();
      ;
    }, 50);
  });

  it('should handle storage size limits', async () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'localStorage',
          strategy: SyncStrategy.IMMEDIATE,
        },
      ],
      storagePrefix: 'test',
      maxStorageSize: 10, // Very small limit
    };

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    store.dispatch({ type: 'ui/setTheme', payload: 'dark' });

    await new Promise(resolve => setTimeout(resolve, 
      // Should not store due to size limit
      const stored = mockLocalStorage.getItem('test_ui');
      expect(stored).toBeNull();
      ;
    }, 50);
  });
});

/* ============================================================================
 * STORAGE TYPE TESTS
 * ========================================================================== */

describe('State Sync Middleware - Storage Types', () => {
  it('should sync to sessionStorage', async () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'auth' as any,
          storage: 'sessionStorage',
          strategy: SyncStrategy.IMMEDIATE,
        },
      ],
      storagePrefix: 'test',
    };

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    store.dispatch({
      type: 'auth/login',
      payload: { user: 'testuser', token: 'testtoken' },
    });

    await new Promise(resolve => setTimeout(resolve, 
      expect(mockSessionStorage.getItem('test_auth')).not.toBeNull();
      expect(mockLocalStorage.getItem('test_auth')).toBeNull();
      ;
    }, 50);
  });

  it('should not sync with "none" storage type', async () => {
    const config: StateSyncConfig = {
      slices: [
        {
          sliceName: 'ui' as any,
          storage: 'none',
          strategy: SyncStrategy.IMMEDIATE,
        },
      ],
      storagePrefix: 'test',
    };

    const middleware = createStateSyncMiddleware(config);
    const store = configureStore({
      reducer: mockReducer as any,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    });

    store.dispatch({ type: 'ui/setTheme', payload: 'dark' });

    await new Promise(resolve => setTimeout(resolve, 
      expect(mockLocalStorage.getItem('test_ui')).toBeNull();
      expect(mockSessionStorage.getItem('test_ui')).toBeNull();
      ;
    }, 50);
  });
});
