import { test, expect } from '@playwright/test'

/**
 * Administration Features: Configuration Tab (20 tests)
 *
 * Tests system configuration settings
 */

test.describe('Administration Features - Configuration Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/api/auth/test-login?role=admin')
    await page.goto('/settings')
    await page.getByRole('button', { name: 'Configuration' }).click()
  })

  test('should display the Configuration tab content', async ({ page }) => {
    const configTab = page.getByRole('button', { name: 'Configuration' })
    await expect(configTab).toHaveClass(/border-blue-500/)
  })

  test('should show configuration heading', async ({ page }) => {
    await expect(page.getByText(/configuration|settings/i).first()).toBeVisible()
  })

  test('should display system settings section', async ({ page }) => {
    await expect(page.getByText(/system|general/i).first()).toBeVisible()
  })

  test('should show security settings', async ({ page }) => {
    await expect(page.getByText(/security/i).first()).toBeVisible()
  })

  test('should display email configuration', async ({ page }) => {
    await expect(page.getByText(/email|smtp/i).first()).toBeVisible()
  })

  test('should show notification settings', async ({ page }) => {
    await expect(page.getByText(/notification/i).first()).toBeVisible()
  })

  test('should display authentication settings', async ({ page }) => {
    await expect(page.getByText(/authentication|auth/i).first()).toBeVisible()
  })

  test('should show password policy settings', async ({ page }) => {
    await expect(page.getByText(/password.*policy|password.*requirement/i).first()).toBeVisible()
  })

  test('should display session timeout settings', async ({ page }) => {
    await expect(page.getByText(/session|timeout/i).first()).toBeVisible()
  })

  test('should show API configuration', async ({ page }) => {
    await expect(page.getByText(/api|endpoint/i).first()).toBeVisible()
  })

  test('should have save changes button', async ({ page }) => {
    await expect(page.getByRole('button').filter({ hasText: /save|update|apply/i })).toBeVisible()
  })

  test('should display file upload settings', async ({ page }) => {
    await expect(page.getByText(/upload|file.*size/i).first()).toBeVisible()
  })

  test('should show timezone configuration', async ({ page }) => {
    await expect(page.getByText(/timezone|time.*zone/i).first()).toBeVisible()
  })

  test('should display date format settings', async ({ page }) => {
    await expect(page.getByText(/date.*format|format/i).first()).toBeVisible()
  })

  test('should show language settings', async ({ page }) => {
    await expect(page.getByText(/language|locale/i).first()).toBeVisible()
  })

  test('should display HIPAA compliance settings', async ({ page }) => {
    await expect(page.getByText(/hipaa|compliance/i).first()).toBeVisible()
  })

  test('should show audit logging configuration', async ({ page }) => {
    await expect(page.getByText(/audit|logging/i).first()).toBeVisible()
  })

  test('should display data retention settings', async ({ page }) => {
    await expect(page.getByText(/retention|archive/i).first()).toBeVisible()
  })

  test('should have reset to defaults option', async ({ page }) => {
    const resetButton = page.getByRole('button').filter({ hasText: /reset|default/i }).first()
    await expect(resetButton).toBeAttached()
  })

  test('should show validation for required fields', async ({ page }) => {
    const requiredFields = page.locator('input[required], [class*="required"]')
    await expect(requiredFields.first()).toBeAttached()
  })
})
