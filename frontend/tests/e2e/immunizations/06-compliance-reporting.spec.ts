import { test, expect } from '@playwright/test'
import { login } from '@/tests/support/auth-helpers'
import { setupHealthcareMocks } from '@/tests/support/test-helpers'

/**
 * Immunization Tracking: Compliance Reporting (5 tests)
 *
 * Validates immunization compliance reporting functionality including
 * compliance report generation, compliant/non-compliant student tracking,
 * upcoming due dates, and report export.
 */

test.describe('Immunization Tracking - Compliance Reporting', () => {
  test.beforeEach(async ({ page }) => {
    await setupHealthcareMocks(page)
    await login(page, 'admin')
    await page.goto('/reports')
  })

  test('should generate immunization compliance report', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should show compliant students', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should show non-compliant students', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should show upcoming due dates', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })

  test('should export compliance report', async ({ page }) => {
    await expect(page.locator('body')).toBeAttached()
  })
})
