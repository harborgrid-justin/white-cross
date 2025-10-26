/**
 * Tests for Route-Level State Persistence Hooks
 *
 * Comprehensive test suite covering all hooks and edge cases.
 * Tests URL param sync, localStorage persistence, validation, and error handling.
 *
 * @module hooks/useRouteState.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ReactNode } from 'react';
import {
  useRouteState,
  usePersistedFilters,
  useNavigationState,
  usePageState,
  useSortState,
} from './useRouteState';

// =====================
// TEST UTILITIES
// =====================

/**
 * Wrapper component for testing hooks that need Router context
 */
const createWrapper = (initialPath: string = '/') => {
  return ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<>{children}</>} />
      </Routes>
    </MemoryRouter>
  );
};

/**
 * Mock localStorage for tests
 */
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get store() {
      return store;
    },
  };
})();

// Setup localStorage mock
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
  mockLocalStorage.clear();
});

afterEach(() => {
  mockLocalStorage.clear();
});

// =====================
// TEST: useRouteState
// =====================

describe('useRouteState', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(
      () => useRouteState({
        paramName: 'search',
        defaultValue: '',
      }),
      { wrapper: createWrapper() }
    );

    expect(result.current[0]).toBe('');
  });

  it('should initialize from URL param', () => {
    const { result } = renderHook(
      () => useRouteState({
        paramName: 'search',
        defaultValue: '',
      }),
      { wrapper: createWrapper('/?search=test') }
    );

    expect(result.current[0]).toBe('test');
  });

  it('should update URL when value changes', async () => {
    const { result } = renderHook(
      () => useRouteState({
        paramName: 'search',
        defaultValue: '',
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current[1]('hello');
    });

    await waitFor(() => {
      expect(result.current[0]).toBe('hello');
    });
  });

  it('should handle functional updates', async () => {
    const { result } = renderHook(
      () => useRouteState({
        paramName: 'count',
        defaultValue: 0,
      }),
      { wrapper: createWrapper('/?count=5') }
    );

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(6);
    });
  });

  it('should clear value and remove from URL', async () => {
    const { result } = renderHook(
      () => useRouteState({
        paramName: 'search',
        defaultValue: '',
      }),
      { wrapper: createWrapper('/?search=test') }
    );

    expect(result.current[0]).toBe('test');

    act(() => {
      result.current[2](); // clearValue
    });

    await waitFor(() => {
      expect(result.current[0]).toBe('');
    });
  });

  it('should serialize and deserialize arrays', async () => {
    const { result } = renderHook(
      () => useRouteState({
        paramName: 'ids',
        defaultValue: [] as string[],
        serialize: (arr) => arr.join(','),
        deserialize: (str) => str ? str.split(',') : [],
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current[1](['1', '2', '3']);
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual(['1', '2', '3']);
    });
  });

  it('should serialize and deserialize objects', async () => {
    interface TestObject {
      name: string;
      age: number;
    }

    const { result } = renderHook(
      () => useRouteState<TestObject>({
        paramName: 'data',
        defaultValue: { name: '', age: 0 },
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current[1]({ name: 'John', age: 30 });
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ name: 'John', age: 30 });
    });
  });

  it('should validate deserialized values', () => {
    const onValidationError = vi.fn();

    const { result } = renderHook(
      () => useRouteState({
        paramName: 'age',
        defaultValue: 0,
        validate: (val): val is number => typeof val === 'number' && val >= 0,
        onValidationError,
      }),
      { wrapper: createWrapper('/?age=-5') }
    );

    // Should fall back to default on invalid value
    expect(result.current[0]).toBe(0);
    expect(onValidationError).toHaveBeenCalled();
  });

  it('should handle serialization errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(
      () => useRouteState({
        paramName: 'data',
        defaultValue: '',
        serialize: () => {
          throw new Error('Serialization failed');
        },
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current[1]('test');
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('should remove param when value is set to default', async () => {
    const { result } = renderHook(
      () => useRouteState({
        paramName: 'search',
        defaultValue: '',
      }),
      { wrapper: createWrapper('/?search=test') }
    );

    expect(result.current[0]).toBe('test');

    act(() => {
      result.current[1]('');
    });

    await waitFor(() => {
      expect(result.current[0]).toBe('');
    });
  });
});

// =====================
// TEST: usePersistedFilters
// =====================

describe('usePersistedFilters', () => {
  it('should initialize with default filters', () => {
    const { result } = renderHook(
      () => usePersistedFilters({
        storageKey: 'test-filters',
        defaultFilters: { grade: '', status: 'active' },
      }),
      { wrapper: createWrapper() }
    );

    expect(result.current.filters).toEqual({ grade: '', status: 'active' });
  });

  it('should restore filters from localStorage', () => {
    mockLocalStorage.setItem(
      'test-filters',
      JSON.stringify({ grade: '5', status: 'inactive' })
    );

    const { result } = renderHook(
      () => usePersistedFilters({
        storageKey: 'test-filters',
        defaultFilters: { grade: '', status: 'active' },
      }),
      { wrapper: createWrapper() }
    );

    expect(result.current.filters).toEqual({ grade: '5', status: 'inactive' });
  });

  it('should save filters to localStorage with debounce', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(
      () => usePersistedFilters({
        storageKey: 'test-filters',
        defaultFilters: { grade: '', status: 'active' },
        debounceMs: 300,
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.setFilters({ grade: '5', status: 'active' });
    });

    // Should not save immediately
    expect(mockLocalStorage.getItem('test-filters')).toBeNull();

    // Fast-forward time past debounce
    act(() => {
      vi.advanceTimersByTime(300);
    });

    await waitFor(() => {
      const stored = mockLocalStorage.getItem('test-filters');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toEqual({ grade: '5', status: 'active' });
    });

    vi.useRealTimers();
  });

  it('should update single filter with updateFilter', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(
      () => usePersistedFilters({
        storageKey: 'test-filters',
        defaultFilters: { grade: '', status: 'active' },
        debounceMs: 100,
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.updateFilter('grade', '5');
    });

    expect(result.current.filters).toEqual({ grade: '5', status: 'active' });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    await waitFor(() => {
      const stored = mockLocalStorage.getItem('test-filters');
      expect(stored).toBeTruthy();
    });

    vi.useRealTimers();
  });

  it('should clear filters and remove from localStorage', async () => {
    mockLocalStorage.setItem('test-filters', JSON.stringify({ grade: '5' }));

    const { result } = renderHook(
      () => usePersistedFilters({
        storageKey: 'test-filters',
        defaultFilters: { grade: '', status: 'active' },
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.clearFilters();
    });

    await waitFor(() => {
      expect(result.current.filters).toEqual({ grade: '', status: 'active' });
      expect(mockLocalStorage.getItem('test-filters')).toBeNull();
    });
  });

  it('should sync with URL when enabled', async () => {
    const { result } = renderHook(
      () => usePersistedFilters({
        storageKey: 'test-filters',
        defaultFilters: { grade: '', status: 'active' },
        syncWithUrl: true,
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.setFilters({ grade: '5', status: 'inactive' });
    });

    await waitFor(() => {
      expect(result.current.filters.grade).toBe('5');
    });
  });

  it('should validate filters before updating', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(
      () => usePersistedFilters({
        storageKey: 'test-filters',
        defaultFilters: { grade: '', status: 'active' },
        validate: (filters) => filters.grade !== 'invalid',
      }),
      { wrapper: createWrapper() }
    );

    const initialFilters = result.current.filters;

    act(() => {
      result.current.setFilters({ grade: 'invalid', status: 'active' });
    });

    // Should keep previous state on validation failure
    expect(result.current.filters).toEqual(initialFilters);
    expect(consoleWarn).toHaveBeenCalled();

    consoleWarn.mockRestore();
  });

  it('should mark as restored after initialization', async () => {
    const { result } = renderHook(
      () => usePersistedFilters({
        storageKey: 'test-filters',
        defaultFilters: { grade: '' },
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isRestored).toBe(true);
    });
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock localStorage to throw error
    const originalGetItem = mockLocalStorage.getItem;
    mockLocalStorage.getItem = () => {
      throw new Error('Storage error');
    };

    const { result } = renderHook(
      () => usePersistedFilters({
        storageKey: 'test-filters',
        defaultFilters: { grade: '' },
      }),
      { wrapper: createWrapper() }
    );

    // Should fall back to default filters
    expect(result.current.filters).toEqual({ grade: '' });

    mockLocalStorage.getItem = originalGetItem;
    consoleError.mockRestore();
  });
});

// =====================
// TEST: useNavigationState
// =====================

describe('useNavigationState', () => {
  it('should initialize with null previous state', () => {
    const { result } = renderHook(
      () => useNavigationState(),
      { wrapper: createWrapper() }
    );

    expect(result.current.previousPath).toBeNull();
    expect(result.current.previousState).toBeNull();
  });

  it('should track scroll position', async () => {
    const { result } = renderHook(
      () => useNavigationState(),
      { wrapper: createWrapper() }
    );

    // Simulate scroll
    act(() => {
      window.scrollX = 100;
      window.scrollY = 200;
      window.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      expect(result.current.currentScroll.x).toBe(100);
      expect(result.current.currentScroll.y).toBe(200);
    });
  });

  it('should provide navigateWithState function', () => {
    const { result } = renderHook(
      () => useNavigationState(),
      { wrapper: createWrapper() }
    );

    expect(typeof result.current.navigateWithState).toBe('function');
  });

  it('should provide navigateBack function', () => {
    const { result } = renderHook(
      () => useNavigationState(),
      { wrapper: createWrapper() }
    );

    expect(typeof result.current.navigateBack).toBe('function');
  });

  it('should get current scroll position', () => {
    const { result } = renderHook(
      () => useNavigationState(),
      { wrapper: createWrapper() }
    );

    const scrollPos = result.current.getScrollPosition();
    expect(scrollPos).toHaveProperty('x');
    expect(scrollPos).toHaveProperty('y');
  });
});

// =====================
// TEST: usePageState
// =====================

describe('usePageState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(
      () => usePageState(),
      { wrapper: createWrapper() }
    );

    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('should initialize from URL params', () => {
    const { result } = renderHook(
      () => usePageState({
        pageParam: 'page',
        pageSizeParam: 'pageSize',
      }),
      { wrapper: createWrapper('/?page=3&pageSize=20') }
    );

    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(20);
  });

  it('should update page number', async () => {
    const { result } = renderHook(
      () => usePageState(),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(2);
    });
  });

  it('should update page size and reset to page 1', async () => {
    const { result } = renderHook(
      () => usePageState({
        pageSizeOptions: [10, 20, 50],
      }),
      { wrapper: createWrapper('/?page=5') }
    );

    act(() => {
      result.current.setPageSize(20);
    });

    await waitFor(() => {
      expect(result.current.pageSize).toBe(20);
      expect(result.current.page).toBe(1);
    });
  });

  it('should handle functional page updates', async () => {
    const { result } = renderHook(
      () => usePageState(),
      { wrapper: createWrapper('/?page=5') }
    );

    act(() => {
      result.current.setPage((prev) => prev + 1);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(6);
    });
  });

  it('should reset to first page', async () => {
    const { result } = renderHook(
      () => usePageState(),
      { wrapper: createWrapper('/?page=5') }
    );

    expect(result.current.page).toBe(5);

    act(() => {
      result.current.resetPage();
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
    });
  });

  it('should validate page size against options', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(
      () => usePageState({
        pageSizeOptions: [10, 20, 50],
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.setPageSize(15); // Invalid size
    });

    expect(consoleWarn).toHaveBeenCalled();

    consoleWarn.mockRestore();
  });

  it('should not allow page number less than 1', async () => {
    const { result } = renderHook(
      () => usePageState(),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.setPage(0);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
    });

    act(() => {
      result.current.setPage(-5);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
    });
  });

  it('should provide pageSizeOptions', () => {
    const options = [10, 20, 50, 100];
    const { result } = renderHook(
      () => usePageState({
        pageSizeOptions: options,
      }),
      { wrapper: createWrapper() }
    );

    expect(result.current.pageSizeOptions).toEqual(options);
  });
});

