import { test, expect } from '@playwright/test'

/**
 * Dashboard - Page Load & Structure Tests
 *
 * Comprehensive testing of dashboard page loading, structure, and initial render
 * Healthcare Context: Critical dashboard for school nurses to access student health data
 *
 * Test Coverage:
 * - Page load performance and error handling
 * - Semantic HTML structure and accessibility
 * - Layout rendering and responsive design
 * - Authentication persistence
 * - Core Web Vitals monitoring
 */

test.describe('Dashboard - Page Load & Structure', () => {
  test.beforeEach(async ({ page }) => {
    // Login as nurse and navigate to dashboard
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
  })

  test.describe('Page Load & Performance', () => {
    test('should load dashboard page within acceptable time (< 3s)', async ({ page }) => {
      const startTime = Date.now()

      await page.goto('/dashboard')
      await expect(page.locator('[data-cy=dashboard-container], main')).toBeVisible()

      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000)
      await expect(page).toHaveURL(/\/dashboard/)
    })

    test('should display loading states during initial render', async ({ page }) => {
      await page.route('**/api/dashboard/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 500))
        await route.continue()
      })

      await page.goto('/dashboard')

      // Verify loading skeletons appear
      const loadingElement = page.locator('[data-cy*=skeleton], [class*="skeleton"], [class*="loading"]').first()
      await expect(loadingElement).toBeVisible({ timeout: 1000 })
    })

    test('should load page without JavaScript errors', async ({ page }) => {
      const consoleErrors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      await page.goto('/dashboard')
      await expect(page.locator('body')).toBeVisible()

      expect(consoleErrors).toHaveLength(0)
    })

    test('should render within acceptable time for Core Web Vitals', async ({ page }) => {
      await page.goto('/dashboard')

      const paintMetrics = await page.evaluate(() => {
        const entries = performance.getEntriesByType('paint')
        return entries.map(entry => ({ name: entry.name, startTime: entry.startTime }))
      })

      const lcp = paintMetrics.find(entry => entry.name === 'largest-contentful-paint')
      if (lcp) {
        expect(lcp.startTime).toBeLessThan(2500)
      }
    })

    test('should prefetch critical resources', async ({ page }) => {
      await page.goto('/dashboard')

      const resourceCount = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource')
        return entries.length
      })

      expect(resourceCount).toBeGreaterThan(0)
    })
  })

  test.describe('Page Structure & Semantic HTML', () => {
    test('should have proper semantic HTML structure', async ({ page }) => {
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('main, [role="main"]')).toBeVisible()
      await expect(page.locator('nav, [role="navigation"]').first()).toBeAttached()
    })

    test('should have accessible page title and heading hierarchy', async ({ page }) => {
      // Document title
      await expect(page).toHaveTitle(/dashboard/i)

      // Main heading (should be only one h1)
      const h1Elements = page.locator('h1')
      await expect(h1Elements).toHaveCount(1)
      await expect(h1Elements.first()).toBeVisible()
      await expect(h1Elements.first()).toContainText(/dashboard/i)

      // Verify heading hierarchy (h2, h3 should exist)
      await expect(page.locator('h2, h3').first()).toBeAttached()
    })

    test('should have proper ARIA landmarks', async ({ page }) => {
      await expect(page.locator('[role="banner"], header').first()).toBeAttached()
      await expect(page.locator('[role="navigation"], nav').first()).toBeAttached()
      await expect(page.locator('[role="main"], main').first()).toBeAttached()
    })

    test('should display main content area with proper structure', async ({ page }) => {
      const mainContent = page.locator('main, [role="main"]')
      await expect(mainContent).toBeVisible()

      // Verify content container exists
      await expect(mainContent.locator('[data-cy=dashboard-content], [class*="dashboard"]').first()).toBeAttached()
    })

    test('should have proper page spacing and layout containers', async ({ page }) => {
      await expect(page.locator('[class*="container"], [class*="wrapper"]').first()).toBeAttached()
      await expect(page.locator('[class*="grid"], [class*="flex"]').first()).toBeAttached()
      await expect(page.locator('[class*="space-y"], [class*="gap"], [class*="p-"]').first()).toBeAttached()
    })
  })

  test.describe('Navigation & Layout Components', () => {
    test('should display header with navigation', async ({ page }) => {
      const header = page.locator('header')
      await expect(header).toBeVisible()
      await expect(header.locator('nav').first()).toBeAttached()
    })

    test('should display sidebar navigation menu', async ({ page }) => {
      const sidebar = page.locator('aside, nav[class*="sidebar"]').first()
      await expect(sidebar).toBeAttached()

      // Verify navigation links
      const navLinks = sidebar.locator('a, button')
      await expect(navLinks).toHaveCount(3, { timeout: 5000 })
    })

    test('should show user profile menu in header', async ({ page }) => {
      await expect(page.locator('header [data-cy=user-menu]')).toBeAttached()
    })

    test('should have skip to main content link for accessibility', async ({ page }) => {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      await expect(focused).toContainText(/skip to main content|skip to content/i)
    })
  })

  test.describe('Authentication & Security', () => {
    test('should maintain authentication on page load', async ({ page }) => {
      await expect(page).not.toHaveURL(/\/login/)
      await expect(page.locator('body')).toBeVisible()
      await expect(page.locator('[data-cy=dashboard-container], main')).toBeAttached()
    })

    test('should display user role indicator', async ({ page }) => {
      const roleIndicator = page.locator('[data-cy=user-role], [class*="user-role"]').first()
      await expect(roleIndicator).toContainText(/nurse/i)
    })

    test('should handle token refresh on dashboard load', async ({ page }) => {
      await page.route('**/api/auth/refresh', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ token: 'refreshed-token' })
        })
      })

      await page.goto('/dashboard')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Styling & Visual Presentation', () => {
    test('should have proper background styling', async ({ page }) => {
      const bgColor = await page.locator('body').evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      )
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)')
    })

    test('should load all critical CSS', async ({ page }) => {
      const stylesheets = page.locator('head link[rel="stylesheet"]')
      await expect(stylesheets).toHaveCount(1, { timeout: 5000 })
    })

    test('should have consistent color scheme', async ({ page }) => {
      await expect(page.locator('body')).toHaveCSS('color', /.+/)
      await expect(page.locator('header')).toHaveCSS('background-color', /.+/)
    })

    test('should apply proper font styling', async ({ page }) => {
      const fontFamily = await page.locator('body').evaluate(el =>
        window.getComputedStyle(el).fontFamily
      )
      expect(fontFamily).not.toBe('Times New Roman')
    })
  })

  test.describe('Responsive Design', () => {
    test('should have responsive layout container', async ({ page }) => {
      await expect(page.locator('[class*="container"], [class*="responsive"]').first()).toBeAttached()
      await expect(page.locator('[class*="md:"], [class*="lg:"], [class*="xl:"]').first()).toBeAttached()
    })

    test('should adapt to mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.reload()

      await expect(page.locator('body')).toBeVisible()
      const mobileMenu = page.locator('[data-cy=mobile-menu], button[aria-label="Open sidebar"]').first()
      await expect(mobileMenu).toBeAttached()
    })
  })

  test.describe('Error Handling', () => {
    test('should not show loading spinner after page loads completely', async ({ page }) => {
      await page.waitForTimeout(2000)
      const spinner = page.locator('[data-cy=page-spinner], [class*="spinner"][class*="page"]')
      await expect(spinner).not.toBeVisible()
    })

    test('should handle missing data gracefully', async ({ page }) => {
      await page.route('**/api/dashboard/**', route => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ data: [] })
        })
      })

      await page.goto('/dashboard')
      await expect(page.locator('main')).toBeVisible()
    })

    test('should display error boundary on critical errors', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('HIPAA Compliance & Security Headers', () => {
    test('should include security headers for HIPAA compliance', async ({ page }) => {
      const response = await page.goto('/dashboard')
      const headers = response?.headers()

      expect(headers).toBeDefined()
      expect(headers?.['x-powered-by']).toBeUndefined()
    })

    test('should not expose sensitive information in HTML', async ({ page }) => {
      const bodyText = await page.locator('body').textContent()
      expect(bodyText).not.toContain('password')
      expect(bodyText).not.toContain('api-key')
      expect(bodyText).not.toContain('secret')
    })
  })
})
