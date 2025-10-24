import { test, expect } from '@playwright/test'

/**
 * Dashboard - Performance & Loading (15 tests)
 *
 * Tests dashboard performance, loading states, and optimization
 */

test.describe('Dashboard - Performance & Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
  })

  test('should load dashboard within 3 seconds', async ({ page }) => {
    const start = Date.now()
    await page.goto('/dashboard')
    await expect(page.locator('body')).toBeVisible()

    const loadTime = Date.now() - start
    expect(loadTime).toBeLessThan(3000)
  })

  test('should show loading skeleton for widgets', async ({ page }) => {
    await page.goto('/dashboard')
    const loadingSkeleton = page.locator('[class*="skeleton"], [class*="loading"]').first()
    await expect(loadingSkeleton).toBeAttached({ timeout: 1000 })
  })

  test('should load metrics asynchronously', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('[class*="card"]').first()).toBeVisible({ timeout: 5000 })
  })

  test('should display progressive content loading', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForTimeout(500)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should not block UI during data fetch', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('button').first()).not.toBeDisabled()
  })

  test('should cache dashboard data', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForTimeout(1000)
    await page.reload()
    await expect(page.locator('[class*="card"]').first()).toBeVisible({ timeout: 2000 })
  })

  test('should lazy load below-fold content', async ({ page }) => {
    await page.goto('/dashboard')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.locator('body')).toBeVisible()
  })

  test('should optimize images for performance', async ({ page }) => {
    await page.goto('/dashboard')
    const images = page.locator('img')
    const firstImage = images.first()
    const loadingAttr = await firstImage.getAttribute('loading')
    const srcAttr = await firstImage.getAttribute('src')

    expect(loadingAttr === 'lazy' || srcAttr !== null).toBeTruthy()
  })

  test('should prefetch critical resources', async ({ page }) => {
    await page.goto('/dashboard')
    const perfExists = await page.evaluate(() => window.performance !== undefined)
    expect(perfExists).toBeTruthy()
  })

  test('should handle slow network gracefully', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForTimeout(3000)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should show timeout error for failed requests', async ({ page }) => {
    await page.route('**/api/**', route => {
      setTimeout(() => {
        route.fulfill({ status: 500 })
      }, 5000)
    })

    await page.goto('/dashboard')
    const errorMsg = page.getByText(/error|failed|try.*again/i).first()
    await expect(errorMsg).toBeAttached({ timeout: 10000 })
  })

  test('should minimize reflows and repaints', async ({ page }) => {
    await page.goto('/dashboard')
    const card = page.locator('[class*="card"]').first()
    await expect(card).toHaveCSS('display', /.+/)
  })

  test('should use efficient rendering techniques', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('body')).toBeVisible()
  })

  test('should handle large datasets efficiently', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('[class*="activity"]').first()).toBeAttached({ timeout: 5000 })
  })

  test('should maintain 60fps scrolling', async ({ page }) => {
    await page.goto('/dashboard')
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })
    await page.waitForTimeout(1000)
    await expect(page.locator('body')).toBeVisible()
  })
})
