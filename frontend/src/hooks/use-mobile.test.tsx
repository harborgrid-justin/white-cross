/**
 * Unit Tests for useIsMobile Hook
 *
 * Tests responsive mobile detection hook including:
 * - Initial state
 * - Breakpoint detection
 * - Window resize handling
 * - Media query listeners
 *
 * @module hooks/use-mobile.test
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  // Store original window.innerWidth
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Reset window.innerWidth before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    // Restore original window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it('should return false for desktop viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    // Wait for effect to run
    waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should return true for mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { result } = renderHook(() => useIsMobile());

    waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should return true at exactly 767px (mobile breakpoint)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767,
    });

    const { result } = renderHook(() => useIsMobile());

    waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should return false at exactly 768px (desktop breakpoint)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useIsMobile());

    waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should update when window is resized', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());

    waitFor(() => {
      expect(result.current).toBe(false);
    });

    // Simulate resize to mobile
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      window.dispatchEvent(new Event('resize'));
    });

    waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should clean up media query listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(MediaQueryList.prototype, 'removeEventListener');

    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();

    removeEventListenerSpy.mockRestore();
  });
});
