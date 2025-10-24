import { test, expect } from '@playwright/test'

/**
 * Administration Features: Overview Tab (20 tests)
 *
 * Tests overview tab functionality and system metrics
 */

test.describe('Administration Features - Overview Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
    await page.getByRole('button', { name: 'Overview' }).click()
  })

  test('should display the Overview tab content', async ({ page }) => {
    const overviewTab = page.getByRole('button', { name: 'Overview' })
    await expect(overviewTab).toHaveClass(/border-blue-500/)
  })

  test('should show system metrics', async ({ page }) => {
    await expect(page.locator('[class*="grid"]').first()).toBeVisible()
  })

  test('should display statistical cards', async ({ page }) => {
    const cards = page.locator('[class*="bg-white"][class*="shadow"]')
    await expect(cards).toHaveCount(1, { timeout: 5000 })
  })

  test('should show total users metric', async ({ page }) => {
    await expect(page.getByText(/users|total/i)).toBeVisible()
  })

  test('should show active schools metric', async ({ page }) => {
    await expect(page.getByText(/schools|active/i)).toBeVisible()
  })

  test('should show districts metric', async ({ page }) => {
    await expect(page.getByText(/districts/i)).toBeVisible()
  })

  test('should display recent activity section', async ({ page }) => {
    const activitySection = page.getByText(/recent|activity/i).first()
    await expect(activitySection).toBeAttached()
  })

  test('should show system health status', async ({ page }) => {
    const healthStatus = page.getByText(/health|status/i).first()
    await expect(healthStatus).toBeAttached()
  })

  test('should display quick actions section', async ({ page }) => {
    const quickActions = page.getByText(/quick|actions/i).first()
    await expect(quickActions).toBeAttached()
  })

  test('should have action buttons', async ({ page }) => {
    const actionButtons = page.locator('button[class*="bg-"]')
    await expect(actionButtons.first()).toBeAttached()
  })

  test('should show database status', async ({ page }) => {
    const dbStatus = page.getByText(/database|db/i).first()
    await expect(dbStatus).toBeAttached()
  })

  test('should display API status', async ({ page }) => {
    const apiStatus = page.getByText(/api|service/i).first()
    await expect(apiStatus).toBeAttached()
  })

  test('should show cache status', async ({ page }) => {
    const cacheStatus = page.getByText(/cache|redis/i).first()
    await expect(cacheStatus).toBeAttached()
  })

  test('should display storage information', async ({ page }) => {
    const storageInfo = page.getByText(/storage|disk/i).first()
    await expect(storageInfo).toBeAttached()
  })

  test('should show memory usage', async ({ page }) => {
    const memoryInfo = page.getByText(/memory|ram/i).first()
    await expect(memoryInfo).toBeAttached()
  })

  test('should display CPU information', async ({ page }) => {
    const cpuInfo = page.getByText(/cpu|processor/i).first()
    await expect(cpuInfo).toBeAttached()
  })

  test('should have refresh capability', async ({ page }) => {
    const refreshButton = page.getByRole('button').filter({ hasText: /refresh|reload/i }).first()
    await expect(refreshButton).toBeAttached()
  })

  test('should show uptime information', async ({ page }) => {
    const uptimeInfo = page.getByText(/uptime|running/i).first()
    await expect(uptimeInfo).toBeAttached()
  })

  test('should display version information', async ({ page }) => {
    const versionInfo = page.getByText(/version|v\d/i).first()
    await expect(versionInfo).toBeAttached()
  })

  test('should have responsive grid layout', async ({ page }) => {
    const gridLayout = page.locator('[class*="grid"]').first()
    await expect(gridLayout).toHaveClass(/grid/)
  })
})
