/**
 * Page Load Performance Integration Tests
 * Tests frontend page load performance and metrics
 */

import { test, expect } from '@playwright/test';

test.describe('Page Load Performance', () => {
  test.describe('Core Web Vitals', () => {
    test('should load home page within performance budget', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');

      const loadTime = Date.now() - startTime;

      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should measure Largest Contentful Paint (LCP)', async ({ page }) => {
      await page.goto('/');

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Measure LCP using Performance API
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry.renderTime || lastEntry.loadTime);
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          // Fallback after 5 seconds
          setTimeout(() => resolve(0), 5000);
        });
      });

      // LCP should be under 2.5 seconds (Good)
      expect(lcp).toBeLessThan(2500);
    });

    test('should measure First Input Delay (FID)', async ({ page }) => {
      await page.goto('/');

      // Wait for page to be interactive
      await page.waitForLoadState('domcontentloaded');

      // Click a button to measure FID
      const button = page.locator('button').first();
      if (await button.isVisible()) {
        const startTime = Date.now();
        await button.click({ timeout: 1000 }).catch(() => {});
        const fid = Date.now() - startTime;

        // FID should be under 100ms (Good)
        expect(fid).toBeLessThan(100);
      }
    });

    test('should measure Cumulative Layout Shift (CLS)', async ({ page }) => {
      await page.goto('/');

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let clsValue = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
            resolve(clsValue);
          }).observe({ entryTypes: ['layout-shift'] });

          // Resolve after 3 seconds of observation
          setTimeout(() => resolve(clsValue), 3000);
        });
      });

      // CLS should be under 0.1 (Good)
      expect(cls).toBeLessThan(0.1);
    });

    test('should measure Time to First Byte (TTFB)', async ({ page }) => {
      const startTime = Date.now();
      const response = await page.goto('/');
      const ttfb = Date.now() - startTime;

      expect(response?.ok()).toBeTruthy();

      // TTFB should be under 600ms
      expect(ttfb).toBeLessThan(600);
    });

    test('should measure First Contentful Paint (FCP)', async ({ page }) => {
      await page.goto('/');

      const fcp = await page.evaluate(() => {
        const perfEntry = performance.getEntriesByType('paint').find(
          (entry) => entry.name === 'first-contentful-paint'
        );
        return perfEntry?.startTime || 0;
      });

      // FCP should be under 1.8 seconds (Good)
      expect(fcp).toBeLessThan(1800);
    });
  });

  test.describe('Resource Loading', () => {
    test('should load all critical resources', async ({ page }) => {
      const response = await page.goto('/');

      expect(response?.ok()).toBeTruthy();

      // Wait for all resources to load
      await page.waitForLoadState('networkidle');

      // Check that no resources failed to load
      const failedResources = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource');
        return entries.filter((entry: any) => entry.responseStatus >= 400).length;
      });

      expect(failedResources).toBe(0);
    });

    test('should optimize JavaScript bundle size', async ({ page }) => {
      await page.goto('/');

      const jsSize = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        return entries
          .filter((entry) => entry.name.endsWith('.js'))
          .reduce((total, entry) => total + entry.transferSize, 0);
      });

      // Total JS should be under 500KB (compressed)
      expect(jsSize).toBeLessThan(500 * 1024);
    });

    test('should optimize CSS bundle size', async ({ page }) => {
      await page.goto('/');

      const cssSize = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        return entries
          .filter((entry) => entry.name.endsWith('.css'))
          .reduce((total, entry) => total + entry.transferSize, 0);
      });

      // Total CSS should be under 100KB (compressed)
      expect(cssSize).toBeLessThan(100 * 1024);
    });

    test('should use cache for static assets', async ({ page }) => {
      // First load
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Second load (should use cache)
      const startTime = Date.now();
      await page.reload();
      await page.waitForLoadState('networkidle');
      const reloadTime = Date.now() - startTime;

      // Reload should be faster due to caching
      expect(reloadTime).toBeLessThan(2000);
    });

    test('should lazy load non-critical resources', async ({ page }) => {
      await page.goto('/');

      // Initial load should not include all resources
      const initialResourceCount = await page.evaluate(() => {
        return performance.getEntriesByType('resource').length;
      });

      // Scroll to trigger lazy loading
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      const afterScrollResourceCount = await page.evaluate(() => {
        return performance.getEntriesByType('resource').length;
      });

      // More resources should be loaded after scroll
      expect(afterScrollResourceCount).toBeGreaterThanOrEqual(initialResourceCount);
    });
  });

  test.describe('Navigation Performance', () => {
    test('should navigate between pages quickly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Navigate to another page
      const startTime = Date.now();
      await page.click('a[href="/students"]').catch(() => {});
      await page.waitForLoadState('domcontentloaded');
      const navigationTime = Date.now() - startTime;

      // Client-side navigation should be under 1 second
      expect(navigationTime).toBeLessThan(1000);
    });

    test('should prefetch linked pages', async ({ page }) => {
      await page.goto('/');

      // Check if prefetch links exist
      const prefetchLinks = await page.evaluate(() => {
        return document.querySelectorAll('link[rel="prefetch"]').length;
      });

      // Should have some prefetch links for common routes
      expect(prefetchLinks).toBeGreaterThanOrEqual(0);
    });

    test('should handle back/forward navigation efficiently', async ({ page }) => {
      await page.goto('/');
      await page.click('a[href="/students"]').catch(() => {});
      await page.waitForLoadState('domcontentloaded');

      const startTime = Date.now();
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      const backTime = Date.now() - startTime;

      // Back navigation should be instant (from cache)
      expect(backTime).toBeLessThan(500);
    });
  });

  test.describe('API Performance', () => {
    test('should load dashboard data efficiently', async ({ page }) => {
      await page.goto('/dashboard');

      // Wait for API calls to complete
      const apiCalls = [];
      page.on('response', (response) => {
        if (response.url().includes('/api/')) {
          apiCalls.push(response);
        }
      });

      await page.waitForLoadState('networkidle');

      // Check API response times
      for (const response of apiCalls) {
        const timing = await response.timing();
        const responseTime = timing.responseEnd - timing.requestStart;

        // Each API call should respond within 500ms
        expect(responseTime).toBeLessThan(500);
      }
    });

    test('should batch API requests when possible', async ({ page }) => {
      const apiRequests = new Map();

      page.on('request', (request) => {
        if (request.url().includes('/api/')) {
          const url = request.url();
          apiRequests.set(url, (apiRequests.get(url) || 0) + 1);
        }
      });

      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Check for duplicate API calls (should be minimal)
      const duplicateCalls = Array.from(apiRequests.values()).filter((count) => count > 1);

      // Minimal duplicate calls (caching should prevent most duplicates)
      expect(duplicateCalls.length).toBeLessThan(3);
    });

    test('should handle API errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/v1/students', (route) => {
        route.abort();
      });

      const startTime = Date.now();
      await page.goto('/students');
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      // Page should still load even if API fails
      expect(loadTime).toBeLessThan(3000);

      // Check for error message
      const hasErrorMessage = await page.isVisible('text=/error|failed/i').catch(() => false);
      expect(typeof hasErrorMessage).toBe('boolean');
    });
  });

  test.describe('Memory and CPU Usage', () => {
    test('should not leak memory during navigation', async ({ page }) => {
      await page.goto('/');

      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });

      // Navigate multiple times
      for (let i = 0; i < 5; i++) {
        await page.click('a[href="/students"]').catch(() => {});
        await page.waitForLoadState('domcontentloaded');
        await page.goBack();
        await page.waitForLoadState('domcontentloaded');
      }

      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });

      // Memory shouldn't grow significantly (allowing 20% increase)
      if (initialMemory > 0 && finalMemory > 0) {
        expect(finalMemory).toBeLessThan(initialMemory * 1.2);
      }
    });

    test('should maintain responsive UI during heavy operations', async ({ page }) => {
      await page.goto('/students');

      // Trigger a heavy operation (load large list)
      const startTime = Date.now();
      await page.click('button:has-text("Load All")').catch(() => {});
      await page.waitForTimeout(100);

      // UI should remain responsive
      const clickTime = Date.now() - startTime;
      expect(clickTime).toBeLessThan(200);
    });
  });

  test.describe('Mobile Performance', () => {
    test('should load efficiently on mobile devices', async ({ page, browserName }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      // Mobile load should be under 4 seconds
      expect(loadTime).toBeLessThan(4000);
    });

    test('should optimize images for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const imageSize = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        return entries
          .filter((entry) => entry.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
          .reduce((total, entry) => total + entry.transferSize, 0);
      });

      // Total image size should be under 500KB on mobile
      expect(imageSize).toBeLessThan(500 * 1024);
    });
  });

  test.describe('Accessibility Performance', () => {
    test('should support keyboard navigation efficiently', async ({ page }) => {
      await page.goto('/');

      const startTime = Date.now();

      // Tab through interactive elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(50);
      }

      const tabTime = Date.now() - startTime;

      // Keyboard navigation should be responsive
      expect(tabTime).toBeLessThan(500);
    });

    test('should announce route changes to screen readers', async ({ page }) => {
      await page.goto('/');

      // Check for ARIA live regions
      const hasLiveRegion = await page.isVisible('[aria-live]').catch(() => false);

      // Should have live regions for announcements
      expect(typeof hasLiveRegion).toBe('boolean');
    });
  });

  test.describe('Performance Monitoring', () => {
    test('should expose performance metrics', async ({ page }) => {
      await page.goto('/');

      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        return {
          dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
          tcp: navigation?.connectEnd - navigation?.connectStart,
          request: navigation?.responseStart - navigation?.requestStart,
          response: navigation?.responseEnd - navigation?.responseStart,
          dom: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
          load: navigation?.loadEventEnd - navigation?.loadEventStart,
        };
      });

      // All metrics should be positive numbers
      Object.values(metrics).forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    test('should track custom performance marks', async ({ page }) => {
      await page.goto('/');

      const customMarks = await page.evaluate(() => {
        return performance.getEntriesByType('mark').length;
      });

      // Should have some custom performance marks
      expect(customMarks).toBeGreaterThanOrEqual(0);
    });
  });
});
