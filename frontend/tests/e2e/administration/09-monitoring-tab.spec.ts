import { test, expect } from '@playwright/test'

/**
 * Administration Features: Monitoring Tab (20 tests)
 *
 * Tests system monitoring and health metrics
 */

test.describe('Administration Features - Monitoring Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
    await page.getByRole('button', { name: 'Monitoring' }).click()
  })

  test('should display the Monitoring tab content', async ({ page }) => {
    const monitoringTab = page.getByRole('button', { name: 'Monitoring' })
    await expect(monitoringTab).toHaveClass(/border-blue-500/)
  })

  test('should show monitoring heading', async ({ page }) => {
    await expect(page.getByText(/monitoring|system.*health/i).first()).toBeVisible()
  })

  test('should display system health metrics', async ({ page }) => {
    await expect(page.locator('[class*="grid"]').first()).toBeAttached()
  })

  test('should show CPU usage metric', async ({ page }) => {
    await expect(page.getByText(/cpu/i).first()).toBeVisible()
  })

  test('should display memory usage metric', async ({ page }) => {
    await expect(page.getByText(/memory|ram/i).first()).toBeVisible()
  })

  test('should show disk usage metric', async ({ page }) => {
    await expect(page.getByText(/disk|storage/i).first()).toBeVisible()
  })

  test('should display database status', async ({ page }) => {
    await expect(page.getByText(/database|postgres/i).first()).toBeVisible()
  })

  test('should show API response time', async ({ page }) => {
    await expect(page.getByText(/response.*time|latency/i).first()).toBeVisible()
  })

  test('should display uptime metric', async ({ page }) => {
    await expect(page.getByText(/uptime/i).first()).toBeVisible()
  })

  test('should show active connections', async ({ page }) => {
    await expect(page.getByText(/connection|active.*user/i).first()).toBeVisible()
  })

  test('should display error rate metric', async ({ page }) => {
    const errorMetric = page.getByText(/error|failure/i).first()
    await expect(errorMetric).toBeAttached()
  })

  test('should show refresh button', async ({ page }) => {
    await expect(page.getByRole('button').filter({ hasText: /refresh|reload/i })).toBeVisible()
  })

  test('should display charts or graphs', async ({ page }) => {
    const charts = page.locator('svg, canvas, [class*="chart"]').first()
    await expect(charts).toBeAttached()
  })

  test('should show real-time updates', async ({ page }) => {
    const realTime = page.getByText(/real.*time|live/i).first()
    await expect(realTime).toBeAttached()
  })

  test('should display alert thresholds', async ({ page }) => {
    const thresholds = page.getByText(/threshold|alert/i).first()
    await expect(thresholds).toBeAttached()
  })

  test('should show service status indicators', async ({ page }) => {
    const statusIndicators = page.locator('[class*="bg-green"], [class*="bg-red"], [class*="status"]')
    await expect(statusIndicators.first()).toBeAttached()
  })

  test('should display queue metrics', async ({ page }) => {
    const queueMetrics = page.getByText(/queue|jobs/i).first()
    await expect(queueMetrics).toBeAttached()
  })

  test('should show cache hit rate', async ({ page }) => {
    const cacheMetrics = page.getByText(/cache|redis/i).first()
    await expect(cacheMetrics).toBeAttached()
  })

  test('should have export metrics option', async ({ page }) => {
    const exportButton = page.getByRole('button').filter({ hasText: /export|download/i }).first()
    await expect(exportButton).toBeAttached()
  })

  test('should display time range selector', async ({ page }) => {
    const timeRange = page.locator('select, button').filter({ hasText: /hour|day|week/i }).first()
    await expect(timeRange).toBeAttached()
  })
})
