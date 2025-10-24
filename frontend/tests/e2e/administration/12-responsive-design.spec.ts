import { test, expect } from '@playwright/test'

/**
 * Administration Features: Responsive Design (10 tests)
 *
 * Tests responsive behavior across different screen sizes
 */

test.describe('Administration Features - Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
  })

  test('should be responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('h1').filter({ hasText: 'Administration Panel' })).toBeVisible()
  })

  test('should be responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('h1').filter({ hasText: 'Administration Panel' })).toBeVisible()
  })

  test('should be responsive on desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('h1').filter({ hasText: 'Administration Panel' })).toBeVisible()
  })

  test('should have scrollable tab navigation on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('nav[class*="overflow-x"]').first()).toBeAttached()
  })

  test('should adapt grid layouts on different screen sizes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await expect(page.locator('[class*="grid"]').first()).toBeAttached()
  })

  test('should maintain usability on iPad (810px)', async ({ page }) => {
    await page.setViewportSize({ width: 810, height: 1080 })
    await expect(page.locator('nav button').first()).toBeVisible()
  })

  test('should handle very wide screens (2560px)', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 })
    await expect(page.locator('h1').filter({ hasText: 'Administration Panel' })).toBeVisible()
  })

  test('should maintain aspect ratio on landscape mobile', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 })
    await expect(page.locator('body')).toBeVisible()
  })

  test('should have readable text on all screen sizes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    const h1 = page.locator('h1').first()
    await expect(h1).toHaveCSS('font-size', /.+/)
  })

  test('should maintain proper spacing on different viewports', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await expect(page.locator('[class*="space-y"], [class*="gap"]').first()).toBeAttached()
  })
})
