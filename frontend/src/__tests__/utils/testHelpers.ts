/**
 * Test Helpers
 * Common helper functions for testing
 */

export function mockFetch(data: any) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    } as Response)
  );
}

export function mockFetchError(error: string) {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error(error))
  );
}

export function waitFor(condition: () => boolean, timeout = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error('Timeout waiting for condition'));
      }
    }, 50);
  });
}

export function createMockEvent<T = Element>(overrides?: Partial<React.ChangeEvent<T>>): React.ChangeEvent<T> {
  return {
    target: {} as T,
    currentTarget: {} as T,
    ...overrides,
  } as React.ChangeEvent<T>;
}
