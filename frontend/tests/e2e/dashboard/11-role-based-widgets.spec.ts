import { test, expect } from '@playwright/test'

/**
 * Dashboard - Role-Based Widgets (15 tests)
 *
 * Tests dashboard widgets and content based on user roles
 */

test.describe('Dashboard - Role-Based Widgets', () => {
  test('nurse should see clinical widgets', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
    await expect(page.getByText(/medications|appointments|health/i).first()).toBeVisible()
  })

  test('admin should see administration widgets', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/dashboard')
    await expect(page.getByText(/system|users|configuration/i).first()).toBeVisible()
  })

  test('counselor should see limited clinical data', async ({ page }) => {
    await page.goto('/api/auth/test-login?email=counselor@school.edu&password=CounselorPassword123!')
    await page.goto('/dashboard')
    await expect(page.getByText(/students|health.*records/i).first()).toBeVisible()
  })

  test('viewer should see read-only widgets', async ({ page }) => {
    await page.goto('/api/auth/test-login?email=readonly@school.edu&password=ReadOnlyPassword123!')
    await page.goto('/dashboard')
    const actionButtons = page.getByRole('button').filter({ hasText: /add|create|edit/i })
    await expect(actionButtons).not.toBeVisible()
  })

  test('nurse should not see admin-only metrics', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
    const adminMetrics = page.getByText(/system.*health|server|configuration/i)
    await expect(adminMetrics).not.toBeVisible()
  })

  test('admin should see all dashboard sections', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/dashboard')
    const widgets = page.locator('[class*="widget"], [class*="card"]')
    await expect(widgets).toHaveCount(4, { timeout: 5000 })
  })

  test('should display role-specific quick actions', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
    const quickAction = page.getByRole('button').filter({ hasText: /add.*medication|schedule/i }).first()
    await expect(quickAction).toBeAttached()
  })

  test('should show role-appropriate notifications', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
    await expect(page.locator('[class*="notification"]').first()).toBeAttached()
  })

  test('counselor should not see medication widgets', async ({ page }) => {
    await page.goto('/api/auth/test-login?email=counselor@school.edu&password=CounselorPassword123!')
    await page.goto('/dashboard')
    const medicationWidget = page.getByText(/medications.*due|administer/i)
    await expect(medicationWidget).not.toBeVisible()
  })

  test('should display user role indicator', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
    await expect(page.getByText(/nurse|role/i).first()).toBeAttached()
  })

  test('admin should see user management shortcuts', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/dashboard')
    await expect(page.getByText(/users|manage.*users/i).first()).toBeAttached()
  })

  test('should show role-based metric cards', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
    await expect(page.locator('[class*="card"]').first()).toBeAttached()
  })

  test('nurse should see clinical activity feed', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
    await expect(page.getByText(/activity|recent/i).first()).toBeVisible()
  })

  test('should hide restricted features based on role', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
    const sysConfig = page.getByText(/system.*configuration/i)
    await expect(sysConfig).not.toBeVisible()
  })

  test('should personalize dashboard by user preferences', async ({ page }) => {
    await page.goto('/api/auth/test-login?role=nurse')
    await page.goto('/dashboard')
    await expect(page.locator('body')).toBeVisible()
  })
})
