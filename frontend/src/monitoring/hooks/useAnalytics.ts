/**
 * Analytics Hook
 *
 * React hook for tracking user events and actions
 */

'use client';

import { useCallback, useEffect } from 'react';
import {
  trackEvent,
  trackAction,
  trackClick,
  trackFormSubmit,
  trackSearch,
  healthcare,
} from '../analytics';
import type { EventCategory } from '../types';

export function useAnalytics() {
  /**
   * Track generic event
   */
  const track = useCallback(
    (
      name: string,
      category: EventCategory,
      action: string,
      properties?: Record<string, any>
    ) => {
      trackEvent(name, category, action, properties);
    },
    []
  );

  /**
   * Track user action
   */
  const trackUserAction = useCallback(
    (action: string, target: string, properties?: Record<string, any>) => {
      trackAction(action, target, properties);
    },
    []
  );

  /**
   * Track button click
   */
  const trackButtonClick = useCallback((buttonName: string, context?: Record<string, any>) => {
    trackClick(buttonName, context);
  }, []);

  /**
   * Track form submission
   */
  const trackForm = useCallback((formName: string, context?: Record<string, any>) => {
    trackFormSubmit(formName, context);
  }, []);

  /**
   * Track search query
   */
  const trackSearchQuery = useCallback(
    (query: string, results: number, context?: Record<string, any>) => {
      trackSearch(query, results, context);
    },
    []
  );

  return {
    track,
    trackUserAction,
    trackButtonClick,
    trackForm,
    trackSearchQuery,
    healthcare,
  };
}

/**
 * Hook for tracking page views
 */
export function usePageView(path?: string) {
  useEffect(() => {
    // Track page view on mount
    const { trackPageView } = require('../analytics');
    trackPageView(path);
  }, [path]);
}

/**
 * Hook for tracking component visibility
 */
export function useVisibilityTracking(
  componentName: string,
  ref: React.RefObject<HTMLElement>
) {
  const { trackUserAction } = useAnalytics();

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackUserAction('view', componentName, {
              visibility: 'visible',
            });
          }
        });
      },
      {
        threshold: 0.5, // Track when 50% visible
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [componentName, ref, trackUserAction]);
}

/**
 * Hook for tracking user interactions
 */
export function useInteractionTracking(componentName: string) {
  const { trackUserAction } = useAnalytics();

  const trackInteraction = useCallback(
    (interaction: string, details?: Record<string, any>) => {
      trackUserAction(interaction, componentName, details);
    },
    [componentName, trackUserAction]
  );

  return { trackInteraction };
}