// =====================
// TEST: useSortState
// =====================

describe('useSortState', () => {
  type TestColumn = 'name' | 'age' | 'date';

  it('should initialize with default values', () => {
    const { result } = renderHook(
      () => useSortState<TestColumn>({
        validColumns: ['name', 'age', 'date'],
        defaultColumn: 'name',
        defaultDirection: 'asc',
      }),
      { wrapper: createWrapper() }
    );

    expect(result.current.column).toBe('name');
    expect(result.current.direction).toBe('asc');
  });

  it('should initialize from URL params', () => {
    const { result } = renderHook(
      () => useSortState<TestColumn>({
        validColumns: ['name', 'age', 'date'],
      }),
      { wrapper: createWrapper('/?sortBy=age&sortDir=desc') }
    );

    expect(result.current.column).toBe('age');
    expect(result.current.direction).toBe('desc');
  });

  it('should sort by column with direction', async () => {
    const { result } = renderHook(
      () => useSortState<TestColumn>({
        validColumns: ['name', 'age', 'date'],
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.sortBy('age', 'desc');
    });

    await waitFor(() => {
      expect(result.current.column).toBe('age');
      expect(result.current.direction).toBe('desc');
    });
  });

  it('should toggle sort direction', async () => {
    const { result } = renderHook(
      () => useSortState<TestColumn>({
        validColumns: ['name', 'age', 'date'],
        defaultColumn: 'name',
        defaultDirection: 'asc',
      }),
      { wrapper: createWrapper() }
    );

    // First toggle: should be asc (new column)
    act(() => {
      result.current.toggleSort('age');
    });

    await waitFor(() => {
      expect(result.current.column).toBe('age');
      expect(result.current.direction).toBe('asc');
    });

    // Second toggle: should be desc
    act(() => {
      result.current.toggleSort('age');
    });

    await waitFor(() => {
      expect(result.current.column).toBe('age');
      expect(result.current.direction).toBe('desc');
    });

    // Third toggle: should clear to default
    act(() => {
      result.current.toggleSort('age');
    });

    await waitFor(() => {
      expect(result.current.column).toBe('name');
      expect(result.current.direction).toBe('asc');
    });
  });

  it('should validate column names', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(
      () => useSortState<TestColumn>({
        validColumns: ['name', 'age', 'date'],
      }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.sortBy('invalid' as TestColumn);
    });

    expect(consoleWarn).toHaveBeenCalled();

    consoleWarn.mockRestore();
  });

  it('should clear sort to default', async () => {
    const { result } = renderHook(
      () => useSortState<TestColumn>({
        validColumns: ['name', 'age', 'date'],
        defaultColumn: 'name',
        defaultDirection: 'asc',
      }),
      { wrapper: createWrapper('/?sortBy=age&sortDir=desc') }
    );

    expect(result.current.column).toBe('age');
    expect(result.current.direction).toBe('desc');

    act(() => {
      result.current.clearSort();
    });

    await waitFor(() => {
      expect(result.current.column).toBe('name');
      expect(result.current.direction).toBe('asc');
    });
  });

  it('should get sort indicator', () => {
    const { result } = renderHook(
      () => useSortState<TestColumn>({
        validColumns: ['name', 'age', 'date'],
        defaultColumn: 'name',
        defaultDirection: 'asc',
      }),
      { wrapper: createWrapper() }
    );

    expect(result.current.getSortIndicator('name')).toBe('↑');
    expect(result.current.getSortIndicator('age')).toBe('');

    act(() => {
      result.current.sortBy('age', 'desc');
    });

    expect(result.current.getSortIndicator('age')).toBe('↓');
  });

  it('should get sort CSS class', () => {
    const { result } = renderHook(
      () => useSortState<TestColumn>({
        validColumns: ['name', 'age', 'date'],
        defaultColumn: 'name',
        defaultDirection: 'asc',
      }),
      { wrapper: createWrapper() }
    );

    expect(result.current.getSortClass('name')).toBe('sort-asc');
    expect(result.current.getSortClass('age')).toBe('');

    act(() => {
      result.current.sortBy('age', 'desc');
    });

    expect(result.current.getSortClass('age')).toBe('sort-desc');
  });

  it('should persist preferences to localStorage', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(
      () => useSortState<TestColumn>({
        validColumns: ['name', 'age', 'date'],
        persistPreference: true,
        storageKey: 'test-sort',
      }),
      { wrapper: createWrapper('/test') }
    );

    act(() => {
      result.current.sortBy('age', 'desc');
    });

    await waitFor(() => {
      const stored = mockLocalStorage.getItem('test-sort-/test');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.column).toBe('age');
      expect(parsed.direction).toBe('desc');
    });

    vi.useRealTimers();
  });

  it('should restore from localStorage', () => {
    mockLocalStorage.setItem(
      'test-sort-/test',
      JSON.stringify({ column: 'age', direction: 'desc' })
    );

    const { result } = renderHook(
      () => useSortState<TestColumn>({
        validColumns: ['name', 'age', 'date'],
        persistPreference: true,
        storageKey: 'test-sort',
      }),
      { wrapper: createWrapper('/test') }
    );

    expect(result.current.column).toBe('age');
    expect(result.current.direction).toBe('desc');
  });
});
